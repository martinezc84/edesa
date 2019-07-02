//@ts-check
import React, { Component } from 'react';

import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';
import Firma from '../components/Firma';
import Mandados from '../components/Mandados';
import Mandado from '../components/EditarMandado';
import MandadosU from '../components/Mandados_user';
import Transfers from '../components/Transfers';
import UnpaidInvoices from '../components/UnpaidInvoices';
import PurchaseOrders from '../components/PurchaseOrders';
import PurchaseDetail from '../components/PurchaseDetail';
import Config from '../components/Config';
import Login from '../components/Login';
import General from '../components/NewGeneral';
import { Router } from "@reach/router"
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
		compras:null,
		geo:false,
		islogin:false,
		userdata:{group_id:0},
		orden_compra:0
		};


	cargarconfig = async (id) => {

		if (this.state.config.length == 0 ){
			await Axios.get(ENDPOINTS.tiposMandado+id).then(({ data }) => {
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
							
						}
						if (data[x].type=='5'){
							conf = data[x]
							//conf.sub=0
							this.setState({
								compras: conf
							});
							
						}
						if (data[x].type=='6'){
							conf = data[x]
							//conf.sub=1
							this.setState({
								compras: conf
							});
							
						}
					}

					//console.log(this.state)
				
				})
				.catch((error) => {
					console.error(error);
				});
		
			}

	}

	componentDidMount() {
		let user = isLoggedIn();
		
	
		this.setState({
			islogin: user
		});

		let userdata={group_id:0}
		
		if(user==true){
			userdata = getUser()
			this.cargarconfig(userdata.store)
		
		}else{
			this.setState({
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
		compras:null,
		geo:false,
		islogin:false,
		userdata:{group_id:0},
		orden_compra:0
			})
		}

		this.setState({
			userdata: userdata
		});
		
		
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

	

	



	


	purchases = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			empleados:this.state.empleados
		};
		return <PurchaseOrders valores={this.state.Purchases} guardar={this.guardar} {...props} />;
	};

	purchasedetail = () => {
		let props = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			empleados:this.state.empleados,
			orden_compra:this.state.orden_compra
		};
		return <PurchaseDetail valores={this.state.Purchases} guardar={this.guardar} {...props} />;
	};

	







	onChangelist = (order) => {
		console.log(order);
	}

	render() {
		
		let { step, tipoSeleccionado, general, cobros, servicios, entregas, islogin, userdata, compras } = this.state;
		let stepsProps = {
			active: step,
			tipoSeleccionado: tipoSeleccionado,
			entregas:entregas,
			servicios:servicios,
			general:general,
			cobros:cobros,
			compras:compras,
			group_id:userdata.group_id
			
		};

		let unpaidprops = {empleados:this.state.empleados,
		valores:this.state.Invoices, guardar:this.guardar,seleccionadosVendidosID: this.state.seleccionadosVendidosID,
		tipo: this.state.tipoSeleccionado, cargarconfig:this.cargarconfig}	
		
		let propscasos = {
			valores:this.state.casos,
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			empleados:this.state.empleados
		};

		let propsgeneral = {
			
			empleados:this.state.empleados,
		};

		let propstrans = {
			seleccionadosTransfersID: this.state.seleccionadosTransfersID,
			tipo: this.state.tipoSeleccionado,
			empleados:this.state.empleados,
			valores:this.state.transfers
		};

		let propsmandadosu = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			config:this.state.config,
			general:this.state.general,
			cobros:this.state.cobros,
			entregas:this.state.entregas,
			servicios:this.state.servicios,
			geo:this.state.geo,
			empleados:this.state.empleados,
		};

		let propsmandados = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			config:this.state.config,
			general:this.state.general,
			cobros:this.state.cobros,
			entregas:this.state.entregas,
			servicios:this.state.servicios,
			compras:this.state.compras,
			geo:this.state.geo,
			empleados:this.state.empleados
		};

		let propspurchase = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			empleados:this.state.empleados,
			valores:this.state.Purchases
		};

		let propsdetail = {
			seleccionadosVendidosID: this.state.seleccionadosVendidosID,
			tipo: this.state.tipoSeleccionado,
			empleados:this.state.empleados,
			orden_compra:this.state.orden_compra,
			fechamandado:this.state.fechamandado,
			coordenadas:this.state.coordenadas,
			idmandado:this.state.idmandado
		};
		
		return (
			
			<Layout {...stepsProps}>
				<Router>
				<RutaPrivada  path="/app/general" component={General} {...propsgeneral} guardar={this.guardar}></RutaPrivada>
				<RutaPrivada  path="/app/cobros" component={UnpaidInvoices} {...unpaidprops} guardar={this.guardar}></RutaPrivada>
				<RutaPrivada  path="/app/transferencias" component={Transfers} {...propstrans} guardar={this.guardar}></RutaPrivada>
				<RutaPrivada path="/app/casos" component={Casos} {...propscasos}  guardar={this.guardar}></RutaPrivada>
				<RutaPrivada path="/app/compras" component={PurchaseOrders} {...propspurchase}  guardar={this.guardar}></RutaPrivada>
				<RutaPrivada  path="/app/mandados" component={Mandados} {...propsmandados} guardar={this.guardar}  ></RutaPrivada>
				<RutaPrivada  path="/app/mandadosu" component={MandadosU} {...propsmandadosu} guardar={this.guardar} ></RutaPrivada>
				<RutaPrivada  path="/app/firma" component={Firma} id={this.state.idmandado} fecha={this.state.fechamandado} ></RutaPrivada>
				<RutaPrivada  path="/app/bultos/:id" component={PurchaseDetail} {...propsdetail} ></RutaPrivada>
				<RutaPrivada  path="/app/config" component={Config} guardar={this.guardar}  ></RutaPrivada>
				<RutaPrivada  path="/app/mandado/:id" component={Mandado} guardar={this.guardar} ></RutaPrivada>
				<Login path='/app/login/:error' />
				
				
				</Router>
			</Layout>
		);
	}
}
