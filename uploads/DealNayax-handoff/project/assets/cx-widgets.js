/* ================================================================
   DealNayax v6 — CX widgets
   Smart suggestions, saved filters, heatmap, version history, aging,
   client engagement score, empty states, skeleton, version compare
================================================================ */

// =====================================================
// SMART SUGGESTIONS — Builder banner
// =====================================================
function smartSuggestions(){
  return `
    <div id="smart-sugg" style="background:linear-gradient(135deg,var(--nayax-yellow-softest) 0%,var(--surface) 100%);border:1px solid #F5DC6B;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px">
      <div style="width:34px;height:34px;border-radius:9px;background:var(--nayax-yellow);color:#262626;display:flex;align-items:center;justify-content:center;flex-shrink:0;animation:pulseFeedback 2.4s ease-in-out infinite">${ICN("zap",17)}</div>
      <div style="flex:1">
        <div style="font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#7A5800;margin-bottom:2px">Sugestão inteligente</div>
        <div style="font-size:13px;color:var(--fg-2);line-height:1.45">
          Cliente <strong>Supermercado Alvorada</strong> vem do concorrente <strong>Cantaloupe</strong>. Aplicar bundle <strong>Migração</strong> com 8% off por padrão? Histórico mostra 73% de conversão nessa estratégia.
        </div>
      </div>
      <div class="row g8" style="flex-shrink:0">
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('smart-sugg').style.display='none'">Ignorar</button>
        <button class="btn btn-primary btn-sm" onclick="Toast.success('Bundle aplicado','Migração + 8% off aplicados ao orçamento',{duration:3500});document.getElementById('smart-sugg').style.display='none'">${ICN("check",12)}Aplicar</button>
      </div>
    </div>
  `;
}

// =====================================================
// SAVED FILTERS — Quotes page
// =====================================================
function savedFilters(){
  const filters = [
    { name:"Meus em aprovação", count:2, color:"amber", icon:"shield", active:true },
    { name:"Sem movimento (5d+)", count:3, color:"red", icon:"clock" },
    { name:"Ganhos este mês", count:8, color:"green", icon:"check-circle" },
    { name:"Aguardando Clicksign", count:5, color:"purple", icon:"send" },
    { name:"Acima de R$ 50k", count:6, color:"y", icon:"trend-up" }
  ];
  return `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <span class="eyebrow" style="margin-right:6px">Filtros salvos</span>
      ${filters.map(f=>`
        <button onclick="this.classList.toggle('active');Toast.info('Filtro aplicado','${f.name} · ${f.count} orçamentos',{duration:2200})" class="${f.active?'active':''}" style="display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px;border-radius:7px;background:${f.active?`var(--${f.color==='y'?'nayax-yellow-softest':'surface-2'})`:'var(--surface)'};border:1px solid ${f.active?(f.color==='y'?'#F5DC6B':'var(--border-strong)'):'var(--border)'};font-size:12px;font-weight:500;color:var(--fg-2);cursor:pointer;transition:.12s var(--ease)">
          ${ICN(f.icon,11)}
          ${f.name}
          <span class="bdg bdg-${f.color}" style="height:16px;padding:0 5px;font-size:10px">${f.count}</span>
        </button>
      `).join("")}
      <button onclick="Toast.info('Novo filtro','Configure filtros avançados',{duration:2500})" style="display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border-radius:7px;background:transparent;border:1px dashed var(--border-strong);font-size:11.5px;color:var(--fg-4);cursor:pointer">
        ${ICN("plus",11)}Novo filtro
      </button>
    </div>
  `;
}

// =====================================================
// BEST SEND TIME HEATMAP
// =====================================================
function bestSendHeatmap(){
  // 5 days × 5 time slots. Values 0-100 (engagement %)
  const days = ["Seg","Ter","Qua","Qui","Sex"];
  const slots = ["08-10","10-12","12-14","14-16","16-18"];
  // Mock realistic heatmap data
  const data = [
    [78, 92, 45, 68, 55],
    [82, 96, 52, 74, 62],
    [76, 88, 48, 71, 58],
    [85, 94, 50, 78, 65],
    [70, 82, 42, 60, 35]
  ];
  const shade = v => `rgba(255,205,0,${v/100*0.95+0.05})`;
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div>
            <div class="t">${ICN("clock",14)} Melhor horário para enviar</div>
            <div class="s">Taxa de abertura por dia × hora · base nos últimos 90 dias</div>
          </div>
          <span class="bdg bdg-y-strong">Pico: Ter 10-12h · 96%</span>
        </div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:50px repeat(${slots.length},1fr);gap:4px;align-items:center">
          <div></div>
          ${slots.map(s=>`<div style="font-size:10.5px;color:var(--fg-4);text-align:center;font-weight:600;letter-spacing:.3px">${s}</div>`).join("")}
          ${days.map((d,di)=>`
            <div style="font-size:11.5px;color:var(--fg-3);font-weight:600">${d}</div>
            ${slots.map((_,si)=>`
              <div title="${d} ${slots[si]} · ${data[di][si]}% abertura" style="height:48px;border-radius:6px;background:${shade(data[di][si])};display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:700;color:${data[di][si]>70?'#262626':'var(--fg-3)'};cursor:pointer;transition:.12s var(--ease);border:${data[di][si]>=92?'2px solid var(--nayax-yellow-deep)':'1px solid transparent'}">${data[di][si]}%</div>
            `).join("")}
          `).join("")}
        </div>
        <div class="alert alert-info" style="margin-top:14px;margin-bottom:0">
          ${ICN("info",14)}
          <div class="sm">💡 <strong>Cliente FastVend</strong> costuma abrir e-mails às <strong>terça-feira 10-12h</strong>. Próxima janela ideal: <strong>amanhã 10h</strong>.</div>
        </div>
      </div>
    </div>
  `;
}

// =====================================================
// VERSION HISTORY WIDGET — Builder sidebar
// =====================================================
function versionHistoryWidget(){
  const versions = [
    { v:"V3", note:"em edição", time:"agora", you:true, current:true },
    { v:"V2", note:"Cliente pediu desconto", time:"há 3h", value:31200, discount:8 },
    { v:"V1", note:"Proposta inicial", time:"ontem 14:32", value:34800, discount:0 }
  ];
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("history",14)} Versões</div>
        <button class="btn btn-link btn-sm" onclick="openVersionCompare()">Comparar</button>
      </div>
      <div class="card-body" style="padding:6px 14px 12px">
        ${versions.map(v=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-soft);cursor:${v.current?'default':'pointer'}" ${!v.current?`onclick="Toast.info('Versão ${v.v}','Restauraria para esta versão',{duration:2500})"`:''}>
            <div style="width:26px;height:26px;border-radius:50%;background:${v.current?'var(--nayax-yellow)':'var(--surface-2)'};color:${v.current?'#262626':'var(--fg-3)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">${v.v}</div>
            <div style="flex:1;min-width:0">
              <div class="sm bold" style="margin-bottom:1px">${v.note}</div>
              <div class="sm mut" style="font-size:11px">${v.time}${v.value?` · ${fmt.brl(v.value)} · ${v.discount}% off`:''}</div>
            </div>
            ${v.current?'<span class="bdg bdg-y-strong" style="font-size:9.5px;height:16px">ATUAL</span>':`<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();Toast.info('Restaurando ${v.v}','Versão será carregada',{duration:2500})">${ICN("refresh",10)}</button>`}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function openVersionCompare(){
  const html = `
    <div class="modal-overlay open" id="m-version-compare" onclick="if(event.target.id==='m-version-compare')closeM('m-version-compare')">
      <div class="modal" style="max-width:780px">
        <div class="modal-h">
          <div>
            <div class="modal-t">Comparar versões</div>
            <div class="modal-sub">UPGRADE0664 · Rede FastVend · V1 → V2 → V3</div>
          </div>
          <button class="modal-x" onclick="closeM('m-version-compare')">${ICN("x",18)}</button>
        </div>
        <div class="modal-b" style="padding:0">
          <table class="tbl" style="font-size:12.5px">
            <thead>
              <tr>
                <th>Campo</th>
                <th>V1 · ontem 14:32</th>
                <th>V2 · há 3h</th>
                <th style="background:var(--nayax-yellow-softest)">V3 · agora <span class="bdg bdg-y-strong">ATUAL</span></th>
              </tr>
            </thead>
            <tbody>
              ${verCmpRow("VPOS Touch","25 un.","25 un.","25 un.")}
              ${verCmpRow("Nayax Cloud Pro","25 un.","25 un.","25 un.")}
              ${verCmpRow("Instalação Premium","1 un.","1 un. (grátis)","1 un. (grátis)")}
              ${verCmpRow("Desconto global","0%","8%","8%")}
              ${verCmpRow("Subtotal","R$ 34.800","R$ 32.016","R$ 32.016")}
              ${verCmpRow("Forma pagamento P&S","À vista","30% + 5×","30% + 5×")}
              ${verCmpRow("MRR mensal","R$ 2.670","R$ 2.225","R$ 2.225")}
              ${verCmpRow("Fidelidade","12 meses","24 meses","24 meses",true)}
              ${verCmpRow("Total 1º mês","R$ 37.470","R$ 34.241","R$ 34.241",true)}
            </tbody>
          </table>
        </div>
        <div class="modal-f">
          <button class="btn btn-ghost" onclick="closeM('m-version-compare')">Fechar</button>
        </div>
      </div>
    </div>
  `;
  const w = document.createElement("div");
  w.innerHTML = html;
  document.body.appendChild(w.firstElementChild);
}
function verCmpRow(label, v1, v2, v3, bold){
  const changed = v2 !== v1 || v3 !== v2;
  return `
    <tr>
      <td class="${bold?'strong':''}">${label}</td>
      <td class="${bold?'strong':''}">${v1}</td>
      <td class="${bold?'strong':''}" style="${v2!==v1?'background:var(--warning-bg);color:var(--warning-fg);font-weight:600':''}">${v2}</td>
      <td class="${bold?'strong':''}" style="background:var(--nayax-yellow-softest);${v3!==v2?'font-weight:700':''}">${v3}</td>
    </tr>
  `;
}

// =====================================================
// AGING REPORT WIDGET — Dashboard
// =====================================================
function agingReportWidget(){
  const items = [
    { num:"NOVO0488", company:"Café & Conveniência SP", days:8, lastAction:"Cliente abriu mas não respondeu", consultor:"EF" },
    { num:"BASE0578", company:"Farmácia Central", days:7, lastAction:"Rascunho criado, sem envio", consultor:"NE" },
    { num:"DEM0712", company:"Padaria Mineira", days:14, lastAction:"Enviado, sem visualização", consultor:"DA" }
  ];
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div>
            <div class="t">${ICN("alert",14)} Aging · Sem movimento</div>
            <div class="s">Orçamentos sem ação há 5+ dias · ${items.length} itens</div>
          </div>
          <span class="bdg bdg-amber">R$ 25.4k em risco</span>
        </div>
      </div>
      <div class="card-body" style="padding:6px 18px 14px">
        ${items.map(it=>`
          <div style="display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:center;padding:11px 4px;border-bottom:1px solid var(--border-soft)">
            <div style="width:34px;height:34px;border-radius:8px;background:${it.days>=10?'var(--danger-bg)':'var(--warning-bg)'};color:${it.days>=10?'var(--danger-fg)':'var(--warning-fg)'};display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
              <div style="font-size:14px;font-weight:700;line-height:1">${it.days}</div>
              <div style="font-size:8px;font-weight:600;letter-spacing:.3px">DIAS</div>
            </div>
            <div style="min-width:0">
              <div class="row g8" style="margin-bottom:2px"><span class="bdg bdg-dark bdg-mono">${it.num}</span><span class="bold sm">${it.company}</span></div>
              <div class="sm mut">${it.lastAction}</div>
            </div>
            <div class="av av-${avColor(it.consultor)} sm" style="width:24px;height:24px;font-size:9px">${it.consultor}</div>
            <button class="btn btn-ghost btn-xs" onclick="Toast.info('Cobrando consultor','Notificação enviada ao consultor responsável',{duration:3000})">${ICN("send",11)}Cobrar</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// =====================================================
// CLIENT ENGAGEMENT SCORE (used in deal detail)
// =====================================================
function clientEngagementScore(score, breakdown){
  const color = score >= 70 ? "#15803D" : score >= 40 ? "#92400E" : "#C92434";
  const bg = score >= 70 ? "#DCFCE7" : score >= 40 ? "#FEF3C7" : "#FFEFF0";
  return `
    <div style="padding:16px;border:1px solid var(--border);border-radius:10px;background:${bg}">
      <div class="row between" style="margin-bottom:12px">
        <div>
          <div class="eyebrow" style="margin-bottom:3px">Score de Engajamento</div>
          <div style="font-size:13px;color:var(--fg-3)">Baseado em interações nos últimos 30 dias</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:34px;font-weight:700;color:${color};line-height:1;letter-spacing:-.5px">${score}</div>
          <div class="sm" style="color:${color};font-weight:600">${score >= 70 ? "Alto" : score >= 40 ? "Médio" : "Baixo"}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
        ${(breakdown || [
          {label:"Visualizações", value:"8", icon:"file-text"},
          {label:"E-mails resp.", value:"5", icon:"send"},
          {label:"Tempo no PDF", value:"14min", icon:"clock"},
          {label:"Reuniões", value:"2", icon:"users"}
        ]).map(b=>`
          <div>
            <div class="eyebrow" style="color:${color};margin-bottom:3px;font-size:9.5px">${b.label}</div>
            <div style="font-size:15px;font-weight:700;color:var(--fg)">${b.value}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
