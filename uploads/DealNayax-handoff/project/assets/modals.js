/* ================================================================
   DealNayax v6 — Modals (Catalog picker, Bundle picker, Send to Signature, Clicksign cfg)
================================================================ */

function renderModals(){
  const wrap = $("modals-root");
  wrap.innerHTML = `

  <!-- CATALOG PICKER -->
  <div class="modal-overlay" id="m-catalog">
    <div class="modal lg">
      <div class="modal-h">
        <div>
          <div class="modal-t">Adicionar Produto</div>
          <div class="modal-sub">Catálogo completo · ${window.__data.CATALOG.length} SKUs</div>
        </div>
        <button class="modal-x" onclick="closeM('m-catalog')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">
        <div class="row g8" style="margin-bottom:14px">
          <div class="search-box grow">${ICN("search",14)}<input class="input" placeholder="Buscar SKU, nome…" oninput="filterCatalogModal(this.value)"></div>
          <select class="select" style="width:auto"><option>Categoria: Todas</option><option>Hardware</option><option>Software</option><option>Serviço</option><option>Taxa</option></select>
          <select class="select" style="width:auto"><option>Linha: Todas</option><option>VM+Grua</option><option>Food</option><option>Lavanderia</option></select>
        </div>
        <div class="col g4" id="catalog-modal-list">
          ${window.__data.CATALOG.map(c=>`
            <div class="cat-item" data-name="${c.name.toLowerCase()} ${c.sku.toLowerCase()}" onclick="addItem('${c.sku}')">
              <div class="thumb">${ICN(c.icon,17)}</div>
              <div class="info">
                <div class="name">${c.name} ${c.recurring?'<span class="bdg bdg-y" style="margin-left:6px">'+ICN("repeat",10)+'Recorrente</span>':''}${c.popular?'<span class="bdg bdg-y-strong" style="margin-left:4px">Popular</span>':''}</div>
                <div class="desc">${c.sku} · ${c.desc}</div>
              </div>
              <div style="text-align:right">
                <div class="price">${c.displayPrice||fmt.brl2(c.price)}</div>
                <div class="sm mut" style="font-size:10.5px">${c.recurring?'/mês':'un.'}</div>
              </div>
              <button class="btn btn-soft btn-sm">${ICN("plus",12)}Adicionar</button>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="modal-f">
        <button class="btn btn-ghost" onclick="closeM('m-catalog')">Fechar</button>
      </div>
    </div>
  </div>

  <!-- BUNDLE PICKER -->
  <div class="modal-overlay" id="m-bundle-pick">
    <div class="modal lg">
      <div class="modal-h">
        <div>
          <div class="modal-t">Aplicar Bundle</div>
          <div class="modal-sub">Substitui os produtos atuais</div>
        </div>
        <button class="modal-x" onclick="closeM('m-bundle-pick')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">
        <div class="grid-3">
          ${window.__data.BUNDLES.map(b=>{
            const total = b.items.reduce((s,i)=>{const sku=window.__data.CATALOG.find(c=>c.sku===i.sku);return s + (sku?.price||0)*i.qty;},0);
            return `
              <div onclick="applyBundle('${b.id}')" style="border:1px solid var(--border);border-radius:8px;padding:16px;cursor:pointer;background:var(--surface);transition:.15s var(--ease)" onmouseover="this.style.borderColor='var(--nayax-yellow)';this.style.background='var(--nayax-yellow-soft)'" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--surface)'">
                <div class="row between" style="margin-bottom:6px">
                  <div class="bold">${b.name}</div>
                  ${b.tag?`<span class="bdg bdg-y-strong">${b.tag}</span>`:""}
                </div>
                <div class="sm mut" style="margin-bottom:14px">${b.desc}</div>
                <div class="col g4" style="font-size:12px;margin-bottom:14px">
                  ${b.items.map(i=>{const sku=window.__data.CATALOG.find(c=>c.sku===i.sku);return `<div class="row between"><span class="mut">${sku?.name||i.sku}</span><span class="mono">×${i.qty}</span></div>`}).join("")}
                </div>
                <div style="font-family:var(--font-display);font-size:22px;font-weight:700;border-top:1px solid var(--border);padding-top:10px">${fmt.brl(total)}</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  </div>

  <!-- SEND TO SIGNATURE -->
  <div class="modal-overlay" id="m-send-signature">
    <div class="modal lg">
      <div class="modal-h">
        <div>
          <div class="modal-t">Enviar para Assinatura</div>
          <div class="modal-sub">Clicksign · 2 signatários · documento será criado e enviado</div>
        </div>
        <button class="modal-x" onclick="closeM('m-send-signature')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">
        <div class="alert alert-info" style="margin-bottom:14px">${ICN("info",14)}<div>Antes de enviar, o sistema vai validar: <strong>desconto dentro da alçada · todos os campos obrigatórios · dados do cliente HubSpot</strong>.</div></div>

        <div class="eyebrow" style="margin-bottom:8px">Documento</div>
        <div class="cs-doc-card" style="margin:0 0 18px;background:var(--surface-2);border-color:var(--border)">
          <div style="width:46px;height:46px;border-radius:8px;background:var(--nayax-yellow-soft);color:#7A5800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("file-text",24)}</div>
          <div style="flex:1">
            <div class="bold">Proposta UPGRADE0664 — Rede FastVend.pdf</div>
            <div class="sm mut">4 páginas · R$ 34.800 · contrato 24 meses</div>
          </div>
          <button class="btn btn-ghost btn-sm">${ICN("file-text",13)}Visualizar</button>
        </div>

        <div class="eyebrow" style="margin-bottom:8px">Signatários · ordem de assinatura</div>
        <div class="card no-pad" style="margin-bottom:18px">
          <div style="display:grid;grid-template-columns:30px 1.5fr 1fr 140px 30px;gap:12px;align-items:center;padding:14px;border-bottom:1px solid var(--border-soft)">
            <div style="width:24px;height:24px;border-radius:50%;background:#1B45DA;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">1</div>
            <div><div class="bold sm">Ricardo Marinho</div><div class="sm mut">Cliente · auto-preenchido HubSpot</div></div>
            <div class="sm">contato@fastvend.com.br</div>
            <div><span class="bdg bdg-blue">SMS + Email</span></div>
            <button class="btn btn-icon btn-xs btn-soft">${ICN("edit",11)}</button>
          </div>
          <div style="display:grid;grid-template-columns:30px 1.5fr 1fr 140px 30px;gap:12px;align-items:center;padding:14px">
            <div style="width:24px;height:24px;border-radius:50%;background:#1B45DA;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">2</div>
            <div><div class="bold sm">Felipe Oliveira</div><div class="sm mut">Nayax · responsável fixo</div></div>
            <div class="sm">felipeo@nayax.com</div>
            <div><span class="bdg bdg-grey">Email apenas</span></div>
            <button class="btn btn-icon btn-xs btn-soft">${ICN("edit",11)}</button>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:14px">
          <div class="field">
            <label>Mensagem para o cliente</label>
            <textarea class="textarea" style="min-height:90px">Olá Ricardo, segue a proposta para renovação da Rede FastVend. Estou à disposição para qualquer dúvida.

Guilherme Raksa · Nayax Brasil</textarea>
          </div>
          <div class="field">
            <label>Configurações</label>
            <div class="col g8" style="margin-top:6px">
              <label class="row g8" style="cursor:pointer"><input type="checkbox" checked> <span class="sm">Avançar HubSpot para Assinatura</span></label>
              <label class="row g8" style="cursor:pointer"><input type="checkbox" checked> <span class="sm">Lembrete automático em 2 dias</span></label>
              <label class="row g8" style="cursor:pointer"><input type="checkbox" checked> <span class="sm">Validade do link: 30 dias</span></label>
              <label class="row g8" style="cursor:pointer"><input type="checkbox"> <span class="sm">Permitir comentários no documento</span></label>
            </div>
          </div>
        </div>

        <div class="alert alert-success">
          ${ICN("check-circle",14)}
          <div>Tudo certo. Desconto de 8% está na alçada automática · campos validados · cliente HubSpot vinculado.</div>
        </div>
      </div>
      <div class="modal-f">
        <button class="btn btn-ghost" onclick="closeM('m-send-signature')">Cancelar</button>
        <button class="btn btn-dark" onclick="openPdfPreview()">${ICN("file-text",13)}Pré-visualizar PDF</button>
        <button class="btn btn-primary" onclick="finalizSend()">${ICN("send",13)}Enviar para Clicksign</button>
      </div>
    </div>
  </div>

  <!-- CLICKSIGN CONFIG -->
  <div class="modal-overlay" id="m-clicksign-cfg">
    <div class="modal lg">
      <div class="modal-h">
        <div>
          <div class="modal-t">Configurar Clicksign</div>
          <div class="modal-sub">Assinatura eletrônica · ICP-Brasil + Lei 14.063/20</div>
        </div>
        <button class="modal-x" onclick="closeM('m-clicksign-cfg')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">
        <div class="eyebrow" style="margin-bottom:10px">Credenciais</div>
        <div class="grid-2" style="margin-bottom:14px">
          <div class="field"><label>API Key<span class="req">*</span></label><input class="input" type="password" value="●●●●●●●●●●●●●●●●●●●●●●●●●●●●"><div class="hint">Painel Clicksign → Configurações → Integrações</div></div>
          <div class="field"><label>Ambiente</label><select class="select"><option>Produção (app.clicksign.com)</option><option>Sandbox</option></select></div>
        </div>

        <div class="eyebrow" style="margin:14px 0 10px">Signatários padrão</div>
        <div class="grid-2" style="margin-bottom:14px">
          <div class="field"><label>Responsável Nayax</label><input class="input" value="Felipe Oliveira"></div>
          <div class="field"><label>E-mail</label><input class="input" value="felipeo@nayax.com"></div>
        </div>
        <div class="alert alert-info" style="margin-bottom:14px">${ICN("info",14)}<div>Cliente é preenchido <strong>automaticamente</strong> a partir do deal HubSpot (campo <code>email_principal</code>).</div></div>

        <div class="eyebrow" style="margin:14px 0 10px">Webhook</div>
        <div class="field" style="margin-bottom:14px">
          <label>URL de retorno</label>
          <input class="input mono" value="https://dchefybncekuiqxppfkv.supabase.co/functions/v1/clicksign-webhook" readonly style="font-size:11.5px;color:var(--fg-3)">
          <div class="hint">Eventos: <code class="mono">document.signed</code> <code class="mono">document.canceled</code> <code class="mono">document.refused</code></div>
        </div>

        <div class="eyebrow" style="margin:14px 0 10px">Ações automáticas após assinatura</div>
        <div class="col g6">
          ${[
            "Avançar deal HubSpot para Ganho",
            "Atualizar campo valor_total_de_ps no deal",
            "Contabilizar na meta mensal do consultor",
            "Criar nota no HubSpot com link do documento assinado",
            "Enviar e-mail de confirmação ao consultor"
          ].map((t,i)=>`<label class="row g8" style="cursor:pointer;padding:10px;background:var(--surface-2);border-radius:6px">
            <input type="checkbox" ${i<4?'checked':''}> <span class="sm">${t}</span>
          </label>`).join("")}
        </div>
      </div>
      <div class="modal-f">
        <button class="btn btn-ghost" onclick="closeM('m-clicksign-cfg')">Cancelar</button>
        <button class="btn btn-dark">${ICN("zap",13)}Testar Conexão</button>
        <button class="btn btn-primary" onclick="closeM('m-clicksign-cfg')">Salvar e Ativar</button>
      </div>
    </div>
  </div>

  <!-- DEAL DETAIL -->
  <div class="modal-overlay" id="m-deal-detail">
    <div class="modal xl">
      <div class="modal-h">
        <div>
          <div class="row g10" style="align-items:center">
            <div class="modal-t">Rede FastVend</div>
            <span class="bdg bdg-dark bdg-mono" style="height:24px;font-size:12.5px">UPGRADE0664</span>
            <span class="bdg bdg-amber">Negociação</span>
          </div>
          <div class="modal-sub">CNPJ 22.114.889/0001-43 · Pipeline VM-Vendas da Base · Guilherme Raksa</div>
        </div>
        <button class="modal-x" onclick="closeM('m-deal-detail')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">
        <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:20px">
          <div>
            <div class="grid-3" style="margin-bottom:18px">
              <div><div class="eyebrow">Valor</div><div style="font-family:var(--font-display);font-size:24px;font-weight:700">R$ 34.800</div></div>
              <div><div class="eyebrow">Probabilidade</div><div class="row g8" style="margin-top:6px;align-items:center"><div style="flex:1;height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden"><div style="height:100%;width:75%;background:var(--nayax-yellow)"></div></div><span class="bold">75%</span></div></div>
              <div><div class="eyebrow">Esperado para</div><div class="bold" style="margin-top:4px">12/05/2025</div></div>
            </div>

            <div class="eyebrow" style="margin-bottom:10px">Histórico</div>
            <div class="timeline" style="margin-bottom:14px">
              <div class="tl-item now"><div class="tl-h"><span class="sm bold">Em aprovação · Diretor</span></div><div class="tl-time">há 2h</div></div>
              <div class="tl-item"><div class="tl-h"><span class="sm">Submetido para aprovação</span></div><div class="tl-time">Guilherme Raksa · há 3h</div></div>
              <div class="tl-item"><div class="tl-h"><span class="sm">Bundle Pro Fleet aplicado</span></div><div class="tl-time">há 5h</div></div>
              <div class="tl-item"><div class="tl-h"><span class="sm">Rascunho criado</span></div><div class="tl-time">ontem 14:32</div></div>
            </div>
          </div>
          <div>
            <div class="card" style="margin-bottom:12px">
              <div class="card-h"><div class="ctitle">${ICN("user",14)} Contato Principal</div></div>
              <div class="card-body">
                <div class="user-cell" style="margin-bottom:12px">
                  <div class="av lg av-green">RM</div>
                  <div class="meta"><div class="name bold">Ricardo Marinho</div><div class="role">Diretor de Operações</div></div>
                </div>
                <div class="col g4" style="font-size:12px;color:var(--fg-3)">
                  <div>📧 contato@fastvend.com.br</div>
                  <div>📞 (11) 3499-2847</div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-h"><div class="ctitle">${ICN("history",14)} Engajamento</div></div>
              <div class="card-body">
                <div class="col g6" style="font-size:12px">
                  <div class="row between"><span class="mut">Última atividade</span><span class="bold">há 1 dia</span></div>
                  <div class="row between"><span class="mut">E-mails trocados</span><span class="bold">14</span></div>
                  <div class="row between"><span class="mut">Reuniões</span><span class="bold">3</span></div>
                  <div class="row between"><span class="mut">Score</span><span class="bdg bdg-green">Alto</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-f">
        <button class="btn btn-ghost" onclick="closeM('m-deal-detail')">Fechar</button>
        <button class="btn btn-primary" onclick="closeM('m-deal-detail');nav('builder')">${ICN("edit",13)}Abrir Orçamento</button>
      </div>
    </div>
  </div>

  <!-- HUBSPOT MIGRATE -->
  <div class="modal-overlay" id="m-hubspot-migrate">
    <div class="modal lg">
      <div class="modal-h">
        <div>
          <div class="row g10" style="align-items:center">
            <div style="width:32px;height:32px;border-radius:7px;background:#FF7A59;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px">HS</div>
            <div>
              <div class="modal-t">Migrar Negócios do HubSpot</div>
              <div class="modal-sub">Importar deals dos pipelines configurados · sincroniza valores, contatos e estágios</div>
            </div>
          </div>
        </div>
        <button class="modal-x" onclick="closeM('m-hubspot-migrate')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">
        <div class="alert alert-success" style="margin-bottom:14px">
          ${ICN("check-circle",14)}
          <div>
            <div class="bold sm">Última sincronização: hoje às 09:00</div>
            <div class="sm" style="margin-top:1px">47 deals importados · 0 erros · 3 atualizados desde então</div>
          </div>
        </div>

        <div class="eyebrow" style="margin-bottom:10px">Selecionar pipelines</div>
        <div class="col g8" style="margin-bottom:18px">
          <label style="display:flex;align-items:center;gap:12px;padding:13px 16px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer">
            <input type="checkbox" checked>
            <div style="flex:1">
              <div class="bold sm">VM-Vendas <span class="mono mut" style="font-size:11px;margin-left:6px">822543360</span></div>
              <div class="sm mut">Pipeline principal · 6 etapas · 32 deals em aberto</div>
            </div>
            <span class="bdg bdg-green">${ICN("check",10)}Ativo</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;padding:13px 16px;border:1px solid var(--border);border-radius:8px;background:var(--surface);cursor:pointer">
            <input type="checkbox" checked>
            <div style="flex:1">
              <div class="bold sm">VM-Vendas da Base <span class="mono mut" style="font-size:11px;margin-left:6px">836863041</span></div>
              <div class="sm mut">Base ativa · 6 etapas · 15 deals em aberto</div>
            </div>
            <span class="bdg bdg-green">${ICN("check",10)}Ativo</span>
          </label>
        </div>

        <div class="eyebrow" style="margin-bottom:10px">Filtros de importação</div>
        <div class="grid-3" style="margin-bottom:18px">
          <div class="field"><label>Etapas</label><select class="select"><option>Todas (exceto Perdido)</option><option>Apenas em aberto</option><option>Ganhos do mês</option></select></div>
          <div class="field"><label>Período (created)</label><select class="select"><option>Últimos 90 dias</option><option>Últimos 30 dias</option><option>Mês atual</option><option>Todo o histórico</option></select></div>
          <div class="field"><label>Owner</label><select class="select"><option>Todos consultores</option><option>Apenas meu</option><option>Meu time</option></select></div>
        </div>

        <div class="alert alert-info" style="margin-bottom:0">
          ${ICN("info",14)}
          <div>Estimativa: <strong>47 deals</strong> serão sincronizados (32 + 15). Tempo aproximado: <strong>20 segundos</strong>.</div>
        </div>
      </div>
      <div class="modal-f">
        <button class="btn btn-ghost" onclick="closeM('m-hubspot-migrate')">Cancelar</button>
        <button class="btn btn-primary" onclick="hubspotSync(this)">${ICN("refresh",13)}Iniciar Sincronização</button>
      </div>
    </div>
  </div>

  <!-- NEW USER -->
  ${newUserModalHTML()}

  `;
}

function newUserModalHTML(){
  return `
  <div class="modal-overlay" id="m-new-user">
    <div class="modal lg">
      <div class="modal-h">
        <div>
          <div class="modal-t">Novo Usuário</div>
          <div class="modal-sub">Adicionar membro ao DealNayax · define perfil, líder e visualização</div>
        </div>
        <button class="modal-x" onclick="closeM('m-new-user')">${ICN("x",18)}</button>
      </div>
      <div class="modal-b">

        <!-- Step indicator -->
        <div class="steps" style="margin-bottom:18px">
          <div class="step on"><div class="step-i">1</div><div>Identificação</div></div>
          <div class="step"><div class="step-i">2</div><div>Perfil &amp; Hierarquia</div></div>
          <div class="step"><div class="step-i">3</div><div>Visualização</div></div>
          <div class="step"><div class="step-i">4</div><div>Convite</div></div>
        </div>

        <!-- 1. Identificação -->
        <div class="eyebrow" style="margin-bottom:10px">1 · Identificação</div>
        <div class="grid-2" style="margin-bottom:14px">
          <div class="field"><label>Nome completo<span class="req">*</span></label><input class="input" placeholder="Ex: Carlos Ferreira"></div>
          <div class="field"><label>E-mail corporativo<span class="req">*</span></label><input class="input" placeholder="nome@nayax.com"></div>
        </div>
        <div class="grid-3" style="margin-bottom:18px">
          <div class="field"><label>Telefone</label><input class="input" placeholder="+55 11 9 9999-9999"></div>
          <div class="field"><label>Cargo</label><input class="input" placeholder="Ex: Consultor Comercial"></div>
          <div class="field"><label>HubSpot Owner ID</label><input class="input mono" placeholder="8557XXXX"><div class="hint">Necessário para sync</div></div>
        </div>

        <!-- 2. Perfil & hierarquia -->
        <div class="eyebrow" style="margin-bottom:10px">2 · Perfil &amp; Hierarquia</div>
        <div class="field" style="margin-bottom:14px">
          <label>Perfil de acesso<span class="req">*</span></label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px">
            ${profileCardHTML("Consultor","Cria e edita orçamentos próprios · alçada automática até 5%","user","blue",true)}
            ${profileCardHTML("Coordenador","Aprova até 12% · gere consultores · vê todo o time","user-check","amber",false)}
            ${profileCardHTML("Diretor","Aprova até 25% · acesso total a todos os times","shield","green",false)}
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:14px">
          <div class="field">
            <label>Equipe<span class="req">*</span></label>
            <select class="select">
              <option>Selecione…</option>
              <option>VM + Grua</option>
              <option>MM + Lavanderia</option>
              <option>Food</option>
              <option>Key Account</option>
            </select>
          </div>
          <div class="field">
            <label>Líder direto<span class="req">*</span></label>
            <select class="select" id="new-user-leader">
              <option value="">Selecione o líder…</option>
              <option>Felipe Oliveira · Super Admin · Diretor Comercial</option>
              <option selected>Daiane Soares · Coordenador · VM+Grua, MM+Lav</option>
              <option>Vinícius Dias · Coordenador · KA</option>
              <option>Guilherme Raksa · Coordenador · Food</option>
              <option>— Sem líder (reporta direto ao Diretor)</option>
            </select>
            <div class="hint">Aprovações de desconto sobem por essa hierarquia</div>
          </div>
        </div>

        <div class="alert alert-info" style="margin-bottom:18px">
          ${ICN("info",14)}
          <div class="sm">Líder atual da equipe selecionada: <strong>Daiane Soares</strong> · 4 consultores subordinados · aprova até 12% de desconto.</div>
        </div>

        <!-- 3. Modelo de Visualização -->
        <div class="eyebrow" style="margin-bottom:10px">3 · Modelo de Visualização</div>
        <div class="field" style="margin-bottom:14px">
          <label>O que este usuário pode visualizar?</label>
          <div class="col g8" style="margin-top:6px">
            ${viewModelHTML("Apenas o próprio","Vê somente seus orçamentos, negócios e clientes","user",true)}
            ${viewModelHTML("Time da mesma equipe","Vê tudo da sua equipe + os próprios","users",false)}
            ${viewModelHTML("Subordinados (apenas líderes)","Vê tudo dos consultores abaixo na hierarquia + os próprios","git",false)}
            ${viewModelHTML("Toda a operação","Acesso total a todos os times e pipelines · indicado para diretores","globe",false)}
          </div>
        </div>

        <div class="field" style="margin-bottom:14px">
          <label>Pipelines com acesso</label>
          <div class="chips">
            <span class="chip on" onclick="this.classList.toggle('on')">822543360 · VM-Vendas</span>
            <span class="chip" onclick="this.classList.toggle('on')">836863041 · VM-Vendas da Base</span>
            <span class="chip" onclick="this.classList.toggle('on')">${ICN("plus",10)}Todos os pipelines</span>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:18px">
          <div class="field">
            <label>Alçada de desconto</label>
            <select class="select">
              <option selected>Automática (até 5%)</option>
              <option>Coordenador (até 12%)</option>
              <option>Diretor (até 25%)</option>
              <option>Sem alçada própria (sempre escala)</option>
            </select>
          </div>
          <div class="field">
            <label>Pode aprovar descontos de outros?</label>
            <div class="chips" style="margin-top:6px">
              <span class="chip on" onclick="chipSel(this)">Não</span>
              <span class="chip" onclick="chipSel(this)">Sim · apenas do seu time</span>
              <span class="chip" onclick="chipSel(this)">Sim · de qualquer um</span>
            </div>
          </div>
        </div>

        <!-- 4. Convite -->
        <div class="eyebrow" style="margin-bottom:10px">4 · Envio do convite</div>
        <div class="col g8" style="margin-bottom:0">
          <label class="row g10" style="cursor:pointer;padding:11px 14px;background:var(--surface-2);border-radius:7px"><input type="checkbox" checked> <div><div class="bold sm">Enviar convite por e-mail</div><div class="sm mut" style="font-size:11px">Usuário recebe link para definir senha · expira em 7 dias</div></div></label>
          <label class="row g10" style="cursor:pointer;padding:11px 14px;background:var(--surface-2);border-radius:7px"><input type="checkbox" checked> <div><div class="bold sm">Notificar o líder direto</div><div class="sm mut" style="font-size:11px">Daiane Soares recebe e-mail informando o novo subordinado</div></div></label>
          <label class="row g10" style="cursor:pointer;padding:11px 14px;background:var(--surface-2);border-radius:7px"><input type="checkbox"> <div><div class="bold sm">Forçar configuração de 2FA no primeiro acesso</div><div class="sm mut" style="font-size:11px">Recomendado para perfis Diretor e Coordenador</div></div></label>
        </div>
      </div>
      <div class="modal-f">
        <button class="btn btn-ghost" onclick="closeM('m-new-user')">Cancelar</button>
        <button class="btn btn-soft">Salvar como rascunho</button>
        <button class="btn btn-primary" onclick="createUser()">${ICN("check",13)}Criar Usuário &amp; Enviar Convite</button>
      </div>
    </div>
  </div>
  `;
}

function profileCardHTML(name, desc, icon, color, selected){
  const palette = {
    blue: {bg:"#EFF6FF", fg:"#1D4ED8"},
    amber: {bg:"#FEF3C7", fg:"#92400E"},
    green: {bg:"#DCFCE7", fg:"#15803D"}
  }[color];
  return `
    <label onclick="document.querySelectorAll('#m-new-user .new-user-profile').forEach(c=>{c.style.borderColor='var(--border)';c.style.background='var(--surface)';c.style.boxShadow=''});this.style.borderColor='var(--nayax-yellow)';this.style.background='var(--nayax-yellow-soft)';this.style.boxShadow='var(--ring)'" class="new-user-profile" style="border:1px solid ${selected?'var(--nayax-yellow)':'var(--border)'};background:${selected?'var(--nayax-yellow-soft)':'var(--surface)'};border-radius:9px;padding:14px;cursor:pointer;${selected?'box-shadow:var(--ring)':''};display:flex;flex-direction:column;gap:6px">
      <div style="width:32px;height:32px;border-radius:7px;background:${palette.bg};color:${palette.fg};display:flex;align-items:center;justify-content:center">${ICN(icon,16)}</div>
      <div class="bold sm">${name}</div>
      <div class="sm mut" style="font-size:11.5px;line-height:1.45">${desc}</div>
    </label>
  `;
}

function viewModelHTML(name, desc, icon, selected){
  return `
    <label onclick="document.querySelectorAll('#m-new-user .new-user-viewmodel').forEach(c=>{c.style.borderColor='var(--border)';c.style.background='var(--surface)'});this.style.borderColor='var(--nayax-yellow)';this.style.background='var(--nayax-yellow-softest)'" class="new-user-viewmodel" style="display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid ${selected?'var(--nayax-yellow)':'var(--border)'};background:${selected?'var(--nayax-yellow-softest)':'var(--surface)'};border-radius:8px;cursor:pointer">
      <input type="radio" name="view-model" ${selected?'checked':''} style="margin:0">
      <div style="width:30px;height:30px;border-radius:7px;background:var(--surface-3);color:var(--fg-3);display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN(icon,15)}</div>
      <div style="flex:1">
        <div class="bold sm">${name}</div>
        <div class="sm mut" style="font-size:11.5px">${desc}</div>
      </div>
    </label>
  `;
}

function createUser(){
  closeM("m-new-user");
  alert("✓ Usuário criado!\n\nConvite enviado para o e-mail informado.\nDaiane Soares (líder) foi notificada.\n\nO novo usuário aparecerá em Configurações → Usuários assim que aceitar o convite.");
}

function openEditUser(email){
  const u = (window.__data.USERS || []).find(x=>x.email===email) || {name:"Usuário", email:email, role:"Consultor", team:"VM+Grua", pipelines:"822543360", avatar:"NN", ownerId:"00000000"};
  const initials = (u.avatar || u.name.split(" ").map(p=>p[0]).join("").slice(0,2)).toUpperCase();
  const html = `
    <div class="modal-overlay open" id="m-edit-user">
      <div class="modal lg">
        <div class="modal-h">
          <div class="row g12" style="align-items:center">
            <div class="av av-${avColor(initials)}" style="width:42px;height:42px;font-size:14px">${initials}</div>
            <div>
              <div class="modal-t">Editar Usuário</div>
              <div class="modal-sub">${u.name} · ${u.email}</div>
            </div>
            <span class="bdg bdg-green" style="margin-left:8px">${ICN("check",10)}Ativo</span>
          </div>
          <button class="modal-x" onclick="document.getElementById('m-edit-user').remove()">${ICN("x",18)}</button>
        </div>
        <div class="modal-b">
          <div class="eyebrow" style="margin-bottom:10px">Identificação</div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Nome completo</label><input class="input" value="${u.name}"></div>
            <div class="field"><label>E-mail</label><input class="input" value="${u.email}" readonly style="background:var(--surface-2);color:var(--fg-3)"><div class="hint">Solicitar alteração ao Admin</div></div>
          </div>
          <div class="grid-3" style="margin-bottom:18px">
            <div class="field"><label>Telefone</label><input class="input" placeholder="+55 11 9 9999-9999"></div>
            <div class="field"><label>Cargo</label><input class="input" value="${u.role}"></div>
            <div class="field"><label>HubSpot Owner ID</label><input class="input mono" value="${u.ownerId||''}"></div>
          </div>

          <div class="eyebrow" style="margin-bottom:10px">Perfil &amp; Hierarquia</div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field">
              <label>Perfil de acesso</label>
              <select class="select">
                <option ${u.role==='Super Admin'?'selected':''}>Super Admin</option>
                <option ${u.role==='Diretor'?'selected':''}>Diretor</option>
                <option ${u.role==='Coordenador'?'selected':''}>Coordenador</option>
                <option ${u.role==='Consultor'?'selected':''}>Consultor</option>
              </select>
            </div>
            <div class="field">
              <label>Equipe</label>
              <select class="select">
                <option ${u.team==='VM+Grua'?'selected':''}>VM + Grua</option>
                <option ${u.team==='MM+Lav'?'selected':''}>MM + Lavanderia</option>
                <option ${u.team==='Food'?'selected':''}>Food</option>
                <option ${u.team==='KA'?'selected':''}>Key Account</option>
                <option ${u.team==='—'?'selected':''}>— (sem equipe)</option>
              </select>
            </div>
          </div>
          <div class="field" style="margin-bottom:18px">
            <label>Líder direto</label>
            <select class="select">
              <option>Felipe Oliveira · Super Admin</option>
              <option selected>Daiane Soares · Coordenador</option>
              <option>Vinícius Dias · Coordenador KA</option>
              <option>— Sem líder</option>
            </select>
          </div>

          <div class="eyebrow" style="margin-bottom:10px">Acesso</div>
          <div class="field" style="margin-bottom:14px">
            <label>Pipelines com acesso</label>
            <div class="chips">
              <span class="chip on" onclick="this.classList.toggle('on')">822543360 · VM-Vendas</span>
              <span class="chip ${(u.pipelines||'').includes('836863041')?'on':''}" onclick="this.classList.toggle('on')">836863041 · VM-Vendas da Base</span>
              <span class="chip" onclick="this.classList.toggle('on')">${ICN("plus",10)}Todos</span>
            </div>
          </div>
          <div class="grid-2" style="margin-bottom:18px">
            <div class="field">
              <label>Alçada de desconto</label>
              <select class="select">
                <option selected>Automática (até 5%)</option>
                <option>Coordenador (até 12%)</option>
                <option>Diretor (até 25%)</option>
              </select>
            </div>
            <div class="field">
              <label>Modelo de visualização</label>
              <select class="select">
                <option selected>Apenas o próprio</option>
                <option>Time da mesma equipe</option>
                <option>Subordinados (líderes)</option>
                <option>Toda a operação</option>
              </select>
            </div>
          </div>

          <div class="eyebrow" style="margin-bottom:10px">Ações administrativas</div>
          <div class="col g8" style="margin-bottom:0">
            <button class="btn btn-ghost btn-sm" style="justify-content:flex-start" onclick="alert('✓ E-mail enviado para ${u.email}')">${ICN("send",12)}Reenviar convite / link de senha</button>
            <button class="btn btn-ghost btn-sm" style="justify-content:flex-start" onclick="alert('✓ 2FA resetada. Usuário deverá reconfigurar no próximo login.')">${ICN("shield",12)}Resetar 2FA</button>
            <button class="btn btn-ghost btn-sm" style="justify-content:flex-start" onclick="if(confirm('Encerrar todas as sessões ativas de ${u.name}?')){alert('✓ Todas as sessões foram encerradas.')}">${ICN("log-out",12)}Encerrar todas as sessões</button>
            <div class="divider" style="margin:6px 0"></div>
            <button class="btn btn-soft btn-sm" style="justify-content:flex-start;color:var(--warning-fg)" onclick="if(confirm('Suspender ${u.name}? O usuário perderá acesso temporariamente.')){alert('✓ Usuário suspenso. Reative quando necessário.');document.getElementById('m-edit-user').remove()}">${ICN("pause",12)}Suspender usuário</button>
            <button class="btn btn-soft btn-sm" style="justify-content:flex-start;color:var(--danger-fg)" onclick="if(confirm('REMOVER ${u.name} permanentemente?\\n\\nTodos os orçamentos serão transferidos para o líder direto.')){alert('✓ Usuário removido. Histórico mantido na auditoria.');document.getElementById('m-edit-user').remove()}">${ICN("trash",12)}Remover usuário</button>
          </div>
        </div>
        <div class="modal-f">
          <button class="btn btn-ghost" onclick="document.getElementById('m-edit-user').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="alert('✓ Alterações salvas para ${u.name}');document.getElementById('m-edit-user').remove()">${ICN("check",13)}Salvar alterações</button>
        </div>
      </div>
    </div>
  `;
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstElementChild);
}

function hubspotSync(btn){
  btn.disabled = true;
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Sincronizando…`;
  setTimeout(()=>{
    closeM("m-hubspot-migrate");
    alert("✓ Sincronização concluída!\n\n47 deals importados\n3 atualizados\n0 erros\n\nTempo: 18 segundos");
    btn.disabled = false;
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Iniciar Sincronização`;
  }, 1500);
}

function filterCatalogModal(q){
  const ql = q.toLowerCase();
  document.querySelectorAll("#catalog-modal-list .cat-item").forEach(el=>{
    el.style.display = (!q || el.dataset.name.includes(ql)) ? "flex" : "none";
  });
}

function finalizSend(){
  closeM("m-send-signature");
  confetti({count:90});
  Toast.yellow("Enviado para Clicksign!", "UPGRADE0664 · 2 signatários notificados · documento cs_doc_xK9F2L", {duration:6000, action:{label:"Ver tela espelho", fn:"()=>{nav(\\'admin\\');setTimeout(()=>tab(\\'adm\\',\\'clicksign\\'),100)}"}});
  setTimeout(()=>{
    nav("admin");
    setTimeout(()=>tab("adm","clicksign"), 100);
  }, 1200);
}

// Init modals
document.addEventListener("DOMContentLoaded", renderModals);
