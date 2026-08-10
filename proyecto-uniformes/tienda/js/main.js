/* main.js — comportamiento general de la tienda virtual
   Dividido por responsabilidad para que sea fácil de tocar
   una parte sin afectar las demás. */

document.addEventListener('DOMContentLoaded', () => {
  inicializarFiltrosProductos();
  inicializarFormularioContacto();
  inicializarRevelado();
});

/* ---------- Filtros de catálogo (solo en productos.html) ---------- */
function inicializarFiltrosProductos() {
  const filtros = document.querySelectorAll('.filtro');
  const tarjetas = document.querySelectorAll('.tarjeta-producto');
  if (!filtros.length) return;

  function aplicarFiltro(categoria) {
    filtros.forEach(f => f.classList.toggle('activo', f.dataset.categoria === categoria));
    tarjetas.forEach(tarjeta => {
      const coincide = categoria === 'todos' || tarjeta.dataset.categoria === categoria;
      tarjeta.style.display = coincide ? '' : 'none';
    });
  }

  filtros.forEach(filtro => {
    filtro.addEventListener('click', () => aplicarFiltro(filtro.dataset.categoria));
  });

  // si se llegó desde el home con ?cat=futbol, por ejemplo, se aplica de una vez
  const params = new URLSearchParams(window.location.search);
  const catInicial = params.get('cat');
  if (catInicial && document.querySelector(`.filtro[data-categoria="${catInicial}"]`)) {
    aplicarFiltro(catInicial);
  }
}

/* ---------- Formulario de contacto (simulado, sin backend aún) ---------- */
function inicializarFormularioContacto() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('contacto-mensaje-estado');
    mensaje.textContent = '¡Gracias! Tu mensaje fue registrado. Te contactaremos pronto.';
    mensaje.style.display = 'block';
    form.reset();
  });
}

/* ---------- Revelado suave al hacer scroll ---------- */
function inicializarRevelado() {
  const elementos = document.querySelectorAll('[data-revelar]');
  if (!elementos.length) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = '1';
        entrada.target.style.transform = 'translateY(0)';
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observador.observe(el);
  });
}
