import { useState, useEffect } from 'react';
import { Investment, Portfolio, InvestmentFormData } from '@shared/investment';

const STORAGE_KEY = 'avijo_investments';

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load investments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedInvestments = JSON.parse(stored);
        setInvestments(parsedInvestments);
      } catch (error) {
        console.error('Error loading investments:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save investments to localStorage whenever investments change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
    }
  }, [investments, isLoading]);

  const addInvestment = (data: InvestmentFormData) => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setInvestments(prev => [...prev, newInvestment]);
    return newInvestment;
  };

  const updateInvestment = (id: string, data: Partial<InvestmentFormData>) => {
    setInvestments(prev => prev.map(investment => 
      investment.id === id 
        ? { ...investment, ...data, lastUpdated: new Date().toISOString() }
        : investment
    ));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(investment => investment.id !== id));
  };

  const updateCurrentPrice = (id: string, currentPrice: number) => {
    setInvestments(prev => prev.map(investment => 
      investment.id === id 
        ? { ...investment, currentPrice, lastUpdated: new Date().toISOString() }
        : investment
    ));
  };

  const calculatePortfolio = (): Portfolio => {
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.quantity * inv.buyPrice), 0);
    const currentValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
    const totalGainLoss = currentValue - totalInvested;
    const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      investments,
      totalInvested,
      currentValue,
      totalGainLoss,
      totalGainLossPercentage,
    };
  };

  const getTopPerformers = (limit: number = 4) => {
    return [...investments]
      .map(inv => ({
        ...inv,
        gainLoss: (inv.currentPrice - inv.buyPrice) * inv.quantity,
        gainLossPercentage: ((inv.currentPrice - inv.buyPrice) / inv.buyPrice) * 100,
      }))
      .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage)
      .slice(0, limit);
  };

  const getRecentActivity = (limit: number = 4) => {
    return [...investments]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit);
  };

  return {
    investments,
    isLoading,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    updateCurrentPrice,
    calculatePortfolio,
    getTopPerformers,
    getRecentActivity,
  };
}
