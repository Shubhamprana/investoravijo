import { useState, useEffect } from 'react';
import { Investor, InvestorOutreach, InvestorFormData } from '@shared/investor';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function useInvestors() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDbError, setHasDbError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load investors from Supabase on mount
  useEffect(() => {
    if (user) {
      fetchInvestors();
    }
  }, [user]);

  const fetchInvestors = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Fetching investors for user:', user.id);

      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // If no data, just set empty array
      if (!data) {
        setInvestors([]);
        return;
      }

      // Transform database format to our Investor interface
      const transformedInvestors: Investor[] = data.map(dbInvestor => ({
        id: dbInvestor.id,
        name: dbInvestor.name,
        type: dbInvestor.type,
        email: dbInvestor.email,
        phone: dbInvestor.phone,
        website: dbInvestor.website,
        contactPerson: dbInvestor.contact_person,
        location: dbInvestor.location,
        investmentFocus: dbInvestor.investment_focus || [],
        stagePreference: dbInvestor.stage_preference,
        ticketSize: dbInvestor.ticket_size_min || dbInvestor.ticket_size_max ? {
          min: dbInvestor.ticket_size_min || 0,
          max: dbInvestor.ticket_size_max || 0,
          currency: dbInvestor.ticket_size_currency || 'USD'
        } : undefined,
        status: dbInvestor.status,
        notes: dbInvestor.notes,
        nextAction: dbInvestor.next_action,
        nextActionDate: dbInvestor.next_action_date,
        tags: dbInvestor.tags || [],
        dateAdded: dbInvestor.created_at,
        lastUpdated: dbInvestor.updated_at,
      }));

      console.log('Transformed investors:', transformedInvestors);
      setInvestors(transformedInvestors);
    } catch (error: any) {
      console.error('Error fetching investors:', {
        message: error?.message || 'Unknown error',
        error: error,
        stack: error?.stack
      });

      // Check if it's a table not found error
      if (error?.message?.includes('relation "public.investors" does not exist') ||
          error?.message?.includes('table') ||
          error?.code === 'PGRST116') {
        setHasDbError(true);
        toast({
          title: "Database Setup Required",
          description: "Please set up the database tables using the provided SQL schema.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error Loading Data",
          description: error?.message || "Failed to load investors. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addInvestor = async (data: InvestorFormData) => {
    if (!user) return;

    try {
      // Transform our interface to database format
      const dbData = {
        user_id: user.id,
        name: data.name,
        type: data.type,
        email: data.email,
        phone: data.phone,
        website: data.website,
        contact_person: data.contactPerson,
        location: data.location,
        investment_focus: data.investmentFocus,
        stage_preference: data.stagePreference,
        ticket_size_min: data.ticketSize?.min,
        ticket_size_max: data.ticketSize?.max,
        ticket_size_currency: data.ticketSize?.currency,
        status: data.status,
        notes: data.notes,
        next_action: data.nextAction,
        next_action_date: data.nextActionDate,
        tags: data.tags,
      };

      const { data: newInvestor, error } = await supabase
        .from('investors')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform back to our interface and add to state
      const transformedInvestor: Investor = {
        id: newInvestor.id,
        name: newInvestor.name,
        type: newInvestor.type,
        email: newInvestor.email,
        phone: newInvestor.phone,
        website: newInvestor.website,
        contactPerson: newInvestor.contact_person,
        location: newInvestor.location,
        investmentFocus: newInvestor.investment_focus || [],
        stagePreference: newInvestor.stage_preference,
        ticketSize: newInvestor.ticket_size_min || newInvestor.ticket_size_max ? {
          min: newInvestor.ticket_size_min || 0,
          max: newInvestor.ticket_size_max || 0,
          currency: newInvestor.ticket_size_currency || 'USD'
        } : undefined,
        status: newInvestor.status,
        notes: newInvestor.notes,
        nextAction: newInvestor.next_action,
        nextActionDate: newInvestor.next_action_date,
        tags: newInvestor.tags || [],
        dateAdded: newInvestor.created_at,
        lastUpdated: newInvestor.updated_at,
      };

      setInvestors(prev => [transformedInvestor, ...prev]);
      return transformedInvestor;
    } catch (error) {
      console.error('Error adding investor:', error);
      toast({
        title: "Error",
        description: "Failed to add investor. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvestor = async (id: string, data: Partial<InvestorFormData>) => {
    if (!user) return;

    try {
      // Transform our interface to database format
      const dbData: any = {};
      if (data.name !== undefined) dbData.name = data.name;
      if (data.type !== undefined) dbData.type = data.type;
      if (data.email !== undefined) dbData.email = data.email;
      if (data.phone !== undefined) dbData.phone = data.phone;
      if (data.website !== undefined) dbData.website = data.website;
      if (data.contactPerson !== undefined) dbData.contact_person = data.contactPerson;
      if (data.location !== undefined) dbData.location = data.location;
      if (data.investmentFocus !== undefined) dbData.investment_focus = data.investmentFocus;
      if (data.stagePreference !== undefined) dbData.stage_preference = data.stagePreference;
      if (data.ticketSize !== undefined) {
        dbData.ticket_size_min = data.ticketSize.min;
        dbData.ticket_size_max = data.ticketSize.max;
        dbData.ticket_size_currency = data.ticketSize.currency;
      }
      if (data.status !== undefined) dbData.status = data.status;
      if (data.notes !== undefined) dbData.notes = data.notes;
      if (data.nextAction !== undefined) dbData.next_action = data.nextAction;
      if (data.nextActionDate !== undefined) dbData.next_action_date = data.nextActionDate;
      if (data.tags !== undefined) dbData.tags = data.tags;

      const { error } = await supabase
        .from('investors')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setInvestors(prev => prev.map(investor => 
        investor.id === id 
          ? { 
              ...investor, 
              ...data, 
              lastUpdated: new Date().toISOString(),
              // Handle nested ticketSize properly
              ...(data.ticketSize && { ticketSize: data.ticketSize })
            }
          : investor
      ));
    } catch (error) {
      console.error('Error updating investor:', error);
      toast({
        title: "Error",
        description: "Failed to update investor. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteInvestor = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('investors')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setInvestors(prev => prev.filter(investor => investor.id !== id));
    } catch (error) {
      console.error('Error deleting investor:', error);
      toast({
        title: "Error",
        description: "Failed to delete investor. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
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
    hasDbError,
    addInvestor,
    updateInvestor,
    deleteInvestor,
    calculateOutreach,
    getInvestorsByStatus,
    getRecentlyAdded,
    getUpcomingActions,
    exportToCSV,
    searchInvestors,
    refetchInvestors: fetchInvestors,
  };
}
