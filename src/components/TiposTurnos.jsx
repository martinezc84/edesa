//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Loader, Table } from 'semantic-ui-react';
import FilaNoVendidos from './FilaNoVendidos';

export default class TurnosNoVendidos extends Component {
	state = {
		turnosNoVendidos: [],
		seleccionado: '',
		loading: false,
		sel: {}
	};

	seleccionar = (e, { value }, turno) => {
		this.setState({ seleccionado: value, sel: turno }, () => {
			this.props.guardar('seleccionadosNoVendidos', { value, turno });
		});
	};

	componentDidMount() {
		let user = netlifyIdentity.currentUser();
		let { tipo } = this.props;

		if (user !== null) {
			let { guardar, valores, seleccionadosNoVendidos } = this.props;
			let seleccionado = seleccionadosNoVendidos.value ? seleccionadosNoVendidos.value : '';
			if (valores.length === 0) {
				this.setState({
					loading: true
				});

				Axios.get(`${ENDPOINTS.turnosNoVendidos}?id=${tipo.key}`, { params: { tipo } })
					.then(({ data }) => {
						guardar('turnosNoVendidos', data);
						this.setState({
							turnosNoVendidos: data,
							loading: false,
							seleccionado
						});
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				this.setState({
					turnosNoVendidos: valores,
					seleccionado
				});
			}
		}
	}
	sort = (a, b) => {
		if (a.stock_available < b.stock_available) return 1;
		if (a.stock_available > b.stock_available) return -1;
		return 0;
	};
	render() {
		let { turnosNoVendidos, loading } = this.state;
		let { turnosSeleccionados, seleccionadosNoVendidos } = this.props;
		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<div className="pt-8">
					<Header>Turnos Disponibles</Header>
					<Table>
						<Table.Header>
							<Table.Cell>Selector</Table.Cell>
							<Table.Cell>Código</Table.Cell>
							<Table.Cell>Nombre</Table.Cell>
							<Table.Cell>Disponible</Table.Cell>
						</Table.Header>
						<Table.Body>
							{turnosNoVendidos.sort(this.sort).map((t) => {
								return (
									<React.Fragment>
										{turnosSeleccionados > t.stock_available ? null : (
											<FilaNoVendidos
												key={t.item_code}
												turno={t}
												seleccionar={this.seleccionar}
												seleccionado={seleccionadosNoVendidos.value === t.item_id}
												disabled={turnosSeleccionados > t.stock_available}
											/>
										)}
									</React.Fragment>
								);
							})}
						</Table.Body>
					</Table>
				</div>
			);
	}
}
