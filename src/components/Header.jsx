//@ts-check
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { navigate } from 'gatsby';
import MenuAdmin from './MenuAdmin'
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import SEO from './seo';
class Header extends Component {
	state = {
		location:null,
		latitude:null,
		longitude:null
	}

	componentDidMount() {

		this.findCoordinates();
		netlifyIdentity.init();
		netlifyIdentity.on('login', (user) => {
			navigate('/');
		});
		netlifyIdentity.on('logout', () => {
			navigate('/');
		});
	}

	onClick = (e, { path }) => {
		navigate(path);
	};

	findCoordinates = () => {
		navigator.geolocation.getCurrentPosition(
		  position => {
			console.log(position)
			let {latitude, longitude} = position.coords;
			console.log(latitude)
			console.log(longitude)
			this.setState({ latitude, longitude });
		  },
		  error => console.log(error.message),
		  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
	  };

	
	
	
	render() {

		
		const user = netlifyIdentity.currentUser();
		let userdata;
		//console.log(user)
		if(user!=null){
			userdata = user.app_metadata;
		//console.log(userdata.roles)
		}
		let logged = !(user === null);
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
						admin = {(userdata.roles[0]=='Admin')}
						>
							
						</MenuAdmin>
						
					) : null}

					<Menu.Menu position="right">
						{logged ? (
							<React.Fragment>
								<Menu.Item
									name="Log out"
									onClick={() => {
										netlifyIdentity.logout();
										navigate('/');
									}}
								/>
								<Menu.Item>{user ? user.email : ''}</Menu.Item>
								
							</React.Fragment>
						) : (
							<Menu.Item name="Login" onClick={() => netlifyIdentity.open()} />
						)}
					</Menu.Menu>
				</Menu>
			</div>
		);
	}
}

export { Header };
