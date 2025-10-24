'use client'

import React, { useEffect, useState } from "react";
import { FaCalendar, FaMapPin, FaPlayCircle, FaTrophy, FaClock, FaFutbol } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Match {
  id: string
  home_team: string
  away_team: string
  home_image?: string
  away_image?: string
  venue: string
  date: string
  home_goals?: number
  away_goals?: number
  highlight?: string
  is_finished: boolean
}

interface Team {
  id: string
  club: string
  logo?: string
}

const LastMalappuramMatch = () => {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [lastMatch, setLastMatch] = useState<Match | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) {
      // Use mock data when Supabase is not configured
      const mockTeams = [
        { id: '1', club: 'Malappuram FC', logo: '/images/placeholder-team.png' },
        { id: '2', club: 'Kochi United', logo: '/images/placeholder-team.png' },
        { id: '3', club: 'Thiruvananthapuram FC', logo: '/images/placeholder-team.png' },
        { id: '4', club: 'Kozhikode City', logo: '/images/placeholder-team.png' },
        { id: '5', club: 'Thrissur FC', logo: '/images/placeholder-team.png' }
      ];
      setTeams(mockTeams);

      setFixtures([
        {
          id: '1',
          home_team: 'Thiruvananthapuram FC',
          away_team: 'Kozhikode City',
          venue: 'Thiruvananthapuram Stadium',
          date: '2024-02-10T15:00:00Z',
          is_finished: false
        }
      ])
      setLastMatch({
        id: '1',
        home_team: 'Malappuram FC',
        away_team: 'Kochi United',
        venue: 'Malappuram Stadium',
        date: '2024-01-15T15:00:00Z',
        home_goals: 2,
        away_goals: 1,
        highlight: 'https://youtube.com/watch?v=example',
        is_finished: true
      })
      return
    }

    try {
      // Fetch teams first
      const { data: teamsData, error: teamsError } = await supabase
        .from('standings')
        .select('id, club, logo');

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
      } else {
        setTeams(teamsData || []);
      }

      // Then fetch matches
      const [fix, last] = await Promise.all([
        supabase.from('matches').select('*').eq('is_finished', false).order('date', { ascending: true }),
        supabase.from('matches').select('*').eq('is_finished', true).order('date', { ascending: false }).limit(1).single()
      ]);
      setFixtures(Array.isArray(fix.data) ? fix.data : []);
      setLastMatch(last.data || null);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return null;
    try {
      const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
      ];
      for (const p of patterns) {
        const match = url.match(p);
        if (match && match[1]) {
          return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const getTeamLogo = (teamName: string) => {
    const team = teams.find(t => t.club === teamName);
    return team?.logo;
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] overflow-hidden">
      {/* Sharp Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sharp Diagonal Lines */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent"
            style={{
              width: `${300 + i * 50}px`,
              left: `${25 + i * 20}%`,
              top: `${20 + i * 25}%`,
              transform: `rotate(${-25 + i * 12}deg)`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0], 
              scaleX: [0, 1, 0] 
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i,
            }}
          />
        ))}

        {/* Sharp Geometric Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#dd3913]/15"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 12}%`,
              width: `${3 + i}px`,
              height: `${3 + i}px`,
              clipPath: i % 3 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : i % 3 === 1 ? 'polygon(0% 0%, 100% 0%, 50% 100%)' : 'polygon(0% 0%, 100% 50%, 0% 100%)',
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              rotate: 180 
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block bg-[#dd3913] text-white text-sm uppercase tracking-wider px-4 py-2 mb-4 transform -skew-x-12 shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            Match Center
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight bg-gradient-to-r from-[#dd3913] via-[#dd3913]/90 to-[#dd3913]/70 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(221,57,19,0.3)]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}>
            Last Match & Fixtures
          </h2>
        </motion.div>

        {/* 🏆 LAST MATCH SPOTLIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaTrophy className="w-8 h-8 text-[#dd3913]" />
            <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
              Last Match Result
            </h3>
          </div>

          {lastMatch ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl">
              {/* Match Header */}
              <div className="bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 px-6 py-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-5 h-5" />
                    <span className="font-semibold" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      {new Date(lastMatch.date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapPin className="w-5 h-5" />
                    <span className="font-semibold" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      {lastMatch.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Content */}
              <div className="p-8">
                <div className="flex items-center justify-between">
                  {/* Home Team */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-[#dd3913]/50 flex items-center justify-center mb-4 overflow-hidden">
                      {getTeamLogo(lastMatch.home_team) ? (
                        <img 
                          src={getTeamLogo(lastMatch.home_team)} 
                          alt={lastMatch.home_team}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      ) : (
                        <FaFutbol className="w-8 h-8 text-[#dd3913]" />
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-white text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                      {lastMatch.home_team}
                    </h4>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center mx-8">
                    <div className="text-6xl font-extrabold text-[#dd3913] mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}>
                      {lastMatch.home_goals} - {lastMatch.away_goals}
                    </div>
                    <div className="bg-[#dd3913] text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      Final Score
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border-2 border-[#dd3913]/50 flex items-center justify-center mb-4 overflow-hidden">
                      {getTeamLogo(lastMatch.away_team) ? (
                        <img 
                          src={getTeamLogo(lastMatch.away_team)} 
                          alt={lastMatch.away_team}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      ) : (
                        <FaFutbol className="w-8 h-8 text-[#dd3913]" />
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-white text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                      {lastMatch.away_team}
                    </h4>
                  </div>
                </div>

                {/* Highlight Video */}
                {lastMatch.highlight && (
                  <div className="mt-8 relative group">
                    <img
                      src={getYoutubeThumbnail(lastMatch.highlight) || '/images/placeholder-video.jpg'}
                      alt="Match Highlights"
                      className="w-full h-48 sm:h-64 object-cover rounded-2xl brightness-75 group-hover:brightness-50 transition-all duration-300"
                    />
                    <a
                      href={lastMatch.highlight}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-[#dd3913] rounded-full p-4 group-hover:scale-110 transition-all duration-300">
                        <FaPlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </a>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 text-sm rounded-full backdrop-blur-sm" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                      Watch Highlights
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl">
              <FaClock className="w-16 h-16 text-[#dd3913]/50 mx-auto mb-4" />
              <p className="text-gray-400 text-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                No match played yet.
              </p>
            </div>
          )}
        </motion.div>

        {/* ⚽ UPCOMING FIXTURES */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaFutbol className="w-8 h-8 text-[#dd3913]" />
            <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
              Upcoming Fixtures
            </h3>
          </div>

          {fixtures.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fixtures.map((fixture, i) => (
                <motion.div
                  key={fixture.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Match Date Header */}
                  <div className="bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 px-4 py-3">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="w-4 h-4" />
                        <span className="font-semibold text-sm" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          {new Date(fixture.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <span className="text-sm font-semibold" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                        {new Date(fixture.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Match Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      {/* Home Team */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-[#dd3913]/50 flex items-center justify-center mb-2 overflow-hidden">
                          {getTeamLogo(fixture.home_team) ? (
                            <img 
                              src={getTeamLogo(fixture.home_team)} 
                              alt={fixture.home_team}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                          ) : (
                            <FaFutbol className="w-5 h-5 text-[#dd3913]" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          {fixture.home_team}
                        </p>
                      </div>

                      {/* VS */}
                      <div className="flex flex-col items-center mx-4">
                        <span className="text-[#dd3913] font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                          VS
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-[#dd3913]/50 flex items-center justify-center mb-2 overflow-hidden">
                          {getTeamLogo(fixture.away_team) ? (
                            <img 
                              src={getTeamLogo(fixture.away_team)} 
                              alt={fixture.away_team}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                          ) : (
                            <FaFutbol className="w-5 h-5 text-[#dd3913]" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          {fixture.away_team}
                        </p>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm bg-gray-800/30 rounded-lg p-3">
                      <FaMapPin className="w-4 h-4 text-[#dd3913]" />
                      <span className="truncate" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                        {fixture.venue}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl">
              <FaCalendar className="w-16 h-16 text-[#dd3913]/50 mx-auto mb-4" />
              <p className="text-gray-400 text-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                No upcoming fixtures scheduled.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default LastMalappuramMatch;
