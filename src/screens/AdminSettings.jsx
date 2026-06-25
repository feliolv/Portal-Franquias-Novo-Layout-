/* ════════════════════════════════════════════════════════
   Admin: Configurações
   ════════════════════════════════════════════════════════ */

const AdminSettings = () => {
  const { t } = useLang();
  const [tab, setTab] = useState('empresa');
  const TABS = [
    { id: 'empresa',       label: t('admin.settings.tab.empresa'),  icon: 'building' },
    { id: 'equipe',        label: t('admin.settings.tab.team'),     icon: 'users' },
    { id: 'integracoes',   label: t('admin.settings.tab.integ'),    icon: 'plug' },
    { id: 'notificacoes',  label: t('admin.settings.tab.notif'),    icon: 'bell' },
    { id: 'seguranca',     label: t('admin.settings.tab.sec'),      icon: 'shield' },
    { id: 'aparencia',     label: t('admin.settings.tab.app'),      icon: 'sparkles' },
  ];

  return (
    <>
      <PageHeader
        kicker={t('admin.settings.kicker')}
        title={t('admin.settings.title')}
        sub={t('admin.settings.sub')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18, alignItems: 'flex-start' }}>
        {/* Side tabs */}
        <div className="card" style={{ padding: 6, position: 'sticky', top: 80 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13, fontWeight: 500,
              color: tab === t.id ? 'var(--text-1)' : 'var(--text-2)',
              background: tab === t.id ? 'var(--bg-surface-2)' : 'transparent',
              borderLeft: '3px solid ' + (tab === t.id ? 'var(--accent)' : 'transparent'),
              marginBottom: 2,
              textAlign: 'left',
            }}>
              <Icon name={t.icon} size={15} style={{ color: tab === t.id ? 'var(--dark)' : 'var(--text-3)' }}/>
              {t.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--line-1)', margin: '8px 4px', paddingTop: 10 }}>
            <div className="t-overline" style={{ fontSize: 9.5, padding: '4px 8px' }}>Versão</div>
            <div style={{ padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-3)' }}>portal v2026.05.27</div>
          </div>
        </div>

        {/* Content */}
        <div className="card card-pad-lg">
          {tab === 'empresa' && <SettingsEmpresa/>}
          {tab === 'equipe' && <SettingsEquipe/>}
          {tab === 'integracoes' && <SettingsIntegracoes/>}
          {tab === 'notificacoes' && <SettingsNotificacoes/>}
          {tab === 'seguranca' && <SettingsSeguranca/>}
          {tab === 'aparencia' && <SettingsAparencia/>}
        </div>
      </div>
    </>
  );
};

const SettingsBlock = ({ title, sub, children, action }) => (
  <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid var(--line-1)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{sub}</div>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Toggle = ({ on, onChange }) => (
  <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 22, cursor: 'pointer', flexShrink: 0 }}>
    <input type="checkbox" checked={on} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }}/>
    <span style={{ position: 'absolute', inset: 0, background: on ? 'var(--green-50)' : 'var(--neutral-70)', borderRadius: 20, transition: 'background .15s' }}>
      <span style={{ position: 'absolute', height: 16, width: 16, top: 3, left: on ? 19 : 3, background: 'white', borderRadius: '50%', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
    </span>
  </label>
);

const SettingsEmpresa = () => {
  const [logo, setLogo] = useState(null);
  return (
    <>
      <SettingsBlock title="Dados da empresa" sub="Informações exibidas no portal e nas comunicações com franquias.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><label className="field-label">Razão social</label><input className="input" defaultValue="Nayax Brasil Operações Ltda."/></div>
          <div><label className="field-label">CNPJ</label><input className="input" defaultValue="12.345.678/0001-90" style={{ fontFamily: 'var(--font-mono)' }}/></div>
          <div><label className="field-label">Nome fantasia</label><input className="input" defaultValue="Nayax BR"/></div>
          <div><label className="field-label">Inscrição estadual</label><input className="input" defaultValue="123.456.789.012" style={{ fontFamily: 'var(--font-mono)' }}/></div>
          <div style={{ gridColumn: '1 / -1' }}><label className="field-label">Endereço</label><input className="input" defaultValue="Av. Brigadeiro Faria Lima, 3477 · Conj. 14º · Itaim Bibi · São Paulo / SP · 04534-001"/></div>
          <div><label className="field-label">E-mail comercial</label><input className="input" defaultValue="comercial@nayax.com.br"/></div>
          <div><label className="field-label">Telefone</label><input className="input" defaultValue="(11) 3000-0000"/></div>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Identidade visual" sub="Logo usado em e-mails, documentos e topbar do portal.">
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: 'var(--radius-md)', background: 'var(--dark)', display: 'grid', placeItems: 'center', padding: 18 }}>
            <NayaxMark size={56}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Logo principal (PNG)</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10 }}>Mínimo 512×512 · transparência recomendada</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm"><Icon name="upload" size={13}/> Trocar logo</button>
              <button className="btn btn-ghost btn-sm">Restaurar padrão</button>
            </div>
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Idioma e moeda" sub="Padrão para novas franquias e documentos.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div><label className="field-label">Idioma padrão</label>
            <select className="select"><option>Português (Brasil)</option><option>English (US)</option><option>Español (LATAM)</option></select>
          </div>
          <div><label className="field-label">Moeda</label>
            <select className="select"><option>BRL — Real (R$)</option><option>USD — Dólar</option></select>
          </div>
          <div><label className="field-label">Fuso horário</label>
            <select className="select"><option>América / São Paulo (GMT-3)</option></select>
          </div>
        </div>
      </SettingsBlock>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn btn-ghost">Descartar</button>
        <button className="btn btn-primary" onClick={() => window.toast && window.toast('Configurações da empresa salvas')}><Icon name="check" size={14} stroke={3}/> Salvar alterações</button>
      </div>
    </>
  );
};

const SettingsEquipe = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [newTeamOpen, setNewTeamOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const TEAM_MEMBERS = [
    { name: 'Renata Guimarães',   email: 'renata.g@nayax.com',   role: 'Admin',       last: 'agora',     avatar: 'RG', color: 'var(--accent)',     team: '—' },
    { name: 'Felipe Andrade',     email: 'felipe.a@nayax.com',   role: 'Coordenador', last: 'há 12 min', avatar: 'FA', color: 'var(--iris)',       team: 'Time SP' },
    { name: 'Camila Souza',       email: 'camila.s@nayax.com',   role: 'Coordenador', last: 'há 2 h',    avatar: 'CS', color: 'var(--spring)',     team: 'Time NE' },
    { name: 'Bruno Tavares',      email: 'bruno.t@nayax.com',    role: 'Consultor',   last: 'há 1 d',    avatar: 'BT', color: 'var(--coral)',      team: 'Time SP' },
    { name: 'Lucas Mendes',       email: 'lucas.m@nayax.com',    role: 'Consultor',   last: 'há 5 d',    avatar: 'LM', color: 'var(--neutral-60)', team: 'Time SP' },
    { name: 'Ana Beatriz',        email: 'ana.b@nayax.com',      role: 'Consultor',   last: 'há 4 h',    avatar: 'AB', color: 'var(--violet)',     team: 'Time NE' },
  ];
  const TEAMS = [
    { id: 'sp', name: 'Time SP',  coord: 'Felipe Andrade', members: TEAM_MEMBERS.filter(m => m.team === 'Time SP'), region: 'Sudeste',    color: 'var(--iris)' },
    { id: 'ne', name: 'Time NE',  coord: 'Camila Souza',   members: TEAM_MEMBERS.filter(m => m.team === 'Time NE'), region: 'Nordeste',   color: 'var(--spring)' },
  ];

  // Editable permissions matrix
  const PERMS_INIT = [
    { id: 'dash',     label: 'Ver dashboard',         p: { Admin: true, Coordenador: true,  Consultor: true } },
    { id: 'fran_mng', label: 'Gerenciar franquias',   p: { Admin: true, Coordenador: true,  Consultor: false } },
    { id: 'fran_view',label: 'Ver franquias do time', p: { Admin: true, Coordenador: true,  Consultor: true } },
    { id: 'prices',   label: 'Editar preços',         p: { Admin: true, Coordenador: true,  Consultor: false } },
    { id: 'orders',   label: 'Aprovar pedidos',       p: { Admin: true, Coordenador: true,  Consultor: true } },
    { id: 'orders_v', label: 'Ver todos os pedidos',  p: { Admin: true, Coordenador: false, Consultor: false } },
    { id: 'hubspot',  label: 'Importar do HubSpot',   p: { Admin: true, Coordenador: false, Consultor: false } },
    { id: 'bundles',  label: 'Criar bundles',         p: { Admin: true, Coordenador: true,  Consultor: false } },
    { id: 'settings', label: 'Configurações',         p: { Admin: true, Coordenador: false, Consultor: false } },
    { id: 'team',     label: 'Convidar membros',      p: { Admin: true, Coordenador: false, Consultor: false } },
  ];
  const [perms, setPerms] = useState(PERMS_INIT);
  const toggleP = (id, role) => setPerms(prev => prev.map(p =>
    p.id === id ? { ...p, p: { ...p.p, [role]: !p.p[role] } } : p
  ));
  const ROLES = [
    { id: 'Admin',       desc: 'Sistema todo',           color: 'var(--accent)' },
    { id: 'Coordenador', desc: 'Comanda um time',        color: 'var(--iris)' },
    { id: 'Consultor',   desc: 'Carteira do time',       color: 'var(--spring)' },
  ];

  return (
    <>
      {/* TIMES */}
      <SettingsBlock title="Times comerciais" sub={`${TEAMS.length} times · cada coordenador gerencia seus consultores`}
        action={<button className="btn btn-primary btn-sm" onClick={() => setNewTeamOpen(true)}><Icon name="plus" size={13}/> Novo time</button>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {TEAMS.map(t => (
            <div key={t.id} className="card" style={{ padding: 16, borderTop: '3px solid ' + t.color }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Região: {t.region}</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }} onClick={() => setEditingTeam(t)}><Icon name="edit" size={13}/></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: t.color, color: 'var(--dark)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11 }}>{t.coord.split(' ').slice(0,2).map(s=>s[0]).join('')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t.coord}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Coordenador</div>
                </div>
                <span className="badge badge-purple" style={{ fontSize: 10 }}>{t.members.length} consultor{t.members.length !== 1 ? 'es' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {t.members.map(m => (
                  <div key={m.email} title={m.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-pill)', fontSize: 11 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: m.color, color: 'var(--dark)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 9 }}>{m.avatar}</div>
                    <span style={{ fontWeight: 500 }}>{m.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SettingsBlock>

      {/* MEMBERS LIST */}
      <SettingsBlock title="Membros da equipe" sub={`${TEAM_MEMBERS.length} usuários · acesso via HubSpot SSO ou e-mail @nayax.com`}
        action={<button className="btn btn-secondary btn-sm" onClick={() => setInviteOpen(true)}><Icon name="plus" size={13}/> Convidar pessoa</button>}>
        <div style={{ border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
          {TEAM_MEMBERS.map((m, i) => (
            <div key={m.email} style={{ display: 'grid', gridTemplateColumns: '38px 1fr 130px 130px 110px 60px', gap: 12, padding: '12px 16px', alignItems: 'center', borderBottom: i < TEAM_MEMBERS.length - 1 ? '1px solid var(--line-1)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.color, color: 'var(--dark)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{m.avatar}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.email}</div>
              </div>
              <select className="select" defaultValue={m.role} style={{ height: 30, fontSize: 12 }}>
                <option>Admin</option><option>Coordenador</option><option>Consultor</option>
              </select>
              <select className="select" defaultValue={m.team} style={{ height: 30, fontSize: 12 }}>
                <option>—</option><option>Time SP</option><option>Time NE</option>
              </select>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Visto {m.last}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                <button className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }}><Icon name="more" size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </SettingsBlock>

      {/* PERMISSIONS MATRIX - editable */}
      <SettingsBlock title="Permissões por papel" sub="Clique nas células para permitir ou bloquear cada ação. Salva automaticamente.">
        {/* Scope explainer banner */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14,
        }}>
          {[
            { role: 'Admin',       scope: 'Vê tudo',                                      desc: 'Acesso global ao portal',                                       color: 'var(--accent)',  icon: 'shield' },
            { role: 'Coordenador', scope: 'Só do time dele',                              desc: 'Vê apenas franquias/pedidos dos consultores que lidera',        color: 'var(--iris)',    icon: 'users' },
            { role: 'Consultor',   scope: 'Só da sua carteira',                           desc: 'Vê apenas franquias/pedidos atribuídos diretamente a ele',      color: 'var(--spring)',  icon: 'user' },
          ].map(r => (
            <div key={r.role} style={{
              padding: '11px 13px',
              border: '1px solid var(--line-1)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              borderTop: '3px solid ' + r.color,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Icon name={r.icon} size={13} style={{ color: r.color }}/>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{r.role}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10.5, padding: '2px 7px', borderRadius: 10, background: 'var(--bg-surface-2)', color: 'var(--text-2)', fontWeight: 600 }}>{r.scope}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.45 }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ overflow: 'auto', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
          <table className="t" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th>Recurso</th>
                {ROLES.map(r => (
                  <th key={r.id} style={{ textAlign: 'center', minWidth: 130 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color }}/>
                        <span>{r.id}</span>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>{r.desc}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perms.map(row => {
                // Define scope per row (which actions are naturally scoped)
                const SCOPE_RULES = {
                  fran_view: { Coordenador: 'do time',   Consultor: 'próprias' },
                  orders:    { Coordenador: 'do time',   Consultor: 'próprios' },
                  orders_v:  { Coordenador: '— (todos)', Consultor: '— (todos)' },
                };
                return (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>{row.label}</td>
                    {ROLES.map(r => {
                      const on = row.p[r.id];
                      const locked = r.id === 'Admin';
                      const scope = SCOPE_RULES[row.id]?.[r.id];
                      return (
                        <td key={r.id} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <button
                              onClick={() => !locked && toggleP(row.id, r.id)}
                              disabled={locked}
                              style={{
                                width: 28, height: 28,
                                borderRadius: '50%',
                                border: '1.5px solid ' + (on ? 'var(--green-30)' : 'var(--line-2)'),
                                background: on ? 'var(--green-soft)' : 'var(--bg-surface)',
                                color: on ? 'var(--green-30)' : 'var(--neutral-60)',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                cursor: locked ? 'not-allowed' : 'pointer',
                                opacity: locked ? 0.65 : 1,
                                transition: 'all .12s',
                              }}
                              title={locked ? 'Admin sempre tem acesso' : (on ? 'Permitido — clique para bloquear' : 'Bloqueado — clique para permitir')}
                            >
                              {on
                                ? <Icon name="check" size={14} stroke={3}/>
                                : <Icon name="x" size={11} stroke={3}/>}
                            </button>
                            {on && scope && (
                              <span style={{ fontSize: 9.5, color: r.color, fontWeight: 600, letterSpacing: '0.03em' }}>{scope}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span><Icon name="info" size={11}/> Admin sempre tem acesso total — não pode ser desativado · Coordenador e Consultor têm escopo limitado conforme card acima</span>
          <span style={{ flex: 1 }}/>
          <button className="btn btn-ghost btn-sm" onClick={() => setPerms(PERMS_INIT)}>Restaurar padrão</button>
        </div>
      </SettingsBlock>

      {inviteOpen && <InviteMemberModal onClose={() => setInviteOpen(false)}/>}
      {(newTeamOpen || editingTeam) && <TeamModal existing={editingTeam} onClose={() => { setNewTeamOpen(false); setEditingTeam(null); }}/>}
    </>
  );
};

/* ─────── Team modal ─────── */
const TeamModal = ({ existing, onClose }) => {
  const isEdit = !!existing;
  const [name, setName] = useState(existing?.name || '');
  const [region, setRegion] = useState(existing?.region || 'Sudeste');
  const [coord, setCoord] = useState(existing?.coord || '');
  const [memberPicks, setMemberPicks] = useState(existing ? existing.members.map(m => m.email) : []);

  const ALL_MEMBERS = [
    { name: 'Felipe Andrade',  email: 'felipe.a@nayax.com',  avatar: 'FA', role: 'Coordenador' },
    { name: 'Camila Souza',    email: 'camila.s@nayax.com',  avatar: 'CS', role: 'Coordenador' },
    { name: 'Bruno Tavares',   email: 'bruno.t@nayax.com',   avatar: 'BT', role: 'Consultor' },
    { name: 'Lucas Mendes',    email: 'lucas.m@nayax.com',   avatar: 'LM', role: 'Consultor' },
    { name: 'Ana Beatriz',     email: 'ana.b@nayax.com',     avatar: 'AB', role: 'Consultor' },
  ];
  const coords = ALL_MEMBERS.filter(m => m.role === 'Coordenador');
  const consultores = ALL_MEMBERS.filter(m => m.role === 'Consultor');

  const togglePick = (email) => setMemberPicks(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  const valid = name && coord;

  const submit = () => {
    window.toast && window.toast(`Time ${name} ${isEdit ? 'atualizado' : 'criado'} · ${memberPicks.length} consultor${memberPicks.length !== 1 ? 'es' : ''}`);
    onClose();
  };

  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center' }}>
              <Icon name="users" size={17}/>
            </div>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>{isEdit ? 'Editar time' : 'Novo time'}</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{name || 'Time sem nome'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>

        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <div><label className="field-label">Nome do time</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Time Sudeste"/></div>
            <div><label className="field-label">Região</label>
              <select className="select" value={region} onChange={e => setRegion(e.target.value)}>
                <option>Norte</option><option>Nordeste</option><option>Centro-Oeste</option><option>Sudeste</option><option>Sul</option><option>Nacional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Coordenador do time</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {coords.map(c => (
                <label key={c.email} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  border: '1px solid ' + (coord === c.name ? 'var(--dark)' : 'var(--line-2)'),
                  background: coord === c.name ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}>
                  <input type="radio" name="coord" checked={coord === c.name} onChange={() => setCoord(c.name)} style={{ accentColor: 'var(--iris)' }}/>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--iris)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11 }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{c.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Consultores no time</span>
              <span style={{ textTransform: 'none', fontWeight: 600, color: 'var(--text-2)', letterSpacing: 0 }}>{memberPicks.length} selecionado{memberPicks.length !== 1 ? 's' : ''}</span>
            </label>
            <div style={{ border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', maxHeight: 200, overflowY: 'auto' }}>
              {consultores.map((c, i) => (
                <label key={c.email} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  background: memberPicks.includes(c.email) ? 'var(--accent-soft)' : 'var(--bg-surface)',
                  borderBottom: i < consultores.length - 1 ? '1px solid var(--line-1)' : 'none',
                  cursor: 'pointer',
                }}>
                  <input type="checkbox" checked={memberPicks.includes(c.email)} onChange={() => togglePick(c.email)} style={{ accentColor: 'var(--accent)' }}/>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--spring)', color: 'var(--dark)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11 }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{c.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '16px 28px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit} disabled={!valid}>
            <Icon name="check" size={14} stroke={3}/> {isEdit ? 'Salvar time' : 'Criar time'}
          </button>
        </div>
      </div>
    </div>
  );
};

window.TeamModal = TeamModal;

const SettingsIntegracoes = () => {
  const [items, setItems] = useState([
    { id: 'hubspot', name: 'HubSpot CRM',      desc: 'Sincronização de produtos, contatos e oportunidades', icon: 'hubspot', tone: '#FF7A59', status: 'connected', meta: 'Última sync: hoje, 09:42' },
    { id: 'make',    name: 'Make (Integromat)',desc: 'Webhooks de pedidos para automação',                  icon: 'plug',    tone: '#6D5BF7', status: 'connected', meta: '2 cenários ativos' },
    { id: 'pipefy',  name: 'Pipefy',           desc: 'Gestão de processos e fluxo de produção',             icon: 'grid',    tone: '#00C29D', status: 'connected', meta: 'Pipe Produção · 4 fases' },
  ]);
  return (
    <SettingsBlock title="Integrações" sub="Conectores externos do portal Nayax." action={<button className="btn btn-secondary btn-sm"><Icon name="plus" size={13}/> Conectar nova</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {items.map(it => (
          <div key={it.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: it.tone, color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={it.icon} size={18}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{it.name}</div>
                {it.status === 'connected'    && <span className="badge badge-green" style={{ fontSize: 10, marginTop: 2 }}><span className="dot"/> Conectado</span>}
                {it.status === 'disconnected' && <span className="badge badge-neutral" style={{ fontSize: 10, marginTop: 2 }}><span className="dot"/> Desconectado</span>}
                {it.status === 'pending'      && <span className="badge badge-orange" style={{ fontSize: 10, marginTop: 2 }}><span className="dot"/> Pendente</span>}
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', minHeight: 36, lineHeight: 1.5 }}>{it.desc}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, marginBottom: 12, fontFamily: it.status === 'connected' ? 'var(--font-mono)' : 'var(--font-sans)' }}>{it.meta}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {it.status === 'connected' && <>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Configurar</button>
                <button className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="refresh" size={13}/></button>
              </>}
              {it.status !== 'connected' && <button className="btn btn-dark btn-sm" style={{ flex: 1 }}><Icon name="plug" size={12}/> Conectar</button>}
            </div>
          </div>
        ))}
      </div>
    </SettingsBlock>
  );
};

const SettingsNotificacoes = () => {
  const [prefs, setPrefs] = useState({
    newOrder: true, orderApproved: true, orderShipped: false, orderCancelled: true,
    newFranchise: true, hubspotSync: false, dailyReport: true, weeklyReport: false,
    slackEnabled: false, emailEnabled: true,
  });
  const upd = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const events = [
    { id: 'newOrder',       label: 'Novo pedido enviado',       desc: 'Quando uma franquia envia pedido' },
    { id: 'orderApproved',  label: 'Pedido aprovado',           desc: 'Pagamento confirmado pelo time' },
    { id: 'orderShipped',   label: 'Pedido enviado',            desc: 'Marcado como em transporte' },
    { id: 'orderCancelled', label: 'Pedido cancelado',          desc: 'Pela franquia ou pelo admin' },
    { id: 'newFranchise',   label: 'Nova franquia cadastrada',  desc: 'Aguardando aprovação ou ativada' },
    { id: 'hubspotSync',    label: 'Sync HubSpot',              desc: 'Quando produtos novos aparecem' },
    { id: 'dailyReport',    label: 'Resumo diário',             desc: 'Volume e pedidos das últimas 24h' },
    { id: 'weeklyReport',   label: 'Resumo semanal',            desc: 'Toda segunda-feira às 09:00' },
  ];
  return (
    <>
      <SettingsBlock title="Canais de notificação" sub="Onde você quer receber alertas do portal.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: 'var(--text-1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="mail" size={16}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>E-mail</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>renata.g@nayax.com</div>
            </div>
            <Toggle on={prefs.emailEnabled} onChange={() => upd('emailEnabled')}/>
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Eventos" sub="Marque os tipos de notificação que você quer receber.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {events.map(ev => (
            <label key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: prefs[ev.id] ? 'var(--bg-surface-2)' : 'var(--bg-surface)' }}>
              <Toggle on={prefs[ev.id]} onChange={() => upd(ev.id)}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{ev.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </SettingsBlock>
    </>
  );
};

const SettingsSeguranca = () => {
  const [opts, setOpts] = useState({ twoFA: true, sso: true, ipRestrict: false, auditLog: true });
  const upd = (k) => setOpts(o => ({ ...o, [k]: !o[k] }));
  return (
    <>
      <SettingsBlock title="Autenticação" sub="Como administradores entram no portal.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'sso',        label: 'Login via HubSpot SSO',   desc: 'Recomendado — sem senhas locais' },
            { id: 'twoFA',      label: 'Autenticação em 2 etapas', desc: 'Obrigatória para papéis Admin' },
            { id: 'ipRestrict', label: 'Restrição por IP',         desc: 'Permitir acesso apenas de IPs autorizados' },
            { id: 'auditLog',   label: 'Log de auditoria',         desc: 'Registrar todas as ações administrativas' },
          ].map(o => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-2)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{o.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{o.desc}</div>
              </div>
              <Toggle on={opts[o.id]} onChange={() => upd(o.id)}/>
            </div>
          ))}
        </div>
      </SettingsBlock>

      <SettingsBlock title="Sessão" sub="Tempo limite de inatividade e regras de senha.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><label className="field-label">Expirar sessão após</label>
            <select className="select"><option>2 horas</option><option>8 horas</option><option>24 horas</option><option>7 dias</option></select>
          </div>
          <div><label className="field-label">Política de senha</label>
            <select className="select"><option>Forte (12+ caracteres, especial)</option><option>Média (8+ caracteres)</option></select>
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock title="Sessões ativas" sub="Dispositivos atualmente logados na sua conta.">
        {[
          { dev: 'MacBook Pro · Chrome', loc: 'São Paulo / SP', ip: '187.84.12.4',   last: 'agora',   current: true },
          { dev: 'iPhone · Safari',       loc: 'São Paulo / SP', ip: '187.84.12.4',   last: 'há 2 h',  current: false },
          { dev: 'Windows · Edge',        loc: 'Campinas / SP',  ip: '177.103.55.1',  last: 'há 3 d',  current: false },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--line-1)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-80)', color: 'var(--text-2)', display: 'grid', placeItems: 'center' }}>
              <Icon name="shield" size={14}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.dev} {s.current && <span className="badge badge-green" style={{ fontSize: 9, marginLeft: 6 }}>Esta sessão</span>}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{s.loc} · IP {s.ip} · {s.last}</div>
            </div>
            {!s.current && <button className="btn btn-danger btn-sm">Encerrar</button>}
          </div>
        ))}
      </SettingsBlock>
    </>
  );
};

const SettingsAparencia = () => {
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('#FFCD00');
  return (
    <>
      <SettingsBlock title="Tema" sub="Esta é a aparência que admins veem no painel.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { id: 'light', label: 'Claro',      desc: 'Padrão para uso diurno', bg: '#F7F5F0', fg: '#262626' },
            { id: 'dark',  label: 'Escuro',     desc: 'Interface escura',        bg: '#262626', fg: '#FFCD00' },
            { id: 'auto',  label: 'Automático', desc: 'Segue o sistema',         bg: 'linear-gradient(90deg, #F7F5F0 50%, #262626 50%)', fg: '#262626' },
          ].map((tm) => {
            const sel = theme === tm.id;
            return (
            <button key={tm.id} onClick={() => { setTheme(tm.id); window.toast && window.toast('Tema "' + tm.label + '" aplicado'); }} style={{
              padding: 16,
              border: '1px solid ' + (sel ? 'var(--dark)' : 'var(--line-2)'),
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              textAlign: 'left',
              cursor: 'pointer',
              position: 'relative',
            }}>
              <div style={{ width: '100%', height: 60, borderRadius: 'var(--radius-sm)', background: tm.bg, marginBottom: 10, display: 'grid', placeItems: 'center', color: tm.fg, fontWeight: 700, fontSize: 12, letterSpacing: '0.18em' }}>NAYAX</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{tm.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{tm.desc}</div>
                </div>
                {sel && <Icon name="check" size={14} stroke={3} style={{ color: 'var(--green-30)' }}/>}
              </div>
            </button>
            );
          })}
        </div>
      </SettingsBlock>

      <SettingsBlock title="Cor de destaque" sub="Cor primária dos botões e ações no portal.">
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { c: '#FFCD00', name: 'Taxi Yellow (padrão)' },
            { c: '#6D5BF7', name: 'Iris' },
            { c: '#25EF89', name: 'Spring' },
            { c: '#FF5C6C', name: 'Bright Coral' },
          ].map((c) => {
            const sel = accent === c.c;
            return (
            <button key={c.c} title={c.name} onClick={() => { setAccent(c.c); document.documentElement.style.setProperty('--accent', c.c); window.toast && window.toast('Cor de destaque atualizada'); }} style={{
              width: 56, height: 56,
              borderRadius: 'var(--radius-md)',
              background: c.c,
              border: '3px solid ' + (sel ? 'var(--dark)' : 'transparent'),
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              display: 'grid', placeItems: 'center',
            }}>
              {sel && <Icon name="check" size={18} stroke={3} style={{ color: c.c === '#FFCD00' ? 'var(--dark)' : 'white' }}/>}
            </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => window.toast && window.toast('Aparência salva')}><Icon name="check" size={14} stroke={3}/> Salvar aparência</button>
        </div>
      </SettingsBlock>
    </>
  );
};

window.AdminSettings = AdminSettings;
window.Toggle = Toggle;

/* ─────── Invite member modal ─────── */
const InviteMemberModal = ({ onClose }) => {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('Comercial');
  const [msg, setMsg] = useState('');
  const [method, setMethod] = useState('email'); // email | link

  const emailList = emails.split(/[\n,]/).map(e => e.trim()).filter(e => e.includes('@'));
  const valid = emailList.length > 0 || method === 'link';

  const ROLES = [
    { id: 'Admin',     desc: 'Acesso total · configurações · permissões',     color: 'var(--accent)' },
    { id: 'Comercial', desc: 'Franquias · pedidos · preços · catálogo',       color: 'var(--iris)' },
    { id: 'Suporte',   desc: 'Visualizar tudo · aprovar pedidos',             color: 'var(--spring)' },
    { id: 'Viewer',    desc: 'Apenas leitura · dashboards e relatórios',      color: 'var(--neutral-60)' },
  ];

  const submit = () => {
    if (method === 'email') {
      window.toast && window.toast(`Convite enviado para ${emailList.length} ${emailList.length === 1 ? 'pessoa' : 'pessoas'} · papel ${role}`);
    } else {
      navigator.clipboard?.writeText('https://portal.nayax.com.br/invite/abc123def');
      window.toast && window.toast('Link de convite copiado para a área de transferência');
    }
    onClose();
  };

  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center' }}>
              <Icon name="users" size={17}/>
            </div>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>Backoffice Nayax</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Convidar pessoa para a equipe</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>

        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', padding: 4 }}>
            {[
              { id: 'email', label: 'Por e-mail', icon: 'mail' },
              { id: 'link',  label: 'Link público', icon: 'external' },
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                flex: 1, padding: '10px 12px',
                borderRadius: 'var(--radius-xs)',
                fontSize: 13, fontWeight: 600,
                color: method === m.id ? 'var(--text-1)' : 'var(--text-2)',
                background: method === m.id ? 'var(--bg-surface)' : 'transparent',
                boxShadow: method === m.id ? 'var(--shadow-xs)' : 'none',
                border: '1px solid ' + (method === m.id ? 'var(--line-1)' : 'transparent'),
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}><Icon name={m.icon} size={14}/>{m.label}</button>
            ))}
          </div>

          {method === 'email' ? (
            <div>
              <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>E-mails (separados por vírgula ou linha)</span>
                {emailList.length > 0 && <span style={{ textTransform: 'none', fontWeight: 600, color: 'var(--green-30)', letterSpacing: 0 }}>{emailList.length} válido{emailList.length !== 1 ? 's' : ''}</span>}
              </label>
              <textarea className="textarea" value={emails} onChange={e => setEmails(e.target.value)} placeholder="felipe.andrade@nayax.com&#10;camila.souza@nayax.com" rows={3} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}/>
              {emailList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {emailList.map((e, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 'var(--radius-pill)', background: 'var(--green-soft)', color: 'var(--green-30)', fontSize: 11.5, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      <Icon name="check" size={10} stroke={3}/> {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
              <Icon name="external" size={15} style={{ color: 'var(--text-3)' }}/>
              <input readOnly value="https://portal.nayax.com.br/invite/abc123def" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-2)' }}/>
              <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText('https://portal.nayax.com.br/invite/abc123def'); window.toast && window.toast('Link copiado'); }}><Icon name="copy" size={12}/> Copiar</button>
            </div>
          )}

          <div>
            <label className="field-label">Papel atribuído</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ROLES.map(r => (
                <label key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  border: '1px solid ' + (role === r.id ? 'var(--dark)' : 'var(--line-2)'),
                  background: role === r.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}>
                  <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} style={{ accentColor: r.color }}/>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.id}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {method === 'email' && (
            <div>
              <label className="field-label">Mensagem opcional</label>
              <textarea className="textarea" rows={2} placeholder="Olá! Você está sendo convidado para acessar o portal de franquias da Nayax Brasil…" value={msg} onChange={e => setMsg(e.target.value)} style={{ fontSize: 13 }}/>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', background: 'var(--accent-soft)', border: '1px solid var(--taxi-y-3)', borderRadius: 'var(--radius-sm)', fontSize: 12.5, color: 'var(--yellow-00)', lineHeight: 1.5 }}>
            <Icon name="info" size={15} style={{ color: 'var(--yellow-00)', flexShrink: 0, marginTop: 1 }}/>
            {method === 'email'
              ? <span>Cada pessoa receberá um e-mail com link para criar senha e habilitar 2FA. Acesso expira em 7 dias se não aceito.</span>
              : <span>Link compartilhável aceita qualquer e-mail · use com cuidado. Você pode revogá-lo a qualquer momento.</span>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '16px 28px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit} disabled={!valid}>
            <Icon name={method === 'email' ? 'mail' : 'copy'} size={14}/>
            {method === 'email' ? `Enviar convite${emailList.length > 1 ? 's' : ''}` : 'Copiar link'}
          </button>
        </div>
      </div>
    </div>
  );
};

window.InviteMemberModal = InviteMemberModal;
