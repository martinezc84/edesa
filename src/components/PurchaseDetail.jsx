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
		Cells:[],
		date: new Date(),
		visible:false,
		userdata:null,
		first:0,
		productos:[]
	
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

		this.agregarlinea("");
		
		
			let { guardar, valores, seleccionadosVendidosID,  empleados } = this.props;
		
		
	}


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

	agregarlinea=(codigo)=>{
		//console.log(codigo)
		if(codigo!=""){
		let codigos = [...this.state.productos, codigo];
		
		//console.log(codigos)
		this.setState({
			productos:codigos,
			
		});
		
		}

		let items = [...this.state.Cells];
		let id = this.state.first + 1
		//console.log(id)
		
  items.push({
    id:id,codigo:"name"
	});
	
	this.setState({
		Cells:items,
		first:id
  });
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
			direction,
			Cells
		} = this.state;
//console.log(Cells)
		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					
					
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Orden de compra</Header>
							

							
								
								<Table sortable celled>
									<Table.Header>
									<Table.Row>
									
										
										<Table.HeaderCell
											sorted={column === 'o' ? direction : null}
											onClick={this.handleSort('o')}
										>
											Tag
										</Table.HeaderCell>
										
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Cells
											.map((t) => (
												<FilaDetalle
													
													fila={t}
													agregarlinea={this.agregarlinea}
												
		
													
												/>
											))}
									</Table.Body>
								</Table>
							</div>

							
								<Button
									size="massive"
									primary
									onClick={ ()=>{
										
										this.agregarlinea("")}	
									}							
									icon
									labelPosition="left"
								>
								<Icon name="cogs" />
									Agregar Linea
								</Button>

							

							
						</React.Fragment>
						
					
					<MostrarMensaje titulo={'Los mandados fueron creados con exito'} mensajes={'Prueba'}  visible={this.state.visible} onConfirm={this.onConfirm} />
				</React.Fragment>
				
			);
	}
}
