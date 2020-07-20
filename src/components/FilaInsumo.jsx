//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon, Dropdown, Checkbox } from 'semantic-ui-react';

export default class FilaInsumo extends Component {

	state ={
		
	}
	componentDidMount() {
		let {  id, guardarcantidad, guardarconvertion,  } = this.props
		this.setState({guardarcantidad:guardarcantidad, guardarconvertion:guardarconvertion, id:id})
	}


	shouldComponentUpdate(np) {
		//return true;
		if(np.unico !== this.props.unico || np.item_id !== this.props.item_id || np.cantidad !== this.props.cantidad || np.items !== this.props.items|| np.convertion !== this.props.convertion  ){
			return true;
		}else{
			return false;
		}
		
	}

	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		this.state.guardarcantidad(this.state.id,value)
		this.setState({
		  [name]: value,
		})
	  }

	  handleInputConvertion = event => {
		const target = event.target
		const value = target.value
		const name = target.name		
		console.log(value)
		this.props.guardarconvertion(this.state.id,value)
		this.setState({
		  [name]: value,
		})
	  }
	

	render() {
		let {  items, item_id, selectitem, id, unico, esunico, cantidad, view, buscaritem, convertion } = this.props;
		let insumo=null
		
			item_id = parseInt(item_id)
			if(view){
		 	insumo = buscaritem(item_id, items)
		}
	//console.log(item_id)
	if (view) 
			return (
				<Table.Row>
					
					<Table.Cell>
						{insumo!==null?( insumo
					):('')}
					</Table.Cell>
					<Table.Cell>
					{cantidad!==null?(
					cantidad):('')}
					
					
					</Table.Cell>
					<Table.Cell>
					
					<label>
                   
				  {unico ? 'si': 'no'}
				</label>
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
				id={"insumo_"+id}
				options={items}
				/>):('')}
			</Table.Cell>
			
			<Table.Cell>
			{cantidad!==null?(
			<input
			type="text"
			name="cantidad"
			value={cantidad}
			onChange={this.handleInputChange}
			className="inputform"
			width="20px"
		  />):('')}
		  {cantidad!==null?(
			<label>Tasa de conversión<input
			type="text"
			name="convertion"
			value={convertion}
			onChange={this.handleInputConvertion}
			className="inputform"
			
			width="20px"
			
			
		  /></label>):('')}
			
			
			</Table.Cell>
			<Table.Cell>
			
			<label>
		  Es único?
		  <Checkbox
					onChange={esunico}
					toggle
					checked={unico}
					id={"check_"+id}
				/>
		</label>
			</Table.Cell>
		</Table.Row>
	)
	
		
	}
}