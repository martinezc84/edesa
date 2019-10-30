//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon, Dropdown, Checkbox } from 'semantic-ui-react';

export default class FilaDesperdicio extends Component {



	shouldComponentUpdate(np) {
		
		if(np.flexible !== this.props.flexible || np.item_id !== this.props.item_id || np.cantidad !== this.props.cantidad){
			return true;
		}else{
			return false;
		}
		
	}

	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarcantidad(this.props.id,value)
		this.setState({
		  [name]: value,
		})
	  }
	

	render() {
		let {  items, item_id, selectitem, id, cantidad, view, buscaritem, flexible, esflexible } = this.props;
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
				<label>
                   
				  {flexible=="1" ? 'si': 'no'}
				</label>
				
				</Table.Cell>
				
				<Table.Cell>
				{cantidad}
				
				
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
						id={"flexitem_"+id}
						options={items}
					/>):('')}
					</Table.Cell>
					<Table.Cell>
					<label>
						Flexible?
						<Checkbox
									onChange={esflexible}
									toggle
									checked={flexible}
									id={"flex_"+id}
								/>
						</label>
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
					
				</Table.Row>
			)
		
	}
}