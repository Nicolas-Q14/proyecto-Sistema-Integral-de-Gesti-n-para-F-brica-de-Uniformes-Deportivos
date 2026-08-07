/* administrativo.js — gestión de usuarios del sistema.
   Datos en localStorage 'tyc_usuarios_data'. */

const CLAVE_USUARIOS = 'tyc_usuarios_data';

function cargarUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS);
  if (datos) return JSON.parse(datos);

  const semilla = [
    { id: 1, nombre: 'Laura Ramírez', correo: 'laura@telaycorte.com', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'Carlos Nieto', correo: 'carlos@telaycorte.com', rol: 'Jefe de producción', estado: 'Activo' },
    { id: 3, nombre: 'Sofía Peña', correo: 'sofia@telaycorte.com', rol: 'Encargado de inventario', estado: 'Activo' },
  ];
  guardarUsuarios(semilla);
  return semilla;
}

function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

let usuarios = cargarUsuarios();

function renderKpis() {
  const total = usuarios.length;
  const activos = usuarios.filter(u => u.estado === 'Activo').length;

  document.getElementById('kpi-admin').innerHTML = `
    <div class="kpi"><div class="kpi__valor">${total}</div><div class="kpi__label">Usuarios totales</div></div>
    <div class="kpi"><div class="kpi__valor">${activos}</div><div class="kpi__label">Usuarios activos</div></div>
  `;
}

function renderTabla() {
  const cuerpo = document.getElementById('tabla-usuarios');
  const vacio = document.getElementById('usuarios-vacio');

  if (!usuarios.length) {
    cuerpo.innerHTML = '';
    vacio.style.display = 'block';
    return;
  }
  vacio.style.display = 'none';

  cuerpo.innerHTML = usuarios.map(u => `
    <tr>
      <td>${u.nombre}</td>
      <td>${u.correo}</td>
      <td>${u.rol}</td>
      <td><span class="etiqueta ${u.estado === 'Activo' ? 'etiqueta--activo' : 'etiqueta--inactivo'}">${u.estado}</span></td>
      <td class="acciones-fila">
        <button class="icon-btn" data-alternar="${u.id}">${u.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button>
        <button class="icon-btn icon-btn--peligro" data-eliminar="${u.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-alternar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.alternar);
      const usuario = usuarios.find(u => u.id === id);
      usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      guardarUsuarios(usuarios);
      renderTabla();
      renderKpis();
    });
  });

  document.querySelectorAll('[data-eliminar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.eliminar);
      usuarios = usuarios.filter(u => u.id !== id);
      guardarUsuarios(usuarios);
      renderTabla();
      renderKpis();
    });
  });
}

document.getElementById('form-usuario').addEventListener('submit', (e) => {
  e.preventDefault();

  const nuevo = {
    id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre: document.getElementById('u-nombre').value,
    correo: document.getElementById('u-correo').value,
    rol: document.getElementById('u-rol').value,
    estado: document.getElementById('u-estado').value,
  };

  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  renderTabla();
  renderKpis();
  e.target.reset();
});

renderKpis();
renderTabla();
