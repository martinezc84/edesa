//@ts-check
import axios from 'axios';
import { headers, ZAURU } from '../utils/utils';
const URL = ZAURU.itemzauru;
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
		
		let id = event.queryStringParameters.id;
		console.log(URL+id+".json")
		let { data } = await axios.get(URL+id+".json", { headers });
		//console.log(data)
		return {
			statusCode: 200,
			body: JSON.stringify(data),
			headers:headersr
		};
	} catch (error) {
		//console.error(error);
		return {
			statusCode: 502,
			body: JSON.stringify(error.response.data)
		};
	}
};
