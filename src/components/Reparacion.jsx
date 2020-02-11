//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Segment, Label,Input, Header, Table, Loader, Pagination, Button, Menu, Icon, Grid, Dropdown } from 'semantic-ui-react';
import FilaOrden from './FilaOrden';
import sortBy from 'lodash/sortBy';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';

const options = [
	
	{
		key: 'malo',
		text: 'Malo',
		value: 'malo',
	  },
	  {
		key: 'bueno',
		text: 'Bueno',
		value: 'bueno',
	  },
	  {
		key: 'desecho',
		text: 'Desecho',
		value: 'desecho',
	  },
]

export default class Reparacion extends Component {
	state = {
		Invoices: [],
		
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
		userdata:null,
		Items:[],
		Pesos:[],
		estado:'espera',
		idrep:0,
		item:{},
		options:options
	
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}


	


	// Método para seleccionar o des seleccionar checkbox de turnos


	quitarlink(text){
		const resp = text.split('>')
		const textresp = resp[1].split('<');
		return textresp[0];
	}

	get_cliente(text){
		const resp = text.split('vendors/')
	
		const textresp =  resp[1].substring(0,6);
		return textresp;
	}

	trataEmpleados = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			todo: t
		}));
	};

	buscariitem = (id, items) => {
		console.log(items)
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};

	
	estado = (e, item) => {
		//console.log(item)
		
		let i = this.state.item;
		i.estado= item.value
	
		this.setState({
			
			item:i,
		});
		
		
	};
	




	async componentDidMount() {
		
		let { tipo } = this.props;

		let { buscar } = this.state;

		let user = getUser();
		this.setState({
			userdata: user
		});
		
	
	
				this.setState({
					loading: true
				});
				

                //console.log(FUNCIONES.ordenes)
				Axios.get(FUNCIONES.existencias+"?store_id=4&agg=r")
					.then(({ data }) => {
						let Items=[]
					
					
						let Resp =  data.items
					
						//console.log(Ordenes)

						/*for (let Item in Resp) {
							let itemex={codigo:Resp[Item].code,nombre:Resp[Item].name,peso:Resp[Item].peso,cantidad:Resp[Item].quantity}
							Items.push(itemex);
						}*/

						
					
						this.setState({
							Items:Resp,
							loading: false,							
							cantidadPaginas: Math.floor(Resp.length / this.state.first) + 1
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



	handleChange=(event)=> {
		
		let {  seleccionadosVendidosID } = this.state;

		let { guardar, } = this.props;
		if (event.target.value.length>4){
			
		}
		this.setState({
				
			buscar:event.target.value
		});
		
		
	  }

	  handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		let i = this.state.item
		i.peso=value
		this.setState({
		  item: i,
		})
	  }

	  reparar(item)  {
		this.setState({
			idrep:1,	
			item:{codigo:item.codigo,peso:item.peso,orden:item.orden_id,estado:item.estado, id:item.id, item_id:item.item_id}
		});
	  }

	  guardar= async (item) => {
		this.setState({
			loading: true,
					
		});

		if(item.peso!="0.00"){		
		let items=[]
		let itemdata = {id:item.id, estado:item.estado, peso:item.peso}
		items.push(itemdata)
		//let resp = await Axios.post(FUNCIONES.deliver+"?id="+item.orden)
									let ordenstring = '{"id":'+item.orden+', "estado":"finalizada", "detalle":{},"generados":'+JSON.stringify(items)+'}'
									//console.log(ordenstring)
									let resp = await Axios.post(`${FUNCIONES.editarorden}`,ordenstring)
									resp = await Axios.post(FUNCIONES.editaritem+"?id="+item.item_id,'{"item":{"id":'+item.item_id+',"description":"bueno", "weight":"'+item.peso+'"}}')

									this.setState({
										loading: false,
										visible:true,
										idrep:0,
										item:{}
										
									});
		this.cargarxistencias('r');

		}else{
			alert("Peso no puede ser 0.00")
			this.setState({
				loading: false,
				
				
			});
		}
	  }

	

		cargarxistencias = async (agg)=>{
			this.setState({
				loading: true,
				
				
			});
			
			Axios.get(FUNCIONES.existencias+"?store_id=4&agg="+agg)
			.then(({ data }) => {
				
				//console.log(data)
				let Items = data.items;			
				
				

				//console.log(Ordenes)
				
				this.setState({
					Items: Items,
					agg:agg,
					loading: false,							
					cantidadPaginas: Math.floor(Items.length / this.state.first) + 1
				});
			})
			.catch((error) => {
				console.error(error);
				this.setState({
					loading: false,
					
					
				});
			});
		}
		



	render() {
		let {
			Items,
			loading,		
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction,
			idrep,
			item,
			options
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					<label>
          Buscar :
          <input type="text" value={this.state.buscar} onChange={this.handleChange} />
        </label>
					{Items.length === 0 ? (
						<React.Fragment>
					
				
						<Header as="h2">No hay Existencias</Header>
						</React.Fragment>
					) : (
						<React.Fragment>
						
						
							<div className="pt-8">
								<Header>Existencias y pesos</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Items: {Items.length}</Menu.Item>
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
																				
										<Table.HeaderCell
											sorted={column === 'code' ? direction : null}
											onClick={this.handleSort('code')}
										>
											Codigo
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'name' ? direction : null}
											onClick={this.handleSort('name')}
										>
											Nombre
										</Table.HeaderCell>
										
										
										<Table.HeaderCell
											sorted={column === 'peso' ? direction : null}
											onClick={this.handleSort('peso')}
										>
											Peso
										</Table.HeaderCell>
										<Table.HeaderCell
										
										>
											Accion
										</Table.HeaderCell>
										
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Items
											.slice(offset, first)
											.map((t) => (
												
											<React.Fragment>
											<Table.Row>
											<Table.Cell>
												{t.codigo}
											</Table.Cell>
											<Table.Cell>
												{t.nombre}
											</Table.Cell>
											
											<Table.Cell>
												{t.peso}
											</Table.Cell>
											<Table.Cell>
											<Button
								
								primary
								onClick={() => {
									this.reparar(
										t
									);
								}}								
								icon
								labelPosition="right"
							>
				<Icon name="band aid" />
								Reparar
						</Button>
											</Table.Cell>
											</Table.Row>

											</React.Fragment>
											))}
									</Table.Body>
								</Table>

							</div>
							
						</React.Fragment>
						
					)}
					{idrep === 1 ? (<React.Fragment>
						<Segment placeholder>
						<Grid columns={3}>
					<Grid.Row>			
						
			<Grid.Column><Label>Código:</Label>{item.codigo}</Grid.Column><Grid.Column>
				<label>
			  Peso:
			  <Input  label={{ basic: true, content: 'kg' }}
    labelPosition='right'
    type="text" placeholder="Peso"  name="peso"
                      value={item.peso}
				onChange={this.handleInputChange} />
			</label></Grid.Column>
			<Grid.Column>  <label>
			  Estado:
			  <Dropdown
					value={item.estado}
					placeholder='Estado'
					onChange={this.estado}
					search
					selection
					options={options}
					className="mr-sm-2"
					name="to_agency"
				/>
			</label></Grid.Column>
			</Grid.Row></Grid>
			<Grid columns={3}>
				<Grid.Row>
					<Grid.Column></Grid.Column>
					<Grid.Column><Button 
								positive					
								icon
								labelPosition="right"
								onClick={() => {
									this.guardar(
										item
									);
								}}
							>
				<Icon name="save" />
								Guardar
						</Button></Grid.Column>
					<Grid.Column></Grid.Column>
				</Grid.Row>
			</Grid>
			</Segment></React.Fragment>):(<React.Fragment></React.Fragment>) }
					
				</React.Fragment>
				
			);
	}
}
