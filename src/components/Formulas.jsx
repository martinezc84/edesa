//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES} from '../utils/utils';
import { Header, Table, Loader, Pagination,  Menu, Icon } from 'semantic-ui-react';
import FilaFormula from './FilaFormula';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';
import { Button} from 'react-bootstrap';


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
		navigate('/app/formula/edit/'+id)
	}

	ver(id){
		navigate('/app/formula/view/'+id)
	}

	newf(){
		navigate('/app/formula/new/0')
	}

	componentDidMount() {
		
	
		let user = getUser();
		this.setState({
			userdata: user
		});

	
		
			let { guardar, load,  Formulas } = this.props;
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
					this.setState({
						load:load
					});
				
			} else {
				this.setState({
					Formulas: Formulas,
					
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
			column,
			direction,
			
		} = this.state;

		let show = this.props.show

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>					
					{Formulas.length == 0? (<React.Fragment>
						<Header as="h2">No hay Formulas</Header>
						<Button type="button" variant="primary"  className="submitform" onClick={() => {
							this.newf();
						}}	>Nueva Formula</Button></React.Fragment>
					) : (
						<React.Fragment>
							<Button type="button" variant="primary"  className="submitform" onClick={() => {
							this.newf();
						}}	>Nueva Formula</Button>
							<div className="pt-8">
								<Header>Formulas</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Formulas: {Formulas.length}</Menu.Item>
									</Menu>
								</div>

								<div className="inline-block">
									


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
										{
											show==true ?
											Formulas										
											.map((t) => (
												<FilaFormula
													Formula={t} 
													editar={this.editar}
													ver={this.ver}
													
												/>
											)):('')}
									</Table.Body>
								</Table>
							</div>
						</React.Fragment>
						
					)}
					
				</React.Fragment>
				
			);
	}
}
