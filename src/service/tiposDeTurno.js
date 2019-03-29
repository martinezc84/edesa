const axios = require('axios');
const headers = require('../utils/utils');
const URLS = require('../utils/utils');
const URL = URLS.tiposDeTurno;
exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		let { data } = await axios.get(URL, { headers });
		return {
			statusCode: 200,
			body: JSON.stringify(data)
		};
	} catch (error) {
		console.log(error);
		console.log(URL);
		return {
			statusCode: 503,
			body: JSON.stringify(error)
		};
	}
};
