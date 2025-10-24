'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Team {
  id: string
  club: string
  logo?: string
  played: number
  won: number
  draw: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
}

const Standings = () => {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!supabase) {
      // Mock data when Supabase isn’t configured
      setTeams([
        { id: '1', club: 'Malappuram FC', played: 5, won: 3, draw: 1, lost: 1, gf: 8, ga: 4, gd: 4, points: 10 },
        { id: '2', club: 'Kochi United', played: 5, won: 2, draw: 2, lost: 1, gf: 6, ga: 5, gd: 1, points: 8 },
        { id: '3', club: 'Thiruvananthapuram FC', played: 5, won: 2, draw: 1, lost: 2, gf: 7, ga: 6, gd: 1, points: 7 },
        { id: '4', club: 'Kozhikode City', played: 5, won: 1, draw: 3, lost: 1, gf: 5, ga: 4, gd: 1, points: 6 },
        { id: '5', club: 'Thrissur FC', played: 5, won: 1, draw: 2, lost: 2, gf: 4, ga: 6, gd: -2, points: 5 },
        { id: '6', club: 'Kannur FC', played: 5, won: 0, draw: 1, lost: 4, gf: 2, ga: 9, gd: -7, points: 1 },
      ])
      return
    }

    try {
      const { data, error } = await supabase
        .from('standings')
        .select('*')
        .order('points', { ascending: false })
        .order('gd', { ascending: false })

      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching standings:', error)
    }
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-400'
    if (position === 2) return 'text-gray-300'
    if (position === 3) return 'text-orange-400'
    return 'text-gray-400'
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 grid-rows-16 h-full w-full">
            {Array.from({ length: 320 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-[#dd3913]/8"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{
                  duration: Math.random() * 5 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 rounded-full mb-6"
          >
            <span className="text-white text-sm font-bold uppercase tracking-wider font-[Montserrat]">
              League Standings
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight font-[Montserrat]">
            Super League{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#dd3913]/90 to-[#dd3913]/70">
              Kerala
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-[Montserrat]">
            Current season standings and team performance metrics
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-gray-800/40 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">Pos</th>
                  <th className="text-left py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">Team</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">P</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">W</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">D</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">L</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">GF</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">GA</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">GD</th>
                  <th className="text-center py-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-400 font-[Montserrat]">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    {/* Position */}
                    <td className="py-6 px-4">
                      <div className={`text-2xl font-bold ${getPositionColor(index + 1)} font-[Montserrat]`}>
                        {index + 1}
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.club}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600/50 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#dd3913] to-[#dd3913]/80 flex items-center justify-center border-2 border-gray-600/50 shadow-lg">
                            <span className="text-white font-bold text-lg font-[Montserrat]">
                              {team.club.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-lg font-bold text-white group-hover:text-[#dd3913] transition-colors font-[Montserrat]">
                            {team.club}
                          </div>
                          {index < 3 && (
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-[Montserrat]">
                              {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : 'Third Place'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="py-6 px-4 text-center text-lg font-semibold text-gray-300 font-[Montserrat]">{team.played}</td>
                    <td className="py-6 px-4 text-center text-lg font-semibold text-[#dd3913] font-[Montserrat]">{team.won}</td>
                    <td className="py-6 px-4 text-center text-lg font-semibold text-gray-300 font-[Montserrat]">{team.draw}</td>
                    <td className="py-6 px-4 text-center text-lg font-semibold text-gray-400 font-[Montserrat]">{team.lost}</td>
                    <td className="py-6 px-4 text-center text-lg font-semibold text-white font-[Montserrat]">{team.gf}</td>
                    <td className="py-6 px-4 text-center text-lg font-semibold text-gray-300 font-[Montserrat]">{team.ga}</td>
                    <td className="py-6 px-4 text-center">
                      <span className={`text-lg font-bold ${team.gd >= 0 ? 'text-green-400' : 'text-red-400'} font-[Montserrat]`}>
                        {team.gd >= 0 ? '+' : ''}{team.gd}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="text-2xl font-bold text-[#dd3913] font-[Montserrat]">{team.points}</div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Standings
