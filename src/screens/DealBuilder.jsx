/* ════════════════════════════════════════════════════════
   DealNayax — Builder de Orçamento (CPQ)
   ════════════════════════════════════════════════════════ */

const DN_CATALOG = [
  { sku:'VPOS-TCH-01', category:'hardware', name:'VPOS Touch', desc:'Terminal 4G + leitor NFC + chip', price:1890, recurring:false, popular:true },
  { sku:'VPOS-SOL-01', category:'hardware', name:'VPOS Solo', desc:'Terminal compacto sem display', price:1290, recurring:false },
  { sku:'ONX-LITE-01', category:'hardware', name:'Onyx Lite', desc:'Reader contactless single-purpose', price:690, recurring:false },
  { sku:'MOMA-01', category:'hardware', name:'MOMA', desc:'Cashless reader para máquinas food', price:1490, recurring:false },
  { sku:'EZS-01', category:'hardware', name:'EZ-Smart', desc:'Reader para lavanderias', price:1390, recurring:false },
  { sku:'NCL-BASIC', category:'software', name:'Nayax Cloud Basic', desc:'Dashboard + relatórios mensais', price:39, recurring:true },
  { sku:'NCL-PRO', category:'software', name:'Nayax Cloud Pro', desc:'Dashboard + alertas + API', price:89, recurring:true, popular:true },
  { sku:'NCL-ENT', category:'software', name:'Nayax Cloud Enterprise', desc:'Pro + SLA 24/7 + BI custom', price:189, recurring:true },
  { sku:'MNY-X', category:'software', name:'MoneyX Wallet', desc:'Fidelidade + carteira digital', price:149, recurring:true },
  { sku:'INST-STD', category:'service', name:'Instalação Padrão', desc:'Local · até 5 terminais', price:350, recurring:false },
  { sku:'INST-PRM', category:'service', name:'Instalação Premium', desc:'Instalação + treinamento', price:850, recurring:false },
  { sku:'TRN-FLEET', category:'service', name:'Treinamento Frota', desc:'Onboarding até 50 terminais', price:1850, recurring:false },
  { sku:'SUP-247', category:'service', name:'Suporte 24/7', desc:'SLA 4h · resposta humano', price:290, recurring:true },
  { sku:'MDR-DBT', category:'fee', name:'Taxa Débito', desc:'1,99% por transação', price:0, displayPrice:'1,99%', recurring:true },
  { sku:'MDR-CRD', category:'fee', name:'Taxa Crédito', desc:'2,89% por transação', price:0, displayPrice:'2,89%', recurring:true },
  { sku:'MDR-PIX', category:'fee', name:'Taxa PIX', desc:'0,99% por transação', price:0, displayPrice:'0,99%', recurring:true },
];

const DN_BUNDLES = [
  { id:'starter', name:'Starter Operator', desc:'Operador até 10 máquinas', tag:'Mais escolhido', items:[{sku:'VPOS-TCH-01',qty:5},{sku:'NCL-BASIC',qty:5},{sku:'INST-STD',qty:1}] },
  { id:'pro', name:'Pro Fleet', desc:'Frota até 50 máquinas · Cloud Pro', items:[{sku:'VPOS-TCH-01',qty:25},{sku:'NCL-PRO',qty:25},{sku:'INST-PRM',qty:1},{sku:'TRN-FLEET',qty:1},{sku:'SUP-247',qty:1}] },
  { id:'enterprise', name:'Enterprise Multi-vertical', desc:'Cloud Enterprise · SLA 24/7', items:[{sku:'VPOS-TCH-01',qty:80},{sku:'NCL-ENT',qty:80},{sku:'INST-PRM',qty:3},{sku:'TRN-FLEET',qty:2},{sku:'SUP-247',qty:1}] },
];

const DN_TYPES = [
  { code:'NOVO', name:'Novo Cliente', num:'NOVO0493', icon:'users', desc:'Primeira venda' },
  { code:'BASE', name:'Base', num:'BASE0582', icon:'user', desc:'Cliente ativo · novo deal' },
  { code:'DEM', name:'Demo', num:'DEM0714', icon:'spark', desc:'Período demonstrativo' },
  { code:'MIGR', name:'Migração', num:'MIGR0013', icon:'package', desc:'Vindo de concorrente' },
  { code:'FORM', name:'Formulário', num:'FORM0097', icon:'receipt', desc:'Site / lead form' },
  { code:'UPGRADE', name:'Upgrade', num:'UPGRADE0666', icon:'trending-up', desc:'Expansão de contrato' },
  { code:'RETCOM', name:'Retomada', num:'RETCOM0059', icon:'refresh', desc:'Cliente que saiu' },
];

const CAT_META = {
  hardware: { tone: 'blue', label: 'Hardware' },
  software: { tone: 'purple', label: 'Software' },
  service:  { tone: 'neutral', label: 'Serviço' },
  fee:      { tone: 'orange', label: 'Taxa' },
};

const fmtBRL2 = (n) => 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DealBuilder = ({ onClose }) => {
  const [type, setType] = useState('NOVO');
  const [clientType, setClientType] = useState('pj');
  const [items, setItems] = useState([
    { sku: 'VPOS-TCH-01', qty: 5, discount: 0 },
    { sku: 'NCL-PRO', qty: 5, discount: 0 },
    { sku: 'INST-STD', qty: 1, discount: 0 },
  ]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [bundleApplied, setBundleApplied] = useState(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [entryPct, setEntryPct] = useState(30);
  const [installments, setInstallments] = useState(5);
  const [loyalty, setLoyalty] = useState('12 meses');
  const [pdfOpen, setPdfOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const [savedAgo, setSavedAgo] = useState(2);
  useEffect(() => { const t = setInterval(() => setSavedAgo(s => s + 3), 3000); return () => clearInterval(t); }, []);
  const [frete, setFrete] = useState('cif');
  const [deliver, setDeliver] = useState(true);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [entryMethod, setEntryMethod] = useState('PIX');
  const [instMethod, setInstMethod] = useState('Boleto');

  const pdfData = () => ({ num: typeObj.num, psTotal, mrrTotal, items: enriched, entryPct, installments, loyalty,
    client: clientType === 'pj'
      ? { name: 'Supermercado Alvorada', doc: 'CNPJ 17.833.301/0016-85', contact: 'Ricardo Marinho', email: 'ricardo@supalvorada.com.br', phone: '(11) 99240-7521', type: 'PESSOA JURÍDICA' }
      : { name: 'Ricardo Marinho Souza', doc: 'CPF 123.456.789-00', contact: 'Ricardo Marinho', email: 'ricardo.marinho@gmail.com', phone: '(11) 99240-7521', type: 'PESSOA FÍSICA' } });

  const typeObj = DN_TYPES.find(t => t.code === type);

  const enriched = items.map(i => {
    const c = DN_CATALOG.find(c => c.sku === i.sku) || {};
    return { ...c, qty: i.qty, discount: i.discount };
  });

  const psItems = enriched.filter(i => !i.recurring);
  const mrrItems = enriched.filter(i => i.recurring && i.category !== 'fee');

  const psSubtotal = psItems.reduce((a, i) => a + i.qty * (i.price || 0) * (1 - (i.discount || 0) / 100), 0);
  const psTotal = psSubtotal * (1 - globalDiscount / 100);
  const mrrTotal = mrrItems.reduce((a, i) => a + i.qty * (i.price || 0) * (1 - (i.discount || 0) / 100), 0);
  const listTotal = psItems.reduce((a, i) => a + i.qty * (i.price || 0), 0);
  const savings = listTotal - psTotal;
  const effectiveDiscount = listTotal > 0 ? (savings / listTotal * 100) : 0;
  const firstMonth = psTotal * entryPct / 100 + mrrTotal;

  const changeQty = (ix, d) => setItems(prev => prev.map((it, i) => i === ix ? { ...it, qty: Math.max(0, it.qty + d) } : it));
  const setQty = (ix, v) => setItems(prev => prev.map((it, i) => i === ix ? { ...it, qty: Math.max(0, parseInt(v) || 0) } : it));
  const setDisc = (ix, v) => setItems(prev => prev.map((it, i) => i === ix ? { ...it, discount: Math.max(0, Math.min(100, parseFloat(v) || 0)) } : it));
  const removeItem = (ix) => setItems(prev => prev.filter((_, i) => i !== ix));
  const addItem = (sku) => { if (!items.find(i => i.sku === sku)) setItems(prev => [...prev, { sku, qty: 1, discount: 0 }]); };
  const applyBundle = (b) => { setItems(b.items.map(i => ({ ...i, discount: 0 }))); setBundleApplied(b.id); window.toast && window.toast('Bundle ' + b.name + ' aplicado'); };

  // Approval level based on effective discount
  const approval = effectiveDiscount > 40 ? { label: 'Bloqueado', tone: 'red', desc: 'Desconto acima de 40% não é permitido' }
    : effectiveDiscount >= 25 ? { label: 'Comitê CEO + CFO', tone: 'red', desc: 'Faixa 25–40%' }
    : effectiveDiscount >= 12 ? { label: 'Diretor · Felipe Oliveira', tone: 'orange', desc: 'Faixa 12–25%' }
    : effectiveDiscount >= 5 ? { label: 'Coordenador · Daiane Soares', tone: 'blue', desc: 'Faixa 5–12%' }
    : { label: 'Automático (sistema)', tone: 'green', desc: 'Faixa 0–5%' };

  const STEPS = ['Tipo & Cliente', 'Produtos', 'Pricing', 'Pagamento', 'Revisão'];

  return (
    <div className="app-content" style={{ paddingTop: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 0 18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 13 }}>
            <span style={{ color: 'var(--text-2)', cursor: 'pointer' }} onClick={onClose}>Negócios</span>
            <Icon name="chevron-right" size={12} style={{ color: 'var(--neutral-60)' }}/>
            <span style={{ color: 'var(--text-2)', cursor: 'pointer' }} onClick={onClose}>Orçamentos</span>
            <Icon name="chevron-right" size={12} style={{ color: 'var(--neutral-60)' }}/>
            <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>Novo Orçamento</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>Novo Orçamento</h1>
            <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)', height: 24 }}>{typeObj.num}</span>
            <span className="badge badge-green"><span className="dot"/> Salvo há {savedAgo}s</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Negócio · <strong>Supermercado Alvorada</strong> · Karolay Correia</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => window.toast && window.toast('Histórico de versões aberto')}><Icon name="history" size={13}/> Histórico</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setPdfOpen(true)}><Icon name="eye" size={13}/> Pré-visualizar</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setPdfOpen(true)}><Icon name="download" size={13}/> Baixar PDF</button>
          <button className="btn btn-primary btn-sm" onClick={() => setSignOpen(true)}><Icon name="mail" size={13}/> Enviar para Assinatura</button>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: i <= 1 ? 'var(--accent)' : 'var(--neutral-80)', color: i <= 1 ? 'var(--dark)' : 'var(--text-3)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{i === 0 ? <Icon name="check" size={11} stroke={3}/> : i + 1}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: i === 1 ? 'var(--text-1)' : 'var(--text-3)', whiteSpace: 'nowrap' }}>{s}</span>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: 'var(--line-1)' }}/>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'flex-start' }}>
        {/* LEFT — main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {/* Smart suggestion */}
          {showSuggestion && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--accent-soft)', border: '1px solid var(--taxi-y-3)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent)', color: 'var(--dark)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name="zap" size={17}/></div>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--yellow-00)', marginBottom: 2 }}>Sugestão inteligente</strong>
                Cliente <strong>Supermercado Alvorada</strong> vem do concorrente <strong>Cantaloupe</strong>. Aplicar bundle <strong>Migração</strong> com 8% off? Histórico mostra <strong>73% de conversão</strong> nessa estratégia.
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSuggestion(false)}>Ignorar</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setType('MIGR'); setGlobalDiscount(8); setShowSuggestion(false); window.toast && window.toast('Sugestão aplicada · Migração com 8% off'); }}><Icon name="check" size={13} stroke={3}/> Aplicar</button>
            </div>
          )}
          {/* Type */}
          <div className="card card-pad">
            <div className="t-overline" style={{ marginBottom: 12 }}><Icon name="tag" size={12}/> Tipo de proposta</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {DN_TYPES.map(t => (
                <button key={t.code} onClick={() => setType(t.code)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '11px 6px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid ' + (type === t.code ? 'var(--accent)' : 'var(--line-2)'),
                  background: type === t.code ? 'var(--accent-soft)' : 'var(--bg-surface)',
                  cursor: 'pointer', textAlign: 'center',
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: type === t.code ? 'var(--accent)' : 'var(--neutral-80)', color: type === t.code ? 'var(--dark)' : 'var(--text-2)', display: 'grid', placeItems: 'center' }}><Icon name={t.icon} size={15}/></div>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{t.num}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Client */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div className="t-overline"><Icon name="user" size={12}/> Dados do cliente</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Sincronizado com HubSpot</div>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                {[{id:'pf',l:'Pessoa Física'},{id:'pj',l:'Pessoa Jurídica'}].map(c => (
                  <button key={c.id} onClick={() => setClientType(c.id)} style={{ padding: '6px 12px', borderRadius: 5, fontSize: 12, fontWeight: 600, background: clientType === c.id ? 'var(--dark)' : 'transparent', color: clientType === c.id ? 'white' : 'var(--text-2)' }}>{c.l}</button>
                ))}
              </div>
            </div>
            {clientType === 'pj' ? (
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Dados da empresa</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Razão Social *</label><input className="input" defaultValue="Supermercado Alvorada Ltda"/></div>
                  <div><label className="field-label">Nome fantasia</label><input className="input" defaultValue="Sup. Alvorada"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><label className="field-label">CNPJ *</label><input className="input" defaultValue="17.833.301/0016-85" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                  <div><label className="field-label">Inscrição Estadual</label><input className="input" defaultValue="113.582.290.119" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                  <div><label className="field-label">Inscrição Municipal</label><input className="input" defaultValue="isento"/></div>
                </div>

                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '18px 0 10px' }}>Endereço da empresa</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Logradouro *</label><input className="input" defaultValue="Av. Brigadeiro Faria Lima, 2092 · Sala 318"/></div>
                  <div><label className="field-label">CEP</label><input className="input" defaultValue="01451-905" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><label className="field-label">Bairro</label><input className="input" defaultValue="Jardim Paulistano"/></div>
                  <div><label className="field-label">Cidade</label><input className="input" defaultValue="São Paulo"/></div>
                  <div><label className="field-label">UF</label><input className="input" defaultValue="SP"/></div>
                </div>

                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '18px 0 10px' }}>Contato principal (responsável pela assinatura)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Nome do contato *</label><input className="input" defaultValue="Ricardo Marinho"/></div>
                  <div><label className="field-label">Cargo</label><input className="input" defaultValue="Diretor de Operações"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><label className="field-label">CPF do responsável</label><input className="input" defaultValue="123.456.789-00" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                  <div><label className="field-label">E-mail *</label><input className="input" defaultValue="ricardo.marinho@supalvorada.com.br"/></div>
                  <div><label className="field-label">Telefone *</label><input className="input" defaultValue="(11) 99240-7521"/></div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Dados pessoais</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Nome completo *</label><input className="input" defaultValue="Ricardo Marinho Souza"/></div>
                  <div><label className="field-label">CPF *</label><input className="input" defaultValue="123.456.789-00" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '18px 0 10px' }}>Contato</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">E-mail *</label><input className="input" defaultValue="ricardo.marinho@gmail.com"/></div>
                  <div><label className="field-label">Telefone *</label><input className="input" defaultValue="(11) 99240-7521"/></div>
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '18px 0 10px' }}>Endereço</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Logradouro *</label><input className="input" defaultValue="Av. Brigadeiro Faria Lima, 2092 · Apto 803"/></div>
                  <div><label className="field-label">CEP</label><input className="input" defaultValue="01451-905" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div><label className="field-label">Bairro</label><input className="input" defaultValue="Jardim Paulistano"/></div>
                  <div><label className="field-label">Cidade</label><input className="input" defaultValue="São Paulo"/></div>
                  <div><label className="field-label">UF</label><input className="input" defaultValue="SP"/></div>
                </div>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="card">
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="t-overline"><Icon name="package" size={12}/> Produtos no orçamento</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Hardware · Software · Serviços · Taxas</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setCatalogOpen(true)}><Icon name="plus" size={12}/> Adicionar SKU</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { const el = document.getElementById('dn-bundles'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}><Icon name="gift" size={12}/> Aplicar Bundle</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="t" style={{ minWidth: 640 }}>
                <thead><tr><th>Produto / SKU</th><th style={{width:96}}>Qtd.</th><th>Unitário</th><th style={{width:70}}>Desc.</th><th>Categoria</th><th style={{textAlign:'right'}}>Total</th><th style={{width:40}}></th></tr></thead>
                <tbody>
                  {enriched.map((it, ix) => {
                    const total = it.qty * (it.price || 0) * (1 - (it.discount || 0) / 100);
                    const cm = CAT_META[it.category] || { tone: 'neutral', label: it.category };
                    return (
                      <tr key={ix}>
                        <td>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>{it.name}{it.recurring && <span className="badge badge-yellow" style={{ fontSize: 9 }}>Recorrente</span>}</div>
                          <div className="cell-mono">{it.sku} · {it.desc}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: 6, height: 30, overflow: 'hidden', width: 90 }}>
                            <button onClick={() => changeQty(ix, -1)} style={{ width: 26, height: '100%', color: 'var(--text-2)' }}>−</button>
                            <input value={it.qty} onChange={e => setQty(ix, e.target.value)} style={{ flex: 1, width: '100%', border: 'none', outline: 'none', textAlign: 'center', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600 }}/>
                            <button onClick={() => changeQty(ix, 1)} style={{ width: 26, height: '100%', color: 'var(--text-2)' }}>+</button>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{it.displayPrice || fmtBRL2(it.price)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2, border: '1px solid var(--line-2)', borderRadius: 6, height: 30, padding: '0 6px', width: 56 }}>
                            <input value={it.discount || 0} onChange={e => setDisc(ix, e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', textAlign: 'right', fontSize: 12, fontFamily: 'var(--font-mono)' }}/>
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>%</span>
                          </div>
                        </td>
                        <td><span className={'badge badge-' + cm.tone}>{cm.label}</span></td>
                        <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{it.category === 'fee' ? '—' : fmtBRL(total)}</td>
                        <td><button onClick={() => removeItem(ix)} style={{ width: 26, height: 26, color: 'var(--red-30)' }}><Icon name="trash" size={13}/></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bundles */}
          <div className="card card-pad" id="dn-bundles">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div className="t-overline"><Icon name="gift" size={12}/> Bundles sugeridos</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Pré-configurações otimizadas por perfil de cliente</div>
              </div>
              <button className="btn btn-link btn-sm" style={{ color: 'var(--text-link)', fontSize: 12 }}>Ver todos <Icon name="arrow-right" size={11}/></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {DN_BUNDLES.map(b => {
                const tot = b.items.reduce((s, i) => { const c = DN_CATALOG.find(c => c.sku === i.sku); return s + (c?.price || 0) * i.qty; }, 0);
                const applied = bundleApplied === b.id;
                return (
                  <div key={b.id} style={{ border: '1px solid ' + (applied ? 'var(--accent)' : 'var(--line-1)'), borderRadius: 'var(--radius-md)', padding: 16, background: applied ? 'var(--accent-soft)' : 'var(--bg-surface)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}</div>
                      {b.tag && <span className="badge badge-yellow" style={{ fontSize: 9 }}>{b.tag}</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.4 }}>{b.desc}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {b.items.map((it, i) => {
                        const c = DN_CATALOG.find(c => c.sku === it.sku);
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                            <span style={{ color: 'var(--text-2)' }}>{c?.name || it.sku}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>×{it.qty}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--line-1)', paddingTop: 12, marginTop: 'auto' }}>
                      <div><div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>A partir de</div><div style={{ fontSize: 19, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>{fmtBRLcurt(tot)}</div></div>
                      <button className={applied ? 'btn btn-dark btn-sm' : 'btn btn-secondary btn-sm'} onClick={() => applyBundle(b)}>{applied ? '✓ Aplicado' : 'Aplicar'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="t-overline"><Icon name="tag" size={12}/> Forma de pagamento</div>
              <span style={{ fontSize: 11.5, color: 'var(--text-link)' }}>P&S (one-time) + MRR (recorrente)</span>
            </div>
            {/* P&S */}
            <div style={{ padding: 16, background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="badge badge-yellow" style={{ fontSize: 10 }}>P&S</span> <strong style={{ fontSize: 13 }}>Produtos & Serviços</strong> <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>one-time</span></span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(psTotal)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Entrada */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Entrada</div>
                  <label className="field-label">Método</label>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                    {['PIX','Boleto','Cartão','Sem entrada'].map(m => (
                      <button key={m} onClick={() => setEntryMethod(m)} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid ' + (entryMethod === m ? 'var(--dark)' : 'var(--line-2)'), background: entryMethod === m ? 'var(--dark)' : 'var(--bg-surface)', color: entryMethod === m ? 'white' : 'var(--text-2)' }}>{m}</button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><label className="field-label">% do total</label><input className="input" type="number" value={entryPct} onChange={e => setEntryPct(+e.target.value || 0)} style={{ fontFamily: 'var(--font-mono)' }}/></div>
                    <div><label className="field-label">Data prevista</label><input className="input" type="date" defaultValue="2026-05-28"/></div>
                  </div>
                </div>
                {/* Parcelamento */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Parcelamento do restante</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div><label className="field-label">Nº parcelas</label>
                      <select className="select" value={installments} onChange={e => setInstallments(+e.target.value)}>
                        {[1,2,3,4,5,6,10,12].map(n => <option key={n} value={n}>{n === 1 ? 'À vista' : n + '×'}</option>)}
                      </select>
                    </div>
                    <div><label className="field-label">Dia vencimento</label><select className="select"><option>5</option><option>10</option><option>15</option><option>20</option><option>25</option></select></div>
                  </div>
                  <label className="field-label">Método</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['Boleto','PIX','Cartão rec.','Déb. autom.'].map(m => (
                      <button key={m} onClick={() => setInstMethod(m)} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10.5, fontWeight: 600, border: '1px solid ' + (instMethod === m ? 'var(--dark)' : 'var(--line-2)'), background: instMethod === m ? 'var(--dark)' : 'var(--bg-surface)', color: instMethod === m ? 'white' : 'var(--text-2)' }}>{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* MRR */}
            <div style={{ padding: 16, background: 'var(--blue-soft)', border: '1px solid var(--iris-2)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="badge badge-blue" style={{ fontSize: 10 }}>MRR</span> <strong style={{ fontSize: 13 }}>Mensalidade Recorrente</strong> <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>cobrança mensal contínua</span></span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue-30)' }}>{fmtBRL(mrrTotal)}/mês</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label className="field-label">Forma de pagamento</label>
                  <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}><Icon name="receipt" size={13}/> Boleto</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>MRR é cobrado exclusivamente via boleto bancário</div>
                </div>
                <div>
                  <label className="field-label">Data de início da cobrança</label>
                  <input className="input" type="date" defaultValue="2026-06-15"/>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Primeira fatura cai neste dia · próximas no mesmo dia do mês</div>
                </div>
                <div>
                  <label className="field-label">Dia de vencimento mensal</label>
                  <select className="select"><option>1</option><option>5</option><option>10</option><option>15</option><option>20</option><option>25</option><option>Último dia útil</option></select>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>A partir da 2ª fatura</div>
                </div>
              </div>
              <div style={{ marginBottom: 14, maxWidth: 280 }}>
                <label className="field-label">Período de fidelidade</label>
                <select className="select" value={loyalty} onChange={e => setLoyalty(e.target.value)}><option>Sem fidelidade</option><option>6 meses</option><option>12 meses</option><option>24 meses</option><option>36 meses</option></select>
              </div>
              <div style={{ display: 'flex', gap: 10, padding: '11px 14px', background: 'var(--bg-surface)', border: '1px solid var(--iris-2)', borderRadius: 'var(--radius-sm)', fontSize: 12.5 }}>
                <Icon name="info" size={15} style={{ color: 'var(--iris)', flexShrink: 0, marginTop: 1 }}/>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>Cronograma das próximas faturas</div>
                  <div style={{ color: 'var(--iris)', marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 12 }}>15/jun · 15/jul · 15/ago · 15/set · 15/out · 15/nov · 15/dez · …</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div className="t-overline"><Icon name="package" size={12}/> Entrega</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Configure o envio dos equipamentos ao cliente</div>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                {[{id:false,l:'Não entregar'},{id:true,l:'✓ Entregar'}].map(o => (
                  <button key={String(o.id)} onClick={() => setDeliver(o.id)} style={{ padding: '5px 11px', borderRadius: 5, fontSize: 11.5, fontWeight: 600, background: deliver === o.id ? 'var(--dark)' : 'transparent', color: deliver === o.id ? 'white' : 'var(--text-2)' }}>{o.l}</button>
                ))}
              </div>
            </div>

            {deliver && (
              <>
                <div style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--blue-soft)', border: '1px solid var(--iris-2)', borderRadius: 'var(--radius-sm)', marginBottom: 14, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  <Icon name="info" size={15} style={{ color: 'var(--iris)', flexShrink: 0, marginTop: 1 }}/>
                  O frete é calculado por região + peso dos equipamentos e adicionado ao subtotal de P&S na proposta.
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 12, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }}/> Usar mesmo endereço do cliente
                </label>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Endereço de entrega</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Destinatário *</label><input className="input" defaultValue="Ricardo Marinho · Sup. Alvorada"/></div>
                  <div><label className="field-label">Telefone de contato</label><input className="input" defaultValue="+55 11 99240-7521"/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Logradouro *</label><input className="input" defaultValue="Av. Brigadeiro Faria Lima, 2092 · Sala 318"/></div>
                  <div><label className="field-label">CEP *</label><input className="input" defaultValue="01451-905" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div><label className="field-label">Bairro</label><input className="input" defaultValue="Jardim Paulistano"/></div>
                  <div><label className="field-label">Cidade</label><input className="input" defaultValue="São Paulo"/></div>
                  <div><label className="field-label">UF</label><input className="input" defaultValue="SP"/></div>
                </div>
                <div style={{ marginBottom: 14 }}><label className="field-label">Complemento / referência</label><input className="input" placeholder="Próximo ao mercado X, portão azul…"/></div>

                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Frete</div>
                <div style={{ display: 'grid', gridTemplateColumns: frete === 'fob' ? '1fr 200px' : '1fr', gap: 12, alignItems: 'flex-end' }}>
                  <div>
                    <label className="field-label">Tipo de frete</label>
                    <div style={{ display: 'flex', padding: 3, background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
                      {[{id:'cif',l:'CIF · Nayax paga'},{id:'fob',l:'FOB · Cliente paga'}].map(f => (
                        <button key={f.id} onClick={() => setFrete(f.id)} style={{ flex: 1, padding: '8px 11px', borderRadius: 5, fontSize: 12, fontWeight: 600, background: frete === f.id ? 'var(--bg-surface)' : 'transparent', color: frete === f.id ? 'var(--text-1)' : 'var(--text-2)', boxShadow: frete === f.id ? 'var(--shadow-xs)' : 'none', border: '1px solid ' + (frete === f.id ? 'var(--line-1)' : 'transparent') }}>{f.l}</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 6 }}>{frete === 'cif' ? 'CIF — frete já incluso no valor do equipamento' : 'FOB — cliente paga o frete, adicionado à proposta'}</div>
                  </div>
                  {frete === 'fob' && (
                    <div><label className="field-label">Valor do frete (R$)</label><input className="input" defaultValue="180,00" style={{ fontFamily: 'var(--font-mono)' }}/></div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Terms */}
          <div className="card card-pad">
            <div className="t-overline" style={{ marginBottom: 12 }}><Icon name="receipt" size={12}/> Vigência e termos</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label className="field-label">Validade da proposta</label><select className="select"><option>15 dias</option><option>30 dias</option><option>45 dias</option><option>60 dias</option></select></div>
              <div><label className="field-label">Vigência do contrato</label><select className="select"><option>Prazo Indeterminado</option><option>12 meses</option><option>24 meses</option><option>36 meses</option></select></div>
            </div>
            <div><label className="field-label">Observações para o PDF</label><textarea className="textarea" rows={3} defaultValue="Instalação prevista para a primeira quinzena de junho. Treinamento incluso para até 4 operadores em uma única sessão."/></div>
          </div>
        </div>

        {/* RIGHT — summary sidebar */}
        <div style={{ position: 'sticky', top: 76, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card card-pad" style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className="t-overline" style={{ color: 'var(--text-on-inverse-2)' }}>Resumo</span>
              <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{typeObj.num}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-on-inverse-2)' }}><span>Hardware + Serviço</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-on-inverse)' }}>{fmtBRL(psTotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-on-inverse-2)' }}><span>Recorrente (mês 1)</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-on-inverse)' }}>{fmtBRL(mrrTotal)}</span></div>
              {savings > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--spring)' }}><span>Descontos</span><span style={{ fontFamily: 'var(--font-mono)' }}>−{fmtBRL(savings)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-on-inverse-2)' }}><span>Subtotal</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-on-inverse)' }}>{fmtBRL(psTotal + mrrTotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--line-on-inverse-2)', paddingTop: 10, marginTop: 4 }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(psTotal + mrrTotal)}</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--line-on-inverse-2)', marginTop: 12, paddingTop: 12 }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-on-inverse-2)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="refresh" size={11}/> Recorrente mensal</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: 2 }}>{fmtBRL(mrrTotal)}/mês</div>
            </div>
            <div style={{ borderTop: '1px solid var(--line-on-inverse-2)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-on-inverse-2)' }}>Investimento 1º mês</span>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{fmtBRL(firstMonth)}</span>
            </div>
          </div>

          {/* Approval path */}
          {/* Approval path — visual ladder */}
          <div className="card card-pad">
            <div className="t-overline" style={{ marginBottom: 10 }}>Caminho de aprovação</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--' + approval.tone + '-soft, var(--neutral-80))', marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--' + approval.tone + '-30, var(--text-2))', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name={effectiveDiscount > 40 ? 'x' : effectiveDiscount >= 5 ? 'shield' : 'check'} size={15} stroke={2.5}/>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--' + approval.tone + '-30, var(--text-1))' }}>{approval.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Desconto efetivo: {effectiveDiscount.toFixed(1)}% · {approval.desc}</div>
              </div>
            </div>
            {/* level ladder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { r: '0–5%', a: 'Automático', tone: 'green', active: effectiveDiscount < 5 },
                { r: '5–12%', a: 'Coordenador', tone: 'blue', active: effectiveDiscount >= 5 && effectiveDiscount < 12 },
                { r: '12–25%', a: 'Diretor', tone: 'orange', active: effectiveDiscount >= 12 && effectiveDiscount < 25 },
                { r: '25–40%', a: 'Comitê CEO+CFO', tone: 'red', active: effectiveDiscount >= 25 && effectiveDiscount <= 40 },
                { r: '> 40%', a: 'Bloqueado', tone: 'neutral', active: effectiveDiscount > 40 },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: l.active ? 'var(--bg-surface-2)' : 'transparent', opacity: l.active ? 1 : 0.5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--' + (l.tone === 'neutral' ? 'gray-1' : l.tone + '-50') + ', var(--gray-1))', flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', minWidth: 48 }}>{l.r}</span>
                  <span style={{ fontSize: 12, fontWeight: l.active ? 700 : 500, color: l.active ? 'var(--text-1)' : 'var(--text-2)' }}>{l.a}</span>
                  {l.active && <Icon name="arrow-left" size={12} style={{ marginLeft: 'auto', color: 'var(--text-3)' }}/>}
                </div>
              ))}
            </div>
          </div>

          {/* Rules applied */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="t-overline">Regras aplicadas</div>
              <span className="badge badge-green" style={{ fontSize: 9 }}>1 ativa</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, paddingBottom: 10, borderBottom: '1px solid var(--line-1)' }}>
              <Icon name="check" size={14} style={{ color: 'var(--green-30)', flexShrink: 0, marginTop: 1 }} stroke={3}/>
              <span><strong style={{ color: 'var(--text-1)' }}>PR-03</strong> · Bundle Cloud+HW → Instalação Padrão grátis (economia R$ 350)</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '10px 0 6px' }}>A 1 passo de ativar</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
              <Icon name="clock" size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
              <span><strong>PR-01</strong> · +14 VPOS Touch (≥20) libera 10% off em hardware</span>
            </div>
          </div>

          {/* Versions */}
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div className="t-overline">Versões</div>
              <button className="btn btn-link btn-sm" style={{ fontSize: 11.5, color: 'var(--text-link)' }}>Comparar</button>
            </div>
            {[
              { v: 'V3', label: 'em edição', meta: 'agora', cur: true },
              { v: 'V2', label: 'desconto 12% revertido', meta: 'há 1h · Karolay' },
              { v: 'V1', label: 'rascunho inicial', meta: 'ontem · Karolay' },
            ].map((r, i, arr) => (
              <div key={r.v} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-1)' : 'none' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: r.cur ? 'var(--accent)' : 'var(--neutral-80)', color: r.cur ? 'var(--dark)' : 'var(--text-2)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{r.v}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{r.meta}</div>
                </div>
                {r.cur && <span className="badge badge-yellow" style={{ fontSize: 9 }}>ATUAL</span>}
              </div>
            ))}
          </div>

          {/* History */}
          <div className="card card-pad">
            <div className="t-overline" style={{ marginBottom: 10 }}>Histórico</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { ic: 'edit', t: 'Em edição', m: 'você · agora', tone: 'accent' },
                { ic: 'tag', t: 'Bundle Cloud+HW aplicado', m: 'sistema · agora', tone: 'green' },
                { ic: 'plus', t: 'Orçamento criado', m: 'Karolay · ontem 14:32', tone: 'iris' },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--' + h.tone + '-soft, var(--neutral-80))', color: 'var(--' + (h.tone === 'accent' ? 'yellow-00' : h.tone + '-30') + ', var(--text-2))', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={h.ic} size={11}/></div>
                  <div><div style={{ fontSize: 12.5, fontWeight: 600 }}>{h.t}</div><div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{h.m}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PDF preview */}
      {pdfOpen && <PdfPreview data={pdfData()} onClose={() => setPdfOpen(false)}/>}

      {/* Clicksign send modal */}
      {signOpen && <ClicksignModal num={typeObj.num} total={psTotal + mrrTotal} effectiveDiscount={effectiveDiscount} approval={approval} onClose={() => setSignOpen(false)} onSent={() => { setSignOpen(false); onClose(); }}/>}

      {/* Catalog picker modal */}
      {catalogOpen && (
        <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setCatalogOpen(false)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Adicionar produto ao orçamento</div>
              <button onClick={() => setCatalogOpen(false)} style={{ width: 30, height: 30, color: 'var(--text-3)' }}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ padding: 12, maxHeight: 440, overflowY: 'auto' }}>
              {DN_CATALOG.filter(c => !items.find(i => i.sku === c.sku)).map(c => {
                const cm = CAT_META[c.category];
                return (
                  <div key={c.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                       onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface-2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                       onClick={() => { addItem(c.sku); setCatalogOpen(false); }}>
                    <span className={'badge badge-' + cm.tone} style={{ minWidth: 70, justifyContent: 'center' }}>{cm.label}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name} {c.popular && <span className="badge badge-yellow" style={{ fontSize: 9 }}>Popular</span>}</div>
                      <div className="cell-mono">{c.sku} · {c.desc}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{c.displayPrice || fmtBRL(c.price)}{c.recurring && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>/mês</span>}</div>
                    <Icon name="plus" size={15} style={{ color: 'var(--text-3)' }}/>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ────── Clicksign send modal ────── */
const ClicksignModal = ({ num, total, effectiveDiscount, approval, onClose, onSent }) => {
  const blocked = effectiveDiscount > 40;
  const needsApproval = effectiveDiscount >= 5 && !blocked;
  const [signers, setSigners] = useState([
    { name: 'Ricardo Marinho', email: 'ricardo@supalvorada.com.br', role: 'Cliente · Contratante', order: 1 },
    { name: 'Felipe Oliveira', email: 'felipeo@nayax.com', role: 'Nayax · Diretor Comercial', order: 2 },
  ]);
  const [sending, setSending] = useState(false);

  const fire = () => {
    setSending(true);
    setTimeout(() => {
      // confetti
      const burst = document.createElement('div');
      burst.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
      const colors = ['#FFCD00','#6D5BF7','#25EF89','#FF5C6C','#262626'];
      for (let i = 0; i < 90; i++) {
        const p = document.createElement('div');
        const sz = 6 + Math.random() * 8;
        p.style.cssText = `position:absolute;top:-20px;left:${Math.random()*100}%;width:${sz}px;height:${sz*0.5}px;background:${colors[i%colors.length]};border-radius:1px;opacity:${0.7+Math.random()*0.3};transform:rotate(${Math.random()*360}deg);animation:dnfall ${1.6+Math.random()*1.4}s ${Math.random()*0.3}s cubic-bezier(.3,.6,.6,1) forwards`;
        burst.appendChild(p);
      }
      if (!document.getElementById('dnfall-kf')) {
        const st = document.createElement('style'); st.id = 'dnfall-kf';
        st.textContent = '@keyframes dnfall{to{transform:translateY(105vh) rotate(720deg);opacity:0}}';
        document.head.appendChild(st);
      }
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 3200);
      window.toast && window.toast('Enviado ao Clicksign · deal avançado no HubSpot');
      onSent();
    }, 900);
  };

  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="t-overline" style={{ color: 'var(--accent)' }}>Enviar para assinatura · Clicksign</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>Orçamento {num}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Approval gate */}
          {blocked ? (
            <div style={{ display: 'flex', gap: 10, padding: 14, background: 'var(--red-soft)', border: '1px solid var(--coral-2)', borderRadius: 'var(--radius-sm)' }}>
              <Icon name="alert" size={16} style={{ color: 'var(--red-30)', flexShrink: 0 }}/>
              <div style={{ fontSize: 13, color: 'var(--red-30)' }}><strong>Bloqueado.</strong> Desconto efetivo de {effectiveDiscount.toFixed(1)}% excede o limite de 40%. Ajuste o orçamento antes de enviar.</div>
            </div>
          ) : needsApproval ? (
            <div style={{ display: 'flex', gap: 10, padding: 14, background: 'var(--orange-soft)', border: '1px solid #FED7AA', borderRadius: 'var(--radius-sm)' }}>
              <Icon name="shield" size={16} style={{ color: 'var(--orange-30)', flexShrink: 0 }}/>
              <div style={{ fontSize: 13, color: 'var(--text-1)' }}>Requer aprovação de <strong>{approval.label}</strong> antes do envio. Será submetido à alçada ao confirmar.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, padding: 14, background: 'var(--green-soft)', border: '1px solid var(--spring-2)', borderRadius: 'var(--radius-sm)' }}>
              <Icon name="check" size={16} stroke={3} style={{ color: 'var(--green-30)', flexShrink: 0 }}/>
              <div style={{ fontSize: 13, color: 'var(--text-1)' }}>Aprovação automática · libera direto para Clicksign.</div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Signatários (ordem de assinatura)</label>
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={12}/> Adicionar</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {signers.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--line-2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--dark)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.order}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{s.email} · {s.role}</div>
                  </div>
                  <Icon name="more" size={14} style={{ color: 'var(--text-3)' }}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
            <span style={{ color: 'var(--text-2)' }}>Documento · proposta {num}.pdf</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(total)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '14px 24px', borderTop: '1px solid var(--line-1)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={fire} disabled={blocked || sending}>
            {sending ? <><span className="login-spinner"/> Enviando…</> : <><Icon name="mail" size={14}/> {needsApproval ? 'Submeter & enviar' : 'Enviar para Clicksign'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

window.DealBuilder = DealBuilder;
window.ClicksignModal = ClicksignModal;
