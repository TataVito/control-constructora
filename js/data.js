const SUPABASE_URL = 'https://czqgqfdxacdhxryfgryp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_73S0bizsPc14VHxp0oAH_w_1FpJ9QvC';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ESTADOS = {
  abierto:    { label: 'Abierto',    color: 'bg-red-100 text-red-700' },
  en_proceso: { label: 'En proceso', color: 'bg-yellow-100 text-yellow-700' },
  cerrado:    { label: 'Cerrado',    color: 'bg-green-100 text-green-700' }
};

const DB = {
  _map(d) {
    return {
      ...d,
      fechaActualizacion: d.fecha_actualizacion,
      comentarios: (d.comentarios || [])
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .map(c => ({ fecha: c.fecha, texto: c.texto, estadoNuevo: c.estado_nuevo, foto: c.foto }))
    };
  },

  async getDefectos() {
    const { data, error } = await sb
      .from('defectos')
      .select('*, comentarios(*)')
      .order('id', { ascending: true });
    if (error) throw error;
    return (data || []).map(d => this._map(d));
  },

  async getDefecto(id) {
    const { data, error } = await sb
      .from('defectos')
      .select('*, comentarios(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return this._map(data);
  },

  async saveDefecto(d) {
    const row = {
      descripcion: d.descripcion,
      gremio: d.gremio,
      zona: d.zona,
      obra: d.obra || null,
      estado: d.estado,
      notas: d.notas || null,
      foto: d.foto || null,
      fecha: d.fecha || new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };
    if (d.id) {
      const { error } = await sb.from('defectos').update(row).eq('id', d.id);
      if (error) throw error;
    } else {
      const { data, error } = await sb.from('defectos').insert(row).select('id').single();
      if (error) throw error;
      return data.id;
    }
  },

  async deleteDefecto(id) {
    const { error } = await sb.from('defectos').delete().eq('id', id);
    if (error) throw error;
  },

  async getGremios() {
    const { data, error } = await sb.from('gremios').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addGremio(nombre, foto) {
    const { error } = await sb.from('gremios').insert({ nombre, foto: foto || null });
    if (error) throw error;
  },

  async updateGremio(id, nombre, foto) {
    const { error } = await sb.from('gremios').update({ nombre, foto: foto !== undefined ? foto : null }).eq('id', id);
    if (error) throw error;
  },

  async deleteGremio(id) {
    const { error } = await sb.from('gremios').delete().eq('id', id);
    if (error) throw error;
  },

  async addComentario(defectoId, texto, nuevoEstado, foto) {
    const { error: e1 } = await sb.from('comentarios').insert({
      defecto_id: defectoId,
      fecha: new Date().toISOString(),
      texto: texto || null,
      estado_nuevo: nuevoEstado,
      foto: foto || null
    });
    if (e1) throw e1;
    const { error: e2 } = await sb.from('defectos').update({
      estado: nuevoEstado,
      fecha_actualizacion: new Date().toISOString()
    }).eq('id', defectoId);
    if (e2) throw e2;
  }
};
