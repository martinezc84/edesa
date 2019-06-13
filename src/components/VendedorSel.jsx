//@ts-check
import React, { Component } from 'react';
import {  Button, Icon, Dropdown } from 'semantic-ui-react';

export default class VendedorSel extends Component {

	borrar  = async ()=>{
		await this.props.limpiavendedor()
		this.props.recargar()	
	}

	render() {
		let  {empleadosel, empleados, seleccionaVendedor, limpiavendedor, recargar} = this.props

		

		return (
			<div className="drop">
		<Dropdown
						compact
						value={empleadosel}
						onChange={seleccionaVendedor}
						placeholder="Selecciona Mensajero"
						fluid
						search
						selection
						options={empleados}
					/>
				
					
			<Button
		
			primary
			onClick={() => {
				recargar()					
			}}								
			icon
			className="searchbutton"
		>
		<Icon name="redo" />
			Cambiar
		</Button>
		<Button
		
			primary
			onClick={() => {
				this.borrar()				
			}}								
			icon
			className="searchbuttonu"
		>
		<Icon name="users" />
			Todos
		</Button>
		</div>
		)
			
		
	}
}