/* ════════════════════════════════════════════════════════
   Login — redesign editorial com presença de marca forte
   ════════════════════════════════════════════════════════ */

const Login = ({ onSignin }) => {
  const { t, lang, setLang } = useLang();
  const [tab, setTab] = useState('client');
  const [code, setCode] = useState('NX-7842');
  const [pw, setPw] = useState('demo');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Rotating value proposition (each ~3.5s)
  const HEADLINES = [
    { kicker: 'Para seu negócio', big: 'Cashless,', accent: 'telemetria e gestão', tail: 'em uma só plataforma.' },
    { kicker: 'Aprovação ágil',     big: 'Pedidos no portal',   accent: 'aprovados em até 2h', tail: 'pelo time comercial.' },
    { kicker: 'Para todo segmento', big: 'Vending, micromercado,', accent: 'food service, EV e mais', tail: '— um catálogo só.' },
  ];
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HEADLINES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const headline = HEADLINES[heroIdx];

  const submitClient = (e) => {
    e && e.preventDefault();
    const c = code.trim().toUpperCase();
    const isNX = /^NX-?\d{3,}/.test(c);
    const isPartner = /^F0?\d+[-\s]?\d+/.test(c) || /^F\d{2}/.test(c);
    if (pw !== 'demo' || (!isNX && !isPartner)) { setErr(true); return; }
    setLoading(true);
    setTimeout(() => onSignin(isPartner ? 'partner' : 'client'), 700);
  };
  const submitAdmin = () => {
    setLoading(true);
    setTimeout(() => onSignin('admin'), 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      position: 'relative',
      overflow: 'hidden',
    }} className="login-screen">

      {/* ══════════ LEFT — brand panel ══════════ */}
      <div style={{
        background: 'var(--bg-inverse)',
        color: 'var(--text-on-inverse)',
        padding: '40px 56px 36px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-left">

        {/* Giant N watermark in background */}
        <img src="assets/logo-nayax-N.png" alt="" aria-hidden style={{
          position: 'absolute',
          right: '-18%', bottom: '-28%',
          width: '92%', height: 'auto',
          opacity: 0.07,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(135deg, transparent 30%, black 70%)',
          WebkitMaskImage: 'linear-gradient(135deg, transparent 30%, black 70%)',
        }}/>

        {/* Background grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55, pointerEvents: 'none' }}>
          <defs>
            <pattern id="loginGrid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,205,0,0.045)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid2)"/>
        </svg>

        {/* Soft yellow glow */}
        <div style={{
          position: 'absolute', left: '8%', top: '40%',
          width: 320, height: 320,
          background: 'radial-gradient(circle at center, rgba(255,205,0,0.10), transparent 65%)',
          pointerEvents: 'none', filter: 'blur(8px)',
        }}/>

        {/* Top — brand */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, zIndex: 1 }}>
          <NayaxMark size={42}/>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '0.22em', color: 'var(--text-on-inverse)' }}>NAYAX</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-on-inverse-2)', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 3 }}>Brasil — Portal de Vendas</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: 'rgba(37,239,137,0.10)', border: '1px solid rgba(37,239,137,0.25)', color: 'var(--spring)', fontSize: 11, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--spring)' }}/>
            Sistema operacional
          </div>
        </div>

        {/* Middle — hero rotating */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1, paddingRight: 24 }}>
          <div key={heroIdx} className="fade-up">
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: 22,
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 24, height: 2, background: 'var(--accent)' }}/>
              {headline.kicker}
            </div>
            <h1 style={{
              fontSize: 'clamp(40px, 5.2vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              maxWidth: 560,
            }}>
              {headline.big}<br/>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{headline.accent}</span><br/>
              <span style={{ color: 'var(--text-on-inverse-2)', fontWeight: 300 }}>{headline.tail}</span>
            </h1>
          </div>

          {/* Hero indicator dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
            {HEADLINES.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} style={{
                width: i === heroIdx ? 30 : 10,
                height: 4, borderRadius: 2,
                background: i === heroIdx ? 'var(--accent)' : 'rgba(255,255,255,0.18)',
                transition: 'all .3s',
              }}/>
            ))}
          </div>
        </div>

        {/* Bottom — footer */}
        <div style={{ position: 'relative', zIndex: 1, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-on-inverse-2)' }}>
            © 2026 Nayax Brasil · Unattended payments
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT — form panel ══════════ */}
      <div style={{
        padding: '40px 56px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-app)',
        position: 'relative',
      }} className="login-right">

        {/* top right — lang switcher */}
        <div style={{ position: 'absolute', top: 32, right: 56, display: 'flex', gap: 4, padding: 4, background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-pill)' }} className="login-lang">
          {['PT', 'EN', 'ES'].map(l => {
            const id = l.toLowerCase();
            const active = lang === id;
            return (
              <button key={l} onClick={() => { setLang(id); window.toast && window.toast('Idioma alterado para ' + l); }} style={{
                padding: '5px 11px',
                fontSize: 11, fontWeight: 600,
                borderRadius: 'var(--radius-pill)',
                background: active ? 'var(--dark)' : 'transparent',
                color: active ? 'white' : 'var(--text-2)',
                cursor: 'pointer',
                transition: 'all .15s',
              }}>{l}</button>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: 440, margin: '0 auto' }}>

          {/* Eyebrow */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 18, height: 2, background: 'var(--dark)' }}/>
            Bem-vinda de volta
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 10 }}>
            Acesse seu portal Nayax
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 28 }}>
            {tab === 'client'
              ? 'Catálogo personalizado, pedidos rastreáveis e suporte direto do time.'
              : 'Painel administrativo restrito ao time interno Nayax Brasil.'}
          </p>

          {/* Tabs — segmented */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--line-1)',
            borderRadius: 'var(--radius-md)',
            padding: 4,
            marginBottom: 24,
            position: 'relative',
          }}>
            {[
              { id: 'client', label: 'Cliente',        sub: 'Catálogo' },
              { id: 'admin',  label: 'Administração',   sub: 'Backoffice' },
            ].map(t => (
              <button key={t.id}
                onClick={() => { setTab(t.id); setErr(false); }}
                style={{
                  flex: 1, padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13, fontWeight: 600,
                  color: tab === t.id ? 'var(--neutral-15)' : 'var(--text-2)',
                  background: tab === t.id ? 'var(--bg-surface-2)' : 'transparent',
                  boxShadow: tab === t.id ? 'var(--shadow-xs)' : 'none',
                  border: tab === t.id ? '1px solid var(--line-1)' : '1px solid transparent',
                  transition: 'all .15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                }}>
                <span>{t.label}</span>
                <span style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.04em' }}>{t.sub}</span>
              </button>
            ))}
          </div>

          {tab === 'client' ? (
            <form onSubmit={submitClient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {forgot && (
                <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setForgot(false)}>
                  <div className="modal" style={{ maxWidth: 440 }}>
                    <div style={{ padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--yellow-00)', display: 'grid', placeItems: 'center' }}><Icon name="lock" size={20}/></div>
                        <button onClick={() => setForgot(false)} style={{ width: 30, height: 30, color: 'var(--text-3)' }}><Icon name="x" size={16}/></button>
                      </div>
                      {!resetSent ? (
                        <>
                          <div style={{ fontSize: 18, fontWeight: 700 }}>Recuperar senha</div>
                          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.5 }}>Informe o código da franquia ou e-mail cadastrado. Enviaremos um link para redefinir a senha.</div>
                          <div style={{ margintop: 16, marginTop: 16 }}>
                            <label className="field-label">Código ou e-mail</label>
                            <input className="input" defaultValue={code} placeholder="NX-0000 ou e-mail"/>
                          </div>
                          <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={() => setResetSent(true)}>
                            <Icon name="mail" size={15}/> Enviar link de recuperação
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 18, fontWeight: 700 }}>Link enviado!</div>
                          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.5 }}>Se houver uma conta vinculada, você receberá um e-mail com instruções em alguns minutos. Verifique também a caixa de spam.</div>
                          <button type="button" className="btn btn-dark btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={() => setForgot(false)}>
                            <Icon name="check" size={15} stroke={3}/> Entendi
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {err && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'var(--coral-1)', border: '1px solid var(--coral-2)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--red-30)', fontSize: 13, fontWeight: 500,
                }}>
                  <Icon name="alert" size={15}/>
                  Código ou senha inválidos. Tente novamente.
                </div>
              )}
              <div>
                <label className="field-label">Código de acesso</label>
                <div className="input-group">
                  <Icon name="building" size={15}/>
                  <input value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setErr(false); }} placeholder="NX-0000" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', fontSize: 14 }} autoFocus/>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Senha</label>
                  <a onClick={() => { setForgot(true); setResetSent(false); }} style={{ fontSize: 12, color: 'var(--text-link)', cursor: 'pointer', fontWeight: 500 }}>Esqueci minha senha</a>
                </div>
                <div className="input-group">
                  <Icon name="lock" size={15}/>
                  <input value={pw} onChange={e => { setPw(e.target.value); setErr(false); }} type={showPw ? 'text' : 'password'} placeholder="Sua senha de acesso"/>
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ color: 'var(--text-3)', display: 'grid', placeItems: 'center', padding: 4 }}>
                    <Icon name={showPw ? 'eye-off' : 'eye'} size={15}/>
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Demo:</span>
                <button type="button" onClick={() => { setCode('NX-7842'); setPw('demo'); setErr(false); }} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--line-2)', background: 'var(--bg-surface)', color: 'var(--text-2)', cursor: 'pointer' }}>NX-7842 · cliente</button>
                <button type="button" onClick={() => { setCode('F01-204'); setPw('demo'); setErr(false); }} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--line-2)', background: 'var(--bg-surface)', color: 'var(--text-2)', cursor: 'pointer' }}>F01-204 · parceiro</button>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer', marginTop: 2 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--dark)', width: 14, height: 14 }}/>
                Manter sessão por 30 dias neste dispositivo
              </label>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 10, height: 52, fontSize: 14, fontWeight: 700, letterSpacing: '0.01em' }}>
                {loading ? (
                  <><span className="login-spinner"/> Entrando…</>
                ) : (
                  <>Acessar catálogo <Icon name="arrow-right" size={15}/></>
                )}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <button onClick={submitAdmin} disabled={loading} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                height: 52, borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #FF7A59, #E5573C)',
                color: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255,122,89,0.25)',
              }}>
                <Icon name="hubspot" size={18}/>
                {loading ? 'Autorizando…' : 'Continuar com HubSpot'}
                <Icon name="arrow-right" size={15}/>
              </button>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-1)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                fontSize: 13, color: 'var(--text-2)',
                lineHeight: 1.55,
                marginTop: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-xs)', background: 'var(--iris-1)', display: 'grid', placeItems: 'center' }}>
                    <Icon name="shield" size={13} style={{ color: 'var(--iris)' }}/>
                  </div>
                  <strong style={{ color: 'var(--text-1)', fontSize: 13 }}>Acesso restrito</strong>
                </div>
                <div>Apenas para usuários da Nayax.</div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 36, paddingTop: 22, borderTop: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-3)' }}>
            <span>Primeira vez? <a style={{ color: 'var(--text-link)', fontWeight: 500, cursor: 'pointer' }}>Falar com um consultor</a></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="lock" size={11}/>
              <span style={{ fontFamily: 'var(--font-mono)' }}>v2026.05.27</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.15);
          border-top-color: var(--dark);
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 980px) {
          .login-screen { grid-template-columns: 1fr !important; }
          .login-screen .login-left { padding: 28px 22px !important; min-height: 280px; }
          .login-screen .login-right { padding: 32px 22px !important; }
          .login-screen .login-left h1 { font-size: 32px !important; }
          .login-screen .login-lang { top: 14px !important; right: 14px !important; }
          .login-screen .login-left img[alt=""] { display: none !important; }
        }
      `}</style>
    </div>
  );
};

window.Login = Login;
