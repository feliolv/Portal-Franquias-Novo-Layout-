/* ================================================================
   DealNayax v6 — Main app logic
================================================================ */

var D = window.__data;
window.I18N = window.__i18n;

// ============ ICON HELPERS (Lucide-style inline SVG) ============
var ICN = (name, size=14) => {
  const paths = {
    "grid":           '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    "briefcase":      '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    "file-text":      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    "plus":           '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    "check":          '<polyline points="20 6 9 17 4 12"/>',
    "x":              '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    "check-circle":   '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    "trash":          '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    "refresh":        '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    "search":         '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    "bell":           '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    "help":           '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    "more":           '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    "drag":           '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
    "edit":           '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    "trend-up":       '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    "trend-dn":       '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    "users":          '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "user-check":     '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>',
    "shield":         '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    "zap":            '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    "tag":            '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    "package":        '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    "target":         '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "settings":       '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    "info":           '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    "alert":          '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    "send":           '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    "download":       '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    "upload":         '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    "arrow-right":    '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    "arrow-down":     '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
    "chevron-right":  '<polyline points="9 18 15 12 9 6"/>',
    "chevron-down":   '<polyline points="6 9 12 15 18 9"/>',
    "chevron-up":     '<polyline points="18 15 12 9 6 15"/>',
    "credit-card":    '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    "monitor":        '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    "wifi":           '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
    "coffee":         '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
    "droplets":       '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
    "joystick":       '<path d="M21 17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="11" r="2"/><line x1="9" y1="11" x2="9" y2="11.01"/><line x1="15" y1="11" x2="15" y2="11.01"/>',
    "cloud":          '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    "wallet":         '<path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
    "tool":           '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    "headphones":     '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    "percent":        '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    "calendar":       '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    "clock":          '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "external":       '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    "lock":           '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "filter":         '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    "user":           '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "repeat":         '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    "globe":          '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    "play":           '<polygon points="5 3 19 12 5 21 5 3"/>',
    "pause":          '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
    "history":        '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><polyline points="12 7 12 12 16 14"/>',
    "git":            '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    "layers":         '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    "log-out":        '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    "command":        '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]||""}</svg>`;
};

// ============ APP STATE ============
var STATE = {
  page: "dashboard",
  lang: "pt",
  theme: "light",       // light | dark
  density: "comfortable", // comfortable | compact
  builder: JSON.parse(JSON.stringify(D.BUILDER_DEFAULT))
};

// ============ NUMBER UTILS ============
var fmt = {
  brl: n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0,maximumFractionDigits:0}),
  brl2: n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),
  num: n => n.toLocaleString("pt-BR"),
  pct: n => n.toFixed(0)+"%"
};

// ============ NAV ============
const PAGE_LABELS = {
  dashboard: "Visão Geral · Orçamentos",
  deals: "Negócios",
  quotes: "Orçamentos",
  builder: "Novo Orçamento",
  approvals: "Aprovações",
  profile: "Meu Perfil",
  roles: "Perfis de Acesso",
  admin: "Configurações"
};
function nav(page){
  STATE.page = page;
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("on"));
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("on"));
  const p = document.getElementById("pg-"+page); if(p) p.classList.add("on");
  const n = document.getElementById("ni-"+page); if(n) n.classList.add("on");
  const lbl = document.getElementById("tb-cur-page"); if(lbl) lbl.textContent = PAGE_LABELS[page] || page;
  // Show filters only on dashboard
  const filters = document.getElementById("tb-filters");
  if(filters) filters.style.display = page === "dashboard" ? "flex" : "none";
  window.scrollTo({top:0});
}

// segPill toggle helper (topbar segmented controls)
function segPill(el, ev){
  if(ev) ev.preventDefault();
  const group = el.parentNode;
  group.querySelectorAll(".seg-pill").forEach(p=>p.classList.remove("on"));
  el.classList.add("on");
}

// "Atualizar" button flash
function syncFlash(btn){
  const original = btn.innerHTML;
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Atualizando…`;
  setTimeout(()=>{btn.innerHTML = original}, 900);
}

// ============ MODALS ============
function openM(id){ document.getElementById(id).classList.add("open"); }
function closeM(id){ document.getElementById(id).classList.remove("open"); }

// ============ LANG ============
function setLang(l){
  STATE.lang = l;
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("on", b.dataset.lang===l));
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.dataset.i18n;
    if(I18N[l] && I18N[l][k]) el.textContent = I18N[l][k];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const k = el.dataset.i18nPh;
    if(I18N[l] && I18N[l][k]) el.placeholder = I18N[l][k];
  });
}

// ============ TABS ============
function tab(group, name, ev){
  const grp = document.querySelector(`[data-tab-group="${group}"]`);
  if(!grp) return;
  grp.querySelectorAll(".tab").forEach(t=>t.classList.remove("on"));
  if(ev) ev.currentTarget.classList.add("on");
  else {
    const t = grp.querySelector(`[data-tab="${name}"]`);
    if(t) t.classList.add("on");
  }
  document.querySelectorAll(`[data-tab-panel-group="${group}"] .tab-panel`).forEach(p=>p.classList.remove("on"));
  const pnl = document.getElementById(`tp-${group}-${name}`);
  if(pnl) pnl.classList.add("on");
}

// ============ TWEAKS protocol ============
let _tweaks = { density:"comfortable", theme:"light", yellow:"#FFCD00", sidebar:"dark" };
function applyTweaks(){
  document.body.classList.toggle("compact", _tweaks.density==="compact");
  document.body.classList.toggle("theme-dark", _tweaks.theme==="dark");
  document.documentElement.style.setProperty("--nayax-yellow", _tweaks.yellow);
}

window.addEventListener("message", e=>{
  if(!e.data || typeof e.data !== "object") return;
  if(e.data.type === "__activate_edit_mode") document.getElementById("tweaks-panel").style.display="flex";
  if(e.data.type === "__deactivate_edit_mode") document.getElementById("tweaks-panel").style.display="none";
});
function tweaksClose(){
  document.getElementById("tweaks-panel").style.display="none";
  window.parent.postMessage({type:"__edit_mode_dismissed"},"*");
}
function tweakSet(k, v){
  _tweaks[k] = v;
  applyTweaks();
  window.parent.postMessage({type:"__edit_mode_set_keys", edits:{[k]:v}}, "*");
}

// Tell the host that tweaks panel is available — register listener first then announce.
setTimeout(()=>window.parent.postMessage({type:"__edit_mode_available"},"*"), 100);

// ============ INIT ============
window.addEventListener("DOMContentLoaded", ()=>{
  // Render pages
  renderDashboard();
  renderDeals();
  renderQuotes();
  renderBuilder();
  renderApprovals();
  renderProfile();
  renderRoles();
  renderCatalog();
  renderPricing();
  renderClicksignMirror();
  renderAdmin();

  // Apply default tweaks
  applyTweaks();

  // Set lang
  setLang("pt");

  // Hide tweaks panel
  document.getElementById("tweaks-panel").style.display="none";
});

// Used by quick-add command palette
function openCmd(){ document.getElementById("cmd-palette").classList.add("open"); document.getElementById("cmd-input").focus(); }
function closeCmd(){ document.getElementById("cmd-palette").classList.remove("open"); }

// User menu toggle
function toggleUserMenu(ev){
  if(ev) ev.stopPropagation();
  const m = document.getElementById("user-menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}
document.addEventListener("click", e=>{
  const menu = document.getElementById("user-menu");
  if(menu && menu.style.display === "block" && !menu.contains(e.target) && !e.target.classList?.contains("user-menu-trigger")){
    menu.style.display = "none";
  }
});

// Open settings (Configurações) — admin page with all tools
function openSettings(){
  nav("admin");
}

function openProfile(){
  nav("profile");
}
document.addEventListener("keydown", e=>{
  if((e.metaKey || e.ctrlKey) && e.key === "k"){ e.preventDefault(); openCmd(); }
  if(e.key === "Escape"){ closeCmd(); document.querySelectorAll(".modal-overlay.open").forEach(m=>m.classList.remove("open")); }
});

// Used by overlay click-out
document.addEventListener("click", e=>{
  if(e.target.classList && e.target.classList.contains("modal-overlay")) e.target.classList.remove("open");
});
