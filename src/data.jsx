/* ════════════════════════════════════════════════════════
   Mock data — realistic Nayax Brasil context
   Marca Nayax (BR) opera pagamentos para mercado autônomo, 
   máquinas de vending, lavanderias, postos de carga EV, etc.
   ════════════════════════════════════════════════════════ */

const PRODUCTS = [
  { id: 'p1',  sku: 'VPOS-NYX-V3',    name: 'VPOS Touch v3',           cat: 'Terminais',  segment: 'Vending Machine',      price: 1690, oldPrice: 1990, badge: 'Novo', short: 'Terminal cashless 4G + NFC para máquinas automáticas', monthly: 49.90, stock: 38, new: true },
  { id: 'p2',  sku: 'VPOS-NYX-IO',    name: 'VPOS IoT Onyx',           cat: 'Terminais',  segment: 'Vending Machine',      price: 1290, oldPrice: 1490, short: 'Telemetria + cashless para vending de bebida e snack', monthly: 49.90, stock: 124 },
  { id: 'p3',  sku: 'AMIT-3.0',       name: 'Amit 3.0 — Telemetria',   cat: 'Acessórios', segment: 'Vending Machine',      price: 540,  short: 'Módulo MDB de telemetria para máquinas legadas', monthly: 0, stock: 80 },
  { id: 'p4',  sku: 'EV-CHARG-22',    name: 'NayaxCharge 22 kW',       cat: 'EV',         segment: 'EV',                   price: 18900, badge: 'Top', short: 'Estação de recarga AC 22 kW com pagamento integrado', monthly: 89.90, stock: 12 },
  { id: 'p5',  sku: 'EV-DC-60',       name: 'NayaxCharge DC 60 kW',    cat: 'EV',         segment: 'EV',                   price: 84500, short: 'Recarga rápida DC para frotas comerciais', monthly: 189.90, stock: 6 },
  { id: 'p6',  sku: 'LAV-MDB-01',     name: 'Kit Lavanderia MDB',      cat: 'Kits',       segment: 'Lavanderia',           price: 2390, badge: 'Combo', short: 'VPOS + Amit configurado para máquinas de lavar', monthly: 59.90, stock: 22, new: true },
  { id: 'p7',  sku: 'SERV-INSTL',     name: 'Instalação técnica',      cat: 'Serviços',   segment: 'Universal',            price: 280,  short: 'Visita de instalação + ativação no campo (até 50 km)', monthly: 0, stock: null, service: true },
  { id: 'p8',  sku: 'SERV-FACTOR',    name: 'Aluguel — Fácil 36',      cat: 'Serviços',   segment: 'Universal',            price: 0, monthlyPrimary: 89.90, short: 'Locação com manutenção inclusa por 36 meses', monthly: 89.90, stock: null, service: true, badge: 'Fácil' },
  { id: 'p9',  sku: 'KIOSK-V1',       name: 'Kiosk Self-checkout',     cat: 'Kiosks',     segment: 'Micromercado',         price: 7490, short: 'Quiosque com leitor de código e gateway integrado', monthly: 79.90, stock: 8 },
  { id: 'p10', sku: 'NYX-CONN-PLUS',  name: 'Plano Conectividade+',    cat: 'Serviços',   segment: 'Universal',            price: 0, monthlyPrimary: 24.90, short: 'SIM 4G + dashboard de telemetria', monthly: 24.90, stock: null, service: true },
  { id: 'p11', sku: 'ARCADE-PAY-NX',  name: 'Arcade Payment Module',   cat: 'Mobilidade', segment: 'Diversão Eletrônica',  price: 6900, short: 'Módulo cashless para fliperamas e parques de diversão', monthly: 39.90, stock: 14, new: true },
  { id: 'p12', sku: 'NYX-ANT-EXT',    name: 'Antena externa 4G',       cat: 'Acessórios', segment: 'Universal',            price: 180,  short: 'Antena de alto ganho para áreas de baixa cobertura', monthly: 0, stock: 200 },
  { id: 'p13', sku: 'NYX-MICRO-KIT',  name: 'Kit Micromercado Pro',    cat: 'Kits',       segment: 'Micromercado',         price: 4290, badge: 'Combo', short: 'VPOS + câmera de auditoria + prateleira inteligente', monthly: 69.90, stock: 18, new: true },
  { id: 'p14', sku: 'NYX-FOOD-POS',   name: 'POS Food Service',        cat: 'Terminais',  segment: 'Food Service',         price: 1990, short: 'Terminal para food trucks, dark kitchens e quiosques', monthly: 59.90, stock: 26 },
];

const FRANCHISES = [
  { code: 'NX-7842', razao: 'Vending Premier Ltda.',         segment: 'Vending Machine',     city: 'São Paulo / SP',     status: 'active',   orders: 24, ltv: 142800, last: '2026-05-22' },
  { code: 'NX-3318', razao: 'EcoMov Estações Elétricas SA',  segment: 'EV',                  city: 'Campinas / SP',      status: 'active',   orders: 9,  ltv: 489000, last: '2026-05-21' },
  { code: 'NX-9021', razao: 'LavaBem Self-service',          segment: 'Lavanderia',          city: 'Curitiba / PR',      status: 'active',   orders: 12, ltv: 38400,  last: '2026-05-25' },
  { code: 'NX-6650', razao: 'ParkArcade Diversões',          segment: 'Diversão Eletrônica', city: 'Belo Horizonte / MG',status: 'active',   orders: 6,  ltv: 76800,  last: '2026-05-18' },
  { code: 'NX-1129', razao: 'Snack Já Distribuidora',        segment: 'Vending Machine',     city: 'Porto Alegre / RS',  status: 'pending',  orders: 0,  ltv: 0,      last: '2026-05-26' },
  { code: 'NX-5577', razao: 'MicroMercado Express SA',       segment: 'Micromercado',        city: 'Recife / PE',        status: 'active',   orders: 18, ltv: 162400, last: '2026-05-24' },
  { code: 'NX-8842', razao: 'Brasil Vending Group SA',       segment: 'Vending Machine',     city: 'Rio de Janeiro / RJ',status: 'active',   orders: 31, ltv: 318900, last: '2026-05-20' },
  { code: 'NX-2204', razao: 'FoodHub Operações',             segment: 'Food Service',        city: 'Florianópolis / SC', status: 'inactive', orders: 3,  ltv: 7200,   last: '2026-04-08' },
];

const ORDERS = [
  { id: '#PD-10428', code: 'NX-7842', razao: 'Vending Premier Ltda.',         total: 8450,  items: 4, status: 'confirmed', when: '2026-05-22T14:32', method: 'Boleto 30d',     contact: 'Marina Reis',         hs: 'synced',  hsDeal: 'HS-DEAL-44821', hsAt: '2026-05-22T14:33' },
  { id: '#PD-10427', code: 'NX-3318', razao: 'EcoMov Estações Elétricas SA',  total: 84500, items: 1, status: 'shipped',   when: '2026-05-21T10:18', method: 'Fatura 60d',    contact: 'Diego Albuquerque',   hs: 'synced',  hsDeal: 'HS-DEAL-44815', hsAt: '2026-05-21T10:20' },
  { id: '#PD-10426', code: 'NX-9021', razao: 'LavaBem Self-service',          total: 2390,  items: 1, status: 'confirmed', when: '2026-05-20T16:55', method: 'Cartão',        contact: 'João Lemos',          hs: 'failed',  hsError: 'CNPJ não encontrado no HubSpot', hsAt: '2026-05-20T16:56' },
  { id: '#PD-10425', code: 'NX-8842', razao: 'Brasil Vending Group SA',       total: 16590, items: 9, status: 'delivered', when: '2026-05-20T09:12', method: 'Boleto 30d',    contact: 'Helena Cardoso',      hs: 'synced',  hsDeal: 'HS-DEAL-44808', hsAt: '2026-05-20T09:13' },
  { id: '#PD-10424', code: 'NX-5577', razao: 'MicroMercado Express SA',       total: 14980, items: 2, status: 'pending',   when: '2026-05-19T15:40', method: 'PIX',           contact: 'Renato Pinto',        hs: 'pending', hsAt: null },
  { id: '#PD-10423', code: 'NX-6650', razao: 'ParkArcade Diversões',          total: 27600, items: 4, status: 'shipped',   when: '2026-05-18T11:30', method: 'Fatura 30d',    contact: 'Bia Martins',         hs: 'synced',  hsDeal: 'HS-DEAL-44794', hsAt: '2026-05-18T11:31' },
  { id: '#PD-10422', code: 'NX-7842', razao: 'Vending Premier Ltda.',         total: 4280,  items: 6, status: 'delivered', when: '2026-05-15T13:22', method: 'Boleto 30d',    contact: 'Marina Reis',         hs: 'failed',  hsError: 'Timeout na API HubSpot (504)', hsAt: '2026-05-15T13:24' },
  { id: '#PD-10421', code: 'NX-1129', razao: 'Snack Já Distribuidora',        total: 1290,  items: 1, status: 'cancelled', when: '2026-05-14T17:01', method: 'Cartão',        contact: 'André Lopes',         hs: 'synced',  hsDeal: 'HS-DEAL-44780', hsAt: '2026-05-14T17:02' },
];

const STATUS_META = {
  confirmed: { label: 'Confirmado', tone: 'green',  desc: 'Pedido aprovado' },
  pending:   { label: 'Aguardando', tone: 'orange', desc: 'Em análise pelo time' },
  shipped:   { label: 'Enviado',    tone: 'blue',   desc: 'A caminho' },
  delivered: { label: 'Entregue',   tone: 'neutral',desc: 'Concluído' },
  cancelled: { label: 'Cancelado',  tone: 'red',    desc: 'Pedido cancelado' },
  active:    { label: 'Ativo',      tone: 'green' },
  inactive:  { label: 'Inativo',    tone: 'neutral' },
};

const HS_PRODUCTS = [
  { sku: 'VM-CFR-2025',    name: 'CoffeeMatic 24',          type: 'Produto',     price: 12800, imported: true,  classify: 'produto' },
  { sku: 'VM-SNK-LARGE',   name: 'SnackMax XL',             type: 'Produto',     price: 8400,  imported: false, classify: null },
  { sku: 'VM-MS-1',        name: 'Mensalidade Suporte',     type: 'Mensalidade', price: 49.90, imported: true,  classify: 'produto' },
  { sku: 'VM-SVC-INSTL',   name: 'Serviço de Instalação',   type: 'service',     price: 280,   imported: true,  classify: 'produto' },
  { sku: 'VM-CFR-PRO',     name: 'CoffeeMatic Pro 36',      type: 'Produto',     price: 18900, imported: false, classify: null },
  { sku: 'VM-BUNDLE-START',name: 'Combo Starter Vending',   type: 'Produto',     price: 2890,  imported: false, classify: 'bundle' },
  { sku: 'VM-SVC-WARR',    name: 'Garantia Estendida 24m',  type: 'Mensalidade', price: 14.90, imported: false, classify: null },
  { sku: 'VM-PAD',         name: 'Suporte para Vending',    type: 'Produto',     price: 320,   imported: false, classify: null },
];

const NAV_CLIENT = [
  { id: 'catalog',  label: 'Catálogo',     icon: 'grid' },
  { id: 'history',  label: 'Pedidos',      icon: 'receipt' },
  { id: 'materials',label: 'Materiais',    icon: 'box' },
  { id: 'support',  label: 'Suporte',      icon: 'help' },
];

const NAV_ADMIN = [
  { id: 'dashboard', label: 'Visão geral',     icon: 'dashboard' },
  { id: 'sales',     label: 'Vendas',          icon: 'receipt' },
  { id: 'dealnayax', label: 'DealNayax',       icon: 'spark' },
  { id: 'clients',   label: 'Franquias',       icon: 'building' },
  { id: 'products',  label: 'Produtos',        icon: 'package' },
  { id: 'bundles',   label: 'Bundles',         icon: 'gift' },
  { id: 'workflows', label: 'Workflows',       icon: 'zap' },
  { id: 'hubspot',   label: 'HubSpot',         icon: 'plug' },
  { id: 'announce',  label: 'Comunicados',     icon: 'bell' },
  { id: 'reports',   label: 'Relatórios',      icon: 'bar-chart' },
  { id: 'audit',     label: 'Auditoria',       icon: 'shield' },
];

const CATEGORIES = ['Todos', 'Produtos', 'Serviços'];

const fmtBRL = (n) => 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtBRLcurt = (n) => {
  if (n >= 1_000_000) return 'R$ ' + (n/1_000_000).toFixed(1).replace('.', ',') + ' M';
  if (n >= 10000) return 'R$ ' + (n/1000).toFixed(0) + ' k';
  if (n >= 1000) return 'R$ ' + (n/1000).toFixed(1).replace('.', ',') + ' k';
  return 'R$ ' + Math.round(n);
};
const fmtDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' · ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
};

Object.assign(window, { PRODUCTS, FRANCHISES, ORDERS, STATUS_META, HS_PRODUCTS, NAV_CLIENT, NAV_ADMIN, CATEGORIES, fmtBRL, fmtBRLcurt, fmtDateTime, fmtDate });
