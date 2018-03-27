'use strict';

module.exports = {

    FORGE_APP_ID: 'KqsBumMwCGnpPwEQcdIxEh0sQumG4Gha',

    AWS_LAMBDA_BASE_ENDPOINT: 'https://l837xgneyd.execute-api.us-east-1.amazonaws.com/demo',
    AWS_S3_BASE_ENDPOINT: 'https://s3.console.aws.amazon.com/s3/buckets',
    AWS_S3_BUCKET: 'reality-capture-images',

    // Do not edit below this line ...
    OAUTH_BASE_ENDPOINT: 'https://developer.api.autodesk.com/authentication/v1',

    scopePublic: ['bucket:create','bucket:read','data:create','data:read','data:write','viewables:read'],

    // Available formats are rcm (Autodesk Recap Photo Mesh), 
    // rcs (Autodesk Recap Point Cloud) and obj (Wavefront object).
    format: 'obj',
    sceneName: 'reality-capture-mobile-app',
    sceneType: 'object',
    sceneCallback: '/recap/scene/callback',

    // Team hubs and projects settings
    hubName: 'Bastien Demo',
    projectName: 'Recap Upload Project'

};
