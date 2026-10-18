-- ============================================
-- SUPER LEAGUE KERALA SEASON 3: PENALTY SHOOTOUT POINTS (3-2-1-0)
-- Run this script once in your Supabase SQL Editor, BEFORE deploying the new code.
-- ALREADY APPLIED on 18 Oct 2026. DO NOT run it again: Step 3 resets every team's standings to 0.
--
-- No more draws: a match level after 90 minutes goes to a penalty shootout.
--   Win in regulation  (W)  = 3 points
--   Win on penalties   (PW) = 2 points
--   Loss on penalties  (PL) = 1 point
--   Loss in regulation (L)  = 0 points
-- ============================================

-- Step 1: Penalty win / loss counters on standings
ALTER TABLE public.standings
  ADD COLUMN IF NOT EXISTS pw INTEGER DEFAULT 0, -- Penalty shootout wins
  ADD COLUMN IF NOT EXISTS pl INTEGER DEFAULT 0; -- Penalty shootout losses

-- Step 2: Penalty shootout score on matches (NULL when there was no shootout)
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS home_penalties INTEGER,
  ADD COLUMN IF NOT EXISTS away_penalties INTEGER;

-- Step 3: Reset every team to zero for the new season
-- (the old "draw" column is kept so the currently deployed site keeps working; the new code no longer uses it)
UPDATE public.standings
SET played = 0, won = 0, draw = 0, lost = 0, pw = 0, pl = 0,
    gf = 0, ga = 0, gd = 0, points = 0, last5 = '{}';

-- Verify
SELECT club, played, won, lost, pw, pl, gf, ga, gd, points, last5 FROM public.standings;
