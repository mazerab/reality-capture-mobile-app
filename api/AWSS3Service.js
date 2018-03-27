'use strict';

import PathParse from 'path-parse';

import Config from '../constants/Config';
import Utils from './Utils';

export default class AWSS3Service {

    constructor() {
        this.utils = new Utils();
    }

    async getPreSignedS3BucketUrlAsync(imageFileUri) {
        // Get signed upload url from AWS. Use it to upload a jpg to an S3 bucket.
        const fileName = PathParse(imageFileUri).base;
        const endpoint = Config.AWS_LAMBDA_BASE_ENDPOINT + '/aws/s3/getImageDrop?filename=' + fileName;
        const api = '/demo/aws/s3/getImageDrop';
        this.utils.logRequestInfoToConsole(api, 'POST', endpoint, null);
        return fetch(endpoint, {
            method: 'GET'
        })
            .then((res) => {
                this.utils.logResponseInfoToConsole(api, 'POST', res);
                if (res.ok) {
                    return res.json();
                } else {
                    this.utils.logResponseErrorToConsole('Failed to create signed S3 url!', res);
                    alert('Failed to create signed S3 url!');
                }
            })
            .catch((err) => {
                this.utils.logFetchErrorToConsole(err);
            });
    }

    uploadImageToS3BucketAsync(imageFileUri, fileSize, signedUrl) {
        return new Promise(function(resolve, reject) {
            const fileName = PathParse(imageFileUri).base;
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', signedUrl.url);
            xhr.setRequestHeader('X-Amz-ACL', 'public-read');
            xhr.setRequestHeader('Content-Type', 'image/jpeg');
            xhr.onload = function() {
                if (this.status >= 200 && this.status < 300) {
                    console.info('INFO: File Uploaded to S3 at: ' + JSON.stringify(signedUrl.url));
                    resolve(signedUrl.url);
                } else {
                    console.error('ERROR: File upload failed. :( ');
                    reject({
                       status: this.status,
                       statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function() {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send({ uri: imageFileUri, type: 'image/jpeg', name: fileName });
        });

    }

}