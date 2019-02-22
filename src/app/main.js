import React from 'react'
import { getUser } from './services/auth'
import { turnos } from './services/fetch'
const axios = require('axios');


class Main extends React.Component {
  state = { loading: false, json: null }

  

  render() {
    const { loading, json } = this.state
    const user = getUser()
    const turnosdata = turnos()

    console.log(turnosdata);
    return (
      <>
        <h1>Your Main App</h1>
        <ul>
          <li>API: {user.api && user.api.apiURL}</li>
          <li>ID: {user.id}</li>
        </ul>
        <hr />

        <button onClick={this.handleClick}>
          {loading ? 'Loading...' : 'Call Lambda Function'}
        </button>
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </>
    )
  }
}

export default Main
