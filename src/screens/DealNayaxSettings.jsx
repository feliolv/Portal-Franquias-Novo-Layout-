/* ════════════════════════════════════════════════════════
   DealNayax — Configurações (11 áreas)
   ════════════════════════════════════════════════════════ */

const DN_USERS = [
  { name:'Felipe Oliveira', email:'felipeo@nayax.com', role:'Super Admin', team:'—', owner:'85578000', pipelines:'Todos', av:'FO', color:'var(--spring)' },
  { name:'Daiane Soares', email:'daianeo@nayax.com', role:'Coordenador', team:'Todas', owner:'85001500', pipelines:'822543360, 836863041', av:'DA', color:'var(--iris)' },
  { name:'Karolay Correia', email:'karolay@nayax.com', role:'Consultor', team:'VM+Grua', owner:'85001768', pipelines:'822543360', av:'KA', color:'var(--spring)' },
  { name:'Nicole Emiliano', email:'nicole@nayax.com', role:'Consultor', team:'VM+Grua', owner:'85001952', pipelines:'822543360', av:'NE', color:'var(--coral)' },
  { name:'Leticia Ribeiro', email:'leticia@nayax.com', role:'Consultor', team:'VM+Grua', owner:'85775979', pipelines:'822543360', av:'LR', color:'var(--violet)' },
  { name:'Aline Prado', email:'aline@nayax.com', role:'Consultor', team:'MM+Lav', owner:'83943879', pipelines:'822543360', av:'AP', color:'var(--orange-50)' },
  { name:'Guilherme Raksa', email:'guilherme@nayax.com', role:'Consultor', team:'Food', owner:'85578673', pipelines:'836863041', av:'GR', color:'var(--spring)' },
  { name:'Vinícius Dias', email:'vinicius@nayax.com', role:'Consultor', team:'KA', owner:'85578620', pipelines:'836863041', av:'VD', color:'var(--orange-50)' },
  { name:'Luiz Guilherme', email:'luiz@nayax.com', role:'Consultor', team:'KA', owner:'85578642', pipelines:'822543360', av:'LG', color:'var(--spring)' },
  { name:'Elison Fernandes', email:'elison@nayax.com', role:'Consultor', team:'Food', owner:'83943888', pipelines:'822543360', av:'EF', color:'var(--coral)' },
];

const DN_PRICING_RULES = [
  { id:'PR-01', name:'Desconto por volume — VPOS', trigger:'Qtd. de VPOS Touch ≥ 20', effect:'10% off em hardware', active:true, scope:'VM+Grua' },
  { id:'PR-02', name:'Desconto por volume — Frota grande', trigger:'Qtd. de VPOS Touch ≥ 50', effect:'15% off hardware + 20% off Cloud Pro', active:true, scope:'VM+Grua' },
  { id:'PR-03', name:'Bundle Cloud + Hardware', trigger:'Cloud Pro vendido com VPOS', effect:'Instalação Padrão grátis', active:true, scope:'all' },
  { id:'PR-04', name:'Combo Food+Cashless', trigger:'MOMA + EZ-Smart no mesmo deal', effect:'5% off no combo', active:true, scope:'Food/Lav' },
  { id:'PR-05', name:'Renovação fidelidade', trigger:'Cliente ativo há ≥ 24 meses', effect:'Mantém preço do contrato anterior', active:false, scope:'all' },
  { id:'PR-06', name:'MDR PIX bonificado', trigger:'Volume mensal PIX ≥ R$ 100k', effect:'MDR PIX 0,79% (−0,20pp)', active:true, scope:'all' },
];

const DN_POLICY = [
  { range:'0% – 5%', approver:'Automático (sistema)', tone:'green', icon:'zap' },
  { range:'5% – 12%', approver:'Coordenador · Daiane Soares', tone:'blue', icon:'user' },
  { range:'12% – 25%', approver:'Diretor · Felipe Oliveira', tone:'orange', icon:'shield' },
  { range:'25% – 40%', approver:'Comitê CEO + CFO', tone:'red', icon:'users' },
  { range:'> 40%', approver:'Bloqueado · não permitido', tone:'neutral', icon:'x' },
];

const DealNayaxSettings = ({ onClose }) => {
  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');
  const TABS = [
    { id: 'users', label: 'Usuários', count: DN_USERS.length },
    { id: 'roles', label: 'Perfis de Acesso' },
    { id: 'teams', label: 'Equipes' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'pricing', label: 'Regras de Pricing' },
    { id: 'clicksign', label: 'Clicksign · Espelho' },
    { id: 'company', label: 'Empresa' },
    { id: 'levels', label: 'Alçadas' },
    { id: 'numbering', label: 'Numeração' },
    { id: 'templates', label: 'Templates' },
    { id: 'integrations', label: 'Integrações' },
    { id: 'audit', label: 'Auditoria' },
  ];
  const ROLE_TONE = { 'Super Admin': 'inverse', 'Coordenador': 'yellow', 'Consultor': 'purple' };

  return (
    <>
      <PageHeader
        kicker="DealNayax · Super Admin · Felipe Oliveira · 12 áreas"
        title="Configurações"
        sub="Usuários, perfis, equipes, catálogo, pricing, alçadas e integrações do DealNayax."
        actions={<button className="btn btn-secondary btn-sm" onClick={onClose}><Icon name="arrow-left" size={13}/> Voltar</button>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--line-1)', overflowX: 'auto', flexWrap: 'wrap' }}>
        {TABS.map(tt => (
          <button key={tt.id} onClick={() => setTab(tt.id)} style={{
            padding: '10px 13px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
            color: tab === tt.id ? 'var(--text-1)' : 'var(--text-3)',
            borderBottom: '2px solid ' + (tab === tt.id ? 'var(--accent)' : 'transparent'),
            marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tt.label}
            {tt.count != null && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: tab === tt.id ? 'var(--accent)' : 'var(--neutral-80)', color: tab === tt.id ? 'var(--dark)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{tt.count}</span>}
          </button>
        ))}
      </div>

      {/* USERS */}
      {tab === 'users' && (
        <div className="table-wrap fade-in">
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="input-group" style={{ width: 240, height: 34, padding: '0 10px' }}>
                <Icon name="search" size={13}/>
                <input placeholder="Buscar usuário…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 12.5 }}/>
              </div>
              <select className="select" style={{ width: 'auto', height: 34, fontSize: 12.5 }}><option>Perfil: Todos</option><option>Super Admin</option><option>Coordenador</option><option>Consultor</option></select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => window.toast && window.toast('Novo usuário — modal em breve')}><Icon name="plus" size={13}/> Novo Usuário</button>
          </div>
          <table className="t">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Equipe</th><th>HubSpot Owner</th><th>Pipelines</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {DN_USERS.filter(u => search === '' || (u.name + u.email).toLowerCase().includes(search.toLowerCase())).map(u => (
                <tr key={u.email}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 28, height: 28, borderRadius: '50%', background: u.color, color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{u.av}</div><span style={{ fontWeight: 600 }}>{u.name}</span></div></td>
                  <td style={{ color: 'var(--text-2)' }}>{u.email}</td>
                  <td><span className={'badge badge-' + ROLE_TONE[u.role]}>{u.role}</span></td>
                  <td>{u.team === '—' ? <span style={{ color: 'var(--text-3)' }}>—</span> : <span className="badge badge-neutral">{u.team}</span>}</td>
                  <td className="cell-mono">{u.owner}</td>
                  <td className="cell-mono" style={{ fontSize: 11.5 }}>{u.pipelines}</td>
                  <td><span className="badge badge-green"><Icon name="check" size={10} stroke={3}/> Ativo</span></td>
                  <td><button className="btn btn-ghost btn-sm"><Icon name="edit" size={12}/> Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRICING RULES */}
      {tab === 'pricing' && (
        <div className="table-wrap fade-in">
          <div className="table-toolbar">
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{DN_PRICING_RULES.filter(r=>r.active).length} regras ativas · aplicadas automaticamente no builder</div>
            <button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> Nova regra</button>
          </div>
          <table className="t">
            <thead><tr><th>ID</th><th>Regra</th><th>Gatilho</th><th>Efeito</th><th>Escopo</th><th>Status</th></tr></thead>
            <tbody>
              {DN_PRICING_RULES.map(r => (
                <tr key={r.id}>
                  <td><span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{r.id}</span></td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 12.5 }}>{r.trigger}</td>
                  <td style={{ color: 'var(--text-1)', fontSize: 12.5 }}>{r.effect}</td>
                  <td><span className="badge badge-neutral">{r.scope}</span></td>
                  <td>{r.active ? <span className="badge badge-green"><span className="dot"/> Ativa</span> : <span className="badge badge-neutral"><span className="dot"/> Inativa</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ALÇADAS */}
      {tab === 'levels' && (
        <div className="fade-in" style={{ maxWidth: 720 }}>
          <div className="card card-pad-lg">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Alçadas de desconto</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Define quem aprova cada faixa de desconto efetivo aplicado em orçamentos.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DN_POLICY.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--' + p.tone + '-soft, var(--neutral-80))', color: 'var(--' + p.tone + '-30, var(--text-2))', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={p.icon} size={16}/></div>
                  <div style={{ minWidth: 90, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14 }}>{p.range}</div>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{p.approver}</div>
                  <button className="btn btn-ghost btn-sm" onClick={() => window.toast && window.toast('Editar alçada — em breve')}><Icon name="edit" size={12}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NUMBERING */}
      {tab === 'numbering' && (
        <div className="fade-in card card-pad-lg" style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Numeração atômica por tipo</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>Prefixo e próximo número gerado para cada tipo de proposta.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[['NOVO','0493'],['BASE','0582'],['DEM','0714'],['MIGR','0013'],['FORM','0097'],['UPGRADE','0666'],['RETCOM','0059']].map(([p, n]) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{p}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>Próximo número</div></div>
                <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{p}{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERFIS DE ACESSO */}
      {tab === 'roles' && <DNRolesPanel/>}
      {/* EQUIPES */}
      {tab === 'teams' && <DNTeamsPanel/>}
      {/* CATÁLOGO */}
      {tab === 'catalog' && <DNCatalogPanel/>}
      {/* CLICKSIGN ESPELHO */}
      {tab === 'clicksign' && <DNClicksignPanel/>}
      {/* EMPRESA */}
      {tab === 'company' && <DNCompanyPanel/>}
      {/* TEMPLATES */}
      {tab === 'templates' && <DNTemplatesPanel/>}
      {/* INTEGRAÇÕES */}
      {tab === 'integrations' && <DNIntegrationsPanel/>}
      {/* AUDITORIA */}
      {tab === 'audit' && <DNAuditPanel/>}
    </>
  );
};

/* ─────── Perfis de Acesso ─────── */
const DNRolesPanel = () => {
  const ROLES = [
    { id: 'consultor', name: 'Consultor', level: 'Nível 2', tone: 'spring', who: 'Vendedor de campo · carteira própria',
      kpis: ['Minhas metas', 'Meus orçamentos', 'Minha conversão', 'Meu ranking'],
      menu: ['Dashboard', 'Negócios (próprios)', 'Orçamentos', 'Novo Orçamento'],
      blocked: ['Aprovações', 'Configurações', 'Auditoria', 'Negócios de outros'],
      caps: [['Criar orçamento', 1], ['Aplicar desconto até 5%', 1], ['Aprovar descontos', 0], ['Ver negócios do time', 0], ['Editar catálogo', 0]] },
    { id: 'coord', name: 'Coordenador', level: 'Nível 3', tone: 'iris', who: 'Lidera um time comercial',
      kpis: ['Meta do time', 'Pipeline do time', 'Aprovações pendentes', 'Ranking de consultores'],
      menu: ['Dashboard', 'Negócios (do time)', 'Orçamentos', 'Aprovações', 'Equipe'],
      blocked: ['Configurações globais', 'Auditoria completa'],
      caps: [['Criar orçamento', 1], ['Aplicar desconto até 12%', 1], ['Aprovar descontos do time', 1], ['Ver negócios do time', 1], ['Editar catálogo', 0]] },
    { id: 'diretor', name: 'Diretor', level: 'Nível 4', tone: 'orange', who: 'Visão global da operação',
      kpis: ['Receita total', 'Funil completo', 'Aprovações de alçada', 'Performance por time'],
      menu: ['Tudo visível', 'Configurações', 'Auditoria', 'Integrações'],
      blocked: ['—'],
      caps: [['Criar orçamento', 1], ['Aplicar desconto até 25%', 1], ['Aprovar descontos', 1], ['Ver todos os negócios', 1], ['Editar catálogo', 1]] },
  ];
  const [sel, setSel] = useState('coord');
  const r = ROLES.find(x => x.id === sel);
  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
        {ROLES.map(x => (
          <button key={x.id} onClick={() => setSel(x.id)} className="card" style={{ padding: 16, textAlign: 'left', border: '1px solid ' + (sel === x.id ? 'var(--dark)' : 'var(--line-1)'), background: sel === x.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)', cursor: 'pointer', borderTop: '3px solid var(--' + x.tone + '-50, var(--accent))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{x.name}</div>
              <span className="badge badge-neutral">{x.level}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{x.who}</div>
          </button>
        ))}
      </div>
      <div className="card card-pad" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-surface-2)' }}>
        <Icon name="user" size={16} style={{ color: 'var(--text-2)' }}/>
        <div style={{ fontSize: 13 }}>Usuário típico deste perfil: <strong>{r.who}</strong></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {r.kpis.map((k, i) => (
          <div key={i} className="kpi" style={{ padding: 14 }}><div className="label">KPI {i+1}</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{k}</div></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div className="card card-pad">
          <div className="t-overline" style={{ marginBottom: 10, color: 'var(--green-30)' }}>Menu visível</div>
          {r.menu.map((m, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13 }}><Icon name="check" size={13} stroke={3} style={{ color: 'var(--green-30)' }}/> {m}</div>)}
        </div>
        <div className="card card-pad">
          <div className="t-overline" style={{ marginBottom: 10, color: 'var(--red-30)' }}>Bloqueado</div>
          {r.blocked.map((m, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13, color: 'var(--text-3)' }}><Icon name="x" size={13} stroke={3} style={{ color: 'var(--red-30)' }}/> {m}</div>)}
        </div>
      </div>
      <div className="table-wrap">
        <table className="t"><thead><tr><th>Capacidade</th><th style={{ textAlign: 'center' }}>Permissão</th></tr></thead>
          <tbody>{r.caps.map(([c, ok], i) => (
            <tr key={i}><td style={{ fontWeight: 600 }}>{c}</td><td style={{ textAlign: 'center' }}>{ok ? <span className="badge badge-green"><Icon name="check" size={10} stroke={3}/> Pode</span> : <span className="badge badge-red"><Icon name="x" size={10} stroke={3}/> Não pode</span>}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

/* ─────── Equipes ─────── */
const DNTeamsPanel = () => {
  const TEAMS = [
    { name: 'VM+Grua', sup: 'Daiane Soares', members: ['KA','NE','LR','LG'], pipelines: ['822543360'], tone: 'iris' },
    { name: 'MM+Lavanderia', sup: 'Daiane Soares', members: ['AP'], pipelines: ['822543360'], tone: 'spring' },
    { name: 'Food', sup: 'Daiane Soares', members: ['GR','EF'], pipelines: ['822543360','836863041'], tone: 'orange' },
    { name: 'Key Account', sup: 'Felipe Oliveira', members: ['VD','LG'], pipelines: ['836863041'], tone: 'violet' },
  ];
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}><button className="btn btn-dark btn-sm"><Icon name="plus" size={13}/> Nova Equipe</button></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {TEAMS.map(t => (
          <div key={t.name} className="card" style={{ padding: 16, borderTop: '3px solid var(--' + t.tone + '-50, var(--accent))' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 10 }}>
              <Icon name="shield" size={13} style={{ color: 'var(--text-2)' }}/><div style={{ fontSize: 12.5 }}><strong>{t.sup}</strong> <span style={{ color: 'var(--text-3)' }}>· supervisor</span></div>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>Consultores ({t.members.length})</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>{t.members.map(m => <div key={m} style={{ width: 28, height: 28, borderRadius: '50%', background: dnAv(m), color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{m}</div>)}</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 6 }}>Pipelines</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{t.pipelines.map(p => <span key={p} className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{p}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────── Catálogo ─────── */
const DNCatalogPanel = () => {
  const [cat, setCat] = useState('Todos');
  const CATS = ['Todos','Hardware','Software','Serviços','Taxas'];
  const CMAP = { Hardware: 'hardware', Software: 'software', 'Serviços': 'service', Taxas: 'fee' };
  const rows = DN_CATALOG.filter(c => cat === 'Todos' || c.category === CMAP[cat]);
  return (
    <div className="fade-in">
      <div className="table-wrap" style={{ marginBottom: 18 }}>
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: 6 }}>
            {CATS.map(c => <button key={c} onClick={() => setCat(c)} style={{ height: 30, padding: '0 12px', borderRadius: 'var(--radius-pill)', fontSize: 12, fontWeight: 600, border: '1px solid ' + (cat === c ? 'var(--dark)' : 'var(--line-2)'), background: cat === c ? 'var(--dark)' : 'var(--bg-surface)', color: cat === c ? 'white' : 'var(--text-2)' }}>{c}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-secondary btn-sm"><Icon name="upload" size={12}/> Importar CSV</button><button className="btn btn-dark btn-sm"><Icon name="plus" size={12}/> Novo SKU</button></div>
        </div>
        <table className="t"><thead><tr><th>SKU</th><th>Nome</th><th>Categoria</th><th style={{ textAlign: 'right' }}>Preço</th><th>Tipo</th></tr></thead>
          <tbody>{rows.map(c => { const cm = CAT_META[c.category]; return (
            <tr key={c.sku}><td><span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{c.sku}</span></td><td style={{ fontWeight: 600 }}>{c.name}</td><td><span className={'badge badge-' + cm.tone}>{cm.label}</span></td><td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.displayPrice || fmtBRL(c.price)}</td><td><span className="badge badge-neutral">{c.recurring ? 'Recorrente' : 'One-time'}</span></td></tr>
          ); })}</tbody>
        </table>
      </div>
      <div className="t-overline" style={{ marginBottom: 10 }}>Bundles</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {DN_BUNDLES.map(b => { const tot = b.items.reduce((s,i)=>{const c=DN_CATALOG.find(c=>c.sku===i.sku);return s+(c?.price||0)*i.qty;},0); return (
          <div key={b.id} className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>{b.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-2)', marginBottom: 10 }}>{b.items.length} itens</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line-1)', paddingTop: 10 }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmtBRLcurt(tot)}</span><button className="btn btn-ghost btn-sm"><Icon name="edit" size={12}/> Editar</button></div>
          </div>
        ); })}
      </div>
    </div>
  );
};

/* ─────── Clicksign Espelho ─────── */
const DNClicksignPanel = () => (
  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
    <div className="card card-pad">
      <div className="t-overline" style={{ marginBottom: 14 }}>Timeline do documento · NOVO0489</div>
      {[
        { l: 'Documento criado', t: 'hoje 09:12', done: true },
        { l: 'Enviado ao cliente', t: 'hoje 09:14', done: true },
        { l: 'Cliente abriu', t: 'hoje 10:02', done: true },
        { l: 'Aguardando assinatura', t: '—', done: false },
      ].map((s, i, arr) => (
        <div key={i} style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.done ? 'var(--dark)' : 'var(--neutral-80)', color: s.done ? 'var(--accent)' : 'var(--text-3)', display: 'grid', placeItems: 'center' }}><Icon name={s.done ? 'check' : 'clock'} size={11} stroke={3}/></div>
            {i < arr.length-1 && <div style={{ width: 1, flex: 1, minHeight: 16, background: s.done ? 'var(--dark)' : 'var(--line-2)' }}/>}
          </div>
          <div style={{ paddingBottom: 14 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{s.l}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.t}</div></div>
        </div>
      ))}
      <div className="t-overline" style={{ margin: '8px 0 10px' }}>Signatários</div>
      {[{ n: 'Ricardo Marinho', r: 'Cliente', s: 'Aguardando', tone: 'orange' }, { n: 'Felipe Oliveira', r: 'Nayax', s: 'Pendente', tone: 'neutral' }].map((x, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--dark)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{i+1}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{x.n}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>{x.r}</div></div>
          <span className={'badge badge-' + x.tone}>{x.s}</span>
        </div>
      ))}
    </div>
    {/* Clicksign visual frame */}
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ background: '#1B45DA', color: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Clicksign</div>
        <span style={{ fontSize: 11, opacity: 0.8 }}>O que o cliente vê</span>
      </div>
      <div style={{ padding: 24, background: '#F4F6FB' }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 12px rgba(27,69,218,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 50, borderRadius: 6, background: '#DC3447', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>PDF</div>
            <div><div style={{ fontSize: 13.5, fontWeight: 700 }}>Proposta NOVO0489.pdf</div><div style={{ fontSize: 11.5, color: '#52525B' }}>Nayax Brasil · 5 páginas</div></div>
          </div>
          <div style={{ fontSize: 12, color: '#52525B', lineHeight: 1.6, marginBottom: 16, padding: 12, background: '#F4F6FB', borderRadius: 8 }}>Você é o <strong>1º signatário</strong>. Revise o documento e assine para prosseguir. Após sua assinatura, o documento segue para a Nayax Brasil.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, height: 42, borderRadius: 8, background: '#1B45DA', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }} onClick={() => window.toast && window.toast('Redirecionando para Clicksign…')}>Assinar documento</button>
            <button style={{ height: 42, padding: '0 16px', borderRadius: 8, background: '#fff', color: '#52525B', border: '1px solid #E4E4E7', fontWeight: 600, fontSize: 13, cursor: 'pointer' }} onClick={async () => { const ok = await window.confirmAction({ title: 'Recusar assinatura?', body: 'O proponente será notificado. Esta ação não pode ser desfeita.', danger: true, confirmLabel: 'Recusar' }); if(ok) window.toast && window.toast('Assinatura recusada'); }}>Recusar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────── Empresa ─────── */
const DNCompanyPanel = () => (
  <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'flex-start' }}>
    <div className="card card-pad-lg">
      <div className="t-overline" style={{ marginBottom: 14 }}>Dados da empresa fornecedora</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: 'span 2' }}><label className="field-label">Razão social</label><input className="input" defaultValue="Nayax Brasil Soluções de Pagamento Ltda"/></div>
        <div><label className="field-label">CNPJ</label><input className="input" defaultValue="12.345.678/0001-90" style={{ fontFamily: 'var(--font-mono)' }}/></div>
        <div><label className="field-label">Inscrição Estadual</label><input className="input" defaultValue="113.582.290.119" style={{ fontFamily: 'var(--font-mono)' }}/></div>
        <div><label className="field-label">E-mail</label><input className="input" defaultValue="comercial@nayax.com.br"/></div>
        <div><label className="field-label">Telefone</label><input className="input" defaultValue="(11) 3000-0000"/></div>
        <div style={{ gridColumn: 'span 2' }}><label className="field-label">Endereço</label><input className="input" defaultValue="Av. Brigadeiro Faria Lima, 3477 · Itaim Bibi · São Paulo / SP"/></div>
      </div>
      <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => window.toast && window.toast('Dados da empresa salvos')}><Icon name="check" size={13} stroke={3}/> Salvar</button>
    </div>
    <div className="card card-pad">
      <div className="t-overline" style={{ marginBottom: 12 }}>Prévia do rodapé do PDF</div>
      <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius-sm)', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src="assets/logo-nayax-N.png" style={{ width: 18 }}/><span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>NAYAX BRASIL</span></div>
        <span style={{ color: 'var(--accent)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>www.nayax.com</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 10, lineHeight: 1.5 }}>O rodapé aparece em todas as páginas do PDF da proposta gerada.</div>
    </div>
  </div>
);

/* ─────── Templates ─────── */
const DNTemplatesPanel = () => {
  const [sel, setSel] = useState(0);
  const TPLS = [{ n: 'Proposta Novo Cliente', uses: 142, on: true }, { n: 'Proposta Upgrade', uses: 64, on: true }, { n: 'Proposta Migração', uses: 38, on: true }, { n: 'Demonstração', uses: 12, on: false }];
  const SECT = ['Capa', 'Termos', 'Serviços', 'Capa Final', 'PDF Completo'];
  const [sect, setSect] = useState('Capa');
  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, alignItems: 'flex-start' }}>
      <div className="card" style={{ padding: 6 }}>
        {TPLS.map((t, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: sel === i ? 'var(--bg-surface-2)' : 'transparent', border: 'none', cursor: 'pointer', marginBottom: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="receipt" size={14} style={{ color: sel === i ? 'var(--dark)' : 'var(--text-3)' }}/><span style={{ fontSize: 13, fontWeight: 600 }}>{t.n}</span></div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, display: 'flex', gap: 6 }}>{t.on ? <span style={{ color: 'var(--green-30)' }}>● Ativo</span> : <span>○ Inativo</span>} · {t.uses} usos</div>
          </button>
        ))}
      </div>
      <div className="card card-pad">
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line-1)', marginBottom: 16 }}>
          {SECT.map(s => <button key={s} onClick={() => setSect(s)} style={{ padding: '8px 12px', fontSize: 12.5, fontWeight: 600, color: sect === s ? 'var(--text-1)' : 'var(--text-3)', borderBottom: '2px solid ' + (sect === s ? 'var(--accent)' : 'transparent'), marginBottom: -1 }}>{s}</button>)}
        </div>
        <label className="field-label">Texto da seção · {sect}</label>
        <textarea className="textarea" rows={6} defaultValue={'Prezado(a) {{nome_contato}},\n\nApresentamos a proposta {{numero_proposta}} para {{nome_empresa}}, com solução completa de pagamentos cashless da Nayax.'}/>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {['{{nome_empresa}}','{{nome_contato}}','{{numero_proposta}}','{{valor_total}}','{{validade}}'].map(v => <span key={v} className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>{v}</span>)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="btn btn-secondary btn-sm"><Icon name="upload" size={12}/> Subir PDF</button>
          <button className="btn btn-primary btn-sm" onClick={() => window.toast && window.toast('Template salvo')}><Icon name="check" size={12} stroke={3}/> Salvar</button>
        </div>
      </div>
    </div>
  );
};

/* ─────── Integrações ─────── */
const DNIntegrationsPanel = () => (
  <div className="fade-in">
    <div className="t-overline" style={{ marginBottom: 10 }}>CRM</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
      <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#FF7A59', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="hubspot" size={18}/></div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>HubSpot</div><div style={{ fontSize: 11.5, color: 'var(--text-2)' }}>2 pipelines · 412 deals</div><span className="badge badge-green" style={{ marginTop: 4 }}><span className="dot"/> Conectado</span></div>
        <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Configurações HubSpot — em breve')}>Configurar</button>
      </div>
      <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, opacity: 0.7 }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#00A1E0', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="globe" size={18}/></div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>Salesforce</div><span className="badge badge-neutral" style={{ marginTop: 4 }}><span className="dot"/> Não conectado</span></div>
        <button className="btn btn-dark btn-sm"><Icon name="plug" size={12}/> Conectar</button>
      </div>
    </div>
    <div className="t-overline" style={{ marginBottom: 10 }}>Assinatura eletrônica</div>
    <div className="card card-pad" style={{ background: 'var(--accent-soft)', border: '1px solid var(--taxi-y-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#1B45DA', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon name="edit" size={18}/></div>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>Clicksign</div><span className="badge badge-green" style={{ marginTop: 4 }}><span className="dot"/> Conectado · webhook ativo</span></div>
        <button className="btn btn-dark btn-sm" onClick={() => window.toast && window.toast('Configuração Clicksign aberta')}>Configurar</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11.5, color: 'var(--text-2)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
        {['Gerar PDF','Criar documento','Signatários','Enviar','Webhook document.signed','Atualizar HubSpot','Marcar Ganho'].map((s, i, a) => (
          <React.Fragment key={i}><span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{s}</span>{i < a.length-1 && <Icon name="arrow-right" size={11} style={{ color: 'var(--text-3)' }}/>}</React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

/* ─────── Auditoria ─────── */
const DNAuditPanel = () => {
  const LOG = [
    { t: '2026-05-22 14:33', u: 'Felipe Oliveira', a: 'aprovou', tone: 'green', o: 'UPGRADE0664', d: 'Desconto 18% · alçada Diretor' },
    { t: '2026-05-22 11:02', u: 'Sistema', a: 'sync', tone: 'neutral', o: '47 deals', d: 'Sincronização HubSpot · 0 erros' },
    { t: '2026-05-21 16:48', u: 'Karolay Correia', a: 'enviou', tone: 'blue', o: 'NOVO0489', d: 'Clicksign · 2 signatários' },
    { t: '2026-05-21 10:15', u: 'Daiane Soares', a: 'editou', tone: 'orange', o: 'PR-02', d: 'Regra de pricing · 15% off' },
    { t: '2026-05-20 09:14', u: 'Vinícius Dias', a: 'gerou', tone: 'neutral', o: 'FORM0094', d: 'PDF · R$ 44.000' },
  ];
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
        <div className="input-group" style={{ width: 260, height: 34, padding: '0 10px' }}><Icon name="search" size={13}/><input placeholder="Buscar ação, usuário, objeto…" style={{ fontSize: 12.5 }}/></div>
        <div style={{ display: 'flex', gap: 8 }}><select className="select" style={{ width: 'auto', height: 34, fontSize: 12.5 }}><option>Período: 30 dias</option><option>7 dias</option><option>Hoje</option></select><button className="btn btn-secondary btn-sm"><Icon name="download" size={13}/> Exportar CSV</button></div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {LOG.map((l, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 120px 1fr', gap: 14, padding: '13px 18px', alignItems: 'center', borderBottom: i < LOG.length-1 ? '1px solid var(--line-1)' : 'none' }}>
            <div className="cell-mono" style={{ fontSize: 11.5 }}>{l.t}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{l.u}</div>
            <div><span className={'badge badge-' + l.tone}>{l.a}</span></div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}><span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginRight: 6 }}>{l.o}</span>{l.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.DealNayaxSettings = DealNayaxSettings;
