const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class TypeCodeService {
      async getAll() {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/typescodes`
            if ( !endPointApi ) return []
            let dataResult = { data: [] }
            try {
                  const res = await fetch(endPointApi)
                  if (res.status === 200) dataResult = await res.json()
            } catch(err) {
                  console.log('Error http on API')
            }
            
            return dataResult
      }
}

const TypeCodeServiceInstance = new TypeCodeService()
Object.freeze(TypeCodeServiceInstance)

module.exports = TypeCodeServiceInstance