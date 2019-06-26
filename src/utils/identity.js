import { ENDPOINTS } from '../utils/utils';
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

	await Axios.post(`${ENDPOINTS.login}`,'{"username":"'+username+'","password":"'+password+'"}')
					.then(({ data }) => {
						//console.log(data)
						 setUser({
							username: data.username,
							name: data.first_name+' '+data.last_name,
							email: data.email,
							group_id:data.group_id,
							eid:data.employee_id,
							store:data.store_id
							})

							if(data.group_id == "4"){
								navigate(`/app/mandadosu`)
							}else{
								navigate(`/app/cobros`)
							}
							
							//return data.group_id
						
					})
					.catch((error) => {
						//console.error(error);

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
  setUser({})
  //callback()
}
