import React from 'react';
import { ActivityIndicator, Button, Image, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import Exponent, { Constants, FileSystem, ImagePicker } from 'expo';

import Config from '../constants/Config';

import AWSS3Service from '../api/AWSS3Service';
import DataService from '../api/DataService';
import DerivativeService from '../api/DerivativeService';
import OAuthForge from '../api/OAuthForge';
import ProcessingScreen from './ProcessingScreen';
import RecapService from '../api/RecapService';

let mTabNav;

export default class ImageScreen extends React.Component {
  
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.uploading = false;
    this.state = { 
        fileSizeMatch: false,
        image: null,
        processButtonDisabled: false,
        processing: false,
        processingDone: false,
        processingError: false,
        scenelink: null, 
        viewFileButtonDisabled: true
    };
    this.OAuthForge = new OAuthForge();
  };

  componentDidMount() {
    // Initialize AWS S3 service
    this.AWSS3Service = new AWSS3Service();
    // Initialize Recap service
    this.RecapService = new RecapService();
    // Login to Forge using 3-legged oAuth
    this.OAuthForge.initToken();
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
          mTabNav.navigate('Viewer', { urn: this.scenelink, token: this.state.token })
        }} />
      </View>
    );
  };

  handleImagePicked = async pickerResult => {
    try {
      if (!this.uploading) {
        // Create photoscene
        this.uploading = true;
        this.RecapService = new RecapService(this.OAuthForge.getToken());
        await this.RecapService.processPhotoSceneResetAsync();
        await this.RecapService.createPhotoSceneAsync();
      }
      if (!pickerResult.cancelled) {
        const fileInfo = await Expo.FileSystem.getInfoAsync(pickerResult.uri);
        const signedUrl = await this.AWSS3Service.getPreSignedS3BucketUrlAsync(pickerResult.uri);
        this.AWSS3Service.uploadImageToS3BucketAsync(pickerResult.uri, fileInfo.size, signedUrl)
        .then((data) => {
          this.RecapService.addImageAsync(data);
          this.setState({ image: data });
        });
        
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
      const processResult = await this.RecapService.processPhotoSceneAsync();
      if (processResult.msg === 'No error') {
          this.setState({ processing: true });
          this.setState({ processButtonDisabled: true });
          const intervalId = setInterval( () => {
            if(this.state.processing) {
                this.RecapService.pollPhotosceneProcessingProgress()
                    .then( async (processingResult) => {
                      if (processingResult.photoSceneProcessing === 'Completed') {
                          this.setState({ processing: false });
                          const downloadResult = await this.RecapService.downloadProcessedDataAsync();
                          const intervalId2 = setInterval( async () => {
                            if(!this.state.fileSizeMatch) {
                              const checkDownloadSize = await this.RecapService.checkDownloadSizeAsync();
                              if (Number(checkDownloadSize.FileSize) === Number(downloadResult.Photoscene.filesize)) {
                                this.setState({ fileSizeMatch: true, processButtonDisabled: false });
                                this.uploadToBucket();
                              }
                            }
                          }, 1000);
                      }
                    });
            }
          }, 1000);
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

  translateToSVF = async (objectId) => {
      this.DerivativeService = new DerivativeService();
      const translateResult = await this.DerivativeService.translateSourceToSVF(objectId);
      console.info('translateResult = ' + translateResult);
      this.setState({ viewFileButtonDisabled: false});
  }
 
  uploadToBucket = async () => {
      let hubId, projectId, folderId, objectId, objectName;
      this.DataService = new DataService();
      const hubsResult = await this.DataService.getHubsAsync();
      for (let i in hubsResult.data) {
          if (hubsResult.data[i].attributes.name === Config.hubName) {
              hubId = hubsResult.data[i].id;
              break;
          }
      }
      const projectsResult = await this.DataService.getProjectsAsync(hubId);
      for (let j in projectsResult.data) {
          if (projectsResult.data[j].attributes.name === Config.projectName) {
              projectId = projectsResult.data[j].id;
              folderId = projectsResult.data[j].relationships.rootFolder.data.id;
              break;
          }
      }
      const storageResult = await this.DataService.createStorageLocationAsync(projectId, folderId);
      if(storageResult.data !== null || storageResult !== undefined) {
          objectId = storageResult.data.id;
          objectName = objectId.split('/').pop();
          const uploadResult = await this.DataService.uploadFileToStorageLocationAsync(objectName);
          if(uploadResult) {
              const versionResult = await this.DataService.createFirstVersionAsync(projectId, folderId, objectId);
              if(versionResult) {
                  this.translateToSVF(objectId);
              }
          }
      }
  }

}