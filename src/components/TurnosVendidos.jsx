//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Table, Loader, Pagination, Search, Menu } from 'semantic-ui-react';
import FilaVendidos from './FilaVendidos';
import sortBy from 'lodash/sortBy';

export default class TurnosVendidos extends Component {
	state = {
		turnosVendidos: [],
		seleccionados: [],
		seleccionadosId: [],
		paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 50,
		offset: 0,
		step: 50,

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
		if (this.state.seleccionadosId.includes(turno.id)) {
			seleccionados = this.state.seleccionados.filter((s) => s.id !== turno.id);
			seleccionadosId = this.state.seleccionadosId.filter((s) => s !== turno.id);
		} else {
			seleccionados = [ ...this.state.seleccionados, turno ];
			seleccionadosId = [ ...this.state.seleccionadosId, turno.id ];
		}
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

				Axios.get(`${ENDPOINTS.turnosVendidos}?id=${tipo.key}`)
					.then(({ data }) => {
						let turnosVendidos = sortBy(data, [ 'invoice_id' ]);
						guardar('turnosVendidos', turnosVendidos);
						this.setState({
							turnosVendidos: turnosVendidos,
							loading: false,
							seleccionadosId: seleccionadosVendidosID,
							cantidadPaginas: Math.floor(turnosVendidos.length / this.state.first) + 1
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
								<Header>Turnos Vendidos</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de turnos: {turnosVendidos.length}</Menu.Item>
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
										<Table.HeaderCell>Selector</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'invoice_id' ? direction : null}
											onClick={this.handleSort('invoice_id')}
										>
											Factura
										</Table.HeaderCell>
										{/* <Table.HeaderCell>Orden</Table.HeaderCell> */}
										<Table.HeaderCell
											sorted={column === 'invoice_date' ? direction : null}
											onClick={this.handleSort('invoice_date')}
										>
											Fecha
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'item_code' ? direction : null}
											onClick={this.handleSort('item_code')}
										>
											Código
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'item_name' ? direction : null}
											onClick={this.handleSort('item_name')}
										>
											Nombre
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'quantity' ? direction : null}
											onClick={this.handleSort('quantity')}
										>
											Cantidad
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'unit_price' ? direction : null}
											onClick={this.handleSort('unit_price')}
										>
											Precio U.
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'price' ? direction : null}
											onClick={this.handleSort('price')}
										>
											Precio
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'client_name' ? direction : null}
											onClick={this.handleSort('client_name')}
										>
											Cliente
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'client_id' ? direction : null}
											onClick={this.handleSort('client_id')}
										>
											Cod. Cliente
										</Table.HeaderCell>
									</Table.Header>
									<Table.Body>
										{turnosVendidos
											.slice(offset, first)
											.map((t) => (
												<FilaVendidos
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
