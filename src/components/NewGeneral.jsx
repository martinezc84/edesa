//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { ENDPOINTS, API_URL } from '../utils/utils';
import { Table, Checkbox, Label, Dropdown } from 'semantic-ui-react';
import FilaFactura from './FilaFactura';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import Inputdate from './Inputdate';
import { isLoggedIn, logout , getUser} from "../utils/identity"



export default class UnpaidInvoices extends Component {
	state = {
        
        descrip:"",
        empleado:"",
        empleadoid:null,
		vendedoresseleccionados:[],
		vendedoresseleccionadosId:[],
		startDate: new Date(),
		fecha:null,
		direccion:null,
		tel:null,
		date: new Date(),
				visible:false,
				userdata:null
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
    
    guardar = (dte, idf=0) => {
	
		this.setState({
			fecha:dte})

		 //console.log(fechas)

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
		let user = netlifyIdentity.currentUser();
		let { tipo } = this.props;

		let { buscar } = this.state;
	
		this.setState({
			userdata: getUser()
		});
		
	
			let { guardar,   empleados } = this.props;
		
                
				
					Axios.get(`${ENDPOINTS.empleados}`)
					.then(({ data }) => {
						//console.log(data)
						
						let empleados = data.filter((d) => d.seller === true);
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
				let horastr = fecha.getHours()-1;
				let minutes = fecha.getMinutes();
			
				fecha = fechastr.split('/');
				fechastr = fecha[2]+'/'+fecha[0]+'/'+fecha[1]
				const posttext = '{"fecha": "'+fechastr+'", "hora": "'+horastr+':'+minutes+':00",  "cliente":"","descripcion":"'+this.state.descrip+' Direccion:'+this.state.direccion+' Tel.'+this.state.tel+'","tipo":"1","user":"'+this.state.userdata.username+'","employee_id":"'+this.state.empleadoid+'","store_id":1,"encargado":"'+nombre.text+'", "active":"1"}'
				//console.log(posttext)

				const data = await Axios.post(ENDPOINTS.guardarmandados, posttext);
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
			this.props.cambiarStep(3);
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
            empleadoid
			
		} = this.state;

		
			return (
                <div >
                <form onSubmit={this.handleSubmit}>
                <label>
                  Fecha
                  <Inputdate
                    
                    guardar={this.props.guardar}
                    
        />
                </label>
                
                <label>
                  Descripción
                  <input
                    type="text"
                    name="descrip"
                    value={this.state.descrip}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
                </label>

								<label>
                  Dirección
                  <input
                    type="text"
                    name="direccion"
                    value={this.state.direccion}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
                </label>

								<label>
                  Tel.
                  <input
                    type="text"
                    name="tel"
                    value={this.state.tel}
                    onChange={this.handleInputChange}
                    className="inputform"
                  />
                </label>
                
                <label>
                  Encargado
                  <Dropdown
							value={empleadoid}
							onChange={this.seleccionaVendedor}
							placeholder="Selecciona Mensajero"
							fluid							
							search
							selection
							options={empleados}
						/>
                </label>
                <button type="submit" className="submitform">Generar</button>
              </form>
							<MostrarMensaje titulo={'Los mandados fueron creados con exito'} mensajes={'Prueba'}  visible={this.state.visible} onConfirm={this.onConfirm} />
              </div>
				
			)
	
}
}
