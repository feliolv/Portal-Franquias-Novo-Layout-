/* ════════════════════════════════════════════════════════
   Cart drawer + Checkout modal (multi-step)
   ════════════════════════════════════════════════════════ */

const CartDrawer = ({ cart, updateQty, clearCart, onClose, onCheckout }) => {
  const { t } = useLang();
  const total = cart.reduce((a, c) => a + (c.product.price || 0) * c.qty, 0);
  const monthly = cart.reduce((a, c) => a + (c.product.monthly || 0) * c.qty, 0);
  const items = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <>
      <div className="scrim" onClick={onClose}/>
      <aside className="drawer">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="t-overline" style={{ color: 'var(--text-3)' }}>{t('cart.title', 'Pedido em aberto')}</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em', marginTop: 2 }}>{items > 0 ? `${items} ${items === 1 ? 'item' : 'itens'}` : 'Seu pedido está vazio'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {cart.length > 0 && (
              <button onClick={clearCart} className="btn btn-ghost btn-sm" title={t('cart.clear', 'Limpar carrinho')} style={{ color: 'var(--red-30)' }}>
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
              <div style={{ fontSize: 16, fontWeight: 600 }}>{t('cart.empty', 'Nenhum produto adicionado')}</div>
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
                <span>{t('cart.subtotal', 'Subtotal')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(total)}</span>
              </div>
              {monthly > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
                  <span>{t('cart.monthly', 'Recorrência mensal')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(monthly)}/mês</span>
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
  const { t } = useLang();
  const [step, setStep]     = useState(1);
  const [tipo, setTipo]     = useState('PJ'); // PJ | PF
  const [pay, setPay]       = useState('boleto');
  const [sending, setSending] = useState(false);
  const [done, setDone]     = useState(false);
  const [errors, setErrors] = useState({});

  // User pré-preenchido
  const user = API.Auth.getUser() || {};

  // Formulário controlado
  const [form, setForm] = useState({
    razao_social: user.name || '',
    cnpj: '',
    nome: user.nome || '',
    sobrenome: user.sobrenome || '',
    cpf: '',
    nascimento: '',
    email: user.email || '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const err = (k) => errors[k] ? { border: '1px solid var(--coral-2)' } : {};

  // ── Máscaras ──────────────────────────────────────────
  const maskCNPJ = (v) => v.replace(/\D/g,'').slice(0,14)
    .replace(/(\d{2})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1/$2')
    .replace(/(\d{4})(\d)/,'$1-$2');

  const maskCPF = (v) => v.replace(/\D/g,'').slice(0,11)
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1-$2');

  const maskPhone = (v) => v.replace(/\D/g,'').slice(0,11)
    .replace(/(\d{2})(\d)/,'($1) $2')
    .replace(/(\d{5})(\d)/,'$1-$2');

  const maskCEP = (v) => v.replace(/\D/g,'').slice(0,8)
    .replace(/(\d{5})(\d)/,'$1-$2');

  // ── ViaCEP ────────────────────────────────────────────
  const lookupCEP = async (raw) => {
    const digits = raw.replace(/\D/g,'');
    if (digits.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const d = await r.json();
      if (d.erro) { window.toast && window.toast('CEP não encontrado', 'error'); return; }
      setForm(f => ({
        ...f,
        rua:    d.logradouro || f.rua,
        bairro: d.bairro     || f.bairro,
        cidade: d.localidade || f.cidade,
        uf:     d.uf         || f.uf,
      }));
    } catch { window.toast && window.toast('Erro ao buscar CEP', 'error'); }
  };

  // ── Totais ────────────────────────────────────────────
  const total   = cart.reduce((a,c) => a + (c.product.price||0)*c.qty, 0);
  const monthly = cart.reduce((a,c) => a + (c.product.monthly||0)*c.qty, 0);
  const itemCount = cart.reduce((a,c) => a + c.qty, 0);

  // ── Validação por step ────────────────────────────────
  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (tipo === 'PJ') {
        if (!form.razao_social.trim()) e.razao_social = true;
        if (form.cnpj.replace(/\D/g,'').length !== 14) e.cnpj = true;
      } else {
        if (!form.nome.trim()) e.nome = true;
        if (form.cpf.replace(/\D/g,'').length !== 11) e.cpf = true;
      }
      if (!form.email.includes('@')) e.email = true;
      if (!form.telefone.trim()) e.telefone = true;
    }
    if (s === 2) {
      if (form.cep.replace(/\D/g,'').length !== 8) e.cep = true;
      if (!form.rua.trim()) e.rua = true;
      if (!form.numero.trim()) e.numero = true;
      if (!form.cidade.trim()) e.cidade = true;
      if (!form.uf.trim()) e.uf = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (!validate(step)) return;
    setStep(s => s + 1);
  };

  // ── Enviar pedido ─────────────────────────────────────
  const sendOrder = async () => {
    if (!validate(3)) return;
    setSending(true);
    try {
      const user = API.Auth.getUser() || {};
      const payload = {
        client_code:       user.code || user.id || 'NX-0000',
        client_name:       tipo === 'PJ' ? form.razao_social : (form.nome + ' ' + form.sobrenome).trim(),
        items:             cart.map(({ product, qty }) => ({ sku: product.sku, name: product.name, qty, price: product.price || 0 })),
        total,
        status:            'pendente',
        payment_method:    pay,
        buyer_razao_social: tipo === 'PJ' ? form.razao_social : '',
        buyer_cnpj:        tipo === 'PJ' ? form.cnpj : '',
        buyer_nome:        form.nome,
        buyer_sobrenome:   form.sobrenome,
        buyer_cpf:         tipo === 'PF' ? form.cpf : '',
        buyer_nascimento:  form.nascimento || null,
        buyer_email:       form.email,
        buyer_telefone:    form.telefone,
        buyer_cep:         form.cep,
        buyer_uf:          form.uf,
        buyer_rua:         form.rua,
        buyer_numero:      form.numero,
        buyer_complemento: form.complemento,
        buyer_bairro:      form.bairro,
        buyer_cidade:      form.cidade,
      };
      await API.Sales.create(
        { code: payload.client_code, razao: payload.client_name },
        cart,
        payload,
        pay
      );
      setDone(true);
      clearCart();
    } catch (e) {
      window.toast && window.toast('Erro ao enviar pedido: ' + e.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const steps = [
    t('checkout.step1', 'Franqueado'),
    t('checkout.step2', 'Entrega'),
    t('checkout.step3', 'Pagamento'),
    t('checkout.step4', 'Revisar'),
  ];

  // ── Tela de sucesso ───────────────────────────────────
  if (done) return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480, textAlign: 'center', padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-soft, #d1fae5)', color: 'var(--green-40, #059669)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <Icon name="check" size={28} stroke={3}/>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{t('checkout.successTitle', 'Pedido enviado!')}</div>
        <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 28 }}>
          {t('checkout.successSub', 'Seu pedido entrou na fila do time comercial Nayax. Você receberá uma confirmação por e-mail em até 2h úteis.')}
        </div>
        <button className="btn btn-primary" onClick={onClose}>{t('common.close', 'Fechar')}</button>
      </div>
    </div>
  );

  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 860, width: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', gap: 14 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: i+1 < step ? 'var(--dark)' : i+1 === step ? 'var(--accent)' : 'var(--bg-surface-2)',
                  color: i+1 < step ? 'var(--taxi-yellow)' : i+1 === step ? 'var(--dark)' : 'var(--text-3)',
                  display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
                }}>
                  {i+1 < step ? <Icon name="check" size={12} stroke={3}/> : i+1}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: i+1 === step ? 700 : 400, color: i+1 === step ? 'var(--text-1)' : 'var(--text-3)' }}>{s}</span>
              </div>
              {i < steps.length-1 && <div style={{ flex: 1, height: 1, background: 'var(--line-1)' }}/>}
            </React.Fragment>
          ))}
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ marginLeft: 8, width: 28, padding: 0 }}><Icon name="x" size={14}/></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
          <div>
            {/* Step 1: Franqueado */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Tipo PJ/PF */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {['PJ', 'PF'].map(tp => (
                    <button key={tp} onClick={() => setTipo(tp)} style={{
                      padding: '6px 18px', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                      background: tipo === tp ? 'var(--dark)' : 'var(--bg-surface)',
                      color: tipo === tp ? 'var(--taxi-yellow)' : 'var(--text-2)',
                      border: '1px solid ' + (tipo === tp ? 'var(--dark)' : 'var(--line-2)'),
                    }}>{tp === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {tipo === 'PJ' ? (<>
                    <div><label className="field-label">CNPJ *</label>
                      <input className="input" style={{ fontFamily: 'var(--font-mono)', ...err('cnpj') }}
                        value={form.cnpj} placeholder="00.000.000/0001-00"
                        onChange={e => set('cnpj', maskCNPJ(e.target.value))}/></div>
                    <div><label className="field-label">Razão Social *</label>
                      <input className="input" style={err('razao_social')} value={form.razao_social} placeholder="Ex: Empresa Ltda."
                        onChange={e => set('razao_social', e.target.value)}/></div>
                  </>) : (<>
                    <div><label className="field-label">CPF *</label>
                      <input className="input" style={{ fontFamily: 'var(--font-mono)', ...err('cpf') }}
                        value={form.cpf} placeholder="000.000.000-00"
                        onChange={e => set('cpf', maskCPF(e.target.value))}/></div>
                    <div><label className="field-label">Data de nascimento</label>
                      <input className="input" type="date" value={form.nascimento}
                        onChange={e => set('nascimento', e.target.value)}/></div>
                  </>)}
                  <div><label className="field-label">Nome *</label>
                    <input className="input" style={err('nome')} value={form.nome} placeholder="Nome"
                      onChange={e => set('nome', e.target.value)}/></div>
                  <div><label className="field-label">Sobrenome</label>
                    <input className="input" value={form.sobrenome} placeholder="Sobrenome"
                      onChange={e => set('sobrenome', e.target.value)}/></div>
                  <div><label className="field-label">E-mail *</label>
                    <input className="input" style={err('email')} value={form.email} type="email" placeholder="email@empresa.com"
                      onChange={e => set('email', e.target.value)}/></div>
                  <div><label className="field-label">Telefone *</label>
                    <input className="input" style={err('telefone')} value={form.telefone} placeholder="(11) 98765-4321"
                      onChange={e => set('telefone', maskPhone(e.target.value))}/></div>
                </div>
              </div>
            )}

            {/* Step 2: Entrega */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10 }}>
                  <div>
                    <label className="field-label">CEP *</label>
                    <input className="input" style={{ fontFamily: 'var(--font-mono)', ...err('cep') }}
                      value={form.cep} placeholder="00000-000"
                      onChange={e => { const v = maskCEP(e.target.value); set('cep', v); if (v.replace(/\D/g,'').length === 8) lookupCEP(v); }}/>
                  </div>
                  <div><label className="field-label">Logradouro *</label>
                    <input className="input" style={err('rua')} value={form.rua} placeholder="Rua, Avenida…"
                      onChange={e => set('rua', e.target.value)}/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 60px', gap: 10 }}>
                  <div><label className="field-label">Número *</label>
                    <input className="input" style={err('numero')} value={form.numero} placeholder="123"
                      onChange={e => set('numero', e.target.value)}/></div>
                  <div><label className="field-label">Bairro</label>
                    <input className="input" value={form.bairro} placeholder="Bairro"
                      onChange={e => set('bairro', e.target.value)}/></div>
                  <div><label className="field-label">UF *</label>
                    <input className="input" style={err('uf')} value={form.uf} placeholder="SP" maxLength={2}
                      onChange={e => set('uf', e.target.value.toUpperCase())}/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div><label className="field-label">Cidade *</label>
                    <input className="input" style={err('cidade')} value={form.cidade} placeholder="São Paulo"
                      onChange={e => set('cidade', e.target.value)}/></div>
                  <div><label className="field-label">Complemento</label>
                    <input className="input" value={form.complemento} placeholder="Apto, Sala…"
                      onChange={e => set('complemento', e.target.value)}/></div>
                </div>
              </div>
            )}

            {/* Step 3: Pagamento */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>{t('cart.payment', 'Forma de pagamento')}</div>
                {[
                  { id: 'boleto', label: 'Boleto bancário · 30 dias', desc: 'Aprovação em até 24h. Sem juros.', icon: 'receipt' },
                  { id: 'fatura', label: 'Fatura mensal · 60 dias',   desc: 'Apenas para franquias com crédito aprovado.', icon: 'briefcase' },
                  { id: 'pix',    label: 'PIX à vista (3% de desconto)', desc: 'Liberação imediata após confirmação.', icon: 'zap' },
                ].map(opt => (
                  <label key={opt.id} style={{
                    border: '1px solid ' + (pay === opt.id ? 'var(--dark)' : 'var(--line-2)'),
                    background: pay === opt.id ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)', padding: 14,
                    display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                    boxShadow: pay === opt.id ? 'var(--shadow-focus)' : 'none',
                  }}>
                    <input type="radio" name="pay" value={opt.id} checked={pay === opt.id}
                      onChange={() => setPay(opt.id)} style={{ accentColor: 'var(--accent)' }}/>
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

            {/* Step 4: Revisão */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="card" style={{ padding: 16 }}>
                  <div className="t-overline">{t('checkout.deliverTo', 'Entregar para')}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                    {tipo === 'PJ' ? form.razao_social : (form.nome + ' ' + form.sobrenome).trim()}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                    {form.rua}{form.numero ? ', ' + form.numero : ''}{form.complemento ? ' · ' + form.complemento : ''}{form.bairro ? ' · ' + form.bairro : ''} · {form.cidade} / {form.uf} · {form.cep}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{form.email} · {form.telefone}</div>
                </div>
                <div className="card" style={{ padding: 16 }}>
                  <div className="t-overline">{t('checkout.payment', 'Pagamento')}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                    {pay === 'boleto' ? 'Boleto bancário · 30 dias' : pay === 'fatura' ? 'Fatura mensal · 60 dias' : 'PIX à vista (3% de desconto)'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  <Icon name="info" size={15} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 1 }}/>
                  {t('checkout.disclaimer', 'Ao enviar, seu pedido entra na fila do time comercial Nayax. Você receberá um e-mail com o status em até 2h úteis.')}
                </div>
              </div>
            )}
          </div>

          {/* Resumo sticky */}
          <div style={{ background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', padding: 18, alignSelf: 'start', position: 'sticky', top: 0 }}>
            <div className="t-overline" style={{ color: 'var(--text-3)', marginBottom: 10 }}>Resumo · {itemCount} {itemCount === 1 ? 'item' : 'itens'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', marginBottom: 14 }}>
              {cart.map(({ product, qty }) => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12.5 }}>
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qty}× {product.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmtBRL((product.price||0)*qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--line-1)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {monthly > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-2)' }}>
                  <span>Mensal</span><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtBRL(monthly)}/mês</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, marginTop: 6 }}>
                <span>Total</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{fmtBRL(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '16px 28px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-surface)' }}>
          <button className="btn btn-ghost" onClick={() => step === 1 ? onClose() : setStep(s => s - 1)}>
            <Icon name="arrow-left" size={14}/> {step === 1 ? t('common.cancel', 'Cancelar') : t('common.back', 'Voltar')}
          </button>
          {step < 4 ? (
            <button className="btn btn-dark" onClick={nextStep}>
              {t('common.next', 'Próximo')} <Icon name="arrow-right" size={14}/>
            </button>
          ) : (
            <button className="btn btn-primary" disabled={sending} onClick={sendOrder}>
              {sending
                ? <><span className="login-spinner"/> {t('checkout.sending', 'Enviando pedido…')}</>
                : <><Icon name="check" size={14} stroke={3}/> {t('checkout.submit', 'Confirmar pedido')}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

window.CartDrawer = CartDrawer;
window.CheckoutModal = CheckoutModal;
