//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label, Dropdown } from 'semantic-ui-react';
import Inputdate from './Inputdate';

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
		let { seleccionar, seleccionado, empleadosel, seleccionaVendedor, turno, view, empleados, handleDate } = this.props;

		
		
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
					<Table.Cell>{turno.zid}</Table.Cell>
					<Table.Cell>{turno.id}</Table.Cell>
					<Table.Cell>{turno.ref}</Table.Cell>
					<Table.Cell>{turno.pd}</Table.Cell>
					<Table.Cell>{turno.dt}</Table.Cell>
					<Table.Cell>{turno.af}</Table.Cell>
					<Table.Cell>{turno.at}</Table.Cell>
					<Table.Cell>{turno.m}</Table.Cell>
					<Table.Cell><div>
        <Inputdate
		  disable={seleccionado}
		  guardar={this.props.guardar}
		  guardar_id={turno.id}
        />
      </div></Table.Cell>
					
					<Table.Cell><Dropdown
							value={empleadosel}
							onChange={seleccionaVendedor}
							placeholder="Selecciona Mensajero"
							fluid
							id={turno.id}
							search
							selection
							options={empleados}
						/></Table.Cell>
						
				</Table.Row>
			);
	}
}