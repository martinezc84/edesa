import { ENDPOINTS } from '../utils/utils';
import Axios from 'axios';

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}

const setUser = user =>
  window.localStorage.setItem("gatsbyUser", JSON.stringify(user))

export const handleLogin = ({ username, password }) => {

	Axios.post(`${ENDPOINTS.login}`,'{"username":"'+username+'","password":"'+password+'"}')
					.then(({ data }) => {
						console.log(data)
						return setUser({
							username: username,
							name: data.first_name+' '+data.last_name,
							email: data.email,
							group_id:data.group_id
						  })
						
					})
					.catch((error) => {
						console.error(error);
						return false;
					});
 

  return false
}

export const isLoggedIn = () => {
  const user = getUser()

  return !!user.username
}

export const logout = callback => {
  setUser({})
  //callback()
}
