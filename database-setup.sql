-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investors table
CREATE TABLE IF NOT EXISTS investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vc', 'angel', 'incubator', 'accelerator', 'family_office', 'corporate', 'government', 'other')),
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  contact_person TEXT,
  location TEXT,
  investment_focus TEXT[] DEFAULT '{}',
  stage_preference TEXT NOT NULL CHECK (stage_preference IN ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'any')),
  ticket_size_min DECIMAL,
  ticket_size_max DECIMAL,
  ticket_size_currency TEXT DEFAULT 'USD' CHECK (ticket_size_currency IN ('USD', 'INR', 'EUR', 'GBP')),
  status TEXT NOT NULL DEFAULT 'researching' CHECK (status IN ('researching', 'contacted', 'application_submitted', 'meeting_scheduled', 'under_review', 'rejected', 'invested', 'follow_up')),
  notes TEXT,
  next_action TEXT,
  next_action_date DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for investors
CREATE POLICY "Users can view own investors" ON investors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investors" ON investors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investors" ON investors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investors" ON investors
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS investors_user_id_idx ON investors(user_id);
CREATE INDEX IF NOT EXISTS investors_status_idx ON investors(status);
CREATE INDEX IF NOT EXISTS investors_type_idx ON investors(type);
CREATE INDEX IF NOT EXISTS investors_created_at_idx ON investors(created_at);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
