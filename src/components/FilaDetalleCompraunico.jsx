//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label, Input } from 'semantic-ui-react';

export default class FilaDetalleCompraunico extends Component {

	state = {
		tel:null
	}


	handleInputChange = event => {
		
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarserie(this.props.id,value)
		this.setState({
		  [name]: value,
		})
	  }


	render() {

		
		let { id, serie, name, id_parent } = this.props;
		//console.log(key);
	
			return (
				<Table.Row>
					<Table.Cell>{name}</Table.Cell>
					<Table.Cell><input
					autoFocus
                    type="text"
					name="serie"				
                    value={serie}
					onChange={this.handleInputChange}				
					className="inputform"
					id={"serie_"+id_parent+"_"+id}
                  /></Table.Cell>
					<Table.Cell>1</Table.Cell>
					
					<Table.Cell>
					1
					</Table.Cell>
					<Table.Cell>
					
					</Table.Cell>
					
				</Table.Row>
			);
	}
}
