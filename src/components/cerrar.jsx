//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Dropdown, Checkbox } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import FilaInsumo from './FilaInsumo';
import FilaPt from './FilaPt';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import { Button, FormControl, Container, Row, Col} from 'react-bootstrap';
import FilaDesperdicio from './FilaDesperdicio';





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

	

	componentDidMount() {
	
		this.setState({
			userdata: getUser()
		});
		
			let { action, comprables, vendibles  } = this.props;
		
				let id = this.props.id
				let formula
				let formula_id
				Axios.get(FUNCIONES.orden+"?id="+id)
				.then(({ data }) => {
					//console.log(data)
					let orden =data
					let detalle = data.detalle
					let formulas = data.formulas
					let desperdicios=[]
					let referencias=[]
					let desperdiciol
					let refer
					
					for(let linea in detalle){
						formula_id = detalle[linea].formula_id

						formulas.map((formu, i)=> (		
						formu.id == formula_id ? formula= formu : null 					
						));	
							console.log(formula)
						if (formula.gd==1){	
							console.log("genera desperdicio")						
							for(let desperdicio in formula.desperdicios){
								desperdiciol = {id:formula.desperdicios[desperdicio].id, producto:formula.desperdicios[desperdicio].name, cantidad:(formula.desperdicios[desperdicio].cantidad)}
								desperdicios.push(desperdiciol)
							}
						}

						if (formula.genera_unico==1){	
							console.log("genera unico")						
							for(let lineapt in formula.pt){
								let lineas = formula.pt[lineapt].cantidad * detalle[linea].cantidad
								for (let y=0; y<lineas;y++){
								refer = {id:formula.pt[lineapt].id, producto:formula.pt[lineapt].name, referencia:(formula.pt[lineapt].referencia)}
								referencias.push(refer)
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
						
					});
				})
				.catch((error) => {
					console.error(error);
				});
		
			this.setState ({
				
				action:action,
				guardarcantidad:this.guardarcantidad,
				guardarcantidadpt:this.guardarcantidadpt,
				guardarcantidadflex:this.guardarcantidadflex,
				
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
	
	
	  guardar_formula = async () => {
	
		/*this.setState({
			visible: false
        });*/
        
       
	
		// Ciclo de llamadas
		
			try {
							
				let guardar =true;
				let formula ={}
				formula.tipo_insumo = this.state.tipo_insumo
				formula.nombre = this.state.nombre
				formula.from_agency = this.state.from_agency
				formula.to_agency = this.state.to_agency
				formula.genera_unico = this.state.unico==true ? "1" : "0"
				formula.rv = this.state.rv==true ? "1" : "0"
				formula.gd = this.state.gd==true ? "1" : "0"
				formula.insumos = this.state.insumos
				formula.pt= this.state.pts
				formula.desperdicios= this.state.desperdicios
				formula.store_id=this.state.userdata.store,
				formula.activa = 1
				this.props.action=="edit" ? formula.id=this.props.id: null
				//console.log(formula)
				if((formula.nombre!=="") && (formula.from_agency>0) && (formula.to_agency>0) && (formula.insumos.length>0) && (formula.pt.length>0) ){
					

					formula.pt.map((linea, i)=> (
		
						guardar = linea.item_id>0 ? true : false
			
					));	

					formula.insumos.map((linea, i)=> (
		
						guardar = linea.item_id>0 ? true : false
			
					));
					
					formula.desperdicios.map((linea, i)=> (
		
						guardar = linea.item_id>0 ? true : false
			
					));

					formula.desperdicios.map((linea, i)=> (
		
						guardar = linea.cantidad>0 ? true : false
			
					));

					formula.desperdicios.map((linea, i)=> (
		
						linea.flexible = linea.flexible ? 1 : 0
			
					));
					let poststr = JSON.stringify(formula)
				console.log(poststr)
				let data;

				if(this.props.action=="new"){
				guardar ?  data = await Axios.post(FUNCIONES.guardarformula, poststr) : null
				}else{
				guardar ?  data = await Axios.post(FUNCIONES.editarformula, poststr) : null
				}
				//console.log(data.data)
				let res =data.data
				console.log(res.data)
				if (res.data.id!==undefined){
					this.setState({
					
						visible:true,
						
					});
				}else{
					this.setState({
					
						visiblee:true,
						errormsj:"Sus datos no se guardaron, contacte al Administrador"
					});
				}

					
				}else{
					this.setState({
					
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
        
            this.setState({
              [name]: value,
            })
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.guardar_formula()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					

				

	render() {
		
		

		let {
				
			referencias, desperdicios
           
			
		} = this.state;

	
		
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
					<Table.Cell>{<input
					autoFocus
                    type="text"
					name="refer"
					id={"refer_"+t.id}
                    value={t.cantidad}
					onChange={this.handleInputChange}				
                    className="inputform"
                  />}</Table.Cell>
											
					
						
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
			
			</form>	
              </div>
			)
		
	
}
}