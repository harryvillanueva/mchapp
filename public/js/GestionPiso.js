let lDevices = []
const GestionPiso = {
      socket: null,
      modalApp: null,
      clientFromID: null,
      actionExec: null,
      codeDeviceTarget: null,
      urlServer: null,
      user: null,
      role: null,
      idPiso: null,

      init: (codeDeviceIn, urlServerIn, userLogin, roleLogin, idApartmentIn, ...lIdDevices) => {
            clientFromID = Util.generateUID()
            modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            codeDeviceTarget = codeDeviceIn
            urlServer = urlServerIn
            user = userLogin
            role = roleLogin || 'NA'
            idPiso = idApartmentIn || 0
            GestionPiso.initSocket()
            lDevices = lIdDevices.map(el => ({ id: el, statusOnOff: null, nameStatusOnOf: null }))
            GestionPiso.initStatusSonoff(idPiso, ...lIdDevices)
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

      /**
       * Solo se ejecuta al inicio. Al cargar la page
       * @param {*} idPiso 
       * @returns 
       */
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
                        if (!error) {
                              for (let i = 0; i < data.length; i++) GestionPiso.changeStatusSonoff(data[i])
                        }
                  })
                  .catch((err) => {
                        console.error('Error: ', err)
                  });
      },

      initSocket: () => {
            socket = io(urlServer, { transports: ['websocket'] });

            GestionPiso.socket = socket;

            socket.on('connect', () => {
                  console.log('connected');
                  let dataCon = { type: Constants.TYPE_CODE_DEVICE, msg: "init socket client web" }
                  socket.emit(Constants.SOCKET_EMIT_TO_SERVER_ADD, clientFromID, JSON.stringify(dataCon));
            })

            socket.on(Constants.SOCKET_CATCH_MSG_FROM_SERVER, async (from, msg) => {
                  modalApp.hide();
                  const dataJson = JSON.parse(msg);

                  const codeAccion = Util.getCodeAlert(actionExec)
                  const elCodeForm = document.getElementById('codigo')
                  const elActionForm = document.getElementById('accion')
                  const elIdQr = document.getElementById('idQr')

                  const msgOK = document.getElementById(`msgOK_${codeAccion}`);
                  const msgKO = document.getElementById(`msgKO_${codeAccion}`);

                  msgOK.innerHTML = dataJson.msg;
                  msgKO.innerHTML = dataJson.msg;

                  const codeValue = (elCodeForm) ? elCodeForm.value : ''
                  const actionValue = (elActionForm) ? elActionForm.value : '0'
                  const idQrValue = (elIdQr) ? `M${elIdQr.value}` : ''

                  if (dataJson.status === 1) {
                        Util.showAlert(`alertOK_${codeAccion}`);
                        Util.hideAlert(`alertKO_${codeAccion}`);
                        switch (actionExec) {
                              case Constants.ACTION_NEWCODE:
                                    msgOK.innerHTML = dataJson.msg + `<br /> Código: ${codeValue}`;
                                    break
                              case Constants.ACTION_SETCARD:
                                    if (actionValue === '1') msgOK.innerHTML = dataJson.msg + `<br /> Se ha AGREGADO la tarjeta: ${idQrValue}`;
                                    else if (actionValue === '2') msgOK.innerHTML = dataJson.msg + `<br /> Se ha ELIMINADO la tarjeta: ${idQrValue}`;
                                    break
                              default:
                        }
                        GestionPiso.clearForm()
                  } else {
                        Util.showAlert(`alertKO_${codeAccion}`);
                        Util.hideAlert(`alertOK_${codeAccion}`);
                  }
            })

            socket.on('disconnect', function () {
                  console.log('Conexion cerrada desde el servidor!');
            });

            socket.connect();
      },

      /**
       * SIN USO
       * @param {*} idDevice 
       */
      actionOpenPortalOLD: (idDevice = 0) => {
            actionExec = Constants.ACTION_OPENPORTAL;
            const dataJSON = {
                  cmd: Constants.ACTION_OPENPORTAL,
                  client: codeDeviceTarget,
                  clientFrom: clientFromID,
                  user,
                  role,
                  idDevice,
                  idPiso: idPiso
            };
            GestionPiso.emitRequestServer(dataJSON);
      },

      /**
       * Nueva función que abre el portal del piso: 09/12/2023
       * @param {*} idDevice 
       */
      actionOpenPortal: (idDevice = 0) => {
            const dataJSON = { idDevice }
            modalApp.show()
            fetch('/openPortalSONOFF', {
                  method: 'POST',
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(dataJSON)
            }).then((res) => res.json).then((res) => {
                  console.log(res)
            }).finally(() => {
                  setTimeout(async () => {
                        modalApp.hide()
                  }, 300)
            })
      },

      actionOpenLock: (idDevice = 0) => {
            actionExec = Constants.ACTION_OPENLOCK;
            const dataJSON = {
                  cmd: Constants.ACTION_OPENLOCK,
                  client: codeDeviceTarget,
                  clientFrom: clientFromID,
                  user,
                  role,
                  idDevice,
                  idPiso: idPiso
            };
            GestionPiso.emitRequestServer(dataJSON);
      },

      actionNewCode: (idDevice = 0) => {
            actionExec = Constants.ACTION_NEWCODE;
            const dayF = parseInt(document.getElementById('vigencia').value.trim())
            const codeF = parseInt(document.getElementById('codigo').value.trim())
            const elTypeCode = document.getElementById('typecode')
            // Gestion de validaciones
            if (!GestionPiso.validateFieldsNewCode(dayF, codeF, elTypeCode)) return
            const dataJSON = {
                  cmd: Constants.ACTION_NEWCODE,
                  client: codeDeviceTarget,
                  clientFrom: clientFromID,
                  days: dayF,
                  code: codeF,
                  user,
                  role,
                  idDevice,
                  idPiso: idPiso,
                  idTypeCode: elTypeCode ? parseInt(elTypeCode.value.trim()) : undefined
            };
            GestionPiso.emitRequestServer(dataJSON);
      },

      validateFieldsNewCode: (dayF, codeF, elTypeCode) => {
            let result = true
            dayF = (dayF || '').toString().trim()
            codeF = (codeF || '').toString().trim()

            if (!(codeF.match(/^[0-9]{6}$/) && dayF.match(/^[1-9][0-9]{0,2}$/))) result = false

            // Si el campo existe valida
            if (elTypeCode) {
                  if (!((elTypeCode.value || '').trim().match(/\d+$/))) result = false
            }

            if (!result) Util.showErrorValidate(actionExec, 'Cambiar código')

            return result
      },

      actionSetCard: (idDevice = 0) => {
            actionExec = Constants.ACTION_SETCARD;
            const typeF = parseInt(document.getElementById('accion').value);
            const qRF = document.getElementById('qr').value;
            const idQRF = document.getElementById('idQr').value;
            const elLocationVal = document.getElementById('location').value
            const elTypeVal = (document.getElementById('typecard')) ? document.getElementById('typecard').value : undefined
            const elKey = document.getElementById('idKey')
            // Gestion de validaciones
            if (!GestionPiso.validateFieldsSetCard(qRF.trim(), typeF, idQRF.trim(), elLocationVal, elTypeVal)) return
            const dataJSON = {
                  cmd: Constants.ACTION_SETCARD,
                  client: codeDeviceTarget,
                  clientFrom: clientFromID,
                  type: typeF,
                  Qr: qRF.trim(),
                  idQr: idQRF.trim(),
                  location: elLocationVal,
                  typeTarjeta: (elTypeVal) ? elTypeVal : 'Normal',
                  user,
                  role,
                  idDevice,
                  idPiso: idPiso,
                  idKey: parseInt((elKey) ? elKey.value : '0')
            };
            GestionPiso.emitRequestServer(dataJSON);
      },

      actionSyncTime: (idDevice = 0) => {
            actionExec = Constants.ACTION_SYNCTIME;
            // const syncTime = parseInt(document.getElementById('sincroTimestamp').value)
            const hoursSub = 28800 - (Math.abs((new Date()).getTimezoneOffset()) * 60)
            const syncTime = Math.floor((new Date().getTime() / 1000) - hoursSub)
            // Gestion de validaciones
            // if ( !GestionPiso.validateFieldsSyncTime(syncTime) ) return
            const dataJSON = {
                  cmd: Constants.ACTION_SYNCTIME,
                  client: codeDeviceTarget,
                  clientFrom: clientFromID,
                  syncTime,
                  user,
                  role,
                  idDevice,
                  idPiso: idPiso
            };
            GestionPiso.emitRequestServer(dataJSON);
      },

      validateFieldsSetCard: (qRF, typeF, idQRF, location, typeTarjeta = undefined) => {
            let result = true
            qRF = (qRF || '').toString().trim()
            typeF = (typeF || '').toString().trim()
            idQRF = (idQRF || '').toString().trim()
            location = (location || '').toString().trim()

            if (!(typeF.match(/^[1-2]{1}$/) &&
                  qRF.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/) &&
                  idQRF.match(/^[0-9]{12}$/) &&
                  location.match(/(Oficina|Piso)$/) &&
                  (typeTarjeta == undefined || typeTarjeta.match(/(Normal|Maestra)$/))
            )) result = false

            if (!result) Util.showErrorValidate(actionExec, 'Llaves Magnéticas')

            return result
      },

      validateFieldsSyncTime: (syncTime) => {
            let result = true
            syncTime = (syncTime || '').toString().trim()

            if (!(syncTime.match(/^[0-9]{10}$/))) result = false

            if (!result) Util.showErrorValidate(actionExec, 'Control del piso')

            return result
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
                        cmd: Constants.ACTION_TOGGLELIGHT, client: codeDeviceTarget, user, role, idDevice,
                        idPiso: idPiso
                  })
            })
                  .then(res => res.json())
                  .then(res => {
                        // Error por no desconexion del dispositivo
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
                        modalApp.hide()
                        if (res.data.error === 4002) alert('No es posible controlar el dispositivo!!')
                  })
                  .catch((err) => {
                        console.log('Error: ', err);
                        modalApp.hide();
                  });
      },

      emitRequestServer: (dataJSON) => {
            // Verifica los ids del piso y dispositivo
            if (!(dataJSON.idDevice && dataJSON.idPiso)) {
                  alert("Información no válida. Por favor intentelo más tarde!")
                  return
            }
            try {
                  if (socket === null) GestionPiso.initSocket();
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

      actionOnOperacion: () => {
            const elAccionValue = document.getElementById('accion').value
            const elLocation = document.getElementById('location')
            const elQr = document.getElementById('qr')
            const elIdQr = document.getElementById('idQr')
            const elType = document.getElementById('typecard')
            const elKey = document.getElementById('idKey')

            const msgIdQr = document.getElementById('msgIdQr')

            elKey.value = 0

            elIdQr.value = ''
            msgIdQr.classList.add('hide');
            msgIdQr.classList.remove('show');

            elQr.value = ''
            elLocation.value = 'NA'
            elType && (elType.value = 'NA')
            elIdQr.removeAttribute('readonly')

            if (elAccionValue === '1') { // Activa fields
                  elQr.removeAttribute('readonly')
                  elLocation.removeAttribute('disabled')
                  elType && elType.removeAttribute('disabled')
            } else if (elAccionValue === '2') { // Desactiva fields
                  elQr.setAttribute('readonly', true)
                  elLocation.setAttribute('disabled', true)
                  elType && elType.setAttribute('disabled', true)
            } else {
                  elIdQr.setAttribute('readonly', true)
                  elQr.setAttribute('readonly', true)
                  elLocation.setAttribute('disabled', true)
                  elType && elType.setAttribute('disabled', true)
            }
      },

      actionOnIdQr: () => {
            const elAccionValue = document.getElementById('accion').value
            const elIdQr = document.getElementById('idQr')
            const msgIdQr = document.getElementById('msgIdQr')

            const elLocation = document.getElementById('location')
            const elQr = document.getElementById('qr')
            const elType = document.getElementById('typecard')

            const elKey = document.getElementById('idKey')

            const btnTarget = document.getElementById('btnTarget')

            btnTarget && btnTarget.setAttribute('disabled', 'true')

            const elSpinnerSearch = document.getElementById('spinnerSearch')
            elSpinnerSearch.classList.add('show')
            elSpinnerSearch.classList.remove('hide')

            msgIdQr.classList.add('hide')
            msgIdQr.classList.remove('show')
            msgIdQr.classList.add('text-danger')
            msgIdQr.classList.remove('text-success')

            // Limpiar campos
            elLocation.value = 'NA'
            elQr.value = ''
            elType && (elType.value = 'NA')

            // field empty. no action
            if (elIdQr.value.trim() === '') {
                  elSpinnerSearch.classList.add('hide')
                  elSpinnerSearch.classList.remove('show')
                  return
            }

            // action: new card, no action
            // if ( elAccionValue === '1') return
            msgIdQr.classList.add('hide')
            msgIdQr.classList.remove('show')
            msgIdQr.classList.add('text-danger')
            msgIdQr.classList.remove('text-success')

            elKey && (elKey.value = 0)

            try {
                  fetch(`/gettarjetasbyflat?piso=${codeDeviceTarget}&idQr=${elIdQr.value.trim()}`)
                        .then(response => response.json())
                        .then(data => {
                              elSpinnerSearch.classList.add('hide')
                              elSpinnerSearch.classList.remove('show')
                              let idQR = `M${elIdQr.value}`
                              if (data.status === 1) {
                                    let isKeyMaestra = data.isKeyMaestra
                                    let isRoot = data.isRoot

                                    // Verifica si la llave es maestra y que tenga permisos
                                    if (isKeyMaestra === 1 && isRoot !== 1) {
                                          msgIdQr.innerHTML = `No tiene permiso para +/- llave maestra!!`
                                          msgIdQr.classList.add('show');
                                          msgIdQr.classList.remove('hide');
                                          return
                                    } else if (isKeyMaestra === 1 && isRoot === 1) {
                                          elKey && (elKey.value = data.keyMaestra.id)
                                          elQr.value = data.keyMaestra.qr
                                          elLocation.value = data.keyMaestra.ubicacion
                                          elType && (elType.value = data.keyMaestra.tipo_tarjeta)

                                          elQr.setAttribute('readonly', true)
                                          elLocation.setAttribute('disabled', true)
                                          elType && elType.setAttribute('disabled', true)
                                    }

                                    let tarjetaData = data.data.filter(el => el.idqr === idQR)[0]

                                    if (tarjetaData) {
                                          elKey && (elKey.value = tarjetaData.id)
                                          elQr.value = tarjetaData.qr
                                          elLocation.value = tarjetaData.ubicacion
                                          elType && (elType.value = tarjetaData.tipo_tarjeta)

                                          tarjetaData.piso = (tarjetaData.piso) ? tarjetaData.piso.toString().trim() : ''

                                          if (elAccionValue === '1' && codeDeviceTarget === tarjetaData.piso) {
                                                elKey && (elKey.value = 0)
                                                msgIdQr.innerHTML = `La tarjeta ya existe!!`
                                                msgIdQr.classList.add('show');
                                                msgIdQr.classList.remove('hide');
                                          } else if (['1', '2'].includes(elAccionValue) && codeDeviceTarget !== tarjetaData.piso && tarjetaData.piso.length !== 0) {
                                                elKey && (elKey.value = 0)
                                                msgIdQr.innerHTML = `La tarjeta ya existe en otro piso: '${tarjetaData.piso}'`
                                                msgIdQr.classList.add('show');
                                                msgIdQr.classList.remove('hide');
                                          } else if (elAccionValue === '2' && tarjetaData.piso.length === 0) {
                                                elKey && (elKey.value = 0)
                                                msgIdQr.innerHTML = `No existe la tarjeta para este piso!!`
                                                msgIdQr.classList.remove('hide');
                                                msgIdQr.classList.add('show');
                                          } else {
                                                btnTarget && btnTarget.removeAttribute('disabled')
                                                msgIdQr.innerHTML = `OK, proceder con la operación`
                                                msgIdQr.classList.add('show')
                                                msgIdQr.classList.remove('hide')
                                                msgIdQr.classList.add('text-success')
                                                msgIdQr.classList.remove('text-danger')
                                          }
                                    } else {
                                          //Mensaje no existe tarjeta
                                          if (elAccionValue !== '1') {
                                                msgIdQr.innerHTML = `No existe la tarjeta para este piso!!`
                                                msgIdQr.classList.remove('hide');
                                                msgIdQr.classList.add('show');
                                          } else {
                                                btnTarget && btnTarget.removeAttribute('disabled')
                                                msgIdQr.innerHTML = `OK, proceder con la operación`
                                                msgIdQr.classList.add('show')
                                                msgIdQr.classList.remove('hide')
                                                msgIdQr.classList.add('text-success')
                                                msgIdQr.classList.remove('text-danger')
                                          }
                                    }
                              } else {
                                    // Error
                                    msgIdQr.innerHTML = "Intentelo más tarde!"
                                    msgIdQr.classList.remove('hide');
                                    msgIdQr.classList.add('show');
                              }
                        })
                        .catch(err => {
                              msgIdQr.innerHTML = "Intentelo más tarde!"
                              msgIdQr.classList.remove('hide');
                              msgIdQr.classList.add('show');
                        })
            } catch (err) {
                  console.log('Error http on server')
                  msgIdQr.innerHTML = "Intentelo más tarde!"
                  msgIdQr.classList.remove('hide');
                  msgIdQr.classList.add('show');
            }
      },

      generateCode: () => {
            document.getElementById('codigo').value = Util.generateCode();
      },

      generateTimeStamp: () => {
            document.getElementById('sincroTimestamp').value = Math.floor((new Date().getTime() / 1000) - 28800);
      },

      clearForm: () => {
            const elDayF = document.getElementById('vigencia')
            const elCodeF = document.getElementById('codigo')
            const elTypeF = document.getElementById('accion')
            const elQRF = document.getElementById('qr')
            const elIdQRF = document.getElementById('idQr')
            const elLocationVal = document.getElementById('location')
            const elTypeVal = document.getElementById('typecard')
            const btnTarget = document.getElementById('btnTarget')
            const elMsgIdQr = document.getElementById('msgIdQr')

            elDayF && (elDayF.value = '')
            elCodeF && (elCodeF.value = '')
            elTypeF && (elTypeF.value = '0')
            elQRF && (elQRF.value = '')
            elIdQRF && (elIdQRF.value = '')
            elLocationVal && (elLocationVal.value = 'NA')
            elTypeVal && (elTypeVal.value = 'NA')
            btnTarget && btnTarget.setAttribute('disabled', 'true')
            elMsgIdQr.classList.remove('show');
            elMsgIdQr.classList.add('hide');
      },

      back: (path = '') => {
            location.href = `/${path}`
      }




}