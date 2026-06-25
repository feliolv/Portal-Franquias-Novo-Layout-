/* ════════════════════════════════════════════════════════
   API — camada de serviço
   Substitui os arrays mockados em data.jsx por chamadas
   reais à API Node.js do portal (porta 3000 via nginx).

   BASE_URL: vazio = mesmo origin (produção em hera)
   API_KEY:  lido de sessionStorage (salvo no login)

   Padrão de uso:
     const products = await API.getProducts();
     const sale = await API.createSale(payload);

   Todos os métodos retornam o dado diretamente ou lançam
   Error com message legível para exibir no toast.
   ════════════════════════════════════════════════════════ */

const BASE_URL  = '';          // mesmo origin — nginx proxia /api/* → porta 3000
const API_PREFIX = '/api';     // prefixo do nginx: /api/products → node:3000/products

// ── Helpers ──────────────────────────────────────────────

const _headers = () => {
  const token = sessionStorage.getItem('session_token');
  const h = {
    'Content-Type': 'application/json',
    'x-api-key':    'pf-api-nayax-2026',
  };
  if (token) h['Authorization'] = 'Bearer ' + token;
  return h;
};

const _req = async (method, path, body) => {
  const opts = { method, headers: _headers() };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(BASE_URL + API_PREFIX + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
};

const get    = (path)         => _req('GET',    path);
const post   = (path, body)   => _req('POST',   path, body);
const put    = (path, body)   => _req('PUT',    path, body);
const patch  = (path, body)   => _req('PATCH',  path, body);
const del    = (path)         => _req('DELETE', path);

// ── Normalização: API → shape esperado pelo front ────────
// A API retorna snake_case; o front mock usava camelCase em
// alguns campos. Normalizamos aqui para não tocar nas screens.

const _normProduct = (p) => ({
  id:          String(p.id),
  sku:         p.sku,
  name:        p.name,
  cat:         p.category,
  segment:     p.segment || 'Universal',
  price:       Number(p.price || p.base_price || 0),
  oldPrice:    p.old_price ? Number(p.old_price) : undefined,
  badge:       p.badge || undefined,
  short:       p.description || '',
  monthly:     Number(p.monthly_price || 0),
  stock:       p.stock != null ? Number(p.stock) : null,
  new:         Boolean(p.is_new),
  service:     p.category === 'Serviços',
  image:       p.image_url || null,
  status:      p.status || 'active',
});

const _normClient = (c) => ({
  code:        c.code,
  razao:       c.name || c.franchise_name || c.code,
  segment:     c.segment || '',
  city:        c.city || '',
  status:      c.status || 'active',
  orders:      Number(c.orders || 0),
  ltv:         Number(c.ltv || 0),
  last:        c.last_order_at || c.updated_at || null,
  ownerId:     c.owner_id,
  ownerName:   c.owner_name || '',
  ownerEmail:  c.owner_email || '',
  visibleProducts: Array.isArray(c.visible_products)
    ? c.visible_products
    : _safeParse(c.visible_products, []),
  customPrices: _safeParse(c.custom_prices, {}),
});

const _normSale = (s) => ({
  id:          s.order_id || String(s.id),
  code:        s.client_code,
  razao:       s.client_name,
  total:       Number(s.total || 0),
  items:       typeof s.items === 'string' ? JSON.parse(s.items) : (s.items || []),
  status:      s.status,
  when:        s.created_at,
  method:      s.payment_method || '',
  contact:     s.buyer_nome ? `${s.buyer_nome} ${s.buyer_sobrenome||''}`.trim() : '',
  hs:          s.hs_sync_status || 'pending',
  hsDeal:      s.hs_deal_id || null,
  hsError:     s.hs_sync_error || null,
  hsAt:        s.hs_synced_at || null,
  // campos de entrega
  buyer:       {
    razaoSocial: s.buyer_razao_social || '',
    cnpj:        s.buyer_cnpj || '',
    nome:        s.buyer_nome || '',
    sobrenome:   s.buyer_sobrenome || '',
    cpf:         s.buyer_cpf || '',
    email:       s.buyer_email || '',
    telefone:    s.buyer_telefone || '',
    cep:         s.buyer_cep || '',
    uf:          s.buyer_uf || '',
    rua:         s.buyer_rua || '',
    numero:      s.buyer_numero || '',
    complemento: s.buyer_complemento || '',
    bairro:      s.buyer_bairro || '',
    cidade:      s.buyer_cidade || '',
  },
});

const _safeParse = (v, fallback) => {
  if (!v) return fallback;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return fallback; }
};

// ── Auth ─────────────────────────────────────────────────

const Auth = {
  // Login HubSpot OAuth: redireciona o browser
  loginHubSpot: () => {
    window.location.href = BASE_URL + API_PREFIX + '/auth/hubspot';
  },

  // Login via código NX / F01-F02 + senha
  // Retorna { ok, token, user: { code, name, segment, role, tipo } }
  loginCode: async (code, password) => {
    const data = await post('/auth/login-code', { code, password });
    if (data.token) sessionStorage.setItem('session_token', data.token);
    return data;
  },

  // Verifica token salvo — retorna user ou null
  verify: async () => {
    const token = sessionStorage.getItem('session_token');
    if (!token) return null;
    try {
      const data = await post('/auth/verify', { token });
      return data.ok ? data.user : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    sessionStorage.removeItem('session_token');
    sessionStorage.removeItem('portal_user');
  },

  // Salva/lê usuário atual no sessionStorage
  setUser: (u) => sessionStorage.setItem('portal_user', JSON.stringify(u)),
  getUser: ()  => {
    try { return JSON.parse(sessionStorage.getItem('portal_user') || 'null'); }
    catch { return null; }
  },
};

// ── Produtos ─────────────────────────────────────────────

const Products = {
  list: async (onlyActive = true) => {
    const q = onlyActive ? '?status=active' : '';
    const rows = await get('/products' + q);
    return rows.map(_normProduct);
  },

  // Produtos visíveis para um cliente específico
  // Aplica visible_products e custom_prices do client
  listForClient: async (client) => {
    const all = await Products.list(true);
    const visible = client.visibleProducts;
    const prices  = client.customPrices || {};

    const filtered = visible && visible.length > 0
      ? all.filter(p => visible.includes(p.sku) || visible.includes(p.id))
      : all;

    return filtered.map(p => ({
      ...p,
      price: prices[p.sku] !== undefined ? Number(prices[p.sku]) : p.price,
    }));
  },

  create: (data) => post('/products', data),
  update: (id, data) => put('/products/' + id, data),
  remove: (id) => del('/products/' + id),

  // Upload de imagem
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(BASE_URL + API_PREFIX + '/products/upload', {
      method: 'POST',
      headers: { 'x-api-key': 'pf-api-nayax-2026' },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro no upload');
    return data; // { url }
  },
};

// ── Clientes / Franquias ──────────────────────────────────

const Clients = {
  list: async (status) => {
    const q = status ? '?status=' + status : '';
    const rows = await get('/clients' + q);
    return rows.map(_normClient);
  },

  get: async (code) => {
    const row = await get('/clients/' + code.toUpperCase());
    return row ? _normClient(row) : null;
  },

  create: (data) => post('/clients', data),
  update: (code, data) => put('/clients/' + code.toUpperCase(), data),
  patch:  (code, data) => patch('/clients/' + code.toUpperCase(), data),
  remove: (code) => del('/clients/' + code.toUpperCase()),
};

// ── Pedidos / Vendas ──────────────────────────────────────

const Sales = {
  list: async (limit = 100) => {
    const rows = await get('/sales?limit=' + limit);
    return rows.map(_normSale);
  },

  // Pedidos de um cliente específico
  listForClient: async (code, limit = 50) => {
    const rows = await get(`/sales?client_code=${encodeURIComponent(code)}&limit=${limit}`);
    return rows.map(_normSale);
  },

  get: async (id) => {
    const row = await get('/sales/' + id);
    return _normSale(row);
  },

  // Cria pedido a partir do cart do front
  // cartItems: [{ product, qty }]
  create: async (client, cartItems, buyerData, paymentMethod) => {
    const items = cartItems.map(({ product, qty }) => ({
      sku:   product.sku,
      name:  product.name,
      qty,
      price: product.price,
    }));
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const payload = {
      client_code:  client.code,
      client_name:  client.razao,
      items,
      total,
      status:       'pendente',
      payment_method: paymentMethod || '',
      ...buyerData,
    };
    const row = await post('/sales', payload);
    return _normSale(row);
  },

  patch: (orderId, data) => patch('/sales/' + orderId, data),
  remove: (id) => del('/sales/' + id),

  // Reenvia ao HubSpot
  resyncHubSpot: (orderId) => post('/hubspot/order', { order_id: orderId }),
};

// ── Bundles ───────────────────────────────────────────────

const Bundles = {
  list: async () => {
    const rows = await get('/product_bundles');
    return rows.map(b => ({
      ...b,
      trigger_skus: _safeParse(b.trigger_skus, []),
      extra_items:  _safeParse(b.extra_items, []),
      segments:     _safeParse(b.segments, []),
      prices:       _safeParse(b.prices, {}),
    }));
  },
  create: (data) => post('/product_bundles', data),
  update: (id, data) => put('/product_bundles/' + id, data),
  remove: (id) => del('/product_bundles/' + id),
};

// ── HubSpot ───────────────────────────────────────────────

const HubSpot = {
  getProducts: () => get('/hubspot/products'),
  getOptions:  () => get('/hubspot/options'),
};

// ── Equipe / Consultores ──────────────────────────────────

const Team = {
  listConsultants: () => get('/consultants'),
  list:   () => get('/team_members'),
  create: (data) => post('/team_members', data),
  remove: (id) => del('/team_members/' + id),
};

// ── Admins ────────────────────────────────────────────────

const Admins = {
  list: () => get('/admins'),
  create: (data) => post('/admins', data),
};

// ── Expo global ──────────────────────────────────────────

const API = {
  Auth,
  Products,
  Clients,
  Sales,
  Bundles,
  HubSpot,
  Team,
  Admins,
};

Object.assign(window, { API });
