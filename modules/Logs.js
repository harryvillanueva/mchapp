const { GoogleSpreadsheet } = require('google-spreadsheet');
const { Constants } = require("./js/Util")()

Logs = {
    
    init:async(ID="11cMzLHfORo1MbznO5R-3sa4fwPI4crTnbiERwta3iAw", sheet=0)=>{
        // await Logs.doc.useServiceAccountAuth({
        //     client_email: Logs.credentials.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        //     private_key: Logs.credentials.GOOGLE_PRIVATE_KEY,
        // })
        // await Logs.doc.loadInfo();
        // Logs.sheet = await Logs.doc.sheetsByIndex[0]; UsuariosTmp
        // Logs.sheet = await Logs.doc.sheetsByTitle["UsuariosOK"];
        //Logs.pisos = await Logs.doc.sheetsByTitle["Pisos"];
        
        // Permisos para el documento de Sugerencias
        await Logs.docSugerencia.useServiceAccountAuth({
            client_email: Logs.credentials.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: Logs.credentials.GOOGLE_PRIVATE_KEY,
        })
        await Logs.docSugerencia.loadInfo();
        Logs.sheetSugerencia = await Logs.docSugerencia.sheetsByIndex[0];
        // Fin de permisos para Sugerencias

        // await Logs.docLogs.useServiceAccountAuth({
        //     client_email: Logs.credentials.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        //     private_key: Logs.credentials.GOOGLE_PRIVATE_KEY,
        // })
        // await Logs.docLogs.loadInfo();
        // Logs.sheetLogs = await Logs.docLogs.sheetsByIndex[0]; // doc.sheetsByTitle[title]

        // Permisos para el documento de Inventario
        // await Logs.docInvLlaves.useServiceAccountAuth({
        //     client_email: Logs.credentials.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        //     private_key: Logs.credentials.GOOGLE_PRIVATE_KEY,
        // })
        // await Logs.docInvLlaves.loadInfo();
        // Logs.sheetInvLlaves = await Logs.docInvLlaves.sheetsByIndex[0];
        // Fin de permisos para Inventario
        
    },

    credentials:{
        GOOGLE_SERVICE_ACCOUNT_EMAIL : "googledrive@soy-reporter-339408.iam.gserviceaccount.com",
        GOOGLE_PRIVATE_KEY : require("./credentials/GoogleAPI.json").private_key
    },

    //doc: new GoogleSpreadsheet('11cMzLHfORo1MbznO5R-3sa4fwPI4crTnbiERwta3iAw'),
    docSugerencia: new GoogleSpreadsheet('1q99FpzEDJFHNDNW-bxoALUCy7dAKHio81oHBCGh07BI'),
    //docLogs: new GoogleSpreadsheet('1QlFh62cM0xPUwETGRBKJ_AYJCZXgeOL6sPDgTq5anxg'),
    //docInvLlaves: new GoogleSpreadsheet('1nTtgQa2DN96iCoBH7BaKd3xh3flDivwFdIDTK_pjgiY'),
    
    // get:async() => {
    //     await Logs.doc.loadInfo();
    //     const users = await Logs.sheet.getRows();
    //     return users
    // },

    // getPisos:async() =>{
    //     await Logs.doc.loadInfo();
    //     const pisos = await Logs.pisos.getRows();
    //     return pisos
    // },

    // Save sugerencia to Excel
    addSugerencia: async(Log) => {
        await Logs.docSugerencia.loadInfo()
        const newLog = await Logs.sheetSugerencia.addRow(Log);
        await Logs.sheetSugerencia.saveUpdatedCells();
        return newLog
    },
    
    // getLogs: async ( sheetTitle = null ) => {
    //     let logsData = []
    //     try {
    //         await Logs.docLogs.loadInfo();
    //         if ( sheetTitle ) Logs.sheetLogs = await Logs.docLogs.sheetsByTitle[sheetTitle]
    //         else throw 'load sheets by index'
    //         if ( !Logs.sheetLogs ) throw 'load sheets by index'
    //         logsData = await Logs.sheetLogs.getRows(); // { limit, offset }
    //     } catch(err) {}
    //     return logsData
    // },

    // getKeys: async ( typeLKey = Constants().TYPE_CARD_CODE_NORMAL ) => {
    //     let keysData = []
    //     let titleSearch = (typeLKey === Constants().TYPE_CARD_CODE_MAESTRA) ? 'LlavesMaestras' : 'LlavesGenericas'
    //     try {
    //         await Logs.docInvLlaves.loadInfo();
    //         Logs.sheetInvLlaves = await Logs.docInvLlaves.sheetsByTitle[titleSearch]
    //         keysData = await Logs.sheetInvLlaves.getRows(); // { limit, offset }
    //     } catch(err) {}
    //     return keysData
    // }
}

module.exports = Logs