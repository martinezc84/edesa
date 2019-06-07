//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaDetalle from './FilaDetalle';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class UnpaidInvoices extends Component {
	state = {
		cells:1,
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

agregarlinea(){

	
}

	

	  
		
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
										<Table.HeaderCell>Producto</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'o' ? direction : null}
											onClick={this.handleSort('o')}
										>
											Tag
										</Table.HeaderCell>
										
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Invoices
											.slice(offset, first)
											.map((t) => (
												<FilaDetalle
													key={t.iid}
													turno={t}
												
		
													
												/>
											))}
									</Table.Body>
								</Table>
							</div>

							
								<Button
									size="massive"
									primary
									onClick={(this.agregarlinea()) => {
									
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
