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
		let {  step, menuitems, borrarmem} = this.props;
			
		let userdata = getUser()
			console.log('menuitems')
			console.log(menuitems)
		if (userdata.group_id<4) {
		return (
			<Menu size='mini'>
				
				{!menuitems ? (
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
				
				<Menu.Item
					
					onClick={borrarmem}
					name={'limpiar'}
					icon={'trash'}
				></Menu.Item>
			
			</Menu>
		);
				}
	}
}
