//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Loader, Pagination, Grid, Menu, Icon, Button, Dropdown } from 'semantic-ui-react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import sortBy from 'lodash/sortBy';
import {  getUser} from "../utils/identity"
import { navigate } from '@reach/router';
import Inputdate from './Inputdate';
import { isThisSecond } from 'date-fns';

const options = [
	
	{
		key: 'dia',
		text: 'Día',
		value: 'dia',
	  },
	  {
		key: 'noche',
		text: 'Noche',
		value: 'noche',
	  },
]

export default class ReporteBobinas extends Component {
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
		emppleados:[],
		marcas:[],
		estado:'espera',
		codigo:'',
		madre:'',
		empleado:"",
		marca:"",
		fechahora_ini: "",
		fechahora_fin: "",
		turno:"",
		options:options,
		equipo_id:0,
		equipos:[]
		
	
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
			key: t.name,
			value: t.name,
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
				let mar = await this.marcas()
				mar = await this.empleados();
				mar = await this.equipos();

                //console.log(FUNCIONES.ordenes)
				Axios.get(FUNCIONES.reportebobinas+"?empleado=&marca=&turno=&fini=&ffin=&codigo=&madre=&equipo=")
					.then(({ data }) => {
						let Items=[]
					
						let Resp =  data.items
						//console.log(Ordenes)

						for (let Item in Resp) {
							let itemex={codigo:Resp[Item].codigo,nombre:Resp[Item].nombre,peso:Resp[Item].peso,madre:Resp[Item].madre,marca:Resp[Item].marca,empleado:Resp[Item].empleado,fecha:Resp[Item].fecha,hora:Resp[Item].hora,equipo:Resp[Item].equipo}
							Items.push(itemex);
						}

						
					
						this.setState({
							Items:Items,
							
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
		const { column, Items, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				Invoices: sortBy(Items, [ clickedColumn ]),
				direction: 'ascending'
			});

			return;
		}

		this.setState({
			Items: Items.reverse(),
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

	  trataMarcas= (marcas) => {
		return marcas.map((t) => ({
			key: t.nombre,
			value: t.nombre,
			text: t.nombre,
			
		}));
	};

	  async marcas(){
		
			
		try {
			
			let beneficiarios

			//console.log(this.getmem("vendibles"))
			if(this.props.getmem("marcas")===undefined){
			let res = await Axios.post(`${FUNCIONES.beneficiarios}`,'{"draw":"1", "start":"0","length":"300","desde":"0","hasta":"0","scope":"clients"}')
			
			
				beneficiarios = res.data.data
				let marcas=[]
				
				
				for (var _i = 0; _i < beneficiarios.length; _i++) {
					//console.log(beneficiarios[_i].DT_RowId)
					let id = beneficiarios[_i].DT_RowId
					id = id.split("-")
					let bene = {id:id[2], nombre:this.quitarlink(beneficiarios[_i].name), tin:beneficiarios[_i].tin}
					marcas.push(bene)
				}
				let bene = {id:"", nombre:"Todos", tin:0}
				marcas.push(bene)
				console.log(marcas)
				marcas= this.trataMarcas(marcas)
				this.setState({
					marcas:marcas
					
				});
			}else{
				//console.log(this.props.getmem('empleados'))
				let marcas= this.trataMarcas(this.props.getmem('marcas'))
				
				this.setState({
					
					marcas:marcas
					
				});
				return true
			}
			
		
		}catch(error) {
			console.error(error);
			return false
		};

	
}
	
	async empleados(){
		if(this.props.getmem('empleados')===undefined){
			
				try {
					
					let res = await Axios.get(FUNCIONES.empleados);
					
					let empleados = res.data
					empleados.push({id:"",name:"Todos"})
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
	limpiar = async ()=>{
		this.setState({
			empleado:"",
			marca:"",
			codigo:"",
			madre:"",
			fechahora_ini:"",
			fechahora_fin:"",
			equipo_id:0,
			turno:""
			
		});

		Axios.get(FUNCIONES.reportebobinas+"?empleado=&marca=&turno=&fini=&ffin=&codigo=&madre=&equipo=")
		.then(({ data }) => {
			let Items=[]
		
			let Resp =  data.items
			//console.log(Ordenes)

			for (let Item in Resp) {
				let itemex={codigo:Resp[Item].codigo,nombre:Resp[Item].nombre,peso:Resp[Item].peso,madre:Resp[Item].madre,marca:Resp[Item].marca,empleado:Resp[Item].empleado,fecha:Resp[Item].fecha,hora:Resp[Item].hora,}
				Items.push(itemex);
			}

			
		
			this.setState({
				Items:Items,
				
				loading: false,							
				cantidadPaginas: Math.floor(Items.length / this.state.first) + 1
			});
		})
		.catch((error) => {
			console.error(error);
		});
		
	}

	Selectequipo = (e, item) => {
		//console.log(item)
		this.setState(
			{
                equipo_id:item.value
			})
		
	};

	trataEquipo= (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			
		}));
	};


	async equipos(){
		if(this.props.getmem('equipos')===undefined){
			let userdata = getUser()
				try {
					
					let res = await Axios.get(FUNCIONES.equipos+"?id=3");
					let equipos = res.data
					equipos = this.trataEquipo(equipos)
					console.log(equipos)
					this.props.guardarmem('equipos', equipos);
					
					this.setState({
						equipos: equipos,
						
					});

					//cargar formula
					return true
					
				
				}catch(error) {
					console.error(error);
					return false
				};
			}else{
				//console.log(this.props.getmem('equipos'))
				this.setState({
					equipos:this.props.getmem('equipos')
					
				});
				return true
			}
	}
	

		cargarxistencias = async ()=>{

			
			Axios.get(FUNCIONES.reportebobinas+"?empleado="+this.state.empleado+"&marca="+this.state.marca	+"&turno="+this.state.turno+"&fini="+this.state.fechahora_ini+"&ffin="+this.state.fechahora_fin+"&codigo="+this.state.codigo+"&madre="+this.state.madre+"&equipo="+this.state.equipo_id)
			.then(({ data }) => {
				
				//console.log(data)
				let Items = data.items;			
				
				

				//console.log(Ordenes)
				
				this.setState({
					Items: Items,
					
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
			
			this.setState({
			  [name]: value,
			})
		  }

		  Selectempleado = (e, item) => {
	
			this.setState(
				{
					empleado:item.value
				})
			
		};

		Selectturno = (e, item) => {
	
			this.setState(
				{
					turno:item.value
				})
			
		};

		Selectmarca = (e, item) => {
			//console.log(item)
			let marca = item.value
		
			this.setState(
				{
					marca:marca
				})
	
			
			
		};

		saveDate = (date, name) => {
			
			this.setState({
				[name]: date.toLocaleString('eu-ES',{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"America/Guatemala"})
			  })

			  //console.log(this.state[name])
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
			codigo, madre, empleado, marca, empleados, marcas, options, turno, equipos, equipo_id
		} = this.state;
		let pesototal=parseFloat("0");
	
		Items.map((t) => (
			pesototal=pesototal + parseFloat(t.peso )
		))

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					<label>
          Buscar :
          <input type="text" value={this.state.buscar} onChange={this.handleChange} />
        </label><React.Fragment>
			<Grid columns={6}>
				<Grid.Row>
					<Grid.Column>{
			<input
			type="text"
			name="codigo"
			value={codigo}
			onChange={this.handleInputChange}
			className="inputform"
			placeholder="Código"
		  />}</Grid.Column>
		  <Grid.Column>{
			<input
			type="text"
			name="madre"
			value={madre}
			onChange={this.handleInputChange}
			className="inputform"
			placeholder="Madre"
			
		  />}</Grid.Column>
		  <Grid.Column><Dropdown
		  value={empleado}
		  placeholder='Impresor'
		  onChange={this.Selectempleado}				
		  selection
		  search
		  options={empleados}
		  className="ui segment"
	  /></Grid.Column>
	  <Grid.Column>
		  <Dropdown
						value={marca}
						placeholder='Marca'
						onChange={this.Selectmarca}
						search
						fluid
						selection
						
						options={marcas}
						/></Grid.Column>
						<Grid.Column>Desde:  <Inputdate
			date={""}
			//guardar={this.props.guardar}
			name={"fechahora_ini"}
			guardar={this.saveDate}
			
	/></Grid.Column><Grid.Column>Hasta: <Inputdate
	date={""}
	//guardar={this.props.guardar}
	name={"fechahora_fin"}
	guardar={this.saveDate}
	
/></Grid.Column>
	  
				</Grid.Row ><Grid.Row columns={6}>
				<Grid.Column><Dropdown
		  value={turno}
		  placeholder='Turno'
		  onChange={this.Selectturno}				
		  selection
		  search
		  options={options}
		  className="ui segment"
	  /></Grid.Column><Grid.Column><Dropdown
	  value={equipo_id}
	  placeholder='Equipo'
	  onChange={this.Selectequipo}					
	  selection
	  options={equipos}
	  className="ui segment"
  /></Grid.Column><Grid.Column></Grid.Column>
					<Grid.Column>
		  <Button
								
		  class="ui orange button"
		  onClick={() => {
			this.cargarxistencias( );
		  }}								
		  icon
		  labelPosition="right"
	  >
<Icon name="search" />
		  Buscar
  </Button> </Grid.Column><Grid.Column><Button
								
								class="ui orange button"
								onClick={() => {
								  this.limpiar( );
								  
								}}								
								icon
								labelPosition="right"
							>
					  <Icon name="repeat" />
								Limpiar
						</Button></Grid.Column>
					<Grid.Column><ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className=""
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Exportar a Excel"/></Grid.Column>
					</Grid.Row>
			</Grid>
		</React.Fragment>
					{Items.length === 0 ? (
						<React.Fragment>
					
				
						<Header as="h2">No hay Existencias</Header>
						</React.Fragment>
					) : (
						<React.Fragment>
						
						
							<div className="pt-8">
								<Header>Reporte de Bobinas</Header>
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
								
								<Table id="table-to-xls" sortable celled>
									<Table.Header>
									<Table.Row>
																				
										<Table.HeaderCell
											sorted={column === 'codigo' ? direction : null}
											onClick={this.handleSort('codigo')}
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
											sorted={column === 'madre' ? direction : null}
											onClick={this.handleSort('madre')}
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
											sorted={column === 'peso' ? direction : null}
											onClick={this.handleSort('peso')}
										>
											Peso
										</Table.HeaderCell>
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
											Fecha
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'hora' ? direction : null}
											onClick={this.handleSort('hora')}
										>
											Hora
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
												'{t.madre}
											</Table.Cell>
											<Table.Cell>
												{t.nombre}
											</Table.Cell>
											<Table.Cell>
												{t.marca}
											</Table.Cell>
											<Table.Cell>
												{t.peso}
											</Table.Cell>
											<Table.Cell>
												{t.empleado}
											</Table.Cell>
											<Table.Cell>
												{t.equipo}
											</Table.Cell>
											<Table.Cell>
												{t.fecha}
											</Table.Cell>
											<Table.Cell>
												{t.hora}
											</Table.Cell>
											<Table.Cell>
											
											</Table.Cell>
											</Table.Row>

											</React.Fragment>
											))}
											<Table.Row>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
												{pesototal}
											</Table.Cell>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
												
											</Table.Cell>
											<Table.Cell>
											
											</Table.Cell>
											</Table.Row>

									</Table.Body>
								</Table>

								
							</div>
							
						</React.Fragment>
						
					)}
					
				</React.Fragment>
				
			);
	}
}
