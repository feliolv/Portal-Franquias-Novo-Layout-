/* ================================================================
   DealNayax v6 — Sample data
================================================================ */

// Product catalog
const CATALOG = [
  // Hardware
  { sku: "VPOS-TCH-01", category: "hardware", line: "VM+Grua", name: "VPOS Touch", desc: "Terminal 4G + leitor NFC + chip", price: 1890, recurring: false, popular: true, icon: "monitor" },
  { sku: "VPOS-SOL-01", category: "hardware", line: "VM+Grua", name: "VPOS Solo", desc: "Terminal compacto sem display", price: 1290, recurring: false, icon: "credit-card" },
  { sku: "ONX-LITE-01", category: "hardware", line: "VM+Grua", name: "Onyx Lite", desc: "Reader contactless single-purpose", price: 690, recurring: false, icon: "wifi" },
  { sku: "MOMA-01", category: "hardware", line: "Food", name: "MOMA", desc: "Cashless reader para máquinas food", price: 1490, recurring: false, icon: "coffee" },
  { sku: "EZS-01", category: "hardware", line: "Lavanderia", name: "EZ-Smart", desc: "Reader para lavanderias auto-serviço", price: 1390, recurring: false, icon: "droplets" },
  { sku: "TIG-RDR-01", category: "hardware", line: "FEC", name: "Tigapo Reader", desc: "Reader NFC para arcades", price: 590, recurring: false, icon: "joystick" },

  // Software / Recurring
  { sku: "NCL-BASIC", category: "software", line: "VM+Grua", name: "Nayax Cloud Basic", desc: "Dashboard + relatórios mensais", price: 39, recurring: true, recurringType: "monthly", icon: "cloud" },
  { sku: "NCL-PRO", category: "software", line: "VM+Grua", name: "Nayax Cloud Pro", desc: "Dashboard + alertas + multi-usuário + API", price: 89, recurring: true, recurringType: "monthly", popular: true, icon: "cloud" },
  { sku: "NCL-ENT", category: "software", line: "VM+Grua", name: "Nayax Cloud Enterprise", desc: "Pro + SLA 24/7 + BI custom", price: 189, recurring: true, recurringType: "monthly", icon: "shield" },
  { sku: "MNY-X", category: "software", line: "KA", name: "MoneyX Wallet", desc: "Programa de fidelidade + carteira digital", price: 149, recurring: true, recurringType: "monthly", icon: "wallet" },

  // Services
  { sku: "INST-STD", category: "service", line: "all", name: "Instalação Padrão", desc: "Instalação local · até 5 terminais", price: 350, recurring: false, icon: "tool" },
  { sku: "INST-PRM", category: "service", line: "all", name: "Instalação Premium", desc: "Instalação + treinamento equipe", price: 850, recurring: false, icon: "tool" },
  { sku: "TRN-FLEET", category: "service", line: "all", name: "Treinamento Frota", desc: "Onboarding completo até 50 terminais", price: 1850, recurring: false, icon: "users" },
  { sku: "SUP-247", category: "service", line: "all", name: "Suporte 24/7", desc: "SLA 4h · resposta humano", price: 290, recurring: true, recurringType: "monthly", icon: "headphones" },

  // Fees
  { sku: "MDR-DBT", category: "fee", line: "all", name: "Taxa Débito", desc: "1,99% por transação aprovada", price: 0, displayPrice: "1,99%", recurring: true, recurringType: "per-transaction", icon: "percent" },
  { sku: "MDR-CRD", category: "fee", line: "all", name: "Taxa Crédito à vista", desc: "2,89% por transação aprovada", price: 0, displayPrice: "2,89%", recurring: true, recurringType: "per-transaction", icon: "percent" },
  { sku: "MDR-PIX", category: "fee", line: "all", name: "Taxa PIX", desc: "0,99% por transação", price: 0, displayPrice: "0,99%", recurring: true, recurringType: "per-transaction", icon: "percent" }
];

// Bundles
const BUNDLES = [
  {
    id: "starter",
    name: "Starter Operator",
    desc: "Operador com até 10 máquinas — começa rápido",
    tag: "Mais escolhido",
    items: [
      { sku: "VPOS-TCH-01", qty: 5 },
      { sku: "NCL-BASIC", qty: 5 },
      { sku: "INST-STD", qty: 1 }
    ],
    badge: "popular"
  },
  {
    id: "pro",
    name: "Pro Fleet",
    desc: "Frota até 50 máquinas · Cloud Pro · suporte estendido",
    items: [
      { sku: "VPOS-TCH-01", qty: 25 },
      { sku: "NCL-PRO", qty: 25 },
      { sku: "INST-PRM", qty: 1 },
      { sku: "TRN-FLEET", qty: 1 },
      { sku: "SUP-247", qty: 1 }
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise Multi-vertical",
    desc: "Cloud Enterprise · SLA 24/7 · gestor de conta dedicado",
    items: [
      { sku: "VPOS-TCH-01", qty: 80 },
      { sku: "NCL-ENT", qty: 80 },
      { sku: "INST-PRM", qty: 3 },
      { sku: "TRN-FLEET", qty: 2 },
      { sku: "SUP-247", qty: 1 }
    ]
  }
];

// Pipelines
const PIPELINES = [
  { id: "822543360", name: "VM-Vendas", stages: ["Qualificação","Proposta","Negociação","Assinatura","Ganho","Perdido"] },
  { id: "836863041", name: "VM-Vendas da Base", stages: ["Mapeamento","Proposta","Negociação","Assinatura","Ganho","Perdido"] }
];

// Deals (Pipeline)
const DEALS = [
  { id:"D-2945", company:"Supermercado Alvorada", cnpj:"17.833.301/0016-85", type:"NOVO", number:"NOVO0492", consultor:"Daiane Soares", avatar:"DA", pipeline:"VM-Vendas", stage:"Proposta", value:2932, prob:60, days:2, owner:"85001768" },
  { id:"D-2946", company:"Rede FastVend", cnpj:"22.114.889/0001-43", type:"UPGRADE", number:"UPGRADE0664", consultor:"Guilherme Raksa", avatar:"GR", pipeline:"VM-Vendas da Base", stage:"Negociação", value:34800, prob:75, days:5, owner:"85578673", flag:"approval" },
  { id:"D-2947", company:"Vend360 Ltda", cnpj:"14.222.001/0001-55", type:"NOVO", number:"NOVO0491", consultor:"Luiz Guilherme", avatar:"LG", pipeline:"VM-Vendas", stage:"Ganho", value:58200, prob:100, days:8, owner:"85578642" },
  { id:"D-2948", company:"Farmácia Central", cnpj:"45.998.221/0001-12", type:"BASE", number:"BASE0578", consultor:"Nicole Emiliano", avatar:"NE", pipeline:"VM-Vendas", stage:"Qualificação", value:12200, prob:30, days:5, owner:"85001952" },
  { id:"D-2949", company:"Posto Bandeirantes", cnpj:"08.221.992/0001-23", type:"BASE", number:"BASE0575", consultor:"Leticia Ribeiro", avatar:"LR", pipeline:"VM-Vendas", stage:"Proposta", value:21400, prob:50, days:1, owner:"85775979", flag:"approval" },
  { id:"D-2950", company:"GruaFlex Serviços", cnpj:"32.114.092/0001-78", type:"FORM", number:"FORM0094", consultor:"Vinícius Dias", avatar:"VD", pipeline:"VM-Vendas da Base", stage:"Assinatura", value:44000, prob:90, days:1, owner:"85578620" },
  { id:"D-2951", company:"Lavalite Express", cnpj:"19.220.881/0001-44", type:"MIGR", number:"MIGR0012", consultor:"Aline Prado", avatar:"AP", pipeline:"VM-Vendas", stage:"Negociação", value:19600, prob:65, days:3, owner:"83943879" },
  { id:"D-2952", company:"Cinemark Family", cnpj:"05.114.221/0001-92", type:"NOVO", number:"NOVO0489", consultor:"Karolay Correia", avatar:"KA", pipeline:"VM-Vendas", stage:"Assinatura", value:88400, prob:95, days:2, owner:"85001768" },
  { id:"D-2953", company:"Café & Conveniência SP", cnpj:"11.992.401/0001-33", type:"NOVO", number:"NOVO0488", consultor:"Elison Fernandes", avatar:"EF", pipeline:"VM-Vendas", stage:"Qualificação", value:8800, prob:25, days:6, owner:"83943888" },
  { id:"D-2954", company:"Arcade Multiplay", cnpj:"28.331.001/0001-66", type:"NOVO", number:"NOVO0487", consultor:"Vinícius Dias", avatar:"VD", pipeline:"VM-Vendas da Base", stage:"Ganho", value:34500, prob:100, days:12, owner:"85578620" }
];

// Quotes
const QUOTES = [
  { number:"NOVO0492", company:"Sup. Alvorada", type:"Novo", consultor:"Daiane Soares", value:2932, discount:5, status:"Enviado", date:"07/05/2025" },
  { number:"FORM0094", company:"GruaFlex", type:"Formulário", consultor:"Vinícius Dias", value:44000, discount:0, status:"Ganho", date:"03/05/2025" },
  { number:"UPGRADE0664", company:"FastVend", type:"Upgrade", consultor:"Guilherme Raksa", value:34800, discount:18, status:"Aprovação Pendente", date:"06/05/2025" },
  { number:"BASE0575", company:"Posto Bandeirantes", type:"Base", consultor:"Leticia Ribeiro", value:21400, discount:22, status:"Aprovação Pendente", date:"06/05/2025" },
  { number:"NOVO0489", company:"Cinemark Family", type:"Novo", consultor:"Karolay Correia", value:88400, discount:12, status:"Aprovado", date:"05/05/2025" },
  { number:"NOVO0491", company:"Vend360", type:"Novo", consultor:"Luiz Guilherme", value:58200, discount:8, status:"Ganho", date:"03/05/2025" },
  { number:"MIGR0012", company:"Lavalite Express", type:"Migração", consultor:"Aline Prado", value:19600, discount:6, status:"Negociação", date:"04/05/2025" },
  { number:"BASE0578", company:"Farmácia Central", type:"Base", consultor:"Nicole Emiliano", value:12200, discount:0, status:"Rascunho", date:"02/05/2025" },
  { number:"DEM0712", company:"Padaria Mineira", type:"Demonstração", consultor:"Daiane Soares", value:8400, discount:0, status:"Expirado", date:"15/04/2025" },
  { number:"RETCOM0058", company:"Hotel Plaza", type:"Retomada", consultor:"Karolay Correia", value:32400, discount:15, status:"Enviado", date:"01/05/2025" }
];

// Approval queue
const APPROVALS = [
  { quote:"UPGRADE0664", company:"Rede FastVend", value:34800, discount:18, level:"Coordenador", consultor:"Guilherme Raksa", reason:"Cliente estratégico — renovação de contrato com 35 máquinas. Concorrente Cantaloupe ofereceu 22% no pacote.", waiting:"2h", priority:"high", listPrice:42440 },
  { quote:"BASE0575", company:"Posto Bandeirantes", value:21400, discount:22, level:"Diretor", consultor:"Leticia Ribeiro", reason:"Concorrência acirrada. Cliente operando há 4 anos com Ingenico, primeira oportunidade de migração.", waiting:"4h", priority:"med", listPrice:27430 },
  { quote:"NOVO0489", company:"Cinemark Family Lazer", value:88400, discount:12, level:"Coordenador", consultor:"Karolay Correia", reason:"Pilot de 6 meses em 8 unidades. Volume alto potencial.", waiting:"30min", priority:"low", listPrice:100454 }
];

// Renewals (recurring contracts)
const RENEWALS = [
  { contract:"CR-00874", company:"Supermercado Bom Preço", mrr:1245, expires:"15/06/2025", daysLeft:36, status:"Renovação automática", consultor:"Daiane Soares" },
  { contract:"CR-00875", company:"Padaria Esquina Verde", mrr:380, expires:"22/06/2025", daysLeft:43, status:"Em renovação", consultor:"Nicole Emiliano" },
  { contract:"CR-00871", company:"Lavanderia Express SP", mrr:890, expires:"30/05/2025", daysLeft:20, status:"Atenção", consultor:"Aline Prado", risk:"high" },
  { contract:"CR-00867", company:"Vending Brasil", mrr:4280, expires:"12/05/2025", daysLeft:5, status:"Crítico", consultor:"Guilherme Raksa", risk:"high" },
  { contract:"CR-00876", company:"Posto Shell Marginal", mrr:1820, expires:"08/07/2025", daysLeft:59, status:"Renovação automática", consultor:"Vinícius Dias" },
  { contract:"CR-00873", company:"GruaFlex Serviços", mrr:2150, expires:"02/08/2025", daysLeft:84, status:"Renovação automática", consultor:"Vinícius Dias" }
];

// Pricing rules
const PRICING_RULES = [
  { id:"PR-01", name:"Desconto por volume — VPOS", trigger:"Qtd. de VPOS Touch ≥ 20", effect:"10% off em hardware", active:true, scope:"VM+Grua" },
  { id:"PR-02", name:"Desconto por volume — Frota grande", trigger:"Qtd. de VPOS Touch ≥ 50", effect:"15% off em hardware + 20% off em Cloud Pro", active:true, scope:"VM+Grua" },
  { id:"PR-03", name:"Bundle Cloud + Hardware", trigger:"Cloud Pro vendido junto com VPOS", effect:"Instalação Padrão grátis", active:true, scope:"all" },
  { id:"PR-04", name:"Combo Food+Cashless", trigger:"MOMA + EZ-Smart no mesmo deal", effect:"5% off no combo", active:true, scope:"Food/Lav" },
  { id:"PR-05", name:"Renovação fidelidade", trigger:"Cliente ativo há ≥ 24 meses", effect:"Mantém preço do contrato anterior (sem reajuste)", active:false, scope:"all" },
  { id:"PR-06", name:"MDR PIX bonificado", trigger:"Volume mensal de PIX ≥ R$ 100k", effect:"MDR PIX 0,79% (-0,20pp)", active:true, scope:"all" }
];

// Approval policies
const APPROVAL_POLICY = [
  { range:"0% – 5%", approver:"Automático (sistema)", color:"green", icon:"zap" },
  { range:"5% – 12%", approver:"Coordenador · Daiane Soares", color:"blue", icon:"user-check" },
  { range:"12% – 25%", approver:"Diretor · Felipe Oliveira", color:"amber", icon:"shield" },
  { range:"25% – 40%", approver:"Comitê CEO + CFO", color:"red", icon:"users" },
  { range:"> 40%", approver:"Bloqueado · não permitido", color:"black", icon:"x" }
];

// Users
const USERS = [
  { name:"Felipe Oliveira", email:"felipeo@nayax.com", role:"Super Admin", team:"—", pipelines:"Todos", avatar:"FO", ownerId:"85578000" },
  { name:"Daiane Soares", email:"daianeo@nayax.com", role:"Coordenador", team:"Todas", pipelines:"822543360, 836863041", avatar:"DA", ownerId:"85001500" },
  { name:"Karolay Correia", email:"karolay@nayax.com", role:"Consultor", team:"VM+Grua", pipelines:"822543360", avatar:"KA", ownerId:"85001768" },
  { name:"Nicole Emiliano", email:"nicole@nayax.com", role:"Consultor", team:"VM+Grua", pipelines:"822543360", avatar:"NE", ownerId:"85001952" },
  { name:"Leticia Ribeiro", email:"leticia@nayax.com", role:"Consultor", team:"VM+Grua", pipelines:"822543360", avatar:"LR", ownerId:"85775979" },
  { name:"Aline Prado", email:"aline@nayax.com", role:"Consultor", team:"MM+Lav", pipelines:"822543360", avatar:"AP", ownerId:"83943879" },
  { name:"Guilherme Raksa", email:"guilherme@nayax.com", role:"Consultor", team:"Food", pipelines:"836863041", avatar:"GR", ownerId:"85578673" },
  { name:"Vinícius Dias", email:"vinicius@nayax.com", role:"Consultor", team:"KA", pipelines:"836863041", avatar:"VD", ownerId:"85578620" },
  { name:"Luiz Guilherme", email:"luiz@nayax.com", role:"Consultor", team:"KA", pipelines:"822543360", avatar:"LG", ownerId:"85578642" },
  { name:"Elison Fernandes", email:"elison@nayax.com", role:"Consultor", team:"Food", pipelines:"822543360", avatar:"EF", ownerId:"83943888" }
];

// Builder default state
const BUILDER_DEFAULT = {
  type: "NOVO",
  number: "NOVO0493",
  customer: "Supermercado Alvorada",
  pipeline: "822543360",
  validity: 30,
  items: [
    { sku:"VPOS-TCH-01", qty:5, discount:0 },
    { sku:"NCL-PRO", qty:5, discount:0 },
    { sku:"INST-STD", qty:1, discount:0 }
  ],
  bundleApplied: null,
  appliedRules: ["PR-03"],
  manualDiscount: 0,
  payment: {
    entryMethod: "PIX",
    entryValue: 30,
    installments: 5,
    installmentMethod: "Boleto",
    dueDay: 10
  }
};

// Funnel data
const FUNNEL = [
  { stage:"Qualificação", count:18, value:142800, pct:100 },
  { stage:"Proposta", count:12, value:198400, pct:72 },
  { stage:"Negociação", count:9, value:184600, pct:54 },
  { stage:"Assinatura", count:5, value:178400, pct:30 },
  { stage:"Ganho", count:3, value:140800, pct:18 }
];

// Activity log
const ACTIVITY = [
  { time:"agora",     user:"Felipe Oliveira", action:"approved",  target:"UPGRADE0664", desc:"Aprovou desconto 18% — alçada Diretor",  type:"success" },
  { time:"32 min",    user:"Clicksign",        action:"signed",    target:"NOVO0489",     desc:"Documento assinado pelos 2 signatários — deal Ganho automaticamente", type:"success" },
  { time:"1h 12min",  user:"Guilherme Raksa",  action:"submitted", target:"UPGRADE0664", desc:"Submeteu para aprovação (Coordenador → Diretor por escalation)", type:"info" },
  { time:"2h 45min",  user:"Karolay Correia",  action:"sent",      target:"NOVO0489",     desc:"Enviou orçamento para Clicksign · 2 signatários", type:"info" },
  { time:"3h 22min",  user:"Sistema",          action:"applied",   target:"NOVO0489",     desc:"Regra PR-02 aplicada: 15% off (≥ 50 VPOS)", type:"info" },
  { time:"4h",        user:"Vinícius Dias",    action:"generated", target:"FORM0094",     desc:"PDF gerado · R$ 44.000 · 0% desconto", type:"info" },
  { time:"ontem",     user:"HubSpot Sync",     action:"sync",      target:"47 deals",     desc:"Sincronização completa · 0 erros", type:"info" }
];

window.__data = { CATALOG, BUNDLES, PIPELINES, DEALS, QUOTES, APPROVALS, RENEWALS, PRICING_RULES, APPROVAL_POLICY, USERS, BUILDER_DEFAULT, FUNNEL, ACTIVITY };
