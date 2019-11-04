//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon } from 'semantic-ui-react';

export default class FilaFactura extends Component {

	state ={
		startDate: new Date()
	}
	// Evita re renders innecesarios al cambiar el state
		
	

	render() {
		let { orden, generar, ver } = this.props;

		
		//console.log(orden.empleado)
			return (
				<Table.Row>
										
					<Table.Cell>{orden.fecha}</Table.Cell>
					<Table.Cell>{orden.fechahora_entrega}</Table.Cell>
					<Table.Cell>{orden.descripcion}</Table.Cell>
					<Table.Cell>{orden.empleado}</Table.Cell>
					<Table.Cell>{orden.equipo}</Table.Cell>
					
					<Table.Cell>
					<Button
								
								primary
								onClick={() => {
									ver(
										orden.id
									);
								}}								
								icon
								labelPosition="right"
							>
				<Icon name="eye" />
								Ver
							</Button>
						<Button
								
								primary
								onClick={() => {
									generar(
										orden.id
									);
								}}								
								icon
								labelPosition="right"
							>
				<Icon name="cogs" />
								Iniciar
							</Button></Table.Cell>							
					
						
				</Table.Row>
			);
	}
}