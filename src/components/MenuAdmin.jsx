//@ts-check
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

export default class MenuAdmin extends Component {


	render() {
		let { onClick, admin } = this.props;
		console.log(admin)
			if (admin)
				return (
		<React.Fragment>
				<Menu.Item name="app" path="/app" onClick={onClick} />
				<Menu.Item name="config" path="/config" onClick={onClick} />	
				</React.Fragment>
				)
			else
			return(
				<React.Fragment>
				<Menu.Item name="Listado" path="/listado" onClick={onClick} />
					
				</React.Fragment>
			)
		
	}
}