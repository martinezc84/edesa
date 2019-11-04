//@ts-check
import React, { Component } from 'react';
import { Step, Icon, Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
export default class Stepitem extends Component {
	// Evita re renders innecesarios al cambiar el state

	render() {
		let { step, ruta, label, iconname, id } = this.props;
			return (
				<Menu.Item
					active={step === id}
					
					onClick={() => {
						navigate(ruta)
					}}
					name={label}
					icon={iconname}
				></Menu.Item>
			);
	
	}
}
