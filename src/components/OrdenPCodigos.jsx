//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Loader, Table, Dropdown, TextArea, Button, Grid } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import Inputdate from './Inputdate';
import FilaDetalle from './FilaDetalle';
import Barcode from 'react-barcode'
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';




export default class OrdenP extends Component {
	state = {
		loafing:false,
		from_agency: 0,
		to_agency:0,
		nombre: "",		
		equipo_id:"",
		buttonactive:false,
		items:[],
		detalle:[],
		equipos:[],
		empleados:[],
		generados:[],
		id:0,
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
		fechahora_entrega:new Date(),
		orden:{fecha:'',fechahora_entrega:'',employee_id:0,descripcion:'',},
		itemsgenerados:[],
		codigos:[]

				
	};
	 
	printOrder = () => {
		const printableElements = document.getElementById('barcodes').innerHTML;
		const orderHtml = '<html><head><title>Barcode</title></head><body>' + printableElements + '</body></html>'
		const oldPage = document.body.innerHTML;
		document.body.innerHTML = orderHtml;
		window.print();
		document.body.innerHTML = oldPage
		return false;
	}
   

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}


	guardarcantidad = (id, cantidad) => {
		let detalle = this.state.detalle
		detalle.map((linea, i)=> (
		
			linea.id == id ? linea.cantidad = parseInt(cantidad) : false		

		));		
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

	async formulas(){
		let res = await Axios.get(FUNCIONES.formulas+'?id=4');
		
						
						let Formulas = res.data;						
						Formulas = this.trataFormulas(Formulas)
						//console.log(Formulas)
						this.setState({
							Formulas: Formulas,
							
						});

			return true;
						}

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

	async equipos(){
		if(this.props.getmem('equipos')===undefined){
			let userdata = getUser()
				try {
					
					let res = await Axios.get(FUNCIONES.equipos+"?id=3");
					let equipos = res.data
					equipos = this.trataEquipo(equipos)
					//console.log(equipos)
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
		let itemsgenerados=[]
		userdata = getUser()

		this.setState({
			userdata: getUser()
		});
		
			let { action, agencias, vendibles, getmem, guardarmem  } = this.props;
			this.setState ({
				getmem, guardarmem, vendibles, action, agencias,Selectequipo:this.Selectequipo, Selectempleado:this.Selectempleado
				
			});
				let res = await this.empleados();
				res = await this.equipos();
				res = await this.formulas();
				let id = parseInt(this.props.id)
				let lineid = parseInt(this.props.lineid)
				
				let detalle = []
				let linedet
				//console.log(id)

				if(id>0){
			try {
			   let resp =await Axios.get(FUNCIONES.orden+"?id="+id)
					let data =resp.data
					//console.log(data)
					let from_orden
				
					let orden =data
					let detalle = data.detalle
					let generados = data.generados
					//let formulas = data.formulas
					let recursos=[]
					let series=[]
					let codigos=[]
					let from_agency
					for(let linea in generados){
						if(generados[linea].orden_line_id==lineid){
							codigos.push({code:generados[linea].codigo, nombre:generados[linea].nombre})
						}
									
					}
					console.log(codigos)

					this.setState({
						orden,
						detalle,
						//formulas,
						series,
						recursos,
						from_agency:from_agency,
						from_orden:from_orden,
						fechahora_entrega:new Date(orden.fechahora_entrega),
						itemsgenerados:itemsgenerados,
						generados,
						codigos
					});
				}
				catch(error)  {
					console.error(error);
				};
				}
			
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
		let orden = this.state.orden

		orden.equipo_id = item.value
		this.setState(
			{
               orden:orden
			})
		
	};

	Selectempleado = (e, item) => {
		let orden = this.state.orden

		orden.employee_id = item.value
		this.setState(
			{
                orden:orden
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
		let id = item.id
		this.state.detalle.map((linea, i)=> (
			//console.log(invoice)
			linea.id == id ? linea.formula_id = parseInt(item.value) : false		

		));
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

	buscarempleado = (id) => {
		let name = null
		id = parseInt(id)
		this.state.empleados.map((empleado, i)=> (
		
			empleado.key == id  ? name = empleado.text :  false	

		));		
		
		return name
	};

	buscareequipo = (id) => {
		let name = null
		id = parseInt(id)
		this.state.equipos.map((equipo, i)=> (
		
			equipo.key == id  ? name = equipo.text :  false	

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
				let fechahora_entrega = this.state.fechahora_entrega
				let lineasaproducir=[]
				this.state.detalle.map((linea, i)=> (
						
					linea.formula_id>0 ? lineasaproducir.push(linea) : false
		
				));	
				let orden  = this.state.orden
				//console.log(orden)

				orden.detalle.map((linea, i)=> (
					//console.log(invoice)
					delete linea.nombre		
		
				));
				
				
				if((orden.fecha!=="") && (orden.descripcion!="") && (orden.fechahora_entrega!==undefined) && (orden.orden_id>0) && (orden.equipo_id!="")&& (orden.detalle.length>0)  ){
					
					orden.detalle.map((linea, i)=> (
		
						guardar = linea.cantidad>0 ? true : false
			
					));	

					
					delete orden.fecha_crea
					delete orden.formulas
					delete orden.fecha
					//let fecha = orden.fecha.split('-');
					//orden.fecha = fecha[2]+'/'+fecha[1]+'/'+fecha[0]
					//orden.fechahora_entrega = new Date(orden.fechahora_entrega)
					let fechastr = fechahora_entrega.toLocaleDateString('en-US');
					let horastr = fechahora_entrega.getHours();
					let minutes = fechahora_entrega.getMinutes();
					//console.log(fechastr)
					//console.log(minutes)
					let fecha = fechastr.split('/');
					orden.fechahora_entrega = fecha[2]+'/'+fecha[0]+'/'+fecha[1]+" "+horastr+":"+minutes
					let poststr = JSON.stringify(orden)
					//console.log(poststr)
					//console.log(orden)
					let data;
						guardar ?  data = await Axios.post(FUNCIONES.editarorden, poststr) : null
						let res =data.data
						//console.log(res)
						if (res.response!==undefined){
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
		
	
		agregar_linea = () =>{
			let id =this.state.insumoscont;
			let linedet = {id:id,  formula_id:0,item_bundle_name:"",quantity:0,cantidad:0}
			
			id++;
			let detalle = [...this.state.detalle, linedet]

		//console.log(insumos)
		this.setState(
			{
				detalle:detalle,
				insumoscont:id
			}
			
		);		
			
		}
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/ordenesp/')
		}

		onConfirme = ()=>{
			this.setState({				
			
				visiblee:false
			});
			//navigate('/app/formulas/')
		}

		codigos = ()=>{
			this.setState({				
			
				action:"pdf"
			});
		
		}

		regresar = ()=>{
			navigate('/app/ordenesp/')
			
		}
		
		handleDateChange = (event, {name, value}) => {
			let orden = this.state.orden
			orden.fecha = value
			this.setState({				
				orden:orden
			});
		  }

		
        
        handleInputChange = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let orden = this.state.orden
			orden.descripcion = value
        
            this.setState({
              orden:orden
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
				fechahora_entrega:date
			});
					  }

					  createTable = () => {
						let table = []
						let children = []
						// Outer loop to create parent
						let x=1
						for (let item in  this.state.itemsgenerados ) {
						  
						  //Inner loop to create children
						  
							children.push(<Grid.Column><Barcode 
								value={this.state.itemsgenerados[item].code}
								format="CODE128"
								/></Grid.Column>)
						  
						  //Create the parent and add the children
						  x++
						  if(x==3){
							table.push(<Grid.Row >{children}</Grid.Row>)
							children=[]
							x=1
						  }
						  
						}
						if(x>1){
							table.push(<Grid.Row>{children}</Grid.Row>)
							
						  }
						return table
					  }			  
				

	render() {
		
		let { items, itemst, agencias } = this.props
		
		items = [items,...itemst]
		let { orden, loading,  codigos 
		
		} = this.state;
		orden.employee_id = parseInt(orden.employee_id.toString())


		
		if (loading) {
			return <Loader active inline="centered" />;
		} else
		
		return (
				<div >
					<Button type="button" variant="primary"  className="submitform" onClick={() => {
							this.regresar();
						}}	>Regresr</Button>
					
				<div id={"printable"}>
				<div id="barcodes" >
				

				<Grid columns={1}>
				{codigos
						.map((t) => (
							<Grid.Row ><Grid.Column><Barcode 
							value={t.code}
							format="CODE128"
							/></Grid.Column></Grid.Row>
						))

				}</Grid>
				
				</div>
				</div>
				</div>
			)
			

			
			
	
}
}