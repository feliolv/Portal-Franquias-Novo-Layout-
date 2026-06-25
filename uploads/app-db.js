// ============================================================
//  app-db.js — Camada de dados para AWS
//  Substitui a integração com Supabase por chamadas diretas
//  à API REST (AWS API Gateway + Lambda)
//
//  Configuração: definir window.AWS_API antes de carregar este
//  arquivo, ou via variável de ambiente injetada no build.
//  Durante a transição Supabase→AWS, mantém fallback automático.
// ============================================================

// ── Ponto central de configuração ────────────────────────────
// TROCAR para a URL do API Gateway após deploy na AWS
// API backend local (Node.js container) — rota relativa via nginx proxy
var AWS_API  = window.AWS_API || '/api';
var AWS_KEY  = window.AWS_KEY || '';

// Supabase removido — portal usa API local (Node.js + RDS)

// Sempre usa o backend local — USE_AWS=true ativa as rotas /api/*
var USE_AWS  = true;

// ── Helper HTTP ───────────────────────────────────────────────
async function _api(method, path, body) {
  var headers = { 'Content-Type': 'application/json' };
  if (AWS_KEY) headers['x-api-key'] = AWS_KEY;
  var opts = { method: method, headers: headers };
  if (body) opts.body = JSON.stringify(body);
  var r = await fetch(AWS_API + path, opts);
  if (!r.ok) throw new Error('API ' + method + ' ' + path + ': ' + r.status);
  return r.json();
}



// ── Carregar mapa de consultores (não hardcoded) ──────────────
(function loadOwnerMaps() {
  var cached = sessionStorage.getItem('_nayax_owner_maps');
  if (cached) {
    try {
      var d = JSON.parse(cached);
      if (d._exp && Date.now() < d._exp) {
        window._ownerEmailMap = d.email;
        window._ownerNameMap  = d.name;
        return;
      }
    } catch(e) {}
  }
  var endpoint = USE_AWS
    ? _api('GET', '/consultants')
    : _sb_get('team_members', 'select=hubspot_owner_id,email,name&hubspot_owner_id=neq.null');
  endpoint.then(function(rows) {
    if (!Array.isArray(rows)) return;
    var em = {}, nm = {};
    rows.forEach(function(r) {
      var hid = String(r.hubspot_owner_id || r.id || '');
      if (hid) { em[hid] = r.email || ''; nm[hid] = r.name || ''; }
    });
    window._ownerEmailMap = em;
    window._ownerNameMap  = nm;
    try {
      sessionStorage.setItem('_nayax_owner_maps', JSON.stringify({
        email: em, name: nm, _exp: Date.now() + 3600000
      }));
    } catch(e) {}
  }).catch(function() {
    window._ownerEmailMap = window._ownerEmailMap || {};
    window._ownerNameMap  = window._ownerNameMap  || {};
  });
})();

// ── initDB — Carrega dados iniciais ──────────────────────────
(function initDB() {
  if (typeof DB === 'undefined') {
    console.error('[DB] DB não definido — app-data.js deve carregar antes de app-db.js');
    return;
  }
  window._sbPMap = {};

  async function loadFromAWS() {
    var [clients, products, admins, sales] = await Promise.all([
      _api('GET', '/clients?status=active'),
      _api('GET', '/products?status=active'),
      _api('GET', '/admins'),
      _api('GET', '/sales?limit=50&order=created_at.desc')
    ]);
    return { clients, products, admins, sales };
  }

  function mapProducts(pr) {
    pr.forEach(function(p, i) { window._sbPMap[p.id] = i + 1; });
    return pr.map(function(p, i) {
      return {
        id: i + 1, _sbId: p.id, sku: p.sku || '', category: p.category || 'Geral',
        name: p.name, desc: p.description || '', basePrice: parseFloat(p.price) || 0,
        price: parseFloat(p.price) || 0, image: p.image_url || '', imgUrl: p.image_url || '',
        isNew: p.is_new || false, status: p.status || 'active'
      };
    });
  }

  function mapClients(cl, pr) {
    return cl.map(function(c) {
      var vis = c.visible_products && c.visible_products.length
        ? c.visible_products.map(function(u) { return window._sbPMap[u]; }).filter(Boolean)
        : pr.map(function(_, i) { return i + 1; });
      return {
        code: c.code, name: c.name, segment: c.segment || '',
        status: c.status || 'active', owner_id: c.owner_id || null,
        owner_name: c.owner_name || '', owner_email: c.owner_email || '',
        franchise_name: c.franchise_name || '', visibleProducts: vis,
        prices: c.custom_prices || {}, _sbId: c.id, _sbVis: c.visible_products || []
      };
    });
  }

  function mapSales(sl) {
    sl.forEach(function(s) {
      var id = s.order_id || s.id || '';
      var m = String(id).match(/^PED(\d+)/);
      if (m) { var n = parseInt(m[1]); if (n >= nextOrderId) nextOrderId = n + 1; }
    });
    return sl.map(function(s) {
      var items = Array.isArray(s.items) ? s.items : [];
      return {
        id: s.order_id || s.id, order_id: s.order_id || s.id, _sbId: s.id,
        hubspot_deal_id: s.hubspot_deal_id || '',
        clientCode: s.client_code || '', clientName: s.client_name || '',
        date: s.created_at || new Date().toISOString(),
        status: s.status || 'pending',
        items: items.map(function(i) {
          return { productId: i.productId || i.product_id || 0, name: i.name || '', qty: i.qty || 1, price: parseFloat(i.price) || 0 };
        }),
        franchisee: {
          razaoSocial: s.buyer_razao_social || '', cnpj: s.buyer_cnpj || '',
          nome: s.buyer_nome || '', sobrenome: s.buyer_sobrenome || '',
          cpf: s.buyer_cpf || '', nasc: s.buyer_nascimento || '',
          email: s.buyer_email || '', tel: s.buyer_telefone || '',
          cep: s.buyer_cep || '', uf: s.buyer_uf || '', rua: s.buyer_rua || '',
          numero: s.buyer_numero || '', complemento: s.buyer_complemento || '',
          bairro: s.buyer_bairro || '', cidade: s.buyer_cidade || ''
        }
      };
    });
  }

  async function init() {
    try {
      var data = await loadFromAWS();
      DB.products = mapProducts(data.products || []);
      DB.clients  = mapClients(data.clients || [], data.products || []);
      DB.admins   = data.admins || [];
      DB.sales    = mapSales(data.sales || []);
      if (typeof renderProducts      === 'function') try { renderProducts(); }      catch(e) {}
      if (typeof renderSalesTable    === 'function') try { renderSalesTable(); }    catch(e) {}
      if (typeof renderAdminDashboard=== 'function') try { renderAdminDashboard(); }catch(e) {}
      console.log('[DB] dados carregados — AWS:', USE_AWS,
                  '| clientes:', DB.clients.length, '| produtos:', DB.products.length,
                  '| vendas:', DB.sales.length);
    } catch(e) {
      console.error('[DB] erro ao carregar:', e.message);
    }
  }

  // Aguardar app-data.js inicializar
  if (typeof DB !== 'undefined' && DB) {
    setTimeout(init, 0);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();

// ── Login do cliente ──────────────────────────────────────────
(function patchLogin() {
  if (!window.doLogin || window.doLogin._sbPatched) return;
  var _orig = window.doLogin;
  window.doLogin = async function() {
    var el   = document.getElementById('input-code');
    var code = el ? el.value.trim().toUpperCase() : '';
    if (!code) { if (typeof showToast === 'function') showToast('Digite o código'); return; }
    try {
      var rows = USE_AWS
        ? await _api('GET', '/clients/' + encodeURIComponent(code))
        : await _sb_get('clients', 'select=*&code=eq.' + encodeURIComponent(code) + '&status=eq.active&limit=1');
      var d = Array.isArray(rows) ? rows[0] : rows;
      if (d && d.code) {
        var vis = d.visible_products && d.visible_products.length
          ? d.visible_products.map(function(u) { return window._sbPMap[u]; }).filter(Boolean)
          : DB.products.map(function(p) { return p.id; });
        var m = { code: d.code, name: d.name, segment: d.segment || '', status: d.status,
                  owner_id: d.owner_id || null, owner_name: d.owner_name || '',
                  visibleProducts: vis, prices: d.custom_prices || {},
                  _sbId: d.id, _sbVis: d.visible_products || [] };
        var idx = DB.clients.findIndex(function(c) { return c.code === code; });
        if (idx >= 0) DB.clients[idx] = m; else DB.clients.push(m);
        _orig();
      } else {
        if (typeof showToast === 'function') showToast('Código inválido');
      }
    } catch(e) {
      console.error('[DB] doLogin:', e.message);
      if (typeof showToast === 'function') showToast('Erro ao verificar código');
    }
  };
  window.doLogin._sbPatched = true;
  setTimeout(patchLogin, 80);
})();

// ── Confirmar pedido (salvar no banco + criar deal HubSpot) ───
(function patchConfirmOrder() {
  if (!window.confirmOrder || window.confirmOrder._sbPatched) return;
  var _orig = window.confirmOrder;
  window.confirmOrder = async function() {
    try {
      // Capturar dados ANTES do original limpar o cart
      var ca = Array.isArray(window.cart) && window.cart.length
        ? window.cart.map(function(x) { return Object.assign({}, x); })
        : (Array.isArray(cart) ? cart.map(function(x) { return Object.assign({}, x); }) : []);
      var rawClient = currentClient;
      if (typeof rawClient === 'string') { try { rawClient = JSON.parse(rawClient); } catch(e) {} }
      var clientCode = typeof rawClient === 'object' && rawClient !== null ? (rawClient.code || '') : String(rawClient || '');
      var cl         = DB.clients.find(function(c) { return c.code === clientCode; });
      var clientName = cl ? cl.name : clientCode;

      var bundlesFromDB = (typeof DB_BUNDLES !== 'undefined') ? DB_BUNDLES : [];
      var itemsResolved = ca.map(function(x) {
        var p    = parseFloat(x.price || x.unitPrice || 0);
        var dbp  = DB.products ? DB.products.find(function(d) { return d.id === x.id || d._sbId === x.id; }) : null;
        return { productId: x._sbId || x.id, name: x.name, sku: x.sku || (dbp ? dbp.sku : '') || '', qty: x.qty || 1, price: p, subtotal: p * (x.qty || 1) };
      });

      var bundleItems = [], bundleMap = {};
      ca.forEach(function(x) {
        var dbp = DB.products ? DB.products.find(function(d) { return d.id === x.id || d._sbId === x.id; }) : null;
        if (!dbp || !dbp.sku) return;
        var linked = bundlesFromDB.filter(function(b) {
          var skus = []; try { var p2 = JSON.parse(b.parent_sku); skus = Array.isArray(p2) ? p2 : [b.parent_sku]; } catch(e) { skus = [b.parent_sku]; }
          return skus.indexOf(dbp.sku) > -1;
        }).filter(function(b) { return !b.client_code || b.client_code === clientCode; });
        linked.forEach(function(b) {
          if (bundleMap[b.bundle_sku]) return;
          bundleMap[b.bundle_sku] = true;
          bundleItems.push({ productId: 'bundle-' + b.bundle_sku, sku: b.bundle_sku, name: b.bundle_name, qty: x.qty || 1, price: parseFloat(b.bundle_price) || 0, subtotal: (parseFloat(b.bundle_price) || 0) * (x.qty || 1) });
        });
      });

      var it  = itemsResolved.concat(bundleItems);
      var tot = it.reduce(function(s, i) { return s + (i.subtotal || i.price * i.qty); }, 0);
      var g   = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };

      // Montar payload do pedido
      var salePayload = {
        client_code: clientCode, client_name: clientName,
        buyer_razao_social: g('f-razao'), buyer_cnpj: g('f-cnpj'),
        buyer_nome: g('f-nome'), buyer_sobrenome: g('f-sobrenome'),
        buyer_cpf: g('f-cpf'), buyer_nascimento: g('f-nasc') || null,
        buyer_email: g('f-email'), buyer_telefone: g('f-tel'),
        buyer_cep: g('f-cep'), buyer_uf: g('f-uf'), buyer_rua: g('f-rua'),
        buyer_numero: g('f-num'), buyer_complemento: g('f-comp'),
        buyer_bairro: g('f-bairro'), buyer_cidade: g('f-cidade'),
        items: it, total: tot, status: 'pendente'
      };

      // Salvar pedido via API local
      var savedSale = await _api('POST', '/sales', salePayload);

      // Recarregar vendas no admin
      try {
        var freshSales = await _api('GET', '/sales?limit=50&order=created_at.desc');
        DB.sales = (freshSales || []).map(function(s) {
          var items = Array.isArray(s.items) ? s.items : [];
          return { id: s.order_id || s.id, order_id: s.order_id || s.id, _sbId: s.id, hubspot_deal_id: s.hubspot_deal_id || '',
                   clientCode: s.client_code || '', clientName: s.client_name || '',
                   date: s.created_at || new Date().toISOString(), status: s.status || 'pending',
                   items: items.map(function(i) { return { productId: i.productId || i.product_id || 0, name: i.name || '', qty: i.qty || 1, price: parseFloat(i.price) || 0 }; }),
                   franchisee: { razaoSocial: s.buyer_razao_social || '', cnpj: s.buyer_cnpj || '', nome: s.buyer_nome || '', sobrenome: s.buyer_sobrenome || '', cpf: s.buyer_cpf || '', nasc: s.buyer_nascimento || '', email: s.buyer_email || '', tel: s.buyer_telefone || '', cep: s.buyer_cep || '', uf: s.buyer_uf || '', rua: s.buyer_rua || '', numero: s.buyer_numero || '', complemento: s.buyer_complemento || '', bairro: s.buyer_bairro || '', cidade: s.buyer_cidade || '' }
                 };
        });
        if (typeof renderSalesTable    === 'function') try { renderSalesTable(); }    catch(e) {}
        if (typeof renderAdminDashboard=== 'function') try { renderAdminDashboard(); }catch(e) {}
      } catch(e) { console.warn('[DB] reload sales:', e.message); }

      // Criar deal no HubSpot
      try {
        var orderId  = (savedSale && (savedSale.order_id || savedSale.id)) || '';
        var ownerId  = (cl && cl.owner_id) || '';
        var hsPayload = {
          franchisee: { razaoSocial: g('f-razao'), cnpj: g('f-cnpj'), nome: g('f-nome'), sobrenome: g('f-sobrenome'), email: g('f-email'), telefone: g('f-tel'), cpf: g('f-cpf'), nascimento: g('f-nasc'), endereco: { cep: g('f-cep'), rua: g('f-rua'), num: g('f-num'), bairro: g('f-bairro'), cidade: g('f-cidade'), uf: g('f-uf') } },
          hubspotDeal: { dealName: String(orderId), amount: tot, closeDate: new Date().toISOString().split('T')[0], ownerId: ownerId, clientCode: clientCode, clientName: cl ? cl.name : clientCode, segment: cl ? cl.segment : '', lineItems: it.map(function(i) { return { name: i.name, sku: i.sku || '', quantity: i.qty, price: i.price, amount: i.subtotal || i.price * i.qty }; }) }
        };

        // Endpoint HubSpot — sempre API local
        fetch(AWS_API + '/hubspot/order', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, AWS_KEY ? { 'x-api-key': AWS_KEY } : {}),
          body: JSON.stringify(hsPayload)
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d.success && d.dealId && orderId) {
            // Atualizar hubspot_deal_id no banco
            _api('PATCH', '/sales/' + encodeURIComponent(orderId), { hubspot_deal_id: String(d.dealId) }).catch(function(){});
            // Atualizar link no DOM se a linha estiver visível
            var link = document.querySelector('[data-order-id="' + orderId + '"] .hs-link');
            if (link) { link.href = 'https://app.hubspot.com/contacts/9186157/deal/' + d.dealId; link.style.display = ''; }
          }
        }).catch(function(e) { console.error('[HS] Edge Function:', e.message); });
      } catch(e) { console.error('[HS] payload:', e.message); }

    } catch(e) { console.error('[DB] confirmOrder:', e.message); }
    _orig();
  };
  window.confirmOrder._sbPatched = true;
  setTimeout(patchConfirmOrder, 80);
})();

// ── Salvar / atualizar cliente ────────────────────────────────
(function patchSaveClient() {
  if (!window.saveClient || window.saveClient._sbPatched) return;
  var _orig = window.saveClient;
  window.saveClient = async function() {
    var g    = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var code = g('c-code').toUpperCase();
    var name = g('c-name');
    if (!code || !name) { _orig(); return; }

    var ex = DB.clients.find(function(c) { return c.code === code; });
    var vis = [];
    DB.products.forEach(function(p) {
      var cb = document.getElementById('ctog-' + p.id);
      if (cb && cb.checked && p._sbId) vis.push(p._sbId);
    });
    if (!vis.length && ex && ex._sbVis && ex._sbVis.length) vis = ex._sbVis;

    var prices = {};
    DB.products.forEach(function(p) {
      var inp = document.getElementById('cprice-' + p.id);
      if (inp && inp.value) prices[p._sbId || p.id] = parseFloat(inp.value);
    });

    var ownerSel    = document.getElementById('c-owner-id');
    var ownerId     = ownerSel ? (parseInt(ownerSel.value) || null) : null;
    var ownerName   = ownerId ? ((window._ownerNameMap || {})[String(ownerId)] || '') : '';
    var franchiseName = g('c-franchise');
    var seg         = g('c-segment');
    var st          = g('c-status') || 'active';

    var payload = { code: code, name: name, segment: seg, status: st, custom_prices: prices, visible_products: vis, owner_id: ownerId, owner_name: ownerName, franchise_name: franchiseName };

    try {
      if (USE_AWS) {
        await _api(ex ? 'PUT' : 'POST', '/clients' + (ex ? '/' + encodeURIComponent(code) : ''), payload);
      } else {
        await _sb_upsert('clients', payload, 'code');
      }
      // Sincronizar franquia no HubSpot via Lambda/Edge Function
      if (franchiseName) {
        var syncEndpoint = AWS_API + '/hubspot/sync-franchise'; // sempre API local
        fetch(syncEndpoint, {
          method: 'POST',
          headers: USE_AWS
            ? Object.assign({ 'Content-Type': 'application/json' }, AWS_KEY ? { 'x-api-key': AWS_KEY } : {})
            : { 'Content-Type': 'application/json', 'x-api-key': AWS_KEY },
          body: JSON.stringify({ clientCode: code, franchiseName: franchiseName })
        }).catch(function(e) { console.warn('[sync-franchise]', e.message); });
      }
      // Recarregar lista de clientes frescos do banco
      try {
        var fresh = USE_AWS
          ? await _api('GET', '/clients?status=active')
          : await _sb_get('clients', 'select=id,code,name,segment,status,visible_products,custom_prices,owner_id,owner_name,owner_email,franchise_name&status=eq.active&order=code');
        DB.clients = fresh.map(function(c) {
          var v = c.visible_products && c.visible_products.length
            ? c.visible_products.map(function(u) { return window._sbPMap[u]; }).filter(Boolean)
            : DB.products.map(function(p) { return p.id; });
          return { code: c.code, name: c.name, segment: c.segment || '', status: c.status || 'active', owner_id: c.owner_id || null, owner_name: c.owner_name || '', owner_email: c.owner_email || '', franchise_name: c.franchise_name || '', visibleProducts: v, prices: c.custom_prices || {}, _sbId: c.id, _sbVis: c.visible_products || [] };
        });
      } catch(e) { console.warn('[DB] reload clients:', e.message); }
    } catch(e) { console.error('[DB] saveClient:', e.message); }
    closeModal('modal-client');
    if (typeof renderClientsTable    === 'function') try { renderClientsTable(); }    catch(e) {}
    if (typeof renderAdminDashboard  === 'function') try { renderAdminDashboard(); }  catch(e) {}
  };
  window.saveClient._sbPatched = true;
  setTimeout(patchSaveClient, 80);
})();

// ── Salvar produto ────────────────────────────────────────────
(function patchSaveProduct() {
  if (!window.saveProduct || window.saveProduct._sbPatched) return;
  var _orig = window.saveProduct;
  window.saveProduct = async function() {
    var g  = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var id = typeof editingProductId !== 'undefined' ? editingProductId : null;
    var ex = id ? DB.products.find(function(p) { return p.id === id; }) : null;
    var payload = { sku: g('p-sku'), name: g('p-name'), category: g('p-cat'), price: parseFloat(g('p-price')) || 0, description: g('p-desc'), status: g('p-status') || 'active' };
    try {
      if (USE_AWS) {
        await _api(ex ? 'PUT' : 'POST', '/products' + (ex && ex._sbId ? '/' + ex._sbId : ''), payload);
      } else {
        if (ex && ex._sbId) {
          await _api('PUT', '/products/' + encodeURIComponent(ex._sbId), payload);
        } else {
          await _sb_post('products', payload);
        }
      }
      // Recarregar produtos
      var fresh = USE_AWS
        ? await _api('GET', '/products?status=active')
        : await _sb_get('products', 'select=id,sku,category,name,description,price,image_url,is_new,status&status=eq.active&order=category');
      window._sbPMap = {};
      DB.products = fresh.map(function(p, i) {
        window._sbPMap[p.id] = i + 1;
        return { id: i + 1, _sbId: p.id, sku: p.sku || '', category: p.category || 'Geral', name: p.name, desc: p.description || '', basePrice: parseFloat(p.price) || 0, price: parseFloat(p.price) || 0, image: p.image_url || '', imgUrl: p.image_url || '', isNew: p.is_new || false, status: p.status || 'active' };
      });
    } catch(e) { console.error('[DB] saveProduct:', e.message); }
    _orig();
  };
  window.saveProduct._sbPatched = true;
  setTimeout(patchSaveProduct, 80);
})();

// ── Carregar bundles ──────────────────────────────────────────
window.loadBundles = async function() {
  try {
    var rows = USE_AWS
      ? await _api('GET', '/bundles')
      : await _sb_get('product_bundles', 'select=*&order=created_at.desc');
    window.DB_BUNDLES = rows || [];
    return rows || [];
  } catch(e) {
    console.error('[DB] loadBundles:', e.message);
    return [];
  }
};

// ── Buscar opções HubSpot (owners + franquias) ────────────────
window.syncClientModalOptions = async function() {
  var cacheKey = 'nayax_hs_options_cache_v3';
  try {
    var cached = localStorage.getItem(cacheKey);
    if (cached) {
      var d = JSON.parse(cached);
      if (d._exp && Date.now() < d._exp) {
        if (typeof applyOwners    === 'function' && d.owners)     applyOwners(d.owners);
        if (typeof applyFranchises=== 'function' && d.franchises) applyFranchises(d.franchises);
        return;
      }
    }
  } catch(e) {}

  try {
    var endpoint = AWS_API + '/hubspot/options'; // sempre API local
    var headers = USE_AWS
      ? Object.assign({ 'Content-Type': 'application/json' }, AWS_KEY ? { 'x-api-key': AWS_KEY } : {})
      : { 'x-api-key': AWS_KEY };
    var r = await fetch(endpoint, { method: 'GET', headers: headers, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return;
    var data = await r.json();
    if (data && (data.owners || data.franchises)) {
      try { localStorage.setItem(cacheKey, JSON.stringify(Object.assign({}, data, { _exp: Date.now() + 3600000 }))); } catch(e) {}
      if (typeof applyOwners    === 'function' && data.owners)     applyOwners(data.owners);
      if (typeof applyFranchises=== 'function' && data.franchises) applyFranchises(data.franchises);
    }
  } catch(e) { console.warn('[DB] syncClientModalOptions:', e.message); }
};



// Expor helpers internos para os patches nos outros arquivos
window._dbApi       = _api;
window._dbUseAws    = function() { return USE_AWS; };
window._dbAwsApi    = function() { return AWS_API; };
window._dbAwsKey    = function() { return AWS_KEY; };



