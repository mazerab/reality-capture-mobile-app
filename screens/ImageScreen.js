import React from 'react';
import { ActivityIndicator, Alert, Button, Image, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Notifications } from 'expo';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { AWS_S3_BASE_ENDPOINT, AWS_S3_BUCKET, PUSH_NOTIFICATION_DISABLED } from '../constants/Config';

import {registerForPushNotificationsAsync} from '../api/PushNotificationService';
import {uploadImageToS3BucketAsync} from '../api/AWSS3Service';
import {uploadAndTranslateProcessedData} from '../api/DataService';
import {downloadBubbles, getManifest} from '../api/DerivativeService';
import ErrorBoundary from '../api/ErrorBoundary';
import OAuthForge from '../api/OAuthForge';
import ProcessingScreen from './ProcessingScreen';
import Utils from '../api/Utils';
import {deletePhotoScene, getPhotoSceneLink, pollProcessingStatus, processPhotoScene, setProcessingStatusInProgress} from '../api/RecapService';
import {initBackend, pushS3Url} from '../api/RedisService';

let mTabNav

export default class ImageScreen extends React.Component {
  
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.uploading = false;
    this.state = {
        fontLoaded: false,
        image: null,
        imageCount: 0,
        notification: {},
        processButtonDisabled: true,
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

  async componentDidMount() {
    console.info('INFO: Entering componentDidMount...');
    await Font.loadAsync({
      'artifakt-element-regular': require('../assets/fonts/ArtifaktElementOfc-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
    // Login to Forge using 3-legged oAuth
    this.OAuthForge.initToken();
    // Initialize Redis database
    initBackend();
    // Push notifications
    registerForPushNotificationsAsync();
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
  }

  render() {
    mTabNav = this.props.navigation;
    return(
      <View style={{ flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <ProcessingScreen processing={this.state.processing} />
        {
          this.state.fontLoaded ? (
            <Text style={{ fontFamily: 'artifakt-element-regular', fontSize: 20, marginBottom: 20, textAlign: 'center', marginHorizontal: 15 }}>Reality Capture App</Text>
          ) : null
        }
        <Button onPress={ this.pickImage } title='Pick an image from camera roll' />
        <Button onPress={ this.takePhoto } title='Take a photo' />
        {this.maybeRenderImage()}
        {this.maybeRenderImageUploadingOverlay()}
        <StatusBar barStyle="default" />
        <ErrorBoundary>
          <Button onPress={ this.processScene } title='Process Photoscene' disabled={this.state.processButtonDisabled} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Button title='View File' disabled={this.state.viewFileButtonDisabled} onPress={ () => {
            mTabNav.navigate('ForgeViewer', { urn: this.state.urn, token: this.OAuthForge.getToken() })
          }} />  
        </ErrorBoundary>
      </View>
    );
  };

  askPermissionsAsync = async () => {
    const existingCameraStatus = await Permissions.getAsync(Permissions.CAMERA);
    const existingCameraRollStatus = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    let finalCameraStatus = existingCameraStatus.status;
    let finalCameraRollStatus = existingCameraRollStatus.status;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if(existingCameraStatus.status !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      finalCameraStatus = status;
    }
    if(existingCameraRollStatus.status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      finalCameraRollStatus = status;
    }
    if(finalCameraStatus !== 'granted' || finalCameraRollStatus !== 'granted') {
      return;
    }
    return { 'cameraStatus': finalCameraStatus, 'cameraRollStatus': finalCameraRollStatus};
  }

  handleImagePicked = async pickerResult => {
    try {
      if (!this.uploading) {
        this.uploading = true;
      }
      if (!pickerResult.cancelled) {
        const imageInfo = await FileSystem.getInfoAsync(pickerResult.uri);
        console.info(`INFO: File to upload info: ${JSON.stringify(imageInfo)}`);
        const uploadResult = await uploadImageToS3BucketAsync(pickerResult.uri);
        console.info(`INFO: Upload to S3 Response: ${JSON.stringify(uploadResult)}`);
        if(uploadResult) {
          this.setState({ image: uploadResult.s3Url, imageCount: this.state.imageCount + 1  });
          if (this.state.imageCount > 2) { // can only send a photoscene for processing if more than 3 images have been added
            this.setState({ processButtonDisabled: false });
          }
          await pushS3Url(uploadResult.s3Url);
        }
      }
    } catch (e) {
      Alert.alert(
        'Application Error',
        'Upload failed, please try again!'
      );
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
  }

  maybeRenderImageUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[ StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' } ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  }

  pickImage = async() => {
    const permStatuses = await this.askPermissionsAsync();
    if(permStatuses) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });
      this.handleImagePicked(pickerResult);
    }
  };

  processScene = async() => {
    this.setState({ processing: true });
    try {
      await setProcessingStatusInProgress();
      const processResult = await processPhotoScene();
      if (processResult) {
        if (PUSH_NOTIFICATION_DISABLED) { // iOS simulator does not support push notifications
          const intervalId = setInterval(async () => {
            if(this.state.processing) {
              const progressResult = await pollProcessingStatus();
              const photoscenelink = await getPhotoSceneLink();
              if( progressResult.processingstatus === 'Completed' 
                && !this.translateIgnore 
                && photoscenelink.photoscenelink !== 'blank') {
                console.info('INFO: Processing is complete and photoscenelink is available to upload to Autodesk Cloud...');
                this.translateIgnore = true;
                this.setState({ processing: false });
                clearInterval(this.state.processPhotosceneIntervalId);
                this.uploadAndTranslate();
              }
            }
          }, 1000)
          this.setState({ processPhotosceneIntervalId: intervalId });
        } else { // Push notifications
          setInterval( async () => {
            if(this.state.processing) {
              if (this.state.notification.data && this.state.notification.data.Photoscene.scenelink !== 'blank') {
                this.setState({ processing: false });
                this.uploadAndTranslate();
              }
            }
          }, 1000)
        }
      }
    } catch (error) {
      Alert.alert(
        'Application Error',
        `${error.message}`,
        [
          { text: 'Cancel', onPress: () => { console.info('Cancel pressed, please restart the app!'); }, style: 'cancel' },
          { text: 'Retry', onPress: () => { 
              initBackend();
              // Reset ignore flags
              this.translateIgnore = false;
              this.manifestStatusIgnore = false;
            } 
          }
        ],
        { cancelable: false }
      );
    }
  }

  share = () => {
    Share.share({ message: this.state.image, title: 'Check out this photo', url: this.state.image });
  }

  takePhoto = async () => {
    const permStatuses = await this.askPermissionsAsync();
      if(permStatuses) {
      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 3]
      });
      this.handleImagePicked(pickerResult);
    }
  }

  uploadAndTranslate = async () => {
    this.setState({ processButtonDisabled: true });
    try {
      const uploadResult = await uploadAndTranslateProcessedData();
      console.info(`uploadResult: ${JSON.stringify(uploadResult)}`);
      if(uploadResult && uploadResult.statusCode === 200) { 
        let manifestStatus = 'notstarted';
        let urn;
        const intervalId = setInterval(async () => {
          if (this.state.viewFileButtonDisabled) {
            if (manifestStatus !== 'success') {
              const manifestResult = await getManifest();
              if(manifestResult) {
                manifestStatus = manifestResult.status;
                urn = manifestResult.urn;
              }
            }
            if (manifestStatus === 'success' && !this.manifestStatusIgnore && urn) {
              this.manifestStatusIgnore = true;
              console.info(`INFO: setting urn: ${urn}`);
              const downloadURNsResult = await downloadBubbles();
              console.info(`downloadURNsResult: ${JSON.stringify(downloadURNsResult)}`);
              if(downloadURNsResult) {
                const s3Url = `${AWS_S3_BASE_ENDPOINT}/${AWS_S3_BUCKET}/result.obj.svf`;
                this.setState({ urn: urn, s3Svf: s3Url, viewFileButtonDisabled: false });
                await deletePhotoScene();
                clearInterval(this.state.processTranslationIntervalId);
              }
            }
          }
        }, 1000)
        this.setState({ processTranslationIntervalId: intervalId });
      } 
    } catch(error) {
      Alert.alert(
        'Application Error',
        `${error.message}`,
        [
          { text: 'Cancel', onPress: () => { console.info('Cancel pressed, please restart the app!'); }, style: 'cancel' },
          { text: 'Retry', onPress: () => { 
              initBackend();
              // Reset ignore flags
              this.translateIgnore = false;
              this.manifestStatusIgnore = false;
            } 
          }
        ],
        { cancelable: false }
      );
    }
  }
}
