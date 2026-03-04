const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class EWeLinkService {
      async getStatusByIdDevice(idDevice) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/devices/${idDevice}/sonoff/status`

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

      async setStatusByIdDevice(idDevice) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/devices/${idDevice}/sonoff/status`

            if ( !endPointApi ) return []
            let dataResult = { data: [] }
            try {
                  const res = await fetch( endPointApi,{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'}
                  })
                  if (res.status === 200) dataResult = await res.json()
            } catch(err) {
                  console.log('Error https on API')
            }
            
            return dataResult
      }
}

const EWeLinkServiceInstance = new EWeLinkService()
Object.freeze(EWeLinkServiceInstance)

module.exports = EWeLinkServiceInstance