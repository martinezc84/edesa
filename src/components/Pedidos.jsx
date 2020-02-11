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



export default class Pedidos extends Component {
	state = {
	    paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 20,
		offset: 0,
		step: 20,
		buscar:"",
		column: null,
		direction: null,
		empleados:[],
		marcas:[],
		startDate: new Date(),
		fechas:[],
		date: new Date(),
		visible:false,
		userdata:null,
		Pedidos:[],
		estado:'pendiente',
		marca:0,
		equipo:0
	
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}

	get_cliente(text){
		const resp = text.split('vendors/')
	
		const textresp =  resp[1].substring(0,6);
		return textresp;
	}


	buscariitem = (id, items) => {
		console.log(items)
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};
	


	get_empleado(id){
		for (var i=0; i<this.state.empleados.length; i++) {
			
            if (this.state.empleados[i].key==id){
				//console.log(this.state.empleados[i])
				return this.state.empleados[i].text;
			}
            //a b c
		}
		
		return null;
	} 

	get_marca(id, marcas){
		for (var i=0; i<marcas.length; i++) {
			
            if (marcas[i].id==id){
				//console.log(this.state.empleados[i])
				return marcas[i].nombre;
			}
            //a b c
		}
		
		return null;
	} 

	trataEmpleados = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			todo: t
		}));
	};

	async empleados(){
		if(this.props.getmem('empleados')===undefined){
			
				try {
					
					let res = await Axios.get(FUNCIONES.empleados);
					let empleados = res.data
					empleados = this.trataEmpleados(empleados)
					//console.log(res.data)
					this.props.guardarmem('empleados', empleados);
					this.props.guardar('empleados', empleados);
					this.setState({
						empleados: empleados,
						
					});

					//cargar formula
					return true
					
				
				}catch(error) {
					console.error(error);
					return false
				};
			}else{
				//console.log(this.props.getmem('empleados'))
				this.setState({
					empleados:this.props.getmem('empleados')
					
				});
				return true
			}
	}
	
	async componentDidMount() {
		
	

		let user = getUser();
		this.setState({
			userdata: user
		});

		
		
			let { guardar, valores,   empleados, marcas } = this.props;
			if (valores.length === 0) {
				this.setState({
					loading: true
				});
				
				if(marcas.length==0){
					marcas= this.props.getmem('marcas')
				}

				let res = await this.empleados();
				
                //console.log(marcas)
				Axios.get(FUNCIONES.pedidos+"?id="+user.store+"&eid=&li=25&ini=0&estado=pendiente")
					.then(({ data }) => {
						
						//console.log(data)
						let Pedidos = data;			
						
						Pedidos.map((orden, i)=> (
		
							orden.empleado = this.get_empleado(orden.employee_id)	
				
						));	

						Pedidos.map((orden, i)=> (
		
							orden.marca = this.get_marca(orden.payee_id, marcas)	
				
						));	

						//console.log(Ordenes)
						guardar('Pedidos', Pedidos);
						this.setState({
							Pedidos: Pedidos,
							loading: false,		
							marcas:marcas,					
							cantidadPaginas: Math.floor(Pedidos.length / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

					
			} else {
				this.setState({
					Ordenes: valores,
					
					cantidadPaginas: Math.floor(valores.length / this.state.first) + 1
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

	  

		cargarpedidos = async (estado)=>{

			
			Axios.get(FUNCIONES.pedidos+"?id="+this.state.userdata.store+"&eid=&li=25&ini=0&estado="+estado)
			.then(({ data }) => {
				
				
				let Pedidos = data;			
				
				Pedidos.map((orden, i)=> (

					orden.empleado = this.get_empleado(orden.employee_id)	
		
				));	

				Pedidos.map((orden, i)=> (
		
					orden.marca = this.get_marca(orden.payee_id, this.state.marcas)	
		
				));	

				//console.log(Ordenes)
				
				this.setState({
					Pedidos: Pedidos,
					estado:estado,
					loading: false,							
					cantidadPaginas: Math.floor(Pedidos.length / this.state.first) + 1
				});
			})
			.catch((error) => {
				console.error(error);
			});
		}
		
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/manados/')
		}

		 async generar  (id) {
			//let res = await Axios.get(FUNCIONES.orden+"?id="+id)
			//console.log(res.data)
			navigate('/app/orden/iniciar/'+id)
		}

		async continuar  (id) {
			//let res = await Axios.get(FUNCIONES.orden+"?id="+id)
			//console.log(res.data)
			navigate('/app/orden/terminar/'+id)
		}

		async aceptar(id){
			let poststr = '{"id":'+id+',"estado":"aceptada"}'
			let res =await Axios.post(FUNCIONES.editarpedido, poststr)
			this.cargarpedidos('aceptada')
		}

		async terminar(id){
			let poststr = '{"id":'+id+',"estado":"terminada"}'
			let res =await Axios.post(FUNCIONES.editarpedido, poststr)
			this.cargarpedidos('aceptada')
		}

		 crear_orden  (id) {
			//let res = await Axios.get(FUNCIONES.orden+"?id="+id)
			//console.log(res.data)
			navigate('/app/ordenp/view/'+id)
			
		}

		newo(){
			navigate('/app/nuevaorden/0')
		}

	render() {
		let {
			Pedidos,
			loading,		
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction,
			estado,
			marca,
			maquina,
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
					{Pedidos.length === 0 ? (
						<React.Fragment>
						<Button type="button" variant="primary"  className="submitform" onClick={() => {
						this.newo();
					}}	>Nuevo Pedido</Button>
					<Menu  inverted  widths={3}>
							<Menu.Item
							color={"blue"}
							active={estado=='pendiente'}
							onClick={() => {
								this.cargarpedidos('pendiente')
								
							}}
							name="Pendientes"
						></Menu.Item>
						<Menu.Item
						color={"orange"}
						active={estado=='aceptada'}
							onClick={() => {
								this.cargarpedidos('aceptada')
							}}
							name="Aceptadas"
						></Menu.Item>
						<Menu.Item
						
						active={estado=='realizada'}
							onClick={() => {
								this.cargarpedidos('realizada')
							}}
							name="Realizadas"
						></Menu.Item>
						
						</Menu>
						<Header as="h2">No hay Pedidos</Header>
						</React.Fragment>
					) : (
						<React.Fragment>
							<Button type="button" variant="primary"  className="submitform" onClick={() => {
							this.newo();
						}}	>Nuevo Pedido</Button>
						<Menu inverted  widths={3}>
							<Menu.Item
							active={estado=='pendiente'}
							color={"blue"}
							onClick={() => {
								this.cargarpedidos('pendiente')
							}}
							name="Pendientes"
						></Menu.Item>
						<Menu.Item
						color={"orange"}
						active={estado=='aceptada'}
							onClick={() => {
								this.cargarpedidos('aceptada')
							}}
							name="Aceptadas"
						></Menu.Item>
						<Menu.Item
						
						active={estado=='realizada'}
							onClick={() => {
								this.cargarpedidos('realizada')
							}}
							name="realizada"
						></Menu.Item>
						
						</Menu>
							<div className="pt-8">
								<Header>Pedidos</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de Ordenes: {Pedidos.length}</Menu.Item>
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
											sorted={column === 'empleado' ? direction : null}
											onClick={this.handleSort('empleado')}
										>
											Impresor
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'equipo' ? direction : null}
											onClick={this.handleSort('equipo')}
										>
											Equipo
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'fecha' ? direction : null}
											onClick={this.handleSort('fecha')}
										>
											Fecha Entrega
										</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'color' ? direction : null}
											onClick={this.handleSort('color')}
										>
											Color
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'marca' ? direction : null}
											onClick={this.handleSort('marca')}
										>
											Marca
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'product' ? direction : null}
											onClick={this.handleSort('product')}
										>
											Tipo
										</Table.HeaderCell>
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Pedidos
											.slice(offset, first)
											.map((t) => (
												<Table.Row>
										
												<Table.Cell>{t.empleado}</Table.Cell>
												<Table.Cell>{t.equipo}</Table.Cell>
												<Table.Cell>{t.fecha}</Table.Cell>
												<Table.Cell>{t.color}</Table.Cell>
												<Table.Cell>{t.marca}</Table.Cell>
												<Table.Cell>{t.product}</Table.Cell>
												<Table.Cell>
				
						{(estado=='pendiente') ?
						<Button
								
								primary
								onClick={() => {
									this.aceptar(
										t.id
									);
								}}								
								icon
								labelPosition="right"
							>
				<Icon name="cogs" />
								Iniciar
						</Button> : (estado=='aceptada') ? <Button
								
								class="ui orange button"
								onClick={() => {
									this.terminar(
										t.id
									);
								}}								
								icon
								labelPosition="right"
							>
				<Icon name="tasks" />
								Terminar
						</Button> : ('')}</Table.Cell>	
																		
												
													
											</Table.Row>
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
