

var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son requeridos');
}
if (params.get('nombre') === 'Administrador') {
    window.location = 'index.html';
    throw new Error('Nombre no permitido');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario,
    (resp) => {
        renderizarUsuarios(resp);
    });

});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');


});

socket.on('crearMensaje', function(resp) {
    renderizarMensajes(resp, false);
    scrollBottom();
});

socket.on('listaPersonas', function(resp) {
    renderizarUsuarios(resp)
});

// Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado:', mensaje);
});