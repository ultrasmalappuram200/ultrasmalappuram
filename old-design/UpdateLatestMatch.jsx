import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Calendar,
  Upload,
  Trophy,
  PlusCircle,
  CheckCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/match";

export default function UpdateLatestMatch() {
  const [fixtures, setFixtures] = useState([]);
  const [lastMatch, setLastMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newFixture, setNewFixture] = useState({
    homeTeam: "",
    awayTeam: "",
    venue: "",
    date: "",
    homeImage: null,
    awayImage: null,
  });

  const [matchId, setMatchId] = useState("");
  const [finishData, setFinishData] = useState({
    homeGoals: "",
    awayGoals: "",
    highlight: "",
  });

  // Fetch matches
  const fetchData = async () => {
    try {
      const [fix, last] = await Promise.all([
        axios.get(`${API_URL}/fixtures`),
        axios.get(`${API_URL}/last-match`),
      ]);
      setFixtures(Array.isArray(fix.data) ? fix.data : []);
      setLastMatch(last.data || null);
    } catch (err) {
      toast.error("⚠️ Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add fixture
  const handleAddFixture = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(newFixture).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post(`${API_URL}/add-fixture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Fixture added successfully!");
      setNewFixture({
        homeTeam: "",
        awayTeam: "",
        venue: "",
        date: "",
        homeImage: null,
        awayImage: null,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding fixture");
    } finally {
      setLoading(false);
    }
  };

  // Finish match
  const handleFinishMatch = async (e) => {
    e.preventDefault();
    if (!matchId) return toast.warn("Select a match first");

    try {
      await axios.post(`${API_URL}/finish-match/${matchId}`, finishData);
      toast.success("🏁 Match completed successfully!");
      setMatchId("");
      setFinishData({ homeGoals: "", awayGoals: "", highlight: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error finishing match");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-10 space-y-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
          ⚽ Admin Match Control Center
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Manage fixtures, results, and highlights seamlessly
        </p>
      </motion.div>

      {/* LAST MATCH */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-400" />
          <h2 className="text-2xl font-semibold text-yellow-400">
            Last Match
          </h2>
        </div>

        {lastMatch ? (
          <div className="flex flex-col md:flex-row justify-between bg-gray-900/60 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-4">
              {lastMatch.homeImage && (
                <img
                  src={`http://localhost:5000/${lastMatch.homeImage}`}
                  alt="home"
                  className="w-14 h-14 rounded-full object-cover border border-gray-600"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {lastMatch.homeTeam}{" "}
                  <span className="text-gray-400">vs</span>{" "}
                  {lastMatch.awayTeam}
                </h3>
                <p className="text-gray-400 text-sm">{lastMatch.venue}</p>
              </div>
              {lastMatch.awayImage && (
                <img
                  src={`http://localhost:5000/${lastMatch.awayImage}`}
                  alt="away"
                  className="w-14 h-14 rounded-full object-cover border border-gray-600"
                />
              )}
            </div>
            <div className="text-center mt-4 md:mt-0">
              <p className="text-2xl font-bold">
                {lastMatch.homeGoals} - {lastMatch.awayGoals}
              </p>
              {lastMatch.highlight && (
                <a
                  href={lastMatch.highlight}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  Watch Highlights
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No matches played yet.</p>
        )}
      </motion.section>

      {/* UPCOMING FIXTURES */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-2 mb-5">
          <Calendar /> Upcoming Fixtures
        </h2>

        {fixtures.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {fixtures.map((f) => (
              <motion.div
                key={f._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  {f.homeImage && (
                    <img
                      src={`http://localhost:5000/${f.homeImage}`}
                      alt="home"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <p className="font-semibold">
                    {f.homeTeam} <span className="text-gray-500">vs</span>{" "}
                    {f.awayTeam}
                  </p>
                  {f.awayImage && (
                    <img
                      src={`http://localhost:5000/${f.awayImage}`}
                      alt="away"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="text-right text-gray-400 text-sm">
                  <p>{new Date(f.date).toLocaleString()}</p>
                  <p>{f.venue}</p>
                  <button
                    onClick={() => setMatchId(f._id)}
                    className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                  >
                    Finish
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming fixtures yet.</p>
        )}
      </motion.section>

      {/* ADD FIXTURE */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
          <PlusCircle /> Add New Fixture
        </h2>
        <form
          onSubmit={handleAddFixture}
          className="grid md:grid-cols-2 gap-4 mt-4"
        >
          <input
            type="text"
            placeholder="Home Team"
            value={newFixture.homeTeam}
            onChange={(e) =>
              setNewFixture({ ...newFixture, homeTeam: e.target.value })
            }
            required
            className="bg-gray-900 p-3 rounded-lg border border-gray-700"
          />
          <input
            type="text"
            placeholder="Away Team"
            value={newFixture.awayTeam}
            onChange={(e) =>
              setNewFixture({ ...newFixture, awayTeam: e.target.value })
            }
            required
            className="bg-gray-900 p-3 rounded-lg border border-gray-700"
          />
          <input
            type="text"
            placeholder="Venue"
            value={newFixture.venue}
            onChange={(e) =>
              setNewFixture({ ...newFixture, venue: e.target.value })
            }
            required
            className="bg-gray-900 p-3 rounded-lg border border-gray-700"
          />
          <input
            type="datetime-local"
            value={newFixture.date}
            onChange={(e) =>
              setNewFixture({ ...newFixture, date: e.target.value })
            }
            required
            className="bg-gray-900 p-3 rounded-lg border border-gray-700"
          />

          {/* Upload fields */}
          <div className="col-span-2 flex flex-wrap gap-6 mt-2">
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                🏠 Home Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewFixture({
                    ...newFixture,
                    homeImage: e.target.files[0],
                  })
                }
                className="bg-gray-900 p-2 rounded-lg border border-gray-700 w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                🚩 Away Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewFixture({
                    ...newFixture,
                    awayImage: e.target.files[0],
                  })
                }
                className="bg-gray-900 p-2 rounded-lg border border-gray-700 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 mt-4 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
          >
            <Upload /> {loading ? "Uploading..." : "Add Fixture"}
          </button>
        </form>
      </motion.section>

      {/* FINISH MATCH FORM */}
      {matchId && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <CheckCircle /> Finish Match
          </h2>
          <form
            onSubmit={handleFinishMatch}
            className="grid md:grid-cols-3 gap-4 mt-4"
          >
            <input
              type="number"
              placeholder="Home Goals"
              value={finishData.homeGoals}
              onChange={(e) =>
                setFinishData({ ...finishData, homeGoals: e.target.value })
              }
              required
              className="bg-gray-900 p-3 rounded-lg border border-gray-700"
            />
            <input
              type="number"
              placeholder="Away Goals"
              value={finishData.awayGoals}
              onChange={(e) =>
                setFinishData({ ...finishData, awayGoals: e.target.value })
              }
              required
              className="bg-gray-900 p-3 rounded-lg border border-gray-700"
            />
            <input
              type="text"
              placeholder="Highlight Link"
              value={finishData.highlight}
              onChange={(e) =>
                setFinishData({ ...finishData, highlight: e.target.value })
              }
              className="bg-gray-900 p-3 rounded-lg border border-gray-700"
            />
            <button
              type="submit"
              className="col-span-3 bg-blue-600 hover:bg-blue-500 py-3 mt-2 rounded-lg font-semibold"
            >
              Update Match
            </button>
          </form>
        </motion.section>
      )}
    </div>
  );
}
