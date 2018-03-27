'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class RecapService {

    constructor(accessToken) {
        this.token = accessToken;
        this.utils = new Utils();
    }

    async addImageAsync(s3Url) {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/addImage';
        const requestBody = { file: s3Url };
        const api = '/demo/recap/addImage';
        this.utils.logRequestInfoToConsole(api, 'POST', endpoint, requestBody);
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to add image!', res);
                    alert('Failed to add image!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async checkDownloadSizeAsync() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/checkOutputFileExists';
        const api = '/demo/recap/checkOutputFileExists';
        this.utils.logRequestInfoToConsole(api, 'GET', endpoint, null);
        return fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'GET', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to check download file size!', res);
                    alert('Failed to check download file size!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async createPhotoSceneAsync() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/createPhotoScene';
        let requestBody = {
            scenename: Config.sceneName,
            scenetype: Config.sceneType,
            format: Config.format,
            callback: Config.AWS_LAMBDA_BASE_ENDPOINT + Config.sceneCallback     
        };
        const api = '/demo/recap/createPhotoScene';
        this.utils.logRequestInfoToConsole(api, 'POST', endpoint, requestBody);
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to create photoscene!', res);
                    alert('Failed to create photoscene!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async downloadProcessedDataAsync() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/downloadProcessedData?format=' + Config.format;
        const api = '/demo/recap/downloadProcessedData';
        this.utils.logRequestInfoToConsole(api, 'GET', endpoint, null);
        return fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then( (res) => {
                this.utils.logResponseInfoToConsole(api, 'GET', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to download processed data!', res);
                    alert('Failed to download processed data!');
                }
            }).catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async pollPhotosceneProcessingProgress() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/scene/processingStatus';
        const api = '/demo/recap/scene/processingStatus';
        this.utils.logRequestInfoToConsole(api, 'GET', endpoint, null);
        return fetch(endpoint, {
            method: 'GET',
        })
            .then( (res) => {
                this.utils.logResponseInfoToConsole(api, 'GET', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to retrieve processing progress!', res);
                    alert('Failed to retrieve processing progress!');
                }
            }).catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async processPhotoSceneAsync() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/processPhotoScene';
        const api = '/demo/recap/processPhotoScene';
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
                    this.utils.logResponseErrorToConsole('Failed to process photoscene!', res);
                    alert('Failed to process photoscene!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async processPhotoSceneResetAsync() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/recap/scene/processingReset';
        const api = '/demo/recap/scene/processingReset';
        this.utils.logRequestInfoToConsole(api, 'GET', endpoint, null);
        return fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then( (res) => {
                this.utils.logResponseInfoToConsole(api, 'GET', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to reset processing progress!', res);
                    alert('Failed to reset processing progress!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}
