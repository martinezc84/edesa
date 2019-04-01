exports.handler = async (event, context) => {
	try {
		//@ts-ignore
		//let { data } = await axios.get(URL, { headers });
		return {
			statusCode: 200,
			body: '{"mandados":{0:"Facturas",1:"Cobros",2:"varios"}}'
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 502,
			body: JSON.stringify(error)
		};
    }
}