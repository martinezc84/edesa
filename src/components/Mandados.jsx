//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { Header, Table, Loader, Button, Icon, Menu,Dropdown } from 'semantic-ui-react';
import SortableLst from '../components/sortable-list';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import VendedorSel  from '../components/VendedorSel';
import { MsjConfirma } from './MsjConfirma';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { async } from 'q';
import { navigate } from '@reach/router';
import Inputdate from './Inputdate';


export default class TipoMandado extends Component {
	state = {
		turnosVendidos: [],
		seleccionados: [],
		seleccionadosId: [],
		paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 40,
		offset: 0,
		step: 40,
		colors:[],
		column: null,
		direction: null,
		monday:null,
		friday:null,
		today:null,
		visible:false,
		visible_confirm:false,
		idmandado:null,
		config:{firma:0},
		delete_id:null,
		userdata:null,
		week:0,
		empleados:[],
		empleadosel:0,
		fecha:new Date()
		
	};

	findCoordinates = () => {
		navigator.geolocation.getCurrentPosition(
		  position => {
		//console.log(position)
			let {latitude, longitude} = position.coords;
			//console.log(latitude)
			//console.log(longitude)
			this.setState({ latitude, longitude });
		  },
		  error => console.log(error.message),
		  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
	  };

	seleccionarDia = (e, { name }) => this.cargarmandados(name)

	seleccionarSemana = (e, { name }) => this.cargarmandadosweek(name)

	cargarmandados(dia){

		//console.log(dia)
		Axios.get(ENDPOINTS.ListaMandados+'?int='+this.state.week+'&dow='+dia+"&eid="+this.state.empleadosel)
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data, [ 'listorder' ]);
						turnosVendidos.sort((a,b) => (a.listorder - b.listorder))
						this.setState({
							turnosVendidos: turnosVendidos,
							loading: false,
							today:dia,							
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

				

			
	}

	cargarmandadosxfecha(){

		//console.log(dia)
		Axios.get(ENDPOINTS.mandadosxfecha+'?date='+this.state.fecha+"&eid="+this.state.empleadosel)
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data, [ 'listorder' ]);
						turnosVendidos.sort((a,b) => (a.listorder - b.listorder))
						this.setState({
							turnosVendidos: turnosVendidos,
							loading: false,						
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

				

			
	}

	cargarmandadosweek(semana){

		//console.log(dia)
		Axios.get(ENDPOINTS.ListaMandados+'?int='+semana+'&dow='+this.state.today)
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data, [ 'listorder' ]);
						turnosVendidos.sort((a,b) => (a.listorder - b.listorder))
						this.setState({
							turnosVendidos: turnosVendidos,
							loading: false,
							week:semana,							
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});
			
	}

	trataEmpleados = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			todo: t
		}));
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}

	// Método para seleccionar o des seleccionar checkbox de turnos
	seleccionar = (turno) => {
		let seleccionados = [];
		let seleccionadosId = [];
		//console.log(turno)
		if (this.state.seleccionadosId.includes(turno.iid)) {
			seleccionados = this.state.seleccionados.filter((s) => s.id !== turno.id);
			seleccionadosId = this.state.seleccionadosId.filter((s) => s !== turno.id);
		} else {
			seleccionados = [ ...this.state.seleccionados, turno ];
			seleccionadosId = [ ...this.state.seleccionadosId, turno.id ];
		}

		//console.log(seleccionados)
		this.setState(
			{
				seleccionados,
				seleccionadosId
			},
			() => {
				this.props.guardar('seleccionadosVendidos', this.state.seleccionados);
				this.props.guardar('seleccionadosVendidosID', this.state.seleccionadosId);
			}
		);
	};

	recargar=async()=>{

		this.setState({
			loading: true
		});
		await Axios.get(ENDPOINTS.ListaMandados+'?int='+this.state.week+'&dow='+this.state.today+"&eid="+this.state.empleadosel)
		.then(({ data }) => {
			
			let turnosVendidos = sortBy(data, [ 'listorder' ]);
			//console.log(turnosVendidos)
			turnosVendidos.sort((a,b) => (a.listorder- b.listorder))
			this.setState({
				turnosVendidos: turnosVendidos,
				loading: false,
				
				cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
			});
		})
		.catch((error) => {
			console.error(error);
		});
	}

	cargardatos = async () => {
		let today
		try {
			// Cambio de estado primer estado
			await Axios.get(ENDPOINTS.Funciones+'?funcion=dia&int=0&dow=2')
		.then(({ data }) => {
			//console.log(data)
			 today = data
			this.setState({
				today
			})
			
		})
		.catch((error) => {
			console.error(error);
		});
	
		await Axios.get(ENDPOINTS.ListaMandados+'?int=0&dow='+today+"&eid="+this.state.empleadosel)
		.then(({ data }) => {
			
			let turnosVendidos = sortBy(data, [ 'listorder' ]);
			//console.log(turnosVendidos)
			turnosVendidos.sort((a,b) => (a.listorder- b.listorder))
			this.setState({
				turnosVendidos: turnosVendidos,
				loading: false,
				
				cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
			});
		})
		.catch((error) => {
			console.error(error);
		});

		await Axios.get(ENDPOINTS.Funciones+'?funcion=monday&int=0&dow=2')
		.then(({ data }) => {
			//console.log(data)
			let monday = data
			this.setState({
				monday
			})
			
		})
		.catch((error) => {
			console.error(error);
		});

		await Axios.get(ENDPOINTS.Funciones+'?funcion=friday&int=0&dow=2')
		.then(({ data }) => {
			//console.log(data)
			let friday = data
			this.setState({
				friday
			})
			
		})
		.catch((error) => {
			console.error(error);
		});
		//console.error(this.props.empleados);

	


	} catch (error) {
		console.error({ error });
		
	} finally {
		this.setState({
			operando: false,
			operado: true
		});
	}
	}

	usafirma(tipo){

		switch(tipo){
			case '1':
			return this.state.general.firma

			case '2':
			return this.state.cobros.firma

			case '3':
			return this.state.entregas.firma

			case '4':
			return this.state.servicios.firma

			
		}
	}

	onSelect = async (id,tipo)=>{
		console.log(this.usafirma(tipo))
		if(this.usafirma(tipo) == '1'){
		this.props.guardar('idmandado', id);
		let fecha = this.state.turnosVendidos.filter((s) => s.id == id);
		this.props.guardar('fechamandado', fecha);
		this.props.cambiarStep(5);
			}else{
		this.setState({
			loading: true
		});
		let fechapartida=[];
		let frealizado = new Date();
		let fechastr = frealizado.toLocaleDateString()
		fechapartida = fechastr.split('/');
				fechastr = fechapartida[2]+'/'+fechapartida[1]+'/'+fechapartida[0]
		let fecha = this.state.turnosVendidos.filter((s) => s.id == id);
		let hours = new Date().getHours(); //Current Hours
        let min = new Date().getMinutes(); //Current Minutes
        let sec = new Date().getSeconds(); //Current Seconds
		await Axios.post(ENDPOINTS.editarmandados,'{"realizado":"1","id":'+id+', "fecha":"'+fecha[0].fecha+'", "fecha_realizado":"'+fechastr+'", "hora_realizado":"'+hours+':'+min+':'+sec+'"}')
			.then(({ data }) => {
				console.log(data)
				
				
			})
			.catch((error) => {
				console.error(error);
			});

		
			//this.props.cambiarStep(3);
			this.setState({	
				loading:false,			
				visible:true
			});


	}
	
	}

	componentDidMount() {
	
		let { tipo, guardar, config, general, cobros, entregas, servicios, geo } = this.props;
		let userdata =getUser();

		if(userdata.group_id>2){
			navigate('/app/mandadosu')
		}
		this.setState({
			userdata: userdata
		});
		this.setState({
				general:general,
				cobros:cobros,
				entregas:entregas,
				servicios:servicios

		})

		if(geo){
			
			this.findCoordinates();
		
	}
		
	
			let { valores, seleccionadosVendidosID } = this.props;
			this.setState({
				loading: true
			});	
					this.cargardatos()
					
		

			console.log(this.props)
			if(this.state.empleados.length==0){
				Axios.get(`${ENDPOINTS.empleados}`)
				.then(({ data }) => {
					//console.log(data)
					
					let empleados = data.filter((d) => d.active === true && d.seller === true && d.inventory_controller === false);
					 let	resposables = data.filter((d) => d.inventory_controller === true && d.active === true);
		
				empleados = [...empleados,...resposables];
		
					
					//console.log(empleados)
					empleados = sortBy(empleados, [ 'name' ]);	
					empleados = this.trataEmpleados(empleados)	
		
		
					this.props.guardar('empleados', empleados);
					this.setState({
						empleados: empleados,
						
					});
				})
				.catch((error) => {
					console.error(error);
				});
			}else{
				this.setState({
					empleados: this.props.empleados,
					
				});
			}
			this.setState({
				loading: false
			});	
		
	}

	// Método para cambiar de página de turnos
	cambioDePagina = (e, { activePage }) => {
		let offset = (activePage - 1) * this.state.step;
		let first = offset + this.state.step;
		this.setState({ paginaSeleccionada: activePage, offset, first });
	};

	onConfirm = ()=>{
		this.setState({				
			visible:false
		});
		//this.props.cambiarStep(3);
	}

	onConfirmCon = ()=>{
		this.setState({				
			visible_confirm:false
		});
		//this.props.cambiarStep(3);
		console.log("Aceptar")
		Axios.post(ENDPOINTS.editarmandadoss,'{"id":'+this.state.delete_id+', "active":"0"}')
		.then(({ data }) => {
			//console.log(data)
			this.recargar()
			
		})
		.catch((error) => {
			console.error(error);
		});
	}

	onCancel = ()=>{
		this.setState({				
			visible_confirm:false
		});
		//this.props.cambiarStep(3);
		console.log("Cancelar")
	}

	borrar =  (id)=>{
		this.setState({				
			visible_confirm:true,
			delete_id:id
		});

		
	 
	}

	editar =  (id)=>{
		navigate('/app/mandado/'+id)	 
	}

	guardarorden = 	 (mandados) =>{
		this.setState({ mandados});
		let turnosVendidos =[];
		//console.log(this.state.colors)
		for (var i=0; i<mandados.length; i++) {
			let mandado = this.state.turnosVendidos.filter((s) => s.id == mandados[i]);
			turnosVendidos = [ ...turnosVendidos, mandado[0] ];
		}
		//console.log(turnosVendidos)
		this.setState(
			{
				turnosVendidos:turnosVendidos
			});
		
		//this.guardarDB(mandados);

	}

	child(){
		
	}

	autorizar = async (id)=>{

		await Axios.post(ENDPOINTS.editarmandadoss,'{"autorizado":"1","id":"'+id+'","autorizo":"'+this.state.userdata.employee_id+'"}')
		.then(({ data }) => {
			//console.log(data)
			this.recargar()
			
		})
		.catch((error) => {
			//console.error(error);
			//return false
		});
	}

	guardar = (dte,id) => {
		
		let fechastr = dte.toLocaleDateString('en-US');
	
		let fecha = fechastr.split('/');
		let fechaf = fecha[2]+'-'+fecha[0]+'-'+fecha[1]
		console.log(fechaf)
		this.setState({
			fecha:fechaf
		})

		 //console.log(fechas)

	};

	guardarDB =(mandados) =>{
		//console.log(mandados)
		this.setState({
			loading: true
		});
		for (var i=0; i<mandados.length; i++) {

			let fecha = this.state.turnosVendidos.filter((s) => s.id == mandados[i]);
			//console.log(fecha[0].fecha)
				let orden = i+1
			Axios.post(ENDPOINTS.editarmandados,'{"listorder":'+orden+',"id":'+mandados[i]+', "fecha":"'+fecha[0].fecha+'"}')
			.then(({ data }) => {
				//console.log(data)
				
				
			})
			.catch((error) => {
				console.error(error);
			});
	
			}
			this.setState({
				loading: false
			});
	}

	handleSort = (clickedColumn) => () => {
		const { column, turnosVendidos, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				turnosVendidos: sortBy(turnosVendidos, [ clickedColumn ]),
				direction: 'ascending'
			});

			return;
		}

		this.setState({
			turnosVendidos: turnosVendidos.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		});
	};

	seleccionaVendedor = (e, item) => {
		//console.log(item.value)
					this.setState(
			{
				empleadosel:item.value
			}
		);

		
	};

	limpiavendedor= async ()=>{
		//console.log(item.value)				
		await this.setState(
			{
				empleadosel:0
			}
		);

		
	};

	render() {
	

		let {
			turnosVendidos,
			loading,
		empleadosel,
			config,
			empleados
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
			{empleados.length>0 && (
				<VendedorSel limpiavendedor={this.limpiavendedor} empleadosel={this.state.empleadosel} empleados={this.state.empleados} seleccionaVendedor={this.seleccionaVendedor} recargar={this.recargar}></VendedorSel>
						)
			}
			<Inputdate
									guardar={this.guardar}
									guardar_id={0}
										/><Button
		
										primary
										onClick={() => {
											this.cargarmandadosxfecha()					
										}}								
										icon
										className="searchdate"
									>
									
										Buscar
									</Button>
	
					<Header> Mandados de la semana del {this.state.monday} al {this.state.friday}</Header>
								<div className="inline-block pr-4">
								
									<Menu compact>
									{this.state.week==1 ? (<Menu.Item onClick={this.seleccionarSemana} name={'0'}> Semana Actual</Menu.Item>):('')}
									<Menu.Item 	onClick={this.seleccionarDia} name={'2'} >{this.state.today==2 ? '*' : ''} Lunes</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'3'}>{this.state.today==3 ? '*' : ''} Martes</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'4'}>{this.state.today==4 ? '*' : ''} Miercoles</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'5'}>{this.state.today==5 ? '*' : ''} Jueves</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'6'}>{this.state.today==6 ? '*' : ''} Viernes</Menu.Item>
									<Menu.Item onClick={this.seleccionarSemana} name={'1'}>{this.state.week==1 ? '*' : ''} Proxima Semana</Menu.Item>
										
									</Menu>
								</div>
					{turnosVendidos.length === 0 ? (
						<Header as="h2">No hay Mandados para este día</Header>
					) : (
						<React.Fragment>
							<div className="pt-8">
										{	this.state.turnosVendidos.length >0 ? (								
												<SortableLst
												items={this.state.turnosVendidos}
												onChange={(turnosVendidos) => {
													this.guardarorden(turnosVendidos)
													this.guardarDB(turnosVendidos)
												}}
												onSelect={this.onSelect}
												firma={config.firma}
												Borrar={this.borrar}
												child={this.child}
												autorizar={this.autorizar}
												group_id={this.state.userdata.group_id}
												editar={this.editar}
												
											>
											</SortableLst>) :(<React.Fragment>Sin Mandados</React.Fragment> )
											}
								
							</div>
						</React.Fragment>
					)}
				<MostrarMensaje titulo={'Datos guardados con exito!'} mensajes={'Mandado'}  visible={this.state.visible} onConfirm={this.onConfirm} />	
				<MsjConfirma titulo={'Si, Eliminar'} mensajes={'Desea eliminar este mandado?'}  visible={this.state.visible_confirm} onConfirm={this.onConfirmCon} onCancel={this.onCancel} />	
				</React.Fragment>
			);
	}
}
