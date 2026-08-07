/* inventario.js — control de materias primas, entradas/salidas
   y alertas de escasez. Datos en localStorage 'tyc_inventario_data'. */

const CLAVE_INVENTARIO = 'tyc_inventario_data';

function cargarInventario() {
  const datos = localStorage.getItem(CLAVE_INVENTARIO);
  if (datos) return JSON.parse(datos);

  const semilla = [
    { id: 1, nombre: 'Tela drill azul', cantidad: 85, unidad: 'metros', minimo: 40 },
    { id: 2, nombre: 'Tela piqué blanca', cantidad: 22, unidad: 'metros', minimo: 30 },
    { id: 3, nombre: 'Hilo poliéster', cantidad: 60, unidad: 'rollos', minimo: 15 },
    { id: 4, nombre: 'Botones plásticos', cantidad: 400, unidad: 'unidades', minimo: 100 },
  ];
  guardarInventario(semilla);
  return semilla;
}

function guardarInventario(lista) {
  localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(lista));
}

let inventario = cargarInventario();

function renderKpis() {
  const total = inventario.length;
  const bajoMinimo = inventario.filter(m => Number(m.cantidad) <= Number(m.minimo));

  document.getElementById('kpi-inventario').innerHTML = `
    <div class="kpi"><div class="kpi__valor">${total}</div><div class="kpi__label">Materiales registrados</div></div>
    <div class="kpi ${bajoMinimo.length ? 'kpi--alerta' : ''}"><div class="kpi__valor">${bajoMinimo.length}</div><div class="kpi__label">Alertas de escasez</div></div>
  `;
}

function renderSelectMateriales() {
  const select = document.getElementById('m-material');
  select.innerHTML = inventario.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
}

function renderTabla() {
  const cuerpo = document.getElementById('tabla-inventario');
  const vacio = document.getElementById('inventario-vacio');

  if (!inventario.length) {
    cuerpo.innerHTML = '';
    vacio.style.display = 'block';
    return;
  }
  vacio.style.display = 'none';

  cuerpo.innerHTML = inventario.map(m => {
    const bajo = Number(m.cantidad) <= Number(m.minimo);
    return `
      <tr>
        <td>${m.nombre}</td>
        <td>${m.cantidad}</td>
        <td>${m.unidad}</td>
        <td>${m.minimo}</td>
        <td><span class="etiqueta ${bajo ? 'etiqueta--bajo' : 'etiqueta--listo'}">${bajo ? 'Stock bajo' : 'Disponible'}</span></td>
        <td class="acciones-fila"><button class="icon-btn icon-btn--peligro" data-eliminar="${m.id}">Eliminar</button></td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('[data-eliminar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.eliminar);
      inventario = inventario.filter(m => m.id !== id);
      guardarInventario(inventario);
      renderTabla();
      renderKpis();
      renderSelectMateriales();
    });
  });
}

document.getElementById('form-material').addEventListener('submit', (e) => {
  e.preventDefault();

  const nuevo = {
    id: inventario.length ? Math.max(...inventario.map(m => m.id)) + 1 : 1,
    nombre: document.getElementById('i-nombre').value,
    cantidad: Number(document.getElementById('i-cantidad').value),
    unidad: document.getElementById('i-unidad').value,
    minimo: Number(document.getElementById('i-minimo').value),
  };

  inventario.push(nuevo);
  guardarInventario(inventario);
  renderTabla();
  renderKpis();
  renderSelectMateriales();
  e.target.reset();
});

document.getElementById('form-movimiento').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = Number(document.getElementById('m-material').value);
  const tipo = document.getElementById('m-tipo').value;
  const cantidad = Number(document.getElementById('m-cantidad').value);
  const material = inventario.find(m => m.id === id);

  if (!material) return;

  if (tipo === 'entrada') {
    material.cantidad += cantidad;
  } else {
    material.cantidad = Math.max(0, material.cantidad - cantidad);
  }

  guardarInventario(inventario);
  renderTabla();
  renderKpis();
  e.target.reset();
});

renderKpis();
renderSelectMateriales();
renderTabla();
