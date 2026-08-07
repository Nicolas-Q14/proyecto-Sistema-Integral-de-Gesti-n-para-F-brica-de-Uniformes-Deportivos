/* pedidos.js — todo lo que necesita el módulo de pedidos vive aquí.
   Guarda los datos en localStorage bajo la clave 'pedidos_data'.
   Cuando haya backend, solo se reemplazan cargarPedidos/guardarPedidos. */

const CLAVE_PEDIDOS = 'tyc_pedidos_data';

function cargarPedidos() {
  const datos = localStorage.getItem(CLAVE_PEDIDOS);
  if (datos) return JSON.parse(datos);

  // datos de ejemplo para que el prototipo no se vea vacío
  const semilla = [
    { id: 1, cliente: 'Colegio San Rafael', tipo: 'Escolar', talla: '6-16', cantidad: 180, fecha: '2026-09-05', estado: 'En producción' },
    { id: 2, cliente: 'Industrias Metalpro', tipo: 'Industrial', talla: 'M-XL', cantidad: 60, fecha: '2026-08-20', estado: 'Pendiente' },
    { id: 3, cliente: 'Café Central S.A.S', tipo: 'Corporativo', talla: 'S-L', cantidad: 30, fecha: '2026-08-14', estado: 'Listo' },
  ];
  guardarPedidos(semilla);
  return semilla;
}

function guardarPedidos(lista) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista));
}

function claseEtiqueta(estado) {
  const mapa = {
    'Pendiente': 'etiqueta--pendiente',
    'En producción': 'etiqueta--produccion',
    'Listo': 'etiqueta--listo',
    'Entregado': 'etiqueta--entregado',
  };
  return mapa[estado] || 'etiqueta--pendiente';
}

let pedidos = cargarPedidos();

function renderKpis() {
  const total = pedidos.length;
  const enProceso = pedidos.filter(p => p.estado === 'En producción').length;
  const listos = pedidos.filter(p => p.estado === 'Listo').length;
  const entregados = pedidos.filter(p => p.estado === 'Entregado').length;

  document.getElementById('kpi-pedidos').innerHTML = `
    <div class="kpi"><div class="kpi__valor">${total}</div><div class="kpi__label">Pedidos totales</div></div>
    <div class="kpi"><div class="kpi__valor">${enProceso}</div><div class="kpi__label">En producción</div></div>
    <div class="kpi"><div class="kpi__valor">${listos}</div><div class="kpi__label">Listos para entrega</div></div>
    <div class="kpi"><div class="kpi__valor">${entregados}</div><div class="kpi__label">Entregados</div></div>
  `;
}

function renderTabla() {
  const filtro = document.getElementById('filtro-estado').value;
  const cuerpo = document.getElementById('tabla-pedidos');
  const vacio = document.getElementById('pedidos-vacio');

  const lista = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

  if (!lista.length) {
    cuerpo.innerHTML = '';
    vacio.style.display = 'block';
    return;
  }
  vacio.style.display = 'none';

  cuerpo.innerHTML = lista.map(p => `
    <tr>
      <td>#${String(p.id).padStart(4, '0')}</td>
      <td>${p.cliente}</td>
      <td>${p.tipo}</td>
      <td>${p.talla || '—'}</td>
      <td>${p.cantidad}</td>
      <td>${formatearFecha(p.fecha)}</td>
      <td>
        <select class="icon-btn cambiar-estado" data-id="${p.id}">
          ${['Pendiente','En producción','Listo','Entregado'].map(e =>
            `<option value="${e}" ${e === p.estado ? 'selected' : ''}>${e}</option>`
          ).join('')}
        </select>
      </td>
      <td class="acciones-fila">
        <button class="icon-btn icon-btn--peligro" data-eliminar="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.cambiar-estado').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id);
      const pedido = pedidos.find(p => p.id === id);
      pedido.estado = e.target.value;
      guardarPedidos(pedidos);
      renderKpis();
    });
  });

  document.querySelectorAll('[data-eliminar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.eliminar);
      pedidos = pedidos.filter(p => p.id !== id);
      guardarPedidos(pedidos);
      renderTabla();
      renderKpis();
    });
  });
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

document.getElementById('form-pedido').addEventListener('submit', (e) => {
  e.preventDefault();

  const nuevo = {
    id: pedidos.length ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
    cliente: document.getElementById('p-cliente').value,
    tipo: document.getElementById('p-tipo').value,
    talla: document.getElementById('p-talla').value,
    cantidad: Number(document.getElementById('p-cantidad').value),
    fecha: document.getElementById('p-fecha').value,
    estado: document.getElementById('p-estado').value,
  };

  pedidos.push(nuevo);
  guardarPedidos(pedidos);
  renderTabla();
  renderKpis();
  e.target.reset();
});

document.getElementById('filtro-estado').addEventListener('change', renderTabla);

renderKpis();
renderTabla();
