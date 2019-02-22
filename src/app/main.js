import React from 'react'
import { getUser } from './services/auth'

class Main extends React.Component {
  state = { loading: false, json: null }
  handleClick = e => {
    e.preventDefault()
    const user = getUser()
    this.setState({ loading: true })
    fetch('/.netlify/functions/auth-hello', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token.access_token,
      },
    })
      .then(response => response.json())
      .then(json => this.setState({ loading: false, json }))
  }
  componentDidMount(){
    fetch('https://zauru.herokuapp.com/settings/agencies.json', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-User-Email': 'api@hermandadtrespotencias.com',
        'X-User-Token':'9exrqgKSyK4y8PHDrQRD',       
      }, mode: 'no-cors' 
    })
      .then(response => response.json())
      .then(json => console.log(json))
  
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
