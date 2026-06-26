/* ════════════════════════════════════════════════════════
   Order History — list of past orders w/ detail expand
   ════════════════════════════════════════════════════════ */

const OrderHistory = ({ cart, setRoute, openCart }) => {
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  // allOrders carregado via API.Sales.listForClient()

  const filtered = allOrders.filter(o => filter === 'all' || o.status === filter);

  const counts = {
    all: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    confirmed: allOrders.filter(o => o.status === 'confirmed').length,
    shipped: allOrders.filter(o => o.status === 'shipped').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
  };

  const totalSpent = allOrders.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.total, 0);
  const avg = totalSpent / Math.max(1, allOrders.length);

  return (
    <div className="app-layout">
      <ClientSidebar route="history" setRoute={setRoute} cart={cart}/>
      <div className="app-main">
        <Topbar breadcrumb={[{ label: t('orders.title', 'Histórico de pedidos') }]} onCartClick={openCart} cartCount={cartCount}/>

        <div className="app-content">
          <PageHeader
            kicker={t('oh.kicker')}
            title={t('oh.title')}
            sub={t('oh.sub')}
            actions={
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast(t('orders.exported', 'Histórico exportado (CSV)'))}><Icon name="download" size={13}/> {t('common.export')}</button>
                <button className="btn btn-dark btn-sm" onClick={() => setRoute('catalog')}><Icon name="plus" size={13}/> {t('oh.newOrder')}</button>
              </>
            }
          />

          {/* KPI strip */}
          <div className="kpi-strip" style={{ marginBottom: 24 }}>
            <div className="kpi">
              <div className="label">{t('orders.kpiTotal', 'Pedidos totais')}</div>
              <div className="value">{allOrders.length}</div>
              <div className="delta delta-up"><Icon name="trending-up" size={12}/> {t('orders.deltaUp', '+3 vs. mês anterior')}</div>
            </div>
            <div className="kpi">
              <div className="label">{t('orders.kpiVolume', 'Volume acumulado')}</div>
              <div className="value t-mono">{fmtBRLcurt(totalSpent)}</div>
              <div className="delta delta-up"><Icon name="trending-up" size={12}/> +12%</div>
            </div>
            <div className="kpi">
              <div className="label">{t('orders.kpiTicket', 'Ticket médio')}</div>
              <div className="value t-mono">{fmtBRLcurt(avg)}</div>
              <div className="delta delta-down"><Icon name="trending-down" size={12}/> {t('orders.deltaDown', '−4% no mês')}</div>
            </div>
            <div className="kpi">
              <div className="label">{t('orders.kpiPending', 'Pendentes de aprovação')}</div>
              <div className="value" style={{ color: counts.pending ? 'var(--orange-50)' : 'var(--text-1)' }}>{counts.pending}</div>
              <div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="clock" size={12}/> {t('orders.follow', 'Acompanhar')}</div>
            </div>
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { id: 'all',       label: t('common.all') },
              { id: 'pending',   label: t('status.pending') },
              { id: 'confirmed', label: t('status.confirmed') },
              { id: 'shipped',   label: t('status.shipped') },
              { id: 'delivered', label: t('status.delivered') },
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
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: filter === f.id ? 'var(--accent)' : 'var(--neutral-80)', color: filter === f.id ? 'var(--neutral-15)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{counts[f.id] || 0}</span>
              </button>
            ))}
          </div>

          {/* Timeline list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(o => (
              <OrderRow key={o.id} order={o} expanded={expanded === o.id} toggle={() => setExpanded(expanded === o.id ? null : o.id)}/>
            ))}
            {filtered.length === 0 && (
              <div className="card card-pad-lg" style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--neutral-80)', display: 'grid', placeItems: 'center', margin: '0 auto 14px', color: 'var(--text-3)' }}>
                  <Icon name="receipt" size={24}/>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Nenhum pedido neste filtro</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Ajuste o filtro acima ou crie um novo pedido.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderRow = ({ order, expanded, toggle }) => {
  const meta = STATUS_META[order.status] || {};
  // pick some products for demo
  const items = PRODUCTS.slice(0, Math.min(4, order.items));

  return (
    <div className={'card ' + (expanded ? 'fade-up' : '')} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '110px 1fr 1fr 140px 100px 20px', alignItems: 'center', gap: 16, cursor: 'pointer' }}
           onClick={toggle}>
        <div>
          <div className="t-mono" style={{ fontSize: 13, fontWeight: 600 }}>{order.id}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmtDate(order.when)}</div>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{order.items} {order.items === 1 ? 'item' : 'itens'} · {order.method}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{t('orders.by', 'Pedido por')} {order.contact}</div>
        </div>
        <div>
          <StatusPill status={order.status}/>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{meta.desc || ''}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="t-mono" style={{ fontSize: 15, fontWeight: 700 }}>{fmtBRL(order.total)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); window.toast && window.toast('Baixando nota fiscal de ' + order.id); }} title="Baixar nota"><Icon name="download" size={13}/></button>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); window.setRoute && window.setRoute('catalog'); window.toast && window.toast('Itens de ' + order.id + ' adicionados ao novo pedido'); }} title="Repetir pedido"><Icon name="copy" size={13}/></button>
        </div>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={16} style={{ color: 'var(--text-3)' }}/>
      </div>

      {expanded && (
        <div style={{ padding: '8px 20px 20px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, marginTop: 16 }}>
            <div>
              <div className="t-overline" style={{ marginBottom: 10 }}>Itens do pedido</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(it => (
                  <div key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 10, background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--line-1)' }}><ProductVisual product={it}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
                      <div className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{it.sku}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>1 ×</div>
                    <div className="t-mono" style={{ fontSize: 13, fontWeight: 600, width: 90, textAlign: 'right' }}>{fmtBRL(it.price)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="t-overline" style={{ marginBottom: 10 }}>Linha do tempo</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                {[
                  { label: 'Pedido enviado',     date: fmtDateTime(order.when), done: true,  icon: 'check' },
                  { label: 'Pagamento aprovado',  date: '2026-05-22 16:10',     done: order.status !== 'pending', icon: 'check' },
                  { label: 'Em preparação',       date: '—',                    done: ['shipped','delivered'].includes(order.status), icon: 'box' },
                  { label: 'Enviado',             date: '—',                    done: ['shipped','delivered'].includes(order.status), icon: 'truck' },
                  { label: 'Entregue',            date: '—',                    done: order.status === 'delivered', icon: 'check' },
                ].map((step, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: step.done ? 'var(--neutral-15)' : 'var(--neutral-80)',
                        color: step.done ? 'var(--accent)' : 'var(--text-3)',
                        display: 'grid', placeItems: 'center',
                      }}>
                        <Icon name={step.icon} size={10} stroke={3}/>
                      </div>
                      {i < arr.length-1 && <div style={{ flex: 1, width: 1, background: step.done ? 'var(--neutral-15)' : 'var(--line-2)', minHeight: 12 }}/>}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: step.done ? 'var(--text-1)' : 'var(--text-3)' }}>{step.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => window.toast && window.toast('PDF de ' + order.id + ' baixado')}><Icon name="download" size={13}/> Baixar PDF</button>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => { window.setRoute && window.setRoute('catalog'); window.toast && window.toast('Itens adicionados ao novo pedido'); }}><Icon name="copy" size={13}/> Repetir pedido</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.OrderHistory = OrderHistory;
