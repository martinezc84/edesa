//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaVenta from './FilaVenta';
import sortBy from 'lodash/sortBy';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class SaleOrders extends Component {
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



	get_id(text){
		const resp = text.split('-')
		return resp[2];
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



	componentDidMount() {
		
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
                console.log(FUNCIONES.ordenesventordenesventaa)
				Axios.post(`${FUNCIONES.ordenesventa}`,'{"valor":"'+buscar+'"}')
					.then(({ data }) => {
						
						console.log(data)
						let Invoices = data.data;
						
						Invoices.map((invoice, i)=> (
						invoice.id =	this.get_id(invoice.DT_RowId)
						));


						Invoices.map((invoice, i)=> (
							
							invoice.zid != '' ? invoice.zid = this.quitarlink(invoice.zid) :''
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.onum != '' ? invoice.onum = this.quitarlink(invoice.onum) :''
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.cli != '' ? invoice.cli = this.quitarlink(invoice.cli) :''
						));

						console.log(Invoices)
						guardar('ordenesdeventa', Invoices);
						this.setState({
							Invoices: Invoices,
							loading: false,
							
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

					
			} else {
				this.setState({
					empleados:empleados,
					Invoices: valores,
					
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
		console.log(item.id)
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
		
			
			Axios.post(`${FUNCIONES.ordenesventa}`,'{"valor":"'+event.target.value+'"}')
				.then(({ data }) => {
					//console.log(data)
					
					let Invoices = data.data;
					//console.log(Invoices)
					//Invoices = sortBy(Invoices, [ 'id' ]);
					Invoices.map((invoice, i)=> (
						//console.log(invoice)
					 invoice.id =	this.get_id(invoice.DT_RowId)
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.z != '' ? invoice.z = this.quitarlink(invoice.z) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.i != '' ? invoice.i = this.quitarlink(invoice.i) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.ven != '' ? invoice.ven = this.quitarlink(invoice.ven) :''
						
			
					));

					guardar('Purchases', Invoices);
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
		
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/manados/')
		}

		generar = (id)=>{
			navigate('/app/nuevaorden/'+id)
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
						<Header as="h2">No hay O/V</Header>
					) : (
						<React.Fragment>
							
							<div className="pt-8">
								<Header>O/V</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de O/V: {Invoices.length}</Menu.Item>
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
										<Table.HeaderCell sorted={column === 'zid' ? direction : null}
											onClick={this.handleSort('zid')}
											>
												ID
										</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'onum' ? direction : null}
											onClick={this.handleSort('onum')}
										>
											ORDEN
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'cli' ? direction : null}
											onClick={this.handleSort('cli')}
										>
											CLIENTE
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'dte' ? direction : null}
											onClick={this.handleSort('dte')}
										>
											FECHA
										</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'ref' ? direction : null}
											onClick={this.handleSort('ref')}
										>
											REFERENCIA
										</Table.HeaderCell>
										
										
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Invoices
											.slice(offset, first)
											.map((t) => (
												<FilaVenta
													
													orden={t}
													generar={this.generar}
													
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
