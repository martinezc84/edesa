//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES} from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaFormula from './FilaFormula';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class Secuencias extends Component {
	state = {
		Formulas: [],
		
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
		navigate('/app/formula/'+id+'/edit')
	}

	ver(id){
		navigate('/app/formula/'+id+'/view')
	}

	componentDidMount() {
		
		
		let user = getUser();
		this.setState({
			userdata: user
		});

	
		
			let { guardar,  seleccionadosVendidosID,  Formulas } = this.props;
			if (Secuencias.length === 0) {
				this.setState({
					loading: true
				});
                
				Axios.get(FUNCIONES.formulas+'?id=3')
					.then(({ data }) => {
						console.log(data)
						
						let Formulas = data;						

						guardar('Formulas', Formulas);
						this.setState({
							Formulas: Formulas,
							loading: false,
							cantidadPaginas: Math.floor(Formulas.lenght / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

				
			} else {
				this.setState({
					Formulas: Formulas,
					seleccionadosId: seleccionadosVendidosID,
					cantidadPaginas: Math.floor(Formulas.length / this.state.first) + 1
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
		const { column, Formulas, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				Invoices: sortBy(Formulas, [ clickedColumn ]),
				direction: 'ascending'
			});

			return;
		}

		this.setState({
			Invoices: Formulas.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		});
	};



		

	render() {
		let {
			Formulas,
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
					{Formulas.length == 0 ? (
						<Header as="h2">No hay Formulas</Header>
					) : (
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Formulas</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Formulas: {Formulas.length}</Menu.Item>
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
										
										
										<Table.HeaderCell></Table.HeaderCell>
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Formulas										
											.map((t) => (
												<FilaFormula
													Formula={t} 
													editar={this.editar}
													ver={this.ver}
													
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
