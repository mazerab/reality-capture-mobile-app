'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class DerivativeService {

    constructor() {
        this.utils = new Utils();
    }

    async getManifest(urn) {
    	const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/derivative/getStatus?urn=' + urn;
    	const api = '/demo/derivative/getStatus';
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
                    this.utils.logResponseErrorToConsole('Failed to get translation status!', res);
                    alert('Failed to get translation status!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async translateSourceToSVF(objectId) {
    	const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/derivative/translateToSVF?objectid=' + objectId;
        const api = '/demo/derivative/translateToSVF';
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
                    this.utils.logResponseErrorToConsole('Failed to start SVF translation!', res);
                    alert('Failed to start SVF translation!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}