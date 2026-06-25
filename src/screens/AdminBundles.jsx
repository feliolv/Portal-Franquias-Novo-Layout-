/* ════════════════════════════════════════════════════════
   Admin: Bundles — combos de produtos
   ════════════════════════════════════════════════════════ */

const BUNDLES = [
  { id: 'b1', sku: 'BND-VEND-START', name: 'Starter Vending', main: 'VPOS-NYX-IO', mainName: 'VPOS IoT Onyx', items: 3, price: 1890, savings: 320, segments: ['Vending Machine'], status: 'active', uses: 86 },
  { id: 'b2', sku: 'BND-LAV-PRO',    name: 'Lavanderia Pro', main: 'LAV-MDB-01', mainName: 'Kit Lavanderia MDB', items: 4, price: 2890, savings: 410, segments: ['Lavanderia'], status: 'active', uses: 42 },
  { id: 'b3', sku: 'BND-EV-22',      name: 'EV Charge Essencial', main: 'EV-CHARG-22', mainName: 'NayaxCharge 22 kW', items: 5, price: 21490, savings: 1980, segments: ['EV'], status: 'active', uses: 18 },
  { id: 'b4', sku: 'BND-MICRO-FULL', name: 'Micromercado Completo', main: 'NYX-MICRO-KIT', mainName: 'Kit Micromercado Pro', items: 6, price: 6890, savings: 720, segments: ['Micromercado'], status: 'active', uses: 31 },
  { id: 'b5', sku: 'BND-FOOD-TRUCK', name: 'Food Truck Box', main: 'NYX-FOOD-POS', mainName: 'POS Food Service', items: 3, price: 2790, savings: 290, segments: ['Food Service'], status: 'draft', uses: 0 },
  { id: 'b6', sku: 'BND-ARCADE-PK',  name: 'Arcade Park Pack', main: 'ARCADE-PAY-NX', mainName: 'Arcade Payment Module', items: 4, price: 9290, savings: 540, segments: ['Diversão Eletrônica'], status: 'active', uses: 7 },
  { id: 'b7', sku: 'BND-VEND-PLUS',  name: 'Vending Plus + Telemetria', main: 'VPOS-NYX-V3', mainName: 'VPOS Touch v3', items: 4, price: 2390, savings: 380, segments: ['Vending Machine'], status: 'paused', uses: 22 },
];

const AdminBundles = () => {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | bundle obj

  const counts = {
    all: BUNDLES.length,
    active: BUNDLES.filter(b => b.status === 'active').length,
    draft: BUNDLES.filter(b => b.status === 'draft').length,
    paused: BUNDLES.filter(b => b.status === 'paused').length,
  };

  const rows = BUNDLES.filter(b =>
    (filter === 'all' || b.status === filter) &&
    (search === '' || (b.name + ' ' + b.sku + ' ' + b.mainName).toLowerCase().includes(search.toLowerCase()))
  );

  const totalUses = BUNDLES.reduce((a, b) => a + b.uses, 0);
  const totalSavings = BUNDLES.filter(b => b.status === 'active').reduce((a, b) => a + b.savings * b.uses, 0);

  return (
    <>
      <PageHeader
        kicker={t('admin.bundles.kicker')}
        title={t('admin.bundles.title')}
        sub={`${BUNDLES.length} · ${counts.active} · ${totalUses}`}
        actions={
          <>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={13}/> {t('common.export')}</button>
            <button className="btn btn-dark btn-sm" onClick={() => setEditing('new')}><Icon name="plus" size={13}/> {t('admin.bundles.newBundle')}</button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="kpi-strip" style={{ marginBottom: 20 }}>
        <div className="kpi">
          <div className="label">Bundles ativos</div>
          <div className="value">{counts.active}</div>
          <div className="delta delta-up"><Icon name="trending-up" size={12}/> +2 vs. mês anterior</div>
        </div>
        <div className="kpi">
          <div className="label">Vendas no mês</div>
          <div className="value">{totalUses}</div>
          <div className="delta delta-up"><Icon name="trending-up" size={12}/> +18%</div>
        </div>
        <div className="kpi">
          <div className="label">Economia gerada</div>
          <div className="value t-mono" style={{ color: 'var(--green-30)' }}>{fmtBRLcurt(totalSavings)}</div>
          <div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="tag" size={12}/> para franquias</div>
        </div>
        <div className="kpi">
          <div className="label">Bundle mais vendido</div>
          <div className="value" style={{ fontSize: 18, lineHeight: 1.2 }}>Starter Vending</div>
          <div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="star" size={12}/> 86 vendas</div>
        </div>
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { id: 'all',    label: 'Todos' },
          { id: 'active', label: 'Ativos' },
          { id: 'draft',  label: 'Rascunhos' },
          { id: 'paused', label: 'Pausados' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            height: 30, padding: '0 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 12.5, fontWeight: 600,
            border: '1px solid ' + (filter === f.id ? 'var(--neutral-15)' : 'var(--line-2)'),
            background: filter === f.id ? 'var(--neutral-15)' : 'var(--bg-surface)',
            color: filter === f.id ? 'white' : 'var(--text-1)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {f.label}
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: filter === f.id ? 'var(--accent)' : 'var(--neutral-80)', color: filter === f.id ? 'var(--neutral-15)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {/* Grid of bundles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {rows.map(b => (
          <div key={b.id} className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--dark)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                  <Icon name="gift" size={17}/>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{b.sku}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.005em' }}>{b.name}</div>
                </div>
              </div>
              {b.status === 'active' && <span className="badge badge-green"><span className="dot"/> Ativo</span>}
              {b.status === 'draft' && <span className="badge badge-orange"><span className="dot"/> Rascunho</span>}
              {b.status === 'paused' && <span className="badge badge-neutral"><span className="dot"/> Pausado</span>}
            </div>

            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
              <div className="t-overline" style={{ fontSize: 10, marginBottom: 4 }}>Produto principal</div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{b.mainName}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>+ {b.items - 1} item{b.items - 1 !== 1 ? 's' : ''} adicional{b.items - 1 !== 1 ? 'is' : ''}</div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {b.segments.map(s => <span key={s} className="badge badge-purple" style={{ fontSize: 10 }}>{s}</span>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line-1)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px' }}>
                <div className="t-overline" style={{ fontSize: 9 }}>Preço</div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{fmtBRLcurt(b.price)}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px' }}>
                <div className="t-overline" style={{ fontSize: 9 }}>Economia</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-30)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>−{fmtBRLcurt(b.savings)}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '10px 12px' }}>
                <div className="t-overline" style={{ fontSize: 9 }}>Vendas</div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{b.uses}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setEditing(b)}><Icon name="edit" size={12}/> Editar</button>
              <button className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }} title="Duplicar" onClick={() => setEditing({ ...b, name: b.name + ' (cópia)', sku: b.sku + '-COPY' })}><Icon name="copy" size={13}/></button>
              <button onClick={() => window.toast && window.toast('Menu de bundle — em breve')} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }} title="Mais"><Icon name="more" size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="card card-pad-lg" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--neutral-80)', display: 'grid', placeItems: 'center', margin: '0 auto 14px', color: 'var(--text-3)' }}>
            <Icon name="gift" size={24}/>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Nenhum bundle nesse filtro</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Ajuste o filtro acima ou crie um novo combo.</div>
        </div>
      )}
      {editing && <BundleModal existing={editing === 'new' ? null : editing} onClose={() => setEditing(null)}/>}
    </>
  );
};

/* ════════════════════════════════════════════════════════
   Bundle Modal — criar/editar combo
   ════════════════════════════════════════════════════════ */
const BundleModal = ({ existing, onClose }) => {
  const isEdit = !!existing && existing.id;
  const [name, setName] = useState(existing?.name || '');
  const [sku, setSku] = useState(existing?.sku || ('BND-' + Math.random().toString(36).slice(2, 7).toUpperCase()));
  const [mainSkus, setMainSkus] = useState(existing?.main ? [existing.main] : [PRODUCTS[0].sku]);
  const [extras, setExtras] = useState(() => {
    if (existing && existing.id) {
      return PRODUCTS.filter(p => p.sku !== existing.main).slice(0, (existing.items || 2) - 1).map(p => ({ sku: p.sku, qty: 1 }));
    }
    return [];
  });
  const [price, setPrice] = useState(existing?.price || 1890);
  const [segments, setSegments] = useState(existing?.segments || ['Vending Machine']);
  const [status, setStatus] = useState(existing?.status || 'active');
  // Per-franchise custom pricing
  const [clientPrices, setClientPrices] = useState(() => {
    const obj = {};
    FRANCHISES.forEach((f, i) => {
      // Mock: some franchises have negotiated lower prices
      obj[f.code] = existing?.price ? Math.round(existing.price * (1 - (i * 0.03))) : 1890;
    });
    return obj;
  });
  const [clientOverride, setClientOverride] = useState(() => {
    const obj = {};
    FRANCHISES.forEach((f, i) => { obj[f.code] = i < 3; });
    return obj;
  });

  const SEGMENTS = ['Vending Machine','Micromercado','Lavanderia','Diversão Eletrônica','Food Service','EV'];

  const mainP = PRODUCTS.find(p => p.sku === mainSkus[0]);
  const totalBase = (mainP?.price || 0) + extras.reduce((a, e) => {
    const p = PRODUCTS.find(pp => pp.sku === e.sku);
    return a + (p?.price || 0) * e.qty;
  }, 0);
  const savings = Math.max(0, totalBase - price);
  const savingsPct = totalBase > 0 ? (savings / totalBase * 100) : 0;

  const addExtra = () => {
    const used = new Set([...mainSkus, ...extras.map(e => e.sku)]);
    const next = PRODUCTS.find(p => !used.has(p.sku) && !p.service);
    if (next) setExtras(prev => [...prev, { sku: next.sku, qty: 1 }]);
  };

  const toggleMainSku = (sku) => setMainSkus(prev => prev.includes(sku)
    ? (prev.length > 1 ? prev.filter(s => s !== sku) : prev)
    : [...prev, sku]);

  const toggleSegment = (s) => setSegments(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const valid = name && sku && mainSkus.length > 0 && price > 0 && segments.length > 0;

  const submit = () => {
    if (window.toast) window.toast(isEdit ? `Bundle ${name} atualizado` : `Bundle ${name} criado · economia ${fmtBRL(savings)}`);
    onClose();
  };

  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 760 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center' }}>
              <Icon name="gift" size={17}/>
            </div>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>{isEdit ? 'Editar bundle' : 'Novo bundle'}</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{name || 'Combo sem nome'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>

        <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28 }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <div><label className="field-label">Nome do bundle</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Starter Vending"/></div>
              <div><label className="field-label">SKU</label><input className="input" value={sku} onChange={e => setSku(e.target.value.toUpperCase())} style={{ fontFamily: 'var(--font-mono)' }}/></div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Produtos-gatilho ({mainSkus.length})</label>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>qualquer um adiciona o bundle</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 8, lineHeight: 1.5 }}>
                Quando o franqueado adicionar <strong style={{ color: 'var(--text-1)' }}>qualquer um destes SKUs</strong> ao pedido, este bundle é incluído automaticamente com a mesma quantidade.
              </div>
              <div style={{ border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', maxHeight: 180, overflowY: 'auto', background: 'var(--bg-surface)' }}>
                {PRODUCTS.filter(p => !p.service).map((p, i, arr) => {
                  const sel = mainSkus.includes(p.sku);
                  return (
                    <label key={p.sku} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--line-1)' : 'none',
                      background: sel ? 'var(--accent-soft)' : 'transparent',
                    }}>
                      <input type="checkbox" checked={sel} onChange={() => toggleMainSku(p.sku)} style={{ accentColor: 'var(--accent)' }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div className="cell-mono" style={{ fontSize: 10.5 }}>{p.sku} · {p.cat}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>{fmtBRL(p.price)}</span>
                    </label>
                  );
                })}
              </div>
              {mainSkus.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {mainSkus.map(s => {
                    const p = PRODUCTS.find(pp => pp.sku === s);
                    return <span key={s} className="badge" style={{ background: 'var(--dark)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{p?.sku}</span>;
                  })}
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Itens adicionais ({extras.length})</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addExtra}><Icon name="plus" size={12}/> Adicionar</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {extras.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--text-3)', padding: '12px 14px', border: '1px dashed var(--line-2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    Nenhum item adicional — adicione produtos que compõem o combo
                  </div>
                ) : extras.map((e, idx) => {
                  const p = PRODUCTS.find(pp => pp.sku === e.sku);
                  return (
                    <div key={idx} style={{ display: 'flex', gap: 8, padding: 8, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', alignItems: 'center' }}>
                      <select value={e.sku} onChange={ev => setExtras(prev => prev.map((x, i) => i === idx ? { ...x, sku: ev.target.value } : x))} className="select" style={{ flex: 1, height: 32, fontSize: 12 }}>
                        {PRODUCTS.filter(pp => !mainSkus.includes(pp.sku)).map(pp => <option key={pp.sku} value={pp.sku}>{pp.name}</option>)}
                      </select>
                      <input type="number" value={e.qty} onChange={ev => setExtras(prev => prev.map((x, i) => i === idx ? { ...x, qty: +ev.target.value || 1 } : x))} min="1" style={{ width: 50, height: 32, border: '1px solid var(--line-2)', borderRadius: 5, padding: '0 8px', fontSize: 12, fontFamily: 'var(--font-mono)', textAlign: 'center' }}/>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', minWidth: 70, textAlign: 'right' }}>{fmtBRL((p?.price || 0) * e.qty)}</span>
                      <button onClick={() => setExtras(prev => prev.filter((_, i) => i !== idx))} style={{ width: 24, height: 24, color: 'var(--text-3)' }}><Icon name="x" size={12}/></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="field-label">Segmentos alvo</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SEGMENTS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSegment(s)} style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 11.5, fontWeight: 600,
                    border: '1px solid ' + (segments.includes(s) ? 'var(--iris)' : 'var(--line-2)'),
                    background: segments.includes(s) ? 'var(--iris-1)' : 'var(--bg-surface)',
                    color: segments.includes(s) ? 'var(--violet)' : 'var(--text-2)',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Status</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'active', label: 'Ativo' },
                  { id: 'draft',  label: 'Rascunho' },
                  { id: 'paused', label: 'Pausado' },
                ].map(s => (
                  <button key={s.id} type="button" onClick={() => setStatus(s.id)} style={{
                    flex: 1, padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid ' + (status === s.id ? 'var(--dark)' : 'var(--line-2)'),
                    background: status === s.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                    fontSize: 12, fontWeight: 600,
                    color: status === s.id ? 'var(--text-1)' : 'var(--text-2)',
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Per-franchise pricing */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Preços por franquia</label>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{Object.values(clientOverride).filter(Boolean).length} franquia{Object.values(clientOverride).filter(Boolean).length !== 1 ? 's' : ''} com preço customizado</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 8 }}>
                Marque para sobrescrever o preço base · sem marcar usa <strong style={{ color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{fmtBRL(price)}</strong> padrão
              </div>
              <div style={{ border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
                {FRANCHISES.map((f, i) => {
                  const override = clientOverride[f.code];
                  const custom = clientPrices[f.code];
                  const effective = override ? custom : price;
                  const diff = price - effective;
                  return (
                    <div key={f.code} style={{ display: 'grid', gridTemplateColumns: '22px 1fr auto 110px', gap: 10, padding: '8px 12px', alignItems: 'center', background: 'var(--bg-surface)', borderBottom: i < FRANCHISES.length - 1 ? '1px solid var(--line-1)' : 'none' }}>
                      <input type="checkbox" checked={override} onChange={() => setClientOverride(p => ({ ...p, [f.code]: !p[f.code] }))} style={{ accentColor: 'var(--accent)' }}/>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.razao}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-3)' }}>{f.code} · {f.segment}</div>
                      </div>
                      {override && diff !== 0 && (
                        <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: diff > 0 ? 'var(--green-soft)' : 'var(--red-soft)', color: diff > 0 ? 'var(--green-30)' : 'var(--red-30)' }}>
                          {diff > 0 ? '−' : '+'}{fmtBRLcurt(Math.abs(diff))}
                        </span>
                      )}
                      {!override && <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>padrão</span>}
                      <input type="number" value={effective} onChange={e => setClientPrices(p => ({ ...p, [f.code]: +e.target.value || 0 }))} disabled={!override} style={{
                        height: 28,
                        border: '1px solid ' + (override ? 'var(--line-2)' : 'transparent'),
                        background: override ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
                        borderRadius: 5, padding: '0 8px',
                        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                        textAlign: 'right',
                        color: override ? 'var(--text-1)' : 'var(--text-3)',
                      }}/>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary rail */}
          <div style={{ background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', padding: 18, alignSelf: 'start', position: 'sticky', top: 0 }}>
            <div className="t-overline" style={{ marginBottom: 10 }}>Composição do bundle</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Gatilhos ({mainSkus.length})</div>
              {mainSkus.map(s => {
                const p = PRODUCTS.find(pp => pp.sku === s);
                return (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                    <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>1× {p?.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmtBRL(p?.price || 0)}</span>
                  </div>
                );
              })}
              {extras.length > 0 && <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8, marginBottom: 2 }}>Inclui</div>}
              {extras.map((e, i) => {
                const p = PRODUCTS.find(pp => pp.sku === e.sku);
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-2)' }}>
                    <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.qty}× {p?.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL((p?.price || 0) * e.qty)}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid var(--line-1)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-2)' }}>
                <span>Valor de tabela</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(totalBase)}</span>
              </div>
              <div>
                <label className="field-label" style={{ marginTop: 6 }}>Preço do bundle</label>
                <input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="input" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16 }}/>
              </div>
              {savings > 0 && (
                <div style={{ background: 'var(--green-soft)', border: '1px solid var(--spring-2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--green-30)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Economia para a franquia</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green-30)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>−{fmtBRL(savings)} <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)', marginLeft: 4 }}>({savingsPct.toFixed(0)}%)</span></div>
                </div>
              )}
              {savings < 0 && (
                <div style={{ background: 'var(--red-soft)', border: '1px solid var(--coral-2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginTop: 8, fontSize: 12, color: 'var(--red-30)' }}>
                  ⚠ Preço acima do valor de tabela
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '16px 28px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <div style={{ display: 'flex', gap: 8 }}>
            {isEdit && <button className="btn btn-danger" onClick={async () => { const ok = await window.confirmAction({ title: 'Excluir bundle?', body: 'Esta ação não pode ser desfeita.', danger: true, confirmLabel: 'Excluir' }); if(ok){ onDelete && onDelete(editing.id); onClose(); } }}><Icon name="trash" size={13}/> Excluir</button>}
            <button className="btn btn-primary" onClick={submit} disabled={!valid}>
              <Icon name="check" size={14} stroke={3}/> {isEdit ? 'Salvar alterações' : 'Criar bundle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.BundleModal = BundleModal;

window.AdminBundles = AdminBundles;
