//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label } from 'semantic-ui-react';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';

export default class FilaTipo extends Component {


	state = {
		time: this.props.turno.time,
		firma: this.props.firma,
		geo: this.props.turno.geo,
		sms: this.props.turno.sms_notification,
		email: this.props.turno.email_notification,
		turno:this.props.turno
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
					<Table.Cell><Checkbox
							onChange={() => {
								this.sms(turno.id);
							}}
							toggle
							checked={(sms==1)}
						/></Table.Cell>
				</Table.Row>
			);
	}
}
