/* ================================================================
   DealNayax v6 — Profile page (Meu Perfil)
================================================================ */

function renderProfile(){
  const root = document.getElementById("pg-profile");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="ph-t">Meu Perfil</div>
          <div class="ph-s">Suas informações, metas e desempenho · DealNayax</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("download",13)}Exportar relatório</button>
          <button class="btn btn-primary" onclick="alert('✓ Alterações salvas.')">${ICN("check",13)}Salvar alterações</button>
        </div>
      </div>

      <!-- Profile header card -->
      <div class="card" style="margin-bottom:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,var(--nayax-yellow) 0%,var(--nayax-yellow-deep) 100%);height:90px;position:relative">
          <div style="position:absolute;right:18px;top:14px;display:flex;gap:8px">
            <button class="btn btn-soft btn-sm" style="background:rgba(0,0,0,.08);color:#262626;border:none">${ICN("upload",12)}Trocar capa</button>
          </div>
        </div>
        <div style="padding:0 22px 22px;position:relative">
          <div style="display:flex;align-items:flex-end;gap:18px;margin-top:-40px">
            <div style="position:relative">
              <div class="av av-y" style="width:84px;height:84px;font-size:28px;border:4px solid var(--surface);box-shadow:var(--shadow-md)">FO</div>
              <button style="position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:50%;background:var(--surface);border:2px solid var(--surface);box-shadow:var(--shadow-sm);display:flex;align-items:center;justify-content:center;color:var(--fg-3);cursor:pointer">${ICN("edit",12)}</button>
            </div>
            <div style="flex:1;padding-bottom:8px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <h2 style="font-size:22px;font-weight:600;letter-spacing:-.4px">Felipe Oliveira</h2>
                <span class="bdg bdg-dark">Super Admin</span>
                <span class="bdg bdg-green">${ICN("check",10)}Verificado</span>
              </div>
              <div class="sm mut" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
                <span>${ICN("user",11)} Diretor Comercial · Nayax Brasil</span>
                <span>${ICN("calendar",11)} Na Nayax desde Jan/2023</span>
                <span class="mono" style="font-size:11px">Owner ID 85578000</span>
              </div>
            </div>
            <div style="display:flex;gap:8px;padding-bottom:8px">
              <button class="btn btn-ghost btn-sm">${ICN("settings",13)}Preferências</button>
              <button class="btn btn-ghost btn-sm">${ICN("lock",13)}Trocar senha</button>
            </div>
          </div>
        </div>
      </div>

      <!-- KPIs do mês -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
        ${profileKpi("Orçamentos no mês","12","↑ +3 vs abril",true,"file-text")}
        ${profileKpi("Aprovações dadas","8","R$ 312k liberados",null,"shield")}
        ${profileKpi("Pipeline gerenciado","R$ 318k","47 deals em aberto",null,"trend-up")}
        ${profileKpi("Tempo médio aprovação","1,2d","↓ −0,4d vs equipe",true,"clock")}
      </div>

      <!-- Tabs -->
      <div class="tabs" data-tab-group="prof">
        <button class="tab on" data-tab="info" onclick="tab('prof','info',event)">${ICN("user",13)} Informações</button>
        <button class="tab" data-tab="perf" onclick="tab('prof','perf',event)">${ICN("trend-up",13)} Desempenho</button>
        <button class="tab" data-tab="permissions" onclick="tab('prof','permissions',event)">${ICN("shield",13)} Permissões</button>
        <button class="tab" data-tab="notifications" onclick="tab('prof','notifications',event)">${ICN("bell",13)} Notificações</button>
        <button class="tab" data-tab="security" onclick="tab('prof','security',event)">${ICN("lock",13)} Segurança</button>
        <button class="tab" data-tab="activity" onclick="tab('prof','activity',event)">${ICN("history",13)} Atividade</button>
      </div>

      <div data-tab-panel-group="prof">
        <div class="tab-panel on" id="tp-prof-info">${profileInfo()}</div>
        <div class="tab-panel" id="tp-prof-perf">${profilePerf()}</div>
        <div class="tab-panel" id="tp-prof-permissions">${profilePermissions()}</div>
        <div class="tab-panel" id="tp-prof-notifications">${profileNotifications()}</div>
        <div class="tab-panel" id="tp-prof-security">${profileSecurity()}</div>
        <div class="tab-panel" id="tp-prof-activity">${profileActivity()}</div>
      </div>
    </div>
  `;
}

function profileKpi(label, value, sub, good, icon){
  return `
    <div class="kpi">
      <div class="kpi-head">
        <div class="kpi-label">${label}</div>
        <div class="kpi-icon accent">${ICN(icon,13)}</div>
      </div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-sub" style="${good!=null?'color:'+(good?'var(--success-fg)':'var(--danger-fg)')+';font-weight:600':''}">${sub}</div>
    </div>
  `;
}

// === TAB: Informações ===
function profileInfo(){
  return `
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-h">
          <div class="ctitle">${ICN("user",14)} Dados pessoais</div>
        </div>
        <div class="card-body">
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Nome completo</label><input class="input" value="Felipe Oliveira"></div>
            <div class="field"><label>Como gostaria de ser chamado</label><input class="input" value="Felipe"></div>
          </div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>E-mail corporativo</label><input class="input" value="felipeo@nayax.com" readonly style="background:var(--surface-2);color:var(--fg-3)"><div class="hint">Solicitar alteração ao Admin</div></div>
            <div class="field"><label>Telefone</label><input class="input" value="+55 11 99240-7521"></div>
          </div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>CPF</label><input class="input" value="123.456.789-00"></div>
            <div class="field"><label>Data de nascimento</label><input class="input" type="date" value="1984-08-22"></div>
          </div>
          <div class="field" style="margin-bottom:14px">
            <label>Bio / Apresentação</label>
            <textarea class="textarea" placeholder="Conte um pouco sobre você...">Diretor Comercial da Nayax Brasil. Atuo desde 2023 estruturando o time de vendas e expandindo a base de clientes em Vending, Food Service e Lavanderia.</textarea>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-h">
          <div class="ctitle">${ICN("briefcase",14)} Dados profissionais</div>
        </div>
        <div class="card-body">
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Cargo</label><input class="input" value="Diretor Comercial"></div>
            <div class="field"><label>Departamento</label><input class="input" value="Comercial / Vendas"></div>
          </div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Equipe</label>
              <select class="select"><option>—</option><option selected>Liderança</option><option>VM + Grua</option><option>Food</option><option>KA</option></select>
            </div>
            <div class="field"><label>Gestor direto</label>
              <select class="select"><option selected>— (Sem gestor · nível diretor)</option><option>CEO Brasil</option></select>
            </div>
          </div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Data de admissão</label><input class="input" type="date" value="2023-01-15"></div>
            <div class="field"><label>HubSpot Owner ID</label><input class="input mono" value="85578000" readonly style="background:var(--surface-2)"></div>
          </div>
          <div class="field">
            <label>Pipelines com acesso</label>
            <div class="chips">
              <span class="chip on">822543360 · VM-Vendas</span>
              <span class="chip on">836863041 · VM-Vendas da Base</span>
              <span class="chip on">${ICN("plus",10)} Todos os pipelines (Super Admin)</span>
            </div>
            <div class="hint">Configurável pelo Admin · Configurações → Equipes</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-h">
        <div class="ctitle">${ICN("globe",14)} Preferências</div>
      </div>
      <div class="card-body">
        <div class="grid-3" style="margin-bottom:14px">
          <div class="field">
            <label>Idioma da interface</label>
            <select class="select"><option selected>Português (BR)</option><option>English</option><option>Español</option></select>
          </div>
          <div class="field">
            <label>Fuso horário</label>
            <select class="select"><option selected>America/Sao_Paulo (GMT-3)</option><option>America/Manaus (GMT-4)</option><option>UTC</option></select>
          </div>
          <div class="field">
            <label>Formato de moeda</label>
            <select class="select"><option selected>R$ 1.234,56 (BRL)</option><option>$ 1,234.56 (USD)</option></select>
          </div>
        </div>
        <div class="grid-3">
          <div class="field">
            <label>Página inicial padrão</label>
            <select class="select"><option selected>Visão Geral · Orçamentos</option><option>Negócios</option><option>Aprovações</option><option>Orçamentos</option></select>
          </div>
          <div class="field">
            <label>Densidade da interface</label>
            <select class="select"><option selected>Confortável</option><option>Compacta</option></select>
          </div>
          <div class="field">
            <label>Tema</label>
            <select class="select"><option selected>Claro</option><option>Escuro</option><option>Automático (do sistema)</option></select>
          </div>
        </div>
      </div>
    </div>
  `;
}

// === TAB: Desempenho ===
function profilePerf(){
  return `
    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title-block">
          <div class="t">Meta do mês — P&amp;S</div>
          <div class="s">Maio 2026 · valor pessoal atribuído</div>
        </div>
        <div class="card-body" style="padding-top:8px">
          <div class="row between" style="align-items:baseline;margin-bottom:6px">
            <div class="big-stat"><span class="currency">R$</span><span class="num">312.450</span></div>
            <div style="text-align:right">
              <div class="pct good" style="font-size:28px;font-weight:600;letter-spacing:-.4px;color:#0E8A4C">78 <span style="font-size:14px">%</span></div>
              <div style="font-size:9.5px;color:var(--fg-4);letter-spacing:.5px;text-transform:uppercase;font-weight:700">ATINGIDO</div>
            </div>
          </div>
          <div class="metric-meta" style="margin-bottom:8px"><span>de R$ 400.000</span><span>Restante R$ 87.550</span></div>
          <div class="metric-bar" style="height:8px;margin-bottom:14px"><div class="ps" style="width:78%"></div></div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding-top:14px;border-top:1px solid var(--border-soft)">
            <div><div class="eyebrow" style="margin-bottom:4px">Ranking</div><div style="font-size:20px;font-weight:600">#3 <span class="sm mut">de 8</span></div></div>
            <div><div class="eyebrow" style="margin-bottom:4px">Melhor mês</div><div style="font-size:20px;font-weight:600">Mar/26 <span class="sm mut">142%</span></div></div>
            <div><div class="eyebrow" style="margin-bottom:4px">Última venda</div><div style="font-size:20px;font-weight:600">hoje <span class="sm mut">R$ 32k</span></div></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title-block">
          <div class="t">Meta do mês — MRR</div>
          <div class="s">Receita recorrente conquistada</div>
        </div>
        <div class="card-body" style="padding-top:8px">
          <div class="row between" style="align-items:baseline;margin-bottom:6px">
            <div class="big-stat"><span class="currency">R$</span><span class="num">9.420</span><span class="unit">/mês</span></div>
            <div style="text-align:right">
              <div class="pct warn" style="font-size:28px;font-weight:600;letter-spacing:-.4px;color:#B45309">65 <span style="font-size:14px">%</span></div>
              <div style="font-size:9.5px;color:var(--fg-4);letter-spacing:.5px;text-transform:uppercase;font-weight:700">ATINGIDO</div>
            </div>
          </div>
          <div class="metric-meta" style="margin-bottom:8px"><span>de R$ 14.500/mês</span><span>Restante R$ 5.080</span></div>
          <div class="metric-bar" style="height:8px;margin-bottom:14px"><div class="mrr" style="width:65%"></div></div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding-top:14px;border-top:1px solid var(--border-soft)">
            <div><div class="eyebrow" style="margin-bottom:4px">Net retention</div><div style="font-size:20px;font-weight:600">112%</div></div>
            <div><div class="eyebrow" style="margin-bottom:4px">Contratos ativos</div><div style="font-size:20px;font-weight:600">28</div></div>
            <div><div class="eyebrow" style="margin-bottom:4px">Churn (3m)</div><div style="font-size:20px;font-weight:600">1,2%</div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-title-block">
        <div class="t">Evolução · últimos 6 meses</div>
        <div class="s">P&amp;S realizado vs meta pessoal</div>
      </div>
      <div class="card-body" style="padding-top:14px">
        ${profileChart()}
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title-block">
          <div class="t">Conquistas</div>
          <div class="s">Reconhecimento do time comercial</div>
        </div>
        <div class="card-body" style="padding-top:10px">
          ${profileAchievement("🏆","Top Vendedor do Trimestre","Q1 2026 · 142% da meta",true)}
          ${profileAchievement("🎯","100 orçamentos no mês","Marcou em Mar/26",true)}
          ${profileAchievement("⭐","Maior ticket médio do ano","R$ 88k · Cinemark Family",true)}
          ${profileAchievement("🚀","Renovação 100% da carteira","Q4 2025",true)}
          ${profileAchievement("💎","R$ 1M em P&S no semestre","2º sem 2025",false)}
        </div>
      </div>

      <div class="card">
        <div class="card-title-block">
          <div class="t">Top contratos fechados</div>
          <div class="s">Maiores vitórias do ano</div>
        </div>
        <div class="card-body" style="padding-top:10px">
          ${profileDeal("Cinemark Family Lazer","NOVO0489",88400,"Mai/26")}
          ${profileDeal("Vend360 Ltda","NOVO0491",58200,"Mai/26")}
          ${profileDeal("GruaFlex Serviços","FORM0094",44000,"Abr/26")}
          ${profileDeal("Rede FastVend","UPGRADE0664",34800,"Abr/26")}
          ${profileDeal("Arcade Multiplay","NOVO0487",34500,"Abr/26")}
        </div>
      </div>
    </div>
  `;
}

function profileChart(){
  const data = [
    {m:"Dez", real:284, meta:300},
    {m:"Jan", real:312, meta:320},
    {m:"Fev", real:298, meta:340},
    {m:"Mar", real:485, meta:340},
    {m:"Abr", real:368, meta:380},
    {m:"Mai", real:312, meta:400}
  ];
  const max = 500;
  return `
    <div style="display:grid;grid-template-columns:1fr 60px;gap:14px;align-items:end;height:200px;padding:0 6px">
      ${data.map(d=>`
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px;height:100%;justify-content:flex-end;position:relative">
          <div style="position:absolute;bottom:${d.meta/max*100}%;left:0;right:0;border-top:1.5px dashed var(--fg-5);z-index:2"></div>
          <div style="font-size:11.5px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--fg)">R$ ${d.real}k</div>
          <div style="width:70%;height:${d.real/max*70}%;background:linear-gradient(180deg,var(--nayax-yellow) 0%,var(--nayax-yellow-deep) 100%);border-radius:5px 5px 0 0"></div>
          <div style="font-size:11px;color:var(--fg-4);font-weight:500">${d.m}</div>
        </div>
      `).join("")}
      <div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:6px;font-size:10px;color:var(--fg-4);height:100%;padding-bottom:24px">
        <div style="height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-right:6px;font-variant-numeric:tabular-nums">
          <span>500k</span><span>375k</span><span>250k</span><span>125k</span><span>0</span>
        </div>
      </div>
    </div>
    <div class="row g16" style="margin-top:14px;justify-content:center;font-size:11.5px;color:var(--fg-4)">
      <span class="row g6"><span style="width:10px;height:10px;background:var(--nayax-yellow);border-radius:2px"></span>Realizado P&amp;S</span>
      <span class="row g6"><span style="width:12px;height:0;border-top:1.5px dashed var(--fg-5)"></span>Meta mensal</span>
    </div>
  `;
}

function profileAchievement(emoji, title, sub, unlocked){
  return `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-soft);${!unlocked?'opacity:.5':''}">
      <div style="width:36px;height:36px;border-radius:8px;background:${unlocked?'var(--nayax-yellow-soft)':'var(--surface-3)'};display:flex;align-items:center;justify-content:center;font-size:18px">${emoji}</div>
      <div style="flex:1">
        <div class="bold sm">${title}</div>
        <div class="sm mut" style="font-size:11px">${sub}</div>
      </div>
      ${unlocked?`<span class="bdg bdg-green">${ICN("check",10)}Conquistado</span>`:'<span class="bdg bdg-grey">Em progresso</span>'}
    </div>
  `;
}

function profileDeal(company, num, value, when){
  return `
    <div style="display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--border-soft)">
      <div>
        <div class="bold sm">${company}</div>
        <span class="bdg bdg-dark bdg-mono">${num}</span>
      </div>
      <div style="text-align:right">
        <div style="font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--fg)">${fmt.brl(value)}</div>
        <div class="sm mut" style="font-size:11px">${when}</div>
      </div>
      <button class="btn btn-ghost btn-xs">${ICN("external",11)}</button>
    </div>
  `;
}

// === TAB: Permissões ===
function profilePermissions(){
  return `
    <div class="alert alert-warn" style="margin-bottom:14px">${ICN("shield",14)}<div>Como <strong>Super Admin</strong>, você tem acesso total. Para reduzir suas permissões, peça a outro Super Admin no painel de Configurações.</div></div>

    <div class="card" style="margin-bottom:14px">
      <div class="card-h"><div class="ctitle">Perfil ativo</div></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:48px;height:48px;border-radius:10px;background:var(--nayax-dark);color:var(--nayax-yellow);display:flex;align-items:center;justify-content:center">${ICN("shield",22)}</div>
          <div style="flex:1">
            <div style="font-size:16px;font-weight:600;color:var(--fg)">Super Admin</div>
            <div class="sm mut">Acesso total a todos os módulos · pode modificar configurações de sistema</div>
          </div>
          <span class="bdg bdg-dark">Nível 5 · máximo</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-h"><div class="ctitle">Permissões por área</div></div>
      <div class="card-body" style="padding:0">
        ${permRow("Orçamentos","Criar, editar, excluir, aprovar próprios e de outros",true,true,true,true)}
        ${permRow("Negócios","Visualizar todos os pipelines · editar qualquer deal",true,true,true,true)}
        ${permRow("Aprovações","Aprovar até R$ 500k · alçada Diretor",true,true,true,true)}
        ${permRow("Catálogo & Pricing","Criar SKUs, bundles, regras de pricing",true,true,true,true)}
        ${permRow("Usuários & Equipes","Adicionar/remover usuários · gerenciar perfis",true,true,true,true)}
        ${permRow("Integrações","HubSpot, Clicksign, webhooks · credenciais",true,true,true,true)}
        ${permRow("Auditoria","Visualizar logs do sistema",true,false,false,false)}
        ${permRow("Faturamento","Visualizar receita consolidada do tenant",true,false,false,false)}
      </div>
    </div>
  `;
}

function permRow(area, desc, ler, criar, editar, deletar){
  const dot = v => v ? `<span class="bdg bdg-green" style="min-width:60px;justify-content:center">${ICN("check",10)}Sim</span>` : `<span class="bdg bdg-grey" style="min-width:60px;justify-content:center">—</span>`;
  return `
    <div style="display:grid;grid-template-columns:1.5fr 70px 70px 70px 70px;gap:10px;align-items:center;padding:11px 18px;border-bottom:1px solid var(--border-soft)">
      <div>
        <div class="bold sm">${area}</div>
        <div class="sm mut" style="font-size:11px">${desc}</div>
      </div>
      <div style="text-align:center">${dot(ler)}</div>
      <div style="text-align:center">${dot(criar)}</div>
      <div style="text-align:center">${dot(editar)}</div>
      <div style="text-align:center">${dot(deletar)}</div>
    </div>
  `;
}

// === TAB: Notificações ===
function profileNotifications(){
  const channels = [
    {area:"Aprovações pendentes para mim", email:true, push:true, sms:false, whatsapp:false, freq:"Imediato"},
    {area:"Orçamento meu foi aprovado/recusado", email:true, push:true, sms:false, whatsapp:true, freq:"Imediato"},
    {area:"Cliente assinou contrato (Clicksign)", email:true, push:true, sms:false, whatsapp:true, freq:"Imediato"},
    {area:"Lembrete: orçamento sem movimento há 5 dias", email:true, push:false, sms:false, whatsapp:false, freq:"Diário"},
    {area:"Resumo semanal do meu time", email:true, push:false, sms:false, whatsapp:false, freq:"Segunda 9h"},
    {area:"Meta do mês batida por consultor do time", email:false, push:true, sms:false, whatsapp:false, freq:"Imediato"},
    {area:"Atualizações do produto DealNayax", email:true, push:false, sms:false, whatsapp:false, freq:"Mensal"}
  ];
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("bell",14)} Canais de Notificação</div>
          <div class="csub">Escolha onde quer receber cada tipo de alerta</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="alert('✓ Preferências resetadas para o padrão.')">${ICN("refresh",13)}Restaurar padrão</button>
      </div>
      <div class="card-body" style="padding:0">
        <div style="display:grid;grid-template-columns:2fr 70px 70px 70px 80px 100px;gap:10px;padding:12px 20px;background:var(--surface-2);border-bottom:1px solid var(--border);font-size:10.5px;font-weight:600;color:var(--fg-4);letter-spacing:.4px;text-transform:uppercase;align-items:center">
          <div>Evento</div>
          <div style="text-align:center">E-mail</div>
          <div style="text-align:center">Push</div>
          <div style="text-align:center">SMS</div>
          <div style="text-align:center">WhatsApp</div>
          <div>Frequência</div>
        </div>
        ${channels.map(c=>`
          <div style="display:grid;grid-template-columns:2fr 70px 70px 70px 80px 100px;gap:10px;padding:11px 20px;border-bottom:1px solid var(--border-soft);align-items:center">
            <div class="sm" style="color:var(--fg-2)">${c.area}</div>
            <div style="text-align:center">${notifSwitch(c.email)}</div>
            <div style="text-align:center">${notifSwitch(c.push)}</div>
            <div style="text-align:center">${notifSwitch(c.sms)}</div>
            <div style="text-align:center">${notifSwitch(c.whatsapp)}</div>
            <div class="sm mut" style="font-size:11.5px">${c.freq}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-h">
        <div class="ctitle">${ICN("clock",14)} Não perturbe</div>
      </div>
      <div class="card-body">
        <label class="row g8" style="margin-bottom:12px;cursor:pointer"><input type="checkbox" checked> <span class="sm">Pausar notificações fora do horário comercial</span></label>
        <div class="grid-3">
          <div class="field"><label>Início</label><input class="input" type="time" value="18:30"></div>
          <div class="field"><label>Fim</label><input class="input" type="time" value="08:00"></div>
          <div class="field"><label>Fuso</label><select class="select"><option selected>America/Sao_Paulo</option></select></div>
        </div>
      </div>
    </div>
  `;
}

function notifSwitch(on){
  return `<label style="display:inline-block;cursor:pointer">
    <div style="width:30px;height:18px;border-radius:9px;background:${on?'var(--success)':'var(--border-strong)'};position:relative;transition:.15s var(--ease)" onclick="this.firstElementChild.style.left=this.firstElementChild.style.left==='2px'?'14px':'2px';this.style.background=this.style.background.includes('25, 239, 137')||this.style.background.includes('37, 239, 137')?'var(--border-strong)':'var(--success)'">
      <div style="position:absolute;top:2px;left:${on?'14px':'2px'};width:14px;height:14px;border-radius:50%;background:#fff;transition:.15s var(--ease);box-shadow:var(--shadow-xs)"></div>
    </div>
  </label>`;
}

// === TAB: Segurança ===
function profileSecurity(){
  return `
    <div class="grid-2" style="gap:16px">
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-h"><div class="ctitle">${ICN("lock",14)} Senha</div></div>
          <div class="card-body">
            <div class="field" style="margin-bottom:12px"><label>Senha atual</label><input class="input" type="password" value="●●●●●●●●●●"></div>
            <div class="field" style="margin-bottom:12px"><label>Nova senha</label><input class="input" type="password" placeholder="Mínimo 12 caracteres"><div class="hint">Use letras, números e ao menos 1 caractere especial</div></div>
            <div class="field" style="margin-bottom:14px"><label>Confirmar nova senha</label><input class="input" type="password"></div>
            <button class="btn btn-primary btn-sm">Atualizar senha</button>
            <div class="sm mut" style="margin-top:10px">Última alteração há <strong>62 dias</strong> · força <span class="bdg bdg-green">Forte</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-h"><div class="ctitle">${ICN("shield",14)} Autenticação em 2 fatores (2FA)</div><span class="bdg bdg-green">${ICN("check",10)}Ativo</span></div>
          <div class="card-body">
            <div class="sm" style="margin-bottom:14px;color:var(--fg-2);line-height:1.6">Você ativou a verificação em dois fatores via aplicativo autenticador. Toda vez que entrar de um novo dispositivo, vamos pedir o código de 6 dígitos.</div>
            <div class="row between" style="padding:12px;background:var(--surface-2);border-radius:8px">
              <div class="row g10">
                <div style="width:34px;height:34px;border-radius:7px;background:var(--nayax-yellow);color:var(--nayax-dark);display:flex;align-items:center;justify-content:center">${ICN("shield",17)}</div>
                <div>
                  <div class="bold sm">App Autenticador</div>
                  <div class="sm mut" style="font-size:11px">Google Authenticator · ativado em 12/02/2026</div>
                </div>
              </div>
              <button class="btn btn-ghost btn-sm">Reconfigurar</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-h"><div class="ctitle">${ICN("monitor",14)} Sessões ativas</div></div>
          <div class="card-body" style="padding:0">
            ${sessionRow("MacBook Pro · Chrome 127","São Paulo, SP","agora","Esta sessão",true)}
            ${sessionRow("iPhone 15 Pro · Safari","São Paulo, SP","2h atrás",null,false)}
            ${sessionRow("Windows · Edge","Rio de Janeiro, RJ","ontem 18:30","Suspeita?",false,true)}
            ${sessionRow("MacBook Air · Chrome","São Paulo, SP","3 dias","",false)}
          </div>
          <div style="padding:12px 18px;border-top:1px solid var(--border-soft);background:var(--surface-2)">
            <button class="btn btn-danger btn-sm">${ICN("log-out",13)}Encerrar todas as outras sessões</button>
          </div>
        </div>

        <div class="card">
          <div class="card-h"><div class="ctitle">${ICN("zap",14)} Chaves de API</div><button class="btn btn-ghost btn-sm">${ICN("plus",12)}Nova chave</button></div>
          <div class="card-body" style="padding:0">
            ${apiKeyRow("Integração HubSpot pessoal","sk-fo-h••••••••••••a92","12/03/2026","Nunca")}
            ${apiKeyRow("Webhook DealNayax → Slack","sk-fo-s••••••••••••f01","04/05/2026","2h atrás")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function sessionRow(device, location, when, label, current, suspicious){
  return `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border-soft)">
      <div style="width:32px;height:32px;border-radius:7px;background:${current?'var(--nayax-yellow-soft)':suspicious?'var(--danger-bg)':'var(--surface-3)'};color:${current?'#7A5800':suspicious?'var(--danger-fg)':'var(--fg-3)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("monitor",16)}</div>
      <div style="flex:1;min-width:0">
        <div class="row g8" style="margin-bottom:2px">
          <div class="bold sm">${device}</div>
          ${current?'<span class="bdg bdg-y">Atual</span>':''}
          ${suspicious?'<span class="bdg bdg-red">⚠ Suspeita</span>':''}
        </div>
        <div class="sm mut" style="font-size:11.5px">${location} · ${when}</div>
      </div>
      ${current?'':`<button class="btn btn-ghost btn-xs">${ICN("log-out",11)}Encerrar</button>`}
    </div>
  `;
}

function apiKeyRow(name, key, created, lastUsed){
  return `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border-soft)">
      <div style="flex:1;min-width:0">
        <div class="bold sm" style="margin-bottom:3px">${name}</div>
        <div class="row g8" style="font-size:11.5px;color:var(--fg-4)">
          <code class="mono" style="background:var(--surface-2);padding:1px 6px;border-radius:3px;font-size:10.5px">${key}</code>
          <span>Criada em ${created} · usada ${lastUsed}</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-xs">Rotacionar</button>
      <button class="btn btn-soft btn-xs" style="color:var(--danger-fg)">${ICN("trash",11)}</button>
    </div>
  `;
}

// === TAB: Atividade ===
function profileActivity(){
  const log = [
    {time:"agora",         icon:"check-circle", color:"green", action:"Aprovou desconto",  detail:"UPGRADE0664 · 18% · Rede FastVend · R$ 34.800"},
    {time:"32 min",        icon:"file-text",    color:"blue",  action:"Editou orçamento",   detail:"NOVO0493 · Supermercado Alvorada · ajuste de SKU"},
    {time:"1h 12 min",     icon:"send",         color:"purple",action:"Enviou para Clicksign", detail:"NOVO0489 · Cinemark Family · 2 signatários"},
    {time:"2h",            icon:"check",        color:"green", action:"Aprovou orçamento",  detail:"BASE0575 · Posto Bandeirantes · alçada Diretor"},
    {time:"3h 22 min",     icon:"edit",         color:"grey",  action:"Configurou alçada",  detail:"Coordenador · faixa de 5-10% → 5-12%"},
    {time:"ontem 16:48",   icon:"plus",         color:"grey",  action:"Criou novo SKU",     detail:"VPOS-MINI-02 · R$ 990 · linha VM"},
    {time:"ontem 14:32",   icon:"users",        color:"blue",  action:"Adicionou usuário",  detail:"Carlos Ferreira · Consultor · Food"},
    {time:"2 dias atrás",  icon:"shield",       color:"amber", action:"Renovou chave API",  detail:"Webhook DealNayax → Slack"},
    {time:"3 dias atrás",  icon:"download",     color:"grey",  action:"Exportou relatório", detail:"Pipeline maio · CSV · 47 deals"},
    {time:"4 dias atrás",  icon:"file-text",    color:"blue",  action:"Editou template",    detail:"PDF Novo Cliente · adicionou QR Code"}
  ];
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("history",14)} Sua atividade</div>
          <div class="csub">Últimas ações registradas · ${log.length} eventos</div>
        </div>
        <div class="row g8">
          <select class="select sm" style="width:auto"><option>Período: Últimos 7 dias</option><option>Últimas 24h</option><option>Últimos 30 dias</option></select>
          <button class="btn btn-ghost btn-sm">${ICN("download",13)}Exportar</button>
        </div>
      </div>
      <div class="card-body" style="padding:0">
        ${log.map(l=>`
          <div style="display:flex;align-items:flex-start;gap:14px;padding:14px 20px;border-bottom:1px solid var(--border-soft)">
            <div style="width:32px;height:32px;border-radius:8px;background:${profileActivityBg(l.color)};color:${profileActivityFg(l.color)};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN(l.icon,15)}</div>
            <div style="flex:1;min-width:0">
              <div class="row between" style="margin-bottom:3px">
                <div class="bold sm">${l.action}</div>
                <div class="sm mut" style="font-size:11.5px">${l.time}</div>
              </div>
              <div class="sm" style="color:var(--fg-3);line-height:1.5">${l.detail}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function profileActivityBg(c){
  return {green:"var(--success-bg)", blue:"var(--info-bg)", purple:"var(--purple-bg)", amber:"var(--warning-bg)", grey:"var(--surface-3)"}[c];
}
function profileActivityFg(c){
  return {green:"var(--success-fg)", blue:"var(--info-fg)", purple:"var(--purple-fg)", amber:"var(--warning-fg)", grey:"var(--fg-3)"}[c];
}
