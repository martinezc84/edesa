//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Table, Loader, Pagination, Search, Menu } from 'semantic-ui-react';
import FilaTipo from './FilaTipo';
import sortBy from 'lodash/sortBy';
import {  getUser} from "../utils/identity"
import { navigate } from '@reach/router';

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

		column: null,
		direction: null
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
	componentDidMount() {
		
		

		let user= getUser();

		if(user.group_id != 1){
			navigate('/app/')
		}
			let { guardar } = this.props;
		
				this.setState({
					loading: true
				});
                
				Axios.get(ENDPOINTS.tiposMandado+user.store)
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data, [ 'id' ]);
						guardar('turnosVendidos', turnosVendidos);
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

	// Método para cambiar de página de turnos
	cambioDePagina = (e, { activePage }) => {
		let offset = (activePage - 1) * this.state.step;
		let first = offset + this.state.step;
		this.setState({ paginaSeleccionada: activePage, offset, first });
	};

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

	render() {
		let {
			turnosVendidos,
			loading,
			seleccionadosId,
			
			first,
			
			offset,
			
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					{turnosVendidos.length === 0 ? (
						<Header as="h2">No hay turnos vendidos para ese tipo</Header>
					) : (
						<React.Fragment>
							<div className="pt-8">
								<Header>Tipos de Mandado</Header>
								

							
								<Table sortable celled>
									<Table.Header>
																			
										<Table.Cell
										
										>
											Nombre
										</Table.Cell>
										<Table.Cell
											
										>
											Tiempo
										</Table.Cell>
										<Table.Cell
											
										>
											Firma
										</Table.Cell>
										<Table.Cell
											
										>
											Geolocalizacion
										</Table.Cell>
										<Table.Cell
											
										>
											Correo
										</Table.Cell>
										<Table.Cell
											
										>
											Dirección
										</Table.Cell>
										<Table.Cell
										
										>
											SMS
										</Table.Cell>
										<Table.Cell
										
										>
											Número
										</Table.Cell>
										
										
										
									</Table.Header>
									<Table.Body>
										{turnosVendidos
											.slice(offset, first)
											.map((t) => (
												<FilaTipo
													key={t.id}
													turno={t}
													seleccionar={this.seleccionar}
													seleccionado={seleccionadosId.includes(t.id)}
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
