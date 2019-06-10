//@ts-check
import React from 'react';
//import netlifyIdentity from 'netlify-identity-widget';
import { isLoggedIn, logout } from "../utils/identity"
import Login from './Login'

const RutaPrivada = ({ children }) => {
	

	return <div>{children}</div>;
};

export default RutaPrivada;
