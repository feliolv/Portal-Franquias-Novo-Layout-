/* ════════════════════════════════════════════════════════
   Admin: Produtos + HubSpot import
   ════════════════════════════════════════════════════════ */

const AdminProducts = () => {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todos');
  const [editing, setEditing] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyStock, setOnlyStock] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos reais do RDS
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await API.Products.list(false); // false = incluir inativos
        setProducts(data || []);
      } catch (e) {
        console.error('[AdminProducts]', e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (!e.target.closest('[data-prod-menu]')) setMenuOpen(null); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const matchCat = (p) => {
    if (cat === 'Todos') return true;
    if (cat === 'Serviços') return p.cat === 'Serviços';
    if (cat === 'Produtos') return p.cat !== 'Serviços';
    return p.cat === cat;
  };
  const rows = products.filter(p =>
    matchCat(p) &&
    (!onlyNew || p.new) &&
    (!onlyStock || (p.stock != null && p.stock > 20)) &&
    (search === '' || (p.name + ' ' + p.sku).toLowerCase().includes(search.toLowerCase()))
  );
  const activeFilters = (onlyNew ? 1 : 0) + (onlyStock ? 1 : 0);

  const exportCsv = () => {
    const header = 'SKU,Nome,Categoria,Preco,Mensal,Estoque\n';
    const body = rows.map(p => [p.sku, '"'+p.name+'"', p.cat, p.price, p.monthly, p.stock ?? ''].join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'produtos-nayax.csv'; a.click();
    URL.revokeObjectURL(url);
    window.toast && window.toast(rows.length + ' produtos exportados (CSV)');
  };

  return (
    <>
      <PageHeader
        kicker={t('admin.products.kicker')}
        title={t('admin.products.title')}
        sub={`${products.length} · ${products.filter(p=>p.new).length} ${t('common.new').toLowerCase()}`}
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Sincronizando com HubSpot…')}><Icon name="plug" size={13}/> {t('admin.products.syncHs')}</button>
            <button className="btn btn-dark btn-sm" onClick={() => setEditing('new')}><Icon name="plus" size={13}/> {t('admin.products.newProduct')}</button>
          </>
        }
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => {
          const count = c === 'Todos' ? products.length
            : c === 'Serviços' ? products.filter(p => p.cat === 'Serviços').length
            : c === 'Produtos' ? products.filter(p => p.cat !== 'Serviços').length
            : products.filter(p => p.cat === c).length;
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              height: 30, padding: '0 12px', borderRadius: 'var(--radius-pill)',
              fontSize: 12.5, fontWeight: 600,
              border: '1px solid ' + (cat === c ? 'var(--neutral-15)' : 'var(--line-2)'),
              background: cat === c ? 'var(--neutral-15)' : 'var(--bg-surface)',
              color: cat === c ? 'white' : 'var(--text-1)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {c}
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: cat === c ? 'var(--accent)' : 'var(--neutral-80)', color: cat === c ? 'var(--neutral-15)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="input-group" style={{ width: 280, height: 34, padding: '0 10px' }}>
            <Icon name="search" size={13}/>
            <input placeholder="Buscar produto, SKU…" value={search} onChange={e=>setSearch(e.target.value)} style={{ fontSize: 12.5 }}/>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setFiltersOpen(true)}><Icon name="filter" size={13}/> Filtros{activeFilters > 0 && <span style={{ marginLeft: 4, fontSize: 10, padding: '0 6px', borderRadius: 8, background: 'var(--accent)', color: 'var(--dark)', fontWeight: 700 }}>{activeFilters}</span>}</button>
            <button className="btn btn-ghost btn-sm" onClick={exportCsv}><Icon name="download" size={13}/></button>
          </div>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>SKU</th>
              <th>Preço base</th>
              <th>Mensal</th>
              <th>Estoque</th>
              <th>Visível em</th>
              <th>Status</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--line-1)', flexShrink: 0 }}>
                      <ProductVisual product={p}/>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                        {p.name}
                        {p.new && <span className="badge badge-yellow" style={{ fontSize: 9.5, padding: '2px 6px' }}>Novo</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.short.slice(0, 56)}{p.short.length>56?'…':''}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-neutral">{p.cat}</span></td>
                <td className="cell-mono">{p.sku}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.price > 0 ? fmtBRL(p.price) : '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{p.monthly > 0 ? fmtBRL(p.monthly) : '—'}</td>
                <td>{p.stock !== null && p.stock !== undefined ? (
                  <span style={{ color: p.stock > 20 ? 'var(--green-30)' : 'var(--orange-30)', fontWeight: 600 }}>{p.stock}</span>
                ) : <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['Vending Machine','Micromercado','Lavanderia'].slice(0, p.id.charCodeAt(0)%3+1).map(s => (
                      <span key={s} className="badge badge-purple" style={{ fontSize: 10 }}>{s}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <label style={{ position: 'relative', display: 'inline-block', width: 36, height: 20 }}>
                    <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }}/>
                    <span style={{ position: 'absolute', inset: 0, background: 'var(--green-50)', borderRadius: 20, cursor: 'pointer' }}>
                      <span style={{ position: 'absolute', height: 14, width: 14, right: 3, bottom: 3, background: 'white', borderRadius: '50%' }}/>
                    </span>
                  </label>
                </td>
                <td><button data-prod-menu="t" className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0, position: 'relative' }} onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}>
                  <Icon name="more" size={14}/>
                  {menuOpen === p.id && (
                    <div data-prod-menu="m" onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, minWidth: 170, background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 4, zIndex: 50, textAlign: 'left', animation: 'fadeUp .15s ease both' }}>
                      {[
                        { label: 'Editar produto', icon: 'edit', fn: () => setEditing(p) },
                        { label: 'Duplicar', icon: 'copy', fn: () => window.toast && window.toast('Produto duplicado · rascunho') },
                        { label: 'Ver no catálogo', icon: 'eye', fn: () => window.toast && window.toast('Abrindo ' + p.name + ' no catálogo') },
                        { sep: true },
                        { label: 'Remover', icon: 'trash', danger: true, fn: async () => { const ok = await window.confirmAction({ title: 'Remover ' + p.name + '?', body: 'O produto sai do catálogo de todas as franquias.', danger: true }); if (ok) window.toast && window.toast('Produto removido'); } },
                      ].map((it, k) => it.sep ? <div key={k} style={{ height: 1, background: 'var(--line-1)', margin: '4px 6px' }}/> : (
                        <button key={k} onClick={() => { setMenuOpen(null); it.fn(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-xs)', fontSize: 13, fontWeight: 500, color: it.danger ? 'var(--red-30)' : 'var(--text-1)', background: 'transparent', textAlign: 'left' }}
                          onMouseOver={e => e.currentTarget.style.background = it.danger ? 'var(--red-soft)' : 'var(--bg-surface-2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <Icon name={it.icon} size={13}/> {it.label}
                        </button>
                      ))}
                    </div>
                  )}
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ProductEditor product={editing === 'new' ? null : editing} onClose={() => setEditing(null)}/>}
      {filtersOpen && (
        <>
          <div className="scrim" onClick={() => setFiltersOpen(false)}/>
          <aside className="drawer" style={{ width: 'min(380px, 100vw)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Filtros</div>
              <button onClick={() => setFiltersOpen(false)} style={{ width: 30, height: 30, color: 'var(--text-3)' }}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <input type="checkbox" checked={onlyNew} onChange={() => setOnlyNew(v => !v)} style={{ accentColor: 'var(--accent)' }}/>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>Apenas novidades</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Marcados como "Novo"</div></div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <input type="checkbox" checked={onlyStock} onChange={() => setOnlyStock(v => !v)} style={{ accentColor: 'var(--accent)' }}/>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>Em estoque</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>Mais de 20 unidades</div></div>
              </label>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line-1)', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setOnlyNew(false); setOnlyStock(false); }}>Limpar</button>
              <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => setFiltersOpen(false)}>Aplicar ({rows.length})</button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

/* ─────── Product editor modal ─────── */
const ProductEditor = ({ product, onClose }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(product || { name: '', sku: '', cat: 'Terminais', price: 0, monthly: 0, stock: 0, short: '', new: true });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.sku;
  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="t-overline" style={{ color: 'var(--accent)' }}>{isEdit ? 'Editar produto' : 'Novo produto'}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{form.name || 'Produto sem nome'}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div><label className="field-label">Nome *</label><input className="input" value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Ex: VPOS Touch v3"/></div>
            <div><label className="field-label">SKU *</label><input className="input" value={form.sku} onChange={e => upd('sku', e.target.value.toUpperCase())} style={{ fontFamily: 'var(--font-mono)' }}/></div>
          </div>
          <div><label className="field-label">Descrição curta</label><input className="input" value={form.short} onChange={e => upd('short', e.target.value)}/></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label className="field-label">Categoria</label>
              <select className="select" value={form.cat} onChange={e => upd('cat', e.target.value)}>
                {['Terminais','EV','Kits','Kiosks','Mobilidade','Acessórios','Serviços'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="field-label">Estoque</label><input className="input" type="number" value={form.stock} onChange={e => upd('stock', +e.target.value)} style={{ fontFamily: 'var(--font-mono)' }}/></div>
            <div><label className="field-label">Preço base (R$)</label><input className="input" type="number" value={form.price} onChange={e => upd('price', +e.target.value)} style={{ fontFamily: 'var(--font-mono)' }}/></div>
            <div><label className="field-label">Mensal (R$)</label><input className="input" type="number" value={form.monthly} onChange={e => upd('monthly', +e.target.value)} style={{ fontFamily: 'var(--font-mono)' }}/></div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.new} onChange={e => upd('new', e.target.checked)} style={{ accentColor: 'var(--accent)' }}/> Marcar como novidade
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '14px 24px', borderTop: '1px solid var(--line-1)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" disabled={!valid} onClick={() => { window.toast && window.toast(isEdit ? 'Produto atualizado' : 'Produto criado'); onClose(); }}>
            <Icon name="check" size={14} stroke={3}/> {isEdit ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   Admin: Importação HubSpot
   ════════════════════════════════════════════════════════ */
const AdminHubSpot = () => {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(HS_PRODUCTS);
  const [selected, setSelected] = useState([]);

  const rows = items.filter(p =>
    (filter === 'all' || (filter === 'new' && !p.imported) || (filter === 'imported' && p.imported) || filter === p.type) &&
    (search === '' || (p.name + ' ' + p.sku).toLowerCase().includes(search.toLowerCase()))
  );

  const classify = (sku, kind) => {
    setItems(prev => prev.map(p => p.sku === sku ? { ...p, classify: kind } : p));
  };

  const queue = items.filter(p => p.classify && !p.imported);
  const summaryP = queue.filter(q => q.classify === 'produto').length;
  const summaryB = queue.filter(q => q.classify === 'bundle').length;

  return (
    <>
      <PageHeader
        kicker={t('admin.hs.kicker')}
        title={t('admin.hs.title')}
        sub={t('admin.hs.sub')}
        actions={
          <>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{t('admin.hs.lastSync')}: hoje, 09:42</span>
            <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Sincronizando produtos com HubSpot…')}><Icon name="refresh" size={13}/> {t('admin.hs.updateFromHs')}</button>
          </>
        }
      />

      {/* Connection status banner */}
      <div className="card" style={{ padding: 16, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14, background: '#FFF7ED', borderColor: '#FED7AA' }}>
        <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, #FF7A59, #E5573C)', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name="hubspot" size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Conectado · API Nayax BR</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>OAuth válido · próxima sync automática em 6h · 3 novos produtos detectados</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Configurações HubSpot — abre em breve')}>Configurar</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, alignItems: 'flex-start' }}>
        {/* Table */}
        <div className="table-wrap">
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="input-group" style={{ width: 240, height: 34, padding: '0 10px' }}>
                <Icon name="search" size={13}/>
                <input placeholder="Buscar nome ou SKU…" value={search} onChange={e=>setSearch(e.target.value)} style={{ fontSize: 12.5 }}/>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '10px 18px 0', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'new', label: 'Novos' },
              { id: 'imported', label: 'Importados' },
              { id: 'Produto', label: 'Produto' },
              { id: 'service', label: 'Serviço' },
              { id: 'Mensalidade', label: 'Mensalidade' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                height: 26, padding: '0 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 11.5, fontWeight: 600,
                border: '1px solid ' + (filter === f.id ? 'var(--neutral-15)' : 'var(--line-2)'),
                background: filter === f.id ? 'var(--neutral-15)' : 'transparent',
                color: filter === f.id ? 'white' : 'var(--text-2)',
              }}>{f.label}</button>
            ))}
          </div>
          <table className="t">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" style={{ accentColor: 'var(--accent)' }}/></th>
                <th>SKU</th>
                <th>Nome</th>
                <th>Tipo HS</th>
                <th>Preço HS</th>
                <th>Status</th>
                <th>Importar como</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(p => (
                <tr key={p.sku}>
                  <td><input type="checkbox" style={{ accentColor: 'var(--accent)' }}/></td>
                  <td className="cell-mono" style={{ fontWeight: 600 }}>{p.sku}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><span className="badge badge-neutral">{p.type}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(p.price)}</td>
                  <td>{p.imported
                      ? <span className="badge badge-green"><span className="dot"/> Importado</span>
                      : <span className="badge badge-orange"><span className="dot"/> Novo</span>}</td>
                  <td>
                    {p.imported ? <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span> : (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => classify(p.sku, 'produto')} style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 11.5, fontWeight: 600,
                          border: '1px solid ' + (p.classify === 'produto' ? 'var(--blue-50)' : 'var(--line-2)'),
                          background: p.classify === 'produto' ? 'var(--blue-soft)' : 'transparent',
                          color: p.classify === 'produto' ? 'var(--blue-30)' : 'var(--text-2)',
                        }}>📦 Produto</button>
                        <button onClick={() => classify(p.sku, 'bundle')} style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 11.5, fontWeight: 600,
                          border: '1px solid ' + (p.classify === 'bundle' ? 'var(--purple-50)' : 'var(--line-2)'),
                          background: p.classify === 'bundle' ? 'var(--purple-90)' : 'transparent',
                          color: p.classify === 'bundle' ? 'var(--purple-10)' : 'var(--text-2)',
                        }}>🎁 Bundle</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Import queue rail */}
        <div className="card" style={{ position: 'sticky', top: 80, padding: 18 }}>
          <div className="t-overline">Fila de importação</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4, marginBottom: 14 }}>Classifique e envie para o portal</div>

          {queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 12px', color: 'var(--text-3)' }}>
              <Icon name="box" size={28} style={{ opacity: 0.4 }}/>
              <div style={{ fontSize: 12, marginTop: 8 }}>Nenhum produto classificado.<br/>Marque um item ao lado.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, maxHeight: 240, overflowY: 'auto' }}>
              {queue.map(q => (
                <div key={q.sku} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 10px', background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: q.classify === 'bundle' ? 'var(--purple-90)' : 'var(--blue-soft)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 12 }}>
                    {q.classify === 'bundle' ? '🎁' : '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.name}</div>
                    <div className="cell-mono" style={{ fontSize: 10 }}>{q.sku}</div>
                  </div>
                  <button onClick={() => classify(q.sku, null)} style={{ width: 20, height: 20, color: 'var(--text-3)' }}><Icon name="x" size={11}/></button>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: 'var(--bg-inverse)', borderRadius: 'var(--radius-sm)', padding: 12, color: 'var(--text-on-inverse)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-on-inverse-2)' }}>Produtos</span>
              <span style={{ color: 'var(--blue-50)', fontWeight: 700 }}>{summaryP}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-on-inverse-2)' }}>Bundles</span>
              <span style={{ color: 'var(--purple-50)', fontWeight: 700 }}>{summaryB}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingTop: 8, marginTop: 6, borderTop: '1px solid var(--line-on-inverse-2)' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{queue.length}</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={queue.length === 0}
                  onClick={() => { setItems(prev => prev.map(p => p.classify ? { ...p, imported: true } : p)); window.toast && window.toast(queue.length + ' produtos importados'); }}>
            <Icon name="download" size={13}/> Importar para o Portal
          </button>
        </div>
      </div>
    </>
  );
};

window.AdminProducts = AdminProducts;
window.ProductEditor = ProductEditor;
window.AdminHubSpot = AdminHubSpot;
