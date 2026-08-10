/* auth.js — autenticación simulada para el prototipo.
   Cuando exista backend, solo hay que reemplazar estas
   funciones; el resto del portal no debería cambiar. */

const USUARIOS_DEMO = [
  { usuario: 'admin',      clave: '1234', nombre: 'Nicolas Quitian',  rol: 'Administrador' },
  { usuario: 'produccion', clave: '1234', nombre: 'Carlos Nieto',   rol: 'Jefe de producción' },
  { usuario: 'inventario', clave: '1234', nombre: 'Sofía Peña',     rol: 'Encargada de inventario' },
];

const CLAVE_SESION = 'telaycorte_sesion';

function iniciarSesion(usuario, clave) {
  const encontrado = USUARIOS_DEMO.find(
    u => u.usuario === usuario.trim().toLowerCase() && u.clave === clave
  );
  if (!encontrado) return false;

  localStorage.setItem(CLAVE_SESION, JSON.stringify({
    usuario: encontrado.usuario,
    nombre: encontrado.nombre,
    rol: encontrado.rol,
  }));
  return true;
}

function obtenerSesion() {
  const datos = localStorage.getItem(CLAVE_SESION);
  return datos ? JSON.parse(datos) : null;
}

function cerrarSesion(rutaLogin) {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = rutaLogin;
}

/* Llamar al inicio de cada página protegida.
   rutaLogin: ruta relativa hasta app/login.html desde la página actual. */
function protegerPagina(rutaLogin) {
  if (!obtenerSesion()) {
    window.location.href = rutaLogin;
  }
}
