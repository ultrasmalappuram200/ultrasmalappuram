'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { POINTS, getResultBadge } from '@/lib/standings'
import { useReveal } from '@/lib/useReveal'
import SectionIntro from '@/components/SectionIntro'
import TeamLogo from '@/components/TeamLogo'

interface Team {
  id: string
  club: string
  logo?: string | null
  played: number
  won: number
  lost: number
  pw: number // Penalty shootout wins
  pl: number // Penalty shootout losses
  gf: number
  ga: number
  gd: number
  points: number
  last5: string[]
}

const COLUMNS = 'id, club, logo, played, won, lost, pw, pl, gf, ga, gd, points, last5'

// Used when Supabase isn't configured
const MOCK_TEAMS: Team[] = [
  { id: '1', club: 'Malappuram FC', played: 5, won: 3, lost: 1, pw: 1, pl: 0, gf: 8, ga: 4, gd: 4, points: 11, last5: ['W', 'PW', 'W', 'L', 'W'] },
  { id: '2', club: 'Kochi United', played: 5, won: 2, lost: 1, pw: 1, pl: 1, gf: 6, ga: 5, gd: 1, points: 9, last5: ['PW', 'W', 'PL', 'W', 'L'] },
  { id: '3', club: 'Thiruvananthapuram FC', played: 5, won: 2, lost: 2, pw: 1, pl: 0, gf: 7, ga: 6, gd: 1, points: 8, last5: ['L', 'W', 'PW', 'L', 'W'] },
  { id: '4', club: 'Kozhikode City', played: 5, won: 1, lost: 1, pw: 1, pl: 2, gf: 5, ga: 4, gd: 1, points: 7, last5: ['PL', 'L', 'W', 'PW', 'PL'] },
  { id: '5', club: 'Thrissur FC', played: 5, won: 1, lost: 2, pw: 0, pl: 2, gf: 4, ga: 6, gd: -2, points: 5, last5: ['L', 'PL', 'L', 'W', 'PL'] },
  { id: '6', club: 'Kannur FC', played: 5, won: 0, lost: 4, pw: 0, pl: 1, gf: 2, ga: 9, gd: -7, points: 1, last5: ['L', 'L', 'L', 'PL', 'L'] },
]

const STAT_COLUMNS = [
  { key: 'played', label: 'MP', title: 'Matches played' },
  { key: 'won', label: 'W', title: 'Won' },
  { key: 'lost', label: 'L', title: 'Lost' },
  { key: 'pw', label: 'PW', title: 'Won on penalties' },
  { key: 'pl', label: 'PL', title: 'Lost on penalties' },
  { key: 'gf', label: 'GF', title: 'Goals for' },
  { key: 'ga', label: 'GA', title: 'Goals against' },
] as const

const LEGEND = [
  { abbr: 'W', label: 'Win', points: POINTS.W },
  { abbr: 'PW', label: 'Shootout win', points: POINTS.PW },
  { abbr: 'PL', label: 'Shootout loss', points: POINTS.PL },
  { abbr: 'L', label: 'Loss', points: POINTS.L },
]

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`)
const isOurClub = (club: string) => club.toLowerCase().includes('malappuram')

// Most recent result first, like superleaguekerala.com
function FormBadges({ last5 }: { last5: string[] }) {
  if (!last5?.length) return <span className="text-white/30">–</span>

  return (
    <span className="flex gap-1">
      {[...last5].reverse().map((result, i) => {
        const badge = getResultBadge(result)
        return (
          <span key={i} title={badge.title} className={`flex size-5 items-center justify-center rounded-[3px] text-[10px] font-bold ${badge.className}`}>
            {badge.label}
          </span>
        )
      })}
    </span>
  )
}

const Standings = () => {
  const [teams, setTeams] = useState<Team[] | null>(null)
  const ref = useReveal<HTMLElement>(teams)

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setTeams(MOCK_TEAMS)
        return
      }

      const { data, error } = await supabase
        .from('standings')
        .select(COLUMNS)
        .order('points', { ascending: false })
        .order('gd', { ascending: false })
        .order('gf', { ascending: false })

      if (error) console.error('Error fetching standings:', error)
      setTeams(data ?? [])
    }
    load()
  }, [])

  return (
    <section ref={ref} aria-labelledby="standings-heading" className="relative bg-[#1a1f3c] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          id="standings-heading"
          label="League table"
          index="02"
          title={
            <>
              Every point <span className="text-[#dd3913]">counts.</span>
            </>
          }
          intro="Super League Kerala standings. No more draws: level games go straight to a penalty shootout."
        />

        <div data-reveal className="mt-14 sm:mt-20">
          {teams === null ? (
            <div className="space-y-px" aria-busy="true" aria-label="Loading standings">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-16 animate-pulse bg-white/4" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <p className="border border-white/10 p-8 text-center text-white/50">The table will appear here once the season is under way.</p>
          ) : (
            <>
              {/* Tablet and up: the full table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-y border-white/15 text-[11px] uppercase tracking-[0.18em] text-white/50">
                      <th scope="col" className="w-14 py-4 pl-4 text-left font-semibold">#</th>
                      <th scope="col" className="py-4 text-left font-semibold">Club</th>
                      {STAT_COLUMNS.map((column) => (
                        <th key={column.key} scope="col" title={column.title} className="w-12 py-4 text-center font-semibold">
                          {column.label}
                        </th>
                      ))}
                      <th scope="col" title="Goal difference" className="w-14 py-4 text-center font-semibold">GD</th>
                      <th scope="col" title="Points" className="w-14 py-4 text-center font-semibold text-white">Pts</th>
                      <th scope="col" className="w-36 py-4 pr-4 pl-6 text-left font-semibold">Last 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, i) => {
                      const ours = isOurClub(team.club)
                      return (
                        <tr key={team.id} className={`border-b border-white/10 transition-colors duration-300 hover:bg-white/4 ${ours ? 'bg-[#dd3913]/8' : ''}`}>
                          <td className={`py-4 pl-4 text-lg font-extrabold tabular-nums ${ours ? 'text-[#dd3913] shadow-[inset_3px_0_0_#dd3913]' : ''}`}>{i + 1}</td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <TeamLogo src={team.logo} name={team.club} size={32} />
                              <span className="font-semibold">{team.club}</span>
                            </div>
                          </td>
                          {STAT_COLUMNS.map((column) => (
                            <td key={column.key} className="py-4 text-center tabular-nums text-white/70">{team[column.key]}</td>
                          ))}
                          <td className="py-4 text-center tabular-nums text-white/70">{signed(team.gd)}</td>
                          <td className="py-4 text-center text-lg font-extrabold tabular-nums">{team.points}</td>
                          <td className="py-4 pr-4 pl-6">
                            <FormBadges last5={team.last5} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Phones: one compact row per club */}
              <ol className="border-t border-white/15 md:hidden">
                {teams.map((team, i) => {
                  const ours = isOurClub(team.club)
                  return (
                    <li
                      key={team.id}
                      className={`-mx-3 border-b border-white/10 px-3 py-4 ${ours ? 'bg-[#dd3913]/8 shadow-[inset_3px_0_0_#dd3913]' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-lg font-extrabold tabular-nums ${ours ? 'text-[#dd3913]' : ''}`}>{i + 1}</span>
                        <TeamLogo src={team.logo} name={team.club} size={32} />
                        <span className="min-w-0 flex-1 leading-tight font-semibold">{team.club}</span>
                        <span className="shrink-0 text-right">
                          <span className="text-2xl font-extrabold tabular-nums">{team.points}</span>
                          <span className="ml-1 text-[10px] font-semibold text-white/50">PTS</span>
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 pl-9">
                        <span className="text-xs tabular-nums text-white/50">
                          MP {team.played} · W {team.won} · L {team.lost} · PW {team.pw} · PL {team.pl} · GD {signed(team.gd)}
                        </span>
                        <FormBadges last5={team.last5} />
                      </div>
                    </li>
                  )
                })}
              </ol>
            </>
          )}
        </div>

        <dl data-reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/50">
          {LEGEND.map((item) => (
            <div key={item.abbr} className="flex items-center gap-2">
              <dt className="font-bold text-white">{item.abbr}</dt>
              <dd>
                {item.label} · {item.points} {item.points === 1 ? 'pt' : 'pts'}
              </dd>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <dt className="font-bold text-white">D</dt>
            <dd>in last 5: decided on penalties (green won, red lost)</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export default React.memo(Standings)
