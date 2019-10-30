//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon } from 'semantic-ui-react';

export default class FilaFactura extends Component {

	state ={
		startDate: new Date()
	}
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		
		if(np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion){
			return true;
		}else{
			return false;
		}
		
	}

	
	

	render() {
		let { ver, turno } = this.props;

		

			return (
				<Table.Row>
					<Table.Cell>{turno.i}</Table.Cell>
					<Table.Cell>{turno.ref}</Table.Cell>
					<Table.Cell>{turno.dte}</Table.Cell>
					<Table.Cell>{turno.o}</Table.Cell>
					<Table.Cell>{turno.ven}</Table.Cell>
					<Table.Cell><Button
								
								primary
								onClick={() => {
									ver(
										turno.id
									);
								}}								
								icon
								labelPosition="right"
							>
				<Icon name="eye" />
								Ver
							</Button></Table.Cell>
					
				
						
				</Table.Row>
			);
	}
}