/* reportes.js — lee los datos que ya guardaron los otros módulos
   en localStorage y arma indicadores de alto nivel. No escribe
   datos nuevos: si un módulo cambia su forma de guardar, solo
   hay que ajustar las claves de aquí abajo. */

const CLAVE_PEDIDOS_R = 'tyc_pedidos_data';
const CLAVE_PRODUCCION_R = 'tyc_produccion_data';
const CLAVE_INVENTARIO_R = 'tyc_inventario_data';

function leer(clave) {
  const datos = localStorage.getItem(clave);
  return datos ? JSON.parse(datos) : [];
}

const pedidosR = leer(CLAVE_PEDIDOS_R);
const produccionR = leer(CLAVE_PRODUCCION_R);
const inventarioR = leer(CLAVE_INVENTARIO_R);

function renderKpis() {
  const totalPedidos = pedidosR.length;
  const totalUnidades = pedidosR.reduce((s, p) => s + Number(p.cantidad || 0), 0);
  const avancePromedio = produccionR.length
    ? Math.round(produccionR.reduce((s, t) => s + Number(t.avance || 0), 0) / produccionR.length)
    : 0;
  const alertas = inventarioR.filter(m => Number(m.cantidad) <= Number(m.minimo)).length;

  document.getElementById('kpi-reportes').innerHTML = `
    <div class="kpi"><div class="kpi__valor">${totalPedidos}</div><div class="kpi__label">Pedidos registrados</div></div>
    <div class="kpi"><div class="kpi__valor">${totalUnidades}</div><div class="kpi__label">Unidades solicitadas</div></div>
    <div class="kpi"><div class="kpi__valor">${avancePromedio}%</div><div class="kpi__label">Avance de producción</div></div>
    <div class="kpi ${alertas ? 'kpi--alerta' : ''}"><div class="kpi__valor">${alertas}</div><div class="kpi__label">Alertas de inventario</div></div>
  `;
}

function renderPedidosPorEstado() {
  const estados = ['Pendiente', 'En producción', 'Listo', 'Entregado'];
  const total = pedidosR.length || 1;
  const cont = document.getElementById('reporte-pedidos');

  if (!pedidosR.length) {
    cont.innerHTML = '<p class="vacio">Aún no hay pedidos para mostrar. Registra alguno en el módulo de Pedidos.</p>';
    return;
  }

  cont.innerHTML = estados.map(estado => {
    const cantidad = pedidosR.filter(p => p.estado === estado).length;
    const porcentaje = Math.round((cantidad / total) * 100);
    return `
      <div class="reporte-fila">
        <span>${estado}</span>
        <div class="barra-fondo"><div class="barra-relleno" style="width:${porcentaje}%"></div></div>
        <span>${cantidad}</span>
      </div>
    `;
  }).join('');
}

function renderProduccion() {
  const cont = document.getElementById('reporte-produccion');
  if (!produccionR.length) {
    cont.innerHTML = '<p class="vacio">Aún no hay tareas de producción registradas.</p>';
    return;
  }
  cont.innerHTML = produccionR.map(t => `
    <div class="reporte-fila">
      <span>${t.tarea}</span>
      <div class="barra-fondo"><div class="barra-relleno" style="width:${t.avance}%"></div></div>
      <span>${t.avance}%</span>
    </div>
  `).join('');
}

function renderAlertasInventario() {
  const cuerpo = document.getElementById('tabla-alertas');
  const vacio = document.getElementById('alertas-vacio');
  const bajos = inventarioR.filter(m => Number(m.cantidad) <= Number(m.minimo));

  if (!bajos.length) {
    cuerpo.innerHTML = '';
    vacio.style.display = 'block';
    return;
  }
  vacio.style.display = 'none';
  cuerpo.innerHTML = bajos.map(m => `
    <tr><td>${m.nombre}</td><td>${m.cantidad} ${m.unidad}</td><td>${m.minimo} ${m.unidad}</td></tr>
  `).join('');
}

renderKpis();
renderPedidosPorEstado();
renderProduccion();
renderAlertasInventario();
