const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class LogService {
      async getAllByPiso(idPiso) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/apartments/${idPiso}/logs`

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

const LogServiceInstance = new LogService()
Object.freeze(LogServiceInstance)

module.exports = LogServiceInstance