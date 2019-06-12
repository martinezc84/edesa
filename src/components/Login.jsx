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

  handleSubmit = event  => {
    this.setState({
        mensaje:""
    })
    event.preventDefault()

   handleLogin(this.state)
      
  }

  render() {
 
    let {mensaje} =  this.state

    let error = this.props.error;
    
    

    return (
      <>
        <h1>Log in</h1>
        {error ==1 ? (
        <h3 className={"msjerror"}>Error al ingresar usuario o contraseña</h3>):('')
        }
        <div >
        <form
          method="post"
          onSubmit={event => {
            this.handleSubmit(event)
            
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