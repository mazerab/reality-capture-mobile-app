'use strict';

import Config from '../constants/Config';

export default class Utils {

    logRequestInfoToConsole(endpoint, httpMethod, url, body) {
        if(body) {
            console.info('INFO: ' + httpMethod + ' ' + endpoint + ': Request: ' + url + '     : Payload: ' + JSON.stringify(body));
        } else {
            console.info('INFO: ' + httpMethod + ' ' + endpoint + ': Request: ' + url);
        }  
    }

    logResponseInfoToConsole(endpoint, httpMethod, response) {
        if(response) {
            console.info('INFO: ' + httpMethod + ' ' + endpoint + ': Response: ' + JSON.stringify(response));
        } else {
            console.info('INFO: ' + httpMethod + ' ' + endpoint + ': Response: null');
        }  
    }

    logResponseErrorToConsole(errMessage, response) {
        if(errMessage && response) {
            console.error('ERROR: ' + errMessage + '       ' + JSON.stringify(response));
        } else {
            console.error('ERROR: No error message returned!');
        }
    }

    logFetchErrorToConsole(error) {
        if(error) {
            console.error('ERROR: Fetch failed with error: ' + error.message);
        } else {
            console.error('ERROR: Fetch failed with unexpected error!');
        }
    }

}
