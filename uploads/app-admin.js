// ── Busca global (Ctrl+K) ────────────────────────────────────
(function() {
  var _overlay = null;

  function openGlobalSearch() {
    if (_overlay) return;
    _overlay = document.createElement('div');
    _overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:flex-start;justify-content:center;padding-top:15vh;z-index:99998;';
    _overlay.innerHTML =
      '<div style="background:#fff;border-radius:14px;width:100%;max-width:540px;margin:0 20px;overflow:hidden;border:0.5px solid rgba(0,0,0,0.1);">' +
        '<div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:0.5px solid #f0f0f0;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input id="global-search-input" placeholder="Buscar cliente, produto ou venda..." style="flex:1;border:none;outline:none;font-size:14px;background:transparent;color:#262626;" autofocus>' +
          '<kbd style="font-size:11px;color:#aaa;background:#f5f5f5;padding:2px 6px;border-radius:4px;border:0.5px solid #e0e0e0;">ESC</kbd>' +
        '</div>' +
        '<div id="global-search-results" style="max-height:320px;overflow-y:auto;padding:8px 0;"></div>' +
      '</div>';
    document.body.appendChild(_overlay);

    var inp = document.getElementById('global-search-input');
    inp.addEventListener('input', function(){ runSearch(this.value.trim()); });
    _overlay.addEventListener('click', function(e){ if (e.target === _overlay) closeGlobalSearch(); });
    document.addEventListener('keydown', _onEsc);
  }

  function _onEsc(e){ if (e.key === 'Escape') closeGlobalSearch(); }

  function closeGlobalSearch() {
    if (_overlay) { document.body.removeChild(_overlay); _overlay = null; }
    document.removeEventListener('keydown', _onEsc);
  }

  function runSearch(q) {
    var el = document.getElementById('global-search-results');
    if (!el) return;
    if (!q || q.length < 2) { el.innerHTML = '<div style="padding:20px;text-align:center;font-size:13px;color:#aaa;">Digite para buscar...</div>'; return; }
    var lq = q.toLowerCase();
    var results = [];

    // Clientes
    (typeof DB !== 'undefined' && DB.clients || []).forEach(function(c) {
      if ((c.name||'').toLowerCase().indexOf(lq) > -1 || (c.code||'').toLowerCase().indexOf(lq) > -1) {
        results.push({ type:'cliente', icon:'👤', label: c.name, sub: c.code, action: function(){ closeGlobalSearch(); adminNav('clients'); } });
      }
    });
    // Produtos
    (typeof DB !== 'undefined' && DB.products || []).forEach(function(p) {
      if ((p.name||'').toLowerCase().indexOf(lq) > -1 || (p.sku||'').toLowerCase().indexOf(lq) > -1) {
        results.push({ type:'produto', icon:'📦', label: p.name, sub: p.sku, action: function(){ closeGlobalSearch(); adminNav('products'); } });
      }
    });
    // Vendas
    (typeof DB !== 'undefined' && DB.sales || []).forEach(function(s) {
      if ((s.id||'').toString().toLowerCase().indexOf(lq) > -1 || (s.clientName||'').toLowerCase().indexOf(lq) > -1) {
        results.push({ type:'venda', icon:'🧾', label: s.clientName || s.clientCode, sub: s.id + ' · R$ ' + parseFloat(s.total||0).toLocaleString('pt-BR'), action: function(){ closeGlobalSearch(); adminNav('sales'); } });
      }
    });

    if (!results.length) { el.innerHTML = '<div style="padding:20px;text-align:center;font-size:13px;color:#aaa;">Sem resultados para "' + q + '"</div>'; return; }

    el.innerHTML = results.slice(0,8).map(function(r) {
      return '<div class="_gs-item" style="display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;transition:background .1s;" ' +
        'onmouseover="this.style.background=\"#f9f8f5\"" onmouseout="this.style.background=\"\"">' +
        '<span style="font-size:16px">' + r.icon + '</span>' +
        '<div><div style="font-size:13px;font-weight:500;color:#262626;">' + r.label + '</div>' +
        '<div style="font-size:11px;color:#888;">' + r.type + ' · ' + r.sub + '</div></div>' +
        '</div>';
    }).join('');

    results.slice(0,8).forEach(function(r, i) {
      el.querySelectorAll('._gs-item')[i].addEventListener('click', r.action);
    });
  }

  window.openGlobalSearch = openGlobalSearch;

  // Atalho Ctrl+K ou /
  document.addEventListener('keydown', function(e) {
    var screen = document.querySelector('.screen.active');
    var isAdmin = screen && screen.id === 'screen-admin';
    if (!isAdmin) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openGlobalSearch(); }
  });
})();

function setDashFilter(period, btn) {
  window._dashFilter = period;
  // Atualizar botões ativos
  ['today','yesterday','week','month','3months','all','custom'].forEach(function(p) {
    var el = document.getElementById('df-' + p);
    if (el) { el.className = p === period ? 'btn-sm yellow' : 'btn-sm ghost'; }
  });
  // Mostrar/ocultar datas customizadas
  var wrap = document.getElementById('df-custom-wrap');
  if (wrap) wrap.style.display = period === 'custom' ? 'flex' : 'none';
  // Atualizar KPIs e gráficos
  renderAdminDashboard();
}


// ── EXPORTAR DADOS CSV ────────────────────────────────────────
function exportSalesCSV() {
  const rows = DB.sales.map(s => {
    const total = s.items.reduce((ss, i) => ss + i.price * i.qty, 0);
    const prods = s.items.map(i => i.name + ' x' + i.qty).join(' | ');
    return [s.id||'', s.clientCode||'', s.clientName||'', (s.date||'').substring(0,10), prods, total.toFixed(2), s.status||''].join(';');
  });
  const header = 'ID;Código Cliente;Nome;Data;Produtos;Total;Status';
  _downloadCSV([header, ...rows].join('\n'), 'vendas_' + new Date().toISOString().substring(0,10) + '.csv');
}
function exportClientsCSV() {
  const rows = DB.clients.map(c => [c.code||'', c.name||'', c.segment||'', c.franchise_name||'', c.status||'', (c.visibleProducts||[]).length].join(';'));
  const header = 'Código;Nome;Segmento;Franquia;Status;Produtos visíveis';
  _downloadCSV([header, ...rows].join('\n'), 'clientes_' + new Date().toISOString().substring(0,10) + '.csv');
}
function exportRankingCSV() {
  const stats = DB.clients.map(cl => {
    const sales = DB.sales.filter(s => s.clientCode === cl.code);
    const vol = sales.reduce((s, sale) => s + sale.items.reduce((ss, i) => ss + i.price * i.qty, 0), 0);
    return { name: cl.name, code: cl.code, orders: sales.length, vol };
  }).sort((a,b) => b.vol - a.vol);
  const rows = stats.map((s,i) => [i+1, s.code, s.name, s.orders, s.vol.toFixed(2)].join(';'));
  const header = 'Posição;Código;Nome;Pedidos;Volume';
  _downloadCSV([header, ...rows].join('\n'), 'ranking_' + new Date().toISOString().substring(0,10) + '.csv');
}
function _downloadCSV(content, filename) {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast('Exportado: ' + filename);
}

// ── AVATAR INICIAIS COLORIDAS ─────────────────────────────────
function _avatar(name, size) {
  size = size || 28;
  const colors = ['#6D5BF7','#25EF89','#FF5C6C','#FFCD00','#378ADD','#D85A30','#1D9E75'];
  const initials = (name||'?').trim().split(' ').slice(0,2).map(function(w){return w[0]||'';}).join('').toUpperCase()||'?';
  const bg = colors[(name||'').charCodeAt(0) % colors.length];
  const fg = bg === '#FFCD00' ? '#262626' : '#fff';
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+bg+';color:'+fg+';font-size:'+Math.round(size*0.38)+'px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">'+initials+'</div>';
}

// ── ORDENAÇÃO DE TABELAS ──────────────────────────────────────
var _sortState = {};
function _sortTable(tableKey, col) {
  if (!_sortState[tableKey]) _sortState[tableKey] = { col: null, dir: 1 };
  var st = _sortState[tableKey];
  st.dir = (st.col === col) ? -st.dir : 1;
  st.col = col;
  if (tableKey === 'clients') renderClientsTable(document.getElementById('clients-search')?.value||'');
  if (tableKey === 'products') renderProductsTable(document.getElementById('products-search')?.value||'');
  if (tableKey === 'sales') renderSalesTable();
  if (tableKey === 'team') renderTeamTable();
}
function _sortIcon(tableKey, col) {
  const st = _sortState[tableKey];
  if (!st || st.col !== col) return '<span style="opacity:.3;font-size:9px;margin-left:3px;">⇅</span>';
  return st.dir === 1 ? '<span style="font-size:9px;margin-left:3px;">↑</span>' : '<span style="font-size:9px;margin-left:3px;">↓</span>';
}
function _sortRows(rows, tableKey, fields) {
  const st = _sortState[tableKey];
  if (!st || !st.col || !fields[st.col]) return rows;
  const field = fields[st.col];
  if (!rows || !Array.isArray(rows)) return rows || [];
  return [...rows].sort(function(a,b) {
    const av = field(a), bv = field(b);
    if (typeof av === 'number') return (av - bv) * st.dir;
    return String(av).localeCompare(String(bv)) * st.dir;
  });
}

// ── EMPTY STATES ──────────────────────────────────────────────
function _emptyState(icon, title, subtitle, action) {
  const btn = action ? '<button onclick="'+action.fn+'()" style="margin-top:14px;background:#FFCD00;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:700;cursor:pointer;">'+action.label+'</button>' : '';
  return '<tr><td colspan="10" style="text-align:center;padding:40px 20px;"><div style="font-size:32px;margin-bottom:10px;">'+icon+'</div><div style="font-size:14px;font-weight:600;color:#444;margin-bottom:4px;">'+title+'</div><div style="font-size:12px;color:#999;">'+subtitle+'</div>'+btn+'</td></tr>';
}

// ── TOGGLE VISUALIZAÇÃO CARDS/TABELA ──────────────────────────
var _viewMode = { clients: 'table', products: 'table' };
function toggleViewMode(section) {
  _viewMode[section] = _viewMode[section] === 'table' ? 'cards' : 'table';
  const btn = document.getElementById('view-toggle-' + section);
  if (btn) btn.innerHTML = _viewMode[section] === 'table' ? '&#x2612; Cards' : '&#x2630; Tabela';
  if (section === 'clients') renderClientsTable(document.getElementById('clients-search')?.value||'');
  if (section === 'products') renderProductsTable(document.getElementById('products-search')?.value||'');
}

// ── DETALHE DO PEDIDO ─────────────────────────────────────────
function showSaleDetail(id) {
  const s = DB.sales.find(function(x){ return x.id === id || x.order_id === id; });
  if (!s) return;
  const cl = DB.clients.find(function(c){ return c.code === s.clientCode; });
  const total = s.items.reduce(function(ss, i){ return ss + i.price * i.qty; }, 0);
  const statusColor = s.status === 'confirmed' ? '#3B6D11' : s.status === 'cancelled' ? '#A32D2D' : '#92600A';
  const statusBg    = s.status === 'confirmed' ? '#EAF3DE' : s.status === 'cancelled' ? '#FCEBEB' : '#FFF7E0';
  const statusLabel = s.status === 'confirmed' ? (t('btn.confirm')||'Confirmado') : s.status === 'cancelled' ? 'Cancelado' : (t('btn.pending')||'Pendente');
  const rows = s.items.map(function(i){ return '<tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;font-size:13px;">'+i.name+'</td><td style="padding:8px 0;font-size:13px;text-align:center;">'+i.qty+'</td><td style="padding:8px 0;font-size:13px;text-align:right;">R$ '+(i.price*i.qty).toLocaleString('pt-BR',{minimumFractionDigits:2})+'</td></tr>'; }).join('');
  const confirmBtn = s.status === 'pending' ? '<button onclick="toggleSaleStatus(\''+( s.id||s.order_id)+'\');this.closest(\'.sale-detail-overlay\').remove()" style="background:#FFCD00;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer;">'+(t('checkout.confirm')||'Confirmar pedido')+'</button>' : '';
  const modalHtml = '<div class="sale-detail-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)this.remove()">'
    + '<div style="background:#fff;border-radius:14px;width:520px;max-width:95vw;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;">'
    + '<div style="background:#262626;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">'
    +   '<div><div style="color:#fff;font-size:15px;font-weight:600;">'+(s.id||s.order_id||'—')+'</div><div style="color:rgba(255,255,255,0.5);font-size:12px;">'+(s.date||'').substring(0,10)+'</div></div>'
    +   '<div style="display:flex;align-items:center;gap:10px;"><span style="background:'+statusBg+';color:'+statusColor+';font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">'+statusLabel+'</span>'
    +   '<button onclick="this.closest(\'.sale-detail-overlay\').remove()" style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:22px;cursor:pointer;line-height:1;">×</button></div></div>'
    + '<div style="padding:18px 20px;overflow-y:auto;flex:1;">'
    +   '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">'
    +     '<div style="background:#F9F7F2;border-radius:8px;padding:12px;"><div style="font-size:10px;font-weight:600;color:#888;text-transform:uppercase;margin-bottom:4px;">Cliente</div><div style="font-size:13px;font-weight:600;">'+(cl?cl.name:s.clientCode)+'</div><div style="font-size:12px;color:#666;">'+s.clientCode+'</div></div>'
    +     '<div style="background:#F9F7F2;border-radius:8px;padding:12px;"><div style="font-size:10px;font-weight:600;color:#888;text-transform:uppercase;margin-bottom:4px;">Total</div><div style="font-size:20px;font-weight:700;color:#262626;">R$ '+total.toLocaleString('pt-BR',{minimumFractionDigits:2})+'</div><div style="font-size:12px;color:#666;">'+s.items.length+' '+(s.items.length===1?'item':'itens')+'</div></div>'
    +   '</div>'
    +   '<div style="font-size:11px;font-weight:600;color:#888;text-transform:uppercase;margin-bottom:8px;">Produtos</div>'
    +   '<table style="width:100%;"><thead><tr style="border-bottom:2px solid #f0f0f0;"><th style="text-align:left;font-size:11px;color:#888;padding:0 0 6px;font-weight:600;">Produto</th><th style="text-align:center;font-size:11px;color:#888;padding:0 0 6px;font-weight:600;">Qtd</th><th style="text-align:right;font-size:11px;color:#888;padding:0 0 6px;font-weight:600;">Total</th></tr></thead><tbody>'+rows+'</tbody>'
    +   '<tfoot><tr><td colspan="2" style="text-align:right;font-size:12px;font-weight:600;padding:10px 0 0;color:#666;">Total</td><td style="text-align:right;font-size:14px;font-weight:700;padding:10px 0 0;">R$ '+total.toLocaleString('pt-BR',{minimumFractionDigits:2})+'</td></tr></tfoot></table>'
    + '</div>'
    + '<div style="padding:12px 20px;border-top:1px solid #f0f0f0;display:flex;gap:8px;justify-content:flex-end;">'+confirmBtn+'<button onclick="this.closest(\'.sale-detail-overlay\').remove()" style="background:#f0f0f0;border:none;border-radius:8px;padding:8px 18px;font-size:13px;cursor:pointer;">Fechar</button></div>'
    + '</div></div>';
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}


// ── BUSCA GLOBAL ──────────────────────────────────────────────
function _globalSearch(q) {
  q = (q||'').toLowerCase().trim();
  if (!q) return;
  // Navegar para a aba mais relevante e aplicar busca
  const hasClient = DB.clients.some(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  const hasSale = DB.sales.some(s => (s.id||'').toLowerCase().includes(q) || (s.clientName||'').toLowerCase().includes(q) || (s.clientCode||'').toLowerCase().includes(q));
  const hasProduct = DB.products.some(p => p.name.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q));
  if (hasSale) {
    adminNav('sales'); 
    const ss = document.getElementById('sales-search');
    if (ss) { ss.value = q; renderSalesTable(); }
  } else if (hasClient) {
    adminNav('clients');
    const cs = document.getElementById('clients-search');
    if (cs) { cs.value = q; renderClientsTable(q); }
  } else if (hasProduct) {
    adminNav('products');
    const ps = document.getElementById('products-search');
    if (ps) { ps.value = q; renderProductsTable(q); }
  }
}

// ── ATALHOS DE TECLADO ────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (!window._adminReady) return;
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(function(m){ m.classList.remove('active'); m.style.display = 'none'; });
    const dyn = document.querySelector('.sale-detail-overlay');
    if (dyn) dyn.remove();
    return;
  }
  if ((e.ctrlKey||e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const gs = document.getElementById('global-search-input');
    if (gs) { gs.focus(); gs.select(); }
    return;
  }
  if ((e.ctrlKey||e.metaKey) && e.key === 'n') {
    e.preventDefault();
    const activeSection = document.querySelector('.admin-section.active');
    if (!activeSection) return;
    const sid = activeSection.id;
    if (sid === 'adm-clients') openClientModal();
    if (sid === 'adm-products') openProductModal();
    if (sid === 'adm-equipe') openMemberModal();
  }
});

// ── Filtro rápido dashboard ──────────────────────────────────
var _dashFilter = 'month'; // week | month | year | all

function setDashFilter(f, el) {
  _dashFilter = f;
  document.querySelectorAll('.dash-filter-btn').forEach(function(b){ b.style.background='transparent'; b.style.color='#888'; b.style.borderColor='#e0e0e0'; });
  if (el) { el.style.background='#262626'; el.style.color='#FFCD00'; el.style.borderColor='#262626'; }
  renderAdminDashboard();
}

function getDashSales() {
  var sales = (typeof DB !== 'undefined' && DB.sales) || [];
  if (_dashFilter === 'all') return sales;
  var now = new Date();
  var cutoff;
  if (_dashFilter === 'week')  cutoff = new Date(now - 7*24*60*60*1000);
  if (_dashFilter === 'month') cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
  if (_dashFilter === 'year')  cutoff = new Date(now.getFullYear(), 0, 1);
  return sales.filter(function(s){ try { return new Date(s.date||s.created_at) >= cutoff; } catch(e){ return true; } });
}

function renderAdminDashboard() {
  var filter = (typeof window._dashFilter !== 'undefined') ? window._dashFilter : 'today';
  var now = new Date();

  function parseLocalDate(str) {
    if (!str) return new Date();
    var parts = String(str).split('T')[0].split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
  }

  var allSales = DB.sales || [];
  var sales = allSales.filter(function(s) {
    var d = parseLocalDate(s.date);
    if (filter === 'today')    return d.toDateString() === now.toDateString();
    if (filter === 'yesterday') {
      var y = new Date(now); y.setDate(y.getDate()-1);
      return d.toDateString() === y.toDateString();
    }
    if (filter === 'week') {
      var w = new Date(now); w.setDate(w.getDate()-7);
      return d >= w;
    }
    if (filter === 'month') {
      var m = new Date(now); m.setDate(m.getDate()-30);
      return d >= m;
    }
    if (filter === '3months') {
      var m3 = new Date(now); m3.setDate(m3.getDate()-90);
      return d >= m3;
    }
    if (filter === 'custom') {
      var from = document.getElementById('df-from')?.value;
      var to   = document.getElementById('df-to')?.value;
      var ds = s.date ? String(s.date).split('T')[0] : '';
      if (from && ds < from) return false;
      if (to   && ds > to)   return false;
      return true;
    }
    return true; // 'all'
  });

  var clients  = DB.clients || [];
  var products = DB.products || [];
  var totalVol = sales.reduce(function(s,sale){return s+sale.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);},0);
  var ticketMed = sales.length ? Math.round(totalVol/sales.length) : 0;

  var periodLabel = {
    today:'Hoje', yesterday:'Ontem', week:'Últimos 7 dias',
    month:'Últimos 30 dias', '3months':'Últimos 3 meses', all:'Todo período', custom:'Período personalizado'
  }[filter] || '';

  const dashStats = document.getElementById('dash-stats'); if (!dashStats) return;
  dashStats.innerHTML =
    '<div class="stat-card"><div class="stat-card-label">Total de clientes</div><div class="stat-card-val">' + clients.length + '</div><div class="stat-card-sub">' + clients.filter(function(c){return c.status==='active';}).length + ' ativos</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">Total de produtos</div><div class="stat-card-val">' + products.filter(function(p){return p.status==='active';}).length + '</div><div class="stat-card-sub">' + products.length + ' no catálogo</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">Pedidos recebidos</div><div class="stat-card-val yellow">' + sales.length + '</div><div class="stat-card-sub">' + (sales.length ? 'ticket médio R$ ' + ticketMed.toLocaleString('pt-BR') : periodLabel) + '</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">Volume total</div><div class="stat-card-val green">R$ ' + totalVol.toLocaleString('pt-BR',{minimumFractionDigits:0}) + '</div><div class="stat-card-sub">' + periodLabel + '</div></div>';

  setTimeout(function(){ if(typeof Chart !== 'undefined'){ renderDashCharts(); } else { setTimeout(renderDashCharts, 800); } renderNotificationBell(); }, 300);
}


function renderDashAlerts() {
  // Mantido por compatibilidade — agora os alertas ficam no sino
  renderNotificationBell();
}

// ══════════════════════════════════════════════════════════════
// NOTIFICAÇÕES — com lido/concluído persistido em localStorage
// ══════════════════════════════════════════════════════════════

var _NOTIF_STORE_KEY = 'nayax_notif_dismissed';

// Retorna conjunto de IDs de alertas já dispensados
function _getNotifDismissed() {
  try { return new Set(JSON.parse(localStorage.getItem(_NOTIF_STORE_KEY) || '[]')); }
  catch(e) { return new Set(); }
}
function _saveNotifDismissed(set) {
  try { localStorage.setItem(_NOTIF_STORE_KEY, JSON.stringify([...set])); } catch(e) {}
}

// Gera um ID estável para cada tipo de alerta
function _alertId(a) { return a.type + ':' + a.key; }

function _getAlerts() {
  var alerts = [];
  var now = new Date();

  // ── Pedidos sem deal no HubSpot ──────────────────────────
  var noHub = (DB.sales||[]).filter(function(s){ return !s.hubspot_deal_id; });
  if (noHub.length > 0) {
    var noHubLabels = noHub.slice(0, 2).map(function(s) {
      var num = typeof s.id === 'string' && s.id.startsWith('PED') ? s.id.split(' - ')[0]
              : (s.order_id||'').split(' - ')[0] || '—';
      var cli = s.clientName || s.clientCode || '';
      return num + (cli ? ' · ' + cli : '');
    });
    var extra = noHub.length > 2 ? ' +' + (noHub.length - 2) + ' mais' : '';
    alerts.push({
      type: 'yellow', icon: '⚠',
      key:  'nohub_' + noHub.length,
      title: noHub.length + (noHub.length === 1 ? ' pedido sem' : ' pedidos sem') + ' deal no HubSpot',
      sub:  noHubLabels.join(' / ') + extra,
      nav:  'sales'
    });
  }

  // ── Clientes inativos há 30+ dias ────────────────────────
  var inactive = (DB.clients||[]).filter(function(c) {
    if (c.status !== 'active') return false;
    var s = (DB.sales||[]).filter(function(x){ return x.clientCode === c.code; });
    if (!s.length) return true;
    var last = new Date(Math.max.apply(null, s.map(function(x){ return new Date(x.date); })));
    return (now - last) > 30*24*60*60*1000;
  });
  if (inactive.length > 0) {
    var inactiveNames = inactive.slice(0, 2).map(function(c){ return c.name || c.code; });
    var extraI = inactive.length > 2 ? ' +' + (inactive.length - 2) + ' mais' : '';
    alerts.push({
      type: 'blue', icon: '👥',
      key:  'inactive_' + inactive.length,
      title: inactive.length + (inactive.length === 1 ? ' cliente sem' : ' clientes sem') + ' pedido há 30+ dias',
      sub:  inactiveNames.join(', ') + extraI,
      nav:  'clients'
    });
  }

  // ── Pedidos de hoje ───────────────────────────────────────
  var today = (DB.sales||[]).filter(function(s){
    return new Date(s.date).toDateString() === now.toDateString();
  });
  if (today.length > 0) {
    var total = today.reduce(function(a,s){
      return a + s.items.reduce(function(ss,i){ return ss+(parseFloat(i.price)||0)*(i.qty||1); }, 0);
    }, 0);
    var clientesHoje = [...new Set(today.map(function(s){ return s.clientName || s.clientCode; }))].slice(0,2).join(', ');
    alerts.push({
      type: 'green', icon: '✓',
      key:  'today_' + now.toDateString() + '_' + today.length,
      title: today.length + (today.length === 1 ? ' pedido recebido' : ' pedidos recebidos') + ' hoje',
      sub:  clientesHoje + ' · R$ ' + total.toLocaleString('pt-BR', {minimumFractionDigits:0}),
      nav:  'sales'
    });
  }

  return alerts;
}

function dismissNotif(alertId, ev) {
  if (ev) ev.stopPropagation();
  var dismissed = _getNotifDismissed();
  dismissed.add(alertId);
  _saveNotifDismissed(dismissed);
  renderNotificationBell();
}

function clearAllNotif() {
  var dismissed = _getNotifDismissed();
  _getAlerts().forEach(function(a){ dismissed.add(_alertId(a)); });
  _saveNotifDismissed(dismissed);
  renderNotificationBell();
}

function renderNotificationBell() {
  var bell = document.getElementById('notif-bell-wrap');
  if (!bell) return;

  var allAlerts  = _getAlerts();
  var dismissed  = _getNotifDismissed();
  var unread     = allAlerts.filter(function(a){ return !dismissed.has(_alertId(a)); });
  var readAlerts = allAlerts.filter(function(a){ return  dismissed.has(_alertId(a)); });

  // Badge — só não lidas
  var badge = document.getElementById('notif-badge');
  if (badge) {
    badge.textContent = unread.length;
    badge.style.display = unread.length ? 'flex' : 'none';
  }

  var dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;

  if (!allAlerts.length) {
    dropdown.innerHTML = '<div style="padding:28px 16px;text-align:center;">' +
      '<div style="font-size:28px;margin-bottom:8px;">🔔</div>' +
      '<div style="font-size:13px;font-weight:600;color:var(--black);">Tudo em dia!</div>' +
      '<div style="font-size:12px;color:var(--text-hint);margin-top:4px;">Nenhuma notificação pendente</div>' +
      '</div>';
    return;
  }

  var bg     = { yellow:'#FFF7D6', blue:'#EFF6FF', green:'#ECFDF5' };
  var border = { yellow:'#fde68a', blue:'#bfdbfe', green:'#a7f3d0' };
  var color  = { yellow:'#92400e', blue:'#1e40af', green:'#065f46' };
  var iconBg = { yellow:'#fef3c7', blue:'#dbeafe', green:'#d1fae5' };

  function renderItem(a, isRead) {
    var id = _alertId(a);
    var dimStyle = isRead ? 'opacity:0.45;' : '';
    return '<div style="padding:14px 16px;border-bottom:1px solid var(--gray-mid);display:flex;align-items:flex-start;gap:12px;' + dimStyle + 'position:relative;" class="notif-item">' +
      // Ponto de não lida
      (!isRead ? '<span style="position:absolute;top:16px;left:6px;width:6px;height:6px;background:var(--danger);border-radius:50%;"></span>' : '') +
      // Ícone
      '<div style="width:32px;height:32px;border-radius:8px;background:' + iconBg[a.type] + ';border:1.5px solid ' + border[a.type] + ';display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;margin-top:1px;cursor:pointer;" onclick="adminNav(\'' + a.nav + '\',null);toggleNotifDropdown(false);">' + a.icon + '</div>' +
      // Texto
      '<div style="flex:1;min-width:0;cursor:pointer;" onclick="adminNav(\'' + a.nav + '\',null);toggleNotifDropdown(false);">' +
        '<div style="font-size:13px;font-weight:' + (isRead ? '400' : '600') + ';color:var(--black);line-height:1.35;margin-bottom:3px;">' + a.title + '</div>' +
        (a.sub ? '<div style="font-size:11px;color:var(--text-muted);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">' + a.sub + '</div>' : '') +
      '</div>' +
      // Ação lido/não lido
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">' +
        (!isRead
          ? '<button onclick="dismissNotif(\'' + id + '\',event)" title="Marcar como lido" class="notif-dismiss-btn">✓</button>'
          : '<span style="font-size:10px;font-weight:600;color:var(--text-hint);background:var(--gray-mid);padding:2px 7px;border-radius:10px;white-space:nowrap;">Lido</span>'
        ) +
      '</div>' +
    '</div>';
  }

  var html = '';

  // Não lidas
  if (unread.length) {
    html += '<div style="padding:6px 16px 4px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-hint);background:#fafaf8;border-bottom:1px solid var(--gray-mid);">Não lidas · ' + unread.length + '</div>';
    html += unread.map(function(a){ return renderItem(a, false); }).join('');
  }

  // Lidas
  if (readAlerts.length) {
    html += '<div style="padding:6px 16px 4px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-hint);background:#fafaf8;border-bottom:1px solid var(--gray-mid);">Lidas</div>';
    html += readAlerts.map(function(a){ return renderItem(a, true); }).join('');
  }

  // Rodapé — marcar todas como lidas
  if (unread.length > 0) {
    html += '<div style="padding:10px 16px;text-align:center;border-top:1px solid var(--gray-mid);">' +
      '<button onclick="clearAllNotif()" class="notif-clear-btn">✓ Marcar todas como lidas</button>' +
      '</div>';
  }

  dropdown.innerHTML = html;
}

function toggleNotifDropdown(force) {
  var dd = document.getElementById('notif-dropdown-wrap');
  if (!dd) return;
  var isOpen = dd.style.display === 'block';
  var shouldOpen = force === true || (!isOpen && force !== false);
  dd.style.display = shouldOpen ? 'block' : 'none';
  if (shouldOpen) {
    var btn = document.getElementById('notif-bell-btn');
    if (btn) {
      var rect = btn.getBoundingClientRect();
      dd.style.top  = (rect.bottom + 8) + 'px';
      dd.style.right = (window.innerWidth - rect.right) + 'px';
    }
    renderNotificationBell();
  }
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(e) {
  var dd   = document.getElementById('notif-dropdown-wrap');
  var wrap = document.getElementById('notif-bell-wrap');
  if (!dd || !wrap) return;
  if (dd.style.display === 'block' && !wrap.contains(e.target) && !dd.contains(e.target)) {
    toggleNotifDropdown(false);
  }
});;


function renderDashCharts() {
  var filter = (typeof window._dashFilter !== "undefined") ? window._dashFilter : "all";
  var now = new Date();
  function parseLocalDate(str) {
    if (!str) return new Date();
    var parts = String(str).split("T")[0].split("-");
    return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
  }
  var sales = (DB.sales||[]).filter(function(s){
    var d = parseLocalDate(s.date);
    if(filter==="today") return d.toDateString()===now.toDateString();
    if(filter==="yesterday"){var y=new Date(now);y.setDate(y.getDate()-1);return d.toDateString()===y.toDateString();}
    if(filter==="week"){var w=new Date(now);w.setDate(w.getDate()-7);return d>=w;}
    if(filter==="month"){var m=new Date(now);m.setMonth(m.getMonth()-1);return d>=m;}
    if(filter==="3months"){var t=new Date(now);t.setMonth(t.getMonth()-3);return d>=t;}
    return true;
  });

  // ── Gráfico de barras: volume no tempo ──
  var volLabels=[], volData=[];
  var monthNames=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  if(filter==="today"||filter==="yesterday"){
    var hrs=["00h","04h","08h","12h","16h","20h"];
    var buckets=[0,0,0,0,0,0];
    sales.forEach(function(s){var h=parseLocalDate(s.date).getHours();var b=Math.min(Math.floor(h/4),5);var v=s.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);buckets[b]+=v;});
    volLabels=hrs; volData=buckets;
  } else if(filter==="week"){
    // Últimos 7 dias com data real
    var wLabels=[],wData=[];
    for(var wi=6;wi>=0;wi--){
      var wd=new Date(now.getFullYear(),now.getMonth(),now.getDate()-wi);
      var wk=wd.getDate()+"/"+(wd.getMonth()+1);
      wLabels.push(wk); wData.push(0);
    }
    sales.forEach(function(s){
      var d=parseLocalDate(s.date);
      var k=d.getDate()+"/"+(d.getMonth()+1);
      var wi=wLabels.indexOf(k);
      if(wi>=0){var v=s.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);wData[wi]+=v;}
    });
    volLabels=wLabels; volData=wData;
  } else if(filter==="month"){
    // Dias do mês atual
    var daysInMonth=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
    for(var di=1;di<=daysInMonth;di++){volLabels.push(di+"/"+(now.getMonth()+1));volData.push(0);}
    sales.forEach(function(s){
      var d=parseLocalDate(s.date);
      if(d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()){
        var k=d.getDate()+"/"+(d.getMonth()+1);
        var di2=volLabels.indexOf(k);
        if(di2>=0){var v=s.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);volData[di2]+=v;}
      }
    });
  } else {
    // 3 meses, Tudo, custom → agrupar por mês
    var numMonths=filter==="3months"?3:filter==="all"?12:6;
    var months={};
    for(var mi=numMonths-1;mi>=0;mi--){
      var md=new Date(now.getFullYear(),now.getMonth()-mi,1);
      var mk=(md.getMonth()+1).toString().padStart(2,"0")+"/"+md.getFullYear();
      months[mk]=0;
    }
    sales.forEach(function(s){
      var d=parseLocalDate(s.date);
      var k=(d.getMonth()+1).toString().padStart(2,"0")+"/"+d.getFullYear();
      if(months[k]!==undefined)months[k]+=s.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);
    });
    var keys=Object.keys(months).sort();
    volLabels=keys.map(function(k){var p=k.split("/");return monthNames[parseInt(p[0])-1]+" "+p[1];});
    volData=keys.map(function(k){return months[k];});
  }
  var isDark=window.matchMedia("(prefers-color-scheme:dark)").matches;
  var gridColor=isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)";
  var textColor=isDark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.4)";
  var ctxV=document.getElementById("dashChartVolume");
  if(ctxV){
    if(window._dashVolChart){window._dashVolChart.destroy();}
    Chart.defaults.font.family="inherit";Chart.defaults.font.size=11;Chart.defaults.color=textColor;
    var maxVal=Math.max.apply(null,volData.concat([1]));
    window._dashVolChart=new Chart(ctxV.getContext("2d"),{
      type:"bar",
      data:{labels:volLabels,datasets:[{data:volData,backgroundColor:"#FFCD00",borderRadius:4,maxBarThickness:48}]},
      options:{responsive:true,maintainAspectRatio:false,
        layout:{padding:{top:8}},
        plugins:{legend:{display:false},tooltip:{callbacks:{title:function(items){return items[0].label;},label:function(c){return "R$ "+c.parsed.y.toLocaleString("pt-BR",{minimumFractionDigits:0});}},backgroundColor:"#111",titleColor:"#fff",bodyColor:"#FFCD00",padding:10,cornerRadius:8,displayColors:false}},
        scales:{
          x:{grid:{color:gridColor},ticks:{font:{size:11}}},
          y:{grid:{color:gridColor},min:0,max:Math.ceil(maxVal*1.3/1000)*1000||5000,
            ticks:{callback:function(v){return v===0?"R$ 0":"R$"+Math.round(v/1000)+"k";},maxTicksLimit:5}}
        }
      }
    });
  }

  // ── Segmentos ──
  var segColors={"MICRO MARKET":"#FFCD00","VENDING MACHINE":"#378ADD","LAVANDERIA":"#1D9E75","FOOD":"#D85A30","CARROS ELETRICOS":"#7F77DD","OUTROS":"#B4B2A9"};
  var segTotals={};
  sales.forEach(function(s){
    var cl=DB.clients.find(function(c){return c.code===s.clientCode;});
    var seg=((cl&&cl.segment)||"OUTROS").toUpperCase().replace(/[ÁÀÃÂ]/g,"A").replace(/[ÉÊ]/g,"E").replace(/[Í]/g,"I").replace(/[ÓÔÕ]/g,"O").replace(/[Ú]/g,"U");
    var v=s.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);
    segTotals[seg]=(segTotals[seg]||0)+v;
  });
  var allSegs=["MICRO MARKET","VENDING MACHINE","LAVANDERIA","FOOD","CARROS ELETRICOS","OUTROS"];
  var maxSeg=Math.max.apply(null,allSegs.map(function(s){return segTotals[s]||0;}));
  var segEl=document.getElementById("dash-segmentos-list");
  if(segEl){
    segEl.innerHTML=allSegs.map(function(seg){
      var v=segTotals[seg]||0;
      var pct=maxSeg>0?Math.round(v/maxSeg*100):0;
      var pctTotal=sales.length>0&&maxSeg>0?Math.round(v/Object.values(segTotals).reduce(function(a,b){return a+b;},1)*100):0;
      var color=segColors[seg]||"#B4B2A9";
      var label=seg.charAt(0)+seg.slice(1).toLowerCase();
      return "<div style=\"display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:0.5px solid var(--gray-line);\">" +
        "<div style=\"width:8px;height:8px;border-radius:50%;background:"+color+";flex-shrink:0;\"></div>" +
        "<div style=\"flex:1;\">" +
          "<div style=\"font-size:12px;font-weight:500;color:var(--black);\">"+label+"</div>" +
          "<div style=\"height:3px;background:var(--gray-bg);border-radius:2px;margin-top:3px;\">" +
            "<div style=\"height:3px;width:"+pct+"%;background:"+color+";border-radius:2px;\"></div>" +
          "</div>" +
        "</div>" +
        "<div style=\"text-align:right;\">" +
          "<div style=\"font-size:12px;font-weight:500;color:var(--black);\">"+(v>0?"R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:0}):"R$ 0")+"</div>" +
          "<div style=\"font-size:11px;color:#888;\">"+pctTotal+"%</div>" +
        "</div></div>";
    }).join("");
  }

  // ── Ranking clientes ──
  var clientVol={};
  sales.forEach(function(s){var v=s.items.reduce(function(ss,i){return ss+(parseFloat(i.price)||0)*(i.qty||1);},0);clientVol[s.clientCode]=(clientVol[s.clientCode]||0)+v;});
  var rankClients=Object.keys(clientVol).sort(function(a,b){return clientVol[b]-clientVol[a];}).slice(0,5);
  var maxCli=rankClients.length?clientVol[rankClients[0]]:1;
  var rankEl=document.getElementById("dash-ranking-list");
  if(rankEl){
    if(!rankClients.length){rankEl.innerHTML="<div style=\"font-size:11px;color:#aaa;padding:8px 0\">Sem dados no período</div>";}
    else rankEl.innerHTML=rankClients.map(function(code,i){
      var cl=DB.clients.find(function(c){return c.code===code;});
      var v=clientVol[code];
      var pct=Math.round(v/maxCli*100);
      var cnt=sales.filter(function(s){return s.clientCode===code;}).length;
      return "<div style=\"display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--gray-line);\">" +
        "<span style=\"font-size:11px;color:#888;width:14px;text-align:center;\">"+(i+1)+"</span>" +
        "<div style=\"flex:1;\">" +
          "<div style=\"font-size:12px;font-weight:500;color:var(--black);\">"+((cl&&cl.name)||code)+"</div>" +
          "<div style=\"font-size:11px;color:#888;\">"+((cl&&cl.segment)||"—")+" · "+cnt+" pedido(s)</div>" +
          "<div style=\"height:3px;background:var(--gray-bg);border-radius:2px;margin-top:3px;\">" +
            "<div style=\"height:3px;width:"+pct+"%;background:#FFCD00;border-radius:2px;\"></div></div>" +
        "</div>" +
        "<span style=\"font-size:12px;font-weight:500;color:var(--black);white-space:nowrap;\">R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:0})+"</span>" +
      "</div>";
    }).join("");
  }

  // ── Top produtos ──
  var prodVol={};
  sales.forEach(function(s){s.items.forEach(function(i){var k=i.sku||i.name||"?";var v=(parseFloat(i.price)||0)*(i.qty||1);prodVol[k]={name:i.name||k,sku:i.sku||"",val:(prodVol[k]?prodVol[k].val:0)+v,qty:(prodVol[k]?prodVol[k].qty:0)+(i.qty||1)};});});
  var topProds=Object.values(prodVol).sort(function(a,b){return b.val-a.val;}).slice(0,5);
  var PDOTS=["#FFCD00","#378ADD","#1D9E75","#D85A30","#7F77DD"];
  var volEl=document.getElementById("dash-volume-list");
  if(volEl){
    if(!topProds.length){volEl.innerHTML="<div style=\"font-size:11px;color:#aaa;padding:8px 0\">Sem dados no período</div>";}
    else volEl.innerHTML=topProds.map(function(p,i){
      return "<div style=\"display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:0.5px solid var(--gray-line);\">" +
        "<div style=\"width:8px;height:8px;border-radius:50%;background:"+PDOTS[i]+";flex-shrink:0;\"></div>" +
        "<span style=\"flex:1;font-size:12px;color:var(--black);\">" + p.name + "</span>" +
        "<span style=\"font-size:11px;color:#888;margin-right:6px;\">" + p.qty + "×</span>" +
        "<span style=\"font-size:12px;font-weight:500;color:var(--black);\">R$ " + p.val.toLocaleString("pt-BR",{minimumFractionDigits:0}) + "</span>" +
      "</div>";
    }).join("");
  }
}


// deleteSale definido em patchV56slim — exclui do banco e recarrega

// ══════════════════════════════════════════
// ADMIN — CLIENTS
// ══════════════════════════════════════════
let editingClientCode = null;


// ══════════════════════════════════════════════════════════════
// ENGINE DE PAGINAÇÃO — compartilhado entre todas as tabelas
// ══════════════════════════════════════════════════════════════
var _pages = {
  products:  { page: 1, perPage: 10 },
  clients:   { page: 1, perPage: 10 },
  bundles:   { page: 1, perPage: 10 },
  sales:     { page: 1, perPage: 10 },
  hsProducts:{ page: 1, perPage: 10 },
};

function pgSlice(tableKey, rows) {
  var s = _pages[tableKey];
  var total = rows.length;
  var totalPages = Math.max(1, Math.ceil(total / s.perPage));
  if (s.page > totalPages) s.page = totalPages;
  var start = (s.page - 1) * s.perPage;
  return { rows: rows.slice(start, start + s.perPage), page: s.page, totalPages: totalPages, total: total, perPage: s.perPage };
}

function pgSetPage(tableKey, page) {
  _pages[tableKey].page = page;
  _pgRefresh(tableKey);
}

function pgSetPerPage(tableKey, n) {
  _pages[tableKey].perPage = parseInt(n);
  _pages[tableKey].page = 1;
  _pgRefresh(tableKey);
}

function _pgRefresh(tableKey) {
  if (tableKey === 'products')   renderProductsTable(document.getElementById('products-search')?.value || '');
  if (tableKey === 'clients')    renderClientsTable(document.getElementById('clients-search')?.value || '');
  if (tableKey === 'bundles')    renderBundlesTable();
  if (tableKey === 'sales')      renderSalesTable();
  if (tableKey === 'hsProducts') _hsRenderTable();
}

function pgBar(tableKey, paginated) {
  var { page, totalPages, total, perPage } = paginated;
  if (total === 0) return '';

  // Gerar botões de página
  var pages = [];
  if (totalPages <= 7) {
    for (var i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages = [1];
    if (page > 3) pages.push('...');
    for (var i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  var btnBase = 'display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 6px;border-radius:6px;border:1.5px solid;font-size:12px;font-weight:600;cursor:pointer;';
  var btns = pages.map(function(p) {
    if (p === '...') return '<span style="padding:0 4px;color:var(--text-hint);font-size:13px;">…</span>';
    var active = p === page;
    var style = btnBase + (active
      ? 'background:var(--black);border-color:var(--black);color:var(--white);'
      : 'background:var(--white);border-color:var(--gray-line);color:var(--text-body);');
    return '<button style="' + style + '" onclick="pgSetPage(\'' + tableKey + '\',' + p + ')">' + p + '</button>';
  }).join('');

  var arrowStyle = btnBase + 'background:var(--white);border-color:var(--gray-line);color:var(--text-muted);';
  var prevDisabled = page === 1 ? 'opacity:.35;pointer-events:none;' : '';
  var nextDisabled = page === totalPages ? 'opacity:.35;pointer-events:none;' : '';

  var start = (page-1)*perPage + 1;
  var end   = Math.min(page*perPage, total);

  return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0 2px;flex-wrap:wrap;gap:8px;">' +
    '<div style="font-size:12px;color:var(--text-hint);">Mostrando <strong style=\"color:var(--text-body)\">' + start + '–' + end + '</strong> de <strong style=\"color:var(--text-body)\">' + total + '</strong> itens</div>' +
    '<div style="display:flex;align-items:center;gap:6px;">' +
      '<button style="' + arrowStyle + prevDisabled + '" onclick="pgSetPage(\'' + tableKey + '\',' + (page-1) + ')">‹</button>' +
      btns +
      '<button style="' + arrowStyle + nextDisabled + '" onclick="pgSetPage(\'' + tableKey + '\',' + (page+1) + ')">›</button>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:6px;">' +
      '<span style="font-size:12px;color:var(--text-hint);">Por página:</span>' +
      '<select onchange="pgSetPerPage(\'' + tableKey + '\',this.value)" style="height:28px;padding:0 8px;border:1.5px solid var(--gray-line);border-radius:6px;font-size:12px;font-family:inherit;color:var(--text-body);background:var(--white);cursor:pointer;">' +
        [5,10,50,100].map(function(n){ return '<option value="' + n + '"' + (n===perPage?' selected':'') + '>' + n + '</option>'; }).join('') +
      '</select>' +
    '</div>' +
  '</div>';
}

function renderClientsTable(search = '') {
  _pages.clients.page = 1;
  const q = (search || '').toLowerCase();
  let allRows = DB.clients.filter(c => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.franchise_name||'').toLowerCase().includes(q));
  allRows = _sortRows(allRows, 'clients', { code: c=>c.code, name: c=>c.name, segment: c=>c.segment, status: c=>c.status });
  const pg = pgSlice('clients', allRows);

  // Empty state
  if (!pg.rows.length) {
    document.getElementById('clients-table').innerHTML = _emptyState('👥', t('empty.clients')||'Nenhum cliente cadastrado', t('empty.clientsSub')||'Adicione o primeiro cliente ao portal', {label:'+ Novo cliente', fn:'openClientModal'});
    const pgEl = document.getElementById('clients-pagination');
    if (pgEl) pgEl.innerHTML = '';
    return;
  }

  // Toggle: visualização em cards
  if (_viewMode && _viewMode.clients === 'cards') {
    const wrapper = document.getElementById('clients-table')?.closest('table')?.parentElement;
    if (wrapper) {
      const tbl = wrapper.querySelector('table');
      if (tbl) tbl.style.display = 'none';
      let cd = wrapper.querySelector('#clients-card-view');
      if (!cd) { cd = document.createElement('div'); cd.id = 'clients-card-view'; wrapper.appendChild(cd); }
      else cd.style.display = '';
      var cardRows = pg.rows.map(function(c) {
        var bg = c.status==='active' ? '#EAF3DE' : '#f5f5f5';
        var fg = c.status==='active' ? '#3B6D11' : '#888';
        var label = c.status==='active' ? 'Ativo' : 'Inativo';
        return '<div class="_cli-card" data-code="' + c.code + '" style="background:#fff;border:1px solid #e8e6e0;border-radius:12px;padding:16px;cursor:pointer;">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' + _avatar(c.name, 36) +
          '<div><div style="font-size:13px;font-weight:600;">' + c.name + '</div><div style="font-size:11px;color:#999;">' + c.code + '</div></div></div>' +
          '<div style="font-size:11px;color:#666;margin-bottom:4px;">' + (c.segment||'—') + '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">' +
          '<span style="font-size:11px;color:#999;">' + (c.visibleProducts||[]).length + ' produtos</span>' +
          '<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:' + bg + ';color:' + fg + ';">' + label + '</span>' +
          '</div></div>';
      }).join('');
      cd.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;padding:4px 0;">' + cardRows + '</div>';
      cd.querySelectorAll('._cli-card').forEach(function(el) {
        el.addEventListener('click', function() { openClientModal(el.getAttribute('data-code')); });
      });
      return;
    }
  } else {
    const cd = document.getElementById('clients-card-view');
    if (cd) cd.style.display = 'none';
    const tbl = document.getElementById('clients-table')?.closest('table');
    if (tbl) tbl.style.display = '';
  }

  // Visualização em tabela (padrão)
  document.getElementById('clients-table').innerHTML = pg.rows.map(c => `
    <tr>
      <td><strong>${c.code}</strong></td>
      <td style="display:flex;align-items:center;gap:8px;">${_avatar(c.name,26)}<span>${c.name}</span></td>
      <td style="color:var(--text-muted);font-size:12px;">${c.segment}</td>
      <td style="color:var(--text-muted);font-size:12px;">${c.franchise_name||'<span style="color:#ccc">—</span>'}</td>
      <td>${(c.visibleProducts||c.visible_products||[]).length} ${t('admin.products')||'produtos'}</td>
      <td>${statusPill(c.status)}</td>
      <td><div class="td-actions">
        <button class="btn-sm yellow" onclick="openClientModal('${c.code}')">${t('btn.edit')||'Editar'}</button>
        <button class="btn-sm danger" onclick="deleteClient('${c.code}')">${t('btn.delete')||'Excluir'}</button>
      </div></td>
    </tr>`).join('');
  const pgEl = document.getElementById('clients-pagination');
  if (pgEl) pgEl.innerHTML = pgBar('clients', pg);
}

function openClientModal(code = null) {
  editingClientCode = code;
  document.getElementById('client-modal-title').textContent = code ? t('admin.editClient')||'Editar cliente' : t('admin.newClientModal')||'Novo cliente';
  // Sincronizar opções de consultores/franquias do HubSpot (sem patch — chamada direta)
  if (typeof window.syncClientModalOptions === 'function') window.syncClientModalOptions();
  // Se editando, buscar dados frescos da API local
  if (code) {
    window._dbApi('GET','/clients/'+encodeURIComponent(code)).then(function(fresh) {
      if (fresh && fresh.code) {
        var r = { data: fresh };
        // Atualizar DB.clients com dado fresco
        var idx = DB.clients.findIndex(function(c){ return c.code === code; });
        var fresh = { code: r.data.code, name: r.data.name, segment: r.data.segment||'',
          status: r.data.status||'active', visibleProducts: r.data.visible_products||[],
          custom_prices: r.data.custom_prices||{}, _sbId: r.data.id, _sbVis: r.data.visible_products||[] };
        if (idx > -1) DB.clients[idx] = fresh; else DB.clients.push(fresh);
        // Repreencher campos do modal com dados frescos do Supabase
        var d = r.data;
        document.getElementById('c-code').value = d.code || '';
        document.getElementById('c-name').value = d.name || '';
        var segEl = document.getElementById('c-segment'); if(segEl) segEl.value = d.segment || '';
        document.getElementById('c-status').value = d.status || 'active';
        var ownerSel2 = document.getElementById('c-owner-id');
        if (ownerSel2) ownerSel2.value = d.owner_id || '';
        // Franquia de empresa
        var fEl = document.getElementById('c-franchise');
        if (fEl) fEl.value = d.franchise_name || '';
        // Atualizar toggles de produtos
        var vp = d.visible_products || [];
        DB.products.forEach(function(p) {
          var cb = document.getElementById('ctog-' + p.id);
          var pid = p._sbId || p.id; if (cb) cb.checked = vp.indexOf(pid) > -1;
        });
        // Atualizar inputs de preço com dados frescos do Supabase
        var cp = d.custom_prices || {};
        DB.products.forEach(function(p) {
          var inp = document.getElementById('cprice-' + p.id);
          if (inp) {
            var pid2 = p._sbId || p.id; var val = cp[pid2] !== undefined ? cp[pid2] : '';
            inp.value = val !== '' ? val : '';
          }
        });
      }
    });
    // Mostrar modal imediatamente com dados locais enquanto busca
  }
  const client = code ? DB.clients.find(c => c.code === code) : null;
  document.getElementById('c-code').value = client?.code || '';
  document.getElementById('c-code').disabled = false;
  const warn = document.getElementById('c-code-warn');
  if (warn) warn.style.display = 'none';
  document.getElementById('c-name').value = client?.name || '';
  const segEl = document.getElementById('c-segment'); if(segEl) segEl.value = client?.segment || '';
  document.getElementById('c-status').value = client?.status || 'active';
  var ownerSel = document.getElementById('c-owner-id');
  if (ownerSel) ownerSel.value = client?.owner_id || '';

  // Product toggles
  const activeProds = DB.products.filter(p => p.status === 'active');
  document.getElementById('c-prod-toggles').innerHTML = activeProds.map(p => `
    <div class="prod-toggle-item">
      <div><div class="prod-toggle-name">${p.name}</div><div class="prod-toggle-cat">${p.category}</div></div>
      <label class="toggle-switch">
        <input type="checkbox" id="ctog-${p.id}" ${!client || client.visibleProducts.includes(p.id) ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    </div>`).join('');

  // Price overrides
  document.getElementById('c-price-overrides').innerHTML = activeProds.map(p => `
    <div class="price-override-row">
      <div class="price-override-name">${p.name} <span style="font-size:11px;color:var(--text-hint);">(base: R$ ${p.basePrice.toLocaleString('pt-BR')})</span></div>
      <input class="price-override-input" type="number" id="cprice-${p.id}" placeholder="Preço cliente" value="${(()=>{ const pr = client?.prices || client?.custom_prices || {}; return pr[p._sbId] !== undefined ? pr[p._sbId] : (pr[p.id] !== undefined ? pr[p.id] : ''); })()}">
    </div>`).join('');

  openModal('modal-client');
}

function saveClient() {
  if (!canWrite()) return;
  const newCode = document.getElementById('c-code').value.trim().toUpperCase();
  const name = document.getElementById('c-name').value.trim();
  if (!newCode || !name) { showToast('Código e Razão Social são obrigatórios.'); return; }

  // If creating new, check for duplicate code
  if (!editingClientCode && DB.clients.find(c => c.code === newCode)) { showToast('Código já existe.'); return; }
  // If editing and code changed, check the new code doesn't clash with another client
  if (editingClientCode && newCode !== editingClientCode && DB.clients.find(c => c.code === newCode)) { showToast('Esse código já está em uso por outro cliente.'); return; }

  const visibleProducts = DB.products.filter(p => document.getElementById('ctog-'+p.id)?.checked).map(p => p.id);
  const prices = {};
  DB.products.forEach(p => {
    const val = document.getElementById('cprice-'+p.id)?.value;
    if (val && val !== '') prices[p.id] = parseFloat(val);
  });

  if (editingClientCode) {
    const idx = DB.clients.findIndex(c => c.code === editingClientCode);
    const franchiseName = document.getElementById('c-franchise')?.value?.trim() || '';
    DB.clients[idx] = { ...DB.clients[idx], code: newCode, name, segment: document.getElementById('c-segment').value, status: document.getElementById('c-status').value, visibleProducts, prices, franchise_name: franchiseName };
    // Update clientCode in sales if code changed
    if (newCode !== editingClientCode) {
      DB.sales.forEach(s => { if (s.clientCode === editingClientCode) s.clientCode = newCode; });
    }
  } else {
    const franchiseNew = document.getElementById('c-franchise')?.value?.trim() || '';
    DB.clients.push({ code: newCode, name, segment: document.getElementById('c-segment').value, status: document.getElementById('c-status').value, visibleProducts, prices, franchise_name: franchiseNew });
  }
  // Persistir franchise_name no Supabase
  const franchiseFinal = document.getElementById('c-franchise')?.value?.trim() || '';
  const codeToSave = document.getElementById('c-code').value.trim().toUpperCase();
  window._dbApi('PATCH','/clients/'+encodeURIComponent(codeToSave),{franchise_name:franchiseFinal}).then(function(r) {
    if (r && r.error) console.warn('[franchise] erro ao salvar:', r.error);
  });
  closeModal('modal-client');
  renderClientsTable();
  renderAdminDashboard();
  showToast('Cliente salvo com sucesso!');
}

// ── Reset de senha do cliente (admin) ────────────────────────
async function resetClientPassword(code, name) {
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:380px;margin:20px;font-family:inherit;">
      <div style="font-size:15px;font-weight:600;color:#111;margin-bottom:4px;">Resetar senha</div>
      <div style="font-size:12px;color:#888;margin-bottom:16px;">${name} · ${code}</div>
      <label style="font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px;">Nova senha</label>
      <input id="reset-pw-input" type="password" placeholder="Mínimo 6 caracteres"
        style="width:100%;box-sizing:border-box;height:40px;padding:0 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none;margin-bottom:8px;">
      <input id="reset-pw-confirm" type="password" placeholder="Confirmar senha"
        style="width:100%;box-sizing:border-box;height:40px;padding:0 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none;margin-bottom:16px;">
      <div style="display:flex;gap:8px;">
        <button onclick="this.closest('.reset-pw-modal').remove()"
          style="flex:1;height:38px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:8px;font-size:13px;cursor:pointer;">Cancelar</button>
        <button id="reset-pw-btn"
          style="flex:2;height:38px;background:#FFCD00;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Salvar senha</button>
      </div>
    </div>`;
  modal.classList.add('reset-pw-modal');
  document.body.appendChild(modal);
  modal.querySelector('#reset-pw-input').focus();

  modal.querySelector('#reset-pw-btn').onclick = async function() {
    var pw  = modal.querySelector('#reset-pw-input').value;
    var pw2 = modal.querySelector('#reset-pw-confirm').value;
    if (!pw || pw.length < 6) { showToast('Mínimo 6 caracteres.'); return; }
    if (pw !== pw2) { showToast('Senhas não conferem.'); return; }

    this.textContent = 'Salvando...';
    this.disabled = true;

    try {
      // Hash SHA-256
      var enc  = new TextEncoder();
      var buf  = await crypto.subtle.digest('SHA-256', enc.encode(pw));
      var hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
      var pwField = '__pw__:' + hash;

      // AES encrypt para visualização
      var encPw = '';
      if (window.encryptClientPw) {
        try { encPw = await window.encryptClientPw(pw); } catch(e) {}
      }

      await window._dbApi('PUT', '/clients/' + encodeURIComponent(code), {
        owner_email: pwField,
        owner_pw_enc: encPw
      });

      // Atualizar cache local
      var cl = (DB.clients||[]).find(c => c.code === code);
      if (cl) { cl.owner_email = pwField; }

      modal.remove();
      showToast('✅ Senha de ' + name + ' resetada com sucesso!');
    } catch(e) {
      showToast('Erro ao resetar senha: ' + e.message);
      this.textContent = 'Salvar senha';
      this.disabled = false;
    }
  };

  // Fechar ao clicar fora
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.remove();
  });
}

async function deleteClient(code) {
  if (!confirm('Excluir o cliente ' + code + '?')) return;
  try {
    var res = await window._dbApi('DELETE','/clients/'+encodeURIComponent(code));
    if (res && res.error) { showToast('Erro ao excluir: ' + res.error); return; }
    DB.clients = DB.clients.filter(c => c.code !== code);
    renderClientsTable();
    renderAdminDashboard();
    showToast('Cliente removido.');
  } catch(e) {
    showToast('Erro ao excluir cliente: ' + (e.message || 'verifique a conexão'));
  }
}

// ══════════════════════════════════════════
// ADMIN — PRODUCTS
// ══════════════════════════════════════════
let editingProductId = null;

function renderProductsTable(search = '') {
  if (search !== undefined && search !== null) _pages.products.page = 1;
  const q = search.toLowerCase();
  const allRows = DB.products.filter(p => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q));
  document.getElementById('products-table').innerHTML = (() => { const pg = pgSlice('products', allRows); const pEl = document.getElementById('products-pagination'); if(pEl) pEl.innerHTML = pgBar('products', pg); return pg.rows; })().map(p => `
    <tr>
      <td><strong>${p.name}</strong>${p.isNew ? ' <span style="background:#FFF7E0;color:#92600A;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600;">NOVO</span>' : ''}</td>
      <td style="color:var(--text-muted);font-size:12px;font-family:monospace;">${p.sku || '—'}</td>
      <td style="color:var(--text-muted);font-size:12px;">${p.category}</td>
      <td>R$ ${p.basePrice.toLocaleString('pt-BR')}</td>
      <td>${statusPill(p.status)}</td>
      <td><div class="td-actions">
        
        <button class="btn-sm yellow" onclick="openProductModal(${p.id})">${t('btn.edit')||'Editar'}</button>
        <button class="btn-sm danger" onclick="deleteProduct(${p.id})">${t('btn.delete')||'Excluir'}</button>
      </div></td>
    </tr>`).join('');
}

function openProductModal(id = null) {
  editingProductId = id;
  document.getElementById('product-modal-title').textContent = id ? t('admin.editProduct')||'Editar produto' : t('admin.newProductModal')||'Novo produto';
  const p = id ? DB.products.find(x => x.id === id) : null;
  document.getElementById('p-name').value  = p?.name || '';
  document.getElementById('p-sku').value   = p?.sku  || '';
  document.getElementById('p-cat').value   = p?.category || 'Terminais';
  document.getElementById('p-price').value = p?.basePrice || '';
  document.getElementById('p-desc').value  = p?.desc || '';
  document.getElementById('p-status').value = p?.status || 'active';
  document.getElementById('p-isnew').checked = p?.isNew || false;

  // Reset image area
  const preview = document.getElementById('p-img-preview');
  const placeholder = document.getElementById('p-img-placeholder');
  const removeBtn = document.getElementById('p-img-remove');
  const input = document.getElementById('p-img-input');
  // Carregar imagem existente ao editar
  if (p && (p.imgUrl || p.image_url || p.image)) {
    const existingUrl = p.imgUrl || p.image_url || p.image;
    preview.src = existingUrl;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    removeBtn.style.display = 'block';
  } else {
    preview.src = '';
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    removeBtn.style.display = 'none';
  }
  if (input) input.value = '';
  if (p?.image) {
    preview.src = p.image;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    removeBtn.style.display = 'block';
  } else {
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    removeBtn.style.display = 'none';
  }
  openModal('modal-product');
}

function handleProductImg(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Imagem muito grande. Máximo 2MB.'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('p-img-preview');
    const placeholder = document.getElementById('p-img-placeholder');
    const removeBtn = document.getElementById('p-img-remove');
    preview.src = e.target.result;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    removeBtn.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeProductImg(e) {
  e.stopPropagation();
  const preview = document.getElementById('p-img-preview');
  const placeholder = document.getElementById('p-img-placeholder');
  const removeBtn = document.getElementById('p-img-remove');
  const input = document.getElementById('p-img-input');
  preview.src = '';
  preview.style.display = 'none';
  placeholder.style.display = 'block';
  removeBtn.style.display = 'none';
  if (input) input.value = '';
}

function saveProduct() {
  if (!canWrite()) return;
  const name  = document.getElementById('p-name').value.trim();
  const sku   = document.getElementById('p-sku').value.trim().toUpperCase();
  const price = parseFloat(document.getElementById('p-price').value);
  if (!name || !sku || !price) { showToast('Nome, SKU e preço são obrigatórios.'); return; }

  // Check SKU uniqueness
  const skuExists = DB.products.find(p => p.sku === sku && p.id !== editingProductId);
  if (skuExists) { showToast('Este SKU já está em uso por outro produto.'); return; }

  const preview = document.getElementById('p-img-preview');
  const image = (preview && preview.style.display !== 'none' && preview.src) ? preview.src : (editingProductId ? DB.products.find(p => p.id === editingProductId)?.image || null : null);

  const prod = {
    id: editingProductId || nextProductId++,
    sku,
    name,
    category: document.getElementById('p-cat').value,
    basePrice: price,
    desc: document.getElementById('p-desc').value,
    status: document.getElementById('p-status').value,
    isNew: document.getElementById('p-isnew').checked,
    image: image || null
  };
  if (editingProductId) {
    const idx = DB.products.findIndex(p => p.id === editingProductId);
    DB.products[idx] = prod;
  } else {
    DB.products.push(prod);
  }
  closeModal('modal-product');
  renderProductsTable();
  renderAdminDashboard();
  showToast('Produto salvo com sucesso!');
}

async function deleteProduct(id) {
  if (typeof canWrite === 'function' && !canWrite()) return;
  if (!confirm(t('confirm.deleteProduct'))) return;
  var prod = DB.products.find(function(p){ return p.id === id; });
  var prodId = prod ? (prod._sbId || prod.id) : id;
  try {
    if (prodId) {
      var res = await window._dbApi('DELETE','/products/'+encodeURIComponent(prodId));
      if (res && res.error) { showToast('Erro ao excluir: ' + res.error); return; }
    }
    DB.products = DB.products.filter(p => p.id !== id);
    DB.clients.forEach(c => { c.visibleProducts = c.visibleProducts.filter(pid => pid !== id); });
    renderProductsTable();
    renderAdminDashboard();
    showToast(t('toast.productDeleted'));
  } catch(e) {
    showToast('Erro ao excluir produto: ' + (e.message || 'verifique a conexão'));
  }
}

// ══════════════════════════════════════════
// ADMIN — SALES
// ══════════════════════════════════════════
function populateSalesFilter() {
  const sel = document.getElementById('sales-client-filter');
  sel.innerHTML = '<option value="">Todos os clientes</option>' +
    DB.clients.map(c => `<option value="${c.code}">${c.name}</option>`).join('');
}

function renderSalesTable() {
  const filterCode = (document.getElementById('sales-client-filter')?.value) || '';
  const searchQ = (document.getElementById('sales-search')?.value || '').toLowerCase().trim();
  const filterFrom = document.getElementById('sales-date-from')?.value || '';
  const filterTo   = document.getElementById('sales-date-to')?.value   || '';
  let sales = filterCode ? DB.sales.filter(s => s.clientCode === filterCode) : DB.sales;
  if (filterFrom) sales = sales.filter(s => (s.date||'').substring(0,10) >= filterFrom);
  if (filterTo)   sales = sales.filter(s => (s.date||'').substring(0,10) <= filterTo);
  if (searchQ) {
    sales = sales.filter(s => {
      const id = (s.id || s.order_id || '').toLowerCase();
      const name = (s.clientName || s.clientCode || '').toLowerCase();
      const cnpj = (s.franchisee?.cnpj || '').replace(/\D/g,'');
      const searchClean = searchQ.replace(/\D/g,'');
      return id.includes(searchQ) || name.includes(searchQ) || (searchClean && cnpj.includes(searchClean));
    });
  }
  sales = _sortRows(sales, 'sales', { date: s=>s.date||'', total: s=>s.items.reduce((ss,i)=>ss+i.price*i.qty,0), client: s=>s.clientName||s.clientCode||'' });
  const grandTotal = sales.reduce((s, sale) => s + sale.items.reduce((ss, i) => ss + i.price * i.qty, 0), 0);
  const pgSales = pgSlice('sales', sales);
  document.getElementById('sales-summary-text').textContent = `${pgSales.total} pedido(s) · Total: R$ ${grandTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`;
  if (!pgSales.rows.length) { const tbl = document.getElementById('sales-table'); if(tbl) tbl.innerHTML = _emptyState('🛒', (typeof t==='function'?t('empty.sales'):null)||'Nenhum pedido encontrado', (typeof t==='function'?t('empty.salesSub'):null)||'Tente ajustar os filtros ou aguarde novos pedidos'); return; }
  document.getElementById('sales-table').innerHTML = pgSales.rows.map(s => {
    const cl = DB.clients.find(c => c.code === s.clientCode);
    const total = s.items.reduce((ss, i) => ss + i.price * i.qty, 0);
    const prods = s.items.map(i => { const p = DB.products.find(x => x.id === i.productId || x._sbId === i.productId); return `${i.qty}× ${p?.name || i.name || '?'}`; }).join(', ');
    const clientDisplay = cl?.name || s.clientName || s.clientCode || '—';
    const orderDisplay = typeof s.id === 'string' && s.id.startsWith('PED') ? s.id : '';
    const hsId = s.hubspot_deal_id || s.hubspotDealId || '';
    const hsLink = hsId
      ? `<a href="https://app.hubspot.com/contacts/9186157/deal/${hsId}" target="_blank"
           style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:#FFF3EE;border:1px solid #FF7A59;border-radius:6px;font-size:12px;font-weight:600;color:#FF7A59;text-decoration:none;white-space:nowrap;">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           Ver no HubSpot
         </a>`
      : `<button onclick="reenviarHubSpot('${s.id||s.order_id}')"
           style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:none;border:1px solid #d0d0d0;border-radius:6px;font-size:12px;font-weight:600;color:#999;cursor:pointer;white-space:nowrap;">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
           Reenviar HubSpot
         </button>`;
    return `<tr data-order-id="${s.order_id||s.id}" onclick="showSaleDetail('${s.id||s.order_id}')" style="cursor:pointer;" onmouseover="this.style.background='#FFFBE6'" onmouseout="this.style.background=''">
      <td style="min-width:120px;">${hsLink}</td>
      <td>${clientDisplay}</td>
      <td>${fmtDate(s.date)}</td>
      <td style="max-width:200px;font-size:12px;color:var(--text-muted);">${prods}</td>
      <td><strong>R$ ${total.toLocaleString('pt-BR',{minimumFractionDigits:2})}</strong></td>
      <td><div style="display:flex;gap:6px;align-items:center;">
        <button class="btn-sm ghost" onclick="viewSaleDetail('${s.id}')">Ver</button>
        <button class="btn-sm ${s.status==='pending'?'yellow':'ghost'}" onclick="toggleSaleStatus('${s.id}')">${s.status==='pending'?'Confirmar':'Pendente'}</button>
      </div></td>
    </tr>`;
  }).join('');
}

function toggleSaleStatus(id) {
  const sale = DB.sales.find(s => s.id === id || s.order_id === id);
  if (!sale) return;
  if (sale.status === 'pending') {
    if (!confirm(t('confirm.confirmOrder')||'Confirmar este pedido?')) return;
    sale.status = 'confirmed';
    sale._confirmedAt = new Date().toISOString();
    showToast('✅ Pedido confirmado!');
  } else {
    if (!confirm(t('confirm.revertOrder')||'Reverter para Pendente?')) return;
    sale.status = 'pending';
    delete sale._confirmedAt;
    showToast('Pedido revertido para pendente.');
  }
  renderSalesTable(); renderAdminDashboard();
}

function viewSaleDetail(id) {
  const s = DB.sales.find(x => x.id === id);
  if (!s) return;
  const rawCode = typeof s.clientCode === "object" ? (s.clientCode?.code || "") : (s.clientCode || "");
  const cl = DB.clients.find(c => c.code === rawCode);
  const items = s.items || [];
  const total = items.reduce((ss, i) => ss + (parseFloat(i.price)||0) * (i.qty||1), 0);

  function field(label, val) {
    if (!val) return "";
    return "<div><span style=\"color:var(--text-hint);font-size:10px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:2px;\">" + label + "</span><div style=\"font-weight:500;font-size:13px;\">" + val + "</div></div>";
  }
  function section(title) {
    return "<div style=\"font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin:16px 0 8px;border-bottom:1px solid #E8E6E0;padding-bottom:4px;\">" + title + "</div>";
  }

  function renderDetail(full) {
    var f = {
      razaoSocial: full.buyer_razao_social || "",
      cnpj:        full.buyer_cnpj || "",
      nome:        (full.buyer_nome || "") + (full.buyer_sobrenome ? " " + full.buyer_sobrenome : ""),
      cpf:         full.buyer_cpf || "",
      nasc:        full.buyer_nascimento || "",
      email:       full.buyer_email || "",
      tel:         full.buyer_telefone || "",
      cep:         full.buyer_cep || "",
      uf:          full.buyer_uf || "",
      rua:         full.buyer_rua || "",
      numero:      full.buyer_numero || "",
      complemento: full.buyer_complemento || "",
      bairro:      full.buyer_bairro || "",
      cidade:      full.buyer_cidade || ""
    };

    var itemsHtml = items.length ? items.map(function(i) {
      var p = DB.products.find(function(x) { return x.id === i.productId || x._sbId === i.productId; });
      var nome = (p && p.name) || i.name || "?";
      var sub = (parseFloat(i.price)||0) * (i.qty||1);
      var sku = i.sku || (p && p.sku) || "—";
      return "<div style=\"display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #EEE;\">" +
        "<span>" + (i.qty||1) + "× " + nome + " <span style=\"color:#999;font-size:11px;\">[" + sku + "]</span></span>" +
        "<span style=\"font-weight:600;\">R$ " + sub.toLocaleString("pt-BR",{minimumFractionDigits:2}) + "</span></div>";
    }).join("") : "<div style=\"color:#999;font-size:12px;\">Sem itens</div>";

    var enderecoHtml = (f.rua || f.cep) ?
      section("Endereço de Entrega") +
      "<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px;\">" +
        "<div style=\"grid-column:1/-1;\"><span style=\"color:var(--text-hint);font-size:10px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:2px;\">Logradouro</span>" +
        "<div style=\"font-weight:500;font-size:13px;\">" + (f.rua||"—") + ", " + (f.numero||"s/n") + (f.complemento?" — "+f.complemento:"") + "</div></div>" +
        field("Bairro", f.bairro) + field("Cidade / UF", (f.cidade||"—") + " / " + (f.uf||"—")) + field("CEP", f.cep) +
      "</div>" : "";

    var hsLink = (s.hubspot_deal_id || s.hubspotDealId) ?
      "<a href=\"https://app.hubspot.com/contacts/9186157/deal/" + (s.hubspot_deal_id||s.hubspotDealId) + "\" target=\"_blank\" style=\"padding:8px 16px;border-radius:8px;background:#FF7A59;color:#fff;font-size:12px;font-weight:600;text-decoration:none;display:inline-block;\">↗ Abrir no HubSpot</a>" : "";

    var dateStr = s.date ? new Date(s.date).toLocaleDateString("pt-BR") : "—";

    document.getElementById("sale-detail-body").innerHTML =
      "<div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;\">" +
        "<div style=\"font-size:13px;font-weight:600;color:#111;word-break:break-all;\">" + (s.id||"—") + "</div>" +
        "<span style=\"font-size:12px;color:#888;\">" + dateStr + "</span>" +
      "</div>" +
      section("Consultor / Cliente") +
      "<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px;\">" +
        field("Consultor", (cl && cl.owner_name) || "—") +
        field("Cliente", (cl && cl.name) || rawCode || "—") +
        field("Segmento", (cl && cl.segment) || "—") +
        field("Franquia", (cl && cl.franchise_name) || "—") +
        field("Código", rawCode || "—") +
      "</div>" +
      section("Produtos") +
      "<div style=\"background:#F9F7F2;border-radius:8px;padding:10px 12px;font-size:13px;\">" + itemsHtml +
        "<div style=\"display:flex;justify-content:space-between;margin-top:8px;font-weight:700;font-size:14px;\">" +
          "<span>Total</span><span>R$ " + total.toLocaleString("pt-BR",{minimumFractionDigits:2}) + "</span></div>" +
      "</div>" +
      section("Dados do Franqueado") +
      "<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:8px;\">" +
        field("Razão Social", f.razaoSocial) + field("CNPJ", f.cnpj) +
        field("Nome", f.nome) + field("CPF", f.cpf) +
        field("E-mail", f.email) + field("Telefone", f.tel) +
        field("Nascimento", f.nasc ? fmtDate(f.nasc) : "") +
      "</div>" +
      enderecoHtml +
      "<div class=\"modal-actions\" style=\"margin-top:20px;\">" + hsLink +
        "<button class=\"btn-ghost\" onclick=\"closeModal('modal-sale-detail')\">Fechar</button>" +
      "</div>";

    openModal("modal-sale-detail");
  }

  if (false) {
    // removido — _sb não existe mais
  } else {
    renderDetail({});
  }
}

// ══════════════════════════════════════════
// ADMIN NAV
// ══════════════════════════════════════════



// ── Roteamento de URLs por seção ──────────────────────────────
var ADMIN_ROUTES = {
  'dashboard':   '/admin',
  'ranking':     '/admin/ranking',
  'sales':       '/admin/vendas',
  'products':    '/admin/produtos',
  'bundles':     '/admin/bundles',
  'hs-produtos': '/admin/hs-produtos',
  'clients':     '/admin/clientes',
  'integracoes': '/admin/integracoes',
  'equipe':      '/admin/equipe',
};

var ROUTE_TO_SECTION = {};
Object.keys(ADMIN_ROUTES).forEach(function(s){ ROUTE_TO_SECTION[ADMIN_ROUTES[s]] = s; });

function getRouteSection() {
  var path = window.location.pathname.replace(/\/$/, '') || '/admin';
  return ROUTE_TO_SECTION[path] || 'dashboard';
}

function adminNav(section, el, skipHistory) {
  document.querySelectorAll('.admin-nav-item').forEach(function(n){ n.classList.remove('active'); });
  document.querySelectorAll('.admin-section').forEach(function(s){
    s.classList.remove('active');
    s.removeAttribute('style');
  });
  // Ativar item do menu correto
  if (el) {
    el.classList.add('active');
  } else {
    document.querySelectorAll('.admin-nav-item').forEach(function(n){
      if (n.getAttribute('onclick') && n.getAttribute('onclick').indexOf("'" + section + "'") !== -1) {
        n.classList.add('active');
      }
    });
  }
  var target = document.getElementById('adm-' + section);
  if (target) target.classList.add('active');

  // Atualizar URL sem recarregar
  if (!skipHistory && ADMIN_ROUTES[section]) {
    window.history.pushState({ section: section }, '', ADMIN_ROUTES[section]);
  }

  if (section === 'dashboard') renderAdminDashboard();
  if (section === 'sales') { renderSalesTable(); populateSalesFilter(); }
  if (section === 'ranking') renderRanking('volume');
  if (section === 'equipe') renderTeamTable();
  if (section === 'clients') renderClientsTable();
  if (section === 'products') renderProductsTable();
  if (section === 'bundles') loadBundles().then(function(){ renderBundlesTable(); });
  if (section === 'hs-produtos') initHsProducts();
  if (section === 'integracoes') initIntegracoes();
  if (section === 'design') { if (typeof loadDesignPrefs === 'function') loadDesignPrefs(); }
  if (section === 'dashboard') setTimeout(function(){ if(typeof populateDash==='function') populateDash(); }, 400);
  if (section === 'clients')   setTimeout(function(){ if(typeof enrichClients==='function') enrichClients(); }, 400);
  if (section === 'products')  setTimeout(function(){ if(typeof enrichProducts==='function') enrichProducts(); }, 400);
}

// Navegar com botão voltar/avançar do browser
window.addEventListener('popstate', function(e) {
  var section = (e.state && e.state.section) ? e.state.section : getRouteSection();
  adminNav(section, null, true);
});

// Ao abrir o painel, navegar para a seção da URL atual
function initAdminRoute() {
  var section = getRouteSection();
  adminNav(section, null, true);
}

// ══════════════════════════════════════════
// RANKING
// ══════════════════════════════════════════
let currentRankMode = 'volume';
let currentRankDateFilter = 'all';

function setRankDateFilter(filter, el) {
  currentRankDateFilter = filter;
  document.querySelectorAll('[id^="rdf-"]').forEach(b => { if(b.tagName==='BUTTON') b.className='btn-sm ghost'; });
  if(el) el.className = 'btn-sm yellow';
  const customInputs = document.getElementById('rdf-custom-inputs');
  if(customInputs) customInputs.style.display = filter === 'custom' ? 'flex' : 'none';
  renderRanking(currentRankMode);
}

function getRankDateRange() {
  const now = new Date(); now.setHours(0,0,0,0);
  const today = now.toISOString().split('T')[0];
  if (currentRankDateFilter === 'today') return [today, today];
  if (currentRankDateFilter === 'yesterday') {
    const y = new Date(now); y.setDate(y.getDate()-1);
    const ys = y.toISOString().split('T')[0]; return [ys, ys];
  }
  if (currentRankDateFilter === 'week') {
    const w = new Date(now); w.setDate(w.getDate() - w.getDay());
    return [w.toISOString().split('T')[0], today];
  }
  if (currentRankDateFilter === 'month') {
    return [today.slice(0,7)+'-01', today];
  }
  if (currentRankDateFilter === '3months') {
    const m = new Date(now); m.setMonth(m.getMonth()-3);
    return [m.toISOString().split('T')[0], today];
  }
  if (currentRankDateFilter === 'custom') {
    const from = document.getElementById('rdf-from')?.value;
    const to   = document.getElementById('rdf-to')?.value;
    if(from && to) return [from, to];
  }
  return [null, null];
}

function filterSalesByDate(sales) {
  const [from, to] = getRankDateRange();
  if (!from || !to) return sales;
  return sales.filter(s => s.date >= from && s.date <= to);
}

function renderRanking(mode) {
  currentRankMode = mode;
  ['volume','pedidos','itens'].forEach(m => {
    const btn = document.getElementById('rank-btn-' + m);
    if(btn) btn.className = m === mode ? 'btn-sm yellow' : 'btn-sm ghost';
  });

  const [from, to] = getRankDateRange();
  const lbl = document.getElementById('rdf-label');
  if(lbl) lbl.textContent = from ? `${fmtDate(from)} → ${fmtDate(to)}` : 'Todos os períodos';

  const stats = DB.clients.map(cl => {
    const allSales = DB.sales.filter(s => s.clientCode === cl.code);
    const sales = filterSalesByDate(allSales);
    const totalVolume = sales.reduce((s, sale) => s + sale.items.reduce((ss, i) => ss + i.price * i.qty, 0), 0);
    const totalItems = sales.reduce((s, sale) => s + sale.items.reduce((ss, i) => ss + i.qty, 0), 0);
    const confirmedSales = sales.filter(s => s.status === 'confirmed').length;
    return { cl, sales: sales.length, confirmedSales, totalVolume, totalItems };
  });

  if (mode === 'volume') stats.sort((a, b) => b.totalVolume - a.totalVolume);
  else if (mode === 'pedidos') stats.sort((a, b) => b.sales - a.sales);
  else stats.sort((a, b) => b.totalItems - a.totalItems);

  const topVolume = stats[0]?.totalVolume || 1;

  // KPIs
  const grandTotal = stats.reduce((s, x) => s + x.totalVolume, 0);
  const grandOrders = stats.reduce((s, x) => s + x.sales, 0);
  document.getElementById('ranking-kpis').innerHTML = `
    <div class="stat-card"><div class="stat-card-label">Volume total geral</div><div class="stat-card-val green">R$ ${grandTotal.toLocaleString('pt-BR',{minimumFractionDigits:0})}</div><div class="stat-card-sub">todos os clientes</div></div>
    <div class="stat-card"><div class="stat-card-label">Total de pedidos</div><div class="stat-card-val yellow">${grandOrders}</div><div class="stat-card-sub">todos os clientes</div></div>
    <div class="stat-card"><div class="stat-card-label">Melhor cliente</div><div class="stat-card-val" style="font-size:18px;">${stats[0]?.cl.name.split(' ').slice(0,2).join(' ') || '—'}</div><div class="stat-card-sub">${stats[0] ? 'R$ ' + stats[0].totalVolume.toLocaleString('pt-BR') : '—'}</div></div>
    <div class="stat-card"><div class="stat-card-label">Ticket médio</div><div class="stat-card-val">${grandOrders ? 'R$ ' + Math.round(grandTotal / grandOrders).toLocaleString('pt-BR') : '—'}</div><div class="stat-card-sub">por pedido</div></div>`;

  // Ranking cards
  const medals = ['🥇','🥈','🥉'];
  document.getElementById('ranking-cards').innerHTML = stats.map((x, i) => {
    const barPct = topVolume > 0 ? Math.round((x.totalVolume / topVolume) * 100) : 0;
    const sortVal = mode === 'volume' ? 'R$ ' + x.totalVolume.toLocaleString('pt-BR') : mode === 'pedidos' ? x.sales + ' pedidos' : x.totalItems + ' itens';
    return `
      <div style="background:var(--white);border-radius:var(--radius-lg);border:1px solid ${i === 0 ? 'var(--yellow)' : 'var(--gray-mid)'};padding:1.25rem 1.5rem;box-shadow:${i === 0 ? 'var(--shadow-yellow)' : 'var(--shadow-card)'};">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:12px;">
          <div style="font-size:28px;line-height:1;flex-shrink:0;">${medals[i] || '#' + (i + 1)}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-family:'Poppins',sans-serif;font-size:16px;font-weight:700;color:var(--black);">${x.cl.name}</div>
            <div style="font-size:12px;color:var(--text-muted);">${x.cl.code} · ${x.cl.segment}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-family:'Poppins',sans-serif;font-size:20px;font-weight:700;color:${i === 0 ? 'var(--yellow-dark)' : 'var(--black)'};">${sortVal}</div>
            <div style="font-size:11px;color:var(--text-muted);">${mode !== 'volume' ? 'R$ ' + x.totalVolume.toLocaleString('pt-BR') + ' em volume' : x.sales + ' pedido(s)'}</div>
          </div>
        </div>
        <div style="height:8px;background:var(--gray-mid);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${barPct}%;background:${i === 0 ? 'var(--yellow)' : i === 1 ? '#C0C0C0' : '#CD7F32'};border-radius:4px;transition:width 0.4s ease;"></div>
        </div>
        <div style="display:flex;gap:1.5rem;margin-top:10px;font-size:12px;color:var(--text-muted);">
          <span>📦 ${x.sales} pedido(s)</span>
          <span>✅ ${x.confirmedSales} confirmado(s)</span>
          <span>🛒 ${x.totalItems} itens vendidos</span>
          <span>💰 R$ ${x.totalVolume.toLocaleString('pt-BR',{minimumFractionDigits:2})}</span>
        </div>
      </div>`;
  }).join('');
}

// ══════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════



(function(){
'use strict';
var SK={logo:'portal_logo_url',primary:'portal_primary',sidebar:'portal_sidebar'};
function applyLogo(url){
  url=url||localStorage.getItem(SK.logo)||'';if(!url)return;
  var sel=['.brand-name','.logo-text','.portal-brand','.sidebar-brand-name','.login-brand-name','.admin-brand'].join(',');
  document.querySelectorAll(sel).forEach(function(el){
    if(el.querySelector('img.portal-logo'))return;
    var img=document.createElement('img');img.src=url;img.alt='Logo';img.className='portal-logo';
    img.style.cssText='height:34px;max-width:160px;object-fit:contain;display:block;';
    el.innerHTML='';el.appendChild(img);
  });
  document.querySelectorAll('img.logo-img,img#logo-current-preview,img.portal-logo').forEach(function(img){img.src=url;});
  var prev=document.getElementById('logo-current-preview'),ph=document.getElementById('logo-placeholder');
  if(prev&&url){prev.src=url;prev.style.display='block';if(ph)ph.style.display='none';}
  var inp=document.getElementById('ds-logo-url');if(inp&&!inp.value)inp.value=url;
}
function applyColors(primary,sidebar){
  primary=primary||localStorage.getItem(SK.primary)||'#FFC700';
  sidebar=sidebar||localStorage.getItem(SK.sidebar)||'#111111';
  document.documentElement.style.setProperty('--gold',primary);
  document.documentElement.style.setProperty('--sidebar',sidebar);
  document.querySelectorAll('.sidebar,#sidebar,.catalog-sidebar').forEach(function(el){el.style.background=sidebar;});
}
/* design nav handled by main adminNav */
function buildDesignPanel(){
  if(document.getElementById('adm-design'))return;
  var panel=document.createElement('div');
  panel.id='adm-design';panel.className='admin-section';panel.style.display='none';
  panel.innerHTML='<div style="max-width:680px;">'
    +'<h2 style="color:#e6edf3;font-size:20px;font-weight:700;margin:0 0 4px;">Design & Branding</h2>'
    +'<p style="color:#8b949e;font-size:13px;margin:0 0 28px;">Afeta login cliente, login admin e menu lateral</p>'
    +'<div class="design-card"><div style="color:#e6edf3;font-size:13px;font-weight:700;margin-bottom:14px;"><span style="background:#FFC700;width:6px;height:18px;border-radius:3px;display:inline-block;margin-right:8px;vertical-align:middle;"></span>Logo</div>'
    +'<div id="logo-preview-area"><img id="logo-current-preview" src="" style="max-height:60px;max-width:220px;object-fit:contain;display:none;"/><span id="logo-placeholder" style="color:#555;font-size:12px;">Nenhuma logo carregada</span></div>'
    +'<div style="display:flex;gap:8px;margin-top:10px;"><input type="text" id="ds-logo-url" placeholder="Cole a URL da imagem (https://...)" style="flex:1;padding:10px 12px;background:#0c0c0c;border:1px solid #252525;border-radius:8px;color:#e6edf3;font-size:12px;"/>'
    +'<button onclick="window.dsPreviewLogo()" style="padding:10px 16px;background:transparent;border:1px solid #252525;border-radius:8px;color:#e6edf3;font-size:12px;cursor:pointer;white-space:nowrap;">Visualizar</button></div>'
    +'<p style="color:#555;font-size:11px;margin:8px 0 0;">Aplicada no login cliente, login admin e sidebar</p></div>'
    +'<div class="design-card"><div style="color:#e6edf3;font-size:13px;font-weight:700;margin-bottom:14px;"><span style="background:#FFC700;width:6px;height:18px;border-radius:3px;display:inline-block;margin-right:8px;vertical-align:middle;"></span>Cores</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">'
    +'<div><label style="color:#8b949e;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:8px;">Cor primaria</label>'
    +'<div style="display:flex;gap:6px;align-items:center;"><input type="color" id="ds-primary-color" value="#FFC700" style="width:36px;height:36px;border:1px solid #252525;border-radius:6px;cursor:pointer;padding:2px;background:#0c0c0c;"/>'
    +'<input type="text" id="ds-primary-hex" value="#FFC700" maxlength="7" style="flex:1;padding:9px 10px;background:#0c0c0c;border:1px solid #252525;border-radius:6px;color:#e6edf3;font-size:12px;font-family:monospace;"/></div></div>'
    +'<div><label style="color:#8b949e;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;display:block;margin-bottom:8px;">Cor sidebar</label>'
    +'<div style="display:flex;gap:6px;align-items:center;"><input type="color" id="ds-sidebar-color" value="#111111" style="width:36px;height:36px;border:1px solid #252525;border-radius:6px;cursor:pointer;padding:2px;background:#0c0c0c;"/>'
    +'<input type="text" id="ds-sidebar-hex" value="#111111" maxlength="7" style="flex:1;padding:9px 10px;background:#0c0c0c;border:1px solid #252525;border-radius:6px;color:#e6edf3;font-size:12px;font-family:monospace;"/></div></div>'
    +'</div></div>'
    +'<div style="display:flex;gap:10px;margin-top:4px;">'
    +'<button onclick="window.dsSaveAll()" style="flex:1;padding:12px;background:#FFC700;border:none;border-radius:10px;color:#000;font-size:14px;font-weight:800;cursor:pointer;">Salvar tudo</button>'
    +'<button onclick="window.dsReset()" style="padding:12px 20px;background:transparent;border:1px solid #252525;border-radius:10px;color:#8b949e;font-size:13px;cursor:pointer;">Restaurar padrao</button>'
    +'</div></div>';
  var c=document.getElementById('screen-admin')||document.getElementById('admin-screen')||document.querySelector('.admin-main');
  if(c)c.appendChild(panel);else document.body.appendChild(panel);
}
window.dsPreviewLogo=function(){var u=(document.getElementById('ds-logo-url')||{}).value.trim();if(!u){alert('Cole uma URL valida');return;}localStorage.setItem(SK.logo,u);applyLogo(u);};
window.dsSaveAll=function(){
  var logo=(document.getElementById('ds-logo-url')||{}).value.trim();
  var primary=(document.getElementById('ds-primary-color')||{}).value||'#FFC700';
  var sidebar=(document.getElementById('ds-sidebar-color')||{}).value||'#111111';
  if(logo){localStorage.setItem(SK.logo,logo);applyLogo(logo);}
  localStorage.setItem(SK.primary,primary);localStorage.setItem(SK.sidebar,sidebar);
  applyColors(primary,sidebar);
  var btn=event&&event.target;if(btn){var t=btn.textContent;btn.textContent='Salvo!';btn.style.background='#3fb950';setTimeout(function(){btn.textContent=t;btn.style.background='#FFC700';},2000);}
};
window.dsReset=function(){if(!confirm('Restaurar padrao?'))return;Object.values(SK).forEach(function(k){localStorage.removeItem(k);});document.documentElement.style.setProperty('--gold','#FFC700');document.documentElement.style.setProperty('--sidebar','#111111');location.reload();};
function syncColor(cId,hId){var c=document.getElementById(cId),h=document.getElementById(hId);if(!c||!h)return;c.addEventListener('input',function(){h.value=c.value;applyColors();});h.addEventListener('input',function(){if(/^#[0-9a-f]{6}$/i.test(h.value)){c.value=h.value;applyColors();}});}
function loadDesignPrefs(){var logo=localStorage.getItem(SK.logo),primary=localStorage.getItem(SK.primary)||'#FFC700',sidebar=localStorage.getItem(SK.sidebar)||'#111111';var li=document.getElementById('ds-logo-url'),pc=document.getElementById('ds-primary-color'),ph=document.getElementById('ds-primary-hex'),sc=document.getElementById('ds-sidebar-color'),sh=document.getElementById('ds-sidebar-hex');if(li&&logo)li.value=logo;if(pc)pc.value=primary;if(ph)ph.value=primary;if(sc)sc.value=sidebar;if(sh)sh.value=sidebar;}
function injectDesignTab(){var nav=document.querySelector('.admin-nav,.admin-nav-bar,#admin-nav,[class*="admin-nav"]');if(!nav||document.getElementById('nav-design-injected'))return;var btn=document.createElement('button');btn.id='nav-design-injected';btn.className='admin-nav-item';btn.textContent='Design';btn.onclick=function(){window.adminNav('design',this);};nav.appendChild(btn);}
function fixLangSelector(){document.querySelectorAll('select').forEach(function(sel){if(!sel.id)return;var id=sel.id.toLowerCase();if(!id.includes('lang')&&!id.includes('idioma'))return;sel.querySelectorAll('option').forEach(function(opt){var v=(opt.value||'').toLowerCase();if(v==='pt')opt.textContent='PT - Portugues';else if(v==='en')opt.textContent='EN - English';else if(v==='es')opt.textContent='ES - Espanol';});});}
document.addEventListener('DOMContentLoaded',function(){
  buildDesignPanel();injectDesignTab();
  var logo=localStorage.getItem(SK.logo),primary=localStorage.getItem(SK.primary),sidebar=localStorage.getItem(SK.sidebar);
  if(logo)applyLogo(logo);if(primary||sidebar)applyColors(primary,sidebar);
  fixLangSelector();syncColor('ds-primary-color','ds-primary-hex');syncColor('ds-sidebar-color','ds-sidebar-hex');
});
new MutationObserver(function(){injectDesignTab();fixLangSelector();var logo=localStorage.getItem(SK.logo);if(logo)applyLogo(logo);}).observe(document.body,{childList:true,subtree:false});
})();



// ── PATCH v56 slim — só confirmação automática + vendas sem status ──
(function patchV56slim() {
  if (typeof confirmOrder !== 'function') return setTimeout(patchV56slim, 80);

  // confirmOrder: intercepta fetch para sempre salvar status='confirmado'
  if (!window._v56confirmPatched) {
    window._v56confirmPatched = true;
    const _orig = window.confirmOrder;
    window.confirmOrder = async function() {
      const origFetch = window.fetch;
      window.fetch = function(url, opts) {
        return origFetch.apply(this, arguments);
      };
      const result = await _orig.apply(this, arguments);
      window.fetch = origFetch;
      return result;
    };
  }

  // renderSalesTable: remove coluna Status e botão confirmar
  if (!window._v56salesPatched) {
    window._v56salesPatched = true;
    const _origSales = window.renderSalesTable;
    window.renderSalesTable = function() {
      _origSales.apply(this, arguments);
      const table = document.querySelector('#adm-sales table');
      if (!table) return;
      // Remove th Status
      Array.from(table.querySelectorAll('th')).forEach(th => {
        if (th.textContent.trim() === 'Status') th.remove();
      });
      // Remove apenas o status pill e o botão toggleSaleStatus (não o td inteiro)
      Array.from(table.querySelectorAll('tbody tr')).forEach(tr => {
        tr.querySelectorAll('.status-pill').forEach(el => el.remove());
        tr.querySelectorAll('[onclick*="toggleSaleStatus"]').forEach(el => el.remove());
      });
      // Info box confirmação automática
      const sales = document.querySelector('#adm-sales');
      if (sales && !sales.querySelector('.admin-info-box')) {
        const box = document.createElement('div');
        box.className = 'admin-info-box';
        box.style.cssText = 'margin-bottom:12px';
        box.innerHTML = '<span style="color:#185FA5;font-size:13px">ℹ</span><span style="font-size:11px;color:#555">Pedidos feitos pelo portal são <strong>confirmados automaticamente</strong> no momento da solicitação.</span>';
        const t = sales.querySelector('table');
        if (t) sales.insertBefore(box, t.closest('.table-wrap') || t);
      }
    };
  }

  console.log('[v56slim] OK');
})();



// ══ patch v59d — estrutura real: sale.clientCode, sale.items[{productId,qty,price}] ══
(function patchV59d() {

  function fmtBRL(v) {
    if (!v || v === 0) return 'R$ 0';
    return 'R$ ' + Number(v).toLocaleString('pt-BR', {minimumFractionDigits:0,maximumFractionDigits:0});
  }
  function saleTotal(s) {
    if (s.total && Number(s.total) > 0) return Number(s.total);
    return (s.items||[]).reduce((a,it)=>a+(Number(it.qty)||1)*(Number(it.price)||0),0);
  }
  function getProdName(id) {
    const p = (DB&&DB.products||[]).find(pr=>pr.id===id||pr.id===Number(id));
    return p ? p.name : '';
  }
  function getClientName(code) {
    const c = (DB&&DB.clients||[]).find(cl=>cl.code===code);
    return c ? c.name : code;
  }

  // Polling aguarda DB.sales pronto e admin visível
  function waitAndPopulate() {
    const ready   = typeof DB!=='undefined' && DB.sales && DB.sales.length>0;
    const adminOn = document.querySelector('#screen-admin') &&
      getComputedStyle(document.querySelector('#screen-admin')).display!=='none';
    if (!ready || !adminOn) return setTimeout(waitAndPopulate, 250);
    populateDash();
    if (document.querySelector('#adm-clients.active'))  enrichClients();
    if (document.querySelector('#adm-products.active')) enrichProducts();
  }
  setTimeout(waitAndPopulate, 500);

  // Intercepta adminNav para re-popular ao trocar de aba
  if (!window._v59dNavPatched) {
    window._v59dNavPatched = true;
    // adminNav patched by main function — no override needed
  }

  // ── Dashboard ──
  function populateDash() {
    const rankEl = document.getElementById('dash-ranking-list');
    const volEl  = document.getElementById('dash-volume-list');
    const feedEl = document.getElementById('dash-feed-list');
    if (!rankEl && !volEl && !feedEl) return;

    const sales    = (DB&&DB.sales)    || [];
    const clients  = (DB&&DB.clients)  || [];
    const products = (DB&&DB.products) || [];

    // Volume + pedidos por cliente
    const volByC={}, ordByC={};
    sales.forEach(s=>{
      const code=s.clientCode||'';
      volByC[code]=(volByC[code]||0)+saleTotal(s);
      ordByC[code]=(ordByC[code]||0)+1;
    });

    // Top 3 por volume
    const top3=clients
      .map(c=>({name:c.name,code:c.code,seg:c.segment||'',vol:volByC[c.code]||0,orders:ordByC[c.code]||0}))
      .sort((a,b)=>b.vol-a.vol).slice(0,3);
    const maxV=top3[0]?Math.max(top3[0].vol,1):1;
    const posCol=['#BA7517','#888780','#854F0B'];

    if (rankEl) {
      rankEl.innerHTML = top3.length ? top3.map((c,i)=>{
        const pct=Math.round(c.vol/maxV*100);
        return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
          '<div style="width:16px;font-size:12px;font-weight:500;color:'+posCol[i]+';text-align:center;flex-shrink:0">'+(i+1)+'</div>'+
          '<div style="flex:1;min-width:0">'+
            '<div style="font-size:11px;font-weight:500;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+c.name+'</div>'+
            '<div style="font-size:9px;color:#888">'+c.seg+' · '+c.orders+' pedido(s)</div>'+
            '<div style="height:4px;background:#f0f0f0;border-radius:2px;overflow:hidden;margin-top:4px">'+
              '<div style="height:100%;width:'+pct+'%;background:#FFCD00;border-radius:2px"></div>'+
            '</div>'+
          '</div>'+
          '<div style="font-size:11px;font-weight:500;color:#111;min-width:72px;text-align:right;flex-shrink:0">'+fmtBRL(c.vol)+'</div>'+
        '</div>';
      }).join('') : '<div style="font-size:11px;color:#aaa">Sem dados</div>';
    }

    // Receita por produto
    const recByP={};
    sales.forEach(s=>{
      (s.items||[]).forEach(it=>{
        const k=it.productId||it.id;
        recByP[k]=(recByP[k]||0)+(Number(it.qty)||1)*(Number(it.price)||0);
      });
    });
    const pColors=['#BA7517','#185FA5','#3B6D11','#888780'];
    if (volEl) {
      volEl.innerHTML = products.slice(0,4).map((p,i)=>{
        const r=recByP[p.id]||0;
        return '<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:#666;margin-bottom:6px">'+
          '<div style="width:8px;height:8px;border-radius:50%;background:'+pColors[i]+';flex-shrink:0"></div>'+
          '<span style="flex:1">'+p.name.slice(0,26)+'</span>'+
          '<span style="font-size:11px;font-weight:500;color:#111">'+fmtBRL(r)+'</span>'+
        '</div>';
      }).join('') || '<div style="font-size:11px;color:#aaa">Sem dados</div>';
    }

    // Feed últimas 3 vendas
    const lastSales=[...sales].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).slice(0,3);
    if (feedEl) {
      feedEl.innerHTML = lastSales.length ? lastSales.map(s=>{
        const t=saleTotal(s);
        const rawCode = typeof s.clientCode === 'object' ? (s.clientCode?.code || '') : (s.clientCode || '');
        const cName = getClientName(rawCode);
        const items=(s.items||[]).map(it=>{
          const n=getProdName(it.productId);
          return n?n.split(' ').slice(0,2).join(' ')+'×'+it.qty:'';
        }).filter(Boolean).join(', ').slice(0,50)||'—';
        const d=s.date?new Date(s.date).toLocaleDateString('pt-BR'):'—';
        return '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:0.5px solid #f0f0f0">'+
          '<div style="width:7px;height:7px;border-radius:50%;background:#3B6D11;flex-shrink:0"></div>'+
          '<div style="flex:1;font-size:11px;color:#111"><strong>'+cName+'</strong> — '+items+'</div>'+
          '<div style="font-size:11px;font-weight:500;color:#111">'+fmtBRL(t)+'</div>'+
          '<div style="font-size:10px;color:#aaa;margin-left:6px">'+d+'</div>'+
        '</div>';
      }).join('') : '<div style="font-size:11px;color:#aaa;padding:8px 0">Nenhuma venda</div>';
    }
  }

  // ── Clientes: Volume + Último pedido ──
  function enrichClients() { return; // colunas Volume/Último Pedido removidas
    const table=document.querySelector('#adm-clients table,#clients-table table');
    if(!table) return;
    if(table.querySelector('th[data-vc]')) return;
    const sales=(DB&&DB.sales)||[];
    const volByC={},lastByC={};
    sales.forEach(s=>{
      const code=s.clientCode||'';
      volByC[code]=(volByC[code]||0)+saleTotal(s);
      const d=new Date(s.date||0);
      if(!lastByC[code]||d>lastByC[code]) lastByC[code]=d;
    });
    const thead=table.querySelector('thead tr');
    if(thead&&!thead.querySelector('th[data-vc]')){
      const thV=document.createElement('th');thV.textContent=t('admin.totalVolume')||'Volume total';thV.dataset.vc='1';
      const thU=document.createElement('th');thU.textContent='Último pedido';thU.dataset.vc='1';
      const last=thead.querySelector('th:last-child');
      thead.insertBefore(thV,last);thead.insertBefore(thU,last);
    }
    Array.from(table.querySelectorAll('tbody tr')).forEach(tr=>{
      if(tr.dataset.vc) return;
      tr.dataset.vc='1';
      const code=(tr.querySelector('td:first-child')||{textContent:''}).textContent.trim();
      const vol=volByC[code]||0;
      const last=lastByC[code];
      const tdV=document.createElement('td');
      tdV.innerHTML=vol>0
        ?'<span style="font-size:11px;font-weight:500;color:#111">R$ '+vol.toLocaleString('pt-BR')+'</span>'
        :'<span style="font-size:11px;color:#aaa">R$ 0</span>';
      const tdU=document.createElement('td');
      tdU.innerHTML=last&&last.getTime()>0
        ?'<span style="font-size:11px;color:#666">'+last.toLocaleDateString('pt-BR')+'</span>'
        :'<span style="font-size:11px;color:#A32D2D;font-weight:500">Nunca</span>';
      const lastTd=tr.querySelector('td:last-child');
      tr.insertBefore(tdV,lastTd);tr.insertBefore(tdU,lastTd);
    });
  }

  // ── Produtos: Toggle Novo + Receita ──
  function enrichProducts() { return; // colunas Receita/Novo removidas
    const table=document.querySelector('#adm-products table');
    if(!table) return;
    if(table.querySelector('th[data-vp]')) return;
    const sales=(DB&&DB.sales)||[];
    const prods=(DB&&DB.products)||[];
    const recByP={};
    sales.forEach(s=>{
      (s.items||[]).forEach(it=>{
        const k=it.productId||it.id;
        recByP[k]=(recByP[k]||0)+(Number(it.qty)||1)*(Number(it.price)||0);
      });
    });
    const thead=table.querySelector('thead tr');
    if(thead&&!thead.querySelector('th[data-vp]')){
      const thN=document.createElement('th');thN.textContent='Novo';thN.dataset.vp='1';thN.style.textAlign='center';thN.style.width='60px';
      const thR=document.createElement('th');thR.textContent='Receita (30d)';thR.dataset.vp='1';
      const last=thead.querySelector('th:last-child');
      thead.insertBefore(thR,last);thead.insertBefore(thN,last);
    }
    Array.from(table.querySelectorAll('tbody tr')).forEach(tr=>{
      if(tr.dataset.vp) return;
      tr.dataset.vp='1';
      const nameTd=tr.querySelector('td:first-child');
      const pName=nameTd?nameTd.textContent.replace('NOVO','').replace('novo','').trim():'';
      const prod=prods.find(p=>pName.includes(p.name.slice(0,8)));
      const isNew=prod?prod.isNew:false;
      const receita=prod?(recByP[prod.id]||recByP[prod._sbId]||recByP[String(prod.id)]||0):0;
      const tdN=document.createElement('td');tdN.style.textAlign='center';
      const tog=document.createElement('button');
      tog.className='admin-toggle'+(isNew?' on':'');
      tog.title='Badge Novo no catálogo';
      tog.onclick=function(){this.classList.toggle('on');};
      tdN.appendChild(tog);
      const tdR=document.createElement('td');
      tdR.innerHTML=receita>0
        ?'<span style="font-size:11px;font-weight:500;color:#3B6D11">R$ '+receita.toLocaleString('pt-BR')+'</span>'
        :'<span style="font-size:11px;color:#aaa">R$ 0</span>';
      const lastTd=tr.querySelector('td:last-child');
      tr.insertBefore(tdR,lastTd);tr.insertBefore(tdN,lastTd);
    });
  }

  console.log('[v59d] OK');
})();



(function patchPersist(){
  if(typeof showScreen!=='function') return setTimeout(patchPersist,80);

const SURL=''; // removido — usa API local
const SKEY=''; // removido
const SH={}; // removido

  /* ── 1. SESSÃO ADMIN: persiste login no localStorage ── */
  const ADMIN_KEY='nayax_admin_session';

  // Intercepta doAdminLogin para salvar sessão após login bem-sucedido
  const _origShowScreen = showScreen;
  window.showScreen = function(id) {
    _origShowScreen.apply(this, arguments);
    if(id==='screen-admin' && DB.currentAdmin) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(Object.assign({}, DB.currentAdmin, {_exp: Date.now() + 8*60*60*1000})));
    }
  };

  // Intercepta doAdminLogout para limpar sessão
  if(typeof doAdminLogout==='function') {
    const _origLogout = doAdminLogout;
    window.doAdminLogout = function() {
      localStorage.removeItem(ADMIN_KEY);
      _origLogout.apply(this, arguments);
    };
  }

  // Restaura sessão ao carregar a página
  var _raw = localStorage.getItem(ADMIN_KEY);
  try { if(_raw) { var _t = JSON.parse(_raw); if(!_t._exp || Date.now() > _t._exp) { localStorage.removeItem(ADMIN_KEY); _raw = null; } } } catch(e) { localStorage.removeItem(ADMIN_KEY); _raw = null; }
  const saved = _raw;
  if(saved) {
    try {
      const admin = JSON.parse(saved);
      DB.currentAdmin = admin;
      currentAdmin = admin;
      // Aguarda o app inicializar e vai para o painel
      setTimeout(function() {
        const initials = (admin.name||'A').split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
        const av=document.getElementById('admin-avatar'); if(av) av.textContent=initials;
        const nm=document.getElementById('admin-topbar-name'); if(nm) nm.textContent=(admin.name||'').split(' ')[0];
        const rl=document.getElementById('admin-topbar-role'); const roles={admin:'Administrador',editor:'Editor',viewer:'Visualizador'}; if(rl) rl.textContent=roles[admin.role]||admin.role;
        showScreen('admin');
        window._adminReady = true;
      }, 600);
    } catch(e) { localStorage.removeItem(ADMIN_KEY); }
  }

  /* ── 2. deleteSale: exclui do Supabase e recarrega ── */
  const _origDeleteSale = window.deleteSale;
  window.deleteSale = async function(id) {
    if(!confirm('Excluir esta venda?')) return;
    // Remove do Supabase
    await window._dbApi('DELETE','/sales/'+encodeURIComponent(id));
    // Remove do DB local
    DB.sales = (DB.sales||[]).filter(s => s.id !== id && String(s.id) !== String(id));
    // Recarrega tabela de vendas do Supabase
    const rows = await window._dbApi('GET','/sales?limit=100&order=created_at.desc');
    if(Array.isArray(rows)) {
      DB.sales = rows.map(s=>({
        id:s.id, clientCode:s.client_code, clientName:s.client_name,
        date:s.created_at?s.created_at.substring(0,10):s.date||'',
        status:s.status, total:s.total,
        items:typeof s.items==='string'?JSON.parse(s.items):s.items||[]
      }));
    }
    if(typeof renderSalesTable==='function') renderSalesTable();
    if(typeof renderDashboard==='function') renderDashboard();
  };

  /* ── 3. Ao carregar o admin, busca vendas do Supabase ── */
  const _origRenderST = renderSalesTable;
  let _salesLoaded = false;
  window.renderSalesTable = function() {
    if(!_salesLoaded) {
      _salesLoaded = true;
      window._dbApi('GET','/sales?limit=100&order=created_at.desc')
        .then(rows=>{
          if(Array.isArray(rows) && rows.length>0) {
            DB.sales = rows.map(s=>({
              id:s.id, clientCode:s.client_code, clientName:s.client_name,
              date:s.created_at?s.created_at.substring(0,10):s.date||'',
              status:s.status, total:s.total,
              items:typeof s.items==='string'?JSON.parse(s.items):s.items||[]
            }));
          }
          _origRenderST.apply(this, arguments);
        });
    } else {
      _origRenderST.apply(this, arguments);
    }
  };

})();



function cpwdToggle(id, btn) {
  var inp = document.getElementById(id);
  var isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
    : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
}
function cpwdCheck() {
  var v = document.getElementById('cpwd-new').value;
  var c = document.getElementById('cpwd-confirm').value;
  var bars = ['cpb1','cpb2','cpb3','cpb4'].map(function(id){ return document.getElementById(id); });
  var lbl = document.getElementById('cpb-lbl');
  var inp1 = document.getElementById('cpwd-new');
  var inp2 = document.getElementById('cpwd-confirm');
  var msg = document.getElementById('cpwd-msg');
  bars.forEach(function(b){ b.style.background='#e5e7eb'; });
  lbl.textContent=''; lbl.style.color='#aaa';
  if (v.length >= 6) {
    var score = v.length < 8 ? 1 : v.length < 12 ? 2 : /[A-Z]/.test(v) && /[0-9]/.test(v) ? 4 : 3;
    var colors = ['#ef4444','#f97316','#FFCD00','#22c55e'];
    var labels = ['Fraca','Média','Boa','Forte'];
    for (var i=0;i<score;i++) bars[i].style.background=colors[score-1];
    lbl.textContent=labels[score-1]; lbl.style.color=colors[score-1];
    inp1.style.borderColor='#22c55e';
  } else {
    inp1.style.borderColor = v.length>0 ? '#ef4444' : '#d0d0d0';
  }
  if (c.length>0) {
    var match = v===c;
    inp2.style.borderColor = match ? '#22c55e' : '#ef4444';
    msg.style.color = match ? '#22c55e' : '#ef4444';
    msg.textContent = match ? 'Senhas coincidem' : 'Senhas não conferem';
  } else {
    inp2.style.borderColor='#d0d0d0';
    msg.textContent='';
  }
}


// ════════════════════════════════════════════
// BUNDLES — produtos adicionais por produto principal
// ════════════════════════════════════════════
var DB_BUNDLES = []; // cache local

function loadBundles() {
  if (!window._dbApi) return Promise.resolve();
  return window._dbApi('GET','/product_bundles').then(function(r) {
    DB_BUNDLES = Array.isArray(r) ? r : (r && r.data ? r.data : []);
    _bundles = DB_BUNDLES;
  });
}

function filterBundlesTable(search) {
  window._bundleSearch = (search || '').toLowerCase();
  _pages.bundles.page = 1;
  renderBundlesTable();
}

function renderBundlesTable() {
  var tbody = document.getElementById('bundles-tbody');
  if (!tbody) return;
  var q = window._bundleSearch || '';
  var allBundles = q
    ? DB_BUNDLES.filter(function(b) {
        return (b.bundle_name||'').toLowerCase().includes(q) ||
               (b.bundle_sku||'').toLowerCase().includes(q) ||
               (b.parent_sku||'').toLowerCase().includes(q) ||
               (b.client_code||'').toLowerCase().includes(q);
      })
    : DB_BUNDLES;
  if (!allBundles.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">' + (q ? 'Nenhum resultado para "'+q+'"' : 'Nenhum bundle cadastrado.') + '</td></tr>';
    var pgEl = document.getElementById('bundles-pagination');
    if (pgEl) pgEl.innerHTML = '';
    return;
  }
  var pg = pgSlice('bundles', allBundles);
  var rows = '';
  for (var i = 0; i < pg.rows.length; i++) {
    var b = pg.rows[i];
    var price = b.bundle_price > 0
      ? 'R$ ' + parseFloat(b.bundle_price).toLocaleString('pt-BR', {minimumFractionDigits:2})
      : '<em style="color:#999">Sem custo</em>';
    var clientLabel = b.client_code ? b.client_code : '<em style="color:#999">Todos</em>';
    var parentSkus = [];
    try {
      var parsed = JSON.parse(b.parent_sku);
      parentSkus = Array.isArray(parsed) ? parsed : [b.parent_sku];
    } catch(e) { parentSkus = [b.parent_sku]; }
    var parentLabel = parentSkus.map(function(s){ return '<strong>' + s + '</strong>'; }).join(', ');
    var safeId = String(b.id).replace(/'/g,'');
    rows += '<tr>' +
      '<td>' + parentLabel + '</td>' +
      '<td>' + clientLabel + '</td>' +
      '<td>' + b.bundle_sku + '</td>' +
      '<td>' + b.bundle_name + '</td>' +
      '<td>' + price + '</td>' +
      '<td style="display:flex;gap:6px">' +
        '<button class="btn-sm yellow" onclick="openBundleModal(\'' + safeId + '\')">' + (t('btn.edit')||'Editar') + '</button>' +
        '<button class="btn-sm red" onclick="deleteBundle(\'' + safeId + '\')">' + (t('btn.delete')||'Excluir') + '</button>' +
      '</td></tr>';
  }
  tbody.innerHTML = rows;
  var pgEl = document.getElementById('bundles-pagination');
  if (pgEl) pgEl.innerHTML = pgBar('bundles', pg);
}


function openBundleModal(id) {
  window._editingBundleId = id || null;
  _editingBundleId = id || null;
  document.getElementById('bundle-modal-title').textContent = id ? 'Editar bundle' : 'Novo bundle';
  document.getElementById('b-sku').value = '';
  document.getElementById('b-name').value = '';
  document.getElementById('b-price').value = '0';
  var searchEl = document.getElementById('b-parent-search');
  if (searchEl) searchEl.value = '';
  var selClient = document.getElementById('b-client-code');
  if (selClient) selClient.value = '';

  function _renderList(prods, selectedSkus) {
    var list = document.getElementById('b-parent-list');
    if (!list) return;
    var rows = '';
    for (var i = 0; i < prods.length; i++) {
      var p = prods[i];
      var sku = p.sku || '';
      var name = p.name || '';
      var chk = (selectedSkus && selectedSkus.indexOf(sku) > -1) ? 'checked' : '';
      rows += '<label style="display:flex;align-items:center;gap:8px;padding:6px 10px;cursor:pointer;font-size:13px">' +
        '<input type="checkbox" value="' + sku + '" ' + chk + ' onchange="updateBundleSelected()" style="accent-color:#FFCD00;width:14px;height:14px">' +
        '<span><strong>' + sku + '</strong> \u2014 ' + name + '</span></label>';
    }
    list.innerHTML = rows;
    updateBundleSelected();
  }

  function _fill(prods, clients) {
    window._bundleProds = prods || [];
    var preSelected = [];
    var b = null;
    if (id) {
      b = DB_BUNDLES.find(function(x) { return x.id === id; });
      if (b) {
        // Suportar parent_sku como JSON array ou string simples
        try {
          var parsed = JSON.parse(b.parent_sku);
          preSelected = Array.isArray(parsed) ? parsed : [b.parent_sku];
        } catch(e) { preSelected = [b.parent_sku]; }
      }
    }
    _renderList(prods, preSelected);

    if (selClient) {
      selClient.innerHTML = '<option value="">\u2014 Todos os clientes \u2014</option>';
      for (var i = 0; i < (clients || []).length; i++) {
        var c = clients[i];
        var o = document.createElement('option');
        o.value = c.code || '';
        o.textContent = (c.code || '') + (c.name ? ' \u2014 ' + c.name : '');
        selClient.appendChild(o);
      }
    }

    if (b) {
      if (selClient) selClient.value = b.client_code || '';
      document.getElementById('b-sku').value = b.bundle_sku || '';
      document.getElementById('b-name').value = b.bundle_name || '';
      document.getElementById('b-price').value = b.bundle_price != null ? b.bundle_price : 0;
    }
    openModal('modal-bundle');
  }

  var prodsP = (typeof DB !== 'undefined' && DB.products && DB.products.length > 0)
    ? Promise.resolve(DB.products)
    : window._dbApi ? window._dbApi('GET','/products').then(function(r){ return Array.isArray(r)?r:[]; }).catch(function(){ return []; })
    : Promise.resolve([]);

  var clientsP = (typeof DB !== 'undefined' && DB.clients && DB.clients.length > 0)
    ? Promise.resolve(DB.clients)
    : window._dbApi ? window._dbApi('GET','/clients?status=active').then(function(r){ return r.data||[]; }).catch(function(){ return []; })
    : Promise.resolve([]);

  Promise.all([prodsP, clientsP]).then(function(res) { _fill(res[0], res[1]); }).catch(function(e) { console.error(e); _fill([], []); });
}

function filterBundleProds(q) {
  var prods = (window._bundleProds || []).filter(function(p) {
    return ((p.sku||'') + ' ' + (p.name||'')).toLowerCase().indexOf((q||'').toLowerCase()) > -1;
  });
  var checked = [];
  document.querySelectorAll('#b-parent-list input[type=checkbox]:checked').forEach(function(c){ checked.push(c.value); });
  var list = document.getElementById('b-parent-list');
  if (!list) return;
  var rows = '';
  for (var i = 0; i < prods.length; i++) {
    var p = prods[i];
    var sku = p.sku || '';
    var name = p.name || '';
    var chk = checked.indexOf(sku) > -1 ? 'checked' : '';
    rows += '<label style="display:flex;align-items:center;gap:8px;padding:6px 10px;cursor:pointer;font-size:13px">' +
      '<input type="checkbox" value="' + sku + '" ' + chk + ' onchange="updateBundleSelected()" style="accent-color:#FFCD00;width:14px;height:14px">' +
      '<span><strong>' + sku + '</strong> \u2014 ' + name + '</span></label>';
  }
  list.innerHTML = rows;
}

function updateBundleSelected() {
  var checked = [];
  document.querySelectorAll('#b-parent-list input[type=checkbox]:checked').forEach(function(c){ checked.push(c.value); });
  var el = document.getElementById('b-parent-selected');
  if (el) el.textContent = checked.length > 0
    ? checked.length + ' produto(s): ' + checked.join(', ')
    : '';
}

async function saveBundle() {
  var checkedEls = document.querySelectorAll('#b-parent-list input[type=checkbox]:checked');
  var selectedSkus = [];
  checkedEls.forEach(function(c){ selectedSkus.push(c.value); });
  var clientEl = document.getElementById('b-client-code');
  var clientCode = (clientEl && clientEl.value) ? clientEl.value : null;
  var bundleSku  = document.getElementById('b-sku').value.trim().toUpperCase();
  var bundleName = document.getElementById('b-name').value.trim();
  var bundlePrice = parseFloat(document.getElementById('b-price').value) || 0;

  if (!selectedSkus.length || !bundleSku || !bundleName) {
    if (typeof showToast === 'function') showToast('Selecione pelo menos um produto e preencha todos os campos.', 'error');
    return;
  }

  // Salvar parent_sku como JSON array (1 registro = N produtos)
  var parentSkuValue = selectedSkus.length === 1 ? selectedSkus[0] : JSON.stringify(selectedSkus);
  var payload = { parent_sku: parentSkuValue, bundle_sku: bundleSku, bundle_name: bundleName, bundle_price: bundlePrice, client_code: clientCode };

  var res;
  if (_editingBundleId) {
    res = await window._dbApi('PUT','/product_bundles/'+encodeURIComponent(_editingBundleId),payload);
  } else {
    res = await window._dbApi('POST','/product_bundles',payload);
  }

  if (!res || res.error) {
    if (typeof showToast === 'function') showToast('Erro ao salvar bundle: ' + (res && res.error ? res.error : 'sem resposta'), 'error');
    return;
  }
  if (typeof showToast === 'function') showToast('Bundle salvo!', 'success');
  closeModal('modal-bundle');
  await loadBundles();
  renderBundlesTable();
}


async function deleteBundle(id) {
  if (!confirm('Excluir este vinculo?')) return;
  try {
    await window._dbApi('DELETE','/product_bundles/'+encodeURIComponent(id));
    await loadBundles();
    renderBundlesTable();
    showToast('Vínculo removido.');
  } catch(e) {
    showToast('Erro ao excluir vínculo: ' + (e.message || 'verifique a conexão'));
  }
}


// Carregar bundles ao iniciar
document.addEventListener('DOMContentLoaded', function(){ setTimeout(loadBundles, 1200); });


// ══════════════════════════════════════
//  PRODUCT BUNDLES
// ══════════════════════════════════════
var DB_BUNDLES = [];
var _editingBundleId = null;






document.addEventListener('DOMContentLoaded', function(){
  setTimeout(loadBundles, 1500);
});


// ── Reenviar pedido para HubSpot ──────────────────────────────────────────
async function reenviarHubSpot(orderId) {
  var sale = DB.sales.find(function(s){ return (s.id||s.order_id) === orderId; });
  if (!sale) { showToast('Pedido não encontrado.'); return; }
  showToast('Reenviando para o HubSpot...');
  var client = DB.clients.find(function(c){ return c.code === sale.clientCode; });
  var payload = {
    franchisee: {
      razaoSocial: sale.franchisee?.razao || sale.buyer_razao_social || '',
      cnpj: sale.franchisee?.cnpj || sale.buyer_cnpj || '',
      nome: sale.franchisee?.nome || sale.buyer_nome || '',
      sobrenome: sale.franchisee?.sobrenome || sale.buyer_sobrenome || '',
      cpf: sale.franchisee?.cpf || sale.buyer_cpf || '',
      nascimento: sale.franchisee?.nasc || sale.buyer_nascimento || '',
      email: sale.franchisee?.email || sale.buyer_email || '',
      telefone: sale.franchisee?.tel || sale.buyer_telefone || '',
      endereco: sale.franchisee?.endereco || {}
    },
    hubspotDeal: {
      dealName: sale.id || sale.order_id,
      amount: sale.total || 0,
      closeDate: (sale.date||'').split('T')[0] || new Date().toISOString().split('T')[0],
      clientCode: sale.clientCode,
      ownerId: (client||{}).owner_id || '',
      clientName: (client||{}).name || '',
      franquia_de_empresa: (client||{}).franchise_name || '',
      lineItems: (sale.items||[]).map(function(i){ return {sku:i.sku||'',name:i.name||'',quantity:i.qty||1,price:i.price||0,amount:(i.qty||1)*(i.price||0)}; })
    },
    order_id: sale.id || sale.order_id
  };
  try {
    var r = await fetch(window._dbAwsApi()+'/hubspot/order', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key': window._dbAwsKey ? window._dbAwsKey() : '' },
      body: JSON.stringify(payload)
    });
    var d = await r.json();
    if (d.dealId || d.deal_id) {
      showToast('✅ Deal criado no HubSpot!');
      if (true) {
        var dealId = d.dealId || d.deal_id;
        await window._dbApi('PATCH','/sales/'+encodeURIComponent(sale._sbId||sale.id),{hubspot_deal_id:String(dealId)});
        sale.hubspot_deal_id = String(dealId);
      }
      renderSalesTable();
    } else {
      showToast('⚠️ Resposta inesperada do HubSpot. Verifique os logs.');
    }
  } catch(e) {
    showToast('Erro ao reenviar: ' + e.message);
  }
}


// ══════════════════════════════════════════
// ABA HS PRODUTOS — Produtos HubSpot (marca VM Tecnologia)
// ══════════════════════════════════════════
var _hsProducts   = [];   // cache de produtos buscados do HubSpot
var _hsSelected   = new Set();
var _hsImportMap  = {};   // { hs_id: 'produto' | 'bundle' }
var _hsFilter     = 'todos';
var _hsSearch     = '';
var _hsPortalSkus = new Set(); // SKUs já importados no portal

var HS_CACHE_KEY = 'nayax_hs_products_cache';
var ANON_KEY = ''; // removido
var _HS_API = window._dbAwsApi ? window._dbAwsApi() : '/api';

// ── Chamado ao entrar na aba ──────────────────────────────────────────────
async function initHsProducts() {
  // Carregar SKUs já existentes no portal
  try {
    var prods = await window._dbApi('GET','/products');
    _hsPortalSkus = new Set((Array.isArray(prods)?prods:[]).map(function(p){ return p.sku; }));
  } catch(e) { _hsPortalSkus = new Set(); }

  // Tentar carregar do cache primeiro
  var cached = _hsGetCache();
  if (cached && cached.products) {
    _hsProducts = cached.products;
    _hsRenderTable();
    _hsUpdateSyncLabel(cached._ts);
  } else {
    // Sem cache — mostrar instrução para clicar em Atualizar
    document.getElementById('hs-table-body').innerHTML =
      '<tr><td colspan="5" style="padding:40px;text-align:center;color:var(--text-hint);font-size:13px;">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block;margin:0 auto 10px;opacity:.3;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' +
      'Clique em "Atualizar do HubSpot" para carregar os ' + (t('admin.products')||'produtos') + '</td></tr>';
  }
}

// ── Atualizar do HubSpot (busca fresh) ───────────────────────────────────
async function hsProductsRefresh() {
  var btn    = document.getElementById('btn-hs-refresh');
  var progEl = document.getElementById('hs-progress-wrap');

  function setBtn(loading, label) {
    if (!btn) return;
    btn.disabled = loading;
    var icon = loading
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite;flex-shrink:0"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
    btn.innerHTML = icon + ' ' + label;
  }

  function setProgress(current, total, msg) {
    if (!progEl) return;
    progEl.style.display = 'block';
    var pct = total > 0 ? Math.round((current / total) * 100) : 0;
    progEl.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">' +
        '<span style="font-size:11px;color:var(--text-muted);">' + msg + '</span>' +
        '<span style="font-size:11px;font-weight:600;color:var(--black);">' + pct + '%</span>' +
      '</div>' +
      '<div style="height:4px;background:var(--gray-mid);border-radius:2px;overflow:hidden;">' +
        '<div style="height:100%;width:' + pct + '%;background:var(--yellow);border-radius:2px;transition:width .3s;"></div>' +
      '</div>';
  }

  function hideProgress() {
    if (progEl) progEl.style.display = 'none';
  }

  setBtn(true, 'Buscando produtos...');
  setProgress(0, 100, 'Iniciando busca no HubSpot...');

  try {
    setProgress(20, 100, 'Conectando ao HubSpot...');

    var r = await fetch(window._dbAwsApi()+'/hubspot/products', {
      method: 'GET',
      headers: { 'x-api-key': window._dbAwsKey ? window._dbAwsKey() : '' },
      signal: AbortSignal.timeout(15000)
    });

    if (!r.ok) {
      var errText = await r.text();
      throw new Error('HTTP ' + r.status + ': ' + errText);
    }

    setProgress(70, 100, 'Processando produtos...');
    var data = await r.json();

    if (!data.products || !data.products.length) {
      throw new Error('Nenhum produto encontrado no HubSpot');
    }

    _hsProducts = data.products;
    _hsSetCache({ products: _hsProducts });
    _hsUpdateSyncLabel(Date.now());
    setProgress(100, 100, _hsProducts.length + ' produtos carregados!');
    setTimeout(function(){ hideProgress(); _hsRenderTable(); }, 600);
    showToast('✅ ' + _hsProducts.length + ' produtos carregados do HubSpot');
    setBtn(false, 'Atualizar do HubSpot');

  } catch(e) {
    hideProgress();
    showToast('Erro ao carregar produtos: ' + e.message);
    console.error('[hs-products]', e);
    setBtn(false, 'Atualizar do HubSpot');
  }
}

// ── Cache ─────────────────────────────────────────────────────────────────
function _hsGetCache() {
  try { return JSON.parse(localStorage.getItem(HS_CACHE_KEY) || 'null'); } catch(e) { return null; }
}
function _hsSetCache(data) {
  try { localStorage.setItem(HS_CACHE_KEY, JSON.stringify(Object.assign({}, data, { _ts: Date.now() }))); } catch(e) {}
}
function _hsUpdateSyncLabel(ts) {
  var el = document.getElementById('hs-last-sync');
  if (!el || !ts) return;
  var d = new Date(ts);
  el.textContent = 'Última atualização: ' + d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── Filtros ───────────────────────────────────────────────────────────────
function hsSetFilter(f, btn) {
  _pages.hsProducts.page = 1;
  _hsFilter = f;
  document.querySelectorAll('#hs-filter-pills button').forEach(function(b){
    b.className = b === btn ? 'btn-sm yellow' : 'btn-sm ghost';
  });
  _hsRenderTable();
}
function hsProductsFilter() {
  _pages.hsProducts.page = 1;
  _hsSearch = (document.getElementById('hs-search').value || '').toLowerCase();
  _hsRenderTable();
}

// ── Render tabela ─────────────────────────────────────────────────────────
function _hsGetFiltered() {
  return _hsProducts.filter(function(p) {
    var matchSearch = !_hsSearch || p.name.toLowerCase().includes(_hsSearch) || (p.sku||'').toLowerCase().includes(_hsSearch);
    var isImported = _hsPortalSkus.has(p.sku);
    var matchFilter = _hsFilter === 'todos' ? true
      : _hsFilter === 'importado' ? isImported
      : _hsFilter === 'novo' ? !isImported
      : p.type === _hsFilter;
    return matchSearch && matchFilter;
  });
}

function _hsTypeTag(t) {
  if (t === 'Produto')      return '<span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#EFF6FF;color:#2563EB;">Produto</span>';
  if (t === 'service')      return '<span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#F0FDF4;color:#16A34A;">Serviço</span>';
  if (t === 'Mensalidade')  return '<span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#FFF7ED;color:#EA580C;">Mensalidade</span>';
  return '<span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#f5f5f5;color:#888;">' + (t||'—') + '</span>';
}

function _hsImportTag(id, sku) {
  var imp = _hsImportMap[id];
  if (_hsPortalSkus.has(sku) && !imp) return '<span style="display:inline-flex;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#F0FDF4;color:#16A34A;">✓ No portal</span>';
  if (imp === 'produto') return '<span style="display:inline-flex;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#EFF6FF;color:#1d4ed8;">📦 Produto</span>';
  if (imp === 'bundle')  return '<span style="display:inline-flex;height:22px;padding:0 8px;border-radius:4px;font-size:11px;font-weight:600;background:#F5F3FF;color:#6d28d9;">🎁 Bundle</span>';
  return '<span style="color:var(--text-hint);font-size:12px;">—</span>';
}

function _hsRenderTable() {
  var allList = _hsGetFiltered();
  var pg = pgSlice('hsProducts', allList);
  var tbody = document.getElementById('hs-table-body');
  if (!tbody) return;

  document.getElementById('hs-showing').textContent = pg.total;
  document.getElementById('hs-total').textContent = _hsProducts.length;

  if (!allList.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="padding:30px;text-align:center;color:var(--text-hint);font-size:13px;">Nenhum produto encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = pg.rows.map(function(p) {
    var checked = _hsSelected.has(p.id) ? 'checked' : '';
    var rowBg = _hsSelected.has(p.id) ? 'background:#fffef0;' : '';
    return '<tr style="border-bottom:1px solid var(--gray-mid);' + rowBg + '" onclick="hsToggleRow(\'' + p.id + '\',event)">' +
      '<td style="padding:10px 14px;text-align:center;"><input type="checkbox" ' + checked + ' style="accent-color:var(--yellow);" onclick="hsToggleRow(\'' + p.id + '\',event)"></td>' +
      '<td style="padding:10px 14px;"><span style="font-family:monospace;font-size:11px;font-weight:600;background:#f0f0ec;color:#555;padding:2px 7px;border-radius:4px;white-space:nowrap;">' + (p.sku||'—') + '</span></td>' +
      '<td style="padding:10px 14px;max-width:300px;"><div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + p.name + '">' + p.name + '</div></td>' +
      '<td style="padding:10px 14px;">' + _hsTypeTag(p.type) + '</td>' +
      '<td style="padding:10px 14px;">' + _hsImportTag(p.id, p.sku) + '</td>' +
    '</tr>';
  }).join('');

  var pgHsEl = document.getElementById('hs-pagination');
  if (pgHsEl) pgHsEl.innerHTML = pgBar('hsProducts', pg);
  _hsUpdateSelBar();
  _hsRenderImportPanel();
}

// ── Seleção ───────────────────────────────────────────────────────────────
function hsToggleRow(id, e) {
  if (_hsSelected.has(id)) _hsSelected.delete(id);
  else _hsSelected.add(id);
  _hsRenderTable();
}
function hsToggleAll(chk) {
  var list = _hsGetFiltered();
  if (chk.checked) list.forEach(function(p){ _hsSelected.add(p.id); });
  else list.forEach(function(p){ _hsSelected.delete(p.id); });
  _hsRenderTable();
}
function _hsUpdateSelBar() {
  var bar = document.getElementById('hs-sel-bar');
  document.getElementById('hs-sel-count').textContent = _hsSelected.size;
  if (bar) bar.style.display = _hsSelected.size > 0 ? 'flex' : 'none';
}
function hsMarkSelected(type) {
  _hsSelected.forEach(function(id){ _hsImportMap[id] = type; });
  _hsSelected.clear();
  _hsRenderTable();
}
function hsClearSelection() { _hsSelected.clear(); _hsRenderTable(); }

// ── Painel de importação ──────────────────────────────────────────────────
function _hsRenderImportPanel() {
  var ids = Object.keys(_hsImportMap);
  var emptyEl = document.getElementById('hs-import-empty');
  var summaryEl = document.getElementById('hs-import-summary');
  var btnImport = document.getElementById('hs-btn-import');
  var listEl = document.getElementById('hs-import-list');
  if (!listEl) return;

  if (!ids.length) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    if (btnImport) { btnImport.disabled = true; btnImport.style.opacity = '.4'; }
    Array.from(listEl.children).forEach(function(c){ if (c.id !== 'hs-import-empty') c.remove(); });
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';
  if (btnImport) { btnImport.disabled = false; btnImport.style.opacity = '1'; }

  // Limpar itens anteriores
  Array.from(listEl.children).forEach(function(c){ if (c.id !== 'hs-import-empty') c.remove(); });

  var shown = ids.slice(0, 6);
  shown.forEach(function(id) {
    var p = _hsProducts.find(function(x){ return x.id === id; });
    if (!p) return;
    var imp = _hsImportMap[id];
    var div = document.createElement('div');
    div.style.cssText = 'background:#fafaf8;border:1.5px solid var(--gray-mid);border-radius:var(--radius);padding:10px 12px;margin-bottom:8px;';
    div.innerHTML =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;">' +
        '<div style="min-width:0;">' +
          '<div style="font-size:12px;font-weight:600;color:var(--black);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + p.name + '">' + p.name + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;font-family:monospace;">' + (p.sku||'—') + '</div>' +
        '</div>' +
        '<button onclick="hsRemoveFromImport(\'' + id + '\')" style="width:22px;height:22px;border:none;background:transparent;cursor:pointer;color:var(--text-hint);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;" title="Remover">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div style="display:flex;border:1.5px solid var(--gray-line);border-radius:6px;overflow:hidden;margin-top:8px;">' +
        '<button onclick="hsSetImportType(\'' + id + '\',\'produto\')" style="flex:1;height:26px;border:none;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;' + (imp==='produto'?'background:#EFF6FF;color:#2563EB;':'background:transparent;color:var(--text-muted);') + '">📦 Produto</button>' +
        '<button onclick="hsSetImportType(\'' + id + '\',\'bundle\')" style="flex:1;height:26px;border:none;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;' + (imp==='bundle'?'background:#F5F3FF;color:#6d28d9;':'background:transparent;color:var(--text-muted);') + '">🎁 Bundle</button>' +
      '</div>';
    listEl.appendChild(div);
  });

  if (ids.length > 6) {
    var more = document.createElement('div');
    more.style.cssText = 'font-size:11px;color:var(--text-hint);text-align:center;padding:4px 0;';
    more.textContent = '+ ' + (ids.length - 6) + ' mais...';
    listEl.appendChild(more);
  }

  var nP = ids.filter(function(id){ return _hsImportMap[id]==='produto'; }).length;
  var nB = ids.filter(function(id){ return _hsImportMap[id]==='bundle'; }).length;
  document.getElementById('hs-sum-p').textContent = nP;
  document.getElementById('hs-sum-b').textContent = nB;
  document.getElementById('hs-sum-t').textContent = ids.length;
}

function hsRemoveFromImport(id) { delete _hsImportMap[id]; _hsRenderTable(); }
function hsSetImportType(id, type) { _hsImportMap[id] = type; _hsRenderTable(); }

// ── Importar para o Supabase ──────────────────────────────────────────────
async function hsDoImport() {
  if (!canWrite()) return;
  var ids = Object.keys(_hsImportMap);
  if (!ids.length) { showToast('Nenhum produto na fila.'); return; }

  var btn = document.getElementById('hs-btn-import');
  if (btn) { btn.disabled = true; btn.textContent = 'Importando...'; }

  var toInsert = [];
  var toBundleUpdate = [];

  ids.forEach(function(id) {
    var p = _hsProducts.find(function(x){ return x.id === id; });
    if (!p) return;
    var type = _hsImportMap[id];
    if (type === 'produto') {
      toInsert.push({
        sku: p.sku, name: p.name,
        category: p.type === 'service' ? 'Serviços' : p.type === 'Mensalidade' ? 'Serviços' : 'Terminais',
        description: p.description || '',
        price: p.price || 0,
        is_new: false, status: 'active',
        image_url: ''
      });
    } else {
      // Bundle — vai para a tabela product_bundles ou marca na tabela products com categoria Bundle
      toInsert.push({
        sku: p.sku, name: p.name,
        category: 'Bundle',
        description: p.description || '',
        price: p.price || 0,
        is_new: false, status: 'active',
        image_url: ''
      });
    }
  });

  // guard _sb removido — usa API local

  // Upsert por SKU (atualiza se já existir)
  var res = await Promise.all(toInsert.map(function(p){ return window._dbApi('POST','/products',p); }));
  if (res.error) {
    showToast('Erro ao importar: ' + res.error.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Importar para o Portal'; }
    return;
  }

  // Atualizar cache de SKUs do portal
  ids.forEach(function(id) {
    var p = _hsProducts.find(function(x){ return x.id === id; });
    if (p) _hsPortalSkus.add(p.sku);
  });

  var nP = ids.filter(function(id){ return _hsImportMap[id]==='produto'; }).length;
  var nB = ids.filter(function(id){ return _hsImportMap[id]==='bundle'; }).length;

  // Limpar fila
  _hsImportMap = {};
  _hsRenderTable();

  showToast('✅ ' + nP + ' produto(s) e ' + nB + ' bundle(s) importados!');

  // Recarregar lista de produtos do portal
  if (typeof renderProductsTable === 'function') {
    var _prods2 = await window._dbApi('GET','/products?status=active');
    if (Array.isArray(_prods2) && _prods2.length) {
      DB.products = _prods2.map(function(p,i){
        return {id:i+1,_sbId:p.id,sku:p.sku||'',category:p.category||'Geral',name:p.name,desc:p.description||'',basePrice:parseFloat(p.price)||0,price:parseFloat(p.price)||0,image:p.image_url||'',imgUrl:p.image_url||'',isNew:p.is_new||false,status:p.status||'active'};
      });
      renderProductsTable();
    }
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Importar para o Portal'; }
}


// ══════════════════════════════════════════
// INTEGRAÇÕES
// ══════════════════════════════════════════

function initIntegracoes() {
  loadHsTokenStatus();
  loadServerStatus();
}

// ── Deploy / Atualizar Servidor ───────────────────────────────
async function loadServerStatus() {
  const el = document.getElementById('deploy-status');
  if (!el) return;
  try {
    const r = await fetch(window._dbAwsApi() + '/admin/status', {
      headers: { 'x-api-key': window._dbAwsKey ? window._dbAwsKey() : '' }
    });
    const d = await r.json();
    if (d.ok) {
      el.innerHTML =
        '<span style="color:#3B6D11">● Online</span>' +
        ' &nbsp;|&nbsp; Branch: <b>' + (d.branch||'?') + '</b>' +
        ' &nbsp;|&nbsp; Commit: <b>' + (d.commit||'?') + '</b>';
    } else {
      el.innerHTML = '<span style="color:#A32D2D">● Erro: ' + (d.error||'?') + '</span>';
    }
  } catch(e) {
    el.innerHTML = '<span style="color:#A32D2D">● Sem resposta</span>';
  }
}

// ── Reset de senha admin (self-service) ──────────────────────
async function openResetAdminPassword() {
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
  modal.innerHTML = '<div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:380px;margin:20px;font-family:inherit;">' +
    '<div style="font-size:15px;font-weight:600;color:#111;margin-bottom:4px;">Alterar minha senha</div>' +
    '<div style="font-size:12px;color:#888;margin-bottom:16px;">Admin: ' + (window._adminUser||'') + '</div>' +
    '<label style="font-size:11px;font-weight:600;color:#666;display:block;margin-bottom:6px;">Senha atual</label>' +
    '<input id="ra-current" type="password" placeholder="Senha atual" style="width:100%;box-sizing:border-box;height:40px;padding:0 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;margin-bottom:8px;">' +
    '<label style="font-size:11px;font-weight:600;color:#666;display:block;margin-bottom:6px;">Nova senha</label>' +
    '<input id="ra-new" type="password" placeholder="Mínimo 6 caracteres" style="width:100%;box-sizing:border-box;height:40px;padding:0 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;margin-bottom:8px;">' +
    '<input id="ra-confirm" type="password" placeholder="Confirmar nova senha" style="width:100%;box-sizing:border-box;height:40px;padding:0 12px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:14px;margin-bottom:16px;">' +
    '<div style="display:flex;gap:8px;">' +
    '<button onclick="this.closest(\'.ra-modal\').remove()" style="flex:1;height:38px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:8px;font-size:13px;cursor:pointer;">Cancelar</button>' +
    '<button id="ra-btn" style="flex:2;height:38px;background:#FFCD00;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Salvar senha</button>' +
    '</div></div>';
  modal.classList.add('ra-modal');
  document.body.appendChild(modal);
  document.getElementById('ra-current').focus();

  document.getElementById('ra-btn').onclick = async function() {
    var current = document.getElementById('ra-current').value;
    var pw1 = document.getElementById('ra-new').value;
    var pw2 = document.getElementById('ra-confirm').value;
    if (!current) { showToast('Digite a senha atual.'); return; }
    if (!pw1 || pw1.length < 6) { showToast('Mínimo 6 caracteres.'); return; }
    if (pw1 !== pw2) { showToast('Senhas não conferem.'); return; }
    this.textContent = 'Salvando...'; this.disabled = true;
    try {
      var hashStr = async function(str) {
        var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
      };
      var currentHash = await hashStr(current);
      var newHash     = await hashStr(pw1);
      var admins = await window._dbApi('GET', '/admins');
      var me = (Array.isArray(admins)?admins:[]).find(function(a){
        return a.email === window._adminUser && a.password_hash === currentHash;
      });
      if (!me) { showToast('Senha atual incorreta.'); this.textContent = 'Salvar senha'; this.disabled = false; return; }
      await window._dbApi('PATCH', '/admins/' + encodeURIComponent(me.id), { password_hash: newHash });
      modal.remove();
      showToast('✅ Senha alterada com sucesso!');
    } catch(e) {
      showToast('Erro: ' + e.message);
      this.textContent = 'Salvar senha'; this.disabled = false;
    }
  };
  modal.addEventListener('click', function(e){ if (e.target === modal) modal.remove(); });
}

async function triggerDeploy() {
  const btn  = document.getElementById('deploy-btn');
  const log  = document.getElementById('deploy-log');
  if (!log || !btn) return;

  if (!confirm('Isso vai executar git pull + rebuild dos containers. Continuar?')) return;

  btn.disabled = true;
  btn.textContent = '⏳ Atualizando...';
  log.style.display = 'block';
  log.innerHTML = '';
  // Barra de progresso
  var progWrap = document.getElementById('deploy-progress-wrap');
  if (!progWrap) {
    progWrap = document.createElement('div');
    progWrap.id = 'deploy-progress-wrap';
    progWrap.style.cssText = 'margin-bottom:8px;';
    progWrap.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span id="deploy-progress-label" style="font-size:12px;color:#666;">Iniciando...</span>' +
      '<span id="deploy-progress-pct" style="font-size:12px;color:#aaa;"></span></div>' +
      '<div style="height:4px;background:#f0f0f0;border-radius:2px;">' +
      '<div id="deploy-progress-bar" style="height:4px;background:#FFCD00;border-radius:2px;width:0%;transition:width .5s;"></div></div>';
    log.parentNode.insertBefore(progWrap, log);
  } else {
    document.getElementById('deploy-progress-bar').style.width = '0%';
    document.getElementById('deploy-progress-label').textContent = 'Iniciando...';
  }

  const addLine = (msg, type) => {
    const color = type === 'error' ? '#ff6b6b' : type === 'done' ? '#69db7c' : '#ccc';
    log.innerHTML += '<div style="color:' + color + ';font-size:12px;font-family:monospace;line-height:1.5">' +
      msg.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>';
    log.scrollTop = log.scrollHeight;
  };

  try {
    const r = await fetch(window._dbAwsApi() + '/admin/deploy', {
      method: 'POST',
      headers: { 'x-api-key': window._dbAwsKey ? window._dbAwsKey() : '' }
    });

    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      var DBLNL = '\n\n';
      while (buffer.indexOf(DBLNL) !== -1) {
        var _idx = buffer.indexOf(DBLNL);
        var part = buffer.slice(0, _idx);
        buffer = buffer.slice(_idx + 2);
        var dataLine = null;
        part.split('\n').forEach(function(l){ if (l.startsWith('data:')) dataLine = l; });
        if (!dataLine) continue;
        try {
          const { type, msg } = JSON.parse(dataLine.slice(5));
          addLine(msg, type);
          if (type === 'done') {
            btn.textContent = '✅ Atualizado!';
            setTimeout(() => {
              btn.disabled = false;
              btn.textContent = '🚀 Atualizar Servidor';
              loadServerStatus();
            }, 3000);
          }
          if (type === 'error') {
            btn.disabled = false;
            btn.textContent = '🚀 Atualizar Servidor';
          }
        } catch(e) {}
      }
    }
  } catch(e) {
    addLine('❌ Erro de conexão: ' + e.message, 'error');
    btn.disabled = false;
    btn.textContent = '🚀 Atualizar Servidor';
  }
}

// Carregar status do token HubSpot
async function loadHsTokenStatus() {
  const badge = document.getElementById('hs-status-badge');
  const input = document.getElementById('hs-token-input');
  if (!badge) return;

  // Token gerenciado no servidor (.env) — verificar via /api/hubspot/options
  try {
    if (true) {
      // Verificar via /hubspot/options se o token está funcionando
      const testR = await fetch(window._dbAwsApi()+'/hubspot/options', {
        headers: { 'x-api-key': window._dbAwsKey ? window._dbAwsKey() : '' }
      }).catch(function(){ return { ok: false }; });
      const data = testR.ok ? { value: '***' } : null;
      if (data && data.value) {
        // Mostrar token mascarado
        if (input) input.placeholder = 'pat-na1-' + '•'.repeat(36);
        badge.textContent = 'Token configurado';
        badge.style.background = '#EAF3DE';
        badge.style.color = '#3B6D11';
      } else {
        badge.textContent = 'Token não configurado';
        badge.style.background = '#FCEBEB';
        badge.style.color = '#A32D2D';
      }
    }
  } catch(e) {
    badge.textContent = 'Erro ao verificar';
    badge.style.background = '#FFF3CD';
    badge.style.color = '#856404';
  }
}

// Mostrar/ocultar token
function toggleHsToken() {
  const input = document.getElementById('hs-token-input');
  const icon  = document.getElementById('hs-eye-icon');
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  if (icon) {
    icon.innerHTML = isHidden
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  }
}

// Salvar token HubSpot via API — atualiza .env no servidor em runtime
async function saveHsToken() {
  const input = document.getElementById('hs-token-input');
  const token = input ? input.value.trim() : '';
  if (!token) { showToast('Digite o token antes de salvar.'); return; }
  if (!token.startsWith('pat-')) { showToast('Token inválido — deve começar com pat-'); return; }

  const btn = document.getElementById('hs-save-btn');
  if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }

  try {
    const r = await fetch(window._dbAwsApi() + '/admin/update-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': window._dbAwsKey ? window._dbAwsKey() : ''
      },
      body: JSON.stringify({ token: token, token_type: 'HUBSPOT_TOKEN' })
    });

    const d = await r.json();
    if (!r.ok || d.error) {
      showToast('Erro ao salvar: ' + (d.error || r.status));
      if (btn) { btn.textContent = 'Salvar token'; btn.disabled = false; }
      return;
    }

    showToast('✅ Token HubSpot atualizado com sucesso!');
    if (input) { input.value = ''; input.type = 'password'; }
    loadHsTokenStatus();
  } catch(e) {
    showToast('Erro ao salvar: ' + e.message);
  }
}

// Testar token HubSpot
async function testHsToken() {
  const result = document.getElementById('hs-test-result');
  if (result) { result.textContent = 'Testando...'; result.style.color = '#666'; }

  try {
    // Testar via API local (token fica no servidor)
    const data = { value: '***' }; // token não exposto

    // Tentar usar o token do input se preenchido
    const inputToken = document.getElementById('hs-token-input')?.value?.trim();
    const tokenToTest = inputToken || (data && data.value) || '';

    if (!tokenToTest) {
      if (result) { result.textContent = '❌ Nenhum token configurado'; result.style.color = '#A32D2D'; }
      return;
    }

    // Chamar API local para testar conexão HubSpot
    var headers = { 'x-api-key': window._dbAwsKey ? window._dbAwsKey() : '' };
    // Se token foi digitado no input, enviar para o servidor testar
    if (inputToken) headers['x-hs-token-test'] = inputToken;
    var r = await fetch(window._dbAwsApi()+'/hubspot/options', { headers: headers });

    if (r.ok) {
      const d = await r.json();
      const count = d.owners ? d.owners.length : (Array.isArray(d) ? d.length : '?');
      if (result) {
        result.textContent = `✅ Conectado — ${count} consultores encontrados`;
        result.style.color = '#3B6D11';
      }
      const badge = document.getElementById('hs-status-badge');
      if (badge) { badge.textContent = 'Ativo'; badge.style.background = '#EAF3DE'; badge.style.color = '#3B6D11'; }
    } else {
      if (result) { result.textContent = '❌ Falha na conexão (HTTP ' + r.status + ')'; result.style.color = '#A32D2D'; }
    }
  } catch(e) {
    if (result) { result.textContent = '❌ Erro: ' + e.message; result.style.color = '#A32D2D'; }
  }
}

