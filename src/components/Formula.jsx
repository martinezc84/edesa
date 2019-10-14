//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import {  Dropdown, Checkbox } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import Inputdate from './Inputdate_edit';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';

const options = [
	{
	  key: 'unico',
	  text: 'UNICO',
	  value: 'unico',
	},
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
		formula:null,
		tipo_insumo: "",
		genera_unico: "",
		tiempo_de_produccion: "",
		nombre: "",		
		rv: null,
		gd: null,
		activa:null,
		options:options,
		unico:null
				
    };
    
    shouldComponentUpdate(np) {
		
		return true;
		
	}

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
		
	
			let { guardar, id, action  } = this.props;
					Axios.get(`${FUNCIONES.vendibles}`)
					.then(({ data }) => {
					
						let vendibles
						vendibles = data
						guardar('vendibles', vendibles);
						this.setState({
							vendibles: vendibles,
							
						});
					})
					.catch((error) => {
						console.error(error);
					});
					
					Axios.get(FUNCIONES.comprables)
					.then(({ data }) => {
						//console.log(data)

						let comprables = data
						
					
						this.setState({
							comprables: comprables,
						
							
						});
					})
					.catch((error) => {
						console.error(error);
					});

					Axios.get(FUNCIONES.formula+"?id="+id)
					.then(({ data }) => {
						//console.log(data)
						let unico
						let rv
						let gd
						let formula = data
						formula.genera_unico ==1 ? unico =true: unico=false;
						formula.rv ==1 ? rv =true: rv=false;
						formula.gd ==1 ? gd =true: gd=false;
						this.setState({
							nombre: formula.nombre,
							tipo_insumo:formula.tipo_insumo,
							tiempo_de_produccion:formula.tiempo_de_produccion,
							rv:rv,
							gd:gd,
							activa:formula.activa,
							unico:unico,
							formula:formula
						
							
						});
					})
					.catch((error) => {
						console.error(error);
					});

					this.setState({
						tipoinsumo: this.tipoinsumo,
						esunico:this.esunico,
						rvf:this.rv,
						gdf:this.gd,
						action:action
						
					});
			
    
}



	SeleccionarTipo = (e, item) => {

		this.setState(
			{
                empleadoid:item.value,
                empleado:item
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
		tipo_insumo= item.value
		this.setState({
			tipo_insumo: tipo_insumo
        });
	};

	
	  generar_mandados = async () => {
	
		this.setState({
			visible: false
        });
        
        let fecha = this.state.fecha;
	
		// Ciclo de llamadas
		
			try {
							

				if(fecha==null){
					
					fecha = this.state.date
				}
				
				
				// @ts-ignore
				let nombre  = this.get_empleado(this.state.empleadoid)
			
				
	
				let fechastr = fecha.toLocaleDateString('en-US');
				let horastr = fecha.getHours();
				let minutes = fecha.getMinutes();
			
				fecha = fechastr.split('/');
				fechastr = fecha[2]+'/'+fecha[0]+'/'+fecha[1]
				const posttext = '{"id":"'+this.props.id+'","fecha": "'+fechastr+'", "hora": "'+horastr+':'+minutes+':00",  "descripcion":"'+this.state.descrip+'","user":"'+this.state.userdata.username+'", "nota":"'+this.state.nota+'"}'
				//console.log(posttext)

			
				//console.log(data)
			} catch (error) {
				console.error({ error });
				
			} finally {
				this.setState({
					
					visible:true
				});
			
			
			}
		
		
		};
		
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/mandados/')
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
            event.preventDefault()
            this.generar_mandados()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					

				

	render() {

        
		let {
            nombre,tipo_insumo,genera_unico,rv,gd,activa,tiempo_de_produccion, options, unico, formula, tipoinsumo, esunico,gdf, rvf, action
			
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
						
              </div>
			)
		else
			return (
                <div >
                <form onSubmit={this.handleSubmit}>
								{nombre!==null ? (
                <label>
                  Nombre
				  <input
                    type="text"
                    name="nombre"
                    value={this.state.nombre}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
                </label>):("")
								}
                {formula!==null ? (
                <label>
                  Insumo
				  <Dropdown
				  		value={tipo_insumo}
						placeholder='Tipo Insumo'
						onChange={tipoinsumo}
						fluid
						selection
						options={options}
					/>
				</label>):('')}
				{genera_unico!==null ? (
                <label>
                  Genera Items únicos?
				  <Checkbox
							onChange={esunico}
							toggle
							checked={unico}
						/>
				</label>):('')}

				{rv!==null ? (
                <label>
                  Recurso Variable?
				  <Checkbox
							onChange={rvf}
							toggle
							checked={rv}
						/>
				</label>):('')}

				{gd!==null ? (
                <label>
                  Genera Desperdicio?
				  <Checkbox
							onChange={gdf}
							toggle
							checked={gd}
						/>
				</label>):('')}
				

								
                <button type="submit" className="submitform">Guardar</button>
              </form>
							<MostrarMensaje titulo={'Sus Datos fueron editados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
              </div>
				
			
		)
	
}
}