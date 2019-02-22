import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import { initAuth } from '../app/services/auth'
initAuth()

class IndexPage extends React.Component {
  state = { loading: false, msg: null }
  handleClick = e => {
    e.preventDefault()

    this.setState({ loading: true })
    fetch('/.netlify/functions/hello')
      .then(response => response.json())
      .then(json => this.setState({ loading: false, msg: json.msg }))
  }

  render() {
    const { loading, msg } = this.state
    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p>
              Bienvenido a las SS 2019
            </p>
            <ul>
              
              <li>
               Control de turnos
                <ul>
                  <li>
                    <Link to="/app/">
                      <b>Admin</b>
                    </Link>{' '}
                  </li>
                </ul>
              </li>
          
              
            </ul>
            <hr />
          
          </div>
        
        </div>
      </Layout>
    )
  }
}

export default IndexPage
