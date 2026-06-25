/* ================================================================
   DealNayax v6 — Builder (the main screen) + Quotes + Compare + Approvals
================================================================ */

// ========================== BUILDER ==========================
function renderBuilder(){
  const root = $("pg-builder");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb">
            <a href="#" onclick="nav('deals')">Negócios</a>${ICN("chevron-right",12)}
            <a href="#" onclick="nav('quotes')">Orçamentos</a>${ICN("chevron-right",12)}
            <span class="cur">Novo Orçamento</span>
          </div>
          <div class="row g12" style="margin-top:4px;align-items:center">
            <div class="ph-t" data-i18n="b_title">Novo Orçamento</div>
            <span class="bdg bdg-dark bdg-mono" id="b-num" style="height:24px;font-size:12.5px">NOVO0493</span>
            <span class="bdg bdg-grey"><span class="dot" style="background:var(--success);margin-right:4px"></span><span id="b-autosave">Salvo há 2s</span></span>
          </div>
          <div class="ph-s">Negócio · <span class="bold" id="b-customer-label">Supermercado Alvorada</span> · Karolay Correia</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("history",13)}Histórico</button>
          <button class="btn btn-ghost" onclick="openPdfPreview()">${ICN("file-text",13)}Pré-visualizar</button>
          <button class="btn btn-ghost" onclick="openPdfPreview()">${ICN("download",13)}Baixar PDF</button>
          <button class="btn btn-primary" onclick="openM('m-send-signature')">${ICN("send",13)}Enviar para Assinatura</button>
        </div>
      </div>

      <!-- Steps -->
      <div class="steps">
        <div class="step done"><div class="step-i">${ICN("check",11)}</div><div data-i18n="b_step1">Tipo & Cliente</div></div>
        <div class="step on"><div class="step-i">2</div><div data-i18n="b_step2">Produtos & Bundles</div></div>
        <div class="step"><div class="step-i">3</div><div data-i18n="b_step3">Pricing & Descontos</div></div>
        <div class="step"><div class="step-i">4</div><div data-i18n="b_step4">Pagamento</div></div>
        <div class="step"><div class="step-i">5</div><div data-i18n="b_step5">Revisão & Envio</div></div>
      </div>

      <div class="builder">
        <!-- LEFT: main builder -->
        <div class="builder-main">
          ${typeof smartSuggestions === 'function' ? smartSuggestions() : ''}
          ${builderTypeCard()}
          ${builderClient()}
          ${builderProducts()}
          ${builderBundles()}
          ${builderDelivery()}
          ${builderPayment()}
          ${builderTerms()}
        </div>

        <!-- RIGHT: sticky sidebar -->
        <div class="builder-side">
          ${builderSummary()}
          ${builderApprovalPath()}
          ${builderRulesApplied()}
          ${typeof versionHistoryWidget === 'function' ? versionHistoryWidget() : ''}
          ${builderActivity()}
        </div>
      </div>
    </div>
  `;
  recalcBuilder();
}

// === Step cards
function builderClient(){
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("user",14)} Dados do Cliente</div>
          <div class="csub">Pessoa Física ou Jurídica — sincronizado com HubSpot</div>
        </div>
        <div class="pill-tabs" style="background:var(--surface-2);padding:3px;border:1px solid var(--border)">
          <button class="pill-tab on" id="clt-pf" onclick="setClientType('pf')">${ICN("user",12)} Pessoa Física</button>
          <button class="pill-tab" id="clt-pj" onclick="setClientType('pj')">${ICN("briefcase",12)} Pessoa Jurídica</button>
        </div>
      </div>
      <div class="card-body" style="padding-top:6px">

        <!-- PF form -->
        <div id="client-pf">
          <div class="eyebrow" style="margin-bottom:10px">Dados pessoais</div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Nome completo<span class="req">*</span></label><input class="input" value="Ricardo Marinho Souza"></div>
            <div class="field"><label>CPF<span class="req">*</span></label><input class="input" value="123.456.789-00"></div>
          </div>

          <div class="eyebrow" style="margin:14px 0 10px">Contato</div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>E-mail<span class="req">*</span></label><input class="input" value="ricardo.marinho@gmail.com"></div>
            <div class="field"><label>Telefone<span class="req">*</span></label><input class="input" value="+55 11 99240-7521"></div>
          </div>

          <div class="eyebrow" style="margin:14px 0 10px">Endereço</div>
          <div class="grid-3" style="margin-bottom:10px">
            <div class="field" style="grid-column:span 2"><label>Logradouro<span class="req">*</span></label><input class="input" value="Av. Brigadeiro Faria Lima, 2092 · Apto 803"></div>
            <div class="field"><label>CEP</label><input class="input" value="01451-905"></div>
          </div>
          <div class="grid-3">
            <div class="field"><label>Bairro</label><input class="input" value="Jardim Paulistano"></div>
            <div class="field"><label>Cidade</label><input class="input" value="São Paulo"></div>
            <div class="field"><label>UF</label><input class="input" value="SP"></div>
          </div>
        </div>

        <!-- PJ form -->
        <div id="client-pj" style="display:none">
          <div class="eyebrow" style="margin-bottom:10px">Dados da empresa</div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Razão Social<span class="req">*</span></label><input class="input" value="Supermercado Alvorada Ltda"></div>
            <div class="field"><label>Nome fantasia</label><input class="input" value="Sup. Alvorada"></div>
          </div>
          <div class="grid-3" style="margin-bottom:14px">
            <div class="field"><label>CNPJ<span class="req">*</span></label><input class="input" value="17.833.301/0016-85"></div>
            <div class="field"><label>Inscrição Estadual</label><input class="input" value="113.582.290.119"></div>
            <div class="field"><label>Inscrição Municipal</label><input class="input" value="isento"></div>
          </div>

          <div class="eyebrow" style="margin:14px 0 10px">Endereço da empresa</div>
          <div class="grid-3" style="margin-bottom:10px">
            <div class="field" style="grid-column:span 2"><label>Logradouro<span class="req">*</span></label><input class="input" value="Av. Brigadeiro Faria Lima, 2092 · Sala 318"></div>
            <div class="field"><label>CEP</label><input class="input" value="01451-905"></div>
          </div>
          <div class="grid-3" style="margin-bottom:14px">
            <div class="field"><label>Bairro</label><input class="input" value="Jardim Paulistano"></div>
            <div class="field"><label>Cidade</label><input class="input" value="São Paulo"></div>
            <div class="field"><label>UF</label><input class="input" value="SP"></div>
          </div>

          <div class="eyebrow" style="margin:18px 0 10px">Contato principal (responsável pela assinatura)</div>
          <div class="grid-2" style="margin-bottom:14px">
            <div class="field"><label>Nome do contato<span class="req">*</span></label><input class="input" value="Ricardo Marinho"></div>
            <div class="field"><label>Cargo</label><input class="input" value="Diretor de Operações"></div>
          </div>
          <div class="grid-3" style="margin-bottom:14px">
            <div class="field"><label>CPF do responsável</label><input class="input" value="123.456.789-00"></div>
            <div class="field"><label>E-mail<span class="req">*</span></label><input class="input" value="ricardo.marinho@supalvorada.com.br"></div>
            <div class="field"><label>Telefone<span class="req">*</span></label><input class="input" value="+55 11 99240-7521"></div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function setClientType(t){
  STATE.builder.clientType = t;
  document.getElementById("clt-pf").classList.toggle("on", t==="pf");
  document.getElementById("clt-pj").classList.toggle("on", t==="pj");
  document.getElementById("client-pf").style.display = t==="pf" ? "block" : "none";
  document.getElementById("client-pj").style.display = t==="pj" ? "block" : "none";
}

// === Delivery card
function builderDelivery(){
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("package",14)} Entrega</div>
          <div class="csub">Configure o envio dos equipamentos ao cliente</div>
        </div>
        <div class="pill-tabs" style="background:var(--surface-2);padding:3px;border:1px solid var(--border)">
          <button class="pill-tab" id="dlv-no" onclick="setDelivery(false)">Não entregar</button>
          <button class="pill-tab on" id="dlv-yes" onclick="setDelivery(true)">${ICN("check",12)} Entregar</button>
        </div>
      </div>
      <div class="card-body" id="delivery-fields" style="padding-top:6px">
        <div class="alert alert-info" style="margin-bottom:14px">
          ${ICN("info",14)}
          <div>O frete é calculado por região + peso dos equipamentos e adicionado ao subtotal de P&amp;S na proposta.</div>
        </div>

        <div class="row g8" style="margin-bottom:14px">
          <label class="row g6" style="cursor:pointer"><input type="checkbox" checked onchange="copyClientAddress(this.checked)"> <span class="sm">Usar mesmo endereço do cliente</span></label>
        </div>

        <div class="eyebrow" style="margin-bottom:10px">Endereço de entrega</div>
        <div class="grid-2" style="margin-bottom:14px">
          <div class="field"><label>Destinatário<span class="req">*</span></label><input class="input" value="Ricardo Marinho · Sup. Alvorada"></div>
          <div class="field"><label>Telefone de contato</label><input class="input" value="+55 11 99240-7521"></div>
        </div>
        <div class="grid-3" style="margin-bottom:10px">
          <div class="field" style="grid-column:span 2"><label>Logradouro<span class="req">*</span></label><input class="input" value="Av. Brigadeiro Faria Lima, 2092 · Sala 318"></div>
          <div class="field"><label>CEP<span class="req">*</span></label><input class="input" value="01451-905"></div>
        </div>
        <div class="grid-3" style="margin-bottom:14px">
          <div class="field"><label>Bairro</label><input class="input" value="Jardim Paulistano"></div>
          <div class="field"><label>Cidade</label><input class="input" value="São Paulo"></div>
          <div class="field"><label>UF</label><input class="input" value="SP"></div>
        </div>
        <div class="field" style="margin-bottom:14px">
          <label>Complemento / referência</label>
          <input class="input" placeholder="Próximo ao mercado X, portão azul...">
        </div>

        <div class="eyebrow" style="margin:14px 0 10px">Frete</div>
        <div class="grid-2">
          <div class="field">
            <label>Tipo de frete</label>
            <div class="pill-tabs" style="background:var(--surface-2);padding:3px;border:1px solid var(--border);width:100%">
              <button type="button" class="pill-tab on" id="frete-cif" onclick="setFreteTipo('cif')" style="flex:1">CIF · Nayax paga</button>
              <button type="button" class="pill-tab" id="frete-fob" onclick="setFreteTipo('fob')" style="flex:1">FOB · Cliente paga</button>
            </div>
            <div class="hint" id="frete-hint">CIF — frete já incluso no valor do equipamento</div>
          </div>
          <div class="field" id="frete-value-wrap" style="display:none">
            <label>Valor do frete (R$)</label>
            <input class="input" id="freight-value" value="180,00">
            <div class="hint">Cobrado junto na 1ª parcela P&amp;S</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setDelivery(yes){
  STATE.builder.delivery = yes;
  document.getElementById("dlv-yes").classList.toggle("on", yes);
  document.getElementById("dlv-no").classList.toggle("on", !yes);
  document.getElementById("delivery-fields").style.display = yes ? "block" : "none";
}
function copyClientAddress(use){
  const fields = document.querySelectorAll("#delivery-fields .field input");
  fields.forEach(f=>{ f.style.opacity = use ? ".7" : "1"; f.readOnly = use; });
}
function setFreteTipo(t){
  STATE.builder.freteTipo = t;
  document.getElementById("frete-cif").classList.toggle("on", t==="cif");
  document.getElementById("frete-fob").classList.toggle("on", t==="fob");
  document.getElementById("frete-value-wrap").style.display = t==="fob" ? "block" : "none";
  document.getElementById("frete-hint").textContent = t==="cif"
    ? "CIF — frete já incluso no valor do equipamento"
    : "FOB — cliente paga o frete, valor adicionado à proposta";
}

function builderTypeCard(){
  const types = [
    {code:"NOVO", name:"Novo Cliente", num:"NOVO0493", icon:"users", desc:"Primeira venda · sem histórico"},
    {code:"BASE", name:"Base", num:"BASE0582", icon:"user-check", desc:"Cliente ativo · novo deal"},
    {code:"DEM",  name:"Demo", num:"DEM0714", icon:"play", desc:"Período demonstrativo"},
    {code:"MIGR", name:"Migração", num:"MIGR0013", icon:"package", desc:"Vindo de concorrente"},
    {code:"FORM", name:"Formulário", num:"FORM0097", icon:"file-text", desc:"Site/lead form"},
    {code:"UPGRADE", name:"Upgrade", num:"UPGRADE0666", icon:"trend-up", desc:"Expansão de contrato"},
    {code:"RETCOM", name:"Retomada", num:"RETCOM0059", icon:"refresh", desc:"Cliente que saiu"}
  ];
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("tag",14)} Tipo de Proposta</div>
        <span class="sm mut">Define numeração e template do PDF</span>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px">
          ${types.map((t,i)=>`
            <div class="cat-item" style="flex-direction:column;text-align:center;padding:11px 6px;cursor:pointer;${i===0?'border-color:var(--nayax-yellow);background:var(--nayax-yellow-soft);box-shadow:var(--ring)':''}" onclick="selectType('${t.code}',this)">
              <div class="thumb" style="margin:0 auto 6px;${i===0?'background:var(--nayax-yellow);color:#262626':''}">${ICN(t.icon,15)}</div>
              <div class="bold sm">${t.name}</div>
              <div class="mono sm mut" style="font-size:10px">${t.num}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function selectType(code,target){
  document.querySelectorAll(".builder-main .cat-item").forEach(c=>{
    c.style.borderColor = "";
    c.style.background = "";
    c.style.boxShadow = "";
    const t = c.querySelector(".thumb");
    if(t){ t.style.background = ""; t.style.color = ""; }
  });
  target.style.borderColor = "var(--nayax-yellow)";
  target.style.background = "var(--nayax-yellow-soft)";
  target.style.boxShadow = "var(--ring)";
  const t = target.querySelector(".thumb");
  if(t){ t.style.background = "var(--nayax-yellow)"; t.style.color = "#262626"; }
  STATE.builder.type = code;
}

function builderProducts(){
  const items = STATE.builder.items.map(i=>{
    const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
    return {...sku,qty:i.qty,discount:i.discount};
  });
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("package",14)} Produtos no Orçamento</div>
          <div class="csub">Hardware · Software (recorrente) · Serviços · Taxas</div>
        </div>
        <div class="row g8">
          <button class="btn btn-soft btn-sm" onclick="openM('m-catalog')">${ICN("plus",12)}Adicionar SKU</button>
          <button class="btn btn-ghost btn-sm" onclick="openM('m-bundle-pick')">${ICN("layers",12)}Aplicar Bundle</button>
        </div>
      </div>
      <div id="b-products" class="card-body" style="padding:0">
        ${productHeader()}
        ${items.map((it,ix)=>productRow(it,ix)).join("")}
      </div>
    </div>
  `;
}

function productHeader(){
  return `
    <div class="sku-row" style="background:var(--surface-2);padding:8px 14px;font-size:10.5px;font-weight:600;color:var(--fg-4);letter-spacing:.4px;text-transform:uppercase">
      <div></div>
      <div>Produto / SKU</div>
      <div>Qtd.</div>
      <div>Unitário</div>
      <div>Desc.</div>
      <div>Categoria</div>
      <div style="text-align:right">Total</div>
      <div></div>
    </div>
  `;
}

function productRow(it, ix){
  const total = (it.qty * it.price * (1 - (it.discount||0)/100));
  const catBdg = {hardware:"bdg-blue", software:"bdg-purple", service:"bdg-grey", fee:"bdg-amber"}[it.category];
  const catLbl = {hardware:"Hardware", software:"Software", service:"Serviço", fee:"Taxa"}[it.category];
  const recur = it.recurring ? `<span class="bdg bdg-y" style="margin-left:4px">${ICN("repeat",10)}Recorrente</span>` : "";
  return `
    <div class="sku-row">
      <div class="drag">${ICN("drag",13)}</div>
      <div class="info">
        <div class="name">${it.name}${recur}</div>
        <div class="meta">${it.sku} · ${it.desc}</div>
      </div>
      <div>
        <div class="qty-ctl">
          <button onclick="changeQty(${ix},-1)">−</button>
          <input value="${it.qty}" onchange="setQty(${ix},this.value)" onfocus="this.select()">
          <button onclick="changeQty(${ix},1)">+</button>
        </div>
      </div>
      <div class="price">${it.displayPrice||fmt.brl2(it.price)}</div>
      <div>
        <div class="disc">
          <input value="${it.discount||0}" onchange="setDiscount(${ix},this.value)" onfocus="this.select()">
          <span class="pct">%</span>
        </div>
      </div>
      <div><span class="bdg ${catBdg}">${catLbl}</span></div>
      <div class="total" style="text-align:right">${fmt.brl(total)}</div>
      <div><button class="btn btn-icon btn-xs btn-soft" onclick="removeItem(${ix})">${ICN("trash",12)}</button></div>
    </div>
  `;
}

function changeQty(ix, delta){
  STATE.builder.items[ix].qty = Math.max(0, (STATE.builder.items[ix].qty||0) + delta);
  refreshProducts();
}
function setQty(ix, v){
  STATE.builder.items[ix].qty = Math.max(0, parseInt(v)||0);
  refreshProducts();
}
function setDiscount(ix, v){
  STATE.builder.items[ix].discount = Math.max(0,Math.min(100, parseFloat(v)||0));
  refreshProducts();
}
function removeItem(ix){
  STATE.builder.items.splice(ix,1);
  refreshProducts();
}
function addItem(sku){
  if(STATE.builder.items.find(i=>i.sku===sku)) return;
  STATE.builder.items.push({sku, qty:1, discount:0});
  refreshProducts();
  closeM("m-catalog");
}
function applyBundle(id){
  const b = window.__data.BUNDLES.find(x=>x.id===id);
  if(!b) return;
  STATE.builder.items = b.items.map(i=>({...i, discount:0}));
  STATE.builder.bundleApplied = id;
  refreshProducts();
  closeM("m-bundle-pick");
}

function refreshProducts(){
  const node = $("b-products");
  if(!node) return;
  const items = STATE.builder.items.map(i=>{
    const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
    return {...sku,qty:i.qty,discount:i.discount};
  });
  node.innerHTML = productHeader() + items.map((it,ix)=>productRow(it,ix)).join("");
  recalcBuilder();
}

function builderBundles(){
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("layers",14)} Bundles Sugeridos</div>
          <div class="csub">Pré-configurações otimizadas por perfil de cliente</div>
        </div>
        <button class="btn btn-link btn-sm">Ver todos ${ICN("arrow-right",11)}</button>
      </div>
      <div class="card-body" style="padding-top:0">
        <div class="grid-3">
          ${window.__data.BUNDLES.map(b=>{
            const total = b.items.reduce((s,i)=>{
              const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
              return s + (sku?.price||0) * i.qty;
            },0);
            return `
              <div class="card" style="background:var(--surface-2);border-radius:8px">
                <div style="padding:14px">
                  <div class="row between" style="margin-bottom:6px">
                    <div class="bold">${b.name}</div>
                    ${b.tag?`<span class="bdg bdg-y-strong">${b.tag}</span>`:""}
                  </div>
                  <div class="sm mut" style="margin-bottom:10px">${b.desc}</div>
                  <div class="col g4" style="margin-bottom:10px;font-size:11.5px">
                    ${b.items.map(i=>{
                      const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
                      return `<div class="row between"><span class="mut">${sku?.name||i.sku}</span><span class="mono">×${i.qty}</span></div>`;
                    }).join("")}
                  </div>
                  <div class="row between" style="border-top:1px solid var(--border);padding-top:10px">
                    <div>
                      <div class="sm mut">A partir de</div>
                      <div style="font-family:var(--font-display);font-size:20px;font-weight:700">${fmt.brl(total)}</div>
                    </div>
                    <button class="btn btn-dark btn-sm" onclick="applyBundle('${b.id}')">Aplicar</button>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function builderPricing(){
  return `
    <div class="card">
      <div class="card-h">
        <div>
          <div class="ctitle">${ICN("percent",14)} Pricing & Desconto Global</div>
          <div class="csub">Regras automáticas + ajuste manual</div>
        </div>
        <a class="btn btn-link btn-sm" onclick="nav('pricing')">Configurar regras ${ICN("external",11)}</a>
      </div>
      <div class="card-body">
        <div class="grid-3" style="margin-bottom:14px">
          <div class="field">
            <label>Desconto Global (manual)</label>
            <div class="field-row">
              <input class="input" type="number" id="b-disc" value="0" min="0" max="40" onchange="setGlobalDiscount(this.value)">
              <span class="sm bold">%</span>
            </div>
            <div class="hint">Aplicado por cima dos descontos por SKU</div>
          </div>
          <div class="field">
            <label>Cupom / Código promocional</label>
            <input class="input" placeholder="Ex: NAYAX10">
            <div class="hint">Opcional · valida ao Aplicar</div>
          </div>
          <div class="field">
            <label>Reajuste anual</label>
            <select class="select"><option>IPCA + 2% (padrão)</option><option>IGP-M</option><option>Sem reajuste (acordo)</option></select>
            <div class="hint">Para itens recorrentes</div>
          </div>
        </div>

        <div class="alert alert-info">
          ${ICN("info",14)}
          <div>
            <div class="bold">2 regras automáticas aplicadas</div>
            <div class="sm">PR-03 (Bundle Cloud+Hardware) · Instalação Padrão grátis · economia R$ 350</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function setGlobalDiscount(v){
  STATE.builder.manualDiscount = Math.max(0,Math.min(40,parseFloat(v)||0));
  recalcBuilder();
}

function builderPayment(){
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("credit-card",14)} Forma de Pagamento</div>
        <span class="sm mut">P&amp;S (one-time) + MRR (recorrente)</span>
      </div>
      <div class="card-body">

        <!-- P&S — One-time -->
        <div style="padding:14px 16px;background:var(--surface-2);border-radius:10px;margin-bottom:14px">
          <div class="row between" style="margin-bottom:12px">
            <div class="row g8" style="align-items:baseline">
              <span class="metric-tag ps">P&amp;S</span>
              <span style="font-size:13px;font-weight:600;color:var(--fg-2)">Produtos &amp; Serviços</span>
              <span class="sm mut">one-time</span>
            </div>
            <span class="sm bold" style="font-variant-numeric:tabular-nums" id="b-pay-ps-total">R$ 9.800,00</span>
          </div>
          <div class="grid-2">
            <div>
              <div class="eyebrow" style="margin-bottom:10px">Entrada</div>
              <div class="field" style="margin-bottom:10px">
                <label>Método</label>
                <div class="chips">
                  <span class="chip on" onclick="chipSel(this)">PIX</span>
                  <span class="chip" onclick="chipSel(this)">Boleto</span>
                  <span class="chip" onclick="chipSel(this)">Cartão</span>
                  <span class="chip" onclick="chipSel(this)">Sem entrada</span>
                </div>
              </div>
              <div class="grid-2">
                <div class="field"><label>% do total</label><input class="input" value="30"></div>
                <div class="field"><label>Data prevista</label><input class="input" type="date" value="2026-05-28"></div>
              </div>
            </div>
            <div>
              <div class="eyebrow" style="margin-bottom:10px">Parcelamento do restante</div>
              <div class="grid-2" style="margin-bottom:10px">
                <div class="field"><label>Nº parcelas</label>
                  <select class="select">
                    <option>À vista</option><option>2×</option><option>3×</option>
                    <option>4×</option><option selected>5×</option><option>6×</option>
                    <option>10×</option><option>12×</option>
                  </select>
                </div>
                <div class="field"><label>Dia vencimento</label>
                  <select class="select"><option>5</option><option selected>10</option><option>15</option><option>20</option><option>25</option></select>
                </div>
              </div>
              <div class="field">
                <label>Método</label>
                <div class="chips">
                  <span class="chip on" onclick="chipSel(this)">Boleto</span>
                  <span class="chip" onclick="chipSel(this)">PIX</span>
                  <span class="chip" onclick="chipSel(this)">Cartão recorrente</span>
                  <span class="chip" onclick="chipSel(this)">Débito automático</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MRR — Recurring -->
        <div style="padding:14px 16px;background:#EFF6FF;border:1px solid #DBEAFE;border-radius:10px">
          <div class="row between" style="margin-bottom:12px">
            <div class="row g8" style="align-items:baseline">
              <span class="metric-tag mrr">MRR</span>
              <span style="font-size:13px;font-weight:600;color:var(--fg-2)">Mensalidade Recorrente</span>
              <span class="sm mut">cobrança mensal contínua</span>
            </div>
            <span class="sm bold" style="font-variant-numeric:tabular-nums;color:#1D4ED8" id="b-pay-mrr-total">R$ 445,00 /mês</span>
          </div>
          <div class="grid-3">
            <div class="field">
              <label>Forma de pagamento</label>
              <div class="input" style="display:flex;align-items:center;gap:8px;background:var(--surface);font-weight:600">
                ${ICN("file-text",13)} Boleto
              </div>
              <div class="hint">MRR é cobrado exclusivamente via boleto bancário</div>
            </div>
            <div class="field">
              <label>Data de início da cobrança</label>
              <input class="input" type="date" value="2026-06-15">
              <div class="hint">Primeira fatura cai neste dia · próximas no mesmo dia do mês</div>
            </div>
            <div class="field">
              <label>Dia de vencimento mensal</label>
              <select class="select">
                <option>1</option><option>5</option><option>10</option>
                <option selected>15</option><option>20</option><option>25</option><option>Último dia útil</option>
              </select>
              <div class="hint">A partir da 2ª fatura</div>
            </div>
          </div>
          <div class="grid-3" style="margin-top:14px">
            <div class="field">
              <label>Período de fidelidade</label>
              <select class="select">
                <option>Sem fidelidade</option>
                <option>6 meses</option>
                <option selected>12 meses</option>
                <option>24 meses</option>
                <option>36 meses</option>
              </select>
            </div>
          </div>

          <div class="alert alert-info" style="margin-top:14px;margin-bottom:0">
            ${ICN("info",14)}
            <div>
              <div class="bold sm">Cronograma das próximas faturas</div>
              <div class="sm" style="margin-top:3px">15/jun · 15/jul · 15/ago · 15/set · 15/out · 15/nov · 15/dez · …</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function chipSel(el){
  const parent = el.closest(".chips");
  if(!parent) return;
  parent.querySelectorAll(".chip").forEach(c=>c.classList.remove("on"));
  el.classList.add("on");
}

function builderTerms(){
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("file-text",14)} Vigência e Termos</div>
      </div>
      <div class="card-body">
        <div class="grid-2" style="margin-bottom:14px">
          <div class="field"><label>Validade da proposta</label>
            <select class="select"><option>15 dias</option><option selected>30 dias</option><option>45 dias</option><option>60 dias</option></select>
          </div>
          <div class="field"><label>Vigência do contrato</label>
            <select class="select">
              <option selected>Prazo Indeterminado</option>
              <option>12 meses</option>
              <option>24 meses</option>
              <option>36 meses</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Observações para o PDF</label>
          <textarea class="textarea" placeholder="Notas adicionais que aparecerão no contrato…">Instalação prevista para a primeira quinzena de junho. Treinamento incluso para até 4 operadores em uma única sessão.</textarea>
        </div>
      </div>
    </div>
  `;
}

// === Sidebar
function builderSummary(){
  return `
    <div class="totals-box" id="b-totals">
      <div class="row between" style="margin-bottom:10px">
        <div class="eyebrow">Resumo</div>
        <span class="bdg bdg-grey mono" id="b-num-side" style="font-size:10.5px">NOVO0493</span>
      </div>
      <div id="b-totals-rows"></div>
      <div class="divider"></div>
      <div class="col g6">
        <div class="sm mut" style="display:flex;align-items:center;gap:4px">${ICN("repeat",11)} Recorrente mensal</div>
        <div id="b-mrr" style="font-family:var(--font-display);font-size:18px;font-weight:700"></div>
      </div>
    </div>
  `;
}

function approveQuote(num, company, value){
  // Big-deal celebration
  if(value >= 30000) confetti({count:120});
  Toast.success("Orçamento aprovado!", `${num} · ${company} · ${fmt.brl(value)} liberado para Clicksign`, {duration:5500});
  // Animate row removal
  event.currentTarget.closest("[style*='grid-template-columns']").style.animation = "toastOut .4s var(--ease) forwards";
  setTimeout(()=>{
    const row = event && event.currentTarget && event.currentTarget.closest("[style*='grid-template-columns']");
    if(row) row.remove();
  }, 400);
}
function rejectQuote(num){
  if(!confirm(`Recusar ${num}? Consultor deverá refazer o orçamento.`)) return;
  Toast.warn("Orçamento recusado", `${num} voltou para o consultor com sua justificativa`, {duration:4500});
}

function builderApprovalPath(){
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("shield",14)} Caminho de Aprovação</div>
      </div>
      <div class="card-body" id="b-approval"></div>
    </div>
  `;
}

function builderRulesApplied(){
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("zap",14)} Regras Aplicadas</div>
        <span class="bdg bdg-y" id="b-rules-cnt">2</span>
      </div>
      <div class="card-body">
        <div class="col g8" id="b-rules">
          <div class="row g8" style="padding:8px;background:var(--surface-2);border-radius:6px">
            <div style="width:22px;height:22px;border-radius:5px;background:var(--success-bg);color:var(--success-fg);display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("check",12)}</div>
            <div>
              <div class="sm bold">PR-03 · Bundle Cloud+HW</div>
              <div class="sm mut" style="font-size:11px">Instalação Padrão grátis</div>
            </div>
          </div>
          <div class="row g8" style="padding:8px;background:var(--surface-2);border-radius:6px;opacity:.6">
            <div style="width:22px;height:22px;border-radius:5px;background:var(--surface-3);color:var(--fg-4);display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN("clock",12)}</div>
            <div>
              <div class="sm bold">PR-01 · Volume VPOS</div>
              <div class="sm mut" style="font-size:11px">Faltam 15 unidades para -10%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function builderActivity(){
  return `
    <div class="card">
      <div class="card-h">
        <div class="ctitle">${ICN("history",14)} Histórico</div>
      </div>
      <div class="card-body">
        <div class="timeline">
          <div class="tl-item now">
            <div class="tl-h"><span class="sm bold">Em edição</span></div>
            <div class="tl-time">você · agora</div>
          </div>
          <div class="tl-item">
            <div class="tl-h"><span class="sm">Bundle aplicado</span></div>
            <div class="tl-time">há 4 min</div>
          </div>
          <div class="tl-item">
            <div class="tl-h"><span class="sm">Rascunho criado</span></div>
            <div class="tl-time">há 14 min</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function recalcBuilder(){
  const items = STATE.builder.items.map(i=>{
    const sku = window.__data.CATALOG.find(c=>c.sku===i.sku);
    return {...sku, qty:i.qty, discount:i.discount};
  });
  const oneTime = items.filter(i=>!i.recurring).reduce((s,i)=>s + (i.qty*i.price*(1-(i.discount||0)/100)), 0);
  const recurring = items.filter(i=>i.recurring && i.recurringType==="monthly").reduce((s,i)=>s + (i.qty*i.price*(1-(i.discount||0)/100)), 0);
  const subtotal = oneTime + recurring;
  const listPrice = items.reduce((s,i)=>s + i.qty*i.price, 0);
  const skuDiscount = listPrice - subtotal;
  const global = STATE.builder.manualDiscount || 0;
  const globalDiscount = subtotal * global / 100;
  const total = subtotal - globalDiscount;
  const effectiveDiscountPct = listPrice ? ((listPrice-total)/listPrice*100) : 0;

  // Update totals
  const rowsHTML = `
    <div class="totals-row"><span class="label">Hardware + Serviço</span><span class="value">${fmt.brl(oneTime)}</span></div>
    <div class="totals-row"><span class="label">Recorrente (mês 1)</span><span class="value">${fmt.brl(recurring)}</span></div>
    <div class="totals-row"><span class="label">Subtotal</span><span class="value">${fmt.brl(subtotal)}</span></div>
    ${skuDiscount>0?`<div class="totals-row discount"><span class="label">Desc. por SKU</span><span class="value">− ${fmt.brl(skuDiscount)}</span></div>`:""}
    ${globalDiscount>0?`<div class="totals-row discount"><span class="label">Desc. global ${global}%</span><span class="value">− ${fmt.brl(globalDiscount)}</span></div>`:""}
    <div class="totals-row total"><span class="label">Total</span><span class="value">${fmt.brl(total)}</span></div>
  `;
  const elt = $("b-totals-rows");
  if(elt) elt.innerHTML = rowsHTML;
  const mrr = $("b-mrr");
  if(mrr) mrr.textContent = fmt.brl(recurring) + "/mês";

  // Approval path
  renderApprovalPath(effectiveDiscountPct);
}

function renderApprovalPath(pct){
  const policy = window.__data.APPROVAL_POLICY;
  const cur = pct >= 25 ? 3 : pct >= 12 ? 2 : pct >= 5 ? 1 : 0;
  const el = $("b-approval");
  if(!el) return;
  // Visual: vertical flow with current highlighted
  el.innerHTML = `
    <div class="alert ${cur===0?'alert-success':cur===1?'alert-info':cur===2?'alert-warn':'alert-danger'}" style="margin-bottom:10px">
      ${ICN(cur===0?"check-circle":"shield",14)}
      <div>
        <div class="bold sm">${cur===0?'Aprovação automática':policy[cur].approver.split('·')[0].trim()}</div>
        <div class="sm">Desconto efetivo: <strong>${pct.toFixed(1)}%</strong> ${cur===0?'· libera direto':'· requer aprovação'}</div>
      </div>
    </div>
    <div class="col g6">
      ${policy.slice(0,4).map((p,i)=>{
        const state = i<cur?'done':(i===cur?'cur':'pending');
        const color = state==='cur'?'var(--nayax-yellow)':state==='done'?'var(--success)':'var(--border)';
        return `<div class="row g8" style="padding:7px 9px;background:${state==='cur'?'var(--nayax-yellow-soft)':state==='done'?'var(--success-bg)':'var(--surface-2)'};border-radius:6px;${state==='cur'?'box-shadow:'+'inset 0 0 0 1px '+color:''}">
          <div style="width:18px;height:18px;border-radius:50%;background:${state==='done'?'var(--success)':state==='cur'?'var(--nayax-yellow)':'var(--surface-3)'};color:${state==='done'?'#fff':'#262626'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">${state==='done'?'✓':i+1}</div>
          <div style="flex:1">
            <div class="sm bold" style="font-size:11.5px">${p.approver.split('·')[0].trim()}</div>
            <div class="sm mut" style="font-size:10.5px">${p.range}</div>
          </div>
        </div>`;
      }).join("")}
    </div>
  `;
}

// ========================== QUOTES ==========================
function renderQuotes(){
  const root = $("pg-quotes");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('dashboard')">Vendas</a>${ICN("chevron-right",12)}<span class="cur">Orçamentos</span></div>
          <div class="ph-t">Orçamentos</div>
          <div class="ph-s">Histórico de propostas · ${window.__data.QUOTES.length} registros</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("download",13)}Exportar CSV</button>
          <button class="btn btn-primary" onclick="nav('builder')">${ICN("plus",13)}Novo Orçamento</button>
        </div>
      </div>

      <!-- Saved filters -->
      ${typeof savedFilters === 'function' ? savedFilters() : ''}

      <!-- Quote status tabs -->
      <div class="tabs" data-tab-group="qstatus">
        <button class="tab on" data-tab="all" onclick="tab('qstatus','all',event)">Todos<span class="tab-c">${window.__data.QUOTES.length}</span></button>
        <button class="tab" data-tab="draft" onclick="tab('qstatus','draft',event)">Rascunhos<span class="tab-c">1</span></button>
        <button class="tab" data-tab="sent" onclick="tab('qstatus','sent',event)">Enviados<span class="tab-c">2</span></button>
        <button class="tab" data-tab="approve" onclick="tab('qstatus','approve',event)">Aprovação<span class="tab-c">2</span></button>
        <button class="tab" data-tab="won" onclick="tab('qstatus','won',event)">Ganhos<span class="tab-c">2</span></button>
        <button class="tab" data-tab="expired" onclick="tab('qstatus','expired',event)">Expirados<span class="tab-c">1</span></button>
      </div>

      <div class="card no-pad">
        <div class="tbl-toolbar">
          <div class="left">
            <div class="search-box" style="width:240px">
              ${ICN("search",14)}
              <input class="input" placeholder="Buscar por número, cliente…">
            </div>
            <select class="select sm" style="width:auto"><option>Tipo: Todos</option><option>NOVO</option><option>BASE</option><option>UPGRADE</option></select>
            <select class="select sm" style="width:auto"><option>Consultor: Todos</option></select>
            <select class="select sm" style="width:auto"><option>Período: Maio 2025</option></select>
          </div>
          <button class="btn btn-ghost btn-sm">${ICN("filter",13)} Mais filtros</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Número</th><th>Cliente</th><th>Tipo</th><th>Consultor</th><th>Valor</th><th>Desc.</th><th>Status</th><th>Data</th><th></th></tr></thead>
          <tbody>
            ${window.__data.QUOTES.map(q=>`
              <tr>
                <td><span class="bdg bdg-dark bdg-mono">${q.number}</span></td>
                <td class="strong">${q.company}</td>
                <td>${typeBdg(q.type)}</td>
                <td>${q.consultor}</td>
                <td class="strong num">${fmt.brl(q.value)}</td>
                <td>${q.discount===0?'<span class="bdg bdg-grey">0%</span>':q.discount>=12?`<span class="bdg bdg-red">${q.discount}%</span>`:`<span class="bdg bdg-y">${q.discount}%</span>`}</td>
                <td>${statusBdg(q.status)}</td>
                <td class="sm mut">${q.date}</td>
                <td>
                  <div class="row g4">
                    <button class="btn btn-ghost btn-xs">${ICN("file-text",11)}</button>
                    <button class="btn btn-ghost btn-xs">${ICN("more",11)}</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
function typeBdg(t){
  const map = {"Novo":"bdg-y","Base":"bdg-blue","Upgrade":"bdg-green","Migração":"bdg-purple","Formulário":"bdg-grey","Demonstração":"bdg-grey","Retomada":"bdg-amber"};
  return `<span class="bdg ${map[t]||'bdg-grey'}">${t}</span>`;
}
function statusBdg(s){
  const map = {"Rascunho":"bdg-grey","Enviado":"bdg-blue","Aprovação Pendente":"bdg-amber","Aprovado":"bdg-purple","Negociação":"bdg-y","Ganho":"bdg-green","Expirado":"bdg-red"};
  return `<span class="bdg ${map[s]||'bdg-grey'}">${s}</span>`;
}

// ========================== COMPARE ==========================
function renderCompare(){
  const root = $("pg-compare");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('quotes')">Orçamentos</a>${ICN("chevron-right",12)}<span class="cur">Comparativo</span></div>
          <div class="ph-t">Comparativo lado-a-lado</div>
          <div class="ph-s">Cliente · Rede FastVend · 3 cenários propostos</div>
        </div>
        <div class="ph-r">
          <button class="btn btn-ghost btn-sm">${ICN("plus",13)}Adicionar cenário</button>
          <button class="btn btn-dark btn-sm">${ICN("send",13)}Enviar comparativo ao cliente</button>
        </div>
      </div>

      <div class="alert alert-info" style="margin-bottom:14px">
        ${ICN("info",14)}
        <div>O cliente pode escolher um cenário direto pelo link compartilhado. <strong>O cenário escolhido vai automaticamente para Aprovação ou Assinatura.</strong></div>
      </div>

      <div class="compare-grid">
        <div class="ch"></div>
        <div class="ch">
          <div class="row between">
            <div>Plano Starter <span class="bdg bdg-grey" style="margin-left:6px">A</span></div>
            <button class="btn btn-ghost btn-xs">${ICN("edit",10)}</button>
          </div>
        </div>
        <div class="ch" style="background:var(--nayax-yellow-soft);color:#7A5800">
          <div class="row between">
            <div>Plano Pro Fleet <span class="bdg bdg-y-strong" style="margin-left:6px">RECOMENDADO</span></div>
            <button class="btn btn-ghost btn-xs">${ICN("edit",10)}</button>
          </div>
        </div>
        <div class="ch">
          <div class="row between">
            <div>Plano Enterprise <span class="bdg bdg-grey" style="margin-left:6px">C</span></div>
            <button class="btn btn-ghost btn-xs">${ICN("edit",10)}</button>
          </div>
        </div>

        ${cmpRow("Terminais VPOS Touch","10 unidades","30 unidades","80 unidades",1)}
        ${cmpRow("Nayax Cloud","Basic","Pro","Enterprise (SLA 24/7)",1)}
        ${cmpRow("Instalação","Padrão","Premium · incluso","Premium ×3 · incluso",1)}
        ${cmpRow("Treinamento","—","Frota completa","Frota +  refresh mensal",1)}
        ${cmpRow("Suporte","Email · horário comercial","8×5 + 24×7 emergência","24/7 dedicado · gestor de conta")}
        ${cmpRow("Hardware","R$ 18.900","R$ 56.700","R$ 151.200",1,2)}
        ${cmpRow("Software mensal","R$ 390","R$ 2.670","R$ 15.120/mês",1,2)}
        ${cmpRow("Implantação","R$ 350","R$ 0 · grátis","R$ 0 · grátis",1)}
        ${cmpRow("MDR Débito","2,19%","1,99% (-0,20pp)","1,79% (-0,40pp)",1)}
        ${cmpRow("Contrato","12 meses","24 meses","36 meses",1)}

        <div class="cell title">Total 1º mês</div>
        <div class="cell"><strong>R$ 19.640</strong></div>
        <div class="cell win"><strong>R$ 59.370</strong><div class="sm mut">+R$ 2.670/mês</div></div>
        <div class="cell"><strong>R$ 166.320</strong><div class="sm mut">+R$ 15.120/mês</div></div>

        <div class="cell title">Valor total contrato</div>
        <div class="cell"><strong>R$ 24.320</strong></div>
        <div class="cell win"><strong>R$ 123.450</strong><br/><span class="sm mut">Melhor custo/máquina</span></div>
        <div class="cell"><strong>R$ 710.640</strong></div>

        <div class="cell title">Pagamento</div>
        <div class="cell">À vista (PIX)</div>
        <div class="cell win">30% PIX + 5× boleto</div>
        <div class="cell">10% entrada + 36× cartão recorrente</div>

        <div class="cell title">Desconto efetivo</div>
        <div class="cell"><span class="bdg bdg-grey">0%</span></div>
        <div class="cell win"><span class="bdg bdg-green">8%</span> · auto</div>
        <div class="cell"><span class="bdg bdg-red">22%</span> · diretor</div>

        <div class="cell title"></div>
        <div class="cell"><button class="btn btn-ghost" style="width:100%">Selecionar este plano</button></div>
        <div class="cell win"><button class="btn btn-primary" style="width:100%">${ICN("check",13)} Selecionar Pro Fleet</button></div>
        <div class="cell"><button class="btn btn-ghost" style="width:100%">Selecionar este plano</button></div>
      </div>
    </div>
  `;
}
function cmpRow(label, a, b, c, highlight){
  return `
    <div class="cell title">${label}</div>
    <div class="cell">${a}</div>
    <div class="cell ${highlight?'win':''}">${b}</div>
    <div class="cell">${c}</div>
  `;
}

// ========================== APPROVALS ==========================
function renderApprovals(){
  const root = $("pg-approvals");
  root.innerHTML = `
    <div class="page-inner">
      <div class="ph">
        <div>
          <div class="crumb"><a href="#" onclick="nav('dashboard')">Vendas</a>${ICN("chevron-right",12)}<span class="cur">Aprovações</span></div>
          <div class="ph-t">Aprovações</div>
          <div class="ph-s">Workflow visual · 3 pendentes · alçada automática até 5%</div>
        </div>
        <div class="ph-r">
          <select class="select sm" style="width:auto"><option>Todas as alçadas</option><option>Coordenador (5-12%)</option><option>Diretor (12-25%)</option><option>Comitê (>25%)</option></select>
        </div>
      </div>

      <div class="kgrid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
        ${kpiCard(null,"Pendentes","3","Aguardando ação","",null,null,false,"clock")}
        ${kpiCard(null,"Aprovados hoje","1","R$ 88.4k liberados",null,null,null,false,"check-circle")}
        ${kpiCard(null,"Recusados hoje","0","Taxa de aprovação 96%",null,null,null,false,"x")}
        ${kpiCard(null,"Tempo médio","3,4d","Submissão → decisão",null,null,null,false,"clock")}
      </div>

      <!-- Queue -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-h">
          <div class="ctitle">${ICN("clock",14)} Fila de Aprovação</div>
          <span class="sm mut">Ordenado por prioridade + tempo de espera</span>
        </div>
        <div class="card-body" style="padding:0">
          ${window.__data.APPROVALS.map((a,i)=>approvalCard(a,i)).join("")}
        </div>
      </div>

      <!-- Policy + Workflow -->
      <div class="grid-2">
        <div class="card">
          <div class="card-h">
            <div class="ctitle">${ICN("shield",14)} Alçadas de Desconto</div>
            <button class="btn btn-link btn-sm" onclick="nav('admin')">Configurar ${ICN("arrow-right",11)}</button>
          </div>
          <div class="card-body" style="padding:0">
            ${window.__data.APPROVAL_POLICY.map((p,i)=>`
              <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border-soft)">
                <div style="width:30px;height:30px;border-radius:7px;background:var(--surface-2);color:var(--fg-2);display:flex;align-items:center;justify-content:center">${ICN(p.icon,15)}</div>
                <div class="grow">
                  <div class="bold sm">${p.approver}</div>
                  <div class="sm mut">Faixa: <span class="mono">${p.range}</span></div>
                </div>
                <span class="bdg bdg-${p.color==='black'?'dark':p.color==='green'?'green':p.color==='blue'?'blue':p.color==='amber'?'amber':'red'}">Nível ${i+1}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="card">
          <div class="card-h">
            <div class="ctitle">${ICN("layers",14)} Workflow Visual · UPGRADE0664</div>
            <span class="bdg bdg-amber">Em andamento</span>
          </div>
          <div class="card-body">
            <div class="col g10">
              ${[
                {step:"Submetido", who:"Guilherme Raksa", when:"2h atrás", state:"done"},
                {step:"Análise Coordenador", who:"Daiane Soares", when:"1h atrás", state:"done", action:"Escalonou para Diretor (18% > alçada)"},
                {step:"Análise Diretor", who:"Felipe Oliveira", when:"agora", state:"cur"},
                {step:"Notificar consultor", who:"Sistema", when:"—", state:"pending"},
                {step:"Liberar para Clicksign", who:"Sistema", when:"—", state:"pending"}
              ].map(s=>`
                <div class="flow-node ${s.state}" style="display:flex;align-items:center;gap:12px;min-width:0">
                  <div style="width:26px;height:26px;border-radius:50%;background:${s.state==='done'?'var(--success)':s.state==='cur'?'var(--nayax-yellow)':'var(--surface-3)'};color:${s.state==='done'?'#fff':'#262626'};display:flex;align-items:center;justify-content:center;flex-shrink:0">${ICN(s.state==='done'?"check":s.state==='cur'?"clock":"more",14)}</div>
                  <div class="grow">
                    <div class="row between">
                      <span class="bold sm">${s.step}</span>
                      <span class="sm mut">${s.when}</span>
                    </div>
                    <div class="sm mut">${s.who}${s.action?' · '+s.action:''}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function approvalCard(a, i){
  return `
    <div style="display:grid;grid-template-columns:200px 1fr 200px 160px;gap:14px;padding:16px 20px;border-bottom:1px solid var(--border-soft);align-items:center">
      <div>
        <div class="row g8" style="margin-bottom:5px">
          <span class="bdg bdg-dark bdg-mono">${a.quote}</span>
          ${a.priority==='high'?'<span class="bdg bdg-red">URGENTE</span>':a.priority==='med'?'<span class="bdg bdg-amber">Médio</span>':''}
        </div>
        <div class="bold sm">${a.company}</div>
        <div class="sm mut">${a.consultor}</div>
      </div>
      <div>
        <div class="sm bold" style="color:var(--fg-3);margin-bottom:4px">Justificativa</div>
        <div class="sm" style="color:var(--fg-2);line-height:1.5">${a.reason}</div>
        <div class="row g16" style="margin-top:9px;font-size:11.5px;color:var(--fg-4)">
          <span>${ICN("clock",11)} Esperando há <strong style="color:var(--fg-2)">${a.waiting}</strong></span>
          <span>${ICN("user",11)} Alçada: <strong style="color:var(--fg-2)">${a.level}</strong></span>
        </div>
      </div>
      <div style="text-align:center">
        <div class="sm mut">Valor</div>
        <div style="font-family:var(--font-display);font-size:22px;font-weight:700">${fmt.brl(a.value)}</div>
        <div class="sm mut">de ${fmt.brl(a.listPrice)} lista</div>
        <div class="bdg ${a.discount>=20?'bdg-red':'bdg-amber'}" style="margin-top:6px">${a.discount}% desconto</div>
      </div>
      <div class="col g6">
        <button class="btn btn-primary" onclick="approveQuote('${a.quote}','${a.company}',${a.value})">${ICN("check",13)}Aprovar</button>
        <button class="btn btn-danger btn-sm" onclick="rejectQuote('${a.quote}')">${ICN("x",12)}Recusar</button>
        <button class="btn btn-soft btn-sm" onclick="Toast.info('Pedido de info enviado','Consultor será notificado por e-mail',{duration:3500})">${ICN("more",12)}Pedir info</button>
      </div>
    </div>
  `;
}
