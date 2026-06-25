# Portal de Vendas Nayax — Especificação Completa (Prompt de Reconstrução)

> Use este documento como prompt único para reconstruir o portal do zero, ou como referência funcional. Stack: **React 18 + Babel inline (JSX)**, sem build, tokens CSS próprios baseados no Nayax Design System.

---

## 1. VISÃO GERAL

Portal web da **Nayax Brasil** para gestão de vendas de soluções de pagamento cashless (Vending Machine, Micromercado, Lavanderia, Diversão Eletrônica, Food Service, EV). Dois grandes ambientes:

- **Cliente/Franquia/Parceiro** — catálogo, pedidos, materiais, suporte
- **Administrativo (Backoffice)** — dashboard, vendas, DealNayax (CPQ), franquias, produtos, bundles, workflows, integrações, configurações

Marca: preto `#262626` + Taxi Yellow `#FFCD00` + Iris `#6D5BF7` + Spring `#25EF89` + Coral `#FF5C6C`. Tipografia **Hurme Geometric Sans 3** (fallback Urbanist) + **JetBrains Mono** para números/códigos.

---

## 2. ARQUITETURA DE ARQUIVOS

```
Portal Nayax.html         → shell, carrega React/Babel + todos os scripts
styles/tokens.css         → paleta oficial, tipografia, spacing, radii, shadows
styles/app.css            → base, sidebar, botões, inputs, cards, tabelas, modais, animações
src/icons.jsx             → componente <Icon name> (stroke SVG set)
src/data.jsx              → mock data (produtos, franquias, pedidos, status) + formatadores BRL/data + NAV
src/i18n.jsx              → dicionários PT/EN/ES + useLang() hook (estado global + subscribers)
src/ui.jsx                → Toast, StatusPill, NayaxMark, Sidebars, Topbar, PageHeader, charts SVG, ProductVisual, QtyStepper, LangPicker, NotifBell
src/utils.jsx             → ConfirmHost (window.confirmAction), EmptyState, Skeleton
src/app.jsx               → App root: router por estado, carrinho, tweaks/tema, monta todas as telas
src/screens/*.jsx         → uma tela por arquivo (ver seção 5)
src/tweaks-panel.jsx      → painel de Tweaks (personalidade/densidade/cor)
```

**Regras de scope (Babel inline):** cada `<script type="text/babel">` tem escopo próprio. Componentes compartilhados são expostos via `window.X = X` ou `Object.assign(window, {...})` no fim de cada arquivo. Objetos de estilo nunca se chamam `styles` (colisão) — usar nomes específicos ou inline.

---

## 3. DESIGN SYSTEM (tokens.css)

- **Amarelo:** `--taxi-yellow #FFCD00`, escala 00→90
- **Roxo:** `--iris #6D5BF7`, `--violet #2C1036`
- **Status:** green/Spring, red/Coral, orange, blue/Iris (cada um com `-30`, `-50`, `-soft`)
- **Neutros:** `--dark #262626`, `--mid #F3F3F3`, grays
- **Semânticos:** `--accent`, `--bg-app #F7F5F0`, `--bg-surface`, `--text-1/2/3`, `--line-1/2`
- **Spacing:** grade 8pt (`--space-1`..`--space-10`)
- **Radii:** xs→2xl + pill
- **Tipografia:** classes `.t-display/.t-h1../.t-overline/.t-mono`
- **Tema:** `[data-personality="energetic"]` e `[data-density="compact"]` sobrescrevem tokens

---

## 4. NAVEGAÇÃO

**Cliente (sidebar):** Catálogo · Pedidos · Materiais · Suporte
**Admin (sidebar):** Visão geral · Vendas · DealNayax · Franquias · Produtos · Bundles · Workflows · HubSpot · Comunicados · Suporte · Relatórios · Auditoria + Configurações

Router em `app.jsx` por `route` (string em estado). `window.setRoute(r)` exposto globalmente. Rotas admin prefixadas `admin-`.

---

## 5. TELAS (comportamento detalhado)

### LOGIN (`Login.jsx`)
- Split: painel esquerdo preto com **N gigante (watermark)**, headline rotativa (3 mensagens, dots), pills de capacidade, status "Sistema operacional"; painel direito com formulário.
- Tabs: **Catálogo** (código + senha) / **Administração** (HubSpot).
- Código de acesso define o tipo: **NX-####** = cliente/franquia; **F01-/F02-** = parceiro.
- "Esqueci minha senha" → modal de recuperação (e-mail/código + confirmação de envio).
- "Novo cadastro" → wizard com pergunta inicial **Franquia / Consultor / Parceiro**; cada um com campos próprios (Consultor = lista do HubSpot + segmento + código); todos com **criar senha**.
- LangPicker PT/EN/ES com toast.
- SEM textos de "franquia" hardcoded no hero — copy neutra "Portal de Vendas".

### CATÁLOGO (`Catalog.jsx`)
- Hero contextual escuro (saudação + condições).
- Filtros por chip com contagem: Todos / Produtos / Serviços.
- Toggle grid/lista. Cards com hover-lift + botão "Adicionar" que acende amarelo no hover.
- Quick-add com stepper; carrinho lateral.
- KPI no hero: contagem de produtos.

### DETALHE DO PRODUTO (`ProductDetail.jsx`)
- Galeria, preço + estoque + entrega, abas de info, produtos relacionados, stepper + CTA.

### CARRINHO + CHECKOUT (`Cart.jsx`)
- Drawer lateral com itens, recorrência mensal, miniaturas.
- Checkout multi-step (Franqueado → Entrega → Pagamento → Revisar) com stepper + resumo sticky.
- Tela de sucesso: proposta enviada para assinatura + Concluir.

### PARCEIRO (`Partner.jsx`)
- Seleciona produto do **estoque próprio** → tela de transferência interna (não é envio).
- Campo **"Número do equipamento"** + botão "+" para adicionar múltiplas numerações.
- Dados de empresa/cliente iguais ao catálogo de clientes.

### HISTÓRICO (`OrderHistory.jsx`)
- KPIs do cliente, filtros por status, linhas expansíveis com itens + timeline + ações (baixar nota, repetir pedido).

### MATERIAIS (`Materials.jsx`)
- 10 docs com filtros por categoria, tipos coloridos (PDF/PPTX/XLSX/ZIP/MP4), download.

### SUPORTE (`Support.jsx`)
- Lista de chamados + modal novo ticket + canais alternativos.

### PERFIL / MINHA CONTA (`Profile.jsx`)
- 3 abas: Dados pessoais · Senha & segurança (2FA toggle) · Notificações (só e-mail). Botão Sair.

### ADMIN DASHBOARD (`AdminShell.jsx`)
- KPIs com sparklines, gráfico de volume (dual-line SVG), donut por segmento (cores oficiais), top produtos/franquias, **feed de atividade** (11 eventos) com "Ver feed completo" → modal.

### ADMIN VENDAS (`AdminSalesClients.jsx`)
- Tabela com seleção, bulk actions, paginação, densidade.
- **Coluna HubSpot:** Sincronizado (verde + HS-DEAL-id) / Erro (vermelho, clicável → modal de erro) / Aguardando.
- **Botão reenviar ao HubSpot** por linha (com spinner) + bulk + banner de erro no topo + filtro por status HubSpot.
- Menu "..." por linha: ver detalhes, copiar ID, baixar NF, aprovar/enviar/entregar (contextual), duplicar, reenviar, cancelar.

### ADMIN FRANQUIAS (`AdminSalesClients.jsx`)
- Tabela/cards, modal **Nova/Editar franquia** em 4 passos: Empresa → Contato → Catálogo & preços (produtos liberados + preços por franquia + desconto global/individual) → Pagamento (métodos editáveis + customizados + planos entrada+parcelas + limite de crédito). Banner HubSpot + código auto-gerado.

### ADMIN PRODUTOS + HUBSPOT (`AdminProductsHubSpot.jsx`)
- Produtos: tabela, Novo/Editar (modal), Filtros (drawer), Exportar CSV, menu de linha.
- HubSpot: import em 2 colunas (lista + fila de classificação produto/bundle).

### ADMIN BUNDLES (`AdminBundles.jsx`)
- Grid de combos + modal builder: **múltiplos produtos-gatilho** (qualquer SKU dispara o bundle na mesma quantidade), itens extras, segmentos, status, **preços por franquia** (override individual), resumo com economia.

### DEALNAYAX (CPQ) (`AdminDealNayax.jsx`)
- 4 sub-abas: **Visão geral** (5 cards de status, ciclo de vida, aguardando assinatura Clicksign, fila de aprovação, atividade), **Negócios** (kanban 6 colunas + lista, detalhe), **Orçamentos** (tabela), **Aprovações** (cards com aprovar/rejeitar).
- Pedidos do Portal de Vendas aparecem aqui com badge **"Portal"** (pipeline "Portal de Vendas", status "Em assinatura").
- Botão **Configurações** → DealNayaxSettings.

### DEAL BUILDER (`DealBuilder.jsx`)
- Breadcrumb Negócios/Orçamentos/Novo Orçamento + Histórico/Pré-visualizar/Baixar PDF/Enviar para Assinatura.
- Banner **sugestão inteligente** (concorrente → bundle).
- 7 tipos de proposta (com número gerado).
- **Dados do cliente** PJ (Dados da empresa / Endereço / Contato principal) e PF, subseções rotuladas.
- Produtos editáveis + catálogo modal + bundles.
- Pricing global; **Forma de pagamento** P&S (entrada com chips de método + % + parcelamento) e MRR (boleto, início, vencimento, fidelidade, cronograma de faturas).
- Entrega CIF/FOB; vigência/termos.
- Sidebar sticky: resumo ao vivo, **caminho de aprovação** (régua 5 níveis por desconto efetivo), regras aplicadas, versões, histórico.
- **Enviar para Assinatura** → modal Clicksign (gate de aprovação, signatários ordenados) → confete + toast.

### PDF PREVIEW (`PdfPreview.jsx`)
- Proposta A4 de **5 páginas**: Capa (N decorativo) · Sobre a solução · Produtos & Investimento (tabelas P&S/MRR dinâmicas) · Pagamento & Cronograma · Termos & Aceite (contrato, QR, assinaturas). Navegação por páginas. Dinâmico conforme builder.

### ORDEM DE PRODUÇÃO (`AdminDealNayax.jsx`)
- Após orçamento assinado, gera OP **só para itens com endereço de entrega**: dados resumidos (produto qtd/SKU/nome), cliente, endereço, sigla da proposta. **Sem frete, sem cores, sem campos de responsável/conferência.** Layout monocromático leve.

### WORKFLOWS (`AdminWorkflows.jsx`)
- KPIs + 3 sub-tabs (Meus workflows / Templates / Execuções).
- Builder visual estilo Make/Zapier: nó gatilho (10 triggers + filtros) → ações em cascata (e-mail/Slack/HubSpot/WhatsApp/webhook/atribuir/tag/tarefa). Toggle ativo, editar, excluir.

### COMUNICADOS / SUPORTE ADMIN / RELATÓRIOS / AUDITORIA (`AdminExtras.jsx`)
- Comunicados: banners/modais com público-alvo, status, views.
- Suporte: fila de tickets + KPIs CSAT.
- Relatórios: 6 modelos + wizard de filtros + histórico de exports.
- Auditoria: log de ações com filtros por tipo.

### CONFIGURAÇÕES DO PORTAL (`AdminSettings.jsx`)
- 6 abas: Empresa · Equipe & acessos (times, membros, **matriz de permissões interativa** Admin/Coordenador/Consultor com escopo) · Integrações (cards) · Notificações (só e-mail) · Segurança (2FA/SSO/IP/sessões) · **Aparência** (tema claro/escuro/auto selecionável + cor de destaque ao vivo).

### CONFIGURAÇÕES DO DEALNAYAX (`DealNayaxSettings.jsx`)
- 12 abas: Usuários (10, tabela) · Perfis de Acesso · Equipes · Catálogo · Regras de Pricing (PR-01..06) · Clicksign Espelho · Empresa · Alçadas (5 faixas) · Numeração (atômica por tipo) · Templates · Integrações · Auditoria.

---

## 6. PADRÕES DE INTERAÇÃO

- **Feedback:** toda ação dá toast (`window.toast(msg)`), nunca `alert()`. Botões sem função NÃO mostram "em breve" — ou têm ação real ou são ocultados.
- **Confirmação destrutiva:** `await window.confirmAction({title, body, danger})` → Promise.
- **i18n:** `const {t} = useLang(); t('chave', 'fallback')`. Trocar idioma re-renderiza tudo.
- **Modais:** scrim + `.modal`, fecham ao clicar fora ou no X.
- **Tabelas:** header sticky, hover de linha, badges de status coloridos por tom.
- **Empty states** e **skeletons** disponíveis.
- **Logout** nas duas sidebars volta ao login.

---

## 7. DADOS MOCK (data.jsx)

- ~14 produtos (terminais, kits, kiosks, serviços) com SKU, categoria, segmento, preço, mensalidade, estoque, badge.
- 8 franquias (código NX-####, razão, segmento, cidade, status, LTV, pedidos).
- Pedidos com status (confirmed/pending/shipped/delivered/cancelled) + campo HubSpot (synced/failed/pending + hsDeal/hsError).
- Segmentos oficiais: Vending Machine, Micromercado, Lavanderia, Diversão Eletrônica, Food Service, EV.
- Formatadores: `fmtBRL`, `fmtBRLcurt`, `fmtDate`, `fmtDateTime`.

---

## 8. NÃO FAZER

- Não usar emoji fora da marca; não usar gradientes decorativos excessivos.
- Não inventar dados/stats sem propósito.
- Não criar texto placeholder de "franquia" no login.
- Não adicionar frete/cores na Ordem de Produção.
- Não mostrar toast "em breve" — implementar ou ocultar.
