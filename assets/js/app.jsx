/* @jsx React.createElement */
const { useState, useEffect, useMemo, useRef } = React;

// Simple hash router
function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || "/");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [route, (r) => { window.location.hash = r; }];
}

function classNames(...a) { return a.filter(Boolean).join(" ") }

function Container({ children }) {
  return <div className="mx-auto max-w-7xl px-4">{children}</div>;
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}

function Home() {
  const [stats, setStats] = useState({ teams: 0, matches: 0, players: 0, finished: 0 });
  useEffect(() => {
    fetch("./api/data.php?action=stats").then(r => r.json()).then(d => { if (d.success) setStats(d.data); });
  }, []);
  return (
    <div className="py-6">
      <Container>
        <section className="bg-slate-900 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome to Football Tournament</h1>
          <p className="text-slate-300 mt-2">Manage teams, schedule matches and follow live results.</p>
          <div className="mt-6 flex gap-3">
            <a href="#/teams" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg">
              Teams
            </a>
            <a href="#/matches" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-4 py-2 rounded-lg">
              Matches
            </a>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={stats.teams} label="Teams" />
          <StatCard value={stats.matches} label="Matches" />
          <StatCard value={stats.players} label="Players" />
          <StatCard value={stats.finished} label="Finished" />
        </section>
      </Container>
    </div>
  );
}

function FilterChips({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={classNames(
            "px-3 py-1.5 rounded-full text-sm border",
            value === opt.value ? "border-blue-500 text-blue-500 bg-blue-50" : "border-slate-300 text-slate-600 hover:border-slate-400"
          )}
        >{opt.label}</button>
      ))}
    </div>
  );
}

function MatchRow({ m }) {
  const isFinished = m.status === 'finished';
  const isLive = m.status === 'live';
  const dt = new Date(m.match_date);
  const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="grid grid-cols-[70px_1fr_64px_90px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 hover:bg-blue-50/40">
      <div className="text-slate-500 text-sm">{time}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-slate-300" />
          <span className="truncate">{m.team1}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-slate-300" />
          <span className="truncate">{m.team2}</span>
        </div>
      </div>
      <div className="text-center font-semibold">{isFinished ? `${m.team_a_score} - ${m.team_b_score}` : 'VS'}</div>
      <div className={classNames("inline-flex items-center justify-center gap-2 text-xs px-2 py-1 rounded-md", isLive ? "bg-red-100 text-red-700" : isFinished ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")}>
        {isLive ? (
          <>
            {/* Bolt icon */}
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg> Live
          </>
        ) : isFinished ? (
          <>
            {/* Flag icon */}
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4v16h2v-6h7l-1-3 1-3H6V4H4z" /></svg> FT
          </>
        ) : (
          <>
            {/* Clock icon */}
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5h-2v6l5 3 1-1.73-4-2.27V7z" /></svg> {dt.toLocaleDateString()}
          </>
        )}
      </div>
    </div>
  );
}

function MatchSkeletonRow() {
  return (
    <div className="grid grid-cols-[70px_1fr_64px_90px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-12" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-300" />
          <span className="h-4 bg-slate-200 rounded w-24" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-300" />
          <span className="h-4 bg-slate-200 rounded w-24" />
        </div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-10 mx-auto" />
      <div className="h-5 bg-slate-200 rounded w-16" />
    </div>
  );
}

function MatchesPage({ onlyFinished = false }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(onlyFinished ? 'finished' : 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true); setError(null);
    fetch('./api/data.php?action=matches')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { 
        if (d.success) { 
          setData(d.data); 
        } else { 
          setError(d.error?.message || 'Could not load matches'); 
        } 
      })
      .catch((err) => {
        console.error('Matches fetch error:', err);
        setError('Network error: could not fetch matches. Please check your internet connection.');
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => {
    return data.filter(m => {
      if (onlyFinished) return m.status === 'finished';
      if (filter === 'all') return true;
      if (filter === 'live') return m.status === 'live';
      if (filter === 'finished') return m.status === 'finished';
      return true;
    });
  }, [data, filter, onlyFinished]);
  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-600">{onlyFinished ? 'Results' : 'Matches'}</h2>
          {!onlyFinished && (
            <FilterChips value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'live', label: 'Live' }, { value: 'finished', label: 'Finished' }]} />
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {loading && (
            <div>
              {Array.from({ length: 6 }).map((_, i) => (<MatchSkeletonRow key={i} />))}
            </div>
          )}
          {!loading && error && (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4">
              <div>{error}</div>
              <button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Try again</button>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="p-6 text-center text-slate-500">No matches found</div>
          )}
          {!loading && !error && filtered.map(m => (<MatchRow key={m.id} m={m} />))}
        </div>
      </Container>
    </div>
  );
}

function TeamRow({ t }) {
  return (
    <a href={`#/team/${t.id}`} className="grid grid-cols-[32px_1fr_260px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 hover:bg-blue-50/40">
      <span className="w-7 h-7 rounded-full bg-slate-300" />
      <div className="font-semibold truncate">{t.name}</div>
      <div className="text-slate-500 text-sm truncate">Captain: {t.captain_name || 'Unassigned'} · {t.player_count} players · Since {new Date(t.created_at).toLocaleDateString()}</div>
    </a>
  );
}

function TeamSkeletonRow() {
  return (
    <div className="grid grid-cols-[32px_1fr_260px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 animate-pulse">
      <span className="w-7 h-7 rounded-full bg-slate-300" />
      <div className="h-4 bg-slate-200 rounded w-40" />
      <div className="h-4 bg-slate-200 rounded w-full" />
    </div>
  );
}

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  function load() {
    setLoading(true); setError(null);
    fetch('./api/data.php?action=teams')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { 
        if (d.success) { 
          setTeams(d.data); 
        } else { 
          setError(d.error?.message || 'Could not load teams'); 
        } 
      })
      .catch((err) => {
        console.error('Teams fetch error:', err);
        setError('Network error: could not fetch teams. Please check your internet connection.');
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);
  return (
    <div className="py-6">
      <Container>
        <div className="mb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-600">Teams</h2>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {loading && (
            <div>{Array.from({ length: 8 }).map((_, i) => (<TeamSkeletonRow key={i} />))}</div>
          )}
          {!loading && error && (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4">
              <div>{error}</div>
              <button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Try again</button>
            </div>
          )}
          {!loading && !error && teams.length === 0 && (
            <div className="p-6 text-center text-slate-500">No teams found</div>
          )}
          {!loading && !error && teams.map(t => (<TeamRow key={t.id} t={t} />))}
        </div>
      </Container>
    </div>
  );
}

function TeamDetails({ id }) {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  function load() {
    setLoading(true); setError(null);
    fetch(`./api/data.php?action=team&id=${id}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { 
        if (d.success) { 
          setTeam(d.data); 
        } else { 
          setError(d.error?.message || 'Could not load team'); 
        } 
      })
      .catch((err) => {
        console.error('Team detail fetch error:', err);
        setError('Network error: could not fetch team data.');
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, [id]);
  if (loading) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Loading…</div></Container></div>;
  if (error) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4"><div>{error}</div><button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Try again</button></div></Container></div>;
  if (!team) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Team not found</div></Container></div>;
  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-12 h-12 rounded-full bg-slate-300" />
          <div>
            <h1 className="text-xl font-bold">{team.name}</h1>
            <div className="text-slate-500 text-sm">Captain: {team.captain_name || 'Unassigned'} · {team.player_count} players</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Players</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {(team.players || []).length === 0 ? <div className="p-4 text-slate-500 text-sm">No players</div> :
                team.players.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-slate-200" />
                      <span className="truncate">{p.name}</span>
                    </div>
                    {p.jersey_number && <span className="text-slate-500 text-sm">#{p.jersey_number}</span>}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Recent matches</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {(team.matches || []).length === 0 ? <div className="p-4 text-slate-500 text-sm">No matches</div> :
                team.matches.map(m => (<MatchRow key={m.id} m={{
                  id: m.id,
                  team1: m.team_a_name,
                  team2: m.team_b_name,
                  match_date: m.match_date,
                  status: m.status,
                  team_a_score: m.team_a_score,
                  team_b_score: m.team_b_score
                }} />))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function NotFound() {
  return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Page not found</div></Container></div>;
}

function App() {
  const [route, setRoute] = useHashRoute();
  const parts = route.replace(/^\/+/, "").split("/");
  const page = parts[0] || ""; // '', 'teams', 'matches', 'results', 'team', 'match'

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const titleMap = {
      '': 'Home | Football Tournament',
      'teams': 'Teams | Football Tournament',
      'matches': 'Matches | Football Tournament',
      'results': 'Results | Football Tournament',
      'team': 'Team | Football Tournament'
    };
    document.title = titleMap[page] || 'Football Tournament';
  }, [route]);

  if (page === "") return <Home />;
  if (page === "teams") return <TeamsPage />;
  if (page === "matches") return <MatchesPage />;
  if (page === "results") return <MatchesPage onlyFinished={true} />;
  if (page === "team" && parts[1]) return <TeamDetails id={parts[1]} />;
  return <NotFound />;
}

function Footer() {
  const [currentRoute] = useHashRoute();
  const currentYear = new Date().getFullYear();

  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-12 pb-6 mt-16 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <a href="#/" onClick={scrollToTop} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <img src="./assets/img/favicon_light.ico" alt="Football Tournament" className="w-8 h-8 rounded-sm" />
              <span className="font-bold text-lg text-white">Football<span className="text-blue-400">Tournament</span></span>
            </a>
            <p className="text-sm text-slate-400 mb-4">
              Professional tournament management system for organizing and tracking football matches, teams, and results.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                 aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-400 flex items-center justify-center transition-colors"
                 aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
                 aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#/" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  Home
                </a>
              </li>
              <li>
                <a href="#/teams" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Teams
                </a>
              </li>
              <li>
                <a href="#/matches" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Matches
                </a>
              </li>
              <li>
                <a href="#/results" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Results
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="./contact.php" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#/about" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  About
                </a>
              </li>
              <li>
                <a href="#/faq" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-slate-400">123 Stadium Road<br />Sports City, SC 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:info@footballtournament.com" className="text-slate-400 hover:text-blue-400 transition-colors">info@footballtournament.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <a href="tel:+1234567890" className="text-slate-400 hover:text-blue-400 transition-colors">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>&copy; {currentYear} Football Tournament Project. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#/privacy" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#/cookies" className="hover:text-blue-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function mount() {
  const rootEl = document.getElementById('app');
  const headerEl = document.getElementById('header-root');
  const footerEl = document.getElementById('footer-root');
  if (!rootEl) return;

  function Header() {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [dark, setDark] = useState(() => {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      try { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) { return false; }
    });

    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ teams: [], matches: [], players: [] });
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorSearch, setErrorSearch] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const session = window.APP_SESSION || { loggedIn: false, user: null };
    const searchRef = useRef(null);
    const searchWrapRef = useRef(null);
    const debounceRef = useRef(null);
    const settingsRef = useRef(null);
    const profileRef = useRef(null);
    const settingsFirstItemRef = useRef(null);
    const profileFirstItemRef = useRef(null);
    const [currentRoute] = useHashRoute();
    const currentPage = currentRoute.replace(/^\/+/, "").split("/")[0] || '';

    useEffect(() => {
      const cls = document.documentElement.classList;
      if (dark) { cls.add('dark'); localStorage.setItem('theme', 'dark'); }
      else { cls.remove('dark'); localStorage.setItem('theme', 'light'); }
    }, [dark]);

    // Apply dark class + swap favicon based on theme
    useEffect(() => {
      const cls = document.documentElement.classList;
      const faviconEl = document.getElementById('site-favicon');
      if (dark) {
        cls.add('dark'); localStorage.setItem('theme', 'dark');
        if (faviconEl) faviconEl.href = './assets/img/favicon_light.ico';
      } else {
        cls.remove('dark'); localStorage.setItem('theme', 'light');
        if (faviconEl) faviconEl.href = './assets/img/favicon_dark.ico';
      }
    }, [dark]);

    useEffect(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (query.trim().length < 2) {
        setResults({ teams: [], matches: [], players: [] });
        setErrorSearch(null);
        setLoadingSearch(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        setLoadingSearch(true); setErrorSearch(null);
        fetch(`./api/data.php?action=search&query=${encodeURIComponent(query)}`)
          .then(r => r.json())
          .then(d => {
            if (d.success) {
              // Ensure players key exists if backend doesn't return it
              const data = d.data || {};
              setResults({ teams: data.teams || [], matches: data.matches || [], players: data.players || [] });
            } else {
              setErrorSearch('No results');
              setResults({ teams: [], matches: [], players: [] });
            }
          })
          .catch(() => { setErrorSearch('Search failed'); setResults({ teams: [], matches: [], players: [] }); })
          .finally(() => setLoadingSearch(false));
      }, 300);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query]);

    useEffect(() => {
      function onKey(e) {
        if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
        if (e.key === 'Escape') { setOpenDropdown(false); setOpenSettings(false); }
      }
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Close dropdowns and search results on outside click
    useEffect(() => {
      function onOutside(e) {
        if (openSettings && settingsRef.current && !settingsRef.current.contains(e.target)) setOpenSettings(false);
        if (openDropdown && profileRef.current && !profileRef.current.contains(e.target)) setOpenDropdown(false);
        if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        }
      }
      document.addEventListener('pointerdown', onOutside, true);
      document.addEventListener('mousedown', onOutside, true);
      document.addEventListener('touchstart', onOutside, true);
      return () => {
        document.removeEventListener('pointerdown', onOutside, true);
        document.removeEventListener('mousedown', onOutside, true);
        document.removeEventListener('touchstart', onOutside, true);
      };
    }, [openSettings, openDropdown]);

    // Close dropdowns on route change
    useEffect(() => {
      setOpenSettings(false);
      setOpenDropdown(false);
    }, [currentRoute]);

    // Focus first item when menus open
    useEffect(() => { if (openSettings) { setTimeout(() => settingsFirstItemRef.current?.focus(), 0); } }, [openSettings]);
    useEffect(() => { if (openDropdown) { setTimeout(() => profileFirstItemRef.current?.focus(), 0); } }, [openDropdown]);

    function moveFocus(e, container) {
      const items = container ? Array.from(container.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')) : [];
      if (!items.length) return;
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1 + items.length) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx - 1 + items.length) % items.length].focus(); }
      if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); setOpenSettings(false); setOpenDropdown(false); }
    }

    function logout() {
      window.APP_SESSION = { loggedIn: false, user: null };
      location.href = './logout.php';
    }

    function navigateAndClose(href) {
      window.location.hash = href;
      // hide any open menus
      setOpenSettings(false); setOpenDropdown(false);
      // blur search to close dropdown
      searchRef.current?.blur();
    }

    const showSearchDropdown = (document.activeElement === searchRef.current) && query.trim().length >= 2;

    return (
      <header
        className={(dark
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-900") + " shadow relative z-30 border-b " + (dark ? "border-slate-800" : "border-slate-200")}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg" aria-label="Home">
              <img
                src={dark ? './assets/img/favicon_dark.ico' : './assets/img/favicon_light.ico'}
                alt="Football Tournament"
                className="w-7 h-7 rounded-sm"
                width={28}
                height={28}
              />
              <span>Football<span className="text-blue-500">Tournament</span></span>
            </a>
            <nav className="hidden md:flex items-center gap-4 text-sm" aria-label="Main navigation">
              {[
                { href: '#/', label: 'Home', key: '' },
                { href: '#/teams', label: 'Teams', key: 'teams' },
                { href: '#/matches', label: 'Matches', key: 'matches' },
                { href: '#/results', label: 'Results', key: 'results' }
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={currentPage === link.key ? 'page' : undefined}
                  className={
                    (currentPage === link.key
                      ? (dark ? "text-blue-400 bg-slate-800" : "text-blue-600 bg-slate-100")
                      : (dark ? "text-slate-200 hover:text-blue-400" : "text-slate-600 hover:text-blue-600")
                    ) + " px-2 py-1 rounded"
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileNavOpen(o => !o)}
              className={(dark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200") + " md:hidden h-9 px-3 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition"}
              aria-label="Mobile menu"
              aria-expanded={mobileNavOpen}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
            </button>

            {/* Inline search input with dropdown */}
            <div className="relative w-40 sm:w-56 md:w-72 lg:w-96" ref={searchWrapRef}>
              <div
                className={
                  (dark
                    ? "bg-slate-800/80 border-slate-700 text-slate-300"
                    : "bg-slate-100 border-slate-300 text-slate-700"
                  ) + " flex items-center gap-2 w-full px-3 py-2.5 rounded-md border focus-within:ring-2 focus-within:ring-blue-500"
                }
              >
                <input
                  ref={searchRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search teams, players, matches..."
                  className={(dark ? "text-white" : "text-slate-800") + " flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"}
                  aria-label="Search"
                  onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); (e.target).blur(); } }}
                />
                <span className={(dark ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-200 text-slate-600 border-slate-300") + " ml-auto text-xs px-1.5 py-0.5 rounded border hidden md:inline"}>/</span>
              </div>

              {showSearchDropdown && (
                <div className={"absolute left-0 right-0 mt-1 z-[10000] rounded-md shadow-2xl max-h-80 overflow-auto border " + (dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                  {/* Loading / error states */}
                  {loadingSearch && <div className="px-3 py-2 text-sm text-slate-500">Searching...</div>}
                  {!loadingSearch && errorSearch && <div className="px-3 py-2 text-sm text-red-600">{errorSearch}</div>}

                  {/* Teams */}
                  {!loadingSearch && (results.teams || []).length > 0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Teams</div>
                      {(results.teams || []).map(t => (
                        <button key={t.id} onClick={() => navigateAndClose(`#/team/${t.id}`)} className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60">
                          <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="truncate text-sm">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Players (if backend provides) */}
                  {!loadingSearch && (results.players || []).length > 0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Players</div>
                      {(results.players || []).map(p => (
                        <div key={p.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span className="truncate text-sm">{p.name}</span>
                          </div>
                          {p.team_name && <span className="text-xs text-slate-500 truncate ml-3">{p.team_name}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matches */}
                  {!loadingSearch && (results.matches || []).length > 0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Matches</div>
                      {(results.matches || []).map(m => (
                        <button key={m.id} onClick={() => navigateAndClose(`#/matches`)} className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60">
                          <div className="truncate text-sm">{m.team_a_name} vs {m.team_b_name}</div>
                          <div className="text-xs text-slate-500">{new Date(m.match_date).toLocaleDateString()} {new Date(m.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Empty */}
                  {!loadingSearch && !errorSearch && (results.teams || []).length === 0 && (results.players || []).length === 0 && (results.matches || []).length === 0 && (
                    <div className="px-3 py-2 text-sm text-slate-500">No results</div>
                  )}
                </div>
              )}
            </div>

            {/* Settings (kebab) */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => { setOpenSettings(o => !o); setOpenDropdown(false); }}
                className={(dark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200") + " h-9 w-9 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition"}
                aria-haspopup="menu"
                aria-expanded={openSettings}
                aria-label="Open menu"
                aria-controls="settings-menu"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenSettings(true);
                    setTimeout(() => settingsFirstItemRef.current?.focus(), 0);
                  }
                  if (e.key === 'Escape') { setOpenSettings(false); }
                }}
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
                <span className="sr-only">Menu</span>
              </button>
              {openSettings && (
                <div
                  id="settings-menu"
                  className={"dropdown-menu absolute right-0 mt-2 w-64 z-[9999] rounded-lg shadow-2xl ring-1 overflow-hidden text-sm origin-top-right p-1 " + (dark ? "bg-slate-800 text-slate-200 ring-slate-700" : "bg-white text-slate-700 ring-slate-200")}
                  role="menu"
                  aria-orientation="vertical"
                  onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setOpenSettings(false); } else { moveFocus(e, settingsRef.current); } }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <span className={"absolute -top-1 right-4 h-2 w-2 rotate-45 " + (dark ? "bg-slate-800 border-r border-b border-slate-700" : "bg-white border-r border-b border-slate-200")} aria-hidden="true"></span>
                  <button
                    ref={settingsFirstItemRef}
                    type="button"
                    onClick={() => setDark(d => !d)}
                    className={"w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-md focus:outline-none transition " + (dark ? "hover:bg-slate-700/70 focus:bg-slate-700/70" : "hover:bg-slate-50 focus:bg-slate-50")}
                    role="menuitem"
                  >
                    Theme: {dark ? 'Dark' : 'Light'}
                  </button>
                  <div className={"my-1 h-px " + (dark ? "bg-slate-700/60" : "bg-slate-100")} aria-hidden="true"></div>
                  <a
                    href="#/settings"
                    className={"flex items-center gap-2 px-3 py-2.5 rounded-md focus:outline-none transition " + (dark ? "hover:bg-slate-700/70 focus:bg-slate-700/70" : "hover:bg-slate-50 focus:bg-slate-50")}
                    role="menuitem"
                  >
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7h10v2H4V7zm0 8h16v2H4v-2zm12-8h4v2h-4V7zm-6 8h6v2H10v-2z"/></svg>
                    General settings
                  </a>
                </div>
              )}
            </div>

            {/* Profile dropdown / Login remains */}
            {session.loggedIn ? (
              <div
                className="relative"
                ref={profileRef}
                tabIndex={-1}
                onBlur={(e) => { const next = e.relatedTarget; if (!next || (profileRef.current && !profileRef.current.contains(next))) setOpenDropdown(false); }}
              >
                <button
                  type="button"
                  onClick={() => { setOpenDropdown(o => !o); setOpenSettings(false); }}
                  className="bg-blue-600 hover:bg-blue-500 h-9 px-4 rounded-md text-sm font-medium inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown}
                  aria-controls="profile-menu"
                  onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpenDropdown(true); setTimeout(() => profileFirstItemRef.current?.focus(), 0); } if (e.key === 'Escape') { setOpenDropdown(false); } }}
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" /><path d="M4 20a8 8 0 0 1 16 0v2H4v-2z" /></svg>
                  <span className="hidden sm:inline truncate max-w-[160px]">{session.user?.name || 'Profile'}</span>
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={openDropdown ? "rotate-180 transition-transform" : "transition-transform"}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {openDropdown && (
                  <div
                    id="profile-menu"
                    className="dropdown-menu absolute right-0 mt-2 w-64 z-[9999] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden text-sm origin-top-right p-1"
                    role="menu"
                    aria-orientation="vertical"
                    onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setOpenDropdown(false); } else { moveFocus(e, profileRef.current); } }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <span className="absolute -top-1 right-6 h-2 w-2 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45" aria-hidden="true"></span>
                    <a
                      ref={profileFirstItemRef}
                      href="#/profile"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:bg-slate-50 dark:focus:bg-slate-700/70 focus:outline-none transition"
                      role="menuitem"
                    >
                      {/* ID/profile icon */}
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="12" cy="11" r="3" fill="#fff" /><path d="M7 18c1.5-2 3-3 5-3s3.5 1 5 3" fill="#fff" /></svg>
                      Profile
                    </a>
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-700/60" aria-hidden="true"></div>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:bg-slate-50 dark:focus:bg-slate-700/70 text-red-600 focus:outline-none transition"
                      role="menuitem"
                    >
                      {/* Sign out */}
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3z" /><path d="M14 16l5-4-5-4v3H9v2h5v3z" /></svg>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="./login.php"
                onClick={() => setMobileNavOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 h-11 px-5 rounded-md text-sm font-medium inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Log in"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3H6a2 2 0 0 0-2 2v4h2V5h7V3z"/><path d="M10 17l5-4-5-4v3H3v2h7v3z"/><path d="M18 21h-7v-2h7V5h-2V3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/></svg>
                <span className="hidden sm:inline">Login</span>
              </a>
            )}
          </div>
        </div>
        {mobileNavOpen && (
          <nav className={(dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200") + " md:hidden border-t px-4 pb-3"} aria-label="Mobile navigation">
            <div className="flex flex-col gap-1 pt-2 text-sm">
              {[
                { href: '#/', label: 'Home', key: '' },
                { href: '#/teams', label: 'Teams', key: 'teams' },
                { href: '#/matches', label: 'Matches', key: 'matches' },
                { href: '#/results', label: 'Results', key: 'results' }
              ].map(link => (
                <a key={link.href} href={link.href} aria-current={currentPage === link.key ? 'page' : undefined} onClick={() => setMobileNavOpen(false)} className={"px-3 py-2 rounded-md " + (currentPage === link.key ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800')}>{link.label}</a>
              ))}
            </div>
          </nav>
        )}
      </header>
    );
  }

  if (headerEl) {
    const headerRoot = ReactDOM.createRoot(headerEl);
    headerRoot.render(<Header />);
  }

  if (footerEl) {
    const footerRoot = ReactDOM.createRoot(footerEl);
    footerRoot.render(<Footer />);
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
  try {
    window.dispatchEvent(new CustomEvent('app:ready'));
  } catch (_) { }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
