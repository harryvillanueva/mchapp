const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class KeyService {
      async getAll() {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/keys`

            if ( !endPointApi ) return []
            let dataResult = { data: [] }
            try {
                  const res = await fetch(endPointApi)
                  if (res.status === 200) dataResult = await res.json()
            } catch(err) {
                  console.log('Error https on API')
            }
            
            return dataResult
      }
}

const KeyServiceInstance = new KeyService()
Object.freeze(KeyServiceInstance)

module.exports = KeyServiceInstance