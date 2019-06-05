//@ts-check
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import MenuAdmin from './MenuAdmin'
import { isLoggedIn, logout, getUser } from "../utils/identity"
import '../css/style.css';
import SEO from './seo';
class Header extends Component {
	state = {
		location:null,
		latitude:null,
		longitude:null
	}

	componentDidMount() {

		if (!isLoggedIn() && location.pathname !== `/app` && location.pathname !== `/listado`) {
			navigate(`/app`)
			return null
			
		}
	}

	onClick = (e, { path }) => {
		navigate(path);
	};

	
	
	
	
	render() {

		
		const user =isLoggedIn();
		let userdata={group_id:0};
		//console.log(user)
		if(user!=false){
			userdata = getUser()
		//console.log(userdata)
		}
		let logged = !(user === false);
		return (
			<div>
				<SEO
					description="app"
					title="Control de Mandados"
					keywords={[ `zauru`, `mandados`, `react`, `tailwindcss` ]}
				/>

				<Menu>
					<Menu.Item name="Inicio" path="/" onClick={this.onClick} />
					{logged ? (
						
						<MenuAdmin
						onClick={this.onClick}
						// @ts-ignore
						admin = {userdata.group_id}
						>
							
						</MenuAdmin>
						
					) : null}

					<Menu.Menu position="right">
						{logged ? (
							<React.Fragment>
								<Menu.Item
									name="Log out"
									onClick={() => {
										logout()
										navigate('/');
									}}
								/>
								<Menu.Item>{user ? user : ''}</Menu.Item>
								
							</React.Fragment>
						) : (
							''
						)}
					</Menu.Menu>
				</Menu>
			</div>
		);
	}
}

export { Header };
