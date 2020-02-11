//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Loader, Table, Dropdown, TextArea, Grid, Button } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import Inputdate from './Inputdate';
import FilaDetalle from './FilaDetalle';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import {DateInput} from 'semantic-ui-calendar-react';

const options = [
	
	{
		key: 'paquete',
		text: 'PAQUETE',
		value: 'paquete',
	  },
	  {
		key: 'items',
		text: 'ITEMS',
		value: 'items',
	  },
]

export default class NuevaOrden extends Component {
	state = {
		loafing:false,
		from_agency: 0,
		to_agency:0,
		nombre: "",		
		equipo_id:"",
		buttonactive:false,
		items:[],
		detalle:[],
		id:0,
		item:0,
		show:false,
		getmem:null,
		guardarmem:null,
		date: "",
		empleado:0,
		from_orden:false,
		insumoscont:2,
		guardar:true,
		visilee:false,
		defaultdate: new Date(),
		descripcion:"",
		marcas:[],
		marca:0
	};
	 
	
    

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}


	guardarcantidad = (id, cantidad) => {
		let detalle = this.state.detalle

		if (cantidad!=""){
		detalle.map((linea, i)=> (
		
			linea.id == id ? linea.cantidad = parseInt(cantidad) : false		

		));		
		}else{
			detalle.map((linea, i)=> (
		
				linea.id == id ? linea.cantidad = "" : false		
	
			));	
		}
		//console.log(insumos)
		this.setState(
			{
				detalle:detalle
			})
		
	};
	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 //console.log(dte)

	};

	trataEquipo= (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			
		}));
	};

	trataFormulas= (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.nombre,
			
		}));
	};

	trataMarcas= (marcas) => {
		return marcas.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.nombre,
			
		}));
	};



	async empleados(){
		if(this.props.getmem('empleados')===undefined){
			
				try {
					
					let res = await Axios.get(FUNCIONES.empleados);
					let empleados = res.data
					empleados = this.trataEquipo(empleados)
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


	quitarlink(text){
		const resp = text.split('>')
		const textresp = resp[1].split('<');
		return textresp[0];
	}



	async marcas(){
		
			
				try {
					
					let beneficiarios
		
					//console.log(this.getmem("vendibles"))
					if(this.props.getmem("marcas")===undefined){
					let res = await Axios.post(`${FUNCIONES.beneficiarios}`,'{"draw":"1", "start":"0","length":"300","desde":"0","hasta":"0","scope":"clients"}')
					
					//console.log(res.data)
						beneficiarios = res.data.data
						let marcas=[]
						
						console.log(beneficiarios.length)
						for (var _i = 0; _i < beneficiarios.length; _i++) {
							//console.log(beneficiarios[_i].DT_RowId)
							let id = beneficiarios[_i].DT_RowId
							id = id.split("-")
							let bene = {id:id[2], nombre:this.quitarlink(beneficiarios[_i].name), tin:beneficiarios[_i].tin}
							marcas.push(bene)
						}

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

	

	async componentDidMount() {
		let user = isLoggedIn();
		this.setState({
			islogin: user
		});

		let userdata={group_id:0}

		userdata = getUser()

		this.setState({
			userdata: getUser()
		});
		
			let { action, agencias, vendibles, getmem, guardarmem  } = this.props;
			this.setState ({
				getmem, guardarmem, vendibles, action, agencias,Selectequipo:this.Selectequipo, Selectempleado:this.Selectempleado, Selectmarca:this.Selectmarca
				
			});
				let res = await this.empleados();
				res = await this.equipos();
				res = await this.marcas();
				let id = parseInt(this.props.id)
				let detalle = []
				let linedet
				
			
				
						this.setState({
							guardarcantidad:this.guardarcantidad,
						
					});
				
			
					
					
					this.setStateAsync({show:true})			
			
    
}



	SeleccionarTipo = (e, item) => {
		
		this.setState(
			{
                empleadoid:item.value,
				empleado:item
			})
	};

	Selectequipo = (e, item) => {
		//console.log(item)
		this.setState(
			{
                equipo_id:item.value
			})
		
	};

	Selectempleado = (e, item) => {
		
		this.setState(
			{
                empleado:parseInt(item.value)
			})
		
	};

	Selectmarca = (e, item) => {
		console.log(item)
		this.setState(
			{
                marca:parseInt(item.value)
			})
		
	};

	esunico = (e, item) => {
		
		let un = null;

		item.checked ==true ? un =true: un=false; 

		this.setState(
			{
                unico:un,
               
			})
	};

	selectitem=(e, item) => {
	
		this.setState(
			{
                item:item.value,
               
			})
	
	}

	esunicol = (e, item) => {
		
		let insumos = [];
		insumos = this.state.insumos
		//console.log(item)
		let id = item.id;
		id = id.toString().split("_");	
		//console.log(id)	
		if (item.checked)
		this.state.insumos.map((insumo, i)=> (
			//console.log(invoice)
			insumo.id == id[1] ? insumo.unico = true : false		

		));
		else
		insumos.map((insumo, i)=> (
			//console.log(invoice)
			insumo.id == id[1] ? insumo.unico = false : false		

		));
		
		//console.log(this.state.insumos);
			
		this.setState(
			{
				insumos:insumos
			})
	};

	

	buscariitem = (id, items) => {
		
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};

	
	buscarag = (id) => {
		let name = null
		this.state.agencias.map((agencia, i)=> (
		
			agencia.id == id  ? name = agencia.name :  false	

		));		
		
		return name
	};



	

	tipoinsumo = (e, item) => {
		//console.log(item)
		let tipo_insumo
		let items;
		tipo_insumo= item.value

		if(tipo_insumo=='paquete'){
			items = this.state.vendibles
		}else{
			items = this.state.comprables
		}
	
		this.setState({
			tipo_insumo: tipo_insumo,
			items:items,
			buttonactive:true,
		});
		
		
	};

	selecAg = (e, item) => {
		//console.log(item)
		//let agencia
		this.setState({
			[item.name]:item.value		
			
		});
		

		
	};

	
	
	  guardar_orden = async () => {
	
		this.setState({
			loading: true
        });
        
       
	
		// Ciclo de llamadas
		
			try {
				let guardar=true;			
				let orden ={}
				orden.fecha = this.state.date
				
				orden.equipo_id = this.state.equipo_id
				orden.employee_id = this.state.empleado
				orden.store_id =this.state.userdata.store
				orden.detalles = this.state.descripcion
				orden.item_id = this.state.item,
				orden.payee_id= this.state.marca
				orden.estado="pendiente"
				
				
				console.log(orden)
				
				
				if((orden.fecha!=="") && (orden.descripcion!="")   && (orden.equipo_id!="")&& (orden.employee_id!="")  ){
					
					let fecha = orden.fecha.split('-');
					orden.fecha = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
					
					
					let poststr = JSON.stringify(orden)
					//console.log(poststr)
					let data;
						guardar ?  data = await Axios.post(FUNCIONES.guardarpedido, poststr) : null
						let res =data.data
						//console.log(res)
						if (res.response.id!==undefined){
							this.setState({
								loading:false,
								visible:true,
								
							});
						}else{
							this.setState({
								loading:false,
								visiblee:true,
								errormsj:"Sus datos no se guardaron, contacte al Administrador"
							});
						}	


				}else{
					this.setState({
						loading:false,
						visiblee:true,
						errormsj:"Llene todos los datos del formulario"
					});
				}
			
				//console.log(data)
			} catch (error) {
				console.error({ error });
				
			} finally {
			
			
			
			}
		
		
		};
		
	

		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/pedidos/')
		}

		onConfirme = ()=>{
			this.setState({				
			
				visiblee:false
			});
			//navigate('/app/formulas/')
		}
		
		handleDateChange = (event, {name, value}) => {
			console.log(value)
			if (this.state.hasOwnProperty(name)) {
			  this.setState({ [name]: value });
			}
		  }

		
        
        handleInputChange = event => {
            const target = event.target
            const value = target.value
            const name = target.name
        
            this.setState({
              [name]: value,
            })
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.guardar_orden()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					
		saveDate = (date, name) => {
			
			this.setState({
				[name]: date
			  })
					  }
				

	render() {
		
		let { items} = this.props
		//console.log(items)
		
		
		let {
		loading, equipos, action, Selectequipo, Selectempleado, equipo_id, empleados, empleado, marca, marcas, Selectmarca, item
			
		} = this.state;
		if (loading) {
			return <Loader active inline="centered" />;
		} else
		
			if(action=='view')
				return(
					<div >
				
							
				</div>
				)
			else if (action=='edit')
				return (
					<div >
					
				</div>
					
				
			)
			else
			return(
				<div >
					<form onSubmit={this.handleSubmit}>
						<Grid columns={3}>
					<Grid.Row>
						<Grid.Column> <label>Fecha<DateInput
							name="date"
							placeholder="Date"
							value={this.state.date}
							iconPosition="left"
							onChange={this.handleDateChange}
							/>
						</label></Grid.Column>
						
			<Grid.Column><label>Empleado: <Dropdown
					value={empleado}
					placeholder='Equipo'
					onChange={Selectempleado}				
					selection
					search
					options={empleados}
					className="ui segment"
				/></label> </Grid.Column>
	        <Grid.Column><label>Equipo<Dropdown
						value={equipo_id}
						placeholder='Equipo'
						onChange={Selectequipo}					
						selection
						options={equipos}
						className="ui segment"
					/></label></Grid.Column></Grid.Row>
					
						</Grid>
					<Grid columns={2}>
					<Grid.Row>
					<Grid.Column><label>Tipo: <Dropdown
					value={item}
					placeholder='Equipo'
					onChange={this.selectitem}				
					selection
					search
					options={items}
					className="ui segment"
				/></label></Grid.Column>
				<Grid.Column><label>Marca: <Dropdown
					value={marca}
					placeholder='Equipo'
					onChange={Selectmarca}				
					selection
					search
					options={marcas}
					className="ui segment"
				/></label></Grid.Column>
					</Grid.Row>
				    <Grid.Row>
					<Grid.Column>	
					<TextArea 
					placeholder='Descripción' 
					name={"descripcion"} 
					className="ui segment" 
					rows="3" 
					onChange={this.handleInputChange} />
					</Grid.Column>
					</Grid.Row>
					</Grid>
				
				
				<Button type="submit" variant="primary" className="submitform" 	>Guardar</Button>
				</form>
				<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
				<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
				</div>
			
			)
	
}
}