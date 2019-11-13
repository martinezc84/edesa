//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Loader} from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { MsjConfirma } from './MsjConfirma';
import { getUser} from "../utils/identity"

import { navigate } from '@reach/router';


export default class Ordenes extends Component {
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

	

	seleccionarDia = (e, { name }) => this.cargarmandados(name)

	seleccionarSemana = (e, { name }) => this.cargarmandadosweek(name)

	cargarmandados(dia){

		//console.log(dia)
		Axios.get(FUNCIONES.ListaMandados+'?int='+this.state.week+'&dow='+dia+"&eid="+this.state.empleadosel+"&store="+this.state.userdata.store)
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
		Axios.get(FUNCIONES.mandadosxfecha+'?date='+this.state.fecha+"&eid="+this.state.empleadosel+"&store="+this.state.userdata.store)
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
		Axios.get(FUNCIONES.ListaMandados+'?int='+semana+'&dow='+this.state.today+"&store="+this.state.userdata.store)
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
		await Axios.get(FUNCIONES.ListaMandados+'?int='+this.state.week+'&dow='+this.state.today+"&eid="+this.state.empleadosel+"&store="+this.state.userdata.store)
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
			await Axios.get(FUNCIONES.Funciones+'?funcion=dia&int=0&dow=2')
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
	
		await Axios.get(FUNCIONES.ListaMandados+'?int=0&dow='+today+"&eid="+this.state.empleadosel+"&store="+this.state.userdata.store)
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

		await Axios.get(FUNCIONES.Funciones+'?funcion=monday&int=0&dow=2')
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

		await Axios.get(FUNCIONES.Funciones+'?funcion=friday&int=0&dow=2')
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
		await Axios.post(FUNCIONES.editarmandados,'{"realizado":"1","id":'+id+', "fecha":"'+fecha[0].fecha+'", "fecha_realizado":"'+fechastr+'", "hora_realizado":"'+hours+':'+min+':'+sec+'"}')
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

		/*if(userdata.group_id>3){
			navigate('/app/mandadosu')
		}*/
		this.setState({
			userdata: userdata
		});
		this.setState({
				general:general,
				cobros:cobros,
				entregas:entregas,
				servicios:servicios

		})

	
	
			
					
		

			
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
		Axios.post(FUNCIONES.editarmandadoss,'{"id":'+this.state.delete_id+', "active":"0"}')
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

		await Axios.post(FUNCIONES.editarmandadoss,'{"autorizado":"1","id":"'+id+'","autorizo":"'+this.state.userdata.employee_id+'"}')
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
		if(this.state.userdata.group_id<3){
		this.setState({
			loading: true
		});
		for (var i=0; i<mandados.length; i++) {

			let fecha = this.state.turnosVendidos.filter((s) => s.id == mandados[i]);
			//console.log(fecha[0].fecha)
				let orden = i+1
			Axios.post(FUNCIONES.editarmandados,'{"listorder":'+orden+',"id":'+mandados[i]+', "fecha":"'+fecha[0].fecha+'"}')
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
		
	
				
					{
						<Header as="h2">Sistema de Ordenes de Produccion</Header>
					}
				<MostrarMensaje titulo={'Datos guardados con exito!'} mensajes={'Mandado'}  visible={this.state.visible} onConfirm={this.onConfirm} />	
				<MsjConfirma titulo={'Si, Eliminar'} mensajes={'Desea eliminar este mandado?'}  visible={this.state.visible_confirm} onConfirm={this.onConfirmCon} onCancel={this.onCancel} />	
				</React.Fragment>
			);
	}
}
