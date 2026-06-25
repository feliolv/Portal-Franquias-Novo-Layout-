/* ================================================================
   DealNayax v6 — PDF Preview modal
   Mocks the generated proposta PDF as a multi-page A4 document
================================================================ */

function renderPdfPreviewModal(){
  const wrap = document.createElement("div");
  wrap.id = "pdf-preview-root";
  wrap.innerHTML = `
    <div class="modal-overlay" id="m-pdf-preview">
      <div class="modal" style="max-width:920px;max-height:96vh;background:#E5E5E7;border-radius:14px">
        <div class="modal-h" style="background:var(--surface);border-bottom:1px solid var(--border)">
          <div>
            <div class="row g10" style="align-items:center">
              <div class="modal-t" style="font-family:var(--font-sans);font-size:18px;font-weight:700;text-transform:none;letter-spacing:-.3px">Pré-visualização do PDF</div>
              <span class="bdg bdg-dark bdg-mono" style="height:22px">NOVO0493</span>
              <span class="bdg bdg-grey">5 páginas · A4</span>
            </div>
            <div class="modal-sub">Supermercado Alvorada · Karolay Correia · gerado agora</div>
          </div>
          <div class="row g8">
            <button class="btn btn-ghost btn-sm" id="pdf-page-prev">${ICN("chevron-up",13)} Anterior</button>
            <span class="sm bold" style="font-variant-numeric:tabular-nums;min-width:54px;text-align:center" id="pdf-page-label">1 / 5</span>
            <button class="btn btn-ghost btn-sm" id="pdf-page-next">Próxima ${ICN("chevron-down",13)}</button>
            <div class="tb-sep" style="background:var(--border);height:24px"></div>
            <button class="btn btn-dark btn-sm">${ICN("download",13)} Baixar PDF</button>
            <button class="modal-x" onclick="closeM('m-pdf-preview')">${ICN("x",18)}</button>
          </div>
        </div>
        <div class="modal-b" id="pdf-pages-container" style="background:#E5E5E7;padding:30px 0;overflow-y:auto">
          ${pdfPage1()}
          ${pdfPage2()}
          ${pdfPage3()}
          ${pdfPage4()}
          ${pdfPage5()}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Page navigation
  document.getElementById("pdf-page-prev").addEventListener("click", ()=>pdfScrollTo(-1));
  document.getElementById("pdf-page-next").addEventListener("click", ()=>pdfScrollTo(+1));
}

let _pdfCurPage = 1;
function pdfScrollTo(delta){
  const total = 5;
  _pdfCurPage = Math.max(1, Math.min(total, _pdfCurPage + delta));
  const target = document.getElementById("pdf-page-"+_pdfCurPage);
  if(target) target.scrollIntoView({behavior:"smooth", block:"start"});
  document.getElementById("pdf-page-label").textContent = `${_pdfCurPage} / ${total}`;
}

function pdfPageWrapper(num, content){
  return `
    <div class="pdf-page" id="pdf-page-${num}" style="width:780px;min-height:1102px;background:#fff;margin:0 auto 24px;box-shadow:0 4px 24px rgba(0,0,0,.12),0 1px 3px rgba(0,0,0,.08);border-radius:2px;padding:0;position:relative;overflow:hidden;font-family:Inter,sans-serif">
      ${content}
      <!-- Page number footer -->
      <div style="position:absolute;bottom:18px;left:0;right:0;display:flex;justify-content:space-between;padding:0 50px;font-size:9.5px;color:#A1A1AA;letter-spacing:.5px">
        <span>NOVO0493 · Proposta Comercial · Nayax Brasil</span>
        <span>Página ${num} de 5</span>
      </div>
    </div>
  `;
}

// ============== PAGE 1 — Cover ==============
function pdfPage1(){
  return pdfPageWrapper(1, `
    <div style="background:#262626;height:520px;color:#fff;padding:50px 60px;position:relative;overflow:hidden">
      <!-- Big yellow N at right (decorative) -->
      <div style="position:absolute;top:-40px;right:-100px;opacity:.06">
        <img src="assets/nayax-mark-light.png" style="width:520px;height:auto">
      </div>

      <!-- Logo + branding -->
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:40px">
        <div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center">
          <img src="assets/nayax-mark-light.png" style="width:100%;height:100%;object-fit:contain">
        </div>
        <div>
          <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:20px;letter-spacing:1px;text-transform:uppercase">
            <span style="color:#FFCD00">NAYAX</span> <span style="opacity:.7">BRASIL</span>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:1px">Soluções de Pagamento Cashless</div>
        </div>
      </div>

      <div style="margin-top:80px;position:relative">
        <div style="font-size:11px;font-weight:700;color:#FFCD00;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">Proposta Comercial</div>
        <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:56px;font-weight:800;line-height:.95;letter-spacing:-.5px;margin-bottom:24px;text-transform:uppercase">
          Solução completa<br>de pagamentos<br><span style="color:#FFCD00">para Vending</span>
        </div>
        <div style="display:inline-block;background:rgba(255,205,0,.12);border:1px solid rgba(255,205,0,.35);padding:6px 12px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#FFCD00;letter-spacing:1px">
          NOVO0493
        </div>
      </div>
    </div>

    <!-- White section: client info -->
    <div style="padding:50px 60px;color:#262626">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="font-size:10px;font-weight:700;color:#A1A1AA;letter-spacing:2px;text-transform:uppercase">Apresentada para</div>
        <span style="font-size:9.5px;font-weight:700;letter-spacing:.5px;padding:2px 7px;border-radius:4px;background:#EFF6FF;color:#1D4ED8">PESSOA JURÍDICA</span>
      </div>
      <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:32px;font-weight:700;letter-spacing:-.3px;margin-bottom:6px">Supermercado Alvorada</div>
      <div style="font-size:13px;color:#52525B;margin-bottom:24px">CNPJ 17.833.301/0016-85 · IE 113.582.290.119</div>

      <!-- 2-column: address + contact -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;padding-top:20px;border-top:1px solid #E4E4E7">
        <div>
          <div style="font-size:9.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Endereço</div>
          <div style="font-size:13px;font-weight:600;color:#262626;line-height:1.5">
            Av. Brigadeiro Faria Lima, 2092 · Sala 318<br>
            <span style="font-weight:400;color:#52525B">Jardim Paulistano · São Paulo / SP</span><br>
            <span style="font-weight:400;color:#52525B">CEP 01451-905</span>
          </div>
        </div>
        <div>
          <div style="font-size:9.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Contato principal</div>
          <div style="font-size:13px;font-weight:600;color:#262626;margin-bottom:3px">Ricardo Marinho</div>
          <div style="font-size:11.5px;color:#52525B;line-height:1.6">
            Diretor de Operações<br>
            ricardo.marinho@supalvorada.com.br<br>
            +55 11 99240-7521
          </div>
        </div>
      </div>

      <div style="margin-top:30px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding-top:24px;border-top:1px solid #E4E4E7">
        <div>
          <div style="font-size:9.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px">Consultor</div>
          <div style="font-size:13px;font-weight:600;color:#262626">Karolay Correia</div>
          <div style="font-size:11px;color:#71717A;margin-top:2px">karolay@nayax.com</div>
          <div style="font-size:11px;color:#71717A">+55 11 99240-8472</div>
        </div>
        <div>
          <div style="font-size:9.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px">Data de emissão</div>
          <div style="font-size:13px;font-weight:600;color:#262626">22 de maio de 2026</div>
          <div style="font-size:11px;color:#71717A;margin-top:2px">Equipe VM + Grua</div>
        </div>
        <div>
          <div style="font-size:9.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px">Validade</div>
          <div style="font-size:13px;font-weight:600;color:#262626">30 dias</div>
          <div style="font-size:11px;color:#71717A;margin-top:2px">até 21/06/2026</div>
        </div>
      </div>

    </div>
  `);
}

// ============== PAGE 2 — About products ==============
function pdfPage2(){
  return pdfPageWrapper(2, `
    ${pdfHeader()}
    <div style="padding:30px 60px;color:#262626">
      <div style="font-size:10px;font-weight:700;color:#A1A1AA;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Sobre a solução</div>
      <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:34px;font-weight:800;letter-spacing:-.3px;line-height:1.05;margin-bottom:18px;color:#262626">
        Pagamento cashless completo<br>para sua operação
      </div>
      <div style="font-size:13.5px;color:#27272A;line-height:1.65;margin-bottom:30px">
        A Nayax oferece a plataforma de pagamentos cashless mais utilizada por operadores de Vending Machines, FECs, lavanderias e operações food no mundo. Esta proposta cobre <strong>5 terminais VPOS Touch</strong> conectados à Nayax Cloud Pro, com suporte estendido e instalação inclusa.
      </div>

      <!-- Product cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px">
        ${pdfProductCard("VPOS Touch", "Terminal 4G + leitor NFC + chip · display 4″ touchscreen · suporta débito, crédito, contactless e PIX", "monitor", "5 un.")}
        ${pdfProductCard("Nayax Cloud Pro", "Dashboard em tempo real · alertas · multi-usuário · API · relatórios financeiros e operacionais", "cloud", "Recorrente mensal")}
        ${pdfProductCard("Instalação Padrão", "Configuração in-loco · setup do dashboard · ativação dos terminais e teste de conectividade", "tool", "1 visita")}
        ${pdfProductCard("Suporte Técnico", "Atendimento 24/7 por telefone, e-mail e chat · resposta humano em até 4h", "headphones", "Incluso")}
      </div>

      <!-- Benefits strip -->
      <div style="padding:18px;background:#262626;color:#fff;border-radius:8px">
        <div style="font-size:10px;font-weight:700;color:#FFCD00;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">Benefícios incluídos</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">
          ${pdfBenefit("Conectividade 4G", "Chip dedicado em todos os terminais · sem WiFi")}
          ${pdfBenefit("Garantia 12 meses", "Cobertura total para hardware durante todo o contrato")}
          ${pdfBenefit("Atualizações ilimitadas", "Firmware e software sempre na versão mais nova")}
          ${pdfBenefit("Onboarding completo", "Treinamento dos operadores até 4 pessoas por sessão")}
        </div>
      </div>
    </div>
  `);
}

function pdfProductCard(name, desc, icon, badge){
  return `
    <div style="border:1px solid #E4E4E7;border-radius:8px;padding:16px;background:#FAFAFB">
      <div style="display:flex;align-items:start;justify-content:space-between;margin-bottom:10px">
        <div style="width:36px;height:36px;border-radius:7px;background:#FFFCEF;color:#7A5800;display:flex;align-items:center;justify-content:center">${ICN(icon,18)}</div>
        <span style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;background:#fff;border:1px solid #E4E4E7;color:#27272A">${badge}</span>
      </div>
      <div style="font-size:14px;font-weight:700;color:#262626;margin-bottom:5px">${name}</div>
      <div style="font-size:11.5px;color:#52525B;line-height:1.55">${desc}</div>
    </div>
  `;
}
function pdfBenefit(title, desc){
  return `
    <div>
      <div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:4px">${title}</div>
      <div style="font-size:10.5px;color:rgba(255,255,255,.65);line-height:1.5">${desc}</div>
    </div>
  `;
}

// ============== PAGE 3 — Line items table ==============
function pdfPage3(){
  return pdfPageWrapper(3, `
    ${pdfHeader()}
    <div style="padding:30px 60px;color:#262626">
      <div style="font-size:10px;font-weight:700;color:#A1A1AA;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Investimento detalhado</div>
      <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:30px;font-weight:800;letter-spacing:-.3px;margin-bottom:24px">Produtos &amp; Investimento</div>

      <!-- P&S Table -->
      <div style="margin-bottom:24px">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:4px 10px;background:#FFFCEF;color:#7A5800;border-radius:5px;font-size:10.5px;font-weight:700;letter-spacing:.3px;margin-bottom:10px">
          P&amp;S — Produtos &amp; Serviços (one-time)
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:#262626;color:#fff">
              <th style="text-align:left;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">Item</th>
              <th style="text-align:center;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;width:60px">Qtd</th>
              <th style="text-align:right;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;width:110px">Unit.</th>
              <th style="text-align:right;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;width:120px">Total</th>
            </tr>
          </thead>
          <tbody>
            ${pdfLineRow("VPOS Touch","Terminal 4G + leitor NFC + chip","VPOS-TCH-01",5,1890,9450)}
            ${pdfLineRow("Instalação Padrão","Configuração in-loco · 1 visita","INST-STD",1,350,350,true)}
          </tbody>
          <tfoot>
            <tr style="border-top:2px solid #262626">
              <td colspan="3" style="padding:12px 14px;font-size:12px;font-weight:700;text-align:right">Subtotal P&amp;S</td>
              <td style="padding:12px 14px;font-size:14px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums">R$ 9.800,00</td>
            </tr>
            <tr>
              <td colspan="3" style="padding:6px 14px;font-size:11px;text-align:right;color:#15803D">Desconto aplicado: Instalação grátis (regra PR-03)</td>
              <td style="padding:6px 14px;font-size:11px;text-align:right;color:#15803D;font-variant-numeric:tabular-nums">− R$ 350,00</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- MRR Table -->
      <div style="margin-bottom:24px">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:4px 10px;background:#EFF6FF;color:#1D4ED8;border-radius:5px;font-size:10.5px;font-weight:700;letter-spacing:.3px;margin-bottom:10px">
          MRR — Mensalidade Recorrente
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:#262626;color:#fff">
              <th style="text-align:left;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">Item</th>
              <th style="text-align:center;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;width:60px">Qtd</th>
              <th style="text-align:right;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;width:110px">Unit./mês</th>
              <th style="text-align:right;padding:10px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;width:120px">Total/mês</th>
            </tr>
          </thead>
          <tbody>
            ${pdfLineRow("Nayax Cloud Pro","Dashboard + alertas + API + multi-usuário","NCL-PRO",5,89,445)}
          </tbody>
          <tfoot>
            <tr style="border-top:2px solid #262626">
              <td colspan="3" style="padding:12px 14px;font-size:12px;font-weight:700;text-align:right">Subtotal MRR mensal</td>
              <td style="padding:12px 14px;font-size:14px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums">R$ 445,00 /mês</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Delivery address -->
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:14px;border:1px solid #E4E4E7;border-radius:10px;padding:18px;background:#FAFAFB">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <div style="width:24px;height:24px;border-radius:6px;background:#FFFCEF;color:#7A5800;display:flex;align-items:center;justify-content:center">${ICN("package",13)}</div>
            <div style="font-size:11px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase">Endereço de entrega</div>
          </div>
          <div style="font-size:13px;font-weight:700;color:#262626;margin-bottom:3px">Ricardo Marinho · Sup. Alvorada</div>
          <div style="font-size:12px;color:#52525B;line-height:1.55">
            Av. Brigadeiro Faria Lima, 2092 · Sala 318<br>
            Jardim Paulistano · São Paulo / SP<br>
            CEP 01451-905<br>
            Contato: +55 11 99240-7521
          </div>
        </div>
        <div style="border-left:1px solid #E4E4E7;padding-left:18px">
          <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">Frete</div>
          <div style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:4px;background:#DCFCE7;color:#15803D;font-size:10.5px;font-weight:700;letter-spacing:.3px;margin-bottom:8px">CIF · NAYAX PAGA</div>
          <div style="font-size:11.5px;color:#52525B;line-height:1.55">
            O frete está incluso no valor dos equipamentos e será de responsabilidade da Nayax Brasil.
          </div>
        </div>
      </div>
    </div>
  `);
}

function pdfLineRow(name, desc, sku, qty, unit, total, isDiscount){
  return `
    <tr style="border-bottom:1px solid #E4E4E7">
      <td style="padding:12px 14px">
        <div style="font-weight:600;color:#262626;font-size:13px;margin-bottom:2px">${name}</div>
        <div style="font-size:11px;color:#71717A">${desc}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#A1A1AA;margin-top:2px">${sku}</div>
      </td>
      <td style="padding:12px 14px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600;color:#262626">${qty}</td>
      <td style="padding:12px 14px;text-align:right;font-variant-numeric:tabular-nums;color:#27272A">R$ ${unit.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
      <td style="padding:12px 14px;text-align:right;font-variant-numeric:tabular-nums;font-weight:700;color:#262626">R$ ${total.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
    </tr>
  `;
}

// ============== PAGE 4 — Payment ==============
function pdfPage4(){
  return pdfPageWrapper(4, `
    ${pdfHeader()}
    <div style="padding:30px 60px;color:#262626">
      <div style="font-size:10px;font-weight:700;color:#A1A1AA;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Pagamento</div>
      <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:30px;font-weight:800;letter-spacing:-.3px;margin-bottom:24px">Forma de Pagamento &amp; Cronograma</div>

      <!-- P&S Payment block -->
      <div style="border:1px solid #E4E4E7;border-radius:10px;padding:22px;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div style="padding:4px 10px;background:#FFFCEF;color:#7A5800;border-radius:5px;font-size:10.5px;font-weight:700;letter-spacing:.3px">P&amp;S</div>
          <div style="font-size:15px;font-weight:700">Produtos &amp; Serviços · R$ 9.800,00</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:18px">
          <div>
            <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:8px">Entrada · 30%</div>
            <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:22px;font-weight:700">R$ 2.940,00</div>
            <div style="font-size:12px;color:#52525B;margin-top:4px">PIX · vencimento <strong>28/05/2026</strong></div>
          </div>
          <div>
            <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:8px">Parcelas · 5×</div>
            <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:22px;font-weight:700">5 × R$ 1.372,00</div>
            <div style="font-size:12px;color:#52525B;margin-top:4px">Boleto · vencimento dia <strong>10</strong></div>
          </div>
        </div>

        <!-- Installment schedule -->
        <div style="border-top:1px solid #E4E4E7;padding-top:14px">
          <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px">Cronograma das parcelas P&amp;S</div>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tbody>
              ${pdfInstallmentRow("Entrada","28/05/2026","PIX","R$ 2.940,00")}
              ${pdfInstallmentRow("Parcela 1/5","10/07/2026","Boleto","R$ 1.372,00")}
              ${pdfInstallmentRow("Parcela 2/5","10/08/2026","Boleto","R$ 1.372,00")}
              ${pdfInstallmentRow("Parcela 3/5","10/09/2026","Boleto","R$ 1.372,00")}
              ${pdfInstallmentRow("Parcela 4/5","10/10/2026","Boleto","R$ 1.372,00")}
              ${pdfInstallmentRow("Parcela 5/5","10/11/2026","Boleto","R$ 1.372,00")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- MRR Payment block -->
      <div style="border:1px solid #DBEAFE;border-radius:10px;padding:22px;background:#F8FBFF">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div style="padding:4px 10px;background:#EFF6FF;color:#1D4ED8;border-radius:5px;font-size:10.5px;font-weight:700;letter-spacing:.3px">MRR</div>
          <div style="font-size:15px;font-weight:700">Mensalidade Recorrente · R$ 445,00 /mês</div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:18px">
          <div>
            <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px">Forma de pagamento</div>
            <div style="font-size:14px;font-weight:700;color:#262626">Boleto</div>
          </div>
          <div>
            <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px">Início da cobrança</div>
            <div style="font-size:14px;font-weight:700;color:#262626">15/06/2026</div>
          </div>
          <div>
            <div style="font-size:10.5px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px">Fidelidade</div>
            <div style="font-size:14px;font-weight:700;color:#262626">12 meses</div>
          </div>
        </div>

        <div style="border-top:1px solid #DBEAFE;padding-top:14px">
          <div style="font-size:10.5px;font-weight:700;color:#1D4ED8;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px">Próximas faturas MRR</div>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px">
            ${["15/jun","15/jul","15/ago","15/set","15/out","15/nov"].map(d=>`
              <div style="background:#fff;border:1px solid #DBEAFE;border-radius:6px;padding:8px;text-align:center">
                <div style="font-size:9.5px;font-weight:700;color:#71717A;letter-spacing:.4px;text-transform:uppercase;margin-bottom:3px">${d}</div>
                <div style="font-size:11.5px;font-weight:700;color:#262626;font-variant-numeric:tabular-nums">R$ 445,00</div>
              </div>
            `).join("")}
          </div>
          <div style="font-size:11px;color:#52525B;margin-top:12px;line-height:1.5">
            <strong>Total MRR no contrato (12 meses):</strong> R$ 5.340,00 · reajuste anual conforme IPCA + 2%
          </div>
        </div>
      </div>
    </div>
  `);
}

function pdfInstallmentRow(label, date, method, value){
  return `
    <tr style="border-bottom:1px solid #F2F2F4">
      <td style="padding:8px 0;font-size:12px;color:#27272A">${label}</td>
      <td style="padding:8px 0;font-size:12px;color:#52525B;text-align:center">${date}</td>
      <td style="padding:8px 0;font-size:12px;color:#52525B;text-align:center">${method}</td>
      <td style="padding:8px 0;font-size:12.5px;color:#262626;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">${value}</td>
    </tr>
  `;
}

// ============== PAGE 5 — Terms + Signature ==============
function pdfPage5(){
  return pdfPageWrapper(5, `
    ${pdfHeader()}
    <div style="padding:30px 60px;color:#262626">
      <div style="font-size:10px;font-weight:700;color:#A1A1AA;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Termos de compra</div>
      <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:30px;font-weight:800;letter-spacing:-.3px;margin-bottom:20px">Termos &amp; Aceite</div>

      <!-- Contract link + QR -->
      <div style="display:grid;grid-template-columns:1fr 110px;gap:20px;align-items:center;padding:16px;border:1px solid #E4E4E7;border-radius:10px;background:#FAFAFB;margin-bottom:18px">
        <div>
          <div style="font-size:11px;font-weight:700;color:#A1A1AA;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px">Contrato vinculado</div>
          <div style="font-size:11.5px;color:#27272A;line-height:1.55;margin-bottom:8px">
            O Cliente reconhece que esta <strong>PROPOSTA COMERCIAL</strong> está vinculada integralmente ao <strong>CONTRATO DE LICENCIAMENTO DE USO DE SOFTWARE, PRESTAÇÃO DE SERVIÇOS, COMODATO DE EQUIPAMENTOS E OUTRAS AVENÇAS</strong> (&ldquo;Contrato&rdquo;) e os seus Anexos, acessíveis por meio do link abaixo e do QR Code ao lado, que também disponibiliza as Perguntas Frequentes (FAQ):
          </div>
          <a style="display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:#1D4ED8;text-decoration:underline;font-family:'JetBrains Mono',monospace">
            https://www.vmtecnologia.io/contrato-licenciamento
          </a>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          ${fakeQR()}
          <div style="font-size:9px;color:#A1A1AA;letter-spacing:.3px;text-align:center">escaneie para acessar</div>
        </div>
      </div>

      <!-- Declarations -->
      <div style="font-size:11.5px;color:#27272A;line-height:1.65;margin-bottom:14px">
        O Cliente declara ter lido, compreendido e aceitado todos os termos e condições estabelecidos no Contrato e em seus anexos. Declara, ainda, estar ciente de que <strong>as mensalidades referentes aos serviços contratados são cobradas no dia 15 (quinze) de cada mês</strong>, salvo disposição diversa prevista nesta Proposta Comercial ou acordada formalmente entre as partes.
      </div>

      <div style="font-size:11.5px;color:#27272A;line-height:1.65;margin-bottom:14px">
        Além disso, declara que teve a oportunidade de buscar esclarecimentos sobre quaisquer dúvidas comerciais, técnicas e jurídicas relacionadas aos seus direitos e obrigações, consultando seus assessores, advogados ou contadores.
      </div>

      <div style="font-size:11.5px;color:#27272A;line-height:1.65;margin-bottom:14px">
        Ao assinar esta Proposta Comercial, o Cliente se vincula legalmente ao Contrato e os seus anexos. Estes documentos substituem integralmente todos os contratos anteriores, conforme estabelecido na <strong>cláusula 24.3.1</strong> das disposições gerais do Contrato.
      </div>

      <!-- Final acceptance -->
      <div style="padding:14px 16px;background:#FFFCEF;border:1px solid #FFE88A;border-radius:8px;font-size:11.5px;color:#27272A;line-height:1.6;margin-bottom:24px">
        Como representante legal ou procurador da Empresa Contratante/Cliente, <strong>ACEITO INTEGRALMENTE</strong> os termos desta <strong>PROPOSTA COMERCIAL</strong>, bem como do <strong>CONTRATO</strong> e seus anexos inseridos no link e QR Code acima, reconheço a sua validade em formato eletrônico e concordo com o mecanismo de certificação utilizado pela Nayax Brasil para a sua formalização, nada tendo a opor quanto à legitimidade de sua assinatura eletrônica, inserida na forma abaixo.
      </div>

      <!-- Signature block -->
      <div style="padding-top:20px;border-top:2px solid #262626">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:16px">
          <div>
            <div style="height:54px;border-bottom:1.5px solid #262626;margin-bottom:6px"></div>
            <div style="font-size:11px;font-weight:700;color:#262626">Supermercado Alvorada</div>
            <div style="font-size:10.5px;color:#71717A;margin-top:2px">Ricardo Marinho · CNPJ 17.833.301/0016-85</div>
          </div>
          <div>
            <div style="height:54px;border-bottom:1.5px solid #262626;margin-bottom:6px"></div>
            <div style="font-size:11px;font-weight:700;color:#262626">Nayax Brasil Soluções de Pagamento Ltda</div>
            <div style="font-size:10.5px;color:#71717A;margin-top:2px">Felipe Oliveira · Diretor Comercial</div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function fakeQR(){
  // Deterministic 21x21 QR-style pattern with finder patterns at 3 corners + data dots
  const size = 21;
  const cells = [];
  const isFinder = (x,y) => {
    const cornerX = [0, size-7];
    const cornerY = [0, size-7];
    for(const cx of cornerX){
      for(const cy of cornerY){
        if(cx === size-7 && cy === size-7) continue; // QR only has 3 finder patterns
        if(x >= cx && x < cx+7 && y >= cy && y < cy+7){
          const dx = x - cx, dy = y - cy;
          const isBorder = dx===0 || dx===6 || dy===0 || dy===6;
          const isCore = dx>=2 && dx<=4 && dy>=2 && dy<=4;
          return isBorder || isCore;
        }
      }
    }
    return null;
  };
  for(let y=0; y<size; y++){
    for(let x=0; x<size; x++){
      const f = isFinder(x,y);
      let filled;
      if(f !== null){ filled = f; }
      else {
        // pseudo-random fill, deterministic
        filled = ((x*7 + y*13 + (x*y)%5) % 3) < 1.4;
      }
      if(filled) cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#262626"/>`);
    }
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="92" height="92" style="background:#fff;border:1px solid #E4E4E7;border-radius:6px;padding:3px;box-sizing:content-box">${cells.join("")}</svg>`;
}

function pdfTerm(num, title, desc){
  return `
    <div style="display:flex;gap:14px;padding:10px 0;border-bottom:1px solid #F2F2F4">
      <div style="width:24px;height:24px;border-radius:50%;background:#262626;color:#FFCD00;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;font-family:'Barlow Condensed',sans-serif">${num}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#262626;margin-bottom:2px">${title}</div>
        <div style="font-size:11.5px;color:#52525B;line-height:1.55">${desc}</div>
      </div>
    </div>
  `;
}

function pdfHeader(){
  return `
    <div style="background:#fff;border-bottom:1px solid #E4E4E7;padding:18px 60px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:24px;height:24px;background:#262626;border-radius:5px;display:flex;align-items:center;justify-content:center">
          <img src="assets/nayax-mark-light.png" style="width:18px;height:18px">
        </div>
        <div style="font-family:Hind,Lato,sans-serif;font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase">
          <span style="color:#262626">NAYAX</span> <span style="color:#71717A">BRASIL</span>
        </div>
      </div>
      <div style="font-size:10.5px;color:#71717A;font-family:'JetBrains Mono',monospace">NOVO0493</div>
    </div>
  `;
}

// Init
document.addEventListener("DOMContentLoaded", ()=>{
  renderPdfPreviewModal();
});

// Public helper to open from anywhere
function openPdfPreview(){
  _pdfCurPage = 1;
  document.getElementById("pdf-page-label").textContent = "1 / 5";
  openM("m-pdf-preview");
  setTimeout(()=>{
    const container = document.getElementById("pdf-pages-container");
    if(container) container.scrollTop = 0;
  }, 100);
}
