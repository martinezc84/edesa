//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import { Header, Table, Loader, Button, Icon } from 'semantic-ui-react';
import FilaVendidos from './FilaVendidos';
import FilaNoVendidos from './FilaNoVendidos';
import { ENDPOINTS } from '../utils/utils';
import Axios from 'axios';
import format from 'date-fns/format';
import { MostrarError } from './MostrarError';

let MODO = process.env.GATSBY_MODO;

const colores = {
	gris: 'gray',
	azul: 'blue',
	verde: 'green',
	rojo: 'red'
};

const estados = {
	pendiente: { mensaje: 'Pendiente de operar', c: colores.gris, icon: () => null },
	op: {
		mensaje: 'Operando...',
		c: colores.azul,
		icon: () => <Icon loading size="large" color="grey" name="spinner" />
	},
	op1: {
		mensaje: 'Operando 1/5',
		c: colores.azul,
		icon: () => <Icon loading size="large" color="grey" name="spinner" />
	},
	op2: {
		mensaje: 'Operando 2/5',
		c: colores.azul,
		icon: () => <Icon loading size="large" color="grey" name="spinner" />
	},
	op3: {
		mensaje: 'Operando 3/5',
		c: colores.azul,
		icon: () => <Icon loading size="large" color="grey" name="spinner" />
	},
	op4: {
		mensaje: 'Operando 4/5',
		c: colores.azul,
		icon: () => <Icon loading size="large" color="grey" name="spinner" />
	},
	op5: {
		mensaje: 'Operando 5/5',
		c: colores.azul,
		icon: () => <Icon loading size="large" color="grey" name="spinner" />
	},
	completado: {
		mensaje: 'Completado',
		c: colores.verde,
		icon: () => <Icon size="large" color="green" name="check" />
	},
	error: {
		mensaje: 'Error: No operado',
		c: colores.rojo,
		icon: () => <Icon size="large" color="red" name="close" />
	}
};
export default class Acciones extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tiposDeTurno: [],
			loading: false,
			// tipoSeleccionado: null,
			operando: false,
			seleccionadosNoVendidos: this.props.seleccionadosNoVendidos,
			seleccionadosVendidos: this.props.seleccionadosVendidos.map((vendido) => ({
				...vendido,
				statusOperacion: estados.pendiente
			})),
			tipoSeleccionado: this.props.tipoSeleccionado,

			operado: this.props.operado,
			errorVisible: this.props.errorVisible,
			mensajesError: this.props.mensajesError
		};
	}

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}

	// Método para asignar los turnos a la sede seleccionada
	asignarMultiple = async ({ seleccionadosNoVendidos, seleccionadosVendidos, tipoSeleccionado }) => {
		await this.setStateAsync({ operando: true });
		// Ciclo de llamadas
		for (let vendido of seleccionadosVendidos) {
			try {
				// Cambio de estado primer estado
				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.op1 };
						}
						return v;
					})
				});

				// Datos de primer Llamada 1
				let data1 = {
					agency_to_id: tipoSeleccionado.todo.id,
					item_id: vendido.item_id,
					booked_quantity: vendido.quantity,
					temp_invoice_id: vendido.invoice_id
				};

				// Respuesta de primer llamada
				const data = await Axios.post(ENDPOINTS.UNO, data1);
				let id1 = data.data.data.id;

				// Llamada 2
				// Cambio de estado segunda llamada
				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.op2 };
						}
						return v;
					})
				});
				// Se ejecuta la segunda llamada
				const { data: { status } } = await Axios.post(ENDPOINTS.DOS, { id: id1 });

				// Valida si hubo un error en la segunda llamada
				if (status !== true) {
					await this.setStateAsync({
						seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
							let v = ven;
							if (ven.id === vendido.id) {
								return { ...v, statusOperacion: estados.error };
							}
							return v;
						})
					});

					continue;
				}

				// Llamada 3
				// Cambio de estado tercer estado
				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.op3 };
						}
						return v;
					})
				});

				// Datos de primer Llamada 3
				let dataPost3 = {
					agency_from_id: tipoSeleccionado.todo.id,
					item_id: seleccionadosNoVendidos.turno.item_id,
					booked_quantity: vendido.quantity,
					temp_invoice_id: vendido.invoice_id
				};

				// Respuesta de tercer llamada
				const data3 = await Axios.post(ENDPOINTS.TRES, dataPost3);
				let id3 = data3.data.data.id;

				// Llamada 4
				// Cambio de estado tercer estado
				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.op4 };
						}
						return v;
					})
				});

				// Realiza request 4
				const { data: { status: status4 } } = await Axios.post(ENDPOINTS.CUATRO, { id: id3 });

				// Valida si hubo un error en la cuarta llamada
				if (status4 !== true) {
					await this.setStateAsync({
						seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
							let v = ven;
							if (ven.id === vendido.id) {
								return { ...v, statusOperacion: estados.error };
							}
							return v;
						})
					});

					continue;
				}

				// Llamada 5

				// Cambio de estado quinto estado
				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.op5 };
						}
						return v;
					})
				});

				// Prepara dataPost5
				let { item_id: item_id3 } = {
					item_id: seleccionadosNoVendidos.turno.item_id.toString()
				};

				// Datos de primer Llamada 5
				let dataPost5 = {
					inUrl: vendido.invoice_id.toString(),
					data: {
						invoice: {
							id: vendido.invoice_id.toString(),
							invoice_details_attributes: {
								'0': {
									id: vendido.id.toString(),
									quantity: vendido.quantity.toString(),
									item_id: item_id3.toString(),
									reference: 'reemplazado'
								}
							}
						}
					}
				};

				// Respuesta de la quinta llamada
				await Axios.post(ENDPOINTS.CINCO, dataPost5);

				// Cambio de estado quinto estado
				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.completado };
						}
						return v;
					})
				});
			} catch (error) {
				console.error({ error });
				this.nuevoError({
					seleccionadosNoVendidos,
					seleccionadosVendidos,
					tipoSeleccionado,
					vendido
				});
			} finally {
				this.setState({
					operando: false,
					operado: true
				});
			}
		}
	};

	nuevoError = async ({ seleccionadosNoVendidos, seleccionadosVendidos, tipoSeleccionado, vendido }) => {
		let mensaje = JSON.stringify({ seleccionadosNoVendidos, seleccionadosVendidos, tipoSeleccionado, vendido });
		await this.setStateAsync({
			mensajesError: [ ...this.state.mensajesError, mensaje ],
			errorVisible: true
		});
	};

	showData = ({ seleccionadosNoVendidos, seleccionadosVendidos, tipoSeleccionado }) =>
		console.log({ seleccionadosNoVendidos, seleccionadosVendidos, tipoSeleccionado });

	reasignarIndividual = async ({ seleccionadosNoVendidos, seleccionadosVendidos, tipoSeleccionado }) => {
		await this.setStateAsync({ operando: true });
		// Ciclo de llamadas
		for (let vendido of seleccionadosVendidos) {
			try {
				// Fecha actual formateada
				let planned_delivery = format(new Date(), 'YYYY-MM-DD');

				// Prepara data1
				let { agency_to_id, item_id, booked_quantity, temp_invoice_id } = {
					agency_to_id: tipoSeleccionado.todo.id.toString(),
					item_id: vendido.item_id.toString(),
					booked_quantity: vendido.quantity.toString(),
					temp_invoice_id: vendido.invoice_id.toString()
				};

				let data1 = {
					temp_invoice_id: temp_invoice_id,
					shipment: {
						reference: 'Devolucion del cliente para poder reasignar',
						booker_id: '3867',
						needs_transport: '0',
						planned_delivery: planned_delivery,
						agency_from_id: '2502',
						agency_to_id: agency_to_id,
						movements_attributes: {
							'0': {
								item_id: item_id,
								booked_quantity: booked_quantity
							}
						},
						memo: 'Generado desde app de turnos'
					}
				};

				// Prepara data3
				let {
					agency_from_id,
					item_id: item_id3,
					booked_quantity: booked_quantity3,
					temp_invoice_id: temp_invoice_id3
				} = {
					agency_from_id: tipoSeleccionado.todo.id.toString(),
					item_id: seleccionadosNoVendidos.turno.item_id.toString(),
					booked_quantity: vendido.quantity.toString(),
					temp_invoice_id: vendido.invoice_id.toString()
				};

				let data3 = {
					temp_invoice_id: temp_invoice_id3,
					shipment: {
						reference: 'Reasignar otro turno',
						booker_id: '3867',
						needs_transport: '0',
						planned_delivery: planned_delivery,
						agency_from_id: agency_from_id,
						agency_to_id: '2502',
						movements_attributes: {
							'0': {
								item_id: item_id3,
								booked_quantity: booked_quantity3
							}
						},
						memo: 'Generado desde app de turnos'
					}
				};

				// Prepara data5
				let data5 = {
					inUrl: vendido.invoice_id.toString(),
					data: {
						invoice: {
							id: vendido.invoice_id.toString(),
							invoice_details_attributes: {
								'0': {
									id: vendido.id.toString(),
									quantity: vendido.quantity.toString(),
									item_id: item_id3.toString(),
									reference: 'reemplazado'
								}
							}
						}
					}
				};

				await this.setStateAsync({
					seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
						let v = ven;
						if (ven.id === vendido.id) {
							return { ...v, statusOperacion: estados.op };
						}
						return v;
					})
				});

				// Request
				try {
					const response = await Axios.post(ENDPOINTS.REASIGNAR, { data1, data3, data5 });
					await this.setStateAsync({
						seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
							let v = ven;
							if (ven.id === vendido.id) {
								return { ...v, statusOperacion: estados.completado };
							}
							return v;
						})
					});
				} catch (error) {
					console.error(error);
					await this.setStateAsync({
						seleccionadosVendidos: this.state.seleccionadosVendidos.map((ven) => {
							let v = ven;
							if (ven.id === vendido.id) {
								return { ...v, statusOperacion: estados.error };
							}
							return v;
						})
					});
					continue;
				}
			} catch (error) {
				console.error(error);
			}
		}
		await this.setStateAsync({ operando: false, operado: true });
	};

	volver = () => {
		let { volver } = this.props;
		volver();
	};

	render() {
		let {
			loading,
			seleccionadosNoVendidos,
			seleccionadosVendidos,
			tipoSeleccionado,
			operando,

			operado,
			errorVisible,
			mensajesError
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<div className="pt-8">
					<Header>Acciones</Header>
					{tipoSeleccionado !== null ? (
						<React.Fragment>
							<Header as="h3">Tipo seleccionado</Header>
							<Table>
								<Table.Body>
									<Table.Cell>{tipoSeleccionado.todo.name}</Table.Cell>
								</Table.Body>
							</Table>
						</React.Fragment>
					) : (
						<Header as="h2">No has seleccionado tipo</Header>
					)}
					{seleccionadosNoVendidos.turno ? (
						<React.Fragment>
							<Header as="h3">Sede seleccionada</Header>
							<Table>
								<Table.Header>
									<Table.Cell>Código</Table.Cell>
									<Table.Cell>Nombre</Table.Cell>
									<Table.Cell>Disponible</Table.Cell>
								</Table.Header>
								<Table.Body>
									{[ ...seleccionadosNoVendidos.turno ].map((t) => {
										return <FilaNoVendidos key={t.item_code} turno={t} view />;
									})}
								</Table.Body>
							</Table>
						</React.Fragment>
					) : (
						<Header as="h2">No has seleccionado sede de no vendidos</Header>
					)}

					{seleccionadosVendidos.length > 0 ? (
						<React.Fragment>
							<Header as="h3">Turnos seleccionados</Header>
							<Table>
								<Table.Header>
									<Table.Cell>Factura</Table.Cell>
									{/* <Table.Cell>Orden</Table.Cell> */}
									<Table.Cell>Fecha</Table.Cell>
									<Table.Cell>Código</Table.Cell>
									<Table.Cell>Item</Table.Cell>
									<Table.Cell>Cantidad</Table.Cell>
									<Table.Cell>Precio Unitario</Table.Cell>
									<Table.Cell>Precio</Table.Cell>
									<Table.Cell>Cliente</Table.Cell>
									<Table.Cell>Cod. Cliente</Table.Cell>
									<Table.Cell>Estatus</Table.Cell>
								</Table.Header>
								<Table.Body>
									{seleccionadosVendidos.map((s) => {
										return <FilaVendidos key={s.id} turno={s} view />;
									})}
								</Table.Body>
							</Table>
						</React.Fragment>
					) : (
						<Header as="h2">No has seleccionado turnos vendidos</Header>
					)}
					<React.Fragment>
						{MODO === 'DEBUG' ? (
							<React.Fragment>
								<Button
									size="massive"
									primary
									disabled={
										!seleccionadosNoVendidos.turno ||
										!(seleccionadosVendidos.length > 0) ||
										!(tipoSeleccionado !== null) ||
										operando
									}
									onClick={() => {
										this.asignarMultiple({
											seleccionadosNoVendidos,
											seleccionadosVendidos,
											tipoSeleccionado
										});
									}}
								>
									Reasignar (Individual)
								</Button>

								<Button
									size="massive"
									positive
									disabled={
										!seleccionadosNoVendidos.turno ||
										!(seleccionadosVendidos.length > 0) ||
										!(tipoSeleccionado !== null) ||
										operando
									}
									onClick={() => {
										this.reasignarIndividual({
											seleccionadosNoVendidos,
											seleccionadosVendidos,
											tipoSeleccionado
										});
									}}
								>
									Reasignar (Grupal)
								</Button>

								<Button
									disabled={operando}
									floated="right"
									icon
									labelPosition="left"
									onClick={this.volver}
									size="massive"
								>
									<Icon name="arrow left" />
									Volver
								</Button>

								<Button
									size="massive"
									positive
									disabled={operando}
									onClick={() => {
										this.showData({
											seleccionadosNoVendidos,
											seleccionadosVendidos,
											tipoSeleccionado
										});
									}}
								>
									ver data (debug)
								</Button>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Button
									size="massive"
									primary
									disabled={
										!seleccionadosNoVendidos.turno ||
										!(seleccionadosVendidos.length > 0) ||
										!(tipoSeleccionado !== null) ||
										operando ||
										operado
									}
									onClick={() => {
										this.asignarMultiple({
											seleccionadosNoVendidos,
											seleccionadosVendidos,
											tipoSeleccionado
										});
									}}
									icon
									labelPosition="left"
								>
								<Icon name="cogs" />
									Completar proceso de reasignar turnos
								</Button>

								<Button
									disabled={operando}
									floated="right"
									icon
									labelPosition="left"
									onClick={this.volver}
									size="massive"
								>
									<Icon name="arrow left" />
									Volver
								</Button>
							</React.Fragment>
						)}
					</React.Fragment>
					<br />
					<br />
					<MostrarError visible={errorVisible} mensajes={mensajesError} />
				</div>
			);
	}
}
