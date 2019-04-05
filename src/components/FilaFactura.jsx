//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label } from 'semantic-ui-react';

export default class FilaFactura extends Component {
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		return np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion;
	}
	render() {
		let { seleccionar, seleccionado, turno, view } = this.props;
		if (view)
			return (
				<Table.Row>
					<Checkbox
							onChange={() => {
								seleccionar(turno);
							}}
							toggle
							checked={seleccionado}
						/>
					
					{/* <Table.Cell>{turno.order_number ? turno.order_number : ''}</Table.Cell> */}
					
					<Table.Cell>{turno.o}</Table.Cell>
					<Table.Cell>{turno.i}</Table.Cell>
					<Table.Cell>{turno.ref}</Table.Cell>
					<Table.Cell>{turno.dte}</Table.Cell>
					<Table.Cell>{turno.ag}</Table.Cell>
					<Table.Cell>{turno.cli}</Table.Cell>
					<Table.Cell>{turno.pt}</Table.Cell>
					<Table.Cell>{turno.itms}</Table.Cell>
					<Table.Cell>{turno.tot}</Table.Cell>
					<Table.Cell>{turno.due}</Table.Cell>
					
				</Table.Row>
			);
		else
			return (
				<Table.Row>
					<Checkbox
							onChange={() => {
								seleccionar(turno);
							}}
							toggle
							checked={seleccionado}
						/>
					{/* <Table.Cell>{turno.order_number ? turno.order_number : ''}</Table.Cell> */}
					
					<Table.Cell>{turno.o}</Table.Cell>
					<Table.Cell>{turno.i}</Table.Cell>
					<Table.Cell>{turno.ref}</Table.Cell>
					<Table.Cell>{turno.dte}</Table.Cell>
					<Table.Cell>{turno.ag}</Table.Cell>
					<Table.Cell>{turno.cli}</Table.Cell>
					<Table.Cell>{turno.pt}</Table.Cell>
					<Table.Cell>{turno.itms}</Table.Cell>
					<Table.Cell>{turno.tot}</Table.Cell>
					<Table.Cell>{turno.due}</Table.Cell>
				</Table.Row>
			);
	}
}
