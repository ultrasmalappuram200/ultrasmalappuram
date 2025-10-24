import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, PlayCircle, Trophy, Clock } from "lucide-react";
import { motion } from "framer-motion";

const LastMalappuramMatch = () => {
  const [fixtures, setFixtures] = useState([]);
  const [lastMatch, setLastMatch] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fix = await axios.get("http://localhost:5000/api/match/fixtures");
      const last = await axios.get("http://localhost:5000/api/match/last-match");
      setFixtures(fix.data);
      setLastMatch(last.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getYoutubeThumbnail = (url) => {
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

  return (
    <div className="text-gray-100  py-16 px-4 sm:px-8 lg:px-20 space-y-20 relative overflow-hidden">
      {/* Background Glow Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-orange-500/10 blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-amber-400/10 blur-[180px]" />
      </div>

      {/* 🏆 LAST MATCH SPOTLIGHT - Ticket Style */}
      <section className="relative z-10" id="Last-Match">
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* <Trophy className="w-8 h-8 text-orange-400" /> */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 tracking-wide uppercase">
            Last Match Spotlight
          </h2>
        </motion.div>

        {lastMatch ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden border border-orange-400/30 rounded-3xl bg-gradient-to-br from-[#0c0e18]/90 via-[#141827]/80 to-[#0a0a12]/90 shadow-[0_0_50px_rgba(255,136,0,0.15)] backdrop-blur-xl"
          >
            {/* Perforation line (ticket cut) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gradient-to-b from-transparent via-orange-400/30 to-transparent opacity-50" />

            <div className="flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 gap-10">
              {/* Left Side - Teams */}
              <div className="flex flex-col items-center justify-center gap-4 flex-1">
                <motion.img
                  src={`http://localhost:5000/${lastMatch.homeImage}`}
                  alt={lastMatch.homeTeam}
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-orange-500 shadow-[0_0_30px_rgba(255,115,0,0.5)] object-cover"
                />
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-400 tracking-wide">
                  {lastMatch.homeTeam}
                </h3>
              </div>

              {/* Center - Scoreboard */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-5xl sm:text-6xl font-extrabold text-orange-500 drop-shadow-[0_0_30px_rgba(255,115,0,0.6)]">
                  {lastMatch.homeGoals} - {lastMatch.awayGoals}
                </p>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Calendar size={14} className="text-orange-400" />
                  {new Date(lastMatch.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <MapPin size={14} className="text-orange-400" />
                  <span>{lastMatch.venue}</span>
                </div>
              </div>

              {/* Right Side - Teams */}
              <div className="flex flex-col items-center justify-center gap-4 flex-1">
                <motion.img
                  src={`http://localhost:5000/${lastMatch.awayImage}`}
                  alt={lastMatch.awayTeam}
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-orange-500 shadow-[0_0_30px_rgba(255,115,0,0.5)] object-cover"
                />
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-400 tracking-wide">
                  {lastMatch.awayTeam}
                </h3>
              </div>
            </div>

            {/* Highlight Thumbnail Section */}
            {lastMatch.highlight && (
              <div className="relative group border-t border-orange-400/20 overflow-hidden">
                <img
                  src={getYoutubeThumbnail(lastMatch.highlight)}
                  alt="Highlight Thumbnail"
                  className="w-full h-52 sm:h-64 object-cover brightness-95 group-hover:brightness-75 transition-all duration-500"
                />
                <a
                  href={lastMatch.highlight}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]" />
                </a>
                <div className="absolute bottom-3 right-4 bg-black/40 text-orange-300 px-3 py-1 text-xs rounded-full backdrop-blur-md">
                  Watch Highlights
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12 border border-orange-400/20 rounded-2xl bg-gradient-to-br from-[#0a0c14]/50 to-[#111727]/50">
            <Clock className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
            <p className="text-gray-400 text-base">No match played yet.</p>
          </div>
        )}
      </section>

      {/* ⚽ UPCOMING FIXTURES - Ticket UI */}
      <section className="relative z-10">
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 uppercase tracking-wide">
            Upcoming Fixtures
          </h2>
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
        </motion.div>

        {fixtures.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {fixtures.map((f, i) => (
              <motion.div
                key={f._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.04 }}
                className="relative overflow-hidden border border-orange-400/30 rounded-2xl bg-gradient-to-br from-[#10121A]/80 via-[#141827]/80 to-[#0A0B10]/90 shadow-[0_0_30px_rgba(255,136,0,0.1)] hover:shadow-[0_0_40px_rgba(255,136,0,0.2)] transition-all duration-500"
              >
                {/* Top ticket band */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-bold uppercase px-4 py-2 tracking-wider">
                  {new Date(f.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Main ticket content */}
                <div className="p-6 flex flex-col items-center justify-center text-center gap-5">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-center flex-1">
                      <img
                        src={`http://localhost:5000/${f.homeImage}`}
                        alt={f.homeTeam}
                        className="w-14 h-14 rounded-full border-2 border-orange-400/40 object-cover"
                      />
                      <p className="mt-2 text-sm font-semibold text-gray-200">
                        {f.homeTeam}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-orange-400 font-bold text-lg">
                        VS
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(f.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <img
                        src={`http://localhost:5000/${f.awayImage}`}
                        alt={f.awayTeam}
                        className="w-14 h-14 rounded-full border-2 border-orange-400/40 object-cover"
                      />
                      <p className="mt-2 text-sm font-semibold text-gray-200">
                        {f.awayTeam}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs bg-black/20 rounded-lg p-2">
                    <MapPin size={12} className="text-orange-400" />
                    <span className="truncate">{f.venue}</span>
                  </div>
                </div>

                {/* Holographic bottom strip */}
                <div className="h-2 bg-gradient-to-r from-orange-400/50 via-yellow-400/50 to-orange-400/50 blur-[1px]" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-orange-400/20 rounded-2xl bg-gradient-to-br from-[#0a0c14]/50 to-[#111727]/50">
            <Calendar className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
            <p className="text-gray-400 text-base">No upcoming fixtures yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LastMalappuramMatch;
