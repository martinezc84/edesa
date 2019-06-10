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
import PurchaseOrders from '../components/PurchaseOrders';
import PurchaseDetail from '../components/PurchaseDetail';
import Login from '../components/Login';
import General from '../components/NewGeneral';
import { navigate } from 'gatsby';
import Casos from '../components/Casos';
import { Container } from 'semantic-ui-react';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { isLoggedIn, logout , getUser} from "../utils/identity"


export default class App extends Component {
	state = {
		tiposDeTurno: [],
		Invoices: [],
		Purchases:[],
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
		geo:false,
		islogin:false
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

						//console.log(data[x].type)
						if (data[x].type=='1'){
							//console.log('General');
							conf = data[x]
							//console.log(conf);
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
							//console.log(conf);
							this.setState({
								entregas: conf
							});
						}
						if (data[x].type=='4'){
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
		let user = isLoggedIn();
		this.cargarconfig()

		this.setState({
			islogin: user
		});

		let userdata={group_id:0};
		
		if(user!=false){
			userdata = getUser()
		
		}
		

		if (userdata.group_id > 2) {
			navigate('/listado');
			return;
		}
	}

	guardar = (state, valores) => {
		this.setState({
			[state]: valores
		});
	};

	setlogin = () => {
		this.setState({
			islogin: true
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
		console.log(this.state.config)
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			config:this.state.config,
			general:this.state.general,
			cobros:this.state.cobros,
			entregas:this.state.entregas,
			servicios:this.state.servicios,
			geo:this.state.geo
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

	purchases = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			empleados:this.state.empleados
		};
		return <PurchaseOrders valores={this.state.Purchases} guardar={this.guardar} {...props} />;
	};

	purchasedetail = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			cambiarStep:this.cambiaStep,
			empleados:this.state.empleados
		};
		return <PurchaseDetail valores={this.state.Purchases} guardar={this.guardar} {...props} />;
	};

	general = () => {
		let props = {
			
			empleados:this.state.empleados,
			cambiarStep:this.cambiaStep,
		};
		return <General valores={this.state.Invoices} guardar={this.guardar} {...props} />;
	};

	firma = () => {
		let props = {
			
			cambiarStep:this.cambiaStep,
		};
		
		return <Firma id={this.state.idmandado} fecha={this.state.fechamandado} {...props} />;
	};

	login = () => {
		let props = {
			
			cambiarStep:this.cambiaStep,
			setlogin:this.setlogin
		};
		
		return <Login {...props} />;
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
		
		let { step, tipoSeleccionado, general, cobros, servicios, entregas, islogin } = this.state;
		let stepsProps = {
			active: step,
			cambiarStep: this.cambiaStep,
			tipoSeleccionado: tipoSeleccionado,
			entregas:entregas,
			servicios:servicios,
			general:general,
			cobros:cobros
			
		};

		if(!islogin){
			step=99
		}
		
		//console.log(general);
		
		return (
			<Layout>
				<RutaPrivada>
					{islogin ? (<Container>
						<Steps {...stepsProps} />
					</Container>):('')}
					
					<div className="pt-6">
						{step === 1 ? (
							<React.Fragment>{this.tiposMandados()}</React.Fragment>
						) : step === 2 ? (
							<React.Fragment>{this.transferencias()}</React.Fragment>
						) : step === 3 ? (
							<React.Fragment>{this.turnosVendidos()}</React.Fragment>
						) : step === 4 ? (
							<React.Fragment>{this.casos()}</React.Fragment>
						)  : step === 5 ? (
							<React.Fragment>{this.firma()}</React.Fragment>
						) : step === 6 ? (
							<React.Fragment>{this.general()}</React.Fragment>
						) : step === 7 ? (
							<React.Fragment>{this.purchases()}</React.Fragment>
						) : step === 8 ? (
							<React.Fragment>{this.purchasedetail()}</React.Fragment>
						): step === 99 ? (
							<React.Fragment>{this.login()}</React.Fragment>
						) : null}
					</div>
				</RutaPrivada>
				
			</Layout>
		);
	}
}
