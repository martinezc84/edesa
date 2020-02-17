//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES, descarte, production } from '../utils/utils';
import { Header, Table, Dropdown, Checkbox, Loader, Grid } from 'semantic-ui-react';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import Barcode from 'react-barcode'





export default class Iniciar extends Component {
	state = {
		referencias:[],
		desperdicios:[],
		rendimientos:[],
		lotes:[],
		consumidos:[],
		formulas:[],
		detalle:[],
		orden:null,
		insumoscont:1,
		despercont:1,
		ptcont:1,
		buttonactive:false,
		itemst:[],
		loading:false,
		date:new Date().toLocaleDateString('en-GB'),
		consumototal:0, 
		empleado:0,
		empleados:[]
				
	};
	
	
    

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 //console.log(dte)

	};

	trataMarcas= (marcas) => {
		return marcas.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.nombre,
			
		}));
	};

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
			
			console.log(res.data)
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
				console.log(marcas)
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

	

	async componentDidMount() {
	
		this.setState({
			userdata: getUser(),
			loading:true
		});
		let to_agency
			let { action, comprables, vendibles  } = this.props;
		
				let id = this.props.id
				let formula={}
				let formula_id
				let resp = await Axios.get(FUNCIONES.orden+"?id="+id)
				let mar = await this.marcas()
				mar = await this.empleados();
				if (resp.data.id!=undefined){
					let data = resp.data
					//console.log(data)
					let orden =data
					let detalle = data.detalle
					let formulas = data.formulas
					let consumidos = data.consumidos
					let desperdicios=[]
					let referencias=[]
					let rendimientos=[]
					let lotes=[]
					let rendimiento
					let desperdiciol
					let refer
					let ids=1
					let consumototal=0;

					for(let linea in consumidos){
						
						consumototal = consumototal +  parseInt(consumidos[linea].cantidad)
					}
					
				
					for(let linea in detalle){
						formula_id = detalle[linea].formula_id
						detalle[linea].generar=true
						formulas.map((formu, i)=> (		
						formu.id == formula_id ? formula= formu : null 					
						));	
						to_agency=formula.to_agency
							//console.log(formula)
						if (formula.gd==1){	
							//console.log("genera desperdicio")						
							for(let desperdicio in formula.desperdicios){
								desperdiciol = {id:ids, producto:formula.desperdicios[desperdicio].name, cantidad:(formula.desperdicios[desperdicio].cantidad), item_id:formula.desperdicios[desperdicio].item_id}
								desperdicios.push(desperdiciol)
								ids++
							}
						}
						let x=1
						let exist =true
						let code
						let lote
						//console.log(formula)
						if (formula.genera_unico=="1"){
							detalle[linea].generar=false
							//console.log("genera unico")						
							for(let lineapt in formula.pt){
								let lineas = formula.pt[lineapt].cantidad * detalle[linea].cantidad
								

								for (let y=0; y<lineas;y++){
									exist = true
								while(exist!==false){
									exist = await this.get_item(detalle[linea].serie+"-"+x)
									code = detalle[linea].serie+"-"+x
									x++
								}
								refer = {id:ids, lineid:detalle[linea].id, description: detalle[linea].serie, codigo:"", producto:formula.pt[lineapt].name, referencia:detalle[linea].serie,item_id:formula.pt[lineapt].item_id, peso:0, marca:0, reparacion:false}
								referencias.push(refer)
								ids++
								//x++
								}
							}
						}

						if (formula.gl==1){
							let cont =1
							let date = new Date();
							let fechastr = date.toLocaleString();
							//console.log(fechastr)
							let hotastr = fechastr.substring(11,17)
							//console.log(hotastr)
							fechastr = fechastr.substring(0,10)
							fechastr = fechastr.trim();
							let fecha = fechastr.split('/');
							let hora = hotastr.split(":")
							fechastr = fecha[2]+fecha[1]+fecha[0]+hora[0]+hora[1]
							detalle[linea].generar=false
							//console.log("genera unico")						
							for(let lineapt in formula.pt){

								lote = {id:ids, lote:fechastr+cont, producto:formula.pt[lineapt].name, item_id:formula.pt[lineapt].item_id, cantidad:( formula.pt[lineapt].cantidad * detalle[linea].cantidad)}
								lotes.push(lote)
								ids++
								cont++
								//x++
								
							}
						}
						//console.log(lotes)
						
						exist =true
						

						if (formula.rv==1 && formula.gl==0){
							detalle[linea].generar=false
							//console.log("genera unico")						
							for(let lineapt in formula.pt){
								let lineas = formula.pt[lineapt].cantidad * detalle[linea].cantidad
									
								rendimiento = {id:ids,producto:formula.pt[lineapt].name, cantidad:lineas,item_id:formula.pt[lineapt].item_id}
								rendimientos.push(rendimiento)
								ids++
							
							}
						}
					}


					this.setState({
						orden,
						detalle,
						formulas,
						referencias,
						desperdicios,
						rendimientos,
						to_agency,
						consumototal,
						lotes
						
						
					});
				}
		
			this.setState ({
				to_agency:to_agency,
				action:action,
				guardarcantidad:this.guardarcantidad,
				guardarcantidadpt:this.guardarcantidadpt,
				guardarcantidadflex:this.guardarcantidadflex,
				loading:false
			});
					
					
					this.setStateAsync({show:true})			
			
    
}

trataEmpleados= (empleados) => {
	return empleados.map((t) => ({
		key: t.id,
		value: t.id,
		text: t.name,
		
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


buscarimpresor = (id, items) => {
	//console.log(items)
	let name = null
	items.map((item, i)=> (
	
		item.key == id  ? name = item.text :  false	

	));		
	
	return name
};


Selectempleado = (e, item) => {
	
	this.setState(
		{
			empleado:parseInt(item.value)
		})
	
};	

	guardarcantidad = (id, cantidad) => {
		let insumos = this.state.insumos
		insumos.map((insumo, i)=> (
		
			insumo.id == id ? insumo.cantidad = cantidad : false		

		));		
		//console.log(insumos)
		this.setState(
			{
				insumos:insumos
			})
		
	};

	guardarcantidadflex = (id, cantidad) => {
		let desperdicios = this.state.desperdicios
		desperdicios.map((desperdicio, i)=> (
		
			desperdicio.id == id ? desperdicio.cantidad = cantidad : false		

		));		
		//console.log(insumos)
		this.setState(
			{
				desperdicios:desperdicios
			})
		
	};

	buscariitem = (id, items) => {
		//console.log(items)
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};



	guardarcantidadpt = (id, cantidad) => {

		let pts=[];			
		let linea = this.state.pts.filter((s) => s.id == id);
		pts = this.state.pts.filter((s) => s.id !== id[1]);
			linea[0].cantidad =cantidad;		

		//console.log(this.state.pts)
		this.setState(
			{
				pts:pts
			})
	};

	get_marca(id){
		for (var i=0; i<this.state.marcas.length; i++) {
			
            if (this.state.marcas[i].key==id){
				//console.log(this.state.empleados[i])
				return this.state.marcas[i].text;
			}
            //a b c
		}
		
		return '';
	} 

	crear_item=async (data)=>{
		let status = data.reparacion ? 'malo' : 'bueno';
		let marca =  this.get_marca(data.marca)
		let descripcion = '{\"madre\":\"'+data.madre+'\", \"marca\":\"'+marca+'\", \"empleado\":\"'+data.empleado+'\"}'
		//let descripcionjson = JSON.stringify(descripcion)

		let string = '{"item":{"name":"'+data.name.replace('"', '\\"')+'-'+marca+'", "code":"'+data.code+'","ean13":"'+data.code+'","item_category_id":"'+data.item_category_id+'", "stockable":"true","measurement_unit":"'+data.measurement_unit+'","purchasable":"true", "product_type":"'+data.product_type+'","weight":"'+data.peso+'","payee_id":"'+data.payee_id+'","description":"'+descripcion+'"}}';

		let res = await Axios.post(FUNCIONES.crearitem, string)

		string = '{"code":"'+data.code+'","name":"'+data.name.replace('"', '\\"')+'-'+marca+'","category_id":"'+data.item_category_id+'","id":"'+res.data.id+'","store_id":"'+this.state.userdata.store+'", "details":"'+this.state.orden.id+'","status":"'+status+'", "quantity":"'+data.peso+'"}'
		//console.log(string)
		let res2 = await Axios.post(FUNCIONES.guardaritem, string) 
		return res.data
	}	

	get_itemz=async (id)=>{
		
	
		let res = await Axios.get(FUNCIONES.itemzauru+"?id="+id )
		//sconsole.log(res.data) 
		
		return res.data
	}	

	get_item=async (serie)=>{
		
		
		let res = await Axios.get(FUNCIONES.itemserie+"?serie="+serie)
		//console.log(res.data) 
		if(res.data!=null){
			return res.data
		}else{
			return null
		}
	}

	crear_lote=async (data)=>{
		let date = new Date();
						date.setDate(date.getDate() + 15);
						let fechastr = date.toLocaleDateString('en-US');
						let fecha = fechastr.split('/');
						fechastr = fecha[2]+'-'+fecha[0]+'-'+fecha[1]
		
		let string = '{"lot":{"item_id":"'+data.item_id+'", "name":"'+data.lote+'","expires":"'+fechastr+'"}}'
		//console.log(string)
		let res = await Axios.post(FUNCIONES.crearlote, string) 

		 string = '{"cantidad":"'+data.cantidad+'", "saldo":"'+data.cantidad+'"  ,"lote":"'+data.lote.replace('"', '\\"')+'","id":"'+res.data.id+'","store_id":"'+this.state.userdata.store+'", "vence":"'+fechastr+'", "item_id":"'+data.item_id+'"}'
		//console.log(string)
		let res2 =  Axios.post(FUNCIONES.guardarlote, string) 
		return res.data.id
	}	
	
	
	  guardar_formula = async () => {

		if(this.state.empleado==0){
			alert('Seleccione Impresor');
			return;
		}
	
		this.setState({
			loading: true
		});

		let orden = this.state.orden
		let detalle = this.state.detalle
		let booking ={
					
			booker_id:this.state.empleado,
			planned_delivery:this.state.date,
			movements_attributes:"|insumos|",
			needs_transport:0,
			agency_from_id:production,
			agency_to_id:this.state.to_agency,
			reference:orden.descripcion,
			memo:"",
			payee_id:393185
		}

	
	   let iteminfo
	   let stringdet = "{"
	   let stringdesper = "{"
	   let stringrend = "{"
	   let generadescarte =false
	   let generarendimiento =false
	   let errorgen = false
	   let generados=[]
	   let z=10000000
	   let consumototal = this.state.consumototal
	   let generadototal = 0
	
		// Ciclo de llamadas
		
			try {
					let referencias = this.state.referencias
					let desperdicios = this.state.desperdicios
					let rendimientos = this.state.rendimientos
					let lotes = this.state.lotes
					let x = 0
					let y=0
					let generardetalle = false
					if(desperdicios.length>0){
						generadescarte=true
						for(let desper in desperdicios){
							if(y>0) stringdesper+=","
							stringdesper+='"'+y+'":{"item_id":"'+desperdicios[desper].item_id+'", "booked_quantity":"'+desperdicios[desper].cantidad+'"}'
							generadototal=generadototal+parseInt(desperdicios[desper].cantidad)
							y++
						}
					}
					stringdesper+="}"
					y=0
					if(rendimientos.length>0){
						generarendimiento=true
						for(let rend in rendimientos){
							if(y>0) stringrend+=","
							stringrend+='"'+y+'":{"item_id":"'+rendimientos[rend].item_id+'", "booked_quantity":"'+rendimientos[rend].cantidad+'"}'
							y++
							let itemgen = {id:z,orden_id:this.state.orden.id, item_id:rendimientos[rend].item_id,cantidad:rendimientos[rend].cantidad,nombre:rendimientos[rend].producto}
							generados.push(itemgen)
							z++
							generadototal=generadototal+parseInt(rendimientos[rend].cantidad)
						}
					}
					stringrend+="}"
					//console.log(referencias)
					for(let refer in referencias){
						generardetalle = true
						iteminfo = await this.get_itemz(referencias[refer].item_id)
						//console.log(iteminfo)
						let empleado = this.buscarimpresor(this.state.empleado,this.state.empleados)
												
						let newitem = {empleado:empleado,  name:iteminfo.name, code:referencias[refer].codigo, madre: referencias[refer].description,  item_category_id:iteminfo.item_category_id,measurement_unit:iteminfo.measurement_unit, product_type:iteminfo.product_type, payee_id:iteminfo.payee_id, peso:referencias[refer].peso, reparacion:referencias[refer].reparacion, marca:referencias[refer].marca }
						//console.log(JSON.stringify(newitem)) 
						
						let itemdata  = await this.crear_item(newitem)
						//let itemdata={id:1587455}
						if(x>0) stringdet+=","
						stringdet+='"'+x+'":{"item_id":"'+itemdata.id+'", "booked_quantity":"1","reference":"'+referencias[refer].marca+'"}'
						x++
						generadototal=generadototal+parseInt("1")
						let status = referencias[refer].reparacion ? 'malo' : 'bueno';
						let marca =  this.get_marca(referencias[refer].marca)
						let itemgen = {id:z, payee_id:referencias[refer].marca, peso:referencias[refer].peso, orden_line_id:referencias[refer].lineid , orden_id:this.state.orden.id,item_id:itemdata.id,cantidad:1,nombre:iteminfo.name+"-"+referencias[refer].referencia,codigo:referencias[refer].codigo, reparacion:referencias[refer].reaparacion, estado:status,  madre:referencias[refer].description, marca:marca,empleado:empleado}
							generados.push(itemgen)
							z++
					}

					for(let lote in lotes){
						generardetalle = true
						
						//console.log(iteminfo)
						let newlote = {item_id:lotes[lote].item_id, lote:lotes[lote].lote, cantidad:lotes[lote].cantidad}
						//console.log(JSON.stringify(newitem)) 
						
						let lotedata  = await this.crear_lote(newlote)
						//let itemdata={id:1587455}
						//console.log(lotedata)
						if(x>0) stringdet+=","
						stringdet+='"'+x+'":{"item_id":"'+lotes[lote].item_id+'", "booked_quantity":"'+lotes[lote].cantidad+'","lot_id":"'+lotedata+'"}'
						x++
						generadototal=generadototal+parseInt(lotes[lote].cantidad)

					}


					let formula_id
					let formula={}
					consumototal = consumototal+z
					for(let linea in detalle){
						let formulas = this.state.formulas
						if(detalle[linea].generar){
							generardetalle = true
							formula_id = detalle[linea].formula_id

							formulas.map((formu, i)=> (		
							formu.id == formula_id ? formula= formu : null 					
							));	

							
							for(let ptl in formula.pt){

								if(x>0) stringdet+=","
								stringdet+='"'+x+'":{"item_id":"'+formula.pt[ptl].item_id+'", "booked_quantity":"'+(detalle[linea].cantidad*formula.pt[ptl].cantidad)+'"}'
								x++
								let itemgen = {id:z,orden_id:this.state.orden.id,item_id:formula.pt[ptl].item_id,cantidad:(detalle[linea].cantidad*formula.pt[ptl].cantidad),nombre:formula.pt[ptl].name}
							generados.push(itemgen)
							z++
							generadototal+=detalle[linea].cantidad*formula.pt[ptl].cantidad
							}
						}
					}
						stringdet+="}"
						//console.log(generadototal)
						//console.log(consumototal)
						if (generadototal<=consumototal){
						
							let shipment = {shipment:booking}
							let poststr = JSON.stringify(shipment)
							poststr= poststr.replace('"|insumos|"',stringdet)
							

							if(generadescarte){
								let bookingd = booking
								bookingd.movements_attributes="|descarte|"
								bookingd.agency_to_id = descarte
								let shipmentd = {shipment:booking}
								let poststrd = JSON.stringify(shipmentd)
								poststrd= poststrd.replace('"|descarte|"',stringdesper)
								let resd = await Axios.post(`${FUNCIONES.reservaciones}`,poststrd)
								if (resd.data.id!==undefined){
									resd = await Axios.post(FUNCIONES.deliver+"?id="+resd.data.id)
								}else{
									errorgen=true
								}

								//console.log(poststrd)
							}

							if(generarendimiento){
								let bookingd = booking
								bookingd.movements_attributes="|rendimiento|"
								bookingd.agency_to_id=this.state.to_agency
								let shipmentd = {shipment:booking}
								let poststrd = JSON.stringify(shipmentd)
								poststrd= poststrd.replace('"|rendimiento|"',stringrend)
								//console.log(poststrd)
								let resd = await Axios.post(`${FUNCIONES.reservaciones}`,poststrd)
								if (resd.data.id!==undefined){
									resd = await Axios.post(FUNCIONES.deliver+"?id="+resd.data.id)
								}else{
									errorgen=true
								}
								
							}
							if (generardetalle){
								//console.log(poststr)
								let res = await Axios.post(`${FUNCIONES.reservaciones}`,poststr)
							
							if (res.data.id!==undefined){
									let resp = await Axios.post(FUNCIONES.deliver+"?id="+res.data.id)
									let inicio = new Date();
									let fechastr = inicio.toLocaleDateString('en-US');
									let horastr = inicio.getHours();
									let minutes = inicio.getMinutes();
									//console.log(fechastr)
									//console.log(minutes)
									let fecha = fechastr.split('/');
									fechastr = fecha[2]+'/'+fecha[0]+'/'+fecha[1]+" "+horastr+":"+minutes
									let ordenstring = '{"id":'+this.state.orden.id+', "fechahora_fin":"'+fechastr+'",  "estado":"finalizada","detalle":{},"generados":'+JSON.stringify(generados)+'}'
									//console.log(ordenstring)
									resp = await Axios.post(`${FUNCIONES.editarorden}`,ordenstring)
									this.setState({
										loading: false,
										visible:true,
										
									});
								}else{
									this.setState({
										loading: false,
										visiblee:true,
										errormsj:"Sus datos no se guardaron, contacte al Administrador"
									});	
								}
							}else{
								if(errorgen){
									
									this.setState({
										loading: false,
										visiblee:true,
										errormsj:"Sus datos no se guardaron, contacte al Administrador"
									});	

								}else{
									let ordenstring = '{"id":'+this.state.orden.id+', "estado":"finalizada","detalle":{},"generados":'+JSON.stringify(generados)+'}'
									//console.log(ordenstring)
									let resp = await Axios.post(`${FUNCIONES.editarorden}`,ordenstring)
									this.setState({
										loading: false,
										visible:true,
										
									});
								}

							}
						}else{
							this.setState({
								loading: false,
								visiblee:true,
								errormsj:"La cantidad de producto terminado es mayor al valor de la materia primar"
							});	
						}
				
			
			} catch (error) {
				console.error({ error });
				this.setState({
					loading: false,
					visiblee:true,
					errormsj:"Sus datos no se guardaron, contacte al Administrador"
				});	
				
			} finally {
				
			
			
			}
		
		
		};
		
	

		onConfirm = ()=>{
			this.setState({				
				visible:false,
				
			});
			navigate('/app/ordenesp/')
		}

		onConfirme = ()=>{
			this.setState({				
			
				visiblee:false
			});
			//navigate('/app/formulas/')
		}
        
        handleInputChange = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			if(name=='refer'){
				let referencias = this.state.referencias
				id = id.split("_")
				
				referencias.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.referencia = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					referencias
				  })

			}else if (name=='rendimiento'){
				let rendimientos = this.state.rendimientos
				id = id.split("_")
				rendimientos.map((desp, i)=> (
		
					desp.id == id[1]  ? desp.cantidad = value :  false	
		
				));	

				this.setState({
					rendimientos
				  })
			}
			
			else{
				let desperdicios = this.state.desperdicios
				id = id.split("_")
				desperdicios.map((desp, i)=> (
		
					desp.id == id[1]  ? desp.cantidad = value :  false	
		
				));	

				this.setState({
					desperdicios
				  })
			}
        
            
		  }

		  reparacion = (e, item) => {
			
			let referencias = this.state.referencias
			//console.log(item)
			let id = item.id;
			id = id.toString().split("_");	
			//console.log(id)	
			if (item.checked){
				referencias.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.reparacion = true :  false	
		
				));	
			}else{
				referencias.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.reparacion = false :  false	
		
				));	
			}
				
				
				console.log(referencias)
				this.setState({
					referencias
				  })

            
		  }
		  
		  handleInputChangepeso = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			
				let referencias = this.state.referencias
				id = id.split("_")
				
				referencias.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.peso = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					referencias
				  })

            
		  }

		  handleInputChangeserie = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			
				let referencias = this.state.referencias
				id = id.split("_")
				
				referencias.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.codigo = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					referencias
				  })

            
		  }
		  
		  handleInputChangeCant = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			
				let lotes = this.state.lotes
				id = id.split("_")
				
				lotes.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.cantidad = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					lotes
				  })

            
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.guardar_formula()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}

					Selectmarca = (e, item) => {
						//console.log(item)
						let id = item.id;
						id = id.toString().split("_");	
						id = parseInt(id[1])
						let detalle =this.state.referencias
						//console.log(id)
						detalle.map((linea, i)=> (
							
							linea.id == id ? linea.marca = item.value : false		
				
						));
						console.log(detalle)
						this.setState(
							{
								referencias:detalle
							})
				
						
						
					};
					

				

	render() {
		
		

		let {
				
			referencias, desperdicios, loading, rendimientos, lotes, marcas, empleado, empleados
           
			
		} = this.state;
		//console.log(lotes)

			if (loading) {
			return <Loader active inline="centered" />;
				} else
		
			return(
				<div >
					<Grid columns={2}><Grid.Row><Grid.Column>
						<label>Impresor: <Dropdown
					value={empleado}
					placeholder='Impresor'
					onChange={this.Selectempleado}				
					selection
					search
					options={empleados}
					className="ui segment"
				/></label></Grid.Column><Grid.Column></Grid.Column></Grid.Row></Grid>
                <form onSubmit={this.handleSubmit}>

				{  (referencias.length>0 || lotes.length>0)?(<React.Fragment>
					
					
					<p >REFERENCIAS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				
				<Table.HeaderCell
					
				>
					CODIGO
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					MARCA
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					PESO
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					referencias
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto}</Table.Cell>
					<Table.Cell>{<input
					autoFocus
                    type="text"
					name="serie"
					id={"serie_"+t.id}
                    value={t.codigo}
					onChange={this.handleInputChangeserie}				
                    className="inputform"
				  />}</Table.Cell>
					 
					<Table.Cell>{<label>Marca: <Dropdown
					value={t.marca}
					placeholder='Marca'
					onChange={this.Selectmarca}				
					selection
					search
					id={"marca_"+t.id}
					options={marcas}
					className="ui segment"
				/></label>}
				 
				  </Table.Cell>
				  <Table.Cell>{<input
					autoFocus
                    type="number"
					name="peso"
					id={"peso_"+t.id}
                    value={t.peso}
					onChange={this.handleInputChangepeso}				
                    className="inputform"
				  />}
				 
				  </Table.Cell>
				  <Table.Cell>
				  {<label>
						Reparacion
						<Checkbox
									onChange={this.reparacion}
									toggle
									checked={t.reparacion}
									id={"reparacion_"+t.id}
									
								/>
						</label>}
						</Table.Cell>						
					
						
				</Table.Row>
					))}
					{
					lotes
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto}</Table.Cell>
					<Table.Cell>{t.lote}</Table.Cell>
					 
					<Table.Cell>
					
				  </Table.Cell>
				  <Table.Cell>{<input
					autoFocus
                    type="number"
					name="cantidad"
					id={"cantidad_"+t.id}
                    value={t.cantidad}
					onChange={this.handleInputChangeCant}				
                    className="inputform"
				  />}
				 
				  </Table.Cell>
				  <Table.Cell>
				 
				  </Table.Cell>							
					
						
				</Table.Row>
					))}
			</Table.Body>
			</Table></React.Fragment>):('')}
								
			{  (desperdicios.length>0)?(<React.Fragment>
			<p >DESPERDICIOS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell
				>
					ITEM
				</Table.HeaderCell>
				
				<Table.HeaderCell
				>
					CANTIDAD
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					desperdicios
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto}</Table.Cell>
					<Table.Cell>{<input
					autoFocus
                    type="number"
					name="desperdicio"
					id={"desper_"+t.id}
                    value={t.serie}
					onChange={this.handleInputChange}				
                    className="inputform"
                  />}</Table.Cell>
											
					
						
				</Table.Row>
					))}
			</Table.Body>
			</Table></React.Fragment>):('')}

			{  (rendimientos.length>0)?(<React.Fragment>
			<p >RENDIMIENTOS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell
				>
					ITEM
				</Table.HeaderCell>
				
				<Table.HeaderCell
				>
					CANTIDAD
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					rendimientos
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto}</Table.Cell>
					<Table.Cell>{<input
					autoFocus
                    type="number"
					name="rendimiento"
					id={"rendi_"+t.id}
                    value={t.serie}
					onChange={this.handleInputChange}				
                    className="inputform"
                  />}</Table.Cell>
											
					
						
				</Table.Row>
					))}
			</Table.Body>
			</Table></React.Fragment>):('')}
			<button type="submit" className="submitform">Terminar</button>
			</form>	
			<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			
              </div>
			)
		
	
}
}