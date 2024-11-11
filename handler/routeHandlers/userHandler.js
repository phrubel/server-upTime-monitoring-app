/*
Comments:
    * Title: user handler
    * Description: handle the user routes.
    * Author: Parvez Hasan Rubel
    * Date: 22/10/2024
    * version: 1.0.0: 
*/
// dependencies
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');

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
handler._users.get = (requestProperties, callback) => {
  callback(200, { message: 'this is the user route' });
};
// handler._users.post = (requestProperties, callback) => {
//   // first name
//   const firstName =
//     typeof requestProperties.body.firstName === 'string' &&
//     requestProperties.body.firstName.trim().length > 0
//       ? requestProperties.body.firstName
//       : false;
//   // last name
//   const lastName =
//     typeof requestProperties.body.lastName === 'string' &&
//     requestProperties.body.lastName.trim().length > 0
//       ? requestProperties.body.lastName.trim()
//       : false;
//   // phone
//   const phone =
//     typeof requestProperties.body.phone === 'string' &&
//     requestProperties.body.phone.trim().length === 11
//       ? requestProperties.body.phone.trim()
//       : false;

//   // password
//   const password =
//     typeof requestProperties.body.password === 'string' &&
//     requestProperties.body.password.trim().length > 0
//       ? requestProperties.body.password.trim()
//       : false;

//   // term and condition
//   const tosAgreement =
//     typeof requestProperties.body.tosAgreement === 'boolean' &&
//     requestProperties.body.tosAgreement === true
//       ? true
//       : false;

//   if (firstName && lastName && phone && password && tosAgreement) {
//     // make sure that user doesn't already exist
//     data.read('users', phone, (err) => {
//       // if user doesn't exist
//       if (err) {
//         let userObject = {
//           firstName,
//           lastName,
//           phone,
//           password: hashedPassword(password),
//           tosAgreement,
//         };
//         // store the user
//         data.createData('users', phone, userObject, (err) => {
//           if (!err) {
//             callback(200, {
//               message: 'user created successfully',
//             });
//           } else {
//             callback(400, {
//               Error: 'user created failed',
//             });
//           }
//         });
//       } else {
//         callback(400, {
//           Error: 'This is a server side error',
//         });
//       }
//     });
//   } else {
//     callback(400, {
//       Error: 'you have a problem in your request',
//     });
//   }
// };

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

handler._users.put = (requestProperties, callback) => {};
handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
