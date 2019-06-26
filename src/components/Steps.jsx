//@ts-check
import React, { Component } from 'react';
import { Step, Icon, Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import { isLoggedIn, logout , getUser} from "../utils/identity"

export default class Steps extends Component {
	state = {};
	
	render() {
		let { active: step, tipoSeleccionado: tipo, general, cobros, entregas, servicios, group_id} = this.props;
		let tipoSeleccionado = tipo !== null;

		let userdata = getUser()
		//console.log(this.props)

		if (userdata.group_id<4) {
		return (
			<Menu>
				{general != null?(
				<Menu.Item
					active={step === 6}
					onClick={() => {
						navigate('/app/general')
					}}
					name={'General'}
					icon={'file alternate'}
					
					
				></Menu.Item>):('')
				}
				{cobros != null?(
				<Menu.Item
					active={step === 1}
					onClick={() => {
						navigate('/app/cobros')
					}}
					name={'Facturas no pagadas'}
					icon={'file alternate'}
					
				>
					
					
				</Menu.Item>):('')
				}

				{entregas != null?(
				<Menu.Item
					
					active={step === 2}
					onClick={() => {
						navigate('/app/transferencias')
					}}
					name={'Entregas pendientes'}
					icon={"dolly flatbed"}
				>
				
					
				</Menu.Item>):('')
				}
				{ servicios != null?(
				<Menu.Item
					
					active={step === 4}
					onClick={() => {
						navigate('/app/casos')
					}}
					name={'Servicios'}
					icon={"cogs"}
				>
					
					
				</Menu.Item>):('')
				}
				<Menu.Item
					
					active={step === 7}
					onClick={() => {
						navigate('/app/compras')
					}}
					name={'Compras'}
					icon={"tag"}
				>
					
					
				</Menu.Item>
				{userdata.group_id < 3 ? (
				<Menu.Item
					
					active={step === 3}
					onClick={() => {
						navigate('/app/mandados')
					}}
					name={'Tareas'}
					icon={"list ol"}
				>
					
					
		</Menu.Item>):(<Menu.Item
					
					active={step === 10}
					onClick={() => {
						navigate('/app/mandadosu')
					}}
					name={'Tareas'}
					icon={"list ol"}
				></Menu.Item>)}
				{userdata.group_id == 1 ? (
				<Menu.Item
					
					active={step === 3}
					onClick={() => {
						navigate('/app/config')
					}}
					name={'Config'}
					icon={"cogs"}
				>
					
					
		</Menu.Item>):('')}
			
			</Menu>
		);
				}else{
					return (
						<Menu>
							<Menu.Item
					
					active={step === 10}
					onClick={() => {
						navigate('/app/mandadosu')
					}}
					name={'Tareas'}
					icon={"list ol"}
				></Menu.Item>
						</Menu>
					)
				}
	}
}
