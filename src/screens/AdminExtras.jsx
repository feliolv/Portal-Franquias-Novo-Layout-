/* ════════════════════════════════════════════════════════
   Admin: Comunicados, Auditoria, Suporte, Relatórios
   ════════════════════════════════════════════════════════ */

const ANNOUNCEMENTS = [
  { id: 'a1', title: 'Promoção: −15% em terminais VPOS', body: 'Válido até 31/05. Aplicável a pedidos confirmados via PIX.', placement: 'banner', audience: 'Todas', status: 'live',    starts: '2026-05-20', ends: '2026-05-31', views: 1284 },
  { id: 'a2', title: 'Manutenção programada · 28/05',    body: 'Plataforma indisponível das 02h às 04h para upgrade.',     placement: 'modal',  audience: 'Todas', status: 'scheduled', starts: '2026-05-28', ends: '2026-05-28', views: 0 },
  { id: 'a3', title: 'Novo: Kit Micromercado Pro',       body: 'Combo completo com VPOS + câmera + prateleira inteligente.', placement: 'banner', audience: 'Micromercado', status: 'live', starts: '2026-05-15', ends: '2026-06-15', views: 412 },
  { id: 'a4', title: 'Boas-vindas franquia',             body: 'Mensagem inicial para novas franquias após primeiro login.', placement: 'modal', audience: 'Novas', status: 'live', starts: '—', ends: '—', views: 12 },
  { id: 'a5', title: 'Black Friday 2026',                body: 'Programar campanha para novembro.',                           placement: 'banner', audience: 'Todas', status: 'draft', starts: '—', ends: '—', views: 0 },
];

const AdminAnnounce = () => {
  const [filter, setFilter] = useState('all');
  const [newOpen, setNewOpen] = useState(false);
  const counts = { all: ANNOUNCEMENTS.length, live: ANNOUNCEMENTS.filter(a => a.status === 'live').length, scheduled: ANNOUNCEMENTS.filter(a => a.status === 'scheduled').length, draft: ANNOUNCEMENTS.filter(a => a.status === 'draft').length };
  const rows = ANNOUNCEMENTS.filter(a => filter === 'all' || a.status === filter);
  const STATUS_M = { live: { c: 'var(--green-30)', bg: 'var(--green-soft)', l: 'No ar' }, scheduled: { c: 'var(--orange-30)', bg: 'var(--orange-soft)', l: 'Agendado' }, draft: { c: 'var(--text-3)', bg: 'var(--neutral-80)', l: 'Rascunho' } };

  return (
    <>
      <PageHeader
        kicker="Comunicação"
        title="Comunicados & banners"
        sub="Avisos, promoções e modais que aparecem no portal das franquias."
        actions={<button className="btn btn-dark btn-sm" onClick={() => setNewOpen(true)}><Icon name="plus" size={13}/> Novo comunicado</button>}
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { id: 'all',       label: 'Todos' },
          { id: 'live',      label: 'No ar' },
          { id: 'scheduled', label: 'Agendados' },
          { id: 'draft',     label: 'Rascunhos' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            height: 30, padding: '0 12px', borderRadius: 'var(--radius-pill)',
            fontSize: 12.5, fontWeight: 600,
            border: '1px solid ' + (filter === f.id ? 'var(--dark)' : 'var(--line-2)'),
            background: filter === f.id ? 'var(--dark)' : 'var(--bg-surface)',
            color: filter === f.id ? 'white' : 'var(--text-1)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>{f.label} <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: filter === f.id ? 'var(--accent)' : 'var(--neutral-80)', color: filter === f.id ? 'var(--dark)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{counts[f.id]}</span></button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
        {rows.map(a => {
          const sm = STATUS_M[a.status];
          return (
            <div key={a.id} className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="badge badge-purple" style={{ fontSize: 10 }}>{a.placement === 'banner' ? '📣 Banner' : '🪧 Modal'}</span>
                  <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 999, background: sm.bg, color: sm.c, fontWeight: 600 }}>{sm.l}</span>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }} onClick={() => window.toast && window.toast('Opções do comunicado — em breve')}><Icon name="more" size={13}/></button>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>{a.body}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--line-1)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 10px' }}><div className="t-overline" style={{ fontSize: 9 }}>t('admin.announce.public', 'Público')</div><div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{a.audience}</div></div>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 10px' }}><div className="t-overline" style={{ fontSize: 9 }}>t('common.period', 'Período')</div><div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 2 }}>{a.starts}{a.ends !== '—' && a.ends !== a.starts ? ' → ' + a.ends : ''}</div></div>
                <div style={{ background: 'var(--bg-surface)', padding: '8px 10px' }}><div className="t-overline" style={{ fontSize: 9 }}>t('admin.announce.views', 'Visualizações')</div><div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, fontFamily: 'var(--font-mono)' }}>{a.views.toLocaleString('pt-BR')}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Icon name="edit" size={12}/> Editar</button>
                <button className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="copy" size={13}/></button>
                <button className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }} onClick={async () => { const ok = await window.confirmAction({ title: 'Excluir comunicado?', body: 'Esta ação não pode ser desfeita.', danger: true }); if (ok) window.toast && window.toast('Comunicado excluído'); }}><Icon name="trash" size={13}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ────── Audit Log ────── */
const AUDIT = [
  { id: 1, who: 'Renata G.',      action: 'Editou preço de VPOS IoT Onyx',       target: 'VPOS-NYX-IO',  detail: 'R$ 1.490 → R$ 1.290',           when: '2026-05-22T10:32', ip: '187.84.12.4',  type: 'price' },
  { id: 2, who: 'Felipe Andrade', action: 'Aprovou pedido',                       target: '#PD-10428',     detail: 'Vending Premier · R$ 8.450',    when: '2026-05-22T09:18', ip: '177.103.55.1', type: 'approve' },
  { id: 3, who: 'Renata G.',      action: 'Criou franquia',                       target: 'NX-1129',       detail: 'Snack Já Distribuidora',        when: '2026-05-21T16:45', ip: '187.84.12.4',  type: 'create' },
  { id: 4, who: 'Camila Souza',   action: 'Importou produtos do HubSpot',         target: '3 SKUs',        detail: 'VM-CFR-PRO + 2 outros',         when: '2026-05-21T11:12', ip: '189.20.4.10',  type: 'import' },
  { id: 5, who: 'Bruno Tavares',  action: 'Editou bundle',                        target: 'BND-VEND-START',detail: 'Preço R$ 1.890 → R$ 1.790',     when: '2026-05-20T14:55', ip: '189.20.4.10',  type: 'edit' },
  { id: 6, who: 'Renata G.',      action: 'Removeu membro da equipe',             target: 'lucas.m@…',     detail: 'Papel: Consultor',              when: '2026-05-19T17:30', ip: '187.84.12.4',  type: 'delete' },
  { id: 7, who: 'Felipe Andrade', action: 'Alterou política de pagamento',        target: 'NX-7842',       detail: 'Habilitou Fatura 60d',          when: '2026-05-19T10:15', ip: '177.103.55.1', type: 'edit' },
  { id: 8, who: 'Renata G.',      action: 'Conectou integração',                  target: 'Slack',         detail: 'Canal #vendas-nayax',           when: '2026-05-18T09:42', ip: '187.84.12.4',  type: 'integration' },
  { id: 9, who: 'Camila Souza',   action: 'Aprovou pedido',                       target: '#PD-10425',     detail: 'Brasil Vending · R$ 16.590',    when: '2026-05-17T15:20', ip: '189.20.4.10',  type: 'approve' },
  { id:10, who: 'Sistema',        action: 'Sincronização HubSpot automática',    target: '128 produtos',  detail: '3 novos · 2 atualizados',       when: '2026-05-17T03:00', ip: '—',            type: 'system' },
];

const AdminAudit = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const types = ['all', 'price', 'approve', 'create', 'edit', 'delete', 'import', 'integration', 'system'];
  const rows = AUDIT.filter(a => (filter === 'all' || a.type === filter) && (search === '' || (a.who + ' ' + a.action + ' ' + a.target).toLowerCase().includes(search.toLowerCase())));
  const ICONS = { price: 'tag', approve: 'check', create: 'plus', edit: 'edit', delete: 'trash', import: 'download', integration: 'plug', system: 'sparkles' };
  const COLORS = { price: 'var(--accent)', approve: 'var(--green-50)', create: 'var(--iris)', edit: 'var(--blue-50)', delete: 'var(--coral)', import: 'var(--accent)', integration: 'var(--iris)', system: 'var(--gray-1)' };

  return (
    <>
      <PageHeader
        kicker="Sistema · Segurança"
        title="Auditoria"
        sub="Log de todas as ações administrativas no portal · retenção de 90 dias."
        actions={<button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Exportando log de auditoria (CSV)…')}><Icon name="download" size={13}/> Exportar log</button>}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="input-group" style={{ width: 280, height: 34 }}>
          <Icon name="search" size={13}/>
          <input placeholder="Buscar por usuário, ação ou alvo…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 12.5 }}/>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              height: 28, padding: '0 10px', borderRadius: 'var(--radius-pill)',
              fontSize: 11.5, fontWeight: 600,
              border: '1px solid ' + (filter === t ? 'var(--dark)' : 'var(--line-2)'),
              background: filter === t ? 'var(--dark)' : 'transparent',
              color: filter === t ? 'white' : 'var(--text-2)',
              textTransform: 'capitalize',
            }}>{t === 'all' ? 'Todos' : t}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {rows.map((a, i) => (
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 200px 160px', gap: 14, padding: '14px 18px', alignItems: 'center', borderBottom: i < rows.length-1 ? '1px solid var(--line-1)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS[a.type] + '22', color: COLORS[a.type], display: 'grid', placeItems: 'center' }}>
              <Icon name={ICONS[a.type] || 'edit'} size={14}/>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-1)' }}><strong>{a.who}</strong> {a.action.toLowerCase()} <span className="t-mono" style={{ background: 'var(--bg-surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 11.5 }}>{a.target}</span></div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{a.detail}</div>
            </div>
            <div className="cell-mono" style={{ fontSize: 11.5 }}>IP {a.ip}</div>
            <div className="cell-mono" style={{ fontSize: 11.5, textAlign: 'right' }}>{fmtDateTime(a.when)}</div>
          </div>
        ))}
        {rows.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>t('common.empty')</div>}
      </div>
    </>
  );
};

/* ────── Admin Tickets ────── */
const ADMIN_TICKETS = [
  { id: '#T-2841', client: 'Vending Premier Ltda.', code: 'NX-7842', subject: 'Terminal não conecta no 4G', cat: 'Técnico',  priority: 'high', status: 'open',   updated: '2026-05-22T14:20', assignee: 'Bruno T.' },
  { id: '#T-2840', client: 'Brasil Vending Group SA', code: 'NX-8842', subject: 'Cobrança duplicada de frete', cat: 'Financeiro',  priority: 'high', status: 'open',   updated: '2026-05-22T11:18', assignee: '—' },
  { id: '#T-2839', client: 'LavaBem Self-service', code: 'NX-9021', subject: 'Pedido extra de adesivos', cat: 'Comercial',  priority: 'low', status: 'open',   updated: '2026-05-21T17:45', assignee: 'Felipe A.' },
  { id: '#T-2837', client: 'Vending Premier Ltda.', code: 'NX-7842', subject: 'Reajuste de preço VPOS', cat: 'Financeiro', priority: 'med', status: 'wait', updated: '2026-05-20T09:14', assignee: 'Camila S.' },
  { id: '#T-2822', client: 'EcoMov Estações Elétricas SA', code: 'NX-3318', subject: 'Nota fiscal pedido #PD-10422', cat: 'Financeiro', priority: 'low', status: 'closed', updated: '2026-05-15T11:30', assignee: 'Camila S.' },
];

const AdminTickets = () => {
  const [filter, setFilter] = useState('all');
  const counts = { all: ADMIN_TICKETS.length, open: ADMIN_TICKETS.filter(t => t.status === 'open').length, wait: ADMIN_TICKETS.filter(t => t.status === 'wait').length, closed: ADMIN_TICKETS.filter(t => t.status === 'closed').length };
  const rows = ADMIN_TICKETS.filter(t => filter === 'all' || t.status === filter);
  const PM = { high: { c: 'var(--red-30)', bg: 'var(--red-soft)', l: 'Alta' }, med: { c: 'var(--orange-30)', bg: 'var(--orange-soft)', l: 'Média' }, low: { c: 'var(--green-30)', bg: 'var(--green-soft)', l: 'Baixa' } };
  const SM = { open: { c: 'var(--iris)', bg: 'var(--iris-1)', l: 'Aberto' }, wait: { c: 'var(--orange-30)', bg: 'var(--orange-soft)', l: 'Aguardando cliente' }, closed: { c: 'var(--text-3)', bg: 'var(--neutral-80)', l: 'Resolvido' } };

  return (
    <>
      <PageHeader
        kicker="Atendimento"
        title="Suporte ao cliente"
        sub={`${counts.open} chamados abertos · tempo médio de resposta: 1h 42min`}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Exportando chamados (CSV)…')}><Icon name="download" size={13}/> Exportar</button>}
      />

      <div className="kpi-strip" style={{ marginBottom: 18 }}>
        <div className="kpi"><div className="label">Abertos</div><div className="value" style={{ color: 'var(--iris)' }}>{counts.open}</div><div className="delta delta-up"><Icon name="trending-up" size={12}/> +2 hoje</div></div>
        <div className="kpi"><div className="label">Aguardando cliente</div><div className="value" style={{ color: 'var(--orange-50)' }}>{counts.wait}</div><div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="clock" size={12}/> Pendente resposta</div></div>
        <div className="kpi"><div className="label">Resolvidos no mês</div><div className="value" style={{ color: 'var(--green-30)' }}>34</div><div className="delta delta-up"><Icon name="trending-up" size={12}/> +12%</div></div>
        <div className="kpi"><div className="label">CSAT médio</div><div className="value t-mono">4.7<span style={{ fontSize: 14, color: 'var(--text-3)', fontFamily: 'var(--font-sans)' }}> / 5</span></div><div className="delta delta-up"><Icon name="star" size={12}/> Excelente</div></div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { id: 'all',    label: 'Todos' },
          { id: 'open',   label: t('support.open', 'Abertos') },
          { id: 'wait',   label: 'Aguardando' },
          { id: 'closed', label: t('support.resolved', 'Resolvidos') },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            height: 30, padding: '0 12px', borderRadius: 'var(--radius-pill)',
            fontSize: 12.5, fontWeight: 600,
            border: '1px solid ' + (filter === f.id ? 'var(--dark)' : 'var(--line-2)'),
            background: filter === f.id ? 'var(--dark)' : 'var(--bg-surface)',
            color: filter === f.id ? 'white' : 'var(--text-1)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>{f.label} <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: filter === f.id ? 'var(--accent)' : 'var(--neutral-80)', color: filter === f.id ? 'var(--dark)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{counts[f.id]}</span></button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="t">
          <thead><tr><th>{t('support.ticket', 'Chamado')}</th><th>Cliente</th><th>{t('support.subject', 'Assunto')}</th><th>Categoria</th><th>{t('support.priority', 'Prioridade')}</th><th>Atribuído</th><th>Status</th><th>Atualizado</th></tr></thead>
          <tbody>
            {rows.map(t => {
              const pm = PM[t.priority], sm = SM[t.status];
              return (
                <tr key={t.id}>
                  <td className="cell-mono" style={{ fontWeight: 600 }}>{t.id}</td>
                  <td><div style={{ fontWeight: 600 }}>{t.client}</div><div className="cell-mono">{t.code}</div></td>
                  <td>{t.subject}</td>
                  <td><span className="badge badge-neutral">{t.cat}</span></td>
                  <td><span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: pm.bg, color: pm.c }}>{pm.l}</span></td>
                  <td style={{ fontSize: 12 }}>{t.assignee}</td>
                  <td><span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: sm.bg, color: sm.c }}>{sm.l}</span></td>
                  <td className="cell-mono">{fmtDateTime(t.updated)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ────── Admin Reports ────── */
const AdminReports = () => {
  const [picked, setPicked] = useState(null);
  const TEMPLATES = [
    { id: 'sales',     icon: 'bar-chart',  color: 'var(--dark)',    title: 'Relatório de vendas',          sub: 'Pedidos, receita, ticket médio por período' },
    { id: 'franchise', icon: 'building',    color: 'var(--iris)',    title: 'Performance por franquia',     sub: 'Ranking, LTV, frequência de compra' },
    { id: 'product',   icon: 'package',     color: 'var(--accent)',  title: 'Top produtos & estoque',       sub: 'Mais vendidos, ruptura, margem' },
    { id: 'segment',   icon: 'pie-chart',   color: 'var(--spring)',  title: 'Desempenho por segmento',      sub: 'Vending, Micromercado, EV, etc.' },
    { id: 'team',      icon: 'users',       color: 'var(--violet)',  title: 'Performance da equipe',        sub: 'Pedidos aprovados por consultor/coordenador' },
    { id: 'financial', icon: 'dollar',      color: 'var(--coral)',   title: 'Financeiro',                    sub: 'Inadimplência, formas de pagamento, fluxo' },
  ];

  return (
    <>
      <PageHeader
        kicker="Insights"
        title="Relatórios"
        sub="Gere relatórios customizados com filtros · exporte em PDF ou Excel."
        actions={<button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Histórico de exports — em breve')}><Icon name="clock" size={13}/> Histórico de exports</button>}
      />

      <div className="t-overline" style={{ marginBottom: 12 }}>Modelos disponíveis</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 28 }}>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setPicked(t)} className="card" style={{
            padding: 18, textAlign: 'left',
            border: '1px solid ' + (picked?.id === t.id ? 'var(--dark)' : 'var(--line-1)'),
            background: picked?.id === t.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: t.color, color: 'white', display: 'grid', placeItems: 'center' }}>
                <Icon name={t.icon} size={18}/>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.title}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{t.sub}</div>
          </button>
        ))}
      </div>

      {picked && (
        <div className="card card-pad-lg fade-up" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: picked.color, color: 'white', display: 'grid', placeItems: 'center' }}><Icon name={picked.icon} size={16}/></div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{picked.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Configure os filtros e gere o relatório</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div><label className="field-label">Período</label><select className="select"><option>Últimos 7 dias</option><option>Últimos 30 dias</option><option>Este mês</option><option>Mês anterior</option><option>Personalizado</option></select></div>
            <div><label className="field-label">Segmento</label><select className="select"><option>Todos</option><option>Vending Machine</option><option>Micromercado</option><option>Lavanderia</option><option>Diversão Eletrônica</option><option>Food Service</option><option>EV</option></select></div>
            <div><label className="field-label">Comparar com</label><select className="select"><option>—</option><option>Período anterior</option><option>Mesmo período ano passado</option></select></div>
          </div>

          <div>
            <label className="field-label">Métricas incluídas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Receita', 'Pedidos', 'Ticket médio', 'Conversão', 'Franquias ativas', 'Frete', 'Inadimplência', 'Margem'].map((m, i) => (
                <label key={m} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: i < 4 ? 'var(--accent-soft)' : 'var(--bg-surface)' }}>
                  <input type="checkbox" defaultChecked={i < 4} style={{ accentColor: 'var(--accent)' }}/> {m}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line-1)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Formato de export · disponibilidade: imediata</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Visualização aberta em nova aba')}><Icon name="eye" size={13}/> Pré-visualizar</button>
              <button className="btn btn-dark btn-sm" onClick={() => window.toast && window.toast('Excel exportado · enviado por e-mail')}><Icon name="download" size={13}/> Excel</button>
              <button className="btn btn-primary btn-sm" onClick={() => window.toast && window.toast('PDF gerado · 12 páginas')}><Icon name="download" size={13}/> PDF</button>
            </div>
          </div>
        </div>
      )}

      <div className="t-overline" style={{ marginBottom: 10 }}>Exports recentes</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {[
          { name: 'Vendas — Mai/2026',         who: 'Renata G.', when: '2026-05-22 09:30', size: '420 KB', format: 'PDF' },
          { name: 'Top produtos — abril',      who: 'Felipe A.', when: '2026-05-02 11:14', size: '180 KB', format: 'XLSX' },
          { name: 'Performance Time SP — Q2',  who: 'Renata G.', when: '2026-04-30 17:42', size: '610 KB', format: 'PDF' },
        ].map((r, i, arr) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 140px 100px 100px 100px', gap: 12, padding: '12px 18px', alignItems: 'center', borderBottom: i < arr.length-1 ? '1px solid var(--line-1)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: r.format === 'PDF' ? 'var(--red-30)' : 'var(--green-30)', color: 'white', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>{r.format}</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>por {r.who}</div>
            <div className="cell-mono">{r.size}</div>
            <div className="cell-mono">{r.when.split(' ')[0]}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }}><Icon name="download" size={13}/></button>
              <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }}><Icon name="more" size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

window.AdminAnnounce = AdminAnnounce;
window.AdminAudit = AdminAudit;
window.AdminTickets = AdminTickets;
window.AdminReports = AdminReports;
