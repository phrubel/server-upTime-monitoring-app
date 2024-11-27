/*
Comments:
    * Title: check handler
    * Description: handle the user check his monitoring create.
    * Author: Parvez Hasan Rubel
    * Date: 20/11/2024
    * version: 1.0.0: 
*/
// dependencies
const {
  hash,
  parseJSON,
  createRandomString,
} = require('../../helpers/utilities');
const data = require('../../lib/data');
const { _token } = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  // check the method which one i accepted
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    // method is accepted
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    // method not allowed (405 is unwanted request)
    callback(405);
  }
};

// users module scaffolding
handler._check = {};

// get method
handler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    //lookup the check
    data.readData('checks', id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

        _token.verify(token, parseJSON(checkData).userPhone, (tokenId) => {
          if (tokenId) {
            callback(200, parseJSON(checkData));
          } else {
            callback(403, {
              error: 'Authentication failure!',
            });
          }
        });
      } else {
        callback(500, {
          error: 'There was a problem in server side!',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Problem in your request!',
    });
  }
};

// post method
handler._check.post = (requestProperties, callback) => {
  //  validate the input from user
  let protocol =
    typeof requestProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === 'string' &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  // instance of array use for check array
  let successCodes =
    typeof requestProperties.body.successCodes === 'object' &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  // timeoutSeconds modulus use for check vognangshao
  let timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === 'number' &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // token verification
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    // lookup the user phone num
    data.readData('tokens', token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        // user phone
        let userPhone = parseJSON(tokenData).phone;
        // lookup the userdata
        data.readData('users', userPhone, (err2, userData) => {
          if (!err2 && userData) {
            // token verify
            _token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === 'object' &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  // save the object
                  data.createData('checks', checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add user's check id
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the user data
                      data.updateData(
                        'users',
                        userPhone,
                        userObject,
                        (err4) => {
                          if (!err4) {
                            callback(200, checkObject);
                          } else {
                            callback(500, { error: 'Internal Server error!' });
                          }
                        }
                      );
                    } else {
                      callback(500, { error: 'Internal Server error!' });
                    }
                  });
                } else {
                  callback(401, { error: 'User reached max limit of checks!' });
                }
              } else {
                callback(403, { error: 'Authentication error!' });
              }
            });
          } else {
            callback(403, {
              error: 'User not found!',
            });
          }
        });
      } else {
        callback(403, { error: 'Authentication error!' });
      }
    });
  } else {
    callback(400, { error: 'Missing required fields' });
  }
};

// put method
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  // validate the input from user
  let protocol =
    typeof requestProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === 'string' &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  // instance of array use for check array
  let successCodes =
    typeof requestProperties.body.successCodes === 'object' &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  // timeoutSeconds modulus use for check vognangshao
  let timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === 'number' &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // check data validation
      data.readData('checks', id, (err, checkData) => {
        if (!err && checkData) {
          const checkObject = parseJSON(checkData);
          const token =
            typeof requestProperties.headersObject.token === 'string'
              ? requestProperties.headersObject.token
              : false;

          // token verify
          _token.verify(token, checkObject.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              // update the check data
              if (protocol) {
                checkObject.protocol = protocol;
              }

              if (url) {
                checkObject.url = url;
              }

              if (method) {
                checkObject.method = method;
              }

              if (successCodes) {
                checkObject.successCodes = successCodes;
              }

              if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
              }

              // save the update data
              data.updateData('checks', id, checkObject, (err2) => {
                if (!err2) {
                  callback(200);
                } else {
                  callback(500, { error: 'Internal Server error!' });
                }
              });
            } else {
              callback(403, { error: 'Authentication failure!' });
            }
          });
        } else {
          callback(500, { error: 'There was a problem in server side!' });
        }
      });
    } else {
      callback(400, { error: 'You must input at least one field to update' });
    }
  } else {
    callback(400, { error: 'Missing required fields' });
  }
};

// delete method
handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
