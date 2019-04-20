//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';
import TiposDeTurno from '../components/tipoDeTurno';
import Steps from '../components/Steps';
import Firma from '../components/Firma';
import Mandados from '../components/Mandados';
import Transfers from '../components/Transfers';
import UnpaidInvoices from '../components/UnpaidInvoices';
import { navigate } from 'gatsby';
import Acciones from '../components/Acciones';
import { Container } from 'semantic-ui-react';


export default class App extends Component {
	state = {
		tiposDeTurno: [],
		Invoices: [],
		transfers: [],
		turnosNoVendidos: [],
		tipoSeleccionado: null,

		seleccionadosNoVendidos: {},
		seleccionadosTransfersID:[],
		seleccionadosTransfers:[],
		seleccionadosVendidos: [],
		seleccionadosVendidosID: [],
		items: [],
		config:[],
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
			Invoices: [],
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
				empleados={this.state.empleados ? this.state.empleados: null}
				cambiarStep= {this.cambiaStep}
			/>
		);
	};

	turnosVendidos = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			config:this.state.config
		};
		return <Mandados valores={this.state.items} guardar={this.guardar} {...props} />;
	};

	transferencias = () => {
		let props = {
			seleccionadosTransfersID: this.state.seleccionadosTransfersID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			empleados:this.state.empleados
		};
		return <Transfers valores={this.state.transfers} guardar={this.guardar} {...props} />;
	};

	tiposMandados = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			empleados:this.state.empleados
		};
		return <UnpaidInvoices valores={this.state.Invoices} guardar={this.guardar} {...props} />;
	};

	firma = () => {
		let props = {
			
			cambiarStep:this.cambiaStep,
		};
		
		return <Firma id={this.state.idmandado} fecha={this.state.fechamandado} {...props} />;
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

	onChangelist = (order) => {
		console.log(order);
	}

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
							<React.Fragment>{this.tiposMandados()}</React.Fragment>
						) : step === 2 ? (
							<React.Fragment>{this.transferencias()}</React.Fragment>
						) : step === 3 ? (
							<React.Fragment>{this.turnosVendidos()}</React.Fragment>
						) : step === 4 ? (
							<React.Fragment>{this.acciones()}</React.Fragment>
						)  : step === 5 ? (
							<React.Fragment>{this.firma()}</React.Fragment>
						) : null}
					</div>
				</RutaPrivada>
				
			</Layout>
		);
	}
}
