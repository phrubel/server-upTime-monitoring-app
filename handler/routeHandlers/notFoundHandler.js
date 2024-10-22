/*
Comments:
    * Title: Not Found
    * Description:  not found handler.
    * Author: Parvez Hasan Rubel
    * Date: 08/10/2024
    * version: 1.0.0: 
*/

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: 'Your requested url was not found',
  });
  console.log(requestProperties);
};

module.exports = handler;
