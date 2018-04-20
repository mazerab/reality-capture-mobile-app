import React from 'react';
import { ActivityIndicator, Button, Image, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import Exponent, { Constants, FileSystem, ImagePicker, Notifications } from 'expo';

import Config from '../constants/Config';

import PushNotificationService from '../api/PushNotificationService';
import AWSS3Service from '../api/AWSS3Service';
import DataService from '../api/DataService';
import DerivativeService from '../api/DerivativeService';
import OAuthForge from '../api/OAuthForge';
import ProcessingScreen from './ProcessingScreen';
import Utils from '../api/Utils';
import RecapService from '../api/RecapService';
import RedisService from '../api/RedisService';

let mTabNav;

export default class ImageScreen extends React.Component {
  
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.uploading = false;
    this.state = {
        image: null,
        notification: {},
        processButtonDisabled: false,
        processing: false,
        processingDone: false,
        processingError: false,
        s3Svf: null,
        svfurn: null,
        urn: null, 
        viewFileButtonDisabled: true
    };
    this.OAuthForge = new OAuthForge();
  };

  componentDidMount() {
    console.info('INFO: Entering componentDidMount...');
    // Initialize AWS S3 service
    this.AWSS3Service = new AWSS3Service();
    // Login to Forge using 3-legged oAuth
    this.OAuthForge.initToken();
    // Initialize Redis database
    this.RedisService = new RedisService();
    this.RedisService.initBackend();
    // Push notifications
    this.PushNotificationService = new PushNotificationService();
    this.PushNotificationService.registerForPushNotificationsAsync();
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    // Reset ignore flags
    this.translateIgnore = false;
    this.manifestStatusIgnore = false;
  };

  componentWillUnmount() {
    console.info('INFO: Entering componentWillUnmount...');
    clearInterval(this.state.processPhotosceneIntervalId);
    clearInterval(this.state.processTranslationIntervalId);
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  render() {
    let { image } = this.state;
    mTabNav = this.props.navigation;
    return(
      <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <ProcessingScreen processing={this.state.processing} />
        <Text style={{ fontSize: 20, marginBottom: 20, textAlign: 'center', marginHorizontal: 15 }}>Reality Capture App</Text>
        <Button onPress={ this.pickImage } title='Pick an image from camera roll' />
        <Button onPress={ this.takePhoto } title='Take a photo' />
        {this.maybeRenderImage()}
        {this.maybeRenderImageUploadingOverlay()}
        <StatusBar barStyle="default" />
        <Button onPress={ this.processPhotoScene } title='Process Photoscene' disabled={this.state.processButtonDisabled} />
        <Button title='View File' disabled={this.state.viewFileButtonDisabled} onPress={ () => {
          mTabNav.navigate('ForgeViewer', { urn: this.state.urn, token: this.OAuthForge.getToken() })
        }} />
      </View>
    );
  };

  handleImagePicked = async pickerResult => {
    try {
      if (!this.uploading) {
        this.uploading = true;
      }
      if (!pickerResult.cancelled) {
        const imageInfo = await FileSystem.getInfoAsync(pickerResult.uri);
        const uploadResult = await this.AWSS3Service.uploadImageToS3BucketAsync(pickerResult.uri, imageInfo.size);
        console.info('INFO: Upload to S3 Response: ' + JSON.stringify(uploadResult));
        if(uploadResult) {
          this.setState({ image: uploadResult.s3Url });
          const pushS3UrlResult = await this.RedisService.pushS3Url(uploadResult.s3Url);
        }
      }
    } catch (e) {
      console.error({ e });
      alert('Upload failed, sorry!');
    } finally {
      this.setState({ uploading: false });
    }    
  };

  maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) { return; }
    return(
      <View style={{ marginTop: 30, width: 200, borderRadius: 3, elevation: 2, shadowColor: 'rgba(0,0,0,1)', shadowOpacity: 0.2, shadowOffset: { width: 4, height: 4 }, shadowRadius: 5 }}>
        <View style={{ borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden' }}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        </View>
        <Text onPress={this.share} style={{ paddingVertical: 10, paddingHorizontal: 10, fontSize: 10 }}>{image}</Text>
      </View>
    );
  };

  maybeRenderImageUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[ StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' } ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  pickImage = async() => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3]
    });
    this.handleImagePicked(pickerResult);
  };

  processPhotoScene = async() => {
    this.setState({ processing: true });
    this.RecapService = new RecapService();
    const processingStatusResult = await this.RecapService.setProcessingStatusInProgress();
    const processResult = await this.RecapService.processPhotoScene();
    if (processResult) {
      if (Config.IOS_SIMULATOR_TESTING) { // iOS simulator does not support push notifications
        const intervalId = setInterval(async () => {
          if(this.state.processing) {
            const progressResult = await this.RecapService.pollProcessingStatus();
            const photoscenelink = await this.RecapService.getPhotoSceneLink();
            if( progressResult.processingstatus === 'Completed' 
              && !this.translateIgnore 
              && photoscenelink.photoscenelink !== 'blank') {
              console.info('INFO: Processing is complete and photoscenelink is available to upload to Autodesk Cloud...')
              this.translateIgnore = true;
              this.setState({ processing: false });
              clearInterval(this.state.processPhotosceneIntervalId);
              this.uploadAndTranslate();
            }
          }
        }, 1000);
        this.setState({ processPhotosceneIntervalId: intervalId });
      } else { // Push notifications
        const intervalId = setInterval( async () => {
          if(this.state.processing) {
            if (this.state.notification.data && this.state.notification.data.Photoscene.scenelink !== 'blank') {
              this.setState({ processing: false });
              this.uploadAndTranslate();
            }
          }
        }, 1000);
      }
    }
  }

  share = () => {
    Share.share({ message: this.state.image, title: 'Check out this photo', url: this.state.image })
  };

  takePhoto = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3]
    });
    this.handleImagePicked(pickerResult);
  };

  uploadAndTranslate = async () => {
    this.setState({ processButtonDisabled: true });
    this.DataService = new DataService();
    this.DerivativeService = new DerivativeService();
    const uploadResult = await this.DataService.uploadAndTranslateProcessedData();
    if(uploadResult && uploadResult.statusCode === 200) { 
      let manifestStatus = 'notstarted';
      let urn;
      const intervalId = setInterval(async () => {
        if (this.state.viewFileButtonDisabled) {
          if (manifestStatus !== 'success') {
            const manifestResult = await this.DerivativeService.getManifest();
            if(manifestResult) {
              manifestStatus = manifestResult.status;
              urn = manifestResult.urn;
            }
          }
          if (manifestStatus === 'success' && !this.manifestStatusIgnore && urn) {
            this.manifestStatusIgnore = true;
            console.info('INFO: setting urn: ' + urn);
            const downloadURNsResult = await this.DerivativeService.downloadBubbles();
            console.info('downloadURNsResult = ' + JSON.stringify(downloadURNsResult));
            if(downloadURNsResult) {
              const s3Url = 'https://s3.amazonaws.com/reality-capture-images/result.obj.svf';
              this.setState({ urn: urn, s3Svf: s3Url, viewFileButtonDisabled: false });
              clearInterval(this.state.processTranslationIntervalId);
            }
          }
        }
      }, 1000);
      this.setState({ processTranslationIntervalId: intervalId });
    }
  };

}
