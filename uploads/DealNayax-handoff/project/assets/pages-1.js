/* ================================================================
   DealNayax v6 — Page renderers
================================================================ */

// helpers
var $ = id => document.getElementById(id);
var el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html != null) e.innerHTML = html;
  return e;
};

// ============================== DASHBOARD ==============================
function renderDashboard(){
  const root = $("pg-dashboard");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="ph-t" data-i18n="d_title">Visão Geral · Orçamentos</div>
          <div class="ph-s"><span style="color:var(--fg-3);font-weight:600">Maio · 2026</span> · 01 mai – 31 mai · dia 22 de 31 (71%) · <span style="color:var(--fg-3);font-weight:600">47 orçamentos no período</span></div>
        </div>
        <div class="ph-r">
          <button class="tb-icon-btn" data-tip="Filtros" style="background:var(--surface);border:1px solid var(--border)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg></button>
          <button class="tb-icon-btn" data-tip="Compartilhar" style="background:var(--surface);border:1px solid var(--border)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
          <button class="tb-icon-btn" data-tip="Exportar" style="background:var(--surface);border:1px solid var(--border)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          <button class="btn btn-primary" style="height:32px;border-radius:8px" onclick="nav('builder')">${ICN("plus",13)} Novo Orçamento</button>
        </div>
      </div>

      <!-- Status counters row -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px">
        ${statusCard("rascunho","Em Aberto","3","2 sem movimento há +5 dias","#71717A","#F4F4F5","edit")}
        ${statusCard("enviados","Enviados ao Cliente","8","Aguardando resposta","#3B82F6","#EFF6FF","send")}
        ${statusCard("aprovacao","Em Aprovação","3","1 urgente — alçada Diretor","#D97706","#FEF3C7","shield","approvals")}
        ${statusCard("assinatura","Em Assinatura","5","Clicksign · 3 visualizados","#8B5CF6","#F5F3FF","edit","clicksign-mirror")}
        ${statusCard("assinados","Assinados no Mês","19","R$ 412k · taxa 40,4%","#16A34A","#DCFCE7","check-circle")}
      </div>

      <!-- Lifecycle flow -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-title-block">
          <div class="row between" style="width:100%">
            <div><div class="t">Ciclo de Vida dos Orçamentos</div><div class="s">cada etapa mostra orçamentos atualmente nela · clique para filtrar</div></div>
            <div class="seg-group" style="border:1px solid var(--border);border-radius:7px;padding:2px;background:var(--surface-2)">
              <button class="seg-pill on" style="height:24px;padding:0 9px;font-size:11px">Qtd.</button>
              <button class="seg-pill" style="height:24px;padding:0 9px;font-size:11px">Valor</button>
            </div>
          </div>
        </div>
        <div class="card-body" style="padding-top:14px">
          ${lifecycleFlow()}
        </div>
      </div>

      <!-- Two columns: Aguardando assinatura + Em aprovação -->
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;margin-bottom:16px">
        ${awaitingSignatureCard()}
        ${pendingApprovalsCard()}
      </div>

      <!-- Aging Report -->
      ${typeof agingReportWidget === 'function' ? agingReportWidget() : ''}

      <!-- Bottom metrics row -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px">
        ${timeToSignatureCard()}
        ${byTypeCard()}
        ${topQuotersCard()}
      </div>

      <!-- Best send time heatmap -->
      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;margin-bottom:16px">
        ${typeof bestSendHeatmap === 'function' ? bestSendHeatmap() : ''}
        ${recentActivityCard()}
      </div>
    </div>
  `;
}

function statusCard(id, label, value, sub, color, bg, icon, navTo){
  const click = navTo ? `onclick="nav('${navTo}')" style="cursor:pointer"` : '';
  return `
    <div class="card" ${click}>
      <div class="card-body" style="padding:18px 20px">
        <div class="row between" style="margin-bottom:10px">
          <div style="width:32px;height:32px;border-radius:8px;background:${bg};color:${color};display:flex;align-items:center;justify-content:center">${ICN(icon,16)}</div>
          ${navTo?`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`:''}
        </div>
        <div style="font-size:13px;color:var(--fg-3);font-weight:500;margin-bottom:4px">${label}</div>
        <div style="font-family:var(--font-sans);font-size:34px;font-weight:700;letter-spacing:-.8px;line-height:1;font-variant-numeric:tabular-nums;color:var(--fg)">${value}</div>
        <div style="font-size:11.5px;color:var(--fg-4);margin-top:7px">${sub}</div>
      </div>
    </div>
  `;
}

function lifecycleFlow(){
  const stages = [
    {name:"Em Aberto",   count:3,  value:"R$ 18.4k",  color:"#71717A", bg:"#F4F4F5", w:30},
    {name:"Enviados",    count:8,  value:"R$ 168.2k", color:"#3B82F6", bg:"#EFF6FF", w:80},
    {name:"Negociação",  count:4,  value:"R$ 89.6k",  color:"#D97706", bg:"#FEF3C7", w:45},
    {name:"Em Aprovação",count:3,  value:"R$ 144.6k", color:"#DC2626", bg:"#FEE2E2", w:35},
    {name:"Em Assinatura",count:5, value:"R$ 178.4k", color:"#8B5CF6", bg:"#F5F3FF", w:55},
    {name:"Assinados",   count:19, value:"R$ 412.0k", color:"#16A34A", bg:"#DCFCE7", w:100}
  ];
  const max = Math.max(...stages.map(s=>s.count));
  return `
    <div style="display:grid;grid-template-columns:repeat(6,1fr) ;gap:0;align-items:end;height:160px;padding-bottom:8px">
      ${stages.map((s,i)=>`
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;position:relative">
          <div style="font-size:11px;color:${s.color};font-weight:700;font-variant-numeric:tabular-nums">${s.value}</div>
          <div style="font-family:var(--font-sans);font-size:24px;font-weight:700;letter-spacing:-.4px;line-height:1;font-variant-numeric:tabular-nums">${s.count}</div>
          <div style="width:80%;height:${s.count/max * 50 + 6}px;background:${s.bg};border-bottom:3px solid ${s.color};border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px"></div>
        </div>
      `).join("")}
    </div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:0;border-top:1px solid var(--border-soft);padding-top:10px">
      ${stages.map((s,i)=>`
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px;position:relative">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.color}"></div>
          <div style="font-size:12px;font-weight:600;color:var(--fg-2)">${s.name}</div>
          ${i<stages.length-1?`<svg style="position:absolute;right:-8px;top:0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fg-5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`:''}
        </div>
      `).join("")}
    </div>
    <div class="row between" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-soft);font-size:11.5px;color:var(--fg-4)">
      <span>Conversão Em Aberto → Assinado: <strong style="color:var(--fg)">40,4%</strong></span>
      <span>Tempo médio total: <strong style="color:var(--fg)">14,2 dias</strong></span>
      <span>Maior gargalo: <strong style="color:var(--danger-fg)">Enviado → Negociação (50% drop)</strong></span>
    </div>
  `;
}

function awaitingSignatureCard(){
  const items = [
    {num:"UPGRADE0664", company:"Rede FastVend", value:34800, days:1, signers:"1 de 2 assinou", status:"viewed", consultor:"GR"},
    {num:"NOVO0489",    company:"Cinemark Family Lazer", value:88400, days:0, signers:"Cliente abriu", status:"opened", consultor:"KA"},
    {num:"BASE0571",    company:"Posto Shell Marginal", value:21400, days:2, signers:"Enviado · aguardando abrir", status:"pending", consultor:"VD"},
    {num:"NOVO0485",    company:"Padaria Esquina", value:5240, days:3, signers:"Enviado · aguardando abrir", status:"pending", consultor:"NE"},
    {num:"FORM0094",    company:"GruaFlex Serviços", value:44000, days:0, signers:"Cliente assinou · aguardando Nayax", status:"client_signed", consultor:"VD"}
  ];
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Aguardando Assinatura</div><div class="s">Clicksign · 5 orçamentos · R$ 193.840 em jogo</div></div>
          <button class="btn btn-ghost btn-sm" onclick="nav('clicksign-mirror')">Ver todos ${ICN("arrow-right",11)}</button>
        </div>
      </div>
      <div class="card-body" style="padding:6px 12px 14px">
        ${items.map(it=>`
          <div style="display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:center;padding:11px 10px;border-radius:8px;transition:.12s var(--ease);cursor:pointer" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background=''" onclick="nav('clicksign-mirror')">
            <div style="width:32px;height:32px;border-radius:8px;background:${signerBg(it.status)};color:${signerColor(it.status)};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${signerIcon(it.status)}
            </div>
            <div style="min-width:0">
              <div class="row g8" style="margin-bottom:2px">
                <span class="bdg bdg-dark bdg-mono">${it.num}</span>
                <span class="bold sm">${it.company}</span>
              </div>
              <div class="sm mut" style="display:flex;align-items:center;gap:6px">
                <span class="av sm av-${avColor(it.consultor)}" style="width:16px;height:16px;font-size:8px">${it.consultor}</span>
                ${it.signers}${it.days>0?` · há ${it.days} dia${it.days>1?'s':''}`:' · hoje'}
              </div>
            </div>
            <div style="text-align:right">
              <div class="bold" style="font-variant-numeric:tabular-nums">${fmt.brl(it.value)}</div>
              <div class="sm mut">${signerLabel(it.status)}</div>
            </div>
            <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation()">${ICN("more",11)}</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
function signerBg(s){return {viewed:"#FEF3C7",opened:"#FEF3C7",pending:"#F4F4F5",client_signed:"#DCFCE7"}[s]}
function signerColor(s){return {viewed:"#92400E",opened:"#92400E",pending:"#71717A",client_signed:"#15803D"}[s]}
function signerIcon(s){return {viewed:ICN("clock",16),opened:ICN("clock",16),pending:ICN("send",16),client_signed:ICN("check",16)}[s]}
function signerLabel(s){return {viewed:"Visualizado",opened:"Aberto",pending:"Aguardando",client_signed:"Cliente OK"}[s]}

function pendingApprovalsCard(){
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Em Aprovação</div><div class="s">aguardando decisão · ordenado por prioridade</div></div>
          <button class="btn btn-ghost btn-sm" onclick="nav('approvals')">Ver fila ${ICN("arrow-right",11)}</button>
        </div>
      </div>
      <div class="card-body" style="padding:6px 12px 14px">
        ${window.__data.APPROVALS.map(a=>`
          <div style="padding:12px 10px;border-radius:8px;cursor:pointer;transition:.12s var(--ease)" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background=''" onclick="nav('approvals')">
            <div class="row between" style="margin-bottom:6px">
              <div class="row g8">
                <span class="bdg bdg-dark bdg-mono">${a.quote}</span>
                ${a.priority==='high'?'<span class="bdg bdg-red">URGENTE</span>':a.priority==='med'?'<span class="bdg bdg-amber">Médio</span>':''}
              </div>
              <span class="bdg ${a.discount>=20?'bdg-red':'bdg-amber'}">−${a.discount}%</span>
            </div>
            <div class="bold sm" style="margin-bottom:2px">${a.company}</div>
            <div class="row between" style="margin-top:4px">
              <span class="sm mut" style="display:flex;align-items:center;gap:5px">${ICN("clock",11)} há ${a.waiting} · ${a.level}</span>
              <span class="bold" style="font-variant-numeric:tabular-nums;font-size:13px">${fmt.brl(a.value)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function timeToSignatureCard(){
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="t">Tempo até Assinatura</div>
        <div class="s">cada etapa do ciclo · média do mês</div>
      </div>
      <div class="card-body" style="padding-top:14px">
        <div class="row between" style="align-items:baseline;margin-bottom:14px">
          <div class="big-stat"><span class="num">14,2</span><span class="unit">dias</span></div>
          <span class="trend up" style="font-size:11.5px;font-weight:600">↓ −1,8d vs abril</span>
        </div>
        ${[
          {label:"Criação → Envio cliente",   v:"2,1d", w:15, color:"#71717A"},
          {label:"Enviado → Resposta",        v:"7,8d", w:55, color:"#3B82F6"},
          {label:"Negociação → Aprovação",    v:"3,4d", w:24, color:"#D97706"},
          {label:"Aprovação → Clicksign",     v:"0,3d", w:2,  color:"#8B5CF6"},
          {label:"Clicksign → Assinado",      v:"0,9d", w:4,  color:"#16A34A"}
        ].map(s=>`
          <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid var(--border-soft)">
            <div>
              <div style="font-size:12px;color:var(--fg-2);margin-bottom:4px">${s.label}</div>
              <div style="height:5px;background:var(--surface-3);border-radius:3px;overflow:hidden"><div style="height:100%;background:${s.color};width:${s.w*1.5}%;border-radius:3px"></div></div>
            </div>
            <div style="font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;min-width:42px;text-align:right">${s.v}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function byTypeCard(){
  const types = [
    {code:"NOVO",     name:"Novo Cliente", count:18, value:212400, color:"#FFCD00", bg:"var(--nayax-yellow-soft)"},
    {code:"UPGRADE",  name:"Upgrade",      count:11, value:184200, color:"#16A34A", bg:"#DCFCE7"},
    {code:"BASE",     name:"Base",         count:8,  value:96800,  color:"#3B82F6", bg:"#EFF6FF"},
    {code:"FORM",     name:"Formulário",   count:5,  value:54200,  color:"#71717A", bg:"#F4F4F5"},
    {code:"MIGR",     name:"Migração",     count:3,  value:42400,  color:"#8B5CF6", bg:"#F5F3FF"},
    {code:"RETCOM",   name:"Retomada",     count:2,  value:32400,  color:"#D97706", bg:"#FEF3C7"}
  ];
  const total = types.reduce((s,t)=>s+t.count,0);
  const maxV = Math.max(...types.map(t=>t.count));
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Orçamentos por Tipo</div><div class="s">${total} no mês · breakdown por categoria</div></div>
          <button class="btn btn-ghost btn-sm" onclick="nav('quotes')">Ver ${ICN("arrow-right",11)}</button>
        </div>
      </div>
      <div class="card-body" style="padding-top:10px">
        ${types.map(t=>`
          <div style="display:grid;grid-template-columns:90px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-soft)">
            <div style="display:flex;align-items:center;gap:7px">
              <span style="padding:2px 7px;border-radius:4px;background:${t.bg};color:${t.color==='#FFCD00'?'#7A5800':t.color};font-size:10px;font-weight:700;letter-spacing:.3px;font-family:var(--font-mono)">${t.code}</span>
            </div>
            <div>
              <div style="height:7px;background:var(--surface-3);border-radius:3px;overflow:hidden"><div style="height:100%;background:${t.color};width:${t.count/maxV*100}%;border-radius:3px"></div></div>
              <div style="font-size:10.5px;color:var(--fg-4);margin-top:3px;font-variant-numeric:tabular-nums">${fmt.brl(t.value)}</div>
            </div>
            <div style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;min-width:24px;text-align:right">${t.count}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function topQuotersCard(){
  const lst = [
    {name:"Vinícius Dias",     av:"VD", color:"av-blue",   sent:12, won:6, conv:50},
    {name:"Guilherme Raksa",   av:"GR", color:"av-purple", sent:9,  won:4, conv:44},
    {name:"Karolay Correia",   av:"KA", color:"av-green",  sent:8,  won:5, conv:63},
    {name:"Luiz Guilherme",    av:"LG", color:"av-orange", sent:7,  won:3, conv:43},
    {name:"Nicole Emiliano",   av:"NE", color:"av-teal",   sent:6,  won:2, conv:33}
  ];
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Top Consultores · Orçamentos</div><div class="s">enviados vs ganhos no mês</div></div>
        </div>
      </div>
      <div class="card-body" style="padding-top:10px">
        ${lst.map((c,i)=>`
          <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border-soft)">
            <div style="font-size:11px;color:var(--fg-4);font-weight:600;width:14px">${i+1}</div>
            <div class="av ${c.color}" style="width:28px;height:28px;font-size:11px">${c.av}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:12.5px;font-weight:600;color:var(--fg);margin-bottom:3px">${c.name}</div>
              <div class="row g6" style="font-size:10.5px;color:var(--fg-4)">
                <span>${c.sent} enviados</span><span>·</span><span style="color:var(--success-fg);font-weight:600">${c.won} ganhos</span>
              </div>
            </div>
            <div style="text-align:right">
              <div class="bdg ${c.conv>=50?'bdg-green':c.conv>=40?'bdg-y':'bdg-grey'}">${c.conv}%</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function recentActivityCard(){
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Atividade Recente</div><div class="s">últimas movimentações em orçamentos</div></div>
          <button class="btn btn-ghost btn-sm">Ver tudo ${ICN("arrow-right",11)}</button>
        </div>
      </div>
      <div class="card-body" style="padding:6px 22px 18px">
        <div class="timeline" style="padding-left:24px">
          ${window.__data.ACTIVITY.slice(0,6).map((a,i)=>`
            <div class="tl-item ${i===0?'now':a.type==='success'?'success':''}">
              <div class="tl-h">
                <span class="bdg ${a.type==='success'?'bdg-green':'bdg-grey'}">${a.action}</span>
                <span class="mono mut sm" style="font-size:11px">${a.target}</span>
                <span class="sm" style="margin-left:auto;color:var(--fg-4)">${a.user} · ${a.time}</span>
              </div>
              <div class="sm" style="color:var(--fg-2);margin-top:3px;line-height:1.5">${a.desc}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function dashMetasDoMes(){
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="t">Metas do Mês</div>
        <div class="s">Maio · 2026</div>
      </div>
      <div class="card-body" style="padding-top:6px">
        <div class="metric-row">
          <div style="flex:1">
            <div class="row between">
              <div class="tag-line"><span class="metric-tag ps">P&amp;S</span><span class="label">Produtos &amp; Serviços</span></div>
              <span class="pct good">73,9 <span style="font-size:14px">%</span></span>
            </div>
            <div class="big-stat" style="margin-top:8px"><span class="currency">R$</span><span class="num">1.847.230</span></div>
            <div class="metric-meta"><span>de R$ 2,50M</span><span></span></div>
            <div class="metric-bar"><div class="ps" style="width:73.9%"></div></div>
          </div>
        </div>
        <div class="metric-row">
          <div style="flex:1">
            <div class="row between">
              <div class="tag-line"><span class="metric-tag mrr">MRR</span><span class="label">Receita Recorrente</span></div>
              <span class="pct warn">68,7 <span style="font-size:14px">%</span></span>
            </div>
            <div class="big-stat" style="margin-top:8px"><span class="currency">R$</span><span class="num">82.450</span></div>
            <div class="metric-meta"><span>de R$ 120K</span><span></span></div>
            <div class="metric-bar"><div class="mrr" style="width:68.7%"></div></div>
          </div>
        </div>
        <div class="metric-row" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div style="border:1px solid var(--border);border-radius:8px;padding:12px 14px">
            <div class="eyebrow" style="margin-bottom:6px">Propostas Ganhas</div>
            <div style="font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1;font-variant-numeric:tabular-nums">47</div>
            <div style="font-size:11px;color:var(--fg-4);margin-top:5px">no período</div>
          </div>
          <div style="border:1px solid var(--border);border-radius:8px;padding:12px 14px">
            <div class="eyebrow" style="margin-bottom:6px">Em aberto · Quente</div>
            <div style="font-size:22px;font-weight:700;letter-spacing:-.4px;line-height:1;font-variant-numeric:tabular-nums">R$ 432.500</div>
            <div style="font-size:11px;color:var(--fg-4);margin-top:5px">12 propostas</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function dashMetaSemanal(){
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div>
            <div class="t">Meta Semanal · sem 4</div>
            <div class="s">19/05 – 23/05</div>
          </div>
          <div class="seg-group" style="border:1px solid var(--border);border-radius:7px;padding:2px;background:var(--surface-2)">
            <button class="seg-pill" style="height:24px;padding:0 9px;font-size:11px">S1</button>
            <button class="seg-pill" style="height:24px;padding:0 9px;font-size:11px">S2</button>
            <button class="seg-pill" style="height:24px;padding:0 9px;font-size:11px">S3</button>
            <button class="seg-pill on" style="height:24px;padding:0 9px;font-size:11px">S4</button>
          </div>
        </div>
      </div>
      <div class="card-body" style="padding-top:8px">
        <div class="row between" style="align-items:baseline;margin-bottom:6px">
          <div class="big-stat"><span class="currency">R$</span><span class="num">461.330</span></div>
          <div style="text-align:right">
            <div class="pct" style="color:#B45309;font-size:30px;font-weight:700;letter-spacing:-.5px">80 <span style="font-size:16px;color:#B45309">%</span></div>
            <div style="font-size:9.5px;color:var(--fg-4);letter-spacing:.5px;text-transform:uppercase;font-weight:700;margin-top:-4px">ATINGIDO</div>
          </div>
        </div>
        <div class="metric-meta" style="margin-bottom:6px"><span>de R$ 580.000</span></div>
        <div class="metric-bar" style="height:8px;margin-bottom:14px"><div class="ps" style="width:80%"></div></div>

        <div class="day-grid">
          <div class="day-cell done"><div class="day-label">Seg 19</div><div class="day-value">R$ 172.500</div></div>
          <div class="day-cell done"><div class="day-label">Ter 20</div><div class="day-value">R$ 128.400</div></div>
          <div class="day-cell"><div class="day-label">Qua 21</div><div class="day-value">R$ 96.100</div></div>
          <div class="day-cell"><div class="day-label">Qui 22</div><div class="day-value">R$ 64.330</div></div>
          <div class="day-cell empty"><div class="day-label">Sex 23</div><div class="day-value">—</div></div>
        </div>

        <div class="inline-alert">
          <div class="icon">!</div>
          <div>
            <div class="t">ACUMULADO NÃO ENTREGUE</div>
            <div class="s">4 dia(s) decorrido(s) · meta ideal R$ 464.000 · realizado R$ 461.330</div>
          </div>
          <div class="v">−R$ 2.670</div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:6px">
          <div><div class="eyebrow" style="margin-bottom:3px">Restante</div><div style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums">R$ 118.670</div></div>
          <div><div class="eyebrow" style="margin-bottom:3px">Dias restantes</div><div style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums">1</div></div>
          <div><div class="eyebrow" style="margin-bottom:3px">Meta/dia restante</div><div style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums">R$ 118.670</div></div>
        </div>
      </div>
    </div>
  `;
}

function dashEvolucao(){
  // Generate a curvy line chart with peaks
  const data = [
    {day:"01/05", v:118400},{day:"03/05", v:71800},{day:"05/05", v:152000},
    {day:"07/05", v:38400},{day:"09/05", v:198400},{day:"11/05", v:89600},
    {day:"13/05", v:172500},{day:"15/05", v:96100},{day:"17/05", v:64330},
    {day:"19/05", v:172500},{day:"21/05", v:128400},{day:"23/05", v:30000}
  ];
  const proj = [{day:"23/05", v:30000},{day:"25/05", v:130000},{day:"27/05", v:160000},{day:"29/05", v:90000}];
  const max = 220000;
  const lblPad = 36;
  const points = data.map((d,i)=>{
    const x = lblPad + (i/(data.length+proj.length-1))*(100-lblPad-2);
    const y = 90 - (d.v/max * 80);
    return `${x},${y}`;
  });
  const projPoints = proj.map((d,i)=>{
    const x = lblPad + ((data.length-1+i)/(data.length+proj.length-1))*(100-lblPad-2);
    const y = 90 - (d.v/max * 80);
    return `${x},${y}`;
  });
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div>
            <div class="t">Evolução do mês</div>
            <div class="s">realizado vs meta acumulada · projeção tracejada</div>
          </div>
          <div class="seg-group" style="border:1px solid var(--border);border-radius:7px;padding:2px;background:var(--surface-2)">
            <button class="seg-pill on" style="height:24px;padding:0 9px;font-size:11px">P&amp;S</button>
            <button class="seg-pill" style="height:24px;padding:0 9px;font-size:11px">MRR</button>
          </div>
        </div>
      </div>
      <div class="card-body" style="padding-top:14px">
        <div style="position:relative;width:100%;height:240px">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible">
            <defs>
              <linearGradient id="ev-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#FFCD00" stop-opacity=".4"/>
                <stop offset="100%" stop-color="#FFCD00" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- horizontal grid lines -->
            ${[10,30,50,70,90].map(y=>`<line x1="${lblPad}" x2="98" y1="${y}" y2="${y}" stroke="#EEEEEF" stroke-width=".3" vector-effect="non-scaling-stroke"/>`).join("")}
            <!-- y axis labels -->
            ${[
              {v:200000,y:10},{v:160000,y:26},{v:120000,y:42},{v:80000,y:58},{v:40000,y:74},{v:20000,y:86}
            ].map(t=>`<text x="${lblPad-3}" y="${t.y+1}" text-anchor="end" font-size="2.6" fill="#A1A1AA" font-family="Inter">R$ ${(t.v/1000).toFixed(0)}k</text>`).join("")}
            <!-- area + line -->
            <polygon points="${points.join(" ")} ${points[points.length-1].split(",")[0]},90 ${points[0].split(",")[0]},90" fill="url(#ev-fill)"/>
            <polyline points="${points.join(" ")}" fill="none" stroke="#F5C400" stroke-width="0.8" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
            <!-- projection (dashed) -->
            <polyline points="${projPoints.join(" ")}" fill="none" stroke="#F5C400" stroke-width="0.6" stroke-dasharray="1.4 1" vector-effect="non-scaling-stroke" stroke-linejoin="round" opacity=".6"/>
            <!-- value labels on peaks -->
            ${data.map((d,i)=>{
              const x = lblPad + (i/(data.length+proj.length-1))*(100-lblPad-2);
              const y = 90 - (d.v/max * 80);
              const isPeak = d.v > 90000;
              if(!isPeak) return '';
              return `<text x="${x}" y="${y-2}" text-anchor="middle" font-size="2.2" font-weight="600" fill="#262626" font-family="Inter">R$ ${d.v.toLocaleString("pt-BR")}</text><circle cx="${x}" cy="${y}" r="0.7" fill="#F5C400" stroke="#fff" stroke-width=".3" vector-effect="non-scaling-stroke"/>`;
            }).join("")}
            <!-- x axis labels -->
            ${["01/05","05/05","09/05","13/05","17/05","21/05","25/05","29/05"].map((d,i)=>{
              const x = lblPad + (i/7)*(100-lblPad-2);
              return `<text x="${x}" y="99" text-anchor="middle" font-size="2.4" fill="#A1A1AA" font-family="Inter">${d}</text>`;
            }).join("")}
          </svg>
        </div>
        <div class="row g16" style="margin-top:12px;font-size:11.5px;color:var(--fg-4);justify-content:center">
          <span class="row g6"><span style="width:8px;height:8px;border-radius:50%;background:#F5C400"></span>Realizado</span>
          <span class="row g6"><span style="width:8px;height:0;border-top:1.5px dashed #F5C400"></span>Projeção</span>
          <span class="row g6"><span style="width:8px;height:8px;background:rgba(255,205,0,.25);border-radius:1px"></span>Meta acumulada</span>
        </div>
      </div>
    </div>
  `;
}

function dashTopPS(){
  return podiumCard("Top P&S", "% meta · maio", [
    {av:"BC", name:"Bruno Carvalho", value:"108%", tag:"UN", pos:2},
    {av:"AR", name:"Alana Ribeiro", value:"115%", tag:"UN", pos:1, leader:true},
    {av:"CS", name:"Camila Souza", value:"105%", tag:"FD", pos:3}
  ]);
}
function dashTopMRR(){
  return podiumCard("Top MRR", "% do MRR · maio", [
    {av:"BC", name:"Bruno Carvalho", value:"13%", tag:"UN", pos:2},
    {av:"AR", name:"Alana Ribeiro", value:"16%", tag:"UN", pos:1, leader:true},
    {av:"CS", name:"Camila Souza", value:"13%", tag:"FD", pos:3}
  ]);
}
function podiumCard(title, sub, cols){
  return `
    <div class="podium-card">
      <div class="card-title-block">
        <div class="t">${title}</div>
        <div class="s">${sub}</div>
      </div>
      <div class="podium">
        ${cols.map(c=>`
          <div class="podium-col ${c.pos===1?'first':c.pos===2?'second':'third'}">
            <div class="podium-avatar">${c.av}</div>
            <div class="podium-name">${c.name}</div>
            <div class="podium-meta">${c.value}</div>
            <div class="podium-bar"><span class="pos">${c.pos}º</span></div>
            <div class="podium-tag" style="${c.tag==='UN'?'color:#1D4ED8;border-color:#BFDBFE;background:#EFF6FF':c.tag==='FD'?'color:#15803D;border-color:#BBF7D0;background:#F0FDF4':'color:#6D28D9;border-color:#DDD6FE;background:#F5F3FF'}">${c.tag}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function dashSegmentos(){
  const segs = [
    {name:"Vending Machine", deals:18, value:685400, pct:37.1, leader:true},
    {name:"Grua", deals:9, value:412800, pct:22.3, color:"#3B82F6"},
    {name:"Food Service", deals:7, value:298100, pct:16.1, color:"#A855F7"},
    {name:"Key Account", deals:5, value:284400, pct:15.4, color:"#10B981"},
    {name:"Lavanderia", deals:4, value:166530, pct:9.0, color:"#F97316"}
  ];
  const colors = ["#FFCD00","#3B82F6","#A855F7","#10B981","#F97316"];
  const max = Math.max(...segs.map(s=>s.value));
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">P&amp;S por segmento</div><div class="s">maio · realizado por linha</div></div>
          <div style="font-family:var(--font-sans);font-weight:700;font-size:13px;font-variant-numeric:tabular-nums">R$ 1.847.230</div>
        </div>
      </div>
      <div class="card-body" style="padding-top:10px">
        ${segs.map((s,i)=>s.leader?`
          <div style="background:var(--nayax-yellow-soft);border:1px solid #F5DC6B;border-radius:9px;padding:11px 14px;margin-bottom:10px">
            <div class="eyebrow" style="color:#7A5800;margin-bottom:4px">Líder do mês</div>
            <div class="row between"><div style="font-size:14px;font-weight:700;color:#262626">${s.name}</div><div style="font-size:16px;font-weight:700;font-variant-numeric:tabular-nums">R$ ${s.value.toLocaleString("pt-BR").slice(0,-4)} <span style="font-size:12px;color:var(--fg-4);font-weight:600">${s.pct}%</span></div></div>
          </div>
        `:`
          <div class="seg-row">
            <div class="name">${s.name}<span class="sub">${s.deals} deals</span></div>
            <div class="seg-bar"><div style="width:${s.value/max*100}%;background:${colors[i]}"></div></div>
            <div class="v">R$ ${s.value.toLocaleString("pt-BR")}</div>
            <div class="p">${s.pct}%</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function dashPropostas(){
  // Mini area chart for daily proposal cadence
  const days = Array.from({length:22}, (_,i)=>4 + Math.floor(Math.sin(i/3)*3) + Math.floor(Math.random()*4));
  const max = Math.max(...days);
  const points = days.map((v,i)=>`${(i/(days.length-1))*100},${100-(v/max*70)-5}`).join(" ");
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Propostas cadastradas</div><div class="s">maio · cadência diária</div></div>
          <div style="text-align:right"><div class="sm mut">projeção</div><div style="font-size:13px;font-weight:700;font-variant-numeric:tabular-nums">221</div></div>
        </div>
      </div>
      <div class="card-body" style="padding-top:6px">
        <div class="row" style="align-items:baseline;gap:10px;margin-bottom:4px">
          <div style="font-size:46px;font-weight:700;letter-spacing:-1.2px;font-variant-numeric:tabular-nums;line-height:1">114</div>
          <div class="sm mut">propostas no mês</div>
        </div>
        <div class="row g6" style="margin-bottom:10px">
          <span class="trend up" style="font-size:11px;font-weight:700">↑ +2,4 %</span>
          <span class="sm mut">sem vs sem ant.</span>
        </div>
        <div style="position:relative;height:80px;margin:6px 0 12px">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible">
            <defs>
              <linearGradient id="pp-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#FFCD00" stop-opacity=".45"/>
                <stop offset="100%" stop-color="#FFCD00" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <polygon points="${points} 100,100 0,100" fill="url(#pp-fill)"/>
            <polyline points="${points}" fill="none" stroke="#262626" stroke-width=".6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
            ${days.map((v,i)=>{
              const x = (i/(days.length-1))*100;
              const y = 100-(v/max*70)-5;
              return `<circle cx="${x}" cy="${y}" r=".7" fill="#262626" stroke="#fff" stroke-width=".3" vector-effect="non-scaling-stroke"/>`;
            }).join("")}
          </svg>
        </div>
        <div class="row between" style="font-size:10.5px;color:var(--fg-5)">
          <span>01/05</span><span>07/05</span><span>13/05</span><span>19/05</span><span>22/05</span>
        </div>
        <div class="divider" style="margin:12px 0 8px"></div>
        <div class="eyebrow" style="margin-bottom:8px">POR SEMANA</div>
        <div class="row g8 wrap">
          <span class="bdg bdg-grey">S1 · 26</span>
          <span class="bdg bdg-grey">S2 · 31</span>
          <span class="bdg bdg-grey">S3 · 28</span>
          <span class="bdg bdg-y-strong">S4 · 29</span>
        </div>
      </div>
    </div>
  `;
}

function dashFunil(){
  const stages = [
    {name:"Leads Gerados", v:412, w:100, conv:null},
    {name:"Qualificados", v:248, w:60, conv:"60% conv."},
    {name:"Reuniões", v:142, w:34, conv:"57% conv."},
    {name:"Propostas", v:67, w:16, conv:"47% conv."},
    {name:"Ganhos", v:47, w:11, conv:"70% close"}
  ];
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Funil SDR</div><div class="s">maio · pipeline de geração</div></div>
          <div style="font-size:11.5px;color:var(--fg-4);font-variant-numeric:tabular-nums">47 / 412</div>
        </div>
      </div>
      <div class="card-body" style="padding-top:10px">
        ${stages.map(s=>`
          <div class="funnel-line">
            <div class="h"><span class="l">${s.name}</span><span class="v">${s.v}</span></div>
            <div class="bar"><div style="width:${s.w}%;background:${s.name==='Ganhos'?'var(--nayax-yellow)':'#D4D4D8'}"></div></div>
            ${s.conv?`<div class="conv">${s.conv}</div>`:`<div class="conv">100%</div>`}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function dashVelocity(){
  return `
    <div class="card">
      <div class="card-title-block">
        <div class="row between" style="width:100%">
          <div><div class="t">Velocidade de Orçamentos</div><div class="s">tempo médio até assinatura · 14,2 dias</div></div>
          <button class="btn btn-ghost btn-sm">Ver detalhes ${ICN("arrow-right",11)}</button>
        </div>
      </div>
      <div class="card-body" style="padding-top:14px">
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:18px">
          ${[
            {label:"Tempo até Envio",v:"2,1d",s:"Rascunho → enviado"},
            {label:"Tempo Negociação",v:"7,8d",s:"Enviado → aceito"},
            {label:"Tempo Aprovação",v:"3,4d",s:"Desconto → aprovado"},
            {label:"Tempo Assinatura",v:"0,9d",s:"Clicksign → assinado"},
            {label:"Conversão Pipeline",v:"40,4%",s:"Total: 47 ganhos"}
          ].map(b=>`
            <div>
              <div class="eyebrow" style="margin-bottom:6px">${b.label}</div>
              <div style="font-family:var(--font-sans);font-size:28px;font-weight:700;letter-spacing:-.5px;font-variant-numeric:tabular-nums">${b.v}</div>
              <div class="sm mut" style="margin-top:4px">${b.s}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function kpiCard(i18n, label, value, sub, trend, up, bar, primary, icon){
  const ic = icon || "trend-up";
  return `
    <div class="kpi">
      <div class="kpi-head">
        <div class="kpi-label" data-i18n="${i18n||''}">${label}</div>
        <div class="kpi-icon ${primary?'accent':''}">${ICN(ic,13)}</div>
      </div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-sub">${sub}</div>
      ${trend!=null?`<div class="trend ${up?'up':'dn'}">${ICN(up?'trend-up':'trend-dn',11)} ${up?'+':''}${trend}% vs mês ant.</div>`:""}
      ${bar!=null?`<div class="kpi-bar"><div style="width:${bar}%"></div></div>`:""}
    </div>
  `;
}

function renderFunnel(){
  const fn = window.__data.FUNNEL;
  const maxV = Math.max(...fn.map(f=>f.value));
  return `<div class="funnel">${
    fn.map((f,i)=>`
      <div class="funnel-row">
        <div class="row g8">
          <span class="stage-dot ${['stage-qualif','stage-prop','stage-nego','stage-sign','stage-won'][i]}"></span>
          <span class="bold sm">${f.stage}</span>
        </div>
        <div class="funnel-bar" style="width:${f.value/maxV*100}%">${fmt.brl(f.value)}</div>
        <div class="val">${f.count} deals</div>
        <div class="pct">${f.pct}%</div>
      </div>
    `).join("")
  }</div>`;
}

function stageConvList(){
  const rows = [
    {from:"Qualif.",to:"Proposta",pct:66,trend:5,up:true},
    {from:"Proposta",to:"Negoc.",pct:75,trend:2,up:true},
    {from:"Negoc.",to:"Assin.",pct:55,trend:-8,up:false},
    {from:"Assin.",to:"Ganho",pct:60,trend:12,up:true}
  ];
  return `<div class="col g10">${rows.map(r=>`
    <div class="row between">
      <div class="row g8" style="flex:1">
        <span class="sm bold" style="min-width:140px">${r.from} → ${r.to}</span>
        <div style="flex:1;height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden">
          <div style="height:100%;background:var(--nayax-yellow);width:${r.pct}%;border-radius:3px"></div>
        </div>
      </div>
      <div class="row g8" style="min-width:90px;justify-content:flex-end">
        <span class="bold mono sm">${r.pct}%</span>
        <span class="trend ${r.up?'up':'dn'}" style="margin:0">${r.up?'↑':'↓'} ${Math.abs(r.trend)}pp</span>
      </div>
    </div>
  `).join("")}</div>`;
}

function topConsultants(){
  const lst = [
    {name:"Vinícius Dias", av:"VD", color:"av-blue", value:88200, pct:146, won:6},
    {name:"Guilherme Raksa", av:"GR", color:"av-purple", value:69600, pct:139, won:4},
    {name:"Karolay Correia", av:"KA", color:"av-green", value:54300, pct:118, won:5},
    {name:"Luiz Guilherme", av:"LG", color:"av-orange", value:48100, pct:130, won:3}
  ];
  return `<div class="col g12">${lst.map(c=>`
    <div class="row g10">
      <div class="av ${c.color}">${c.av}</div>
      <div class="grow">
        <div class="row between"><span class="bold sm">${c.name}</span><span class="bdg bdg-green">${c.pct}%</span></div>
        <div class="row between" style="margin-top:2px">
          <span class="sm mut">${c.won} ganhos · ${fmt.brl(c.value)}</span>
        </div>
        <div style="height:4px;background:var(--surface-3);border-radius:2px;margin-top:6px;overflow:hidden">
          <div style="height:100%;width:${Math.min(c.pct,100)}%;background:linear-gradient(90deg,var(--nayax-yellow),var(--nayax-yellow-deep))"></div>
        </div>
      </div>
    </div>
  `).join("")}</div>`;
}

function attentionRow(title, sub, tone, page){
  const color = tone==="warn" ? "var(--warning-fg)" : "var(--info-fg)";
  const bg = tone==="warn" ? "var(--warning-bg)" : "var(--info-bg)";
  return `<div onclick="nav('${page}')" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:7px;background:${bg};cursor:pointer">
    <div style="width:28px;height:28px;border-radius:6px;background:#fff;color:${color};display:flex;align-items:center;justify-content:center">${ICN("alert",14)}</div>
    <div class="grow"><div class="bold sm" style="color:${color}">${title}</div><div class="sm" style="color:var(--fg-3)">${sub}</div></div>
    ${ICN("chevron-right",14)}
  </div>`;
}

// ============================== DEALS ==============================
function renderDeals(){
  const root = $("pg-deals");
  const stages = ["Qualificação","Proposta","Negociação","Assinatura","Ganho","Perdido"];
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#">Vendas</a>${ICN("chevron-right",12)}<span class="cur">Negócios</span></div>
          <div class="ph-t">Negócios</div>
          <div class="ph-s">HubSpot · 2 pipelines ativos · 47 negócios em aberto</div>
        </div>
        <div class="ph-r">
          <div class="pill-tabs" id="deals-view">
            <button class="pill-tab on" onclick="dealsView('kanban',event)">Pipeline</button>
            <button class="pill-tab" onclick="dealsView('list',event)">Lista</button>
          </div>
          <button class="btn btn-primary" onclick="openM('m-hubspot-migrate')">${ICN("refresh",13)}Migrar do HubSpot</button>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="tbl-toolbar">
          <div class="left">
            <div class="search-box" style="width:240px">
              ${ICN("search",14)}
              <input class="input" placeholder="Buscar empresa ou CNPJ…">
            </div>
            <select class="select sm" style="width:auto"><option>Todos os pipelines</option><option>VM-Vendas (822543360)</option><option>VM-Vendas da Base (836863041)</option></select>
            <select class="select sm" style="width:auto"><option>Todos consultores</option><option>Karolay Correia</option><option>Guilherme Raksa</option></select>
            <button class="btn btn-ghost btn-sm">${ICN("filter",13)} Mais filtros</button>
          </div>
          <div class="row g8">
            <span class="bdg bdg-grey">47 negócios</span>
            <span class="bdg bdg-y">R$ 318k pipeline</span>
          </div>
        </div>
      </div>

      <div id="deals-kanban">
        <div class="pipeline">
          ${stages.map((st,i)=>{
            const items = window.__data.DEALS.filter(d=>d.stage===st);
            const total = items.reduce((s,x)=>s+x.value,0);
            const stCls = ['stage-qualif','stage-prop','stage-nego','stage-sign','stage-won','stage-lost'][i];
            return `
              <div class="pcol">
                <div class="pcol-h">
                  <div class="pname"><span class="stage-dot ${stCls}"></span>${st}</div>
                  <span class="pcnt">${items.length}</span>
                </div>
                <div class="pcol-body">
                  ${items.length===0?'<div style="text-align:center;padding:20px 0;color:var(--fg-5);font-size:11px">Vazio</div>':''}
                  ${items.map(d=>`
                    <div class="dcard ${d.stage==='Ganho'?'won':d.stage==='Perdido'?'lost':''}" onclick="openDealDetail('${d.id}')">
                      <div class="dt-name">${d.company}</div>
                      <div class="dt-meta">${d.consultor}</div>
                      <div class="row between" style="margin-top:6px">
                        <div class="dt-val">${fmt.brl(d.value)}</div>
                        ${d.flag==='approval'?`<span class="bdg bdg-amber">${ICN('alert',10)}aprov.</span>`:''}
                      </div>
                      <div class="dt-foot">
                        <span class="bdg bdg-dark bdg-mono">${d.number}</span>
                        <span class="sm mut" style="font-size:10.5px">${d.days}d</span>
                      </div>
                    </div>
                  `).join("")}
                </div>
                <div style="padding:8px 10px;font-size:11px;color:var(--fg-4);background:var(--surface);border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;margin-top:-1px">
                  Total: <strong class="mono" style="color:var(--fg)">${fmt.brl(total)}</strong>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>

      <div id="deals-list" style="display:none">
        <div class="card no-pad">
          <table class="tbl">
            <thead><tr><th>Empresa</th><th>Tipo</th><th>Número</th><th>Consultor</th><th>Pipeline</th><th>Etapa</th><th>Valor</th><th>Prob</th><th></th></tr></thead>
            <tbody>
              ${window.__data.DEALS.map(d=>`
                <tr onclick="openDealDetail('${d.id}')" style="cursor:pointer">
                  <td><div class="strong">${d.company}</div><div class="sm mut">${d.cnpj}</div></td>
                  <td><span class="bdg bdg-y">${d.type}</span></td>
                  <td><span class="bdg bdg-dark bdg-mono">${d.number}</span></td>
                  <td><div class="user-cell"><div class="av av-${avColor(d.avatar)}">${d.avatar}</div><span class="sm">${d.consultor}</span></div></td>
                  <td class="sm mut">${d.pipeline}</td>
                  <td>${stageBdg(d.stage)}</td>
                  <td class="strong num">${fmt.brl(d.value)}</td>
                  <td><div class="row g6"><div style="width:60px;height:5px;background:var(--surface-3);border-radius:3px"><div style="height:100%;width:${d.prob}%;background:var(--nayax-yellow);border-radius:3px"></div></div><span class="sm bold">${d.prob}%</span></div></td>
                  <td><button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();nav('builder')">Orçamento</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
function dealsView(v,ev){
  document.querySelectorAll("#deals-view .pill-tab").forEach(t=>t.classList.remove("on"));
  if(ev) ev.currentTarget.classList.add("on");
  $("deals-kanban").style.display = v==="kanban" ? "block" : "none";
  $("deals-list").style.display = v==="list" ? "block" : "none";
}
function avColor(av){
  const ix = (av.charCodeAt(0) + av.charCodeAt(1)) % 6;
  return ["y","blue","purple","green","orange","teal"][ix];
}
function stageBdg(s){
  const map = {"Qualificação":"grey","Proposta":"blue","Negociação":"amber","Assinatura":"purple","Ganho":"green","Perdido":"red"};
  return `<span class="bdg bdg-${map[s]||'grey'}">${s}</span>`;
}
function openDealDetail(){ openM("m-deal-detail"); }
