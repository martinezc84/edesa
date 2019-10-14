//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon } from 'semantic-ui-react';

export default class FilaFormula extends Component {

	state ={
		startDate: new Date()
	}
	

	render() {
		let {  Formula, editar, ver } = this.props;
	
			return (
				<Table.Row>
					
					<Table.Cell>{Formula.nombre}</Table.Cell>
					
					<Table.Cell>
					
					<Button
								
									primary
									onClick={() => {
										editar(
											Formula.id
										);
									}}								
									icon
									labelPosition="left"
								>
					<Icon name="pencil alternate" />
									Editar
								</Button>
								<Button
								
								primary
								onClick={() => {
									ver(
										Formula.id
									);
								}}								
								icon
								labelPosition="left"
							>
				<Icon name="eye" />
								Ver
							</Button>
					
					</Table.Cell>
				</Table.Row>
			)
		
	}
}