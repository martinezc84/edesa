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
const production = process.env.GATSBY_PRODUCTION;
const descarte = process.env.GATSBY_DESCARTE

const headers = {
	Accept: 'application/json',
	'Content-type': 'application/json',
	'X-User-Email': process.env.GATSBY_EMAIL,
	'X-User-Token': process.env.GATSBY_TOKEN
};

const FUNCIONES = {
	empleados:URL_PREFIX + process.env.GATSBY_URL_EMPLEADOS,
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
	guardardaroden:URL_PREFIX+process.env.GATSBY_URL_GUARDARORDENP,
	guardarsecuencia:URL_PREFIX+process.env.GATSBY_URL_GUARDARSECUENCIA,
	guardarformula:URL_PREFIX+process.env.GATSBY_URL_GUARDARFORMULA,
	comprables:URL_PREFIX+process.env.GATSBY_URL_COMPRABLES,
	vendibles:URL_PREFIX+process.env.GATSBY_URL_VENDIBLES,
	agencias:URL_PREFIX+process.env.GATSBY_URL_AGENCIAS,
	ordenesventa:URL_PREFIX+process.env.GATSBY_URL_ORDENESVENTA,
	ordenventa:URL_PREFIX+process.env.GATSBY_URL_ORDENVENTA,
	equipos:URL_PREFIX+process.env.GATSBY_URL_EQUIPOS,
	reservaciones:URL_PREFIX+process.env.GATSBY_URL_RESERVACIONES,
	items:URL_PREFIX+process.env.GATSBY_URL_ITEMS,
	PurchaseOrders:URL_PREFIX+process.env.GATSBY_URL_PURCHASES,
	PurchaseOrder:URL_PREFIX+process.env.GATSBY_URL_PURCHASE,
	crearitem:URL_PREFIX+process.env.GATSBY_URL_NEWITEM,
	recibir:URL_PREFIX+process.env.GATSBY_URL_RECEIVEPURCHASE,
	guardaritem:URL_PREFIX+process.env.GATSBY_URL_GUARDARITEM,
	PurchaseOrderEdit:URL_PREFIX+process.env.GATSBY_URL_EDITPURCHASE,
	itemserie:URL_PREFIX+process.env.GATSBY_URL_ITEMSERIE,
	deliver:URL_PREFIX+process.env.GATSBY_URL_DELIVER,
	itemzauru:URL_PREFIX+process.env.GATSBY_URL_ITEMZAURU,
	itemsorden:URL_PREFIX+process.env.GATSBY_URL_ITEMORDEN,
	crearlote:URL_PREFIX+process.env.GATSBY_URL_CREARLOTE,
	guardarlote:URL_PREFIX+process.env.GATSBY_URL_GUARDARLOTE,
	editarlote:URL_PREFIX+process.env.GATSBY_URL_EDITARLOTE,
	lote:URL_PREFIX+process.env.GATSBY_URL_LOTE,
	existencias:URL_PREFIX+process.env.GATSBY_URL_EXISTENCIAS,
	lotezauru:URL_PREFIX+process.env.GATSBY_URL_LOTEZAURU,
	entrega:URL_PREFIX+process.env.GATSBY_URL_ENTREGA,
};

const ZAURU = {
	
	empleados: ZAURU_URL + process.env.GATSBY_API_EMPLEADOS,
	productosvendibles: ZAURU_URL + process.env.GATSBY_API_PRODUCTOSVENDIBLES,
	productoscomprables: ZAURU_URL + process.env.GATSBY_API_PRODUCTOSCOMPRABLES,
	agencias: ZAURU_URL + process.env.GATSBY_API_AGENCIAS,
	ordenesdeventa: ZAURU_URL + process.env.GATSBY_API_ORDENESDEVENTA,
	ordendeventa: ZAURU_URL + process.env.GATSBY_API_ORDENDEVENTA,
	reservaciones: ZAURU_URL + process.env.GATSBY_API_RESERVACIONES,
	items: ZAURU_URL + process.env.GATSBY_API_ITEMS,
	ordenesdecompra:ZAURU_URL + process.env.GATSBY_API_COMPRAS,
	ordendecompra:ZAURU_URL + process.env.GATSBY_API_COMPRA,
	crearitem:ZAURU_URL+process.env.GATSBY_API_ITEM,
	deliver:ZAURU_URL+process.env.GATSBY_API_DELIVER,
	itemzauru:ZAURU_URL+process.env.GATSBY_API_ITEMZAURU,
	crearlote:ZAURU_URL+process.env.GATSBY_API_CREARLOTE,
	lotezauru:ZAURU_URL+process.env.GATSBY_API_LOTEZAURU,
	entrega:ZAURU_URL+process.env.GATSBY_API_ENTREGA
};

const API_URL = {
	
	empleados:URL_API+process.env.GATSBY_API_EMPLEADOS

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
	equipos: URL_APIP+process.env.GATSBY_APIP_EQUIPOS,
	guardaritem:URL_APIP+process.env.GATSBY_APIP_GUARDARITEM,
	itemserie:URL_APIP+process.env.GATSBY_APIP_GETITEMSERIE,
	itemorden:URL_APIP+process.env.GATSBY_APIP_GETITEMORDEN,
	guardarlote:URL_APIP+process.env.GATSBY_APIP_GUARDARLOTE,
	editarlote:URL_APIP+process.env.GATSBY_APIP_EDITARLOTE,
	lote:URL_APIP+process.env.GATSBY_APIP_GETLOTE,
	lotes:URL_APIP+process.env.GATSBY_APIP_GETLOTES,
	existencias:URL_APIP+process.env.GATSBY_APIP_EXISTENCIAS,

}


const ENV = process.env.GATSBY_ENV;

export { headers, ENV, ZAURU, API_URL, APIP_URL, FUNCIONES, production, descarte };
