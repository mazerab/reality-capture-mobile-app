import React from 'react';
import { Dimensions, StyleSheet, View, WebView } from 'react-native';


export default class ViewerScreen extends React.Component {  

  static navigationOptions = {
    title: 'Viewer',
  };

  constructor(props) {
    super(props);
    this.viewerHTML = `
      <head> 
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" /> 
        <meta name="apple-mobile-web-app-capable" content="yes" /> 
        <link rel="stylesheet" href="https://developer.api.autodesk.com/derivativeservice/v2/viewers/style.min.css?v=v2.17" type="text/css"> 
        <script src="https://developer.api.autodesk.com/derivativeservice/v2/viewers/three.min.js?v=v2.17"></script> 
        <script src="https://developer.api.autodesk.com/derivativeservice/v2/viewers/viewer3D.js?v=v2.17"></script> 
      </head> 
      <body style="margin:0"><div id="viewer"></div></body> 
      <script> 
        var viewer; 
        function initializeViewer(urn, token) { 
          var options = { 
            env: "AutodeskProduction", 
            useConsolidation: false, 
            useADP: false, 
            accessToken: token 
          }; 
          function onSuccess(doc) { 
            function onLoadModelSuccess() { 
              viewer.setBackgroundColor(40,40,30,255,255,255); 
              viewer.setLightPreset(17); 
            } 
            // A document contains references to 3D and 2D viewables. 
            var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type':'geometry'}, true); 
            var initialViewable = viewables[0]; 
            var svfUrl = doc.getViewablePath(initialViewable); 
            var modelOptions = { sharedPropertyDbPath: doc.getPropertyDbPath() }; 
            var viewerDiv = document.getElementById('viewer'); 
            viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv); 
            viewer.start(svfUrl, modelOptions, onLoadModelSuccess); 
          }; 
          Autodesk.Viewing.Initializer(options, function onInitialized(){ 
            Autodesk.Viewing.Document.load(urn, onSuccess); 
          }); 
        }; 
      </script> 
    `;
  }

  // Handle Viewer Launch
  componentDidUpdate() {
    const {state} = this.props.navigation;
    if (state.params) { this.loadViewer(state.params.urn, state.params.token); }
  }

  loadViewer(urn, token) {
    var js = `initializeViewer("urn:${urn}","${token}")`;
        this.Viewer.injectJavaScript(js);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }} >
        <WebView
          source={{ html: this.viewerHTML }}
          style={{ width: Dimensions.get('window').width }}
          javaScriptEnabled={ true }
          scrollEnabled={ false }
          ref = { webview => { this.Viewer = webview; } }
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
