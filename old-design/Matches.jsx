import React, { useState } from "react";
import axios from "axios";

const Matches = () => {
  const [match, setMatch] = useState({
    homeTeam: "",
    awayTeam: "",
    homeGoals: "",
    awayGoals: "",
  });

  const handleChange = (e) =>
    setMatch({ ...match, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formatted = {
        ...match,
        homeGoals: Number(match.homeGoals),
        awayGoals: Number(match.awayGoals),
      };

      await axios.post("http://localhost:5000/api/admin/update-match", formatted);
      alert("Match result submitted and standings updated!");
      setMatch({ homeTeam: "", awayTeam: "", homeGoals: "", awayGoals: "" });
    } catch (err) {
      console.error(err);
      alert("Error submitting match. Check console.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-blue-400 mb-6">
        Record Match Result
      </h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Home Team</label>
            <input
              type="text"
              name="homeTeam"
              value={match.homeTeam}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Away Team</label>
            <input
              type="text"
              name="awayTeam"
              value={match.awayTeam}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Home Goals</label>
              <input
                type="number"
                name="homeGoals"
                value={match.homeGoals}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Away Goals</label>
              <input
                type="number"
                name="awayGoals"
                value={match.awayGoals}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Submit Result
          </button>
        </form>
      </div>
    </div>
  );
};

export default Matches;
