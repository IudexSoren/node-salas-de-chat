const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../util/util');

const users = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                mensaje: 'El nombre y la sala son requeridos'
            });
        }
        client.join(data.sala);
        users.agregarPersona(client.id, data.nombre, data.sala);
        let personasSala = users.getPersonasPorSala(data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', personasSala);
        callback(personasSala);
    });

    client.on('crearMensaje', (data) => {
        let persona = users.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    // Mensajes privados
    client.on('mensajePrivado', (data) => {
        let persona = users.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

    client.on('disconnect', () => {
        let personaBorrada = users.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', users.getPersonasPorSala(personaBorrada.sala));
    });

});