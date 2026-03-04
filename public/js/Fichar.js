const Fichar = {
      socket: null,
      modalApp: null,
      clientFromID: null,
      urlServer: null,
      user: null,
      qr: null,
      token: null,

      init: (tokenQR, urlServerIn, userLogin, tokenLogin) => {
            clientFromID = Util.generateUID()
            modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            urlServer = urlServerIn
            user = userLogin
            qr = tokenQR || ''
            token = tokenLogin || ''
            console.log('qr: ', qr)
            Fichar.initSocket()
      },

      initSocket: () => {
            socket = io(urlServer, {
                transports : ['websocket'],
                query: {
                    id: clientFromID,
                    dslave: "mchapp"
                }
            });

            socket.on('connect',() => {
                  console.log('connected....');
                  let dataCon = { token, qr, ip: '', user}
                  // Emite un evento para registrar el fichaje
                  modalApp.show();
                  socket.emit("fichar", clientFromID, JSON.stringify(dataCon))
            })

            // Capturar respuesta del servidor
            socket.on('changeqr', async (from, msg) => {
                  //let _modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
                  //_modalApp.hide()
                  setTimeout(() => {
                        try {
                              const _dataJson = JSON.parse(msg)
                              let _state = parseInt(`${_dataJson.data.state}`)
                              _state === 1 && (location.href = '/')
                              if (_state === 0) {
                                    alert('Error, vuelva a escanear QR!!')
                                    location.href = '/'
                              }
                        } catch (err){
                              alert('Error, vuelva a escanear QR!!')
                        }
                  }, 300)
            })

            // Reconexion por errores de sockets
            socket.on("connect_error", () => {
                console.log('error connect')
            })

            socket.on('disconnect', function () {
                  console.log('Conexion cerrada desde el servidor!');
            });

            socket.connect();
      },

      back: (path = '') => {
            location.href=`/${path}`
      }
}