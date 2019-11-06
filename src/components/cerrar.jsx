//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES, descarte, production } from '../utils/utils';
import { Header, Table, Dropdown, Checkbox, Loader } from 'semantic-ui-react';

import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import Barcode from 'react-barcode'





export default class Iniciar extends Component {
	state = {
		referencias:[],
		desperdicios:[],
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
				
	};
	
	
    

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 console.log(dte)

	};

	

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
				if (resp.data.id!=undefined){
					let data = resp.data
					//console.log(data)
					let orden =data
					let detalle = data.detalle
					let formulas = data.formulas
					let desperdicios=[]
					let referencias=[]
					let desperdiciol
					let refer
					let ids=1
					
					
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
								desperdiciol = {id:ids, producto:formula.desperdicios[desperdicio].name, cantidad:(formula.desperdicios[desperdicio].cantidad), item_id:formula[desperdicio].item_id}
								desperdicios.push(desperdiciol)
								ids++
							}
						}
						let x=1
						let exist =true
						let code
						if (formula.genera_unico==1){
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
								refer = {id:ids, codigo:code, producto:formula.pt[lineapt].name, referencia:(formula.pt[lineapt].referencia),item_id:formula.pt[lineapt].item_id}
								referencias.push(refer)
								ids++
								//x++
								}
							}
						}
					}


					this.setState({
						orden,
						detalle,
						formulas,
						referencias,
						desperdicios,
						to_agency,
						
						
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

	crear_item=async (data)=>{
		
		let string = '{"item":{"name":"'+data.name.replace('"', '\\"')+'", "code":"'+data.code+'","ean13":"'+data.code+'","item_category_id":"'+data.item_category_id+'", "stockable":"true","measurement_unit":"'+data.measurement_unit+'","purchasable":"true", "product_type":"'+data.product_type+'","weight":"0","payee_id":"'+data.payee_id+'"}}';
		//console.log(string)
		let res = await Axios.post(FUNCIONES.crearitem, string)
		//console.log(res.data) 
		string = '{"code":"'+data.code+'","name":"'+data.name.replace('"', '\\"')+'","category_id":"'+data.item_category_id+'","id":"'+res.data.id+'","store_id":"'+this.state.userdata.store+'", "details":"'+this.state.orden.id+'"}'
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
	
	
	  guardar_formula = async () => {
	
		this.setState({
			loading: true
		});

		let orden = this.state.orden
		let detalle = this.state.detalle
		let booking ={
					
			booker_id:orden.employee_id,
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
	   let generadescarte =false
	
		// Ciclo de llamadas
		
			try {
					let referencias = this.state.referencias
					let desperdicios = this.state.desperdicios
					let x = 0
					let y=0
					if(desperdicios.length>0){
						generadescarte=true
						for(let desper in desperdicios){
							if(y>0) stringdesper+=","
							stringdesper+='"'+y+'":{"item_id":"'+desperdicios[desper].item_id+'", "booked_quantity":"'+desperdicios[desper].cantidad+'"}'
						}
					}
					stringdesper+="}"
					//console.log(referencias)
					for(let refer in referencias){
						iteminfo = await this.get_itemz(referencias[refer].item_id)
						//console.log(iteminfo)
						let newitem = {name:iteminfo.name+"-"+referencias[refer].referencia, code:referencias[refer].codigo,  item_category_id:iteminfo.item_category_id,measurement_unit:iteminfo.measurement_unit, product_type:iteminfo.product_type, payee_id:iteminfo.payee_id }
						//console.log(JSON.stringify(newitem)) 
						let itemdata  = await this.crear_item(newitem)
						//let itemdata={id:1587455}
						if(x>0) stringdet+=","
						stringdet+='"'+x+'":{"item_id":"'+itemdata.id+'", "booked_quantity":"1"}'
						x++
					}
					let formula_id
					let formula={}
					for(let linea in detalle){
						let formulas = this.state.formulas
						if(detalle[linea].generar){
							formula_id = detalle[linea].formula_id

							formulas.map((formu, i)=> (		
							formu.id == formula_id ? formula= formu : null 					
							));	

							
							for(let ptl in formula.pt){

								if(x>0) stringdet+=","
								stringdet+='"'+x+'":{"item_id":"'+formula.pt[ptl].item_id+'", "booked_quantity":"'+(detalle[linea].cantidad*formula.pt[ptl].cantidad)+'"}'
								x++
							}
						}
					}
						stringdet+="}"
						let shipment = {shipment:booking}
						let poststr = JSON.stringify(shipment)
						poststr= poststr.replace('"|insumos|"',stringdet)
						console.log(poststr)

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
							}

							console.log(poststrd)
						}

						let res = await Axios.post(`${FUNCIONES.reservaciones}`,poststr)

						if (res.data.id!==undefined){
								let resp = await Axios.post(FUNCIONES.deliver+"?id="+res.data.id)
								 resp = await Axios.post(`${FUNCIONES.editarorden}`,'{"id":'+this.state.orden.id+', "estado":"finalizada","detalle":{}}')
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
			navigate('/app/formulas/')
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

			}else{
				let desperdicios = this.state.desperdicios
				id = id.split("_")
				desperdicios.map((desp, i)=> (
		
					desp.id == id  ? desp.cantidad = value :  false	
		
				));	

				this.setState({
					desperdicios
				  })
			}
        
            
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.guardar_formula()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					

				

	render() {
		
		

		let {
				
			referencias, desperdicios, loading
           
			
		} = this.state;

			if (loading) {
			return <Loader active inline="centered" />;
				} else
		
			return(
				<div >
                <form onSubmit={this.handleSubmit}>

				{  (referencias.length>0)?(<React.Fragment><p >REFERENCIAS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				
				<Table.HeaderCell
					
				>
					REFERENCIA
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					referencias
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto}</Table.Cell>
					<Table.Cell><Barcode
				  value={t.codigo}
				  format="EAN13"
				  /></Table.Cell>
					 
					<Table.Cell>{<input
					autoFocus
                    type="text"
					name="refer"
					id={"refer_"+t.id}
                    value={t.cantidad}
					onChange={this.handleInputChange}				
                    className="inputform"
				  />}
				 
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
			<button type="submit" className="submitform">Terminar</button>
			</form>	
              </div>
			)
		
	
}
}