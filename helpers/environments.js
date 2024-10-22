/*
Comments:
    * Title: Environments
    * Description: handle all environments.
    * Author: Parvez Hasan Rubel
    * Date: 21/10/2024
    * version: 1.0.0: 
*/

// dependencies

// module scaffolding
const environments = {};

// environments variables
environments.staging = {
  port: 3000,
  envName: 'staging',
};

environments.production = {
  port: 5000,
  envName: 'production',
};

// determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// check that the current environment is one of the environments above, if not, default to staging
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// export the module
module.exports = environmentToExport;
