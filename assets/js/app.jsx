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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welkom bij Voetbaltoernooi</h1>
          <p className="text-slate-300 mt-2">Beheer teams, plan wedstrijden en volg live uitslagen.</p>
          <div className="mt-6 flex gap-3">
            <a href="#/teams" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg">
              <i className="fas fa-users"></i> Teams
            </a>
            <a href="#/wedstrijden" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-4 py-2 rounded-lg">
              <i className="fas fa-calendar-alt"></i> Wedstrijden
            </a>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="fas fa-users" value={stats.teams} label="Teams" />
          <StatCard icon="fas fa-futbol" value={stats.matches} label="Wedstrijden" />
          <StatCard icon="fas fa-user-friends" value={stats.players} label="Spelers" />
          <StatCard icon="fas fa-check-circle" value={stats.finished} label="Afgerond" />
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
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-600">{onlyFinished? 'Uitslagen' : 'Wedstrijden'}</h2>
          {!onlyFinished && (
            <FilterChips value={filter} onChange={setFilter} options={[{value:'all',label:'Alle'},{value:'live',label:'Live'},{value:'finished',label:'Afgerond'}]} />
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
              <button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Opnieuw proberen</button>
            </div>
          )}
          {!loading && !error && filtered.length===0 && (
            <div className="p-6 text-center text-slate-500">Geen wedstrijden gevonden</div>
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
      <div className="text-slate-500 text-sm truncate">Aanvoerder: {t.captain_name || 'Niet toegewezen'} · {t.player_count} spelers · Sinds {new Date(t.created_at).toLocaleDateString()}</div>
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
              <button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Opnieuw proberen</button>
            </div>
          )}
          {!loading && !error && teams.length===0 && (
            <div className="p-6 text-center text-slate-500">Geen teams gevonden</div>
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
  if (loading) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Laden…</div></Container></div>;
  if (error) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500 flex flex-col items-center gap-4"><div>{error}</div><button onClick={load} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500">Opnieuw proberen</button></div></Container></div>;
  if (!team) return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Team niet gevonden</div></Container></div>;
  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <span className="w-12 h-12 rounded-full bg-slate-300"/>
          <div>
            <h1 className="text-xl font-bold">{team.name}</h1>
            <div className="text-slate-500 text-sm">Aanvoerder: {team.captain_name || 'Niet toegewezen'} · {team.player_count} spelers</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Spelers</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {(team.players||[]).length===0 ? <div className="p-4 text-slate-500 text-sm">Geen spelers</div> :
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
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Laatste wedstrijden</h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {(team.matches||[]).length===0 ? <div className="p-4 text-slate-500 text-sm">Geen wedstrijden</div> :
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
  return <div className="py-6"><Container><div className="p-6 text-center text-slate-500">Pagina niet gevonden</div></Container></div>;
}

function App(){
  const [route, setRoute] = useHashRoute();
  const parts = route.replace(/^\/+/, "").split("/");
  const page = parts[0] || ""; // '', 'teams', 'wedstrijden', 'uitslagen', 'team', 'match'

  useEffect(()=>{
    // Scroll to top on route change
    window.scrollTo({top:0, behavior:'smooth'});
    const titleMap = {
      '': 'Home | Voetbaltoernooi',
      'teams': 'Teams | Voetbaltoernooi',
      'wedstrijden': 'Wedstrijden | Voetbaltoernooi',
      'uitslagen': 'Uitslagen | Voetbaltoernooi',
      'team': 'Team | Voetbaltoernooi'
    };
    document.title = titleMap[page] || 'Voetbaltoernooi';
  },[route]);

  if (page === "") return <Home/>;
  if (page === "teams") return <TeamsPage/>;
  if (page === "wedstrijden") return <MatchesPage/>;
  if (page === "uitslagen") return <MatchesPage onlyFinished={true}/>;
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
    const [dark,setDark] = useState(()=>localStorage.getItem('theme')==='dark');
    const [searchOpen,setSearchOpen] = useState(false);
    const [query,setQuery] = useState('');
    const [results,setResults] = useState({teams:[],matches:[]});
    const [loadingSearch,setLoadingSearch] = useState(false);
    const [errorSearch,setErrorSearch] = useState(null);
    const [mobileNavOpen,setMobileNavOpen] = useState(false);
    const session = window.APP_SESSION || {loggedIn:false,user:null};
    const searchRef = useRef(null);
    const debounceRef = useRef(null);
    const [currentRoute] = useHashRoute();
    const currentPage = currentRoute.replace(/^\/+/, "").split("/")[0] || '';

    useEffect(()=>{
      const cls = document.documentElement.classList;
      if (dark){ cls.add('dark'); localStorage.setItem('theme','dark'); }
      else { cls.remove('dark'); localStorage.setItem('theme','light'); }
    },[dark]);

    useEffect(()=>{
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (query.trim().length<2){ setResults({teams:[],matches:[]}); setErrorSearch(null); setLoadingSearch(false); return; }
      debounceRef.current = setTimeout(()=>{
        setLoadingSearch(true); setErrorSearch(null);
        fetch(`./api/data.php?action=search&query=${encodeURIComponent(query)}`)
          .then(r=>r.json())
          .then(d=>{ if(d.success) { setResults(d.data); } else { setErrorSearch('Geen resultaten'); } })
          .catch(()=> setErrorSearch('Zoeken mislukt'))
          .finally(()=> setLoadingSearch(false));
      },300);
      return ()=>{ if (debounceRef.current) clearTimeout(debounceRef.current); };
    },[query]);

    useEffect(()=>{
      function onKey(e){
        if(e.key==='/' && !searchOpen){ e.preventDefault(); setSearchOpen(true); setTimeout(()=>searchRef.current?.focus(),10); }
        if(e.key==='Escape'){ setSearchOpen(false); setOpenDropdown(false); setOpenSettings(false); }
      }
      window.addEventListener('keydown',onKey);
      return ()=>window.removeEventListener('keydown',onKey);
    },[searchOpen]);

    function logout(){
      window.APP_SESSION = {loggedIn:false,user:null};
      location.href = './logout.php';
    }

    return (
      <header className="bg-slate-900 text-white shadow relative z-30" role="banner">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg" aria-label="Home">
              <i className="fas fa-bolt text-blue-500" aria-hidden="true"></i>
              <span>Voetbal<span className="text-blue-500">Toernooi</span></span>
            </a>
            <nav className={"hidden md:flex items-center gap-4 text-sm"} aria-label="Hoofd navigatie">
              {[
                {href:'#/', label:'Home', key:''},
                {href:'#/teams', label:'Teams', key:'teams'},
                {href:'#/wedstrijden', label:'Wedstrijden', key:'wedstrijden'},
                {href:'#/uitslagen', label:'Uitslagen', key:'uitslagen'}
              ].map(link => (
                <a key={link.href} href={link.href} className={"hover:text-blue-400 px-2 py-1 rounded " + (currentPage===link.key ? 'text-blue-400 bg-slate-800' : 'text-slate-200')}>{link.label}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setMobileNavOpen(o=>!o)} className="md:hidden px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700" aria-label="Mobiele menu" aria-expanded={mobileNavOpen}>
              <i className="fas fa-bars"></i>
            </button>
            <button onClick={()=>setSearchOpen(true)} className="px-3 py-2 rounded-md text-sm bg-slate-800 hover:bg-slate-700 flex items-center gap-1" aria-label="Zoeken openen">
              <i className="fas fa-search" aria-hidden="true"></i><span className="hidden sm:inline">Zoeken</span><span className="text-xs opacity-50 ml-1">/</span>
            </button>
            <div className="relative">
              <button onClick={()=>setOpenSettings(o=>!o)} className="px-3 py-2 rounded-md text-sm bg-slate-800 hover:bg-slate-700 flex items-center gap-2" aria-haspopup="true" aria-expanded={openSettings} aria-label="Instellingen">
                <i className="fas fa-cog" aria-hidden="true"></i><span className="hidden sm:inline">Instellingen</span><i className="fas fa-chevron-down text-xs" aria-hidden="true"></i>
              </button>
              {openSettings && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-700 rounded-md shadow-lg border border-slate-200 overflow-hidden text-sm" role="menu">
                  <button onClick={()=>setDark(d=>!d)} className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-slate-50" role="menuitem"><i className="fas fa-adjust"></i> Thema: {dark? 'Donker':'Licht'}</button>
                  <a href="#/instellingen" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50" role="menuitem"><i className="fas fa-sliders-h"></i> Algemene instellingen</a>
                </div>
              )}
            </div>
            {session.loggedIn ? (
              <div className="relative">
                <button onClick={()=>setOpenDropdown(o=>!o)} className="px-3 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-500 flex items-center gap-2" aria-haspopup="true" aria-expanded={openDropdown}>
                  <i className="fas fa-user-circle" aria-hidden="true"></i><span className="hidden sm:inline truncate max-w-[120px]">{session.user?.name || 'Profiel'}</span><i className="fas fa-chevron-down text-xs" aria-hidden="true"></i>
                </button>
                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-700 rounded-md shadow-lg border border-slate-200 overflow-hidden text-sm" role="menu">
                    <a href="#/profiel" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50" role="menuitem"><i className="fas fa-id-badge"></i> Profiel</a>
                    <button onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-red-600" role="menuitem"><i className="fas fa-sign-out-alt"></i> Uitloggen</button>
                  </div>
                )}
              </div>
            ) : (
              <a href="./login.php" className="px-3 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-500 flex items-center gap-2" aria-label="Inloggen"><i className="fas fa-sign-in-alt" aria-hidden="true"></i> Login</a>
            )}
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pb-3" aria-label="Mobiele navigatie">
            <div className="flex flex-col gap-1 pt-2 text-sm">
              {[
                {href:'#/', label:'Home', key:''},
                {href:'#/teams', label:'Teams', key:'teams'},
                {href:'#/wedstrijden', label:'Wedstrijden', key:'wedstrijden'},
                {href:'#/uitslagen', label:'Uitslagen', key:'uitslagen'}
              ].map(link => (
                <a key={link.href} href={link.href} onClick={()=>setMobileNavOpen(false)} className={"px-3 py-2 rounded-md " + (currentPage===link.key? 'bg-slate-800 text-blue-400':'hover:bg-slate-800')}>{link.label}</a>
              ))}
            </div>
          </nav>
        )}
        {searchOpen && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur" role="dialog" aria-label="Zoek overlay">
            <div className="mx-auto max-w-3xl px-4 pt-16">
              <div className="flex items-center gap-2 mb-4">
                <input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zoek teams of wedstrijden..." className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" aria-label="Zoekveld" />
                <button onClick={()=>{setSearchOpen(false); setQuery('');}} className="px-3 py-2 rounded-md text-sm bg-slate-800 hover:bg-slate-700" aria-label="Sluiten"><i className="fas fa-times"></i></button>
              </div>
              {loadingSearch && <div className="text-slate-400 text-sm mb-4">Zoeken...</div>}
              {errorSearch && !loadingSearch && <div className="text-red-400 text-sm mb-4">{errorSearch}</div>}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Teams</h4>
                  <div className="bg-slate-800 rounded-md border border-slate-700 divide-y divide-slate-700">
                    {results.teams.length===0 ? <div className="p-3 text-slate-500 text-sm">Geen resultaten</div> : results.teams.map(t => (
                      <a key={t.id} href={`#/team/${t.id}`} onClick={()=>setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700">
                        <span className="w-8 h-8 rounded-full bg-slate-600" />
                        <span className="truncate font-medium">{t.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Wedstrijden</h4>
                  <div className="bg-slate-800 rounded-md border border-slate-700 divide-y divide-slate-700">
                    {results.matches.length===0 ? <div className="p-3 text-slate-500 text-sm">Geen resultaten</div> : results.matches.map(m => (
                      <div key={m.id} className="px-3 py-2 flex items-center justify-between hover:bg-slate-700">
                        <div className="truncate text-sm">{m.team_a_name} vs {m.team_b_name}</div>
                        <div className="text-xs text-slate-400">{new Date(m.match_date).toLocaleDateString()} {new Date(m.match_date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
