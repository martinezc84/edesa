//@ts-check
import axios from 'axios';
import { headers, ZAURU } from '../utils/utils';
const URL = ZAURU.ordendecompra;

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
	
		
		let id = event.queryStringParameters.id;
		let { data } = await axios.put(url+id+'.json' ,event.body,{ headers });
		return {
			statusCode: 200,
			headers:headersr,
			body: JSON.stringify(data)
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			headers:headersr,
			body: JSON.stringify(error)
		};
	}
};
