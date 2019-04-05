//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Table, Loader, Pagination, Search, Menu } from 'semantic-ui-react';
import FilaFactura from './FilaFactura';
import sortBy from 'lodash/sortBy';

export default class UnpaidInvoices extends Component {
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

	componentDidMount() {
		let user = netlifyIdentity.currentUser();
		let { tipo } = this.props;

		if (user !== null) {
			let { guardar, valores, seleccionadosVendidosID } = this.props;
			if (valores.length === 0) {
				this.setState({
					loading: true
				});
                
				Axios.post(`${ENDPOINTS.UnpaidInvoices}`,'{"valor":""}')
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data.data, [ 'iid' ]);
						turnosVendidos.map((invoice, i)=> (
							//console.log(invoice)
							invoice.o != '' ? invoice.o = this.quitarlink(invoice.o) :''
							
				
						));

						turnosVendidos.map((invoice, i)=> (
							//console.log(invoice)
							invoice.i != '' ? invoice.i = this.quitarlink(invoice.i) :''
							
				
						));

						turnosVendidos.map((invoice, i)=> (
							//console.log(invoice)
							invoice.cli != '' ? invoice.cli = this.quitarlink(invoice.cli) :''
							
				
						));

						turnosVendidos.map((invoice, i)=> (
							//console.log(invoice)
							invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
							
				
						));


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
								<Header>Facturas No Pagadas</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de facturas: {turnosVendidos.length}</Menu.Item>
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
											sorted={column === 'invoice_date' ? direction : null}
											onClick={this.handleSort('invoice_date')}
										>
											ORDEN
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'item_code' ? direction : null}
											onClick={this.handleSort('item_code')}
										>
											FACTURA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'item_name' ? direction : null}
											onClick={this.handleSort('item_name')}
										>
											REFERENCIA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'quantity' ? direction : null}
											onClick={this.handleSort('quantity')}
										>
											FECHA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'unit_price' ? direction : null}
											onClick={this.handleSort('unit_price')}
										>
											PDV.
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'price' ? direction : null}
											onClick={this.handleSort('price')}
										>
											Cliente
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'client_name' ? direction : null}
											onClick={this.handleSort('client_name')}
										>
											TP	
										
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'client_name' ? direction : null}
											onClick={this.handleSort('client_name')}
										>
											Items	
										
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'client_id' ? direction : null}
											onClick={this.handleSort('client_id')}
										>
											Total
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'client_name' ? direction : null}
											onClick={this.handleSort('client_name')}
										>
											Debe	
										
										</Table.HeaderCell>
										
									</Table.Header>
									<Table.Body>
										{turnosVendidos
											.slice(offset, first)
											.map((t) => (
												<FilaFactura
													key={t.iid}
													turno={t}
													seleccionar={this.seleccionar}
													seleccionado={seleccionadosId.includes(t.iid)}
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
