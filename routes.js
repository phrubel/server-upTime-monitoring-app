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

const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
