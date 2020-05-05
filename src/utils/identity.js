import { FUNCIONES } from '../utils/utils';
import Axios from 'axios';
import { navigate } from '@reach/router';

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}

const setUser = user =>
  window.localStorage.setItem("gatsbyUser", JSON.stringify(user))

export const handleLogin = async ({ username, password }) => {

	await Axios.post(`${FUNCIONES.auth}`,'{"username":"'+username+'","password":"'+password+'"}')
					.then(({ data }) => {
						console.log(data)
						 setUser({
							username: data.username,
							name: data.first_name+' '+data.last_name,
							email: data.email,
							group_id:data.group_id,
							eid:data.employee_id,
							store:data.store_id,
							redirect:data.avatar
							})
							//console.log(data)
							if(data.group_id == "2"){
								navigate(`/app/ordenesp`)
							}else{
								navigate(data.avatar)
							}
							
							//return data.group_id
						
					})
					.catch((error) => {
						console.error(error);

						navigate(`/app/login/1`)

						return false;
					});
 

  //return false
}

export const isLoggedIn = () => {
  const user = getUser()

  return !!user.username
}

export const logout = callback => {
	window.localStorage.removeItem("agencias")
		window.localStorage.removeItem("vendibles")
		window.localStorage.removeItem("comprables")
		window.localStorage.removeItem("menuitems")
		window.localStorage.removeItem("equipos")
		window.localStorage.removeItem("empleados")
		window.localStorage.removeItem("marcas")
		window.localStorage.removeItem("referencias")
  setUser({})
  //callback()
}
