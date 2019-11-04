import { FUNCIONES } from '../utils/utils';
import Axios from 'axios';
import { navigate } from '@reach/router';



export const transfer = async ({  data }) => {

	await Axios.post(`${FUNCIONES.reservaciones}`,data)
					.then(({ data }) => {
						console.log(data)	
					})
					.catch((error) => {
						console.error(error);

						navigate(`/app/login/1`)

						return false;
					});
 

  //return false
}

export const item = async ({  data }) => {

	await Axios.post(`${FUNCIONES.reservaciones}`,JSON.stringify(data))
					.then(({ data }) => {
						console.log(data)
						 

							
						
					})
					.catch((error) => {
						console.error(error);

						navigate(`/app/login/1`)

						return false;
					});
 

  //return false
}


export const handleLogin = async ({ username, password }) => {

	await Axios.post(`${FUNCIONES.login}`,'{"username":"'+username+'","password":"'+password+'"}')
					.then(({ data }) => {
						console.log(data)
						 setUser({
							username: data.username,
							name: data.first_name+' '+data.last_name,
							email: data.email,
							group_id:data.group_id,
							eid:data.employee_id,
							store:data.store_id
							})

							if(data.group_id == "2"){
								navigate(`/app/ordenesp`)
							}else{
								navigate(`/app/ordenes`)
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
	
  setUser({})
  //callback()
}
