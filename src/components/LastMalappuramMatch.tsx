"use client";

import React, { useEffect, useState } from "react";
import {
  FaCalendar,
  FaMapPin,
  FaPlayCircle,
  FaTrophy,
  FaClock,
  FaFutbol,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_image?: string;
  away_image?: string;
  venue: string;
  date: string;
  home_goals?: number;
  away_goals?: number;
  highlight?: string;
  is_finished: boolean;
}

interface Team {
  id: string;
  club: string;
  logo?: string;
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
      const mockTeams = [
        {
          id: "1",
          club: "Malappuram FC",
          logo: "/images/placeholder-team.png",
        },
        { id: "2", club: "Kochi United", logo: "/images/placeholder-team.png" },
        {
          id: "3",
          club: "Thiruvananthapuram FC",
          logo: "/images/placeholder-team.png",
        },
        {
          id: "4",
          club: "Kozhikode City",
          logo: "/images/placeholder-team.png",
        },
        { id: "5", club: "Thrissur FC", logo: "/images/placeholder-team.png" },
      ];
      setTeams(mockTeams);

      setFixtures([
        {
          id: "1",
          home_team: "Thiruvananthapuram FC",
          away_team: "Kozhikode City",
          venue: "Thiruvananthapuram Stadium",
          date: "2024-02-10T15:00:00Z",
          is_finished: false,
        },
      ]);
      setLastMatch({
        id: "1",
        home_team: "Malappuram FC",
        away_team: "Kochi United",
        venue: "Malappuram Stadium",
        date: "2024-01-15T15:00:00Z",
        home_goals: 2,
        away_goals: 1,
        highlight: "https://youtube.com/watch?v=example",
        is_finished: true,
      });
      return;
    }

    try {
      const { data: teamsData } = await supabase
        .from("standings")
        .select("id, club, logo");
      setTeams(teamsData || []);

      const [fix, last] = await Promise.all([
        supabase
          .from("matches")
          .select("*")
          .eq("is_finished", false)
          .order("date", { ascending: true }),
        supabase
          .from("matches")
          .select("*")
          .eq("is_finished", true)
          .order("date", { ascending: false })
          .limit(1)
          .single(),
      ]);
      setFixtures(Array.isArray(fix.data) ? fix.data : []);
      setLastMatch(last.data || null);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : null;
  };

  const getTeamLogo = (teamName: string) => {
    const team = teams.find((t) => t.club === teamName);
    return team?.logo;
  };

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            animate={{ opacity: [0, 0.4, 0], scaleX: [0, 1, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center px-2"
        >
          <span className="inline-block bg-[#dd3913] text-white text-xs sm:text-sm uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 mb-4 transform -skew-x-12 shadow-lg font-[Montserrat] font-semibold">
            Match Center
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight bg-gradient-to-r from-[#dd3913] via-[#dd3913]/90 to-[#dd3913]/70 bg-clip-text text-transparent font-[Montserrat]">
            Last Match & Fixtures
          </h2>
        </motion.div>

        {/* 🏆 Last Match */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-6 sm:mb-8 flex-wrap justify-center sm:justify-start">
            <FaTrophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#dd3913]" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-[Montserrat]">
              Last Match Result
            </h3>
          </div>

          {lastMatch ? (
            <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-white text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold">
                      {new Date(lastMatch.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold">{lastMatch.venue}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between text-center gap-6 sm:gap-8">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full border-2 border-[#dd3913]/50 flex items-center justify-center mb-3 overflow-hidden">
                      {getTeamLogo(lastMatch.home_team) ? (
                        <img
                          src={getTeamLogo(lastMatch.home_team)}
                          alt={lastMatch.home_team}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
                        />
                      ) : (
                        <FaFutbol className="text-[#dd3913] w-6 h-6 sm:w-8 sm:h-8" />
                      )}
                    </div>
                    <h4 className="text-base sm:text-xl font-bold text-white">
                      {lastMatch.home_team}
                    </h4>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl sm:text-6xl font-extrabold text-[#dd3913] mb-2">
                      {lastMatch.home_goals} - {lastMatch.away_goals}
                    </div>
                    <div className="bg-[#dd3913] text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold uppercase">
                      Final Score
                    </div>
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-full border-2 border-[#dd3913]/50 flex items-center justify-center mb-3 overflow-hidden">
                      {getTeamLogo(lastMatch.away_team) ? (
                        <img
                          src={getTeamLogo(lastMatch.away_team)}
                          alt={lastMatch.away_team}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
                        />
                      ) : (
                        <FaFutbol className="text-[#dd3913] w-6 h-6 sm:w-8 sm:h-8" />
                      )}
                    </div>
                    <h4 className="text-base sm:text-xl font-bold text-white">
                      {lastMatch.away_team}
                    </h4>
                  </div>
                </div>

                {/* Highlights */}
                {lastMatch.highlight && (
                  <div className="mt-6 sm:mt-8 relative group">
                    <img
                      src={
                        getYoutubeThumbnail(lastMatch.highlight) ||
                        "/images/placeholder-video.jpg"
                      }
                      alt="Highlights"
                      className="w-full h-40 sm:h-64 object-cover rounded-xl sm:rounded-2xl brightness-75 group-hover:brightness-50 transition"
                    />
                    <a
                      href={lastMatch.highlight}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-[#dd3913] rounded-full p-3 sm:p-4 group-hover:scale-110 transition">
                        <FaPlayCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                      </div>
                    </a>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm">
                      Watch Highlights
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <FaClock className="w-10 h-10 sm:w-16 sm:h-16 text-[#dd3913]/50 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-lg">
                No match played yet.
              </p>
            </div>
          )}
        </motion.div>

        {/* ⚽ Fixtures */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-6 sm:mb-8 flex-wrap justify-center sm:justify-start">
            <FaFutbol className="w-6 h-6 sm:w-8 sm:h-8 text-[#dd3913]" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-[Montserrat]">
              Upcoming Fixtures
            </h3>
          </div>

          {fixtures.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fixtures.map((fixture, i) => (
                <motion.div
                  key={fixture.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 px-4 py-2 sm:py-3">
                    <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {new Date(fixture.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {/* <span>{new Date(fixture.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span> */}
                      <span>7:30 PM</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 text-center">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full border border-[#dd3913]/50 flex items-center justify-center mb-2 overflow-hidden">
                          {getTeamLogo(fixture.home_team) ? (
                            <img
                              src={getTeamLogo(fixture.home_team)}
                              alt={fixture.home_team}
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full"
                            />
                          ) : (
                            <FaFutbol className="text-[#dd3913] w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-white font-semibold">
                          {fixture.home_team}
                        </p>
                      </div>

                      <span className="text-[#dd3913] font-bold text-base sm:text-lg mx-3 sm:mx-4">
                        VS
                      </span>

                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full border border-[#dd3913]/50 flex items-center justify-center mb-2 overflow-hidden">
                          {getTeamLogo(fixture.away_team) ? (
                            <img
                              src={getTeamLogo(fixture.away_team)}
                              alt={fixture.away_team}
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full"
                            />
                          ) : (
                            <FaFutbol className="text-[#dd3913] w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-white font-semibold">
                          {fixture.away_team}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm bg-gray-800/30 rounded-lg p-2 sm:p-3">
                      <FaMapPin className="text-[#dd3913] w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{fixture.venue}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <FaCalendar className="w-10 h-10 sm:w-16 sm:h-16 text-[#dd3913]/50 mx-auto mb-4" />
              <p className="text-gray-400 text-sm sm:text-lg">
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
