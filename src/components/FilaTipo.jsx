//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label } from 'semantic-ui-react';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';

export default class FilaTipo extends Component {


	state = {
		time: this.props.turno.time,
		firma: this.props.turno.firma,
		geo: this.props.turno.geo,
		sms: this.props.turno.sms_notification,
		email: this.props.turno.email_notification,
		turno:this.props.turno,
		numero:this.props.turno.phone,
		direccion:this.props.turno.email
	}
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		return true;
	}

	firma(id){
		let edit 
			edit=this.state.firma==1? 0 : 1 
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+id+',"firma":"'+edit+'"}')
					.then(({ data }) => {
						//console.log(data)
					
						
						this.setState({
							firma:edit
						});
					})
					.catch((error) => {
						console.error(error);
					});
	}

	tiempo(id){
		let edit 
			edit=this.state.time==1? 0 : 1 
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+id+',"time":"'+edit+'"}')
					.then(({ data }) => {
						//console.log(data)
					
						
						this.setState({
							time:edit
						});
					})
					.catch((error) => {
						console.error(error);
					});
	}

	geo(id){
		let edit 
			edit=this.state.geo==1? 0 : 1 
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+id+',"geo":"'+edit+'"}')
					.then(({ data }) => {
						//console.log(data)
					
						
						this.setState({
							geo:edit
						});
					})
					.catch((error) => {
						console.error(error);
					});
	}

	sms(id){
		let edit 
			edit=this.state.sms==1? 0 : 1 
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+id+',"sms_notification":"'+edit+'"}')
					.then(({ data }) => {
						//console.log(data)
					
						
						this.setState({
							sms:edit
						});
					})
					.catch((error) => {
						console.error(error);
					});
	}

	email(id){
		let edit 
			edit=this.state.email==1? 0 : 1 
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+id+',"email_notification":"'+edit+'"}')
					.then(({ data }) => {
						//console.log(data)
					
						
						this.setState({
							email:edit
						});
					})
					.catch((error) => {
						console.error(error);
					});
	}

	correo(){
	
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+this.state.turno.id+',"email":"'+this.state.direccion+'"}')
					.then(({ data }) => {
						
					})
					.catch((error) => {
						console.error(error);
					});
	}

	numero(){
		
		Axios.post(ENDPOINTS.editarTipoMandado,'{"id":'+this.state.turno.id+',"phone":"'+this.state.numero+'"}')
					.then(({ data }) => {
						//console.log(data)
					
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
	
	render() {
		let { seleccionar, time, firma, geo, email, sms, seleccionado, turno} = this.state;
			return (
				<Table.Row>
					<Table.Cell>{turno.name}</Table.Cell>
					
					<Table.Cell><label><Checkbox
							onChange={() => {
								this.tiempo(turno.id);
							}}
							toggle
							checked={(time==1)}
						/></label></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								this.firma(turno.id);
							}}
							toggle
							checked={(firma==1)}
						/></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								this.geo(turno.id);
							}}
							toggle
							checked={(geo==1)}
						/></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								this.email(turno.id);
							}}
							toggle
							checked={(email==1)}
						/></Table.Cell>
						<Table.Cell>
						<input
					autoFocus
                    type="text"
					name="direccion"
					
                    value={this.state.direccion}
					onChange={this.handleInputChange}				
					onKeyDown={(event)=>{
						console.log(event.keyCode);
						if(event.keyCode === 13){
							this.correo()
							//console.log(this.state.code);

						}

						if(event.keyCode === 9){
							this.correo()
							//console.log(this.state.code);

						}
						
					}}
                    className="inputform"
                  />
						</Table.Cell>
					<Table.Cell>
						
						<Checkbox
							onChange={() => {
								this.sms(turno.id);
							}}
							toggle
							checked={(sms==1)}
						/></Table.Cell>
						<Table.Cell>
						<input
					autoFocus
                    type="text"
					name="numero"
					
                    value={this.state.numero}
					onChange={this.handleInputChange}				
					onKeyDown={(event)=>{
						console.log(event.keyCode);
						if(event.keyCode === 13){
							this.numero()
							//console.log(this.state.code);

						}

						if(event.keyCode === 9){
							this.numero()
							//console.log(this.state.code);

						}
						
					}}
                    className="inputform"
                  />
						</Table.Cell>
				</Table.Row>
			);
	}
}
