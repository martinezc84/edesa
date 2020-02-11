//@ts-check
import React, { Component } from 'react';
import { Layout } from '../components/Layout';
import RutaPrivada from '../components/RutaPrivada';
import Ordenes from '../components/Ordenes';
import Secuencias from '../components/Secuencias';
import SaleOrders from '../components/SaleOrders';
import Secuencia from '../components/Secuencia';
import Formulas from '../components/Formulas';
import Formula from '../components/Formula';
import Config from '../components/Config'
import OrdenesP from '../components/OrdenesP';
import OrdenP from '../components/OrdenP';
import Iniciar from '../components/Iniciar';
import Terminar from '../components/cerrar';
import Existencias from '../components/Existencias';
import Reparacion from '../components/Reparacion';
import ReporteBobinas from '../components/ReporteBobinas';
import OrdenesCompra from '../components/PurchaseOrders';
import OrdenCompra from '../components/PurchaseDetail';
import Transfer from '../components/Transfer';
import LotesAgencia from '../components/LotesAgencia';
import Login from '../components/Login';
import NuevaOrden from '../components/NuevaOrden';
import Pedidos from '../components/Pedidos';
import NuevoPedido from '../components/NuevoPedido';
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
		ordenesdeventa:[],
		step: 1,	
		islogin:false,
		userdata:{group_id:0},
		orden_compra:0,
		show:false,
		Ordenes:[],
		referencias:[],
		marcas:[],
		empleados:[],
		comprables:[]
		};


	

	async componentDidMount() {
		let user = isLoggedIn();
		
	
		this.setState({
			islogin: user,
			loading:true
		});

		let userdata={group_id:0}
		
		if(user==true){
			userdata = getUser()
			//console.log('cargando zauru')
			let resp = await this.cargardatoszauru()
			//console.log('cargando menu')
			//console.log(this.getmem('menuitems'))
			if (this.getmem('menuitems')===undefined){
				try{
				let res = await  Axios.get(FUNCIONES.menus+'?id='+userdata.group_id)
				
					let data =res.data;
					//console.log(data)
					this.setState({
					menuitems : data,
					show:true,
					})
					this.guardarmem("menuitems",data)
				
				}catch(error)  {
					console.error(error);
					this.setState({
						menuitems : []
					})
				}
			
			}else{
				this.setState({
					menuitems : this.getmem("menuitems"),
					show:true,
					})
			}
		}else{
			this.borrarmem()
			this.setState({
				tiposDeTurno: [],
				show:true,
		step: 1,
		menuitems:[],
		islogin:false,
		userdata:{group_id:0},
		orden_compra:0
			})
		}

		this.setState({
			userdata: userdata,
			loading:false
		});
		
		
	}

	guardar = (state, valores) => {
		this.setState({
			[state]: valores
		});
	};

	guardarmem = (state, valores) => {
		window.localStorage.setItem(state, JSON.stringify(valores))
	};

	borrarmem= async ()=>{
		this.setState({
			
			loading:true
		});
		//console.log('borrando')
		window.localStorage.removeItem("agencias")
		window.localStorage.removeItem("vendibles")
		window.localStorage.removeItem("comprables")
		window.localStorage.removeItem("menuitems")
		window.localStorage.removeItem("equipos")
		window.localStorage.removeItem("empleados")
		window.localStorage.removeItem("marcas")
		window.localStorage.removeItem("referencias")

		let userdata = getUser()
			//console.log('cargando zauru')
			let resp = await this.cargardatoszauru()
			//console.log('cargando menu')
			//console.log(this.getmem('menuitems'))
			if (this.getmem('menuitems')===undefined){
				Axios.get(FUNCIONES.menus+'?id='+userdata.group_id)
				.then(({ data }) => {
					
					//console.log(data)
					this.setState({
					menuitems : data,
					show:true,
					})
					this.guardarmem("menuitems",data)
				})
				.catch((error) => {
					console.error(error);
					this.setState({
						menuitems : []
					})
				});
				this.setState({
			
					loading:false
				});
	}
}

	getmem =(state)=>{
		
		 return window.localStorage.getItem(state)
    ? JSON.parse(window.localStorage.getItem(state))
    : undefined
	}

	trataCats = (cats) => {
		//console.log(cats)
		let items=[];
		
		for ( let cat in cats) {
			cat = cats[cat]
			//console.log(items)
			for (var _i = 0; _i < cat.length; _i++) {
				let det = cat[_i];
				//console.log(det[1])
				let codes = det[0].split("-")
				let i
				if(codes[codes.length - 1]!=" "){
					 i={key:det[1],value:det[1],text: det[0],code: codes[codes.length - 1].trim()}
				}else{
					 i={key:det[1],value:det[1],text: det[0],code: "0"}
				}
				items.push(i);
			}
		}
		
		return items;
		
	};

	trataItems = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			code: t.code
			
		}));
	};

	trataAgs = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,

		}));
	};

	async vendibles(){
		
		let vendibles
		let itemst
		//console.log(this.getmem("vendibles"))
		if(this.getmem("vendibles")===undefined){
		let res = await Axios.get(`${FUNCIONES.vendibles}`)
		

			vendibles = res.data.bundles
			itemst = res.data.items
			console.log(itemst)
			itemst = this.trataItems(itemst)
			vendibles = this.trataItems(vendibles)
			console.log(itemst)
			console.log(vendibles)
			this.guardar('vendibles', vendibles);
			this.guardarmem("vendibles", vendibles);
			this.guardarmem("itemst", itemst);
			this.setState({
				vendibles: vendibles,
				itemst:itemst
			})
			//cargar comprables
			return true
			
			
		
		
	}else{
		this.setState({
			vendibles:this.getmem("vendibles"),
			itemst:this.getmem("itemst")
			
		});
		return false
	}
	}

	quitarlink(text){
		const resp = text.split('>')
		const textresp = resp[1].split('<');
		return textresp[0];
	}

	existe=(item, array) => {
		let resp
		array.map((linea, i)=> (
			
			item == linea ? resp=true : resp=false		

		));

		return resp;
	}

	async beneficiarios(){
		
		let beneficiarios
		
		//console.log(this.getmem("vendibles"))
		if(this.getmem("marcas")===undefined){
		let res = await Axios.post(`${FUNCIONES.beneficiarios}`,'{"draw":"1", "start":"0","length":"300","desde":"0","hasta":"0","scope":"clients"}')
		
		//console.log(res.data)
			beneficiarios = res.data.data
			let marcas=[]
			let referencias=[]
			console.log(beneficiarios.length)
			for (var _i = 0; _i < beneficiarios.length; _i++) {
				//console.log(beneficiarios[_i].DT_RowId)
				let id = beneficiarios[_i].DT_RowId
				id = id.split("-")
				let bene = {id:id[2], nombre:this.quitarlink(beneficiarios[_i].name), tin:beneficiarios[_i].tin}
				marcas.push(bene)
				let ref =this.quitarlink(beneficiarios[_i].reference)
				if(referencias.length>0){
					if(!this.existe(ref,referencias)){
						referencias.push(ref)
					}
				}else{
						referencias.push(ref)
				}
				
			}
			 
			//console.log(marcas)
			//console.log(referencias)
			this.guardar('referencias', referencias);
			this.guardarmem("referencias", referencias);
			this.guardar('marcas', marcas);
			this.guardarmem("marcas", marcas);
			this.setState({
				referencias: referencias,
				marcas:marcas
			})
			//cargar comprables
			return true
			
			
		
		
	}else{
		this.setState({
			vendibles:this.getmem("vendibles"),
			itemst:this.getmem("itemst")
			
		});
		return false
	}
	}

	async comprables(){
		let comprables
		
		
		if(this.getmem('comprables')===undefined){
			
				try {
					//console.log(data)
					let res = await Axios.get(FUNCIONES.comprables)
					let categorias = res.data.items_grouped
					//console.log(categorias)					
					comprables = this.trataCats(categorias)
					console.log(comprables)
					this.guardarmem('comprables', comprables);
					this.guardar('comprables', comprables);
					this.setState({
						comprables: comprables										
					});
					return true
					//cargar agencias
					

				
				}catch(error)  {
					console.error(error);
					return false
				};
			}else{
				this.setState({
					comprables:this.getmem('comprables')
					
				});
				return false
			}
	}

	

	async agencias(){
		if(this.getmem('agencias')===undefined){
			
				try {
					//console.log(data)
					let res = await Axios.get(FUNCIONES.agencias);
					let agencias = res.data
					//console.log(categorias)
					agencias = this.trataAgs(agencias)
					//console.log(comprables)
					this.guardarmem('agencias', agencias);
					this.guardar('agencias', agencias);
					this.setState({
						agencias: agencias,
						
					});

					//cargar formula
					return true
					
				
				}catch(error) {
					console.error(error);
					return false
				};
			}else{
				this.setState({
					agencias:this.getmem('agencias')
					
				});
				return true
			}
	}

	 async cargardatoszauru() {
			//console.log('vendibles')
			let resp = await this.vendibles();
			//console.log('comprables')
			resp = await this.comprables();
			//console.log('agencias')
			resp = await this.agencias();

			resp = await this.beneficiarios();
			//console.log('listo')
			//console.log(this.state.vendibles)
			//console.log(this.state.comprables)
			//console.log(this.state.agencias)
			return true
	}

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
			group_id:userdata.group_id,
			borrarmem:this.borrarmem,
			loading:this.state.loading
			
		};		
		
		let propssec = {
			Secuencias:this.state.Secuencias
			
		};	

		let propsforc = {
			Formulas:this.state.Formulas,
			show:this.state.show
			
		};

		let propsov = {
			valores:[]
			
		};

		let propson = {
			guardarmem:this.guardarmem,
			getmem:this.getmem,
			items:this.state.vendibles,
			itemst:this.state.itemst
			
		};
		
		let propsformula = {
			Formulas:this.state.Formulas,
			vendibles:this.state.vendibles,
			comprables:this.state.comprables,
			agencias:this.state.agencias,
			itemst:this.state.itemst
			
		};

		let propstrans = {
			guardarmem:this.guardarmem,
			getmem:this.getmem,
			vendibles:this.state.vendibles,
			comprables:this.state.comprables,
			agencias:this.state.agencias,
			empleados:this.state.empleados
		};
		let propspedidos = {
			guardarmem:this.guardarmem,
			getmem:this.getmem,
			agencias:this.state.agencias,
			empleados:this.state.empleados,
			marcas:this.state.marcas,
			valores:[]
		};

		let propsnuevop = {
			guardarmem:this.guardarmem,
			getmem:this.getmem,
			empleados:this.state.empleados,
			marcas:this.state.marcas,
			valores:[],
			items:this.state.comprables,
		};

		let propsOP = {
			guardarmem:this.guardarmem,
			getmem:this.getmem,
			valores:this.state.Ordenes,
			empleados:this.state.empleados
			
		};

		let propsPOD = {
			guardarmem:this.guardarmem,
			getmem:this.getmem,
			comprables:this.state.comprables,
			agencias:this.state.agencias,
			
		};

		let propsIni = {
			getmem:this.getmem,
			
		};
		return (
			
			<Layout {...stepsProps}>
				<Router>
			<RutaPrivada  path="/app/config" component={Config} guardar={this.guardar}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordenes" component={Ordenes} guardar={this.guardar}  ></RutaPrivada>
			<RutaPrivada  path="/app/secuencias" component={Secuencias} guardar={this.guardar} {...propssec}  ></RutaPrivada>
			<RutaPrivada  path="/app/secuencia/:id" component={Secuencia} guardar={this.guardar} {...propssec}  ></RutaPrivada>	
			<RutaPrivada  path="/app/formulas" component={Formulas} guardar={this.guardar} {...propsforc}  ></RutaPrivada>
			<RutaPrivada  path="/app/formula/:action/:id" component={Formula} guardar={this.guardar} {...propsformula}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordenesventa" component={SaleOrders} guardar={this.guardar} {...propsov}  ></RutaPrivada>
			<RutaPrivada  path="/app/nuevaorden/:id" component={NuevaOrden} guardar={this.guardar} {...propson}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordenesp" component={OrdenesP} guardar={this.guardar} {...propsOP}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordenescompra" component={OrdenesCompra} guardar={this.guardar} {...propsOP}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordencompra/:action/:id" component={OrdenCompra} guardar={this.guardar} {...propsPOD}  ></RutaPrivada>
			<RutaPrivada  path="/app/transferencias/:action/:id" component={Transfer} guardar={this.guardar} {...propstrans}  ></RutaPrivada>
			<RutaPrivada  path="/app/orden/iniciar/:id" component={Iniciar} guardar={this.guardar} {...propsIni}  ></RutaPrivada>
			<RutaPrivada  path="/app/orden/terminar/:id" component={Terminar} guardar={this.guardar} {...propsIni}  ></RutaPrivada>
			<RutaPrivada  path="/app/ordenp/:action/:id" component={OrdenP} guardar={this.guardar} {...propson}  ></RutaPrivada>
			<RutaPrivada  path="/app/existencias" component={Existencias} guardar={this.guardar} {...propson}  ></RutaPrivada>
			<RutaPrivada  path="/app/reparacion" component={Reparacion} guardar={this.guardar} {...propson}  ></RutaPrivada>
			<RutaPrivada  path="/app/lotesagencia" component={LotesAgencia} guardar={this.guardar} {...propson}  ></RutaPrivada>
			<RutaPrivada  path="/app/pedidos" component={Pedidos} guardar={this.guardar} {...propspedidos}  ></RutaPrivada>
			<RutaPrivada  path="/app/nuevopedido" component={NuevoPedido} guardar={this.guardar} {...propsnuevop}  ></RutaPrivada>
			<RutaPrivada  path="/app/reporte" component={ReporteBobinas} guardar={this.guardar} {...propsnuevop}  ></RutaPrivada>
				<Login path='/app/login/:error' />
				
				
				</Router>
			</Layout>
		);
	}
}
