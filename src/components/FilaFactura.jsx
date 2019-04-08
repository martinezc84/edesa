//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label, Dropdown } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class FilaFactura extends Component {
	state = {
		startDate: new Date()
		
	};

	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		
		if(np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion){
			return true;
		}else{
			return false;
		}
		
	}
	render() {
		let { seleccionar, seleccionado, empleadosel, seleccionaVendedor, turno, view, empleados, handleDate } = this.props;

		
		if (view)
			return (
				<Table.Row><Table.Cell>
					<Checkbox
							onChange={() => {
								seleccionar(turno);
							}}
							toggle
							checked={seleccionado}
						/>
					
					{/* <Table.Cell>{turno.order_number ? turno.order_number : ''}</Table.Cell> */}
					</Table.Cell>
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
					<Table.Cell><Dropdown
							value={empleadosel}
							onChange={seleccionaVendedor}
							placeholder="Selecciona Mensajero"
							fluid
							search
							selection
							options={empleados}
						/></Table.Cell>
					
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
					{/* <Table.Cell>{turno.order_number ? turno.order_number : ''}</Table.Cell> */}
					</Table.Cell>
					<Table.Cell>{turno.o}</Table.Cell>
					<Table.Cell>{turno.i}</Table.Cell>
					<Table.Cell>{turno.ref}</Table.Cell>
					<Table.Cell>{turno.dte}</Table.Cell>
					<Table.Cell>{turno.ag}</Table.Cell>
					<Table.Cell>{turno.cli}</Table.Cell>
					<Table.Cell>{turno.pt}</Table.Cell>
					<Table.Cell><div ><DatePicker
						selected={this.state.startDate}
						onChange={this.state.handleDate}
					/></div></Table.Cell>
					<Table.Cell>{turno.tot}</Table.Cell>
					<Table.Cell>{turno.due}</Table.Cell>
					<Table.Cell><Dropdown
							value={empleadosel}
							onChange={seleccionaVendedor}
							placeholder="Selecciona Mensajero"
							fluid
							iid={turno.iid}
							search
							selection
							options={empleados}
						/></Table.Cell>
						
				</Table.Row>
			);
	}
}