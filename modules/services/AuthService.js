const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');
const UtilCustomInstance = require('../js/UtilCustom');

class AuthService {
    async login(user, password) {
        let endPointApi = `${ApiConfigurationInstance.pathApi}/api/auth/login`
        if ( !endPointApi ) return []
        let dataResult = undefined
        try {
            const res = await fetch( endPointApi,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({user, password})
            })

            if (res.status === 200) dataResult = await res.json()
            else throw 'Error api'
        } catch(err) {
            console.log('Error http/https on API')
        }
            
        return dataResult
    }

    /**
     * Indica si la token de la session esta vigente para realizar operacion con el API REST
     * @param {*} token 
     * @returns true | false
     */
    async tokenIsValid( token ) {
        let endPointApi = `${ApiConfigurationInstance.pathApi}/api/auth/validate/token`
        if ( !endPointApi ) return false
        let dataResult = false
        try {
            const res = await fetch( endPointApi, {
                method: 'GET',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,OPTIONS,DELETE,PATCH,POST,PUT",
                    "Access-Control-Allow-Headers": "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    "Content-Type": "application/json",
                    "Token": token,
                }
            })

            if (res.status === 200) {
                // verificar el tiempo de espera del token
                const _result = await res.json()
                //console.log(_result)
                const _fechaCurrent = UtilCustomInstance.getDateCurrent()
                //console.log(_fechaCurrent)
                const _timeCurrent = UtilCustomInstance.getDateCustom(_fechaCurrent.fecha, _fechaCurrent.hora).timestamp
                //console.log(UtilCustomInstance.getDateCustom(_fechaCurrent.fecha, _fechaCurrent.hora))

                // el timestamp esta en segundos
                // sumamos a la fecha actual 6min y si el token solo tiene de vida 5min se reenvia a login
                const diff = (_result.exp) - (_timeCurrent + 360)
                if ( diff < 0 ) dataResult = false
                else dataResult = true
                
                // console.log('current -> ', _timeCurrent, UtilCustomInstance.getDateOfMiliSeconds(_timeCurrent*1000))
                // console.log('token -> ', _result.exp, UtilCustomInstance.getDateOfMiliSeconds(_result.exp*1000))
                // console.log('current futuro -> ', _timeCurrent + 360, UtilCustomInstance.getDateOfMiliSeconds((_timeCurrent+360)*1000))
                //dataResult = true
            } else if (res.status === 401) dataResult = false
            else throw 'Error api'
        } catch(err) {
            console.log('Error http/https on API')
        }
        return dataResult
    }
}

const AuthServiceInstance = new AuthService()
Object.freeze(AuthServiceInstance)

module.exports = AuthServiceInstance