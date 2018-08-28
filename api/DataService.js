'use strict'

import Config from '../constants/Config'
import {logRequestInfoToConsole, logResponseInfoToConsole} from './Utils'

export const uploadAndTranslateProcessedData = () => {
  const endpoint = `${Config.AWS_UPLOAD_TRANSLATE_LAMBDA_BASE_ENDPOINT}/data/uploadAndTranslate`
  const api = '/demo/data/uploadAndTranslate'
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
        throw new Error('Failed to translate Photoscene geometry!')
      }
    })
}
