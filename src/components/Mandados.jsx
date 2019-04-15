//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';

import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import { Header, Table, Loader, Pagination, Search, Menu } from 'semantic-ui-react';
import SortableLst from '../components/sortable-list';
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
		colors:[],
		column: null,
		direction: null,
		monday:null,
		friday:null,
		today:null
	};

	seleccionarDia = (e, { name }) => this.cargarmandados(name)

	cargarmandados(dia){

		console.log(dia)
		Axios.get(ENDPOINTS.ListaMandados+'?int=0&dow='+dia)
					.then(({ data }) => {
						//console.log(data)
						let turnosVendidos = sortBy(data, [ 'listorder' ]);
						
						this.setState({
							turnosVendidos: turnosVendidos,
							loading: false,
							today:dia,
							
							cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});
	}



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

	

	cargardatos = async () => {
		let today
		try {
			// Cambio de estado primer estado
			await Axios.get(ENDPOINTS.Funciones+'?funcion=dia&int=0&dow=2')
		.then(({ data }) => {
			//console.log(data)
			 today = data
			this.setState({
				today
			})
			
		})
		.catch((error) => {
			console.error(error);
		});
	
		await Axios.get(ENDPOINTS.ListaMandados+'?int=0&dow='+today)
		.then(({ data }) => {
			
			let turnosVendidos = sortBy(data, [ 'listorder' ]);
			//console.log(turnosVendidos)
			this.setState({
				turnosVendidos: turnosVendidos,
				loading: false,
				
				cantidadPaginas: Math.floor(data.recordsTotal / this.state.first) + 1
			});
		})
		.catch((error) => {
			console.error(error);
		});

		await Axios.get(ENDPOINTS.Funciones+'?funcion=monday&int=0&dow=2')
		.then(({ data }) => {
			//console.log(data)
			let monday = data
			this.setState({
				monday
			})
			
		})
		.catch((error) => {
			console.error(error);
		});

		await Axios.get(ENDPOINTS.Funciones+'?funcion=friday&int=0&dow=2')
		.then(({ data }) => {
			//console.log(data)
			let friday = data
			this.setState({
				friday
			})
			
		})
		.catch((error) => {
			console.error(error);
		});
	} catch (error) {
		console.error({ error });
		
	} finally {
		this.setState({
			operando: false,
			operado: true
		});
	}
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

				
					this.cargardatos()
					
					console.log(this.state)
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

	guardarorden = 	 (mandados) =>{
		this.setState({ mandados});
		let turnosVendidos =[];
		//console.log(this.state.colors)
		for (var i=0; i<mandados.length; i++) {
			let mandado = this.state.turnosVendidos.filter((s) => s.id == mandados[i]);
			turnosVendidos = [ ...turnosVendidos, mandado[0] ];
		}
		//console.log(turnosVendidos)
		this.setState(
			{
				turnosVendidos:turnosVendidos
			});
		
		//this.guardarDB(mandados);

	}

	guardarDB =(mandados) =>{
		//console.log(mandados)
		this.setState({
			loading: true
		});
		for (var i=0; i<mandados.length; i++) {

			let fecha = this.state.turnosVendidos.filter((s) => s.id == mandados[i]);
			//console.log(fecha[0].fecha)
				let orden = i+1
			Axios.post(ENDPOINTS.editarmandados,'{"listorder":'+orden+',"id":'+mandados[i]+', "fecha":"'+fecha[0].fecha+'"}')
			.then(({ data }) => {
				//console.log(data)
				
				
			})
			.catch((error) => {
				console.error(error);
			});
	
			}
			this.setState({
				loading: false
			});
	}

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
					<Header> Mandados de la semana del {this.state.monday} al {this.state.friday}</Header>
								<div className="inline-block pr-4">
									<Menu compact>
									<Menu.Item 	onClick={this.seleccionarDia} name={'2'} >{this.state.today==2 ? '*' : ''} Lunes</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'3'}>{this.state.today==3 ? '*' : ''} Martes</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'4'}>{this.state.today==4 ? '*' : ''} Miercoles</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'5'}>{this.state.today==5 ? '*' : ''} Jueves</Menu.Item>
									<Menu.Item onClick={this.seleccionarDia} name={'6'}>{this.state.today==6 ? '*' : ''} Viernes</Menu.Item>
										
									</Menu>
								</div>
					{turnosVendidos.length === 0 ? (
						<Header as="h2">No hay Mandados para este día</Header>
					) : (
						<React.Fragment>
							<div className="pt-8">
										{									
												<SortableLst
												items={this.state.turnosVendidos}
												onChange={(turnosVendidos) => {
													this.guardarorden(turnosVendidos)
													this.guardarDB(turnosVendidos)
												}}
											>
											</SortableLst>
											}
								
							</div>
						</React.Fragment>
					)}
				</React.Fragment>
			);
	}
}
