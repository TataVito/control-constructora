// Utilidades compartidas
function badge(estado) {
  const e = ESTADOS[estado] || ESTADOS.abierto;
  return `<span class="text-xs font-semibold px-2 py-0.5 rounded-full ${e.color}">${e.label}</span>`;
}

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function nav(href) {
  window.location.href = href;
}

// Leer imagen como base64
function readImage(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// Render nav activo
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('text-blue-600', el.dataset.nav === page);
    el.classList.toggle('text-gray-400', el.dataset.nav !== page);
  });
}
document.addEventListener('DOMContentLoaded', setActiveNav);
