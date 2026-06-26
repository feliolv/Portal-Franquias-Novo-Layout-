/* ════════════════════════════════════════════════════════
   Admin Shell — routes admin-* sub-pages
   ════════════════════════════════════════════════════════ */

const AdminShell = ({ route, setRoute }) => {
  const sub = route.replace('admin-', '');
  const meta = { dashboard: 'Visão geral', sales: 'Vendas', dealnayax: 'DealNayax', clients: 'Franquias', products: 'Produtos', bundles: 'Bundles', workflows: 'Workflows', hubspot: 'HubSpot', settings: 'Configurações', announce: 'Comunicados', tickets: 'Suporte', reports: 'Relatórios', audit: 'Auditoria' };

  let body;
  if (sub === 'dashboard') body = <AdminDashboard/>;
  else if (sub === 'sales') body = <AdminSalesClients/>;
  else if (sub === 'dealnayax') body = <AdminDealNayax/>;
  else if (sub === 'clients') body = <AdminClients/>;
  else if (sub === 'products') body = <AdminProducts/>;
  else if (sub === 'bundles') body = <AdminBundles/>;
  else if (sub === 'workflows') body = <AdminWorkflows/>;
  else if (sub === 'hubspot') body = <AdminHubSpot/>;
  else if (sub === 'announce') body = <AdminAnnounce/>;
  else if (sub === 'tickets') body = <AdminTickets/>;
  else if (sub === 'reports') body = <AdminReports/>;
  else if (sub === 'audit') body = <AdminAudit/>;
  else if (sub === 'settings') body = <AdminSettings/>;
  else body = <div className="card card-pad-lg">Sub-rota não encontrada.</div>;

  return (
    <div className="app-layout">
      <AdminSidebar route={route} setRoute={setRoute}/>
      <div className="app-main">
        <Topbar
          breadcrumb={[{ label: 'Backoffice', onClick: () => setRoute('admin-dashboard') }, { label: meta[sub] || sub }]}
          actions={
            <>
              <div className="input-group" style={{ width: 260, height: 34, padding: '0 10px' }}>
                <Icon name="search" size={13}/>
                <input placeholder="Buscar (Ctrl+K)" style={{ fontSize: 12.5 }}/>
                <kbd style={{ fontSize: 10, padding: '1px 5px', background: 'var(--neutral-80)', borderRadius: 3, fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>⌘K</kbd>
              </div>
              <button className="btn btn-ghost btn-sm" title="Notificações" onClick={() => window.toast && window.toast('Central de notificações — em breve')} style={{ position: 'relative', display: 'none' }}>
                <Icon name="bell" size={14}/>
                <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: 'var(--red-30)' }}/>
              </button>
              <NotifBell/>
              <LangPicker/>
            </>
          }
        />
        <div className="app-content">{body}</div>
      </div>
    </div>
  );
};

/* ─────── Admin Dashboard ─────── */
const AdminDashboard = () => {
  const { t } = useLang();
  const [period, setPeriod] = useState('month');
  const [feedOpen, setFeedOpen] = useState(false);

  const ACTIVITY = []; // carregado via API

  const VOL = []; // TODO: carregar via API
  const SEGMENTS      = []; // carregado via API
  const TOP_PRODUCTS  = []; // carregado via API
  const TOP_CLIENTS   = []; // carregado via API

  return (
    <>
      <PageHeader
        kicker={t('admin.kicker')}
        title={t('admin.dash.title')}
        sub={t('admin.dash.sub')}
        actions={
          <>
            <PeriodPicker value={period} onChange={setPeriod}/>
            <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Exportando dashboard (PDF)…')}><Icon name="download" size={13}/> {t('common.export')}</button>
          </>
        }
      />

      <div className="kpi-strip" style={{ marginBottom: 18 }}>
        <KpiCard label={t('admin.kpi.orders')}     value="248"        delta="+18%" up data={VOL} accent="dark"/>
        <KpiCard label={t('admin.kpi.revenue')}    value="R$ 1,42 M" delta="+24%" up data={VOL.map(v=>v*1.2)} accent="yellow"/>
        <KpiCard label={t('admin.kpi.avg')}        value="R$ 5.730"  delta="−4%"  data={VOL.map((v,i)=>v + Math.sin(i)*5)}/>
        <KpiCard label={t('admin.kpi.franchises')} value="312"        delta="+6"   up data={VOL.map(v=>v*0.6)}/>
      </div>

      {/* Row 1: Volume chart + Segments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div className="t-overline">{t('admin.dashboard.volumeTitle', 'Volume de pedidos · 30 dias')}</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 4 }}>R$ 1,42 M</div>
              <div style={{ fontSize: 12, color: 'var(--green-30)', fontWeight: 600 }}><Icon name="trending-up" size={11}/> +24% vs. 30 dias anteriores</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Legend color="var(--neutral-15)" label="Receita"/>
              <Legend color="var(--accent)" label="Meta"/>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <DualLineChart data={VOL} h={200}/>
          </div>
        </div>

        <div className="card card-pad">
          <div className="t-overline" style={{ marginBottom: 12 }}>{t('admin.dashboard.bySegment', 'Pedidos por segmento')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <DonutChart data={SEGMENTS} size={130} stroke={20}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SEGMENTS.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }}/>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top products + Top clients */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div className="t-overline">{t('admin.dashboard.topProducts', 'Top produtos por receita')}</div>
            <button className="btn btn-link btn-sm" onClick={() => window.setRoute && window.setRoute('admin-sales')} style={{ fontSize: 11.5, color: 'var(--text-link)' }}>{t('common.viewAll', 'Ver todos →')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TOP_PRODUCTS.map((p, i) => {
              const max = Math.max(...TOP_PRODUCTS.map(x => x.rev));
              return (
                <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 80px 80px', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < TOP_PRODUCTS.length-1 ? '1px solid var(--line-1)' : 'none' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>#{i+1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ height: 3, background: 'var(--neutral-80)', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: (p.rev/max*100)+'%', background: 'var(--neutral-15)', borderRadius: 2 }}/>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', textAlign: 'right' }}>{p.qty} un.</div>
                  <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmtBRLcurt(p.rev)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div className="t-overline">{t('admin.dashboard.franchiseRanking', 'Ranking de franquias')}</div>
            <button className="btn btn-link btn-sm" onClick={() => window.setRoute && window.setRoute('admin-clients')} style={{ fontSize: 11.5, color: 'var(--text-link)' }}>{t('common.viewAll', 'Ver todos →')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {TOP_CLIENTS.map((c, i) => (
              <div key={c.code} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < TOP_CLIENTS.length-1 ? '1px solid var(--line-1)' : 'none' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--neutral-80)', color: i === 0 ? 'var(--neutral-15)' : 'var(--text-2)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{c.code} · {c.orders} pedidos</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmtBRLcurt(c.rev)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent activity */}
      <div className="card card-pad">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <div className="t-overline">{t('admin.dashboard.recentActivity', 'Atividade recente')}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{t('admin.dashboard.events24h', 'Eventos do portal nas últimas 24 horas')}</div>
          </div>
          <button className="btn btn-link btn-sm" onClick={() => setFeedOpen(true)} style={{ fontSize: 11.5, color: 'var(--text-link)' }}>{t('admin.dashboard.viewFeed', 'Ver feed completo →')}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ACTIVITY.slice(0, 6).map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 4px', borderBottom: i < 5 ? '1px solid var(--line-1)' : 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--' + ev.tone + '-soft, var(--neutral-80))',
                color: 'var(--' + ev.tone + '-30, var(--text-2))',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name={ev.icon} size={13}/>
              </div>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--text-1)' }}>{ev.text}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{ev.time}</div>
            </div>
          ))}
        </div>
      </div>

      {feedOpen && (
        <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setFeedOpen(false)}>
          <div className="modal" style={{ maxWidth: 600, maxHeight: '86vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Feed de atividade</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Todos os eventos do portal</div>
              </div>
              <button onClick={() => setFeedOpen(false)} style={{ width: 30, height: 30, color: 'var(--text-3)' }}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ padding: '8px 24px', overflowY: 'auto' }}>
              {ACTIVITY.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < ACTIVITY.length-1 ? '1px solid var(--line-1)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--' + ev.tone + '-soft, var(--neutral-80))', color: 'var(--' + ev.tone + '-30, var(--text-2))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={ev.icon} size={13}/>
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--text-1)' }}>{ev.text}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{ev.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─────── Helpers ─────── */
const PeriodPicker = ({ value, onChange }) => {
  const { t } = useLang();
  const [customOpen, setCustomOpen] = React.useState(false);
  const [customStart, setCustomStart] = React.useState('');
  const [customEnd, setCustomEnd]     = React.useState('');
  const opts = [
    { id: 'today', label: t('admin.period.today', 'Hoje') },
    { id: 'week',  label: t('admin.period.week',  'Semana') },
    { id: 'month', label: t('admin.period.month', 'Mês') },
    { id: '3m',    label: t('admin.period.3m',    '3 meses') },
    { id: 'all',   label: t('admin.period.all',   'Tudo') },
  ];
  const btnStyle = (id) => ({
    padding: '5px 11px', fontSize: 12, fontWeight: 600, borderRadius: 5,
    background: value === id ? 'var(--dark)' : 'transparent',
    color: value === id ? 'var(--taxi-yellow)' : 'var(--text-2)',
    cursor: 'pointer', border: 'none',
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)', padding: 3 }}>
        {opts.map(o => (
          <button key={o.id} onClick={() => { onChange(o.id); setCustomOpen(false); }} style={btnStyle(o.id)}>{o.label}</button>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setCustomOpen(!customOpen)} style={{ ...btnStyle('custom'), background: value === 'custom' ? 'var(--dark)' : 'var(--bg-surface)', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)', padding: '5px 11px' }}>
          <Icon name="calendar" size={13}/> {value === 'custom' ? `${customStart} – ${customEnd}` : t('admin.period.custom', 'Personalizado')}
        </button>
        {customOpen && (
          <div style={{ position: 'absolute', right: 0, top: 36, background: 'var(--bg-surface-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-md)', padding: 16, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 240, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{t('admin.period.custom', 'Período personalizado')}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="input" style={{ fontSize: 12, padding: '4px 8px' }}/>
              <span style={{ color: 'var(--text-3)', fontSize: 12 }}>→</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="input" style={{ fontSize: 12, padding: '4px 8px' }}/>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { if (customStart && customEnd) { onChange('custom'); setCustomOpen(false); } }} style={{ alignSelf: 'flex-end' }}>
              {t('common.confirm')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, delta, up, data, accent }) => (
  <div className="kpi">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div className="label">{label}</div>
      <div style={{ marginRight: -6, marginTop: -2 }}>
        <SparkLine data={data} w={70} h={28} color={accent === 'yellow' ? 'var(--accent)' : 'var(--neutral-15)'}/>
      </div>
    </div>
    <div className="value t-mono">{value}</div>
    {delta && (
      <div className={'delta ' + (up ? 'delta-up' : (delta.startsWith('−') ? 'delta-down' : ''))}>
        <Icon name={up ? 'trending-up' : 'trending-down'} size={12}/> {delta}
      </div>
    )}
  </div>
);

const Legend = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-2)' }}>
    <span style={{ width: 10, height: 3, background: color, borderRadius: 2 }}/>
    {label}
  </div>
);

/* dual-line chart: revenue (filled) + target (dashed) */
const DualLineChart = ({ data, h = 180 }) => {
  const w = 600;
  const pad = { l: 0, r: 0, t: 8, b: 18 };
  const max = Math.max(...data) * 1.1;
  const inner = { w: w - pad.l - pad.r, h: h - pad.t - pad.b };
  const x = (i) => pad.l + (i / (data.length-1)) * inner.w;
  const y = (v) => pad.t + (1 - v/max) * inner.h;
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const area = path + ` L ${x(data.length-1)} ${pad.t+inner.h} L ${x(0)} ${pad.t+inner.h} Z`;
  const target = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v*1.05 + 4)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {/* grid lines */}
      {[0.25, 0.5, 0.75].map((g, i) => (
        <line key={i} x1={0} x2={w} y1={pad.t + g*inner.h} y2={pad.t + g*inner.h} stroke="var(--line-1)" strokeDasharray="3 4"/>
      ))}
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--neutral-15)" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="var(--neutral-15)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad1)"/>
      <path d={target} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4"/>
      <path d={path} fill="none" stroke="var(--neutral-15)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* x-axis labels */}
      {[0, Math.floor(data.length/4), Math.floor(data.length/2), Math.floor(3*data.length/4), data.length-1].map(i => (
        <text key={i} x={x(i)} y={h-2} fontSize="10" fill="var(--text-3)" textAnchor={i === 0 ? 'start' : i === data.length-1 ? 'end' : 'middle'}>{(i+1)+'/05'}</text>
      ))}
    </svg>
  );
};

window.AdminShell = AdminShell;
window.AdminDashboard = AdminDashboard;
window.PeriodPicker = PeriodPicker;
window.KpiCard = KpiCard;
window.DualLineChart = DualLineChart;
