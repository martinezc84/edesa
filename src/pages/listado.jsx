//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';
import Mandados_user from '../components/Mandados_user';
import Firma from '../components/Firma';
import { navigate } from 'gatsby';
import Casos from '../components/Casos';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { isLoggedIn, logout , getUser} from "../utils/identity"


export default class Listado extends Component {
	state = {
		tiposDeTurno: [],
		Invoices: [],
		transfers: [],
		turnosNoVendidos: [],
		tipoSeleccionado: null,
		casos:[],
		seleccionadosNoVendidos: {},
		seleccionadosTransfersID:[],
		seleccionadosTransfers:[],
		seleccionadosVendidos: [],
		seleccionadosVendidosID: [],
		items: [],
		config:[],
		step: 3,
		general:null,
		cobros:null,
		entregas:null,
		servicios:null,
		geo:false
	};

	


	componentDidMount() {
		let user = isLoggedIn()
		
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

	Listado = () => {

		
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			empleados:this.state.empleados,
			
		};
		return <Mandados_user valores={this.state.Invoices} guardar={this.guardar} {...props} />;
	};

	firma = () => {
		let props = {
			
			cambiarStep:this.cambiaStep,
		};
		
		return <Firma id={this.state.idmandado} fecha={this.state.fechamandado} {...props} />;
	};

	casos = () => {
		let props = {
			valores:this.state.casos,
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			empleados:this.state.empleados
		};
		return <Casos guardar={this.guardar} {...props} />;
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
					
					<div className="pt-6">
						{step === 3 ? (
							<React.Fragment>{this.Listado()}</React.Fragment>
						)  : step === 5 ? (
							<React.Fragment>{this.firma()}</React.Fragment>
						) :null}
					</div>
				</RutaPrivada>
				
			</Layout>
		);
	}
}
