import React, { useState } from "react";
import axios from "axios";

const Teams = () => {
  const [form, setForm] = useState({
    club: "",
    played: "",
    won: "",
    draw: "",
    lost: "",
    gf: "",
    ga: "",
    gd: "",
    points: "",
    last5: "",
  });
  const [logoFile, setLogoFile] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setLogoFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let key in form) formData.append(key, form[key]);
    if (logoFile) formData.append("logo", logoFile);

    try {
      await axios.post("http://localhost:5000/api/admin/standing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Team added successfully!");
      setForm({
        club: "",
        played: "",
        won: "",
        draw: "",
        lost: "",
        gf: "",
        ga: "",
        gd: "",
        points: "",
        last5: "",
      });
      setLogoFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error adding team");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">Add New Team</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg">
        {logoFile && (
          <img
            src={URL.createObjectURL(logoFile)}
            alt="Preview"
            className="w-24 h-24 rounded-full mx-auto mb-6 border border-gray-600 object-cover"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Team Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-gray-300"
            />
          </div>

          {Object.keys(form).map((key) => (
            <div key={key}>
              <label className="block text-sm capitalize mb-2">
                {key === "last5"
                  ? "Last 5 Results (comma-separated, e.g. W,D,L,W,W)"
                  : key}
              </label>
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default Teams;
