'use strict';

import React from 'react';

import Config from '../constants/Config';
import Utils from './Utils';

export default class DerivativeService extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
    }

    async downloadBubbles() {
        const endpoint = Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT + '/derivative/downloadBubbles';
        const api = '/demo/derivative/downloadBubbles';
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
                    this.utils.logResponseErrorToConsole('Failed to download bubbles!' + JSON.stringify(res));
                    alert('Failed to download bubbles!');
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
