import type { Phase, MonthData, TagConfigItem, TagKey } from '../types';

// ═══════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════
export const C = {
  bg: '#06080f',
  surface: '#0d1117',
  card: '#161b22',
  border: '#21262d',
  accent: '#00d4aa',
  accentDim: '#00d4aa18',
  blue: '#4da6ff',
  orange: '#ff8c42',
  purple: '#a78bfa',
  gold: '#fbbf24',
  red: '#ff6b6b',
  pink: '#f472b6',
  green: '#34d399',
  cyan: '#22d3ee',
  proLabore: '#e879f9',
  text: '#f0f4f8',
  textSec: '#b0bec5',
  textMut: '#5a6a7a',
  gray1: '#64748b',
  gray2: '#8b9bb0',
} as const;

// ═══════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════
const HPV = 16000;
const CEA = 14000;
const SETUP = 5000;

// ═══════════════════════════════════════════════════
// CLIENT TRAJECTORY — new clients per month
// Mês 1 = Setup (no monthly). MRR starts month 2.
// ═══════════════════════════════════════════════════
const trajectory = [
  { m: 'FEV', newCli: 0, existing: 1 }, // Riseon already paying
  { m: 'MAR', newCli: 2, existing: 0 },
  { m: 'ABR', newCli: 2, existing: 0 },
  { m: 'MAI', newCli: 3, existing: 0 },
  { m: 'JUN', newCli: 2, existing: 0 },
  { m: 'JUL', newCli: 3, existing: 0 },
  { m: 'AGO', newCli: 3, existing: 0 },
  { m: 'SET', newCli: 3, existing: 0 },
  { m: 'OUT', newCli: 3, existing: 0 },
  { m: 'NOV', newCli: 3, existing: 0 },
  { m: 'DEZ', newCli: 3, existing: 0 },
];

// ═══════════════════════════════════════════════════
// FINANCIAL DATA ARRAYS
// ═══════════════════════════════════════════════════
const ticketCRM = [1500, 1500, 2300, 2600, 2750, 2800, 2900, 3000, 3100, 3100, 3200];
const mktClients = [0, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12];
const MKT_TICKET = 1000;
const lowTicketArr = [0, 0, 2800, 3800, 5600, 6500, 8000, 10000, 12000, 13500, 15000];
const proLaboreTarget = [800, 3000, 7000, 12000, 16800, 25000, 30000, 35000, 40000, 45000, 50000];

const pjIncome = [
  { h: HPV, c: CEA }, { h: HPV, c: CEA }, { h: HPV, c: CEA }, { h: HPV, c: CEA }, { h: HPV, c: CEA },
  { h: 0, c: CEA }, { h: 0, c: CEA }, // Jul-Ago: leave Hapvida
  { h: 0, c: 0 }, { h: 0, c: 0 }, { h: 0, c: 0 }, { h: 0, c: 0 }, // Sep+: leave C&A
];

const infraBase = [616, 650, 700, 750, 800, 900, 1000, 1100, 1200, 1300, 1496];
const apiPerClient = 60;
const mktSpend = [500, 1000, 1500, 2500, 3000, 4000, 5000, 6000, 7000, 8500, 9900];
const taxRate = 0.06;
const closerCost = [0, 0, 0, 0, 0, 2500, 2500, 3000, 3000, 3000, 3500];
const csCost = [0, 0, 0, 0, 0, 0, 0, 3500, 3500, 4000, 4000];

// ═══════════════════════════════════════════════════
// COMPUTED MONTHS
// ═══════════════════════════════════════════════════
let totalCliAcc = 0;
let payingCliAcc = 0;

const months = trajectory.map((t, i) => {
  const prevNew = i > 0 ? trajectory[i - 1].newCli : 0;
  payingCliAcc += prevNew + (i === 0 ? t.existing : 0);
  totalCliAcc += t.newCli + t.existing;
  return { ...t, totalCli: totalCliAcc, payingCli: payingCliAcc, inSetup: t.newCli };
});

// Reset accumulators for proper use in finData
totalCliAcc = 0;
payingCliAcc = 0;

const trajectory2 = trajectory.map(() => null);
let totalCli2 = 0;
let payingCli2 = 0;
const months2 = trajectory.map((t, i) => {
  const prevNew = i > 0 ? trajectory[i - 1].newCli : 0;
  payingCli2 += prevNew + (i === 0 ? t.existing : 0);
  totalCli2 += t.newCli + t.existing;
  return { ...t, totalCli: totalCli2, payingCli: payingCli2, inSetup: t.newCli };
});

// ═══════════════════════════════════════════════════
// REAL COST OVERRIDES (substitui projeção por custo real)
// Índice = posição do mês (0 = FEV, 1 = MAR, ...)
// ═══════════════════════════════════════════════════
const costOverrides: Record<number, {
  impostos?: number;
  infra?: number;
  apiVar?: number;
  mkt?: number;
}> = {
  0: { impostos: 0, infra: 365.79, apiVar: 113.39, mkt: 0 }, // FEV: custos reais
};

// ═══════════════════════════════════════════════════
// BUILD FINANCIAL DATA
// ═══════════════════════════════════════════════════
export const finData: MonthData[] = months2.map((mo, i) => {
  const mrrCRM = mo.payingCli * ticketCRM[i];
  const mrrMKT = mktClients[i] * MKT_TICKET;
  const setups = mo.newCli * SETUP;
  const lt = lowTicketArr[i];
  const receitaNeoSale = mrrCRM + mrrMKT + setups + lt;
  const h = pjIncome[i].h;
  const c = pjIncome[i].c;
  const receitaTotal = receitaNeoSale + h + c;

  const override = costOverrides[i];

  let impostos = Math.round(receitaNeoSale * taxRate);
  let infra    = infraBase[i];
  let apiVar   = mo.totalCli * apiPerClient;
  let mkt      = mktSpend[i];

  if (override) {
    if (override.impostos !== undefined) impostos = override.impostos;
    if (override.infra    !== undefined) infra    = override.infra;
    if (override.apiVar   !== undefined) apiVar   = override.apiVar;
    if (override.mkt      !== undefined) mkt      = override.mkt;
  }

  const closer = closerCost[i];
  const cs = csCost[i];
  const custoTotal = impostos + infra + apiVar + mkt + closer + cs;
  const proLabore = proLaboreTarget[i];
  const lucroEmpresa = receitaNeoSale - custoTotal - proLabore;
  const margemLucro = receitaNeoSale > 0 ? lucroEmpresa / receitaNeoSale : 0;

  return {
    m: mo.m,
    totalCli: mo.totalCli,
    payingCli: mo.payingCli,
    inSetup: mo.inSetup,
    ticketAvg: ticketCRM[i],
    mrrCRM, mrrMKT, setups, lowTicket: lt,
    receitaNeoSale, h, c, receitaTotal,
    impostos, infra, apiVar, mkt, closer, cs, custoTotal,
    proLabore, lucroEmpresa, margemLucro,
  };
});

// ═══════════════════════════════════════════════════
// TAG CONFIGURATION
// ═══════════════════════════════════════════════════
export const tagConfig: Record<TagKey, TagConfigItem> = {
  brand:     { icon: '🎨', label: 'Marca',      color: C.purple },
  content:   { icon: '✍️', label: 'Conteúdo',   color: C.blue },
  sales:     { icon: '💰', label: 'Vendas',      color: C.gold },
  tech:      { icon: '⚙️', label: 'Técnico',     color: C.textSec },
  ads:       { icon: '📡', label: 'Tráfego',     color: C.orange },
  delivery:  { icon: '📦', label: 'Entrega',     color: C.accent },
  neomkt:    { icon: '📐', label: 'NeoMKT',      color: C.cyan },
  finance:   { icon: '📊', label: 'Financeiro',  color: C.green },
  milestone: { icon: '🚨', label: 'Marco',       color: C.red },
  team:      { icon: '👥', label: 'Time',        color: C.pink },
  product:   { icon: '🧩', label: 'Produto',     color: C.purple },
};

// ═══════════════════════════════════════════════════
// PHASES
// ═══════════════════════════════════════════════════
export const phases: Phase[] = [
  {
    id: 0, month: 'FEV', full: 'Fevereiro 2026',
    title: 'FUNDAÇÃO', sub: 'Posicionamento + Processo Comercial',
    color: C.blue, icon: '🏗️', ms: null, activeMonths: [0],
    tasks: [
      { t: 'Atualizar perfil LinkedIn completo', d: "Bio: 'Fundador NeoSale AI | IA que vende pelo WhatsApp'. Banner com dados R$826k/ano perdidos.", dt: '19/02', tag: 'brand' },
      { t: 'Pipeline de vendas no NeoCRM', d: 'Pipeline: Lead → Qualificação → Diagnóstico → Proposta → Setup → Ativo.', dt: '19/02', tag: 'sales' },
      { t: 'Script de diagnóstico gratuito (30 min)', d: 'Roteiro: situação atual, dor, métricas, demo NeoSale, proposta com ROI projetado.', dt: '19/02', tag: 'sales' },
      { t: 'Landing page lp.neosaleai.com.br', d: 'Captação com CTA diagnóstico gratuito. Case Riseon R$1M em 30 dias.', dt: '20-21/02', tag: 'tech' },
      { t: 'Configurar Asaas billing', d: 'Setup R$5k (pagamento único) + mensalidade R$3k (início no mês 2). Pix + cartão.', dt: '21/02', tag: 'tech' },
      { t: 'Conteúdo LinkedIn diário', d: '1 post/dia. DOR → DADO → SOLUÇÃO → CTA. R$826k, ROI 17x, case Riseon.', dt: '24/02', tag: 'content' },
      { t: 'Prospecção LinkedIn: 50 conexões/semana', d: '10 convites/dia. Donos de clínica estética, odonto, dermatologia SP/RJ/BH.', dt: '24/02', tag: 'sales' },
      { t: 'WhatsApp Business com IA como demo', d: 'NeoSale respondendo leads no WhatsApp da empresa. Prova de conceito viva.', dt: '26/02', tag: 'tech' },
      { t: 'Proposta comercial PDF', d: 'Deck: problema R$826k, NeoCRM + agentes IA, case Riseon, planos, ROI.', dt: '27/02', tag: 'sales' },
      { t: 'Primeiro carrossel Instagram @neosaleai', d: "'R$826 mil por ano. É isso que a demora no WhatsApp custa.' CTA: DM ou link.", dt: '28/02', tag: 'content' },
    ],
  },
  {
    id: 1, month: 'MAR', full: 'Março 2026',
    title: 'PRIMEIROS CLIENTES', sub: 'Fechar 2 novos + criar e-book low ticket',
    color: C.accent, icon: '🎯', ms: 'Setup 2 clientes novos', activeMonths: [1],
    tasks: [
      { t: 'Prospecção ativa LinkedIn (diária)', d: '10 abordagens/dia via DM. SPIN Selling. Agendar diagnósticos.', dt: '01-31/03', tag: 'sales' },
      { t: 'Fechar 2 novos clientes NeoCRM', d: 'Setup R$5k cada (R$10k). Mês 1 = setup, sem mensalidade. MRR começa em Abril.', dt: '01-31/03', tag: 'sales' },
      { t: 'Onboarding 2 clientes (setup month)', d: 'IA SDR + NeoCalendar + NeoFollow. Treinamento 1h. Acompanhamento semanal.', dt: 'Semana 1-4', tag: 'delivery' },
      { t: 'Escrever e-book low ticket', d: "'O Roteiro de WhatsApp que Agenda 3x Mais' — 15-20 scripts de abordagem e follow-up.", dt: '08-10/03', tag: 'content' },
      { t: 'Publicar e-book Kiwify + funil', d: 'R$37. Order bump R$47. Upsell R$197. Upsell R$297. Sequência WhatsApp 14d.', dt: '13-19/03', tag: 'tech' },
      { t: 'Gravar 5-10 criativos Meta Ads', d: 'Vídeos PRSA. Carrossel, vídeo curto, estático. Hooks com dados.', dt: '20-22/03', tag: 'content' },
      { t: '📐 NeoMKT — Pesquisa de mercado', d: 'Entrevistar clientes NeoCRM: dores com redes sociais, tráfego, relatórios. Validar demanda.', dt: '25-31/03', tag: 'neomkt' },
    ],
  },
  {
    id: 2, month: 'ABR', full: 'Abril 2026',
    title: 'LOW TICKET LIVE', sub: 'Validar funil + primeiros MRR dos clientes de Mar',
    color: C.orange, icon: '🚀', ms: 'Primeiro MRR real: R$6.5k', activeMonths: [2],
    tasks: [
      { t: 'Phase 1 — Teste criativos Meta Ads', d: 'ABO → 5-10 conjuntos. R$15/dia. CPA ≤R$16, ROI ≥2.0, CTR ≥1.5%.', dt: '01/04', tag: 'ads' },
      { t: 'Phase 2 — Advantage+ com vencedores', d: 'Budget R$37/dia. Dobrar a cada 5 dias se ROI manter acima de 2.0.', dt: '08/04', tag: 'ads' },
      { t: 'Clientes de Março começam a pagar MRR', d: '2 clientes passam do setup para mensalidade. Riseon + 2 novos = 3 pagando MRR (R$6.5k).', dt: '01/04', tag: 'finance' },
      { t: 'Fechar +2 novos (setup month)', d: 'Total: 5 clientes. 2 novos em setup. 3 pagando. Setups: R$10k.', dt: '01-30/04', tag: 'sales' },
      { t: 'Publicar primeiro case study', d: 'Cliente #1 com dados reais: antes/depois, ROI, depoimento. LinkedIn + site.', dt: '10/04', tag: 'content' },
      { t: '📐 NeoMKT — MVP Development', d: 'Agendamento de posts, templates por nicho, integração Instagram/Facebook API.', dt: '05-20/04', tag: 'neomkt' },
      { t: '📐 NeoMKT — Dashboard de métricas', d: 'Painel: engajamento, alcance, melhor horário. Integração Meta Business Suite.', dt: '15-30/04', tag: 'neomkt' },
      { t: 'Review financeiro completo', d: 'CAC, LTV, ROAS, ROI front-end. Comparar NeoSale vs CLT.', dt: '30/04', tag: 'finance' },
    ],
  },
  {
    id: 3, month: 'MAI-JUN', full: 'Maio — Junho 2026',
    title: 'ACELERAÇÃO', sub: 'Escalar ads + NeoMKT beta + MRR crescendo',
    color: C.purple, icon: '⚡', ms: 'MRR CRM ultrapassa R$22k', activeMonths: [3, 4],
    tasks: [
      { t: 'Escala horizontal ×5 Meta Ads', d: 'Duplicar vencedores. Budget R$2.5-3k/mês. 80-100 compradores/mês.', dt: '01/05', tag: 'ads' },
      { t: 'Google Ads — busca', d: "'Automação WhatsApp clínica', 'IA agendamento'. R$1k/mês.", dt: '05/05', tag: 'ads' },
      { t: 'Converter compradores em diagnósticos', d: '3-5/semana. 5% dos compradores → cliente NeoCRM.', dt: 'Semanal', tag: 'sales' },
      { t: 'Publicar 2-3 cases', d: 'Clientes com 2-3 meses. Dados robustos para LinkedIn, site, ads.', dt: '15/05', tag: 'content' },
      { t: '📐 NeoMKT — Beta com 3-5 clientes', d: 'Ativar para clientes NeoCRM como beta gratuito. Coletar feedback.', dt: '01/05', tag: 'neomkt' },
      { t: '📐 NeoMKT — Automação tráfego pago', d: 'Criação automática de públicos, sugestão de criativos IA, relatório ROAS.', dt: '15/05-15/06', tag: 'neomkt' },
      { t: '📐 NeoMKT — Definir pricing', d: 'Add-on R$1.000/mês. Bundle NeoCRM + NeoMKT com desconto.', dt: '01/06', tag: 'neomkt' },
      { t: 'Review: condições saída Hapvida', d: 'MRR ≥ R$28k? Projetar 2 meses. Planejar saída Jul.', dt: '30/06', tag: 'finance' },
    ],
  },
  {
    id: 4, month: 'JUL-AGO', full: 'Julho — Agosto 2026',
    title: 'PONTO DE INFLEXÃO', sub: 'Sair da Hapvida + NeoMKT vendendo',
    color: C.gold, icon: '🔥', ms: '🚨 SAIR DA HAPVIDA', activeMonths: [5, 6],
    tasks: [
      { t: '🚨 ENCERRAR CONTRATO HAPVIDA', d: 'MRR NeoSale (CRM+MKT) + setups + low ticket > R$50k. Hapvida R$16k. NeoSale cobre 3x+.', dt: '01/07', tag: 'milestone' },
      { t: 'Contratar Closer (PJ R$2.500)', d: 'Closer assume diagnósticos + fechamento. Bruno foca em produto e conteúdo.', dt: '01/07', tag: 'team' },
      { t: '📐 NeoMKT — Lançamento comercial', d: 'Oferecer como add-on para base. Meta: 2-4 clientes MKT (R$2-4k MRR novo).', dt: '01/07', tag: 'neomkt' },
      { t: '📐 NeoMKT — Upsell base existente', d: 'Campanha interna: 20% desconto primeiro tri. Meta: 5 upsells Jul-Ago.', dt: '15/07', tag: 'neomkt' },
      { t: '📐 NeoMKT — Case study do módulo', d: 'Resultados do beta: engajamento, leads por social, ROAS antes/depois.', dt: '01/08', tag: 'neomkt' },
      { t: 'Escalar ads R$4-5k/mês', d: '150-200 compradores low ticket/mês. Diversificar criativos.', dt: 'Jul-Ago', tag: 'ads' },
      { t: 'Segundo e-book por nicho', d: 'Odonto OU imobiliário. Mesmo funil validado.', dt: '15/07', tag: 'content' },
      { t: 'Mini-curso gravado (R$297)', d: "'IA no WhatsApp em 7 Dias' — 3-4 vídeos evergreen.", dt: '01/08', tag: 'content' },
    ],
  },
  {
    id: 5, month: 'SET-OUT', full: 'Setembro — Outubro 2026',
    title: 'ESCALA TOTAL', sub: 'Sair da C&A — 100% NeoSale AI',
    color: C.pink, icon: '👑', ms: '🚨 SAIR DA C&A', activeMonths: [7, 8],
    tasks: [
      { t: '🚨 ENCERRAR CONTRATO C&A', d: 'MRR CRM R$48k + MKT R$6k = R$54k + setups + low ticket. C&A R$14k. 100% dedicado.', dt: '01/09', tag: 'milestone' },
      { t: 'Contratar CS (PJ R$3.500)', d: 'Onboarding, suporte e retenção dos 16+ clientes.', dt: '01/09', tag: 'team' },
      { t: '📐 NeoMKT — Bundle novos clientes', d: 'Novos entram com NeoCRM + NeoMKT. Ticket sobe para R$3.1-3.2k+.', dt: '01/09', tag: 'neomkt' },
      { t: '📐 NeoMKT — Relatórios automáticos', d: 'Relatório semanal por WhatsApp: leads, agendamentos, engajamento, ROAS.', dt: '15/09', tag: 'neomkt' },
      { t: '📐 NeoMKT — Email marketing', d: 'Integrar automação email + WhatsApp. Sequências cross-channel.', dt: '01/10', tag: 'neomkt' },
      { t: 'Escalar ads R$6-7k/mês', d: '200-300 compradores/mês. YouTube Ads diversificação.', dt: 'Set-Out', tag: 'ads' },
      { t: 'Palestra evento IA/marketing', d: "Case: 'De dev CLT a CEO com IA'. NeoCRM + NeoMKT.", dt: 'Out/26', tag: 'brand' },
      { t: 'Parcerias agências de tráfego', d: 'Agências vendem NeoCRM + NeoMKT → 10-15% recorrente.', dt: 'Set-Out', tag: 'sales' },
    ],
  },
  {
    id: 6, month: 'NOV-DEZ', full: 'Novembro — Dezembro 2026',
    title: 'LIBERDADE', sub: 'Ecossistema completo — meta atingida',
    color: C.green, icon: '🏆', ms: 'R$50k PRÓ-LABORE', activeMonths: [9, 10],
    tasks: [
      { t: '28 clientes total, 25 pagando MRR', d: '3 de Dez em setup. MRR CRM R$80k + MKT R$12k. Pró-labore: R$50k. Lucro empresa guardado.', dt: 'Nov-Dez', tag: 'milestone' },
      { t: '📐 NeoMKT — IA criação de conteúdo', d: 'Gerador de posts e criativos por IA integrado. Diferencial competitivo.', dt: '01/11', tag: 'neomkt' },
      { t: '📐 NeoMKT — Testar standalone', d: 'Venda NeoMKT separado (sem NeoCRM). Novo ICP: quem só quer marketing.', dt: '15/11', tag: 'neomkt' },
      { t: 'Comunidade paga (R$97-197/mês)', d: 'Grupo premium para donos de negócio. Conteúdo, networking, masterclasses.', dt: '01/11', tag: 'product' },
      { t: "Programa 'Implementador NeoSale'", d: 'Certificar profissionais para implementar NeoCRM + NeoMKT.', dt: '01/12', tag: 'product' },
      { t: 'Planejamento 2027', d: 'Meta: R$150k MRR (50 cli). Expansão LATAM. Funding vs bootstrap.', dt: '15/12', tag: 'finance' },
      { t: 'Review contratações 2027', d: 'Dev dedicado, SDR humano, marketing manager. Estrutura para 50 clientes.', dt: '15/12', tag: 'team' },
    ],
  },
];

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
export function fmt(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`;
}

export function fmtFull(v: number): string {
  return v.toLocaleString('pt-BR');
}
