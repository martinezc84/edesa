import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import SignaturePad from 'react-signature-pad-wrapper'
import netlifyIdentity from 'netlify-identity-widget';
import { Button, Icon } from 'semantic-ui-react';
import {  ENDPOINTS } from '../utils/utils';
import Axios from 'axios';
import { MostrarMensaje } from './Mensajes';



export default class Firma extends Component  {
	state = {
		turnosVendidos: [],
		seleccionados: [],
		seleccionadosId: [],
		vendedoresseleccionados:[],
		vendedoresseleccionadosId:[],
		paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 40,
		offset: 0,
		step: 40,
		buscar:"",
		column: null,
		direction: null,
		empleados:[],
		startDate: new Date(),
		fechas:[],
		date: new Date(),
		visible:false,
		trimmedDataURL: null,
		visiblem:false
	
	};
	
	sigPad = {}
  clear = () => {
	
    this.sigPad.clear()
  }

  onConfirm = ()=>{
	this.setState({				
		visiblem:false
	});
	this.props.cambiarStep(3);
}
  save = async () => {
   
	  
	  console.log('Guardando');
	  let postdata = {string:this.sigPad.toDataURL('image/png'), id:this.props.id}
	  
	  
	 await Axios.post(ENDPOINTS.saveimage, JSON.stringify( postdata))
					.then(({ data }) => {
						console.log(data)
						
					
					})
					.catch((error) => {
						console.error(error);
					});

	await	Axios.post(ENDPOINTS.editarmandados,'{"realizado":"1","id":'+this.props.id+', "fecha":"'+this.props.fecha[0].fecha+'"}')
			.then(({ data }) => {
				//console.log(data)
				
				
			})
			.catch((error) => {
				console.error(error);
			});
			//this.props.cambiarStep(3);
			this.setState({				
				visiblem:true
			});

  }
	componentDidMount() {
		let user = netlifyIdentity.currentUser();
		let { id } = this.props;
		console.log(id)
	}

	render() {
	return (
		
		<React.Fragment>	
		<SignaturePad 
		options={{minWidth: 5, maxWidth: 10, penColor: 'rgb(66, 133, 244)', backgroundColor:'#CACACA' } }
		ref={(ref) => { this.sigPad = ref }} />
				
		<Button
									size="massive"
									primary
									onClick={
										
										this.save
									}								
									icon
									labelPosition="left"
								>
								<Icon name="folder" />
									Guardar
								</Button>
								<Button
									size="massive"
									primary
									onClick={
										
										this.clear
									}								
									icon
									labelPosition="left"
								>
								<Icon name="file" />
									Limpiar
								</Button>
					<MostrarMensaje titulo={'Firma Guardada con exito'} mensajes={'Firma'}  visible={this.state.visiblem} onConfirm={this.onConfirm} />

								</React.Fragment>
	);
			}
};
