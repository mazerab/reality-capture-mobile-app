'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class DerivativeService {

    constructor() {
        this.utils = new Utils();
    }

    async getDerivativeUrn() {
        const endpoint = Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT + '/derivative/getDerivativeUrn';
        const api = '/demo/derivative/getDerivativeUrn';
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
                    this.utils.logResponseErrorToConsole('Failed to get derivative urn!', res);
                    alert('Failed to get derivative urn!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async getManifest() {
        const endpoint = Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT + '/derivative/getManifest';
        const api = '/demo/derivative/getManifest';
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
                    this.utils.logResponseErrorToConsole('Failed to get manifest!', res);
                    alert('Failed to get manifest!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}
