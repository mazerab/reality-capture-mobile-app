'use strict';

import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';

import Config from '../constants/Config';

export default class OAuthForge {

    constructor() {
        AsyncStorage.getItem('accessToken').then( (res) => { this.token = res; });
    }

    initToken() {
        this.login().then( (result) => {
            this.token = (result && result.type == 'success') ? result.params.access_token : "";
            AsyncStorage.setItem('@accessToken', this.token);
            console.info('INFO: Login: accessToken: ' + this.token);
            this.setBackendToken(this.token);
        });
        return this.token;
    }

    getToken() {
        if (this.token === null || this.token === undefined) {
            return;
        }
        return this.token;
    }

    login() {
        if (this.token === undefined || this.token === null) {
            const redirectUrl = AuthSession.getRedirectUrl();
            console.info('Copy this redirect url to the Forge app callback: ' + redirectUrl);
            let req = {
                authUrl: Config.OAUTH_BASE_ENDPOINT + '/authorize?response_type=token&client_id=' + Config.FORGE_APP_ID + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&scope=' + Config.scopePublic.join('%20')
            };
            return AuthSession.startAsync(req);
        }
    }

    logout() {
        this.token = null;
        return AsyncStorage.removeItem('@accessToken');
    }

    setBackendToken(accessToken) {
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/oauth/setToken';
        let requestBody = { accessToken: accessToken };
        console.info('INFO: POST /demo/oauth/setToken: Request: ' + JSON.stringify(requestBody));
        return fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json '},
            body: JSON.stringify(requestBody)
        })
            .then((res) => {
                if (res.ok) {
                    console.info('INFO: POST /demo/oauth/setToken: Response: ' + JSON.stringify(res));
                    return res.json();
                } else {
                    console.error('Failed to set token in backend!');
                    console.error('ERROR: ' + JSON.stringify(res));
                    alert('Failed to set token in backend!');
                }
            })
            .catch((err) => {
                console.error('ERROR: Request failed ', err);
            });
    }

}


