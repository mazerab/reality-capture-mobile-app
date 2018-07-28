'use strict'

import Config from '../constants/Config'
import {logRequestInfoToConsole, logResponseInfoToConsole, logFetchErrorToConsole} from './Utils'

export const downloadBubbles = () => {
  const endpoint = `${Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT}/derivative/downloadBubbles`
  const api = '/demo/derivative/downloadBubbles'
  logRequestInfoToConsole(api, 'GET', endpoint, null)
  return fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'GET', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to download bubbles!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}

export const getManifest = () => {
  const endpoint = `${Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT}/derivative/getManifest`
  const api = '/demo/derivative/getManifest'
  logRequestInfoToConsole(api, 'GET', endpoint, null)
  return fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'GET', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to get manifest!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}
