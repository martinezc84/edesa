//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Table, Loader, Pagination, Search, Menu } from 'semantic-ui-react';
import FilaTipo from './FilaTipo';
import sortBy from 'lodash/sortBy';

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
		let user = netlifyIdentity.currentUser();
		let { tipo } = this.props;

		if (user !== null) {
			let { guardar, valores, seleccionadosVendidosID } = this.props;
			if (valores.length === 0) {
				this.setState({
					loading: true
				});
                
				Axios.get(ENDPOINTS.tiposMandado+1)
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data, [ 'id' ]);
						guardar('turnosVendidos', turnosVendidos);
						this.setState({
							turnosVendidos: turnosVendidos,
							loading: false,
							seleccionadosId: seleccionadosVendidosID,
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				this.setState({
					turnosVendidos: valores,
					seleccionadosId: seleccionadosVendidosID,
					cantidadPaginas: Math.floor(valores.length / this.state.first) + 1
				});
			}
		}
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
					{turnosVendidos.length === 0 ? (
						<Header as="h2">No hay turnos vendidos para ese tipo</Header>
					) : (
						<React.Fragment>
							<div className="pt-8">
								<Header>Tipos de Mandado</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>: {turnosVendidos.length}</Menu.Item>
									</Menu>
								</div>

								<div className="inline-block">
									<Pagination
										activePage={paginaSeleccionada}
										boundaryRange={1}
										//@ts-ignore
										onPageChange={this.cambioDePagina}
										size="big"
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
																			
										<Table.HeaderCell
										
										>
											Nombre
										</Table.HeaderCell>
										<Table.HeaderCell
											
										>
											Tiempo
										</Table.HeaderCell>
										<Table.HeaderCell
											
										>
											Firma
										</Table.HeaderCell>
										<Table.HeaderCell
											
										>
											Geolocalizacion
										</Table.HeaderCell>
										<Table.HeaderCell
											
										>
											Correo
										</Table.HeaderCell>
										<Table.HeaderCell
										
										>
											SMS
										</Table.HeaderCell>
										
										
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
