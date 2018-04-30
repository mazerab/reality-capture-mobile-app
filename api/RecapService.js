'use strict';

import Config from '../constants/Config';
import {logRequestInfoToConsole, logResponseInfoToConsole, logResponseErrorToConsole, logFetchErrorToConsole} from './Utils';

export const getPhotoSceneLink = () => {
    const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/photoscenelink`;
    const api = '/demo/redis/photoscenelink';
    logRequestInfoToConsole(api, 'GET', endpoint, null);
    return fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            logResponseInfoToConsole(api, 'POST', res);
            if (res.ok) {
                return res.json();
            } else {
                logResponseErrorToConsole('Failed to get photoscenelink!', res);
                alert('Failed to get photoscenelink!');
            }
        })
        .catch((err) => {
            logFetchErrorToConsole(err);
        });
};

export const pollProcessingStatus = () => {
    const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/processingstatus`;
    const api = '/demo/redis/processingstatus';
    logRequestInfoToConsole(api, 'GET', endpoint, null);
    return fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            logResponseInfoToConsole(api, 'POST', res);
            if (res.ok) {
                return res.json();
            } else {
                logResponseErrorToConsole('Failed to set processing status!', res);
                alert('Failed to set processing status!');
            }
        })
        .catch((err) => {
            logFetchErrorToConsole(err);
        });
};

export const processPhotoScene = () => {
    const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/recap/processPhotoScene`;
    const api = '/demo/recap/processPhotoScene';
    logRequestInfoToConsole(api, 'POST', endpoint, null);
    return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            logResponseInfoToConsole(api, 'POST', res);
            if (res.ok) {
                return res.json();
            } else {
                logResponseErrorToConsole('Failed to process Photoscene!', res);
                alert('Failed to process Photoscene!');
            }
        })
        .catch((err) => {
            logFetchErrorToConsole(err);
        });
};

export const setProcessingStatusInProgress = () => {
    const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/processingstatus?processingstatus=InProgress`;
    const api = '/demo/redis/processingstatus';
    logRequestInfoToConsole(api, 'POST', endpoint, null);
    return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            logResponseInfoToConsole(api, 'POST', res);
            if (res.ok) {
                return res.json();
            } else {
                logResponseErrorToConsole('Failed to set processing status!', res);
                alert('Failed to set processing status!');
            }
        })
        .catch((err) => {
            logFetchErrorToConsole(err);
        });
};
