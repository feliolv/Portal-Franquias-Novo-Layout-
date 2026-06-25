/* ════════════════════════════════════════════════════════
   Admin: Vendas (Sales table)
   ════════════════════════════════════════════════════════ */

const AdminSales = () => {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [hsFilter, setHsFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [orders, setOrders] = useState(ORDERS);
  const [resending, setResending] = useState({});
  const [errorDetail, setErrorDetail] = useState(null);

  const hsCounts = {
    all: orders.length,
    synced:  orders.filter(o => o.hs === 'synced').length,
    failed:  orders.filter(o => o.hs === 'failed').length,
    pending: orders.filter(o => o.hs === 'pending').length,
  };
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const rows = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => hsFilter === 'all' || o.hs === hsFilter)
    .filter(o => search === '' || (o.id + ' ' + o.razao + ' ' + o.code).toLowerCase().includes(search.toLowerCase()));

  const toggleAll = () => setSelected(selected.length === rows.length ? [] : rows.map(r => r.id));
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const resendOne = (id) => {
    setResending(r => ({ ...r, [id]: true }));
    setTimeout(() => {
      const ok = Math.random() > 0.25;
      setOrders(prev => prev.map(o => o.id === id ? {
        ...o,
        hs: ok ? 'synced' : 'failed',
        hsDeal: ok ? ('HS-DEAL-' + (44820 + Math.floor(Math.random()*100))) : o.hsDeal,
        hsError: ok ? undefined : 'Falha na reentrega · validar dados do contato',
        hsAt: new Date().toISOString(),
      } : o));
      setResending(r => { const { [id]: _, ...rest } = r; return rest; });
      if (window.toast) window.toast(ok ? 'Pedido ' + id + ' reenviado ao HubSpot' : 'Falha ao reenviar ' + id);
    }, 1100);
  };

  const resendBulk = async () => {
    const targets = selected.filter(id => orders.find(o => o.id === id)?.hs !== 'synced');
    if (targets.length === 0) {
      window.toast && window.toast('Selecione pedidos com falha ou pendentes');
      return;
    }
    const ok = await window.confirmAction({
      title: 'Reenviar ' + targets.length + ' pedido' + (targets.length>1?'s':'') + ' ao HubSpot?',
      body: 'Tentativa em lote. Pedidos com erro serão reprocessados imediatamente.',
      confirmLabel: 'Reenviar todos',
    });
    if (!ok) return;
    targets.forEach(id => resendOne(id));
    setSelected([]);
  };

  const HS_META = {
    synced:  { c: 'var(--green-30)',  bg: 'var(--green-soft)',  l: 'Sincronizado', icon: 'check' },
    failed:  { c: 'var(--red-30)',    bg: 'var(--red-soft)',    l: 'Erro',         icon: 'alert' },
    pending: { c: 'var(--orange-30)', bg: 'var(--orange-soft)', l: 'Aguardando',   icon: 'clock' },
  };

  const [menuOpen, setMenuOpen] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [density, setDensity] = useState('comfort');
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (!e.target.closest('[data-row-menu]')) setMenuOpen(null); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const advanceStatus = (o, newStatus) => {
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: newStatus } : x));
    window.toast && window.toast('Pedido ' + o.id + ' marcado como ' + newStatus);
  };
  const cancelOrder = async (o) => {
    const ok = await window.confirmAction({ title: 'Cancelar pedido ' + o.id + '?', body: 'Esta ação não pode ser desfeita. O cliente será notificado por e-mail.', danger: true, confirmLabel: 'Cancelar pedido' });
    if (!ok) return;
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'cancelled' } : x));
    window.toast && window.toast('Pedido ' + o.id + ' cancelado');
  };
  const dupOrder = (o) => window.toast && window.toast('Pedido duplicado · rascunho criado');
  const downloadNF = (o) => window.toast && window.toast('Nota fiscal de ' + o.id + ' baixada (PDF)');
  const copyId = (o) => { navigator.clipboard?.writeText(o.id); window.toast && window.toast('ID copiado'); };

  return (
    <>
      <PageHeader
        kicker={t('admin.sales.kicker')}
        title={t('admin.sales.title')}
        sub={`${orders.length} pedidos · ${fmtBRL(orders.reduce((a,o)=>a+o.total,0))}`}
        actions={
          <>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={13}/> {t('admin.sales.exportCsv')}</button>
            <button className="btn btn-dark btn-sm"><Icon name="plus" size={13}/> {t('admin.sales.manualOrder')}</button>
          </>
        }
      />

      {/* HubSpot sync status banner — only if there are failures */}
      {hsCounts.failed > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px',
          background: 'var(--red-soft)',
          border: '1px solid #FFCCD1',
          borderRadius: 'var(--radius-md)',
          marginBottom: 16,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--red-30)', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icon name="alert" size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--red-30)' }}>{hsCounts.failed} pedido{hsCounts.failed>1?'s':''} com erro de sincronização HubSpot</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Negociações não foram enviadas. Você pode reenviá-las individualmente ou em lote.</div>
          </div>
          <button className="btn btn-sm" onClick={() => setHsFilter('failed')} style={{ background: 'white', border: '1px solid var(--coral-2)', color: 'var(--red-30)' }}>
            Ver com erro <Icon name="arrow-right" size={12}/>
          </button>
        </div>
      )}

      {/* Status segmented */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { id: 'all',       label: 'Todos' },
          { id: 'pending',   label: 'Pendentes' },
          { id: 'confirmed', label: 'Confirmados' },
          { id: 'shipped',   label: 'Enviados' },
          { id: 'delivered', label: 'Entregues' },
          { id: 'cancelled', label: 'Cancelados' },
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

      <div className="table-wrap">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="input-group" style={{ width: 280, height: 34, padding: '0 10px' }}>
              <Icon name="search" size={13}/>
              <input placeholder="Buscar pedido, franquia, CNPJ…" value={search} onChange={e=>setSearch(e.target.value)} style={{ fontSize: 12.5 }}/>
            </div>
            <button className="btn btn-ghost btn-sm"><Icon name="filter" size={13}/> Filtros</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {selected.length > 0 && (
              <>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{selected.length} selecionado{selected.length>1?'s':''}</span>
                <button className="btn btn-secondary btn-sm" onClick={resendBulk}><Icon name="refresh" size={12}/> Reenviar ao HubSpot</button>
                <button className="btn btn-secondary btn-sm">Marcar como enviado</button>
              </>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Densidade</div>
            <div style={{ display: 'flex', padding: 2, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 6 }}>
              <button onClick={() => setDensity('compact')} style={{ padding: '3px 8px', fontSize: 11, fontWeight: 600, color: density === 'compact' ? 'var(--text-1)' : 'var(--text-2)', background: density === 'compact' ? 'var(--bg-surface)' : 'transparent', borderRadius: 4, boxShadow: density === 'compact' ? 'var(--shadow-xs)' : 'none' }}>Compacta</button>
              <button onClick={() => setDensity('comfort')} style={{ padding: '3px 8px', fontSize: 11, fontWeight: 600, background: density === 'comfort' ? 'var(--bg-surface)' : 'transparent', color: density === 'comfort' ? 'var(--text-1)' : 'var(--text-2)', borderRadius: 4, boxShadow: density === 'comfort' ? 'var(--shadow-xs)' : 'none' }}>Confortável</button>
            </div>
          </div>
        </div>

        <table className={'t dn-density-' + density}>
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" checked={selected.length === rows.length && rows.length > 0} onChange={toggleAll} style={{ accentColor: 'var(--accent)' }}/></th>
              <th>Pedido</th>
              <th>Franquia</th>
              <th>Itens</th>
              <th>Status</th>
              <th>HubSpot</th>
              <th>Pagamento</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
              <th>Quando</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(o => {
              const hsm = HS_META[o.hs] || HS_META.pending;
              const isResending = !!resending[o.id];
              return (
              <tr key={o.id} style={{ background: o.hs === 'failed' ? 'rgba(255,92,108,0.04)' : undefined }}>
                <td><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} style={{ accentColor: 'var(--accent)' }}/></td>
                <td>
                  <div className="t-mono" style={{ fontWeight: 600 }}>{o.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>via {o.method}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.razao}</div>
                  <div className="cell-mono">{o.code} · {o.contact}</div>
                </td>
                <td>{o.items}</td>
                <td><StatusPill status={o.status}/></td>
                <td>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
                    <span
                      onClick={() => o.hs === 'failed' && setErrorDetail(o)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 11, fontWeight: 600,
                        padding: '3px 8px', borderRadius: 999,
                        background: hsm.bg, color: hsm.c,
                        cursor: o.hs === 'failed' ? 'pointer' : 'default',
                      }}
                      title={o.hs === 'failed' ? 'Clique para ver detalhes do erro' : ''}>
                      <Icon name={hsm.icon} size={10} stroke={3}/>
                      {hsm.l}
                    </span>
                    {o.hs === 'synced' && o.hsDeal && (
                      <span className="cell-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{o.hsDeal}</span>
                    )}
                    {o.hs === 'failed' && o.hsError && (
                      <span style={{ fontSize: 10.5, color: 'var(--red-30)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={o.hsError}>{o.hsError}</span>
                    )}
                  </div>
                </td>
                <td>{o.method}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmtBRL(o.total)}</td>
                <td className="cell-mono">{fmtDateTime(o.when)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    {o.hs !== 'synced' && (
                      <button
                        onClick={() => resendOne(o.id)}
                        disabled={isResending}
                        className="btn btn-sm"
                        title="Reenviar ao HubSpot"
                        style={{
                          background: o.hs === 'failed' ? 'var(--red-30)' : 'var(--orange-30)',
                          color: 'white', width: 30, padding: 0,
                        }}>
                        {isResending
                          ? <span className="login-spinner" style={{ borderTopColor: 'white' }}/>
                          : <Icon name="refresh" size={13}/>}
                      </button>
                    )}
                    <button data-row-menu="trigger" onClick={() => setMenuOpen(menuOpen === o.id ? null : o.id)} className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0, position: 'relative' }}>
                      <Icon name="more" size={14}/>
                      {menuOpen === o.id && (
                        <div data-row-menu="menu" onClick={e => e.stopPropagation()} style={{
                          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                          minWidth: 200,
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--line-1)',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: 'var(--shadow-lg)',
                          padding: 4,
                          zIndex: 50,
                          animation: 'fadeUp .15s ease both',
                          textAlign: 'left',
                        }}>
                          {[
                            { id: 'view',     label: 'Ver detalhes',      icon: 'eye',      fn: () => { setDetailOrder(o); setMenuOpen(null); } },
                            { id: 'copy',     label: 'Copiar ID',         icon: 'copy',     fn: () => { copyId(o); setMenuOpen(null); } },
                            { id: 'nf',       label: 'Baixar nota fiscal',icon: 'download', fn: () => { downloadNF(o); setMenuOpen(null); }, hide: o.status === 'pending' || o.status === 'cancelled' },
                            { id: 'sep' },
                            { id: 'approve',  label: 'Aprovar pedido',    icon: 'check',    fn: () => { advanceStatus(o, 'confirmed'); setMenuOpen(null); }, hide: o.status !== 'pending' },
                            { id: 'ship',     label: 'Marcar como enviado',icon: 'truck',   fn: () => { advanceStatus(o, 'shipped'); setMenuOpen(null); }, hide: o.status !== 'confirmed' },
                            { id: 'deliver',  label: 'Marcar como entregue',icon: 'check',  fn: () => { advanceStatus(o, 'delivered'); setMenuOpen(null); }, hide: o.status !== 'shipped' },
                            { id: 'dup',      label: 'Duplicar pedido',   icon: 'copy',     fn: () => { dupOrder(o); setMenuOpen(null); } },
                            { id: 'sep2' },
                            { id: 'resend',   label: 'Reenviar ao HubSpot',icon: 'refresh', fn: () => { resendOne(o.id); setMenuOpen(null); }, hide: o.hs === 'synced', danger: o.hs === 'failed' },
                            { id: 'cancel',   label: 'Cancelar pedido',   icon: 'x',        fn: async () => { setMenuOpen(null); await cancelOrder(o); }, danger: true, hide: o.status === 'cancelled' || o.status === 'delivered' },
                          ].filter(i => !i.hide).map(i => i.id.startsWith('sep') ? (
                            <div key={i.id} style={{ height: 1, background: 'var(--line-1)', margin: '4px 6px' }}/>
                          ) : (
                            <button key={i.id} onClick={(e) => { e.stopPropagation(); i.fn(); }} style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: 13, fontWeight: 500,
                              color: i.danger ? 'var(--red-30)' : 'var(--text-1)',
                              background: 'transparent', textAlign: 'left',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = i.danger ? 'var(--red-soft)' : 'var(--bg-surface-2)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                              <Icon name={i.icon} size={13}/>
                              {i.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid var(--line-1)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Mostrando {rows.length} de {orders.length} pedidos</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost btn-sm" disabled><Icon name="chevron-left" size={13}/></button>
            <button className="btn btn-dark btn-sm" style={{ width: 30, padding: 0 }}>1</button>
            <button className="btn btn-ghost btn-sm" style={{ width: 30, padding: 0 }}>2</button>
            <button className="btn btn-ghost btn-sm" style={{ width: 30, padding: 0 }}>3</button>
            <button className="btn btn-ghost btn-sm"><Icon name="chevron-right" size={13}/></button>
          </div>
        </div>
      </div>

      {/* HubSpot error detail modal */}
      {errorDetail && (
        <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setErrorDetail(null)}>
          <div className="modal" style={{ maxWidth: 520 }}>
            <div style={{ padding: 24, display: 'flex', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--red-soft)', color: 'var(--red-30)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="alert" size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>Erro de sincronização HubSpot</div>
                <div className="cell-mono" style={{ marginTop: 4 }}>Pedido {errorDetail.id} · {errorDetail.code}</div>

                <div style={{ marginTop: 16, padding: 12, background: 'var(--red-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--coral-2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--red-30)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Mensagem</div>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{errorDetail.hsError}</div>
                </div>

                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div className="t-overline" style={{ fontSize: 10 }}>Última tentativa</div>
                    <div style={{ fontSize: 12, marginTop: 2 }}>{errorDetail.hsAt ? fmtDateTime(errorDetail.hsAt) : '—'}</div>
                  </div>
                  <div>
                    <div className="t-overline" style={{ fontSize: 10 }}>Tentativas</div>
                    <div style={{ fontSize: 12, marginTop: 2 }}>2 de 3 automáticas</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '12px 20px 20px' }}>
              <button className="btn btn-ghost" onClick={() => setErrorDetail(null)}>Fechar</button>
              <button className="btn btn-primary" onClick={() => { resendOne(errorDetail.id); setErrorDetail(null); }}>
                <Icon name="refresh" size={13}/> Reenviar agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {detailOrder && (
        <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setDetailOrder(null)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="t-overline" style={{ color: 'var(--accent)' }}>Detalhes do pedido</div>
                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, fontFamily: 'var(--font-mono)' }}>{detailOrder.id}</div>
              </div>
              <button onClick={() => setDetailOrder(null)} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div className="t-overline" style={{ fontSize: 10 }}>Franquia</div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>{detailOrder.razao}</div>
                  <div className="cell-mono">{detailOrder.code} · {detailOrder.contact}</div>
                </div>
                <div>
                  <div className="t-overline" style={{ fontSize: 10 }}>Status</div>
                  <div style={{ marginTop: 4 }}><StatusPill status={detailOrder.status}/></div>
                </div>
                <div>
                  <div className="t-overline" style={{ fontSize: 10 }}>Pagamento</div>
                  <div style={{ marginTop: 4 }}>{detailOrder.method}</div>
                </div>
                <div>
                  <div className="t-overline" style={{ fontSize: 10 }}>Quando</div>
                  <div className="cell-mono" style={{ marginTop: 4 }}>{fmtDateTime(detailOrder.when)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div className="t-overline" style={{ fontSize: 10 }}>Itens</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{detailOrder.items}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="t-overline" style={{ fontSize: 10 }}>Total</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(detailOrder.total)}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 24px 20px' }}>
              <button className="btn btn-ghost" onClick={() => setDetailOrder(null)}>Fechar</button>
              <button className="btn btn-secondary"><Icon name="download" size={13}/> Baixar PDF</button>
              <button className="btn btn-primary"><Icon name="edit" size={13}/> Editar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ════════════════════════════════════════════════════════
   Admin: Franquias
   ════════════════════════════════════════════════════════ */
const AdminClients = () => {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table'); // table | cards
  const [newOpen, setNewOpen] = useState(false);
  const [editFranchise, setEditFranchise] = useState(null);

  const rows = FRANCHISES.filter(f => search === '' || (f.razao + ' ' + f.code + ' ' + f.city).toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader
        kicker={t('admin.clients.kicker')}
        title={t('admin.clients.title')}
        sub={`${FRANCHISES.length} · ${FRANCHISES.filter(f=>f.status==='active').length}`}
        actions={
          <>
            <button className="btn btn-secondary btn-sm"><Icon name="upload" size={13}/> {t('common.import')}</button>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={13}/> {t('common.export')}</button>
            <button className="btn btn-dark btn-sm" onClick={() => setNewOpen(true)}><Icon name="plus" size={13}/> {t('admin.clients.newFranchise')}</button>
          </>
        }
      />
      {newOpen && <NewFranchiseModal onClose={() => setNewOpen(false)}/>}
      {editFranchise && <NewFranchiseModal existing={editFranchise} onClose={() => setEditFranchise(null)}/>}

      <div className="table-wrap">
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="input-group" style={{ width: 280, height: 34, padding: '0 10px' }}>
              <Icon name="search" size={13}/>
              <input placeholder="Buscar franquia, código, cidade…" value={search} onChange={e=>setSearch(e.target.value)} style={{ fontSize: 12.5 }}/>
            </div>
            <button className="btn btn-ghost btn-sm"><Icon name="filter" size={13}/> Filtros</button>
          </div>
          <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line-1)' }}>
            {['table','cards'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                width: 30, height: 26, borderRadius: 4,
                background: view === v ? 'var(--neutral-15)' : 'transparent',
                color: view === v ? 'white' : 'var(--text-3)',
                display: 'grid', placeItems: 'center',
              }}><Icon name={v === 'table' ? 'menu' : 'grid'} size={13}/></button>
            ))}
          </div>
        </div>

        {view === 'table' ? (
          <table className="t">
            <thead>
              <tr>
                <th>Código</th>
                <th>Razão social</th>
                <th>Segmento</th>
                <th>Localização</th>
                <th>Pedidos</th>
                <th style={{ textAlign: 'right' }}>Volume (LTV)</th>
                <th>Último pedido</th>
                <th>Status</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.code}>
                  <td><span className="cell-mono" style={{ fontWeight: 600, color: 'var(--text-1)' }}>{c.code}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-80)', color: 'var(--text-2)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>
                        {c.razao.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.razao}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{c.segment}</span></td>
                  <td style={{ color: 'var(--text-2)' }}><Icon name="map-pin" size={11}/> {c.city}</td>
                  <td><strong>{c.orders}</strong></td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmtBRLcurt(c.ltv)}</td>
                  <td className="cell-mono">{fmtDate(c.last)}</td>
                  <td><StatusPill status={c.status}/></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }} title="Editar" onClick={() => setEditFranchise(c)}><Icon name="edit" size={13}/></button>
                      <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }} title="Mais opções"><Icon name="more" size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {rows.map(c => (
              <div key={c.code} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-15)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>
                    {c.razao.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.razao}</div>
                    <div className="cell-mono">{c.code}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span className="badge badge-neutral">{c.segment}</span>
                  <StatusPill status={c.status}/>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
                  <Icon name="map-pin" size={11}/> {c.city}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--line-1)' }}>
                  <div>
                    <div className="t-overline" style={{ fontSize: 10 }}>Pedidos</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{c.orders}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="t-overline" style={{ fontSize: 10 }}>LTV</div>
                    <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-mono)' }}>{fmtBRLcurt(c.ltv)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

window.AdminSales = AdminSales;
window.AdminClients = AdminClients;

/* ════════════════════════════════════════════════════════
   Nova Franquia — modal de criação
   ════════════════════════════════════════════════════════ */
const NewFranchiseModal = ({ onClose, existing = null }) => {
  const isEdit = !!existing;
  const [kind, setKind] = useState(existing ? 'franquia' : null);
  const [step, setStep] = useState(1);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwMode, setPwMode] = useState('email'); // email | manual
  const CODE_PREFIX = { franquia: 'NX', consultor: 'CS', parceiro: 'F0' };
  const HS_CONSULTORS = [
    { name: 'Daiane Soares', email: 'daianeo@nayax.com', owner: '85001500', av: 'DA', color: 'var(--iris)' },
    { name: 'Karolay Correia', email: 'karolay@nayax.com', owner: '85001768', av: 'KA', color: 'var(--spring)' },
    { name: 'Nicole Emiliano', email: 'nicole@nayax.com', owner: '85001952', av: 'NE', color: 'var(--coral)' },
    { name: 'Guilherme Raksa', email: 'guilherme@nayax.com', owner: '85578673', av: 'GR', color: 'var(--violet)' },
    { name: 'Vinícius Dias', email: 'vinicius@nayax.com', owner: '85578620', av: 'VD', color: 'var(--orange-50)' },
  ];
  // Auto-generate unique code on open (NX-####, avoiding existing codes)
  const autoCode = useMemo(() => {
    if (existing) return existing.code;
    const prefix = (kind && CODE_PREFIX[kind]) || 'NX';
    const used = new Set(FRANCHISES.map(f => f.code));
    let n;
    do { n = Math.floor(1000 + Math.random() * 9000); } while (used.has(prefix + '-' + n));
    return prefix + '-' + n;
  }, [existing, kind]);
  const hubspotCtx = {
    franquia: 'Nayax Brasil — Distribuidor SP',
    consultor: 'Felipe Andrade',
    consultorEmail: 'felipe.andrade@nayax.com',
    consultorAvatar: 'FA',
  };

  // Pre-select products
  const [items, setItems] = useState(() => PRODUCTS.map(p => ({
    id: p.id, enabled: !p.service,
    customPrice: p.price,
    customMonthly: p.monthly || 0,
  })));
  const [payMethods, setPayMethods] = useState([
    { id: 'pix',      label: 'PIX à vista',           type: 'avista',     term: 0,  discount: 3,  icon: 'zap',       tone: 'green',   enabled: true,  builtin: true },
    { id: 'cartao',   label: 'Cartão de crédito',     type: 'parcelado',  term: 0,  installments: 12, icon: 'tag',   tone: 'blue',    enabled: true,  builtin: true },
    { id: 'boleto30', label: 'Boleto bancário',       type: 'prazo',      term: 30, discount: 0,  icon: 'receipt',   tone: 'neutral', enabled: true,  builtin: true },
    { id: 'boleto60', label: 'Boleto bancário',       type: 'prazo',      term: 60, discount: 0,  icon: 'receipt',   tone: 'neutral', enabled: false, builtin: true },
    { id: 'fatura30', label: 'Fatura mensal',         type: 'prazo',      term: 30, discount: 0,  icon: 'briefcase', tone: 'orange',  enabled: false, builtin: true },
    { id: 'fatura60', label: 'Fatura mensal',         type: 'prazo',      term: 60, discount: 0,  icon: 'briefcase', tone: 'orange',  enabled: false, builtin: true },
  ]);
  const [creditLimit, setCreditLimit] = useState(50000);
  const [editingPay, setEditingPay] = useState(null);
  // Plans = entrada + parcelas
  const [plans, setPlans] = useState([
    { id: 'plan-1', label: '30% entrada + 6× boleto', enabled: true,  entryMethod: 'pix',    entryPct: 30, instMethod: 'boleto', instCount: 6 },
    { id: 'plan-2', label: '50% entrada + 12× cartão', enabled: false, entryMethod: 'cartao', entryPct: 50, instMethod: 'cartao', instCount: 12 },
  ]);
  const [editingPlan, setEditingPlan] = useState(null);

  const updPay = (id, patch) => setPayMethods(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  const addCustomPay = () => {
    const id = 'custom-' + Date.now();
    setPayMethods(prev => [...prev, { id, label: 'Novo método', type: 'prazo', term: 45, discount: 0, icon: 'tag', tone: 'neutral', enabled: true, builtin: false }]);
    setEditingPay(id);
  };
  const removePay = (id) => setPayMethods(prev => prev.filter(m => m.id !== id));

  const updPlan = (id, patch) => setPlans(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  const addPlan = () => {
    const id = 'plan-' + Date.now();
    setPlans(prev => [...prev, { id, label: 'Novo plano', enabled: true, entryMethod: 'pix', entryPct: 30, instMethod: 'boleto', instCount: 6 }]);
    setEditingPlan(id);
  };
  const removePlan = (id) => setPlans(prev => prev.filter(p => p.id !== id));

  const [pricingMode, setPricingMode] = useState('default');
  const [globalDiscount, setGlobalDiscount] = useState(15);

  const [form, setForm] = useState(() => existing ? {
    cnpj: '12.345.678/0001-90', razao: existing.razao, code: existing.code,
    segment: existing.segment,
    city: existing.city.split(' / ')[0], uf: existing.city.split(' / ')[1] || 'SP',
    contact: 'Marina Reis', email: 'contato@' + existing.razao.toLowerCase().replace(/[^a-z]/g,'').slice(0,12) + '.com',
    phone: '(11) 98765-4321',
    status: existing.status,
    consultor: hubspotCtx.consultor,
  } : {
    cnpj: '', razao: '', code: autoCode,
    segment: 'Vending Machine',
    city: '', uf: 'SP',
    contact: '', email: '', phone: '',
    status: 'active',
    consultor: hubspotCtx.consultor,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  React.useEffect(() => { if (!isEdit) setForm(f => ({ ...f, code: autoCode })); }, [autoCode, isEdit]);

  const valid1 = form.cnpj.length >= 14 && form.razao && form.segment;
  const valid2 = form.contact && form.email;
  const valid3 = items.some(i => i.enabled);
  const valid4 = payMethods.some(m => m.enabled) || plans.some(p => p.enabled);

  const toggleItem = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  const updPrice = (id, val) => setItems(prev => prev.map(i => i.id === id ? { ...i, customPrice: parseFloat(val) || 0 } : i));
  const applyDiscount = (pct) => setItems(prev => prev.map(i => {
    const p = PRODUCTS.find(pp => pp.id === i.id);
    return { ...i, customPrice: Math.round((p.price || 0) * (1 - pct/100)) };
  }));

  const enabledCount = items.filter(i => i.enabled).length;
  const totalSavings = items.filter(i => i.enabled).reduce((a, i) => {
    const p = PRODUCTS.find(pp => pp.id === i.id);
    return a + ((p.price || 0) - i.customPrice);
  }, 0);

  const submit = () => {
    if (window.toast) window.toast(isEdit
      ? `Franquia ${form.razao} atualizada · ${enabledCount} produtos liberados`
      : `Franquia ${form.razao} criada · ${enabledCount} produtos liberados`);
    onClose();
  };

  const SEGMENTS = ['Vending Machine', 'Micromercado', 'Lavanderia', 'Diversão Eletrônica', 'Food Service', 'EV'];
  const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  const KIND_META = {
    franquia: { label: 'Franquia', code: 'NX', icon: 'building', desc: 'Cliente / franquia que compra no catálogo' },
    consultor:{ label: 'Consultor', code: 'CS', icon: 'user', desc: 'Vendedor interno · pode enviar pedidos para o cliente' },
    parceiro: { label: 'Parceiro', code: 'F0', icon: 'briefcase', desc: 'Revenda com estoque · movimentação por transferência' },
  };

  // ── Type picker (first screen for new registration) ──
  if (!kind) {
    return (
      <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal" style={{ maxWidth: 560 }}>
          <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>Novo cadastro</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>Que tipo de cadastro você quer criar?</div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(KIND_META).map(([k, m]) => (
              <button key={k} onClick={() => setKind(k)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                border: '1px solid var(--line-2)', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left',
                transition: 'all .15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--dark)'; e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--dark)', color: 'var(--accent)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={m.icon} size={20}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{m.label}</span>
                    <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{m.code}-####</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 3 }}>{m.desc}</div>
                </div>
                <Icon name="arrow-right" size={16} style={{ color: 'var(--text-3)' }}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const kindMeta = KIND_META[kind];

  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 780 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>Cadastro de {kindMeta.label.toLowerCase()}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                {isEdit ? 'Editar' : 'Novo'} {kindMeta.label.toLowerCase()} · {['Dados da empresa','Contato','Catálogo & preços','Pagamento'][step-1]}
              </div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['Empresa', 'Contato', 'Produtos', 'Pagamento'].map((s, i) => {
              const active = i+1 === step, done = i+1 < step;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: done || active ? 'var(--accent)' : 'rgba(255,255,255,0.10)', color: done || active ? 'var(--dark)' : 'rgba(255,255,255,0.5)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{done ? <Icon name="check" size={12} stroke={3}/> : i+1}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--accent)' : 'rgba(255,255,255,0.5)' }}>{s}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)', margin: '0 4px' }}/>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div style={{ padding: 28, minHeight: 360 }}>
          {step === 1 && kind !== 'consultor' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg, #FFF7ED, #FFF1DE)',
              border: '1px solid #FED7AA',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: 16,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, #FF7A59, #E5573C)', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="hubspot" size={15}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#C2570B', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Dados do HubSpot</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 600, marginTop: 2 }}>{hubspotCtx.franquia}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--iris)', color: 'white', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{hubspotCtx.consultorAvatar}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{hubspotCtx.consultor}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Consultor responsável</div>
                </div>
              </div>
            </div>
          )}
          {/* ── Step 1 · CONSULTOR — lista do HubSpot + segmento + código ── */}
          {step === 1 && kind === 'consultor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'linear-gradient(135deg, #FFF7ED, #FFF1DE)', border: '1px solid #FED7AA', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, #FF7A59, #E5573C)', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="hubspot" size={15}/></div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Selecione um consultor já cadastrado no <strong style={{ color: 'var(--text-1)' }}>HubSpot</strong> para liberar o acesso ao portal.</div>
              </div>
              <div>
                <label className="field-label">Consultor (HubSpot)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
                  {HS_CONSULTORS.map(c => (
                    <button key={c.email} type="button" onClick={() => { upd('contact', c.name); upd('email', c.email); upd('razao', c.name); }} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                      border: '1px solid ' + (form.email === c.email ? 'var(--dark)' : 'var(--line-2)'),
                      background: form.email === c.email ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.color, color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{c.av}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{c.email} · owner {c.owner}</div>
                      </div>
                      {form.email === c.email && <Icon name="check" size={15} stroke={3} style={{ color: 'var(--green-30)' }}/>}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="field-label">Segmento de atuação</label>
                  <select className="select" value={form.segment} onChange={e => upd('segment', e.target.value)}>{SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}</select>
                </div>
                <div>
                  <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Código</span>
                    <span style={{ color: 'var(--green-30)', fontSize: 10, fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>✓ gerado automaticamente</span>
                  </label>
                  <input className="input" value={form.code} readOnly style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', fontWeight: 600, background: 'var(--bg-surface-2)' }}/>
                </div>
              </div>
            </div>
          )}
          {step === 1 && kind !== 'consultor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="field-label">CNPJ</label>
                  <input className="input" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={e => upd('cnpj', e.target.value)} style={{ fontFamily: 'var(--font-mono)' }}/>
                </div>
                <div>
                  <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Código da franquia</span>
                    <span style={{ color: 'var(--green-30)', fontSize: 10, fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>✓ gerado automaticamente</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())} style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', fontWeight: 600, paddingRight: 40, background: 'var(--bg-surface-2)' }}/>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(form.code); if (window.toast) window.toast('Código copiado'); }} title="Copiar" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, display: 'grid', placeItems: 'center', color: 'var(--text-3)', borderRadius: 4 }}>
                      <Icon name="copy" size={13}/>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="field-label">Razão social</label>
                <input className="input" placeholder="Empresa LTDA" value={form.razao} onChange={e => upd('razao', e.target.value)}/>
              </div>
              <div>
                <label className="field-label">Segmento principal</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {SEGMENTS.map(s => (
                    <button key={s} onClick={() => upd('segment', s)} type="button" style={{
                      padding: '9px 10px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid ' + (form.segment === s ? 'var(--dark)' : 'var(--line-2)'),
                      background: form.segment === s ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                      fontSize: 12, fontWeight: 600,
                      color: form.segment === s ? 'var(--text-1)' : 'var(--text-2)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <div><label className="field-label">Cidade</label><input className="input" placeholder="São Paulo" value={form.city} onChange={e => upd('city', e.target.value)}/></div>
                <div>
                  <label className="field-label">UF</label>
                  <select className="select" value={form.uf} onChange={e => upd('uf', e.target.value)}>{UFS.map(u => <option key={u} value={u}>{u}</option>)}</select>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="field-label">Nome do responsável</label>
                <input className="input" placeholder="Nome completo" value={form.contact} onChange={e => upd('contact', e.target.value)}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10 }}>
                <div><label className="field-label">E-mail</label><input className="input" placeholder="contato@empresa.com" value={form.email} onChange={e => upd('email', e.target.value)}/></div>
                <div><label className="field-label">Telefone</label><input className="input" placeholder="(11) 90000-0000" value={form.phone} onChange={e => upd('phone', e.target.value)}/></div>
              </div>
              <div>
                <label className="field-label">Status inicial</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { id: 'active',   label: 'Ativa' },
                    { id: 'pending',  label: 'Pendente aprovação' },
                    { id: 'inactive', label: 'Inativa' },
                  ].map(s => (
                    <button key={s.id} type="button" onClick={() => upd('status', s.id)} style={{
                      flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid ' + (form.status === s.id ? 'var(--dark)' : 'var(--line-2)'),
                      background: form.status === s.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                      fontSize: 12.5, fontWeight: 600,
                      color: form.status === s.id ? 'var(--text-1)' : 'var(--text-2)',
                    }}>{s.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">Acesso ao portal · senha</label>
                <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', marginBottom: 10 }}>
                  {[{id:'email',l:'Enviar link por e-mail'},{id:'manual',l:'Definir senha agora'}].map(m => (
                    <button key={m.id} type="button" onClick={() => setPwMode(m.id)} style={{ flex: 1, padding: '7px 10px', borderRadius: 5, fontSize: 12, fontWeight: 600, background: pwMode === m.id ? 'var(--bg-surface)' : 'transparent', color: pwMode === m.id ? 'var(--text-1)' : 'var(--text-2)', boxShadow: pwMode === m.id ? 'var(--shadow-xs)' : 'none', border: '1px solid ' + (pwMode === m.id ? 'var(--line-1)' : 'transparent') }}>{m.l}</button>
                  ))}
                </div>
                {pwMode === 'manual' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div className="input-group"><Icon name="lock" size={14}/><input type="password" value={pw1} onChange={e => setPw1(e.target.value)} placeholder="Criar senha"/></div>
                    </div>
                    <div>
                      <div className="input-group" style={{ borderColor: pw2 && pw1 !== pw2 ? 'var(--red-30)' : undefined }}><Icon name="lock" size={14}/><input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Confirmar senha"/></div>
                    </div>
                    <div style={{ gridColumn: 'span 2', fontSize: 11, color: pw2 && pw1 !== pw2 ? 'var(--red-30)' : 'var(--text-3)' }}>
                      {pw2 && pw1 !== pw2 ? 'As senhas não coincidem.' : 'Mínimo 8 caracteres. O usuário poderá alterá-la no primeiro acesso.'}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 12.5, color: 'var(--text-2)', display: 'flex', gap: 10 }}>
                    <Icon name="mail" size={15} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 1 }}/>
                    Um link para <strong style={{ color: 'var(--text-1)' }}>criar a senha</strong> será enviado para <strong style={{ color: 'var(--text-1)' }}>{form.email || 'o e-mail informado'}</strong>. O acesso é liberado após a confirmação.
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                Selecione os produtos que aparecerão no catálogo desta franquia e ajuste os preços negociados.
              </div>

              {/* Pricing mode */}
              <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                {[
                  { id: 'default',  label: 'Preço de tabela' },
                  { id: 'discount', label: 'Desconto global' },
                  { id: 'custom',   label: 'Preços individuais' },
                ].map(m => (
                  <button key={m.id} type="button" onClick={() => { setPricingMode(m.id); if (m.id === 'default') applyDiscount(0); }} style={{
                    flex: 1, padding: '7px 10px',
                    borderRadius: 4,
                    fontSize: 12, fontWeight: 600,
                    background: pricingMode === m.id ? 'var(--bg-surface)' : 'transparent',
                    color: pricingMode === m.id ? 'var(--text-1)' : 'var(--text-2)',
                    boxShadow: pricingMode === m.id ? 'var(--shadow-xs)' : 'none',
                    border: '1px solid ' + (pricingMode === m.id ? 'var(--line-1)' : 'transparent'),
                  }}>{m.label}</button>
                ))}
              </div>

              {pricingMode === 'discount' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--accent-soft)', border: '1px solid var(--taxi-y-3)', borderRadius: 'var(--radius-sm)' }}>
                  <Icon name="tag" size={15} style={{ color: 'var(--yellow-00)' }}/>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Desconto sobre tabela:</span>
                  <input type="range" min="0" max="50" value={globalDiscount} onChange={e => { setGlobalDiscount(+e.target.value); applyDiscount(+e.target.value); }} style={{ flex: 1, accentColor: 'var(--dark)' }}/>
                  <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', minWidth: 60, textAlign: 'right' }}>−{globalDiscount}%</span>
                </div>
              )}

              {/* Products list */}
              <div style={{ border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 110px 110px', gap: 12, padding: '10px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--line-1)', fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <div></div>
                  <div>Produto</div>
                  <div style={{ textAlign: 'right' }}>Tabela</div>
                  <div style={{ textAlign: 'right' }}>Para franquia</div>
                </div>
                <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                  {PRODUCTS.map(p => {
                    const it = items.find(i => i.id === p.id);
                    const diff = (p.price || 0) - (it.customPrice || 0);
                    return (
                      <label key={p.id} style={{
                        display: 'grid', gridTemplateColumns: '32px 1fr 110px 110px', gap: 12,
                        padding: '10px 14px', borderBottom: '1px solid var(--line-1)',
                        alignItems: 'center', cursor: 'pointer',
                        opacity: it.enabled ? 1 : 0.5,
                      }}>
                        <input type="checkbox" checked={it.enabled} onChange={() => toggleItem(p.id)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}/>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                          <div className="cell-mono" style={{ fontSize: 10.5 }}>{p.sku} · {p.cat}</div>
                        </div>
                        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)', textDecoration: pricingMode !== 'default' && diff > 0 ? 'line-through' : 'none' }}>
                          {p.price > 0 ? fmtBRL(p.price) : '—'}
                        </div>
                        <div onClick={e => e.preventDefault()}>
                          {pricingMode === 'custom' ? (
                            <input
                              type="number"
                              value={it.customPrice}
                              onChange={e => updPrice(p.id, e.target.value)}
                              disabled={!it.enabled}
                              style={{
                                width: '100%', height: 30,
                                border: '1px solid var(--line-2)', borderRadius: 5,
                                padding: '0 8px',
                                fontFamily: 'var(--font-mono)', fontSize: 12,
                                fontWeight: 600,
                                textAlign: 'right',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-1)',
                              }}
                            />
                          ) : (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>{p.price > 0 ? fmtBRL(it.customPrice) : '—'}</div>
                              {diff > 0 && <div style={{ fontSize: 10, color: 'var(--green-30)', fontWeight: 600 }}>−{fmtBRLcurt(diff)}</div>}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface-2)', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-2)' }}><strong style={{ color: 'var(--text-1)' }}>{enabledCount}</strong> de {PRODUCTS.length} produtos liberados</span>
                  {totalSavings > 0 && <span style={{ color: 'var(--green-30)', fontWeight: 600 }}>Economia total: {fmtBRL(totalSavings)}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  Formas de pagamento liberadas para esta franquia. Edite prazos, descontos e parcelas — ou adicione regras customizadas.
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addCustomPay}><Icon name="plus" size={12}/> Customizada</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {payMethods.map(m => {
                  const isEditing = editingPay === m.id;
                  const subText = m.type === 'avista'
                    ? (m.discount > 0 ? `À vista · ${m.discount}% de desconto` : 'À vista')
                    : m.type === 'parcelado'
                      ? `Até ${m.installments || 12}× sem juros`
                      : `${m.term} dias para pagamento${m.discount > 0 ? ` · ${m.discount}% off` : ''}`;
                  return (
                    <div key={m.id} style={{
                      background: m.enabled ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                      border: '1px solid ' + (m.enabled ? 'var(--dark)' : 'var(--line-2)'),
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
                        <input type="checkbox" checked={m.enabled} onChange={() => updPay(m.id, { enabled: !m.enabled })} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}/>
                        <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--' + m.tone + '-soft, var(--neutral-80))', color: 'var(--' + m.tone + '-30, var(--text-2))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <Icon name={m.icon} size={14}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {m.label}
                            {!m.builtin && <span className="badge badge-purple" style={{ fontSize: 9 }}>Customizada</span>}
                            {m.type === 'prazo' && m.term > 0 && <span className="badge badge-neutral" style={{ fontSize: 10 }}>{m.term} dias</span>}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{subText}</div>
                        </div>
                        <button type="button" onClick={() => setEditingPay(isEditing ? null : m.id)} style={{ width: 28, height: 28, color: 'var(--text-3)', display: 'grid', placeItems: 'center', borderRadius: 4 }} title="Editar">
                          <Icon name={isEditing ? 'chevron-up' : 'sliders'} size={13}/>
                        </button>
                        {!m.builtin && (
                          <button type="button" onClick={() => removePay(m.id)} style={{ width: 28, height: 28, color: 'var(--red-30)', display: 'grid', placeItems: 'center' }} title="Remover">
                            <Icon name="trash" size={13}/>
                          </button>
                        )}
                      </div>
                      {isEditing && (
                        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--line-1)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 8, marginTop: 10 }}>
                            <div>
                              <label className="field-label" style={{ fontSize: 10.5 }}>Nome exibido</label>
                              <input className="input" style={{ height: 32, fontSize: 12 }} value={m.label} onChange={e => updPay(m.id, { label: e.target.value })}/>
                            </div>
                            <div>
                              <label className="field-label" style={{ fontSize: 10.5 }}>Tipo</label>
                              <select className="select" style={{ height: 32, fontSize: 12 }} value={m.type} onChange={e => updPay(m.id, { type: e.target.value })}>
                                <option value="avista">À vista</option>
                                <option value="parcelado">Parcelado</option>
                                <option value="prazo">A prazo</option>
                              </select>
                            </div>
                            {m.type === 'prazo' && (
                              <div>
                                <label className="field-label" style={{ fontSize: 10.5 }}>Prazo (dias)</label>
                                <input type="number" className="input" style={{ height: 32, fontSize: 12, fontFamily: 'var(--font-mono)' }} value={m.term} onChange={e => updPay(m.id, { term: +e.target.value || 0 })}/>
                              </div>
                            )}
                            {m.type === 'avista' && (
                              <div>
                                <label className="field-label" style={{ fontSize: 10.5 }}>Desconto (%)</label>
                                <input type="number" className="input" style={{ height: 32, fontSize: 12, fontFamily: 'var(--font-mono)' }} value={m.discount} onChange={e => updPay(m.id, { discount: +e.target.value || 0 })}/>
                              </div>
                            )}
                            {m.type === 'parcelado' && (
                              <div>
                                <label className="field-label" style={{ fontSize: 10.5 }}>Parcelas máx.</label>
                                <input type="number" className="input" style={{ height: 32, fontSize: 12, fontFamily: 'var(--font-mono)' }} value={m.installments || 12} onChange={e => updPay(m.id, { installments: +e.target.value || 1 })}/>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {payMethods.some(m => m.enabled && m.type === 'prazo') && (
                <div>
                  <label className="field-label">Limite de crédito autorizado</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>R$</span>
                    <input type="number" value={creditLimit} onChange={e => setCreditLimit(+e.target.value)} step="1000" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600 }}/>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>limite mensal</span>
                  </div>
                </div>
              )}

              {/* Planos com entrada + parcelas */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                  <div>
                    <div className="t-overline">Planos com entrada + parcelas</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>Configure planos compostos: entrada à vista + restante parcelado</div>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addPlan}><Icon name="plus" size={12}/> Novo plano</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {plans.map(p => {
                    const isE = editingPlan === p.id;
                    const methodLabels = { pix: 'PIX', cartao: 'Cartão', boleto: 'Boleto' };
                    return (
                      <div key={p.id} style={{
                        background: p.enabled ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                        border: '1px solid ' + (p.enabled ? 'var(--dark)' : 'var(--line-2)'),
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
                          <input type="checkbox" checked={p.enabled} onChange={() => updPlan(p.id, { enabled: !p.enabled })} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}/>
                          <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--iris-1)', color: 'var(--violet)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <Icon name="sliders" size={14}/>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                              <span><strong style={{ color: 'var(--text-1)' }}>{p.entryPct}%</strong> de entrada via <strong style={{ color: 'var(--text-1)' }}>{methodLabels[p.entryMethod]}</strong></span>
                              <span style={{ color: 'var(--neutral-60)' }}>+</span>
                              <span>restante em <strong style={{ color: 'var(--text-1)' }}>{p.instCount}×</strong> via <strong style={{ color: 'var(--text-1)' }}>{methodLabels[p.instMethod]}</strong></span>
                            </div>
                          </div>
                          <button type="button" onClick={() => setEditingPlan(isE ? null : p.id)} style={{ width: 28, height: 28, color: 'var(--text-3)', display: 'grid', placeItems: 'center' }} title="Editar">
                            <Icon name={isE ? 'chevron-up' : 'sliders'} size={13}/>
                          </button>
                          <button type="button" onClick={() => removePlan(p.id)} style={{ width: 28, height: 28, color: 'var(--red-30)', display: 'grid', placeItems: 'center' }} title="Remover">
                            <Icon name="trash" size={13}/>
                          </button>
                        </div>

                        {isE && (
                          <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--line-1)' }}>
                            <div style={{ marginTop: 10 }}>
                              <label className="field-label" style={{ fontSize: 10.5 }}>Nome do plano</label>
                              <input className="input" style={{ height: 32, fontSize: 12 }} value={p.label} onChange={e => updPlan(p.id, { label: e.target.value })}/>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                              {/* Entrada */}
                              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                                <div className="t-overline" style={{ marginBottom: 8, color: 'var(--green-30)' }}>Entrada</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  <div>
                                    <label className="field-label" style={{ fontSize: 10.5 }}>Forma</label>
                                    <select className="select" style={{ height: 32, fontSize: 12 }} value={p.entryMethod} onChange={e => updPlan(p.id, { entryMethod: e.target.value })}>
                                      <option value="pix">PIX</option>
                                      <option value="cartao">Cartão</option>
                                      <option value="boleto">Boleto à vista</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="field-label" style={{ fontSize: 10.5, display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Porcentagem da entrada</span>
                                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-30)', fontWeight: 700 }}>{p.entryPct}%</span>
                                    </label>
                                    <input type="range" min="0" max="100" step="5" value={p.entryPct} onChange={e => updPlan(p.id, { entryPct: +e.target.value })} style={{ width: '100%', accentColor: 'var(--dark)' }}/>
                                  </div>
                                </div>
                              </div>

                              {/* Parcelas */}
                              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                                <div className="t-overline" style={{ marginBottom: 8, color: 'var(--blue-30)' }}>Restante · {100 - p.entryPct}%</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  <div>
                                    <label className="field-label" style={{ fontSize: 10.5 }}>Forma das parcelas</label>
                                    <select className="select" style={{ height: 32, fontSize: 12 }} value={p.instMethod} onChange={e => updPlan(p.id, { instMethod: e.target.value })}>
                                      <option value="boleto">Boleto bancário</option>
                                      <option value="cartao">Cartão de crédito</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="field-label" style={{ fontSize: 10.5, display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Quantidade de parcelas</span>
                                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-30)', fontWeight: 700 }}>{p.instCount}×</span>
                                    </label>
                                    <input type="range" min="1" max="24" step="1" value={p.instCount} onChange={e => updPlan(p.id, { instCount: +e.target.value })} style={{ width: '100%', accentColor: 'var(--dark)' }}/>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Preview */}
                            <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, fontSize: 12 }}>
                              <span style={{ color: 'var(--text-on-inverse-2)' }}>Exemplo · pedido de <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>R$ 10.000</span>:</span>
                              <span><strong style={{ color: 'var(--accent)' }}>R$ {(10000 * p.entryPct/100).toFixed(0)}</strong> de entrada via {methodLabels[p.entryMethod]} + <strong style={{ color: 'var(--accent)' }}>{p.instCount}× R$ {((10000 * (100 - p.entryPct)/100) / p.instCount).toFixed(0)}</strong> via {methodLabels[p.instMethod]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {plans.length === 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-3)', padding: '14px 16px', border: '1px dashed var(--line-2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      Nenhum plano composto cadastrado — clique em "Novo plano" para criar
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '16px 28px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={() => step === 1 ? (isEdit ? onClose() : setKind(null)) : setStep(step - 1)}>
            <Icon name="arrow-left" size={14}/> {step === 1 ? (isEdit ? 'Cancelar' : 'Voltar') : 'Voltar'}
          </button>
          {step < 4 ? (
            <button className="btn btn-dark" onClick={() => setStep(step + 1)} disabled={step === 1 ? !valid1 : step === 2 ? !valid2 : !valid3}>
              Próximo <Icon name="arrow-right" size={14}/>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submit} disabled={!valid4}>
              <Icon name="check" size={14} stroke={3}/> {isEdit ? 'Salvar alterações' : 'Criar franquia'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

window.NewFranchiseModal = NewFranchiseModal;
