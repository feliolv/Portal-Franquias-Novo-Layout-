/* ════════════════════════════════════════════════════════
   Cliente: Minha Conta / Perfil
   ════════════════════════════════════════════════════════ */

const Profile = ({ cart, setRoute, openCart }) => {
  const { t } = useLang();
  const _user = API.Auth.getUser() || {};
  const { t } = useLang();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const [tab, setTab] = useState('dados');
  const [twoFA, setTwoFA] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWpp, setNotifWpp] = useState(false);

  const save = () => window.toast && window.toast('Alterações salvas');

  return (
    <div className="app-layout">
      <ClientSidebar route="" setRoute={setRoute} cart={cart}/>
      <div className="app-main">
        <Topbar breadcrumb={[{ label: 'Minha conta' }]} onCartClick={openCart} cartCount={cartCount}/>
        <div className="app-content">
          <PageHeader kicker={"Conta " + (_user.code || "")} title="Minha conta" sub="Gerencie seus dados, senha e preferências de notificação."/>

          {/* Identity banner */}
          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 700 }}>MR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{_user.name || '—'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{_user.role || ''} · <span className="t-mono">{_user.code || ''}</span></div>
            </div>
            <button className="btn btn-secondary btn-sm"><Icon name="edit" size={13}/> Trocar foto</button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 18, borderBottom: '1px solid var(--line-1)' }}>
            {[
              { id: 'dados', label: 'Dados pessoais' },
              { id: 'senha', label: 'Senha & segurança' },
              { id: 'notif', label: 'Notificações' },
            ].map(tt => (
              <button key={tt.id} onClick={() => setTab(tt.id)} style={{
                padding: '10px 14px', fontSize: 13, fontWeight: 600,
                color: tab === tt.id ? 'var(--text-1)' : 'var(--text-3)',
                borderBottom: '2px solid ' + (tab === tt.id ? 'var(--accent)' : 'transparent'),
                marginBottom: -1,
              }}>{tt.label}</button>
            ))}
          </div>

          {tab === 'dados' && (
            <div className="card card-pad-lg fade-in" style={{ maxWidth: 680 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label className="field-label">Nome completo</label><input className="input" defaultValue="Marina Reis"/></div>
                <div><label className="field-label">Cargo</label><input className="input" defaultValue="Compradora"/></div>
                <div><label className="field-label">E-mail</label><input className="input" defaultValue="marina@vendingpremier.com"/></div>
                <div><label className="field-label">Telefone</label><input className="input" defaultValue="(11) 98765-4321"/></div>
                <div style={{ gridColumn: '1 / -1' }}><label className="field-label">Empresa (somente leitura)</label><input className="input" defaultValue="Vending Premier Ltda. · CNPJ 12.345.678/0001-90" disabled style={{ background: 'var(--bg-surface-2)', color: 'var(--text-3)' }}/></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button className="btn btn-ghost">Descartar</button>
                <button className="btn btn-primary" onClick={save}><Icon name="check" size={14} stroke={3}/> Salvar alterações</button>
              </div>
            </div>
          )}

          {tab === 'senha' && (
            <div className="card card-pad-lg fade-in" style={{ maxWidth: 680 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
                <div><label className="field-label">Senha atual</label><input className="input" type="password" placeholder="••••••••"/></div>
                <div><label className="field-label">Nova senha</label><input className="input" type="password" placeholder="Mínimo 8 caracteres"/></div>
                <div><label className="field-label">Confirmar nova senha</label><input className="input" type="password"/></div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => window.toast && window.toast('Senha atualizada')}><Icon name="lock" size={14}/> Atualizar senha</button>
              </div>
              <div style={{ borderTop: '1px solid var(--line-1)', marginTop: 24, paddingTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--green-soft)', color: 'var(--green-30)', display: 'grid', placeItems: 'center' }}><Icon name="shield" size={18}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Autenticação em 2 etapas</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{twoFA ? 'Ativada via SMS · (11) ****-4321' : 'Adicione uma camada extra de segurança'}</div>
                </div>
                <Toggle on={twoFA} onChange={() => { setTwoFA(v => !v); window.toast && window.toast(twoFA ? '2FA desativado' : '2FA ativado'); }}/>
              </div>
            </div>
          )}

          {tab === 'notif' && (
            <div className="card card-pad-lg fade-in" style={{ maxWidth: 680 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Status de pedidos por e-mail', desc: 'Aprovação, envio e entrega', on: notifEmail, set: setNotifEmail },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{n.desc}</div>
                    </div>
                    <Toggle on={n.on} onChange={() => { n.set(v => !v); save(); }}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-md)', maxWidth: 680 }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Encerrar sua sessão neste dispositivo</div>
            <button className="btn btn-danger btn-sm" onClick={() => setRoute('login')}><Icon name="logout" size={13}/> Sair</button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Profile = Profile;
