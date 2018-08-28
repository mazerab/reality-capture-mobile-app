'use strict'

import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      info: '',
      error: ''
    }
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true, info, error })
    console.error(`ERROR: ${error}`)
    console.error(`ERROR: Details: ${JSON.stringify(info)}`)
  }

  render () {
    if (this.state.hasError) {
      return <h1>Something bad happened.</h1>
    }
    return this.props.children
  }
}
