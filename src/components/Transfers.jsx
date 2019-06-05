//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaEntrega from './FilaEntrega';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"




export default class Transfers extends Component {
	state = {
		transfers: [],
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
		userdata:null
	
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}

	get_id(text){
		const resp = text.split('-')
		return resp[2];
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
				this.props.guardar('seleccionadosTransfers', this.state.seleccionados);
				this.props.guardar('seleccionadosTransfersID', this.state.seleccionadosId);
			}
		);
	};

	quitarlink(text){
		const resp = text.split('>')
		const textresp = resp[1].split('<');
		return textresp[0];
	}

	trataEmpleados = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			todo: t
		}));
	};

	fechain(id){
		for (var i=0; i<this.state.fechas.length; i++) {
			//console.log(this.state.fechas[i])
            if (this.state.fechas[i].id==id){
				return true;
			}
            //a b c
		}
		
		return false;
	} 

	get_empleado(id){
		for (var i=0; i<this.state.empleados.length; i++) {
			//console.log(this.state.fechas[i])
            if (this.state.empleados[i].key==id){
				return this.state.empleados[i];
			}
            //a b c
		}
		
		return null;
	} 

	guardar = (dte, idf) => {
		let fechas=[]
		const data = {dte:dte,id:idf}

		if (this.fechain(idf)) {
			fechas = this.state.fechas.filter((s) => s.id != idf);
			fechas = [ ...fechas, data ];
		}else{
		fechas = [ ...this.state.fechas, data ]
			}

		this.setState({
			fechas})

		 //console.log(fechas)

	};

	componentDidMount() {
		//let user = netlifyIdentity.currentUser();
		let { tipo } = this.props;

		let { buscar } = this.state;

		this.setState({
			userdata: getUser()
		});

			let { guardar, valores, seleccionadosTransfersID,  empleados } = this.props;
			if (valores.length === 0) {
				this.setState({
					loading: true
				});
                
				Axios.get(`${ENDPOINTS.Entregas}`)
					.then(({ data }) => {
						//console.log(data)
						
						let transfers = data;
						//console.log(transfers)
						//transfers = sortBy(transfers, [ 'id' ]);
						

					
						console.log(transfers)

						guardar('transfers', transfers);
						this.setState({
							transfers: transfers,
							loading: false,
							seleccionadosId: seleccionadosTransfersID,
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

					Axios.get(`${ENDPOINTS.empleados}`)
					.then(({ data }) => {
						//console.log(data)
						
						let empleados = data.filter((d) => d.seller === true);
						//console.log(empleados)
						empleados = sortBy(empleados, [ 'name' ]);	
						empleados = this.trataEmpleados(empleados)	


						guardar('empleados', empleados);
						this.setState({
							empleados: empleados,
							
						});
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				this.setState({
					empleados:empleados,
					transfers: valores,
					seleccionadosId: seleccionadosTransfersID,
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

	seleccionaVendedor = (e, item) => {
		//console.log(item.id)
		let vendedoresseleccionados = [];
		let vendedoresseleccionadosId = [];
		//console.log(turno)
		if (this.state.vendedoresseleccionadosId.includes(item.id)) {
			//console.log("existe")
			vendedoresseleccionados = this.state.vendedoresseleccionados.filter((s) => s.id != item.id);
			vendedoresseleccionadosId = this.state.vendedoresseleccionadosId.filter((s) => s != item.id);
			vendedoresseleccionados = [ ...vendedoresseleccionados, item ];
			vendedoresseleccionadosId = [ ...vendedoresseleccionadosId,item.id ];
		} else {
			//console.log("nuevo")
			vendedoresseleccionados = [ ...this.state.vendedoresseleccionados, item ];
			vendedoresseleccionadosId = [ ...this.state.vendedoresseleccionadosId,item.id ];
		}

		console.log(vendedoresseleccionados)
		this.setState(
			{
				vendedoresseleccionados,
				vendedoresseleccionadosId
			},
			() => {
				this.props.guardar('vendedoresseleccionadosVendidos', this.state.vendedoresseleccionados);
				this.props.guardar('vendedoresseleccionadosVendidosID', this.state.vendedoresseleccionadosId);
			}
		);
	};

	handleSort = (clickedColumn) => () => {
		const { column, transfers, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				transfers: sortBy(transfers, [ clickedColumn ]),
				direction: 'ascending'
			});

			return;
		}

		this.setState({
			transfers: transfers.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		});
	};





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
				let horastr = fecha[0].dte.getHours()-1;
				let minutes = fecha[0].dte.getMinutes();
				console.log(horastr)
				console.log(minutes)
				fecha = fechastr.split('/');
				fechastr = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
				const posttext = '{"fecha": "'+fechastr+'", "hora": "'+horastr+':'+minutes+':00",   "cliente":"'+seleccionado.address_to+'","descripcion":"Entrega: Ref'+seleccionado.reference+'","tipo":"2","user":"'+this.state.userdata.username+'","store_id":1,"encargado":"'+nombre.text+'","employee_id":"'+mensajero[0].value+'", "active":"1"}'
				//console.log(posttext)

				const data = await Axios.post(ENDPOINTS.guardarmandados, posttext);
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
		
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			this.props.cambiarStep(3);
		}

	render() {
		let {
			transfers,
			loading,
			seleccionadosId,
			seleccionados,
			vendedoresseleccionadosId,
			vendedoresseleccionados,
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					{transfers.length === 0 ? (
						<Header as="h2">No hay entregas pendientes</Header>
					) : (
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Entregas pendientes</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad: {transfers.length}</Menu.Item>
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
										<Table.HeaderCell>Selector</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'zid' ? direction : null}
											onClick={this.handleSort('zid')}
										>
											ID
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'id_number' ? direction : null}
											onClick={this.handleSort('id_number')}
										>
											RESERVACION
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'reference' ? direction : null}
											onClick={this.handleSort('reference')}
										>
											REFERENCIA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'planned_delivery' ? direction : null}
											onClick={this.handleSort('planned_delivery')}
										>
											ENTREGA ESTIMADA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'planned_shipping' ? direction : null}
											onClick={this.handleSort('planned_shipping')}
										>
											ENTREGADO EL.
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'address_from' ? direction : null}
											onClick={this.handleSort('address_from')}
										>
											ORIGEN
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'address_to' ? direction : null}
											onClick={this.handleSort('address_to')}
										>
											DESTINO	
										
										</Table.HeaderCell>
									
									
										<Table.HeaderCell	>
											Fecha mandado	
										
										</Table.HeaderCell>
										<Table.HeaderCell	>
											Encargado	
										
										</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{transfers
											.slice(offset, first)
											.map((t) => (
												<FilaEntrega
													key={t.id}
													turno={t}
													seleccionar={this.seleccionar}
													seleccionado={seleccionadosId.includes(t.id)}
													empleados={this.state.empleados} 
													seleccionaVendedor={this.seleccionaVendedor}
													guardar={this.guardar}
													
												/>
											))}
									</Table.Body>
								</Table>
							</div>

							
								<Button
									size="massive"
									primary
									onClick={() => {
										this.generar_mandados({
											// @ts-ignore
											vendedoresseleccionadosId,
											vendedoresseleccionados,
											seleccionadosId,
											seleccionados
										});
									}}								
									icon
									labelPosition="left"
								>
								<Icon name="cogs" />
									Generar Mandado
								</Button>

							

							
						</React.Fragment>
						
					)}
					<MostrarMensaje titulo={'Los mandados fueron creados con exito'} mensajes={'Prueba'}  visible={this.state.visible} onConfirm={this.onConfirm} />
				</React.Fragment>
				
			);
	}
}
