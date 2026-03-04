const fetch = require('node-fetch');
require("dotenv").config()

class ApiConfiguration {
      pathApi
      constructor() {
            this.pathApi = process.argv.slice(2)[0] === "dev" ? process.env.API_REST_DEV : process.env.API_REST_PROD
      }
}

const ApiConfigurationInstance = new ApiConfiguration()
Object.freeze(ApiConfigurationInstance)

module.exports = ApiConfigurationInstance