//@ts-check
import axios from 'axios';
import { headers, ZAURU } from '../utils/utils';
const URL = ZAURU.reservaciones;

const headersr = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
	'Content-Type': 'application/json',
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Max-Age': '2592000',
	'Access-Control-Allow-Credentials': 'true',
  };

//@ts-ignore
exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		
		let url = `${URL}`;
		//console.log(event.body);
		let { data } = await axios.post(url ,event.body,{ headers });
		//console.log(data);
		return {
			statusCode: 200,
			headers:headersr,
			body: JSON.stringify(data)
		};
	} catch (error) {
		//console.log(error.response.data);
		return {
			statusCode: 502,
			headers:headersr,
			body: JSON.stringify(error.response.data)
		};
	}
};
