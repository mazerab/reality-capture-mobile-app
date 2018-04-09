'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class RedisService {

    constructor() {
        this.Utils = new Utils();
    }

    initBackend() {
        const endpoint = Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT + '/redis/initSessionState';
        const api = '/demo/redis/initSessionState';
        this.Utils.logRequestInfoToConsole(api, 'POST', endpoint, null);
        return fetch(endpoint, {
            method: 'POST'
        })
            .then((res) => {
                this.Utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.Utils.logResponseErrorToConsole('Failed to initialize backend!', res);
                    alert('Failed to create initialize backend!');
                }
            })
            .catch((err) => {
                this.Utils.logFetchErrorToConsole(err);
            });
    }

    pushS3Url(uri) {
        const endpoint = Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT + '/redis/imageUris?uri=' + uri;
        const api = '/demo/redis/imageUris';
        this.Utils.logRequestInfoToConsole(api, 'POST', endpoint, null);
        return fetch(endpoint, {
            method: 'POST'
        })
            .then((res) => {
                this.Utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.Utils.logResponseErrorToConsole('Failed to initialize backend!', res);
                    alert('Failed to create initialize backend!');
                }
            })
            .catch((err) => {
                this.Utils.logFetchErrorToConsole(err);
            });
    }
    
}
