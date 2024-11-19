/*
Comments:
    * Title: utilities
    * Description: all utilities are here which help to handle the valid data.
    * Author: Parvez Hasan Rubel
    * Date: 21/10/2024
    * version: 1.0.0: 
*/

// dependencies
const crypto = require('crypto');
const { env } = require('process');
const environments = require('./environments');

// // module scaffolding
// const utilities = {};

// // parse json string to object
// utilities.parseJson = (jsonString) => {
//   let output;
//   try {
//     output = JSON.parse(jsonString);
//   } catch (error) {
//     return output;
//   }
// };

// // hashing password
// utilities.hash = (str) => {
//   if (typeof str === 'string' && str.length > 0) {
//     const hash = crypto
//       .createHmac('sha256', environments.secretKey)
//       .update(str)
//       .digest('hex');
//     return hash;
//   } else {
//     return false;
//   }
// };
// // module.exports = utilities;

// module scaffolding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    console.log(environments, process.env.NODE_ENV);
    const hash = crypto
      .createHmac('sha256', environments.secretKey)
      .update(str)
      .digest('hex');
    return hash;
  }
  return false;
};

// create random string
utilities.createRandomString = (strLength) => {
  let length = strLength;
  length = typeof strLength === 'number' && strLength > 0 ? strLength : false;

  if (length) {
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';
    for (let i = 1; i <= length; i++) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length) - 1
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

// export module
module.exports = utilities;
