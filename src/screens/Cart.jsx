/* ════════════════════════════════════════════════════════
   Cart drawer + Checkout modal (multi-step)
   ════════════════════════════════════════════════════════ */

const CartDrawer = ({
  const { t } = useLang(); cart, updateQty, clearCart, onClose, onCheckout }) => {
  const total = cart.reduce((a, c) => a + (c.product.price || 0) * c.qty, 0);
  const monthly = cart.reduce((a, c) => a + (c.product.monthly || 0) * c.qty, 0);
  const items = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <>
      <div className="scrim" onClick={onClose}/>
      <aside className="drawer">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="t-overline" style={{ color: 'var(--text-3)' }}>t('cart.title', 'Pedido em aberto')</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em', marginTop: 2 }}>{items > 0 ? `${items} ${items === 1 ? 'item' : 'itens'}` : 'Seu pedido está vazio'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {cart.length > 0 && (
              <button onClick={clearCart} className="btn btn-ghost btn-sm" title=t('cart.clear', 'Limpar carrinho') style={{ color: 'var(--red-30)' }}>
                <Icon name="trash" size={14}/> Limpar
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="x" size={16}/></button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 32 }}>
            <div style={{ textAlign: 'center', maxWidth: 280 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--neutral-80)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--text-3)' }}>
                <Icon name="cart" size={26}/>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>t('cart.empty', 'Nenhum produto adicionado')</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.5 }}>Volte ao catálogo e adicione terminais, kits ou serviços para enviar um pedido.</div>
              <button onClick={onClose} className="btn btn-dark" style={{ marginTop: 18 }}><Icon name="arrow-left" size={14}/> Voltar ao catálogo</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
              {cart.map(({ product, qty }) => (
                <div key={product.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--line-1)' }}>
                    <ProductVisual product={product}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{product.name}</div>
                        <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{product.sku}</div>
                      </div>
                      <button onClick={() => updateQty(product.id, 0)} style={{ color: 'var(--text-3)', padding: 4 }} title="Remover"><Icon name="trash" size={13}/></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <div style={{ width: 96 }}><QtyStepper qty={qty} onChange={(q) => updateQty(product.id, q)} compact/></div>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL((product.price || 0) * qty)}</div>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="btn btn-ghost btn-sm" style={{ marginTop: 16 }}>
                <Icon name="trash" size={12}/> Esvaziar pedido
              </button>
            </div>
            <div style={{ padding: '18px 24px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)' }}>
                <span>t('cart.subtotal', 'Subtotal')</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(total)}</span>
              </div>
              {monthly > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
                  <span>t('cart.monthly', 'Recorrência mensal')</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(monthly)}/mês</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
                <span>Frete</span><span>A combinar</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line-1)' }}>
                <span>Total estimado</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(total)}</span>
              </div>
              <button onClick={onCheckout} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 14 }}>
                Continuar para entrega <Icon name="arrow-right" size={15}/>
              </button>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 8 }}>
                Aprovação em até 2h úteis · Sem custo para enviar
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

/* ───────────── Checkout modal — multi-step ───────────── */
const CheckoutModal = ({ cart, clearCart, onClose }) => {
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState('boleto');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const total = cart.reduce((a, c) => a + (c.product.price || 0) * c.qty, 0);
  const monthly = cart.reduce((a, c) => a + (c.product.monthly || 0) * c.qty, 0);
  // Auto-classify: existing client (NX-7842 already in base) → Base, else Novo
  const isExisting = true;
  const dealType = isExisting ? 'BASE' : 'NOVO';
  const propNum = dealType + String(580 + Math.floor(Math.random() * 99)).padStart(4, '0');
  const [autoStep, setAutoStep] = useState(0); // 0..3 progress

  const AUTO_STEPS = [
    { label: 'Criando negócio no HubSpot', done: 'Negócio ' + propNum + ' criado · pipeline VM-Base' },
    { label: 'Classificando tipo de proposta', done: 'Classificado como ' + (dealType === 'BASE' ? 'Base (cliente ativo)' : 'Novo cliente') + ' automaticamente' },
    { label: 'Gerando proposta no DealNayax', done: 'PDF gerado · ' + fmtBRL(total) },
    { label: 'Enviando ao Clicksign', done: 'Documento enviado · 2 signatários' },
  ];

  const steps = ['Franqueado', 'Entrega', 'Pagamento', 'Revisar'];

  const sendToSign = () => {
    setSending(true);
    setAutoStep(0);
    let i = 0;
    const tick = () => {
      i++;
      setAutoStep(i);
      if (i < AUTO_STEPS.length) setTimeout(tick, 650);
      else setTimeout(() => { setSending(false); setSent(true); }, 600);
    };
    setTimeout(tick, 650);
  };

  if (sending) {
    return (
      <div className="modal-wrap">
        <div className="modal" style={{ maxWidth: 460 }}>
          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--dark)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}><Icon name="spark" size={18}/></div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Processando pedido</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Integração HubSpot + DealNayax</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {AUTO_STEPS.map((s, i) => {
                const done = autoStep > i, active = autoStep === i;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', opacity: done || active ? 1 : 0.4 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: done ? 'var(--green-soft)' : active ? 'var(--accent-soft)' : 'var(--neutral-80)', color: done ? 'var(--green-30)' : active ? 'var(--yellow-00)' : 'var(--text-3)', display: 'grid', placeItems: 'center' }}>
                      {done ? <Icon name="check" size={13} stroke={3}/> : active ? <span className="login-spinner"/> : <span style={{ fontSize: 11, fontWeight: 700 }}>{i+1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: done || active ? 'var(--text-1)' : 'var(--text-3)' }}>{s.label}</div>
                      {done && <div style={{ fontSize: 11.5, color: 'var(--green-30)' }}>{s.done}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && (clearCart(), onClose())}>
        <div className="modal" style={{ maxWidth: 480 }}>
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--green-soft)', color: 'var(--green-30)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Icon name="check" size={28} stroke={3}/>
            </div>
            <div style={{ fontSize: 19, fontWeight: 700 }}>Pedido criado e enviado para assinatura</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.55 }}>
              O negócio <span className="t-mono" style={{ background: 'var(--bg-surface-2)', padding: '1px 6px', borderRadius: 4 }}>{propNum}</span> foi criado automaticamente no <strong>HubSpot</strong> (classificado como <strong>{dealType === 'BASE' ? 'Base' : 'Novo'}</strong>) e a proposta enviada ao <strong>Clicksign</strong>. Você receberá o documento por e-mail para assinatura eletrônica.
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 22 }} onClick={() => { clearCart(); onClose(); }}>
              <Icon name="check" size={15} stroke={3}/> Concluir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 720 }}>
        {/* Stepper header */}
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div className="t-overline" style={{ color: 'var(--accent)' }}>Finalizar pedido</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{steps[step-1]}</div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {steps.map((s, i) => {
              const active = i+1 === step, done = i+1 < step;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: done || active ? 'var(--accent)' : 'rgba(255,255,255,0.10)',
                      color: done || active ? 'var(--neutral-15)' : 'rgba(255,255,255,0.5)',
                      display: 'grid', placeItems: 'center',
                      fontSize: 11, fontWeight: 700,
                    }}>{done ? <Icon name="check" size={12} stroke={3}/> : i+1}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--accent)' : 'rgba(255,255,255,0.5)' }}>{s}</span>
                  </div>
                  {i < steps.length-1 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)', margin: '0 4px' }}/>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          <div style={{ minHeight: 320 }}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>Dados do franqueado (autopreenchidos com base no último pedido)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><label className="field-label">CNPJ</label><input className="input" defaultValue="12.345.678/0001-90" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                  <div><label className="field-label">Razão social</label><input className="input" defaultValue="Vending Premier Ltda."/></div>
                  <div><label className="field-label">Nome</label><input className="input" defaultValue="Marina"/></div>
                  <div><label className="field-label">Sobrenome</label><input className="input" defaultValue="Reis"/></div>
                  <div><label className="field-label">E-mail</label><input className="input" defaultValue="marina@vendingpremier.com"/></div>
                  <div><label className="field-label">Telefone</label><input className="input" defaultValue="(11) 98765-4321"/></div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Endereço de entrega</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 10 }}>
                  <div><label className="field-label">CEP</label><input className="input" defaultValue="04534-001"/></div>
                  <div style={{ gridColumn: '2 / span 2' }}><label className="field-label">Logradouro</label><input className="input" defaultValue="Av. Brigadeiro Faria Lima"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 10 }}>
                  <div><label className="field-label">Número</label><input className="input" defaultValue="3477"/></div>
                  <div><label className="field-label">Bairro</label><input className="input" defaultValue="Itaim Bibi"/></div>
                  <div><label className="field-label">UF</label><input className="input" defaultValue="SP"/></div>
                </div>
                <div><label className="field-label">Complemento</label><input className="input" defaultValue="Conjunto 142"/></div>
              </div>
            )}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>t('cart.payment', 'Forma de pagamento')</div>
                {[
                  { id: 'boleto', label: 'Boleto bancário · 30 dias', desc: 'Aprovação em até 24h. Sem juros.', icon: 'receipt' },
                  { id: 'fatura', label: 'Fatura mensal · 60 dias', desc: 'Apenas para franquias com crédito aprovado.', icon: 'briefcase' },
                  { id: 'pix',    label: 'PIX à vista (3% de desconto)', desc: 'Liberação imediata após confirmação.', icon: 'zap' },
                ].map(opt => (
                  <label key={opt.id} style={{
                    border: '1px solid ' + (pay === opt.id ? 'var(--neutral-15)' : 'var(--line-2)'),
                    background: pay === opt.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    padding: 14,
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                    boxShadow: pay === opt.id ? 'var(--shadow-focus)' : 'none',
                  }}>
                    <input type="radio" name="pay" value={opt.id} checked={pay === opt.id} onChange={() => setPay(opt.id)} style={{ accentColor: 'var(--accent)' }}/>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-80)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon name={opt.icon} size={15}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ padding: 16 }}>
                  <div className="t-overline">Entregar para</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Vending Premier Ltda.</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Av. Brigadeiro Faria Lima, 3477 · Conj. 142 · Itaim Bibi · São Paulo / SP · 04534-001</div>
                </div>
                <div className="card" style={{ padding: 16 }}>
                  <div className="t-overline">Pagamento</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{pay === 'boleto' ? 'Boleto bancário · 30 dias' : pay === 'fatura' ? 'Fatura mensal · 60 dias' : 'PIX à vista'}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  <Icon name="info" size={15} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 1 }}/>
                  Ao enviar, seu pedido entra na fila do time comercial Nayax. Você receberá um e-mail com o status em até 2h úteis.
                </div>
              </div>
            )}
          </div>

          {/* Summary rail */}
          <div style={{ background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', padding: 18, alignSelf: 'start' }}>
            <div className="t-overline" style={{ color: 'var(--text-3)', marginBottom: 10 }}>Resumo · {cart.reduce((a,c)=>a+c.qty,0)} itens</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', marginBottom: 14 }}>
              {cart.map(({ product, qty }) => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12.5 }}>
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qty}× {product.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmtBRL((product.price||0)*qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--line-1)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-2)' }}>
                <span>Subtotal</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(total)}</span>
              </div>
              {monthly > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-2)' }}>
                  <span>Mensal</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(monthly)}/mês</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, marginTop: 6 }}>
                <span>Total</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '18px 28px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>
            <Icon name="arrow-left" size={14}/> {step === 1 ? 'Cancelar' : 'Voltar'}
          </button>
          {step < 4 ? (
            <button className="btn btn-dark" onClick={() => setStep(step + 1)}>
              Próximo <Icon name="arrow-right" size={14}/>
            </button>
          ) : (
            <button className="btn btn-primary" disabled={sending} onClick={sendToSign}>
              {sending ? <><span className="login-spinner"/> Enviando ao DealNayax…</> : <><Icon name="spark" size={14}/> Enviar para assinatura</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

window.CartDrawer = CartDrawer;
window.CheckoutModal = CheckoutModal;
