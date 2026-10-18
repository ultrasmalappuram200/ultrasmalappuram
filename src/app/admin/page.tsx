'use client'

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MapPin,
  Plus,
  Settings,
  Shield,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { applyResult, calculatePoints, formatPenalties, getMatchResults, getResultBadge, sortStandings } from "@/lib/standings";

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

type NewStanding = Omit<Standing, "id">;
type NewMatch = Omit<Match, "id">;
type Tab = "overview" | "teams" | "standings" | "matches" | "settings";
type DeleteTarget = { type: "standing" | "match"; id: string; name: string };

// Only the columns the dashboard uses
const STANDING_COLUMNS = "id, club, logo, played, won, lost, pw, pl, gf, ga, gd, points, last5";
const MATCH_COLUMNS = "id, home_team, away_team, home_image, away_image, venue, date, home_goals, away_goals, home_penalties, away_penalties, highlight, is_finished";

const TABS: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "teams", label: "Teams", Icon: Users },
  { id: "standings", label: "Standings", Icon: ListOrdered },
  { id: "matches", label: "Matches", Icon: CalendarDays },
  { id: "settings", label: "Settings", Icon: Settings }
];

// Stats the admin enters for a team; played, goal difference and points are calculated
const STANDING_FIELDS = [
  { name: "won", label: "WON" },
  { name: "lost", label: "LOST" },
  { name: "pw", label: "PEN WON (PW)" },
  { name: "pl", label: "PEN LOST (PL)" },
  { name: "gf", label: "GOALS FOR" },
  { name: "ga", label: "GOALS AGAINST" }
] as const;

const TABLE_COLUMNS: { key: "played" | "won" | "lost" | "pw" | "pl" | "gf" | "ga"; label: string; title?: string; className: string }[] = [
  { key: "played", label: "P", className: "text-gray-300" },
  { key: "won", label: "W", className: "font-bold text-green-400" },
  { key: "lost", label: "L", className: "font-bold text-red-400" },
  { key: "pw", label: "PW", title: "Won on penalties", className: "font-bold text-green-300" },
  { key: "pl", label: "PL", title: "Lost on penalties", className: "font-bold text-red-300" },
  { key: "gf", label: "GF", className: "text-gray-300" },
  { key: "ga", label: "GA", className: "text-gray-300" }
];

// Played and points are derived from the results under the 3-2-1-0 system
const readStandingStats = (formData: FormData) => {
  const value = (name: string) => parseInt(formData.get(name) as string);
  const won = value("won");
  const lost = value("lost");
  const pw = value("pw");
  const pl = value("pl");
  const gf = value("gf");
  const ga = value("ga");
  return { won, lost, pw, pl, gf, ga, played: won + lost + pw + pl, gd: gf - ga, points: calculatePoints({ won, pw, pl }) };
};

// Columns written back to the database
const standingRow = ({ club, logo, played, won, lost, pw, pl, gf, ga, gd, points, last5 }: NewStanding) =>
  ({ club, logo, played, won, lost, pw, pl, gf, ga, gd, points, last5 });

const matchRow = ({ home_team, away_team, home_image, away_image, venue, date, home_goals, away_goals, home_penalties, away_penalties, highlight, is_finished }: NewMatch) =>
  ({ home_team, away_team, home_image, away_image, venue, date, home_goals, away_goals, home_penalties, away_penalties, highlight, is_finished });

const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`);

// Used when Supabase isn't configured
const MOCK_STANDINGS: Standing[] = [
  { id: "1", club: "Malappuram FC", logo: "https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=MFC", played: 5, won: 3, lost: 1, pw: 1, pl: 0, gf: 8, ga: 4, gd: 4, points: 11, last5: ["W", "PW", "W", "L", "W"] },
  { id: "2", club: "Kochi United", logo: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=KU", played: 5, won: 2, lost: 1, pw: 1, pl: 1, gf: 6, ga: 5, gd: 1, points: 9, last5: ["PW", "W", "PL", "W", "L"] },
  { id: "3", club: "Thiruvananthapuram FC", logo: "https://via.placeholder.com/100x100/059669/FFFFFF?text=TVM", played: 5, won: 2, lost: 2, pw: 1, pl: 0, gf: 7, ga: 7, gd: 0, points: 8, last5: ["L", "W", "PW", "L", "W"] },
  { id: "4", club: "Kozhikode City", logo: "https://via.placeholder.com/100x100/DC2626/FFFFFF?text=KC", played: 5, won: 1, lost: 1, pw: 1, pl: 2, gf: 5, ga: 5, gd: 0, points: 7, last5: ["PL", "L", "W", "PW", "PL"] },
  { id: "5", club: "Thrissur Titans", logo: "https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=TT", played: 5, won: 1, lost: 2, pw: 0, pl: 2, gf: 4, ga: 6, gd: -2, points: 5, last5: ["L", "PL", "L", "W", "PL"] },
  { id: "6", club: "Kannur Kings", logo: "https://via.placeholder.com/100x100/EA580C/FFFFFF?text=KK", played: 5, won: 0, lost: 2, pw: 1, pl: 2, gf: 3, ga: 7, gd: -4, points: 4, last5: ["PW", "L", "PL", "L", "PL"] }
];

const MOCK_MATCHES: Match[] = [
  { id: "1", home_team: "Malappuram FC", away_team: "Kochi United", home_image: null, away_image: null, venue: "Malappuram Stadium", date: "2024-01-15T15:00:00Z", home_goals: 2, away_goals: 1, home_penalties: null, away_penalties: null, highlight: "https://youtube.com/watch?v=example1", is_finished: true },
  { id: "2", home_team: "Thiruvananthapuram FC", away_team: "Kozhikode City", home_image: null, away_image: null, venue: "Thiruvananthapuram Stadium", date: "2024-02-10T15:00:00Z", home_goals: null, away_goals: null, home_penalties: null, away_penalties: null, highlight: null, is_finished: false },
  { id: "3", home_team: "Thrissur Titans", away_team: "Kannur Kings", home_image: null, away_image: null, venue: "Thrissur Arena", date: "2024-02-17T15:00:00Z", home_goals: null, away_goals: null, home_penalties: null, away_penalties: null, highlight: null, is_finished: false }
];

// Uploads to the team-logos bucket and returns the public URL, or null on failure
const uploadTeamLogo = async (file: File, prefix: string): Promise<string | null> => {
  if (!supabase) return URL.createObjectURL(file);

  try {
    const fileName = `${prefix}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("team-logos").upload(fileName, file);
    if (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo. Please check if storage bucket exists.");
      return null;
    }
    return supabase.storage.from("team-logos").getPublicUrl(fileName).data.publicUrl;
  } catch (error) {
    console.error("Error uploading logo:", error);
    toast.error("Failed to upload logo. Please check Supabase storage configuration.");
    return null;
  }
};

const BTN = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";
const BTN_PRIMARY = `${BTN} bg-linear-to-r from-[#dd3913] to-[#dd3913]/80 shadow-lg hover:from-[#dd3913]/90 hover:to-[#dd3913]/70`;
const BTN_SECONDARY = `${BTN} bg-gray-700/60 hover:bg-gray-600/60`;
const BTN_BLUE = `${BTN} bg-blue-600 hover:bg-blue-700`;
const BTN_RED = `${BTN} bg-red-600 hover:bg-red-700`;
const BTN_GREEN = `${BTN} bg-green-600 hover:bg-green-700`;
const SIZE_SM = "px-3 py-2 text-xs";
const SIZE_MD = "px-5 py-3 text-sm";
const CARD = "rounded-xl border border-gray-700/50 bg-white/[0.03]";
const INPUT = "w-full rounded-lg border border-gray-600/50 bg-gray-800/50 px-4 py-3 text-base text-white transition-colors placeholder:text-gray-500 focus:border-[#dd3913] focus:outline-none";
const LABEL = "mb-2 block text-sm font-semibold text-gray-300";

const LOGO_SIZES = { 32: "size-8", 36: "size-9", 40: "size-10", 48: "size-12" } as const;

// Storage logos are full-size PNGs; next/image serves them resized for these small avatars
const isStorageUrl = (src: string) => /^https:\/\/[^/]+\.supabase\.co\/storage\//.test(src);

function TeamLogo({ src, name, size }: { src?: string | null; name: string; size: keyof typeof LOGO_SIZES }) {
  if (!src) {
    return (
      <span className={`${LOGO_SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-linear-to-r from-[#dd3913] to-[#dd3913]/80 text-sm font-bold text-white`}>
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      unoptimized={!isStorageUrl(src)}
      className={`${LOGO_SIZES[size]} shrink-0 rounded-full border border-[#dd3913]/30 object-cover`}
    />
  );
}

// Most recent result first, like superleaguekerala.com
function ResultBadges({ last5 }: { last5: string[] }) {
  if (last5.length === 0) return <p className="text-sm text-gray-500">No matches yet</p>;

  return (
    <div className="flex gap-2">
      {[...last5].reverse().map((result, idx) => {
        const badge = getResultBadge(result);
        return (
          <span key={idx} title={badge.title} className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${badge.className}`}>
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 sm:mb-8">
      <h2 className="text-lg font-bold sm:text-3xl">{title}</h2>
      {action}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${BTN_PRIMARY} shrink-0 px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm`}>
      <Plus className="size-4" aria-hidden />
      {label}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`${CARD} p-4 sm:p-6`}>
      <h3 className="mb-4 text-base font-semibold text-[#dd3913] sm:mb-6 sm:text-xl">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className={`${CARD} p-6 text-center text-sm text-gray-400`}>{children}</p>;
}

function LoadingRows() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="h-20 animate-pulse rounded-xl bg-gray-800/50" />
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

// Bottom sheet on phones, centred dialog from sm up; header and footer stay put while the body scrolls
function Modal({ title, onClose, footer, children }: { title: string; onClose: () => void; footer: ReactNode; children: ReactNode }) {
  const titleId = useId();
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 transition-opacity duration-200 starting:opacity-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-gray-700/50 bg-gray-900 text-white shadow-2xl transition duration-200 ease-out starting:translate-y-6 starting:opacity-0 sm:max-w-md sm:rounded-xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-700/50 px-5 py-4 sm:px-6">
          <h3 id={titleId} className="text-lg font-bold sm:text-xl">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
        <div className="flex gap-3 border-t border-gray-700/50 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">{footer}</div>
      </div>
    </div>
  );
}

const OverviewTab = memo(function OverviewTab({ standings, matches }: { standings: Standing[]; matches: Match[] }) {
  return (
    <div>
      <SectionHeader title="LEAGUE OVERVIEW" />
      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
        <Panel title="TOP TEAMS">
          {standings.length === 0 ? (
            <p className="text-sm text-gray-400">No teams yet</p>
          ) : (
            <div className="space-y-3">
              {standings.slice(0, 3).map((team) => (
                <div key={team.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-500/50 bg-gray-800/30 p-3 sm:p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamLogo src={team.logo} name={team.club} size={40} />
                    <span className="truncate font-semibold sm:text-lg">{team.club}</span>
                  </div>
                  <span className="shrink-0 text-lg font-bold text-[#dd3913] sm:text-xl">{team.points} PTS</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="RECENT MATCHES">
          {matches.length === 0 ? (
            <p className="text-sm text-gray-400">No matches yet</p>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 3).map((match) => {
                const pens = formatPenalties(match);
                return (
                  <div key={match.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-500/50 bg-gray-800/30 p-3 sm:p-4">
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug sm:text-lg">{match.home_team} vs {match.away_team}</p>
                      <p className="mt-0.5 text-sm text-gray-400">{new Date(match.date).toLocaleDateString()}</p>
                    </div>
                    <div className="shrink-0 text-right text-lg font-bold text-[#dd3913] sm:text-xl">
                      {match.is_finished ? `${match.home_goals}-${match.away_goals}` : "TBD"}
                      {pens && <div className="text-xs text-gray-400">PENS {pens}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
});

type TeamActions = {
  onAdd: () => void;
  onEdit: (team: Standing) => void;
  onDelete: (team: Standing) => void;
};

const StandingsTab = memo(function StandingsTab({ standings, onAdd, onEdit, onDelete }: { standings: Standing[] } & TeamActions) {
  return (
    <div>
      <SectionHeader title="LEAGUE STANDINGS" action={<AddButton label="ADD TEAM" onClick={onAdd} />} />

      {standings.length === 0 ? (
        <EmptyState>No teams yet. Add the first one.</EmptyState>
      ) : (
        <>
          {/* Phones and tablets: one card per team */}
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
            {standings.map((team, index) => (
              <li key={team.id} className={`${CARD} p-4`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-center text-lg font-bold">{index + 1}</span>
                  <TeamLogo src={team.logo} name={team.club} size={40} />
                  <span className="min-w-0 flex-1 font-semibold leading-tight">{team.club}</span>
                  <span className="shrink-0 text-right">
                    <span className="text-2xl font-extrabold text-[#dd3913]">{team.points}</span>
                    <span className="ml-1 text-[10px] font-semibold text-gray-400">PTS</span>
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-4 gap-1.5 text-center">
                  {([
                    ["P", team.played], ["W", team.won], ["L", team.lost], ["PW", team.pw],
                    ["PL", team.pl], ["GF", team.gf], ["GA", team.ga], ["GD", signed(team.gd)]
                  ] as const).map(([label, value]) => (
                    <div key={label} className="rounded-md bg-gray-800/50 py-1.5">
                      <dt className="text-[10px] font-semibold text-gray-400">{label}</dt>
                      <dd className="text-sm font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => onEdit(team)} className={`${BTN_BLUE} ${SIZE_SM}`}>EDIT</button>
                  <button type="button" onClick={() => onDelete(team)} className={`${BTN_RED} ${SIZE_SM}`}>DELETE</button>
                </div>
              </li>
            ))}
          </ol>

          {/* Desktop: full table */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-600/50 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600/50 text-xs uppercase tracking-wider text-gray-300">
                  <th className="px-4 py-4 text-left font-semibold">Pos</th>
                  <th className="px-4 py-4 text-left font-semibold">Team</th>
                  {TABLE_COLUMNS.map(({ key, label, title }) => (
                    <th key={key} title={title} className="px-3 py-4 text-center font-semibold">{label}</th>
                  ))}
                  <th className="px-3 py-4 text-center font-semibold">GD</th>
                  <th className="px-3 py-4 text-center font-semibold">Pts</th>
                  <th className="px-4 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600/50">
                {standings.map((team, index) => (
                  <tr key={team.id} className="transition-colors hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-lg font-bold">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-44 items-center gap-3">
                        <TeamLogo src={team.logo} name={team.club} size={32} />
                        <span className="font-semibold">{team.club}</span>
                      </div>
                    </td>
                    {TABLE_COLUMNS.map(({ key, className }) => (
                      <td key={key} className={`px-3 py-3 text-center ${className}`}>{team[key]}</td>
                    ))}
                    <td className="px-3 py-3 text-center text-gray-300">{signed(team.gd)}</td>
                    <td className="px-3 py-3 text-center text-xl font-bold text-[#dd3913]">{team.points}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button type="button" onClick={() => onEdit(team)} className={`${BTN_BLUE} ${SIZE_SM}`}>EDIT</button>
                        <button type="button" onClick={() => onDelete(team)} className={`${BTN_RED} ${SIZE_SM}`}>DELETE</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
});

const TeamsTab = memo(function TeamsTab({ standings, uploadingLogo, onUploadLogo, onAdd, onEdit, onDelete }: {
  standings: Standing[];
  uploadingLogo: string | null;
  onUploadLogo: (teamId: string, file: File) => void;
} & TeamActions) {
  return (
    <div>
      <SectionHeader title="TEAM MANAGEMENT" action={<AddButton label="ADD TEAM" onClick={onAdd} />} />

      {standings.length === 0 ? (
        <EmptyState>No teams yet. Add the first one.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {standings.map((team) => (
            <div key={team.id} className={`${CARD} p-4 sm:p-5`}>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <TeamLogo src={team.logo} name={team.club} size={48} />
                  <label
                    title="Upload logo"
                    className="absolute -right-1.5 -bottom-1.5 flex size-7 cursor-pointer items-center justify-center rounded-full bg-blue-600 shadow-lg transition-colors hover:bg-blue-700"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingLogo === team.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadLogo(team.id, file);
                        e.target.value = "";
                      }}
                    />
                    <Upload className="size-3.5" aria-hidden />
                    <span className="sr-only">Upload {team.club} logo</span>
                  </label>
                  {uploadingLogo === team.id && (
                    <span className="absolute inset-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg leading-tight font-bold">{team.club}</h3>
                  <p className="text-xl font-bold text-[#dd3913]">{team.points} PTS</p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "PLAYED", value: team.played, color: "text-white" },
                  { label: "WON", value: team.won, color: "text-green-400" },
                  { label: "LOST", value: team.lost, color: "text-red-400" },
                  { label: "PEN W", value: team.pw, color: "text-green-300" },
                  { label: "PEN L", value: team.pl, color: "text-red-300" },
                  { label: "GOAL DIFF", value: signed(team.gd), color: team.gd >= 0 ? "text-green-400" : "text-red-400" }
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
                    <dd className={`mt-1 text-lg font-bold ${color}`}>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">LAST 5 RESULTS</p>
                <ResultBadges last5={team.last5} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onEdit(team)} className={`${BTN_BLUE} ${SIZE_SM}`}>EDIT</button>
                <button type="button" onClick={() => onDelete(team)} className={`${BTN_RED} ${SIZE_SM}`}>DELETE</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

function ScoreRow({ team, logo, goals, pens }: { team: string; logo?: string | null; goals: number | null; pens: number | null }) {
  return (
    <div className="flex items-center gap-3">
      <TeamLogo src={logo} name={team} size={36} />
      <span className="min-w-0 flex-1 font-semibold leading-tight">{team}</span>
      {pens !== null && (
        <span className="text-xs font-semibold text-gray-400" title="Penalty shootout">({pens})</span>
      )}
      <span className="w-8 shrink-0 text-right text-2xl font-extrabold text-[#dd3913]">{goals ?? "-"}</span>
    </div>
  );
}

const MatchesTab = memo(function MatchesTab({ matches, logos, onAdd, onEdit, onDelete, onFinish }: {
  matches: Match[];
  logos: Map<string, string | null>;
  onAdd: () => void;
  onEdit: (match: Match) => void;
  onDelete: (match: Match) => void;
  onFinish: (match: Match) => void;
}) {
  return (
    <div>
      <SectionHeader title="MATCH MANAGEMENT" action={<AddButton label="ADD MATCH" onClick={onAdd} />} />

      {matches.length === 0 ? (
        <EmptyState>No matches yet. Add the first fixture.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <article key={match.id} className={`${CARD} p-4 sm:p-5`}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    match.is_finished
                      ? "border-green-500/30 bg-green-900/50 text-green-300"
                      : "border-yellow-500/30 bg-yellow-900/50 text-yellow-300"
                  }`}
                >
                  {match.is_finished ? "COMPLETED" : "UPCOMING"}
                </span>
                <span className="text-sm text-gray-400">{new Date(match.date).toLocaleDateString()}</span>
              </div>

              <div className="mt-4 space-y-3">
                <ScoreRow team={match.home_team} logo={logos.get(match.home_team)} goals={match.home_goals} pens={match.home_penalties} />
                <ScoreRow team={match.away_team} logo={logos.get(match.away_team)} goals={match.away_goals} pens={match.away_penalties} />
              </div>

              <p className="mt-4 flex items-center gap-1.5 text-sm text-gray-300">
                <MapPin className="size-4 shrink-0 text-[#dd3913]" aria-hidden />
                <span className="truncate">{match.venue}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onEdit(match)} className={`${BTN_BLUE} ${SIZE_SM} flex-1 sm:flex-none`}>EDIT</button>
                <button type="button" onClick={() => onDelete(match)} className={`${BTN_RED} ${SIZE_SM} flex-1 sm:flex-none`}>DELETE</button>
                {!match.is_finished && (
                  <button type="button" onClick={() => onFinish(match)} className={`${BTN_GREEN} ${SIZE_SM} w-full sm:ml-auto sm:w-auto`}>
                    MARK AS FINISHED
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
});

const SettingsTab = memo(function SettingsTab({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div>
      <SectionHeader title="SETTINGS" />
      <div className="space-y-4 sm:space-y-8">
        <Panel title="DATABASE CONNECTION">
          <div className="flex items-center gap-3">
            <span className={`size-3 shrink-0 animate-pulse rounded-full ${supabase ? "bg-green-500" : "bg-red-500"}`} />
            <span className="font-medium text-gray-300">{supabase ? "Connected to Supabase" : "Using Mock Data"}</span>
          </div>
        </Panel>
        <Panel title="QUICK ACTIONS">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
            <button type="button" onClick={onRefresh} className={`${BTN} rounded-xl border border-gray-700/50 p-4 hover:bg-gray-800/30 sm:p-6`}>
              REFRESH DATA
            </button>
            <button type="button" className={`${BTN} rounded-xl border border-gray-700/50 p-4 hover:bg-gray-800/30 sm:p-6`}>
              EXPORT DATA
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
});

function StandingFormModal({ team, onClose, onSubmit }: {
  team?: Standing;
  onClose: () => void;
  onSubmit: (standing: NewStanding, logoFile?: File) => void;
}) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const logoFile = formData.get("logo") as File;
    const club = formData.get("club") as string;
    const stats = readStandingStats(formData);
    onSubmit(team ? { ...team, club, ...stats } : { club, ...stats, logo: null, last5: [] }, logoFile.size > 0 ? logoFile : undefined);
    onClose();
  };

  return (
    <Modal
      title={team ? "EDIT STANDING" : "ADD NEW TEAM"}
      onClose={onClose}
      footer={
        <>
          <button type="submit" form="standing-form" className={`${BTN_PRIMARY} ${SIZE_MD} flex-1`}>{team ? "UPDATE" : "ADD TEAM"}</button>
          <button type="button" onClick={onClose} className={`${BTN_SECONDARY} ${SIZE_MD} flex-1`}>CANCEL</button>
        </>
      }
    >
      <form id="standing-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="TEAM NAME">
          <input type="text" name="club" defaultValue={team?.club} required className={INPUT} />
        </Field>
        <Field label="TEAM LOGO">
          <input
            type="file"
            name="logo"
            accept="image/*"
            className={`${INPUT} py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#dd3913] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#dd3913]/80`}
          />
        </Field>
        {team?.logo && (
          <div className="flex items-center gap-2">
            <TeamLogo src={team.logo} name={team.club} size={32} />
            <span className="text-sm text-gray-400">Current logo</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {STANDING_FIELDS.map(({ name, label }) => (
            <Field key={name} label={label}>
              <input type="number" name={name} min="0" inputMode="numeric" defaultValue={team ? team[name] : 0} required className={INPUT} />
            </Field>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Played and points are calculated automatically: Win 3 · Pen win 2 · Pen loss 1 · Loss 0
        </p>
      </form>
    </Modal>
  );
}

function TeamSelect({ name, placeholder, teams, defaultValue }: { name: string; placeholder: string; teams: Standing[]; defaultValue?: string }) {
  return (
    <select name={name} defaultValue={defaultValue} required className={INPUT}>
      <option value="">{placeholder}</option>
      {teams.map((team) => (
        <option key={team.id} value={team.club} className="bg-gray-800 text-white">
          {team.club}
        </option>
      ))}
    </select>
  );
}

function MatchFormModal({ match, teams, onClose, onSubmit }: {
  match?: Match;
  teams: Standing[];
  onClose: () => void;
  onSubmit: (match: NewMatch) => void;
}) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const details = {
      home_team: formData.get("home_team") as string,
      away_team: formData.get("away_team") as string,
      venue: formData.get("venue") as string,
      date: formData.get("date") as string
    };

    if (!match) {
      onSubmit({ ...details, home_goals: null, away_goals: null, home_penalties: null, away_penalties: null, highlight: null, is_finished: false, home_image: null, away_image: null });
      onClose();
      return;
    }

    const homeGoals = formData.get("home_goals") ? parseInt(formData.get("home_goals") as string) : null;
    const awayGoals = formData.get("away_goals") ? parseInt(formData.get("away_goals") as string) : null;
    // Penalties only apply when the match was level after 90 minutes
    const isLevel = homeGoals !== null && homeGoals === awayGoals;
    onSubmit({
      ...match,
      ...details,
      home_goals: homeGoals,
      away_goals: awayGoals,
      home_penalties: isLevel && formData.get("home_penalties") ? parseInt(formData.get("home_penalties") as string) : null,
      away_penalties: isLevel && formData.get("away_penalties") ? parseInt(formData.get("away_penalties") as string) : null,
      is_finished: formData.get("is_finished") === "on"
    });
    onClose();
  };

  return (
    <Modal
      title={match ? "EDIT MATCH" : "ADD NEW MATCH"}
      onClose={onClose}
      footer={
        <>
          <button type="submit" form="match-form" className={`${BTN_PRIMARY} ${SIZE_MD} flex-1`}>{match ? "UPDATE" : "ADD MATCH"}</button>
          <button type="button" onClick={onClose} className={`${BTN_SECONDARY} ${SIZE_MD} flex-1`}>CANCEL</button>
        </>
      }
    >
      <form id="match-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="HOME TEAM">
          <TeamSelect name="home_team" placeholder="Select Home Team" teams={teams} defaultValue={match?.home_team} />
        </Field>
        <Field label="AWAY TEAM">
          <TeamSelect name="away_team" placeholder="Select Away Team" teams={teams} defaultValue={match?.away_team} />
        </Field>
        <Field label="VENUE">
          <input type="text" name="venue" defaultValue={match?.venue} required className={INPUT} />
        </Field>
        <Field label="DATE">
          <input
            type="datetime-local"
            name="date"
            defaultValue={match ? new Date(match.date).toISOString().slice(0, 16) : undefined}
            required
            className={INPUT}
          />
        </Field>

        {match && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Field label="HOME GOALS">
                <input type="number" name="home_goals" min="0" inputMode="numeric" defaultValue={match.home_goals ?? ""} className={INPUT} />
              </Field>
              <Field label="AWAY GOALS">
                <input type="number" name="away_goals" min="0" inputMode="numeric" defaultValue={match.away_goals ?? ""} className={INPUT} />
              </Field>
              <Field label="HOME PENS">
                <input type="number" name="home_penalties" min="0" inputMode="numeric" placeholder="Only if level" defaultValue={match.home_penalties ?? ""} className={INPUT} />
              </Field>
              <Field label="AWAY PENS">
                <input type="number" name="away_penalties" min="0" inputMode="numeric" placeholder="Only if level" defaultValue={match.away_penalties ?? ""} className={INPUT} />
              </Field>
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="is_finished" defaultChecked={match.is_finished} className="size-5 accent-[#dd3913]" />
              <span className="text-sm font-semibold text-gray-300">MATCH COMPLETED</span>
            </label>
          </>
        )}
      </form>
    </Modal>
  );
}

function ScoreModal({ match, onClose, onSubmit }: {
  match: Match;
  onClose: () => void;
  onSubmit: (homeGoals: number, awayGoals: number, homePens: number | null, awayPens: number | null) => Promise<void>;
}) {
  // Local state keeps typing from re-rendering the whole dashboard
  const [form, setForm] = useState({ home: "", away: "", homePens: "", awayPens: "" });
  const [saving, setSaving] = useState(false);
  const isLevel = form.home !== "" && form.away !== "" && Number(form.home) === Number(form.away);

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    const homeGoals = parseInt(form.home);
    const awayGoals = parseInt(form.away);
    if (Number.isNaN(homeGoals) || Number.isNaN(awayGoals) || homeGoals < 0 || awayGoals < 0) {
      toast.error("Enter the score for both teams");
      return;
    }

    const homePens = isLevel && form.homePens !== "" ? parseInt(form.homePens) : null;
    const awayPens = isLevel && form.awayPens !== "" ? parseInt(form.awayPens) : null;
    if (!getMatchResults(homeGoals, awayGoals, homePens, awayPens)) {
      toast.error("Match is level: enter the penalty shootout score (it needs a winner)");
      return;
    }

    // Guards against a double tap applying the result twice
    setSaving(true);
    await onSubmit(homeGoals, awayGoals, homePens, awayPens);
    onClose();
  };

  return (
    <Modal
      title="ENTER MATCH SCORE"
      onClose={onClose}
      footer={
        <>
          <button type="submit" form="score-form" disabled={saving} className={`${BTN_GREEN} ${SIZE_MD} flex-1`}>
            {saving ? "SAVING..." : "SUBMIT SCORE"}
          </button>
          <button type="button" onClick={onClose} className={`${BTN_SECONDARY} ${SIZE_MD} flex-1`}>CANCEL</button>
        </>
      }
    >
      <form id="score-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label={`${match.home_team} Goals`}>
          <input type="number" min="0" inputMode="numeric" placeholder="0" value={form.home} onChange={update("home")} className={INPUT} />
        </Field>
        <Field label={`${match.away_team} Goals`}>
          <input type="number" min="0" inputMode="numeric" placeholder="0" value={form.away} onChange={update("away")} className={INPUT} />
        </Field>

        {/* Level after 90 minutes: no draws, decided by a penalty shootout */}
        {isLevel && (
          <div className="border-t border-gray-700/50 pt-4">
            <p className="text-sm font-bold text-[#dd3913]">PENALTY SHOOTOUT</p>
            <p className="mt-1 mb-3 text-xs text-gray-400">Level after 90 minutes. Shootout winner gets 2 points, loser gets 1 point.</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Field label={match.home_team}>
                <input type="number" min="0" inputMode="numeric" placeholder="0" value={form.homePens} onChange={update("homePens")} className={INPUT} />
              </Field>
              <Field label={match.away_team}>
                <input type="number" min="0" inputMode="numeric" placeholder="0" value={form.awayPens} onChange={update("awayPens")} className={INPUT} />
              </Field>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}

function ConfirmDeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => Promise<void>; onClose: () => void }) {
  const [deleting, setDeleting] = useState(false);

  return (
    <Modal
      title="CONFIRM DELETE"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              await onConfirm();
              setDeleting(false);
            }}
            className={`${BTN_RED} ${SIZE_MD} flex-1`}
          >
            {deleting ? "DELETING..." : "DELETE"}
          </button>
          <button type="button" onClick={onClose} className={`${BTN_SECONDARY} ${SIZE_MD} flex-1`}>CANCEL</button>
        </>
      }
    >
      <p className="text-gray-300">
        Are you sure you want to delete <span className="font-semibold text-[#dd3913]">{name}</span>? This action cannot be undone.
      </p>
    </Modal>
  );
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [standings, setStandings] = useState<Standing[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [standingModal, setStandingModal] = useState<Standing | "new" | null>(null);
  const [matchModal, setMatchModal] = useState<Match | "new" | null>(null);
  const [scoreMatch, setScoreMatch] = useState<Match | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setStandings(MOCK_STANDINGS);
      setMatches(MOCK_MATCHES);
      setLoading(false);
      return;
    }

    try {
      // Both tables load in parallel
      const [standingsResult, matchesResult] = await Promise.all([
        supabase
          .from("standings")
          .select(STANDING_COLUMNS)
          .order("points", { ascending: false })
          .order("gd", { ascending: false })
          .order("gf", { ascending: false }),
        supabase.from("matches").select(MATCH_COLUMNS).order("date", { ascending: true })
      ]);

      if (standingsResult.error) {
        console.error("Standings error:", standingsResult.error);
        toast.error("Failed to load standings");
      } else {
        setStandings(standingsResult.data || []);
      }

      if (matchesResult.error) {
        console.error("Matches error:", matchesResult.error);
        toast.error("Failed to load matches");
      } else {
        setMatches(matchesResult.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const updateStanding = async (standing: Standing, logoFile?: File) => {
    try {
      const logo = logoFile ? await uploadTeamLogo(logoFile, "team") : standing.logo;
      if (logoFile && !logo) return;
      const updated = { ...standing, logo };

      if (supabase) {
        const { error } = await supabase.from("standings").update(standingRow(updated)).eq("id", standing.id);
        if (error) {
          console.error("Update standing error:", error);
          toast.error(`Failed to update standing: ${error.message}`);
          return;
        }
      }

      setStandings((prev) => sortStandings(prev.map((s) => (s.id === standing.id ? updated : s))));
      toast.success("Standing updated successfully!");
    } catch (error) {
      console.error("Error updating standing:", error);
      toast.error("Failed to update standing");
    }
  };

  const addStanding = async (standing: NewStanding, logoFile?: File) => {
    try {
      const logo = logoFile ? await uploadTeamLogo(logoFile, "team") : standing.logo;
      if (logoFile && !logo) return;
      let created: Standing = { ...standing, logo, id: Date.now().toString() };

      if (supabase) {
        const { data, error } = await supabase.from("standings").insert(standingRow(created)).select(STANDING_COLUMNS).single();
        if (error) {
          console.error("Add standing error:", error);
          toast.error(`Failed to add team: ${error.message || "Database error"}`);
          return;
        }
        created = data;
      }

      setStandings((prev) => sortStandings([...prev, created]));
      toast.success("Team added successfully!");
    } catch (error) {
      console.error("Error adding standing:", error);
      toast.error("Failed to add team");
    }
  };

  const uploadLogo = useCallback(async (teamId: string, file: File) => {
    setUploadingLogo(teamId);
    try {
      const logo = await uploadTeamLogo(file, teamId);
      if (!logo) return;

      if (supabase) {
        const { error } = await supabase.from("standings").update({ logo }).eq("id", teamId);
        if (error) {
          console.error("Update error:", error);
          toast.error("Failed to update team logo");
          return;
        }
      }

      setStandings((prev) => prev.map((team) => (team.id === teamId ? { ...team, logo } : team)));
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo. Please check Supabase storage configuration.");
    } finally {
      setUploadingLogo(null);
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    const label = type === "standing" ? "team" : "match";

    try {
      if (supabase) {
        const { error } = await supabase.from(type === "standing" ? "standings" : "matches").delete().eq("id", id);
        if (error) {
          console.error(`Delete ${label} error:`, error);
          toast.error(`Failed to delete ${label}: ${error.message || "Database error"}`);
          return;
        }
      }

      if (type === "standing") setStandings((prev) => prev.filter((s) => s.id !== id));
      else setMatches((prev) => prev.filter((m) => m.id !== id));
      toast.success(`${type === "standing" ? "Team" : "Match"} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${label}:`, error);
      toast.error(`Failed to delete ${label}`);
    }

    setDeleteTarget(null);
  };

  const updateMatch = async (match: Match) => {
    try {
      if (supabase) {
        const { error } = await supabase.from("matches").update(matchRow(match)).eq("id", match.id);
        if (error) {
          console.error("Update match error:", error);
          toast.error(`Failed to update match: ${error.message}`);
          return;
        }
      }

      setMatches((prev) => prev.map((m) => (m.id === match.id ? match : m)));
      toast.success("Match updated successfully!");
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match");
    }
  };

  const addMatch = async (match: NewMatch) => {
    try {
      let created: Match = { ...match, id: Date.now().toString() };

      if (supabase) {
        const { data, error } = await supabase.from("matches").insert(matchRow(match)).select(MATCH_COLUMNS).single();
        if (error) {
          console.error("Add match error:", error);
          toast.error(`Failed to add match: ${error.message}`);
          return;
        }
        created = data;
      }

      setMatches((prev) => [...prev, created]);
      toast.success("Match added successfully!");
    } catch (error) {
      console.error("Error adding match:", error);
      toast.error("Failed to add match");
    }
  };

  const markMatchFinished = async (matchId: string, homeGoals: number, awayGoals: number, homePens: number | null, awayPens: number | null) => {
    const match = matches.find((m) => m.id === matchId);
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

    const homeTeam = standings.find((t) => t.club === match.home_team);
    const awayTeam = standings.find((t) => t.club === match.away_team);
    const updatedTeams = [
      homeTeam && applyResult(homeTeam, results.home, homeGoals, awayGoals),
      awayTeam && applyResult(awayTeam, results.away, awayGoals, homeGoals)
    ].filter((team): team is Standing => !!team);

    const applyLocally = () => {
      setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, ...finishedMatch } : m)));
      setStandings((prev) => sortStandings(prev.map((t) => updatedTeams.find((u) => u.id === t.id) ?? t)));
      toast.success("Match marked as finished and standings updated!");
    };

    if (!supabase) {
      applyLocally();
      return;
    }

    try {
      const { error } = await supabase.from("matches").update(finishedMatch).eq("id", matchId);
      if (error) {
        console.error("Mark finished error:", error);
        toast.error(`Failed to mark match as finished: ${error.message || "Database error"}`);
        return;
      }

      for (const team of updatedTeams) {
        // Only the stats change here; name and logo are left as they are in the database
        const { played, won, lost, pw, pl, gf, ga, gd, points, last5 } = team;
        const { error: standingError } = await supabase
          .from("standings")
          .update({ played, won, lost, pw, pl, gf, ga, gd, points, last5 })
          .eq("id", team.id);
        if (standingError) {
          console.error("Update standing error:", standingError);
          toast.error(`Match saved, but failed to update ${team.club} standings: ${standingError.message}`);
          fetchData();
          return;
        }
      }

      applyLocally();
    } catch (error) {
      console.error("Error marking match as finished:", error);
      toast.error("Failed to mark match as finished");
    }
  };

  // Stable callbacks so the memoised tabs don't re-render when a modal opens or closes
  const openAddStanding = useCallback(() => setStandingModal("new"), []);
  const openAddMatch = useCallback(() => setMatchModal("new"), []);
  const requestDeleteStanding = useCallback((team: Standing) => setDeleteTarget({ type: "standing", id: team.id, name: team.club }), []);
  const requestDeleteMatch = useCallback(
    (match: Match) => setDeleteTarget({ type: "match", id: match.id, name: `${match.home_team} vs ${match.away_team}` }),
    []
  );

  const logoByClub = useMemo(() => new Map(standings.map((team) => [team.club, team.logo])), [standings]);
  const completedMatches = matches.filter((m) => m.is_finished).length;
  const statCards = [
    { title: "TEAMS", value: standings.length, color: "text-blue-400", Icon: Shield },
    { title: "MATCHES", value: matches.length, color: "text-emerald-400", Icon: CalendarDays },
    { title: "COMPLETED", value: completedMatches, color: "text-green-400", Icon: CheckCircle2 },
    { title: "UPCOMING", value: matches.length - completedMatches, color: "text-purple-400", Icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-[#1a1f3c] font-[Montserrat,sans-serif] text-white">
      <header className="border-b border-gray-700/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-3xl">ADMIN DASHBOARD</h1>
            <p className="mt-0.5 truncate text-xs text-gray-400 sm:mt-1 sm:text-sm">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={`${BTN} shrink-0 bg-linear-to-r from-red-600 to-red-700 px-3 py-2 text-xs shadow-lg hover:from-red-700 hover:to-red-800 sm:px-6 sm:py-3 sm:text-sm`}
          >
            <LogOut className="size-4" aria-hidden />
            LOGOUT
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-8">
        <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
          {statCards.map(({ title, value, color, Icon }) => (
            <div key={title} className={`${CARD} relative overflow-hidden p-4 sm:p-6`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 sm:text-sm">{title}</p>
              <p className={`mt-1 text-2xl font-extrabold sm:mt-2 sm:text-4xl ${color}`}>{loading ? "–" : value}</p>
              <Icon className={`absolute top-1/2 right-3 size-9 -translate-y-1/2 opacity-20 sm:right-5 sm:size-12 ${color}`} aria-hidden />
            </div>
          ))}
        </div>

        {/* Sticky so the sections stay one tap away on long lists */}
        <nav
          aria-label="Dashboard sections"
          className="sticky top-0 z-30 -mx-4 mb-4 border-b border-gray-700/50 bg-[#1a1f3c] px-2 py-2 sm:mx-0 sm:mb-8 sm:rounded-xl sm:border sm:p-2"
        >
          <div className="grid grid-cols-5 gap-1 lg:flex lg:gap-2">
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-semibold tracking-tight transition-colors md:text-xs lg:flex-row lg:gap-2 lg:px-5 lg:py-3 lg:text-sm lg:tracking-normal lg:uppercase ${
                    active
                      ? "bg-linear-to-r from-[#dd3913] to-[#dd3913]/80 text-white shadow-lg"
                      : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                  }`}
                >
                  <Icon className="size-5 shrink-0 lg:size-4" aria-hidden />
                  <span className="max-w-full truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section key={activeTab} className="transition-opacity duration-300 starting:opacity-0 sm:rounded-xl sm:border sm:border-gray-700/50 sm:p-6 lg:p-8">
          {loading ? (
            <LoadingRows />
          ) : (
            <>
              {activeTab === "overview" && <OverviewTab standings={standings} matches={matches} />}
              {activeTab === "standings" && (
                <StandingsTab standings={standings} onAdd={openAddStanding} onEdit={setStandingModal} onDelete={requestDeleteStanding} />
              )}
              {activeTab === "teams" && (
                <TeamsTab
                  standings={standings}
                  uploadingLogo={uploadingLogo}
                  onUploadLogo={uploadLogo}
                  onAdd={openAddStanding}
                  onEdit={setStandingModal}
                  onDelete={requestDeleteStanding}
                />
              )}
              {activeTab === "matches" && (
                <MatchesTab
                  matches={matches}
                  logos={logoByClub}
                  onAdd={openAddMatch}
                  onEdit={setMatchModal}
                  onDelete={requestDeleteMatch}
                  onFinish={setScoreMatch}
                />
              )}
              {activeTab === "settings" && <SettingsTab onRefresh={fetchData} />}
            </>
          )}
        </section>
      </main>

      {standingModal && (
        <StandingFormModal
          team={standingModal === "new" ? undefined : standingModal}
          onClose={() => setStandingModal(null)}
          onSubmit={(standing, logoFile) =>
            standingModal === "new" ? addStanding(standing, logoFile) : updateStanding({ ...standing, id: standingModal.id }, logoFile)
          }
        />
      )}

      {matchModal && (
        <MatchFormModal
          match={matchModal === "new" ? undefined : matchModal}
          teams={standings}
          onClose={() => setMatchModal(null)}
          onSubmit={(match) => (matchModal === "new" ? addMatch(match) : updateMatch({ ...match, id: matchModal.id }))}
        />
      )}

      {scoreMatch && (
        <ScoreModal
          match={scoreMatch}
          onClose={() => setScoreMatch(null)}
          onSubmit={(homeGoals, awayGoals, homePens, awayPens) => markMatchFinished(scoreMatch.id, homeGoals, awayGoals, homePens, awayPens)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal name={deleteTarget.name} onConfirm={confirmDelete} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
