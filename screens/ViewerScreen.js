import React from 'react';
import { Dimensions, StyleSheet, View, WebView } from 'react-native';

import {styles} from "./Styles";

export default class Viewer extends React.Component {  

  static navigationOptions = {
    title: 'Viewer',
  };

  constructor(props) {
    super(props);
  }

  // Handle Viewer Launch
  componentDidUpdate() {
    const {state} = this.props.navigation;
    if (state.params) { this.loadViewer(state.params.urn, state.params.token); }
  }

  loadViewer(urn, token) {
    var js = `initializeViewer("urn:${urn}","${token}")`;
    this.viewer.injectJavaScript(js);
  }

  render() {
    return (
      <View style={styles.container} >
        <WebView
          source={{ html: styles.viewerHTML }}
          style={styles.webview}
          javaScriptEnabled={true}
          scrollEnabled={false}
          ref = { webview => { this.viewer = webview; } }
        />
      </View>
    );
  }

}
