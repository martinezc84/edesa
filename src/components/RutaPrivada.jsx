//@ts-check
import React from 'react';
//import netlifyIdentity from 'netlify-identity-widget';
import { isLoggedIn, logout } from "../utils/identity"
import Login from './Login'

const RutaPrivada = ({ children }) => {
	const user = isLoggedIn()
	// Valida si existe un usuario logeado
	//console.log(user)
	if (user === false) {
		return <div><Login> </Login></div>;
	}

	return <div>{children}</div>;
};

export default RutaPrivada;
