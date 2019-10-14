//@ts-check
import React, { Component } from 'react';
import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';
import Ordenes from '../components/Ordenes';
import Secuencias from '../components/Secuencias';
import Secuencia from '../components/Secuencia';
import Formulas from '../components/Formulas';
import Formula from '../components/Formula';
import Config from '../components/Config';
import Login from '../components/Login';
import { Router } from "@reach/router"
import { Container } from 'semantic-ui-react';
import Axios from 'axios';
import { ZAURU, FUNCIONES } from '../utils/utils';
import { isLoggedIn, logout , getUser} from "../utils/identity"


export default class App extends Component {
	state = {
		tiposDeTurno: [],
		Secuencias:[],
		Formulas:[],
		menuitems:[],
		config:[],
		step: 1,
	
		islogin:false,
		userdata:{group_id:0},
		orden_compra:0
		};


	

	componentDidMount() {
		let user = isLoggedIn();
		
	
		this.setState({
			islogin: user
		});

		let userdata={group_id:0}
		
		if(user==true){
			userdata = getUser()
			
			Axios.get(FUNCIONES.menus+'?id='+userdata.store)
			.then(({ data }) => {
				
		
				this.setState({
				 menuitems : data
				})
			})
			.catch((error) => {
				console.error(error);
			});
			
		
		}else{
			this.setState({
				tiposDeTurno: [],
	
		step: 1,
		menuitems:[],
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


	onChangelist = (order) => {
		//console.log(order);
	}

	render() {
		//console.log(this.state)
		let { step, userdata,  menuitems } = this.state;
		let stepsProps = {
			step: step,
			menuitems:menuitems,
			group_id:userdata.group_id
			
		};		
		
		let propssec = {
			Secuencias:this.state.Secuencias
			
		};	

		let propsforc = {
			Formulas:this.state.Formulas
			
		};
		
		let propsformula = {
			Formulas:this.state.Formulas
			
		};
		return (
			
			<Layout {...stepsProps}>
				<Router>
			<RutaPrivada  path="/app/config" component={Config} guardar={this.guardar}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordenes" component={Ordenes} guardar={this.guardar}  ></RutaPrivada>
			<RutaPrivada  path="/app/secuencias" component={Secuencias} guardar={this.guardar} {...propssec}  ></RutaPrivada>
			<RutaPrivada  path="/app/secuencia/:id" component={Secuencia} guardar={this.guardar} {...propssec}  ></RutaPrivada>	
			<RutaPrivada  path="/app/formulas" component={Formulas} guardar={this.guardar} {...propsforc}  ></RutaPrivada>
			<RutaPrivada  path="/app/formula/:id/:action" component={Formula} guardar={this.guardar} {...propsformula}  ></RutaPrivada>
				<Login path='/app/login/:error' />
				
				
				</Router>
			</Layout>
		);
	}
}
