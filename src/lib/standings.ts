// Super League Kerala Season 3 points system (3-2-1-0).
// There are no draws: a match level after 90 minutes goes straight to a penalty shootout.

export type MatchResult = 'W' | 'PW' | 'PL' | 'L'

export const POINTS: Record<MatchResult, number> = {
  W: 3, // Win in regulation time
  PW: 2, // Win on penalties
  PL: 1, // Loss on penalties
  L: 0, // Loss in regulation time
}

export interface StandingStats {
  played: number
  won: number
  lost: number
  pw: number
  pl: number
  gf: number
  ga: number
  gd: number
  points: number
  last5: string[] // Stored oldest -> newest; displayed newest first
}

export const calculatePoints = ({ won, pw, pl }: Pick<StandingStats, 'won' | 'pw' | 'pl'>) =>
  won * POINTS.W + pw * POINTS.PW + pl * POINTS.PL

// Returns null when the match is level and the shootout has no winner yet
export const getMatchResults = (
  homeGoals: number,
  awayGoals: number,
  homePens: number | null,
  awayPens: number | null
): { home: MatchResult; away: MatchResult } | null => {
  if (homeGoals > awayGoals) return { home: 'W', away: 'L' }
  if (awayGoals > homeGoals) return { home: 'L', away: 'W' }
  if (homePens === null || awayPens === null || homePens === awayPens) return null
  return homePens > awayPens ? { home: 'PW', away: 'PL' } : { home: 'PL', away: 'PW' }
}

// Adds one match to a team's row. Shootout goals don't count towards GF/GA.
export const applyResult = <T extends StandingStats>(
  team: T,
  result: MatchResult,
  goalsFor: number,
  goalsAgainst: number
): T => {
  const won = team.won + (result === 'W' ? 1 : 0)
  const pw = team.pw + (result === 'PW' ? 1 : 0)
  const pl = team.pl + (result === 'PL' ? 1 : 0)
  const lost = team.lost + (result === 'L' ? 1 : 0)
  const gf = team.gf + goalsFor
  const ga = team.ga + goalsAgainst

  return {
    ...team,
    played: team.played + 1,
    won,
    pw,
    pl,
    lost,
    gf,
    ga,
    gd: gf - ga,
    points: calculatePoints({ won, pw, pl }),
    last5: [...team.last5, result].slice(-5),
  }
}

export const sortStandings = <T extends Pick<StandingStats, 'points' | 'gd' | 'gf'>>(teams: T[]) =>
  [...teams].sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)

// Same style as superleaguekerala.com: a shootout shows as "D", green if won and red if lost
export const getResultBadge = (result: string) => {
  switch (result) {
    case 'W':
      return { label: 'W', title: 'Won', className: 'bg-green-600 text-white' }
    case 'PW':
      return { label: 'D', title: 'Won on penalties', className: 'bg-green-600 text-white' }
    case 'PL':
      return { label: 'D', title: 'Lost on penalties', className: 'bg-red-600 text-white' }
    case 'D': // Draws from earlier seasons
      return { label: 'D', title: 'Draw', className: 'bg-yellow-600 text-white' }
    default:
      return { label: 'L', title: 'Lost', className: 'bg-red-600 text-white' }
  }
}

export const formatPenalties = (match: { home_penalties?: number | null; away_penalties?: number | null }) =>
  match.home_penalties != null && match.away_penalties != null
    ? `${match.home_penalties} - ${match.away_penalties}`
    : null
