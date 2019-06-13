//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS } from '../utils/utils';
import {  Dropdown } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import Inputdate from './Inputdate_edit';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';



export default class UnpaidInvoices extends Component {
	state = {
        
        descrip:"",
        empleado:"",
        empleadoid:1254,
		vendedoresseleccionados:[],
		vendedoresseleccionadosId:[],
		startDate: new Date(),
		fecha:null,
		direccion:null,
		tel:null,
		id:null,
		date: new Date(),
				visible:false,
				userdata:null,
				mandado:{descripcion:""},
				fechamandado:null
				
    };
    
    shouldComponentUpdate(np) {
		
		return true;
		
	}

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	// Método para seleccionar o des seleccionar checkbox de turnos
	 

	get_empleado(id){
		
		for (var i=0; i<this.state.empleados.length; i++) {
			//console.log(this.state.fechas[i])
            if (this.state.empleados[i].key==id){
				return this.state.empleados[i];
			}
            //a b c
		}
		
		return null;
    } 
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 console.log(dte)

	};

	
    
    trataEmpleados = (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			todo: t
		}));
	};


	componentDidMount() {
		


	
		this.setState({
			userdata: getUser()
		});
		
	
			let { guardar,   empleados  } = this.props;
		
                
				
					Axios.get(`${ENDPOINTS.empleados}`)
					.then(({ data }) => {
						let empleados = data.filter((d) => d.active === true && d.seller === true && d.inventory_controller === false);
						let	resposables = data.filter((d) => d.inventory_controller === true && d.active === true);

				 empleados = [...empleados,...resposables];
						//console.log(empleados)
						empleados = sortBy(empleados, [ 'name' ]);	
						empleados = this.trataEmpleados(empleados)	


						guardar('empleados', empleados);
						this.setState({
							empleados: empleados,
							
						});
					})
					.catch((error) => {
						console.error(error);
					});
					
					Axios.get(ENDPOINTS.mandado+'?id='+this.props.id)
					.then(({ data }) => {
						//console.log(data)

						let mandado = data
						
					
						this.setState({
							mandado: mandado,
							empleadoid:mandado.employee_id,
							fechamandado:mandado.fecha+" "+mandado.hora,
							descrip:mandado.descripcion
							
						});
					})
					.catch((error) => {
						console.error(error);
					});
			
    
}



	seleccionaVendedor = (e, item) => {

		this.setState(
			{
                empleadoid:item.value,
                empleado:item
			})
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
				const posttext = '{"id":"'+this.props.id+'","fecha": "'+fechastr+'", "hora": "'+horastr+':'+minutes+':00",  "cliente":"","descripcion":"'+this.state.descrip+'","user":"'+this.state.userdata.username+'", "active":"1"}'
				//console.log(posttext)

				const data = await Axios.post(ENDPOINTS.editarmandados, posttext);
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
            empleados,
						empleadoid,
						mandado,
						fechamandado
			
		} = this.state;

		
			return (
                <div >
                <form onSubmit={this.handleSubmit}>
								{fechamandado!==null ? (
                <label>
                  Fecha
                  <Inputdate
                    date={fechamandado}
                    guardar={this.guardar}                   
        />
                </label>):("")
								}
                {fechamandado!==null ? (
                <label>
                  Descripción
                  <input
                    type="text"
                    name="descrip"
                    value={this.state.descrip}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
                </label>):('')}

								
                <button type="submit" className="submitform">Guardar</button>
              </form>
							<MostrarMensaje titulo={'Sus Datos fueron editados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
              </div>
				
			)
	
}
}
