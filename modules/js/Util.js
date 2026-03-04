const CryptoJS = require("crypto-js");
const fetch = require('node-fetch');
require("dotenv").config()
const Util = () => {
      const Constants = () => {
            // const URL_SERVER = "https://tcpmch2022.fly.dev/"
            //const URL_SERVER = "http://tcpmch-env.eba-5tfqg8e4.eu-west-1.elasticbeanstalk.com/"
            // const URL_SERVER = "http://localhost:3002/"
            //  const URL_SERVER = "https://tcpmch.fly.dev/"
            args = process.argv.slice(2)
            const URL_SERVER = args[0] == "dev" ? process.env.TCP_DEV : process.env.TCP_PROD
            // const URL_API = args[0] == "dev" ? process.env.APILOCAL : process.env.APISERVER
            // Consulta datos on GitHub
            const URL_GITHUB_PISOS_DATA = "https://raw.githubusercontent.com/ATICMCH/dataInfo/main/pisosData.json"
            const URL_GITHUB_USERS_DATA = "https://raw.githubusercontent.com/ATICMCH/dataInfo/main/userData.json"

            const deviceOficina = "Oficina" // Oficina

            // PATH SERVER
            const pathGetAllDevices = "devices/all"

            const TYPE_CODE_DEVICE = 2 // Web Client Device

            const MSN_TABLE_EMPTY = "No hay registros para mostrar!"

            // KEY FOR USER PASS
            const KEY_GENERATE_PASS_USER = 'mchIoT$_@'

            const ACTION_OPENLOCK = "openLock"
            const LABEL_OPENLOCK = "Abrir puerta"
            const ACTION_SYNCTIME = "syncTime"
            const LABEL_SYNCTIME = "Sinc fecha/hora"
            const ACTION_NEWCODE = "newCode"
            const LABEL_NEWCODE = "Código"
            const ACTION_SETCARD = "setCard"
            const LABEL_SETCARD = "Tarjeta"
            const ACTION_OPENPORTAL = "openPortal"
            const LABEL_OPENPORTAL = "Abrir portal"
            const ACTION_TOGGLELIGHT = "toggleLight"
            const LABEL_TOGGLELIGHT = "Luces"

            const TYPE_ADD_SETCARD = 1
            const TYPE_LABEL_ADD_SETCARD = "Nueva"
            const TYPE_DELETE_SETCARD = 2
            const TYPE_LABEL_DELETE_SETCARD = "Eliminar"

            const LABEL_UNKNOWN = "Desconocido"

            const TYPE_CARD_CODE_NORMAL = "Normal"
            const TYPE_CARD_CODE_MAESTRA = "Maestra"

            const STATUS_ACTION_CORRECTO = "Correcto"
            const STATUS_ACTION_FALLIDO = "Fallido"

            //Conexion eWeLink
            const emailEWL =  'atic@mycityhome.es'
            const passwordEWL = 'IoT_2021'
            const regionEWL =  'eu'

            // Types devices
            const typeDevice_Lock = 'lock'
            const typeDevice_Telefonillo = 'telefonillo'
            const typeDevice_Movil = 'movil'
            const typeDevice_Router = 'router'
            const typeDevice_Sonoff = 'sonoff'

            return {    STATUS_ACTION_CORRECTO,
                        STATUS_ACTION_FALLIDO,
                        URL_SERVER, 
                        deviceOficina, 
                        pathGetAllDevices,
                        TYPE_CODE_DEVICE,
                        MSN_TABLE_EMPTY,
                        URL_GITHUB_PISOS_DATA,
                        URL_GITHUB_USERS_DATA,
                        KEY_GENERATE_PASS_USER,
                        ACTION_OPENLOCK,
                        LABEL_OPENLOCK,
                        ACTION_SYNCTIME,
                        LABEL_SYNCTIME,
                        ACTION_NEWCODE,
                        LABEL_NEWCODE,
                        ACTION_SETCARD,
                        LABEL_SETCARD,
                        ACTION_OPENPORTAL,
                        LABEL_OPENPORTAL,
                        ACTION_TOGGLELIGHT,
                        LABEL_TOGGLELIGHT,
                        TYPE_ADD_SETCARD,
                        TYPE_LABEL_ADD_SETCARD,
                        TYPE_DELETE_SETCARD,
                        TYPE_LABEL_DELETE_SETCARD,
                        LABEL_UNKNOWN,
                        TYPE_CARD_CODE_NORMAL,
                        TYPE_CARD_CODE_MAESTRA,
                        emailEWL,
                        passwordEWL,
                        regionEWL,
                        typeDevice_Lock,
                        typeDevice_Telefonillo,
                        typeDevice_Movil,
                        typeDevice_Router,
                        typeDevice_Sonoff
                  }
      }

      const RouteApp = () => {
            const routePublic = [
                  '/devicesmanagement',
                  '/testdb',
                  '/sugerencias',
                  '/savesugerencia'
            ]

            return { routePublic }
      }

      const getDataGitHub = async (urlGH = null) => {
            if (!urlGH) return []
            let dataResult = []
            try {
                  const res = await fetch(urlGH)
                  dataResult = await res.json()
            } catch(err) {
                  console.log('Error http on GH')
            }
            
            return dataResult
      }

      const encryptData = ( txtIn, keyEncrytData = Util().Constants().KEY_GENERATE_PASS_USER ) => {
            return CryptoJS.HmacSHA1(txtIn, keyEncrytData).toString()
      }

      const getDevicesServer = async (url = Util().Constants().URL_SERVER + Util().Constants().pathGetAllDevices) => {
            if (!url) return []
            let dataResult = []
            try {
                  const res = await fetch(url)
                  dataResult = await res.json()
            } catch(err) {
                  console.log('Error http on server')
            }
            
            return dataResult
      }

      const getLabelAction = (codeAction) => {
            switch(codeAction) {
                  case Util().Constants().ACTION_OPENLOCK:
                        return Util().Constants().LABEL_OPENLOCK
                  case Util().Constants().ACTION_NEWCODE:
                        return Util().Constants().LABEL_NEWCODE
                  case Util().Constants().ACTION_SETCARD:
                        return Util().Constants().LABEL_SETCARD
                  case Util().Constants().ACTION_OPENPORTAL:
                        return Util().Constants().LABEL_OPENPORTAL
                  case Util().Constants().ACTION_TOGGLELIGHT:
                        return Util().Constants().LABEL_TOGGLELIGHT
                  case Util().Constants().ACTION_SYNCTIME:
                        return Util().Constants().LABEL_SYNCTIME
                  default: 
                        return Util().Constants().LABEL_UNKNOWN

            }
      }

      const getLabelTypeCard = (type) => {
            switch(type) {
                  case Util().Constants().TYPE_ADD_SETCARD:
                        return Util().Constants().TYPE_LABEL_ADD_SETCARD
                  case Util().Constants().TYPE_DELETE_SETCARD:
                        return Util().Constants().TYPE_LABEL_DELETE_SETCARD
                  default: 
                        return Util().Constants().LABEL_UNKNOWN

            }
      }

      // Load card of piso, by typeCard: Normal|Maestra SIN USO
      const getCardByTypeCard = (lData, typeCard = undefined) => {
            let lDataByCards = lData.filter( el =>    el.Accion === Util().Constants().ACTION_SETCARD && 
                                                      el.IdQr.trim().length !== 0 &&
                                                      ((typeCard)? el.TipoTarjeta.trim() === typeCard : true))
            
            let lcards = []
            let lcardsData = []
            lDataByCards.forEach(el => {
                  if (parseInt(el.Type) ===  Util().Constants().TYPE_ADD_SETCARD) {
                        if ( !lcards.includes(el.IdQr.trim()) ) {
                              lcards.push(el.IdQr.trim())
                              lcardsData.push({ IdQr: el.IdQr, Qr: el.Qr, location: el.Ubicacion, typeCard: el.TipoTarjeta} )
                        }
                  } else if ( parseInt(el.Type) ===  Util().Constants().TYPE_DELETE_SETCARD ) {
                        let index = lcards.findIndex(data => data === el.IdQr.trim())
                        lcards.splice(index, 1)
                        lcardsData.splice(index, 1)
                  }
            })

            return { lcards, lcardsData }
      }

      const getCardByTypeKey = (lData, piso, typeKey = Util().Constants().TYPE_CARD_CODE_NORMAL) => {
            return  (typeKey === Constants().TYPE_CARD_CODE_MAESTRA) ?  Util().getCardMaestra(lData, piso) : 
                                                                        Util().getCardNormal(lData, piso)
      }

      // Load card of piso, by typeCard: Normal
      const getCardNormalOLD = (lData, piso = undefined) => {
            let lDataByCards = lData.filter( el =>    (((el.Piso)?el.Piso:'').trim() === piso || piso === undefined) && 
                                                      ((el.IdQr)?el.IdQr:'').trim().length !== 0 &&
                                                      ((el.Qr)?el.Qr:'').trim().length !== 0 )
            let lcards = [ ...lDataByCards.map( el => el.IdQr.trim() ) ] || []
            let lcardsData = [ ...lDataByCards ]

            return { lcards, lcardsData }
      }
      const getCardNormal = (lData, piso = undefined) => {
            let lDataByCards = lData.map(el => {
                  if (piso === undefined && el.pisos.length === 0) return { ...el, piso: null }
                  if (piso === undefined && el.pisos.length !== 0) return { ...el, piso: el.pisos[0] }
                  if (piso && el.pisos.length === 0) return { ...el, piso: null }
                  if (piso && el.pisos.length !== 0) return { ...el, piso: (el.pisos.includes(piso)) ? piso : null }
            }).filter( el =>  (((el.piso)?el.piso:'').trim() === piso || piso === undefined) &&
                              ((el.idqr)?el.idqr:'').trim().length !== 0 &&
                              ((el.qr)?el.qr:'').trim().length !== 0 )
            
            let lcards = [ ...lDataByCards.map( el => el.idqr.trim() ) ] || []
            let lcardsData = [ ...lDataByCards ]

            return { lcards, lcardsData }
      }

      // Load card of piso Maestra
      const getCardMaestraOLD = (lData, piso = undefined) => {
            let lDataByCards = lData.map( el => {
                  let lPisos = ((el.Pisos)?el.Pisos:'').trim().split(',').map(el => el.trim())
                  let existPiso = lPisos.includes( piso.trim() )
                  return (existPiso) ? el : undefined
            }).filter( el => el !== undefined )
            
            let lcards = [ ...lDataByCards.map( el => el.IdQr.trim() ) ] || []
            let lcardsData = [...lDataByCards]

            return { lcards, lcardsData }
      }
      const getCardMaestra = (lData, piso = undefined) => {
            let lDataByCards = lData.map(el => {
                  return (el.pisos.includes(piso)) ? {...el, piso: piso}: undefined
            }).filter( el =>  el !== undefined && ((el.idqr)?el.idqr:'').trim().length !== 0 &&
                              ((el.qr)?el.qr:'').trim().length !== 0 )
            let lcards = [ ...lDataByCards.map( el => el.idqr.trim() ) ] || []
            let lcardsData = [ ...lDataByCards ]

            return { lcards, lcardsData }
      }

      const processDataLog = (data) => {
            let infoAdicional = '';
            try {
                  let dataJSON = JSON.parse(data)
                  let codeAction = dataJSON.cmd
                  let _lblDispositivo = `${(dataJSON.etiqueta_dispositivo?'<b>'+dataJSON.etiqueta_dispositivo+'</b>, ':'')}`
                  switch(codeAction) {
                        case Util().Constants().ACTION_OPENLOCK:
                              infoAdicional += `${_lblDispositivo}${dataJSON.msg || '---'}`
                              break
                        case Util().Constants().ACTION_NEWCODE:
                              infoAdicional += `${_lblDispositivo}<b>Código</b>: ${dataJSON.code || '---'} | <b>Vigencia</b>: ${Util().formatDateSQLToScreen(dataJSON.dateStart) || '---'} a ${Util().formatDateSQLToScreen(dataJSON.dateEnd) || '---'}`
                              break
                        case Util().Constants().ACTION_SETCARD:
                              infoAdicional += `${_lblDispositivo}<b>Tipo</b>: ${dataJSON.labelType || '---'} | <b>IdQr</b>: ${dataJSON.idQr || '---'}`
                              break
                        case Util().Constants().ACTION_OPENPORTAL:
                              infoAdicional += `${dataJSON.msg || '---'}`
                              break
                        case Util().Constants().ACTION_TOGGLELIGHT:
                              infoAdicional += `${dataJSON.msg || '---'}`
                              break
                        case Util().Constants().ACTION_SYNCTIME:
                              infoAdicional += `${_lblDispositivo}${dataJSON.msg || '---'}`
                              break
                        default: 
                              infoAdicional += ``
                  }
            } catch (err) {}

            return infoAdicional
      }

      const formatDateSQLToScreen = (value) => {
            if (!value) return 'xxx'
            let [dateCurrent, timeCurrent] = (value.trim()).split(' ').map(el => el.trim())
            let [yearCurrent, monthCurrent, dayCurrent] = dateCurrent.split('-')
            return `${dayCurrent}/${monthCurrent}/${yearCurrent} ${timeCurrent}`
      }

      return {    Constants, 
                  RouteApp, 
                  getDataGitHub,
                  formatDateSQLToScreen, 
                  encryptData, 
                  getDevicesServer,
                  getLabelAction,
                  getLabelTypeCard,
                  processDataLog,
                  getCardByTypeKey,
                  getCardNormal,
                  getCardMaestra 
            }
}

module.exports = Util