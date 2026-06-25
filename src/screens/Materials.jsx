/* ════════════════════════════════════════════════════════
   Client: Materiais (downloads, manuais, mídia)
   ════════════════════════════════════════════════════════ */

const MATERIALS = [
  { id: 'm1', name: 'Manual VPOS Touch v3',         type: 'pdf',   size: '2.1 MB',  cat: 'manuais',   updated: '2026-05-12', downloads: 142 },
  { id: 'm2', name: 'Guia de instalação MDB',       type: 'pdf',   size: '1.4 MB',  cat: 'manuais',   updated: '2026-05-08', downloads: 89 },
  { id: 'm3', name: 'Contrato padrão de locação',   type: 'pdf',   size: '320 KB',  cat: 'contratos', updated: '2026-04-22', downloads: 56 },
  { id: 'm4', name: 'Política de garantia',         type: 'pdf',   size: '180 KB',  cat: 'contratos', updated: '2026-03-15', downloads: 33 },
  { id: 'm5', name: 'Catálogo institucional 2026',  type: 'pdf',   size: '8.7 MB',  cat: 'marketing', updated: '2026-05-20', downloads: 218 },
  { id: 'm6', name: 'Apresentação comercial',       type: 'pptx',  size: '12 MB',   cat: 'marketing', updated: '2026-05-18', downloads: 67 },
  { id: 'm7', name: 'Logo Nayax — pacote oficial',  type: 'zip',   size: '4.2 MB',  cat: 'marketing', updated: '2026-04-10', downloads: 124 },
  { id: 'm8', name: 'Vídeo institucional 2026',     type: 'mp4',   size: '94 MB',   cat: 'marketing', updated: '2026-04-30', downloads: 38 },
  { id: 'm9', name: 'Planilha de cálculo ROI',      type: 'xlsx',  size: '180 KB',  cat: 'ferramentas', updated: '2026-05-22', downloads: 91 },
  { id: 'm10',name: 'Spec técnica EV Charge 22 kW', type: 'pdf',   size: '780 KB',  cat: 'manuais',   updated: '2026-05-05', downloads: 28 },
];

const Materials = ({ cart, setRoute, openCart }) => {
  const { t } = useLang();
  const [cat, setCat] = useState('Todos');
  const [search, setSearch] = useState('');
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const CATS = [
    { id: 'Todos',       label: 'Todos' },
    { id: 'manuais',     label: 'Manuais técnicos' },
    { id: 'contratos',   label: 'Contratos' },
    { id: 'marketing',   label: 'Marketing' },
    { id: 'ferramentas', label: 'Ferramentas' },
  ];
  const TYPE_META = {
    pdf:  { color: '#DC3447', label: 'PDF' },
    pptx: { color: '#F08A20', label: 'PPTX' },
    xlsx: { color: '#0E9B58', label: 'XLSX' },
    zip:  { color: '#6D5BF7', label: 'ZIP' },
    mp4:  { color: '#3B82F6', label: 'MP4' },
  };
  const rows = MATERIALS.filter(m =>
    (cat === 'Todos' || m.cat === cat) &&
    (search === '' || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="app-layout">
      <ClientSidebar route="materials" setRoute={setRoute} cart={cart}/>
      <div className="app-main">
        <Topbar breadcrumb={[{ label: 'Materiais' }]} onCartClick={openCart} cartCount={cartCount}/>
        <div className="app-content">
          <PageHeader
            kicker="Recursos · NX-7842"
            title="Materiais & downloads"
            sub="Manuais técnicos, contratos, materiais de marketing e ferramentas exclusivas para sua franquia."
          />

          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="input-group" style={{ width: 320, height: 36 }}>
              <Icon name="search" size={14}/>
              <input placeholder="Buscar material…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }}/>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATS.map(c => {
                const count = c.id === 'Todos' ? MATERIALS.length : MATERIALS.filter(m => m.cat === c.id).length;
                return (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    height: 32, padding: '0 12px', borderRadius: 'var(--radius-pill)',
                    fontSize: 12.5, fontWeight: 600,
                    border: '1px solid ' + (cat === c.id ? 'var(--dark)' : 'var(--line-2)'),
                    background: cat === c.id ? 'var(--dark)' : 'var(--bg-surface)',
                    color: cat === c.id ? 'white' : 'var(--text-1)',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>{c.label} <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: cat === c.id ? 'var(--accent)' : 'var(--neutral-80)', color: cat === c.id ? 'var(--dark)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{count}</span></button>
                );
              })}
            </div>
          </div>

          {rows.length === 0 ? (
            <EmptyState icon="box" title="Nenhum material encontrado" body="Ajuste os filtros ou busque por outro termo."/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {rows.map(m => {
                const meta = TYPE_META[m.type] || { color: 'var(--text-2)', label: m.type.toUpperCase() };
                return (
                  <div key={m.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44, height: 52, borderRadius: 'var(--radius-sm)',
                        background: meta.color,
                        color: 'white',
                        display: 'grid', placeItems: 'center',
                        fontWeight: 700, fontSize: 10,
                        letterSpacing: '0.06em',
                        flexShrink: 0,
                        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)',
                      }}>{meta.label}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{m.size} · atualizado {fmtDate(m.updated)} · {m.downloads} downloads</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-dark btn-sm" style={{ flex: 1 }} onClick={() => window.toast && window.toast('Baixando ' + m.name + '…')}>
                        <Icon name="download" size={13}/> Baixar
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ width: 36, padding: 0 }} title="Visualizar"><Icon name="eye" size={13}/></button>
                      <button className="btn btn-ghost btn-sm" style={{ width: 36, padding: 0 }} title="Copiar link"><Icon name="external" size={13}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.Materials = Materials;
