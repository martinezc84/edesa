//@ts-check
import React, { Component } from 'react';
import { Table, Radio } from 'semantic-ui-react';

export default class FilaNoVendidos extends Component {
	// Evita re renders innecesarios al actualizar el state
	shouldComponentUpdate(np) {
		return np.seleccionado !== this.props.seleccionado;
	}
	render() {
		let { seleccionar, seleccionado, turno, disabled, view } = this.props;
		if (view)
			return (
				<Table.Row>
					<Table.Cell>{turno.item_code}</Table.Cell>
					<Table.Cell>{turno.item_name}</Table.Cell>
					<Table.Cell>{turno.stock_available}</Table.Cell>
				</Table.Row>
			);
		else
			return (
				<Table.Row>
					<Table.Cell>
						<Radio
							disabled={disabled}
							name="radioGroup"
							value={turno.item_id}
							checked={seleccionado}
							onChange={(e, item) => {
								seleccionar(e, item, turno);
							}}
						/>
					</Table.Cell>

					<Table.Cell>{turno.item_code}</Table.Cell>
					<Table.Cell>{turno.item_name}</Table.Cell>
					<Table.Cell>{turno.stock_available}</Table.Cell>
				</Table.Row>
			);
	}
}
