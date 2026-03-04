const http = require('http');
const { Server } = require('socket.io');

const app = http.createServer();
const io = new Server(app);
const PORT = 8082;

let serverRunning = false;

// Iniciar el servidor

app.listen(PORT, () => {
    console.log(`Servidor de la Mirilla escuchando en el puerto ${PORT}`);
    serverRunning = true; // Marcar como servidor en ejecución
});

// Función para detener servidor
function stopServer() {
    if (serverRunning) {
        console.log('Deteniendo servidor Mirilla...');

        // Realiza cualquier tarea asíncrona (como guardar logs, cerrar conexiones, etc.)
        performAsyncTasks().then(() => {
            io.emit('stop-video-streaming');
            io.close(() => {
                console.log('Servidor Mirilla detenido correctamente');
                serverRunning = false;
                process.exit(0);
            });
        }).catch((error) => {
            console.error('Error en tareas asíncronas:', error);
            io.close(() => {
                console.log('Servidor Mirilla detenido debido a error');
                serverRunning = false;
                process.exit(1);
            });
        });
    }
}


// Escuchar conexiones de clientes
io.on('connection', (socket) => {
    console.log('Cliente conectado al servidor de la Mirilla.');

    // Mostrar todos los eventos recibidos con una pequeña vista previa de los datos
    socket.onAny((event, ...args) => {
        console.log(`Evento recibido: ${event}`, args.length > 0 ? (typeof args[0] === 'string' ? args[0].slice(0, 30) + '...' : args[0]) : '');
    });

    socket.on('send-id', (id) => {
        console.log(`ID recibido: ${id}`);
        socket.broadcast.emit('receive-id', id);
    });

    socket.on('stop-video-streaming', () => {
        console.log('Servidor ha recibido stop-video-streaming');
        socket.emit('stop-video-streaming');  // Enviar al cliente que ha enviado el evento
        socket.broadcast.emit('stop-video-streaming');  // Enviar a otros clientes
    });

    socket.on('video-data', (data) => {
        console.log('Datos de video recibidos');
        console.log(`Tamaño recibido: ${data.length} caracteres`);
        socket.broadcast.emit('video-stream', data);
        console.log('Imagen reenviada a otros clientes.');
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado del servidor de la Mirilla.');
        if (io.sockets.sockets.size > 0) {
            io.emit('stop-video-streaming');
        }
    });
});






// Escuchar señales de cierre
process.on('SIGTERM', () => {
    console.log('Recibido SIGTERM, cerrando servidor...');
    stopServer();
});

process.on('SIGINT', () => {
    console.log('Recibido SIGINT, cerrando servidor...');
    stopServer();
});


