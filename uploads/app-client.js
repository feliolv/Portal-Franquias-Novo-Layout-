// ══════════════════════════════════════════
// HISTÓRICO DE PEDIDOS
// ══════════════════════════════════════════
function showOrderHistory(el) {
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
  if (el) el.classList.add('active');
  var catContent = document.getElementById('filter-bar-cat');
  var prodGrid   = document.getElementById('products-grid');
  var heroBanner = document.querySelector('.hero-banner');
  var cartDock   = document.getElementById('cart-dock');
  var histSec    = document.getElementById('order-history-section');
  if (catContent)  catContent.style.display  = 'none';
  if (prodGrid)    prodGrid.style.display    = 'none';
  if (heroBanner)  heroBanner.style.display  = 'none';
  if (cartDock)    cartDock.style.display    = 'none';
  if (histSec)     histSec.style.display     = 'block';
  var topTitle = document.querySelector('.topbar-title');
  if (topTitle)    topTitle.textContent = 'Histórico de pedidos';
  loadOrderHistory();
}

async function loadOrderHistory() {
  var el = document.getElementById('order-history-list');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#aaa;font-size:14px;">Carregando...</div>';
  try {
    var code = (typeof currentClient !== 'undefined' && currentClient && currentClient.code) || (window.currentClient && window.currentClient.code);
    if (!code) { el.innerHTML = '<div style="text-align:center;padding:40px;color:#aaa;">Nenhum pedido encontrado.</div>'; return; }
    var sales = await window._dbApi('GET', '/sales?limit=100');
    sales = Array.isArray(sales) ? sales : [];
    var mine = sales
      .filter(function(s){ return s.client_code === code; })
      .sort(function(a,b){ return new Date(b.created_at) - new Date(a.created_at); });
    if (!mine.length) {
      el.innerHTML = '<div style="text-align:center;padding:40px;color:#aaa;font-size:14px;">Nenhum pedido enviado ainda.</div>';
      return;
    }
    var fmt = function(n){ return 'R$ ' + parseFloat(n||0).toLocaleString('pt-BR',{minimumFractionDigits:2}); };
    var fmtDate = function(d){ try { return new Date(d).toLocaleDateString('pt-BR'); } catch(e){ return d||''; } };
    var rows = mine.map(function(s) {
      var items = [];
      try { items = typeof s.items === 'string' ? JSON.parse(s.items) : (s.items||[]); } catch(e){}
      var itemNames = items.map(function(i){ return i.name || i.sku || ''; }).filter(Boolean).join(', ') || '—';
      return '<tr style="border-bottom:0.5px solid rgba(0,0,0,0.06);">' +
        '<td style="padding:12px 16px;font-family:monospace;font-size:12px;font-weight:500;color:#262626;">' + (s.order_id||'—') + '</td>' +
        '<td style="padding:12px 16px;font-size:13px;color:#888;">' + fmtDate(s.created_at) + '</td>' +
        '<td style="padding:12px 16px;font-size:13px;color:#555;max-width:280px;">' + itemNames + '</td>' +
        '<td style="padding:12px 16px;font-size:13px;font-weight:500;color:#262626;text-align:right;">' + fmt(s.total) + '</td>' +
        '</tr>';
    }).join('');
    el.innerHTML = '<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;border:0.5px solid rgba(0,0,0,0.08);">' +
      '<thead><tr style="border-bottom:0.5px solid rgba(0,0,0,0.08);">' +
      '<th style="padding:10px 16px;font-size:11px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:.5px;text-align:left;">Pedido</th>' +
      '<th style="padding:10px 16px;font-size:11px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:.5px;text-align:left;">Data</th>' +
      '<th style="padding:10px 16px;font-size:11px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:.5px;text-align:left;">Itens</th>' +
      '<th style="padding:10px 16px;font-size:11px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:.5px;text-align:right;">Total</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
  } catch(e) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:#e24b4a;font-size:14px;">Erro: ' + e.message + '</div>';
  }
}

// ── Carrinho persistente ─────────────────────────────────────
function saveCartToStorage() {
  try {
    var code = (typeof currentClient !== 'undefined' && currentClient && currentClient.code) || (window.currentClient && window.currentClient.code);
    if (code && typeof cart !== 'undefined') localStorage.setItem('nayax_cart_' + code, JSON.stringify(cart));
  } catch(e) {}
}

function restoreCartFromStorage() {
  try {
    var code = (typeof currentClient !== 'undefined' && currentClient && currentClient.code) || (window.currentClient && window.currentClient.code);
    if (!code) return;
    var saved = localStorage.getItem('nayax_cart_' + code);
    if (!saved) return;
    var parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cart = parsed; window.cart = cart;
      if (typeof updateCartUI === 'function') updateCartUI();
      showToast('Carrinho restaurado com ' + cart.length + ' item' + (cart.length > 1 ? 's' : '') + '.');
    }
  } catch(e) {}
}

function openCatalog() {
  showScreen('catalog');
  document.getElementById('sb-name').textContent = currentClient.name;
  document.getElementById('sb-code').textContent = currentClient.code;
  document.getElementById('tb-segment').textContent = currentClient.segment;
  document.getElementById('hero-title').textContent = currentClient.name;
  document.getElementById('hero-sub').textContent = currentClient.segment + ' · Catálogo exclusivo ' + currentClient.code;

  document.querySelectorAll('.sidebar .nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('.sidebar .nav-item').classList.add('active');
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.filter-tab').classList.add('active');

  _loadCatalogProducts(0);

  // Restaurar carrinho do localStorage (se houver)
  setTimeout(function(){
    if (typeof restoreCartFromStorage === 'function') restoreCartFromStorage();
  }, 500);
}

// Carrega produtos com loading + retry automático (até 3x, espera 1.5s entre tentativas)
function _loadCatalogProducts(attempt) {
  var visProds = DB.products
    ? DB.products.filter(function(p){ return p.status === 'active' && currentClient.visibleProducts.includes(p.id); })
    : [];

  // Se DB ainda não carregou, mostrar loading e tentar novamente
  if (visProds.length === 0 && attempt < 3) {
    _showCatalogLoading(attempt);
    setTimeout(function(){ _loadCatalogProducts(attempt + 1); }, 1500);
    return;
  }

  // Se após 3 tentativas ainda vazio, mostrar mensagem de erro com botão retry
  if (visProds.length === 0) {
    _showCatalogError();
    return;
  }

  // Produtos carregados — renderizar normalmente
  var prodItems = visProds.filter(function(p){ return p.category !== 'Serviços'; });
  var servItems = visProds.filter(function(p){ return p.category === 'Serviços'; });
  document.getElementById('kpi-items').textContent = visProds.length;
  document.getElementById('kpi-cats').textContent = 2;
  document.getElementById('fc-all').textContent = visProds.length;
  document.getElementById('fc-prods').textContent = prodItems.length;
  document.getElementById('fc-serv').textContent = servItems.length;

  window._lastVisProds = visProds;
  renderProducts(visProds);
}

function _showCatalogLoading(attempt) {
  var grid = document.getElementById('products-grid');
  if (!grid) return;
  var dots = ['', '.', '..', '...'][attempt] || '...';
  grid.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:16px;">'
    + '<div style="width:40px;height:40px;border:3px solid #e8e6e0;border-top-color:#FFCD00;border-radius:50%;animation:_spin 0.8s linear infinite;"></div>'
    + '<div style="font-size:13px;color:#999;font-weight:500;">Carregando produtos' + dots + '</div>'
    + '</div>';
  // Adicionar keyframe de animação se não existir
  if (!document.getElementById('_catalog-spin-style')) {
    var st = document.createElement('style');
    st.id = '_catalog-spin-style';
    st.textContent = '@keyframes _spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(st);
  }
}

function _showCatalogError() {
  var grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:14px;">'
    + '<div style="font-size:32px;">⚠️</div>'
    + '<div style="font-size:14px;font-weight:600;color:#444;">Não foi possível carregar os produtos</div>'
    + '<div style="font-size:12px;color:#999;">Verifique sua conexão e tente novamente</div>'
    + '<button onclick="_loadCatalogProducts(0)" style="margin-top:8px;background:#FFCD00;border:none;border-radius:8px;padding:9px 24px;font-size:13px;font-weight:700;cursor:pointer;">↻ Tentar novamente</button>'
    + '</div>';
}

// Re-renderiza a lista atual (usada ao trocar idioma)
function renderCurrentProducts() {
  if (window._lastVisProds && window._lastVisProds.length > 0) {
    renderProducts(window._lastVisProds);
  }
}

function filterCat(cat, el) {
  // Restaurar visibilidade caso esteja vindo do histórico
  var _histSec = document.getElementById('order-history-section');
  if (_histSec && _histSec.style.display === 'block') {
    var _filterBar = document.getElementById('filter-bar-cat');
    var _prodGrid  = document.getElementById('products-grid');
    var _hero      = document.querySelector('.hero-banner');
    var _cartDock  = document.getElementById('cart-dock');
    var _topTitle  = document.querySelector('.topbar-title');
    if (_filterBar) _filterBar.style.display = '';
    if (_prodGrid)  _prodGrid.style.display  = '';
    if (_hero)      _hero.style.display      = '';
    if (_cartDock)  _cartDock.style.display  = '';
    if (_topTitle)  _topTitle.textContent    = 'Catálogo de Vendas';
    _histSec.style.display = 'none';
  }

  document.querySelectorAll('.filter-tab,.sidebar .nav-item').forEach(e => e.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.filter-tab').forEach(t => { if (t.dataset && t.dataset.cat === cat) t.classList.add('active'); });
  document.querySelectorAll('.sidebar .nav-item').forEach(n => { if (n.textContent.trim().startsWith(cat === 'Todos' ? 'Todos' : cat)) n.classList.add('active'); });

  const vis = DB.products.filter(p => p.status === 'active' && currentClient.visibleProducts.includes(p.id));
  let filtered;
  if (cat === 'Todos') filtered = vis;
  else if (cat === 'Serviços') filtered = vis.filter(p => p.category === 'Serviços');
  else filtered = vis.filter(p => p.category !== 'Serviços'); // "Produtos" = tudo exceto Serviços
  document.getElementById('cat-section-label').textContent = cat === 'Todos' ? 'Todos os itens' : cat;
  document.getElementById('cat-count').textContent = filtered.length + ' item' + (filtered.length !== 1 ? 'ns' : '');
  window._lastVisProds = filtered; renderProducts(window._lastVisProds);
}

function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  list.forEach((p, i) => {
    const price = getClientPrice(p);
    const inCart = cart.find(c => c.id === p.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (i * 0.04) + 's';
    card.innerHTML = `
      <div class="product-img-area">
        ${p.image
          ? `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover;position:relative;z-index:1;" alt="${p.name}">`
          : CAT_ICONS[p.category] || CAT_ICONS['Acessórios']
        }
        ${p.isNew ? `<div class="badge-new">${t('cat.new') || 'Novo'}</div>` : ''}
      </div>
      <div class="product-body">
        <div class="product-cat-tag">${t('cat.filter' + p.category) || p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-sku" style="font-size:10px;color:var(--text-muted);font-family:monospace;letter-spacing:.5px;margin-top:2px;">${p.sku || ''}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-pricing">
          <div class="price-final">R$ ${price.toLocaleString('pt-BR')} <small>/ un.</small></div>
        </div>
        <div id="ctrl-${p.id}">${inCart ? stepperHTML(p.id, inCart.qty) : addBtnHTML(p.id, p.name, price)}</div>
      </div>`;
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════
// CART
// ══════════════════════════════════════════
function addBtnHTML(id, name, price) {
  const s = name.replace(/'/g,"\\'");
  return `<button class="btn-add" onclick="addToCart(${id},'${s.replace(/"/g,'&quot;')}',${price})"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>${t('cat.addToCart')}</button>`;
}
function stepperHTML(id, qty) {
  return `<div class="qty-stepper"><button class="qty-btn minus" onclick="changeQty(${id},-1)">−</button><div class="qty-display" id="qty-display-${id}">${qty} <small>un.</small></div><button class="qty-btn plus" onclick="changeQty(${id},+1)">+</button></div>`;
}
function clearCart() {
  cart = [];
  updateCartUI();
  renderProducts(DB.products.filter(p =>
    p.status === 'active' && currentClient.visibleProducts.includes(p.id)
  ));
  const clearWrap = document.getElementById('cart-clear-wrap');
  if (clearWrap) clearWrap.style.display = 'none';
}

function addToCart(id, name, price) {
  name = (name || '').replace(/&quot;/g, '"');
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; const d = document.getElementById('qty-display-'+id); if(d) d.innerHTML=existing.qty+' <small>un.</small>'; updateCartUI(); return; }
  cart.push({ id, name, price, qty: 1 }); window.cart = cart;
  const ctrl = document.getElementById('ctrl-' + id);
  if (ctrl) ctrl.innerHTML = stepperHTML(id, 1);
  updateCartUI();
  saveCartToStorage();
}
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
    const p = DB.products.find(p => p.id === id);
    const ctrl = document.getElementById('ctrl-' + id);
    if (ctrl && p) ctrl.innerHTML = addBtnHTML(p.id, p.name, getClientPrice(p));
  } else {
    const d = document.getElementById('qty-display-' + id);
    if (d) d.innerHTML = `${item.qty} <small>un.</small>`;
  }
  updateCartUI();
  saveCartToStorage();
}
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const dock       = document.getElementById('cart-dock');
  const badge      = document.getElementById('cart-badge');
  const totalEl    = document.getElementById('cart-total');
  const preview    = document.getElementById('cart-preview');
  const navItem    = document.getElementById('nav-cart-item');

  if (dock) {
    if (cart.length > 0) {
      dock.style.display = 'flex';
      requestAnimationFrame(() => dock.classList.add('visible'));
    } else {
      dock.classList.remove('visible');
      setTimeout(() => { if (!cart.length && dock) dock.style.display = 'none'; }, 300);
    }
  }
  if (navItem)  navItem.style.display  = cart.length > 0 ? 'flex' : 'none';
  if (badge)    badge.textContent      = count;
  if (totalEl)  totalEl.textContent    = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
  if (preview)  preview.innerHTML      = cart.slice(0,3).map(i =>
    `<div class="cart-item-pill">${i.qty}× ${i.name.split(' ').slice(0,3).join(' ')}</div>`).join('');
  // Mostrar/ocultar botão limpar carrinho
  const clearWrap = document.getElementById('cart-clear-wrap');
  if (clearWrap) clearWrap.style.display = cart.length > 0 ? 'block' : 'none';
  // Re-aplicar traduções nos elementos data-i18n do cart dock
  if (typeof setLang === 'function') {
    const cartDock = document.getElementById('cart-dock');
    if (cartDock) cartDock.querySelectorAll('[data-i18n]').forEach(el => {
      const val = t(el.getAttribute('data-i18n'));
      if (val) el.textContent = val;
    });
  }
}

// ══════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════


function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }

function showCheckoutModal() {
  if (!cart.length) return;
  coInitCheckout();
  openModal('modal-checkout');
}

// ══════════════════════════════════════════
// NOVO CHECKOUT — 4 etapas + resumo lateral
// ══════════════════════════════════════════
var _coStep = 1;

// Campos obrigatórios por etapa
var CO_REQUIRED = {
  1: ['f-cnpj','f-razao'],
  2: ['f-nome','f-sobrenome','f-cpf','f-nasc','f-email','f-tel'],
  3: ['f-cep','f-uf','f-rua','f-num','f-bairro','f-cidade'],
  4: []
};

function coInitCheckout() {
  _coStep = 1;
  // Atualizar header sub
  var sub = document.getElementById('co-header-sub');
  if (sub) sub.textContent = (currentClient ? currentClient.name : '') + ' · ' + cart.reduce(function(s,i){return s+i.qty;},0) + ' item(ns)';

  // Preencher resumo lateral
  coUpdateSide();

  // Pré-preenchimento apenas ao digitar CNPJ (via maskCNPJ → prefillByCnpj)

  // Renderizar stepper e mostrar etapa 1
  coRenderStepper();
  coShowStep(1);
}

function coUpdateSide() {
  var itemsEl = document.getElementById('co-side-items');
  var totalEl = document.getElementById('co-side-total');
  if (!itemsEl) return;
  var total = 0;
  itemsEl.innerHTML = cart.map(function(i) {
    total += i.price * i.qty;
    return '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);gap:6px;">' +
      '<div><div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.4;">' + i.name + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:2px;">' + i.qty + ' unidade(s)</div></div>' +
      '<div style="font-size:13px;font-weight:600;color:#fff;white-space:nowrap;flex-shrink:0;">R$ ' + (i.price * i.qty).toLocaleString('pt-BR') + '</div>' +
      '</div>';
  }).join('');
  if (totalEl) totalEl.textContent = 'R$ ' + total.toLocaleString('pt-BR', {minimumFractionDigits:2});
}

// Chamada quando o CNPJ é completado no campo
// Busca pedido anterior com aquele CNPJ e preenche os dados se encontrar
function coTryPrefill() { /* desativado — usar prefillByCnpj(cnpj) */ }

async function prefillByCnpj(cnpjRaw) {
  var clean = (cnpjRaw || '').replace(/\D/g, '');
  if (clean.length !== 14) return;
  try {
    var rows = await window._dbApi('GET','/sales?limit=50');
    rows = Array.isArray(rows) ? rows : [];
    var d = rows.filter(function(s){ return s.buyer_cnpj === clean; })
                .sort(function(a,b){ return new Date(b.created_at)-new Date(a.created_at); })[0];
    if (!d) return;
    var filled = 0;
    function setVal(id, val) {
      if (!val) return;
      var el = document.getElementById(id);
      if (el) { el.value = val; filled++; }
    }
    setVal('f-razao',     d.buyer_razao_social);
    setVal('f-nome',      d.buyer_nome);
    setVal('f-sobrenome', d.buyer_sobrenome);
    setVal('f-cpf',       d.buyer_cpf);
    setVal('f-nasc',      d.buyer_nascimento);
    setVal('f-email',     d.buyer_email);
    setVal('f-tel',       d.buyer_telefone);
    setVal('f-cep',       d.buyer_cep);
    setVal('f-rua',       d.buyer_rua);
    setVal('f-num',       d.buyer_numero);
    setVal('f-comp',      d.buyer_complemento);
    setVal('f-bairro',    d.buyer_bairro);
    setVal('f-cidade',    d.buyer_cidade);
    if (d.buyer_uf) { var ufEl = document.getElementById('f-uf'); if (ufEl) { ufEl.value = d.buyer_uf; filled++; } }
    if (filled > 0) {
      ['co-prefill-1','co-prefill-2'].forEach(function(pid) {
        var el = document.getElementById(pid);
        if (el) el.style.display = 'inline-flex';
      });
      showToast('Dados do pedido anterior preenchidos automaticamente!');
    }
  } catch(e) { console.warn('[prefillByCnpj]', e.message); }
}

function coRenderStepper() {
  var el = document.getElementById('co-stepper');
  if (!el) return;
  var steps = [t('checkout.step1')||'Empresa', t('checkout.step2')||'Responsável', t('checkout.step3')||'Endereço', t('checkout.step4')||'Confirmar'];
  el.innerHTML = steps.map(function(label, i) {
    var n = i + 1;
    var cls = n < _coStep ? 'done' : n === _coStep ? 'active' : '';
    var circleStyle = n < _coStep
      ? 'background:rgba(255,199,0,0.15);border:1.5px solid rgba(255,199,0,0.4);color:var(--yellow);'
      : n === _coStep
      ? 'background:var(--yellow);border:1.5px solid var(--yellow);color:var(--black);'
      : 'background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.3);';
    var labelStyle = n === _coStep ? 'color:rgba(255,255,255,0.85);' : n < _coStep ? 'color:rgba(255,255,255,0.4);' : 'color:rgba(255,255,255,0.25);';
    var lineStyle = n < steps.length
      ? 'flex:1;display:flex;align-items:center;gap:8px;position:relative;'
      : 'display:flex;align-items:center;gap:8px;';
    var after = n < steps.length
      ? '<div style="position:absolute;left:34px;right:0;top:50%;transform:translateY(-50%);height:1px;background:' + (n < _coStep ? 'rgba(255,199,0,0.3)' : 'rgba(255,255,255,0.1)') + ';z-index:0;"></div>'
      : '';
    return '<div style="' + lineStyle + '">' + after +
      '<div style="width:26px;height:26px;border-radius:50%;' + circleStyle + 'font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1;font-family:Poppins,sans-serif;">' +
      (n < _coStep ? '✓' : String(n)) + '</div>' +
      '<span style="font-size:11px;font-weight:500;white-space:nowrap;' + labelStyle + '">' + label + '</span>' +
      '</div>';
  }).join('');
}

function coShowStep(n) {
  _coStep = n;
  // Mostrar/ocultar formulários
  document.querySelectorAll('.co-step-form').forEach(function(el, i) {
    el.style.display = (i + 1 === n) ? 'block' : 'none';
  });
  // Atualizar stepper
  coRenderStepper();
  // Botão voltar
  var btnBack = document.getElementById('co-btn-back');
  if (btnBack) btnBack.style.visibility = n === 1 ? 'hidden' : 'visible';
  // Botão próximo
  var btnNext = document.getElementById('co-btn-next');
  var info = document.getElementById('co-step-info');
  if (info) info.textContent = (t('checkout.stepOf')||'Etapa') + ' ' + n + ' ' + (t('checkout.of')||'de') + ' 4';
  if (btnNext) {
    if (n === 4) {
      btnNext.innerHTML = `<span data-i18n="checkout.confirm">${t('checkout.confirm')||'Confirmar pedido'}</span>`;
      btnNext.style.background = 'var(--black)';
      btnNext.style.color = 'var(--yellow)';
    } else {
      btnNext.innerHTML = 'Continuar <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
      btnNext.style.background = 'var(--yellow)';
      btnNext.style.color = 'var(--black)';
    }
  }
  // Scroll topo
  var col = document.getElementById('co-form-col');
  if (col) col.scrollTop = 0;
  // Preencher resumo na etapa 4
  if (n === 4) coFillConfirm();
}

function coValidateStep(n) {
  var fields = CO_REQUIRED[n] || [];
  // Incluir f-uf na etapa 3 se não estiver
  if (n === 3 && fields.indexOf('f-uf') === -1) fields = fields.concat(['f-uf']);
  var ok = true;

  fields.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var val = (el.value || '').trim();
    if (!val) {
      // Marcar campo com borda vermelha
      el.style.setProperty('border-color', '#DC2626', 'important');
      el.style.setProperty('box-shadow', '0 0 0 3px rgba(220,38,38,0.15)', 'important');
      // Caso especial: telefone dentro de wrapper
      if (id === 'f-tel') {
        var wrap = document.getElementById('tel-wrap');
        if (wrap) {
          wrap.style.setProperty('border-color', '#DC2626', 'important');
          wrap.style.setProperty('box-shadow', '0 0 0 3px rgba(220,38,38,0.15)', 'important');
        }
      }
      // Limpar ao digitar
      var evName = (el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(evName, function _clear() {
        if ((el.value || '').trim()) {
          el.style.removeProperty('border-color');
          el.style.removeProperty('box-shadow');
          if (id === 'f-tel') {
            var wrap = document.getElementById('tel-wrap');
            if (wrap) { wrap.style.removeProperty('border-color'); wrap.style.removeProperty('box-shadow'); }
          }
        }
        el.removeEventListener(evName, _clear);
      });
      ok = false;
    } else {
      // Campo preenchido — garantir sem borda vermelha
      el.style.removeProperty('border-color');
      el.style.removeProperty('box-shadow');
    }
  });

  if (!ok) showToast('Preencha os campos obrigatórios destacados em vermelho.');
  return ok;
}

function coChangeStep(delta) {
  var next = _coStep + delta;
  if (delta > 0) {
    if (!coValidateStep(_coStep)) return;
  }
  if (next < 1 || next > 4) return;
  if (next > 4) {
    // Enviar pedido
    confirmOrder();
    return;
  }
  if (_coStep === 4 && delta > 0) {
    confirmOrder();
    return;
  }
  coShowStep(next);
}

function coFillConfirm() {
  var g = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var razao = document.getElementById('co-confirm-razao');
  var cnpj  = document.getElementById('co-confirm-cnpj');
  var nome  = document.getElementById('co-confirm-nome');
  var cont  = document.getElementById('co-confirm-contato');
  var rua   = document.getElementById('co-confirm-rua');
  var cid   = document.getElementById('co-confirm-cidade');
  if (razao) razao.textContent = g('f-razao');
  if (cnpj)  cnpj.textContent  = g('f-cnpj');
  if (nome)  nome.textContent  = g('f-nome') + ' ' + g('f-sobrenome');
  if (cont)  cont.textContent  = g('f-email') + ' · ' + g('f-tel');
  if (rua)   rua.textContent   = g('f-rua') + (g('f-num') ? ', ' + g('f-num') : '') + (g('f-comp') ? ' – ' + g('f-comp') : '') + (g('f-bairro') ? ' · ' + g('f-bairro') : '');
  if (cid)   cid.textContent   = g('f-cidade') + ' – ' + g('f-uf') + (g('f-cep') ? ' · ' + g('f-cep') : '');
}

const EDGE_FUNCTION = window._dbAwsApi ? window._dbAwsApi() + '/hubspot/order' : '/api/hubspot/order';



function confirmOrder() {
  const requiredMap = {
    'f-razao':'Razão Social','f-cnpj':'CNPJ','f-nome':'Nome','f-sobrenome':'Sobrenome',
    'f-cpf':'CPF','f-nasc':'Data de Nascimento','f-email':'E-mail','f-tel':'Telefone',
    'f-cep':'CEP','f-rua':'Rua','f-num':'Número','f-bairro':'Bairro','f-cidade':'Cidade','f-uf':'Estado'
  };
  for (const [f, label] of Object.entries(requiredMap)) {
    const el = document.getElementById(f);
    if (!el || !el.value.trim()) {
      showToast('Campo obrigatório: ' + label);
      el && el.scrollIntoView({ behavior:'smooth', block:'center' });
      el && (el.style.borderColor = 'var(--danger)');
      setTimeout(() => el && (el.style.borderColor = ''), 3000);
      return;
    }
  }

  // Calcular total e montar line items completos para HubSpot
  // Injetar bundles: para cada item do carrinho, buscar produtos vinculados
  const bundlesFromDB = (typeof DB_BUNDLES !== 'undefined') ? DB_BUNDLES : [];
  const clientCode = (typeof currentClient !== 'undefined' && currentClient) ? currentClient.code : null;
  const bundleItems = [];
  cart.forEach(i => {
    const p = DB.products.find(x => x.id === i.id);
    if (p && p.sku) {
      // Prioridade: bundle específico do cliente > bundle geral (client_code null)
      const clientBundles = bundlesFromDB.filter(function(b) {
        var skus = [];
        try { var p2 = JSON.parse(b.parent_sku); skus = Array.isArray(p2) ? p2 : [b.parent_sku]; } catch(e) { skus = [b.parent_sku]; }
        return skus.indexOf(p.sku) > -1 && b.client_code === clientCode;
      });
      const generalBundles = bundlesFromDB.filter(function(b) {
        var skus = [];
        try { var p2 = JSON.parse(b.parent_sku); skus = Array.isArray(p2) ? p2 : [b.parent_sku]; } catch(e) { skus = [b.parent_sku]; }
        return skus.indexOf(p.sku) > -1 && !b.client_code;
      });
      const linked = clientBundles.length > 0 ? clientBundles : generalBundles;
      linked.forEach(b => {
        bundleItems.push({
          productId:  'bundle-' + b.bundle_sku,
          sku:        b.bundle_sku,
          name:       b.bundle_name,
          category:   'Bundle',
          qty:        i.qty,
          unitPrice:  parseFloat(b.bundle_price) || 0,
          subtotal:   (parseFloat(b.bundle_price) || 0) * i.qty,
          isBundle:   true,
          parentSku:  p.sku
        });
      });
    }
  });

  const itemsResolved = cart.map(i => {
    const p = DB.products.find(x => x.id === i.id);
    return {
      productId:   i.id,
      sku:         p?.sku        || '',
      name:        p?.name       || 'Produto',
      category:    p?.category   || '',
      qty:         i.qty,
      unitPrice:   i.price,
      subtotal:    i.qty * i.price
    };
  });
  // Incluir bundles na lista final de itens enviados ao Make
  const allItems = [...itemsResolved, ...bundleItems];
  const total = allItems.reduce((s, i) => s + i.subtotal, 0);
  const itemsFormatted = allItems.map(i =>
    `${i.qty}x [${i.sku}] ${i.name} — R$ ${i.unitPrice.toLocaleString('pt-BR')} un. = R$ ${i.subtotal.toLocaleString('pt-BR')}`
  ).join(' | ');

  // Estrutura completa para criação automática de Deal no HubSpot via Make
  const hubspotDeal = {
    dealName:    `PED${String(nextOrderId).padStart(3,'0')} - ${document.getElementById('f-razao').value}`,
    amount:      total,
    closeDate:   new Date().toISOString().split('T')[0],
    clientCode:  currentClient.code,
    ownerId:     currentClient.owner_id || '',
    clientName:  currentClient.name,
    franquia_de_empresa: currentClient.franchise_name || '',
    lineItems:   itemsResolved.map(i => ({
      sku:       i.sku,
      name:      i.name,
      quantity:  i.qty,
      price:     i.unitPrice,
      amount:    i.subtotal
    }))
  };

  const sale = {
    id: (function() {
      const seq = String(nextOrderId++).padStart(3,'0');
      const ts  = Date.now().toString(36).toUpperCase().slice(-4);
      const rnd = Math.random().toString(36).slice(2,5).toUpperCase();
      const nome = document.getElementById('f-razao').value.split(' ').slice(0,3).join(' ');
      return `PED${seq}-${ts}${rnd} - ${nome}`;
    })(),
    clientCode:  currentClient.code,
    clientName:  currentClient.name,
    date:        new Date().toISOString().split('T')[0],
    status:      'pending',
    total,
    itemsFormatted,
    items:       allItems,
    hubspotDeal,
    franchisee: {
      razao: document.getElementById('f-razao').value,
      cnpj:  document.getElementById('f-cnpj').value,
      nome:       document.getElementById('f-nome').value,
      sobrenome:  document.getElementById('f-sobrenome').value,
      nomeCompleto: document.getElementById('f-nome').value + ' ' + document.getElementById('f-sobrenome').value,
      cpf:   document.getElementById('f-cpf').value,
      nasc:  document.getElementById('f-nasc').value,
      email: document.getElementById('f-email').value,
      tel:   (document.getElementById('f-tel-country')?.value || '+55') + ' ' + document.getElementById('f-tel').value,
      endereco: {
        cep:    document.getElementById('f-cep').value,
        rua:    document.getElementById('f-rua').value,
        num:    document.getElementById('f-num').value,
        comp:   (document.getElementById('f-comp') || {}).value || '',
        bairro: document.getElementById('f-bairro').value,
        cidade: document.getElementById('f-cidade').value,
        uf:     document.getElementById('f-uf').value
      }
    }
  };

  DB.sales.unshift(sale);
  // Salvar venda feito pelo patchConfirmOrder em app-db.js
  cart = []; window.cart = cart;
  updateCartUI();

  // Reset product controls safely
  if (document.getElementById('products-grid')) {
    DB.products.forEach(p => {
      const ctrl = document.getElementById('ctrl-' + p.id);
      if (ctrl) ctrl.innerHTML = addBtnHTML(p.id, p.name, getClientPrice(p));
    });
  }

  // Clear form fields safely
  ['f-razao','f-cnpj','f-nome','f-sobrenome','f-cpf','f-nasc','f-email','f-tel',
   'f-cep','f-rua','f-num','f-comp','f-bairro','f-cidade'].forEach(f => {
    const el = document.getElementById(f); if (el) el.value = '';
  });
  const ufEl = document.getElementById('f-uf'); if (ufEl) ufEl.value = '';

  // Preencher resumo no modal
  var numEl = document.getElementById('confirmed-order-number');
  var sumEl = document.getElementById('confirmed-order-summary');
  if (numEl) numEl.textContent = sale.id;
  if (sumEl) {
    const rows = allItems.map(i =>
      `<div style="display:flex;justify-content:space-between;gap:8px;">
        <span>${i.qty}× ${i.name}</span>
        <span style="font-weight:600;white-space:nowrap;">R$ ${(i.unitPrice||i.price||0).toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
      </div>`
    ).join('');
    const tot = allItems.reduce((s,i) => s + (i.subtotal||0), 0);
    sumEl.innerHTML = rows +
      `<div style="border-top:1px solid #E8E6E0;margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;">
        <span>Total</span><span>R$ ${tot.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
      </div>`;
  }
  closeModal('modal-checkout');
  openModal('modal-confirmed');

  // Envio para HubSpot agora feito pelo patchConfirmOrder (com dados capturados antes do cart ser limpo)
}

function novoPedido() {
  closeModal('modal-confirmed');
  cart = [];
  updateCartUI();
  // Reset all product controls
  if (document.getElementById('products-grid')) {
    DB.products.forEach(p => {
      const ctrl = document.getElementById('ctrl-' + p.id);
      if (ctrl) ctrl.innerHTML = addBtnHTML(p.id, p.name, getClientPrice(p));
    });
  }
  // Scroll to top of catalog
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════
// ADMIN — DASHBOARD
// ══════════════════════════════════════════



      function toggleLangMenu(){var m=document.getElementById('lang-menu');m.style.display=m.style.display==='none'?'block':'none';}
      function selectLang(val,label){document.getElementById('lang-btn-label').textContent=label;document.getElementById('lang-menu').style.display='none';if(typeof setLang==='function')setLang(val);}
      document.addEventListener('click',function(e){var d=document.getElementById('lang-dropdown');if(d&&!d.contains(e.target))document.getElementById('lang-menu').style.display='none';});
    


            function toggleClientLangMenu(){var m=document.getElementById('client-lang-menu');m.style.display=m.style.display==='none'?'block':'none';}
            function selectClientLang(val,label){document.getElementById('client-lang-label').textContent=label;document.getElementById('client-lang-menu').style.display='none';if(typeof setLang==='function')setLang(val);}
            document.addEventListener('click',function(e){var d=document.getElementById('client-lang-dropdown');if(d&&!d.contains(e.target))document.getElementById('client-lang-menu').style.display='none';});
          


// ── Patch v54 slim — widget lateral do carrinho ──
(function r(){
  if(typeof openModal!=="function"||typeof DB==="undefined") return setTimeout(r,50);
  if(window._v54)return;
  window._v54=true;

  function hideNative(){
    document.querySelectorAll(".nav-section-label").forEach(function(el){if(el.textContent.trim()==="Pedido")el.style.display="none";});
    document.querySelectorAll(".nav-item").forEach(function(el){if(el.getAttribute("onclick")==="showCheckoutModal()")el.style.display="none";});
  }
  hideNative(); setTimeout(hideNative,300); setTimeout(hideNative,1000);

  function mk(tag,cls){var e=document.createElement(tag);if(cls)e.className=cls;return e;}

  function bw(){
    var sb=document.querySelector(".sidebar");
    if(!sb||document.getElementById("nayax-order-widget"))return;
    var w=mk("div","nayax-order-widget");w.id="nayax-order-widget";
    var top=mk("div","nayax-order-top");
    var lbl=mk("span","nayax-order-lbl");lbl.textContent="Pedido atual";
    var badge=mk("span","nayax-order-badge");badge.id="nb";badge.textContent="0 itens";
    top.appendChild(lbl);top.appendChild(badge);
    var total=mk("div","nayax-order-total");total.id="nt";total.textContent="R$ 0,00";
    var sub=mk("div","nayax-order-sub");sub.id="ns";sub.style.cssText="margin-bottom:8px;min-height:14px;font-size:10px;color:rgba(255,255,255,.3)";
    var btn=mk("button","nayax-order-btn");btn.id="nob";btn.textContent="Enviar pedido";
    btn.setAttribute("onclick","showCheckoutModal()");
    var arr=mk("span","nayax-order-btn-arr");
    arr.innerHTML='<svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.appendChild(arr);
    w.appendChild(top);w.appendChild(total);w.appendChild(sub);w.appendChild(btn);
    var foot=sb.querySelector(".sidebar-footer,.sidebar-bottom");
    if(foot)sb.insertBefore(w,foot);else sb.appendChild(w);
  }

  function uw(){
    var count=parseInt((document.getElementById("cart-badge")||{textContent:"0"}).textContent)||0;
    var tot=(document.getElementById("cart-total")||{textContent:"R$ 0,00"}).textContent;
    var prev=(document.getElementById("cart-preview")||{textContent:""}).textContent;
    var nb=document.getElementById("nb"),nt=document.getElementById("nt"),ns=document.getElementById("ns"),btn=document.getElementById("nob");
    if(nb)nb.textContent=count===0?"0 itens":count+(count===1?" item":" itens");
    if(nt)nt.textContent=tot;
    if(ns)ns.textContent=prev;
    if(btn){btn.disabled=count===0;btn.style.opacity=count>0?"1":"0.4";btn.style.cursor=count>0?"pointer":"not-allowed";}
  }

  (function(){
    if(window.addToCart&&window.addToCart._p)return;
    var _o=window.addToCart;
    window.addToCart=function(id,name,price){
      var prod=DB&&DB.products?DB.products.find(function(p){return p.id===id||p.id===parseInt(id);}):null;
      var n=name||(prod?prod.name:String(id));
      var pr=(price!==undefined&&!isNaN(price))?price:(prod?(prod.price||prod.basePrice||0):0);
      return _o.call(this,id,n,pr);
    };window.addToCart._p=true;
  })();

  bw(); uw();
  setInterval(function(){hideNative();bw();uw();},500);
})();
