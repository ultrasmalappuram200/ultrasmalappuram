-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create standings table
CREATE TABLE IF NOT EXISTS public.standings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club TEXT NOT NULL,
  logo TEXT,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  draw INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  gf INTEGER DEFAULT 0, -- Goals For
  ga INTEGER DEFAULT 0, -- Goals Against
  gd INTEGER DEFAULT 0, -- Goal Difference
  points INTEGER DEFAULT 0,
  last5 TEXT[] DEFAULT '{}', -- Last 5 results: W, D, L
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_image TEXT,
  away_image TEXT,
  venue TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  home_goals INTEGER,
  away_goals INTEGER,
  highlight TEXT,
  is_finished BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Standings policies (public read, admin write)
CREATE POLICY "Anyone can view standings" ON public.standings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert standings" ON public.standings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update standings" ON public.standings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete standings" ON public.standings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Matches policies (public read, admin write)
CREATE POLICY "Anyone can view matches" ON public.matches
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert matches" ON public.matches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update matches" ON public.matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete matches" ON public.matches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_standings_updated_at
  BEFORE UPDATE ON public.standings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_standings_points ON public.standings(points DESC, gd DESC);
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(date);
CREATE INDEX IF NOT EXISTS idx_matches_finished ON public.matches(is_finished);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Insert sample data
INSERT INTO public.standings (club, played, won, draw, lost, gf, ga, gd, points, last5) VALUES
('Malappuram FC', 5, 3, 1, 1, 8, 4, 4, 10, ARRAY['W', 'D', 'W', 'L', 'W']),
('Kochi United', 5, 2, 2, 1, 6, 5, 1, 8, ARRAY['D', 'W', 'D', 'W', 'L']),
('Thiruvananthapuram FC', 5, 2, 1, 2, 7, 6, 1, 7, ARRAY['L', 'W', 'D', 'L', 'W']),
('Kozhikode City', 5, 1, 3, 1, 5, 4, 1, 6, ARRAY['D', 'D', 'W', 'D', 'L']),
('Thrissur FC', 5, 1, 2, 2, 4, 6, -2, 5, ARRAY['L', 'D', 'L', 'W', 'D']),
('Kannur FC', 5, 0, 1, 4, 2, 9, -7, 1, ARRAY['L', 'L', 'D', 'L', 'L'])
ON CONFLICT DO NOTHING;

INSERT INTO public.matches (home_team, away_team, venue, date, home_goals, away_goals, highlight, is_finished) VALUES
('Malappuram FC', 'Kochi United', 'Malappuram Stadium', '2024-01-15 15:00:00+00', 2, 1, 'https://youtube.com/watch?v=example1', true),
('Thiruvananthapuram FC', 'Kozhikode City', 'Thiruvananthapuram Stadium', '2024-01-20 15:00:00+00', 0, 0, '', true),
('Malappuram FC', 'Thrissur FC', 'Malappuram Stadium', '2024-01-25 15:00:00+00', 3, 0, 'https://youtube.com/watch?v=example2', true),
('Kochi United', 'Kannur FC', 'Kochi Stadium', '2024-02-01 15:00:00+00', 2, 0, '', true),
('Thiruvananthapuram FC', 'Malappuram FC', 'Thiruvananthapuram Stadium', '2024-02-05 15:00:00+00', 1, 2, 'https://youtube.com/watch?v=example3', true),
('Kozhikode City', 'Malappuram FC', 'Kozhikode Stadium', '2024-02-10 15:00:00+00', NULL, NULL, '', false),
('Thrissur FC', 'Kochi United', 'Thrissur Stadium', '2024-02-15 15:00:00+00', NULL, NULL, '', false),
('Kannur FC', 'Thiruvananthapuram FC', 'Kannur Stadium', '2024-02-20 15:00:00+00', NULL, NULL, '', false)
ON CONFLICT DO NOTHING;
