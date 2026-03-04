// Nota: Usar sabiamente que no tiene restricciones. Te echamos de menos TypeScript
class UtilCustom {

    constructor() {}

    /**
     * Obtiene la fecha actual en formato: DAY/MONTH/YEAR HH:MM:SS. [27/01/2023 17:50:33]
     * @param dCurrent 
     * @returns 27/01/2023 17:50:33
     */
    getDateCurrentString( dCurrent = new Date() ) {
        try {
            return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Madrid' }).format(dCurrent)
        } catch(err){
            return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Madrid' }).format(new Date())
        }
    }

    /**
     * Obtiene la fecha actual en formato 'YEAR-MOTH-DAY HH-MM-SS' [2023-01-27 09:50:00] para POSTGRESSQL
     * @returns {fecha: 2023-01-27, hora: 09:50:00}
     */
    getDateCurrent() {
        let [dateCurrent, timeCurrent] = (this.getDateCurrentString().trim()).split(',').map(el => el.trim())
        let [dayCurrent, monthCurrent, yearCurrent] = dateCurrent.split('/')
        return {fecha: `${yearCurrent}-${monthCurrent}-${dayCurrent}`, hora: `${timeCurrent}`}
    } 

    /**
     * Obtiene la fecha con su respectivo timestamp
     * @param fecha string [YEAR-MOTH-DAY]
     * @param hora string [HH-MM-SS]
     * @returns {fecha: 2023-01-27, hora: 09:50:00, timestamp: 454345987}
     */
    getDateCustom(fecha, hora) {
        return { fecha, hora, timestamp: (new Date(`${fecha} ${hora}`).getTime()/1000) }
    }

    /**
     * Recibe un timestamp en milisegundos y retorna la fecha de la zona de Madrid [ciudad de nuestro jefecito jajajaja]
     * @param {*} unixTimestamp 
     * @returns 27/01/2023 17:50:33 | ''
     */
    getDateOfMiliSeconds(unixTimestamp) {
        return (unixTimestamp) ? this.getDateCurrentString(new Date(Math.trunc(unixTimestamp))) : '';
    }
}

const UtilCustomInstance = new UtilCustom()
Object.freeze(UtilCustomInstance)

module.exports = UtilCustomInstance