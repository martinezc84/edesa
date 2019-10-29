//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon } from 'semantic-ui-react';

export default class FilaFactura extends Component {

	state ={
		startDate: new Date()
	}
	// Evita re renders innecesarios al cambiar el state
		
	

	render() {
		let { orden, generar } = this.props;

		

			return (
				<Table.Row>
										
					<Table.Cell>{orden.zid}</Table.Cell>
					<Table.Cell>{orden.onum}</Table.Cell>
					<Table.Cell>{orden.cli}</Table.Cell>
					<Table.Cell>{orden.dte}</Table.Cell>
					<Table.Cell>{orden.ref}</Table.Cell>
					
					<Table.Cell><Button
								
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
								Generar
							</Button></Table.Cell>							
					
						
				</Table.Row>
			);
	}
}