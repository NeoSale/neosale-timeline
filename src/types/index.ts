export interface Task {
  t: string;   // title
  d: string;   // description
  dt: string;  // date
  tag: string; // tag key
}

export interface Phase {
  id: number;
  month: string;
  full: string;
  title: string;
  sub: string;
  color: string;
  icon: string;
  ms: string | null;
  activeMonths: number[];
  tasks: Task[];
}

export interface MonthData {
  m: string;
  totalCli: number;
  payingCli: number;
  inSetup: number;
  ticketAvg: number;
  mrrCRM: number;
  mrrMKT: number;
  setups: number;
  lowTicket: number;
  receitaNeoSale: number;
  h: number;
  c: number;
  receitaTotal: number;
  impostos: number;
  infra: number;
  apiVar: number;
  mkt: number;
  closer: number;
  cs: number;
  custoTotal: number;
  proLabore: number;
  lucroEmpresa: number;
  margemLucro: number;
}

export interface TagConfigItem {
  icon: string;
  label: string;
  color: string;
}

export type TagKey =
  | 'brand'
  | 'content'
  | 'sales'
  | 'tech'
  | 'ads'
  | 'delivery'
  | 'neomkt'
  | 'finance'
  | 'milestone'
  | 'team'
  | 'product';
