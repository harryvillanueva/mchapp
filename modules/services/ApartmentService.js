const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class ApartmentService {
      async getAll() {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/apartments`

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

      /**
       * Obtener los pisos por departamento
       * @param {*} nameDepartment 
       * @returns 
       */
      async getAllByDepartment(nameDepartment) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/propietarios/pisos?gestion_piso=${nameDepartment}`

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

      async getDetailsApartmentById(idApartment) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/apartments/${idApartment}/details`

            if ( !endPointApi ) return []
            let dataResult = { data: undefined }
            try {
                  const res = await fetch(endPointApi)
                  if (res.status === 200) dataResult = await res.json()
            } catch(err) {
                  console.log('Error http on API')
            }
            
            return dataResult
      }

      async getDetailsApartmentByIdAndIdDevice(idApartment, idDevice) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/public/apartments/${idApartment}/devices/${idDevice}/details`

            if ( !endPointApi ) return []
            let dataResult = { data: undefined }
            try {
                  const res = await fetch(endPointApi)
                  if (res.status === 200) dataResult = await res.json()
            } catch(err) {
                  console.log('Error http on API')
            }
            
            return dataResult
      }
}

const ApartmentServiceInstance = new ApartmentService()
Object.freeze(ApartmentServiceInstance)

module.exports = ApartmentServiceInstance