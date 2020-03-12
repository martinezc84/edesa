//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaOrden from './FilaOrden';
import sortBy from 'lodash/sortBy';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class OrdenesP extends Component {
	state = {
		Invoices: [],
		
		paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 50,
		offset: 0,
		step: 50,
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
		estado:'espera'
	
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
				Axios.get(FUNCIONES.existencias+"?store_id=4&agg=3354")
					.then(({ data }) => {
						let Items=[]
						let Pesos=[]
					
						let Resp =  data.items
						let Pesosresp =  data.pesos
						//console.log(Ordenes)

						for (let Item in Resp) {
							let itemex={codigo:Resp[Item].code,nombre:Resp[Item].name,peso:Resp[Item].peso,cantidad:Resp[Item].quantity,referencia:Resp[Item].referencia,marca:Resp[Item].marca,empleado:Resp[Item].empleado, edit:false}
							Items.push(itemex);
						}

						for (let Item in Pesosresp) {
							//console.log(Pesosresp[Item])
							let peso={item:Item,total:Pesosresp[Item]}
							Pesos.push(peso);
						}
					
						this.setState({
							Items:Items,
							Pesos:Pesos,
							loading: false,							
							cantidadPaginas: Math.floor(Items.length / this.state.first) + 1
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

	  editar = async (codigo)=>{
		let Items = this.state.Items
		//console.log(codigo)
		Items.map((t)=>(
			t.codigo == codigo ? t.edit = true : false
		))

		this.setState({
				
			Items:Items
		});

	  }

	  guardar = async (codigo)=>{
		let Items = this.state.Items
		//console.log(codigo)
		let itemnuevo
		Items.map((t)=>(
			t.codigo == codigo ? itemnuevo = t : false
		))
			let itemdata
			let id
		await Axios.get(FUNCIONES.itemserie+"?serie="+codigo).then(({data})=>{
			//console.log(data)
			let descripcion = '{\\"madre\\":\\"'+itemnuevo.referencia+'\\", \\"marca\\":\\"'+itemnuevo.marca+'\\", \\"empleado\\":\\"'+itemnuevo.empleado+'\\"}'
			 itemdata = '{"item":{"id":"'+data.id+'","description":"'+descripcion+'"}}'
			id=data.id
			 console.log(itemdata)
		})
		
		let res = await Axios.post(FUNCIONES.editaritem+"?id="+id,itemdata);

		Items.map((t)=>(
			t.codigo == codigo ? t.edit = false : false
		))
		this.setState({
				
			Items:Items
		});

	  }

	

		cargarxistencias = async (agg)=>{

			
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
			});
		}
		
		handleInputChange = event => {
		
			const target = event.target
			const value = target.value
			const name = target.name
			const id = target.id
			let Items = this.state.Items
			console.log(id)
			Items.map((t)=>(
				t.codigo == id ? t.marca = target.value : false
			))

			this.setState({
				
				Items:Items
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
			Pesos
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
											sorted={column === 'referencia' ? direction : null}
											onClick={this.handleSort('referencia')}
										>
											Origen
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'name' ? direction : null}
											onClick={this.handleSort('name')}
										>
											Nombre
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'marca' ? direction : null}
											onClick={this.handleSort('marca')}
										>
											Marca
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'quantity' ? direction : null}
											onClick={this.handleSort('quantity')}
										>
											Cantidad
										</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'peso' ? direction : null}
											onClick={this.handleSort('peso')}
										>
											Peso
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'impresor' ? direction : null}
											onClick={this.handleSort('impresor')}
										>
											Impresor
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
												{t.referencia}
											</Table.Cell>
											<Table.Cell>
												{t.nombre}
											</Table.Cell>
											<Table.Cell>
											{(t.edit)?(<input
												placeholder="Marca"
												autoFocus
												type="text"
												name="marca"
												id={t.codigo}
												value={t.marca}
												onChange={this.handleInputChange}
												
												className="inputform"
											/>

											):(t.marca)}
											</Table.Cell>
											<Table.Cell>
												{t.cantidad}
											</Table.Cell>
											<Table.Cell>
												{t.peso}
											</Table.Cell>
											<Table.Cell>
												{t.empleado}
											</Table.Cell>
											<Table.Cell>
												
										{(t.empleado!=null)?(<Button 
																	
												icon
												labelPosition="right"
												onClick={() => {
													this.editar(
														t.codigo
													);
												}}
												
											>
											<Icon name="pencil" />
												Edit
										</Button>):('')}{(t.edit)?(<Button 
												positive					
												icon
												variant="secondary"
												labelPosition="right"
												onClick={() => {
													this.guardar(
														t.codigo
													);
												}}
												
											>
											<Icon name="disk" />
												Guardar
										</Button>):('')}
											
											</Table.Cell>
											</Table.Row>

											</React.Fragment>
											))}
											
									</Table.Body>
								</Table>

								Resumen
								<Table sortable celled>
									<Table.Header>
									<Table.Row>
																				
										<Table.HeaderCell
											sorted={column === 'code' ? direction : null}
											onClick={this.handleSort('code')}
										>
											Item
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'name' ? direction : null}
											onClick={this.handleSort('name')}
										>
											Total
										</Table.HeaderCell>
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Pesos
											.slice(offset, first)
											.map((t) => (
												
											<React.Fragment>
											<Table.Row>
											<Table.Cell>
												{t.item}
											</Table.Cell>
											<Table.Cell>
												{t.total}
											</Table.Cell>
											
											</Table.Row>

											</React.Fragment>
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
