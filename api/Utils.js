'use strict'

export const logRequestInfoToConsole = (endpoint, httpMethod, url, body) => {
  if (body) {
    console.info(`INFO: ${httpMethod} ${endpoint} : Request: ${url} : Payload: ${JSON.stringify(body)}`)
  } else {
    console.info(`INFO: ${httpMethod} ${endpoint} : Request: ${url}`)
  }
}

export const logResponseInfoToConsole = (endpoint, httpMethod, response) => {
  if (response) {
    console.info(`INFO: ${httpMethod} ${endpoint}: Response: ${JSON.stringify(response)}`)
  } else {
    console.info(`INFO: ${httpMethod} ${endpoint}: Response: none`)
  }
}

export const logFetchErrorToConsole = (error) => {
  if (error) {
    console.error(`ERROR: Fetch failed with error: ${error}`)
  } else {
    console.error('ERROR: Fetch failed with unexpected error!')
  }
}
