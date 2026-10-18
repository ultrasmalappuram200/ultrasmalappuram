'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { applyResult, calculatePoints, formatPenalties, getMatchResults, getResultBadge, sortStandings } from "@/lib/standings";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface Standing {
  id: string;
  club: string;
  logo: string | null;
  played: number;
  won: number;
  lost: number;
  pw: number; // Penalty shootout wins
  pl: number; // Penalty shootout losses
  gf: number;
  ga: number;
  gd: number;
  points: number;
  last5: string[];
}

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_image: string | null;
  away_image: string | null;
  venue: string;
  date: string;
  home_goals: number | null;
  away_goals: number | null;
  home_penalties: number | null;
  away_penalties: number | null;
  highlight: string | null;
  is_finished: boolean;
}

// Stats the admin enters for a team; played, goal difference and points are calculated
const STANDING_FIELDS = [
  { name: 'won', label: 'WON' },
  { name: 'lost', label: 'LOST' },
  { name: 'pw', label: 'PEN WON (PW)' },
  { name: 'pl', label: 'PEN LOST (PL)' },
  { name: 'gf', label: 'GOALS FOR' },
  { name: 'ga', label: 'GOALS AGAINST' }
] as const;

// Played and points are derived from the results under the 3-2-1-0 system
const readStandingStats = (formData: FormData) => {
  const value = (name: string) => parseInt(formData.get(name) as string);
  const won = value('won');
  const lost = value('lost');
  const pw = value('pw');
  const pl = value('pl');
  const gf = value('gf');
  const ga = value('ga');
  return { won, lost, pw, pl, gf, ga, played: won + lost + pw + pl, gd: gf - ga, points: calculatePoints({ won, pw, pl }) };
};

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [standings, setStandings] = useState<Standing[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStanding, setEditingStanding] = useState<Standing | null>(null);
  const [showAddStanding, setShowAddStanding] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{type: 'standing' | 'match', id: string, name: string} | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreMatch, setScoreMatch] = useState<{id: string, homeTeam: string, awayTeam: string} | null>(null);
  const [scoreForm, setScoreForm] = useState({ home: '', away: '', homePens: '', awayPens: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) {
      // Use mock data if Supabase not configured
      setStandings([
        { id: '1', club: 'Malappuram FC', logo: 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=MFC', played: 5, won: 3, lost: 1, pw: 1, pl: 0, gf: 8, ga: 4, gd: 4, points: 11, last5: ['W', 'PW', 'W', 'L', 'W'] },
        { id: '2', club: 'Kochi United', logo: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=KU', played: 5, won: 2, lost: 1, pw: 1, pl: 1, gf: 6, ga: 5, gd: 1, points: 9, last5: ['PW', 'W', 'PL', 'W', 'L'] },
        { id: '3', club: 'Thiruvananthapuram FC', logo: 'https://via.placeholder.com/100x100/059669/FFFFFF?text=TVM', played: 5, won: 2, lost: 2, pw: 1, pl: 0, gf: 7, ga: 7, gd: 0, points: 8, last5: ['L', 'W', 'PW', 'L', 'W'] },
        { id: '4', club: 'Kozhikode City', logo: 'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=KC', played: 5, won: 1, lost: 1, pw: 1, pl: 2, gf: 5, ga: 5, gd: 0, points: 7, last5: ['PL', 'L', 'W', 'PW', 'PL'] },
        { id: '5', club: 'Thrissur Titans', logo: 'https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=TT', played: 5, won: 1, lost: 2, pw: 0, pl: 2, gf: 4, ga: 6, gd: -2, points: 5, last5: ['L', 'PL', 'L', 'W', 'PL'] },
        { id: '6', club: 'Kannur Kings', logo: 'https://via.placeholder.com/100x100/EA580C/FFFFFF?text=KK', played: 5, won: 0, lost: 2, pw: 1, pl: 2, gf: 3, ga: 7, gd: -4, points: 4, last5: ['PW', 'L', 'PL', 'L', 'PL'] }
      ]);
      setMatches([
        { id: '1', home_team: 'Malappuram FC', away_team: 'Kochi United', home_image: null, away_image: null, venue: 'Malappuram Stadium', date: '2024-01-15T15:00:00Z', home_goals: 2, away_goals: 1, home_penalties: null, away_penalties: null, highlight: 'https://youtube.com/watch?v=example1', is_finished: true },
        { id: '2', home_team: 'Thiruvananthapuram FC', away_team: 'Kozhikode City', home_image: null, away_image: null, venue: 'Thiruvananthapuram Stadium', date: '2024-02-10T15:00:00Z', home_goals: null, away_goals: null, home_penalties: null, away_penalties: null, highlight: null, is_finished: false },
        { id: '3', home_team: 'Thrissur Titans', away_team: 'Kannur Kings', home_image: null, away_image: null, venue: 'Thrissur Arena', date: '2024-02-17T15:00:00Z', home_goals: null, away_goals: null, home_penalties: null, away_penalties: null, highlight: null, is_finished: false }
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data: standingsData, error: standingsError } = await supabase
        .from('standings')
        .select('*')
        .order('points', { ascending: false })
        .order('gd', { ascending: false })
        .order('gf', { ascending: false });

      if (standingsError) {
        console.error('Standings error:', standingsError);
        toast.error('Failed to load standings');
      } else {
        setStandings(standingsData || []);
      }

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: true });

      if (matchesError) {
        console.error('Matches error:', matchesError);
        toast.error('Failed to load matches');
      } else {
        setMatches(matchesData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Database connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const updateStanding = async (standing: Standing, logoFile?: File) => {
    let logoUrl = standing.logo;

    // Handle logo upload if file provided
    if (logoFile) {
      if (!supabase) {
        logoUrl = URL.createObjectURL(logoFile);
      } else {
        try {
          // First, try to create the bucket if it doesn't exist
          try {
            await supabase.storage.createBucket('team-logos', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
            });
          } catch (bucketError) {
            // Bucket might already exist, continue with upload
            console.log('Bucket creation skipped (might already exist)');
          }

          const fileExt = logoFile.name.split('.').pop();
          const fileName = `team-${Date.now()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('team-logos')
            .upload(fileName, logoFile);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error('Failed to upload logo. Please check if storage bucket exists.');
            return;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('team-logos')
            .getPublicUrl(fileName);
          
          logoUrl = publicUrl;
        } catch (error) {
          console.error('Error uploading logo:', error);
          toast.error('Failed to upload logo. Please check Supabase storage configuration.');
          return;
        }
      }
    }

    if (!supabase) {
      setStandings(prev => sortStandings(prev.map(s => s.id === standing.id ? { ...standing, logo: logoUrl } : s)));
      toast.success('Standing updated successfully!');
      return;
    }

    try {
      const { error } = await supabase
        .from('standings')
        .update({
          club: standing.club,
          played: standing.played,
          won: standing.won,
          lost: standing.lost,
          pw: standing.pw,
          pl: standing.pl,
          gf: standing.gf,
          ga: standing.ga,
          gd: standing.gd,
          points: standing.points,
          last5: standing.last5,
          logo: logoUrl
        })
        .eq('id', standing.id);

      if (error) {
        console.error('Update standing error:', error);
        toast.error(`Failed to update standing: ${error.message}`);
        return;
      }

      setStandings(prev => sortStandings(prev.map(s => s.id === standing.id ? { ...standing, logo: logoUrl } : s)));
      toast.success('Standing updated successfully!');
    } catch (error: any) {
      console.error('Error updating standing:', error);
      toast.error('Failed to update standing');
    }
  };

  const addStanding = async (standing: Omit<Standing, 'id'>, logoFile?: File) => {
    let logoUrl = standing.logo;

    // Handle logo upload if file provided
    if (logoFile) {
      if (!supabase) {
        logoUrl = URL.createObjectURL(logoFile);
      } else {
        try {
          // First, try to create the bucket if it doesn't exist
          try {
            await supabase.storage.createBucket('team-logos', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
            });
          } catch (bucketError) {
            // Bucket might already exist, continue with upload
            console.log('Bucket creation skipped (might already exist)');
          }

          const fileExt = logoFile.name.split('.').pop();
          const fileName = `team-${Date.now()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('team-logos')
            .upload(fileName, logoFile);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error('Failed to upload logo. Please check if storage bucket exists.');
            return;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('team-logos')
            .getPublicUrl(fileName);
          
          logoUrl = publicUrl;
        } catch (error) {
          console.error('Error uploading logo:', error);
          toast.error('Failed to upload logo. Please check Supabase storage configuration.');
          return;
        }
      }
    }

    if (!supabase) {
      const newStanding = { ...standing, id: Date.now().toString(), logo: logoUrl };
      setStandings(prev => sortStandings([...prev, newStanding]));
      toast.success('Team added successfully!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('standings')
        .insert({
          club: standing.club,
          played: standing.played,
          won: standing.won,
          lost: standing.lost,
          pw: standing.pw,
          pl: standing.pl,
          gf: standing.gf,
          ga: standing.ga,
          gd: standing.gd,
          points: standing.points,
          last5: standing.last5,
          logo: logoUrl
        })
        .select()
        .single();

      if (error) {
        console.error('Add standing error:', error);
        toast.error(`Failed to add team: ${error.message || 'Database error'}`);
        return;
      }

      setStandings(prev => sortStandings([...prev, data]));
      toast.success('Team added successfully!');
    } catch (error: any) {
      console.error('Error adding standing:', error);
      toast.error('Failed to add team');
    }
  };

  const deleteStanding = async (id: string) => {
    const team = standings.find(s => s.id === id);
    if (!team) return;
    
    setDeleteItem({ type: 'standing', id, name: team.club });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    if (deleteItem.type === 'standing') {
      const team = standings.find(s => s.id === deleteItem.id);
      if (!team) return;

      if (!supabase) {
        setStandings(prev => prev.filter(s => s.id !== deleteItem.id));
        toast.success('Team deleted successfully!');
        setShowDeleteModal(false);
        setDeleteItem(null);
        return;
      }

      try {
        const { error } = await supabase
          .from('standings')
          .delete()
          .eq('id', deleteItem.id);

        if (error) {
          console.error('Delete standing error:', error);
          toast.error(`Failed to delete team: ${error.message || 'Database error'}`);
          return;
        }

        setStandings(prev => prev.filter(s => s.id !== deleteItem.id));
        toast.success('Team deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting standing:', error);
        toast.error('Failed to delete team');
      }
    } else if (deleteItem.type === 'match') {
      const match = matches.find(m => m.id === deleteItem.id);
      if (!match) return;

      if (!supabase) {
        setMatches(prev => prev.filter(m => m.id !== deleteItem.id));
        toast.success('Match deleted successfully!');
        setShowDeleteModal(false);
        setDeleteItem(null);
        return;
      }

      try {
        const { error } = await supabase
          .from('matches')
          .delete()
          .eq('id', deleteItem.id);

        if (error) {
          console.error('Delete match error:', error);
          toast.error(`Failed to delete match: ${error.message}`);
          return;
        }

        setMatches(prev => prev.filter(m => m.id !== deleteItem.id));
        toast.success('Match deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting match:', error);
        toast.error('Failed to delete match');
      }
    }

    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  const updateMatch = async (match: Match) => {
    if (!supabase) {
      setMatches(prev => prev.map(m => m.id === match.id ? match : m));
      toast.success('Match updated successfully!');
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .update({
          home_team: match.home_team,
          away_team: match.away_team,
          venue: match.venue,
          date: match.date,
          home_goals: match.home_goals,
          away_goals: match.away_goals,
          home_penalties: match.home_penalties,
          away_penalties: match.away_penalties,
          highlight: match.highlight,
          is_finished: match.is_finished,
          home_image: match.home_image,
          away_image: match.away_image
        })
        .eq('id', match.id);

      if (error) {
        console.error('Update match error:', error);
        toast.error(`Failed to update match: ${error.message}`);
        return;
      }

      setMatches(prev => prev.map(m => m.id === match.id ? match : m));
      toast.success('Match updated successfully!');
    } catch (error: any) {
      console.error('Error updating match:', error);
      toast.error('Failed to update match');
    }
  };

  const addMatch = async (match: Omit<Match, 'id'>) => {
    if (!supabase) {
      const newMatch = { ...match, id: Date.now().toString() };
      setMatches(prev => [...prev, newMatch]);
      toast.success('Match added successfully!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          home_team: match.home_team,
          away_team: match.away_team,
          venue: match.venue,
          date: match.date,
          home_goals: match.home_goals,
          away_goals: match.away_goals,
          home_penalties: match.home_penalties,
          away_penalties: match.away_penalties,
          highlight: match.highlight,
          is_finished: match.is_finished,
          home_image: match.home_image,
          away_image: match.away_image
        })
        .select()
        .single();

      if (error) {
        console.error('Add match error:', error);
        toast.error(`Failed to add match: ${error.message}`);
        return;
      }

      setMatches(prev => [...prev, data]);
      toast.success('Match added successfully!');
    } catch (error: any) {
      console.error('Error adding match:', error);
      toast.error('Failed to add match');
    }
  };

  const markMatchFinished = async (matchId: string, homeGoals: number, awayGoals: number, homePens: number | null, awayPens: number | null) => {
    const match = matches.find(m => m.id === matchId);
    const results = getMatchResults(homeGoals, awayGoals, homePens, awayPens);
    if (!match || !results) return;

    // A shootout only happens when the match is level after 90 minutes
    const isLevel = homeGoals === awayGoals;
    const finishedMatch = {
      is_finished: true,
      home_goals: homeGoals,
      away_goals: awayGoals,
      home_penalties: isLevel ? homePens : null,
      away_penalties: isLevel ? awayPens : null
    };

    const homeTeam = standings.find(t => t.club === match.home_team);
    const awayTeam = standings.find(t => t.club === match.away_team);
    const updatedTeams = [
      homeTeam && applyResult(homeTeam, results.home, homeGoals, awayGoals),
      awayTeam && applyResult(awayTeam, results.away, awayGoals, homeGoals)
    ].filter((team): team is Standing => !!team);

    const applyLocally = () => {
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...finishedMatch } : m));
      setStandings(prev => sortStandings(prev.map(t => updatedTeams.find(u => u.id === t.id) ?? t)));
      toast.success('Match marked as finished and standings updated!');
    };

    if (!supabase) {
      applyLocally();
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .update(finishedMatch)
        .eq('id', matchId);

      if (error) {
        console.error('Mark finished error:', error);
        toast.error(`Failed to mark match as finished: ${error.message || 'Database error'}`);
        return;
      }

      for (const team of updatedTeams) {
        const { error: standingError } = await supabase
          .from('standings')
          .update({
            played: team.played,
            won: team.won,
            lost: team.lost,
            pw: team.pw,
            pl: team.pl,
            gf: team.gf,
            ga: team.ga,
            gd: team.gd,
            points: team.points,
            last5: team.last5
          })
          .eq('id', team.id);

        if (standingError) {
          console.error('Update standing error:', standingError);
          toast.error(`Match saved, but failed to update ${team.club} standings: ${standingError.message}`);
          fetchData();
          return;
        }
      }

      applyLocally();
    } catch (error: any) {
      console.error('Error marking match as finished:', error);
      toast.error('Failed to mark match as finished');
    }
  };

  const uploadLogo = async (teamId: string, file: File) => {
    if (!supabase) {
      // Mock upload for development
      const mockUrl = URL.createObjectURL(file);
      setStandings(prev => prev.map(team => 
        team.id === teamId ? { ...team, logo: mockUrl } : team
      ));
      toast.success('Logo uploaded successfully!');
      return;
    }

    setUploadingLogo(teamId);
    try {
      // First, try to create the bucket if it doesn't exist
      try {
        await supabase.storage.createBucket('team-logos', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        });
      } catch (bucketError) {
        // Bucket might already exist, continue with upload
        console.log('Bucket creation skipped (might already exist)');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${teamId}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('team-logos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload logo. Please check if storage bucket exists.');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('team-logos')
        .getPublicUrl(fileName);

      // Update the team's logo in the database
      const { error: updateError } = await supabase
        .from('standings')
        .update({ logo: publicUrl })
        .eq('id', teamId);

      if (updateError) {
        console.error('Update error:', updateError);
        toast.error('Failed to update team logo');
        return;
      }

      setStandings(prev => prev.map(team => 
        team.id === teamId ? { ...team, logo: publicUrl } : team
      ));
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo. Please check Supabase storage configuration.');
    } finally {
      setUploadingLogo(null);
    }
  };

  const deleteMatch = async (id: string) => {
    const match = matches.find(m => m.id === id);
    if (!match) return;
    
    setDeleteItem({ type: 'match', id, name: `${match.home_team} vs ${match.away_team}` });
    setShowDeleteModal(true);
  };

  const openScoreModal = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    setScoreMatch({ id: matchId, homeTeam: match.home_team, awayTeam: match.away_team });
    setScoreForm({ home: '', away: '', homePens: '', awayPens: '' });
    setShowScoreModal(true);
  };

  const scoreIsLevel = scoreForm.home !== '' && scoreForm.away !== '' && Number(scoreForm.home) === Number(scoreForm.away);

  const submitScore = async () => {
    if (!scoreMatch) return;

    const homeGoals = parseInt(scoreForm.home);
    const awayGoals = parseInt(scoreForm.away);
    if (Number.isNaN(homeGoals) || Number.isNaN(awayGoals) || homeGoals < 0 || awayGoals < 0) {
      toast.error('Enter the score for both teams');
      return;
    }

    const homePens = scoreIsLevel && scoreForm.homePens !== '' ? parseInt(scoreForm.homePens) : null;
    const awayPens = scoreIsLevel && scoreForm.awayPens !== '' ? parseInt(scoreForm.awayPens) : null;
    if (!getMatchResults(homeGoals, awayGoals, homePens, awayPens)) {
      toast.error('Match is level: enter the penalty shootout score (it needs a winner)');
      return;
    }

    await markMatchFinished(scoreMatch.id, homeGoals, awayGoals, homePens, awayPens);
    setShowScoreModal(false);
    setScoreMatch(null);
  };

  const stats = {
    totalTeams: standings.length,
    totalMatches: matches.length,
    completedMatches: matches.filter(m => m.is_finished).length,
    upcomingMatches: matches.filter(m => !m.is_finished).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#dd3913] border-t-transparent rounded-full mb-6 mx-auto"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-xl font-medium"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Loading Dashboard...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f3c]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-gray-700/50 shadow-2xl bg-[#1a1f3c]/90 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                ADMIN DASHBOARD
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mt-1 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {user?.email}
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
            >
              LOGOUT
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: 'TEAMS', value: stats.totalTeams, color: 'text-blue-400' },
            { title: 'MATCHES', value: stats.totalMatches, color: 'text-emerald-400' },
            { title: 'COMPLETED', value: stats.completedMatches, color: 'text-green-400' },
            { title: 'UPCOMING', value: stats.upcomingMatches, color: 'text-purple-400' }
          ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
              }}
              className="border border-gray-700/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                  <p 
                    className="text-gray-400 text-sm font-semibold uppercase tracking-wide"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    {stat.title}
                  </p>
                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`text-4xl font-bold ${stat.color} mt-2`}
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}
                  >
                    {stat.value}
                  </motion.p>
              </div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                  className={`text-5xl ${stat.color} opacity-20`}
                >
                  ⚽
                </motion.div>
            </div>
          </motion.div>
        ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex space-x-2 mb-8 p-2 rounded-xl shadow-lg border border-gray-700/50"
        >
          {[
            { id: 'overview', label: 'OVERVIEW' },
            { id: 'teams', label: 'TEAMS' },
            { id: 'standings', label: 'STANDINGS' },
            { id: 'matches', label: 'MATCHES' },
            { id: 'settings', label: 'SETTINGS' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-all duration-300 rounded-lg ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl shadow-xl border border-gray-700/50 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 
                  className="text-3xl font-bold text-white mb-8"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                >
                  LEAGUE OVERVIEW
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-600/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 
                      className="text-xl font-semibold text-[#dd3913] mb-6"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      TOP TEAMS
                    </h3>
                    <div className="space-y-4">
                      {standings.slice(0, 3).map((team, index) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-500/50 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {team.logo ? (
                                <motion.img
                                  whileHover={{ scale: 1.1 }}
                                  src={team.logo}
                                  alt={`${team.club} logo`}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-[#dd3913]/30 shadow-xl"
                                />
                              ) : (
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                  className="w-10 h-10 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 flex items-center justify-center text-white font-bold text-sm rounded-full shadow-lg"
                                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                                >
                                  {index + 1}
                                </motion.div>
                              )}
                              <span 
                                className="text-white font-semibold text-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                              >
                                {team.club}
                              </span>
      </div>
                            <span 
                              className="text-[#dd3913] font-bold text-xl"
                              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                            >
                              {team.points} PTS
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

      <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-600/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 
                      className="text-xl font-semibold text-[#dd3913] mb-6"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      RECENT MATCHES
                    </h3>
                    <div className="space-y-4">
                      {matches.slice(0, 3).map((match, index) => (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: -5 }}
                          className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-500/50 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-white">
                              <div 
                                className="font-semibold text-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                              >
                                {match.home_team} vs {match.away_team}
                              </div>
                              <div 
                                className="text-sm text-gray-400"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                              >
                                {new Date(match.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div 
                              className="text-[#dd3913] font-bold text-xl"
                              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                            >
                              {match.is_finished ? `${match.home_goals}-${match.away_goals}` : 'TBD'}
                              {formatPenalties(match) && (
                                <div className="text-xs text-gray-400 text-right">PENS {formatPenalties(match)}</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'standings' && (
              <motion.div
                key="standings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                  >
                    LEAGUE STANDINGS
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddStanding(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    ADD TEAM
                  </motion.button>
            </div>
                <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-600/50">
                  <table className="min-w-full divide-y divide-gray-600/50">
                    <thead>
                      <tr>
                        <th 
                          className="text-left py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          POS
                        </th>
                        <th 
                          className="text-left py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          TEAM
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          P
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          W
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          L
                        </th>
                        <th
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          title="Won on penalties"
                        >
                          PW
                        </th>
                        <th
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          title="Lost on penalties"
                        >
                          PL
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          GF
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          GA
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          GD
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          PTS
                        </th>
                        <th 
                          className="text-center py-4 px-6 text-gray-300 font-bold text-sm uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600/50">
                      {standings.map((team, index) => (
                        <motion.tr
                          key={team.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)', scale: 1.01 }}
                          className="hover:bg-gray-800/30 transition-all duration-300"
                        >
                          <td 
                            className="py-4 px-6 text-white font-bold text-lg"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {index + 1}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {team.logo ? (
                                <motion.img
                                  whileHover={{ scale: 1.1 }}
                                  src={team.logo}
                                  alt={`${team.club} logo`}
                                  className="w-8 h-8 rounded-full object-cover border border-[#dd3913]/30 shadow-md"
                                />
                              ) : (
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="w-8 h-8 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 flex items-center justify-center text-white font-bold text-sm rounded-full shadow-md"
                                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                                >
                                  {index + 1}
                                </motion.div>
                              )}
                              <span 
                                className="text-white font-semibold text-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                              >
                                {team.club}
                              </span>
                            </div>
                          </td>
                          <td 
                            className="py-4 px-6 text-center text-gray-300 font-medium"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {team.played}
                          </td>
                          <td 
                            className="py-4 px-6 text-center text-green-400 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.won}
                          </td>
                          <td
                            className="py-4 px-6 text-center text-red-400 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.lost}
                          </td>
                          <td
                            className="py-4 px-6 text-center text-green-300 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.pw}
                          </td>
                          <td
                            className="py-4 px-6 text-center text-red-300 font-bold"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.pl}
                          </td>
                          <td 
                            className="py-4 px-6 text-center text-gray-300 font-medium"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {team.gf}
                          </td>
                          <td 
                            className="py-4 px-6 text-center text-gray-300 font-medium"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {team.ga}
                          </td>
                          <td 
                            className="py-4 px-6 text-center text-gray-300 font-medium"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {team.gd}
                          </td>
                          <td 
                            className="py-4 px-6 text-center text-[#dd3913] font-bold text-xl"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.points}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex space-x-2 justify-center">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setEditingStanding(team)}
                                className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                              >
                                EDIT
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => deleteStanding(team.id)}
                                className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                              >
                                DELETE
                              </motion.button>
            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'teams' && (
              <motion.div
                key="teams"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                  >
                    TEAM MANAGEMENT
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddStanding(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    ADD TEAM
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {standings.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                      }}
                      className="border border-gray-600/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {/* Team Logo */}
                          <div className="relative">
                            {team.logo ? (
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={team.logo}
                                alt={`${team.club} logo`}
                                className="w-12 h-12 rounded-full object-cover border-2 border-[#dd3913]/30 shadow-lg"
                              />
                            ) : (
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-12 h-12 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 flex items-center justify-center text-white font-bold text-lg rounded-full shadow-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                              >
                                {index + 1}
                              </motion.div>
                            )}
                            {/* Upload Button */}
                            <motion.label
                              whileHover={{ scale: 1.1 }}
                              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    uploadLogo(team.id, file);
                                  }
                                }}
                                disabled={uploadingLogo === team.id}
                              />
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </motion.label>
                            {uploadingLogo === team.id && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 
                              className="text-white font-bold text-lg truncate"
                              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                              title={team.club}
                            >
                              {team.club}
                            </h3>
                            <p 
                              className="text-[#dd3913] font-bold text-xl"
                              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                            >
                              {team.points} PTS
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0 ml-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingStanding(team)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            EDIT
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteStanding(team.id)}
                            className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            DELETE
                          </motion.button>
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div 
                            className="text-gray-400 text-xs font-semibold uppercase tracking-wide"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            PLAYED
                          </div>
                          <div 
                            className="text-white font-bold text-lg mt-1"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.played}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className="text-gray-400 text-xs font-semibold uppercase tracking-wide"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            WON
                          </div>
                          <div
                            className="text-green-400 font-bold text-lg mt-1"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.won}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className="text-gray-400 text-xs font-semibold uppercase tracking-wide"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            LOST
                          </div>
                          <div
                            className="text-red-400 font-bold text-lg mt-1"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.lost}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className="text-gray-400 text-xs font-semibold uppercase tracking-wide"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            PEN W
                          </div>
                          <div
                            className="text-green-300 font-bold text-lg mt-1"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.pw}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className="text-gray-400 text-xs font-semibold uppercase tracking-wide"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            PEN L
                          </div>
                          <div
                            className="text-red-300 font-bold text-lg mt-1"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.pl}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className="text-gray-400 text-xs font-semibold uppercase tracking-wide"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            GOAL DIFF
                          </div>
                          <div
                            className={`font-bold text-lg mt-1 ${team.gd >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            {team.gd >= 0 ? '+' : ''}{team.gd}
                          </div>
                        </div>
                      </div>

                      {/* Last 5 Results */}
                      <div className="mt-4">
                        <div 
                          className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          LAST 5 RESULTS
                        </div>
                        <div className="flex space-x-2">
                          {/* Most recent result first, like superleaguekerala.com */}
                          {[...team.last5].reverse().map((result, idx) => {
                            const badge = getResultBadge(result);
                            return (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.1 }}
                                title={badge.title}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${badge.className}`}
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                              >
                                {badge.label}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'matches' && (
      <motion.div
                key="matches"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                  >
                    MATCH MANAGEMENT
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddMatch(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    ADD MATCH
                  </motion.button>
          </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {matches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                      }}
                      className="border border-gray-600/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              match.is_finished 
                                ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                                : 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                            }`}
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            {match.is_finished ? 'COMPLETED' : 'UPCOMING'}
                          </motion.div>
                          <div 
                            className="text-gray-400 text-sm"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {new Date(match.date).toLocaleDateString()}
          </div>
        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingMatch(match)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            EDIT
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteMatch(match.id)}
                            className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-semibold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            DELETE
                          </motion.button>
                        </div>
                      </div>

                      {/* Teams and Score */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center space-x-6">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              {(() => {
                                const homeTeam = standings.find(t => t.club === match.home_team);
                                return homeTeam?.logo ? (
                                  <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    src={homeTeam.logo}
                                    alt={`${match.home_team} logo`}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-[#dd3913]/30 shadow-lg mr-3"
                                  />
                                ) : (
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-6 h-6 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 flex items-center justify-center text-white font-bold text-xs rounded-full shadow-md mr-3"
                                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                                  >
                                    H
                                  </motion.div>
                                );
                              })()}
                              <div 
                                className="text-white font-bold text-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                              >
                                {match.home_team}
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="text-[#dd3913] font-bold text-4xl"
                              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}
                            >
                              {match.home_goals !== null ? match.home_goals : '-'}
                            </motion.div>
                          </div>
                          <div
                            className="text-gray-400 font-bold text-xl text-center"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                          >
                            VS
                            {formatPenalties(match) && (
                              <div className="text-xs text-[#dd3913] mt-1 whitespace-nowrap" title="Penalty shootout">
                                PENS {formatPenalties(match)}
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div 
                                className="text-white font-bold text-lg"
                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                              >
                                {match.away_team}
                              </div>
                              {(() => {
                                const awayTeam = standings.find(t => t.club === match.away_team);
                                return awayTeam?.logo ? (
                                  <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    src={awayTeam.logo}
                                    alt={`${match.away_team} logo`}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-[#dd3913]/30 shadow-lg ml-3"
                                  />
                                ) : (
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-6 h-6 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 flex items-center justify-center text-white font-bold text-xs rounded-full shadow-md ml-3"
                                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                                  >
                                    A
                                  </motion.div>
                                );
                              })()}
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="text-[#dd3913] font-bold text-4xl"
                              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}
                            >
                              {match.away_goals !== null ? match.away_goals : '-'}
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Venue */}
                      <div className="text-center mb-4">
                        <div 
                          className="text-gray-300 text-sm"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          📍 {match.venue}
                        </div>
                      </div>

                      {/* Mark as Finished Button (only for upcoming matches) */}
                      {!match.is_finished && (
                        <div className="text-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          onClick={() => openScoreModal(match.id)}
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                          >
                            MARK AS FINISHED
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 
                  className="text-3xl font-bold text-white mb-8"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                >
                  SETTINGS
                </h2>
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-600/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 
                      className="text-xl font-semibold text-[#dd3913] mb-4"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      DATABASE CONNECTION
                    </h3>
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-4 h-4 rounded-full ${supabase ? 'bg-green-500' : 'bg-red-500'}`}
                      ></motion.div>
                      <span 
                        className="text-gray-300 font-medium"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {supabase ? 'Connected to Supabase' : 'Using Mock Data'}
                      </span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-600/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 
                      className="text-xl font-semibold text-[#dd3913] mb-6"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      QUICK ACTIONS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchData}
                        className="p-6 hover:bg-gray-800/30 text-white font-semibold transition-all duration-300 rounded-xl shadow-md hover:shadow-lg border border-gray-700/50 backdrop-blur-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        REFRESH DATA
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-6 hover:bg-gray-800/30 text-white font-semibold transition-all duration-300 rounded-xl shadow-md hover:shadow-lg border border-gray-700/50 backdrop-blur-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        EXPORT DATA
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Edit Standing Modal */}
      <AnimatePresence>
        {editingStanding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50"
            >
              <h3 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                EDIT STANDING
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const logoFile = formData.get('logo') as File;
                const updatedStanding = {
                  ...editingStanding,
                  club: formData.get('club') as string,
                  ...readStandingStats(formData)
                };
                updateStanding(updatedStanding, logoFile.size > 0 ? logoFile : undefined);
                setEditingStanding(null);
              }}>
                <div className="space-y-4">
            <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      TEAM NAME
                    </label>
                    <input
                      type="text"
                      name="club"
                      defaultValue={editingStanding.club}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      TEAM LOGO
                    </label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#dd3913] file:text-white hover:file:bg-[#dd3913]/80"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
                    {editingStanding.logo && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img 
                          src={editingStanding.logo} 
                          alt="Current logo" 
                          className="w-8 h-8 rounded-full object-cover border border-[#dd3913]/30"
                        />
                        <span className="text-gray-400 text-sm">Current logo</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {STANDING_FIELDS.map(({ name, label }) => (
                      <div key={name}>
                        <label
                          className="block text-gray-300 text-sm font-semibold mb-2"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          {label}
                        </label>
                        <input
                          type="number"
                          name={name}
                          min="0"
                          defaultValue={editingStanding[name]}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Played and points are calculated automatically: Win 3 · Pen win 2 · Pen loss 1 · Loss 0
                  </p>
                </div>
                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    UPDATE
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEditingStanding(null)}
                    className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl backdrop-blur-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </form>
      </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Standing Modal */}
      <AnimatePresence>
        {showAddStanding && (
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50"
            >
              <h3 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                ADD NEW TEAM
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const logoFile = formData.get('logo') as File;
                const newStanding = {
                  club: formData.get('club') as string,
                  ...readStandingStats(formData),
                  logo: null,
                  last5: []
                };
                addStanding(newStanding, logoFile.size > 0 ? logoFile : undefined);
                setShowAddStanding(false);
              }}>
        <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      TEAM NAME
                    </label>
                    <input
                      type="text"
                      name="club"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    />
          </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      TEAM LOGO
                    </label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#dd3913] file:text-white hover:file:bg-[#dd3913]/80"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
          </div>
                  <div className="grid grid-cols-2 gap-4">
                    {STANDING_FIELDS.map(({ name, label }) => (
                      <div key={name}>
                        <label
                          className="block text-gray-300 text-sm font-semibold mb-2"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                        >
                          {label}
                        </label>
                        <input
                          type="number"
                          name={name}
                          min="0"
                          defaultValue={0}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Played and points are calculated automatically: Win 3 · Pen win 2 · Pen loss 1 · Loss 0
                  </p>
                </div>
                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    ADD TEAM
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddStanding(false)}
                    className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl backdrop-blur-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </form>
      </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Match Modal */}
      <AnimatePresence>
        {editingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50"
            >
              <h3 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                EDIT MATCH
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const homeGoals = formData.get('home_goals') ? parseInt(formData.get('home_goals') as string) : null;
                const awayGoals = formData.get('away_goals') ? parseInt(formData.get('away_goals') as string) : null;
                // Penalties only apply when the match was level after 90 minutes
                const isLevel = homeGoals !== null && homeGoals === awayGoals;
                const updatedMatch = {
                  ...editingMatch,
                  home_team: formData.get('home_team') as string,
                  away_team: formData.get('away_team') as string,
                  venue: formData.get('venue') as string,
                  date: formData.get('date') as string,
                  home_goals: homeGoals,
                  away_goals: awayGoals,
                  home_penalties: isLevel && formData.get('home_penalties') ? parseInt(formData.get('home_penalties') as string) : null,
                  away_penalties: isLevel && formData.get('away_penalties') ? parseInt(formData.get('away_penalties') as string) : null,
                  is_finished: formData.get('is_finished') === 'on'
                };
                updateMatch(updatedMatch);
                setEditingMatch(null);
              }}>
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      HOME TEAM
                    </label>
                    <select
                      name="home_team"
                      defaultValue={editingMatch.home_team}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    >
                      <option value="">Select Home Team</option>
                      {standings.map(team => (
                        <option key={team.id} value={team.club} className="bg-gray-800 text-white">
                          {team.club}
                        </option>
                      ))}
                    </select>
    </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      AWAY TEAM
                    </label>
                    <select
                      name="away_team"
                      defaultValue={editingMatch.away_team}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    >
                      <option value="">Select Away Team</option>
                      {standings.map(team => (
                        <option key={team.id} value={team.club} className="bg-gray-800 text-white">
                          {team.club}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      VENUE
                    </label>
                    <input
                      type="text"
                      name="venue"
                      defaultValue={editingMatch.venue}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      DATE
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      defaultValue={new Date(editingMatch.date).toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label 
                        className="block text-gray-300 text-sm font-semibold mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        HOME GOALS
                      </label>
                      <input
                        type="number"
                        name="home_goals"
                        defaultValue={editingMatch.home_goals ?? ''}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>
                    <div>
                      <label 
                        className="block text-gray-300 text-sm font-semibold mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        AWAY GOALS
                      </label>
                      <input
                        type="number"
                        name="away_goals"
                        defaultValue={editingMatch.away_goals ?? ''}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-300 text-sm font-semibold mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        HOME PENS
                      </label>
                      <input
                        type="number"
                        name="home_penalties"
                        min="0"
                        placeholder="Only if level"
                        defaultValue={editingMatch.home_penalties ?? ''}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-300 text-sm font-semibold mb-2"
                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                      >
                        AWAY PENS
                      </label>
                      <input
                        type="number"
                        name="away_penalties"
                        min="0"
                        placeholder="Only if level"
                        defaultValue={editingMatch.away_penalties ?? ''}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="is_finished"
                      defaultChecked={editingMatch.is_finished}
                      className="w-5 h-5 text-[#dd3913] bg-gray-800/50 border-gray-600/50 focus:ring-[#dd3913] rounded-lg"
                    />
                    <label 
                      className="text-gray-300 text-sm font-semibold"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      MATCH COMPLETED
                    </label>
                  </div>
                </div>
                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    UPDATE
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEditingMatch(null)}
                    className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl backdrop-blur-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Match Modal */}
      <AnimatePresence>
        {showAddMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50"
            >
              <h3 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                ADD NEW MATCH
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newMatch = {
                  home_team: formData.get('home_team') as string,
                  away_team: formData.get('away_team') as string,
                  venue: formData.get('venue') as string,
                  date: formData.get('date') as string,
                  home_goals: null,
                  away_goals: null,
                  home_penalties: null,
                  away_penalties: null,
                  highlight: null,
                  is_finished: false,
                  home_image: null,
                  away_image: null
                };
                addMatch(newMatch);
                setShowAddMatch(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      HOME TEAM
                    </label>
                    <select
                      name="home_team"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    >
                      <option value="">Select Home Team</option>
                      {standings.map(team => (
                        <option key={team.id} value={team.club} className="bg-gray-800 text-white">
                          {team.club}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      AWAY TEAM
                    </label>
                    <select
                      name="away_team"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    >
                      <option value="">Select Away Team</option>
                      {standings.map(team => (
                        <option key={team.id} value={team.club} className="bg-gray-800 text-white">
                          {team.club}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      VENUE
                    </label>
                    <input
                      type="text"
                      name="venue"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-gray-300 text-sm font-semibold mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                    >
                      DATE
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors backdrop-blur-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#dd3913] to-[#dd3913]/80 hover:from-[#dd3913]/90 hover:to-[#dd3913]/70 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    ADD MATCH
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddMatch(false)}
                    className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl backdrop-blur-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deleteItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700/50"
            >
              <h3 
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                CONFIRM DELETE
              </h3>
              <p 
                className="text-gray-300 mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Are you sure you want to delete <span className="text-[#dd3913] font-semibold">{deleteItem.name}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  DELETE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteItem(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  CANCEL
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Score Entry Modal */}
      <AnimatePresence>
        {showScoreModal && scoreMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700/50"
            >
              <h3 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                ENTER MATCH SCORE
              </h3>
              <div className="space-y-4">
                <div>
                  <label 
                    className="block text-gray-300 text-sm font-semibold mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    {scoreMatch.homeTeam} Goals
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={scoreForm.home}
                    onChange={(e) => setScoreForm(prev => ({ ...prev, home: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-300 text-sm font-semibold mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    {scoreMatch.awayTeam} Goals
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={scoreForm.away}
                    onChange={(e) => setScoreForm(prev => ({ ...prev, away: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  />
                </div>

                {/* Level after 90 minutes: no draws, decided by a penalty shootout */}
                {scoreIsLevel && (
                  <div className="pt-4 border-t border-gray-700/50">
                    <div
                      className="text-[#dd3913] text-sm font-bold"
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                    >
                      PENALTY SHOOTOUT
                    </div>
                    <p
                      className="text-gray-400 text-xs mt-1 mb-3"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Level after 90 minutes. Shootout winner gets 2 points, loser gets 1 point.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {([
                        { key: 'homePens', team: scoreMatch.homeTeam },
                        { key: 'awayPens', team: scoreMatch.awayTeam }
                      ] as const).map(({ key, team }) => (
                        <div key={key}>
                          <label
                            className="block text-gray-300 text-xs font-semibold mb-2 truncate"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                            title={team}
                          >
                            {team}
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={scoreForm[key]}
                            onChange={(e) => setScoreForm(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white focus:border-[#dd3913] focus:outline-none rounded-lg transition-colors"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitScore}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  SUBMIT SCORE
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowScoreModal(false);
                    setScoreMatch(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  CANCEL
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;