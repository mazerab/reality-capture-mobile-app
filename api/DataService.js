'use strict';

import React from 'react';
import { Alert } from 'react-native';

import Config from '../constants/Config';
import RedisService from './RedisService';
import Utils from './Utils';

export default class DataService extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
    }

    async uploadAndTranslateProcessedData() {
        const endpoint = Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT + '/data/uploadAndTranslate';
        const api = '/demo/data/uploadAndTranslate';
        this.utils.logRequestInfoToConsole(api, 'POST', endpoint, null);
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    //this.utils.logResponseErrorToConsole('Failed to upload processed data to Autodesk Cloud!', res);
                    const message = JSON.parse(res._bodyText);
                    console.info('message: ' + JSON.stringify(message));
                    Alert.alert(
                        'Failed to upload processed data to Autodesk Cloud!',
                        JSON.stringify(message.ERROR),
                        [
                            {
                                text: 'Cancel', 
                                onPress: () => { console.info('INFO: Hit Cancel button!'); } 
                            },
                            {
                                text: 'Retry', 
                                onPress: () => { 
                                    this.RedisService = new RedisService();
                                    this.RedisService.initBackend();
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}
