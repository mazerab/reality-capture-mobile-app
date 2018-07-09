import React from 'react'
import {Dimensions, StyleSheet, View, WebView} from 'react-native'

import Config from '../constants/Config'

let width = Dimensions.get('window').width

class ForgeViewer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            htmlTemplate: ''
        }
    }

    componentDidMount() {
        const svfURL = `${Config.AWS_S3_BASE_ENDPOINT}/${Config.AWS_S3_BUCKET}/result.obj.svf`;
        const HTML = `
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <link rel="stylesheet" href="https://developer.api.autodesk.com/derivativeservice/v2/viewers/style.min.css?v=v2.17" type="text/css">
                <script src="https://developer.api.autodesk.com/derivativeservice/v2/viewers/three.min.js?v=v2.17"></script>
                <script src="https://developer.api.autodesk.com/derivativeservice/v2/viewers/viewer3D.js?v=v2.17"></script>
            </head>
            <body style="margin:0"><div id="forgeViewer"></div></body>
            <script>
                var viewer;
                var states = [];
                function onSuccess() {
                    viewer.setBackgroundColor(100,100,100,255,255,255);
                };
                function onError(viewerErrorCode, message) {
                    alert(message);
                }
                function initializeViewer() {
                    var viewerDiv = document.querySelector('#forgeViewer');
                    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, {});
                    var options = {
                        env: "Local",
                        useConsolidation: false,
                        useADP: false,
                    };
                    Autodesk.Viewing.Initializer(options, function() {
                        //var modelOptions = { sharedPropertyDbPath: doc.getPropertyDbPath() } ;
                        //var dbPropertiesPath = 'urn:adsk.viewing:fs.file:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cmVhbGl0eS1jYXB0dXJlLW91dHB1dC9yZXN1bHQub2Jq/output/properties.db';
                        viewer.start(\`${svfURL}\`, {}, onSuccess, onError);            
                    });
                };
                initializeViewer();
            </script>
        `;
        this.setState({ htmlTemplate: HTML});
    }

    render() {
        const HTML = this.state.htmlTemplate;
        return (
            <View style={styles.container}>
                <WebView
                    source={{ html: HTML }}
                    style={{ width: width }}
                    javaScriptEnabled={true}
                    scrollEnabled={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0ff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ForgeViewer;
