'use strict'

import Config from '../constants/Config'
import {logRequestInfoToConsole, logResponseInfoToConsole, logFetchErrorToConsole} from './Utils'

export const deletePhotoScene = () => {
  const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/recap/deletePhotoScene`
  const api = '/demo/recap/deletePhotoScene'
  logRequestInfoToConsole(api, 'DELETE', endpoint, null)
  return fetch(endpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'DELETE', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to delete photoscene!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}

export const getPhotoSceneLink = () => {
  const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/photoscenelink`
  const api = '/demo/redis/photoscenelink'
  logRequestInfoToConsole(api, 'GET', endpoint, null)
  return fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'POST', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to get photoscenelink!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}

export const pollProcessingStatus = () => {
  const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/processingstatus`
  const api = '/demo/redis/processingstatus'
  logRequestInfoToConsole(api, 'GET', endpoint, null)
  return fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'POST', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to get processing status!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}

export const processPhotoScene = () => {
  const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/recap/processPhotoScene`
  const api = '/demo/recap/processPhotoScene'
  logRequestInfoToConsole(api, 'POST', endpoint, null)
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'POST', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to process Photoscene!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}

export const setProcessingStatusInProgress = () => {
  const endpoint = `${Config.AWS_RECAP_LAMBDA_BASE_ENDPOINT}/redis/processingstatus?processingstatus=InProgress`
  const api = '/demo/redis/processingstatus'
  logRequestInfoToConsole(api, 'POST', endpoint, null)
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      logResponseInfoToConsole(api, 'POST', res)
      if (res.ok) {
        return res.json()
      } else {
        throw Error('Failed to set processing status!')
      }
    })
    .catch((err) => {
      logFetchErrorToConsole(err)
    })
}
