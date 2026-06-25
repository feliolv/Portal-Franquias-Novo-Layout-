/* ════════════════════════════════════════════════════════
   Admin: Workflows — automações tipo Make/Zapier
   ════════════════════════════════════════════════════════ */

const WF_TRIGGERS = [
  { id: 'order_new',       label: 'Novo pedido criado',           icon: 'cart',     tone: 'iris' },
  { id: 'order_approved',  label: 'Pedido aprovado',              icon: 'check',    tone: 'spring' },
  { id: 'order_shipped',   label: 'Pedido enviado',               icon: 'truck',    tone: 'iris' },
  { id: 'order_cancelled', label: 'Pedido cancelado',             icon: 'x',        tone: 'coral' },
  { id: 'fran_new',        label: 'Nova franquia cadastrada',     icon: 'building', tone: 'accent' },
  { id: 'fran_inactive',   label: 'Franquia sem pedidos 30d',     icon: 'clock',    tone: 'coral' },
  { id: 'hs_failed',       label: 'Sync HubSpot falhou',          icon: 'alert',    tone: 'coral' },
  { id: 'product_low',     label: 'Estoque baixo de produto',     icon: 'package',  tone: 'orange' },
  { id: 'ticket_new',      label: 'Novo chamado de suporte',      icon: 'help',     tone: 'iris' },
  { id: 'schedule',        label: 'Agendamento (cron)',           icon: 'clock',    tone: 'gray-1' },
];

const WF_ACTIONS = [
  { id: 'email',     label: 'Enviar e-mail',              icon: 'mail',     tone: 'iris' },
  { id: 'slack',     label: 'Postar no Slack',            icon: 'bell',     tone: 'violet' },
  { id: 'hubspot',   label: 'Criar deal no HubSpot',      icon: 'hubspot',  tone: 'coral' },
  { id: 'whatsapp',  label: 'Enviar WhatsApp',            icon: 'phone',    tone: 'spring' },
  { id: 'webhook',   label: 'Disparar webhook',           icon: 'external', tone: 'gray-1' },
  { id: 'assign',    label: 'Atribuir a um consultor',    icon: 'user',     tone: 'iris' },
  { id: 'tag',       label: 'Adicionar tag à franquia',   icon: 'tag',      tone: 'accent' },
  { id: 'task',      label: 'Criar tarefa interna',       icon: 'check',    tone: 'spring' },
];

const WORKFLOWS = [
  { id: 'w1', name: 'Notificar Slack em novo pedido > R$ 10k', trigger: 'order_new', actions: ['slack'], status: 'active', runs: 142, lastRun: '2026-05-22T14:33', success: 99.3 },
  { id: 'w2', name: 'Reenviar ao HubSpot em caso de erro',     trigger: 'hs_failed', actions: ['hubspot'], status: 'active', runs: 8, lastRun: '2026-05-22T11:02', success: 87.5 },
  { id: 'w3', name: 'E-mail de boas-vindas para nova franquia',trigger: 'fran_new',  actions: ['email','task'], status: 'active', runs: 28, lastRun: '2026-05-21T16:48', success: 100 },
  { id: 'w4', name: 'Notificar WhatsApp Marina em pedido NX-7842', trigger: 'order_new', actions: ['whatsapp'], status: 'paused', runs: 24, lastRun: '2026-05-20T09:14', success: 100 },
  { id: 'w5', name: 'Alerta estoque baixo via Slack',          trigger: 'product_low', actions: ['slack','email'], status: 'active', runs: 6, lastRun: '2026-05-22T10:00', success: 100 },
  { id: 'w6', name: 'Reativação · franquias inativas 30d',     trigger: 'fran_inactive', actions: ['email','assign'], status: 'draft', runs: 0, lastRun: null, success: 0 },
];

const WF_TEMPLATES = [
  { id: 't1', title: 'Slack ao novo pedido',          desc: 'Posta resumo no canal #vendas', icon: 'bell', from: 'order_new', to: ['slack'] },
  { id: 't2', title: 'WhatsApp ao cliente',           desc: 'Confirma envio direto no número da franquia', icon: 'phone', from: 'order_shipped', to: ['whatsapp'] },
  { id: 't3', title: 'Onboarding de franquia',         desc: 'E-mail + tarefa + atribuir consultor', icon: 'building', from: 'fran_new', to: ['email','task','assign'] },
  { id: 't4', title: 'Recuperação de venda perdida',   desc: 'E-mail após cancelamento', icon: 'refresh', from: 'order_cancelled', to: ['email','task'] },
  { id: 't5', title: 'Alerta de erro HubSpot',         desc: 'Slack + reenvio automático', icon: 'alert', from: 'hs_failed', to: ['slack','hubspot'] },
  { id: 't6', title: 'Relatório semanal automático',   desc: 'Toda segunda 09h por e-mail', icon: 'mail', from: 'schedule', to: ['email'] },
];

const AdminWorkflows = () => {
  const [tab, setTab] = useState('myflows'); // myflows | templates | runs
  const [items, setItems] = useState(WORKFLOWS);
  const [editing, setEditing] = useState(null); // null | 'new' | wf

  const counts = {
    all: items.length,
    active: items.filter(i => i.status === 'active').length,
    paused: items.filter(i => i.status === 'paused').length,
    draft: items.filter(i => i.status === 'draft').length,
  };
  const totalRuns = items.reduce((a, i) => a + i.runs, 0);
  const avgSuccess = items.filter(i => i.runs > 0).reduce((a, i) => a + i.success, 0) / Math.max(1, items.filter(i => i.runs > 0).length);

  const toggleStatus = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'paused' : 'active' } : i));
  const removeWf = async (id) => {
    const ok = await window.confirmAction({ title: 'Excluir workflow?', body: 'A automação será removida permanentemente.', danger: true });
    if (ok) { setItems(prev => prev.filter(i => i.id !== id)); window.toast && window.toast('Workflow excluído'); }
  };

  return (
    <>
      <PageHeader
        kicker="Automação"
        title="Workflows"
        sub="Crie automações que reagem a eventos do portal e executam ações em Slack, HubSpot, e-mail e mais."
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setTab('templates')}><Icon name="sparkles" size={13}/> Templates</button>
            <button className="btn btn-dark btn-sm" onClick={() => setEditing('new')}><Icon name="plus" size={13}/> Novo workflow</button>
          </>
        }
      />

      <div className="kpi-strip" style={{ marginBottom: 18 }}>
        <div className="kpi"><div className="label">Workflows ativos</div><div className="value">{counts.active}</div><div className="delta delta-up"><Icon name="zap" size={12}/> {counts.draft} em rascunho</div></div>
        <div className="kpi"><div className="label">Execuções no mês</div><div className="value t-mono">{totalRuns.toLocaleString('pt-BR')}</div><div className="delta delta-up"><Icon name="trending-up" size={12}/> +24%</div></div>
        <div className="kpi"><div className="label">Taxa de sucesso</div><div className="value" style={{ color: 'var(--green-30)' }}>{avgSuccess.toFixed(1)}%</div><div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="check" size={12}/> Estável</div></div>
        <div className="kpi"><div className="label">Tempo economizado</div><div className="value t-mono">42h</div><div className="delta" style={{ color: 'var(--text-2)' }}><Icon name="clock" size={12}/> estimativa</div></div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: '1px solid var(--line-1)' }}>
        {[
          { id: 'myflows',   label: t('workflows.mine', 'Meus workflows'), count: counts.all },
          { id: 'templates', label: t('workflows.templates', 'Templates'),      count: WF_TEMPLATES.length },
          { id: 'runs',      label: {t('workflows.executions', 'Execuções')},      count: totalRuns },
        ].map(tabItem => (
          <button key={tabItem.id} onClick={() => setTab(tabItem.id)} style={{
            padding: '10px 14px',
            fontSize: 13, fontWeight: 600,
            color: tab === tabItem.id ? 'var(--text-1)' : 'var(--text-3)',
            borderBottom: '2px solid ' + (tab === tabItem.id ? 'var(--accent)' : 'transparent'),
            marginBottom: -1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tabItem.label}
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: 'var(--neutral-80)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{tabItem.count}</span>
          </button>
        ))}
      </div>

      {tab === 'myflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(w => {
            const trig = WF_TRIGGERS.find(t => t.id === w.trigger);
            return (
              <div key={w.id} className="card" style={{ padding: 16, display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--line-1)',
                  display: 'grid', placeItems: 'center', position: 'relative',
                }}>
                  <Icon name="zap" size={18} style={{ color: w.status === 'active' ? 'var(--accent)' : 'var(--text-3)' }}/>
                  {w.status === 'active' && (
                    <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: 'var(--spring)', border: '2px solid var(--bg-surface)' }}/>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{w.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: 'var(--' + (trig?.tone || 'iris') + '-1, var(--bg-surface-2))', color: 'var(--' + (trig?.tone || 'iris') + ', var(--text-2))', fontSize: 11, fontWeight: 600 }}>
                      <Icon name={trig?.icon || 'zap'} size={10}/> {trig?.label || w.trigger}
                    </span>
                    <Icon name="arrow-right" size={11} style={{ color: 'var(--text-3)' }}/>
                    {w.actions.map(aid => {
                      const a = WF_ACTIONS.find(x => x.id === aid);
                      return (
                        <span key={aid} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', color: 'var(--text-1)', fontSize: 11, fontWeight: 600 }}>
                          <Icon name={a?.icon || 'zap'} size={10}/> {a?.label || aid}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="t-overline" style={{ fontSize: 9 }}>Execuções</div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{w.runs}</div>
                  <div style={{ fontSize: 10.5, color: w.success >= 95 ? 'var(--green-30)' : w.success >= 80 ? 'var(--orange-30)' : 'var(--red-30)', fontWeight: 600 }}>{w.runs > 0 ? w.success + '% sucesso' : '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="t-overline" style={{ fontSize: 9 }}>t('workflows.lastRun', 'Último run')</div>
                  <div className="cell-mono" style={{ fontSize: 11.5 }}>{w.lastRun ? fmtDateTime(w.lastRun).split(' · ')[0] : '—'}</div>
                  <div style={{ marginTop: 4 }}>
                    {w.status === 'active'  && <span className="badge badge-green"><span className="dot"/> Ativo</span>}
                    {w.status === 'paused'  && <span className="badge badge-orange"><span className="dot"/> Pausado</span>}
                    {w.status === 'draft'   && <span className="badge badge-neutral"><span className="dot"/> Rascunho</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <Toggle on={w.status === 'active'} onChange={() => toggleStatus(w.id)}/>
                  <button className="btn btn-ghost btn-sm" style={{ width: 30, padding: 0 }} onClick={() => setEditing(w)} title="Editar"><Icon name="edit" size={13}/></button>
                  <button className="btn btn-ghost btn-sm" style={{ width: 30, padding: 0, color: 'var(--red-30)' }} onClick={() => removeWf(w.id)} title="Excluir"><Icon name="trash" size={13}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {WF_TEMPLATES.map(tpl => (
            <div key={tpl.id} className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }} onClick={() => { setEditing({ name: tpl.title, trigger: tpl.from, actions: tpl.to, status: 'draft', runs: 0, success: 0, lastRun: null }); setTab('myflows'); }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center' }}>
                <Icon name={tpl.icon} size={18}/>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{tpl.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>{tpl.desc}</div>
              </div>
              <button className="btn btn-dark btn-sm" style={{ marginTop: 4 }} onClick={() => { setNewOpen(true); }}><Icon name="plus" size={12}/> Usar template</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'runs' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { wf: 'Notificar Slack em novo pedido > R$ 10k', when: '2026-05-22T14:33', status: 'ok',   detail: '#PD-10428 · R$ 8.450', duration: '420ms' },
            { wf: 'Reenviar ao HubSpot em caso de erro',     when: '2026-05-22T11:02', status: 'fail', detail: 'Timeout 504', duration: '5.2s' },
            { wf: 'E-mail de boas-vindas para nova franquia',when: '2026-05-21T16:48', status: 'ok',   detail: 'NX-1129 · Snack Já', duration: '180ms' },
            { wf: 'Alerta estoque baixo via Slack',          when: '2026-05-22T10:00', status: 'ok',   detail: 'VPOS Touch v3 < 40 un.', duration: '94ms' },
            { wf: 'Notificar WhatsApp Marina',               when: '2026-05-20T09:14', status: 'ok',   detail: '#PD-10422 · NX-7842', duration: '320ms' },
            { wf: 'Reenviar ao HubSpot em caso de erro',     when: '2026-05-20T16:55', status: 'ok',   detail: '#PD-10426 · LavaBem', duration: '380ms' },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1.4fr 1fr 100px 100px', gap: 14, padding: '12px 18px', alignItems: 'center', borderBottom: i < arr.length-1 ? '1px solid var(--line-1)' : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: r.status === 'ok' ? 'var(--green-soft)' : 'var(--red-soft)', color: r.status === 'ok' ? 'var(--green-30)' : 'var(--red-30)', display: 'grid', placeItems: 'center' }}>
                <Icon name={r.status === 'ok' ? 'check' : 'x'} size={12} stroke={3}/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.wf}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.detail}</div>
              <div className="cell-mono">{r.duration}</div>
              <div className="cell-mono" style={{ textAlign: 'right' }}>{fmtDateTime(r.when)}</div>
            </div>
          ))}
        </div>
      )}

      {editing && <WorkflowBuilder existing={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={(wf) => { window.toast && window.toast('Workflow ' + (editing === 'new' ? 'criado' : 'salvo')); setEditing(null); }}/>}
    </>
  );
};

/* ────── Workflow builder modal — visual canvas ────── */
const WorkflowBuilder = ({ existing, onClose, onSave }) => {
  const isEdit = !!existing && existing.id;
  const [name, setName] = useState(existing?.name || '');
  const [trigger, setTrigger] = useState(existing?.trigger || 'order_new');
  const [actions, setActions] = useState(existing?.actions || ['email']);
  const [step, setStep] = useState('trigger'); // trigger | action | config

  // Trigger filters (e.g. valor > X)
  const [filters, setFilters] = useState({ minValue: 0, segment: 'any', franchise: 'any' });

  const trig = WF_TRIGGERS.find(t => t.id === trigger);
  const valid = name && trigger && actions.length > 0;

  const addAction = (id) => setActions(prev => [...prev, id]);
  const removeAction = (idx) => setActions(prev => prev.filter((_, i) => i !== idx));
  const replaceAction = (idx, id) => setActions(prev => prev.map((a, i) => i === idx ? id : a));

  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 840 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center' }}>
              <Icon name="zap" size={17}/>
            </div>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>{isEdit ? 'Editar workflow' : 'Novo workflow'}</div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Dê um nome ao seu workflow" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 17, fontWeight: 700, padding: 0, marginTop: 2, outline: 'none', width: 420 }}/>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>

        <div style={{ padding: 28, background: 'var(--bg-surface-2)' }}>
          {/* Visual canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {/* Trigger node */}
            <div className="card" style={{ width: '100%', maxWidth: 480, padding: 16, borderLeft: '3px solid var(--iris)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--iris-1)', color: 'var(--iris)', display: 'grid', placeItems: 'center' }}>
                  <Icon name={trig?.icon || 'zap'} size={16}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="t-overline" style={{ fontSize: 9, color: 'var(--iris)' }}>QUANDO ACONTECER</div>
                  <select className="select" value={trigger} onChange={e => setTrigger(e.target.value)} style={{ marginTop: 4, fontWeight: 600 }}>
                    {WF_TRIGGERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Filter row */}
              {(trigger === 'order_new' || trigger === 'order_approved') && (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="t-overline" style={{ fontSize: 9, marginBottom: 8 }}>t('workflows.optFilters', 'Filtros opcionais')</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label className="field-label" style={{ fontSize: 10.5 }}>t('workflows.minValue', 'Valor mínimo')</label>
                      <input type="number" className="input" style={{ height: 32, fontSize: 12, fontFamily: 'var(--font-mono)' }} value={filters.minValue} onChange={e => setFilters(f => ({ ...f, minValue: +e.target.value }))} placeholder="0"/>
                    </div>
                    <div>
                      <label className="field-label" style={{ fontSize: 10.5 }}>Segmento</label>
                      <select className="select" style={{ height: 32, fontSize: 12 }} value={filters.segment} onChange={e => setFilters(f => ({ ...f, segment: e.target.value }))}>
                        <option value="any">Qualquer</option>
                        <option>Vending Machine</option><option>Micromercado</option><option>Lavanderia</option>
                        <option>Diversão Eletrônica</option><option>Food Service</option><option>EV</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions chain */}
            {actions.map((aid, idx) => {
              const a = WF_ACTIONS.find(x => x.id === aid);
              return (
                <React.Fragment key={idx}>
                  <div style={{ width: 2, height: 24, background: 'var(--neutral-70)', position: 'relative' }}>
                    <Icon name="chevron-down" size={12} style={{ position: 'absolute', bottom: -2, left: -5, color: 'var(--neutral-60)' }}/>
                  </div>
                  <div className="card" style={{ width: '100%', maxWidth: 480, padding: 16, borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', color: 'var(--yellow-00)', display: 'grid', placeItems: 'center' }}>
                        <Icon name={a?.icon || 'zap'} size={16}/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="t-overline" style={{ fontSize: 9, color: 'var(--yellow-00)' }}>ENTÃO {idx === 0 ? 'EXECUTE' : 'TAMBÉM EXECUTE'}</div>
                        <select className="select" value={aid} onChange={e => replaceAction(idx, e.target.value)} style={{ marginTop: 4, fontWeight: 600 }}>
                          {WF_ACTIONS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
                        </select>
                      </div>
                      <button onClick={() => removeAction(idx)} style={{ width: 28, height: 28, color: 'var(--red-30)' }} title="Remover ação"><Icon name="x" size={14}/></button>
                    </div>
                    {/* action-specific configuration teaser */}
                    {aid === 'slack' && (
                      <div style={{ marginTop: 10, padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6, fontSize: 12, color: 'var(--text-2)' }}>
                        Canal: <strong style={{ color: 'var(--text-1)' }}>#vendas-nayax</strong> · template: pedido + valor + franquia
                      </div>
                    )}
                    {aid === 'email' && (
                      <div style={{ marginTop: 10, padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6, fontSize: 12, color: 'var(--text-2)' }}>
                        Para: <strong style={{ color: 'var(--text-1)' }}>cliente</strong> · template: <strong style={{ color: 'var(--text-1)' }}>boas-vindas</strong>
                      </div>
                    )}
                    {aid === 'whatsapp' && (
                      <div style={{ marginTop: 10, padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6, fontSize: 12, color: 'var(--text-2)' }}>
                        Para: contato da franquia · mensagem: <strong style={{ color: 'var(--text-1)' }}>aviso de pedido</strong>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Add action button */}
            <div style={{ width: 2, height: 24, background: 'var(--neutral-70)' }}/>
            <div style={{ position: 'relative' }}>
              <select onChange={e => { if (e.target.value) { addAction(e.target.value); e.target.value = ''; } }} style={{
                appearance: 'none', WebkitAppearance: 'none',
                padding: '10px 36px 10px 16px',
                border: '2px dashed var(--neutral-60)',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-surface)',
                color: 'var(--text-2)',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}>
                <option value="">+ Adicionar ação</option>
                {WF_ACTIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
              <Icon name="plus" size={13} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-2)' }}/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '14px 24px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => window.toast && window.toast('Workflow testado · 1 execução de exemplo')}><Icon name="zap" size={13}/> Testar</button>
            <button className="btn btn-primary" onClick={() => onSave({ name, trigger, actions })} disabled={!valid}>
              <Icon name="check" size={13} stroke={3}/> {isEdit ? 'Salvar workflow' : 'Criar e ativar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.AdminWorkflows = AdminWorkflows;
window.WorkflowBuilder = WorkflowBuilder;
