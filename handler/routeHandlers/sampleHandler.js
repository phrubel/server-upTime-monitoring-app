/*
Comments:
    * Title: handler
    * Description: handle sample routes.
    * Author: Parvez Hasan Rubel
    * Date: 08/10/2024
    * version: 1.0.0: 
*/

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log('requestProperties', requestProperties);
  callback(200, {
    message: 'This is a sample url',
  });
};

module.exports = handler;
