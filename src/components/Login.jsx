import React from "react"
import { navigate } from "gatsby"
import { handleLogin, isLoggedIn } from "../utils/identity"
import '../css/mandados.css';


class Login extends React.Component {
  state = {
    username: ``,
    password: ``,
    mensaje:''
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    this.setState({
        mensaje:""
    })
    event.preventDefault()
    if(!handleLogin(this.state)){
        this.setState({
            mensaje:"El usuario o contraseña no coinciden"
        })
    }
  }

  render() {
    if (isLoggedIn()) {
      navigate(`/app/`)
    }
    let {mensaje} =  this.state
    return (
      <>
        <h1>Log in</h1>
        <h3 className={"msjerror"}>{mensaje}</h3>
        <div >
        <form
          method="post"
          onSubmit={event => {
            this.handleSubmit(event)
            navigate(`/app/`)
          }}
        >
          <label>
            Username
            <input type="text" name="username" onChange={this.handleUpdate} className={"logininput"} />
          </label><br></br>
          <label>
            Password
            <input
              type="password"
              name="password"
              onChange={this.handleUpdate}
              className={"logininput"}
            />
          </label>
          <br></br>
          <input type="submit" value="Log In" className={"loginbutton"} />
        </form>
        </div>
      </>
    )
  }
}

export default Login