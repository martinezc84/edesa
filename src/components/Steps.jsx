//@ts-check
import React, { Component } from 'react';
import { Step, Icon, Menu } from 'semantic-ui-react';

export default class Steps extends Component {
	state = {};
	
	render() {
		let { active: step, tipoSeleccionado: tipo, general, cobros, entregas, servicios} = this.props;
		let tipoSeleccionado = tipo !== null;
		//console.log(this.props)
		return (
			<Menu>
				{general != null?(
				<Menu.Item
					active={step === 6}
					onClick={() => {
						this.props.cambiarStep(6);
					}}
					name={'General'}
					icon={'file alternate'}
					
					
				></Menu.Item>):('')
				}
				{cobros != null?(
				<Menu.Item
					active={step === 1}
					onClick={() => {
						this.props.cambiarStep(1);
					}}
					name={'Facturas no pagadas'}
					icon={'file alternate'}
					
				>
					
					
				</Menu.Item>):('')
				}

				{entregas != null?(
				<Menu.Item
					
					active={step === 2}
					onClick={() => {
						this.props.cambiarStep(2);
					}}
					name={'Entregas pendientes'}
					icon={"dolly flatbed"}
				>
				
					
				</Menu.Item>):('')
				}
				{ servicios != null?(
				<Menu.Item
					
					active={step === 4}
					onClick={() => {
						this.props.cambiarStep(4);
					}}
					name={'Servicios'}
					icon={"cogs"}
				>
					
					
				</Menu.Item>):('')
				}
				<Menu.Item
					
					active={step === 3}
					onClick={() => {
						this.props.cambiarStep(3);
					}}
					name={'Tareas'}
					icon={"list ol"}
				>
					
					
				</Menu.Item>
			</Menu>
		);
	}
}
