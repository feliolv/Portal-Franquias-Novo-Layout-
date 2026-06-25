// ══════════════════════════════════════════
// DATA STORE
// ══════════════════════════════════════════
let DB = {
  clients: [], // carregado do Supabase
  products: [], // carregado do Supabase

  sales: []
};

let nextProductId = 16;
let nextOrderId = 1; // será atualizado pelo loadDB

// ══════════════════════════════════════════
// SCREEN NAV
// ══════════════════════════════════════════


function statusPill(s) {
  const map = { active:'<span class="status-pill active"><span class="status-dot"></span>Ativo</span>', inactive:'<span class="status-pill inactive"><span class="status-dot"></span>Inativo</span>', confirmed:'<span class="status-pill active"><span class="status-dot"></span>Confirmado</span>', pending:'<span class="status-pill pending"><span class="status-dot"></span>Pendente</span>' };
  return map[s] || s;
}
function fmtDate(d) { if (!d) return '—'; const [y,m,dd] = d.split('-'); return `${dd}/${m}/${y}`; }

async function lookupCNPJ(el) {
  const cnpj = (el.value || '').replace(/\D/g, '');
  if (cnpj.length !== 14) return;
  try {
    const res = await fetch('https://publica.cnpj.ws/cnpj/' + cnpj);
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    if (data.razao_social) {
      // Re-busca o elemento no momento exato (modal pode ter re-renderizado)
      const razaoEl = document.getElementById('f-razao');
      if (razaoEl) {
        razaoEl.value = data.razao_social;
        razaoEl.style.borderColor = '#22c55e';
        setTimeout(() => { razaoEl.style.borderColor = ''; }, 2000);
      }
      if (typeof showToast === 'function') showToast('Razão Social preenchida!');
    }
  } catch(e) {
    if (typeof showToast === 'function') showToast('CNPJ não encontrado. Preencha manualmente.');
  }
}

// Pré-preencher dados do franqueado com base em pedido anterior
async function prefillFranchisee(cnpjRaw) {
  var clean = (cnpjRaw||'').replace(/\D/g,'');
  if (clean.length !== 14) return;
  try {
    var rows = await window._dbApi && window._dbApi('GET','/sales?limit=100');
    rows = Array.isArray(rows) ? rows : [];
    var match = rows.filter(function(s){ return s.buyer_cnpj === clean; })
                    .sort(function(a,b){ return new Date(b.created_at)-new Date(a.created_at); });
    if (!match.length) return;
    var d = match[0];
    var filled = 0;
    function setVal(id, val) {
      if (!val) return;
      var el = document.getElementById(id);
      if (el && !el.value) { el.value = val; el.style.borderColor='#22c55e'; setTimeout(function(){ el.style.borderColor=''; },2000); filled++; }
    }
    setVal('f-razao', d.buyer_razao_social); setVal('f-nome', d.buyer_nome);
    setVal('f-sobrenome', d.buyer_sobrenome); setVal('f-cpf', d.buyer_cpf);
    setVal('f-nasc', d.buyer_nascimento);     setVal('f-email', d.buyer_email);
    setVal('f-tel', d.buyer_telefone);        setVal('f-cep', d.buyer_cep);
    setVal('f-rua', d.buyer_rua);             setVal('f-num', d.buyer_numero);
    setVal('f-comp', d.buyer_complemento);    setVal('f-bairro', d.buyer_bairro);
    setVal('f-cidade', d.buyer_cidade);
    if (d.buyer_uf) { var ufEl=document.getElementById('f-uf'); if(ufEl&&!ufEl.value){ ufEl.value=d.buyer_uf; filled++; } }
    if (filled > 0 && typeof showToast==='function') showToast('Dados do franqueado preenchidos automaticamente!');
  } catch(e) { console.warn('[prefill]', e.message); }
}

function maskCNPJ(el) {
  let v = el.value.replace(/\D/g,'').substring(0,14);
  v = v.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1/$2').replace(/(\d{4})(\d)/,'$1-$2');
  el.value = v;
  // Busca CNPJ automaticamente ao completar 14 dígitos
  if (el.value.replace(/\D/g,'').length === 14) { lookupCNPJ(el); prefillFranchisee(el.value); }
}
function maskCPF(el) {
  let v = el.value.replace(/\D/g,'').substring(0,11);
  v = v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4');
  el.value = v;
}
function maskTel(el) {
  let v = el.value.replace(/\D/g,'').substring(0,11);
  if (v.length <= 10) v = v.replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{4})(\d)/,'$1-$2');
  else v = v.replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2');
  el.value = v;
}
function maskCEP(el) {
  let v = el.value.replace(/\D/g,'').substring(0,8);
  if (v.length > 5) v = v.replace(/(\d{5})(\d)/,'$1-$2');
  el.value = v;
}
function fetchCEP(cep) {
  const clean = cep.replace(/\D/g,'');
  if (clean.length !== 8) return;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://viacep.com.br/ws/' + clean + '/json/', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const d = JSON.parse(xhr.responseText);
        if (!d.erro) {
          const set = (id, val) => { const el = document.getElementById(id); if(el && val) el.value = val; };
          set('f-rua',    d.logradouro);
          set('f-bairro', d.bairro);
          set('f-cidade', d.localidade);
          if (d.uf) { const el = document.getElementById('f-uf'); if(el) el.value = d.uf; }
          showToast(t('cep.filled'));
        }
      } catch(e) {}
    }
  };
  xhr.send();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ══════════════════════════════════════════
// I18N — TRANSLATIONS
// ══════════════════════════════════════════
const TRANSLATIONS = {
  pt: {
    // Login
    'login.headline': 'Catálogo de Vendas<br><span>Exclusivo</span>',
    'login.tagline': 'Acesse preços e condições especiais negociadas para a sua conta de franquia.',
    'login.f1': 'Preços individualizados por cliente',
    'login.f2': 'Catálogo completo de produtos e serviços',
    'login.f3': 'Pedido com aprovação em até 2h úteis',
    'login.cardTitle': 'Acesse seu catálogo',
    'login.cardDesc': 'Digite o código do cliente para continuar.',
    'login.error': 'Código não encontrado. Verifique e tente novamente.',
        'login.codePlaceholder': 'Código da Franquia',
    'login.pwPlaceholder': 'Senha de acesso',
    'adminLogin.emailPlaceholder': 'E-mail',
    'adminLogin.pwPlaceholder': 'Senha de acesso',
    'login.codeLabel': 'Código do cliente',
    'login.btn': 'Acessar Portal',
    'login.adminLink': ' Acesso administrativo',
    // Admin login
    'adminLogin.title': 'PAINEL ADMINISTRATIVO',
    'adminLogin.desc': 'Use seu e-mail e senha para entrar.',
    'adminLogin.btn': 'Entrar',
    'adminLogin.back': '← Voltar ao portal de clientes',
    'adminLogin.emailLabel': 'E-mail',
    'adminLogin.passwordLabel': 'Senha',
    // Catalog sidebar
    'cat.all': 'Todos',
    'cat.products': 'Produtos',
    'cat.services': 'Serviços',
    'cat.order': 'Pedido',
    'cat.viewOrder': 'Ver pedido',
    'cat.logout': 'Sair do portal',
    'cat.authClient': 'Cliente autenticado',
    'cat.title': 'Catálogo de Vendas',
    'cat.eyebrow': 'Portal exclusivo',
    'cat.heroTitle': 'Catálogo Personalizado',
    'cat.heroSub': 'Preços com condições especiais para sua conta.',
    'cat.availableProducts': 'Produtos disponíveis',
    'cat.filterAll': 'Todos',
    'cat.filterProducts': 'Produtos',
    'cat.filterServices': 'Serviços',
    // Checkout
    'checkout.title': 'Dados do Pedido',
    'checkout.franchiseeData': 'Dados do Franqueado',
    'checkout.addressData': 'Endereço de Entrega',
    'checkout.razao': 'Razão Social *',
    'checkout.cnpj': 'CNPJ *',
    'checkout.nome': 'Nome *',
    'checkout.sobrenome': 'Sobrenome *',
    'checkout.cpf': 'CPF *',
    'checkout.nasc': 'Data de Nascimento *',
    'checkout.email': 'E-mail *',
    'checkout.tel': 'Telefone / WhatsApp *',
    'checkout.cep': 'CEP *',
    'checkout.rua': 'Rua *',
    'checkout.num': 'Número *',
    'checkout.comp': 'Complemento',
    'checkout.bairro': 'Bairro *',
    'checkout.cidade': 'Cidade *',
    'checkout.uf': 'Estado *',
    'checkout.confirm': 'Confirmar Pedido',
    'checkout.cancel': 'Cancelar',
    'checkout.summary': 'Resumo do Pedido',
    // Confirmed modal
    'confirmed.title': 'Pedido enviado!',
    'confirmed.close': 'Fechar',
    'confirmed.newOrder': 'Nova compra',
    'confirmed.logout': 'Sair',
    // Admin panel
    'admin.dashboard': 'Dashboard',
    'admin.clients': 'Clientes',
    'admin.products': 'Produtos',
    'admin.sales': 'Vendas',
    'admin.ranking': 'Ranking',
        'admin.bundles': 'Bundles',
    'admin.hsProdutos': 'HS Produtos',
    'admin.integracoes': 'Integrações',
    'admin.team': 'Equipe',
    'admin.logout': 'Sair',
    'admin.panel': 'PAINEL ADMINISTRATIVO',
    'admin.dashTitle': 'Dashboard',
    'admin.dashSub': 'Visão geral do portal de vendas',
    'admin.clientsTitle': 'Clientes',
    'admin.clientsSub': 'Gerencie os clientes e seus acessos ao portal',
    'admin.productsTitle': 'Produtos',
    'admin.productsSub': 'Edite o catálogo e informações dos produtos',
    'admin.salesTitle': 'Vendas',
    'admin.salesSub': 'Acompanhe os pedidos recebidos pelo portal',
    'admin.rankingTitle': 'Ranking de Clientes',
    'admin.rankingSub': 'Clientes ordenados por retorno financeiro e volume de pedidos',
    'admin.teamTitle': 'Equipe',
    'admin.teamSub': 'Gerencie os usuários com acesso ao painel',
        'admin.totalClients': 'Total de clientes',
    'admin.totalProducts': 'Total de produtos',
    'admin.ordersReceived': 'Pedidos recebidos',
    'admin.totalVolume': 'Volume total',
    'admin.totalVolumeAll': 'Volume total geral',
    'admin.totalOrders': 'Total de pedidos',
    'admin.topClient': 'Melhor cliente',
    'admin.avgTicket': 'Ticket médio',
    'admin.chartVolume': 'Volume de vendas no tempo',
    'admin.chartSegment': 'Pedidos por segmento',
    'admin.topProducts': 'Top produtos',
    'admin.editClient': 'Editar cliente',
    'admin.newClientModal': 'Novo cliente',
    'admin.editProduct': 'Editar produto',
    'admin.newProductModal': 'Novo produto',
    'admin.integracoesSub': 'Gerencie os tokens e conexões com sistemas externos',
    'admin.salesSub': 'Consulte e acompanhe as vendas por cliente',
    'th.client': 'Cliente',
    'th.date': 'Data',
    'th.total': 'Total',
    'th.franchise': 'Franquia',
    'th.email': 'E-mail',
    'th.profile': 'Perfil',
    'th.lastAccess': 'Último acesso',
    'admin.lastSales': 'Últimas vendas',
    'admin.newClient': '+ Novo cliente',
    'admin.newProduct': '+ Novo produto',
    'admin.newMember': '+ Novo membro',
    // Table headers
    'th.code': 'Código',
    'th.company': 'Razão Social',
    'th.segment': 'Segmento',
    'th.visibleProducts': 'Produtos visíveis',
    'th.status': 'Status',
    'th.actions': 'Ações',
    'th.name': 'Nome',
    'th.sku': 'SKU',
    'th.category': 'Categoria',
    'th.basePrice': 'Preço base',
    'th.order': 'Nº Pedido',
    'th.client': 'Cliente',
    'th.date': 'Data',
    'th.items': 'Produtos',
    'th.total': 'Total',
    'th.email': 'E-mail',
    'th.role': 'Perfil',
    'th.lastAccess': 'Último acesso',
    // Buttons
    'btn.edit': 'Editar',
    'btn.delete': 'Excluir',
    'btn.save': 'Salvar',
    // Catálogo — chaves faltantes
    'cat.clearCart': 'Limpar carrinho',
    'cat.allItems': 'TODOS OS ITENS',
    'cat.totalLabel': 'Total do pedido',
    'checkout.modalTitle': 'Finalizar pedido',
    'checkout.step1Label': 'Dados da Empresa',
    'checkout.step2Label': 'Dados do Responsável',
    'checkout.step3Label': 'Endereço de Entrega',
    'checkout.step4Label': 'Confirmar Pedido',
    'empty.sales': 'Nenhum pedido encontrado',
    'empty.salesSub': 'Tente ajustar os filtros ou aguarde novos pedidos',
    'empty.clients': 'Nenhum cliente cadastrado',
    'empty.clientsSub': 'Adicione o primeiro cliente ao portal',
    'empty.products': 'Nenhum produto encontrado',
    'empty.productsSub': 'Adicione produtos ao catálogo',
    'cat.addToCart': 'Adicionar ao pedido',
    'cat.sendOrder': 'Enviar pedido',
    'cat.continue': 'Continuar',
    'cat.new': 'Novo',
    'cat.filterTodos': 'Todos',
    'cat.filterProdutos': 'Produtos',
    'cat.filterServiços': 'Serviços',
    'cat.searchPlaceholder': 'Buscar produto...',
    'cat.itemCount': 'itens',
    'cat.unitAbbr': 'un.',
    'cat.cartTitle': 'Pedido atual',
    'cat.emptyCart': 'Nenhum item adicionado',
    'cat.totalLabel': 'Total do pedido',
    'checkout.step1': 'Empresa',
    'checkout.step2': 'Responsável',
    'checkout.step3': 'Endereço',
    'checkout.step4': 'Confirmar',
    'checkout.stepOf': 'Etapa',
    'checkout.of': 'de',
    'btn.cancel': 'Cancelar',
    'btn.confirm': 'Confirmar',
    'btn.view': 'Ver',
    'btn.pending': 'Pendente',
    // Charts
    'chart.daily': 'Pedidos por dia',
    'chart.products': 'Produtos mais vendidos',
    'chart.clients': 'Volume por cliente (R$)',
    'chart.status': 'Status dos pedidos',
    // Filters
    'filter.today': 'Hoje',
    'filter.yesterday': 'Ontem',
    'filter.week': 'Esta semana',
    'filter.month': 'Este mês',
    'filter.3m': '3 meses',
    'filter.all': 'Tudo',
    'filter.custom': 'Personalizado',
    'filter.period': 'Período:',
    'filter.allClients': 'Todos os clientes',
    // Ranking
    'rank.byVolume': 'Por volume (R$)',
    'rank.byOrders': 'Por pedidos',
    'rank.byItems': 'Por itens vendidos',
    // Forms
    'form.tel': 'Telefone / WhatsApp *',
    // System
    'cep.filled': 'Endereço preenchido pelo CEP!',
    'confirm.deleteProduct': 'Excluir este produto?',
    'confirm.deleteClient': 'Excluir este cliente?',
    'confirm.deleteSale': 'Excluir este pedido?',
    'confirm.deleteMember': 'Excluir este membro?',
    'toast.productDeleted': 'Produto removido.',
    'toast.clientSaved': 'Cliente salvo com sucesso!',
    'toast.productSaved': 'Produto salvo com sucesso!',
  },
  en: {
    'login.headline': 'Exclusive Sales<br><span>Catalog</span>',
    'login.tagline': 'Access special prices and conditions negotiated for your franchise account.',
    'login.f1': 'Individualized prices per client',
    'login.f2': 'Full catalog of products and services',
    'login.f3': 'Orders approved within 2 business hours',
    'login.cardTitle': 'Access your catalog',
    'login.cardDesc': 'Enter your client code to continue.',
    'login.error': 'Code not found. Please verify and try again.',
        'login.codePlaceholder': 'Franchise Code',
    'login.pwPlaceholder': 'Access password',
    'adminLogin.emailPlaceholder': 'Email',
    'adminLogin.pwPlaceholder': 'Password',
    'login.codeLabel': 'Client code',
    'login.btn': 'Enter Portal',
    'login.adminLink': '⚙ Admin access',
    'adminLogin.title': 'Admin Panel',
    'adminLogin.desc': 'Use your email and password to sign in.',
    'adminLogin.btn': 'Sign in',
    'adminLogin.back': '← Back to client portal',
    'adminLogin.emailLabel': 'Email',
    'adminLogin.passwordLabel': 'Password',
    'cat.all': 'All',
    'cat.products': 'Products',
    'cat.services': 'Services',
    'cat.order': 'Order',
    'cat.viewOrder': 'View order',
    'cat.logout': 'Sign out',
    'cat.authClient': 'Authenticated client',
    'cat.title': 'Sales Catalog',
    'cat.eyebrow': 'Exclusive portal',
    'cat.heroTitle': 'Personalized Catalog',
    'cat.heroSub': 'Special pricing conditions for your account.',
    'cat.availableProducts': 'Available products',
    'cat.filterAll': 'All',
    'cat.filterProducts': 'Products',
    'cat.filterServices': 'Services',
    'checkout.title': 'Order Details',
    'checkout.franchiseeData': 'Franchisee Data',
    'checkout.addressData': 'Delivery Address',
    'checkout.razao': 'Company Name *',
    'checkout.cnpj': 'CNPJ *',
    'checkout.nome': 'First Name *',
    'checkout.sobrenome': 'Last Name *',
    'checkout.cpf': 'CPF *',
    'checkout.nasc': 'Date of Birth *',
    'checkout.email': 'Email *',
    'checkout.tel': 'Phone / WhatsApp *',
    'checkout.cep': 'ZIP Code *',
    'checkout.rua': 'Street *',
    'checkout.num': 'Number *',
    'checkout.comp': 'Complement',
    'checkout.bairro': 'Neighborhood *',
    'checkout.cidade': 'City *',
    'checkout.uf': 'State *',
    'checkout.confirm': 'Confirm Order',
    'checkout.cancel': 'Cancel',
    'checkout.summary': 'Order Summary',
    'confirmed.title': 'Order sent!',
    'confirmed.close': 'Close',
    'confirmed.newOrder': 'New purchase',
    'confirmed.logout': 'Sign out',
    'admin.dashboard': 'Dashboard',
    'admin.clients': 'Clients',
    'admin.products': 'Products',
    'admin.sales': 'Sales',
    'admin.ranking': 'Ranking',
        'admin.bundles': 'Bundles',
    'admin.hsProdutos': 'HS Products',
    'admin.integracoes': 'Integrations',
    'admin.team': 'Team',
    'admin.logout': 'Sign out',
    'admin.panel': 'Admin Panel',
    'admin.dashTitle': 'Dashboard',
    'admin.dashSub': 'Sales portal overview',
    'admin.clientsTitle': 'Clients',
    'admin.clientsSub': 'Manage clients and their portal access',
    'admin.productsTitle': 'Products',
    'admin.productsSub': 'Edit catalog and product information',
    'admin.salesTitle': 'Sales',
    'admin.salesSub': 'Track orders received through the portal',
    'admin.rankingTitle': 'Client Ranking',
    'admin.rankingSub': 'Clients ranked by revenue and order volume',
    'admin.teamTitle': 'Team',
    'admin.teamSub': 'Manage users with panel access',
        'admin.totalClients': 'Total clients',
    'admin.totalProducts': 'Total products',
    'admin.ordersReceived': 'Orders received',
    'admin.totalVolume': 'Total volume',
    'admin.totalVolumeAll': 'Overall volume',
    'admin.totalOrders': 'Total orders',
    'admin.topClient': 'Top client',
    'admin.avgTicket': 'Avg ticket',
    'admin.chartVolume': 'Sales volume over time',
    'admin.chartSegment': 'Orders by segment',
    'admin.topProducts': 'Top products',
    'admin.editClient': 'Edit client',
    'admin.newClientModal': 'New client',
    'admin.editProduct': 'Edit product',
    'admin.newProductModal': 'New product',
    'admin.integracoesSub': 'Manage tokens and external system connections',
    'admin.salesSub': 'View and track sales by client',
    'th.client': 'Client',
    'th.date': 'Date',
    'th.total': 'Total',
    'th.franchise': 'Franchise',
    'th.email': 'Email',
    'th.profile': 'Profile',
    'th.lastAccess': 'Last access',
    'admin.lastSales': 'Latest sales',
    'admin.newClient': '+ New client',
    'admin.newProduct': '+ New product',
    'admin.newMember': '+ New member',
    'th.code': 'Code',
    'th.company': 'Company',
    'th.segment': 'Segment',
    'th.visibleProducts': 'Visible products',
    'th.status': 'Status',
    'th.actions': 'Actions',
    'th.name': 'Name',
    'th.sku': 'SKU',
    'th.category': 'Category',
    'th.basePrice': 'Base price',
    'th.order': 'Order #',
    'th.client': 'Client',
    'th.date': 'Date',
    'th.items': 'Products',
    'th.total': 'Total',
    'th.email': 'Email',
    'th.role': 'Role',
    'th.lastAccess': 'Last access',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.save': 'Save',
    // Catalog — missing keys
    'cat.clearCart': 'Clear cart',
    'cat.allItems': 'ALL ITEMS',
    'cat.totalLabel': 'Order total',
    'checkout.modalTitle': 'Checkout',
    'checkout.step1Label': 'Company Data',
    'checkout.step2Label': 'Responsible Data',
    'checkout.step3Label': 'Delivery Address',
    'checkout.step4Label': 'Confirm Order',
    'empty.sales': 'No orders found',
    'empty.salesSub': 'Try adjusting the filters or wait for new orders',
    'empty.clients': 'No clients registered',
    'empty.clientsSub': 'Add the first client to the portal',
    'empty.products': 'No products found',
    'empty.productsSub': 'Add products to the catalog',
    'cat.addToCart': 'Add to order',
    'cat.sendOrder': 'Send order',
    'cat.continue': 'Continue',
    'cat.new': 'New',
    'cat.filterTodos': 'All',
    'cat.filterProdutos': 'Products',
    'cat.filterServiços': 'Services',
    'cat.searchPlaceholder': 'Search product...',
    'cat.itemCount': 'items',
    'cat.unitAbbr': 'un.',
    'cat.cartTitle': 'Current order',
    'cat.emptyCart': 'No items added',
    'cat.totalLabel': 'Order total',
    'checkout.step1': 'Company',
    'checkout.step2': 'Responsible',
    'checkout.step3': 'Address',
    'checkout.step4': 'Confirm',
    'checkout.stepOf': 'Step',
    'checkout.of': 'of',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',
    'btn.view': 'View',
    'btn.pending': 'Pending',
    'chart.daily': 'Orders per day',
    'chart.products': 'Top sold products',
    'chart.clients': 'Volume per client (R$)',
    'chart.status': 'Order status',
    'filter.today': 'Today',
    'filter.yesterday': 'Yesterday',
    'filter.week': 'This week',
    'filter.month': 'This month',
    'filter.3m': '3 months',
    'filter.all': 'All',
    'filter.custom': 'Custom',
    'filter.period': 'Period:',
    'filter.allClients': 'All clients',
    'rank.byVolume': 'By volume (R$)',
    'rank.byOrders': 'By orders',
    'rank.byItems': 'By items sold',
    'form.tel': 'Phone / WhatsApp *',
    'cep.filled': 'Address filled by ZIP code!',
    'confirm.deleteProduct': 'Delete this product?',
    'confirm.deleteClient': 'Delete this client?',
    'confirm.deleteSale': 'Delete this order?',
    'confirm.deleteMember': 'Delete this member?',
    'toast.productDeleted': 'Product removed.',
    'toast.clientSaved': 'Client saved successfully!',
    'toast.productSaved': 'Product saved successfully!',
  },
  es: {
    'login.headline': 'Catálogo de Ventas<br><span>Exclusivo</span>',
    'login.tagline': 'Acceda a precios y condiciones especiales negociadas para su cuenta de franquicia.',
    'login.f1': 'Precios individualizados por cliente',
    'login.f2': 'Catálogo completo de productos y servicios',
    'login.f3': 'Pedido aprobado en hasta 2 horas hábiles',
    'login.cardTitle': 'Acceda a su catálogo',
    'login.cardDesc': 'Ingrese el código del cliente para continuar.',
    'login.error': 'Código no encontrado. Verifique e intente nuevamente.',
        'login.codePlaceholder': 'Código de Franquicia',
    'login.pwPlaceholder': 'Contraseña de acceso',
    'adminLogin.emailPlaceholder': 'Correo electrónico',
    'adminLogin.pwPlaceholder': 'Contraseña',
    'login.codeLabel': 'Código del cliente',
    'login.btn': 'Entrar al Portal',
    'login.adminLink': '⚙ Acceso administrativo',
    'adminLogin.title': 'Panel Administrativo',
    'adminLogin.desc': 'Use su correo y contraseña para ingresar.',
    'adminLogin.btn': 'Ingresar',
    'adminLogin.back': '← Volver al portal de clientes',
    'adminLogin.emailLabel': 'Correo',
    'adminLogin.passwordLabel': 'Contraseña',
    'cat.all': 'Todos',
    'cat.products': 'Productos',
    'cat.services': 'Servicios',
    'cat.order': 'Pedido',
    'cat.viewOrder': 'Ver pedido',
    'cat.logout': 'Salir del portal',
    'cat.authClient': 'Cliente autenticado',
    'cat.title': 'Catálogo de Ventas',
    'cat.eyebrow': 'Portal exclusivo',
    'cat.heroTitle': 'Catálogo Personalizado',
    'cat.heroSub': 'Precios con condiciones especiales para su cuenta.',
    'cat.availableProducts': 'Productos disponibles',
    'cat.filterAll': 'Todos',
    'cat.filterProducts': 'Productos',
    'cat.filterServices': 'Servicios',
    'checkout.title': 'Datos del Pedido',
    'checkout.franchiseeData': 'Datos del Franquiciado',
    'checkout.addressData': 'Dirección de Entrega',
    'checkout.razao': 'Razón Social *',
    'checkout.cnpj': 'CNPJ *',
    'checkout.nome': 'Nombre *',
    'checkout.sobrenome': 'Apellido *',
    'checkout.cpf': 'CPF *',
    'checkout.nasc': 'Fecha de Nacimiento *',
    'checkout.email': 'Correo *',
    'checkout.tel': 'Teléfono / WhatsApp *',
    'checkout.cep': 'Código Postal *',
    'checkout.rua': 'Calle *',
    'checkout.num': 'Número *',
    'checkout.comp': 'Complemento',
    'checkout.bairro': 'Barrio *',
    'checkout.cidade': 'Ciudad *',
    'checkout.uf': 'Estado *',
    'checkout.confirm': 'Confirmar Pedido',
    'checkout.cancel': 'Cancelar',
    'checkout.summary': 'Resumen del Pedido',
    'confirmed.title': '¡Pedido enviado!',
    'confirmed.close': 'Cerrar',
    'confirmed.newOrder': 'Nueva compra',
    'confirmed.logout': 'Salir',
    'admin.dashboard': 'Dashboard',
    'admin.clients': 'Clientes',
    'admin.products': 'Productos',
    'admin.sales': 'Ventas',
    'admin.ranking': 'Ranking',
        'admin.bundles': 'Bundles',
    'admin.hsProdutos': 'HS Productos',
    'admin.integracoes': 'Integraciones',
    'admin.team': 'Equipo',
    'admin.logout': 'Salir',
    'admin.panel': 'Panel Administrativo',
    'admin.dashTitle': 'Dashboard',
    'admin.dashSub': 'Resumen general del portal de ventas',
    'admin.clientsTitle': 'Clientes',
    'admin.clientsSub': 'Administre los clientes y sus accesos al portal',
    'admin.productsTitle': 'Productos',
    'admin.productsSub': 'Edite el catálogo e información de productos',
    'admin.salesTitle': 'Ventas',
    'admin.salesSub': 'Siga los pedidos recibidos por el portal',
    'admin.rankingTitle': 'Ranking de Clientes',
    'admin.rankingSub': 'Clientes ordenados por volumen y pedidos',
    'admin.teamTitle': 'Equipo',
    'admin.teamSub': 'Administre los usuarios con acceso al panel',
        'admin.totalClients': 'Total de clientes',
    'admin.totalProducts': 'Total de productos',
    'admin.ordersReceived': 'Pedidos recibidos',
    'admin.totalVolume': 'Volumen total',
    'admin.totalVolumeAll': 'Volumen total general',
    'admin.totalOrders': 'Total de pedidos',
    'admin.topClient': 'Mejor cliente',
    'admin.avgTicket': 'Ticket promedio',
    'admin.chartVolume': 'Volumen de ventas',
    'admin.chartSegment': 'Pedidos por segmento',
    'admin.topProducts': 'Top productos',
    'admin.editClient': 'Editar cliente',
    'admin.newClientModal': 'Nuevo cliente',
    'admin.editProduct': 'Editar producto',
    'admin.newProductModal': 'Nuevo producto',
    'admin.integracoesSub': 'Gestione tokens y conexiones con sistemas externos',
    'admin.salesSub': 'Consulte y siga las ventas por cliente',
    'th.client': 'Cliente',
    'th.date': 'Fecha',
    'th.total': 'Total',
    'th.franchise': 'Franquicia',
    'th.email': 'Correo',
    'th.profile': 'Perfil',
    'th.lastAccess': 'Último acceso',
    'admin.lastSales': 'Últimas ventas',
    'admin.newClient': '+ Nuevo cliente',
    'admin.newProduct': '+ Nuevo producto',
    'admin.newMember': '+ Nuevo miembro',
    'th.code': 'Código',
    'th.company': 'Empresa',
    'th.segment': 'Segmento',
    'th.visibleProducts': 'Productos visibles',
    'th.status': 'Estado',
    'th.actions': 'Acciones',
    'th.name': 'Nombre',
    'th.sku': 'SKU',
    'th.category': 'Categoría',
    'th.basePrice': 'Precio base',
    'th.order': 'Nº Pedido',
    'th.client': 'Cliente',
    'th.date': 'Fecha',
    'th.items': 'Productos',
    'th.total': 'Total',
    'th.email': 'Correo',
    'th.role': 'Perfil',
    'th.lastAccess': 'Último acceso',
    'btn.edit': 'Editar',
    'btn.delete': 'Eliminar',
    'btn.save': 'Guardar',
    'cat.clearCart': 'Vaciar carrito',
    'cat.allItems': 'TODOS LOS ITEMS',
    'cat.totalLabel': 'Total del pedido',
    'checkout.modalTitle': 'Finalizar pedido',
    'checkout.step1Label': 'Datos de la Empresa',
    'checkout.step2Label': 'Datos del Responsable',
    'checkout.step3Label': 'Dirección de Entrega',
    'checkout.step4Label': 'Confirmar Pedido',
    'empty.sales': 'No se encontraron pedidos',
    'empty.salesSub': 'Intente ajustar los filtros o espere nuevos pedidos',
    'empty.clients': 'No hay clientes registrados',
    'empty.clientsSub': 'Agregue el primer cliente al portal',
    'empty.products': 'No se encontraron productos',
    'empty.productsSub': 'Agregue productos al catálogo',
    'cat.addToCart': 'Agregar al pedido',
    'cat.sendOrder': 'Enviar pedido',
    'cat.continue': 'Continuar',
    'cat.new': 'Nuevo',
    'cat.filterTodos': 'Todos',
    'cat.filterProdutos': 'Productos',
    'cat.filterServiços': 'Servicios',
    'cat.searchPlaceholder': 'Buscar producto...',
    'checkout.step1': 'Empresa',
    'checkout.step2': 'Responsable',
    'checkout.step3': 'Dirección',
    'checkout.step4': 'Confirmar',
    'btn.cancel': 'Cancelar',
    'btn.confirm': 'Confirmar',
    'btn.view': 'Ver',
    'btn.pending': 'Pendiente',
    'chart.daily': 'Pedidos por día',
    'chart.products': 'Productos más vendidos',
    'chart.clients': 'Volumen por cliente (R$)',
    'chart.status': 'Estado de pedidos',
    'filter.today': 'Hoy',
    'filter.yesterday': 'Ayer',
    'filter.week': 'Esta semana',
    'filter.month': 'Este mes',
    'filter.3m': '3 meses',
    'filter.all': 'Todo',
    'filter.custom': 'Personalizado',
    'filter.period': 'Período:',
    'filter.allClients': 'Todos los clientes',
    'rank.byVolume': 'Por volumen (R$)',
    'rank.byOrders': 'Por pedidos',
    'rank.byItems': 'Por ítems vendidos',
    'form.tel': 'Teléfono / WhatsApp *',
    'cep.filled': '¡Dirección completada por CEP!',
    'confirm.deleteProduct': '¿Eliminar este producto?',
    'confirm.deleteClient': '¿Eliminar este cliente?',
    'confirm.deleteSale': '¿Eliminar este pedido?',
    'confirm.deleteMember': '¿Eliminar este miembro?',
    'toast.productDeleted': 'Producto eliminado.',
    'toast.clientSaved': '¡Cliente guardado con éxito!',
    'toast.productSaved': '¡Producto guardado con éxito!',
  }
};

let currentLang = 'pt';



function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS['pt'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  // Sync all language selectors across all screens
  document.querySelectorAll('.lang-selector').forEach(el => { el.value = lang; });
  // Translate all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val && val.includes('<')) el.innerHTML = val;
    else if (val) el.textContent = val;
  });
  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.placeholder = val;
  });
  // Re-render dynamic tables so translated text appears (only if admin screen is visible)
  if (window._adminReady) {
    if (typeof renderClientsTable === 'function') renderClientsTable();
    if (typeof renderProductsTable === 'function') renderProductsTable();
    if (typeof renderSalesTable === 'function') renderSalesTable();
    if (typeof renderTeamTable === 'function') renderTeamTable();
    if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
  }
  // Re-render catalog products so translated buttons appear
  if (typeof renderCurrentProducts === 'function') {
    renderCurrentProducts();
  } else if (typeof renderProducts === 'function' && typeof DB !== 'undefined' && DB.products && window._currentClient) {
    const visProds = DB.products.filter(p =>
      p.status === 'active' &&
      window._currentClient.visibleProducts &&
      window._currentClient.visibleProducts.includes(p.id)
    );
    if (visProds.length > 0) renderProducts(visProds);
  }
  // Re-render cart dock labels
  if (typeof updateCartUI === 'function') updateCartUI();
  // Re-render stepper do checkout
  if (typeof coRenderStepper === 'function') coRenderStepper();
  // Atualizar textos dinâmicos da sidebar do catálogo
  const sidebarTitle = document.querySelector('.sidebar .cart-title, #nav-cart-item .cart-label');
  if (sidebarTitle) sidebarTitle.textContent = t('cat.cartTitle') || 'Pedido atual';
}

window.onload = () => {
  document.getElementById('input-code')?.focus();
  setLang('pt');
};

// ══════════════════════════════════════════
// DASHBOARD CHARTS
// ══════════════════════════════════════════
let chartInstances = {};
let dashDateFilter = 'all';

function setDashFilter(filter, el) {
  dashDateFilter = filter;
  document.querySelectorAll('[id^="df-"]').forEach(b => { if(b.tagName==='BUTTON') b.className='btn-sm ghost'; });
  if(el) el.className = 'btn-sm yellow';
  const cw = document.getElementById('df-custom-wrap');
  if(cw) cw.style.display = filter==='custom' ? 'flex' : 'none';
  renderDashCharts();
}

function getDashDateRange() {
  const now = new Date(); now.setHours(0,0,0,0);
  const today = now.toISOString().split('T')[0];
  if (dashDateFilter === 'today') return [today, today];
  if (dashDateFilter === 'yesterday') { const y=new Date(now); y.setDate(y.getDate()-1); const ys=y.toISOString().split('T')[0]; return [ys,ys]; }
  if (dashDateFilter === 'week') { const w=new Date(now); w.setDate(w.getDate()-w.getDay()); return [w.toISOString().split('T')[0], today]; }
  if (dashDateFilter === 'month') return [today.slice(0,7)+'-01', today];
  if (dashDateFilter === '3months') { const m=new Date(now); m.setMonth(m.getMonth()-3); return [m.toISOString().split('T')[0], today]; }
  if (dashDateFilter === 'custom') { const f=document.getElementById('df-from')?.value; const t=document.getElementById('df-to')?.value; if(f&&t) return [f,t]; }
  return [null, null];
}

function filterSalesDash(sales) {
  const [from, to] = getDashDateRange();
  if (!from || !to) return sales;
  return sales.filter(s => s.date >= from && s.date <= to);
}

const CHART_DEFAULTS = {
  responsive: true,
  animation: { duration: 600, easing: 'easeOutQuart' },
  plugins: {
    tooltip: {
      enabled: true,
      backgroundColor: '#1A1A1A',
      titleColor: '#FFC700',
      bodyColor: '#FFFFFF',
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {}
    },
    legend: { display: false }
  }
};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

function _renderDashChartsLegacy() {
  const filtSales = filterSalesDash(DB.sales);

  // 1. Pedidos por dia (últimos 14 dias ou filtro)
  const days = [], dayCounts = [], dayTotals = [];
  const [dfrom, dto] = getDashDateRange();
  const numDays = (dfrom && dto) ? Math.min(Math.ceil((new Date(dto)-new Date(dfrom))/(86400000))+1, 30) : 14;
  for (let i = numDays-1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate()-i); d.setHours(0,0,0,0);
    const ds = d.toISOString().split('T')[0];
    const daySales = filtSales.filter(s => s.date === ds);
    days.push(fmtDate(ds));
    dayCounts.push(daySales.length);
    dayTotals.push(daySales.reduce((s,sale)=>s+sale.items.reduce((ss,i)=>ss+i.price*i.qty,0),0));
  }
  destroyChart('chart-daily');
  const c1 = document.getElementById('chart-daily');
  if (c1) {
    chartInstances['chart-daily'] = new Chart(c1, {
      type: 'bar',
      data: { labels: days, datasets: [
        { label: 'Pedidos', data: dayCounts, backgroundColor: '#FFC700', borderRadius: 6, borderSkipped: false, yAxisID: 'y' },
        { label: 'Volume R$', data: dayTotals, type: 'line', borderColor: '#1A1A1A', backgroundColor: 'rgba(26,26,26,0.08)', pointBackgroundColor: '#1A1A1A', tension: 0.4, yAxisID: 'y2', pointRadius: 4, pointHoverRadius: 7 }
      ]},
      options: { ...CHART_DEFAULTS,
        plugins: { ...CHART_DEFAULTS.plugins, legend: { display: true, position: 'top', labels: { font: {size:11}, padding:12 } },
          tooltip: { ...CHART_DEFAULTS.plugins.tooltip,
            callbacks: { label: ctx => ctx.datasetIndex===0 ? ctx.parsed.y+' pedido(s)' : 'R$ '+ctx.parsed.y.toLocaleString('pt-BR') }
          }
        },
        scales: { y: { beginAtZero:true, ticks:{stepSize:1}, grid:{color:'rgba(0,0,0,0.05)'} }, y2: { position:'right', beginAtZero:true, grid:{display:false}, ticks:{callback:v=>'R$'+Math.round(v/1000)+'k'} }, x: { grid:{display:false} } }
      }
    });
  }

  // 2. Produtos mais vendidos (top 5)
  const prodQty = {};
  filtSales.forEach(s => s.items.forEach(i => { prodQty[i.productId] = (prodQty[i.productId] || 0) + i.qty; }));
  const topProds = Object.entries(prodQty).sort((a,b) => b[1]-a[1]).slice(0,5);
  const prodLabels = topProds.map(([id]) => { const p = DB.products.find(x => x.id == id); return p ? p.name.split(' ').slice(0,3).join(' ') : 'Produto'; });
  const prodVals = topProds.map(([,qty]) => qty);
  destroyChart('chart-products');
  const c2 = document.getElementById('chart-products');
  if (c2) {
    chartInstances['chart-products'] = new Chart(c2, {
      type: 'bar',
      data: { labels: prodLabels, datasets: [{ label: 'Unidades', data: prodVals, backgroundColor: '#1A1A1A', borderRadius: 6, borderSkipped: false }] },
      options: { ...CHART_DEFAULTS, indexAxis:'y',
        plugins: { ...CHART_DEFAULTS.plugins, tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: { label: ctx => ctx.parsed.x+' unidade(s)' }}},
        scales: { x: { beginAtZero:true, grid:{color:'rgba(0,0,0,0.05)'} }, y: { grid:{display:false} } } }
    });
  }

  // 3. Volume por cliente
  const clientVols = DB.clients.map(cl => {
    const vol = filtSales.filter(s => s.clientCode === cl.code).reduce((sum, s) => sum + s.items.reduce((ss, i) => ss + i.price * i.qty, 0), 0);
    return { name: cl.name.split(' ')[0], vol };
  }).sort((a,b) => b.vol - a.vol).slice(0,5);
  destroyChart('chart-clients');
  const c3 = document.getElementById('chart-clients');
  if (c3) {
    chartInstances['chart-clients'] = new Chart(c3, {
      type: 'bar',
      data: { labels: clientVols.map(c => c.name), datasets: [{ label: 'Volume R$', data: clientVols.map(c => c.vol), backgroundColor: '#E6B800', borderRadius: 6, borderSkipped: false }] },
      options: { ...CHART_DEFAULTS,
        plugins: { ...CHART_DEFAULTS.plugins, tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: { label: ctx => 'R$ '+ctx.parsed.y.toLocaleString('pt-BR') }}},
        scales: { y: { beginAtZero:true, ticks:{callback:v=>'R$'+Math.round(v/1000)+'k'}, grid:{color:'rgba(0,0,0,0.05)'} }, x: { grid:{display:false} } } }
    });
  }

  // 4. Status dos pedidos (doughnut)
  const confirmed = filtSales.filter(s => s.status === 'confirmed').length;
  const pending   = filtSales.filter(s => s.status === 'pending').length;
  destroyChart('chart-status');
  const c4 = document.getElementById('chart-status');
  if (c4) {
    chartInstances['chart-status'] = new Chart(c4, {
      type: 'doughnut',
      data: { labels: ['Confirmados', 'Pendentes'], datasets: [{ data: [confirmed, pending], backgroundColor: ['#16A34A', '#FFC700'], borderWidth: 0 }] },
      options: { ...CHART_DEFAULTS, cutout:'65%',
        plugins: { ...CHART_DEFAULTS.plugins, legend: { display:true, position:'bottom', labels:{font:{size:12},padding:16} },
          tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: { label: ctx => ctx.label+': '+ctx.parsed+' pedido(s)' } }
        }
      }
    });
  }
}

window.onload = () => document.getElementById('input-code')?.focus();
