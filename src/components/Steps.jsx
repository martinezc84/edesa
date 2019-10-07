//@ts-check
import React, { Component } from 'react';
import { Step, Icon, Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import { isLoggedIn, logout , getUser} from "../utils/identity"

export default class Steps extends Component {
	state = {};
	
	render() {
		let { active: step, tipoSeleccionado: tipo, general, cobros, entregas, servicios, compras} = this.props;
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
