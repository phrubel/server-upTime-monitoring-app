/*
Comments:
    * Title: token handler
    * Description: handle the token for authentication.
    * Author: Parvez Hasan Rubel
    * Date: 18/11/2024
    * version: 1.0.0: 
*/
// dependencies
const {
  hash,
  parseJSON,
  createRandomString,
} = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  // check the method which one i accepted
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    // method is accepted
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    // method not allowed (405 is unwanted request)
    callback(405);
  }
};

// users module scaffolding
handler._token = {};

// token get method
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the tokens
    data.readData('tokens', id, (err, tokenData) => {
      // convert to object and copy the token data bcz it is a string
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          message: 'token is not found',
        });
      }
    });
  } else {
    callback(404, {
      message: 'requested token is not found',
    });
  }
};

// token post method
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    // lookup the phone and password
    data.readData('users', phone, (err1, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };
        // store the token
        data.createData('tokens', tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: 'There was a problem in server side!',
            });
          }
        });
      } else {
        callback(400, {
          error: 'password is incorrect',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request',
    });
  }
};

// token put method
handler._token.put = (requestProperties, callback) => {};

// token delete method
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;