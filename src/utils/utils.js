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

const URL_PREFIX = process.env.GATSBY_NFUNC_URL_PREFIX;
const URL_PREFIX_API = process.env.GATSBY_URL_API;
const ZAURU_PREFIX = process.env.GATSBY_ZAURU_PREFIX;

const headers = {
	Accept: 'application/json',
	'Content-type': 'application/json',
	'X-User-Email': process.env.GATSBY_EMAIL,
	'X-User-Token': process.env.GATSBY_TOKEN
};

const NF_ENDPOINTS = {
	empleados: URL_PREFIX + process.env.GATSBY_URL_EMPLEADOS,
	tiposDeTurno: URL_PREFIX + process.env.GATSBY_URL_TIPOS_DE_TURNO,
	turnosNoVendidos: URL_PREFIX + process.env.GATSBY_URL_TURNOS_NO_VENDIDOS,
	turnosVendidos: URL_PREFIX + process.env.GATSBY_URL_TURNOS_VENDIDOS,
	REASIGNAR: URL_PREFIX + process.env.GATSBY_URL_REASIGNAR,
	UNO: URL_PREFIX + process.env.GATSBY_URL_UNO,
	DOS: URL_PREFIX + process.env.GATSBY_URL_DOS,
	TRES: URL_PREFIX + process.env.GATSBY_URL_TRES,
	CUATRO: URL_PREFIX + process.env.GATSBY_URL_CUATRO,
	CINCO: URL_PREFIX + process.env.GATSBY_URL_CINCO,
	tiposMandado: URL_PREFIX + process.env.GATSBY_URL_MANDADOS,
	UnpaidInvoices: URL_PREFIX + process.env.GATSBY_UNPAID_INVOICES,
	guardarmandados:URL_PREFIX + process.env.GATSBY_URL_GUARDAR_MANDADO,
	editarmandados:URL_PREFIX + process.env.GATSBY_URL_EDITAR_MANDADO,
	editarmandadoss:URL_PREFIX + process.env.GATSBY_URL_EDITAR_MANDADOS,
	ListaMandados:URL_PREFIX + process.env.GATSBY_URL_LISTADO_MANDADOS,
	Funciones:URL_PREFIX + process.env.GATSBY_URL_FUNCIONES,
	saveimage :URL_PREFIX+process.env.GATSBY_URL_FIRMA,
	savephoto :URL_PREFIX+process.env.GATSBY_URL_PHOTO,
	Entregas :URL_PREFIX+process.env.GATSBY_URL_ENTREGAS,
	Casos :URL_PREFIX+process.env.GATSBY_URL_CASOS,
	editarTipoMandado: URL_PREFIX+process.env.GATSBY_URL_EDITAR_TIPO_MANDADO
	
};

const ZAURU_URL = {
	tiposDeTurno: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_TIPOS_DE_TURNO,
	UnpaidInvoices: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_UNPAID_INVOICES,
	PurchaseOrders: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_PURCHASES_ORDERS,
	empleados: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_EMPLEADOS,
	turnosNoVendidos: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_TURNOS_NO_VENDIDOS,
	turnosVendidos: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_TURNOS_VENDIDOS,
	UNO: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_UNO,
	DOS_1: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_DOS_1,
	DOS_2: process.env.GATSBY_ENDPOINT_DOS_2,
	TRES: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_TRES,
	CUATRO_1: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_CUATRO_1,
	CUATRO_2: process.env.GATSBY_ENDPOINT_CUATRO_2,
	CINCO_1: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_CINCO_1,
	CINCO_2: process.env.GATSBY_ENDPOINT_CINCO_2,
	Entregas: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_ENTREGAS,
	Casos: ZAURU_PREFIX + process.env.GATSBY_ENDPOINT_CASOS
	
};

const API_URL = {
	tiposMandado: URL_PREFIX_API+process.env.GATSBY_ENDPOINT_MANDADO,
	tipoMandado: URL_PREFIX+process.env.GATSBY_URL_MANDADO,
	listadoMandados: URL_PREFIX_API

}

//2 https://zauru.herokuapp.com/inventories/bookings/****ID****/deliver.json
//4 https://zauru.herokuapp.com/inventories/bookings/****ID****/deliver.json
//5 https://zauru.herokuapp.com/sales/unpaid_invoices/****ID****.json

const ENV = process.env.GATSBY_ENV;

export { headers,  API_URL as API_URL, ZAURU_URL as URLS, NF_ENDPOINTS as ENDPOINTS, ENV };
