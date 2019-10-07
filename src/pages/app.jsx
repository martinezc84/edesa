//@ts-check
import React, { Component } from 'react';

import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';

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


	

	componentDidMount() {
		let user = isLoggedIn();
		
	
		this.setState({
			islogin: user
		});

		let userdata={group_id:0}
		
		if(user==true){
			userdata = getUser()
			
		
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

		

		

	

		

		

		
		
		return (
			
			<Layout {...stepsProps}>
				<Router>
			<RutaPrivada  path="/app/config" component={Config} guardar={this.guardar}  ></RutaPrivada>
				
				<Login path='/app/login/:error' />
				
				
				</Router>
			</Layout>
		);
	}
}
