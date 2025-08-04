export interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'etf' | 'bond' | 'crypto' | 'real_estate' | 'gold' | 'other';
  symbol?: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  buyDate: string;
  lastUpdated: string;
  notes?: string;
}

export interface Portfolio {
  investments: Investment[];
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface Transaction {
  id: string;
  investmentId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;
  fees?: number;
  notes?: string;
}

export interface InvestmentFormData {
  name: string;
  type: Investment['type'];
  symbol?: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  buyDate: string;
  notes?: string;
}

export const INVESTMENT_TYPES = [
  { value: 'stock', label: 'Stock' },
  { value: 'mutual_fund', label: 'Mutual Fund' },
  { value: 'etf', label: 'ETF' },
  { value: 'bond', label: 'Bond' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'gold', label: 'Gold' },
  { value: 'other', label: 'Other' },
] as const;
