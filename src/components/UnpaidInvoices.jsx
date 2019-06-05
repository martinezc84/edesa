//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaFactura from './FilaFactura';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class UnpaidInvoices extends Component {
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
		userdata:null
	
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
			seleccionados = this.state.seleccionados.filter((s) => s.iid !== turno.iid);
			seleccionadosId = this.state.seleccionadosId.filter((s) => s !== turno.iid);
		} else {
			seleccionados = [ ...this.state.seleccionados, turno ];
			seleccionadosId = [ ...this.state.seleccionadosId, turno.iid ];
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
		
		let { tipo } = this.props;

		let { buscar } = this.state;

		let user = getUser();
		this.setState({
			userdata: user
		});

		if (user.group_id>2){
			navigate(`/listado`)
		}
		
		
			let { guardar, valores, seleccionadosVendidosID,  empleados } = this.props;
			if (valores.length === 0) {
				this.setState({
					loading: true
				});
                
				Axios.post(`${ENDPOINTS.UnpaidInvoices}`,'{"valor":"'+buscar+'"}')
					.then(({ data }) => {
						//console.log(data)
						
						let Invoices = data.data.filter((d) => d.pt !== 'contado');
						//console.log(Invoices)
						Invoices = sortBy(Invoices, [ 'iid' ]);
						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.o != '' ? invoice.o = this.quitarlink(invoice.o) :''
							
				
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.i != '' ? invoice.i = this.quitarlink(invoice.i) :''
							
				
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.cli != '' ? invoice.cli = this.quitarlink(invoice.cli) :''
							
				
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
							
				
						));


						guardar('Invoices', Invoices);
						this.setState({
							Invoices: Invoices,
							loading: false,
							seleccionadosId: seleccionadosVendidosID,
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
					Invoices: valores,
					seleccionadosId: seleccionadosVendidosID,
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
		//console.log(item.iid)
		let vendedoresseleccionados = [];
		let vendedoresseleccionadosId = [];
		//console.log(turno)
		if (this.state.vendedoresseleccionadosId.includes(item.iid)) {
			//console.log("existe")
			vendedoresseleccionados = this.state.vendedoresseleccionados.filter((s) => s.iid != item.iid);
			vendedoresseleccionadosId = this.state.vendedoresseleccionadosId.filter((s) => s != item.iid);
			vendedoresseleccionados = [ ...vendedoresseleccionados, item ];
			vendedoresseleccionadosId = [ ...vendedoresseleccionadosId,item.iid ];
		} else {
			//console.log("nuevo")
			vendedoresseleccionados = [ ...this.state.vendedoresseleccionados, item ];
			vendedoresseleccionadosId = [ ...this.state.vendedoresseleccionadosId,item.iid ];
		}

		//console.log(vendedoresseleccionados)
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
		
			
			Axios.post(`${ENDPOINTS.UnpaidInvoices}`,'{"valor":"'+event.target.value+'"}')
				.then(({ data }) => {
					//console.log(data)
					
					let Invoices = data.data.filter((d) => d.pt != 'contado');
					console.log(Invoices)
					Invoices = sortBy(Invoices, [ 'iid' ]);
					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.o != '' ? invoice.o = this.quitarlink(invoice.o) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.i != '' ? invoice.i = this.quitarlink(invoice.i) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.cli != '' ? invoice.cli = this.quitarlink(invoice.cli) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
						
			
					));
					console.log(Invoices)

					guardar('Invoices', Invoices);
					this.setState({
						Invoices: Invoices,
						loading: false,
						cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1,
						
					});
				})
				.catch((error) => {
					console.error(error);
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
				//console.log(seleccionado.iid)
				let mensajero = []
				mensajero = this.state.vendedoresseleccionados.filter((s) => s.iid == seleccionado.iid);
				let fecha = this.state.fechas.filter((s) => s.id == seleccionado.iid);

				if(fecha.length==0){
					const data = {dte:this.state.date,id:seleccionado.iid}
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
				const posttext = '{"fecha": "'+fechastr+'", "hora": "'+horastr+':'+minutes+':00",  "cliente":"'+seleccionado.cli+'","descripcion":"Cobro","tipo":"1","user":"'+this.state.userdata.username+'", "employee_id":"'+mensajero[0].value+'","store_id":1,"encargado":"'+nombre.text+'", "active":"1"}'
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
			Invoices,
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
					<label>
          Buscar :
          <input type="text" value={this.state.buscar} onChange={this.handleChange} />
        </label>
					{Invoices.length === 0 ? (
						<Header as="h2">No hay turnos vendidos para ese tipo</Header>
					) : (
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Facturas Vencidas</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de facturas: {Invoices.length}</Menu.Item>
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
										<Table.HeaderCell>SELECT</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'o' ? direction : null}
											onClick={this.handleSort('o')}
										>
											ORDEN
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'i' ? direction : null}
											onClick={this.handleSort('i')}
										>
											FACTURA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'ref' ? direction : null}
											onClick={this.handleSort('ref')}
										>
											REFERENCIA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'dte' ? direction : null}
											onClick={this.handleSort('dte')}
										>
											FECHA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'ag' ? direction : null}
											onClick={this.handleSort('ag')}
										>
											PDV.
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'cli' ? direction : null}
											onClick={this.handleSort('cli')}
										>
											Cliente
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'pt' ? direction : null}
											onClick={this.handleSort('pt')}
										>
											TP	
										
										</Table.HeaderCell>
										<Table.HeaderCell>
											Items	
										
										</Table.HeaderCell>
										<Table.HeaderCell>
											Total
										</Table.HeaderCell>
										<Table.HeaderCell	>
											Debe	
										
										</Table.HeaderCell>
										<Table.HeaderCell	>
											Encargado	
										
										</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Invoices
											.slice(offset, first)
											.map((t) => (
												<FilaFactura
													key={t.iid}
													turno={t}
													seleccionar={this.seleccionar}
													seleccionado={seleccionadosId.includes(t.iid)}
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
