//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label } from 'semantic-ui-react';

export default class FilaVendidos extends Component {
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		return np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion;
	}
	render() {
		let { seleccionar, seleccionado, turno, view } = this.props;
		if (view)
			return (
				<Table.Row>
					<Table.Cell>{turno.invoice_id}</Table.Cell>
					{/* <Table.Cell>{turno.order_number ? turno.order_number : ''}</Table.Cell> */}
					<Table.Cell>{turno.invoice_date}</Table.Cell>
					<Table.Cell>{turno.item_code}</Table.Cell>
					<Table.Cell>{turno.item_name}</Table.Cell>
					<Table.Cell>{turno.quantity}</Table.Cell>
					<Table.Cell>{turno.unit_price}</Table.Cell>
					<Table.Cell>{turno.price}</Table.Cell>
					<Table.Cell>{turno.client_name}</Table.Cell>
					<Table.Cell>{turno.client_id}</Table.Cell>
					<Table.Cell>{turno.statusOperacion.icon()}</Table.Cell>
					<Table.Cell>
						<Label size="medium" color={turno.statusOperacion.c}>
							{turno.statusOperacion.mensaje}
						</Label>
					</Table.Cell>
				</Table.Row>
			);
		else
			return (
				<Table.Row>
					<Table.Cell>
						<Checkbox
							onChange={() => {
								seleccionar(turno);
							}}
							toggle
							checked={seleccionado}
						/>
					</Table.Cell>
					<Table.Cell>{turno.invoice_id}</Table.Cell>
					{/* <Table.Cell>{turno.order_number ? turno.order_number : ''}</Table.Cell> */}
					<Table.Cell>{turno.invoice_date}</Table.Cell>
					<Table.Cell>{turno.item_code}</Table.Cell>
					<Table.Cell>{turno.item_name}</Table.Cell>
					<Table.Cell>{turno.quantity}</Table.Cell>
					<Table.Cell>{turno.unit_price}</Table.Cell>
					<Table.Cell>{turno.price}</Table.Cell>
					<Table.Cell>{turno.client_name}</Table.Cell>
					<Table.Cell>{turno.client_id}</Table.Cell>
				</Table.Row>
			);
	}
}
