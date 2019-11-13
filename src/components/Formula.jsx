//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Dropdown, Checkbox, Grid, Button } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import FilaInsumo from './FilaInsumo';
import FilaPt from './FilaPt';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import FilaDesperdicio from './FilaDesperdicio';

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
		desperdicios:[],
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
		despercont:1,
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
		
			let { action, comprables, vendibles, itemst  } = this.props;
			
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
					let desperdicios = data.desperdicios
					formula.genera_unico ==1 ? unico =true: unico=false;
					formula.rv ==1 ? rv =true: rv=false;
					formula.gd ==1 ? gd =true: gd=false;
					from_agency = parseInt(formula.from_agency);
					to_agency = parseInt(formula.to_agency);
					comprables = [...comprables, itemst]
					comprables = [...comprables, vendibles]

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
						desperdicios:desperdicios,
						to_agency:to_agency,
						from_agency:from_agency,
						id:id,
						vendibles:vendibles,
						comprables:comprables
					});
				})
				.catch((error) => {
					console.error(error);
				});
			}else{
				comprables = [...comprables, itemst]
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
				guardarcantidadflex:this.guardarcantidadflex,
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

	
	SelectItemFlex = (e, item) => {
		let id = item.id;
		id = id.toString().split("_");
		
			let desperdicios = this.state.desperdicios
			desperdicios.map((desperdicio, i)=> (
				//console.log(invoice)
				desperdicio.id == id[1] ? desperdicio.item_id = item.value : false		
	
			));
			this.setState(
				{
					desperdicios:desperdicios
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

	esflexible = (e, item) => {
		
		let desperdicios = [];
		desperdicios = this.state.desperdicios
		console.log(item)
		let id = item.id;
		id = id.toString().split("_");	
		//console.log(id)	
		if (item.checked)
		this.state.desperdicios.map((desperdicio, i)=> (
			//console.log(invoice)
			desperdicio.id == id[1] ? desperdicio.flexible = true : false		

		));
		else
		desperdicios.map((desperdicio, i)=> (
			//console.log(invoice)
			desperdicio.id == id[1] ? desperdicio.flexible = false : false		

		));
		console.log(desperdicios)
		this.setState(
			{
				desperdicios:desperdicios
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

		agregar_desperdicio = () =>{
			let id =this.state.despercont;
			let desperdicio={id:id,cantidad:1,item_id:0,flexible:false}
			id++;
			let desperdicios = [...this.state.desperdicios, desperdicio]

		//console.log(seleccionados)
		this.setState(
			{
				desperdicios:desperdicios,
				despercont:id
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
			comprables,
			buttonactive,
			insumos,
			pts,
			guardarcantidad,
			guardarcantidadpt,
			guardarcantidadflex,		
			from_agency,
			to_agency,
			selectAg,
			show,
            nombre,tipo_insumo,genera_unico,rv,gd, options,  unico, items, tipoinsumo, esunico,gdf, rvf, action, desperdicios
			
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
							items={comprables}
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
			{(gd) ? (<React.Fragment>
			<p >DESPERDICIO</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					FLEXIBLE
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
						<FilaDesperdicio
							items={comprables}
							selectitem={this.SelectItemFlex}
							id={t.id}
							flexible={t.flexible}
							item_id={t.item_id}
							esflexible={this.esflexible}
							guardarcantidad={guardarcantidadflex}
							cantidad={t.cantidad}
							view={true}
							buscaritem={this.buscariitem}
						/>
					))}
			</Table.Body>
			</Table>
			</React.Fragment>
			):('')
			}			
              </div>
			)
		else if (action=='edit')
			return (
				<div >
				<form onSubmit={this.handleSubmit}>
				<Grid>
			
							{nombre!==null ? (
			<Grid.Row><Grid.Column>
			<label>
			  Nombre
			  <input type="text" placeholder="Nombre"  name="nombre"
                     className="mr-sm-2" value={this.state.nombre}
				onChange={this.handleInputChange} />
			</label></Grid.Column></Grid.Row>):("")
							}
			{tipo_insumo!==null ? (
			<Grid.Row><Grid.Column><label>
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
			</label></Grid.Column></Grid.Row>):('')}
			<Grid.Row>
			{genera_unico!==null ? (
			<Grid.Column><label>
			  Genera Items únicos?
			  <Checkbox
						onChange={esunico}
						toggle
						checked={unico}
					/>
			</label></Grid.Column>):('')}

			{rv!==null ? (
			<Grid.Column><label>
			  Recurso Variable?
			  <Checkbox
						onChange={rvf}
						toggle
						checked={rv}
					/>
			</label></Grid.Column>):('')}

			{gd!==null ? (
			<Grid.Column><label>
			  Genera Desperdicio?
			  <Checkbox
						onChange={gdf}
						toggle
						checked={gd}
					/>
			</label></Grid.Column>):('')}
			</Grid.Row>
			<Grid.Row><Grid.Column><label>
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
			</label></Grid.Column><Grid.Column><label>
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
			</label></Grid.Column></Grid.Row>

			{buttonactive ? ( <React.Fragment> <Grid.Row><Grid.Column><Button type="button"   onClick={() => {
										this.agregar_insumo();
									}}	>Agregar Insumo</Button></Grid.Column><Grid.Column><Button type="button"    onClick={() => {
										this.agregar_pt();
									}}	>Agregar Producto Terminado</Button></Grid.Column></Grid.Row></React.Fragment>):('')}			
			
		  
		  </Grid>	
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
							items={comprables}
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

			{(gd) ? (<React.Fragment>
			<p >DESPERDICIO</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					FLEXIBLE
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
						<FilaDesperdicio
							items={comprables}
							selectitem={this.SelectItemFlex}
							id={t.id}
							flexible={t.flexible}
							item_id={t.item_id}
							esflexible={this.esflexible}
							guardarcantidad={guardarcantidadflex}
							cantidad={t.cantidad}
						/>
					))}
			</Table.Body>
			</Table>
			</React.Fragment>
			):('')
			}
			<button type="submit" >Guardar</button>
			</form>
			<MostrarMensaje titulo={'Sus Datos fueron editados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			</div>
				
			
		)
		else
		return(
			<div >
				<form onSubmit={this.handleSubmit}>
				<Grid>
			
							{nombre!==null ? (
			<Grid.Row columns={1}><Grid.Column>
			<label>
			  Nombre
			  <input type="text" placeholder="Nombre"  name="nombre"
                     className="mr-sm-2" value={this.state.nombre}
				onChange={this.handleInputChange} />
			</label></Grid.Column></Grid.Row>):("")
							}
			{tipo_insumo!==null ? (
			<Grid.Row columns={1}><Grid.Column><label>
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
			</label></Grid.Column></Grid.Row>):('')}
			<Grid.Row columns={3}>
			{genera_unico!==null ? (
			<Grid.Column><label>
			  Genera Items únicos?
			  <Checkbox
						onChange={esunico}
						toggle
						checked={unico}
					/>
			</label></Grid.Column>):('')}

			{rv!==null ? (
			<Grid.Column><label>
			  Recurso Variable?
			  <Checkbox
						onChange={rvf}
						toggle
						checked={rv}
					/>
			</label></Grid.Column>):('')}

			{gd!==null ? (
			<Grid.Column><label>
			  Genera Desperdicio?
			  <Checkbox
						onChange={gdf}
						toggle
						checked={gd}
					/>
			</label></Grid.Column>):('')}
			</Grid.Row>
			<Grid.Row columns={2}><Grid.Column><label>
			  Origen
			  <Dropdown
					  value={from_agency}
					placeholder='Agencia'
					onChange={selectAg}
					search
					selection
					options={agencias}
					className="mr-sm-2"
					name="from_agency"
				/>
			</label></Grid.Column><Grid.Column><label>
			  Destino
			  <Dropdown
					  value={to_agency}
					placeholder='Agencia'
					onChange={selectAg}
					search
					selection
					options={agencias}
					className="mr-sm-2"
					name="to_agency"
				/>
			</label></Grid.Column></Grid.Row>

			{buttonactive ? ( <React.Fragment> <Grid.Row columns={2}><Grid.Column><Button className="submitform" type="button"   onClick={() => {
										this.agregar_insumo();
									}}	>Agregar Insumo</Button></Grid.Column><Grid.Column><Button  className="submitform" type="button"    onClick={() => {
										this.agregar_pt();
									}}	>Agregar Producto Terminado</Button></Grid.Column></Grid.Row></React.Fragment>):('')}
			{gd ? (<Grid.Row columns={1}><Grid.Column><Button type="button"   className="submitform" onClick={() => {
										this.agregar_desperdicio();
									}}	>Agregar Desperdicio</Button></Grid.Column></Grid.Row>):('')}		
			
		  
		  </Grid>	
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
							items={comprables}
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

			{(gd) ? (<React.Fragment>
			<p >DESPERDICIO</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					FLEXIBLE
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
						<FilaDesperdicio
							items={comprables}
							selectitem={this.SelectItemFlex}
							id={t.id}
							flexible={t.flexible}
							item_id={t.item_id}
							esflexible={this.esflexible}
							guardarcantidad={guardarcantidadflex}
							cantidad={t.cantidad}
						/>
					))}
			</Table.Body>
			</Table>
			</React.Fragment>
			):('')
			}
			<button type="submit" className="submitform">Guardar</button>
			</form>
			<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			</div>
		  
		)
	
}
}