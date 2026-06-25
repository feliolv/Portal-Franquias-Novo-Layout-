
// ── Tela de pós-login com checklist ──────────────────────────────────────
function showLoginLoading(client) {
  // Preencher nome e empresa
  var nameEl    = document.getElementById('load-name');
  var companyEl = document.getElementById('load-company');
  if (nameEl)    nameEl.textContent   = 'Bem-vindo, ' + (client.code || '');
  if (companyEl) companyEl.textContent = client.name || '';

  showScreen('loading');

  var bar = document.getElementById('load-bar');

  // Step 2 — produtos (já carregados no DB)
  setTimeout(function() {
    var d2 = document.getElementById('step2-dot');
    var t2 = document.getElementById('step2-txt');
    var prodCount = typeof DB !== 'undefined' ? (DB.products || []).filter(function(p){ return p.status === 'active'; }).length : 0;
    if (d2) { d2.className = 'step-dot-l done'; d2.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'; }
    if (t2) { t2.style.color = '#555'; t2.textContent = prodCount + ' produto(s) disponíveis'; }
    if (bar) bar.style.width = '66%';
  }, 400);

  // Step 3 — abrir catálogo
  setTimeout(function() {
    var d3 = document.getElementById('step3-dot');
    var t3 = document.getElementById('step3-txt');
    if (d3) { d3.className = 'step-dot-l done'; d3.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'; }
    if (t3) { t3.style.color = '#555'; t3.textContent = 'Abrindo catálogo...'; }
    if (bar) bar.style.width = '100%';
  }, 900);

  setTimeout(function() {
    if (typeof openCatalog === 'function') openCatalog();
  }, 1400);
}

function showScreen(name) {
  // Normaliza: remove prefixo 'screen-' se vier duplicado
  var _n = name.replace(/^screen-/, '');
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
    s.style.removeProperty('background');
  });
  var _el = document.getElementById('screen-' + _n);
  // Forçar background correto nos screens de login via inline style
  if (_n === 'login' || _n === 'admin-login' || _n === 'loading') {
    if (_el) _el.style.background = 'transparent';
  }
  if (_el) _el.classList.add('active');
}

function openAdmin() { showScreen('admin-login'); setTimeout(() => document.getElementById('admin-email')?.focus(), 100); }

// ══════════════════════════════════════════
// ADMIN AUTH
// ══════════════════════════════════════════
let currentAdmin = null;

// Team / users database — carregado do Supabase em loadTeamFromDB()
let TEAM = [];
let nextMemberId = 1;

async function loadTeamFromDB() {
  try {
    const data = await window._dbApi('GET', '/team_members');
    if (!data) return;
    TEAM = (data || []).map(function(m, i) { return {
      id: m.id || (i + 1),
      _sbId: m.id,
      name: m.name || '',
      email: m.email || '',
      role: m.role || 'viewer',
      status: m.status || 'active',
      lastAccess: m.last_access ? m.last_access.split('T')[0] : '—'
    }; });
    nextMemberId = TEAM.length + 1;
    if (typeof renderTeamTable === 'function') renderTeamTable();
  } catch(e) {
    console.warn('[TEAM] erro ao carregar:', e.message);
  }
}

function fillAdminLogin(email, pass) {
  document.getElementById('admin-email').value = email;
  document.getElementById('admin-password').value = pass;
}

async function doAdminLogin() {
  const email = document.getElementById('admin-email').value.trim().toLowerCase();
  const pass  = document.getElementById('admin-password').value;
  const errEl = document.getElementById('admin-login-error');
  if (errEl) errEl.style.display = 'none';

  const _doLogin = async function(admins) {
    // Hash SHA-256 da senha digitada para comparar com o banco
    let passHash = pass;
    try {
      const enc = new TextEncoder().encode(pass);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      passHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    } catch(e) {}
    const storedPw = u => (u.password || u.password_hash || '');
    const isHash = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
    const user = admins.find(u =>
      u.email === email &&
      (isHash(storedPw(u)) ? storedPw(u) === passHash : storedPw(u) === pass) &&
      (u.status === 'active' || u.active === true)
    );
    if (!user) {
      if (errEl) { errEl.textContent = 'E-mail ou senha incorretos.'; errEl.style.display = 'block'; }
      return;
    }
    DB.currentAdmin = user;
    currentAdmin = user;
    document.getElementById('admin-email').value = '';
    document.getElementById('admin-password').value = '';
    const initials = user.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
    const av = document.getElementById('admin-topbar-avatar');
    if (av) av.textContent = initials;
    const nm = document.getElementById('admin-topbar-name');
    if (nm) nm.textContent = user.name.split(' ')[0];
    const rl = document.getElementById('admin-topbar-role');
    const roles = { admin:'Administrador', editor:'Editor', viewer:'Visualizador' };
    if (rl) rl.textContent = roles[user.role] || user.role;
    var _expTime = Date.now() + 8*60*60*1000;
    localStorage.setItem('nayax_admin_session', JSON.stringify(Object.assign({}, user, {_exp: _expTime})));
    // Aviso 15min antes de expirar
    setTimeout(function(){
      if (typeof showToast === 'function') showToast('⚠️ Sua sessão expira em 15 minutos. Salve seu trabalho.');
    }, 8*60*60*1000 - 15*60*1000);
    var _uid = user._sbId || user.id; if (_uid) {
      window._dbApi('PATCH', '/team_members/' + encodeURIComponent(_uid), {last_access: new Date().toISOString()}).catch(function(){});
      var _aidx = TEAM.findIndex(function(m){ return m._sbId === user._sbId; });
      if (_aidx > -1) TEAM[_aidx].lastAccess = _nowISO.split('T')[0];
    }
    showScreen('admin');
    window._adminReady = true;
    loadTeamFromDB();
    setTimeout(function(){ if (typeof initAdminRoute === 'function') initAdminRoute(); }, 100);
  };

  if (DB.admins && DB.admins.length > 0) {
    await _doLogin(DB.admins);
  } else {
    window._dbApi('GET','/admins').then(async rows => {
      DB.admins = rows || [];
      if (!DB.admins.length) {
        if (errEl) { errEl.textContent = 'Erro ao carregar dados. Recarregue a página.'; errEl.style.display = 'block'; }
        return;
      }
      await _doLogin(DB.admins);
    }).catch(() => {
      if (errEl) { errEl.textContent = 'Erro ao conectar. Tente novamente.'; errEl.style.display = 'block'; }
    });
  }
}

function doAdminLogout() {
  localStorage.removeItem('nayax_admin_session');
  sessionStorage.removeItem('nayax_oauth_session');
  currentAdmin = null;
  // Limpar erro do login admin
  var _err = document.getElementById('admin-login-error'); if (_err) _err.style.display = 'none';
  // Voltar para tela de login (URL /admin → /)
  if (window.history && window.history.pushState) {
    window.history.pushState({}, '', '/');
  }
  showScreen('login');
  // Ativar aba admin para facilitar re-login
  setTimeout(function(){
    if (typeof lgShowTab === 'function') lgShowTab('admin');
  }, 50);
}

// ── HubSpot OAuth ─────────────────────────────────────────────
function loginWithHubSpot() {
  window.location.href = '/auth/hubspot';
}

async function checkOAuthSession() {
  // Verificar token OAuth na URL após callback
  var params = new URLSearchParams(window.location.search);
  var session = params.get('session');
  var authError = params.get('auth_error');
  var authEmail = params.get('email');

  // Limpar URL
  if (session || authError) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (authError) {
    var msgs = {
      nao_autorizado: (authEmail ? 'O email ' + authEmail + ' não tem acesso ao portal. ' : 'Acesso negado. ') + 'Solicite ao administrador que adicione seu email na equipe.',
      token_invalido: 'Sessão HubSpot inválida. Tente entrar novamente.',
      sem_email:      'Não foi possível obter seu email do HubSpot. Verifique as permissões do app.',
      acesso_negado:  'Login cancelado pelo usuário.',
      erro_interno:   'Erro interno ao autenticar. Tente novamente ou contate o suporte.',
    };
    var el = document.getElementById('admin-login-error');
    if (el) { el.textContent = msgs[authError] || 'Erro ao autenticar: ' + authError; el.style.display = 'block'; }
    showScreen('admin-login');
    return false;
  }

  if (!session) return false;

  try {
    // Verificar token no servidor
    var r = await fetch('/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: session })
    });
    var d = await r.json();
    if (!d.ok || !d.user) return false;

    // Logar o usuário automaticamente
    var user = d.user;
    DB.currentAdmin = user;
    currentAdmin = user;
    window._adminUser = user.email;

    var initials = (user.name||'?').split(' ').slice(0,2).map(function(n){ return n[0]; }).join('').toUpperCase();
    var av = document.getElementById('admin-topbar-avatar');
    if (av) av.textContent = initials;
    var nm = document.getElementById('admin-topbar-name');
    if (nm) nm.textContent = (user.name||'').split(' ')[0];
    var rl = document.getElementById('admin-topbar-role');
    var roles = { admin:'Administrador', editor:'Editor', viewer:'Visualizador' };
    if (rl) rl.textContent = roles[user.role] || user.role;

    // Salvar sessão
    localStorage.setItem('nayax_admin_session', JSON.stringify(Object.assign({}, user, { _exp: Date.now() + 8*60*60*1000, _oauth: true })));

    showScreen('admin');
    window._adminReady = true;
    loadTeamFromDB();
    setTimeout(function(){ if (typeof initAdminRoute === 'function') initAdminRoute(); }, 100);
    return true;
  } catch(e) {
    console.warn('[OAuth]', e.message);
    return false;
  }
}

// Verificar OAuth na inicialização
(function() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('session') || params.get('auth_error')) {
    document.addEventListener('DOMContentLoaded', function() {
      checkOAuthSession();
    });
  }
})();

// ── Login automático por URL — /SHELF467 abre catálogo direto ──
async function checkUrlClientLogin() {
  var path = window.location.pathname;

  // Ignorar rotas conhecidas
  var ignored = ['/admin', '/auth', '/api', '/'];
  for (var i = 0; i < ignored.length; i++) {
    if (path === ignored[i] || path.startsWith(ignored[i] + '/')) return false;
  }

  // Extrair código do cliente do path — ex: /SHELF467 → SHELF467
  var code = path.replace(/^\//, '').split('/')[0].toUpperCase();
  if (!code || code.length < 2) return false;

  // Aguardar DB carregar
  var waited = 0;
  while ((!window.DB || !window.DB.clients || !window.DB.clients.length) && waited < 5000) {
    await new Promise(function(r){ setTimeout(r, 200); });
    waited += 200;
  }

  // Verificar se o código existe como cliente ativo
  var client = window.DB && window.DB.clients
    ? window.DB.clients.find(function(c){ return c.code === code && c.status === 'active'; })
    : null;

  if (!client) return false;

  // Atualizar URL para a raiz sem reload
  window.history.replaceState({}, document.title, '/');

  // Verificar se o cliente tem senha cadastrada
  var hasPw = client.owner_email && client.owner_email.startsWith('__pw__:');

  if (!hasPw) {
    // Sem senha — logar direto
    window.currentClient = client;
    if (window.DB) window.DB.currentClient = client;
    try { sessionStorage.setItem('nayax_client_session', code); } catch(e) {}
    if (typeof openCatalog === 'function') openCatalog();
    return true;
  }

  // Com senha — pré-preencher o código e focar no campo de senha
  var inputCode = document.getElementById('input-code');
  var inputPw   = document.getElementById('input-pw');
  if (inputCode) {
    inputCode.value = code;
    inputCode.dispatchEvent(new Event('input'));
    // Esconder campo de código visualmente (já preenchido)
    var codeGroup = inputCode.closest('.form-group') || inputCode.parentElement;
    if (codeGroup) codeGroup.style.display = 'none';
  }
  if (inputPw) setTimeout(function(){ inputPw.focus(); }, 100);
  showScreen('login');

  // Mostrar mensagem personalizada
  var subTitle = document.getElementById('login-subtitle');
  if (subTitle) subTitle.textContent = 'Bem-vindo, ' + (client.name || code) + '!';

  return true;
}

// Inicializar verificação de URL ao carregar
document.addEventListener('DOMContentLoaded', function() {
  // Pequeno delay para garantir que DB foi populado
  setTimeout(checkUrlClientLogin, 300);
});

// Permission check — block writes for viewer
function canWrite() {
  var admin = currentAdmin || DB.currentAdmin;
  if (!admin || admin.role === 'viewer') {
    showToast('Sem permissão. Perfil Visualizador é somente leitura.'); return false;
  }
  // Sincroniza currentAdmin se necessário
  if (!currentAdmin && DB.currentAdmin) currentAdmin = DB.currentAdmin;
  return true;
}

// ══════════════════════════════════════════
// TEAM CRUD
// ══════════════════════════════════════════
let editingMemberId = null;

function renderTeamTable(search = '') {
  const q = search.toLowerCase();
  const rows = TEAM.filter(u => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  const roleLabels = { admin:'Admin', editor:'Editor', viewer:'Visualizador' };
  document.getElementById('team-table').innerHTML = rows.map(u => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--black);flex-shrink:0;">${u.name.split(' ').slice(0,2).map(n=>n[0]).join('')}</div>
        <strong>${u.name}</strong>
      </div></td>
      <td style="color:var(--text-muted);font-size:12px;">${u.email}</td>
      <td><span class="role-pill ${u.role}">${roleLabels[u.role]}</span></td>
      <td style="color:var(--text-muted);font-size:12px;">${u.lastAccess && u.lastAccess !== '—' ? fmtDate(u.lastAccess) : u.lastAccess || '—'}</td>
      <td>${statusPill(u.status)}</td>
      <td><div class="td-actions">
        ${(currentAdmin?.role === 'admin' || DB.currentAdmin?.role === 'admin') ? `
          <button class="btn-sm yellow" onclick="openMemberModal(${u.id})">Editar</button>
          ${u.id !== (currentAdmin?.id || DB.currentAdmin?.id) ? `<button class="btn-sm danger" onclick="deleteMember(${u.id})">Excluir</button>` : '<span style="font-size:11px;color:var(--text-hint)">Você</span>'}
          <button class="btn-sm" style="background:#3b82f6;color:#fff;border:none" onclick="openChangePasswordModal(${u.id},'${u.name}')">Trocar Senha</button>
        ` : `
          ${u.id === (currentAdmin?.id || DB.currentAdmin?.id) ? `<button class="btn-sm" style="background:#3b82f6;color:#fff;border:none" onclick="openChangePasswordModal(${u.id},'${u.name}')">Trocar Senha</button>` : ''}
        `}
      </div></td>
    </tr>`).join('');
}

function openMemberModal(id = null) {
  if (!canWrite()) return;
  if (currentAdmin?.role !== 'admin') { showToast('Apenas Admins podem gerenciar a equipe.'); return; }
  editingMemberId = id;
  document.getElementById('member-modal-title').textContent = id ? 'Editar membro' : 'Novo membro';
  const u = id ? TEAM.find(x => x.id === id) : null;
  document.getElementById('m-name').value  = u?.name || '';
  document.getElementById('m-email').value = u?.email || '';
  document.getElementById('m-pass').value  = '';
  document.getElementById('m-role').value  = u?.role || 'editor';
  document.getElementById('m-status').value = u?.status || 'active';
  document.getElementById('m-pass').placeholder = id ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres';
  openModal('modal-member');
}

async function saveMember() {
  if (!canWrite()) return;
  var name   = document.getElementById('m-name').value.trim();
  var email  = document.getElementById('m-email').value.trim();
  var pass   = document.getElementById('m-pass').value;
  var role   = document.getElementById('m-role').value;
  var status = document.getElementById('m-status').value;
  if (!name || !email) { showToast('Nome e e-mail são obrigatórios.'); return; }
  if (!editingMemberId && !pass) { showToast('Senha obrigatória para novo membro.'); return; }
  if (pass && pass.length < 6) { showToast('Senha deve ter no mínimo 6 caracteres.'); return; }

  if (true) {
    // Hash SHA-256 da senha antes de salvar
    let passHashSave = pass;
    if (pass) {
      try {
        const enc2 = new TextEncoder().encode(pass);
        const buf2 = await crypto.subtle.digest('SHA-256', enc2);
        passHashSave = Array.from(new Uint8Array(buf2)).map(b => b.toString(16).padStart(2,'0')).join('');
      } catch(e) {}
    }
    var payload = { name: name, email: email, role: role, status: status };
    if (pass) payload.password_hash = passHashSave;
    var res2;
    if (editingMemberId) {
      var member = TEAM.find(function(m){ return m.id === editingMemberId; });
      var sbId = member && member._sbId;
      var memberKey = sbId || (member && member.id);
      if (memberKey) res2 = await window._dbApi('PATCH', '/team_members/' + encodeURIComponent(memberKey), payload);
    } else {
      res2 = await window._dbApi('POST', '/team_members', payload);
    }
    if (res2 && res2.error) { showToast('Erro: ' + res2.error.message); return; }
    // Recarrega TEAM do Supabase
    var r = await window._dbApi('GET', '/team_members');
    if (!r.error) {
      TEAM.length = 0;
      (Array.isArray(r)?r:[]).forEach(function(m,i){ TEAM.push({id:i+1,_sbId:m.id,name:m.name,email:m.email,role:m.role||'viewer',status:m.status||'active',avatar:m.avatar||'',lastAccess:'—'}); });
    }
  } else {
    if (editingMemberId) {
      var idx2 = TEAM.findIndex(function(m){ return m.id === editingMemberId; });
      if (idx2 > -1) { TEAM[idx2].name=name; TEAM[idx2].email=email; TEAM[idx2].role=role; TEAM[idx2].status=status; }
    } else {
      TEAM.push({ id: nextMemberId++, name: name, email: email, role: role, status: status, lastAccess: '—' });
    }
  }
  closeModal('modal-member');
  renderTeamTable();
  showToast('Membro salvo com sucesso!');
}

// ── Trocar Senha ──────────────────────────────────────────
function openChangePasswordModal(memberId, memberName) {
  var admin = currentAdmin || DB.currentAdmin;
  if (!admin) { showToast('Sem permissão.'); return; }
  // Qualquer admin pode trocar senha de qualquer um; viewer só do próprio
  if (admin.role !== 'admin' && memberId !== admin.id) { showToast('Sem permissão.'); return; }
  window._changePwdId = memberId;
  window._changePwdName = memberName;
  document.getElementById('cpwd-member-name').textContent = memberName || 'Membro';
  document.getElementById('cpwd-new').value = '';
  document.getElementById('cpwd-confirm').value = '';
  openModal('modal-change-password');
}

async function saveChangePassword() {
  var newPwd = document.getElementById('cpwd-new').value;
  var confirm = document.getElementById('cpwd-confirm').value;
  if (!newPwd || newPwd.length < 6) { showToast('Senha deve ter no mínimo 6 caracteres.'); return; }
  if (newPwd !== confirm) { showToast('As senhas não conferem.'); return; }
  var memberId = window._changePwdId;
  if (true) {
    // Busca _sbId do membro
    var member = TEAM.find(function(m){ return m.id === memberId; });
    var memberId2 = member && (member._sbId || member.id);
    if (!memberId2) { showToast('Membro não encontrado.'); return; }
    // Hash SHA-256 da nova senha
    var newPwdHash = newPwd;
    try {
      var enc3 = new TextEncoder().encode(newPwd);
      var buf3 = await crypto.subtle.digest('SHA-256', enc3);
      newPwdHash = Array.from(new Uint8Array(buf3)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    } catch(e) {}
    var res2 = await window._dbApi('PATCH', '/team_members/' + encodeURIComponent(memberId2), { password_hash: newPwdHash });
    if (res2 && res2.error) { showToast('Erro: ' + res2.error); return; }
  } else {
    var m = TEAM.find(function(m){ return m.id === memberId; });
    if (m) m.password = newPwd;
  }
  closeModal('modal-change-password');
  showToast('Senha alterada com sucesso!');
}
// ─────────────────────────────────────────────────────────


// ── Profile Dropdown ──────────────────────────────────────
function toggleProfileDropdown(e) {
  e.stopPropagation();
  var dd = document.getElementById('profile-dropdown');
  if (!dd) return;
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
// Fecha dropdown ao clicar fora
document.addEventListener('click', function(e) {
  var dd = document.getElementById('profile-dropdown');
  if (dd && !dd.closest('.topbar-user-clickable').contains(e.target)) {
    dd.style.display = 'none';
  }
});
function profileTab(tab) {
  var dd = document.getElementById('profile-dropdown');
  if (dd) dd.style.display = 'none';
  if (tab === 'equipe') {
    // Navega para a aba Equipe no admin (item removido do menu, chama adminNav diretamente)
    // Ativa a seção equipe diretamente sem depender do nav item
    document.querySelectorAll('.admin-nav-item').forEach(function(n){ n.classList.remove('active'); });
    document.querySelectorAll('.admin-section').forEach(function(s){ s.classList.remove('active'); });
    var sec = document.getElementById('adm-equipe');
    if (sec) { sec.classList.add('active'); if (typeof loadTeamFromDB === 'function') loadTeamFromDB(); }
  } else if (tab === 'mudar-senha') {
    // Abre modal de troca de senha para o próprio admin
    var admin = currentAdmin || DB.currentAdmin;
    if (!admin) return;
    openChangePasswordModal(admin.id, admin.name);
  }
}
// ──────────────────────────────────────────────────────────


async function deleteMember(id) {
  if (!canWrite()) return;
  var _adminId = (currentAdmin || DB.currentAdmin || {}).id;
  if (id === _adminId) { showToast('Você não pode excluir sua própria conta.'); return; }
  if (!confirm('Excluir este membro da equipe?')) return;
  var member = TEAM.find(function(m){ return m.id === id; });
  var memberId2 = member ? (member._sbId || member.id) : null;
  if (memberId2) {
    var res = await window._dbApi('DELETE', '/team_members/' + encodeURIComponent(memberId2));
    if (res && res.error) { showToast('Erro ao excluir: ' + res.error); return; }
  }
  TEAM = TEAM.filter(u => u.id !== id);
  renderTeamTable();
  showToast('Membro removido.');
}

// ══════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════
let currentClient = null;
let cart = []; window.cart = cart;

function setCode(c) { document.getElementById('input-code').value = c; document.getElementById('input-code').focus(); }



function _getLoginAttempts(code) {
  try {
    var data = JSON.parse(localStorage.getItem('_nayax_attempts') || '{}');
    return data[code] || { count: 0, lockedUntil: 0 };
  } catch(e) { return { count: 0, lockedUntil: 0 }; }
}
function _setLoginAttempts(code, count, lockedUntil) {
  try {
    var data = JSON.parse(localStorage.getItem('_nayax_attempts') || '{}');
    data[code] = { count: count, lockedUntil: lockedUntil };
    localStorage.setItem('_nayax_attempts', JSON.stringify(data));
  } catch(e) {}
}
function _clearLoginAttempts(code) {
  try {
    var data = JSON.parse(localStorage.getItem('_nayax_attempts') || '{}');
    delete data[code];
    localStorage.setItem('_nayax_attempts', JSON.stringify(data));
  } catch(e) {}
}

// helpers de hash inline (disponíveis antes de qualquer IIFE)
async function _hashPwInline(pw) {
  try {
    var enc = new TextEncoder().encode(pw);
    var buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  } catch(e) { return pw; }
}
function _isHashValue(v) {
  return typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
}
function _getPwStoreInline(code) {
  try { return (JSON.parse(localStorage.getItem('_nayax_pw') || '{}'))[code] || ''; } catch(e) { return ''; }
}

async function doLogin() {
  const code    = (document.getElementById('input-code')?.value || '').trim().toUpperCase();
  const pwInput = document.getElementById('input-pw')?.value || '';
  const errEl   = document.getElementById('login-error');
  const errSpan = errEl ? errEl.querySelector('[data-i18n]') || errEl.querySelector('span') : null;

  // ── Rate limiting ──
  const LOCK_ATTEMPTS = 5;
  const LOCK_DURATION = 15 * 60 * 1000;
  const attempts = typeof _getLoginAttempts === 'function' ? _getLoginAttempts(code || '_global') : { count:0, lockedUntil:0 };
  const now = Date.now();
  if (attempts.lockedUntil > now) {
    const remaining = Math.ceil((attempts.lockedUntil - now) / 60000);
    if (errEl) errEl.style.display = 'flex';
    if (errSpan) errSpan.textContent = `Muitas tentativas. Tente novamente em ${remaining} min.`;
    return;
  }

  // ── Validar cliente existe ──
  const client = typeof DB !== 'undefined' ? DB.clients.find(c => c.code === code && c.status === 'active') : null;
  if (!client) {
    const newCount = (attempts.lockedUntil <= now ? attempts.count : 0) + 1;
    const lockedUntil = newCount >= LOCK_ATTEMPTS ? now + LOCK_DURATION : 0;
    if (typeof _setLoginAttempts === 'function') _setLoginAttempts(code || '_global', newCount, lockedUntil);
    if (errEl) errEl.style.display = 'flex';
    if (errSpan) errSpan.textContent = lockedUntil
      ? 'Conta bloqueada por 15 minutos por excesso de tentativas.'
      : `Código ou senha incorretos. Tentativa ${newCount}/${LOCK_ATTEMPTS}.`;
    return;
  }

  // ── Verificar senha ──
  // 1. Usar owner_email já carregado no DB.clients (evita fetch extra)
  let savedHash = '';
  if (client && client.owner_email && client.owner_email.startsWith('__pw__:')) {
    savedHash = client.owner_email.replace('__pw__:', '');
  }

  // 2. Fallback: localStorage (compatibilidade)
  if (!savedHash) savedHash = _getPwStoreInline(code);

  // 3. Fallback final: buscar na API local se ainda não tem
  if (!savedHash) {
    try {
      const fresh = await window._dbApi('GET','/clients/'+encodeURIComponent(code));
      const r = { data: fresh };
      var _fresh = r && r.code ? r : (r && r.data ? r.data : null);
      if (_fresh && _fresh.owner_email && _fresh.owner_email.startsWith('__pw__:')) {
        savedHash = r.data.owner_email.replace('__pw__:', '');
        try {
          const store = JSON.parse(localStorage.getItem('_nayax_pw') || '{}');
          store[code] = savedHash;
          localStorage.setItem('_nayax_pw', JSON.stringify(store));
        } catch(e) {}
      }
    } catch(e) {}
  }

  // 3. Validar senha se existe
  if (savedHash) {
    let match = false;
    if (_isHashValue(savedHash)) {
      const hashedInput = await _hashPwInline(pwInput);
      match = (hashedInput === savedHash);
    } else {
      // texto puro legado — comparar direto e migrar
      match = (pwInput === savedHash);
      if (match) {
        const newHash = await _hashPwInline(pwInput);
        try {
          const store = JSON.parse(localStorage.getItem('_nayax_pw') || '{}');
          store[code] = newHash;
          localStorage.setItem('_nayax_pw', JSON.stringify(store));
          window._dbApi('PATCH','/clients/'+encodeURIComponent(code),{owner_email:'__pw__:'+newHash}).then(()=>{});
        } catch(e) {}
      }
    }
    if (!match) {
      const newCount = (attempts.lockedUntil <= now ? attempts.count : 0) + 1;
      const lockedUntil = newCount >= LOCK_ATTEMPTS ? now + LOCK_DURATION : 0;
      if (typeof _setLoginAttempts === 'function') _setLoginAttempts(code || '_global', newCount, lockedUntil);
      if (errEl) errEl.style.display = 'flex';
      if (errSpan) errSpan.textContent = lockedUntil
        ? 'Conta bloqueada por 15 minutos por excesso de tentativas.'
        : 'Código ou senha incorretos.';
      return;
    }
  }

  // ── Login bem-sucedido ──
  if (typeof _clearLoginAttempts === 'function') _clearLoginAttempts(code);
  currentClient = client; window._currentClient = client;
  cart = [];
  if (errEl) errEl.style.display = 'none';
  try {
    window._dbApi && window._dbApi('POST','/access_logs',{
        client_code: code, event: 'login_success',
        user_agent: navigator.userAgent.slice(0, 200),
        created_at: new Date().toISOString()
      }).then(()=>{});
  } catch(e) {}
  try { sessionStorage.setItem('nayax_client_session', code); } catch(e) {}
  openCatalog();
}

function doLogout() {
  currentClient = null; cart = [];
  sessionStorage.removeItem('nayax_client_session');
  var _dock = document.getElementById('cart-dock'); if (_dock) _dock.classList.remove('visible');
  var _navItem = document.getElementById('nav-cart-item'); if (_navItem) _navItem.style.display = 'none';
  // Limpar todos os campos do formulário de login
  var _codeEl = document.getElementById('input-code'); if (_codeEl) { _codeEl.value = ''; _codeEl.closest && _codeEl.closest('.form-group') && (_codeEl.closest('.form-group').style.display = ''); }
  var _pwEl   = document.getElementById('input-pw');   if (_pwEl)   _pwEl.value = '';
  // Limpar mensagem de erro
  var _errEl  = document.getElementById('login-error'); if (_errEl) _errEl.style.display = 'none';
  // Restaurar subtitle
  var _sub = document.getElementById('login-subtitle'); if (_sub) _sub.textContent = '';
  showScreen('login');
  setTimeout(function(){ var el = document.getElementById('input-code'); if (el && el.style.display !== 'none') el.focus(); }, 100);
}

// ══════════════════════════════════════════
// CATALOG
// ══════════════════════════════════════════
const CAT_ICONS = {
  Terminais:`<svg width="72" height="72" viewBox="0 0 72 72" fill="none"><rect x="14" y="8" width="44" height="56" rx="5" fill="#1A1A1A" opacity="0.08"/><rect x="18" y="12" width="36" height="44" rx="3" fill="#FFC700" opacity="0.2"/><rect x="22" y="16" width="28" height="18" rx="2" fill="#1A1A1A" opacity="0.15"/><rect x="22" y="40" width="7" height="5" rx="1.5" fill="#1A1A1A" opacity="0.25"/><rect x="33" y="40" width="7" height="5" rx="1.5" fill="#1A1A1A" opacity="0.25"/><rect x="44" y="40" width="7" height="5" rx="1.5" fill="#1A1A1A" opacity="0.25"/><circle cx="36" cy="52" r="4" fill="#FFC700" opacity="0.7"/></svg>`,
  Leitoras:`<svg width="72" height="72" viewBox="0 0 72 72" fill="none"><rect x="16" y="16" width="40" height="40" rx="8" fill="#1A1A1A" opacity="0.08"/><rect x="22" y="22" width="28" height="28" rx="5" fill="#FFC700" opacity="0.25"/><path d="M30 36 Q36 28 42 36" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/><path d="M25 36 Q36 22 47 36" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.25"/><circle cx="36" cy="41" r="3.5" fill="#1A1A1A" opacity="0.45"/></svg>`,
  Software:`<svg width="72" height="72" viewBox="0 0 72 72" fill="none"><rect x="10" y="14" width="52" height="36" rx="5" fill="#1A1A1A" opacity="0.08"/><rect x="14" y="18" width="44" height="28" rx="3" fill="#FFC700" opacity="0.2"/><rect x="20" y="24" width="18" height="3" rx="1.5" fill="#1A1A1A" opacity="0.35"/><rect x="20" y="30" width="32" height="2" rx="1" fill="#1A1A1A" opacity="0.2"/><rect x="20" y="35" width="24" height="2" rx="1" fill="#1A1A1A" opacity="0.2"/><rect x="28" y="50" width="16" height="6" rx="2" fill="#1A1A1A" opacity="0.15"/></svg>`,
  Acessórios:`<svg width="72" height="72" viewBox="0 0 72 72" fill="none"><circle cx="36" cy="36" r="20" fill="#1A1A1A" opacity="0.07"/><circle cx="36" cy="36" r="12" fill="#FFC700" opacity="0.25"/><path d="M28 36h16M36 28v16" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" opacity="0.4"/><circle cx="36" cy="36" r="4" fill="#1A1A1A" opacity="0.4"/></svg>`,
  Serviços:`<svg width="72" height="72" viewBox="0 0 72 72" fill="none"><rect x="12" y="20" width="48" height="32" rx="5" fill="#1A1A1A" opacity="0.08"/><rect x="16" y="24" width="40" height="24" rx="3" fill="#FFC700" opacity="0.2"/><circle cx="24" cy="36" r="5" fill="#1A1A1A" opacity="0.25"/><rect x="32" y="32" width="18" height="3" rx="1.5" fill="#1A1A1A" opacity="0.3"/><rect x="32" y="38" width="12" height="2" rx="1" fill="#1A1A1A" opacity="0.2"/></svg>`
};

function getClientPrice(p) {
  var pr = (currentClient.prices && Object.keys(currentClient.prices).length)
    ? currentClient.prices
    : (currentClient.custom_prices || {});
  // Verificar por _sbId (UUID do Supabase) primeiro, depois por id local
  var v = p._sbId !== undefined && pr[p._sbId] !== undefined ? pr[p._sbId]
        : pr[p.id] !== undefined ? pr[p.id]
        : pr[String(p.id)];
  if (v !== undefined) return parseFloat(v);
  return p.basePrice;
}




// ── Sistema de senha por cliente ──
(function() {
  var STORE_KEY = '_nayax_pw';

  function getPwStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch(e) { return {}; }
  }

  // Hash SHA-256 — só chamar com senha em TEXTO PURO, nunca com hash já existente
  async function _hashPw(pw) {
    try {
      var enc = new TextEncoder().encode(pw);
      var buf = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    } catch(e) { return pw; }
  }

  // isHashValue: retorna true se o valor já é um hash SHA-256 (64 hex chars)
  function isHashValue(v) {
    return typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
  }

  // savePwHash: salva hash no localStorage e Supabase
  // Recebe o hash diretamente — não re-hasheia
  function savePwHash(code, hash) {
    var s = getPwStore();
    s[code] = hash;
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
    if (code && hash) {
      window._dbApi('PATCH','/clients/'+encodeURIComponent(code),{owner_email:'__pw__:'+newHash})
        .then(function(r) {
          if (r.error) console.warn('[PW] erro ao salvar no Supabase:', r.error.message);
        });
    }
  }

  // setPw: recebe senha em texto puro, hasheia e salva
  // Se já for hash, salva direto sem re-hashear
  async function setPw(code, pw) {
    var hash = isHashValue(pw) ? pw : await _hashPw(pw);
    savePwHash(code, hash);
  }

  function getPw(code) {
    return getPwStore()[code] || '';
  }

  // Botão olho nos campos de senha
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    var input = document.getElementById(btn.getAttribute('data-toggle'));
    if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    var svg = btn.querySelector('svg');
    if (svg) svg.innerHTML = show
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    btn.style.color = show ? '#444' : '#aaa';
  });

  

function applyPatches() {

    // ── Patch openClientModal: mostrar ••••• se há senha, não o hash ──
    var _origOpen = window.openClientModal;
    if (_origOpen && !_origOpen._pwPatched) {
      window.openClientModal = function(code) {
        _origOpen.apply(this, arguments);
        setTimeout(function() {
          var hasPw = false;
          // Verificar via API local
          if (code) {
            window._dbApi('GET','/clients/'+encodeURIComponent(code))
              .then(function(fresh) {
                var r = { data: fresh };
                if (r.data && r.data.owner_email && r.data.owner_email.startsWith('__pw__:')) {
                  var sbHash = r.data.owner_email.replace('__pw__:', '');
                  // Sincronizar localStorage com Supabase (sem re-hashear)
                  savePwHash(code, sbHash);
                  hasPw = true;
                } else {
                  hasPw = !!getPw(code);
                }
                var f1 = document.getElementById('c-password');
                var f2 = document.getElementById('c-password-confirm');
                // Mostrar placeholder — nunca exibir o hash
                // Resetar toggle de alterar senha
                var toggle = document.getElementById('c-pw-change-toggle');
                var revBtn = document.getElementById('c-pw-reveal-btn');
                var pwInput = document.getElementById('c-password');
                var pwInput2 = document.getElementById('c-password-confirm');
                if (toggle) { toggle.checked = false; }
                if (pwInput) {
                  pwInput.disabled = true;
                  pwInput.value = '';
                  pwInput.placeholder = hasPw ? 'Nova senha (marque "Alterar senha" para editar)' : 'Marque "Alterar senha" para definir';
                  pwInput.style.background = '#f5f5f5';
                  pwInput.style.color = '#aaa';
                  pwInput.style.cursor = 'not-allowed';
                  pwInput.style.opacity = '.6';
                }
                if (pwInput2) {
                  pwInput2.disabled = true;
                  pwInput2.value = '';
                  pwInput2.style.background = '#f5f5f5';
                  pwInput2.style.color = '#aaa';
                  pwInput2.style.cursor = 'not-allowed';
                  pwInput2.style.opacity = '.6';
                }
                if (f2) { f2.value = ''; f2.placeholder = hasPw ? 'Confirmar nova senha' : 'Confirmar senha'; }
                // Mostrar botão de ver senha se cliente tem senha definida
                if (revBtn) revBtn.style.display = (hasPw && code) ? 'inline-flex' : 'none';
              });
          }
        }, 150);
      };
      window.openClientModal._pwPatched = true;
    }

    // ── Patch saveClient: hasheia nova senha antes de salvar ──
    var _origSave = window.saveClient;
    if (_origSave && !_origSave._pwPatched) {
      window.saveClient = function() {
        var code = (document.getElementById('c-code') ? document.getElementById('c-code').value : '').trim().toUpperCase();
        var pwEl = document.getElementById('c-password');
        var pw  = (pwEl && !pwEl.disabled) ? pwEl.value : ''; // Só pega senha se campo estiver habilitado
        var pwc = document.getElementById('c-password-confirm') ? document.getElementById('c-password-confirm').value : '';
        var warn = document.getElementById('c-pw-warn');
        if (pw && pw !== pwc) {
          if (warn) warn.style.display = 'block';
          if (typeof showToast === 'function') showToast('Senhas não conferem.');
          return;
        }
        if (warn) warn.style.display = 'none';
        // Só salva se uma nova senha foi digitada (não em branco)
        if (pw && code) {
          setPw(code, pw);
          // Salvar também versão AES criptografada para visualização pelo admin
          _aesEncrypt(pw, code).then(function(enc) {
            window._dbApi && window._dbApi('PATCH','/clients/'+encodeURIComponent(code),{ owner_pw_enc: enc }).then(function(){});
          });
        }
        _origSave.apply(this, arguments);
      };
      window.saveClient._pwPatched = true;
    }

    // doLogin: lógica de senha agora nativa na função (não precisa patch)

    // ── _loginWithPw: comparar hash ──
    window._loginWithPw = async function(code, pwInput, savedPw) {
      if (savedPw) {
        var match = false;
        if (isHashValue(savedPw)) {
          // Valor salvo é hash — comparar hash do input
          var hashedInput = pwInput ? await _hashPw(pwInput) : '';
          match = (hashedInput === savedPw);
        } else {
          // Valor salvo é texto puro (legado) — comparar direto e migrar
          match = (pwInput === savedPw);
          if (match) {
            // Migrar para hash automaticamente
            var newHash = await _hashPw(pwInput);
            savePwHash(code, newHash);
          }
        }
        if (!match) {
          var errEl = document.getElementById('login-error');
          if (errEl) {
            errEl.style.display = 'flex';
            var span = errEl.querySelector('[data-i18n]') || errEl.querySelector('span');
            if (span) span.textContent = 'Código ou senha incorretos.';
          }
          return;
        }
      }

      // Senha ok (ou sem senha) — chamar doLogin original
      var code2 = (document.getElementById('input-code') ? document.getElementById('input-code').value : '').trim().toUpperCase();
      var client = typeof DB !== 'undefined' ? DB.clients.find(function(c){ return c.code === code2 && c.status === 'active'; }) : null;
      if (!client) {
        var errEl = document.getElementById('login-error');
        if (errEl) errEl.style.display = 'flex';
        return;
      }
      // Log de acesso
      try {
        window._dbApi && window._dbApi('POST','/access_logs',{
            client_code: code,
            event: 'login_success',
            user_agent: navigator.userAgent.slice(0, 200),
            created_at: new Date().toISOString()
          }).then(function(){});
      } catch(e) {}

      if (typeof currentClient !== 'undefined') currentClient = client;
      else window.currentClient = client;
      if (typeof cart !== 'undefined') cart = [];
      else window.cart = [];

      var errEl = document.getElementById('login-error');
      if (errEl) errEl.style.display = 'none';
      if (typeof showLoginLoading === 'function') showLoginLoading(client);
      else if (typeof openCatalog === 'function') openCatalog();
    };

    // Limpar tentativas bloqueadas se houver (segurança)
    if (typeof _getLoginAttempts === 'undefined') {
      window._getLoginAttempts = function(code) {
        try { var d = JSON.parse(localStorage.getItem('_nayax_attempts') || '{}'); return d[code] || { count: 0, lockedUntil: 0 }; } catch(e) { return { count: 0, lockedUntil: 0 }; }
      };
      window._setLoginAttempts = function(code, count, lockedUntil) {
        try { var d = JSON.parse(localStorage.getItem('_nayax_attempts') || '{}'); d[code] = { count: count, lockedUntil: lockedUntil }; localStorage.setItem('_nayax_attempts', JSON.stringify(d)); } catch(e) {}
      };
      window._clearLoginAttempts = function(code) {
        try { var d = JSON.parse(localStorage.getItem('_nayax_attempts') || '{}'); delete d[code]; localStorage.setItem('_nayax_attempts', JSON.stringify(d)); } catch(e) {}
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(applyPatches, 100); });
  } else {
    setTimeout(applyPatches, 100);
  }
})();


// ── Timeout de sessão inativa (2 horas) ──
(function() {
  var SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 horas
  var lastActivity = Date.now();

  function resetActivity() { lastActivity = Date.now(); }
  function checkSession() {
    if (typeof currentClient !== 'undefined' && currentClient) {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        if (typeof doLogout === 'function') {
          doLogout();
          alert('Sua sessão expirou por inatividade. Faça login novamente.');
        }
      }
    }
  }

  ['mousemove','keydown','click','touchstart','scroll'].forEach(function(ev) {
    document.addEventListener(ev, resetActivity, { passive: true });
  });
  setInterval(checkSession, 60 * 1000); // checar a cada 1 min
})();


// ── Restaurar sessão do cliente ao recarregar ──────────────────────────────
(function restoreClientSession() {
  try {
    var savedCode = sessionStorage.getItem('nayax_client_session');
    if (!savedCode) return;
    function _tryRestore() {
      if (typeof DB === 'undefined' || !DB.clients || !DB.clients.length) {
        return setTimeout(_tryRestore, 200);
      }
      var client = DB.clients.find(function(c){ return c.code === savedCode && c.status === 'active'; });
      if (client && typeof openCatalog === 'function') {
        currentClient = client;
        cart = [];
        openCatalog();
      }
    }
    setTimeout(_tryRestore, 600);
  } catch(e) {}
})();



// ══════════════════════════════════════════
// CRIPTOGRAFIA AES — para visualização de senha pelo admin
// Usa WebCrypto API nativa do browser (sem lib externa)
// ══════════════════════════════════════════

// Chave derivada de uma secret fixa + código do cliente (não armazenada no código em texto puro)
var _AES_SECRET = 'NayaxBR@Portal2025!';

async function _aesEncrypt(text, clientCode) {
  var enc = new TextEncoder();
  var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(_AES_SECRET + clientCode), 'PBKDF2', false, ['deriveKey']);
  var salt = enc.encode('NayaxSalt' + clientCode);
  var key  = await crypto.subtle.deriveKey(
    { name:'PBKDF2', salt, iterations:100000, hash:'SHA-256' },
    keyMaterial, { name:'AES-GCM', length:256 }, false, ['encrypt']
  );
  var iv   = crypto.getRandomValues(new Uint8Array(12));
  var ct   = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, enc.encode(text));
  // Concatenar iv + ciphertext e converter para base64
  var combined = new Uint8Array(iv.length + ct.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ct), iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function _aesDecrypt(b64, clientCode) {
  try {
    var enc  = new TextEncoder();
    var dec  = new TextDecoder();
    var data = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    var iv   = data.slice(0, 12);
    var ct   = data.slice(12);
    var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(_AES_SECRET + clientCode), 'PBKDF2', false, ['deriveKey']);
    var salt = enc.encode('NayaxSalt' + clientCode);
    var key  = await crypto.subtle.deriveKey(
      { name:'PBKDF2', salt, iterations:100000, hash:'SHA-256' },
      keyMaterial, { name:'AES-GCM', length:256 }, false, ['decrypt']
    );
    var plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, ct);
    return dec.decode(plain);
  } catch(e) {
    return null;
  }
}

// ══════════════════════════════════════════
// SENHA DO CLIENTE — toggle alterar + visualizar
// ══════════════════════════════════════════

function togglePwChange(chk) {
  var input  = document.getElementById('c-password');
  var input2 = document.getElementById('c-password-confirm');
  var revBtn = document.getElementById('c-pw-reveal-btn');
  if (!input) return;

  if (chk.checked) {
    // Habilitar campos para edição
    input.disabled = false;
    input.style.background = '';
    input.style.color = '';
    input.style.cursor = '';
    input.style.opacity = '';
    input.value = '';
    input.focus();
    if (input2) { input2.disabled = false; input2.style.background = ''; input2.style.color = ''; input2.style.cursor = ''; input2.style.opacity = ''; }
    if (revBtn) revBtn.style.display = 'none';
  } else {
    // Desabilitar campos — manter senha atual
    input.disabled = true;
    input.style.background = '#f5f5f5';
    input.style.color = '#aaa';
    input.style.cursor = 'not-allowed';
    input.style.opacity = '.6';
    input.value = '';
    if (input2) { input2.disabled = true; input2.style.background = '#f5f5f5'; input2.style.color = '#aaa'; input2.style.cursor = 'not-allowed'; input2.style.opacity = '.6'; input2.value = ''; }
    if (revBtn) revBtn.style.display = editingClientCode ? 'inline-flex' : 'none';
  }
}

function revealClientPw() {
  var code = (document.getElementById('c-code') ? document.getElementById('c-code').value : '').trim().toUpperCase();
  if (!code) { showToast('Código do cliente não encontrado.'); return; }
  var btn = document.getElementById('c-pw-reveal-btn');
  if (btn) { btn.textContent = '⏳ Buscando...'; btn.disabled = true; }

  window._dbApi('GET','/clients/'+encodeURIComponent(code))
    .then(function(fresh) {
      var r = { data: fresh };
      if (btn) { btn.innerHTML = '👁 Ver senha atual'; btn.disabled = false; }
      if (!r.data) { showToast('Cliente não encontrado.'); return; }
      var stored = r.data.owner_email || '';
      if (!stored) { showToast('Este cliente não tem senha definida.'); return; }

      var display = '';
      if (stored.startsWith('__pw__:')) {
        // Hash — mostrar em modal com aviso
        display = stored.replace('__pw__:', '');
        _showPwModal(code, display, true);
      } else {
        // Texto puro (legado)
        _showPwModal(code, stored, false);
      }
    })
    .catch(function(e) {
      if (btn) { btn.innerHTML = '👁 Ver senha atual'; btn.disabled = false; }
      showToast('Erro ao buscar senha: ' + e.message);
    });
}

function _showPwModal(code, value, isHash) {
  var existing = document.getElementById('pw-reveal-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'pw-reveal-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;border-radius:12px;padding:24px 28px;width:380px;max-width:90vw;box-shadow:0 16px 48px rgba(0,0,0,0.2);';

  var iconBg  = isHash ? '#FFF7D6' : '#ECFDF5';
  var subtitle = isHash ? 'Hash SHA-256 — não reversível' : 'Senha em texto';

  var valueHtml = isHash
    ? '<div style="background:#f5f5f5;border-radius:8px;padding:12px 14px;font-family:monospace;font-size:11px;color:#555;word-break:break-all;margin-bottom:8px;">' + value + '</div>' +
      '<div style="background:#FFF7D6;border:1px solid #fde68a;border-radius:6px;padding:8px 12px;font-size:12px;color:#92400e;margin-bottom:16px;">⚠️ A senha está armazenada como hash — não é possível visualizar o valor original. Para redefinir, marque "Alterar senha" e cadastre uma nova.</div>'
    : '<div style="background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:16px;font-size:24px;font-weight:700;letter-spacing:6px;text-align:center;color:#111;margin-bottom:16px;">' + value + '</div>';

  box.innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">' +
      '<div style="width:36px;height:36px;background:' + iconBg + ';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;">🔑</div>' +
      '<div>' +
        '<div style="font-size:15px;font-weight:700;color:#111;">Senha — ' + code + '</div>' +
        '<div style="font-size:11px;color:#888;">' + subtitle + '</div>' +
      '</div>' +
    '</div>' +
    valueHtml +
    '<button id="pw-modal-close-btn" style="width:100%;height:38px;background:#1A1A1A;border:none;border-radius:8px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;">Fechar</button>';

  overlay.appendChild(box);

  // Fechar pelo botão ou clicando fora
  function closeModal() { overlay.remove(); }
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  // Adicionar listener após inserir no DOM
  setTimeout(function() {
    var btn = document.getElementById('pw-modal-close-btn');
    if (btn) btn.addEventListener('click', closeModal);
  }, 0);

  document.body.appendChild(overlay);
}


async function revealClientPw() {
  var code = (document.getElementById('c-code') ? document.getElementById('c-code').value : '').trim().toUpperCase();
  if (!code) { showToast('Código do cliente não encontrado.'); return; }
  var btn = document.getElementById('c-pw-reveal-btn');
  if (btn) { btn.innerHTML = '⏳ Buscando...'; btn.disabled = true; }

  try {
    var fresh = await window._dbApi('GET','/clients/'+encodeURIComponent(code));
    var r = {data: fresh};
    if (btn) { btn.innerHTML = '👁 Ver senha atual'; btn.disabled = false; }
    if (!r.data) { showToast('Cliente não encontrado.'); return; }

    // 1. Tentar descriptografar AES (mostra senha em texto claro)
    if (r.data.owner_pw_enc) {
      var plain = await _aesDecrypt(r.data.owner_pw_enc, code);
      if (plain) { _showPwModal(code, plain, false); return; }
    }

    // 2. Fallback: sem versão AES — mostrar hash com aviso
    var stored = r.data.owner_email || '';
    if (!stored) { showToast('Este cliente não tem senha definida.'); return; }
    if (stored.startsWith('__pw__:')) {
      _showPwModal(code, stored.replace('__pw__:', ''), true);
    } else {
      _showPwModal(code, stored, false);
    }
  } catch(e) {
    if (btn) { btn.innerHTML = '👁 Ver senha atual'; btn.disabled = false; }
    showToast('Erro: ' + e.message);
  }
}


// ── Toggle senha no login do franqueado ──────────────────────────────────
function togglePwVisibility() {
  var input = document.getElementById('input-pw');
  var icon  = document.getElementById('pw-eye-icon');
  if (!input) return;
  var showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  if (icon) {
    icon.innerHTML = showing
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    icon.setAttribute('stroke', showing ? '#CCC' : '#888');
  }
}
// ── Toggle visibilidade senha admin ──
function toggleAdminPwVisibility() {
  const input = document.getElementById('admin-password');
  const icon  = document.getElementById('admin-pw-eye-icon');
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  if (icon) {
    icon.innerHTML = isHidden
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  }
}


