var params = new URLSearchParams(window.location.search);
let nombre = params.get('nombre');
let sala = params.get('sala');


const divUsuarios = document.querySelector('#divUsuarios');
const formEnviar = document.querySelector('#formEnviar');
const txtMensaje = document.querySelector('#txtMensaje');
const divChatbox = document.querySelector('#divChatbox');
const txtBuscarPersona = document.querySelector('#buscarPersona');
const nombreSala = document.querySelector('#nombreSala');
nombreSala.innerText = sala;

const renderizarUsuarios = (personas) => {
  let html = '';
  html += '<li>';
  html += `<a href="javascript:void(0)" class="active"> Chat de <span> ${sala}</span></a>`;
  html += '</li>';

  for (const persona of personas) {
    html += '<li>';
    html += `<a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>`;
    html += '</li>';
  }
  divUsuarios.innerHTML = html;
}

const renderizarMensajes = (mensaje, me) => {
  let fecha = new Date(mensaje.fecha);
  let hora = `${fecha.getHours()}:${fecha.getMinutes()}`;

  let li = document.createElement('li');
  let divImg = document.createElement('div');
  let img = document.createElement('img');
  let divContent = document.createElement('div');
  let h5 = document.createElement('h5');
  let divMensaje = document.createElement('div');
  let divHora = document.createElement('div');

  h5.innerText = mensaje.nombre;
  divMensaje.innerText = mensaje.mensaje;
  divHora.innerText = hora;

  li.classList.add('animated', 'fadeIn');
  divImg.classList.add('chat-img');
  divContent.classList.add('chat-content');
  divMensaje.classList.add('box');
  divHora.classList.add('chat-time');

  divImg.appendChild(img);
  divContent.append(h5, divMensaje);

  if (me) {
    img.src = 'assets/images/users/5.jpg';
    li.classList.add('reverse');
    divMensaje.classList.add('bg-light-inverse');
    li.append(divContent, divImg, divHora);
  } else {
    if (mensaje.nombre === 'Administrador') {
      divMensaje.classList.add('bg-light-danger');
    } else {
      img.src = 'assets/images/users/1.jpg';
      divMensaje.classList.add('bg-light-info');
      li.append(divImg);
    }
    li.append(divContent, divHora);
  }

  divChatbox.appendChild(li);
}

function scrollBottom() {
  if (divChatbox.scrollHeight - divChatbox.scrollTop <= 710 ) {
    divChatbox.scrollTo(0, divChatbox.scrollHeight);
  }
}

// Listeners
divUsuarios.addEventListener('click', (event) => {
  let target = event.target;
  switch (target.tagName) {
    case 'SPAN':
    case 'IMG':
      target = target.parentNode;
      break;
    case 'SMALL':
      target = target.parentNode.parentNode;
      break;
  }
  const id = target.dataset.id;
  if (id) {
    console.log(id);
  }
});

formEnviar.addEventListener('submit', (event) => {
  event.preventDefault();
  let mensaje = txtMensaje.value.trim();
  if (mensaje.length === 0) {
    return;
  }
  socket.emit('crearMensaje', {
    nombre,
    mensaje
  }, function(resp) {
    txtMensaje.value = "";
    txtMensaje.focus();
    renderizarMensajes(resp, true);
    scrollBottom();
  });
});

txtBuscarPersona.addEventListener('keyup', (event) => {
  let filtro = event.target.value.trim();
  socket.emit('filtrarPersonas', {
    filtro,
    sala
  }, (resp) => {
    renderizarUsuarios(resp);
  });
})