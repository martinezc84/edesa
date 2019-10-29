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



export default class Formula extends Component {
	state = {
		vendibles:[],
		insumos:[],
		pts:[],
		formula:{},
		tipo_insumo: "",
		genera_unico: "",
		tiempo_de_produccion: "",
		from_agency: 0,
		to_agency:0,
		nombre: "",		
		rv: null,
		gd: null,
		activa:null,
		options:options,
		unico:false,
		insumoscont:1,
		ptcont:1,
		buttonactive:false,
		itemst:[],
		id:0,
		show:false,
		visiblee:false,
		errormsj:"Error"
				
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
			
			if(action!='new'){
				let id = this.props.id
				Axios.get(FUNCIONES.formula+"?id="+id)
				.then(({ data }) => {
					//console.log(data)
					let items
					let unico
					let rv
					let gd
					let formula = data
					let insumos = data.insumos
					insumos.map((insumo, i)=> (
						//console.log(invoice)
						insumo.unico ==1 ? insumo.unico = true  :insumo.unico = false
					));

					let from_agency =0
					let to_agency=0
					
					let pts = data.pt
					formula.genera_unico ==1 ? unico =true: unico=false;
					formula.rv ==1 ? rv =true: rv=false;
					formula.gd ==1 ? gd =true: gd=false;
					from_agency = parseInt(formula.from_agency);
					to_agency = parseInt(formula.to_agency);
					items = formula.tipo_insumo =='paquete' ? vendibles : comprables	
					this.setState({
						items:items,						
						nombre: formula.nombre,
						tipo_insumo:formula.tipo_insumo,
						tiempo_de_produccion:formula.tiempo_de_produccion,
						rv:rv,
						gd:gd,
						activa:formula.activa,
						unico:unico,
						formula:formula,
						insumos:insumos,
						pts:pts,
						to_agency:to_agency,
						from_agency:from_agency,
						id:id
					});
				})
				.catch((error) => {
					console.error(error);
				});
			}else{
				this.setState({
					nombre: "",
					tipo_insumo:"",
					tiempo_de_produccion:"00:00:00",
					rv:0,
					gd:0,
					activa:1,
					unico:0,
					formula:null,
					insumos:[],
					pt:[],
					action:action,
					comprables:comprables,
					vendibles:vendibles
				});
			}
			this.setState ({
				tipoinsumo: this.tipoinsumo,
				esunico:this.esunico,
				rvf:this.rv,
				gdf:this.gd,
				action:action,
				guardarcantidad:this.guardarcantidad,
				guardarcantidadpt:this.guardarcantidadpt,
				selectAg:this.selecAg
				
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

	SelectItem = (e, item) => {
		let id = item.id;
		id = id.toString().split("_");
		if(id[0]=='insumo'){
			let insumos = this.state.insumos
			insumos.map((insumo, i)=> (
				//console.log(invoice)
				insumo.id == id[1] ? insumo.item_id = item.value : false		
	
			));
			this.setState(
				{
					insumos:insumos
				})
		}else{
			let pts = [];
			pts = this.state.pts
			console.log(item)
			pts.map((pt, i)=> (
				
				pt.id == id[1] ? pt.item_id = item.value : false		
	
			));
			this.setState(
				{
					pts:pts
				})
		}
		
	};

	esunico = (e, item) => {
		
		let un = null;

		item.checked ==true ? un =true: un=false; 

		this.setState(
			{
                unico:un,
               
			})
	};

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

	buscariitem = (id, items) => {
		console.log(items)
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

	rv = (e, item) => {
		let rv = null;

		item.checked ==true ? rv =true: rv=false; 

		this.setState(
			{
                rv:rv,
               
			})
		
	};

	gd = (e, item) => {
		let gd = null;

		item.checked ==true ? gd =true: gd=false; 

		this.setState(
			{
                gd:gd,
               
			})
		
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
		
		agregar_insumo = () =>{
			let id =this.state.insumoscont;
			let insum={id:id,unico:false,item_id:0,cantidad:1}
			id++;
			let insumos = [...this.state.insumos, insum]

		//console.log(insumos)
		this.setState(
			{
				insumos:insumos,
				insumoscont:id
			}
			
		);		
			
		}

		agregar_pt = () =>{
			let id =this.state.ptcont;
			let pt={id:id,cantidad:1,item_id:0}
			id++;
			let pts = [...this.state.pts, pt]

		//console.log(seleccionados)
		this.setState(
			{
				pts:pts,
				ptcont:id
			}
			
		);		
			
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
		
		let { itemst, agencias } = this.props
		

		let {
			buttonactive,
			insumos,
			pts,
			guardarcantidad,
			guardarcantidadpt,		
			from_agency,
			to_agency,
			selectAg,
			show,
            nombre,tipo_insumo,genera_unico,rv,gd, options,  unico, items, tipoinsumo, esunico,gdf, rvf, action
			
		} = this.state;

	
		
	
		
		if(action=='view')
			return(
				<div >
                <form onSubmit={this.handleSubmit}>
								{nombre!==null ? (
                <label>
                  <strong>Nombre:</strong>
				  {nombre}
                </label>):("")
								}
								<br></br>
                {tipo_insumo!==null ? (
                <label>
                 <strong> Insumo:</strong>
				  {tipo_insumo}
				</label>):('')}
				<br></br>
				{genera_unico!==null ? (
                <label>
                 <strong> Genera Items únicos?:</strong>{unico==true?"si":"no"}
				</label>):('')}
				<br></br>
				{rv!==null ? (
                <label>
                 <strong> Recurso Variable?:</strong>{rv==true?'si':'no'}
				  
				</label>):('')}
				<br></br>
				{gd!==null ? (
                <label>
                  <strong>Genera Desperdicio?</strong>
				  {gd==true?'si':'no'}
				</label>):('')}
               
              </form>

			  <br></br>	<br></br>	
		 
								<p >INSUMOS</p>
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
				<Table.HeaderCell
					
				>
					unico
				</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					insumos
					.map((t) => (
						<FilaInsumo
							items={items}							
							id={t.id}
							unico={t.unico}
							item_id={t.item_id}
							cantidad={t.cantidad}
							esunico={this.esunicol}
							buscaritem={this.buscariitem}
							view={true}
						/>
					))}
			</Table.Body>
			</Table>
			<p >PRODUCTOS TERMINADOS</p>
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
					pts
					.map((t) => (
						<FilaPt
							items={itemst}
							selectitem={this.SelectItem}
							linea={t.id}
							unico={t.unico}
							item_id={t.item_id}
							view={true}
							cantidad={t.cantidad}
							buscaritem={this.buscariitem}
						/>
					))}
			</Table.Body>
			</Table>
						
              </div>
			)
		else if (action=='edit')
			return (
				<div >
				<form onSubmit={this.handleSubmit}>
				<Container>
			
							{nombre!==null ? (
			<Row><Col>
			<label>
			  Nombre
			  <FormControl type="text" placeholder="Nombre"  name="nombre"
                     className="mr-sm-2" value={this.state.nombre}
				onChange={this.handleInputChange} />
			</label></Col></Row>):("")
							}
			{tipo_insumo!==null ? (
			<Row><Col><label>
			  Insumo
			  <Dropdown
					value={tipo_insumo}
					placeholder='Tipo Insumo'
					onChange={tipoinsumo}
					fluid
					selection
					options={options}
					className="mr-sm-2"
				/>
			</label></Col></Row>):('')}
			<Row>
			{genera_unico!==null ? (
			<Col><label>
			  Genera Items únicos?
			  <Checkbox
						onChange={esunico}
						toggle
						checked={unico}
					/>
			</label></Col>):('')}

			{rv!==null ? (
			<Col><label>
			  Recurso Variable?
			  <Checkbox
						onChange={rvf}
						toggle
						checked={rv}
					/>
			</label></Col>):('')}

			{gd!==null ? (
			<Col><label>
			  Genera Desperdicio?
			  <Checkbox
						onChange={gdf}
						toggle
						checked={gd}
					/>
			</label></Col>):('')}
			</Row>
			<Row><Col><label>
			  Origen
			  { from_agency!==0 && agencias !=[] ? (
			  <Dropdown
					//value={from_agency}
					placeholder='Agencia'
					onChange={selectAg}
					fluid
					selection
					options={agencias}
					className="mr-sm-2"
					name="from_agency"
					value={from_agency}
				/>):('')}
			</label></Col><Col><label>
			  Destino
			  { to_agency!==0 && agencias !=[] ? (
			  <Dropdown
			  value={to_agency}
					placeholder='Agencia'
					onChange={selectAg}
					fluid
					selection
					options={agencias}
					className="mr-sm-2"
					name="to_agency"
			  />):('')}
			</label></Col></Row>

			{buttonactive ? ( <React.Fragment> <Row><Col><Button type="button" variant="primary"  className="submitform" onClick={() => {
										this.agregar_insumo();
									}}	>Agregar Insumo</Button></Col><Col><Button type="button" variant="primary"  className="submitform" onClick={() => {
										this.agregar_pt();
									}}	>Agregar Producto Terminado</Button></Col></Row></React.Fragment>):('')}			
			
		  
		  </Container>	
					<br></br>	<br></br>	
		 
								<p >INSUMOS</p>
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
				<Table.HeaderCell
					
				>
					unico
				</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{ (show)  ?(
					insumos.map((t) => (						
						<FilaInsumo
							//key={t.id}
							items={items}
							selectitem={this.SelectItem}
							id={t.id}
							unico={t.unico}
							item_id={t.item_id}
							cantidad={t.cantidad}
							esunico={this.esunicol}
							guardarcantidad={guardarcantidad}
						/>))
			):(<Table.Row>
					
				<Table.Cell></Table.Cell></Table.Row>)}
			</Table.Body>
			</Table>

			<p >PRODUCTOS TERMINADOS</p>
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
				{(show)  ? (
					pts
					.map((t) => (
						<FilaPt
							items={itemst}
							selectitem={this.SelectItem}
							linea={t.id}
							unico={t.unico}
							item_id={t.item_id}
							esunico={this.esunicol}
							cantidad={t.cantidad}
							guardarcantidad={guardarcantidadpt}
						/>
					))
				):(<Table.Row>
					
					<Table.Cell></Table.Cell></Table.Row>)}
			</Table.Body>
			</Table>
			<button type="submit" className="submitform">Guardar</button>
			</form>
			<MostrarMensaje titulo={'Sus Datos fueron editados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			</div>
				
			
		)
		else
		return(
			<div >
				<form onSubmit={this.handleSubmit}>
				<Container>
			
							{nombre!==null ? (
			<Row><Col>
			<label>
			  Nombre
			  <FormControl type="text" placeholder="Nombre"  name="nombre"
                     className="mr-sm-2" value={this.state.nombre}
				onChange={this.handleInputChange} />
			</label></Col></Row>):("")
							}
			{tipo_insumo!==null ? (
			<Row><Col><label>
			  Insumo
			  <Dropdown
					value={tipo_insumo}
					placeholder='Tipo Insumo'
					onChange={tipoinsumo}
					fluid
					selection
					options={options}
					className="mr-sm-2"
				/>
			</label></Col></Row>):('')}
			<Row>
			{genera_unico!==null ? (
			<Col><label>
			  Genera Items únicos?
			  <Checkbox
						onChange={esunico}
						toggle
						checked={unico}
					/>
			</label></Col>):('')}

			{rv!==null ? (
			<Col><label>
			  Recurso Variable?
			  <Checkbox
						onChange={rvf}
						toggle
						checked={rv}
					/>
			</label></Col>):('')}

			{gd!==null ? (
			<Col><label>
			  Genera Desperdicio?
			  <Checkbox
						onChange={gdf}
						toggle
						checked={gd}
					/>
			</label></Col>):('')}
			</Row>
			<Row><Col><label>
			  Origen
			  <Dropdown
					  value={from_agency}
					placeholder='Agencia'
					onChange={selectAg}
					fluid
					selection
					options={agencias}
					className="mr-sm-2"
					name="from_agency"
				/>
			</label></Col><Col><label>
			  Destino
			  <Dropdown
					  value={to_agency}
					placeholder='Agencia'
					onChange={selectAg}
					fluid
					selection
					options={agencias}
					className="mr-sm-2"
					name="to_agency"
				/>
			</label></Col></Row>

			{buttonactive ? ( <React.Fragment> <Row><Col><Button type="button" variant="primary"  className="submitform" onClick={() => {
										this.agregar_insumo();
									}}	>Agregar Insumo</Button></Col><Col><Button type="button" variant="primary"  className="submitform" onClick={() => {
										this.agregar_pt();
									}}	>Agregar Producto Terminado</Button></Col></Row></React.Fragment>):('')}			
			
		  
		  </Container>	
					<br></br>	<br></br>	
		 
								<p >INSUMOS</p>
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
				<Table.HeaderCell
					
				>
					unico
				</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					insumos
					.map((t) => (
						<FilaInsumo
							items={items}
							selectitem={this.SelectItem}
							id={t.id}
							unico={t.unico}
							item_id={t.item_id}
							cantidad={t.cantidad}
							esunico={this.esunicol}
							guardarcantidad={guardarcantidad}
						/>
					))}
			</Table.Body>
			</Table>

			<p >PRODUCTOS TERMINADOS</p>
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
					pts
					.map((t) => (
						<FilaPt
							items={itemst}
							selectitem={this.SelectItem}
							linea={t.id}
							unico={t.unico}
							item_id={t.item_id}
							esunico={this.esunicol}
							guardarcantidad={guardarcantidadpt}
							cantidad={t.cantidad}
						/>
					))}
			</Table.Body>
			</Table>
			<button type="submit" className="submitform">Guardar</button>
			</form>
			<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			</div>
		  
		)
	
}
}