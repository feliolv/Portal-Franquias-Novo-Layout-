/* ================================================================
   DealNayax v6 — Renewals / Catalog / Pricing / Clicksign Mirror / Admin
================================================================ */

// ========================== RENEWALS ==========================
function renderRenewals(){
  const root = $("pg-renewals");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('dashboard')">Gestão</a>${ICN("chevron-right",12)}<span class="cur">Renovações</span></div>
          <div class="ph-t">Renovações</div>
          <div class="ph-s">Contratos recorrentes · MRR · vencimentos · churn risk</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("download",13)}Exportar</button>
          <button class="btn btn-primary">${ICN("plus",13)}Nova Renovação</button>
        </div>
      </div>

      <div class="kgrid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
        <div class="kpi"><div class="kpi-head"><div class="kpi-label">MRR Total</div><div class="kpi-icon accent">${ICN("repeat",13)}</div></div><div class="kpi-value">R$ 47.8k</div><div class="kpi-sub">98 contratos ativos</div><div class="trend up">${ICN("trend-up",11)} +R$ 3.2k vs abril</div></div>
        <div class="kpi"><div class="kpi-head"><div class="kpi-label">Vencendo (30d)</div><div class="kpi-icon">${ICN("clock",13)}</div></div><div class="kpi-value">8</div><div class="kpi-sub">R$ 7.2k MRR em risco</div><div class="kpi-bar"><div style="width:32%;background:var(--warning)"></div></div></div>
        <div class="kpi"><div class="kpi-head"><div class="kpi-label">Auto-renovação</div><div class="kpi-icon">${ICN("refresh",13)}</div></div><div class="kpi-value">74%</div><div class="kpi-sub">72 contratos · IPCA+2%</div><div class="trend up">${ICN("trend-up",11)} +2pp vs Q1</div></div>
        <div class="kpi"><div class="kpi-head"><div class="kpi-label">Churn risk</div><div class="kpi-icon">${ICN("alert",13)}</div></div><div class="kpi-value" style="color:var(--danger)">2</div><div class="kpi-sub">R$ 5.2k MRR em risco</div><div class="trend dn">${ICN("trend-up",11)} 2 contratos críticos</div></div>
      </div>

      <div class="grid-2" style="margin-bottom:16px">
        <div class="card">
          <div class="card-h"><div class="ctitle">${ICN("trend-up",14)} MRR Evolution · últimos 6 meses</div></div>
          <div class="card-body">
            ${mrrChart()}
          </div>
        </div>
        <div class="card">
          <div class="card-h"><div class="ctitle">${ICN("alert",14)} Top Risks de Churn</div></div>
          <div class="card-body" style="padding:0">
            ${churnRow("Vending Brasil","R$ 4.280","Vence em 5 dias · sem resposta no contato","high")}
            ${churnRow("Lavanderia Express SP","R$ 890","Reclamação aberta · suporte falhou 2×","high")}
            ${churnRow("Café Premium SP","R$ 620","Volume de transações caindo 3 meses","med")}
            ${churnRow("Posto BR-101","R$ 1.150","Cliente pediu pausa contratual","med")}
          </div>
        </div>
      </div>

      <div class="card no-pad">
        <div class="tbl-toolbar">
          <div class="left">
            <div class="search-box" style="width:240px">${ICN("search",14)}<input class="input" placeholder="Buscar contrato…"></div>
            <select class="select sm" style="width:auto"><option>Status: Todos</option><option>Auto-renovação</option><option>Em renovação</option><option>Atenção</option><option>Crítico</option></select>
            <select class="select sm" style="width:auto"><option>Próximos 90 dias</option><option>Próximos 30 dias</option></select>
          </div>
          <div class="row g8">
            <span class="bdg bdg-grey">${window.__data.RENEWALS.length} contratos</span>
            <button class="btn btn-ghost btn-sm">${ICN("filter",13)}Filtros</button>
          </div>
        </div>
        <table class="tbl">
          <thead><tr><th>Contrato</th><th>Cliente</th><th>MRR</th><th>Vence em</th><th>Status</th><th>Consultor</th><th></th></tr></thead>
          <tbody>
            ${window.__data.RENEWALS.map(r=>`
              <tr>
                <td><span class="bdg bdg-dark bdg-mono">${r.contract}</span></td>
                <td class="strong">${r.company}</td>
                <td class="strong num">${fmt.brl(r.mrr)}/mês</td>
                <td><div class="bold">${r.expires}</div><div class="sm mut">${r.daysLeft} dias</div></td>
                <td>${renewalBdg(r.status, r.risk)}</td>
                <td>${r.consultor}</td>
                <td><div class="row g4"><button class="btn btn-ghost btn-xs">Ver</button><button class="btn btn-soft btn-xs" onclick="nav('builder')">Renovar</button></div></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
function renewalBdg(s, risk){
  if(risk==="high") return `<span class="bdg bdg-red">${s}</span>`;
  if(s==="Em renovação") return `<span class="bdg bdg-amber">${s}</span>`;
  return `<span class="bdg bdg-green">${s}</span>`;
}
function churnRow(name, mrr, reason, risk){
  return `
    <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border-soft)">
      <div style="width:30px;height:30px;border-radius:50%;background:${risk==='high'?'var(--danger-bg)':'var(--warning-bg)'};color:${risk==='high'?'var(--danger-fg)':'var(--warning-fg)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("alert",14)}</div>
      <div class="grow">
        <div class="row between"><span class="bold sm">${name}</span><span class="mono sm bold">${mrr}/mês</span></div>
        <div class="sm mut">${reason}</div>
      </div>
      <button class="btn btn-ghost btn-xs">Ação</button>
    </div>
  `;
}
function mrrChart(){
  const data = [38.4, 40.1, 42.6, 43.8, 44.6, 47.8];
  const max = 50;
  const points = data.map((v,i)=>{
    const x = i/(data.length-1) * 100;
    const y = 100 - (v/max * 100);
    return `${x},${y}`;
  }).join(" ");
  return `
    <div style="position:relative;height:140px;margin-bottom:8px">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%">
        <defs>
          <linearGradient id="mrr-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FFCD00" stop-opacity=".4"/>
            <stop offset="100%" stop-color="#FFCD00" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polyline points="${points}" fill="none" stroke="#FFCD00" stroke-width="1.5"/>
        <polygon points="${points} 100,100 0,100" fill="url(#mrr-fill)"/>
        ${data.map((v,i)=>{
          const x = i/(data.length-1) * 100;
          const y = 100 - (v/max * 100);
          return `<circle cx="${x}" cy="${y}" r="1.4" fill="#FFCD00" stroke="#fff" stroke-width=".5"/>`;
        }).join("")}
      </svg>
    </div>
    <div class="row between" style="font-size:11px;color:var(--fg-4)">
      ${["Dez","Jan","Fev","Mar","Abr","Mai"].map(m=>`<span>${m}</span>`).join("")}
    </div>
    <div class="row between" style="margin-top:10px;border-top:1px solid var(--border);padding-top:10px">
      <div><div class="sm mut">Atual</div><div class="bold lg">R$ 47.8k</div></div>
      <div><div class="sm mut">Δ 6 meses</div><div class="bold lg" style="color:var(--success)">+24%</div></div>
      <div><div class="sm mut">Net Retention</div><div class="bold lg">112%</div></div>
      <div><div class="sm mut">Churn</div><div class="bold lg" style="color:var(--danger)">1,8%/mês</div></div>
    </div>
  `;
}

// ========================== CATALOG ==========================
function renderCatalog(){
  const root = $("pg-catalog");
  root.innerHTML = `<div class="page-inner">${catalogInner()}</div>`;
}

function catalogInner(){
  const cats = ["all","hardware","software","service","fee"];
  const catLabels = {all:"Todos",hardware:"Hardware",software:"Software",service:"Serviços",fee:"Taxas"};
  return `
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('dashboard')">Catálogo</a>${ICN("chevron-right",12)}<span class="cur">Produtos & SKUs</span></div>
          <div class="ph-t">Catálogo de Produtos</div>
          <div class="ph-s">${window.__data.CATALOG.length} SKUs · ${window.__data.BUNDLES.length} bundles · sincronizado com HubSpot</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("upload",13)}Importar CSV</button>
          <button class="btn btn-primary">${ICN("plus",13)}Novo SKU</button>
        </div>
      </div>

      <div class="tabs" data-tab-group="cat">
        ${cats.map((c,i)=>`<button class="tab ${i===0?'on':''}" data-tab="${c}" onclick="tab('cat','${c}',event);catFilter('${c}')">${catLabels[c]}<span class="tab-c">${c==='all'?window.__data.CATALOG.length:window.__data.CATALOG.filter(x=>x.category===c).length}</span></button>`).join("")}
      </div>

      <div class="card no-pad" style="margin-bottom:16px">
        <div class="tbl-toolbar">
          <div class="left">
            <div class="search-box" style="width:280px">${ICN("search",14)}<input class="input" placeholder="Buscar SKU, nome, descrição…"></div>
            <select class="select sm" style="width:auto"><option>Linha: Todas</option><option>VM+Grua</option><option>Food</option><option>Lavanderia</option><option>FEC</option><option>KA</option></select>
          </div>
          <span class="bdg bdg-grey" id="cat-count">${window.__data.CATALOG.length} SKUs</span>
        </div>
        <table class="tbl">
          <thead><tr><th>SKU</th><th>Produto</th><th>Linha</th><th>Categoria</th><th>Preço</th><th>Tipo</th><th></th></tr></thead>
          <tbody id="cat-tbody">
            ${window.__data.CATALOG.map(c=>catalogRow(c)).join("")}
          </tbody>
        </table>
      </div>

      <!-- Bundles section -->
      <div class="ph" style="margin-bottom:14px">
        <div>
          <div class="ph-t" style="font-size:20px">Bundles</div>
          <div class="ph-s">Combinações pré-configuradas com pricing otimizado</div>
        </div>
        <button class="btn btn-ghost btn-sm">${ICN("plus",13)}Novo Bundle</button>
      </div>

      <div class="grid-3">
        ${window.__data.BUNDLES.map(b=>{
          const total = b.items.reduce((s,i)=>{
            const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
            return s + (sku?.price||0) * i.qty;
          },0);
          return `
            <div class="card">
              <div class="card-h"><div class="row between" style="width:100%"><div class="ctitle">${b.name}</div>${b.tag?`<span class="bdg bdg-y-strong">${b.tag}</span>`:""}</div></div>
              <div class="card-body">
                <div class="sm mut" style="margin-bottom:14px">${b.desc}</div>
                <div class="col g4" style="margin-bottom:14px;font-size:12.5px;padding:10px;background:var(--surface-2);border-radius:6px">
                  ${b.items.map(i=>{
                    const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
                    return `<div class="row between"><span>${sku?.name||i.sku}</span><span class="mono bold">×${i.qty}</span></div>`;
                  }).join("")}
                </div>
                <div class="row between">
                  <div>
                    <div class="sm mut">Total</div>
                    <div style="font-family:var(--font-display);font-size:22px;font-weight:700">${fmt.brl(total)}</div>
                  </div>
                  <button class="btn btn-ghost btn-sm">${ICN("edit",12)}Editar</button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
  `;
}
function catalogRow(c){
  const catBdg = {hardware:"bdg-blue", software:"bdg-purple", service:"bdg-grey", fee:"bdg-amber"}[c.category];
  const catLbl = {hardware:"Hardware", software:"Software", service:"Serviço", fee:"Taxa"}[c.category];
  const tipo = c.recurring ? `<span class="bdg bdg-y">${ICN("repeat",10)}${c.recurringType==='monthly'?'Mensal':'Por transação'}</span>` : '<span class="bdg bdg-grey">One-time</span>';
  return `
    <tr data-cat="${c.category}">
      <td><span class="bdg bdg-dark bdg-mono">${c.sku}</span></td>
      <td>
        <div class="row g8">
          <div style="width:30px;height:30px;border-radius:6px;background:var(--surface-3);color:var(--fg-3);display:flex;align-items:center;justify-content:center">${ICN(c.icon,14)}</div>
          <div>
            <div class="strong">${c.name}${c.popular?' <span class="bdg bdg-y" style="margin-left:4px">Popular</span>':''}</div>
            <div class="sm mut">${c.desc}</div>
          </div>
        </div>
      </td>
      <td><span class="bdg bdg-grey">${c.line}</span></td>
      <td><span class="bdg ${catBdg}">${catLbl}</span></td>
      <td class="strong num">${c.displayPrice||fmt.brl2(c.price)}</td>
      <td>${tipo}</td>
      <td><button class="btn btn-ghost btn-xs">${ICN("edit",11)}</button></td>
    </tr>
  `;
}
function catFilter(c){
  document.querySelectorAll("#cat-tbody tr").forEach(tr=>{
    tr.style.display = (c==="all" || tr.dataset.cat===c) ? "" : "none";
  });
  const cnt = c==="all" ? window.__data.CATALOG.length : window.__data.CATALOG.filter(x=>x.category===c).length;
  $("cat-count").textContent = `${cnt} SKUs`;
}

// ========================== PRICING RULES ==========================
function renderPricing(){
  const root = $("pg-pricing");
  root.innerHTML = `<div class="page-inner">${pricingInner()}</div>`;
}
function pricingInner(){
  return `
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('catalog')">Catálogo</a>${ICN("chevron-right",12)}<span class="cur">Regras de Pricing</span></div>
          <div class="ph-t">Regras de Pricing</div>
          <div class="ph-s">Descontos automáticos por volume, bundle e fidelidade · ${window.__data.PRICING_RULES.filter(r=>r.active).length} ativas</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-primary">${ICN("plus",13)}Nova Regra</button>
        </div>
      </div>

      <div class="alert alert-info" style="margin-bottom:14px">
        ${ICN("info",14)}
        <div>Regras são aplicadas <strong>automaticamente durante o Builder</strong>. Quando duas regras conflitam, a de maior desconto vence. <a class="bold" style="color:inherit;text-decoration:underline">Ver documentação</a></div>
      </div>

      <div class="card no-pad">
        <table class="tbl">
          <thead><tr><th>Regra</th><th>Gatilho</th><th>Efeito</th><th>Escopo</th><th>Status</th><th>Aplicada</th><th></th></tr></thead>
          <tbody>
            ${window.__data.PRICING_RULES.map((r,i)=>`
              <tr>
                <td>
                  <div class="row g8">
                    <div style="width:26px;height:26px;border-radius:5px;background:${r.active?'var(--nayax-yellow-soft)':'var(--surface-3)'};color:${r.active?'#7A5800':'var(--fg-4)'};display:flex;align-items:center;justify-content:center">${ICN("zap",13)}</div>
                    <div>
                      <div class="strong">${r.name}</div>
                      <div class="sm mut mono" style="font-size:10.5px">${r.id}</div>
                    </div>
                  </div>
                </td>
                <td class="sm">${r.trigger}</td>
                <td class="sm" style="color:var(--fg-2)">${r.effect}</td>
                <td><span class="bdg bdg-grey">${r.scope}</span></td>
                <td>
                  <label class="row g8" style="cursor:pointer">
                    <div style="width:32px;height:18px;border-radius:9px;background:${r.active?'var(--success)':'var(--border-strong)'};position:relative;transition:.15s var(--ease)">
                      <div style="position:absolute;top:2px;left:${r.active?'16px':'2px'};width:14px;height:14px;border-radius:50%;background:#fff;transition:.15s var(--ease);box-shadow:var(--shadow-xs)"></div>
                    </div>
                    <span class="sm">${r.active?'Ativa':'Inativa'}</span>
                  </label>
                </td>
                <td class="sm mut">${r.active?Math.floor(Math.random()*40+8)+'× este mês':'—'}</td>
                <td><div class="row g4"><button class="btn btn-ghost btn-xs">${ICN("edit",11)}</button><button class="btn btn-ghost btn-xs">${ICN("more",11)}</button></div></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Discount ladder -->
      <div class="card" style="margin-top:16px">
        <div class="card-h">
          <div class="ctitle">${ICN("trend-up",14)} Escalonamento por Volume · VPOS Touch</div>
          <span class="sm mut">Pré-visualização</span>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px">
            ${[
              {qty:"1-9", price:"R$ 1.890", disc:"—", color:"grey"},
              {qty:"10-19", price:"R$ 1.795", disc:"-5%", color:"y"},
              {qty:"20-49", price:"R$ 1.701", disc:"-10%", color:"y"},
              {qty:"50-99", price:"R$ 1.606", disc:"-15%", color:"green"},
              {qty:"100+", price:"R$ 1.512", disc:"-20%", color:"green"}
            ].map(t=>`
              <div style="text-align:center;padding:14px;border:1px solid var(--border);border-radius:7px;background:var(--surface)">
                <div class="eyebrow" style="margin-bottom:6px">${t.qty} un.</div>
                <div style="font-family:var(--font-display);font-size:18px;font-weight:700">${t.price}</div>
                <div class="bdg bdg-${t.color}" style="margin-top:6px">${t.disc}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
  `;
}

// ========================== CLICKSIGN MIRROR ==========================
function renderClicksignMirror(){
  const root = $("pg-clicksign-mirror");
  root.innerHTML = `<div class="page-inner">${clicksignMirrorInner()}</div>`;
}
function clicksignMirrorInner(){
  return `
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('quotes')">Orçamentos</a>${ICN("chevron-right",12)}<a href="#" onclick="nav('builder')">UPGRADE0664</a>${ICN("chevron-right",12)}<span class="cur">Clicksign · Espelho</span></div>
          <div class="ph-t">Tela Espelho · Clicksign</div>
          <div class="ph-s">Visão exata do que o cliente <strong>FastVend</strong> está vendo agora · documento <span class="mono">cs_doc_xK9F2L</span></div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("refresh",13)}Atualizar</button>
          <button class="btn btn-soft btn-sm">${ICN("external",13)}Abrir no Clicksign</button>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:14px">
        <div class="card">
          <div class="card-h"><div class="ctitle">${ICN("clock",14)} Linha do tempo</div></div>
          <div class="card-body">
            <div class="timeline">
              <div class="tl-item success"><div class="tl-h"><span class="sm bold">Documento criado</span></div><div class="tl-time">07/05 14:32 · Sistema</div></div>
              <div class="tl-item success"><div class="tl-h"><span class="sm bold">E-mail enviado ao cliente</span></div><div class="tl-time">07/05 14:33 · contato@fastvend.com.br</div></div>
              <div class="tl-item success"><div class="tl-h"><span class="sm bold">Cliente abriu o documento</span></div><div class="tl-time">07/05 16:48 · IP 200.221.x.x · Chrome</div></div>
              <div class="tl-item now"><div class="tl-h"><span class="sm bold">Aguardando assinatura cliente</span> ${ICN("clock",11)}</div><div class="tl-time">há 18min</div></div>
              <div class="tl-item"><div class="tl-h"><span class="sm">Assinatura Nayax · Felipe Oliveira</span></div><div class="tl-time">pendente</div></div>
              <div class="tl-item"><div class="tl-h"><span class="sm">Documento finalizado</span></div><div class="tl-time">pendente</div></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-h"><div class="ctitle">${ICN("user",14)} Signatários</div><span class="bdg bdg-amber">1 de 2 assinou</span></div>
          <div class="card-body" style="padding:0">
            <div style="padding:14px 18px;border-bottom:1px solid var(--border-soft)">
              <div class="row between" style="margin-bottom:6px">
                <div class="row g8"><div class="av av-green">RM</div><div><div class="bold sm">Ricardo Marinho</div><div class="sm mut">contato@fastvend.com.br · Cliente</div></div></div>
                <span class="bdg bdg-amber">${ICN("clock",10)}Visualizou</span>
              </div>
              <div class="sm mut" style="margin-top:6px">Convite enviado às 14:33 · abriu 2 horas depois · IP 200.221.x.x</div>
            </div>
            <div style="padding:14px 18px">
              <div class="row between" style="margin-bottom:6px">
                <div class="row g8"><div class="av av-y">FO</div><div><div class="bold sm">Felipe Oliveira</div><div class="sm mut">felipeo@nayax.com · Responsável Nayax</div></div></div>
                <span class="bdg bdg-grey">Aguardando ordem</span>
              </div>
              <div class="sm mut" style="margin-top:6px">Assinará automaticamente após o cliente assinar</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mirror frame -->
      <div class="csmirror">
        <div class="csmirror-frame">
          <div class="cs-head">
            <div class="cs-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1B45DA"><circle cx="12" cy="12" r="11"/><path d="M7 12l3 3 7-7" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
              Clicksign
            </div>
            <div class="row g8">
              <span style="font-size:11px;color:#6B7280">Documento</span>
              <code style="background:#F3F4F6;padding:2px 6px;border-radius:3px;font-size:11px;color:#374151">cs_doc_xK9F2L</code>
            </div>
          </div>
          <div class="cs-progress"><div></div></div>
          <div class="cs-body">
            <div style="font-size:18px;font-weight:600;margin-bottom:4px;color:#0F172A">Olá, Ricardo Marinho 👋</div>
            <div style="color:#475569">Você foi convidado para assinar o documento abaixo da <strong>Nayax Brasil</strong>.</div>

            <div class="cs-doc-card">
              <div style="width:46px;height:46px;border-radius:8px;background:#FEF3C7;color:#92400E;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("file-text",24)}</div>
              <div style="flex:1">
                <div style="font-weight:600;color:#111827">Proposta UPGRADE0664 — Rede FastVend.pdf</div>
                <div style="font-size:11.5px;color:#6B7280;margin-top:2px">4 páginas · R$ 34.800 · contrato 24 meses · enviado por Felipe Oliveira</div>
              </div>
              <button style="padding:7px 13px;background:#1B45DA;color:#fff;border-radius:6px;font-size:12px;font-weight:600;border:none;cursor:pointer">Visualizar PDF</button>
            </div>

            <div class="cs-signers">
              <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Ordem de assinatura</div>
              <div class="cs-signer">
                <div style="display:flex;align-items:center"><span class="cs-pin pending">1</span><div><div style="font-weight:600">Ricardo Marinho</div><div style="font-size:11px;color:#6B7280">contato@fastvend.com.br</div></div></div>
                <div style="font-size:11px;color:#92400E;font-weight:600;background:#FEF3C7;padding:3px 8px;border-radius:4px">É a sua vez</div>
              </div>
              <div class="cs-signer">
                <div style="display:flex;align-items:center"><span class="cs-pin pending">2</span><div><div style="font-weight:600">Felipe Oliveira</div><div style="font-size:11px;color:#6B7280">felipeo@nayax.com · Nayax Brasil</div></div></div>
                <div style="font-size:11px;color:#6B7280">Aguardando você</div>
              </div>
            </div>

            <div style="margin-top:24px;padding:14px;background:#F1F5F9;border-radius:8px;border:1px solid #E2E8F0">
              <div style="font-size:12px;font-weight:600;color:#0F172A;margin-bottom:6px">Como assinar?</div>
              <ol style="font-size:12px;color:#475569;line-height:1.7;padding-left:20px">
                <li>Leia o documento clicando em <strong>Visualizar PDF</strong></li>
                <li>Clique no botão verde <strong>Assinar agora</strong></li>
                <li>Confirme via SMS no seu celular ${(+55)} <span style="color:#1B45DA">(11) ●●●●-2847</span></li>
              </ol>
            </div>

            <div style="margin-top:22px;display:flex;gap:10px;justify-content:flex-end">
              <button style="padding:9px 16px;background:#fff;border:1px solid #D1D5DB;color:#374151;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer">Recusar</button>
              <button style="padding:9px 18px;background:#16A34A;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer">Assinar agora →</button>
            </div>

            <div style="margin-top:22px;padding-top:18px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;font-size:10.5px;color:#9CA3AF">
              <div>Documento protegido por Clicksign · valor jurídico ICP-Brasil + Lei 14.063/20</div>
              <div>Hash SHA-256: <code style="font-size:10px;color:#6B7280">7f4a...c19e</code></div>
            </div>
          </div>
        </div>
      </div>
  `;
}

// ========================== ADMIN ==========================
function renderAdmin(){
  const root = $("pg-admin");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('dashboard')">Configurações</a></div>
          <div class="ph-t">Configurações</div>
          <div class="ph-s">DealNayax · super admin · Felipe Oliveira · 11 áreas</div>
        </div>
      </div>

      <div class="tabs" data-tab-group="adm">
        <button class="tab on" data-tab="users" onclick="tab('adm','users',event)">Usuários<span class="tab-c">${window.__data.USERS.length}</span></button>
        <button class="tab" data-tab="roles" onclick="nav('roles')">Perfis de Acesso</button>
        <button class="tab" data-tab="teams" onclick="tab('adm','teams',event)">Equipes</button>
        <button class="tab" data-tab="catalog" onclick="tab('adm','catalog',event)">Catálogo</button>
        <button class="tab" data-tab="pricing" onclick="tab('adm','pricing',event)">Regras de Pricing</button>
        <button class="tab" data-tab="clicksign" onclick="tab('adm','clicksign',event)">Clicksign · Espelho</button>
        <button class="tab" data-tab="company" onclick="tab('adm','company',event)">Empresa</button>
        <button class="tab" data-tab="alcadas" onclick="tab('adm','alcadas',event)">Alçadas</button>
        <button class="tab" data-tab="number" onclick="tab('adm','number',event)">Numeração</button>
        <button class="tab" data-tab="templates" onclick="tab('adm','templates',event)">Templates</button>
        <button class="tab" data-tab="integrations" onclick="tab('adm','integrations',event)">Integrações</button>
        <button class="tab" data-tab="audit" onclick="tab('adm','audit',event)">Auditoria</button>
      </div>

      <div data-tab-panel-group="adm">
        <div class="tab-panel on" id="tp-adm-users">${admUsers()}</div>
        <div class="tab-panel" id="tp-adm-teams">${admTeams()}</div>
        <div class="tab-panel" id="tp-adm-catalog"><div id="pg-catalog-host">${catalogInner()}</div></div>
        <div class="tab-panel" id="tp-adm-pricing"><div id="pg-pricing-host">${pricingInner()}</div></div>
        <div class="tab-panel" id="tp-adm-clicksign"><div id="pg-clicksign-host">${clicksignMirrorInner()}</div></div>
        <div class="tab-panel" id="tp-adm-company">${admCompany()}</div>
        <div class="tab-panel" id="tp-adm-alcadas">${admAlcadas()}</div>
        <div class="tab-panel" id="tp-adm-number">${admNumber()}</div>
        <div class="tab-panel" id="tp-adm-templates">${admTemplates()}</div>
        <div class="tab-panel" id="tp-adm-integrations">${admIntegrations()}</div>
        <div class="tab-panel" id="tp-adm-audit">${admAudit()}</div>
      </div>
    </div>
  `;
}

function admUsers(){
  return `
    <div class="card no-pad">
      <div class="tbl-toolbar">
        <div class="left">
          <div class="search-box" style="width:240px">${ICN("search",14)}<input class="input" placeholder="Buscar usuário…"></div>
          <select class="select sm" style="width:auto"><option>Perfil: Todos</option><option>Super Admin</option><option>Coordenador</option><option>Consultor</option></select>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openM('m-new-user')">${ICN("plus",13)}Novo Usuário</button>
      </div>
      <table class="tbl">
        <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Equipe</th><th>HubSpot Owner</th><th>Pipelines</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${window.__data.USERS.map(u=>`
            <tr>
              <td><div class="user-cell"><div class="av av-${avColor(u.avatar)}">${u.avatar}</div><div class="meta"><div class="name">${u.name}</div></div></div></td>
              <td class="sm mut">${u.email}</td>
              <td>${u.role==="Super Admin"?`<span class="bdg bdg-dark">${u.role}</span>`:u.role==="Coordenador"?`<span class="bdg bdg-y">${u.role}</span>`:`<span class="bdg bdg-blue">${u.role}</span>`}</td>
              <td><span class="bdg bdg-grey">${u.team}</span></td>
              <td class="mono sm mut">${u.ownerId}</td>
              <td class="sm mut">${u.pipelines}</td>
              <td><span class="bdg bdg-green">${ICN("check",10)}Ativo</span></td>
              <td><button class="btn btn-ghost btn-xs" onclick="openEditUser('${u.email}')">${ICN("edit",11)} Editar</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function admTeams(){
  const teams = [
    {name:"VM + Grua", supervisor:"Daiane Soares", consultants:["Karolay Correia","Nicole Emiliano","Leticia Ribeiro"], pipelines:["822543360","836863041"]},
    {name:"MM + Lavanderia", supervisor:"Daiane Soares", consultants:["Aline Prado","Caroline Marinho"], pipelines:["822543360"]},
    {name:"Food", supervisor:"—", consultants:["Guilherme Raksa","Elison Fernandes"], pipelines:["822543360","836863041"]},
    {name:"KA", supervisor:"—", consultants:["Vinícius Dias","Luiz Guilherme"], pipelines:["836863041"]}
  ];
  return `
    <div class="row between" style="margin-bottom:14px"><span class="sm mut">Vincule consultores, supervisores e defina pipelines acessíveis por equipe</span><button class="btn btn-primary btn-sm">${ICN("plus",13)}Nova Equipe</button></div>
    <div class="grid-2">
      ${teams.map(t=>`
        <div class="card">
          <div class="card-h"><div class="ctitle">${t.name}</div><button class="btn btn-ghost btn-xs">${ICN("edit",11)}Editar</button></div>
          <div class="card-body">
            ${t.supervisor!=="—"?`<div class="eyebrow" style="margin-bottom:5px">Supervisor</div>
            <div class="user-cell" style="margin-bottom:14px"><div class="av av-y">${t.supervisor.split(" ").map(p=>p[0]).join("").slice(0,2)}</div><div class="meta"><div class="name">${t.supervisor}</div><div class="role">Supervisor</div></div></div>`:""}
            <div class="eyebrow" style="margin-bottom:5px">Consultores (${t.consultants.length})</div>
            <div class="col g6">
              ${t.consultants.map(c=>{const ini=c.split(" ").map(p=>p[0]).join("").slice(0,2);return `<div class="user-cell"><div class="av av-${avColor(ini)}">${ini}</div><div class="meta"><div class="name">${c}</div></div></div>`}).join("")}
            </div>
            <div class="divider"></div>
            <div class="eyebrow" style="margin-bottom:5px">Pipelines</div>
            <div class="chips">${t.pipelines.map(p=>`<span class="chip on">${p}</span>`).join("")}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function admCompany(){
  return `
    <div class="grid-2">
      <div class="card">
        <div class="card-h"><div class="ctitle">Dados da Empresa Fornecedora</div></div>
        <div class="card-body">
          <div class="col g12">
            <div class="field"><label>Razão Social<span class="req">*</span></label><input class="input" value="Nayax Brasil Soluções de Pagamento Ltda"></div>
            <div class="grid-2">
              <div class="field"><label>CNPJ</label><input class="input" value="12.345.678/0001-90"></div>
              <div class="field"><label>Inscrição Estadual</label><input class="input" value="123.456.789.000"></div>
            </div>
            <div class="grid-2">
              <div class="field"><label>E-mail comercial</label><input class="input" value="comercial@nayax.com"></div>
              <div class="field"><label>Telefone</label><input class="input" value="+55 11 3090-3900"></div>
            </div>
            <div class="field"><label>Endereço</label><input class="input" value="Av. Paulista, 1374 · 11º andar · São Paulo · SP · 01310-100"></div>
            <div class="field"><label>Logo do PDF</label>
              <div class="row g10">
                <div style="width:60px;height:60px;background:#0F0F11;border-radius:7px;display:flex;align-items:center;justify-content:center"><img src="assets/nayax-mark.png" style="height:36px"></div>
                <button class="btn btn-ghost btn-sm">${ICN("upload",13)}Trocar</button>
              </div>
            </div>
            <button class="btn btn-primary" style="align-self:flex-start">Salvar Alterações</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><div class="ctitle">Prévia · Rodapé do PDF</div></div>
        <div class="card-body" style="background:var(--surface-2)">
          <div style="background:#fff;border:1px solid var(--border);border-radius:6px;padding:18px;font-size:12px;color:var(--fg-2)">
            <div class="row g12" style="padding-bottom:12px;border-bottom:1px solid var(--border)">
              <div style="width:46px;height:46px;background:#0F0F11;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><img src="assets/nayax-mark.png" style="height:28px"></div>
              <div>
                <div class="bold" style="font-size:13px;color:var(--fg)">Nayax Brasil Soluções de Pagamento Ltda</div>
                <div class="sm mut">CNPJ 12.345.678/0001-90 · IE 123.456.789.000</div>
              </div>
            </div>
            <div class="grid-3" style="margin-top:12px;font-size:11px;color:var(--fg-3)">
              <div><div class="bold" style="color:var(--fg-2)">Endereço</div>Av. Paulista, 1374 · 11º<br>São Paulo – SP · 01310-100</div>
              <div><div class="bold" style="color:var(--fg-2)">Contato</div>comercial@nayax.com<br>+55 11 3090-3900</div>
              <div><div class="bold" style="color:var(--fg-2)">Site</div>nayax.com/brasil</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function admAlcadas(){
  return `
    <div class="alert alert-warn" style="margin-bottom:14px">${ICN("alert",14)}<div>Alterações afetam apenas <strong>novas solicitações</strong>. Aprovações em andamento mantêm a alçada vigente.</div></div>
    <div class="card">
      <div class="card-h"><div class="ctitle">Alçadas de Desconto</div><button class="btn btn-primary btn-sm">Salvar Configuração</button></div>
      <div class="card-body">
        <div class="col g10">
          ${[
            {level:"Automático", min:0, max:5, approver:"Sistema", locked:true},
            {level:"Coordenador", min:5, max:12, approver:"Daiane Soares"},
            {level:"Diretor", min:12, max:25, approver:"Felipe Oliveira"},
            {level:"Comitê", min:25, max:40, approver:"CEO + CFO"},
            {level:"Bloqueado", min:40, max:100, approver:"—", locked:true}
          ].map(l=>`
            <div style="display:grid;grid-template-columns:1.4fr .8fr .8fr 1.8fr 40px;gap:10px;align-items:end;padding:12px;background:var(--surface-2);border-radius:7px">
              <div class="field"><label>Nível</label><input class="input" value="${l.level}" ${l.locked?'readonly':''}></div>
              <div class="field"><label>Mín %</label><input class="input" value="${l.min}" ${l.locked?'readonly':''}></div>
              <div class="field"><label>Máx %</label><input class="input" value="${l.max}" ${l.locked?'readonly':''}></div>
              <div class="field"><label>Aprovador</label>${l.locked?`<input class="input" value="${l.approver}" readonly>`:`<select class="select"><option>${l.approver}</option></select>`}</div>
              <button class="btn btn-icon btn-soft" ${l.locked?'disabled':''}>${ICN("trash",13)}</button>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function admNumber(){
  const types = [
    {type:"Novo", color:"y", prefix:"NOVO", next:"NOVO0493", last:"NOVO0492 · 07/05", total:492},
    {type:"Base", color:"blue", prefix:"BASE", next:"BASE0582", last:"BASE0581 · 06/05", total:581},
    {type:"Demo", color:"grey", prefix:"DEM", next:"DEM0714", last:"DEM0713 · 05/05", total:713},
    {type:"Migração", color:"purple", prefix:"MIGR", next:"MIGR0013", last:"MIGR0012 · 04/05", total:12},
    {type:"Formulário", color:"grey", prefix:"FORM", next:"FORM0097", last:"FORM0096 · 06/05", total:96},
    {type:"Upgrade", color:"green", prefix:"UPGRADE", next:"UPGRADE0666", last:"UPGRADE0665 · 05/05", total:665},
    {type:"Retomada", color:"amber", prefix:"RETCOM", next:"RETCOM0059", last:"RETCOM0058 · 03/05", total:58}
  ];
  return `
    <div class="alert alert-info" style="margin-bottom:14px">${ICN("info",14)}<div>Numeração atômica via Supabase RPC <code>next_proposal_number(tipo)</code>. Não há duplicatas mesmo com criação simultânea.</div></div>
    <div class="card no-pad">
      <table class="tbl">
        <thead><tr><th>Tipo</th><th>Prefixo</th><th>Próximo</th><th>Último gerado</th><th>Total</th><th></th></tr></thead>
        <tbody>
          ${types.map(t=>`
            <tr>
              <td><span class="bdg bdg-${t.color}">${t.type}</span></td>
              <td><code class="mono sm bold">${t.prefix}</code></td>
              <td class="strong mono">${t.next}</td>
              <td class="sm mut">${t.last}</td>
              <td class="num strong">${t.total}</td>
              <td><button class="btn btn-ghost btn-xs">${ICN("edit",11)}Ajustar</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function admTemplates(){
  return `
    <div class="grid-3" style="grid-template-columns:240px 1fr;gap:16px">
      <div class="card">
        <div class="card-h"><div class="ctitle">Modelos</div><span class="bdg bdg-grey">7</span></div>
        <div class="card-body" style="padding:6px">
          ${[
            {name:"Novo Cliente",code:"NOVO",col:"y",updated:"3 dias",uses:492,active:true},
            {name:"Base",code:"BASE",col:"blue",updated:"12 dias",uses:581,active:true},
            {name:"Demo",code:"DEM",col:"grey",updated:"1 mês",uses:713,active:true},
            {name:"Migração",code:"MIGR",col:"purple",updated:"7 dias",uses:12,active:true},
            {name:"Formulário",code:"FORM",col:"grey",updated:"2 dias",uses:96,active:true},
            {name:"Upgrade",code:"UPGRADE",col:"green",updated:"hoje",uses:665,active:true},
            {name:"Retomada",code:"RETCOM",col:"amber",updated:"21 dias",uses:58,active:false}
          ].map((s,i)=>{
            return `<div class="${i===0?'on':''}" id="tpl-mdl-${s.code}" onclick="selectTemplate('${s.code}','${s.name}')" style="display:flex;align-items:center;gap:10px;padding:9px 10px;margin:1px 0;border-radius:7px;cursor:pointer;transition:.12s var(--ease);${i===0?'background:var(--surface-2)':''}" onmouseover="if(!this.classList.contains('on'))this.style.background='var(--surface-2)'" onmouseout="if(!this.classList.contains('on'))this.style.background=''">
              <div style="width:30px;height:30px;border-radius:6px;background:${s.col==='y'?'var(--nayax-yellow-soft)':s.col==='blue'?'#EFF6FF':s.col==='green'?'#DCFCE7':s.col==='purple'?'#F5F3FF':s.col==='amber'?'#FEF3C7':'#F4F4F5'};color:${s.col==='y'?'#7A5800':s.col==='blue'?'#1D4ED8':s.col==='green'?'#15803D':s.col==='purple'?'#6D28D9':s.col==='amber'?'#B45309':'#52525B'};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("file-text",14)}</div>
              <div style="flex:1;min-width:0">
                <div class="row between" style="margin-bottom:2px">
                  <div class="sm bold" style="color:var(--fg)">${s.name}</div>
                  <span class="bdg bdg-${s.col}" style="font-size:9.5px;height:16px;padding:0 5px">${s.code}</span>
                </div>
                <div style="font-size:10.5px;color:var(--fg-4);display:flex;align-items:center;gap:4px">
                  <span class="dot" style="background:${s.active?'var(--success)':'var(--fg-5)'};width:5px;height:5px"></span>
                  <span>${s.active?'Ativo':'Inativo'} · ${s.uses} usos</span>
                </div>
                <div style="font-size:10px;color:var(--fg-5);margin-top:1px">Editado há ${s.updated}</div>
              </div>
            </div>`;
          }).join("")}
          <div class="divider" style="margin:8px 4px"></div>
          <button class="btn btn-ghost btn-sm" style="width:100%;justify-content:flex-start">${ICN("plus",12)}Novo modelo</button>
        </div>
      </div>
      <div class="card">
        <div class="card-h">
          <div class="ctitle">Editando · <span id="tpl-name">Novo Cliente (NOVO)</span></div>
          <div class="row g8"><button class="btn btn-ghost btn-sm" onclick="restoreTemplate()">${ICN("refresh",13)}Restaurar padrão</button><button class="btn btn-primary btn-sm" onclick="saveTemplate()">${ICN("check",13)}Salvar</button></div>
        </div>
        <div class="card-body">
          <div class="pill-tabs" id="tpl-tabs" style="margin-bottom:14px">
            <button class="pill-tab on" data-section="capa" onclick="selectTemplateSection('capa')">Capa</button>
            <button class="pill-tab" data-section="termos" onclick="selectTemplateSection('termos')">Termos</button>
            <button class="pill-tab" data-section="servicos" onclick="selectTemplateSection('servicos')">Serviços</button>
            <button class="pill-tab" data-section="capafinal" onclick="selectTemplateSection('capafinal')">Capa Final</button>
            <button class="pill-tab" data-section="pdf" onclick="selectTemplateSection('pdf')" style="background:var(--nayax-yellow-soft);color:#7A5800;font-weight:700">PDF Completo</button>
          </div>

          <div id="tpl-section-content">${templateSectionHTML("capa")}</div>
        </div>
      </div>
    </div>

    <!-- QR Code do Contrato -->
    <div class="card" style="margin-top:16px">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("package",14)} QR Code do Contrato</div>
          <div class="csub">Imagem exibida na página de Termos de compra do PDF · aponta para o link do contrato</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="saveQR()">${ICN("check",13)}Salvar</button>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:200px 1fr;gap:24px">
          <!-- Preview -->
          <div>
            <div class="eyebrow" style="margin-bottom:8px">Prévia</div>
            <div style="width:160px;height:160px;background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:8px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-xs)">
              <svg viewBox="0 0 21 21" width="100%" height="100%" style="image-rendering:pixelated">
                <rect x="0" y="0" width="7" height="7" fill="#262626"/><rect x="1" y="1" width="5" height="5" fill="#fff"/><rect x="2" y="2" width="3" height="3" fill="#262626"/>
                <rect x="14" y="0" width="7" height="7" fill="#262626"/><rect x="15" y="1" width="5" height="5" fill="#fff"/><rect x="16" y="2" width="3" height="3" fill="#262626"/>
                <rect x="0" y="14" width="7" height="7" fill="#262626"/><rect x="1" y="15" width="5" height="5" fill="#fff"/><rect x="2" y="16" width="3" height="3" fill="#262626"/>
                <rect x="8" y="0" width="1" height="1" fill="#262626"/><rect x="10" y="0" width="1" height="1" fill="#262626"/><rect x="12" y="0" width="1" height="1" fill="#262626"/>
                <rect x="8" y="2" width="1" height="1" fill="#262626"/><rect x="11" y="2" width="1" height="1" fill="#262626"/>
                <rect x="9" y="4" width="1" height="1" fill="#262626"/><rect x="11" y="4" width="1" height="1" fill="#262626"/><rect x="13" y="4" width="1" height="1" fill="#262626"/>
                <rect x="0" y="8" width="1" height="1" fill="#262626"/><rect x="2" y="8" width="1" height="1" fill="#262626"/><rect x="4" y="8" width="1" height="1" fill="#262626"/><rect x="6" y="8" width="1" height="1" fill="#262626"/>
                <rect x="8" y="8" width="1" height="1" fill="#262626"/><rect x="10" y="8" width="1" height="1" fill="#262626"/><rect x="12" y="8" width="1" height="1" fill="#262626"/><rect x="15" y="8" width="1" height="1" fill="#262626"/><rect x="17" y="8" width="1" height="1" fill="#262626"/>
                <rect x="1" y="10" width="1" height="1" fill="#262626"/><rect x="3" y="10" width="1" height="1" fill="#262626"/><rect x="5" y="10" width="1" height="1" fill="#262626"/>
                <rect x="9" y="10" width="1" height="1" fill="#262626"/><rect x="11" y="10" width="1" height="1" fill="#262626"/><rect x="14" y="10" width="1" height="1" fill="#262626"/><rect x="16" y="10" width="1" height="1" fill="#262626"/><rect x="18" y="10" width="1" height="1" fill="#262626"/>
                <rect x="0" y="12" width="1" height="1" fill="#262626"/><rect x="2" y="12" width="1" height="1" fill="#262626"/><rect x="4" y="12" width="1" height="1" fill="#262626"/><rect x="6" y="12" width="1" height="1" fill="#262626"/>
                <rect x="8" y="12" width="1" height="1" fill="#262626"/><rect x="10" y="12" width="1" height="1" fill="#262626"/><rect x="13" y="12" width="1" height="1" fill="#262626"/><rect x="15" y="12" width="1" height="1" fill="#262626"/><rect x="17" y="12" width="1" height="1" fill="#262626"/><rect x="19" y="12" width="1" height="1" fill="#262626"/>
                <rect x="8" y="14" width="1" height="1" fill="#262626"/><rect x="10" y="14" width="1" height="1" fill="#262626"/><rect x="12" y="14" width="1" height="1" fill="#262626"/><rect x="14" y="14" width="1" height="1" fill="#262626"/><rect x="16" y="14" width="1" height="1" fill="#262626"/><rect x="18" y="14" width="1" height="1" fill="#262626"/><rect x="20" y="14" width="1" height="1" fill="#262626"/>
                <rect x="9" y="16" width="1" height="1" fill="#262626"/><rect x="11" y="16" width="1" height="1" fill="#262626"/><rect x="13" y="16" width="1" height="1" fill="#262626"/><rect x="15" y="16" width="1" height="1" fill="#262626"/><rect x="17" y="16" width="1" height="1" fill="#262626"/><rect x="19" y="16" width="1" height="1" fill="#262626"/>
                <rect x="8" y="18" width="1" height="1" fill="#262626"/><rect x="10" y="18" width="1" height="1" fill="#262626"/><rect x="13" y="18" width="1" height="1" fill="#262626"/><rect x="15" y="18" width="1" height="1" fill="#262626"/><rect x="17" y="18" width="1" height="1" fill="#262626"/><rect x="20" y="18" width="1" height="1" fill="#262626"/>
                <rect x="9" y="20" width="1" height="1" fill="#262626"/><rect x="11" y="20" width="1" height="1" fill="#262626"/><rect x="14" y="20" width="1" height="1" fill="#262626"/><rect x="16" y="20" width="1" height="1" fill="#262626"/><rect x="18" y="20" width="1" height="1" fill="#262626"/><rect x="20" y="20" width="1" height="1" fill="#262626"/>
              </svg>
            </div>
            <div class="sm mut" style="margin-top:8px;text-align:center">qrcode-contrato.png · 124 KB</div>
          </div>

          <!-- Upload area + URL config -->
          <div>
            <div class="field" style="margin-bottom:14px">
              <label>URL destino do QR Code</label>
              <input class="input mono" value="https://www.vmtecnologia.io/contrato-licenciamento" style="font-size:12px">
              <div class="hint">Link para o qual o QR Code aponta · padrão: contrato de licenciamento</div>
            </div>

            <div class="field" style="margin-bottom:14px">
              <label>Imagem do QR Code</label>
              <div onclick="this.querySelector('input').click()" style="border:2px dashed var(--border-strong);border-radius:8px;padding:24px;text-align:center;background:var(--surface-2);cursor:pointer;transition:.15s var(--ease)" onmouseover="this.style.borderColor='var(--nayax-yellow)';this.style.background='var(--nayax-yellow-soft)'" onmouseout="this.style.borderColor='var(--border-strong)';this.style.background='var(--surface-2)'">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--surface);color:var(--fg-3);display:flex;align-items:center;justify-content:center;margin:0 auto 10px">${ICN("upload",18)}</div>
                <div class="bold sm">Clique ou arraste a imagem aqui</div>
                <div class="sm mut" style="margin-top:3px">PNG, JPG ou SVG · Mín. 300×300 px · Máx. 2 MB</div>
                <input type="file" accept="image/*" style="display:none" onchange="handleQRUpload(this)">
              </div>
              <div class="hint">Será usada na página de <strong>Termos de compra</strong> do PDF · todos os modelos compartilham este QR</div>
            </div>

            <div class="row g8">
              <button class="btn btn-ghost btn-sm" onclick="alert('QR gerado a partir da URL!')">${ICN("refresh",13)}Gerar QR automático</button>
              <button class="btn btn-ghost btn-sm" onclick="alert('Baixando qrcode-contrato.png...')">${ICN("download",13)}Baixar atual</button>
              <button class="btn btn-soft btn-sm" onclick="alert('QR removido. Sem QR, a página de termos não exibirá o código.')">${ICN("x",13)}Remover</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Template sections content
const _templateContent = {
  capa: {
    label: "CAPA — 1ª página do PDF",
    canUpload: true,
    text: `Proposta Comercial — Solução de Pagamentos Nayax

Esta proposta apresenta as soluções Nayax desenvolvidas especialmente para {{nome_empresa}}, contemplando terminais de pagamento, plataforma de gestão e suporte técnico dedicado.

Válida por {{vigencia}} dias a partir da data de emissão.`
  },
  termos: {
    label: "TERMOS E CONDIÇÕES",
    canUpload: true,
    text: `1. Preços válidos pelo período de vigência desta proposta.
2. Equipamentos com garantia de 12 meses.
3. Instalação em até 15 dias úteis após confirmação.
4. Mensalidades iniciam 30 dias após ativação do primeiro terminal.
5. Rescisão contratual requer aviso prévio de 30 dias.

{{termos_adicionais}}`
  },
  servicos: {
    label: "SOBRE OS SERVIÇOS",
    canUpload: false,
    text: `A Nayax oferece plataforma completa de pagamentos para operação autônoma:

- Terminais de pagamento: débito, crédito, contactless e PIX.
- Nayax Cloud: dashboard em tempo real com relatórios e alertas.
- Suporte técnico: atendimento 24/7 por telefone, e-mail e chat.
- Atualizações de firmware e software incluídas no contrato.

{{descricao_servicos_adicionais}}`
  },
  capafinal: {
    label: "CAPA FINAL — última página",
    canUpload: true,
    text: `Agradecemos a oportunidade de apresentar nossas soluções para {{nome_empresa}}.

Para dúvidas ou para avançar com esta proposta, entre em contato:

{{consultor_nome}}
{{consultor_telefone}} · {{consultor_email}}

Nayax Brasil · comercial@nayax.com · nayax.com/brasil`
  }
};

function templateSectionHTML(section){
  if(section === "pdf"){
    return `
      <div style="background:var(--nayax-yellow-soft);border:1.5px solid #F5DC6B;border-radius:10px;padding:18px;margin-bottom:14px">
        <div class="row g10" style="align-items:start">
          <div style="width:30px;height:30px;border-radius:7px;background:var(--nayax-yellow);color:#262626;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("file-text",16)}</div>
          <div>
            <div class="bold" style="font-size:13px;color:#262626;margin-bottom:3px">PDF Completo do Modelo</div>
            <div class="sm" style="color:#27272A;line-height:1.55">Suba um PDF completo da proposta para este tipo. Será usado diretamente sem montar seções individuais. <strong>Tem prioridade sobre os textos e PDFs das abas acima.</strong></div>
          </div>
        </div>
      </div>
      <div onclick="this.querySelector('input').click()" style="border:2px dashed var(--border-strong);border-radius:10px;padding:36px 20px;text-align:center;background:var(--surface);cursor:pointer;transition:.15s var(--ease)" onmouseover="this.style.borderColor='var(--nayax-yellow)';this.style.background='var(--nayax-yellow-soft)'" onmouseout="this.style.borderColor='var(--border-strong)';this.style.background='var(--surface)'">
        <div style="width:48px;height:48px;border-radius:10px;background:var(--surface-3);color:var(--fg-3);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">${ICN("file-text",22)}</div>
        <div class="bold" style="font-size:14px;margin-bottom:4px">Clique para subir o PDF completo</div>
        <div class="sm mut">Apenas arquivos .pdf · Máx. 20 MB</div>
        <input type="file" accept=".pdf" style="display:none" onchange="handleTemplateUpload('pdf-full',this)">
      </div>
    `;
  }
  const sec = _templateContent[section];
  if(!sec) return "";
  const ph = `Sem PDF subido — usando texto abaixo`;
  return `
    <div class="row between" style="margin-bottom:10px">
      <div class="eyebrow">${sec.label}</div>
      ${sec.canUpload ? `
        <label style="cursor:pointer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="this.parentNode.querySelector('input').click()">${ICN("upload",13)}Subir PDF</button>
          <input type="file" accept=".pdf" style="display:none" onchange="handleTemplateUpload('${section}',this)">
        </label>
      ` : ''}
    </div>
    <div id="tpl-upload-${section}" class="alert alert-success" style="margin-bottom:10px;display:none">
      ${ICN("check-circle",13)}
      <div><strong id="tpl-upload-${section}-name"></strong> · <span id="tpl-upload-${section}-size"></span> · PDF substituirá o texto abaixo</div>
      <button class="btn btn-ghost btn-xs" style="margin-left:auto" onclick="clearTemplateUpload('${section}')">${ICN("x",11)}</button>
    </div>
    <div class="field">
      <textarea class="textarea" style="min-height:200px" placeholder="${ph}">${sec.text}</textarea>
    </div>
    <div class="sm mut" style="margin-top:10px">Variáveis: <code class="mono">{{nome_empresa}}</code> <code class="mono">{{consultor_nome}}</code> <code class="mono">{{consultor_telefone}}</code> <code class="mono">{{consultor_email}}</code> <code class="mono">{{vigencia}}</code> <code class="mono">{{numero_proposta}}</code> <code class="mono">{{termos_adicionais}}</code></div>
  `;
}

function selectTemplate(code, name){
  document.querySelectorAll("#tp-adm-templates [id^='tpl-mdl-']").forEach(n=>{
    n.classList.remove("on");
    n.style.background = "";
  });
  const sel = document.getElementById("tpl-mdl-"+code);
  if(sel){
    sel.classList.add("on");
    sel.style.background = "var(--surface-2)";
  }
  const lbl = document.getElementById("tpl-name");
  if(lbl) lbl.textContent = `${name} (${code})`;
}

function selectTemplateSection(section){
  document.querySelectorAll("#tpl-tabs .pill-tab").forEach(t=>{
    t.classList.remove("on");
    if(t.dataset.section !== "pdf"){
      t.style.background = "";
      t.style.color = "";
      t.style.fontWeight = "";
    }
  });
  const target = document.querySelector(`#tpl-tabs [data-section="${section}"]`);
  if(target){
    target.classList.add("on");
    if(section === "pdf"){
      // keep yellow styling but still mark as active
    }
  }
  document.getElementById("tpl-section-content").innerHTML = templateSectionHTML(section);
}

function handleTemplateUpload(section, input){
  const file = input.files[0];
  if(!file) return;
  if(section === "pdf-full"){
    alert(`PDF completo "${file.name}" carregado · ${(file.size/1024/1024).toFixed(2)} MB. Este PDF substituirá completamente as seções individuais ao gerar a proposta.`);
    return;
  }
  const wrap = document.getElementById("tpl-upload-"+section);
  if(!wrap) return;
  document.getElementById("tpl-upload-"+section+"-name").textContent = file.name;
  document.getElementById("tpl-upload-"+section+"-size").textContent = (file.size/1024/1024).toFixed(2) + " MB";
  wrap.style.display = "flex";
}
function clearTemplateUpload(section){
  const wrap = document.getElementById("tpl-upload-"+section);
  if(wrap) wrap.style.display = "none";
}
function restoreTemplate(){
  if(confirm("Restaurar o template para o padrão? Suas alterações serão perdidas.")){
    selectTemplateSection(document.querySelector("#tpl-tabs .pill-tab.on")?.dataset.section || "capa");
  }
}
function saveTemplate(){
  alert("✓ Template salvo. As próximas propostas geradas usarão estas configurações.");
}
function saveQR(){
  alert("✓ QR Code do contrato salvo. A próxima proposta gerada usará este QR na página de Termos de compra.");
}
function handleQRUpload(input){
  const file = input.files[0];
  if(!file) return;
  alert(`QR Code "${file.name}" carregado · ${(file.size/1024).toFixed(0)} KB. Clique em Salvar para aplicar.`);
}

function admIntegrations(){
  return `
    <div style="max-width:780px">
      <div class="eyebrow" style="margin-bottom:10px">CRM</div>
      <div class="col g8">
        ${integCard("HS","HubSpot CRM","Pipelines 822543360 · 836863041 · campo P&S: valor_total_de_ps","#FF7A59","#fff",true,["Conectado","OAuth 2.0","Webhook ativo"])}
        ${integCard("SF","Salesforce CRM","Opportunity · Account · Quote · Product2 · OpportunityLineItem","#00A1E0","#fff",false,["Não conectado","OAuth ready"])}
      </div>

      <div class="eyebrow" style="margin:20px 0 10px">ASSINATURA ELETRÔNICA</div>
      <div class="integ" style="border:2px solid var(--nayax-yellow);background:var(--nayax-yellow-soft)">
        <div class="integ-logo" style="background:#1B45DA;color:#fff">CS</div>
        <div class="info">
          <div class="row between" style="margin-bottom:3px"><span class="bold">Clicksign</span><span class="dot" style="background:var(--success)"></span></div>
          <div class="desc">Envio para assinatura · webhooks de status · ICP-Brasil</div>
          <div class="row g6 wrap" style="margin-top:8px"><span class="bdg bdg-green">Conectado</span><span class="bdg bdg-grey">Produção</span><span class="bdg bdg-grey">2 signatários padrão</span></div>
          <div class="sm" style="margin-top:10px;color:var(--fg-2);line-height:1.5"><strong>Fluxo:</strong> Gerar PDF → criar documento → adicionar signatários → enviar → webhook <code>document.signed</code> → atualizar deal HubSpot → marcar Ganho</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="openM('m-clicksign-cfg')">${ICN("settings",13)}Configurar</button>
      </div>
    </div>
  `;
}
function integCard(logo,name,desc,bg,fg,on,tags){
  return `
    <div class="integ">
      <div class="integ-logo" style="background:${bg};color:${fg}">${logo}</div>
      <div class="info">
        <div class="bold">${name}</div>
        <div class="desc">${desc}</div>
        <div class="row g6 wrap" style="margin-top:8px">${tags.map(t=>`<span class="bdg bdg-grey">${t}</span>`).join("")}</div>
      </div>
      <div class="dot ${on?'':''}" style="background:${on?'var(--success)':'var(--border-strong)'}"></div>
      <button class="btn btn-ghost btn-sm">${on?'Configurar':'Conectar'}</button>
    </div>
  `;
}

function admAudit(){
  const log = [
    {time:"07/05 14:32", user:"Felipe Oliveira", action:"Aprovado", obj:"UPGRADE0664", detail:"Desconto 18% aprovado — Diretor", color:"green"},
    {time:"07/05 11:15", user:"Guilherme Raksa", action:"Gerado", obj:"UPGRADE0664", detail:"PDF gerado · R$ 34.800 · 18% → aguarda Coordenador", color:"blue"},
    {time:"06/05 17:44", user:"Vinícius Dias", action:"Ganho", obj:"FORM0094", detail:"Deal Ganho · P&S R$ 44.000", color:"green"},
    {time:"06/05 14:08", user:"Sistema", action:"Webhook", obj:"NOVO0489", detail:"Clicksign document.signed · pelos 2 signatários", color:"purple"},
    {time:"06/05 09:00", user:"Sistema", action:"Sync", obj:"HubSpot", detail:"Sincronização completa · 47 deals · 0 erros", color:"grey"},
    {time:"05/05 16:30", user:"Daiane Soares", action:"Editou", obj:"Alçada Coordenador", detail:"Faixa alterada de 5-10% para 5-12%", color:"amber"}
  ];
  return `
    <div class="card no-pad">
      <div class="tbl-toolbar">
        <div class="left">
          <div class="search-box" style="width:240px">${ICN("search",14)}<input class="input" placeholder="Buscar no log…"></div>
          <select class="select sm" style="width:auto"><option>Período: Últimos 7 dias</option></select>
          <select class="select sm" style="width:auto"><option>Ação: Todas</option></select>
        </div>
        <button class="btn btn-ghost btn-sm">${ICN("download",13)}Exportar CSV</button>
      </div>
      <table class="tbl">
        <thead><tr><th>Data/Hora</th><th>Usuário</th><th>Ação</th><th>Objeto</th><th>Detalhe</th></tr></thead>
        <tbody>
          ${log.map(l=>`
            <tr>
              <td class="sm mut mono">${l.time}</td>
              <td>${l.user}</td>
              <td><span class="bdg bdg-${l.color}">${l.action}</span></td>
              <td><span class="bdg bdg-dark bdg-mono">${l.obj}</span></td>
              <td class="sm">${l.detail}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
