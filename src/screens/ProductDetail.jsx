/* ════════════════════════════════════════════════════════
   Product Detail — simplificado: produto, valor, sobre
   ════════════════════════════════════════════════════════ */

const ProductDetail = ({ product, cart, setRoute, addToCart, openProduct, openCart }) => {
  const [qty, setQty] = useState(1);
  if (!product) {
    React.useEffect(() => { setRoute('catalog'); }, []);
    return null;
  }

  const inCart = cart.find(c => c.product.id === product.id)?.qty || 0;
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <div className="app-layout">
      <ClientSidebar route="catalog" setRoute={setRoute} cart={cart}/>
      <div className="app-main">
        <Topbar
          breadcrumb={[
            { label: 'Catálogo', onClick: () => setRoute('catalog') },
            { label: product.name }
          ]}
          onCartClick={openCart} cartCount={cartCount}
        />

        <div className="app-content">
          <button className="btn btn-link btn-sm" onClick={() => setRoute('catalog')} style={{ marginBottom: 18, color: 'var(--text-2)' }}>
            <Icon name="arrow-left" size={14}/> Voltar ao catálogo
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, marginBottom: 36 }}>
            {/* Visual */}
            <div className="card" style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
              <ProductVisual product={product} size="big"/>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="t-overline" style={{ color: 'var(--text-3)' }}>{product.cat}</span>
                  <span style={{ color: 'var(--text-3)' }}>·</span>
                  <span className="t-mono" style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{product.sku}</span>
                  {product.badge && <span className="badge badge-yellow" style={{ marginLeft: 'auto' }}>{product.badge}</span>}
                </div>
                <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{product.name}</div>
                <div style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.55 }}>{product.short}</div>
              </div>

              {/* Pricing block */}
              <div className="card" style={{ padding: 22, background: 'var(--bg-surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  {product.oldPrice && (
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through' }}>{fmtBRL(product.oldPrice)}</div>
                      <div className="badge badge-green" style={{ marginTop: 4 }}>−{Math.round((1 - product.price/product.oldPrice)*100)}%</div>
                    </div>
                  )}
                  <div>
                    {product.service && product.monthlyPrimary ? (
                      <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>
                        {fmtBRL(product.monthlyPrimary)}<span style={{ fontSize: 14, color: 'var(--text-3)', fontFamily: 'var(--font-sans)', fontWeight: 500, marginLeft: 6 }}>/mês</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>
                        {fmtBRL(product.price)}
                      </div>
                    )}
                    {product.monthly > 0 && !product.service && (
                      <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>+ {fmtBRL(product.monthly)}/mês de plataforma</div>
                    )}
                  </div>
                </div>

                {/* Qty + CTA */}
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10, marginTop: 20 }}>
                  <QtyStepper qty={qty} onChange={setQty}/>
                  <button className="btn btn-primary btn-lg" onClick={() => addToCart(product, qty)}>
                    <Icon name="cart" size={15}/> Adicionar {qty > 1 ? `${qty} unidades` : ''} ao pedido
                  </button>
                </div>
                {inCart > 0 && (
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 12, textAlign: 'center' }}>
                    <Icon name="check" size={11} style={{ color: 'var(--green-30)' }}/> Já tem <strong>{inCart}</strong> deste produto no pedido
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sobre o produto — bloco único */}
          <div className="card card-pad-lg">
            <div className="t-overline" style={{ marginBottom: 14 }}>Sobre o produto</div>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 760 }}>
              Solução completa de pagamento cashless e telemetria para máquinas automáticas. Compatível com cartão de crédito/débito, NFC, QR Code (PIX) e carteiras digitais. Integra-se ao protocolo MDB para vending e suporta extensões executivas e MIFARE para self-service.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, marginTop: 12, maxWidth: 760 }}>
              Tela colorida de 4.3", indicador LED de status, atualização OTA, e dashboard de gestão remota incluso. Aprovado pelos principais adquirentes do Brasil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

window.ProductDetail = ProductDetail;
