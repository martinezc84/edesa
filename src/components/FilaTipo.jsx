//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label } from 'semantic-ui-react';

export default class FilaTipo extends Component {
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		return np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion;
	}
	render() {
		let { seleccionar, seleccionado, turno, view } = this.props;
		if (view)
			return (
				<Table.Row>	
				
					
					<Table.Cell>{turno.name}</Table.Cell>
					<Table.Cell>{turno.time}</Table.Cell>
					<Table.Cell>{turno.firma}</Table.Cell>
					<Table.Cell>{turno.geo}</Table.Cell>
					<Table.Cell>{turno.email_notification}</Table.Cell>
					<Table.Cell>{turno.sms_notification}</Table.Cell>
					
					
				</Table.Row>
			);
		else
			return (
				<Table.Row>
					<Table.Cell>{turno.name}</Table.Cell>
					<Table.Cell>{turno.time}</Table.Cell>
					<Table.Cell>{turno.firma}</Table.Cell>
					<Table.Cell>{turno.geo}</Table.Cell>
					<Table.Cell>{turno.email_notification}</Table.Cell>
					<Table.Cell>{turno.sms_notification}</Table.Cell>
				</Table.Row>
			);
	}
}
