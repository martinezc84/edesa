//@ts-check
import axios from 'axios';
import { headers, APIP_URL } from '../utils/utils';
const URL = APIP_URL.reportebobinas;
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
		let empleado = event.queryStringParameters.empleado;
		let marca = event.queryStringParameters.marca;
		let turno = event.queryStringParameters.turno;
		let fini = event.queryStringParameters.fini;
		let ffin = event.queryStringParameters.ffin;
		let codigo = event.queryStringParameters.codigo;
		let madre = event.queryStringParameters.madre;
		
		let { data } = await axios.get(URL+"?codigo="+codigo+"&madre="+madre+"&empleado="+empleado+"&marca="+marca+"&turno="+turno+"&fini="+fini+"&ffin="+ffin, { headers });
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
			body: JSON.stringify(error)
		};
	}
};
