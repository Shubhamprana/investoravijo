export interface Investor {
  id: string;
  name: string;
  type: 'vc' | 'angel' | 'incubator' | 'accelerator' | 'family_office' | 'corporate' | 'government' | 'other';
  email: string;
  phone?: string;
  website?: string;
  contactPerson?: string;
  location?: string;
  investmentFocus: string[];
  stagePreference: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'any';
  ticketSize?: {
    min: number;
    max: number;
    currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  };
  status: 'researching' | 'contacted' | 'application_submitted' | 'meeting_scheduled' | 'under_review' | 'rejected' | 'invested' | 'follow_up';
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  dateAdded: string;
  lastUpdated: string;
  tags?: string[];
}

export interface InvestorFormData {
  name: string;
  type: Investor['type'];
  email: string;
  phone?: string;
  website?: string;
  contactPerson?: string;
  location?: string;
  investmentFocus: string[];
  stagePreference: Investor['stagePreference'];
  ticketSize?: {
    min: number;
    max: number;
    currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  };
  status: Investor['status'];
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  tags?: string[];
}

export interface InvestorOutreach {
  investors: Investor[];
  totalInvestors: number;
  byStatus: Record<Investor['status'], number>;
  byType: Record<Investor['type'], number>;
  byStage: Record<Investor['stagePreference'], number>;
}

export const INVESTOR_TYPES = [
  { value: 'vc', label: 'Venture Capital' },
  { value: 'angel', label: 'Angel Investor' },
  { value: 'incubator', label: 'Incubator' },
  { value: 'accelerator', label: 'Accelerator' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'corporate', label: 'Corporate VC' },
  { value: 'government', label: 'Government Fund' },
  { value: 'other', label: 'Other' },
] as const;

export const STAGE_PREFERENCES = [
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'series_c', label: 'Series C+' },
  { value: 'growth', label: 'Growth' },
  { value: 'any', label: 'Any Stage' },
] as const;

export const INVESTOR_STATUSES = [
  { value: 'researching', label: 'Researching' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'application_submitted', label: 'Application Submitted' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'invested', label: 'Invested' },
  { value: 'follow_up', label: 'Follow Up' },
] as const;

export const INVESTMENT_FOCUS_OPTIONS = [
  'AI/ML',
  'B2B SaaS',
  'Consumer Tech',
  'E-commerce',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Digital Health',
  'Healthcare',
  'Enterprise Software',
  'Mobile Apps',
  'IoT',
  'Blockchain',
  'Cybersecurity',
  'Gaming',
  'Media & Entertainment',
  'Real Estate Tech',
  'AgTech',
  'CleanTech',
  'Transportation',
  'Food & Beverage',
  'Retail',
  'Manufacturing',
  'Other'
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
] as const;
