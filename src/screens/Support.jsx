/* ════════════════════════════════════════════════════════
   Client: Suporte (tickets)
   ════════════════════════════════════════════════════════ */

const TICKETS = [
  { id: '#T-2841', subject: 'Terminal não conecta no 4G', cat: 'Técnico',  priority: 'high', status: 'open',   updated: '2026-05-22T14:20', messages: 4 },
  { id: '#T-2837', subject: 'Reajuste de preço VPOS',     cat: 'Financeiro', priority: 'med',  status: 'wait',  updated: '2026-05-20T09:14', messages: 2 },
  { id: '#T-2822', subject: 'Nota fiscal pedido #PD-10422', cat: 'Financeiro', priority: 'low', status: 'closed', updated: '2026-05-15T11:30', messages: 7 },
  { id: '#T-2811', subject: 'Como configurar Amit 3.0',   cat: 'Técnico',  priority: 'low', status: 'closed', updated: '2026-05-10T16:45', messages: 3 },
];
const PRIO_META = {
  high: { color: 'var(--red-30)',    bg: 'var(--red-soft)',    label: 'Alta' },
  med:  { color: 'var(--orange-30)', bg: 'var(--orange-soft)', label: 'Média' },
  low:  { color: 'var(--green-30)',  bg: 'var(--green-soft)',  label: 'Baixa' },
};
const TICKET_STATUS_META = {
  open:   { color: 'var(--iris)',  bg: 'var(--iris-1)',    label: t('support.statusOpen', 'Aberto') },
  wait:   { color: 'var(--orange-30)', bg: 'var(--orange-soft)', label: 'Aguardando você' },
  closed: { color: 'var(--text-3)',bg: 'var(--neutral-80)',label: t('support.statusResolved', 'Resolvido') },
};

const Support = ({ cart, setRoute, openCart }) => {
  const { t } = useLang();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const [newOpen, setNewOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const rows = TICKETS.filter(t => filter === 'all' || t.status === filter);
  const counts = { all: TICKETS.length, open: TICKETS.filter(t => t.status === 'open').length, wait: TICKETS.filter(t => t.status === 'wait').length, closed: TICKETS.filter(t => t.status === 'closed').length };

  return (
    <div className="app-layout">
      <ClientSidebar route="support" setRoute={setRoute} cart={cart}/>
      <div className="app-main">
        <Topbar breadcrumb={[{ label: 'Suporte' }]} onCartClick={openCart} cartCount={cartCount}/>
        <div className="app-content">
          <PageHeader
            kicker="Conta NX-7842"
            title="Suporte & chamados"
            sub="Abra um chamado para questões técnicas, financeiras ou comerciais. Tempo médio de resposta: 2h úteis."
            actions={<button className="btn btn-dark btn-sm" onClick={() => setNewOpen(true)}><Icon name="plus" size={13}/> {t('support.newTicket', 'Novo chamado')}</button>}
          />

          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { id: 'all',    label: 'Todos' },
              { id: 'open',   label: 'Abertos' },
              { id: 'wait',   label: 'Aguardando' },
              { id: 'closed', label: 'Resolvidos' },
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

          {rows.length === 0 ? (
            <EmptyState icon="help" title="Nenhum chamado" body="Você ainda não abriu chamados neste filtro." action={<button className="btn btn-dark" onClick={() => setNewOpen(true)}><Icon name="plus" size={14}/> Abrir primeiro chamado</button>}/>
          ) : (
            <div className="table-wrap">
              <table className="t">
                <thead><tr><th>{t('support.ticket', 'Chamado')}</th><th>{t('support.subject', 'Assunto')}</th><th>Categoria</th><th>{t('support.priority', 'Prioridade')}</th><th>Status</th><th>{t('common.lastUpdate', 'Última atualização')}</th><th></th></tr></thead>
                <tbody>
                  {rows.map(t => {
                    const pm = PRIO_META[t.priority], sm = TICKET_STATUS_META[t.status];
                    return (
                      <tr key={t.id}>
                        <td><div className="cell-mono" style={{ fontWeight: 600 }}>{t.id}</div></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.subject}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.messages} mensagens</div>
                        </td>
                        <td><span className="badge badge-neutral">{t.cat}</span></td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: pm.bg, color: pm.color }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: pm.color }}/> {pm.label}</span></td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: sm.bg, color: sm.color }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: sm.color }}/> {sm.label}</span></td>
                        <td className="cell-mono">{fmtDateTime(t.updated)}</td>
                        <td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm" onClick={() => window.toast && window.toast('Detalhes do chamado — em breve')}>Abrir <Icon name="arrow-right" size={12}/></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 24 }}>
            {[
              { icon: 'help',    title: 'Central de ajuda', sub: 'Tutoriais, FAQ e artigos técnicos', color: 'var(--iris)' },
              { icon: 'mail',    title: 'E-mail comercial', sub: 'comercial@nayax.com.br · resposta em 4h', color: 'var(--accent)' },
              { icon: 'phone',   title: 'WhatsApp gerente', sub: '(11) 99000-0000 · Felipe Andrade', color: 'var(--spring)' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: c.color, color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={c.icon} size={17}/></div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.sub}</div>
                </div>
                <Icon name="arrow-right" size={14} style={{ color: 'var(--text-3)', marginLeft: 'auto' }}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      {newOpen && <NewTicketModal onClose={() => setNewOpen(false)}/>}
    </div>
  );
};

const NewTicketModal = ({ onClose }) => {
  const [cat, setCat] = useState('Técnico');
  const [prio, setPrio] = useState('med');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const submit = () => {
    window.toast && window.toast('Chamado aberto · você receberá resposta em até 2h úteis');
    onClose();
  };

  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="t-overline" style={{ color: 'var(--accent)' }}>Suporte Nayax</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>Abrir novo chamado</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="field-label">Categoria</label>
              <select className="select" value={cat} onChange={e => setCat(e.target.value)}>
                <option>Técnico</option><option>Financeiro</option><option>Comercial</option><option>Logística</option><option>Outro</option>
              </select>
            </div>
            <div>
              <label className="field-label">Prioridade</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { id: 'low',  label: 'Baixa' },
                  { id: 'med',  label: 'Média' },
                  { id: 'high', label: 'Alta'  },
                ].map(p => (
                  <button key={p.id} type="button" onClick={() => setPrio(p.id)} style={{
                    flex: 1, height: 40,
                    border: '1px solid ' + (prio === p.id ? 'var(--dark)' : 'var(--line-2)'),
                    background: prio === p.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                    color: prio === p.id ? PRIO_META[p.id].color : 'var(--text-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12, fontWeight: 600,
                  }}>{p.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="field-label">Assunto</label>
            <input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ex: Terminal não conecta no 4G"/>
          </div>
          <div>
            <label className="field-label">Descrição</label>
            <textarea className="textarea" rows={5} value={body} onChange={e => setBody(e.target.value)} placeholder="Descreva o problema com detalhes, números de série, mensagens de erro…"/>
          </div>
          <div>
            <label className="field-label">Anexos</label>
            <div style={{ border: '2px dashed var(--line-2)', borderRadius: 'var(--radius-sm)', padding: 18, textAlign: 'center', color: 'var(--text-2)' }}>
              <Icon name="upload" size={20} style={{ color: 'var(--text-3)' }}/>
              <div style={{ fontSize: 12, marginTop: 6 }}>Arraste arquivos ou <strong style={{ color: 'var(--text-link)', cursor: 'pointer' }}>selecione</strong></div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '14px 24px', borderTop: '1px solid var(--line-1)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit} disabled={!subject || !body}>
            <Icon name="check" size={14} stroke={3}/> Abrir chamado
          </button>
        </div>
      </div>
    </div>
  );
};

window.Support = Support;
window.NewTicketModal = NewTicketModal;
