import React from 'react'
import { getUser } from './services/auth'
const axios = require('axios');
class Main extends React.Component {
  state = { loading: false, json: null }

  componentDidMount (){
    
    const fetchTurnos =  () => axios({method:'GET',url:'https://zauru.herokuapp.com/sales/reports/sold_active_items_with_clients.json?point_of_sale_id=2505',headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': 'api@hermandadtrespotencias.com',
      'X-User-Token':'9exrqgKSyK4y8PHDrQRD',
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
