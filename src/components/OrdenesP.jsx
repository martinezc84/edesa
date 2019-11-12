//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaOrden from './FilaOrden';
import sortBy from 'lodash/sortBy';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class OrdenesP extends Component {
	state = {
		Invoices: [],
		seleccionados: [],
		seleccionadosId: [],
		vendedoresseleccionados:[],
		vendedoresseleccionadosId:[],
		paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 20,
		offset: 0,
		step: 20,
		buscar:"",
		column: null,
		direction: null,
		empleados:[],
		startDate: new Date(),
		fechas:[],
		date: new Date(),
		visible:false,
		userdata:null,
		Ordenes:[],
		estado:'espera'
	
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
		if (this.state.seleccionadosId.includes(turno.id)) {
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

	quitarlink(text){
		const resp = text.split('>')
		const textresp = resp[1].split('<');
		return textresp[0];
	}

	get_cliente(text){
		const resp = text.split('vendors/')
	
		const textresp =  resp[1].substring(0,6);
		return textresp;
	}

	trataEmpleados = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			todo: t
		}));
	};

	buscariitem = (id, items) => {
		console.log(items)
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};
	

	get_id(text){
		const resp = text.split('-')
		return resp[2];
	}

	get_empleado(id){
		for (var i=0; i<this.state.empleados.length; i++) {
			
            if (this.state.empleados[i].key==id){
				//console.log(this.state.empleados[i])
				return this.state.empleados[i].text;
			}
            //a b c
		}
		
		return null;
	} 

	async empleados(){
		if(this.props.getmem('empleados')===undefined){
			
				try {
					
					let res = await Axios.get(FUNCIONES.empleados);
					let empleados = res.data
					empleados = this.trataEmpleados(empleados)
					//console.log(res.data)
					this.props.guardarmem('empleados', empleados);
					this.props.guardar('empleados', empleados);
					this.setState({
						empleados: empleados,
						
					});

					//cargar formula
					return true
					
				
				}catch(error) {
					console.error(error);
					return false
				};
			}else{
				//console.log(this.props.getmem('empleados'))
				this.setState({
					empleados:this.props.getmem('empleados')
					
				});
				return true
			}
	}

	async componentDidMount() {
		
		let { tipo } = this.props;

		let { buscar } = this.state;

		let user = getUser();
		this.setState({
			userdata: user
		});

		
		
			let { guardar, valores,   empleados } = this.props;
			if (valores.length === 0) {
				this.setState({
					loading: true
				});
				let res = await this.empleados();

                //console.log(FUNCIONES.ordenes)
				Axios.get(FUNCIONES.ordenes+"?id=3&eid=&lines=10&inicio=0&estado=espera")
					.then(({ data }) => {
						
						//console.log(data)
						let Ordenes = data;			
						
						Ordenes.map((orden, i)=> (
		
							orden.empleado = this.get_empleado(orden.employee_id)	
				
						));	

						//console.log(Ordenes)
						guardar('Ordenes', Ordenes);
						this.setState({
							Ordenes: Ordenes,
							loading: false,							
							cantidadPaginas: Math.floor(Ordenes.length / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

					
			} else {
				this.setState({
					empleados:empleados,
					Ordenes: valores,
					
					cantidadPaginas: Math.floor(valores.length / this.state.first) + 1
				});
			}
		
	}

	// Método para cambiar de página de turnos
	cambioDePagina = (e, { activePage }) => {
		let offset = (activePage - 1) * this.state.step;
		let first = offset + this.state.step;
		this.setState({ paginaSeleccionada: activePage, offset, first });
	};



	handleSort = (clickedColumn) => () => {
		const { column, Invoices, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				Invoices: sortBy(Invoices, [ clickedColumn ]),
				direction: 'ascending'
			});

			return;
		}

		this.setState({
			Invoices: Invoices.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		});
	};



	handleChange=(event)=> {
		
		let {  seleccionadosVendidosID } = this.state;

		let { guardar, } = this.props;
		if (event.target.value.length>4){
			
		}
		this.setState({
				
			buscar:event.target.value
		});
		
		
	  }

	  generar_mandados = async ({  vendedoresseleccionados, vendedoresseleccionadosid, seleccionadosId,seleccionados,  }) => {
		await this.setStateAsync({ operando: true });
		this.setState({
			loading: true
		});
	
		// Ciclo de llamadas
		for (let seleccionado of seleccionados) {
			try {
				//console.log(seleccionado.id)
				let mensajero = []
				mensajero = this.state.vendedoresseleccionados.filter((s) => s.id == seleccionado.id);
				let fecha = this.state.fechas.filter((s) => s.id == seleccionado.id);

				if(fecha.length==0){
					const data = {dte:this.state.date,id:seleccionado.id}
					fecha[0] = data
				}
				
				//console.log(mensajero)
				// @ts-ignore
				let nombre  = this.get_empleado(mensajero[0].value)
				//console.log(nombre)
				//console.log(fecha)
				let fechastr = fecha[0].dte.toLocaleDateString('en-US');
				let horastr = fecha[0].dte.getHours();
				let minutes = fecha[0].dte.getMinutes();
				//console.log(fechastr)
				//console.log(minutes)
				fecha = fechastr.split('/');
				fechastr = fecha[2]+'/'+fecha[0]+'/'+fecha[1]
				const posttext = '{"fecha": "'+fechastr+'", "hora": "'+horastr+':'+minutes+':00",  "cliente":"'+seleccionado.ven+'","payee_id":"'+seleccionado.venid+'"   ,"descripcion":"Recolecta","tipo":"5","user":"'+this.state.userdata.username+'", "employee_id":"'+mensajero[0].value+'","store_id":"'+this.state.userdata.store+'","encargado":"'+nombre.text+'", "active":"1", "zauru_id":"'+seleccionado.id+'"}'
				console.log(posttext)

				const data = await Axios.post(FUNCIONES.guardarsecuencia, posttext);
				console.log(data)
			} catch (error) {
				console.error({ error });
				
			} finally {
				this.setState({
					loading: false,
					visible:true
				});
			
			
			}
		}
		
		};

		cargarordenes = async (estado)=>{

			let res = await this.empleados();
			Axios.get(FUNCIONES.ordenes+"?id=3&eid=&lines=10&inicio=0&estado="+estado)
			.then(({ data }) => {
				
				//console.log(data)
				let Ordenes = data;			
				
				Ordenes.map((orden, i)=> (

					orden.empleado = this.get_empleado(orden.employee_id)	
		
				));	

				//console.log(Ordenes)
				
				this.setState({
					Ordenes: Ordenes,
					estado:estado,
					loading: false,							
					cantidadPaginas: Math.floor(Ordenes.length / this.state.first) + 1
				});
			})
			.catch((error) => {
				console.error(error);
			});
		}
		
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/manados/')
		}

		 async generar  (id) {
			//let res = await Axios.get(FUNCIONES.orden+"?id="+id)
			//console.log(res.data)
			navigate('/app/orden/iniciar/'+id)
		}

		async continuar  (id) {
			//let res = await Axios.get(FUNCIONES.orden+"?id="+id)
			//console.log(res.data)
			navigate('/app/orden/terminar/'+id)
		}

		 ver  (id) {
			//let res = await Axios.get(FUNCIONES.orden+"?id="+id)
			//console.log(res.data)
			navigate('/app/ordenp/view/'+id)
		}

		newo(){
			navigate('/app/nuevaorden/0')
		}

	render() {
		let {
			Ordenes,
			loading,		
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction,
			estado
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					<label>
          Buscar :
          <input type="text" value={this.state.buscar} onChange={this.handleChange} />
        </label>
					{Ordenes.length === 0 ? (
						<React.Fragment>
						<Button type="button" variant="primary"  className="submitform" onClick={() => {
						this.newo();
					}}	>Nueva Orden</Button>
					<Menu size='mini' class="ui two item menu">
							<Menu.Item
							class="ui blue button"
							active={estado=='espera'}
							onClick={() => {
								this.cargarordenes('espera')
								
							}}
							name="En espera"
						></Menu.Item>
						<Menu.Item
						class="ui orange button"
						active={estado=='iniciada'}
							onClick={() => {
								this.cargarordenes('iniciada')
							}}
							name="Iniciadas"
						></Menu.Item>
						<Menu.Item
						class="ui black button"
						active={estado=='finalizada'}
							onClick={() => {
								this.cargarordenes('finalizada')
							}}
							name="Finalizadas"
						></Menu.Item>
						
						</Menu>
						<Header as="h2">No hay Ordenes de producción pendientes</Header>
						</React.Fragment>
					) : (
						<React.Fragment>
							<Button type="button" variant="primary"  className="submitform" onClick={() => {
							this.newo();
						}}	>Nueva Orden</Button>
						<Menu size='mini' class="ui two item menu">
							<Menu.Item
							active={estado=='espera'}
							class="ui blue button"
							onClick={() => {
								this.cargarordenes('espera')
							}}
							name="En espera"
						></Menu.Item>
						<Menu.Item
						class="ui orange button"
						active={estado=='iniciada'}
							onClick={() => {
								this.cargarordenes('iniciada')
							}}
							name="Iniciadas"
						></Menu.Item>
						<Menu.Item
						class="ui orange button"
						active={estado=='iniciada'}
							onClick={() => {
								this.cargarordenes('finalizada')
							}}
							name="Finalizadas"
						></Menu.Item>
						
						</Menu>
							<div className="pt-8">
								<Header>Ordenes de Producción</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Ordenes: {Ordenes.length}</Menu.Item>
									</Menu>
								</div>

								<div className="inline-block">
									<Pagination
										activePage={paginaSeleccionada}
										boundaryRange={1}
										//@ts-ignore
										onPageChange={this.cambioDePagina}
										siblingRange={4}
										totalPages={cantidadPaginas}
										ellipsisItem={true ? undefined : null}
										firstItem={true ? undefined : null}
										lastItem={true ? undefined : null}
										prevItem={true ? undefined : null}
										nextItem={true ? undefined : null}
									/>


								</div>
								
								<Table sortable celled>
									<Table.Header>
									<Table.Row>
																				
										<Table.HeaderCell
											sorted={column === 'fecha' ? direction : null}
											onClick={this.handleSort('fecha')}
										>
											Fecha
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'fechahora_entrega' ? direction : null}
											onClick={this.handleSort('fechahora_entrega')}
										>
											Entrega
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'descripcion' ? direction : null}
											onClick={this.handleSort('descripcion')}
										>
											Descripción
										</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'empleado' ? direction : null}
											onClick={this.handleSort('empleado')}
										>
											Encargado
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'equipo' ? direction : null}
											onClick={this.handleSort('equipo')}
										>
											Equipo
										</Table.HeaderCell>
										
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Ordenes
											.slice(offset, first)
											.map((t) => (
												<FilaOrden
													estado={estado}
													orden={t}
													generar={this.generar}
													ver = {this.ver}
													terminar={this.continuar}
												/>
											))}
									</Table.Body>
								</Table>
							</div>
							
						</React.Fragment>
						
					)}
					
				</React.Fragment>
				
			);
	}
}
