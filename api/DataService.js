'use strict';

import Config from '../constants/Config';
import Utils from './Utils';

export default class DataService {

    constructor() {
        this.utils = new Utils();
    };

    async createStorageLocationAsync(projectId, folderId) {
    	const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/data/createStorageLocation' 
        + '?projectid=' + projectId + '&folderid=' + folderId;
        const api = '/demo/data/createStorageLocation';
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
                    this.utils.logResponseErrorToConsole('Failed to create storage location!', res);
                    alert('Failed to create storage location!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async createFirstVersionAsync(projectId, folderId, objectId) {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/data/createFirstVersion' 
        + '?projectid=' + projectId + '&folderid=' + folderId + '&objectid=' + objectId;
        const api = '/demo/data/createFirstVersion';
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
                    this.utils.logResponseErrorToConsole('Failed to create first version!', res);
                    alert('Failed to create first version!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async getHubsAsync() {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/data/getHubs';
        const api = '/demo/data/getHubs';
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
                    this.utils.logResponseErrorToConsole('Failed to get hubs!', res);
                    alert('Failed to get hubs!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async getProjectsAsync(hubId) {
    	const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/data/getProjects?hubid=' + hubId;
        const api = '/demo/data/getProjects';
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
                    this.utils.logResponseErrorToConsole('Failed to get projects!', res);
                    alert('Failed to get projects!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    async uploadFileToStorageLocationAsync(objectName) {
    	const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/data/uploadFileToStorageLocation?objectname=' + objectName;
        const api = '/demo/data/uploadFileToStorageLocation';
        this.utils.logRequestInfoToConsole(api, 'PUT', endpoint, null);
        return fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'PUT', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to upload file!', res);
                    alert('Failed to upload file!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

}