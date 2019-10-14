//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon } from 'semantic-ui-react';

export default class FilaSecuencia extends Component {

	state ={
		startDate: new Date()
	}
	

	render() {
		let {  secuencia, editar } = this.props;
	
			return (
				<Table.Row>
					
					<Table.Cell>{secuencia.nombre}</Table.Cell>
					<Table.Cell>{secuencia.prefijo}</Table.Cell>
					<Table.Cell>{secuencia.subfijo}</Table.Cell>
					<Table.Cell>{secuencia.inicio}</Table.Cell>
					<Table.Cell>{secuencia.final}</Table.Cell>
					<Table.Cell>{secuencia.siguiente}</Table.Cell>
					<Table.Cell>
					
					<Button
								
									primary
									onClick={() => {
										editar(
											secuencia.id
										);
									}}								
									icon
									labelPosition="left"
								>
					<Icon name="pencil alternate" />
									Editar
								</Button>
					
					</Table.Cell>
				</Table.Row>
			)
		
	}
}