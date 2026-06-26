/* ════════════════════════════════════════════════════════
   Mock data — realistic Nayax Brasil context
   Marca Nayax (BR) opera pagamentos para mercado autônomo, 
   máquinas de vending, lavanderias, postos de carga EV, etc.
   ════════════════════════════════════════════════════════ */

const PRODUCTS = []; // carregado via API.Products.list()

const FRANCHISES = []; // carregado via API.Clients.list()

const ORDERS = []; // carregado via API.Sales.list()

const STATUS_META = {
  confirmed: { label: 'Confirmado', tone: 'green',  desc: 'Pedido aprovado' },
  pending:   { label: 'Aguardando', tone: 'orange', desc: 'Em análise pelo time' },
  shipped:   { label: 'Enviado',    tone: 'blue',   desc: 'A caminho' },
  delivered: { label: 'Entregue',   tone: 'neutral',desc: 'Concluído' },
  cancelled: { label: 'Cancelado',  tone: 'red',    desc: 'Pedido cancelado' },
  active:    { label: 'Ativo',      tone: 'green' },
  inactive:  { label: 'Inativo',    tone: 'neutral' },
};

const HS_PRODUCTS = []; // carregado via API.HubSpot.getProducts()

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
