'use strict';

import Config from '../constants/Config';
import {logRequestInfoToConsole, logResponseInfoToConsole, logResponseErrorToConsole, logFetchErrorToConsole} from './Utils';

export const initBackend = () => {
    const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/initSessionState`;
    const api = '/demo/redis/initSessionState';
    logRequestInfoToConsole(api, 'POST', endpoint, null);
    return fetch(endpoint, {
        method: 'POST'
    })
        .then((res) => {
            logResponseInfoToConsole(api, 'POST', res);
            if (res.ok) {
                return res.json();
            } else {
                logResponseErrorToConsole('Failed to initialize backend!', res);
                alert('Failed to create initialize backend!');
            }
        })
        .catch((err) => {
            logFetchErrorToConsole(err);
        });
};

export const pushS3Url = (uri) => {
    const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/imageUris?uri=${uri}`;
    const api = '/demo/redis/imageUris';
    logRequestInfoToConsole(api, 'POST', endpoint, null);
    return fetch(endpoint, {
        method: 'POST'
    })
        .then((res) => {
            logResponseInfoToConsole(api, 'POST', res);
            if (res.ok) {
                return res.json();
            } else {
                logResponseErrorToConsole('Failed to initialize backend!', res);
                alert('Failed to create initialize backend!');
            }
        })
        .catch((err) => {
            logFetchErrorToConsole(err);
        });
};
