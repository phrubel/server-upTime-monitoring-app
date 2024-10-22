/*
Comments:
    * Title: Uptime Monitoring App
    * Description: Server uptime monitoring app with Restful Api.
    * Author: Parvez Hasan Rubel
    * Date: 08/10/2024
    * 1.0.0: 2022.10.20
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environments = require('./helpers/environments');

const data = require('./lib/data');

// app object module scaffolding
const app = {};

data.createData(
  'test',
  'text',
  { name: 'Parvez Hasan Rubel', age: 21, job: 'student' },
  (err) => {
    console.log(err);
  }
);

// create server
app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(environments.port);
  console.log(`Server listening on port ${environments.port}...`);
};

// handle request
app.handleRequest = handleReqRes;

// start server
app.createServer();
