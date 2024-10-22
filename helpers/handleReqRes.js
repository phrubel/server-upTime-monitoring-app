/*
Comments:
    * Title: handle req res
    * Description: handle request and response.
    * Author: Parvez Hasan Rubel
    * Date: 08/10/2024
    * version: 1.0.0: 
*/

// dependencies
const url = require('url');
const routes = require('../routes');
const StringDecoder = require('string_decoder').StringDecoder;
const { notFoundHandler } = require('../handler/routeHandlers/notFoundHandler');

// module scaffolding
const handler = {};

// handle request and response
handler.handleReqRes = (req, res) => {
  // request handling
  // get url and parse it
  const parsedUrl = url.parse(req.url, true);
  // get pathname
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // get query string as an object
  const queryStringObject = parsedUrl.query;
  // get HTTP method
  const method = req.method.toLowerCase();

  // get headers as an object
  const headers = req.headers;

  // request properties
  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    queryStringObject,
    method,
    headers,
  };

  // decode payload
  const decoder = new StringDecoder('utf-8');
  let realData = '';

  // choose the handler this request should go to. if one is not found, use the not found handler
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  // get the payload, if any from the request object
  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });

  // send response
  req.on('end', () => {
    realData += decoder.end();
    // construct the data object to send to the handler
    chosenHandler(requestProperties, (statusCode, payload) => {
      // check the status code
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      // check the payload
      payload = typeof payload === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      // finally send response
      res.writeHead(statusCode);
      res.end(payloadString);
    });

    // response
    res.end('Welcome to uptime monitoring App!');
  });

  // choose the handler this request should go to. if one is not found, use the not found handler
};

module.exports = handler;
