/* ════════════════════════════════════════════════════════
   Shared UI primitives — buttons, badges, layout shell
   ════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef, useMemo } = React;

/* ─────── Toast (singleton) ─────── */
const Toast = () => {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    window.toast = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2400); };
  }, []);
  return <div className={'toast ' + (msg ? 'visible' : '')}>{msg && <><Icon name="check" size={14}/> {msg}</>}</div>;
};

/* ─────── Status pill ─────── */
const StatusPill = ({ status }) => {
  const { t } = useLang();
  const m = STATUS_META[status] || { label: status, tone: 'neutral' };
  const label = t('status.' + status, m.label);
  return <span className={'badge badge-' + m.tone}><span className="dot"/> {label}</span>;
};

/* ─────── Logo mark — official Nayax PNG ─────── */
const NayaxMark = ({ size = 28, on = 'dark' }) => {
  // on='dark': white N + yellow wedge on dark surfaces
  // on='light': dark surface backing
  if (on === 'dark') {
    return <img src="assets/logo-nayax-N.png" alt="Nayax" style={{ width: size, height: 'auto', display: 'block', flexShrink: 0 }}/>;
  }
  return (
    <div style={{
      width: size, height: size,
      background: 'var(--dark)',
      borderRadius: Math.round(size * 0.2),
      display: 'grid', placeItems: 'center', flexShrink: 0,
      padding: Math.round(size * 0.12),
    }}>
      <img src="assets/logo-nayax-N.png" alt="Nayax" style={{ width: '100%', height: 'auto', display: 'block' }}/>
    </div>
  );
};

const NayaxWordmark = ({ height = 22, on = 'dark' }) => {
  // The full wordmark PNG is white text — usable on dark surfaces only.
  return <img src="assets/logo-nayax.png" alt="Nayax" style={{ height, width: 'auto', display: 'block', filter: on === 'dark' ? 'none' : 'invert(1) hue-rotate(180deg)' }}/>;
};

/* ─────── Sidebar (client) ─────── */
const ClientSidebar = ({ route, setRoute, cart }) => {
  const { t } = useLang();
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = cart.reduce((a, c) => a + (c.product.price || 0) * c.qty, 0);
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <NayaxMark size={32}/>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.2em', color: 'var(--text-on-inverse)' }}>NAYAX</div>
          <div className="sub" style={{ marginTop: 2 }}>Brasil · Vendas</div>
        </div>
      </div>
      <div className="sidebar-account">
        <div className="label">{t('nav.client.account')}</div>
        <div className="name">{(API.Auth.getUser()||{}).name || '—'}</div>
        <div className="code"><Icon name="lock" size={10}/> {(API.Auth.getUser()||{}).code || ''}</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">{t('nav.client.catalogSection')}</div>
        <div className={'nav-item ' + (route === 'catalog' ? 'active' : '')} onClick={() => setRoute('catalog')}>
          <Icon name="grid"/>{t('nav.client.catalog')}
        </div>
        <div className={'nav-item ' + (route === 'history' ? 'active' : '')} onClick={() => setRoute('history')}>
          <Icon name="receipt"/>{t('nav.client.orders')}<span className="count">12</span>
        </div>
      </nav>
      <div className="sidebar-foot">
        <div className="user-pill" onClick={() => window.setRoute && window.setRoute('profile')}>
          <div className="avatar">{((API.Auth.getUser()||{}).name||'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="name">{(API.Auth.getUser()||{}).name || '—'}</div>
            <div className="role">{t('nav.client.role')}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); window.setRoute && window.setRoute('login'); }} title="Sair" style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 6, color: 'var(--text-on-inverse-2)', background: 'transparent' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--coral)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-on-inverse-2)'; }}>
            <Icon name="logout" size={14}/>
          </button>
        </div>
      </div>
    </aside>
  );
};

/* ─────── Sidebar (admin) ─────── */
const AdminSidebar = ({ route, setRoute }) => {
  const { t } = useLang();
  const NAV_LABELS = {
    dashboard: t('nav.admin.dashboard'),
    sales: t('nav.admin.sales'),
    clients: t('nav.admin.clients'),
    products: t('nav.admin.products'),
    bundles: t('nav.admin.bundles'),
    hubspot: t('nav.admin.hubspot'),
  };
  return (
  <aside className="sidebar">
    <div className="sidebar-brand">
      <NayaxMark size={32}/>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.2em', color: 'var(--text-on-inverse)' }}>NAYAX</div>
        <div className="sub" style={{ marginTop: 2 }}>{t('topbar.backoffice')} · Admin</div>
      </div>
    </div>
    <div className="sidebar-account">
      <div className="label">{t('nav.admin.envLabel')}</div>
      <div className="name">{t('nav.admin.envName')}</div>
      <div className="code"><Icon name="shield" size={10}/> {t('common.production')}</div>
    </div>
    <nav className="sidebar-nav">
      <div className="nav-section-label">{t('nav.admin.operation')}</div>
      {NAV_ADMIN.map(item => (
        <div key={item.id}
             className={'nav-item ' + (route === 'admin-' + item.id ? 'active' : '')}
             onClick={() => setRoute('admin-' + item.id)}>
          <Icon name={item.icon}/>
          {NAV_LABELS[item.id] || item.label}
          {/* badges carregados via API — pendente */}
        </div>
      ))}
      <div className="nav-section-label">{t('nav.admin.system')}</div>
      <div className={'nav-item ' + (route === 'admin-settings' ? 'active' : '')} onClick={() => setRoute('admin-settings')}><Icon name="settings"/> {t('nav.admin.settings')}</div>
    </nav>
    <div className="sidebar-foot">
      <div className="user-pill" onClick={() => setRoute('admin-settings')} style={{ cursor: 'pointer' }} title="Configurações de perfil">
        <div className="avatar">{((API.Auth.getUser()||{}).name||"A").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="name">{(API.Auth.getUser()||{}).name || '—'}</div>
          <div className="role">{(API.Auth.getUser()||{}).role || t('nav.admin.role')}</div>
        </div>
        <Icon name="logout" size={14} style={{ color: 'var(--text-on-inverse-2)' }}/>
      </div>
    </div>
  </aside>
  );
};

/* ─────── Topbar ─────── */
const Topbar = ({ title, breadcrumb, actions, onCartClick, cartCount }) => (
  <div className="app-topbar">
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
      {breadcrumb && breadcrumb.map((b, i) => (
        <React.Fragment key={i}>
          <span style={{ fontSize: 13, color: i === breadcrumb.length-1 ? 'var(--text-1)' : 'var(--text-2)', fontWeight: i === breadcrumb.length-1 ? 600 : 500, cursor: b.onClick ? 'pointer' : 'default' }} onClick={b.onClick}>{b.label}</span>
          {i < breadcrumb.length - 1 && <Icon name="chevron-right" size={12} style={{ color: 'var(--neutral-60)' }}/>}
        </React.Fragment>
      ))}
      {!breadcrumb && title && <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {actions}
      {onCartClick && (
        <button className="btn btn-ghost btn-sm" onClick={onCartClick} style={{ position: 'relative' }}>
          <Icon name="cart" size={16}/>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              background: 'var(--accent)', color: 'var(--neutral-15)',
              fontSize: 10, fontWeight: 700, padding: '1px 5px',
              borderRadius: 8, minWidth: 16, textAlign: 'center',
              fontFamily: 'var(--font-mono)',
            }}>{cartCount}</span>
          )}
        </button>
      )}
    </div>
  </div>
);

/* ─────── Page header ─────── */
const PageHeader = ({ title, sub, actions, kicker }) => (
  <div className="page-header">
    <div>
      {kicker && <div className="t-overline" style={{ marginBottom: 6, color: 'var(--text-3)' }}>{kicker}</div>}
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.015em' }}>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);

/* ─────── Mini chart components (no Chart.js, pure SVG) ─────── */
const SparkLine = ({ data, w = 180, h = 56, color = 'var(--neutral-15)' }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad*2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad*2);
    return `${x},${y}`;
  }).join(' ');
  const area = `M ${pts.split(' ').join(' L ')} L ${w-pad},${h-pad} L ${pad},${h-pad} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={area} fill={color} opacity="0.08"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v, i) => i === data.length-1 && (
        <circle key={i} cx={pad + (i / (data.length-1))*(w-pad*2)} cy={h - pad - ((v-min)/(max-min || 1))*(h-pad*2)} r="3" fill={color}/>
      ))}
    </svg>
  );
};

const BarChart = ({ data, h = 140, color = 'var(--neutral-15)', accent = 'var(--accent)' }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: h, padding: '0 4px' }}>
      {data.map((d, i) => {
        const ratio = d.value / max;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: (ratio * 100) + '%',
                background: d.hl ? accent : color,
                borderRadius: '4px 4px 2px 2px',
                opacity: d.hl ? 1 : 0.85,
                transition: 'height .3s ease',
              }}/>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const DonutChart = ({ data, size = 140, stroke = 22 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--neutral-80)" strokeWidth={stroke}/>
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const seg = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={stroke}
          strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          strokeLinecap="butt"/>;
        offset += len;
        return seg;
      })}
    </svg>
  );
};

/* ─────── Product visual (placeholder illustration) ─────── */
const ProductVisual = ({ product, size = 'normal' }) => {
  const ICONS = {
    'Terminais': 'package',
    'EV': 'zap',
    'Kits': 'box',
    'Kiosks': 'building',
    'Mobilidade': 'truck',
    'Acessórios': 'plug',
    'Serviços': 'briefcase',
  };
  const colorByCat = {
    'Terminais': '#19151A',
    'EV':         '#6D5BF7',
    'Kits':       '#1EA472',
    'Kiosks':     '#F08A20',
    'Mobilidade': '#3B82F6',
    'Acessórios': '#737373',
    'Serviços':   '#CC2B42',
  };
  const c = colorByCat[product.cat] || '#19151A';
  const big = size === 'big';
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: big ? 280 : 168,
      background: 'linear-gradient(135deg, #FAF9F5, #F1EFE8)',
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden',
      borderBottom: big ? 'none' : '1px solid var(--line-1)',
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id={'grid-'+product.id} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(25,21,26,0.04)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={'url(#grid-'+product.id+')'}/>
      </svg>
      <div style={{
        width: big ? 140 : 90,
        height: big ? 140 : 90,
        background: c,
        borderRadius: big ? 24 : 18,
        display: 'grid', placeItems: 'center',
        boxShadow: '0 12px 32px rgba(14,17,22,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 1,
      }}>
        <Icon name={ICONS[product.cat] || 'box'} size={big ? 60 : 38} stroke={1.5} style={{ color: c === '#19151A' ? 'var(--accent)' : 'white' }}/>
      </div>
      {product.badge && (
        <div className="badge badge-inverse" style={{ position: 'absolute', top: 12, left: 12, fontSize: 10, padding: '4px 9px', zIndex: 2 }}>
          {product.badge}
        </div>
      )}
      {product.new && !product.badge && (
        <div className="badge badge-inverse" style={{ position: 'absolute', top: 12, left: 12, fontSize: 10, padding: '4px 9px', zIndex: 2 }}>
          Novo
        </div>
      )}
    </div>
  );
};

/* ─────── Quantity stepper ─────── */
const QtyStepper = ({ qty, onChange, compact = false }) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    background: 'var(--bg-surface)',
    border: '1px solid var(--line-2)',
    borderRadius: 'var(--radius-sm)',
    height: compact ? 32 : 38,
    overflow: 'hidden',
  }}>
    <button onClick={() => onChange(Math.max(0, qty - 1))} style={{ width: compact ? 30 : 36, height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
      <Icon name="minus" size={14}/>
    </button>
    <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{qty}</div>
    <button onClick={() => onChange(qty + 1)} style={{ width: compact ? 30 : 36, height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
      <Icon name="plus" size={14}/>
    </button>
  </div>
);

/* ─────── Language picker dropdown ─────── */
const LangPicker = ({ initial = 'pt' }) => {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const ref = useRef(null);
  const LANGS = [
    { id: 'pt', label: 'Português', flag: '🇧🇷', short: 'PT' },
    { id: 'en', label: 'English',   flag: '🇺🇸', short: 'EN' },
    { id: 'es', label: 'Español',   flag: '🇪🇸', short: 'ES' },
  ];
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const current = LANGS.find(l => l.id === lang) || LANGS[0];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="btn btn-ghost btn-sm" title="Idioma" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="globe" size={14}/>
        <span>{current.short}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={11} style={{ color: 'var(--text-3)' }}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          minWidth: 160,
          background: 'var(--bg-surface)',
          border: '1px solid var(--line-1)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: 4,
          zIndex: 200,
          animation: 'fadeUp .15s ease both',
        }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => { setLang(l.id); setOpen(false); if (window.toast) window.toast(t('toast.langChanged') + ' · ' + l.label); }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                fontSize: 13,
                color: 'var(--text-1)',
                background: lang === l.id ? 'var(--bg-surface-2)' : 'transparent',
                fontWeight: lang === l.id ? 600 : 500,
                textAlign: 'left',
              }}
              onMouseOver={e => { if (lang !== l.id) e.currentTarget.style.background = 'var(--bg-surface-2)'; }}
              onMouseOut={e => { if (lang !== l.id) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>{l.short}</span>
              {lang === l.id && <Icon name="check" size={13} stroke={3} style={{ color: 'var(--green-30)' }}/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────── Notifications dropdown ─────── */
const NotifBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [items, setItems] = useState([]); // carregado via API

  const unread = items.filter(i => !i.read).length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));
  const ICONS = { order: 'cart', user: 'user', plug: 'plug', check: 'check', alert: 'alert' };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="btn btn-ghost btn-sm" title="Notificações" style={{ position: 'relative' }}>
        <Icon name="bell" size={14}/>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            minWidth: 16, height: 16,
            padding: '0 4px',
            background: 'var(--red-30)',
            color: 'white',
            fontSize: 9, fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            borderRadius: 8,
            display: 'grid', placeItems: 'center',
            border: '2px solid var(--bg-surface)',
          }}>{unread}</span>
        )}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          width: 380,
          background: 'var(--bg-surface)',
          border: '1px solid var(--line-1)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 200,
          overflow: 'hidden',
          animation: 'fadeUp .15s ease both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line-1)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Notificações</div>
              {unread > 0 && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{unread} não lidas</div>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--text-link)', fontWeight: 500 }}>Marcar todas como lidas</button>
            )}
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {items.map((n, i) => (
              <div key={n.id} onClick={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{
                display: 'flex', gap: 12,
                padding: '12px 16px',
                borderBottom: i < items.length-1 ? '1px solid var(--line-1)' : 'none',
                background: n.read ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
                cursor: 'pointer',
                position: 'relative',
              }}>
                {!n.read && <span style={{ position: 'absolute', left: 6, top: 18, width: 6, height: 6, borderRadius: '50%', background: 'var(--iris)' }}/>}
                <div style={{
                  width: 30, height: 30,
                  borderRadius: '50%',
                  background: 'var(--' + n.tone + '-soft, var(--neutral-80))',
                  color: 'var(--' + n.tone + '-30, var(--text-2))',
                  display: 'grid', placeItems: 'center',
                  flexShrink: 0,
                }}>
                  <Icon name={ICONS[n.kind] || 'bell'} size={13}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: n.read ? 400 : 500, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>{n.sub} · {n.time}</div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                <Icon name="bell" size={24} style={{ opacity: 0.4 }}/>
                <div style={{ fontSize: 13, marginTop: 10 }}>Nenhuma notificação</div>
              </div>
            )}
          </div>
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ fontSize: 12, color: 'var(--text-link)', fontWeight: 500 }}>Ver todas</button>
            <button onClick={() => window.setRoute && window.setRoute('admin-settings')} style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="settings" size={11}/> Configurar</button>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  Toast, StatusPill, NayaxMark, NayaxWordmark, ClientSidebar, AdminSidebar, Topbar, PageHeader,
  SparkLine, BarChart, DonutChart, ProductVisual, QtyStepper, LangPicker, NotifBell,
});
