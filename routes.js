/*
Comments:
    * Title: Routes
    * Description: handle Routes.
    * Author: Parvez Hasan Rubel
    * Date: 08/10/2024
    * version: 1.0.0: 
*/

// dependencies
const { sampleHandler } = require('./handler/routeHandlers/sampleHandler');
const { userHandler } = require('./handler/routeHandlers/userHandler');
const { tokenHandler } = require('./handler/routeHandlers/tokenHandler');
const { checkHandler } = require('./handler/routeHandlers/checkHandler');

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
