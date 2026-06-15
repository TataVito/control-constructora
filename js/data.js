const DB = {
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),

  getDefectos: () => DB.get('defectos'),
  saveDefecto: (d) => {
    const list = DB.getDefectos();
    const idx = list.findIndex(x => x.id === d.id);
    if (idx >= 0) list[idx] = d; else list.push(d);
    DB.set('defectos', list);
  },
  deleteDefecto: (id) => DB.set('defectos', DB.getDefectos().filter(d => d.id !== id)),

  getGremios: () => {
    const stored = localStorage.getItem('gremios');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        const migrated = parsed.map(n => ({ nombre: n, foto: null }));
        localStorage.setItem('gremios', JSON.stringify(migrated));
        return migrated;
      }
      return parsed;
    }
    const defaults = ['Albañilería', 'Fontanería', 'Electricidad', 'Carpintería', 'Pintura', 'Yeso / Escayola', 'Solados', 'Fachada', 'Otros']
      .map(n => ({ nombre: n, foto: null }));
    localStorage.setItem('gremios', JSON.stringify(defaults));
    return defaults;
  },
  saveGremios: (lista) => localStorage.setItem('gremios', JSON.stringify(lista)),

  addComentario: (id, texto, nuevoEstado, foto) => {
    const list = DB.getDefectos();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    if (!list[idx].comentarios) list[idx].comentarios = [];
    list[idx].comentarios.push({ fecha: new Date().toISOString(), texto, estadoNuevo: nuevoEstado, foto: foto || null });
    list[idx].estado = nuevoEstado;
    list[idx].fechaActualizacion = new Date().toISOString();
    DB.set('defectos', list);
  },

  // Devuelve lista de nombres de obra únicos para autocompletar
  getObrasNombres: () => {
    const nombres = DB.getDefectos().map(d => d.obra).filter(Boolean);
    return [...new Set(nombres)].sort();
  },

  nextId: (key) => {
    const n = parseInt(localStorage.getItem(key + '_seq') || '0') + 1;
    localStorage.setItem(key + '_seq', n);
    return n;
  }
};

const GREMIOS = DB.getGremios();

const ESTADOS = {
  abierto:    { label: 'Abierto',    color: 'bg-red-100 text-red-700' },
  en_proceso: { label: 'En proceso', color: 'bg-yellow-100 text-yellow-700' },
  cerrado:    { label: 'Cerrado',    color: 'bg-green-100 text-green-700' }
};
