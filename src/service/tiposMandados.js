exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		//let { data } = await axios.get(URL, { headers });
		return {
			statusCode: 200,
			body: '[{"id":1000, "name":"Facturas", "virtual":false},{"id":"1001","name":"Cobros", "virtual":false},{"id":2,"name":"varios", "virtual":false}]'
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			body: JSON.stringify(error)
		};
    }
}