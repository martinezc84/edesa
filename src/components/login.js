import React from "react"
import { navigate } from "gatsby"
import { handleLogin, isLoggedIn } from "../services/auth"
import App from "./App";

import netlifyIdentity from 'netlify-identity-widget';

// Make netlifyIdentity accessible in the browser console
window.netlifyIdentity = netlifyIdentity;

netlifyIdentity.init();

ReactDOM.render(<App />, document.getElementById('application'));

class Login extends React.Component {
  state = {
    username: ``,
    password: ``,
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    handleLogin(this.state)
  }

  render() {
    if (isLoggedIn()) {
      navigate(`/app/profile`)
    }

    return (
      <>
        <h1>Log in</h1>
       
      </>
    )
  }
}

export default Login