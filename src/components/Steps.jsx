//@ts-check
import React, { Component } from 'react';
import { Step, Icon, Menu } from 'semantic-ui-react';

export default class Steps extends Component {
	state = {};

	render() {
		let { active: step, tipoSeleccionado: tipo } = this.props;
		let tipoSeleccionado = tipo !== null;

		return (
			<Menu>
				
				<Menu.Item
					active={step === 1}
					onClick={() => {
						this.props.cambiarStep(1);
					}}
					name={'Facturas no pagadas'}
					icon={'file alternate'}
					
				>
					
					
				</Menu.Item>
				<Menu.Item
					
					active={step === 2}
					onClick={() => {
						this.props.cambiarStep(2);
					}}
					name={'Entregas pendientes'}
					icon={"dolly flatbed"}
				>
				
					
				</Menu.Item>
				
				<Menu.Item
					
					active={step === 4}
					onClick={() => {
						this.props.cambiarStep(4);
					}}
					name={'Servicios'}
					icon={"cogs"}
				>
					
					
				</Menu.Item>
				<Menu.Item
					
					active={step === 3}
					onClick={() => {
						this.props.cambiarStep(3);
					}}
					name={'Mandados'}
					icon={"calendar alternate"}
				>
					
					
				</Menu.Item>
			</Menu>
		);
	}
}
