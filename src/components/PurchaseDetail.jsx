//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaDetalle from './FilaDetalle';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class UnpaidInvoices extends Component {
	state = {
		Cells:[],
		date: new Date(),
		visible:false,
		userdata:null,
		first:0,
		productos:[],
		orden_compra:0,
		purchase_id:null
	
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	// Método para seleccionar o des seleccionar checkbox de turnos





	componentDidMount() {
		
		let { tipo, orden_compra } = this.props;

		let { buscar } = this.state;
		
		let user = getUser();
		this.setState({
			userdata: user,
			orden_compra:orden_compra,
			purchase_id:this.props.id
		});


		this.agregarlinea("");
		
		
			let { guardar, valores, seleccionadosVendidosID,  empleados } = this.props;
		
		
	}


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

	isin=(id)=>{
		let codigos = this.state.productos

		for(let x=0;x<codigos.length;x++){
			if(codigos[x].id==id){
				return true
			}
		}
		return false
	}

	agregarlinea=(codigo, idl)=>{
		//console.log(codigo)
		if(codigo!=""){
			let nuevo;
			let codes = []
			let codigos = []

			if (this.state.productos.includes(idl)){
				codes = this.state.productos.filter((s) => s.id != idl);
				nuevo = {id:idl,codigo:codigo}

				codigos = [...codes, nuevo]
			}else{
				 nuevo = {id:idl,codigo:codigo}

		 codigos = [...this.state.productos, nuevo];
			}
		console.log(codigos)
		this.setState({
			productos:codigos,
			
		});
		
		}

		let items = [...this.state.Cells];
		let id = this.state.first + 1
		//console.log(id)
		
  items.push({
    id:id,codigo:"name"
	});
	
	this.setState({
		Cells:items,
		first:id
  });
		}

		editarlinea=(codigo, idl)=>{
			//console.log(codigo)
			if(codigo!=""){
				let nuevo;
				let codes = []
				let codigos = []
	
				if (this.isin(idl)){
					codes = this.state.productos.filter((s) => s.id != idl);
					nuevo = {id:idl,codigo:codigo}
	
					codigos = [...codes, nuevo]
				}else{
					 nuevo = {id:idl,codigo:codigo}
	
			 codigos = [...this.state.productos, nuevo];
				}
			//console.log(codigos)
			this.setState({
				productos:codigos,
				
			});
			
			}
	
			}
  
		
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
		
		}

		Guardar= async ()=>{

			this.setState({
				loading: true
			});
			let codigos = this.state.productos;
			let detalle =''
			
			for (let x = 0; x< codigos.length;x++){
				if(x>0){
					detalle=detalle+',';
				}
				
				detalle=detalle+'"'+codigos[x].codigo+'"'
				
			}

			let orden = '{"id":'+this.state.purchase_id+',"items":['+detalle+'],"store":"'+this.state.userdata.store+'"}'

			const data = await Axios.post(ENDPOINTS.editarorden, orden);

			let fechapartida=[];
			let frealizado = new Date();
			let fechastr = frealizado.toLocaleDateString('en-US');
			fechapartida = fechastr.split('/');
					fechastr = fechapartida[2]+'/'+fechapartida[1]+'/'+fechapartida[0]
			let fecha = this.props.fechamandado
			let hours = new Date().getHours(); //Current Hours
					let min = new Date().getMinutes(); //Current Minutes
					let sec = new Date().getSeconds(); //Current Seconds
					let coordenadas=""
				if (this.props.coordenadas!==undefined){
					 coordenadas=this.props.coordenadas
				}else{
					coordenadas = '0,0';
				}	
			await Axios.post(ENDPOINTS.editarmandados,'{"realizado":"1","id":'+this.props.idmandado+', "fecha":"'+fecha[0].fecha+'", "fecha_realizado":"'+fechastr+'", "hora_realizado":"'+hours+':'+min+':'+sec+'","coordenadas":"'+coordenadas+'"}')
				.then(({ data }) => {
					console.log(data)
					
					
				})
				.catch((error) => {
					console.error(error);
				});
				this.setState({
					loading: false
				});

			//navigate('/app/mandados/')
		}

	render() {
		let {
			Invoices,
			loading,
			seleccionadosId,
			seleccionados,
			vendedoresseleccionadosId,
			vendedoresseleccionados,
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction,
			Cells
		} = this.state;
//console.log(Cells)
		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					
					
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Orden de compra</Header>
							

							
								
								<Table sortable celled>
									<Table.Header>
									<Table.Row>
									
										
										<Table.HeaderCell
											sorted={column === 'o' ? direction : null}
											onClick={this.handleSort('o')}
										>
											Tag
										</Table.HeaderCell>
										
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Cells
											.map((t) => (
												<FilaDetalle
													
													fila={t}
													agregarlinea={this.agregarlinea}
													editarlinea={this.editarlinea}
												
		
													
												/>
											))}
									</Table.Body>
								</Table>
							</div>

							
								<Button
									
									primary
									onClick={ ()=>{
										
										this.agregarlinea("")}	
									}							
									icon
									labelPosition="left"
								>
								<Icon name="disk" />
									Agregar Linea
								</Button>

								<Button
									
									primary
									onClick={ ()=>{
										
										this.Guardar()}	
									}							
									icon
									labelPosition="left"
								>
								<Icon name="cogs" />
									Guardar
								</Button>

							

							
						</React.Fragment>
						
					
					<MostrarMensaje titulo={'Los mandados fueron creados con exito'} mensajes={'Prueba'}  visible={this.state.visible} onConfirm={this.onConfirm} />
				</React.Fragment>
				
			);
	}
}
