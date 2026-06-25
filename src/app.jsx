/* ════════════════════════════════════════════════════════
   App root — router, cart state, theme/tweaks wiring
   ════════════════════════════════════════════════════════ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "personality": "sober",
  "density": "comfortable",
  "accent": "#FFCD00",
  "showCartDrawer": true
}/*EDITMODE-END*/;

const App = () => {
  // Restaura rota e usuário do sessionStorage ao recarregar
  const _savedRoute = sessionStorage.getItem('nayax_route');
  const _savedUser  = (() => { try { return JSON.parse(sessionStorage.getItem('portal_user')); } catch { return null; } })();
  const _initRoute  = (_savedUser && _savedRoute && _savedRoute !== 'login') ? _savedRoute : 'login';

  const [route, setRoute] = useState(_initRoute); // login | catalog | product | history | admin-*
  const [activeProduct, setActiveProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const t = useTweaks(TWEAK_DEFAULTS);
  const setTweak = t.set;

  useEffect(() => {
    const personality = t.personality || TWEAK_DEFAULTS.personality;
    const density = t.density || TWEAK_DEFAULTS.density;
    const accent = t.accent || TWEAK_DEFAULTS.accent;
    document.documentElement.setAttribute('data-personality', personality);
    document.documentElement.setAttribute('data-density', density);
    document.documentElement.style.setProperty('--accent', accent);
  }, [t.personality, t.density, t.accent]);

  // Expose nav globally for components
  // Wrapper que persiste a rota no sessionStorage
  const navigate = (r) => {
    sessionStorage.setItem('nayax_route', r);
    setRoute(r);
  };
  useEffect(() => {
    window.setRoute = navigate;
    window.openCart = () => setCartOpen(true);
    window.openCheckout = () => { setCartOpen(false); setCheckoutOpen(true); };
  }, []);

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(c => c.product.id === product.id);
      if (ex) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { product, qty }];
    });
    if (window.toast) window.toast(product.name + ' adicionado ao pedido');
  };
  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(c => c.product.id !== id));
    else setCart(prev => prev.map(c => c.product.id === id ? { ...c, qty } : c));
  };
  const clearCart = () => setCart([]);

  const openProduct = (p) => { setActiveProduct(p); setRoute('product'); };

  /* ── Route dispatch ── */
  let body;
  if (route === 'login') {
    body = <Login onSignin={(kind) => {
      const dest = kind === 'admin' ? 'admin-dashboard' : kind === 'partner' ? 'partner' : 'catalog';
      navigate(dest);
    }}/>;
  } else if (route === 'partner') {
    body = <Partner setRoute={setRoute}/>;
  } else if (route === 'catalog') {
    body = <Catalog cart={cart} setRoute={setRoute} addToCart={addToCart} openProduct={openProduct} openCart={() => setCartOpen(true)}/>;
  } else if (route === 'product') {
    body = <ProductDetail product={activeProduct} cart={cart} setRoute={setRoute} addToCart={addToCart} openProduct={openProduct} openCart={() => setCartOpen(true)}/>;
  } else if (route === 'history') {
    body = <OrderHistory cart={cart} setRoute={setRoute} openCart={() => setCartOpen(true)}/>;
  } else if (route === 'materials') {
    body = <Materials cart={cart} setRoute={setRoute} openCart={() => setCartOpen(true)}/>;
  } else if (route === 'support') {
    body = <Support cart={cart} setRoute={setRoute} openCart={() => setCartOpen(true)}/>;
  } else if (route === 'profile') {
    body = <Profile cart={cart} setRoute={setRoute} openCart={() => setCartOpen(true)}/>;
  } else if (route.startsWith('admin-')) {
    body = <AdminShell route={route} setRoute={setRoute}/>;
  } else {
    body = <Login onSignin={() => setRoute('catalog')}/>;
  }

  return (
    <>
      {body}
      <Toast/>

      {/* App-wide confirm host */}
      <ConfirmHost/>

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer cart={cart} updateQty={updateQty} clearCart={clearCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}/>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <CheckoutModal cart={cart} clearCart={clearCart} onClose={() => setCheckoutOpen(false)}/>
      )}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Personalidade">
          <TweakRadio
            options={[
              { value: 'sober',     label: 'Sóbria' },
              { value: 'energetic', label: 'Energética' },
            ]}
            value={t.personality}
            onChange={v => setTweak({ personality: v })}/>
        </TweakSection>
        <TweakSection title="Densidade">
          <TweakRadio
            options={[
              { value: 'comfortable', label: 'Confortável' },
              { value: 'compact',     label: 'Compacta' },
            ]}
            value={t.density}
            onChange={v => setTweak({ density: v })}/>
        </TweakSection>
        <TweakSection title="Cor de destaque">
          <TweakColor value={t.accent}
            options={['#FFCD00', '#6D5BF7', '#1EA472', '#F08A20']}
            onChange={v => setTweak({ accent: v })}/>
        </TweakSection>
        <TweakSection title="Atalhos">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('login')}>Login</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('catalog')}>Catálogo</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setActiveProduct(PRODUCTS[0]); setRoute('product'); }}>Produto</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('history')}>Histórico</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('admin-dashboard')}>Admin</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('admin-sales')}>Vendas</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('admin-clients')}>Franquias</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('admin-products')}>Produtos</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setRoute('admin-hubspot')} style={{ gridColumn: '1 / -1' }}>HubSpot</button>
          </div>
        </TweakSection>
        <TweakSection title="Demonstração">
          <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => { setCart([{ product: PRODUCTS[0], qty: 2 }, { product: PRODUCTS[3], qty: 1 }, { product: PRODUCTS[5], qty: 1 }]); window.toast && window.toast('Carrinho preenchido com 3 produtos'); }}>Preencher carrinho demo</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCart([])}>Esvaziar carrinho</button>
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
