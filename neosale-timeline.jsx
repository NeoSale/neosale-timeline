import { useState } from "react";

const C = {
  bg: "#06080f", surface: "#0d1117", card: "#161b22", border: "#21262d",
  accent: "#00d4aa", accentDim: "#00d4aa18",
  blue: "#4da6ff", orange: "#ff8c42", purple: "#a78bfa",
  gold: "#fbbf24", red: "#ff6b6b", pink: "#f472b6", green: "#34d399",
  cyan: "#22d3ee", proLabore: "#e879f9",
  text: "#f0f4f8", textSec: "#b0bec5", textMut: "#5a6a7a",
  gray1: "#64748b", gray2: "#8b9bb0",
};

const HPV = 16000, CEA = 14000, SETUP = 5000;

// ═══════════════════════════════════════════════════
// CLIENT TRAJECTORY — new clients per month
// Mês 1 = Setup (no monthly). MRR starts month 2.
// ═══════════════════════════════════════════════════
const trajectory = [
  { m:"FEV", newCli:0, existing:1 }, // Riseon already paying
  { m:"MAR", newCli:2, existing:0 },
  { m:"ABR", newCli:2, existing:0 },
  { m:"MAI", newCli:3, existing:0 },
  { m:"JUN", newCli:2, existing:0 },
  { m:"JUL", newCli:3, existing:0 },
  { m:"AGO", newCli:3, existing:0 },
  { m:"SET", newCli:3, existing:0 },
  { m:"OUT", newCli:3, existing:0 },
  { m:"NOV", newCli:3, existing:0 },
  { m:"DEZ", newCli:3, existing:0 },
];

// Calculate paying clients (those past setup month)
let totalCli = 0;
let payingCli = 0;
const months = trajectory.map((t, i) => {
  // Clients who entered BEFORE this month are paying
  const prevNew = i > 0 ? trajectory[i-1].newCli : 0;
  payingCli += prevNew + (i === 0 ? t.existing : 0);
  totalCli += t.newCli + t.existing;

  return { ...t, totalCli, payingCli, inSetup: t.newCli };
});

// Ticket evolution (CRM only, blended average of paying clients)
const ticketCRM = [1500, 1500, 2300, 2600, 2750, 2800, 2900, 3000, 3100, 3100, 3200];

// NeoMKT: launches Jul (month 5), add-on R$1000/client avg
const mktClients = [0,0,0,0,0, 2,4,6,8,10,12];

// NeoMKT price
const MKT_TICKET = 1000;

// Low ticket revenue
const lowTicket = [0,0,2800,3800,5600,6500,8000,10000,12000,13500,15000];

// Pro-labore target trajectory (from financial planning)
const proLaboreTarget = [800,3000,7000,12000,16800,25000,30000,35000,40000,45000,50000];

// PJ income
const pjIncome = [
  {h:HPV,c:CEA},{h:HPV,c:CEA},{h:HPV,c:CEA},{h:HPV,c:CEA},{h:HPV,c:CEA},
  {h:0,c:CEA},{h:0,c:CEA}, // Jul-Ago: leave Hapvida
  {h:0,c:0},{h:0,c:0},{h:0,c:0},{h:0,c:0} // Sep+: leave C&A
];

// Cost structure
const infraBase = [616,650,700,750,800,900,1000,1100,1200,1300,1496];
const apiPerClient = 60;
const mktSpend = [500,1000,1500,2500,3000,4000,5000,6000,7000,8500,9900];
const taxRate = 0.06;

// Team: Closer Jul (R$2500), CS Sep (R$3500)
const closerCost = [0,0,0,0,0,2500,2500,3000,3000,3000,3500];
const csCost =     [0,0,0,0,0,0,0,3500,3500,4000,4000];

// ═══════════════════════════════════════════════════
// BUILD FINANCIAL DATA
// ═══════════════════════════════════════════════════
const finData = months.map((mo, i) => {
  const mrrCRM = mo.payingCli * ticketCRM[i];
  const mrrMKT = mktClients[i] * MKT_TICKET;
  const setups = mo.newCli * SETUP;
  const lt = lowTicket[i];
  const receitaNeoSale = mrrCRM + mrrMKT + setups + lt;
  const h = pjIncome[i].h, c = pjIncome[i].c;
  const receitaTotal = receitaNeoSale + h + c;

  const impostos = Math.round(receitaNeoSale * taxRate);
  const infra = infraBase[i];
  const apiVar = mo.totalCli * apiPerClient;
  const mkt = mktSpend[i];
  const closer = closerCost[i];
  const cs = csCost[i];
  const custoTotal = impostos + infra + apiVar + mkt + closer + cs;
  const proLabore = proLaboreTarget[i];
  const lucroEmpresa = receitaNeoSale - custoTotal - proLabore;
  const margemLucro = receitaNeoSale > 0 ? lucroEmpresa / receitaNeoSale : 0;

  return {
    m: mo.m, totalCli: mo.totalCli, payingCli: mo.payingCli, inSetup: mo.inSetup,
    ticketAvg: ticketCRM[i], mrrCRM, mrrMKT, setups, lowTicket: lt,
    receitaNeoSale, h, c, receitaTotal,
    impostos, infra, apiVar, mkt, closer, cs, custoTotal,
    proLabore, lucroEmpresa, margemLucro,
  };
});

// ═══════════════════════════════════════════════════
// PHASES
// ═══════════════════════════════════════════════════
const phases = [
  {
    id:0, month:"FEV", full:"Fevereiro 2026", title:"FUNDAÇÃO", sub:"Posicionamento + Processo Comercial", color:C.blue, icon:"🏗️",
    ms:null, activeMonths:[0],
    tasks: [
      { t:"Atualizar perfil LinkedIn completo", d:"Bio: 'Fundador NeoSale AI | IA que vende pelo WhatsApp'. Banner com dados R$826k/ano perdidos.", dt:"17/02", tag:"brand" },
      { t:"Pipeline de vendas no NeoCRM", d:"Pipeline: Lead → Qualificação → Diagnóstico → Proposta → Setup → Ativo.", dt:"18/02", tag:"sales" },
      { t:"Script de diagnóstico gratuito (30 min)", d:"Roteiro: situação atual, dor, métricas, demo NeoSale, proposta com ROI projetado.", dt:"19/02", tag:"sales" },
      { t:"Landing page lp.neosaleai.com.br", d:"Captação com CTA diagnóstico gratuito. Case Riseon R$1M em 30 dias.", dt:"20-21/02", tag:"tech" },
      { t:"Configurar Asaas billing", d:"Setup R$5k (pagamento único) + mensalidade R$3k (início no mês 2). Pix + cartão.", dt:"21/02", tag:"tech" },
      { t:"Conteúdo LinkedIn diário", d:"1 post/dia. DOR → DADO → SOLUÇÃO → CTA. R$826k, ROI 17x, case Riseon.", dt:"24/02", tag:"content" },
      { t:"Prospecção LinkedIn: 50 conexões/semana", d:"10 convites/dia. Donos de clínica estética, odonto, dermatologia SP/RJ/BH.", dt:"24/02", tag:"sales" },
      { t:"WhatsApp Business com IA como demo", d:"NeoSale respondendo leads no WhatsApp da empresa. Prova de conceito viva.", dt:"26/02", tag:"tech" },
      { t:"Proposta comercial PDF", d:"Deck: problema R$826k, NeoCRM + agentes IA, case Riseon, planos, ROI.", dt:"27/02", tag:"sales" },
      { t:"Primeiro carrossel Instagram @neosaleai", d:"'R$826 mil por ano. É isso que a demora no WhatsApp custa.' CTA: DM ou link.", dt:"28/02", tag:"content" },
    ],
  },
  {
    id:1, month:"MAR", full:"Março 2026", title:"PRIMEIROS CLIENTES", sub:"Fechar 2 novos + criar e-book low ticket", color:C.accent, icon:"🎯",
    ms:"Setup 2 clientes novos", activeMonths:[1],
    tasks: [
      { t:"Prospecção ativa LinkedIn (diária)", d:"10 abordagens/dia via DM. SPIN Selling. Agendar diagnósticos.", dt:"01-31/03", tag:"sales" },
      { t:"Fechar 2 novos clientes NeoCRM", d:"Setup R$5k cada (R$10k). Mês 1 = setup, sem mensalidade. MRR começa em Abril.", dt:"01-31/03", tag:"sales" },
      { t:"Onboarding 2 clientes (setup month)", d:"IA SDR + NeoCalendar + NeoFollow. Treinamento 1h. Acompanhamento semanal.", dt:"Semana 1-4", tag:"delivery" },
      { t:"Escrever e-book low ticket", d:"'O Roteiro de WhatsApp que Agenda 3x Mais' — 15-20 scripts de abordagem e follow-up.", dt:"08-10/03", tag:"content" },
      { t:"Publicar e-book Kiwify + funil", d:"R$37. Order bump R$47. Upsell R$197. Upsell R$297. Sequência WhatsApp 14d.", dt:"13-19/03", tag:"tech" },
      { t:"Gravar 5-10 criativos Meta Ads", d:"Vídeos PRSA. Carrossel, vídeo curto, estático. Hooks com dados.", dt:"20-22/03", tag:"content" },
      { t:"📐 NeoMKT — Pesquisa de mercado", d:"Entrevistar clientes NeoCRM: dores com redes sociais, tráfego, relatórios. Validar demanda.", dt:"25-31/03", tag:"neomkt" },
    ],
  },
  {
    id:2, month:"ABR", full:"Abril 2026", title:"LOW TICKET LIVE", sub:"Validar funil + primeiros MRR dos clientes de Mar", color:C.orange, icon:"🚀",
    ms:"Primeiro MRR real: R$6.5k", activeMonths:[2],
    tasks: [
      { t:"Phase 1 — Teste criativos Meta Ads", d:"ABO → 5-10 conjuntos. R$15/dia. CPA ≤R$16, ROI ≥2.0, CTR ≥1.5%.", dt:"01/04", tag:"ads" },
      { t:"Phase 2 — Advantage+ com vencedores", d:"Budget R$37/dia. Dobrar a cada 5 dias se ROI manter acima de 2.0.", dt:"08/04", tag:"ads" },
      { t:"Clientes de Março começam a pagar MRR", d:"2 clientes passam do setup para mensalidade. Riseon + 2 novos = 3 pagando MRR (R$6.5k).", dt:"01/04", tag:"finance" },
      { t:"Fechar +2 novos (setup month)", d:"Total: 5 clientes. 2 novos em setup. 3 pagando. Setups: R$10k.", dt:"01-30/04", tag:"sales" },
      { t:"Publicar primeiro case study", d:"Cliente #1 com dados reais: antes/depois, ROI, depoimento. LinkedIn + site.", dt:"10/04", tag:"content" },
      { t:"📐 NeoMKT — MVP Development", d:"Agendamento de posts, templates por nicho, integração Instagram/Facebook API.", dt:"05-20/04", tag:"neomkt" },
      { t:"📐 NeoMKT — Dashboard de métricas", d:"Painel: engajamento, alcance, melhor horário. Integração Meta Business Suite.", dt:"15-30/04", tag:"neomkt" },
      { t:"Review financeiro completo", d:"CAC, LTV, ROAS, ROI front-end. Comparar NeoSale vs CLT.", dt:"30/04", tag:"finance" },
    ],
  },
  {
    id:3, month:"MAI-JUN", full:"Maio — Junho 2026", title:"ACELERAÇÃO", sub:"Escalar ads + NeoMKT beta + MRR crescendo", color:C.purple, icon:"⚡",
    ms:"MRR CRM ultrapassa R$22k", activeMonths:[3,4],
    tasks: [
      { t:"Escala horizontal ×5 Meta Ads", d:"Duplicar vencedores. Budget R$2.5-3k/mês. 80-100 compradores/mês.", dt:"01/05", tag:"ads" },
      { t:"Google Ads — busca", d:"'Automação WhatsApp clínica', 'IA agendamento'. R$1k/mês.", dt:"05/05", tag:"ads" },
      { t:"Converter compradores em diagnósticos", d:"3-5/semana. 5% dos compradores → cliente NeoCRM.", dt:"Semanal", tag:"sales" },
      { t:"Publicar 2-3 cases", d:"Clientes com 2-3 meses. Dados robustos para LinkedIn, site, ads.", dt:"15/05", tag:"content" },
      { t:"📐 NeoMKT — Beta com 3-5 clientes", d:"Ativar para clientes NeoCRM como beta gratuito. Coletar feedback.", dt:"01/05", tag:"neomkt" },
      { t:"📐 NeoMKT — Automação tráfego pago", d:"Criação automática de públicos, sugestão de criativos IA, relatório ROAS.", dt:"15/05-15/06", tag:"neomkt" },
      { t:"📐 NeoMKT — Definir pricing", d:"Add-on R$1.000/mês. Bundle NeoCRM + NeoMKT com desconto.", dt:"01/06", tag:"neomkt" },
      { t:"Review: condições saída Hapvida", d:"MRR ≥ R$28k? Projetar 2 meses. Planejar saída Jul.", dt:"30/06", tag:"finance" },
    ],
  },
  {
    id:4, month:"JUL-AGO", full:"Julho — Agosto 2026", title:"PONTO DE INFLEXÃO", sub:"Sair da Hapvida + NeoMKT vendendo", color:C.gold, icon:"🔥",
    ms:"🚨 SAIR DA HAPVIDA", activeMonths:[5,6],
    tasks: [
      { t:"🚨 ENCERRAR CONTRATO HAPVIDA", d:"MRR NeoSale (CRM+MKT) + setups + low ticket > R$50k. Hapvida R$16k. NeoSale cobre 3x+.", dt:"01/07", tag:"milestone" },
      { t:"Contratar Closer (PJ R$2.500)", d:"Closer assume diagnósticos + fechamento. Bruno foca em produto e conteúdo.", dt:"01/07", tag:"team" },
      { t:"📐 NeoMKT — Lançamento comercial", d:"Oferecer como add-on para base. Meta: 2-4 clientes MKT (R$2-4k MRR novo).", dt:"01/07", tag:"neomkt" },
      { t:"📐 NeoMKT — Upsell base existente", d:"Campanha interna: 20% desconto primeiro tri. Meta: 5 upsells Jul-Ago.", dt:"15/07", tag:"neomkt" },
      { t:"📐 NeoMKT — Case study do módulo", d:"Resultados do beta: engajamento, leads por social, ROAS antes/depois.", dt:"01/08", tag:"neomkt" },
      { t:"Escalar ads R$4-5k/mês", d:"150-200 compradores low ticket/mês. Diversificar criativos.", dt:"Jul-Ago", tag:"ads" },
      { t:"Segundo e-book por nicho", d:"Odonto OU imobiliário. Mesmo funil validado.", dt:"15/07", tag:"content" },
      { t:"Mini-curso gravado (R$297)", d:"'IA no WhatsApp em 7 Dias' — 3-4 vídeos evergreen.", dt:"01/08", tag:"content" },
    ],
  },
  {
    id:5, month:"SET-OUT", full:"Setembro — Outubro 2026", title:"ESCALA TOTAL", sub:"Sair da C&A — 100% NeoSale AI", color:C.pink, icon:"👑",
    ms:"🚨 SAIR DA C&A", activeMonths:[7,8],
    tasks: [
      { t:"🚨 ENCERRAR CONTRATO C&A", d:"MRR CRM R$48k + MKT R$6k = R$54k + setups + low ticket. C&A R$14k. 100% dedicado.", dt:"01/09", tag:"milestone" },
      { t:"Contratar CS (PJ R$3.500)", d:"Onboarding, suporte e retenção dos 16+ clientes.", dt:"01/09", tag:"team" },
      { t:"📐 NeoMKT — Bundle novos clientes", d:"Novos entram com NeoCRM + NeoMKT. Ticket sobe para R$3.1-3.2k+.", dt:"01/09", tag:"neomkt" },
      { t:"📐 NeoMKT — Relatórios automáticos", d:"Relatório semanal por WhatsApp: leads, agendamentos, engajamento, ROAS.", dt:"15/09", tag:"neomkt" },
      { t:"📐 NeoMKT — Email marketing", d:"Integrar automação email + WhatsApp. Sequências cross-channel.", dt:"01/10", tag:"neomkt" },
      { t:"Escalar ads R$6-7k/mês", d:"200-300 compradores/mês. YouTube Ads diversificação.", dt:"Set-Out", tag:"ads" },
      { t:"Palestra evento IA/marketing", d:"Case: 'De dev CLT a CEO com IA'. NeoCRM + NeoMKT.", dt:"Out/26", tag:"brand" },
      { t:"Parcerias agências de tráfego", d:"Agências vendem NeoCRM + NeoMKT → 10-15% recorrente.", dt:"Set-Out", tag:"sales" },
    ],
  },
  {
    id:6, month:"NOV-DEZ", full:"Novembro — Dezembro 2026", title:"LIBERDADE", sub:"Ecossistema completo — meta atingida", color:C.green, icon:"🏆",
    ms:"R$50k PRÓ-LABORE", activeMonths:[9,10],
    tasks: [
      { t:"28 clientes total, 25 pagando MRR", d:"3 de Dez em setup. MRR CRM R$80k + MKT R$12k. Pró-labore: R$50k. Lucro empresa guardado.", dt:"Nov-Dez", tag:"milestone" },
      { t:"📐 NeoMKT — IA criação de conteúdo", d:"Gerador de posts e criativos por IA integrado. Diferencial competitivo.", dt:"01/11", tag:"neomkt" },
      { t:"📐 NeoMKT — Testar standalone", d:"Venda NeoMKT separado (sem NeoCRM). Novo ICP: quem só quer marketing.", dt:"15/11", tag:"neomkt" },
      { t:"Comunidade paga (R$97-197/mês)", d:"Grupo premium para donos de negócio. Conteúdo, networking, masterclasses.", dt:"01/11", tag:"product" },
      { t:"Programa 'Implementador NeoSale'", d:"Certificar profissionais para implementar NeoCRM + NeoMKT.", dt:"01/12", tag:"product" },
      { t:"Planejamento 2027", d:"Meta: R$150k MRR (50 cli). Expansão LATAM. Funding vs bootstrap.", dt:"15/12", tag:"finance" },
      { t:"Review contratações 2027", d:"Dev dedicado, SDR humano, marketing manager. Estrutura para 50 clientes.", dt:"15/12", tag:"team" },
    ],
  },
];

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function fmt(v) { return v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`; }
function fmtFull(v) { return v.toLocaleString("pt-BR"); }

const tagConfig = {
  brand:{ icon:"🎨", label:"Marca", color:C.purple },
  content:{ icon:"✍️", label:"Conteúdo", color:C.blue },
  sales:{ icon:"💰", label:"Vendas", color:C.gold },
  tech:{ icon:"⚙️", label:"Técnico", color:C.textSec },
  ads:{ icon:"📡", label:"Tráfego", color:C.orange },
  delivery:{ icon:"📦", label:"Entrega", color:C.accent },
  neomkt:{ icon:"📐", label:"NeoMKT", color:C.cyan },
  finance:{ icon:"📊", label:"Financeiro", color:C.green },
  milestone:{ icon:"🚨", label:"Marco", color:C.red },
  team:{ icon:"👥", label:"Time", color:C.pink },
  product:{ icon:"🧩", label:"Produto", color:C.purple },
};

// ═══════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════
function RevenueChart({ activePhaseId }) {
  const maxT = Math.max(...finData.map(d => d.receitaTotal));
  const maxH = 210;
  const hl = phases[activePhaseId].activeMonths;

  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:"32px 28px" }}>
      <div style={{ fontSize:20, fontWeight:800, letterSpacing:2, color:C.gold, fontFamily:"monospace", marginBottom:28 }}>
        💰 RECEITA vs PRÓ-LABORE — FEV A DEZ 2026
      </div>
      <div style={{ display:"flex", gap:3, alignItems:"flex-end", marginBottom:24, overflowX:"auto" }}>
        {finData.map((d, i) => {
          const on = hl.includes(i);
          const bH = v => Math.max((v / maxT) * maxH, v > 0 ? 4 : 0);
          const plH = bH(d.proLabore);
          return (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, minWidth:62, opacity:on?1:0.3, transition:"opacity 0.4s" }}>
              <div style={{ fontSize:14, fontWeight:800, color:on?C.text:C.textMut, fontFamily:"monospace", marginBottom:8 }}>
                {fmt(d.receitaTotal)}
              </div>
              <div style={{ display:"flex", gap:3, alignItems:"flex-end" }}>
                {/* Revenue bar */}
                <div style={{ display:"flex", flexDirection:"column-reverse", width:30, borderRadius:"6px 6px 0 0", overflow:"hidden" }}>
                  {d.h > 0 && <div style={{ height:bH(d.h), background:C.gray1 }} />}
                  {d.c > 0 && <div style={{ height:bH(d.c), background:C.gray2 }} />}
                  {d.mrrCRM > 0 && <div style={{ height:bH(d.mrrCRM), background:C.accent }} />}
                  {d.mrrMKT > 0 && <div style={{ height:bH(d.mrrMKT), background:C.cyan }} />}
                  {d.setups > 0 && <div style={{ height:bH(d.setups), background:"#8b5cf6" }} />}
                  {d.lowTicket > 0 && <div style={{ height:bH(d.lowTicket), background:C.orange }} />}
                </div>
                {/* Pro-labore bar */}
                <div style={{ width:14, height:plH, background:`${C.proLabore}cc`, borderRadius:"4px 4px 0 0", border:`1px solid ${C.proLabore}44`, position:"relative" }}>
                  {on && <div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)", fontSize:10, fontWeight:800, color:C.proLabore, fontFamily:"monospace", whiteSpace:"nowrap" }}>
                    {fmt(d.proLabore)}
                  </div>}
                </div>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:on?C.text:C.textMut, marginTop:10, fontFamily:"monospace" }}>
                {d.m}
              </div>
              {/* Client info */}
              <div style={{ fontSize:11, color:on?C.textSec:C.textMut, marginTop:4 }}>
                {d.payingCli}p {d.inSetup > 0 ? `+${d.inSetup}s` : ""}
              </div>
              {i===5 && <div style={{ fontSize:11, color:C.red, fontWeight:800, marginTop:4, fontFamily:"monospace" }}>✕ HPV</div>}
              {i===7 && <div style={{ fontSize:11, color:C.red, fontWeight:800, marginTop:4, fontFamily:"monospace" }}>✕ C&A</div>}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
        {[
          { l:"Hapvida R$16k", c:C.gray1 }, { l:"C&A R$14k", c:C.gray2 },
          { l:"NeoCRM MRR", c:C.accent }, { l:"NeoMKT MRR", c:C.cyan },
          { l:"Setups (R$5k/cli)", c:"#8b5cf6" }, { l:"Low Ticket", c:C.orange },
          { l:"Pró-labore", c:C.proLabore },
        ].map((x,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:13, height:13, borderRadius:3, background:x.c }} />
            <span style={{ fontSize:14, color:C.textSec, fontWeight:600 }}>{x.l}</span>
          </div>
        ))}
        <div style={{ marginLeft:"auto", fontSize:13, color:C.textMut }}>
          <strong>p</strong>=pagando MRR &nbsp; <strong>s</strong>=em setup
        </div>
      </div>
    </div>
  );
}

function PLCard({ phaseId }) {
  const am = phases[phaseId].activeMonths;
  const d = finData[am[am.length - 1]];
  const col = phases[phaseId].color;

  const lines = [
    { label:`NeoCRM MRR (${d.payingCli} clientes pagando)`, val:d.mrrCRM, color:C.accent },
    ...(d.mrrMKT > 0 ? [{ label:`NeoMKT MRR (${mktClients[am[am.length-1]]} clientes)`, val:d.mrrMKT, color:C.cyan }] : []),
    { label:`Setups (${d.inSetup} novos × R$5k)`, val:d.setups, color:"#8b5cf6" },
    ...(d.lowTicket > 0 ? [{ label:"Low Ticket (e-books + upsells)", val:d.lowTicket, color:C.orange }] : []),
    { label:"RECEITA NEOSALE", val:d.receitaNeoSale, color:C.text, bold:true, sep:true },
    { label:`(-) Impostos 6%`, val:-d.impostos, color:C.red },
    { label:"(-) Infra (servidor, DB)", val:-d.infra, color:C.red },
    { label:`(-) API variável (${d.totalCli} cli × R$60)`, val:-d.apiVar, color:C.red },
    { label:"(-) Marketing/Ads", val:-d.mkt, color:C.red },
    ...(d.closer > 0 ? [{ label:"(-) Closer PJ", val:-d.closer, color:C.red }] : []),
    ...(d.cs > 0 ? [{ label:"(-) CS PJ", val:-d.cs, color:C.red }] : []),
    { label:"CUSTO TOTAL", val:-d.custoTotal, color:C.red, bold:true, sep:true },
    { label:"PRÓ-LABORE BRUNO", val:-d.proLabore, color:C.proLabore, bold:true, sep:true },
    { label:"LUCRO EMPRESA", val:d.lucroEmpresa, color:d.lucroEmpresa >= 0 ? C.green : C.red, bold:true, sep:true },
  ];

  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:17, fontWeight:800, letterSpacing:2, color:col, fontFamily:"monospace" }}>📊 DRE — {d.m}/2026</div>
        <div style={{ fontSize:13, color:C.textMut }}>{d.totalCli} total · {d.payingCli} pagando · {d.inSetup} setup</div>
      </div>
      {lines.map((l, i) => (
        <div key={i}>
          {l.sep && <div style={{ height:1, background:C.border, margin:"8px 0" }} />}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", alignItems:"center" }}>
            <span style={{ fontSize:l.bold?16:14, fontWeight:l.bold?800:500, color:l.bold?C.text:C.textSec }}>{l.label}</span>
            <span style={{ fontSize:l.bold?19:15, fontWeight:l.bold?800:600, color:l.color, fontFamily:"monospace" }}>
              {l.val >= 0 ? "" : "- "}R$ {fmtFull(Math.abs(l.val))}
            </span>
          </div>
        </div>
      ))}
      {d.margemLucro !== 0 && (
        <div style={{ marginTop:14, padding:"10px 16px", background:`${d.lucroEmpresa >= 0 ? C.green : C.red}12`, border:`1px solid ${d.lucroEmpresa >= 0 ? C.green : C.red}30`, borderRadius:12, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:14, color:C.textSec }}>Margem líquida empresa</span>
          <span style={{ fontSize:18, fontWeight:800, color:d.lucroEmpresa >= 0 ? C.green : C.red, fontFamily:"monospace" }}>{(d.margemLucro * 100).toFixed(1)}%</span>
        </div>
      )}
      {(d.h > 0 || d.c > 0) && (
        <div style={{ marginTop:10, padding:"10px 16px", background:`${C.gray1}12`, border:`1px solid ${C.border}`, borderRadius:12 }}>
          <div style={{ fontSize:13, color:C.textMut, marginBottom:4 }}>+ Renda PJ</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            {d.h > 0 && <span style={{ fontSize:14, color:C.gray1, fontFamily:"monospace" }}>Hapvida R${fmt(d.h)}</span>}
            {d.c > 0 && <span style={{ fontSize:14, color:C.gray2, fontFamily:"monospace" }}>C&A R${fmt(d.c)}</span>}
            <span style={{ fontSize:14, fontWeight:700, color:C.text, fontFamily:"monospace", marginLeft:"auto" }}>
              Renda pessoal: R${fmt(d.proLabore + d.h + d.c)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, index, color }) {
  const tc = tagConfig[task.tag] || { icon:"📌", label:"Geral", color:C.textSec };
  const isMKT = task.tag === "neomkt";
  return (
    <div style={{
      background: isMKT ? `${C.cyan}08` : C.card,
      border:`1px solid ${isMKT ? `${C.cyan}30` : C.border}`,
      borderRadius:16, padding:"20px 24px", borderLeft:`5px solid ${isMKT ? C.cyan : color}`,
    }}>
      <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
        <div style={{
          flexShrink:0, width:42, height:42, borderRadius:10,
          background:`${isMKT?C.cyan:color}18`, border:`2px solid ${isMKT?C.cyan:color}35`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, fontWeight:800, color:isMKT?C.cyan:color, fontFamily:"monospace",
        }}>{index+1}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:1, color:tc.color, background:`${tc.color}15`, padding:"2px 8px", borderRadius:5, fontFamily:"monospace" }}>
              {tc.icon} {tc.label.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize:18, fontWeight:700, color:C.text, lineHeight:1.4, marginBottom:6 }}>{task.t}</div>
          <div style={{ fontSize:15, color:C.textSec, lineHeight:1.7, marginBottom:12 }}>{task.d}</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${isMKT?C.cyan:color}12`, border:`1px solid ${isMKT?C.cyan:color}25`, borderRadius:10, padding:"6px 14px" }}>
            <span style={{ fontSize:14 }}>📅</span>
            <span style={{ fontSize:15, fontWeight:700, color:isMKT?C.cyan:color, fontFamily:"monospace" }}>{task.dt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════
export default function NeoSaleTimeline() {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState("all");
  const p = phases[active];
  const am = p.activeMonths;
  const d = finData[am[am.length-1]];

  const filteredTasks = filter === "all" ? p.tasks : p.tasks.filter(t => t.tag === filter);
  const neoMKTCount = p.tasks.filter(t => t.tag === "neomkt").length;

  const accReceita = finData.reduce((s,d) => s + d.receitaNeoSale, 0);
  const accPL = finData.reduce((s,d) => s + d.proLabore, 0);
  const accLucro = finData.reduce((s,d) => s + d.lucroEmpresa, 0);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", padding:"32px 20px", fontFamily:"-apple-system, 'Segoe UI', system-ui, sans-serif", color:C.text }}>
      <style>{`
        @keyframes fadeSlide { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:7px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
      `}</style>

      {/* HEADER */}
      <div style={{ maxWidth:1300, margin:"0 auto 28px", textAlign:"center" }}>
        <div style={{ display:"inline-block", fontSize:14, fontWeight:800, letterSpacing:3, color:C.accent, fontFamily:"monospace", background:C.accentDim, padding:"8px 22px", borderRadius:24, marginBottom:16 }}>
          ROADMAP NEOSALE AI — 2026
        </div>
        <h1 style={{ fontSize:"clamp(26px,4.5vw,44px)", fontWeight:700, lineHeight:1.15, margin:"0 0 12px", background:`linear-gradient(135deg, ${C.text}, ${C.accent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          De Dev PJ a CEO da NeoSale em 10 Meses
        </h1>
        <p style={{ fontSize:18, color:C.textSec, maxWidth:900, margin:"0 auto", lineHeight:1.6 }}>
          <strong style={{color:C.accent}}>NeoCRM</strong> (carro-chefe) + <strong style={{color:C.cyan}}>NeoMKT</strong> (marketing) · Setup R$5k + 6 parcelas R$3k · Meta: R$50k pró-labore Dez/26
        </p>
      </div>

      {/* TIMELINE NAV */}
      <div style={{ maxWidth:1300, margin:"0 auto 28px" }}>
        <div style={{ display:"flex", overflowX:"auto", position:"relative", paddingBottom:12 }}>
          <div style={{ position:"absolute", top:26, left:40, right:40, height:4, background:C.border, zIndex:0, borderRadius:2 }} />
          <div style={{ position:"absolute", top:26, left:40, width:`${(active/(phases.length-1))*100}%`, maxWidth:"calc(100% - 80px)", height:4, background:`linear-gradient(90deg, ${C.blue}, ${C.accent}, ${C.gold}, ${C.green})`, zIndex:1, borderRadius:2, transition:"width 0.5s ease" }} />
          {phases.map((ph,i) => {
            const on = i === active, past = i < active;
            return (
              <div key={i} onClick={() => { setActive(i); setFilter("all"); }} style={{ flex:1, minWidth:108, display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", position:"relative", zIndex:2, padding:"0 4px" }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:on?ph.color:past?`${ph.color}55`:C.surface, border:`3px solid ${on?ph.color:past?ph.color:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, transition:"all 0.3s", boxShadow:on?`0 0 28px ${ph.color}44`:"none" }}>{ph.icon}</div>
                <div style={{ fontSize:14, fontWeight:800, letterSpacing:1, color:on?ph.color:C.textMut, fontFamily:"monospace", marginTop:10 }}>{ph.month}</div>
                <div style={{ fontSize:14, color:on?C.text:C.textMut, marginTop:3, fontWeight:on?700:400, textAlign:"center" }}>{ph.title}</div>
                {ph.ms && <div style={{ fontSize:11, fontWeight:800, textAlign:"center", marginTop:4, color:ph.ms.includes("🚨")?C.red:C.gold, fontFamily:"monospace", maxWidth:130 }}>{ph.ms.replace("🚨 ","")}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* REVENUE CHART */}
      <div style={{ maxWidth:1300, margin:"0 auto 28px" }}>
        <RevenueChart activePhaseId={active} />
      </div>

      <div style={{ maxWidth:1300, margin:"0 auto" }} key={active}>
        {/* PHASE HEADER */}
        <div style={{ background:`${p.color}08`, border:`1px solid ${p.color}25`, borderRadius:18, padding:"24px 32px", marginBottom:24, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap", animation:"fadeSlide 0.35s ease" }}>
          <span style={{ fontSize:50 }}>{p.icon}</span>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ fontSize:16, fontWeight:800, letterSpacing:2, color:p.color, fontFamily:"monospace" }}>FASE {p.id+1} — {p.full}</div>
            <div style={{ fontSize:28, fontWeight:700, color:C.text, marginTop:4 }}>{p.title}</div>
            <div style={{ fontSize:17, color:C.textSec, marginTop:2 }}>{p.sub}</div>
          </div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {[
              { label:"PAGANDO", value:d.payingCli, sub:d.inSetup > 0 ? `+${d.inSetup} setup` : "", color:C.gold },
              { label:"MRR CRM", value:`R$${fmt(d.mrrCRM)}`, color:C.accent },
              { label:"MRR MKT", value:d.mrrMKT > 0 ? `R$${fmt(d.mrrMKT)}` : "—", color:C.cyan },
              { label:"PRÓ-LABORE", value:`R$${fmt(d.proLabore)}`, color:C.proLabore },
            ].map((k,i) => (
              <div key={i} style={{ textAlign:"center", minWidth:80 }}>
                <div style={{ fontSize:12, color:C.textMut, fontWeight:700 }}>{k.label}</div>
                <div style={{ fontSize:24, fontWeight:800, color:k.color, fontFamily:"monospace" }}>{k.value}</div>
                {k.sub && <div style={{ fontSize:11, color:C.textMut }}>{k.sub}</div>}
              </div>
            ))}
          </div>
          {p.ms && (
            <div style={{ background:p.ms.includes("🚨")?`${C.red}12`:`${C.gold}12`, border:`2px solid ${p.ms.includes("🚨")?C.red:C.gold}44`, borderRadius:14, padding:"12px 20px" }}>
              <div style={{ fontSize:18, fontWeight:800, color:p.ms.includes("🚨")?C.red:C.gold, fontFamily:"monospace" }}>{p.ms}</div>
            </div>
          )}
        </div>

        {/* TWO COLUMNS */}
        <div style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:20, alignItems:"start", animation:"fadeSlide 0.35s ease" }}>
          {/* LEFT: P&L + Exits + Accumulated */}
          <div style={{ position:"sticky", top:16 }}>
            <PLCard phaseId={active} />
            <div style={{ marginTop:16, background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:20 }}>
              <div style={{ fontSize:15, fontWeight:800, letterSpacing:2, color:C.red, fontFamily:"monospace", marginBottom:14 }}>🚪 SAÍDAS</div>
              {[
                { l:"Hapvida", pay:"R$16k", when:"Jul/26", color:C.orange, done:active>=4 },
                { l:"C&A", pay:"R$14k", when:"Set/26", color:C.pink, done:active>=5 },
              ].map((e,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:12, background:e.done?`${e.color}10`:"transparent", border:`1px solid ${e.done?e.color:C.border}44`, marginBottom:6 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", border:`3px solid ${e.done?e.color:C.textMut}`, background:e.done?e.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#fff", flexShrink:0 }}>{e.done?"✓":""}</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:e.done?e.color:C.textSec, textDecoration:e.done?"line-through":"none" }}>{e.l} ({e.pay})</div>
                    <div style={{ fontSize:12, color:C.textMut }}>{e.when}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, background:`linear-gradient(135deg, ${C.accentDim}, ${C.goldDim})`, border:`1px solid ${C.accent}30`, borderRadius:18, padding:20 }}>
              <div style={{ fontSize:13, fontWeight:800, letterSpacing:2, color:C.accent, fontFamily:"monospace", marginBottom:12 }}>📈 ACUMULADO 2026</div>
              {[
                { l:"Receita NeoSale", v:accReceita, c:C.text },
                { l:"Pró-labore Bruno", v:accPL, c:C.proLabore },
                { l:"Lucro na empresa", v:accLucro, c:C.green },
              ].map((x,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0" }}>
                  <span style={{ fontSize:14, color:C.textSec }}>{x.l}</span>
                  <span style={{ fontSize:16, fontWeight:800, color:x.c, fontFamily:"monospace" }}>R$ {fmtFull(x.v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Tasks */}
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ fontSize:17, fontWeight:800, letterSpacing:2, color:p.color, fontFamily:"monospace", marginRight:10 }}>📋 {filteredTasks.length} TAREFAS</div>
              {["all", ...(neoMKTCount > 0 ? ["neomkt"] : []), "sales", "ads", "content", "tech", "finance"].filter(f => f === "all" || p.tasks.some(t => t.tag === f)).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? (f === "neomkt" ? C.cyan : p.color) : "transparent",
                  color: filter === f ? "#fff" : C.textMut,
                  border:`1px solid ${filter === f ? "transparent" : C.border}`,
                  borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:700,
                  cursor:"pointer", fontFamily:"monospace",
                }}>
                  {f === "all" ? "TODAS" : f === "neomkt" ? `📐 MKT (${neoMKTCount})` : (tagConfig[f]?.icon||"") + " " + (tagConfig[f]?.label?.toUpperCase()||f.toUpperCase())}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {filteredTasks.map((task, i) => <TaskCard key={i} task={task} index={i} color={p.color} />)}
            </div>
          </div>
        </div>

        {/* PRINCIPLE */}
        <div style={{ marginTop:28, borderRadius:18, padding:32, textAlign:"center", background:`linear-gradient(135deg, ${C.accentDim}, ${C.goldDim})`, border:`1px solid ${C.accent}30`, animation:"fadeSlide 0.35s ease" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🧠</div>
          <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:10 }}>
            Modelo: Setup R$5k (mês 1, sem mensalidade) → 6 parcelas de R$3k (meses 2-7)
          </div>
          <div style={{ fontSize:16, color:C.textSec, lineHeight:1.7, maxWidth:900, margin:"0 auto" }}>
            Clientes novos pagam setup no mês de entrada. MRR começa no mês seguinte. Por isso em Dezembro temos 28 clientes totais mas 25 pagando MRR (3 entraram em Dez).
            Bruno é o canal de aquisição → <span style={{color:C.accent}}>NeoCRM</span> + <span style={{color:C.cyan}}>NeoMKT</span> = ecossistema que aumenta ticket e cria lock-in.
          </div>
        </div>
      </div>
    </div>
  );
}
