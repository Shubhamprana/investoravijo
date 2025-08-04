import { useState, useEffect } from 'react';
import { Investor, InvestorOutreach, InvestorFormData } from '@shared/investor';

const STORAGE_KEY = 'avijo_investors';

export function useInvestors() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load investors from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedInvestors = JSON.parse(stored);
        setInvestors(parsedInvestors);
      } catch (error) {
        console.error('Error loading investors:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save investors to localStorage whenever investors change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investors));
    }
  }, [investors, isLoading]);

  const addInvestor = (data: InvestorFormData) => {
    const newInvestor: Investor = {
      id: Date.now().toString(),
      ...data,
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setInvestors(prev => [...prev, newInvestor]);
    return newInvestor;
  };

  const updateInvestor = (id: string, data: Partial<InvestorFormData>) => {
    setInvestors(prev => prev.map(investor => 
      investor.id === id 
        ? { ...investor, ...data, lastUpdated: new Date().toISOString() }
        : investor
    ));
  };

  const deleteInvestor = (id: string) => {
    setInvestors(prev => prev.filter(investor => investor.id !== id));
  };

  const calculateOutreach = (): InvestorOutreach => {
    const byStatus = investors.reduce((acc, investor) => {
      acc[investor.status] = (acc[investor.status] || 0) + 1;
      return acc;
    }, {} as Record<Investor['status'], number>);

    const byType = investors.reduce((acc, investor) => {
      acc[investor.type] = (acc[investor.type] || 0) + 1;
      return acc;
    }, {} as Record<Investor['type'], number>);

    const byStage = investors.reduce((acc, investor) => {
      acc[investor.stagePreference] = (acc[investor.stagePreference] || 0) + 1;
      return acc;
    }, {} as Record<Investor['stagePreference'], number>);

    return {
      investors,
      totalInvestors: investors.length,
      byStatus,
      byType,
      byStage,
    };
  };

  const getInvestorsByStatus = (status: Investor['status']) => {
    return investors.filter(investor => investor.status === status);
  };

  const getRecentlyAdded = (limit: number = 4) => {
    return [...investors]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, limit);
  };

  const getUpcomingActions = (limit: number = 4) => {
    return investors
      .filter(investor => investor.nextAction && investor.nextActionDate)
      .sort((a, b) => {
        const dateA = new Date(a.nextActionDate!).getTime();
        const dateB = new Date(b.nextActionDate!).getTime();
        return dateA - dateB;
      })
      .slice(0, limit);
  };

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Type',
      'Email',
      'Phone',
      'Website',
      'Contact Person',
      'Location',
      'Investment Focus',
      'Stage Preference',
      'Min Ticket Size',
      'Max Ticket Size',
      'Currency',
      'Status',
      'Notes',
      'Next Action',
      'Next Action Date',
      'Date Added',
      'Last Updated',
      'Tags'
    ];

    const csvData = investors.map(investor => [
      investor.name,
      investor.type,
      investor.email,
      investor.phone || '',
      investor.website || '',
      investor.contactPerson || '',
      investor.location || '',
      investor.investmentFocus.join('; '),
      investor.stagePreference,
      investor.ticketSize?.min || '',
      investor.ticketSize?.max || '',
      investor.ticketSize?.currency || '',
      investor.status,
      investor.notes || '',
      investor.nextAction || '',
      investor.nextActionDate || '',
      investor.dateAdded,
      investor.lastUpdated,
      investor.tags?.join('; ') || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avijo_investors_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const searchInvestors = (query: string) => {
    if (!query.trim()) return investors;
    
    const searchTerm = query.toLowerCase();
    return investors.filter(investor => 
      investor.name.toLowerCase().includes(searchTerm) ||
      investor.email.toLowerCase().includes(searchTerm) ||
      investor.type.toLowerCase().includes(searchTerm) ||
      investor.location?.toLowerCase().includes(searchTerm) ||
      investor.contactPerson?.toLowerCase().includes(searchTerm) ||
      investor.investmentFocus.some(focus => focus.toLowerCase().includes(searchTerm)) ||
      investor.status.toLowerCase().includes(searchTerm)
    );
  };

  return {
    investors,
    isLoading,
    addInvestor,
    updateInvestor,
    deleteInvestor,
    calculateOutreach,
    getInvestorsByStatus,
    getRecentlyAdded,
    getUpcomingActions,
    exportToCSV,
    searchInvestors,
  };
}
