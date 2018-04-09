'use strict';

import PathParse from 'path-parse';

import Config from '../constants/Config';

export default class AWSS3Service {

    constructor() { }

    async uploadImageToS3BucketAsync(imageFileUri, fileSize) {
        const fileName = PathParse(imageFileUri).base;
        const s3Url = Config.AWS_S3_BASE_ENDPOINT + '/' + Config.AWS_S3_BUCKET + '/' + fileName;
        const photo = {
            'name': fileName,
            'type': 'image/jpeg',
            'uri': imageFileUri
        };
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', s3Url);
            xhr.setRequestHeader('Content-Type', 'image/jpeg');
            xhr.setRequestHeader('X-Amz-ACL', 'public-read');
            xhr.onload = function() {
                if (this.status >= 200 && this.status < 300) {
                    console.info('INFO: File Uploaded to S3 at: ' + s3Url);
                    resolve({ 's3Url': s3Url });
                } else {
                    console.error('ERROR: File upload failed. :( ' + fileName);
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
            xhr.send(photo);
        });
    }
    
}
