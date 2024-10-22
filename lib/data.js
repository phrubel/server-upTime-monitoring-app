/*
Comments:
    * Title: Create data
    * Description: create data use file system (fs).
    * Author: Parvez Hasan Rubel
    * Date: 22/10/2024
    * 1.0.0: 
*/

// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory of data
lib.baseDir = path.join(__dirname, '/../.data/');

// create data
lib.createData = (dir, filename, data, callback) => {
  // open file for writing
  fs.open(
    `${lib.baseDir}${dir}/${filename}.json`,
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing the new file');
              }
            });
          } else {
            callback('Error writing to new file');
          }
        });
      } else {
        callback('Could not create new file, it may already exist');
      }
    }
  );
};

module.exports = lib;
