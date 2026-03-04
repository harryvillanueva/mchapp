let __sendIdLock = false
const PisoSender = {
    actionGestionarPiso: () => {
        // Validar que se haya seleccionado el PISO
        if(   document.getElementById('client').value.trim().length === 0 ||
                document.getElementById('client').value.trim() === '0|NA' ) {
                alert("Por favor, seleccionar un piso!")
                return
        }

        let [ _idPiso = 0, _codePiso='NA' ] = document.getElementById('client').value.split('|')
        let _idDevice = 0
        if ( __sendIdLock ) {
            if(   document.getElementById('idlock').value.trim().length === 0 ||
                document.getElementById('idlock').value.trim() === '-1' ) {
                alert("Por favor, seleccionar un puerta!")
                return
            }
            _idDevice = document.getElementById('idlock').value.trim()
            location.href=`/gestionpisos?piso=${_codePiso}&idpiso=${_idPiso}&iddevice=${_idDevice}`
            return
        }
        location.href=`/gestionpisos?piso=${_codePiso}&idpiso=${_idPiso}`
    },

    actionGestionarPisoNew: (e, idPiso = 0, codePiso = '') => {
        if( idPiso === 0 || codePiso.trim() === '' ) {
                alert("Por favor, seleccionar un piso!")
                return
        }

        // let [ _idPiso = 0, _codePiso='NA' ] = document.getElementById('client').value.split('|')
        let [ _idPiso = 0, _codePiso='NA' ] = [ idPiso, codePiso ]
        // let _idDevice = 0
        // if ( __sendIdLock ) {
        //     if(   document.getElementById('idlock').value.trim().length === 0 ||
        //         document.getElementById('idlock').value.trim() === '-1' ) {
        //         alert("Por favor, seleccionar un puerta!")
        //         return
        //     }
        //     _idDevice = document.getElementById('idlock').value.trim()
        //     location.href=`/gestionpisos?piso=${_codePiso}&idpiso=${_idPiso}&iddevice=${_idDevice}`
        //     return
        // }
        location.href=`/gestionpisos?piso=${_codePiso}&idpiso=${_idPiso}`
        e.stopPropagation() // Evita que se propagen eventos del padre
    },

    actionLoadLocksByPiso: () => {
        const elLock = document.getElementById('idlock')
        let _txtOptions = `<option value="-1">Seleccionar Puerta</option>`
        // document.getElementById('waitSearch').classList.replace('hide', 'show')
        
        if(   document.getElementById('client').value.trim().length === 0 ||
                document.getElementById('client').value.trim() === '0|NA' ) return
        
        try {
            __sendIdLock = false
            elLock.classList.remove('show')
            elLock.classList.add('hide')
            let [ idPiso = 0, codePiso='NA' ] = document.getElementById('client').value.split('|')
            document.getElementById('waitSearch').classList.replace('hide', 'show')
            fetch(`/getlocksbyflat?piso=${codePiso}&idpiso=${idPiso}`)
                .then( response => response.json())
                .then( data => {
                    // console.log('data ->', data)
                    if (data.status === 1) {
                        data.showLocks && elLock.classList.replace('hide', 'show')
                        __sendIdLock = data.showLocks
                        let _lDevices = [...data.data] || []
                        _lDevices.forEach(el => {
                            _txtOptions += `<option value="${el.id}">${el.etiqueta_dispositivo}</option>`
                        })
                        elLock.innerHTML = _txtOptions
                    }
                    document.getElementById('waitSearch').classList.replace('show', 'hide')
                })
                .catch( err => {
                    document.getElementById('waitSearch').classList.replace('show', 'hide')
                })
        } catch(err) {
                console.log('Error http on server')
                document.getElementById('waitSearch').classList.replace('show', 'hide')
        }
    },

    goHome: () => {
        location.href=`/`
    },

    goDetailsFlat: () => {
        // Validar que se haya seleccionado el PISO
        if(   document.getElementById('client').value.trim().length === 0 ||
                document.getElementById('client').value.trim() === '0|NA' ) {
                alert("Por favor, seleccionar un piso!")
                return
        }


        // Activar cuando este disponible la funcuonalidad 
        let [ _idPiso = 0, _codePiso='NA' ] = document.getElementById('client').value.split('|')
        let _idDevice = 0
        if ( __sendIdLock ) {
            if(   document.getElementById('idlock').value.trim().length === 0 ||
                document.getElementById('idlock').value.trim() === '-1' ) {
                alert("Por favor, seleccionar un puerta!")
                return
            }
            _idDevice = document.getElementById('idlock').value.trim()
            location.href=`/detailsflat?piso=${_codePiso}&idPiso=${_idPiso}&idDevice=${_idDevice}`
            return
        }
        location.href=`/detailsflat?piso=${_codePiso}&idPiso=${_idPiso}`

        // let [ idPiso=0, codePiso='NA' ] = document.getElementById('client').value.split('|')
        // location.href=`/detailsflat?piso=${codePiso}&idPiso=${idPiso}`
    },

    goDetailsFlatNew: (idPiso = 0, codePiso = '') => {
        // Validar que se haya seleccionado el PISO
        if( idPiso === 0 || codePiso.trim() === '' ) {
            alert("Por favor, seleccionar un piso!")
            return
        }

        // if(   document.getElementById('client').value.trim().length === 0 ||
        //         document.getElementById('client').value.trim() === '0|NA' ) {
        //         alert("Por favor, seleccionar un piso!")
        //         return
        // }


        // Activar cuando este disponible la funcuonalidad 
        let [ _idPiso = 0, _codePiso='NA' ] =[idPiso, codePiso]
        // let _idDevice = 0
        // if ( __sendIdLock ) {
        //     if(   document.getElementById('idlock').value.trim().length === 0 ||
        //         document.getElementById('idlock').value.trim() === '-1' ) {
        //         alert("Por favor, seleccionar un puerta!")
        //         return
        //     }
        //     _idDevice = document.getElementById('idlock').value.trim()
        //     location.href=`/detailsflat?piso=${_codePiso}&idPiso=${_idPiso}&idDevice=${_idDevice}`
        //     return
        // }
        location.href=`/detailsflat?piso=${_codePiso}&idPiso=${_idPiso}`
    }
}