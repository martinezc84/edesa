//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label, Input } from 'semantic-ui-react';

export default class FilaVendidos extends Component {
	// Evita re renders innecesarios al cambiar el state
	shouldComponentUpdate(np) {
		return np.seleccionado !== this.props.seleccionado || np.turno.statusOperacion;
	}

	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
	
		this.setState({
		  [name]: value,
		})
	  }
	render() {

		
		let { seleccionar, seleccionado, turno, view } = this.props;
	
			return (
				<Table.Row>
					<Table.Cell>
						Producto
					</Table.Cell>
					<Table.Cell>
					<input
                    type="text"
                    name="tel"
                    value={this.state.tel}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
					</Table.Cell>
					<Table.Cell>
						Cantidad
					</Table.Cell>
					
				</Table.Row>
			);
	}
}
