'use strict';

module.exports = {

    FORGE_APP_ID: '<your Forge App ID goes here...>',

    AWS_RECAP_LAMBDA_BASE_ENDPOINT: 'https://<recap lambda>.execute-api.us-east-1.amazonaws.com/demo',
    AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT: 'https://<upload and translate lambda>.execute-api.us-east-1.amazonaws.com/demo',
    AWS_S3_BASE_ENDPOINT: 'https://s3.amazonaws.com',
    AWS_S3_BUCKET: '<name of your S3 bucket>',

    IOS_SIMULATOR_TESTING: true,

    // Do not edit below this line ...
    OAUTH_BASE_ENDPOINT: 'https://developer.api.autodesk.com/authentication/v1',

    scopePublic: ['viewables:read'],

    // Available formats are rcm (Autodesk Recap Photo Mesh), 
    // rcs (Autodesk Recap Point Cloud) and obj (Wavefront object).
    format: 'obj',
    sceneName: 'reality-capture-mobile-app',
    sceneType: 'object',
    sceneCallback: '/recap/scene/callback',

};
