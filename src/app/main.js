import React from 'react'
import { getUser } from './services/auth'
const axios = require('axios');
class Main extends React.Component {
  state = { loading: false, json: null }

  componentDidMount (){
    console.log(process.env.ZAURU_TOKEN);
    const fetchTurnos =  () =>  axios({method:'GET',url:process.env.GATSBY_ZAURU_TURNOS, headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': process.env.GATSBY_ZAURU_USER,
      'X-User-Token': process.env.GATSBY_ZAURU_TOKEN,
    }});

    const turnos =   fetchTurnos();

    console.log(turnos);
  
  }
  render() {
    const { loading, json } = this.state
    const user = getUser()
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
