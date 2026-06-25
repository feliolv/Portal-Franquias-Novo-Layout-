/* ════════════════════════════════════════════════════════
   Utilitários: Confirm modal, EmptyState, Skeleton
   ════════════════════════════════════════════════════════ */

/* Global confirm: window.confirmAction({title, body, danger?}).then(ok=>...) */
const ConfirmHost = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    window.confirmAction = (opts) => new Promise(resolve => {
      setState({ ...opts, resolve });
    });
  }, []);
  if (!state) return null;
  const close = (ok) => { state.resolve(ok); setState(null); };
  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && close(false)}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: state.danger ? 'var(--red-soft)' : 'var(--accent-soft)',
              color: state.danger ? 'var(--red-30)' : 'var(--yellow-00)',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name={state.danger ? 'alert' : 'help'} size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{state.title || 'Confirmar?'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.5 }}>{state.body}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px 20px' }}>
          <button className="btn btn-ghost" onClick={() => close(false)}>{state.cancelLabel || 'Cancelar'}</button>
          <button className={'btn ' + (state.danger ? 'btn-danger' : 'btn-primary')} onClick={() => close(true)}>
            {state.danger && <Icon name="trash" size={13}/>}
            {state.confirmLabel || (state.danger ? 'Excluir' : 'Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
};

/* Empty state component */
const EmptyState = ({ icon = 'box', title, body, action }) => (
  <div className="card" style={{ padding: '60px 30px', textAlign: 'center' }}>
    <div style={{
      width: 72, height: 72,
      borderRadius: '50%',
      background: 'var(--bg-surface-2)',
      display: 'grid', placeItems: 'center',
      margin: '0 auto 18px',
      color: 'var(--text-3)',
      position: 'relative',
    }}>
      <Icon name={icon} size={28} stroke={1.5}/>
      <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', color: 'var(--dark)' }}>
        <Icon name="sparkles" size={9} stroke={2.5}/>
      </span>
    </div>
    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.005em' }}>{title}</div>
    <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 6, maxWidth: 380, margin: '6px auto 0', lineHeight: 1.5 }}>{body}</div>
    {action && <div style={{ marginTop: 20 }}>{action}</div>}
  </div>
);

/* Skeleton loader */
const Skeleton = ({ w = '100%', h = 14, r = 4, style = {} }) => (
  <span style={{
    display: 'inline-block',
    width: w, height: h,
    borderRadius: r,
    background: 'linear-gradient(90deg, var(--neutral-80) 25%, var(--mid) 50%, var(--neutral-80) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skel 1.4s ease infinite',
    ...style,
  }}/>
);

/* Skeleton card list */
const SkeletonRows = ({ count = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
        <Skeleton w={48} h={48} r={8}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton w="40%" h={12}/>
          <Skeleton w="70%" h={10}/>
        </div>
        <Skeleton w={80} h={28} r={6}/>
      </div>
    ))}
  </div>
);

/* Inject skeleton animation */
if (!document.getElementById('__skeleton-keyframes')) {
  const style = document.createElement('style');
  style.id = '__skeleton-keyframes';
  style.textContent = '@keyframes skel { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }';
  document.head.appendChild(style);
}

window.ConfirmHost = ConfirmHost;
window.EmptyState = EmptyState;
window.Skeleton = Skeleton;
window.SkeletonRows = SkeletonRows;
