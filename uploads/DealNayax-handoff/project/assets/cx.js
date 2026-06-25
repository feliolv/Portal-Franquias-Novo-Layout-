/* ================================================================
   DealNayax v6 — CX enhancements
   - Toast system
   - Auto-save ticker
   - Keyboard shortcuts (?)
   - Floating feedback button
   - Skeleton loaders
   - Confetti
   - Onboarding tour
================================================================ */

// =====================================================
// TOAST SYSTEM — replaces alert()
// =====================================================
const Toast = {
  show(opts){
    const wrap = this._wrap();
    const { type="info", title, message, duration=4000, action } = (typeof opts === "string") ? { message:opts } : opts;
    const id = "t-" + Date.now() + Math.floor(Math.random()*1000);
    const tones = {
      success: { bg:"var(--success-bg)", fg:"var(--success-fg)", icon:"check-circle", border:"#86EFAC" },
      info:    { bg:"#FFF", fg:"var(--fg)", icon:"info", border:"var(--border)" },
      warning: { bg:"var(--warning-bg)", fg:"var(--warning-fg)", icon:"alert", border:"#FCD34D" },
      danger:  { bg:"var(--danger-bg)", fg:"var(--danger-fg)", icon:"x", border:"#FCA5A5" },
      yellow:  { bg:"var(--nayax-yellow)", fg:"#262626", icon:"zap", border:"var(--nayax-yellow-deep)" }
    };
    const t = tones[type] || tones.info;
    const el = document.createElement("div");
    el.id = id;
    el.style.cssText = `background:${t.bg};color:${t.fg};border:1px solid ${t.border};border-radius:10px;box-shadow:var(--shadow-lg);padding:12px 14px;display:flex;align-items:flex-start;gap:10px;min-width:280px;max-width:380px;animation:toastIn .25s var(--ease-out);pointer-events:auto`;
    el.innerHTML = `
      <div style="flex-shrink:0;width:22px;height:22px;border-radius:6px;background:rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center">${ICN(t.icon,13)}</div>
      <div style="flex:1;min-width:0">
        ${title ? `<div style="font-size:13px;font-weight:600;margin-bottom:${message?'2px':'0'}">${title}</div>` : ""}
        ${message ? `<div style="font-size:12px;line-height:1.45;color:${type==='info'?'var(--fg-3)':t.fg};opacity:${type==='info'?1:.85}">${message}</div>` : ""}
        ${action ? `<button style="margin-top:8px;background:transparent;border:none;color:${t.fg};font-weight:600;font-size:12px;cursor:pointer;padding:0;text-decoration:underline" onclick="(${action.fn})();Toast.dismiss('${id}')">${action.label}</button>` : ""}
      </div>
      <button onclick="Toast.dismiss('${id}')" style="background:transparent;border:none;color:${t.fg};opacity:.5;cursor:pointer;display:flex;padding:2px">${ICN("x",13)}</button>
    `;
    wrap.appendChild(el);
    if(duration) setTimeout(()=>this.dismiss(id), duration);
    return id;
  },
  dismiss(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.style.animation = "toastOut .2s var(--ease) forwards";
    setTimeout(()=>el.remove(), 200);
  },
  _wrap(){
    let w = document.getElementById("toast-wrap");
    if(!w){
      w = document.createElement("div");
      w.id = "toast-wrap";
      w.style.cssText = "position:fixed;bottom:18px;right:18px;display:flex;flex-direction:column-reverse;gap:10px;z-index:2000;pointer-events:none";
      document.body.appendChild(w);
    }
    return w;
  },
  success(title, message, opts){ return this.show({type:"success", title, message, ...(opts||{})}); },
  info(title, message, opts){ return this.show({type:"info", title, message, ...(opts||{})}); },
  warn(title, message, opts){ return this.show({type:"warning", title, message, ...(opts||{})}); },
  error(title, message, opts){ return this.show({type:"danger", title, message, ...(opts||{})}); },
  yellow(title, message, opts){ return this.show({type:"yellow", title, message, ...(opts||{})}); }
};

// Inject keyframes
(function(){
  const s = document.createElement("style");
  s.textContent = `
    @keyframes toastIn { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }
    @keyframes toastOut { to { opacity:0; transform:translateY(8px) scale(.97) } }
    @keyframes skeletonShimmer { 0% { background-position:-200px 0 } 100% { background-position:calc(200px + 100%) 0 } }
    @keyframes confettiFall { 0% { transform:translateY(-20px) rotate(0deg); opacity:1 } 100% { transform:translateY(calc(100vh + 20px)) rotate(720deg); opacity:0 } }
    @keyframes pulseFeedback { 0%,100% { transform:scale(1) } 50% { transform:scale(1.08) } }
    .skeleton { background:linear-gradient(90deg,var(--surface-3) 0%,var(--surface-2) 50%,var(--surface-3) 100%); background-size:200px 100%; animation:skeletonShimmer 1.4s ease-in-out infinite; border-radius:6px }
    .kbd-key { font-family:var(--font-mono); font-size:11px; background:var(--surface-2); border:1px solid var(--border); border-bottom-width:2px; border-radius:4px; padding:1px 6px; color:var(--fg-2); font-weight:600 }
  `;
  document.head.appendChild(s);
})();

// Override window.alert globally to use toast
const _origAlert = window.alert;
window.alert = function(msg){
  const text = String(msg);
  const lines = text.split("\n");
  const first = lines[0].replace(/^[✓✗⚠️🎉🏆]\s*/, "").trim();
  const rest = lines.slice(1).filter(l=>l.trim()).join(" ");
  const isSuccess = /✓|sucesso|aprovado|enviado|salvo|conclu/i.test(text);
  const isWarn = /⚠|aten|cuidado/i.test(text);
  Toast.show({
    type: isSuccess ? "success" : isWarn ? "warning" : "info",
    title: first,
    message: rest || null,
    duration: 4500
  });
};

// =====================================================
// CONFETTI
// =====================================================
function confetti(opts){
  const { count=80, duration=3500 } = opts || {};
  const colors = ["#FFCD00","#FFDE54","#FFE88A","#6D5BF7","#25EF89","#FF5C6C","#BCB4FB","#9BF8C9"];
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:3000;overflow:hidden";
  for(let i=0; i<count; i++){
    const piece = document.createElement("div");
    const size = 6 + Math.random()*8;
    const isSquare = Math.random() > 0.5;
    piece.style.cssText = `position:absolute;top:-20px;left:${Math.random()*100}%;width:${size}px;height:${size*(0.4+Math.random()*0.8)}px;background:${colors[i%colors.length]};${isSquare?'':'border-radius:50%'};animation:confettiFall ${2+Math.random()*2}s linear ${Math.random()*.6}s forwards`;
    wrap.appendChild(piece);
  }
  document.body.appendChild(wrap);
  setTimeout(()=>wrap.remove(), duration);
}

// =====================================================
// KEYBOARD SHORTCUTS HELPER
// =====================================================
const SHORTCUTS = [
  { keys:["⌘","K"], desc:"Buscar / Comando rápido" },
  { keys:["?"], desc:"Mostrar atalhos" },
  { keys:["g","d"], desc:"Ir para Dashboard" },
  { keys:["g","n"], desc:"Ir para Negócios" },
  { keys:["g","o"], desc:"Ir para Orçamentos" },
  { keys:["g","a"], desc:"Ir para Aprovações" },
  { keys:["g","p"], desc:"Ir para Meu Perfil" },
  { keys:["c"], desc:"Criar novo orçamento" },
  { keys:["Esc"], desc:"Fechar modal / cancelar" },
  { keys:["/"], desc:"Focar busca" },
  { keys:["⌘","S"], desc:"Salvar (no builder)" },
  { keys:["⌘","Enter"], desc:"Enviar (no builder)" }
];

function openShortcuts(){
  if(document.getElementById("m-shortcuts")){
    document.getElementById("m-shortcuts").classList.add("open");
    return;
  }
  const html = `
    <div class="modal-overlay open" id="m-shortcuts" onclick="if(event.target.id==='m-shortcuts')closeM('m-shortcuts')">
      <div class="modal" style="max-width:520px">
        <div class="modal-h">
          <div>
            <div class="modal-t">Atalhos de teclado</div>
            <div class="modal-sub">Acelere seu fluxo · ${SHORTCUTS.length} atalhos disponíveis</div>
          </div>
          <button class="modal-x" onclick="closeM('m-shortcuts')">${ICN("x",18)}</button>
        </div>
        <div class="modal-b" style="padding:6px 0">
          ${SHORTCUTS.map(s=>`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 22px;border-bottom:1px solid var(--border-soft)">
              <span style="font-size:13px;color:var(--fg-2)">${s.desc}</span>
              <div style="display:flex;gap:4px">${s.keys.map(k=>`<span class="kbd-key">${k}</span>`).join('<span style="color:var(--fg-5);font-size:11px;align-self:center;margin:0 2px">+</span>')}</div>
            </div>
          `).join("")}
        </div>
        <div class="modal-f">
          <span class="sm mut">Aperte <span class="kbd-key">?</span> a qualquer momento para abrir</span>
          <button class="btn btn-primary" onclick="closeM('m-shortcuts')">Entendi</button>
        </div>
      </div>
    </div>
  `;
  const w = document.createElement("div");
  w.innerHTML = html;
  document.body.appendChild(w.firstElementChild);
}

// Wire up shortcuts
(function setupShortcuts(){
  let lastKey = null;
  let lastKeyTime = 0;
  document.addEventListener("keydown", e=>{
    // Ignore if in input/textarea
    if(["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName) && e.key !== "Escape") return;
    if(e.target.isContentEditable) return;

    // ? — open shortcuts
    if(e.key === "?" && !e.metaKey && !e.ctrlKey){ e.preventDefault(); openShortcuts(); return; }
    // / — focus search
    if(e.key === "/" && !e.metaKey && !e.ctrlKey){ e.preventDefault(); if(window.openCmd) openCmd(); return; }
    // c — create new quote
    if(e.key === "c" && !e.metaKey && !e.ctrlKey){ nav("builder"); Toast.info("Novo orçamento", "Aperte ? para ver mais atalhos", {duration:2200}); return; }

    // Two-key sequences: g d, g n, g o, g a, g p
    const now = Date.now();
    if(lastKey === "g" && (now - lastKeyTime) < 800){
      const map = { d:"dashboard", n:"deals", o:"quotes", a:"approvals", p:"profile" };
      if(map[e.key]){ nav(map[e.key]); lastKey = null; return; }
    }
    if(e.key === "g"){ lastKey = "g"; lastKeyTime = now; return; }
    lastKey = null;
  });
})();

// =====================================================
// FLOATING FEEDBACK BUTTON
// =====================================================
function mountFeedback(){
  if(document.getElementById("feedback-fab")) return;
  const fab = document.createElement("button");
  fab.id = "feedback-fab";
  fab.title = "Reportar bug ou sugerir melhoria";
  fab.innerHTML = `${ICN("help",18)}`;
  fab.style.cssText = `position:fixed;bottom:22px;left:72px;width:42px;height:42px;border-radius:50%;background:var(--nayax-dark);color:var(--nayax-yellow);border:none;cursor:pointer;box-shadow:var(--shadow-lg);display:flex;align-items:center;justify-content:center;z-index:1500;transition:.18s var(--ease)`;
  fab.onmouseover = ()=>{ fab.style.transform="scale(1.08)"; fab.style.background="var(--nayax-yellow)"; fab.style.color="var(--nayax-dark)"; };
  fab.onmouseout = ()=>{ fab.style.transform="scale(1)"; fab.style.background="var(--nayax-dark)"; fab.style.color="var(--nayax-yellow)"; };
  fab.onclick = openFeedback;
  document.body.appendChild(fab);
}
function openFeedback(){
  const html = `
    <div class="modal-overlay open" id="m-feedback" onclick="if(event.target.id==='m-feedback')closeM('m-feedback')">
      <div class="modal" style="max-width:540px">
        <div class="modal-h">
          <div>
            <div class="modal-t">Conte pra gente</div>
            <div class="modal-sub">Reportar bug, sugerir melhoria, ou mandar elogio · vai direto pro time DealNayax</div>
          </div>
          <button class="modal-x" onclick="closeM('m-feedback')">${ICN("x",18)}</button>
        </div>
        <div class="modal-b">
          <div class="field" style="margin-bottom:14px">
            <label>Tipo</label>
            <div class="chips">
              <span class="chip on" onclick="chipSel(this)">🐛 Bug</span>
              <span class="chip" onclick="chipSel(this)">💡 Sugestão</span>
              <span class="chip" onclick="chipSel(this)">❤️ Elogio</span>
              <span class="chip" onclick="chipSel(this)">🤔 Dúvida</span>
            </div>
          </div>
          <div class="field" style="margin-bottom:14px">
            <label>Sobre qual tela?</label>
            <select class="select" id="fb-screen">
              <option>Tela atual · ${(window.PAGE_LABELS && window.PAGE_LABELS[window.STATE?.page]) || 'Geral'}</option>
              <option>Builder de Orçamento</option>
              <option>Aprovações</option>
              <option>Negócios</option>
              <option>PDF de Proposta</option>
              <option>Clicksign</option>
              <option>Toda a aplicação</option>
            </select>
          </div>
          <div class="field" style="margin-bottom:14px">
            <label>Descrição<span class="req">*</span></label>
            <textarea class="textarea" placeholder="O que aconteceu? O que você esperava que acontecesse?" style="min-height:120px"></textarea>
          </div>
          <div class="field">
            <label>Captura de tela (opcional)</label>
            <div onclick="this.querySelector('input').click()" style="border:2px dashed var(--border-strong);border-radius:8px;padding:18px;text-align:center;background:var(--surface-2);cursor:pointer">
              <div style="font-size:12px;color:var(--fg-3)">${ICN("upload",14)} Clique para anexar imagem</div>
              <input type="file" accept="image/*" style="display:none">
            </div>
          </div>
        </div>
        <div class="modal-f">
          <button class="btn btn-ghost" onclick="closeM('m-feedback')">Cancelar</button>
          <button class="btn btn-primary" onclick="closeM('m-feedback');Toast.success('Obrigado!','Recebemos seu feedback. O time costuma responder em até 1 dia útil.',{duration:5000})">${ICN("send",13)}Enviar</button>
        </div>
      </div>
    </div>
  `;
  const w = document.createElement("div");
  w.innerHTML = html;
  document.body.appendChild(w.firstElementChild);
}

// =====================================================
// ONBOARDING TOUR (first-quote)
// =====================================================
const TOUR_STEPS = [
  { selector:".builder .steps .step:nth-child(1)", title:"Passo 1 · Tipo & Cliente", body:"Comece escolhendo o tipo de proposta (Novo, Base, Upgrade…) e preencha os dados do cliente — PF ou PJ.", pos:"bottom" },
  { selector:".builder #b-products", title:"Passo 2 · Produtos", body:"Adicione SKUs do catálogo manualmente ou aplique um Bundle pré-configurado. Ajuste quantidade e desconto na linha.", pos:"top" },
  { selector:".builder-side > div:first-child", title:"Passo 3 · Resumo automático", body:"Aqui você vê em tempo real o P&S (one-time) e MRR (recorrente). O caminho de aprovação aparece logo abaixo.", pos:"left" },
  { selector:".builder .btn-primary", title:"Passo 4 · Enviar para Clicksign", body:"Quando estiver pronto, envia direto pra assinatura. Sistema valida alçada e cria documento automaticamente.", pos:"bottom" }
];

let _tourIdx = 0;
function startTour(){
  if(localStorage.getItem("dealnayax_tour_done")) return;
  _tourIdx = 0;
  showTourStep();
}
function showTourStep(){
  document.querySelectorAll(".tour-spot,.tour-pop,.tour-overlay").forEach(e=>e.remove());
  const step = TOUR_STEPS[_tourIdx];
  if(!step){ endTour(); return; }
  const target = document.querySelector(step.selector);
  if(!target){ _tourIdx++; showTourStep(); return; }
  const rect = target.getBoundingClientRect();

  const overlay = document.createElement("div");
  overlay.className = "tour-overlay";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(15,15,17,.55);z-index:1990";
  document.body.appendChild(overlay);

  const spot = document.createElement("div");
  spot.className = "tour-spot";
  spot.style.cssText = `position:fixed;top:${rect.top-6}px;left:${rect.left-6}px;width:${rect.width+12}px;height:${rect.height+12}px;border:2px solid var(--nayax-yellow);border-radius:10px;z-index:1995;pointer-events:none;box-shadow:0 0 0 9999px rgba(15,15,17,.55);transition:.3s var(--ease-out)`;
  document.body.appendChild(spot);

  const pop = document.createElement("div");
  pop.className = "tour-pop";
  pop.style.cssText = `position:fixed;background:var(--surface);border-radius:12px;box-shadow:var(--shadow-pop);padding:18px 20px;max-width:340px;z-index:1996;border:1px solid var(--border)`;
  const popTop = step.pos === "top" ? (rect.top - 180) : (rect.bottom + 14);
  pop.style.top = Math.max(20, popTop) + "px";
  pop.style.left = Math.max(20, Math.min(window.innerWidth-360, rect.left)) + "px";
  pop.innerHTML = `
    <div class="row between" style="margin-bottom:8px">
      <div class="bdg bdg-y-strong">${_tourIdx+1} de ${TOUR_STEPS.length}</div>
      <button onclick="endTour()" style="background:transparent;border:none;color:var(--fg-4);cursor:pointer;font-size:11.5px">Pular tour</button>
    </div>
    <div style="font-size:15px;font-weight:600;margin-bottom:6px">${step.title}</div>
    <div style="font-size:12.5px;color:var(--fg-3);line-height:1.55;margin-bottom:14px">${step.body}</div>
    <div class="row between">
      <button class="btn btn-ghost btn-sm" onclick="prevTour()" ${_tourIdx===0?'disabled':''}>← Anterior</button>
      <button class="btn btn-primary btn-sm" onclick="nextTour()">${_tourIdx === TOUR_STEPS.length-1 ? 'Concluir':'Próximo →'}</button>
    </div>
  `;
  document.body.appendChild(pop);
}
function nextTour(){ _tourIdx++; if(_tourIdx >= TOUR_STEPS.length){ endTour(); } else { showTourStep(); } }
function prevTour(){ if(_tourIdx > 0){ _tourIdx--; showTourStep(); } }
function endTour(){
  document.querySelectorAll(".tour-spot,.tour-pop,.tour-overlay").forEach(e=>e.remove());
  localStorage.setItem("dealnayax_tour_done", "1");
  if(_tourIdx >= TOUR_STEPS.length){
    Toast.yellow("Tour concluído!", "Boa venda 💪", {duration:3000});
  }
}

// =====================================================
// AUTO-SAVE TICKER
// =====================================================
let _lastSave = Date.now();
function startAutoSaveTicker(){
  setInterval(()=>{
    const el = document.querySelector(".builder #b-autosave");
    if(!el) return;
    const sec = Math.floor((Date.now() - _lastSave)/1000);
    if(sec < 1) el.textContent = "Salvando…";
    else if(sec < 60) el.textContent = `Salvo há ${sec}s`;
    else el.textContent = `Salvo há ${Math.floor(sec/60)}min`;
  }, 1000);
  setInterval(()=>{ _lastSave = Date.now(); }, 25000);
}

// Initialize on DOM ready
window.addEventListener("DOMContentLoaded", ()=>{
  setTimeout(()=>{
    mountFeedback();
    startAutoSaveTicker();
    // Welcome toast
    setTimeout(()=>{
      Toast.show({
        type:"yellow",
        title:"Bem-vindo, Felipe!",
        message:"Aperte ? para atalhos · / para busca",
        duration:5500
      });
    }, 800);
  }, 200);
});
