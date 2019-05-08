//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label } from 'semantic-ui-react';

export default class FilaTipo extends Component {
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		return np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion;
	}
	render() {
		let { seleccionar, tiempo, firma, geo, email, sms, seleccionado, turno} = this.props;
			return (
				<Table.Row>
					<Table.Cell>{turno.name}</Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								seleccionar(turno.id);
							}}
							toggle
							checked={seleccionado}
						/></Table.Cell>
					<Table.Cell><label><Checkbox
							onChange={() => {
								tiempo(turno.id);
							}}
							toggle
							checked={seleccionado}
						/></label></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								firma(turno.id);
							}}
							toggle
							checked={seleccionado}
						/></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								geo(turno.id);
							}}
							toggle
							checked={seleccionado}
						/></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								email(turno.id);
							}}
							toggle
							checked={seleccionado}
						/></Table.Cell>
					<Table.Cell><Checkbox
							onChange={() => {
								sms(turno.id);
							}}
							toggle
							checked={seleccionado}
						/></Table.Cell>
				</Table.Row>
			);
	}
}
