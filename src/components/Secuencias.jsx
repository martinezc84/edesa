//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES} from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaSecuencia from './FilaSecuencia';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class Secuencias extends Component {
	state = {
		Secuencias: [],
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

	editar(id){
		navigate('/app/secuencia/'+id)
	}

	componentDidMount() {
		
		
		let user = getUser();
		this.setState({
			userdata: user
		});

	
		
			let { guardar, valores, seleccionadosVendidosID,  Secuencias } = this.props;
			if (Secuencias.length === 0) {
				this.setState({
					loading: true
				});
                
				Axios.get(FUNCIONES.secuencias+'?id=3')
					.then(({ data }) => {
						console.log(data)
						
						let Secuencias = data;						

						guardar('Secuencias', Secuencias);
						this.setState({
							Secuencias: Secuencias,
							loading: false,
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

				
			} else {
				this.setState({
					Secuencias: Secuencias,
					seleccionadosId: seleccionadosVendidosID,
					cantidadPaginas: Math.floor(Secuencias.length / this.state.first) + 1
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
		
			
			Axios.post(`${FUNCIONES.secuencias}`,'{"valor":"'+event.target.value+'"}')
				.then(({ data }) => {
					//console.log(data)
					
					let Invoices = data.data;
					//console.log(Invoices)
					//Invoices = sortBy(Invoices, [ 'id' ]);
					

					guardar('Secuencias', Secuencias);
					this.setState({
						Secuencias: Secuencias,
						loading: false,
						cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1,
						
					});
				})
				.catch((error) => {
					console.error(error);
				});
		


		
	  }

	
		
		

	render() {
		let {
			Secuencias,
			loading,
		
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
					{Secuencias.length == 0 ? (
						<Header as="h2">No hay Secuencias</Header>
					) : (
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Secuencias</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Secuencias: {Secuencias.length}</Menu.Item>
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
											sorted={column === 'nombre' ? direction : null}
											onClick={this.handleSort('nombre')}
										>
											Nombre
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'prefijo' ? direction : null}
											onClick={this.handleSort('prefijo')}
										>
											Prefijo
										</Table.HeaderCell>
										<Table.HeaderCell
											
											>
												Subfijo
											</Table.HeaderCell>
										<Table.HeaderCell
											
										>
											Inicio
										</Table.HeaderCell>
										<Table.HeaderCell
											
											>
												Final
											</Table.HeaderCell>
											<Table.HeaderCell
											
										>
											Siguiente
										</Table.HeaderCell>
										<Table.HeaderCell></Table.HeaderCell>
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Secuencias										
											.map((t) => (
												<FilaSecuencia
													secuencia={t} 
													editar={this.editar}
													key={t.id}
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
