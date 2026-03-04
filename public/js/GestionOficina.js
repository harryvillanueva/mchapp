let statusOnOff = null
let nameStatusOnOf = null
let lDevices = []
const GestionOficina = {
    socket: null,
    modalApp: null,
    clientFromID: null,
    actionExec: null,
    codeDeviceTarget: null,
    urlServer: null,
    user: null,
    idPiso: null,

    init: (codeDeviceIn, urlServerIn, userLogin, idApartmentIn, ...lIdDevices) => {
        clientFromID = Util.generateUID();
        modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {});
        codeDeviceTarget = codeDeviceIn;
        urlServer = urlServerIn;
        user = userLogin;
        idPiso = idApartmentIn || 0
        GestionOficina.initSocket()
        lDevices = lIdDevices.map(el => ({ id: el, statusOnOff: null, nameStatusOnOf: null }))
        GestionOficina.initStatusSonoff(idPiso, ...lIdDevices)
        // GestionOficina.initStatusSonoff(codeDeviceIn)
    },

    changeStatusSonoff: (dataDevice) => {
        if (!dataDevice.id) return
        const elBtnSonoff = document.getElementById(`btn-sonoff-${dataDevice.id}`)
        const elWaitSonoff = document.getElementById(`wait-sonoff-${dataDevice.id}`)
        const elIdLuz = document.getElementById(`link-luz-${dataDevice.id}`)
        const elTextIdLuz = document.getElementById(`txt-link-luz-${dataDevice.id}`)

        let { state = 'NA',
            error = undefined,
            sonoffExist = (error === 503 || error === undefined) ? true : false
        } = dataDevice

        if (!sonoffExist) {
            elWaitSonoff.classList.add('hide')
            elWaitSonoff.classList.remove('show')
            return
        }
        let _dataDevice = lDevices.find(el => el.id === dataDevice.id)
        if (state === 'on') {
            _dataDevice.statusOnOff = 'on'
            _dataDevice.nameStatusOnOf = 'Encendido'
            elIdLuz.setAttribute('src', `/img/bombillaON.png`)
            elTextIdLuz.innerHTML = `[ ${_dataDevice.nameStatusOnOf} ]`
        } else if (state === 'off') {
            _dataDevice.statusOnOff = 'off'
            _dataDevice.nameStatusOnOf = 'Apagado'
            elTextIdLuz.innerHTML = `[ ${_dataDevice.nameStatusOnOf} ]`
            elIdLuz.setAttribute('src', `/img/bombillaOFF.png`)
        } else {
            _dataDevice.statusOnOff = 'NA'
            _dataDevice.nameStatusOnOf = 'Desconectado'
            elTextIdLuz.innerHTML = `[ Desconectado ]`
            elIdLuz.setAttribute('src', `/img/bombillaDISC.png`)
        }
        elBtnSonoff.classList.add('show')
        elBtnSonoff.classList.remove('hide')
        elWaitSonoff.classList.add('hide')
        elWaitSonoff.classList.remove('show')
    },

    initStatusSonoff: async (idPiso, ...lIdDevices) => {
        if (lIdDevices.length === 0) return

        fetch(`/getstatussonoff?idPiso=${idPiso}&idDevices=${lIdDevices.join('|')}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(res => {
                // Error por no desconexion del dispositivo
                let { error = null, data = [] } = res
                console.log(res)
                if (!error) {
                    for (let i = 0; i < data.length; i++) GestionOficina.changeStatusSonoff(data[i])
                }
            })
            .catch((err) => {
                console.error('Error: ', err)
            });
    },


    initSocket: () => {
        socket = io(urlServer, { transports: ['websocket'] });

        socket.on('connect', () => {
            console.log('connected');
            let dataCon = { type: Constants.TYPE_CODE_DEVICE, msg: "init socket client web" }
            socket.emit(Constants.SOCKET_EMIT_TO_SERVER_ADD, clientFromID, JSON.stringify(dataCon));
        })

        socket.on(Constants.SOCKET_CATCH_MSG_FROM_SERVER, async (from, msg) => {
            modalApp.hide();
            const dataJson = JSON.parse(msg);
            // console.log('data: ', dataJson);
        })

        socket.on('disconnect', function () {
            console.log('Conexion cerrada desde el servidor!');
        });

        socket.connect();
    },

    /*actionOpenPortal: (idDevice = 0) => {
        actionExec = Constants.ACTION_OPENPORTAL;
        const dataJSON = {
            cmd: Constants.ACTION_OPENPORTAL,
            client: codeDeviceTarget,
            clientFrom: clientFromID,
            user,
            idDevice,
            idPiso: idPiso
        };
        GestionOficina.emitRequestServer(dataJSON);
    },*/

    actionOpenLock: (idDevice = 0) => {
        actionExec = Constants.ACTION_OPENLOCK;
        const dataJSON = {
            cmd: Constants.ACTION_OPENLOCK,
            client: codeDeviceTarget,
            clientFrom: clientFromID,
            user,
            idDevice,
            idPiso: idPiso
        };
        GestionOficina.emitRequestServer(dataJSON);
    },

    emitRequestServer: (dataJSON) => {
        // Verifica los ids del piso y dispositivo
        if (!(dataJSON.idDevice && dataJSON.idPiso)) {
            alert("Información no válida. Por favor intentelo más tarde!")
            return
        }
        try {
            if (socket === null) GestionOficina.initSocket();
            else if (!socket.connected) socket.connect(); // Demora 1 seg en conectarse nuevamente

            modalApp.show();

            window.setTimeout(function () {
                // Si aún hay error en la conexión
                if (!socket.connected) {
                    modalApp.hide();
                    alert("Intentelo más tarde. Gracias!");
                    return;
                } else {
                    socket.emit(Constants.SOCKET_EMIT_TO_SERVER_LOCK, clientFromID, JSON.stringify(dataJSON));
                }
            }, 500);
        } catch (e) {
            console.log('Error socket!!');
            modalApp.hide();
            alert("Intentelo más tarde. Gracias!");
        }
    },

    generateCode: () => {
        document.getElementById('codigo').value = Util.generateCode();
    },

    back: () => {
        location.href = `/`
    },


    actionOpenPortal: async () => {
        modalApp.show()
        fetch('/openPortalSONOFF',{ method:'POST'}).then((res)=>res.json).then((res)=>{
            console.log(res)
        }).finally(() => {
            setTimeout(async () => {
                modalApp.hide()
            }, 300)
        })
    },

    actionToggleDevice: (stateSONOFF = 'NA', idDevice = 0) => {
        // Verifica los ids del piso y dispositivo
        if (!(idDevice && idPiso)) {
            alert("Información no válida. Por favor intentelo más tarde!")
            return
        }
        let deviceData = lDevices.find(el => el.id === idDevice)
        if (deviceData.statusOnOff === null)
            deviceData.statusOnOff = stateSONOFF
        let elIdLuz = document.getElementById(`link-luz-${idDevice}`)
        let elTextIdLuz = document.getElementById(`txt-link-luz-${idDevice}`)

        if (deviceData.statusOnOff === 'NA') {
            // nameStatusOnOf = 'Desconectado'
            deviceData.nameStatusOnOf = 'Desconectado'
            elTextIdLuz.innerHTML = `[ ${deviceData.nameStatusOnOf} ]`
            elIdLuz.setAttribute('src', '/img/bombillaDISC.png')
            alert('No es posible controlar el dispositivo!!')
            return
        }
        actionExec = Constants.ACTION_TOGGLELIGHT;

        modalApp.show();
        fetch('/update', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cmd: Constants.ACTION_TOGGLELIGHT, client: codeDeviceTarget, user, idDevice,
                idPiso: idPiso
            })
        })
            .then(res => res.json())
            .then(res => {
                // Error por no desconexion del dispositivo
                // if ( res.error ) deviceData.statusOnOff = 'NA'
                // res.error = 0 -> OK 
                if (res.data.error) deviceData.statusOnOff = 'NA'

                if (deviceData.statusOnOff === 'on') {
                    deviceData.statusOnOff = 'off'
                    deviceData.nameStatusOnOf = 'Apagado'
                    elIdLuz.setAttribute('src', '/img/bombillaOFF.png')
                    elTextIdLuz.innerHTML = `[ ${deviceData.nameStatusOnOf} ]`
                } else if (deviceData.statusOnOff === 'off') {
                    deviceData.statusOnOff = 'on'
                    deviceData.nameStatusOnOf = 'Encendido'
                    elTextIdLuz.innerHTML = `[ ${deviceData.nameStatusOnOf} ]`
                    elIdLuz.setAttribute('src', '/img/bombillaON.png')
                } else {
                    deviceData.statusOnOff = 'NA'
                    deviceData.nameStatusOnOf = 'Desconectado'
                    elTextIdLuz.innerHTML = `[ ${deviceData.nameStatusOnOf} ]`
                    elIdLuz.setAttribute('src', '/img/bombillaDISC.png')
                }
                modalApp.hide();
                if (res.data.error === 4002) alert('No es posible controlar el dispositivo!!')
            })
            .catch((err) => {
                console.log('Error: ', err);
                modalApp.hide();
            });
    }
}