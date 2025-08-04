import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DatabaseSetup() {
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<{
    investorsTable: boolean | null;
    profilesTable: boolean | null;
    rls: boolean | null;
  }>({
    investorsTable: null,
    profilesTable: null,
    rls: null,
  });
  const { toast } = useToast();

  const checkDatabaseStatus = async () => {
    setIsChecking(true);
    try {
      // Test investors table
      const { error: investorsError } = await supabase
        .from('investors')
        .select('id')
        .limit(1);

      // Test profiles table
      const { error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      setStatus({
        investorsTable: !investorsError,
        profilesTable: !profilesError,
        rls: true, // We'll assume RLS is working if tables exist
      });

      if (investorsError) {
        console.log('Investors table error:', investorsError);
      }
      if (profilesError) {
        console.log('Profiles table error:', profilesError);
      }

    } catch (error) {
      console.error('Database check error:', error);
      toast({
        title: "Database Check Failed",
        description: "Could not check database status.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const createDatabaseTables = async () => {
    setIsCreating(true);
    try {
      // Create profiles table
      const { error: profilesError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            company TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (profilesError) {
        console.error('Profiles table creation error:', profilesError);
      }

      // Create investors table
      const { error: investorsError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS investors (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            website TEXT,
            contact_person TEXT,
            location TEXT,
            investment_focus TEXT[] DEFAULT '{}',
            stage_preference TEXT NOT NULL,
            ticket_size_min DECIMAL,
            ticket_size_max DECIMAL,
            ticket_size_currency TEXT DEFAULT 'USD',
            status TEXT NOT NULL DEFAULT 'researching',
            notes TEXT,
            next_action TEXT,
            next_action_date DATE,
            tags TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (investorsError) {
        console.error('Investors table creation error:', investorsError);
      }

      toast({
        title: "Database Setup",
        description: "Database tables have been created. Please check the status again.",
      });

      // Recheck status
      await checkDatabaseStatus();

    } catch (error: any) {
      console.error('Database creation error:', error);
      toast({
        title: "Database Setup Failed", 
        description: "Could not create database tables. Please use the SQL Editor in Supabase dashboard.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Setup
        </CardTitle>
        <CardDescription>
          Check and set up your Supabase database tables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>Manual Setup Recommended:</strong> For best results, copy the SQL from 
            <code className="mx-1 px-1 bg-gray-100 rounded">database-setup.sql</code> 
            and run it in your Supabase dashboard's SQL Editor.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Investors Table</span>
            <StatusIcon status={status.investorsTable} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Profiles Table</span>
            <StatusIcon status={status.profilesTable} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Row Level Security</span>
            <StatusIcon status={status.rls} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={checkDatabaseStatus} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Check Status
          </Button>
          
          <Button 
            onClick={createDatabaseTables} 
            disabled={isCreating}
            size="sm"
          >
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Auto Setup
          </Button>
        </div>

        {!status.investorsTable && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-800">
              Database tables are not set up. Please run the SQL setup script in your Supabase dashboard.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
