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
		Items:[],
		Pesos:[],
		estado:'espera'
	
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}


	


	// Método para seleccionar o des seleccionar checkbox de turnos


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
	




	async componentDidMount() {
		
		let { tipo } = this.props;

		let { buscar } = this.state;

		let user = getUser();
		this.setState({
			userdata: user
		});
		
	
	
				this.setState({
					loading: true
				});
				

                //console.log(FUNCIONES.ordenes)
				Axios.get(FUNCIONES.lotesagencia+"?ag=3391")
					.then(({ data }) => {
						let Items=[]
						
					
						let Resp =  data
					
						//console.log(Ordenes)

						for (let Item in Resp) {
							let itemex={cantidad:Resp[Item].cantidad,fecha:Resp[Item].fecha,lote:Resp[Item].lote,vence:Resp[Item].vence,dias:Resp[Item].dias}
							Items.push(itemex);
						}

						
					
						this.setState({
							Items:Items,
							loading: false,							
							cantidadPaginas: Math.floor(Items.length / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

					
			
		
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

	

		cargarxistencias = async (agg)=>{

			
			Axios.get(FUNCIONES.existencias+"?store_id=4&agg="+agg)
			.then(({ data }) => {
				
				//console.log(data)
				let Items = data.items;			
				
				

				//console.log(Ordenes)
				
				this.setState({
					Items: Items,
					agg:agg,
					loading: false,							
					cantidadPaginas: Math.floor(Items.length / this.state.first) + 1
				});
			})
			.catch((error) => {
				console.error(error);
			});
		}
		



	render() {
		let {
			Items,
			loading,		
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction,
			Pesos
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
					{Items.length === 0 ? (
						<React.Fragment>
					
				
						<Header as="h2">No hay Existencias</Header>
						</React.Fragment>
					) : (
						<React.Fragment>
						
						
							<div className="pt-8">
								<Header>Existencias y pesos</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Items: {Items.length}</Menu.Item>
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
											sorted={column === 'lote' ? direction : null}
											onClick={this.handleSort('lote')}
										>
											Lote
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'vence' ? direction : null}
											onClick={this.handleSort('vence')}
										>
											Vence
										</Table.HeaderCell>
										
										
										<Table.HeaderCell
											sorted={column === 'cantidad' ? direction : null}
											onClick={this.handleSort('cantidad')}
										>
											Cantidad
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'dias' ? direction : null}
											onClick={this.handleSort('dias')}
										>
											Días
										</Table.HeaderCell>
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Items
											.slice(offset, first)
											.map((t) => (
												
											<React.Fragment>
											<Table.Row>
											<Table.Cell>
												{t.lote}
											</Table.Cell>
											<Table.Cell>
												{t.vence}
											</Table.Cell>
											<Table.Cell>
												{t.cantidad}
											</Table.Cell>
											<Table.Cell>
												{t.dias}
											</Table.Cell>
											</Table.Row>

											</React.Fragment>
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
