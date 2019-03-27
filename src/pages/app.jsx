//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';
import TiposDeTurno from '../components/tipoDeTurno';
import Steps from '../components/Steps';
import TurnosVendidos from '../components/TurnosVendidos';
import TurnosNoVendidos from '../components/TurnosNoVendidos';
import { navigate } from 'gatsby';
import Acciones from '../components/Acciones';
import { Container } from 'semantic-ui-react';

export default class App extends Component {
	state = {
		tiposDeTurno: [],
		turnosVendidos: [],
		turnosNoVendidos: [],
		tipoSeleccionado: null,

		seleccionadosNoVendidos: {},

		seleccionadosVendidos: [],
		seleccionadosVendidosID: [],

		step: 1
	};

	componentDidMount() {
		let user = netlifyIdentity.currentUser();
		if (user === null) {
			navigate('/');
		}
	}

	guardar = (state, valores) => {
		this.setState({
			[state]: valores
		});
	};

	volver = () => {
		this.setState({
			tiposDeTurno: [],
			turnosVendidos: [],
			turnosNoVendidos: [],
			tipoSeleccionado: null,

			seleccionadosNoVendidos: {},

			seleccionadosVendidos: [],
			seleccionadosVendidosID: [],

			step: 1,

			operado: false,
			errorVisible: false,
			mensajesError: []
		});
	};

	tiposDeTurno = () => {
		return (
			<TiposDeTurno
				tipoSeleccionado={this.state.tipoSeleccionado ? this.state.tipoSeleccionado.key : null}
				valores={this.state.tiposDeTurno}
				guardar={this.guardar}
			/>
		);
	};

	turnosVendidos = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado
		};
		return <TurnosVendidos valores={this.state.turnosVendidos} guardar={this.guardar} {...props} />;
	};

	turnosNoVendidos = () => {
		let props = {
			seleccionadosNoVendidos: this.state.seleccionadosNoVendidos,
			turnosSeleccionados: this.state.seleccionadosVendidosID.length,
			tipo: this.state.tipoSeleccionado
		};
		return <TurnosNoVendidos valores={this.state.turnosNoVendidos} guardar={this.guardar} {...props} />;
	};

	acciones = () => {
		let props = {
			seleccionadosNoVendidos: this.state.seleccionadosNoVendidos,
			seleccionadosVendidos: this.state.seleccionadosVendidos,
			tipoSeleccionado: this.state.tipoSeleccionado,
			volver: this.volver,
			operado: this.state.operado,
			errorVisible: this.state.errorVisible,
			mensajesError: this.state.mensajesError
		};
		return <Acciones {...props} />;
	};

	cambiaStep = (step) => {
		this.setState({
			step: step
		});
	};

	render() {
		let { step, tipoSeleccionado } = this.state;
		let stepsProps = {
			active: step,
			cambiarStep: this.cambiaStep,
			tipoSeleccionado: tipoSeleccionado
		};
		return (
			<Layout>
				<RutaPrivada>
					<Container>
						<Steps {...stepsProps} />
					</Container>
					<div className="pt-6">
						{step === 1 ? (
							<React.Fragment>{this.tiposDeTurno()}</React.Fragment>
						) : step === 2 ? (
							<React.Fragment>{this.turnosVendidos()}</React.Fragment>
						) : step === 3 ? (
							<React.Fragment>{this.turnosNoVendidos()}</React.Fragment>
						) : step === 4 ? (
							<React.Fragment>{this.acciones()}</React.Fragment>
						) : null}
					</div>
				</RutaPrivada>
			</Layout>
		);
	}
}
