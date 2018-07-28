'use strict'

import React from 'react'
import { AsyncStorage } from 'react-native'
import { AuthSession } from 'expo'

import Config from '../constants/Config'

export default class OAuthForge extends React.Component {
  constructor (props) {
    super(props)
    AsyncStorage.getItem('accessToken').then((res) => { this.token = res })
  }

  initToken () {
    this.login().then((result) => {
      this.token = (result && result.type === 'success') ? result.params.access_token : ''
      AsyncStorage.setItem('@accessToken', this.token)
      console.info(`INFO: Login: AuthToken: ${this.token}`)
    })
    return this.token
  }

  getToken () {
    if (this.token === null || this.token === undefined) {
      return
    }
    return this.token
  }

  login () {
    if (this.token === undefined || this.token === null) {
      const redirectUrl = AuthSession.getRedirectUrl()
      console.info(`Copy this redirect url to the Forge app callback: ${redirectUrl}`)
      let req = {
        authUrl: `${Config.OAUTH_BASE_ENDPOINT}/authorize?response_type=token&client_id=${Config.FORGE_APP_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${Config.scopePublic.join('%20')}`
      }
      return AuthSession.startAsync(req)
    }
  }

  logout () {
    this.token = null
    return AsyncStorage.removeItem('@accessToken')
  }
}
