//@ts-check
import axios from 'axios';
import { headers, APIP_URL } from '../utils/utils';
const URL = APIP_URL.reporjson;
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
		let store_id = event.queryStringParameters.store_id;
		let agg = event.queryStringParameters.agg;
		let { data } = await axios.get(URL, { headers });
		console.log(data)
		return {
			statusCode: 200,
			body: JSON.stringify(data),
			headers:headersr
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			body: error
		};
	}
};
