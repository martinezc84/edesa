import axios from 'axios';
import { headersapi, API_URL } from '../utils/utils';
const URL = API_URL.tiposMandado;
exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		//let body = JSON.parse(event.body);
		console.log(event.queryStringParameters)
		//const { id } = body;
		console.log(URL)
		console.log(headersapi)
		let { data } = await axios.get(URL+"2", { headersapi });
		return {
			statusCode: 200,
			body: JSON.stringify(data)
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			body: JSON.stringify(error)
		};
    }
}