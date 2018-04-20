'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class RecapService {

    constructor() {
        this.utils = new Utils();
    }

    async getPhotoSceneLink() {
        const endpoint = Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT + '/redis/photoscenelink';
        const api = '/demo/redis/photoscenelink';
        this.utils.logRequestInfoToConsole(api, 'GET', endpoint, null);
        return fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to get photoscenelink!', res);
                    alert('Failed to get photoscenelink!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async pollProcessingStatus() {
        const endpoint = Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT + '/redis/processingstatus';
        const api = '/demo/redis/processingstatus';
        this.utils.logRequestInfoToConsole(api, 'GET', endpoint, null);
        return fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to set processing status!', res);
                    alert('Failed to set processing status!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async processPhotoScene() {
        const endpoint = Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT + '/recap/processPhotoScene';
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
                    this.utils.logResponseErrorToConsole('Failed to process Photoscene!', res);
                    alert('Failed to process Photoscene!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async setProcessingStatusInProgress() {
        const endpoint = Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT + '/redis/processingstatus?processingstatus=InProgress';
        const api = '/demo/redis/processingstatus';
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
                    this.utils.logResponseErrorToConsole('Failed to set processing status!', res);
                    alert('Failed to set processing status!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}
