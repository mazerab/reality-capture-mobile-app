'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class DataService {

    constructor() {
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
                    this.utils.logResponseErrorToConsole('Failed to upload processed data to Autodesk Cloud!', res);
                    alert('Failed to upload processed data to Autodesk Cloud!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}
