// const headers = {
// 	Accept: 'application/json',
// 	'Content-type': 'application/json',
// 	'X-User-Email': 'api@hermandadtrespotencias.com',
// 	'X-User-Token': '9exrqgKSyK4y8PHDrQRD'
// };
// const PREFIX_ENDPOINT = `https://gatsby-turnos.netlify.com/.netlify/functions/`

// const ENDPOINTS = {
// 	tiposDeTurno: `${PREFIX_ENDPOINT}tiposDeTurno`,
// 	turnosNoVendidos: `${PREFIX_ENDPOINT}turnosNoVendidos`,
// 	turnosVendidos: `${PREFIX_ENDPOINT}turnosVendidos`,

// }

// const URLS = {
// 	tiposDeTurno: `https://zauru.herokuapp.com/settings/agencies.json`,
// 	turnosNoVendidos: `https://zauru.herokuapp.com/inventories/stocks.json?warehouse=2505`,
// 	turnosVendidos: `https://zauru.herokuapp.com/sales/reports/sold_active_items_with_clients.json?point_of_sale_id=2505`
// };

const URL_PREFIX = process.env.GATSBY_URL;
const URL_API = process.env.GATSBY_URL_API;
const URL_APIP = process.env.GATSBY_URL_APIP
const ZAURU_URL = process.env.GATSBY_ZAURU_URL;

const headers = {
	Accept: 'application/json',
	'Content-type': 'application/json',
	'X-User-Email': process.env.GATSBY_EMAIL,
	'X-User-Token': process.env.GATSBY_TOKEN
};

const FUNCIONES = {
	
	Funciones:URL_PREFIX + process.env.GATSBY_URL_FUNCIONES,
	saveimage :URL_PREFIX+process.env.GATSBY_URL_FIRMA,
	savephoto :URL_PREFIX+process.env.GATSBY_URL_PHOTO,
	login: URL_PREFIX+process.env.GATSBY_URL_LOGIN,
	editarformula:URL_PREFIX+process.env.GATSBY_URL_EDITARFORMULA,
	editarorden:URL_PREFIX+process.env.GATSBY_URL_EDITARORDENP,
	editarsecuencia:URL_PREFIX+process.env.GATSBY_URL_EDITARSECUENCIA,
	formula:URL_PREFIX+process.env.GATSBY_URL_FORMULA,
	formulas:URL_PREFIX+process.env.GATSBY_URL_FORMULAS,
	menus:URL_PREFIX+process.env.GATSBY_URL_MENUS,
	ordenes:URL_PREFIX+process.env.GATSBY_URL_ORDENESP,
	orden:URL_PREFIX+process.env.GATSBY_URL_ORDENP,
	secuencia:URL_PREFIX+process.env.GATSBY_URL_SECUENCIA,
	secuencias:URL_PREFIX+process.env.GATSBY_URL_SECUENCIAS,
	formulas:URL_PREFIX+process.env.GATSBY_URL_FORMULAS,
	guardardaroden:URL_PREFIX+process.env.GATSBY_URL_GUARDARORDENP,
	guardarsecuencia:URL_PREFIX+process.env.GATSBY_URL_GUARDARSECUENCIA,
	guardarformula:URL_PREFIX+proccess.env.GATSBY_URL_GUARDARFORMULA
	
};

const ZAURU = {
	
	Casos: ZAURU_URL + process.env.GATSBY_ENDPOINT_CASOS
	
};

const API_URL = {
	tiposMandado: URL_API+process.env.GATSBY_ENDPOINT_MANDADO,
	tipoMandado: URL_API+process.env.GATSBY_URL_MANDADO,
	listadoMandados: URL_API,
	listadoAutorizados :URL_API+process.env.GATSBY_ENDPOINT_AUTORIZADOS_LIST

}

const APIP_URL = {
	ordenes: URL_APIP+process.env.GATSBY_APIP_INDEX,
	orden: URL_APIP+process.env.GATSBY_APIP_ORDEN,
	guardarorden: URL_APIP+process.env.GATSBY_APIP_GUARDARORDEN,
	editarorden: URL_APIP+process.env.GATSBY_APIP_EDITARORDEN,
	formulas: URL_APIP+process.env.GATSBY_APIP_FORMULAS,
	formula: URL_APIP+process.env.GATSBY_APIP_FORMULA,
	guardarformula: URL_APIP+process.env.GATSBY_APIP_GUARDARFORMULA,
	editarformula: URL_APIP+process.env.GATSBY_APIP_EDITARFORMULA,
	guardarsecuencia: URL_APIP+process.env.GATSBY_APIP_GUARDARSECUENCIA,
	editarsecuencia: URL_APIP+process.env.GATSBY_APIP_EDITARSECUENCIA,
	groupmenu: URL_APIP+process.env.GATSBY_APIP_GROUPMENU,
	secuencias: URL_APIP+process.env.GATSBY_APIP_SECUENCIAS,
	secuencia: URL_APIP+process.env.GATSBY_APIP_SECUENCIA,

}


const ENV = process.env.GATSBY_ENV;

export { headers, ENV, ZAURU, API_URL, APIP_URL, FUNCIONES };
