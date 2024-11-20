/*
Comments:
    * Title: user handler
    * Description: handle the user routes.
    * Author: Parvez Hasan Rubel
    * Date: 22/10/2024
    * version: 1.0.0: 
*/
// dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');
const { _token } = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  // check the method which one i accepted
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    // method is accepted
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    // method not allowed (405 is unwanted request)
    callback(405);
  }
};

// users module scaffolding
handler._users = {};

// users crud method which i want to allow
// get method
handler._users.get = (requestProperties, callback) => {
  // check the phone is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // check the token
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    _token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.readData('users', phone, (err, userData) => {
          // convert to object and copy the user data bcz it is a string
          const user = { ...parseJSON(userData) };
          if (!err && user) {
            // delete the password bcz we do not want to get user password
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              message: 'user phone is not found',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication Failed!!',
        });
      }
    });
  } else {
    callback(404, {
      message: 'user phone is not found',
    });
  }
};

// post method
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === 'boolean' &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.readData('users', phone, (err1) => {
      if (err1) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        // store the user to db
        data.createData('users', phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: 'User was created successfully!',
            });
          } else {
            console.log('Error in data.createData:', err2);
            callback(500, {
              error: 'Could not create new user, it may already exist',
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
      error: 'You have a problem in your request',
    });
  }
};

// put method
handler._users.put = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      const token =
        typeof requestProperties.headersObject.token === 'string'
          ? requestProperties.headersObject.token
          : false;

      _token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // lookup the user
          // lookup the user
          data.readData('users', phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }

              data.updateData('users', phone, userData, (err) => {
                if (!err) {
                  callback(200, {
                    message: ' User data updated successfully!',
                  });
                } else {
                  callback(500, {
                    error: 'This is Internal server error!',
                  });
                }
              });
            } else {
              callback(400, {
                error: 'You have a problem in your request!',
              });
            }
          });
        } else {
          callback(403, {
            error: 'Authentication Failed!!',
          });
        }
      });
    } else {
      callback(400, {
        error: 'You have a problem in your request!',
      });
    }
  } else {
    callback(400, {
      error: 'Invalid phone number, TRy again!',
    });
  }
};

// delete method
handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // check the token
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    _token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.readData('users', phone, (err1, uData) => {
          if (!err1 && uData) {
            data.deleteData('users', phone, (err2) => {
              if (!err2) {
                callback(200, {
                  message: 'User deleted successfully!',
                });
              } else {
                callback(500, {
                  error: 'There was a problem in server side!',
                });
              }
            });
          } else {
            callback(400, {
              error: 'You have a problem in your request!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication Failed!!',
        });
      }
    });
  } else {
    callback(400, { error: 'Invalid phone number, TRy again!' });
  }
};

module.exports = handler;
