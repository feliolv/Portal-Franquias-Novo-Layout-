/* ════════════════════════════════════════════════════════
   DealNayax — Pré-visualização do PDF (proposta A4, 5 páginas)
   ════════════════════════════════════════════════════════ */

const PdfPreview = ({ data, onClose }) => {
  const d = data || {};
  const num = d.num || 'NOVO0493';
  const psTotal = d.psTotal != null ? d.psTotal : 9800;
  const mrrTotal = d.mrrTotal != null ? d.mrrTotal : 445;
  const items = d.items && d.items.length ? d.items : [
    { name: 'VPOS Touch', desc: 'Terminal 4G + leitor NFC + chip', sku: 'VPOS-TCH-01', qty: 5, price: 1890, recurring: false },
    { name: 'Instalação Padrão', desc: 'Configuração in-loco · 1 visita', sku: 'INST-STD', qty: 1, price: 350, recurring: false },
    { name: 'Nayax Cloud Pro', desc: 'Dashboard + alertas + API', sku: 'NCL-PRO', qty: 5, price: 89, recurring: true },
  ];
  const client = d.client || { name: 'Supermercado Alvorada', doc: 'CNPJ 17.833.301/0016-85', contact: 'Ricardo Marinho', email: 'ricardo.marinho@supalvorada.com.br', phone: '+55 11 99240-7521', type: 'PESSOA JURÍDICA' };
  const entryPct = d.entryPct != null ? d.entryPct : 30;
  const installments = d.installments || 5;
  const loyalty = d.loyalty || '12 meses';
  const psList = items.filter(i => !i.recurring);
  const mrrList = items.filter(i => i.recurring);
  const entryVal = psTotal * entryPct / 100;
  const instVal = (psTotal - entryVal) / installments;

  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const go = (delta) => {
    const next = Math.max(1, Math.min(5, page + delta));
    setPage(next);
    const t = document.getElementById('pdfp-' + next);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const brl = (n) => 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const A4 = { width: 720, minHeight: 1018, background: '#fff', margin: '0 auto 24px', boxShadow: '0 4px 24px rgba(0,0,0,.14)', borderRadius: 2, position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-sans)' };
  const ftr = (n) => <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 48px', fontSize: 9.5, color: '#A1A1AA', letterSpacing: '0.5px' }}><span>{num} · Proposta Comercial · Nayax Brasil</span><span>Página {n} de 5</span></div>;
  const header = () => (
    <div style={{ background: '#fff', borderBottom: '1px solid #E4E4E7', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 24, height: 24, background: '#262626', borderRadius: 5, display: 'grid', placeItems: 'center', padding: 3 }}><img src="assets/logo-nayax-N.png" style={{ width: '100%', height: 'auto', display: 'block' }}/></div>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '1px' }}><span style={{ color: '#262626' }}>NAYAX</span> <span style={{ color: '#71717A' }}>BRASIL</span></div>
      </div>
      <div style={{ fontSize: 10.5, color: '#71717A', fontFamily: 'var(--font-mono)' }}>{num}</div>
    </div>
  );

  return (
    <div className="modal-wrap" onClick={e => e.target === e.currentTarget && onClose()} style={{ alignItems: 'stretch', padding: 0 }}>
      <div style={{ background: '#E5E5E7', borderRadius: 0, width: '100%', maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        {/* Toolbar */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--line-1)', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>Pré-visualização do PDF</span>
              <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{num}</span>
              <span className="badge badge-neutral">5 páginas · A4</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{client.name} · Karolay Correia · gerado agora</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => go(-1)}><Icon name="chevron-up" size={13}/></button>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', minWidth: 44, textAlign: 'center' }}>{page} / 5</span>
            <button className="btn btn-ghost btn-sm" onClick={() => go(1)}><Icon name="chevron-down" size={13}/></button>
            <div style={{ width: 1, height: 22, background: 'var(--line-2)', margin: '0 4px' }}/>
            <button className="btn btn-dark btn-sm" onClick={() => window.toast && window.toast('PDF baixado · ' + num + '.pdf')}><Icon name="download" size={13}/> Baixar PDF</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ width: 32, padding: 0 }}><Icon name="x" size={16}/></button>
          </div>
        </div>

        {/* Pages */}
        <div ref={containerRef} style={{ background: '#E5E5E7', padding: '28px 0', overflowY: 'auto', flex: 1 }}>

          {/* PAGE 1 — Cover */}
          <div id="pdfp-1" style={A4}>
            <div style={{ background: '#262626', height: 470, color: '#fff', padding: '44px 52px', position: 'relative', overflow: 'hidden' }}>
              <img src="assets/logo-nayax-N.png" aria-hidden style={{ position: 'absolute', top: -30, right: -90, width: 460, opacity: 0.06 }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, position: 'relative' }}>
                <div style={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}><img src="assets/logo-nayax-N.png" style={{ width: '100%', height: 'auto' }}/></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: '1px' }}><span style={{ color: '#FFCD00' }}>NAYAX</span> <span style={{ opacity: 0.7 }}>BRASIL</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 1 }}>Soluções de Pagamento Cashless</div>
                </div>
              </div>
              <div style={{ marginTop: 60, position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FFCD00', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 14 }}>Proposta Comercial</div>
                <div style={{ fontSize: 50, fontWeight: 800, lineHeight: 0.98, letterSpacing: '-0.5px', marginBottom: 22, textTransform: 'uppercase' }}>Solução completa<br/>de pagamentos<br/><span style={{ color: '#FFCD00' }}>para Vending</span></div>
                <div style={{ display: 'inline-block', background: 'rgba(255,205,0,.12)', border: '1px solid rgba(255,205,0,.35)', padding: '6px 12px', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#FFCD00', letterSpacing: '1px' }}>{num}</div>
              </div>
            </div>
            <div style={{ padding: '44px 52px', color: '#262626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#A1A1AA', letterSpacing: '2px', textTransform: 'uppercase' }}>Apresentada para</div>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#EFF6FF', color: '#1D4ED8' }}>{client.type}</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 6 }}>{client.name}</div>
              <div style={{ fontSize: 13, color: '#52525B', marginBottom: 22 }}>{client.doc}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, paddingTop: 22, borderTop: '1px solid #E4E4E7' }}>
                {[
                  { l: 'Contato principal', a: client.contact, b: client.email, c: client.phone },
                  { l: 'Consultor', a: 'Karolay Correia', b: 'karolay@nayax.com', c: 'Equipe VM + Grua' },
                  { l: 'Validade', a: '30 dias', b: 'até 21/06/2026', c: 'Emissão 22/05/2026' },
                ].map((x, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>{x.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>{x.a}</div>
                    <div style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{x.b}</div>
                    <div style={{ fontSize: 11, color: '#71717A' }}>{x.c}</div>
                  </div>
                ))}
              </div>
            </div>
            {ftr(1)}
          </div>

          {/* PAGE 2 — About */}
          <div id="pdfp-2" style={A4}>
            {header()}
            <div style={{ padding: '28px 52px', color: '#262626' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#A1A1AA', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Sobre a solução</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.05, marginBottom: 16 }}>Pagamento cashless completo<br/>para sua operação</div>
              <div style={{ fontSize: 13.5, color: '#27272A', lineHeight: 1.65, marginBottom: 28 }}>A Nayax oferece a plataforma de pagamentos cashless mais utilizada por operadores de Vending Machines, FECs, lavanderias e operações food no mundo. Esta proposta cobre <strong>{psList.find(i=>/VPOS|Touch/.test(i.name))?.qty || 5} terminais</strong> conectados à Nayax Cloud, com suporte estendido e instalação inclusa.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                {[
                  { n: 'VPOS Touch', d: 'Terminal 4G + leitor NFC + chip · display 4″ · débito, crédito, contactless e PIX', i: 'package', b: '5 un.' },
                  { n: 'Nayax Cloud Pro', d: 'Dashboard em tempo real · alertas · multi-usuário · API · relatórios', i: 'wifi', b: 'Recorrente' },
                  { n: 'Instalação Padrão', d: 'Configuração in-loco · setup do dashboard · ativação e teste', i: 'briefcase', b: '1 visita' },
                  { n: 'Suporte Técnico', d: 'Atendimento 24/7 · resposta humano em até 4h', i: 'help', b: 'Incluso' },
                ].map((p, i) => (
                  <div key={i} style={{ border: '1px solid #E4E4E7', borderRadius: 8, padding: 16, background: '#FAFAFB' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 7, background: '#FFFCEF', color: '#7A5800', display: 'grid', placeItems: 'center' }}><Icon name={p.i} size={18}/></div>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: '#fff', border: '1px solid #E4E4E7', color: '#27272A' }}>{p.b}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{p.n}</div>
                    <div style={{ fontSize: 11.5, color: '#52525B', lineHeight: 1.55 }}>{p.d}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 18, background: '#262626', color: '#fff', borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#FFCD00', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>Benefícios incluídos</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                  {[
                    ['Conectividade 4G', 'Chip dedicado · sem WiFi'],
                    ['Garantia 12 meses', 'Cobertura total de hardware'],
                    ['Atualizações ilimitadas', 'Sempre na versão mais nova'],
                    ['Onboarding completo', 'Treinamento até 4 operadores'],
                  ].map((b, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{b[0]}</div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>{b[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {ftr(2)}
          </div>

          {/* PAGE 3 — Line items */}
          <div id="pdfp-3" style={A4}>
            {header()}
            <div style={{ padding: '28px 52px', color: '#262626' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#A1A1AA', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Investimento detalhado</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 22 }}>Produtos & Investimento</div>

              <div style={{ display: 'inline-flex', padding: '4px 10px', background: '#FFFCEF', color: '#7A5800', borderRadius: 5, fontSize: 10.5, fontWeight: 700, marginBottom: 10 }}>P&S — Produtos & Serviços (one-time)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 22 }}>
                <thead><tr style={{ background: '#262626', color: '#fff' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, width: 50 }}>Qtd</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, width: 100 }}>Unit.</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, width: 110 }}>Total</th>
                </tr></thead>
                <tbody>
                  {psList.map((it, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E4E4E7' }}>
                      <td style={{ padding: '11px 12px' }}><div style={{ fontWeight: 600, fontSize: 13 }}>{it.name}</div><div style={{ fontSize: 11, color: '#71717A' }}>{it.desc}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#A1A1AA', marginTop: 2 }}>{it.sku}</div></td>
                      <td style={{ padding: '11px 12px', textAlign: 'center', fontWeight: 600 }}>{it.qty}</td>
                      <td style={{ padding: '11px 12px', textAlign: 'right' }}>{brl(it.price)}</td>
                      <td style={{ padding: '11px 12px', textAlign: 'right', fontWeight: 700 }}>{brl(it.price * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{ borderTop: '2px solid #262626' }}>
                  <td colSpan="3" style={{ padding: '12px', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>Subtotal P&S</td>
                  <td style={{ padding: '12px', fontSize: 14, fontWeight: 800, textAlign: 'right' }}>{brl(psTotal)}</td>
                </tr></tfoot>
              </table>

              <div style={{ display: 'inline-flex', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 5, fontSize: 10.5, fontWeight: 700, marginBottom: 10 }}>MRR — Mensalidade Recorrente</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 22 }}>
                <thead><tr style={{ background: '#262626', color: '#fff' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, width: 50 }}>Qtd</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, width: 100 }}>Unit./mês</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 10.5, fontWeight: 700, width: 110 }}>Total/mês</th>
                </tr></thead>
                <tbody>
                  {mrrList.map((it, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E4E4E7' }}>
                      <td style={{ padding: '11px 12px' }}><div style={{ fontWeight: 600, fontSize: 13 }}>{it.name}</div><div style={{ fontSize: 11, color: '#71717A' }}>{it.desc}</div></td>
                      <td style={{ padding: '11px 12px', textAlign: 'center', fontWeight: 600 }}>{it.qty}</td>
                      <td style={{ padding: '11px 12px', textAlign: 'right' }}>{brl(it.price)}</td>
                      <td style={{ padding: '11px 12px', textAlign: 'right', fontWeight: 700 }}>{brl(it.price * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr style={{ borderTop: '2px solid #262626' }}>
                  <td colSpan="3" style={{ padding: '12px', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>Subtotal MRR mensal</td>
                  <td style={{ padding: '12px', fontSize: 14, fontWeight: 800, textAlign: 'right' }}>{brl(mrrTotal)}/mês</td>
                </tr></tfoot>
              </table>

              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, border: '1px solid #E4E4E7', borderRadius: 10, padding: 18, background: '#FAFAFB' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>Endereço de entrega</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{client.contact} · {client.name}</div>
                  <div style={{ fontSize: 12, color: '#52525B', lineHeight: 1.55 }}>Av. Brigadeiro Faria Lima, 2092 · Sala 318<br/>Jardim Paulistano · São Paulo / SP<br/>CEP 01451-905</div>
                </div>
                <div style={{ borderLeft: '1px solid #E4E4E7', paddingLeft: 18 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>Frete</div>
                  <div style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 4, background: '#DCFCE7', color: '#15803D', fontSize: 10.5, fontWeight: 700, marginBottom: 8 }}>CIF · NAYAX PAGA</div>
                  <div style={{ fontSize: 11.5, color: '#52525B', lineHeight: 1.55 }}>O frete está incluso no valor dos equipamentos.</div>
                </div>
              </div>
            </div>
            {ftr(3)}
          </div>

          {/* PAGE 4 — Payment */}
          <div id="pdfp-4" style={A4}>
            {header()}
            <div style={{ padding: '28px 52px', color: '#262626' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#A1A1AA', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Pagamento</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 22 }}>Forma de Pagamento & Cronograma</div>

              <div style={{ border: '1px solid #E4E4E7', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ padding: '4px 10px', background: '#FFFCEF', color: '#7A5800', borderRadius: 5, fontSize: 10.5, fontWeight: 700 }}>P&S</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Produtos & Serviços · {brl(psTotal)}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                  <div><div style={{ fontSize: 10.5, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>Entrada · {entryPct}%</div><div style={{ fontSize: 22, fontWeight: 700 }}>{brl(entryVal)}</div><div style={{ fontSize: 12, color: '#52525B', marginTop: 4 }}>PIX · vencimento <strong>28/05/2026</strong></div></div>
                  <div><div style={{ fontSize: 10.5, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>Parcelas · {installments}×</div><div style={{ fontSize: 22, fontWeight: 700 }}>{installments} × {brl(instVal)}</div><div style={{ fontSize: 12, color: '#52525B', marginTop: 4 }}>Boleto · vencimento dia <strong>10</strong></div></div>
                </div>
                <div style={{ borderTop: '1px solid #E4E4E7', paddingTop: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>Cronograma das parcelas P&S</div>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <tbody>
                      {[['Entrada','28/05/2026','PIX',entryVal], ...Array.from({length: installments}).map((_,i)=>[`Parcela ${i+1}/${installments}`, ['10/07','10/08','10/09','10/10','10/11','10/12'][i]+'/2026', 'Boleto', instVal])].map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F2F2F4' }}>
                          <td style={{ padding: '8px 0', color: '#27272A' }}>{r[0]}</td>
                          <td style={{ padding: '8px 0', color: '#52525B', textAlign: 'center' }}>{r[1]}</td>
                          <td style={{ padding: '8px 0', color: '#52525B', textAlign: 'center' }}>{r[2]}</td>
                          <td style={{ padding: '8px 0', fontWeight: 700, textAlign: 'right' }}>{brl(r[3])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ border: '1px solid #DBEAFE', borderRadius: 10, padding: 20, background: '#F8FBFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 5, fontSize: 10.5, fontWeight: 700 }}>MRR</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Mensalidade Recorrente · {brl(mrrTotal)}/mês</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 16 }}>
                  {[['Forma de pagamento','Boleto'],['Início da cobrança','15/06/2026'],['Fidelidade',loyalty]].map((x,i)=>(
                    <div key={i}><div style={{ fontSize: 10.5, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>{x[0]}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{x[1]}</div></div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #DBEAFE', paddingTop: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1D4ED8', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>Próximas faturas MRR</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                    {['15/jun','15/jul','15/ago','15/set','15/out','15/nov'].map(dd => (
                      <div key={dd} style={{ background: '#fff', border: '1px solid #DBEAFE', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#71717A', textTransform: 'uppercase', marginBottom: 3 }}>{dd}</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700 }}>{brl(mrrTotal)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: '#52525B', marginTop: 12, lineHeight: 1.5 }}><strong>Total MRR (12 meses):</strong> {brl(mrrTotal * 12)} · reajuste anual IPCA + 2%</div>
                </div>
              </div>
            </div>
            {ftr(4)}
          </div>

          {/* PAGE 5 — Terms */}
          <div id="pdfp-5" style={A4}>
            {header()}
            <div style={{ padding: '28px 52px', color: '#262626' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#A1A1AA', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Termos de compra</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 20 }}>Termos & Aceite</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 104px', gap: 20, alignItems: 'center', padding: 16, border: '1px solid #E4E4E7', borderRadius: 10, background: '#FAFAFB', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#A1A1AA', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 6 }}>Contrato vinculado</div>
                  <div style={{ fontSize: 11.5, color: '#27272A', lineHeight: 1.55, marginBottom: 8 }}>Esta <strong>PROPOSTA COMERCIAL</strong> está vinculada ao <strong>CONTRATO DE LICENCIAMENTO DE USO DE SOFTWARE, PRESTAÇÃO DE SERVIÇOS E COMODATO DE EQUIPAMENTOS</strong> e seus Anexos, acessíveis pelo link e QR Code ao lado.</div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#1D4ED8', textDecoration: 'underline', fontFamily: 'var(--font-mono)' }}>vmtecnologia.io/contrato-licenciamento</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FakeQR/>
                  <div style={{ fontSize: 9, color: '#A1A1AA', textAlign: 'center' }}>escaneie para acessar</div>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: '#27272A', lineHeight: 1.65, marginBottom: 14 }}>O Cliente declara ter lido, compreendido e aceitado todos os termos do Contrato e anexos. Declara estar ciente de que <strong>as mensalidades são cobradas no dia 15 de cada mês</strong>, salvo disposição diversa nesta Proposta.</div>
              <div style={{ padding: '14px 16px', background: '#FFFCEF', border: '1px solid #FFE88A', borderRadius: 8, fontSize: 11.5, color: '#27272A', lineHeight: 1.6, marginBottom: 24 }}>Como representante legal da Contratante, <strong>ACEITO INTEGRALMENTE</strong> os termos desta <strong>PROPOSTA COMERCIAL</strong> e do <strong>CONTRATO</strong>, reconheço sua validade em formato eletrônico e concordo com a assinatura eletrônica utilizada pela Nayax Brasil.</div>
              <div style={{ paddingTop: 20, borderTop: '2px solid #262626' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginTop: 16 }}>
                  <div><div style={{ height: 50, borderBottom: '1.5px solid #262626', marginBottom: 6 }}/><div style={{ fontSize: 11, fontWeight: 700 }}>{client.name}</div><div style={{ fontSize: 10.5, color: '#71717A', marginTop: 2 }}>{client.contact} · {client.doc}</div></div>
                  <div><div style={{ height: 50, borderBottom: '1.5px solid #262626', marginBottom: 6 }}/><div style={{ fontSize: 11, fontWeight: 700 }}>Nayax Brasil Soluções de Pagamento Ltda</div><div style={{ fontSize: 10.5, color: '#71717A', marginTop: 2 }}>Felipe Oliveira · Diretor Comercial</div></div>
                </div>
              </div>
            </div>
            {ftr(5)}
          </div>

        </div>
      </div>
    </div>
  );
};

const FakeQR = () => {
  const size = 21;
  const cells = [];
  const isFinder = (x, y) => {
    for (const cx of [0, size - 7]) for (const cy of [0, size - 7]) {
      if (cx === size - 7 && cy === size - 7) continue;
      if (x >= cx && x < cx + 7 && y >= cy && y < cy + 7) {
        const dx = x - cx, dy = y - cy;
        return (dx === 0 || dx === 6 || dy === 0 || dy === 6) || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      }
    }
    return null;
  };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const f = isFinder(x, y);
    const filled = f !== null ? f : ((x * 7 + y * 13 + (x * y) % 5) % 3) < 1.4;
    if (filled) cells.push(<rect key={x+'-'+y} x={x} y={y} width="1" height="1" fill="#262626"/>);
  }
  return <svg viewBox={`0 0 ${size} ${size}`} width="88" height="88" style={{ background: '#fff', border: '1px solid #E4E4E7', borderRadius: 6, padding: 3 }}>{cells}</svg>;
};

window.PdfPreview = PdfPreview;
