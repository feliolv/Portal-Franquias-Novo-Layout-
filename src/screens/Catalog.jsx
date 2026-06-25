/* ════════════════════════════════════════════════════════
   Catálogo — grid de produtos com filtros e quick-add
   ════════════════════════════════════════════════════════ */

const Catalog = ({ cart, setRoute, addToCart, openProduct, openCart }) => {
  const { t } = useLang();
  const [cat, setCat] = useState('Todos');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // grid | list

  const matchCat = (p) => {
    if (cat === 'Todos') return true;
    if (cat === 'Serviços') return p.cat === 'Serviços';
    if (cat === 'Produtos') return p.cat !== 'Serviços';
    return p.cat === cat;
  };
  const filtered = PRODUCTS.filter(p =>
    matchCat(p) &&
    (search === '' || (p.name + ' ' + p.sku + ' ' + p.short).toLowerCase().includes(search.toLowerCase()))
  );

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const qtyOf = (id) => cart.find(c => c.product.id === id)?.qty || 0;

  return (
    <div className="app-layout">
      <ClientSidebar route="catalog" setRoute={setRoute} cart={cart}/>
      <div className="app-main">
        <Topbar
          breadcrumb={[{ label: 'Catálogo' }, { label: cat }]}
          actions={
            <>
              <div className="input-group" style={{ width: 280, height: 36 }}>
                <Icon name="search" size={14}/>
                <input placeholder={t('topbar.searchCatalog')} value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }}/>
              </div>
              <LangPicker/>
            </>
          }
          onCartClick={openCart}
          cartCount={cartCount}
        />

        <div className="app-content">
          {/* ─── Hero strip ─── */}
          <div style={{
            background: 'var(--bg-inverse)',
            color: 'var(--text-on-inverse)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 32px',
            marginBottom: 24,
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 32,
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
              <defs>
                <pattern id="heroGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,205,0,0.06)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroGrid)"/>
            </svg>
            <div style={{ position: 'relative' }}>
              <div className="t-overline" style={{ color: 'var(--accent)', marginBottom: 8 }}>{t('cat.heroKicker')}</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
                {t('cat.heroTitle1')} <span style={{ color: 'var(--accent)' }}>{t('cat.heroTitle2')}</span> {t('cat.heroTitle3')}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-on-inverse-2)', marginTop: 8, lineHeight: 1.55, maxWidth: 460 }}>
                {t('cat.heroSub1')} <strong style={{ color: 'var(--text-on-inverse)' }}>Vending Machine</strong>{t('cat.heroSub2')}
              </div>
            </div>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {[
                { v: PRODUCTS.length, l: t('cat.kpiProducts') },
              ].map((k, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  color: 'var(--text-on-inverse)',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{k.v}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginTop: 2, fontWeight: 600 }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Filter chips + view toggle ─── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => {
                const count = c === 'Todos' ? PRODUCTS.length
                  : c === 'Serviços' ? PRODUCTS.filter(p => p.cat === 'Serviços').length
                  : c === 'Produtos' ? PRODUCTS.filter(p => p.cat !== 'Serviços').length
                  : PRODUCTS.filter(p => p.cat === c).length;
                const labelKey = c === 'Todos' ? 'common.all' : c === 'Produtos' ? 'cat.kpiProducts' : c === 'Serviços' ? 'cat.services' : null;
                const label = labelKey ? t(labelKey, c) : c;
                return (
                  <button key={c}
                    onClick={() => setCat(c)}
                    style={{
                      height: 32,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: 12.5, fontWeight: 600,
                      border: '1px solid ' + (cat === c ? 'var(--neutral-15)' : 'var(--line-2)'),
                      background: cat === c ? 'var(--neutral-15)' : 'var(--bg-surface)',
                      color: cat === c ? 'white' : 'var(--text-1)',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      transition: 'all .15s',
                    }}>
                    {label}
                    <span style={{
                      fontSize: 10,
                      padding: '1px 6px',
                      borderRadius: 8,
                      background: cat === c ? 'var(--accent)' : 'var(--neutral-80)',
                      color: cat === c ? 'var(--neutral-15)' : 'var(--text-2)',
                      fontFamily: 'var(--font-mono)',
                    }}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
              {['grid', 'list'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  width: 30, height: 26, borderRadius: 4,
                  background: view === v ? 'var(--neutral-15)' : 'transparent',
                  color: view === v ? 'white' : 'var(--text-3)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <Icon name={v === 'grid' ? 'grid' : 'menu'} size={13}/>
                </button>
              ))}
            </div>
          </div>

          {/* ─── Section label ─── */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t('cat.sortBy')} <strong style={{ color: 'var(--text-1)', cursor: 'pointer' }}>{t('cat.sortRecommended')} ↓</strong></div>
            <div className="t-overline">{filtered.length} {t('cat.kpiProducts').toLowerCase()} · {cat === 'Todos' ? t('common.all') : cat === 'Produtos' ? t('cat.kpiProducts') : cat === 'Serviços' ? t('cat.services', 'Serviços') : cat}</div>
          </div>

          {/* ─── Grid ─── */}
          {filtered.length === 0 ? (
            <div className="card card-pad-lg" style={{ textAlign: 'center', padding: 56 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--neutral-80)', display: 'grid', placeItems: 'center', margin: '0 auto 14px', color: 'var(--text-3)' }}>
                <Icon name="search" size={22}/>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Nada encontrado</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Ajuste os filtros ou tente outra busca.</div>
            </div>
          ) : view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} qty={qtyOf(p.id)} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} delay={i*40}/>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((p, i) => (
                <ProductRow key={p.id} product={p} qty={qtyOf(p.id)} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} delay={i*30}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────────── Product card (grid view) ───────────── */
const ProductCard = ({ product, qty, onOpen, onAdd, delay }) => {
  return (
    <div className="card fade-up prod-card" style={{ animationDelay: delay + 'ms', display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer' }}
         onClick={onOpen}>
      <ProductVisual product={product}/>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="t-overline" style={{ color: 'var(--text-3)' }}>{product.cat}</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{product.sku}</div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{product.name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.45, flex: 1 }}>{product.short}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--line-1)' }}>
          <div>
            {product.service && product.monthlyPrimary ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', fontFamily: 'var(--font-mono)' }}>{fmtBRL(product.monthlyPrimary)}<span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-sans)', marginLeft: 4 }}>/mês</span></div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>sem entrada</div>
              </>
            ) : (
              <>
                {product.oldPrice && <div style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'line-through' }}>{fmtBRL(product.oldPrice)}</div>}
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', fontFamily: 'var(--font-mono)' }}>{fmtBRL(product.price)}</div>
                {product.monthly > 0 && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>+ {fmtBRL(product.monthly)}/mês</div>}
              </>
            )}
          </div>
          {qty > 0 ? (
            <div onClick={(e) => e.stopPropagation()} style={{ width: 110 }}>
              <QtyStepper qty={qty} onChange={(q) => { if (q > qty) onAdd(); else window.dispatchEvent(new CustomEvent('cart-dec', { detail: product.id })); }} compact/>
            </div>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="btn btn-dark btn-sm prod-add">
              <Icon name="plus" size={13}/> Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────────── Product row (list view) ───────────── */
const ProductRow = ({ product, qty, onOpen, onAdd, delay }) => {
  return (
    <div className="card fade-up" style={{ animationDelay: delay + 'ms', display: 'flex', alignItems: 'center', gap: 16, padding: 14, cursor: 'pointer' }}
         onClick={onOpen}>
      <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--line-1)' }}>
        <ProductVisual product={product}/>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', alignItems: 'center', gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="t-overline" style={{ color: 'var(--text-3)' }}>{product.cat}</div>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>· {product.sku}</span>
            {product.badge && <span className="badge badge-yellow" style={{ fontSize: 10 }}>{product.badge}</span>}
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{product.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 1 }}>{product.short}</div>
        </div>
        <div>
          {product.service && product.monthlyPrimary ? (
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(product.monthlyPrimary)}<span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-sans)', marginLeft: 3 }}>/mês</span></div>
          ) : (
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(product.price)}</div>
          )}
          {product.monthly > 0 && !product.service && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>+ {fmtBRL(product.monthly)}/mês</div>}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          {qty > 0 ? (
            <div style={{ width: 110 }}><QtyStepper qty={qty} onChange={(q) => { if (q > qty) onAdd(); else window.dispatchEvent(new CustomEvent('cart-dec', { detail: product.id })); }} compact/></div>
          ) : (
            <button onClick={onAdd} className="btn btn-dark btn-sm"><Icon name="plus" size={13}/> Adicionar</button>
          )}
        </div>
      </div>
    </div>
  );
};

window.Catalog = Catalog;
