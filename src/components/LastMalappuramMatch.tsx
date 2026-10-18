"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPenalties, getMatchResults } from "@/lib/standings";
import { useReveal } from "@/lib/useReveal";
import SectionIntro from "@/components/SectionIntro";
import TeamLogo from "@/components/TeamLogo";

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  venue: string;
  date: string;
  home_goals: number | null;
  away_goals: number | null;
  home_penalties: number | null;
  away_penalties: number | null;
  highlight: string | null;
  is_finished: boolean;
}

interface MatchData {
  last: Match | null;
  fixtures: Match[];
  logos: Map<string, string | null>;
}

const MATCH_COLUMNS = "id, home_team, away_team, venue, date, home_goals, away_goals, home_penalties, away_penalties, highlight, is_finished";
const TICKETS_URL = "https://www.skillboxes.com/events-widget/malappuram-fc-oct-2026-122-sbtqpglh";
const INSTAGRAM_URL = "https://www.instagram.com/ultras.malappuram/";

// Used when Supabase isn't configured
const MOCK_DATA: MatchData = {
  last: { id: "1", home_team: "Malappuram FC", away_team: "Kochi United", venue: "Malappuram Stadium", date: "2024-01-15T15:00:00Z", home_goals: 2, away_goals: 1, home_penalties: null, away_penalties: null, highlight: "https://youtube.com/watch?v=example", is_finished: true },
  fixtures: [
    { id: "2", home_team: "Thiruvananthapuram FC", away_team: "Kozhikode City", venue: "Thiruvananthapuram Stadium", date: "2024-02-10T19:30:00Z", home_goals: null, away_goals: null, home_penalties: null, away_penalties: null, highlight: null, is_finished: false }
  ],
  logos: new Map()
};

// Kick-off times are typed in the admin as wall-clock time and stored as UTC, so read them back in UTC
const formatDate = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", ...options }).format(new Date(iso));

const youtubeId = (url: string) => url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null;

const pad = (n: number) => String(n).padStart(2, "0");

// Tablet and up: one side of the horizontal scoreboard
function Side({ name, logo, lost }: { name: string; logo?: string | null; lost: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-4 text-center ${lost ? "opacity-55" : ""}`}>
      <TeamLogo src={logo} name={name} size={80} />
      <span className="text-xl leading-tight font-bold">{name}</span>
    </div>
  );
}

// Phones: one row per team, so long club names never squeeze the score
function ScoreLine({ name, logo, goals, pens, lost }: { name: string; logo?: string | null; goals: number | null; pens: number | null; lost: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${lost ? "opacity-55" : ""}`}>
      <TeamLogo src={logo} name={name} size={40} />
      <span className="min-w-0 flex-1 leading-tight font-bold">{name}</span>
      {pens !== null && <span className="text-xs font-semibold text-white/50">({pens})</span>}
      <span className="w-9 text-right text-4xl font-extrabold tracking-[-0.04em] tabular-nums">{goals ?? "–"}</span>
    </div>
  );
}

function ResultCard({ match, logos }: { match: Match; logos: MatchData["logos"] }) {
  const results =
    match.home_goals !== null && match.away_goals !== null
      ? getMatchResults(match.home_goals, match.away_goals, match.home_penalties, match.away_penalties)
      : null;
  const homeLost = results?.home === "L" || results?.home === "PL";
  const awayLost = results?.away === "L" || results?.away === "PL";
  const pens = formatPenalties(match);
  const videoId = match.highlight ? youtubeId(match.highlight) : null;

  return (
    <div className="mt-4 border border-white/10">
      <div className="space-y-4 px-4 py-6 sm:hidden">
        <ScoreLine name={match.home_team} logo={logos.get(match.home_team)} goals={match.home_goals} pens={match.home_penalties} lost={homeLost} />
        <ScoreLine name={match.away_team} logo={logos.get(match.away_team)} goals={match.away_goals} pens={match.away_penalties} lost={awayLost} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
          {pens && <span className="text-[#dd3913]">Pens {pens} · </span>}
          Full time
        </p>
      </div>

      <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-10 px-10 py-14 sm:grid">
        <Side name={match.home_team} logo={logos.get(match.home_team)} lost={homeLost} />
        <div className="text-center">
          <p className="text-[clamp(4rem,10vw,7rem)] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap tabular-nums">
            {match.home_goals ?? "–"}
            <span className="mx-4 text-white/25">–</span>
            {match.away_goals ?? "–"}
          </p>
          {pens && <p className="mt-3 text-xs font-bold whitespace-nowrap uppercase tracking-[0.2em] text-[#dd3913]">Pens {pens}</p>}
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Full time</p>
        </div>
        <Side name={match.away_team} logo={logos.get(match.away_team)} lost={awayLost} />
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <span className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="size-4 shrink-0 text-[#dd3913]" aria-hidden />
          {match.venue}
        </span>
        {match.highlight && (
          <a href={match.highlight} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
            {videoId && (
              <span className="relative block aspect-video w-28 shrink-0 overflow-hidden">
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="size-5 fill-white text-white" aria-hidden />
                </span>
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.14em]">
              Watch highlights
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4 flex flex-col gap-3 border border-dashed border-white/15 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10">
      <p className="text-xl font-extrabold uppercase tracking-[-0.02em] sm:text-2xl">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-white/50">{children}</p>
    </div>
  );
}

const LastMalappuramMatch = () => {
  const [data, setData] = useState<MatchData | null>(null);
  const ref = useReveal<HTMLElement>(data);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setData(MOCK_DATA);
        return;
      }

      try {
        const [teams, fixtures, last] = await Promise.all([
          supabase.from("standings").select("club, logo"),
          supabase.from("matches").select(MATCH_COLUMNS).eq("is_finished", false).order("date", { ascending: true }),
          // maybeSingle: no finished match yet is a normal state, not an error
          supabase.from("matches").select(MATCH_COLUMNS).eq("is_finished", true).order("date", { ascending: false }).limit(1).maybeSingle()
        ]);
        setData({
          last: last.data ?? null,
          fixtures: fixtures.data ?? [],
          logos: new Map((teams.data ?? []).map((team): [string, string | null] => [team.club, team.logo]))
        });
      } catch (error) {
        console.error("Error fetching matches:", error);
        setData({ last: null, fixtures: [], logos: new Map() });
      }
    };
    load();
  }, []);

  return (
    <section ref={ref} aria-labelledby="matches-heading" className="relative bg-[#1a1f3c] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          id="matches-heading"
          label="Match centre"
          index="03"
          title={
            <>
              Last match &amp; <span className="text-[#dd3913]">what&apos;s next.</span>
            </>
          }
          intro="Results and upcoming fixtures from the Super League Kerala."
        />

        {data === null ? (
          <div className="mt-14 h-72 animate-pulse bg-white/4 sm:mt-20" aria-busy="true" aria-label="Loading matches" />
        ) : (
          <>
            <div data-reveal className="mt-14 sm:mt-20">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
                <h3>Last result</h3>
                {data.last && <span>{formatDate(data.last.date, { day: "numeric", month: "short", year: "numeric" })}</span>}
              </div>
              {data.last ? (
                <ResultCard match={data.last} logos={data.logos} />
              ) : (
                <EmptyBlock title="No results yet">The first final whistle of the season will show up here.</EmptyBlock>
              )}
            </div>

            <div data-reveal className="mt-16 sm:mt-24">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
                <h3>Upcoming fixtures</h3>
                <span className="tabular-nums">({pad(data.fixtures.length)})</span>
              </div>

              {data.fixtures.length ? (
                <ul>
                  {data.fixtures.map((fixture) => (
                    <li
                      key={fixture.id}
                      className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-4 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/3 sm:grid-cols-[6rem_1fr_auto] sm:items-center sm:gap-x-8 sm:px-4"
                    >
                      <div className="leading-none">
                        <p className="text-4xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-5xl">{formatDate(fixture.date, { day: "2-digit" })}</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                          <span className="block sm:inline">{formatDate(fixture.date, { month: "short" })}</span>
                          <span className="hidden sm:inline"> · </span>
                          <span className="block sm:inline">{formatDate(fixture.date, { weekday: "short" })}</span>
                        </p>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-base font-bold sm:text-xl">
                          <span className="flex items-center gap-2">
                            <TeamLogo src={data.logos.get(fixture.home_team)} name={fixture.home_team} size={28} />
                            {fixture.home_team}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#dd3913]">vs</span>
                          <span className="flex items-center gap-2">
                            <TeamLogo src={data.logos.get(fixture.away_team)} name={fixture.away_team} size={28} />
                            {fixture.away_team}
                          </span>
                        </div>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5 shrink-0" aria-hidden />
                            {formatDate(fixture.date, { hour: "numeric", minute: "2-digit", hour12: true })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" aria-hidden />
                            {fixture.venue}
                          </span>
                        </p>
                      </div>

                      <a
                        href={TICKETS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group col-start-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 hover:border-[#dd3913] hover:bg-[#dd3913] sm:col-start-auto"
                      >
                        Tickets
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyBlock title="No fixtures announced">
                  Fixtures appear here as soon as they&apos;re announced. Follow{" "}
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-[#dd3913] underline-offset-4">
                    @ultras.malappuram
                  </a>{" "}
                  for matchday updates.
                </EmptyBlock>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default React.memo(LastMalappuramMatch);
