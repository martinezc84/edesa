//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon, Dropdown, Checkbox } from 'semantic-ui-react';

export default class FilaPt extends Component {

	state ={
	}
	componentDidMount() {
		let {  linea, guardarcantidad } = this.props
		this.setState({guardarcantidad, linea})
	}

	shouldComponentUpdate(np) {
		
		if(np.unico !== this.props.unico || np.item_id !== this.props.item_id || np.cantidad !== this.props.cantidad){
			return true;
		}else{
			return false;
		}
		
	}

	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		this.state.guardarcantidad(this.state.linea,value)
		this.setState({
		  [name]: value,
		})
	  }
	

	render() {
		let {  items, item_id, selectitem, linea, cantidad, view, buscaritem } = this.props;
		item_id = parseInt(item_id)
		let insumo = null
		if(view){
			item_id = parseInt(item_id)
		 	insumo = buscaritem(item_id, items)
		}
		if (view)
		return (
			<Table.Row>
				
				<Table.Cell>
				{insumo!==null?(
				insumo):('')}
				</Table.Cell>
				
				<Table.Cell>
				{cantidad}
				
				
				</Table.Cell>
				<Table.Cell>
				
				
				</Table.Cell>
			</Table.Row>
		)
		else
			return (
				<Table.Row>
					
					<Table.Cell>
					{items!==null?(
					<Dropdown
				  		value={item_id}
						placeholder='Item'
						onChange={selectitem}
						search
						fluid
						selection
						id={"pt_"+linea}
						options={items}
					/>):('')}
					</Table.Cell>
					
					<Table.Cell>
					<input
                    type="text"
                    name="cantidad"
                    value={cantidad}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
					
					
					</Table.Cell>
					<Table.Cell>
					
					
					</Table.Cell>
				</Table.Row>
			)
		
	}
}