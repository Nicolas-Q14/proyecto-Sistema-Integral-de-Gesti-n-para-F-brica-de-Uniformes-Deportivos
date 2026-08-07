/* produccion.js — planificación y seguimiento de tareas de producción.
   Guarda los datos en localStorage bajo 'tyc_produccion_data'. */

const CLAVE_PRODUCCION = 'tyc_produccion_data';

function cargarTareas() {
  const datos = localStorage.getItem(CLAVE_PRODUCCION);
  if (datos) return JSON.parse(datos);

  const semilla = [
    { id: 1, pedido: '#0001 Colegio San Rafael', tarea: 'Corte de tela', tiempo: 4, avance: 100, estado: 'Finalizado' },
    { id: 2, pedido: '#0001 Colegio San Rafael', tarea: 'Confección', tiempo: 8, avance: 55, estado: 'En proceso' },
    { id: 3, pedido: '#0002 Industrias Metalpro', tarea: 'Corte de tela', tiempo: 3, avance: 0, estado: 'Por iniciar' },
  ];
  guardarTareas(semilla);
  return semilla;
}

function guardarTareas(lista) {
  localStorage.setItem(CLAVE_PRODUCCION, JSON.stringify(lista));
}

let tareas = cargarTareas();

function renderKpis() {
  const total = tareas.length;
  const enProceso = tareas.filter(t => t.estado === 'En proceso').length;
  const finalizadas = tareas.filter(t => t.estado === 'Finalizado').length;
  const promedioAvance = total ? Math.round(tareas.reduce((s, t) => s + Number(t.avance), 0) / total) : 0;

  document.getElementById('kpi-produccion').innerHTML = `
    <div class="kpi"><div class="kpi__valor">${total}</div><div class="kpi__label">Tareas activas</div></div>
    <div class="kpi"><div class="kpi__valor">${enProceso}</div><div class="kpi__label">En proceso</div></div>
    <div class="kpi"><div class="kpi__valor">${finalizadas}</div><div class="kpi__label">Finalizadas</div></div>
    <div class="kpi"><div class="kpi__valor">${promedioAvance}%</div><div class="kpi__label">Avance promedio</div></div>
  `;
}

function tarjetaHTML(t) {
  return `
    <div class="kanban__card">
      <strong>${t.tarea}</strong>
      <small>${t.pedido}</small><br>
      <small>Estimado: ${t.tiempo} día(s)</small>
      <div class="barra-progreso"><div class="barra-progreso__fill" style="width:${t.avance}%"></div></div>
      <small>${t.avance}% completado</small>
      <div class="acciones-fila">
        <button class="icon-btn" data-avanzar="${t.id}">+10%</button>
        <button class="icon-btn icon-btn--peligro" data-eliminar="${t.id}">Eliminar</button>
      </div>
    </div>
  `;
}

function renderKanban() {
  const columnas = { 'Por iniciar': [], 'En proceso': [], 'Finalizado': [] };
  tareas.forEach(t => { if (columnas[t.estado]) columnas[t.estado].push(t); });

  const kanban = document.getElementById('kanban-produccion');
  kanban.innerHTML = Object.keys(columnas).map(estado => `
    <div class="kanban__col">
      <h3>${estado} (${columnas[estado].length})</h3>
      ${columnas[estado].map(tarjetaHTML).join('') || '<p class="vacio">Sin tareas</p>'}
    </div>
  `).join('');

  document.querySelectorAll('[data-avanzar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.avanzar);
      const tarea = tareas.find(t => t.id === id);
      tarea.avance = Math.min(100, Number(tarea.avance) + 10);
      if (tarea.avance >= 100) tarea.estado = 'Finalizado';
      else if (tarea.avance > 0) tarea.estado = 'En proceso';
      guardarTareas(tareas);
      renderKanban();
      renderKpis();
    });
  });

  document.querySelectorAll('[data-eliminar]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.eliminar);
      tareas = tareas.filter(t => t.id !== id);
      guardarTareas(tareas);
      renderKanban();
      renderKpis();
    });
  });
}

document.getElementById('form-tarea').addEventListener('submit', (e) => {
  e.preventDefault();

  const nueva = {
    id: tareas.length ? Math.max(...tareas.map(t => t.id)) + 1 : 1,
    pedido: document.getElementById('t-pedido').value,
    tarea: document.getElementById('t-tarea').value,
    tiempo: Number(document.getElementById('t-tiempo').value),
    avance: Number(document.getElementById('t-avance').value) || 0,
    estado: document.getElementById('t-estado').value,
  };

  tareas.push(nueva);
  guardarTareas(tareas);
  renderKanban();
  renderKpis();
  e.target.reset();
});

renderKpis();
renderKanban();
