//@ts-check
import React, { Component } from 'react';
import { Step, Icon } from 'semantic-ui-react';

export default class StepsC extends Component {
	state = {};

	render() {
		let { active: step, tipoSeleccionado: tipo } = this.props;
		let tipoSeleccionado = tipo !== null;

		return (
			<Step.Group fluid>
				<Step
					active={step === 1}
					onClick={() => {
						this.props.cambiarStep(1);
					}}
				>
					<Icon name="map signs" />
					<Step.Content>
						<Step.Title>Configuraciones</Step.Title>
						<Step.Description>Cambie las opciones por categoría</Step.Description>
					</Step.Content>
				</Step>
				
			</Step.Group>
		);
	}
}
