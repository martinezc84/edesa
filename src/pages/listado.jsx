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
		step: 1,
		general:null,
		cobros:null,
		entregas:null,
		servicios:null,
		geo:false
	};

	cargarconfig = async () => {

		if (this.state.config.length == 0 ){
			await Axios.get(ENDPOINTS.tiposMandado+'1').then(({ data }) => {
				let conf=[]

				for (let x=0;x<data.length;x++){

						if(data[x].geo==1){
							this.setState({
								geo: true
							});
						}
						if (data[x].type=='1'){
							//console.log('General');
							conf = data[x]
							console.log(conf);
							this.setState({
								general: conf
							});
						}
						if (data[x].type=='2'){
							conf = data[x]
							this.setState({
								cobros: conf
							});
						}
						if (data[x].type=='3'){
							conf = data[x]
							console.log(conf);
							this.setState({
								entregas: conf
							});
						}
						if (data[x].type=='4	'){
							conf = data[x]
							this.setState({
								servicios: conf
							});
							break
						}
					}

					
				
				})
				.catch((error) => {
					console.error(error);
				});
		
			}

	}


	componentDidMount() {
		let user = isLoggedIn()
		this.cargarconfig()
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
			config:this.state.config,
			general:this.state.general,
			cobros:this.state.cobros,
			entregas:this.state.entregas,
			servicios:this.state.servicios,
			geo:this.state.geo
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
						{step === 1 ? (
							<React.Fragment>{this.Listado()}</React.Fragment>
						) : null}
					</div>
				</RutaPrivada>
				
			</Layout>
		);
	}
}
