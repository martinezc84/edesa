//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import {  Dropdown, TextArea } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import Inputdate from './Inputdate_edit';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';



export default class Secuencia extends Component {
	state = {
        
        nombre:null,
		prefijo:null,
		siguiente:null,
		
		id:null,
		
				
    };
    
    shouldComponentUpdate(np) {
		
		return true;
		
	}

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	// Método para seleccionar o des seleccionar checkbox de turnos
	 

	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 console.log(dte)

	};

	componentDidMount() {	
		this.setState({
			userdata: getUser()
		});
			let { guardar,    id  } = this.props;
				
					Axios.get(FUNCIONES.secuencia+'?id='+id)
					.then(({ data }) => {
					console.log(data)
						this.setState({
							nombre:data.nombre,
							prefijo:data.prefijo,
							siguiente:data.siguiente,
						});
					})
					.catch((error) => {
						console.error(error);
					});
					
				
}
 
        
        handleInputChange = event => {
            const target = event.target
            const value = target.value
            const name = target.name
        
            this.setState({
              [name]: value,
            })
          }
        
          handleSubmit = event => {
            event.preventDefault()
          
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					

				

	render() {

        
		let {
           	nombre, prefijo, siguiente
			
		} = this.state;

			
			return (
                <div >
                <form onSubmit={this.handleSubmit}>
								
                {nombre!==null ? (
                <label>
                  Nombre
                  <input
                    type="text"
                    name="nombre"
                    value={this.state.nombre}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
								</label>):('')}
								{prefijo!==null ? (
                <label>
				Prefijo
				<input
				  type="text"
				  name="prefijo"
				  value={this.state.prefijo}
				  onChange={this.handleInputChange}
				  className="inputform"
				/>
							  </label>):('')}

				{siguiente!==null ? (
                <label>
				Siguiente
				<input
				  type="text"
				  name="siguiente"
				  value={this.state.siguiente}
				  onChange={this.handleInputChange}
				  className="inputform"
				/>
							  </label>):('')}
								
                <button type="submit" className="submitform">Guardar</button>
              </form>
							
              </div>
				
			)
	
}
}
