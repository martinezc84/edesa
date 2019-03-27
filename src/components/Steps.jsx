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
						<Step.Title>Tipo de turno</Step.Title>
						<Step.Description>Elige el tipo de turno</Step.Description>
					</Step.Content>
				</Step>
				<Step
					disabled={!tipoSeleccionado}
					active={step === 2}
					onClick={() => {
						this.props.cambiarStep(2);
					}}
				>
					<Icon name="copy" />
					<Step.Content>
						<Step.Title>Turnos vendidos</Step.Title>
						<Step.Description>Selecciona los turnos vendidos</Step.Description>
					</Step.Content>
				</Step>
				<Step
					disabled={!tipoSeleccionado}
					active={step === 3}
					onClick={() => {
						this.props.cambiarStep(3);
					}}
				>
					<Icon name="zip" />
					<Step.Content>
						<Step.Title>Turnos Disponibles</Step.Title>
						<Step.Description>Selecciona los turnos disponibles</Step.Description>
					</Step.Content>
				</Step>
				<Step
					disabled={!tipoSeleccionado}
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
