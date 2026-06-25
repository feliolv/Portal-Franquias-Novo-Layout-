/* ════════════════════════════════════════════════════════
   Partner — parceiro seleciona produto do estoque e envia pedido
   com número(s) de equipamento.
   ════════════════════════════════════════════════════════ */

const PARTNER_STOCK = [
  { id: 'ps1', sku: 'VPOS-NYX-V3',  name: 'VPOS Touch v3',        cat: 'Terminais',  stock: 12, price: 1690, monthly: 49.90 },
  { id: 'ps2', sku: 'VPOS-NYX-IO',  name: 'VPOS IoT Onyx',        cat: 'Terminais',  stock: 34, price: 1290, monthly: 49.90 },
  { id: 'ps3', sku: 'AMIT-3.0',     name: 'Amit 3.0 — Telemetria',cat: 'Acessórios', stock: 20, price: 540,  monthly: 0 },
  { id: 'ps4', sku: 'LAV-MDB-01',   name: 'Kit Lavanderia MDB',   cat: 'Kits',       stock: 6,  price: 2390, monthly: 59.90 },
  { id: 'ps5', sku: 'NYX-MICRO-KIT',name: 'Kit Micromercado Pro', cat: 'Kits',       stock: 4,  price: 4290, monthly: 69.90 },
  { id: 'ps6', sku: 'NYX-FOOD-POS', name: 'POS Food Service',     cat: 'Terminais',  stock: 9,  price: 1990, monthly: 59.90 },
];

const Partner = ({ setRoute }) => {
  const { t } = useLang();
  const [selected, setSelected] = useState(null); // product being ordered
  const [nav, setNav] = useState('stock'); // stock | history
  const [search, setSearch] = useState('');
  const rows = PARTNER_STOCK.filter(p => search === '' || (p.name + ' ' + p.sku).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <NayaxMark size={32}/>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.2em', color: 'var(--text-on-inverse)' }}>NAYAX</div>
            <div className="sub" style={{ marginTop: 2 }}>Brasil · Parceiro</div>
          </div>
        </div>
        <div className="sidebar-account">
          <div className="label">Parceiro autenticado</div>
          <div className="name">TechVend Distribuição</div>
          <div className="code"><Icon name="lock" size={10}/> F01-204</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Operação</div>
          <div className={'nav-item ' + (nav === 'stock' && !selected ? 'active' : '')} onClick={() => { setNav('stock'); setSelected(null); }}><Icon name="box"/> Meu estoque <span className="count">{PARTNER_STOCK.length}</span></div>
          <div className={'nav-item ' + (nav === 'history' && !selected ? 'active' : '')} onClick={() => { setNav('history'); setSelected(null); }}><Icon name="receipt"/> Histórico <span className="count">{PARTNER_ORDERS.length}</span></div>
        </nav>
        <div className="sidebar-foot">
          <div className="user-pill" onClick={() => setRoute('login')}>
            <div className="avatar">TV</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="name">Tiago Vasquez</div>
              <div className="role">Parceiro</div>
            </div>
            <Icon name="logout" size={14} style={{ color: 'var(--text-on-inverse-2)' }}/>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <Topbar breadcrumb={selected ? [{ label: 'Meu estoque', onClick: () => setSelected(null) }, { label: 'Transferência' }] : [{ label: nav === 'history' ? 'Histórico' : 'Meu estoque' }]}
          actions={<LangPicker/>}/>

        <div className="app-content">
          {selected ? (
            <PartnerOrder product={selected} onBack={() => setSelected(null)}/>
          ) : nav === 'history' ? (
            <PartnerHistory/>
          ) : (
            <>
              <PageHeader
                kicker="Parceiro · F01-204"
                title="Meu estoque"
                sub="Selecione um produto do seu estoque para registrar uma transferência ao cliente final."
                actions={
                  <div className="input-group" style={{ width: 260, height: 36 }}>
                    <Icon name="search" size={14}/>
                    <input placeholder="Buscar produto…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }}/>
                  </div>
                }
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {rows.map(p => {
                  const low = p.stock <= 6;
                  return (
                    <div key={p.id} className="card prod-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setSelected(p)}>
                      <ProductVisual product={p}/>
                      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="t-overline" style={{ color: 'var(--text-3)' }}>{p.cat}</div>
                          <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{p.sku}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: low ? 'var(--orange-50)' : 'var(--green-50)' }}/>
                          <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{low ? `Apenas ${p.stock} em estoque` : `${p.stock} em estoque`}</span>
                        </div>
                        <button className="btn btn-dark btn-sm prod-add" style={{ marginTop: 8 }} onClick={(e) => { e.stopPropagation(); setSelected(p); }}>
                          <Icon name="refresh" size={13}/> Enviar movimentação
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ────── Order/shipment form with equipment numbers ────── */
const PartnerOrder = ({ product, onBack }) => {
  const [qty, setQty] = useState(1);
  const [equip, setEquip] = useState(['']);
  const [method, setMethod] = useState('correios');

  // keep equipment slots in sync with qty (at least 1 field)
  const setQtySafe = (n) => {
    const v = Math.max(1, n);
    setQty(v);
    setEquip(prev => {
      const next = prev.slice(0, v);
      while (next.length < v) next.push('');
      return next.length ? next : [''];
    });
  };
  const addEquip = () => setEquip(prev => [...prev, '']);
  const setEquipAt = (i, val) => setEquip(prev => prev.map((e, idx) => idx === i ? val : e));
  const removeEquip = (i) => setEquip(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const filled = equip.filter(e => e.trim()).length;
  const valid = filled > 0;

  const submit = () => {
    window.toast && window.toast(`Transferência registrada · ${filled} equipamento${filled>1?'s':''} · ${product.name}`);
    onBack();
  };

  return (
    <div className="fade-in">
      <button className="btn btn-link btn-sm" onClick={onBack} style={{ color: 'var(--text-2)', marginBottom: 14 }}>
        <Icon name="arrow-left" size={14}/> Voltar ao estoque
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Product header */}
          <div className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--line-1)', flexShrink: 0 }}><ProductVisual product={product}/></div>
            <div style={{ flex: 1 }}>
              <div className="t-overline" style={{ color: 'var(--text-3)' }}>{product.cat} · <span className="t-mono">{product.sku}</span></div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{product.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 2 }}>{product.stock} unidades disponíveis no seu estoque</div>
            </div>
            <div style={{ width: 120 }}><QtyStepper qty={qty} onChange={setQtySafe}/></div>
          </div>

          {/* Dados do cliente — igual ao catálogo de clientes */}
          <div className="card card-pad">
            <div className="t-overline" style={{ marginBottom: 14 }}><Icon name="user" size={12}/> Dados do cliente</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{t('partner.companyData', 'Dados da empresa')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label className="field-label">Razão Social *</label><input className="input" placeholder="Ex: Padaria Estrela Ltda"/></div>
              <div><label className="field-label">Nome fantasia</label><input className="input" placeholder="Padaria Estrela"/></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div><label className="field-label">CNPJ *</label><input className="input" placeholder="00.000.000/0001-00" style={{ fontFamily: 'var(--font-mono)' }}/></div>
              <div><label className="field-label">Código do cliente (NX)</label><input className="input" placeholder="NX-0000" style={{ fontFamily: 'var(--font-mono)' }}/></div>
              <div><label className="field-label">Segmento</label>
                <select className="select"><option>Vending Machine</option><option>Micromercado</option><option>Lavanderia</option><option>Diversão Eletrônica</option><option>Food Service</option><option>EV</option></select>
              </div>
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '18px 0 10px' }}>Endereço da empresa</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label className="field-label">Logradouro *</label><input className="input" placeholder="Rua, número, complemento"/></div>
              <div><label className="field-label">CEP</label><input className="input" placeholder="00000-000" style={{ fontFamily: 'var(--font-mono)' }}/></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div><label className="field-label">Bairro</label><input className="input" placeholder="Centro"/></div>
              <div><label className="field-label">Cidade</label><input className="input" placeholder="São Paulo"/></div>
              <div><label className="field-label">UF</label><input className="input" placeholder="SP"/></div>
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '18px 0 10px' }}>Contato principal</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label className="field-label">Nome do contato *</label><input className="input" placeholder="Nome completo"/></div>
              <div><label className="field-label">Cargo</label><input className="input" placeholder="Proprietário"/></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div><label className="field-label">CPF</label><input className="input" placeholder="000.000.000-00" style={{ fontFamily: 'var(--font-mono)' }}/></div>
              <div><label className="field-label">E-mail *</label><input className="input" placeholder="contato@empresa.com"/></div>
              <div><label className="field-label">Telefone *</label><input className="input" placeholder="(11) 90000-0000"/></div>
            </div>
          </div>

          {/* Equipamentos */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div className="t-overline" style={{ marginBottom: 0 }}><Icon name="package" size={12}/> Número(s) do equipamento</div>
              <span style={{ fontSize: 11.5, color: filled < qty ? 'var(--orange-30)' : 'var(--green-30)', fontWeight: 600 }}>{filled} de {qty} preenchido{filled !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>Informe o número de série de cada equipamento a transferir. Adicione quantos forem necessários.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {equip.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: e.trim() ? 'var(--dark)' : 'var(--neutral-80)', color: e.trim() ? 'var(--accent)' : 'var(--text-3)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <Icon name="package" size={14}/>
                    <input value={e} onChange={ev => setEquipAt(i, ev.target.value)} placeholder="Ex: NYX-2024-000000" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.03em' }}/>
                  </div>
                  <button onClick={() => removeEquip(i)} disabled={equip.length === 1} style={{ width: 32, height: 32, color: equip.length === 1 ? 'var(--neutral-60)' : 'var(--red-30)', display: 'grid', placeItems: 'center', cursor: equip.length === 1 ? 'not-allowed' : 'pointer', flexShrink: 0 }} title="Remover">
                    <Icon name="trash" size={14}/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addEquip} className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: '100%', borderStyle: 'dashed' }}>
              <Icon name="plus" size={13}/> Adicionar número de equipamento
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="card card-pad" style={{ position: 'sticky', top: 76 }}>
          <div className="t-overline" style={{ marginBottom: 14 }}>Resumo da transferência</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: 'var(--text-2)' }}>Produto</span>
            <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: 160 }}>{product.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: 'var(--text-2)' }}>Quantidade</span>
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{qty}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--line-1)' }}>
            <span style={{ color: 'var(--text-2)' }}>Equipamentos informados</span>
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: filled === qty ? 'var(--green-30)' : 'var(--orange-30)' }}>{filled}</span>
          </div>

          {filled < qty && (
            <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'var(--orange-soft)', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--orange-30)', marginBottom: 14 }}>
              <Icon name="info" size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
              Faltam {qty - filled} número(s) de equipamento para {qty} unidades.
            </div>
          )}

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!valid} onClick={submit}>
            <Icon name="refresh" size={15}/> {t('partner.confirmTransfer', 'Confirmar transferência')}
          </button>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 10 }}>Movimentação registrada no sistema · sem envio físico</div>
        </div>
      </div>
    </div>
  );
};

/* ────── Partner order history ────── */
const PARTNER_ORDERS = [
  { id: '#EV-3092', client: 'Padaria Estrela', product: 'VPOS Touch v3', qty: 2, equip: ['NYX-2024-018842','NYX-2024-018843'], status: 'delivered', method: 'Correios', when: '2026-05-20T10:12', track: 'BR8842019santo' },
  { id: '#EV-3088', client: 'Lava Rápido Jet', product: 'Kit Lavanderia MDB', qty: 1, equip: ['NYX-2024-017701'], status: 'shipped', method: 'Transportadora', when: '2026-05-18T15:40', track: 'TR-559021' },
  { id: '#EV-3081', client: 'MiniMercado 24h', product: 'Kit Micromercado Pro', qty: 3, equip: ['NYX-2024-016220','NYX-2024-016221','NYX-2024-016222'], status: 'shipped', method: 'Correios', when: '2026-05-16T09:05', track: 'BR7740112santo' },
  { id: '#EV-3074', client: 'Burger Point', product: 'POS Food Service', qty: 1, equip: ['NYX-2024-015009'], status: 'pending', method: 'Retirada', when: '2026-05-14T17:22', track: '—' },
  { id: '#EV-3066', client: 'Café Aroma', product: 'VPOS IoT Onyx', qty: 4, equip: ['NYX-2024-013300','NYX-2024-013301','NYX-2024-013302','NYX-2024-013303'], status: 'delivered', method: 'Transportadora', when: '2026-05-10T11:48', track: 'TR-540188' },
];

const PartnerHistory = () => {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const counts = { all: PARTNER_ORDERS.length, pending: PARTNER_ORDERS.filter(o=>o.status==='pending').length, shipped: PARTNER_ORDERS.filter(o=>o.status==='shipped').length, delivered: PARTNER_ORDERS.filter(o=>o.status==='delivered').length };
  const rows = PARTNER_ORDERS.filter(o => filter === 'all' || o.status === filter);
  const totalEquip = PARTNER_ORDERS.reduce((a,o)=>a+o.equip.length,0);

  const TR_STATUS = { done: { tone: 'green', label: 'Concluída' }, processing: { tone: 'blue', label: 'Processando' }, pending: { tone: 'orange', label: 'Aguardando' } };

  return (
    <>
      <PageHeader
        kicker="Parceiro · F01-204"
        title="Histórico de transferências"
        sub={`${PARTNER_ORDERS.length} transferências · ${totalEquip} equipamentos movimentados`}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Exportando histórico de transferências (CSV)…')}><Icon name="download" size={13}/> Exportar</button>}
      />

      <div className="kpi-strip" style={{ marginBottom: 20 }}>
        <div className="kpi"><div className="label">Transferências totais</div><div className="value">{PARTNER_ORDERS.length}</div><div className="delta delta-up"><Icon name="trending-up" size={12}/> +2 no mês</div></div>
        <div className="kpi"><div className="label">Equipamentos movimentados</div><div className="value t-mono">{totalEquip}</div><div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="package" size={12}/> rastreáveis</div></div>
        <div className="kpi"><div className="label">Processando</div><div className="value" style={{ color: 'var(--blue-30)' }}>{counts.shipped}</div><div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="refresh" size={12}/> em sistema</div></div>
        <div className="kpi"><div className="label">Aguardando</div><div className="value" style={{ color: counts.pending ? 'var(--orange-50)' : 'var(--text-1)' }}>{counts.pending}</div><div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="clock" size={12}/> ação</div></div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {[{id:'all',label:'Todas'},{id:'pending',label:'Aguardando'},{id:'shipped',label:'Processando'},{id:'delivered',label:'Concluídas'}].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ height: 30, padding: '0 12px', borderRadius: 'var(--radius-pill)', fontSize: 12.5, fontWeight: 600, border: '1px solid ' + (filter === f.id ? 'var(--dark)' : 'var(--line-2)'), background: filter === f.id ? 'var(--dark)' : 'var(--bg-surface)', color: filter === f.id ? 'white' : 'var(--text-1)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{f.label} <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: filter === f.id ? 'var(--accent)' : 'var(--neutral-80)', color: filter === f.id ? 'var(--dark)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{counts[f.id]}</span></button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(o => {
          const open = expanded === o.id;
          return (
            <div key={o.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '110px 1fr 130px 120px 20px', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setExpanded(open ? null : o.id)}>
                <div><div className="t-mono" style={{ fontSize: 13, fontWeight: 600 }}>{o.id}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtDate(o.when)}</div></div>
                <div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{o.client}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>{o.qty}× {o.product}</div></div>
                <div><span className="badge badge-neutral">{o.equip.length} equip.</span></div>
                <div><StatusPill status={o.status}/></div>
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} style={{ color: 'var(--text-3)' }}/>
              </div>
              {open && (
                <div style={{ padding: '4px 18px 18px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface-2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, marginTop: 14 }}>
                    <div>
                      <div className="t-overline" style={{ marginBottom: 8 }}>Números de equipamento</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {o.equip.map((e, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--dark)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{i+1}</div>
                            <span className="t-mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{e}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="t-overline" style={{ marginBottom: 8 }}>Dados da transferência</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-2)' }}>Protocolo</span><span className="t-mono" style={{ fontWeight: 600 }}>{o.track}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-2)' }}>Tipo</span><span style={{ fontWeight: 600 }}>Movimentação interna</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-2)' }}>Data</span><span className="cell-mono">{fmtDateTime(o.when)}</span></div>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: 6 }}><Icon name="receipt" size={12}/> Ver comprovante</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

window.Partner = Partner;
window.PartnerOrder = PartnerOrder;
window.PartnerHistory = PartnerHistory;
