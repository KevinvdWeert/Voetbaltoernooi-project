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

function classNames(...a){return a.filter(Boolean).join(" ")}

function Container({children}){
  return <div className="mx-auto max-w-7xl px-4">{children}</div>;
}

function StatCard({icon, value, label}){
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
      <div className="text-slate-400 text-xl mb-2">
        <i className={icon}></i>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}

function Home(){
  const [stats,setStats] = useState({teams:0,matches:0,players:0,finished:0});
  useEffect(()=>{
    fetch("./api/data.php?action=stats").then(r=>r.json()).then(d=>{if(d.success) setStats(d.data);});
  },[]);
  return (
    <div className="py-6">
      <Container>
        <section className="bg-slate-900 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome to Football Tournament</h1>
          <p className="text-slate-300 mt-2">Manage teams, schedule matches and follow live results.</p>
          <div className="mt-6 flex gap-3">
            <a href="#/teams" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg">
              <i className="fas fa-users"></i> Teams
            </a>
            <a href="#/matches" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-4 py-2 rounded-lg">
              <i className="fas fa-calendar-alt"></i> Matches
            </a>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="fas fa-users" value={stats.teams} label="Teams" />
          <StatCard icon="fas fa-futbol" value={stats.matches} label="Matches" />
          <StatCard icon="fas fa-user-friends" value={stats.players} label="Players" />
          <StatCard icon="fas fa-check-circle" value={stats.finished} label="Finished" />
        </section>
      </Container>
    </div>
  );
}

function FilterChips({value,onChange,options}){
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt.value} onClick={()=>onChange(opt.value)}
          className={classNames(
            "px-3 py-1.5 rounded-full text-sm border",
            value===opt.value?"border-blue-500 text-blue-500 bg-blue-50":"border-slate-300 text-slate-600 hover:border-slate-400"
          )}
        >{opt.label}</button>
      ))}
    </div>
  );
}

function MatchRow({m}){
  const isFinished = m.status === 'finished';
  const isLive = m.status === 'live';
  const dt = new Date(m.match_date);
  const time = dt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  return (
    <div className="grid grid-cols-[70px_1fr_64px_90px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 hover:bg-blue-50/40">
      <div className="text-slate-500 text-sm">{time}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-slate-300"/>
          <span className="truncate">{m.team1}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-slate-300"/>
          <span className="truncate">{m.team2}</span>
        </div>
      </div>
      <div className="text-center font-semibold">{isFinished ? `${m.team_a_score} - ${m.team_b_score}` : 'VS'}</div>
      <div className={classNames("inline-flex items-center justify-center gap-2 text-xs px-2 py-1 rounded-md", isLive?"bg-red-100 text-red-700":isFinished?"bg-emerald-100 text-emerald-700":"bg-blue-100 text-blue-700") }>
        {isLive? (<><i className="fas fa-bolt"></i>Live</>) : isFinished? (<><i className="fas fa-flag-checkered"></i>FT</>) : (<><i className="fas fa-clock"></i>{dt.toLocaleDateString()}</>)}
      </div>
    </div>
  );
}

function MatchSkeletonRow(){
  return (
    <div className="grid grid-cols-[70px_1fr_64px_90px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-12" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-300"/>
          <span className="h-4 bg-slate-200 rounded w-24" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-300"/>
          <span className="h-4 bg-slate-200 rounded w-24" />
        </div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-10 mx-auto" />
      <div className="h-5 bg-slate-200 rounded w-16" />
    </div>
  );
}

function MatchesPage({onlyFinished=false}){
  const [data,setData] = useState([]);
  const [filter,setFilter] = useState(onlyFinished? 'finished' : 'all');
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  function load(){
    setLoading(true); setError(null);
    fetch('./api/data.php?action=matches')
      .then(r=>r.json())
      .then(d=>{ if(d.success){ setData(d.data);} else { setError('Kon wedstrijden niet laden'); } })
      .catch(()=> setError('Kon wedstrijden niet laden'))
      .finally(()=> setLoading(false));
  }
  useEffect(()=>{ load(); },[]);
  const filtered = useMemo(()=>{
    return data.filter(m => {
      if (onlyFinished) return m.status === 'finished';
      if (filter==='all') return true;
      if (filter==='live') return m.status==='live';
      if (filter==='finished') return m.status==='finished';
      return true;
    });
  },[data,filter,onlyFinished]);
  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-600">{onlyFinished? 'Results' : 'Matches'}</h2>
          {!onlyFinished && (
            <FilterChips value={filter} onChange={setFilter} options={[{value:'all',label:'All'},{value:'live',label:'Live'},{value:'finished',label:'Finished'}]} />
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {loading && (
            <div>
              {Array.from({length:6}).map((_,i)=>(<MatchSkeletonRow key={i}/>))}
            </div>
          )}
          {!loading && error && (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4">
              <div>{error}</div>
              <button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Try again</button>
            </div>
          )}
          {!loading && !error && filtered.length===0 && (
            <div className="p-6 text-center text-slate-500">No matches found</div>
          )}
          {!loading && !error && filtered.map(m => (<MatchRow key={m.id} m={m} />))}
        </div>
      </Container>
    </div>
  );
}

function TeamRow({t}){
  return (
    <a href={`#/team/${t.id}`} className="grid grid-cols-[32px_1fr_260px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 hover:bg-blue-50/40">
      <span className="w-7 h-7 rounded-full bg-slate-300"/>
      <div className="font-semibold truncate">{t.name}</div>
      <div className="text-slate-500 text-sm truncate">Captain: {t.captain_name || 'Unassigned'} · {t.player_count} players · Since {new Date(t.created_at).toLocaleDateString()}</div>
    </a>
  );
}

function TeamSkeletonRow(){
  return (
    <div className="grid grid-cols-[32px_1fr_260px] items-center gap-3 px-3 py-2 border-b last:border-b-0 border-slate-200 animate-pulse">
      <span className="w-7 h-7 rounded-full bg-slate-300"/>
      <div className="h-4 bg-slate-200 rounded w-40" />
      <div className="h-4 bg-slate-200 rounded w-full" />
    </div>
  );
}

function TeamsPage(){
  const [teams,setTeams] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  function load(){
    setLoading(true); setError(null);
    fetch('./api/data.php?action=teams')
      .then(r=>r.json())
      .then(d=>{ if(d.success){ setTeams(d.data);} else { setError('Kon teams niet laden'); } })
      .catch(()=> setError('Kon teams niet laden'))
      .finally(()=> setLoading(false));
  }
  useEffect(()=>{ load(); },[]);
  return (
    <div className="py-6">
      <Container>
        <div className="mb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-600">Teams</h2>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {loading && (
            <div>{Array.from({length:8}).map((_,i)=>(<TeamSkeletonRow key={i}/>))}</div>
          )}
          {!loading && error && (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4">
              <div>{error}</div>
              <button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Try again</button>
            </div>
          )}
          {!loading && !error && teams.length===0 && (
            <div className="p-6 text-center text-slate-500">No teams found</div>
          )}
          {!loading && !error && teams.map(t => (<TeamRow key={t.id} t={t} />))}
        </div>
      </Container>
    </div>
  );
}

function TeamDetails({id}){
  const [team,setTeam] = useState(null);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(true);
  function load(){
    setLoading(true); setError(null);
    fetch(`./api/data.php?action=team&id=${id}`)
      .then(r=>r.json())
      .then(d=>{ if(d.success){ setTeam(d.data);} else { setError('Kon team niet laden'); } })
      .catch(()=> setError('Kon team niet laden'))
      .finally(()=> setLoading(false));
  }
  useEffect(()=>{ load(); },[id]);
  if (loading) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Loading…</div></Container></div>;
  if (error) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4"><div>{error}</div><button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Try again</button></div></Container></div>;
  if (!team) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Team not found</div></Container></div>;
  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-12 h-12 rounded-full bg-slate-300"/>
          <div>
            <h1 className="text-xl font-bold">{team.name}</h1>
            <div className="text-slate-500 text-sm">Captain: {team.captain_name || 'Unassigned'} · {team.player_count} players</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Players</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {(team.players||[]).length===0 ? <div className="p-4 text-slate-500 text-sm">No players</div> :
                team.players.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-slate-200"/>
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
              {(team.matches||[]).length===0 ? <div className="p-4 text-slate-500 text-sm">No matches</div> :
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

function NotFound(){
  return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Page not found</div></Container></div>;
}

function App(){
  const [route, setRoute] = useHashRoute();
  const parts = route.replace(/^\/+/, "").split("/");
  const page = parts[0] || ""; // '', 'teams', 'matches', 'results', 'team', 'match'

  useEffect(()=>{
    // Scroll to top on route change
    window.scrollTo({top:0, behavior:'smooth'});
    const titleMap = {
      '': 'Home | Football Tournament',
      'teams': 'Teams | Football Tournament',
      'matches': 'Matches | Football Tournament',
      'results': 'Results | Football Tournament',
      'team': 'Team | Football Tournament'
    };
    document.title = titleMap[page] || 'Football Tournament';
  },[route]);

  if (page === "") return <Home/>;
  if (page === "teams") return <TeamsPage/>;
  if (page === "matches") return <MatchesPage/>;
  if (page === "results") return <MatchesPage onlyFinished={true}/>;
  if (page === "team" && parts[1]) return <TeamDetails id={parts[1]} />;
  return <NotFound/>;
}

function mount(){
  const rootEl = document.getElementById('app');
  const headerEl = document.getElementById('header-root');
  if (!rootEl) return;

  function Header(){
    const [openDropdown,setOpenDropdown] = useState(false);
    const [openSettings,setOpenSettings] = useState(false);
    const [dark,setDark] = useState(()=>{
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      try { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch(_) { return false; }
    });
    const [query,setQuery] = useState('');
    const [results,setResults] = useState({teams:[],matches:[],players:[]});
    const [loadingSearch,setLoadingSearch] = useState(false);
    const [errorSearch,setErrorSearch] = useState(null);
    const [mobileNavOpen,setMobileNavOpen] = useState(false);
    const session = window.APP_SESSION || {loggedIn:false,user:null};
    const searchRef = useRef(null);
    const searchWrapRef = useRef(null);
    const debounceRef = useRef(null);
    const settingsRef = useRef(null);
    const profileRef = useRef(null);
    const settingsFirstItemRef = useRef(null);
    const profileFirstItemRef = useRef(null);
    const [currentRoute] = useHashRoute();
    const currentPage = currentRoute.replace(/^\/+/, "").split("/")[0] || '';

    useEffect(()=>{
      const cls = document.documentElement.classList;
      if (dark){ cls.add('dark'); localStorage.setItem('theme','dark'); }
      else { cls.remove('dark'); localStorage.setItem('theme','light'); }
    },[dark]);

    useEffect(()=>{
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (query.trim().length<2){
        setResults({teams:[],matches:[],players:[]});
        setErrorSearch(null);
        setLoadingSearch(false);
        return;
      }
      debounceRef.current = setTimeout(()=>{
        setLoadingSearch(true); setErrorSearch(null);
        fetch(`./api/data.php?action=search&query=${encodeURIComponent(query)}`)
          .then(r=>r.json())
          .then(d=>{
            if(d.success) {
              // Ensure players key exists if backend doesn't return it
              const data = d.data || {};
              setResults({teams:data.teams||[], matches:data.matches||[], players:data.players||[]});
            } else {
              setErrorSearch('No results');
              setResults({teams:[],matches:[],players:[]});
            }
          })
          .catch(()=> { setErrorSearch('Search failed'); setResults({teams:[],matches:[],players:[]}); })
          .finally(()=> setLoadingSearch(false));
      },300);
      return ()=>{ if (debounceRef.current) clearTimeout(debounceRef.current); };
    },[query]);

    useEffect(()=>{
      function onKey(e){
        if(e.key==='/' ){ e.preventDefault(); searchRef.current?.focus(); }
        if(e.key==='Escape'){ setOpenDropdown(false); setOpenSettings(false); }
      }
      window.addEventListener('keydown',onKey);
      return ()=>window.removeEventListener('keydown',onKey);
    },[]);

    // Close dropdowns and search results on outside click
    useEffect(()=>{
      function onOutside(e){
        if (openSettings && settingsRef.current && !settingsRef.current.contains(e.target)) setOpenSettings(false);
        if (openDropdown && profileRef.current && !profileRef.current.contains(e.target)) setOpenDropdown(false);
        if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
          // hide results panel but keep query
          // by blurring input, results panel will hide
          // no-op if clicking inside
          // We rely on focus/blur + below check to render
        }
      }
      document.addEventListener('pointerdown', onOutside, true);
      document.addEventListener('mousedown', onOutside, true);
      document.addEventListener('touchstart', onOutside, true);
      return ()=>{
        document.removeEventListener('pointerdown', onOutside, true);
        document.removeEventListener('mousedown', onOutside, true);
        document.removeEventListener('touchstart', onOutside, true);
      };
    }, [openSettings, openDropdown]);

    // Close dropdowns on route change
    useEffect(()=>{
      setOpenSettings(false);
      setOpenDropdown(false);
    }, [currentRoute]);

    // Focus first item when menus open
    useEffect(()=>{ if (openSettings) { setTimeout(()=>settingsFirstItemRef.current?.focus(), 0); } }, [openSettings]);
    useEffect(()=>{ if (openDropdown) { setTimeout(()=>profileFirstItemRef.current?.focus(), 0); } }, [openDropdown]);

    function moveFocus(e, container){
      const items = container ? Array.from(container.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')) : [];
      if (!items.length) return;
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown'){ e.preventDefault(); items[(idx+1+items.length)%items.length].focus(); }
      if (e.key === 'ArrowUp'){ e.preventDefault(); items[(idx-1+items.length)%items.length].focus(); }
      if (e.key === 'Home'){ e.preventDefault(); items[0].focus(); }
      if (e.key === 'End'){ e.preventDefault(); items[items.length-1].focus(); }
      if (e.key === 'Escape'){ e.preventDefault(); setOpenSettings(false); setOpenDropdown(false); }
    }

    function logout(){
      window.APP_SESSION = {loggedIn:false,user:null};
      location.href = './logout.php';
    }

    function navigateAndClose(href){
      window.location.hash = href;
      // hide any open menus
      setOpenSettings(false); setOpenDropdown(false);
      // blur search to close dropdown
      searchRef.current?.blur();
    }

    const showSearchDropdown = (document.activeElement === searchRef.current) && query.trim().length>=2;

    return (
      <header className="bg-slate-900 text-white shadow relative z-30" role="banner">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg" aria-label="Home">
              <i className="fas fa-bolt text-blue-500" aria-hidden="true"></i>
              <span>Football<span className="text-blue-500">Tournament</span></span>
            </a>
            <nav className={"hidden md:flex items-center gap-4 text-sm"} aria-label="Main navigation">
              {[
                {href:'#/', label:'Home', key:''},
                {href:'#/teams', label:'Teams', key:'teams'},
                {href:'#/matches', label:'Matches', key:'matches'},
                {href:'#/results', label:'Results', key:'results'}
              ].map(link => (
                <a key={link.href} href={link.href} aria-current={currentPage===link.key ? 'page' : undefined} className={"hover:text-blue-400 px-2 py-1 rounded " + (currentPage===link.key ? 'text-blue-400 bg-slate-800' : 'text-slate-200')}>{link.label}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>setMobileNavOpen(o=>!o)} className="md:hidden px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700" aria-label="Mobile menu" aria-expanded={mobileNavOpen}>
              <i className="fas fa-bars"></i>
            </button>

            {/* Inline search input with dropdown */}
            <div className="relative w-40 sm:w-56 md:w-72 lg:w-96" ref={searchWrapRef}>
              <div className="flex items-center gap-2 w-full px-3 py-2 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 focus-within:ring-2 focus-within:ring-blue-500">
                <i className="fas fa-search text-slate-400" aria-hidden="true"></i>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                  placeholder="Search teams, players, matches..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
                  aria-label="Search"
                  onKeyDown={(e)=>{ if(e.key==='Escape'){ e.preventDefault(); (e.target).blur(); } }}
                />
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 hidden md:inline">/</span>
              </div>

              {showSearchDropdown && (
                <div className="absolute left-0 right-0 mt-1 z-[10000] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xl max-h-80 overflow-auto">
                  {/* Loading / error states */}
                  {loadingSearch && <div className="px-3 py-2 text-sm text-slate-500">Searching...</div>}
                  {!loadingSearch && errorSearch && <div className="px-3 py-2 text-sm text-red-600">{errorSearch}</div>}

                  {/* Teams */}
                  {!loadingSearch && (results.teams||[]).length>0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Teams</div>
                      {(results.teams||[]).map(t=>(
                        <button key={t.id} onClick={()=>navigateAndClose(`#/team/${t.id}`)} className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60">
                          <span className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="truncate text-sm">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Players (if backend provides) */}
                  {!loadingSearch && (results.players||[]).length>0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Players</div>
                      {(results.players||[]).map(p=>(
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
                  {!loadingSearch && (results.matches||[]).length>0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Matches</div>
                      {(results.matches||[]).map(m=>(
                        <button key={m.id} onClick={()=>navigateAndClose(`#/matches`)} className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60">
                          <div className="truncate text-sm">{m.team_a_name} vs {m.team_b_name}</div>
                          <div className="text-xs text-slate-500">{new Date(m.match_date).toLocaleDateString()} {new Date(m.match_date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Empty */}
                  {!loadingSearch && !errorSearch && (results.teams||[]).length===0 && (results.players||[]).length===0 && (results.matches||[]).length===0 && (
                    <div className="px-3 py-2 text-sm text-slate-500">No results</div>
                  )}
                </div>
              )}
            </div>

            {/* Settings (kebab) */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={()=>{ setOpenSettings(o=>!o); setOpenDropdown(false); }}
                className="px-2.5 py-2 rounded-md text-sm bg-slate-800 hover:bg-slate-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="menu"
                aria-expanded={openSettings}
                aria-label="Open menu"
                aria-controls="settings-menu"
                onKeyDown={(e)=>{ if(e.key==='ArrowDown'){ e.preventDefault(); setOpenSettings(true); setTimeout(()=>settingsFirstItemRef.current?.focus(),0);} if(e.key==='Escape'){ setOpenSettings(false);} }}
              >
                <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
                <span className="sr-only">Menu</span>
              </button>
              {openSettings && (
                <div
                  id="settings-menu"
                  className="dropdown-menu absolute right-0 mt-2 w-64 z-[9999] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden text-sm origin-top-right p-1"
                  role="menu"
                  aria-orientation="vertical"
                  onKeyDown={(e)=>{ if(e.key==='Escape'){ e.preventDefault(); setOpenSettings(false);} else { moveFocus(e, settingsRef.current); } }}
                  onPointerDown={(e)=>e.stopPropagation()}
                >
                  <span className="absolute -top-1 right-4 h-2 w-2 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45" aria-hidden="true"></span>
                  <button
                    ref={settingsFirstItemRef}
                    type="button"
                    onClick={()=>setDark(d=>!d)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:bg-slate-50 dark:focus:bg-slate-700/70 focus:outline-none transition"
                    role="menuitem"
                  >
                    <i className="fas fa-adjust"></i> Theme: {dark? 'Dark':'Light'}
                  </button>
                  <div className="my-1 h-px bg-slate-100 dark:bg-slate-700/60" aria-hidden="true"></div>
                  <a
                    href="#/settings"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:bg-slate-50 dark:focus:bg-slate-700/70 focus:outline-none transition"
                    role="menuitem"
                  >
                    <i className="fas fa-sliders-h"></i> General settings
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
                onBlur={(e)=>{ const next=e.relatedTarget; if(!next || (profileRef.current && !profileRef.current.contains(next))) setOpenDropdown(false); }}
              >
                <button
                  type="button"
                  onClick={()=>{ setOpenDropdown(o=>!o); setOpenSettings(false);} }
                  className="px-3 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-500 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-haspopup="menu"
                  aria-expanded={openDropdown}
                  aria-controls="profile-menu"
                  onKeyDown={(e)=>{ if(e.key==='ArrowDown'){ e.preventDefault(); setOpenDropdown(true); setTimeout(()=>profileFirstItemRef.current?.focus(),0);} if(e.key==='Escape'){ setOpenDropdown(false);} }}
                >
                  <i className="fas fa-user-circle" aria-hidden="true"></i>
                  <span className="hidden sm:inline truncate max-w-[160px]">{session.user?.name || 'Profile'}</span>
                  <i className={"fas fa-chevron-down text-xs transition-transform " + (openDropdown ? "rotate-180" : "")} aria-hidden="true"></i>
                </button>
                {openDropdown && (
                  <div
                    id="profile-menu"
                    className="dropdown-menu absolute right-0 mt-2 w-64 z-[9999] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden text-sm origin-top-right p-1"
                    role="menu"
                    aria-orientation="vertical"
                    onKeyDown={(e)=>{ if(e.key==='Escape'){ e.preventDefault(); setOpenDropdown(false);} else { moveFocus(e, profileRef.current); } }}
                    onPointerDown={(e)=>e.stopPropagation()}
                  >
                    <span className="absolute -top-1 right-6 h-2 w-2 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45" aria-hidden="true"></span>
                    <a
                      ref={profileFirstItemRef}
                      href="#/profile"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:bg-slate-50 dark:focus:bg-slate-700/70 focus:outline-none transition"
                      role="menuitem"
                    >
                      <i className="fas fa-id-badge"></i> Profile
                    </a>
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-700/60" aria-hidden="true"></div>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/70 focus:bg-slate-50 dark:focus:bg-slate-700/70 text-red-600 focus:outline-none transition"
                      role="menuitem"
                    >
                      <i className="fas fa-sign-out-alt"></i> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="./login.php"
                onClick={()=>setMobileNavOpen(false)}
                className="px-3 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-500 flex items-center gap-2"
                aria-label="Log in"
              >
                <i className="fas fa-sign-in-alt" aria-hidden="true"></i> Login
              </a>
            )}
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pb-3" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1 pt-2 text-sm">
              {[
                {href:'#/', label:'Home', key:''},
                {href:'#/teams', label:'Teams', key:'teams'},
                {href:'#/matches', label:'Matches', key:'matches'},
                {href:'#/results', label:'Results', key:'results'}
              ].map(link => (
                <a key={link.href} href={link.href} aria-current={currentPage===link.key ? 'page' : undefined} onClick={()=>setMobileNavOpen(false)} className={"px-3 py-2 rounded-md " + (currentPage===link.key? 'bg-slate-800 text-blue-400':'hover:bg-slate-800')}>{link.label}</a>
              ))}
            </div>
          </nav>
        )}
      </header>
    );
  }

  if (headerEl){
    const headerRoot = ReactDOM.createRoot(headerEl);
    headerRoot.render(<Header/>);
  }
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App/>);
  try {
    window.dispatchEvent(new CustomEvent('app:ready'));
  } catch (_) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
