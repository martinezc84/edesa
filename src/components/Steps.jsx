//@ts-check
import React, { Component } from 'react';
import { Step, Icon } from 'semantic-ui-react';

export default class Steps extends Component {
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
						<Step.Title>Facturas no pagadas</Step.Title>
						<Step.Description>Elige el FACTURA</Step.Description>
					</Step.Content>
				</Step>
				<Step
					
					active={step === 2}
					onClick={() => {
						this.props.cambiarStep(2);
					}}
				>
					<Icon name="copy" />
					<Step.Content>
						<Step.Title>Entregas pendientes</Step.Title>
						<Step.Description>Selecciona la entrega pendiente</Step.Description>
					</Step.Content>
				</Step>
				<Step
					
					active={step === 3}
					onClick={() => {
						this.props.cambiarStep(3);
					}}
				>
					<Icon name="zip" />
					<Step.Content>
						<Step.Title>Mandados</Step.Title>
						<Step.Description></Step.Description>
					</Step.Content>
				</Step>
				<Step
					
					active={step === 4}
					onClick={() => {
						this.props.cambiarStep(4);
					}}
				>
					<Icon name="cogs" />
					<Step.Content>
						<Step.Title>Mover</Step.Title>
						<Step.Description>Ejecuta movimientos</Step.Description>
					</Step.Content>
				</Step>
			</Step.Group>
		);
	}
}
