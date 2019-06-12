//@ts-check
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

export default class MenuAdmin extends Component {


	render() {
		let { onClick, admin } = this.props;
		//console.log(admin)
			if (admin == 1)
				return (
		<React.Fragment>
				<Menu.Item name="app" path="/app" onClick={onClick} />
				<Menu.Item name="config" path="/app/config" onClick={onClick} />	
				</React.Fragment>
				)
			else  
				return(
					<React.Fragment>
				<Menu.Item name="app" path="/app" onClick={onClick} />
					
				</React.Fragment>
				)
			
			
		
	}
}