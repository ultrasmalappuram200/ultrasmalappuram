-- ============================================
-- COMPLETE FIX FOR ALL SUPABASE ERRORS
-- Run this script in your Supabase SQL Editor
-- ============================================

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.standings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.standings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.standings;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.standings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.matches;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.matches;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.matches;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.matches;

-- Step 2: Create SIMPLE policies for profiles
CREATE POLICY "Allow all authenticated users to read profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to update profiles" ON public.profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 3: Create SIMPLE policies for standings (allow all authenticated users)
CREATE POLICY "Allow all authenticated users to read standings" ON public.standings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to insert standings" ON public.standings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to update standings" ON public.standings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to delete standings" ON public.standings
  FOR DELETE USING (auth.role() = 'authenticated');

-- Step 4: Create SIMPLE policies for matches (allow all authenticated users)
CREATE POLICY "Allow all authenticated users to read matches" ON public.matches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to insert matches" ON public.matches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to update matches" ON public.matches
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all authenticated users to delete matches" ON public.matches
  FOR DELETE USING (auth.role() = 'authenticated');

-- Step 5: Ensure your admin profile exists
-- Replace 'aef07375-0e38-41b4-93d9-f045c1c96620' with your actual user ID if different
INSERT INTO public.profiles (id, email, role)
VALUES ('aef07375-0e38-41b4-93d9-f045c1c96620', 'aneesaboo123@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Step 6: Verify the setup
SELECT 'Profiles table:' as info;
SELECT * FROM public.profiles;

SELECT 'Standings table:' as info;
SELECT * FROM public.standings LIMIT 5;

SELECT 'Matches table:' as info;
SELECT * FROM public.matches LIMIT 5;

