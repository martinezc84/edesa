/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// note we do use https://www.gatsbyjs.org/packages/gatsby-plugin-create-client-paths/
// for more info read https://www.gatsbyjs.org/docs/authentication-tutorial/#creating-client-only-routes
const axios = require('axios');
const crypto = require('crypto');

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators;

 
  // fetch raw data from turnos
  const fetchTurnos = () => axios.get('https://zauru.herokuapp.com/sales/reports/sold_active_items_with_clients.json?point_of_sale_id=2505',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': procces.env.GATSBY_ZAURU_USER,
      'X-User-Token':procces.env.GATSBY_ZAURU_TOKEN,
    }
  });
 
 
  // fetch raw data from turnos type
  const fetchRandomUser = () => axios.get('https://zauru.herokuapp.com/settings/agencies.json',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': procces.env.GATSBY_ZAURU_USER,
      'X-User-Token':procces.env.ZAURU_TOGATSBY_KEN,
    }
  });
   // await for results
   const res = await fetchRandomUser();
   const turnos = await fetchTurnos();

   // map into these results and create nodes
   res.data.map((user, i) => {
     // Create your node object
     const userNode = {
       // Required fields
       id: `${i}`,
       parent: null,
      children: [],
       internal: {
         type: `RandomUser`, // name of the graphQL query --> allRandomUser {}
         // contentDigest will be added just after
         // but it is required
       },       
       gender: user.zid,
       name: user.name
       // etc...
     }
 

      // Get content digest of node. (Required field)
      const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(userNode))
      .digest(`hex`);
    // add it to userNode
    userNode.internal.contentDigest = contentDigest;
    
     createNode(userNode);
   });

   turnos.data.map((turno, i) => {
    // Create your node object
    const userNode = {
      // Required fields
      id: `${i}`,
      parent: null,
      children: [],
      internal: {
        type: `Turnos`, // name of the graphQL query --> allTurnos {}
        // contentDigest will be added just after
        // but it is required
      },       
      invoice_number: turno.invoice_number,
      order_number: turno.order_number,
      invoice_date: turno.invoice_date,
      item_name: turno.item_name,
      item_code: turno.item_code,
      quantity: turno.quantity,
      unit_price: turno.unit_price,
      price: turno.price,
      client_name: turno.client_name,
      client_code: turno.client_code,
      // etc...
    } 
    
    const contentDigest = crypto
    .createHash(`md5`)
    .update(JSON.stringify(userNode))
    .digest(`hex`);
  // add it to userNode
  userNode.internal.contentDigest = contentDigest;
  
   createNode(userNode);
 });
   
 
   return;
 }