//@ts-check
import React, { Component } from 'react';
import { Step, Icon, Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { FUNCIONES } from '../utils/utils';
import Axios from 'axios';
import Stepitem from './Setpitem';

export default class Steps extends Component {
	state = {};
	
	
	render() {
		let { active: step, tipoSeleccionado: tipo, menuitems} = this.props;
		let tipoSeleccionado = tipo !== null;
		
		let userdata = getUser()
			
		if (userdata.group_id<4) {
		return (
			<Menu>
				
				{menuitems === undefined ? (
					'' ):(menuitems.map((t) => (
						<Stepitem
							step={step}
							ruta={t.route}
							label={t.label}
							iconname={t.icon}
							id={t.step}
						/>
					)))
										
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
