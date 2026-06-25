/* ================================================================
   DealNayax v6 — Profile Roles (Consultor / Coordenador / Diretor)
   Visual reference of what each role sees + permissions matrix
================================================================ */

const ROLES = {
  consultor: {
    name: "Consultor",
    subtitle: "Vendedor da linha de frente · cria orçamentos e fecha negócios",
    color: "blue",
    bg: "#EFF6FF",
    fg: "#1D4ED8",
    icon: "user",
    sampleUser: { name:"Karolay Correia", avatar:"KA", team:"VM + Grua", leader:"Daiane Soares" },
    level: 2,
    discountLimit: "Até 5% (automático)",
    canApproveOthers: false,
    canSeeOthersDeals: false,
    canEditCatalog: false,
    canManageUsers: false,
    canSeeAuditLogs: false,
    pipelines: "Atribuídos pelo Admin",
    viewModel: "Apenas o próprio",
    typical: 8,
    quotesPerMonth: "8-15",
    pageList: ["Visão Geral · Orçamentos","Negócios (próprios)","Orçamentos (próprios)","Novo Orçamento","Aprovações (status)","Meu Perfil"],
    pageListBlocked: ["Configurações","Aprovar outros","Editar catálogo","Auditoria"],
    canDo: [
      {area:"Orçamentos", can:["Criar","Editar próprios","Enviar para Clicksign","Cancelar antes do envio"], cant:["Editar de outros","Excluir após envio"]},
      {area:"Descontos", can:["Aplicar até 5% (auto)","Solicitar até 25%","Justificar pedido"], cant:["Aprovar","Bypass de alçada"]},
      {area:"Catálogo", can:["Visualizar SKUs","Aplicar bundles","Ver preços"], cant:["Criar SKU","Mudar pricing","Mudar regras"]},
      {area:"Clientes", can:["Cadastrar PF/PJ","Editar próprios"], cant:["Reatribuir owner","Excluir cliente"]},
      {area:"Pipeline HubSpot", can:["Mover deals próprios","Atualizar valor"], cant:["Mover deals de outros"]}
    ],
    metrics: [
      {label:"Pipeline próprio", value:"R$ 58k", sub:"7 deals"},
      {label:"Meta P&S", value:"R$ 80k", sub:"73% atingido"},
      {label:"Conversão", value:"42%", sub:"acima da média"},
      {label:"Orçamentos no mês", value:"12", sub:"+3 vs abril"}
    ],
    dashboard: "consultor"
  },
  coordenador: {
    name: "Coordenador",
    subtitle: "Líder de time · aprova descontos médios e acompanha consultores",
    color: "amber",
    bg: "#FEF3C7",
    fg: "#92400E",
    icon: "user-check",
    sampleUser: { name:"Daiane Soares", avatar:"DA", team:"VM + Grua, MM + Lav", leader:"Felipe Oliveira" },
    level: 3,
    discountLimit: "Até 12%",
    canApproveOthers: "Apenas do seu time",
    canSeeOthersDeals: "Apenas do seu time",
    canEditCatalog: false,
    canManageUsers: "Apenas do seu time",
    canSeeAuditLogs: false,
    pipelines: "Pipelines do(s) time(s) liderado(s)",
    viewModel: "Subordinados + próprios",
    typical: 1,
    quotesPerMonth: "30-45 (próprios + revisões)",
    pageList: ["Visão Geral · Time","Negócios (time)","Orçamentos (time)","Novo Orçamento","Aprovações (fila do time)","Equipe","Meu Perfil"],
    pageListBlocked: ["Configurações de sistema","Aprovar acima de 12%","Editar catálogo / pricing","Auditoria"],
    canDo: [
      {area:"Orçamentos", can:["Tudo de Consultor","Editar do time","Reatribuir entre consultores"], cant:["Editar de outros times","Excluir após assinado"]},
      {area:"Descontos", can:["Aplicar até 12% (auto)","Aprovar até 12% do time","Escalar para Diretor"], cant:["Aprovar acima de 12%","Aprovar próprios pedidos"]},
      {area:"Catálogo", can:["Sugerir SKUs","Aplicar pricing customizado em deal"], cant:["Criar/editar SKU permanente","Alterar regras de pricing"]},
      {area:"Time", can:["Ver dashboard de cada consultor","Coachar metas","Adicionar consultor ao time"], cant:["Promover/demitir","Mudar perfil dos consultores"]},
      {area:"Relatórios", can:["Exportar do time","Filtrar por consultor"], cant:["Ver outros times","Ver receita consolidada"]}
    ],
    metrics: [
      {label:"Time", value:"4", sub:"consultores"},
      {label:"Pipeline do time", value:"R$ 318k", sub:"47 deals"},
      {label:"Aprovações pendentes", value:"2", sub:"de Karolay e Leticia"},
      {label:"Meta time vs realizado", value:"84%", sub:"R$ 268k de R$ 320k"}
    ],
    dashboard: "coordenador"
  },
  diretor: {
    name: "Diretor",
    subtitle: "Liderança comercial · aprova grandes descontos e configura o sistema",
    color: "green",
    bg: "#DCFCE7",
    fg: "#15803D",
    icon: "shield",
    sampleUser: { name:"Felipe Oliveira", avatar:"FO", team:"Toda a operação", leader:"— (Sem gestor)" },
    level: 4,
    discountLimit: "Até 25%",
    canApproveOthers: "De toda a operação",
    canSeeOthersDeals: "Toda a operação",
    canEditCatalog: true,
    canManageUsers: true,
    canSeeAuditLogs: true,
    pipelines: "Todos",
    viewModel: "Toda a operação",
    typical: 1,
    quotesPerMonth: "Acompanha 150+ ",
    pageList: ["Visão Geral · Operação","Negócios (todos)","Orçamentos (todos)","Novo Orçamento","Aprovações (fila completa)","Configurações","Meu Perfil"],
    pageListBlocked: ["Modificar logs de auditoria"],
    canDo: [
      {area:"Orçamentos", can:["Tudo de Coordenador","Editar de qualquer um","Reabrir assinados","Forçar status"], cant:["Apagar histórico"]},
      {area:"Descontos", can:["Aplicar até 25% (auto)","Aprovar até 25% de qualquer um","Escalar para Comitê (>25%)"], cant:["Aprovar acima de 25% sozinho"]},
      {area:"Catálogo & Pricing", can:["Criar/editar SKUs","Criar bundles","Configurar regras de pricing","Mudar alçadas"], cant:[]},
      {area:"Usuários & Times", can:["Adicionar/remover usuários","Mudar perfis","Reatribuir consultores","Configurar equipes"], cant:["Auto-rebaixar (precisa de outro Super Admin)"]},
      {area:"Sistema", can:["Configurar Clicksign","Configurar HubSpot webhook","Editar templates de PDF","Ver auditoria"], cant:["Apagar registros de auditoria"]}
    ],
    metrics: [
      {label:"Operação total", value:"R$ 1.84M", sub:"P&S do mês"},
      {label:"MRR ativo", value:"R$ 47.8k", sub:"98 contratos"},
      {label:"Times geridos", value:"4", sub:"8 consultores"},
      {label:"Aprovações pendentes", value:"3", sub:"alçada Diretor"}
    ],
    dashboard: "diretor"
  }
};

function renderRoles(){
  const root = document.getElementById("pg-roles");
  if(!root) return;
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('admin')">Configurações</a>${ICN("chevron-right",12)}<span class="cur">Perfis de Acesso</span></div>
          <div class="ph-t">Perfis de Acesso</div>
          <div class="ph-s">Visualize o que cada perfil enxerga e pode fazer · use o seletor para alternar entre eles</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("download",13)}Exportar matriz</button>
          <button class="btn btn-primary" onclick="openM('m-new-user')">${ICN("plus",13)}Novo Usuário</button>
        </div>
      </div>

      <!-- Role selector tabs -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
        ${Object.entries(ROLES).map(([k,r],i)=>roleCardSelector(k,r,i===0)).join("")}
      </div>

      <div id="role-content">${roleContent("consultor")}</div>
    </div>
  `;
}

function roleCardSelector(key, r, selected){
  return `
    <div onclick="selectRole('${key}')" id="role-card-${key}" class="role-card" style="border:1.5px solid ${selected?'var(--nayax-yellow)':'var(--border)'};background:${selected?'var(--nayax-yellow-softest)':'var(--surface)'};border-radius:12px;padding:18px;cursor:pointer;transition:.15s var(--ease);box-shadow:${selected?'var(--ring)':'var(--shadow-xs)'}">
      <div class="row between" style="margin-bottom:10px">
        <div style="width:38px;height:38px;border-radius:9px;background:${r.bg};color:${r.fg};display:flex;align-items:center;justify-content:center">${ICN(r.icon,18)}</div>
        <span class="bdg bdg-grey">Nível ${r.level}</span>
      </div>
      <div style="font-size:17px;font-weight:600;letter-spacing:-.2px;color:var(--fg);margin-bottom:3px">${r.name}</div>
      <div class="sm mut" style="line-height:1.45;margin-bottom:12px">${r.subtitle}</div>
      <div class="row between" style="padding-top:10px;border-top:1px solid var(--border-soft);font-size:11.5px">
        <span class="mut">Alçada</span>
        <span class="bold" style="color:var(--fg-2)">${r.discountLimit}</span>
      </div>
    </div>
  `;
}

function selectRole(key){
  document.querySelectorAll(".role-card").forEach(c=>{
    c.style.borderColor = "var(--border)";
    c.style.background = "var(--surface)";
    c.style.boxShadow = "var(--shadow-xs)";
  });
  const card = document.getElementById("role-card-"+key);
  if(card){
    card.style.borderColor = "var(--nayax-yellow)";
    card.style.background = "var(--nayax-yellow-softest)";
    card.style.boxShadow = "var(--ring)";
  }
  document.getElementById("role-content").innerHTML = roleContent(key);
}

function roleContent(key){
  const r = ROLES[key];
  return `
    <!-- Sample user banner -->
    <div class="card" style="margin-bottom:16px;overflow:hidden;border-color:${r.bg}">
      <div style="background:linear-gradient(135deg,${r.bg} 0%,var(--surface) 100%);padding:18px 22px;display:flex;align-items:center;gap:16px">
        <div class="av av-${avColor(r.sampleUser.avatar)}" style="width:48px;height:48px;font-size:16px">${r.sampleUser.avatar}</div>
        <div style="flex:1">
          <div class="row g8" style="margin-bottom:3px"><span style="font-size:17px;font-weight:600">${r.sampleUser.name}</span><span class="bdg" style="background:${r.bg};color:${r.fg}">${r.name}</span></div>
          <div class="sm mut">${r.sampleUser.team} · Líder: ${r.sampleUser.leader} · ${r.typical} ${r.typical===1?'usuário típico':'usuários típicos'} no sistema</div>
        </div>
        <button class="btn btn-ghost btn-sm">${ICN("user",12)}Ver perfil completo</button>
      </div>
    </div>

    <!-- KPIs the role sees -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title-block">
        <div class="t">O que ${r.name === 'Consultor' ? 'um consultor' : r.name === 'Coordenador' ? 'um coordenador' : 'um diretor'} vê na home?</div>
        <div class="s">Métricas filtradas pelo escopo do perfil · modelo "${r.viewModel}"</div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          ${r.metrics.map(m=>`
            <div style="padding:14px;border:1px solid var(--border);border-radius:9px;background:var(--surface)">
              <div class="kpi-label" style="margin-bottom:7px">${m.label}</div>
              <div class="kpi-value" style="font-size:28px">${m.value}</div>
              <div class="kpi-sub">${m.sub}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Sidebar preview + Permissions -->
    <div style="display:grid;grid-template-columns:300px 1fr;gap:16px;margin-bottom:16px">
      <!-- Sidebar preview -->
      <div class="card">
        <div class="card-title-block">
          <div class="t">Menu visível</div>
          <div class="s">Sidebar do ${r.name}</div>
        </div>
        <div class="card-body" style="padding:8px 14px 14px">
          <div class="col g4" style="margin-bottom:14px">
            ${r.pageList.map(p=>`
              <div style="display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:6px;background:var(--surface-2);font-size:12.5px;font-weight:500;color:var(--fg-2)">
                <span style="width:6px;height:6px;border-radius:50%;background:var(--success)"></span>
                ${p}
              </div>
            `).join("")}
          </div>
          <div class="eyebrow" style="margin-bottom:6px;color:var(--danger-fg)">Bloqueado</div>
          <div class="col g4">
            ${r.pageListBlocked.map(p=>`
              <div style="display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:6px;background:var(--surface);border:1px solid var(--border-soft);font-size:12.5px;color:var(--fg-5);text-decoration:line-through">
                <span style="width:6px;height:6px;border-radius:50%;background:var(--danger)"></span>
                ${p}
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Capabilities -->
      <div class="card">
        <div class="card-title-block">
          <div class="t">Capacidades por área</div>
          <div class="s">${r.canDo.length} áreas · o que ${r.name === 'Consultor' ? 'pode' : r.name === 'Coordenador' ? 'pode' : 'pode'} e o que não pode fazer</div>
        </div>
        <div class="card-body" style="padding:0">
          ${r.canDo.map((c,i)=>`
            <div style="padding:14px 22px;border-bottom:${i<r.canDo.length-1?'1px solid var(--border-soft)':'none'}">
              <div class="bold sm" style="margin-bottom:8px">${c.area}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
                <div>
                  <div class="eyebrow" style="color:var(--success-fg);margin-bottom:5px">${ICN("check",10)} PODE</div>
                  <div class="col g4">
                    ${c.can.map(item=>`<div style="font-size:12px;color:var(--fg-2);display:flex;align-items:flex-start;gap:6px"><span style="color:var(--success);margin-top:2px">${ICN("check",10)}</span>${item}</div>`).join("")}
                  </div>
                </div>
                <div>
                  <div class="eyebrow" style="color:var(--danger-fg);margin-bottom:5px">${ICN("x",10)} NÃO PODE</div>
                  <div class="col g4">
                    ${c.cant.length === 0 ? '<div class="sm mut">— sem restrições</div>' : c.cant.map(item=>`<div style="font-size:12px;color:var(--fg-3);display:flex;align-items:flex-start;gap:6px"><span style="color:var(--danger);margin-top:2px">${ICN("x",10)}</span>${item}</div>`).join("")}
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Properties matrix -->
    <div class="card">
      <div class="card-title-block">
        <div class="t">Resumo de configuração</div>
        <div class="s">Configuração técnica deste perfil</div>
      </div>
      <div class="card-body" style="padding:0">
        ${rolePropRow("Alçada de desconto", r.discountLimit, "shield")}
        ${rolePropRow("Aprovar descontos de outros", r.canApproveOthers || "Não", "user-check")}
        ${rolePropRow("Ver negócios de outros", r.canSeeOthersDeals || "Não", "users")}
        ${rolePropRow("Editar catálogo e pricing", r.canEditCatalog ? "Sim" : "Não", "package")}
        ${rolePropRow("Gerenciar usuários", r.canManageUsers || "Não", "users")}
        ${rolePropRow("Ver logs de auditoria", r.canSeeAuditLogs ? "Sim" : "Não", "history")}
        ${rolePropRow("Pipelines acessíveis", r.pipelines, "layers")}
        ${rolePropRow("Modelo de visualização", r.viewModel, "globe")}
        ${rolePropRow("Orçamentos por mês (típico)", r.quotesPerMonth, "file-text", true)}
      </div>
    </div>
  `;
}

function rolePropRow(label, value, icon, last){
  const isPositive = !["Não","—"].includes(String(value).split(" ")[0]);
  const v = typeof value === "boolean" ? (value?"Sim":"Não") : value;
  return `
    <div style="display:grid;grid-template-columns:32px 1fr auto;gap:14px;align-items:center;padding:13px 22px;${last?'':'border-bottom:1px solid var(--border-soft)'}">
      <div style="width:30px;height:30px;border-radius:7px;background:var(--surface-2);color:var(--fg-3);display:flex;align-items:center;justify-content:center">${ICN(icon,15)}</div>
      <div style="font-size:13px;color:var(--fg-2)">${label}</div>
      <div style="font-size:12.5px;font-weight:600;color:${isPositive==='Não'?'var(--fg-5)':'var(--fg)'}">${v}</div>
    </div>
  `;
}
