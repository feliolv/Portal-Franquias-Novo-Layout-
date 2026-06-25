/* ════════════════════════════════════════════════════════
   Admin: DealNayax — CPQ / Orçamentos (embutido no Portal)
   Baseado no handoff DealNayax v6
   ════════════════════════════════════════════════════════ */

const DN_DEALS = [
  { id:'D-2945', company:'Supermercado Alvorada', cnpj:'17.833.301/0016-85', type:'NOVO', number:'NOVO0492', consultor:'Daiane Soares', avatar:'DA', pipeline:'VM-Vendas', stage:'Proposta', value:2932, prob:60, days:2 },
  { id:'D-2946', company:'Rede FastVend', cnpj:'22.114.889/0001-43', type:'UPGRADE', number:'UPGRADE0664', consultor:'Guilherme Raksa', avatar:'GR', pipeline:'VM-Base', stage:'Negociação', value:34800, prob:75, days:5, flag:'approval' },
  { id:'D-2947', company:'Vend360 Ltda', cnpj:'14.222.001/0001-55', type:'NOVO', number:'NOVO0491', consultor:'Luiz Guilherme', avatar:'LG', pipeline:'VM-Vendas', stage:'Ganho', value:58200, prob:100, days:8 },
  { id:'D-2948', company:'Farmácia Central', cnpj:'45.998.221/0001-12', type:'BASE', number:'BASE0578', consultor:'Nicole Emiliano', avatar:'NE', pipeline:'VM-Vendas', stage:'Qualificação', value:12200, prob:30, days:5 },
  { id:'D-2949', company:'Posto Bandeirantes', cnpj:'08.221.992/0001-23', type:'BASE', number:'BASE0575', consultor:'Leticia Ribeiro', avatar:'LR', pipeline:'VM-Vendas', stage:'Proposta', value:21400, prob:50, days:1, flag:'approval' },
  { id:'D-2950', company:'GruaFlex Serviços', cnpj:'32.114.092/0001-78', type:'FORM', number:'FORM0094', consultor:'Vinícius Dias', avatar:'VD', pipeline:'VM-Base', stage:'Assinatura', value:44000, prob:90, days:1 },
  { id:'D-2951', company:'Lavalite Express', cnpj:'19.220.881/0001-44', type:'MIGR', number:'MIGR0012', consultor:'Aline Prado', avatar:'AP', pipeline:'VM-Vendas', stage:'Negociação', value:19600, prob:65, days:3 },
  { id:'D-2952', company:'Cinemark Family', cnpj:'05.114.221/0001-92', type:'NOVO', number:'NOVO0489', consultor:'Karolay Correia', avatar:'KA', pipeline:'VM-Vendas', stage:'Assinatura', value:88400, prob:95, days:2 },
  { id:'D-2953', company:'Café & Conveniência SP', cnpj:'11.992.401/0001-33', type:'NOVO', number:'NOVO0488', consultor:'Elison Fernandes', avatar:'EF', pipeline:'VM-Vendas', stage:'Qualificação', value:8800, prob:25, days:6 },
  { id:'D-2954', company:'Arcade Multiplay', cnpj:'28.331.001/0001-66', type:'NOVO', number:'NOVO0487', consultor:'Vinícius Dias', avatar:'VD', pipeline:'VM-Base', stage:'Ganho', value:34500, prob:100, days:12 },
  { id:'D-2955', company:'Vending Premier Ltda.', cnpj:'12.345.678/0001-90', type:'NOVO', number:'NOVO0512', consultor:'Marina Reis (auto)', avatar:'MR', pipeline:'Portal de Vendas', stage:'Assinatura', value:5070, prob:90, days:0, origin:'portal', flag:'approval' },
  { id:'D-2956', company:'LavaBem Self-service', cnpj:'19.220.881/0001-44', type:'BASE', number:'BASE0588', consultor:'João Lemos (auto)', avatar:'JL', pipeline:'Portal de Vendas', stage:'Assinatura', value:2390, prob:90, days:0, origin:'portal' },
  { id:'D-2957', company:'KioskExpress Franchising', cnpj:'05.114.221/0001-92', type:'NOVO', number:'NOVO0511', consultor:'Renato Pinto (auto)', avatar:'RP', pipeline:'Portal de Vendas', stage:'Proposta', value:14980, prob:60, days:1, origin:'portal' },
];

const DN_QUOTES = [
  { number:'NOVO0512', company:'Vending Premier Ltda.', type:'Novo', consultor:'Portal de Vendas', value:5070, discount:0, status:'Em assinatura', date:'25/06/2026', origin:'portal' },
  { number:'NOVO0511', company:'KioskExpress', type:'Novo', consultor:'Portal de Vendas', value:14980, discount:0, status:'Enviado', date:'24/06/2026', origin:'portal' },
  { number:'BASE0588', company:'LavaBem Self-service', type:'Base', consultor:'Portal de Vendas', value:2390, discount:0, status:'Em assinatura', date:'24/06/2026', origin:'portal' },
  { number:'NOVO0492', company:'Sup. Alvorada', type:'Novo', consultor:'Daiane Soares', value:2932, discount:5, status:'Enviado', date:'07/05/2026' },
  { number:'FORM0094', company:'GruaFlex', type:'Formulário', consultor:'Vinícius Dias', value:44000, discount:0, status:'Ganho', date:'03/05/2026' },
  { number:'UPGRADE0664', company:'FastVend', type:'Upgrade', consultor:'Guilherme Raksa', value:34800, discount:18, status:'Aprovação Pendente', date:'06/05/2026' },
  { number:'BASE0575', company:'Posto Bandeirantes', type:'Base', consultor:'Leticia Ribeiro', value:21400, discount:22, status:'Aprovação Pendente', date:'06/05/2026' },
  { number:'NOVO0489', company:'Cinemark Family', type:'Novo', consultor:'Karolay Correia', value:88400, discount:12, status:'Aprovado', date:'05/05/2026' },
  { number:'NOVO0491', company:'Vend360', type:'Novo', consultor:'Luiz Guilherme', value:58200, discount:8, status:'Ganho', date:'03/05/2026' },
  { number:'MIGR0012', company:'Lavalite Express', type:'Migração', consultor:'Aline Prado', value:19600, discount:6, status:'Negociação', date:'04/05/2026' },
  { number:'BASE0578', company:'Farmácia Central', type:'Base', consultor:'Nicole Emiliano', value:12200, discount:0, status:'Rascunho', date:'02/05/2026' },
  { number:'DEM0712', company:'Padaria Mineira', type:'Demonstração', consultor:'Daiane Soares', value:8400, discount:0, status:'Expirado', date:'15/04/2026' },
  { number:'RETCOM0058', company:'Hotel Plaza', type:'Retomada', consultor:'Karolay Correia', value:32400, discount:15, status:'Enviado', date:'01/05/2026' },
];

const DN_PRODUCTION = [
  { id:'OP-0481', quote:'NOVO0489', company:'Cinemark Family Lazer', cnpj:'05.114.221/0001-92', city:'São Paulo / SP', qty:80, status:'queued',
    address:'Av. das Nações Unidas, 14401 · Torre B · Brooklin · São Paulo / SP · 04794-000', eta:'12/06/2026', freight:'CIF · Nayax paga',
    products:[{qty:80,name:'VPOS Touch',sku:'VPOS-TCH-01'},{qty:3,name:'Instalação Premium',sku:'INST-PRM'}] },
  { id:'OP-0480', quote:'FORM0094', company:'GruaFlex Serviços', cnpj:'32.114.092/0001-78', city:'Guarulhos / SP', qty:20, status:'producing',
    address:'Rod. Hélio Smidt, s/n · Cumbica · Guarulhos / SP · 07190-100', eta:'06/06/2026', freight:'CIF · Nayax paga',
    products:[{qty:20,name:'VPOS Touch',sku:'VPOS-TCH-01'},{qty:1,name:'Treinamento Frota',sku:'TRN-FLEET'}] },
  { id:'OP-0479', quote:'NOVO0491', company:'Vend360 Ltda', cnpj:'14.222.001/0001-55', city:'Campinas / SP', qty:25, status:'shipped',
    address:'Av. John Boyd Dunlop, 1200 · Jd. Ipaussurama · Campinas / SP · 13060-905', eta:'enviado 02/06', freight:'CIF · Nayax paga',
    products:[{qty:25,name:'VPOS Touch',sku:'VPOS-TCH-01'},{qty:1,name:'Instalação Premium',sku:'INST-PRM'}] },
  { id:'OP-0478', quote:'UPGRADE0664', company:'Rede FastVend', cnpj:'22.114.889/0001-43', city:'Rio de Janeiro / RJ', qty:35, status:'queued',
    address:'Av. das Américas, 3434 · Barra da Tijuca · Rio de Janeiro / RJ · 22640-102', eta:'15/06/2026', freight:'FOB · cliente retira',
    products:[{qty:35,name:'VPOS Touch',sku:'VPOS-TCH-01'}] },
];
const DN_PROD_STATUS = {
  queued:    { c:'var(--orange-30)', bg:'var(--orange-soft)', l:'Na fila' },
  producing: { c:'var(--iris)',      bg:'var(--iris-1)',      l:'Em produção' },
  shipped:   { c:'var(--green-30)',  bg:'var(--green-soft)',  l:'Expedido' },
};

const DN_APPROVALS = [  { quote:'UPGRADE0664', company:'Rede FastVend', value:34800, discount:18, level:'Coordenador', consultor:'Guilherme Raksa', reason:'Cliente estratégico — renovação de contrato com 35 máquinas. Concorrente Cantaloupe ofereceu 22% no pacote.', waiting:'2h', priority:'high', listPrice:42440 },
  { quote:'BASE0575', company:'Posto Bandeirantes', value:21400, discount:22, level:'Diretor', consultor:'Leticia Ribeiro', reason:'Concorrência acirrada. Cliente operando há 4 anos com Ingenico, primeira oportunidade de migração.', waiting:'4h', priority:'med', listPrice:27430 },
  { quote:'NOVO0489', company:'Cinemark Family Lazer', value:88400, discount:12, level:'Coordenador', consultor:'Karolay Correia', reason:'Pilot de 6 meses em 8 unidades. Volume alto potencial.', waiting:'30min', priority:'low', listPrice:100454 },
];

const DN_ACTIVITY = [
  { time:'agora',     user:'Felipe Oliveira', action:'aprovou',  target:'UPGRADE0664', desc:'Aprovou desconto 18% — alçada Diretor',  type:'success' },
  { time:'32 min',    user:'Clicksign',        action:'assinado', target:'NOVO0489',     desc:'Documento assinado pelos 2 signatários — deal Ganho automaticamente', type:'success' },
  { time:'1h 12min',  user:'Guilherme Raksa',  action:'submeteu', target:'UPGRADE0664', desc:'Submeteu para aprovação (Coordenador → Diretor por escalation)', type:'info' },
  { time:'2h 45min',  user:'Karolay Correia',  action:'enviou',   target:'NOVO0489',     desc:'Enviou orçamento para Clicksign · 2 signatários', type:'info' },
  { time:'3h 22min',  user:'Sistema',          action:'aplicou',  target:'NOVO0489',     desc:'Regra PR-02 aplicada: 15% off (≥ 50 VPOS)', type:'info' },
  { time:'4h',        user:'Vinícius Dias',    action:'gerou',    target:'FORM0094',     desc:'PDF gerado · R$ 44.000 · 0% desconto', type:'info' },
];

const DN_TYPE_TONE = { NOVO:'yellow', UPGRADE:'green', BASE:'blue', FORM:'neutral', MIGR:'purple', RETCOM:'orange' };
const DN_QSTATUS = {
  'Rascunho':           { tone:'neutral' },
  'Enviado':            { tone:'blue' },
  'Negociação':         { tone:'orange' },
  'Aprovação Pendente': { tone:'orange' },
  'Aprovado':           { tone:'green' },
  'Em assinatura':      { tone:'purple' },
  'Ganho':              { tone:'green' },
  'Expirado':           { tone:'red' },
};
const DN_AVCOLORS = { DA:'var(--iris)', GR:'var(--violet)', LG:'var(--orange-50)', NE:'var(--spring)', LR:'var(--blue-50)', VD:'var(--iris)', AP:'var(--coral)', KA:'var(--spring)', EF:'var(--accent)', MR:'var(--accent)', JL:'var(--blue-50)', RP:'var(--violet)' };
const dnAv = (a) => DN_AVCOLORS[a] || 'var(--neutral-60)';

const AdminDealNayax = () => {
  const [tab, setTab] = useState('overview'); // overview | deals | quotes | approvals | production
  const [dealsView, setDealsView] = useState('kanban');
  const [approvals, setApprovals] = useState(DN_APPROVALS);
  const [detailDeal, setDetailDeal] = useState(null);
  const [prodOrder, setProdOrder] = useState(null);
  const [building, setBuilding] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (building) return <DealBuilder onClose={() => setBuilding(false)}/>;
  if (settingsOpen) return <DealNayaxSettings onClose={() => setSettingsOpen(false)}/>;

  const STAGES = ['Qualificação','Proposta','Negociação','Assinatura','Ganho','Perdido'];
  const STAGE_TONE = { 'Qualificação':'neutral', 'Proposta':'blue', 'Negociação':'orange', 'Assinatura':'purple', 'Ganho':'green', 'Perdido':'red' };

  const decide = async (q, ok) => {
    if (!ok) {
      const conf = await window.confirmAction({ title: 'Rejeitar ' + q.quote + '?', body: 'O consultor será notificado. Informe o motivo no HubSpot.', danger: true, confirmLabel: 'Rejeitar' });
      if (!conf) return;
    }
    setApprovals(prev => prev.filter(a => a.quote !== q.quote));
    window.toast && window.toast(ok ? 'Desconto de ' + q.quote + ' aprovado' : q.quote + ' rejeitado');
  };

  return (
    <>
      <PageHeader
        kicker="DealNayax · CPQ · HubSpot"
        title="DealNayax"
        sub="Orçamentos, pipeline de negócios e aprovações de desconto — integrado ao HubSpot."
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setSettingsOpen(true)}><Icon name="settings" size={13}/> Configurações</button>
            <button className="btn btn-secondary btn-sm" onClick={async () => { const ok = await window.confirmAction({ title: 'Migrar negócios do HubSpot?', body: 'Importa deals abertos do HubSpot para o DealNayax. Negócios duplicados serão ignorados.', confirmLabel: 'Migrar' }); if(ok) window.toast && window.toast('Migração iniciada — pode levar alguns minutos'); }}><Icon name="refresh" size={13}/> Migrar do HubSpot</button>
            <button className="btn btn-dark btn-sm" onClick={() => setBuilding(true)}><Icon name="plus" size={13}/> Novo orçamento</button>
          </>
        }
      />

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, borderBottom: '1px solid var(--line-1)' }}>
        {[
          { id: 'overview',  label: t('nav.admin.dashboard') },
          { id: 'deals',     label: t('deal.deals', 'Negócios'), count: DN_DEALS.length },
          { id: 'quotes',    label: t('deal.quotes', 'Orçamentos'), count: DN_QUOTES.length },
          { id: 'approvals', label: t('deal.approvals', 'Aprovações'), count: approvals.length, alert: approvals.length > 0 },
          { id: 'production', label: 'Ordens de Produção', count: DN_PRODUCTION.length },
        ].map(tt => (
          <button key={tt.id} onClick={() => setTab(tt.id)} style={{
            padding: '10px 14px', fontSize: 13, fontWeight: 600,
            color: tab === tt.id ? 'var(--text-1)' : 'var(--text-3)',
            borderBottom: '2px solid ' + (tab === tt.id ? 'var(--accent)' : 'transparent'),
            marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tt.label}
            {tt.count != null && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: tt.alert ? 'var(--red-30)' : 'var(--neutral-80)', color: tt.alert ? 'white' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{tt.count}</span>}
          </button>
        ))}
      </div>

      {/* ───── OVERVIEW ───── */}
      {tab === 'overview' && (
        <div className="fade-in">
          {/* Status cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Em Aberto', value: '3', sub: '2 sem movimento +5 dias', icon: 'edit', c: 'var(--gray-2)', bg: 'var(--neutral-80)' },
              { label: 'Enviados ao Cliente', value: '8', sub: 'Aguardando resposta', icon: 'mail', c: 'var(--blue-30)', bg: 'var(--blue-soft)' },
              { label: 'Em Aprovação', value: '3', sub: '1 urgente — alçada Diretor', icon: 'shield', c: 'var(--orange-30)', bg: 'var(--orange-soft)', go: 'approvals' },
              { label: 'Em Assinatura', value: '5', sub: 'Clicksign · 3 visualizados', icon: 'edit', c: 'var(--violet)', bg: 'var(--iris-1)' },
              { label: 'Assinados no Mês', value: '19', sub: 'R$ 412k · taxa 40,4%', icon: 'check', c: 'var(--green-30)', bg: 'var(--green-soft)' },
            ].map((s, i) => (
              <div key={i} className="kpi" style={{ cursor: s.go ? 'pointer' : 'default' }} onClick={() => s.go && setTab(s.go)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: s.bg, color: s.c, display: 'grid', placeItems: 'center' }}><Icon name={s.icon} size={16}/></div>
                  {s.go && <Icon name="arrow-up-right" size={14} style={{ color: s.c, opacity: 0.5 }}/>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 7 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Lifecycle flow */}
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 18 }}>
              <div className="t-overline">Ciclo de vida dos orçamentos</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>Cada etapa mostra orçamentos atualmente nela</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, alignItems: 'end', height: 140 }}>
              {[
                { name: 'Em Aberto', count: 3, value: 'R$ 18,4k', c: 'var(--gray-2)' },
                { name: 'Enviados', count: 8, value: 'R$ 168,2k', c: 'var(--blue-50)' },
                { name: 'Negociação', count: 4, value: 'R$ 89,6k', c: 'var(--orange-50)' },
                { name: 'Em Aprovação', count: 3, value: 'R$ 144,6k', c: 'var(--red-50)' },
                { name: 'Em Assinatura', count: 5, value: 'R$ 178,4k', c: 'var(--iris)' },
                { name: 'Assinados', count: 19, value: 'R$ 412,0k', c: 'var(--green-50)' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, color: s.c, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.count}</div>
                  <div style={{ width: '78%', height: (s.count / 19 * 56 + 8) + 'px', background: s.c, opacity: 0.18, borderBottom: '3px solid ' + s.c, borderRadius: '6px 6px 0 0' }}/>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{s.name}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line-1)', fontSize: 11.5, color: 'var(--text-3)' }}>
              <span>Conversão Em Aberto → Assinado: <strong style={{ color: 'var(--text-1)' }}>40,4%</strong></span>
              <span>t('deal.avgTime', 'Tempo médio total:') <strong style={{ color: 'var(--text-1)' }}>14,2 dias</strong></span>
              <span>t('deal.bottleneck', 'Maior gargalo:') <strong style={{ color: 'var(--red-30)' }}>Enviado → Negociação (50% drop)</strong></span>
            </div>
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
            {/* Awaiting signature */}
            <div className="card">
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{t('deal.awaitingSig', 'Aguardando assinatura')}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Clicksign · 5 orçamentos · R$ 193.840 em jogo</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setTab('quotes')}>Ver todos <Icon name="arrow-right" size={11}/></button>
              </div>
              <div style={{ padding: '6px 10px 12px' }}>
                {[
                  { num:'UPGRADE0664', company:'Rede FastVend', value:34800, signers:'1 de 2 assinou', av:'GR', tone:'orange' },
                  { num:'NOVO0489', company:'Cinemark Family', value:88400, signers:'Cliente abriu', av:'KA', tone:'orange' },
                  { num:'BASE0571', company:'Posto Shell Marginal', value:21400, signers:'Aguardando abrir', av:'VD', tone:'neutral' },
                  { num:'FORM0094', company:'GruaFlex Serviços', value:44000, signers:'Cliente assinou', av:'VD', tone:'green' },
                ].map(it => (
                  <div key={it.num} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 12, alignItems: 'center', padding: '11px 8px', borderRadius: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--' + it.tone + '-soft, var(--neutral-80))', color: 'var(--' + it.tone + '-30, var(--text-2))', display: 'grid', placeItems: 'center' }}><Icon name={it.tone === 'green' ? 'check' : 'clock'} size={15}/></div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{it.num}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{it.company}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 16, height: 16, borderRadius: '50%', background: dnAv(it.av), color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 8, fontWeight: 700 }}>{it.av}</span>
                        {it.signers}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtBRL(it.value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending approvals mini */}
            <div className="card">
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{t('deal.inApproval', 'Em aprovação')}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>ordenado por prioridade</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setTab('approvals')}>Ver fila <Icon name="arrow-right" size={11}/></button>
              </div>
              <div style={{ padding: '6px 10px 12px' }}>
                {approvals.map(a => (
                  <div key={a.quote} style={{ padding: '12px 8px', cursor: 'pointer' }} onClick={() => setTab('approvals')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{a.quote}</span>
                        {a.priority === 'high' && <span className="badge badge-red">URGENTE</span>}
                        {a.priority === 'med' && <span className="badge badge-orange">Médio</span>}
                      </div>
                      <span className={'badge ' + (a.discount >= 20 ? 'badge-red' : 'badge-orange')}>−{a.discount}%</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.company}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 11.5, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={11}/> há {a.waiting} · {a.level}</span>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtBRL(a.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="card card-pad" style={{ marginTop: 16 }}>
            <div className="t-overline" style={{ marginBottom: 14 }}>Atividade recente</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {DN_ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 4px', borderBottom: i < DN_ACTIVITY.length-1 ? '1px solid var(--line-1)' : 'none' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: a.type === 'success' ? 'var(--green-soft)' : 'var(--neutral-80)', color: a.type === 'success' ? 'var(--green-30)' : 'var(--text-2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={a.type === 'success' ? 'check' : 'info'} size={12}/></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13 }}><strong>{a.user}</strong> {a.action} <span className="t-mono" style={{ background: 'var(--bg-surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 11.5 }}>{a.target}</span></div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{a.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── DEALS ───── */}
      {tab === 'deals' && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-neutral">{DN_DEALS.length} negócios</span>
              <span className="badge badge-yellow">R$ 318k pipeline</span>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)' }}>
              {[{id:'kanban',l:'Pipeline'},{id:'list',l:'Lista'}].map(v => (
                <button key={v.id} onClick={() => setDealsView(v.id)} style={{
                  padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 600,
                  background: dealsView === v.id ? 'var(--dark)' : 'transparent',
                  color: dealsView === v.id ? 'white' : 'var(--text-2)',
                }}>{v.l}</button>
              ))}
            </div>
          </div>

          {dealsView === 'kanban' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(180px, 1fr))', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {STAGES.map(st => {
                const items = DN_DEALS.filter(d => d.stage === st);
                const total = items.reduce((s, x) => s + x.value, 0);
                return (
                  <div key={st} style={{ minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-surface-2)', border: '1px solid var(--line-1)', borderRadius: '8px 8px 0 0' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--' + (STAGE_TONE[st]==='neutral'?'gray-1':STAGE_TONE[st]+'-50') + ', var(--gray-1))' }}/> {st}</span>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{items.length}</span>
                    </div>
                    <div style={{ background: 'var(--bg-surface-2)', borderLeft: '1px solid var(--line-1)', borderRight: '1px solid var(--line-1)', padding: 8, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                      {items.length === 0 && <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--neutral-60)', fontSize: 11 }}>Vazio</div>}
                      {items.map(d => (
                        <div key={d.id} className="card" style={{ padding: 11, cursor: 'pointer' }} onClick={() => setDetailDeal(d)}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{d.company}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{d.consultor}</div>
                          {d.origin === 'portal' && <span className="badge badge-yellow" style={{ fontSize: 9, marginTop: 4 }}>Portal de Vendas</span>}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtBRL(d.value)}</div>
                            {d.flag === 'approval' && <span className="badge badge-orange" style={{ fontSize: 9 }}>aprov.</span>}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line-1)' }}>
                            <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{d.number}</span>
                            <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{d.days}d</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '8px 10px', fontSize: 11, color: 'var(--text-3)', background: 'var(--bg-surface)', border: '1px solid var(--line-1)', borderRadius: '0 0 8px 8px' }}>
                      Total: <strong style={{ color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{fmtBRLcurt(total)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="t">
                <thead><tr><th>Empresa</th><th>Tipo</th><th>Número</th><th>Consultor</th><th>Etapa</th><th style={{textAlign:'right'}}>Valor</th><th>Prob.</th></tr></thead>
                <tbody>
                  {DN_DEALS.map(d => (
                    <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => setDetailDeal(d)}>
                      <td><div style={{ fontWeight: 600 }}>{d.company}{d.origin === 'portal' && <span className="badge badge-yellow" style={{ fontSize: 9, marginLeft: 6 }}>Portal</span>}</div><div className="cell-mono">{d.cnpj}</div></td>
                      <td><span className={'badge badge-' + DN_TYPE_TONE[d.type]}>{d.type}</span></td>
                      <td><span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{d.number}</span></td>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 24, height: 24, borderRadius: '50%', background: dnAv(d.avatar), color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{d.avatar}</span><span style={{ fontSize: 12.5 }}>{d.consultor}</span></div></td>
                      <td><span className={'badge badge-' + STAGE_TONE[d.stage]}><span className="dot"/> {d.stage}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(d.value)}</td>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 50, height: 5, background: 'var(--neutral-80)', borderRadius: 3 }}><div style={{ height: '100%', width: d.prob + '%', background: 'var(--accent)', borderRadius: 3 }}/></div><span style={{ fontSize: 11, fontWeight: 600 }}>{d.prob}%</span></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ───── QUOTES ───── */}
      {tab === 'quotes' && (
        <div className="fade-in table-wrap">
          <table className="t">
            <thead><tr><th>Número</th><th>Empresa</th><th>Tipo</th><th>Consultor</th><th style={{textAlign:'right'}}>Valor</th><th>Desconto</th><th>Status</th><th>Data</th></tr></thead>
            <tbody>
              {DN_QUOTES.map(q => (
                <tr key={q.number}>
                  <td><span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{q.number}</span></td>
                  <td style={{ fontWeight: 600 }}>{q.company}{q.origin === 'portal' && <span className="badge badge-yellow" style={{ fontSize: 9, marginLeft: 6 }}>Portal</span>}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{q.type}</td>
                  <td style={{ fontSize: 12.5 }}>{q.consultor}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(q.value)}</td>
                  <td>{q.discount > 0 ? <span className={'badge ' + (q.discount >= 20 ? 'badge-red' : q.discount >= 12 ? 'badge-orange' : 'badge-neutral')}>−{q.discount}%</span> : <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                  <td><span className={'badge badge-' + (DN_QSTATUS[q.status]?.tone || 'neutral')}><span className="dot"/> {q.status}</span></td>
                  <td className="cell-mono">{q.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ───── APPROVALS ───── */}
      {tab === 'approvals' && (
        <div className="fade-in">
          {approvals.length === 0 ? (
            <EmptyState icon="check" title="Nenhuma aprovação pendente" body="Todos os descontos foram decididos. Bom trabalho!"/>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {approvals.map(a => (
                <div key={a.quote} className="card card-pad" style={{ borderLeft: '3px solid ' + (a.priority === 'high' ? 'var(--red-30)' : a.priority === 'med' ? 'var(--orange-30)' : 'var(--neutral-60)') }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                        <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{a.quote}</span>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{a.company}</span>
                        {a.priority === 'high' && <span className="badge badge-red">URGENTE</span>}
                        {a.priority === 'med' && <span className="badge badge-orange">Médio</span>}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, maxWidth: 560 }}>{a.reason}</div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--text-3)' }}>
                        <span><Icon name="user" size={11}/> {a.consultor}</span>
                        <span><Icon name="shield" size={11}/> Alçada: {a.level}</span>
                        <span><Icon name="clock" size={11}/> há {a.waiting}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 180 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'line-through' }}>{fmtBRL(a.listPrice)}</div>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>{fmtBRL(a.value)}</div>
                      <div className={'badge ' + (a.discount >= 20 ? 'badge-red' : 'badge-orange')} style={{ marginTop: 4 }}>−{a.discount}% desconto</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => decide(a, false)}><Icon name="x" size={13}/> Rejeitar</button>
                        <button className="btn btn-primary btn-sm" onClick={() => decide(a, true)}><Icon name="check" size={13} stroke={3}/> Aprovar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRODUCTION ORDERS */}
      {tab === 'production' && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Geradas automaticamente de orçamentos <strong style={{ color: 'var(--text-1)' }}>assinados</strong> que possuem endereço de entrega. Itens só-digitais (Cloud, taxas) não geram ordem.
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => window.toast && window.toast('Exportando ordens de produção (CSV)…')}><Icon name="download" size={13}/> Exportar</button>
          </div>
          <div className="table-wrap">
            <table className="t">
              <thead><tr><th>Ordem</th><th>Proposta</th><th>Cliente</th><th>Entrega</th><th>Itens</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {DN_PRODUCTION.map(p => {
                  const sm = DN_PROD_STATUS[p.status];
                  return (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setProdOrder(p)}>
                      <td><span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{p.id}</span></td>
                      <td><span className="cell-mono" style={{ fontWeight: 600, color: 'var(--text-1)' }}>{p.quote}</span></td>
                      <td><div style={{ fontWeight: 600 }}>{p.company}</div><div className="cell-mono">{p.cnpj}</div></td>
                      <td style={{ color: 'var(--text-2)', fontSize: 12.5, maxWidth: 220 }}>{p.city}</td>
                      <td><strong>{p.qty}</strong> un.</td>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: sm.bg, color: sm.c }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: sm.c }}/> {sm.l}</span></td>
                      <td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm">Abrir <Icon name="arrow-right" size={12}/></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Production order modal */}
      {prodOrder && (
        <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setProdOrder(null)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="t-overline" style={{ color: 'var(--accent)' }}>Ordem de produção</div>
                <div style={{ fontSize: 19, fontWeight: 700, marginTop: 2, fontFamily: 'var(--font-mono)' }}>{prodOrder.id}</div>
              </div>
              <button onClick={() => setProdOrder(null)} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="badge badge-inverse" style={{ fontFamily: 'var(--font-mono)' }}>{prodOrder.quote}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>·</span>
                {(() => { const sm = DN_PROD_STATUS[prodOrder.status]; return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: sm.bg, color: sm.c }}>{sm.l}</span>; })()}
              </div>
              <div>
                <div className="t-overline" style={{ fontSize: 10, marginBottom: 4 }}>Cliente</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{prodOrder.company}</div>
                <div className="cell-mono">{prodOrder.cnpj}</div>
              </div>
              <div>
                <div className="t-overline" style={{ fontSize: 10, marginBottom: 4 }}>Endereço de entrega</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{prodOrder.address}</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div className="t-overline" style={{ fontSize: 10 }}>Produtos a produzir</div>
                  <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{prodOrder.products.length} {prodOrder.products.length === 1 ? 'item' : 'itens'} · {prodOrder.qty} un. no total</span>
                </div>
                <div style={{ border: '1px solid var(--line-1)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 10, padding: '8px 12px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--line-1)', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <span>Qtd</span><span>Produto</span><span>SKU</span>
                  </div>
                  {prodOrder.products.map((pr, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 10, padding: '10px 12px', borderBottom: i < prodOrder.products.length-1 ? '1px solid var(--line-1)' : 'none', fontSize: 13, alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{pr.qty}×</span>
                      <span style={{ fontWeight: 600 }}>{pr.name}</span>
                      <span className="cell-mono" style={{ color: 'var(--text-3)' }}>{pr.sku}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 24px 20px' }}>
              <button className="btn btn-ghost" onClick={() => setProdOrder(null)}>Fechar</button>
              <button className="btn btn-secondary" onClick={() => {
                const p = prodOrder;
                const w = window.open('', '_blank');
                if (!w) { window.toast && window.toast('Permita pop-ups para imprimir'); return; }
                const total = p.products.reduce((a, pr) => a + pr.qty, 0);
                const rows = p.products.map((pr, i) => `<tr><td style="padding:11px 14px;border-bottom:1px solid #ececec;font-family:'Courier New',monospace;font-weight:700;font-size:15px;width:60px">${pr.qty}×</td><td style="padding:11px 14px;border-bottom:1px solid #ececec"><b>${pr.name}</b></td><td style="padding:11px 14px;border-bottom:1px solid #ececec;font-family:'Courier New',monospace;color:#777;text-align:right">${pr.sku}</td></tr>`).join('');
                const today = new Date().toLocaleDateString('pt-BR');
                w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Ordem de Produção ${p.id}</title><style>
                  *{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#1d1d1f;max-width:720px;margin:0 auto;padding:40px}
                  .top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:3px solid #1d1d1f}
                  .brand{font-weight:800;font-size:15px;letter-spacing:2px}.brand span{color:#888}
                  h1{font-size:26px;margin:4px 0 0}
                  .op{background:#fff;color:#1d1d1f;border:1.5px solid #1d1d1f;font-family:'Courier New',monospace;font-weight:700;padding:8px 14px;border-radius:7px;font-size:16px;white-space:nowrap}
                  .meta{display:flex;gap:32px;margin:22px 0 8px}
                  .lbl{font-size:9.5px;font-weight:700;color:#999;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:5px}
                  .val{font-size:14px;font-weight:600}.sub{font-family:'Courier New',monospace;color:#777;font-size:12px;margin-top:2px}
                  .addr{background:#f7f5f0;border:1px solid #ececec;border-radius:10px;padding:16px;margin:18px 0}
                  table{width:100%;border-collapse:collapse;border:1px solid #ececec;border-radius:10px;overflow:hidden;margin-top:8px}
                  thead td{background:#f5f5f5;color:#666;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 14px;border-bottom:1px solid #ddd}
                  .totbar{display:flex;justify-content:space-between;align-items:center;background:#f5f5f5;border:1px solid #ddd;border-radius:10px;padding:14px 18px;margin-top:14px}
                  .totbar b{font-size:22px}
                  .foot{margin-top:48px;padding-top:16px;border-top:1px solid #ececec;font-size:10.5px;color:#aaa;display:flex;justify-content:space-between}
                </style></head><body>
                  <div class="top"><div><div class="brand">NAYAX <span>BRASIL</span></div><h1>Ordem de Produção</h1></div><span class="op">${p.id}</span></div>
                  <div class="meta">
                    <div><div class="lbl">Proposta</div><div class="val" style="font-family:'Courier New',monospace">${p.quote}</div></div>
                    <div><div class="lbl">Emissão</div><div class="val">${today}</div></div>
                    <div><div class="lbl">Status</div><div class="val">${DN_PROD_STATUS[p.status].l}</div></div>
                  </div>
                  <div class="lbl" style="margin-top:18px">Cliente</div><div class="val">${p.company}</div><div class="sub">${p.cnpj}</div>
                  <div class="addr"><div class="lbl">Endereço de entrega</div><div style="font-size:13.5px;line-height:1.6">${p.address}</div></div>
                  <div class="lbl">Itens para produção</div>
                  <table><thead><tr><td>Qtd</td><td>Produto</td><td style="text-align:right">SKU</td></tr></thead><tbody>${rows}</tbody></table>
                  <div class="totbar"><span style="font-weight:600">Total de unidades a produzir</span><b>${total} un.</b></div>
                  <div class="foot"><span>${p.id} · Proposta ${p.quote}</span><span>Nayax Brasil · uso interno</span></div>
                  <script>window.onload=function(){window.print()}<\/script></body></html>`);
                w.document.close();
              }}><Icon name="download" size={13}/> Imprimir ordem</button>
              <button className="btn btn-primary" onClick={() => { window.toast && window.toast('Ordem ' + prodOrder.id + ' marcada como produzida'); setProdOrder(null); }}><Icon name="check" size={13} stroke={3}/> Marcar produzido</button>
            </div>
          </div>
        </div>
      )}

      {/* Deal detail modal */}
      {detailDeal && (
        <div className="modal-wrap" onClick={e => e.target === e.currentTarget && setDetailDeal(null)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div style={{ background: 'var(--bg-inverse)', color: 'var(--text-on-inverse)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="t-overline" style={{ color: 'var(--accent)' }}>{detailDeal.number} · {detailDeal.type}</div>
                <div style={{ fontSize: 19, fontWeight: 700, marginTop: 2 }}>{detailDeal.company}</div>
              </div>
              <button onClick={() => setDetailDeal(null)} style={{ width: 30, height: 30, color: 'rgba(255,255,255,0.7)' }}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><div className="t-overline" style={{ fontSize: 10 }}>CNPJ</div><div className="cell-mono" style={{ marginTop: 4 }}>{detailDeal.cnpj}</div></div>
              <div><div className="t-overline" style={{ fontSize: 10 }}>Pipeline</div><div style={{ marginTop: 4, fontSize: 13 }}>{detailDeal.pipeline}</div></div>
              <div><div className="t-overline" style={{ fontSize: 10 }}>Etapa</div><div style={{ marginTop: 4 }}><span className={'badge badge-' + STAGE_TONE[detailDeal.stage]}><span className="dot"/> {detailDeal.stage}</span></div></div>
              <div><div className="t-overline" style={{ fontSize: 10 }}>Consultor</div><div style={{ marginTop: 4, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: dnAv(detailDeal.avatar), color: 'var(--dark)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>{detailDeal.avatar}</span>{detailDeal.consultor}</div></div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', padding: 16, background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)' }}>
                <div><div className="t-overline" style={{ fontSize: 10 }}>Valor</div><div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtBRL(detailDeal.value)}</div></div>
                <div style={{ textAlign: 'right' }}><div className="t-overline" style={{ fontSize: 10 }}>Probabilidade</div><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green-30)' }}>{detailDeal.prob}%</div></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 24px 20px' }}>
              <button className="btn btn-ghost" onClick={() => setDetailDeal(null)}>Fechar</button>
              <button className="btn btn-secondary"><Icon name="external" size={13}/> Ver no HubSpot</button>
              <button className="btn btn-primary" onClick={() => { setDetailDeal(null); setBuilding(true); }}><Icon name="receipt" size={13}/> Gerar orçamento</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

window.AdminDealNayax = AdminDealNayax;