/* sidebar.js — construye el menú lateral del portal.
   Un solo lugar para agregar/quitar módulos: si mañana hay un
   módulo nuevo, se agrega aquí y aparece en TODO el portal. */

const MODULOS_PORTAL = [
  { clave: 'dashboard',       ic: '00', nombre: 'Inicio',       ruta: 'dashboard.html' },
  { clave: 'pedidos',         ic: '01', nombre: 'Pedidos',      ruta: 'modules/pedidos/index.html' },
  { clave: 'produccion',      ic: '02', nombre: 'Producción',   ruta: 'modules/produccion/index.html' },
  { clave: 'inventario',      ic: '03', nombre: 'Inventario',   ruta: 'modules/inventario/index.html' },
  { clave: 'administrativo',  ic: '04', nombre: 'Administrativo', ruta: 'modules/administrativo/index.html' },
  { clave: 'reportes',        ic: '05', nombre: 'Reportes',     ruta: 'modules/reportes/index.html' },
];

/* rutaBase: cuántos niveles hay que subir para llegar a app/ (ej. '' en app/, '../../' en app/modules/x/) */
function construirSidebar(moduloActivo, rutaBase) {
  const contenedor = document.getElementById('sidebar-container');
  if (!contenedor) return;

  const sesion = typeof obtenerSesion === 'function' ? obtenerSesion() : null;

  const enlaces = MODULOS_PORTAL.map(m => {
    const activo = m.clave === moduloActivo ? 'activo' : '';
    return `<a href="${rutaBase}${m.ruta}" class="${activo}"><span class="ic">${m.ic}</span> ${m.nombre}</a>`;
  }).join('');

  contenedor.innerHTML = `
    <aside class="sidebar">
      <div>
        <div class="sidebar__marca">Tela<span>&</span>Corte</div>
        <div class="sidebar__sub">Portal empresarial</div>
      </div>
      <nav class="sidebar__nav">${enlaces}</nav>
      <div class="sidebar__pie">
        <div class="sidebar__usuario">${sesion ? sesion.nombre : 'Invitado'}</div>
        <div class="sidebar__rol">${sesion ? sesion.rol : ''}</div>
        <a href="#" class="sidebar__salir" id="btn-cerrar-sesion">Cerrar sesión →</a>
      </div>
    </aside>
  `;

  const btnSalir = document.getElementById('btn-cerrar-sesion');
  if (btnSalir) {
    btnSalir.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion(rutaBase + 'login.html');
    });
  }
}
