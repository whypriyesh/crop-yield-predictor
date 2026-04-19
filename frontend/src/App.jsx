import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Activity, 
  Leaf, 
  Cpu, 
  BarChart2, 
  Database,
  Crosshair,
  TrendingUp,
  Save,
  Menu,
  X,
  ChevronRight,
  ChevronDown
} from "lucide-react";

function App() {
  const [form, setForm] = useState({
    State_Name: "",
    Season: "",
    Crop: "",
    Area: ""
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [options, setOptions] = useState({ states: [], seasons: [], crops: [] });

  // GSAP Refs
  const appShellRef = useRef(null);
  const cardRef = useRef(null);
  const sidebarWidgetsRef = useRef([]);
  const formInputsRef = useRef([]);

  useEffect(() => {
    // Initial timeline for entry animations
    const tl = gsap.timeline();

    tl.fromTo(appShellRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(sidebarWidgetsRef.current, 
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(cardRef.current, 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.7"
    )
    .fromTo(formInputsRef.current, 
      { y: 15, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.5"
    );

    // Fetch dropdown options from the backend
    fetch("http://localhost:8000/options")
      .then(res => res.json())
      .then(data => {
        if(!data.error) setOptions(data);
      })
      .catch(err => console.error("Failed to load options:", err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          Area: parseFloat(form.Area) || 0
        })
      });

      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      setResult(Number(data.predicted_yield).toFixed(3));
      
      // Animate result entrance after React renders the DOM element
      setTimeout(() => {
        gsap.fromTo(".result-display", 
          { scale: 0.9, opacity: 0, y: 10 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
      }, 50);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const setSidebarRef = (el) => {
    if (el && !sidebarWidgetsRef.current.includes(el)) {
      sidebarWidgetsRef.current.push(el);
    }
  };

  const setInputRef = (el) => {
    if (el && !formInputsRef.current.includes(el)) {
      formInputsRef.current.push(el);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden text-white font-sans selection:bg-goldleaf/30 selection:text-goldleaf">
      
      {/* GLOBAL NOISE AND DYNAMIC CSS BACKGROUND */}
      <svg className="noise-overlay opacity-[0.35] lg:opacity-40" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      
      {/* Obsidian Vault Grid & Ambient Glows */}
      <div className="absolute inset-0 z-0 bg-vantablack overflow-hidden pointer-events-none">
        {/* Architect Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black_30%,transparent_100%)]"></div>
        
        {/* Animated Deep Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-goldleaf/15 blur-[150px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-tungsten/80 blur-[150px] mix-blend-screen animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-white/[0.02] blur-[100px] mix-blend-overlay"></div>
      </div>

      {/* APPLICATION SHELL */}
      <div ref={appShellRef} className="relative z-10 flex h-[100dvh] w-full flex-col lg:flex-row">
        
        {/* MOBILE/TABLET TOP BAR (Always visible < 1024px) */}
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-tungsten/50 bg-vantablack/95 backdrop-blur-xl z-50 shrink-0">
          <div>
            <h1 className="font-syne text-xl font-bold tracking-wider text-white">
              AgriSense
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-goldleaf mt-0.5 flex items-center">
              <Activity size={10} className="mr-1 inline animate-pulse text-goldleaf" /> System Online
            </p>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 bg-tungsten/30 rounded-lg border border-tungsten/50 active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <aside className={`
          absolute lg:relative top-[76px] lg:top-0 left-0 w-full sm:w-80 lg:w-[340px] h-[calc(100dvh-76px)] lg:h-[100dvh] 
          bg-vantablack/95 lg:bg-vantablack/90 border-r-0 lg:border-r border-tungsten/60 
          flex flex-col lg:pt-8 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 shadow-[10px_0_30px_rgba(0,0,0,0.5)] lg:shadow-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="hidden lg:flex px-8 pb-8 items-center justify-between">
            <div>
              <h1 className="font-syne text-2xl font-bold tracking-wider text-white">
                AgriSense
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-goldleaf/80 mt-1 flex items-center">
                <Activity size={12} className="mr-1 inline animate-pulse text-goldleaf" /> System Online
              </p>
            </div>
          </div>

          <div className="flex-1 px-5 lg:px-6 pt-6 lg:pt-0 space-y-4 lg:space-y-6 overflow-y-auto pb-10 custom-scrollbar">
            {/* Mock Dashboard Widgets (Pillars) */}
            <div ref={setSidebarRef} className="bg-tungsten/20 rounded-xl border border-tungsten/40 p-5 hover:border-goldleaf/40 transition-colors duration-300 group">
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="p-2 bg-goldleaf/10 rounded-lg group-hover:bg-goldleaf/20 transition-colors">
                  <Cpu size={18} className="text-goldleaf" />
                </div>
                <h3 className="font-syne text-[15px] text-gray-200">Predictive Intelligence</h3>
              </div>
              <p className="text-[13px] text-gray-400 font-playfair italic leading-relaxed">ML-based yield estimation securely interfaced with historical data overlays.</p>
              <div className="mt-5 h-12 w-full bg-tungsten/30 rounded flex items-end px-2 pb-2 space-x-1.5 opacity-70">
                 <div className="w-full bg-goldleaf/40 rounded-t transition-all duration-1000" style={{height: "30%"}}></div>
                 <div className="w-full bg-goldleaf/60 rounded-t transition-all duration-1000 delay-100" style={{height: "50%"}}></div>
                 <div className="w-full bg-goldleaf/80 rounded-t transition-all duration-1000 delay-200" style={{height: "80%"}}></div>
                 <div className="w-full bg-goldleaf rounded-t transition-all duration-1000 delay-300" style={{height: "100%"}}></div>
              </div>
            </div>

            <div ref={setSidebarRef} className="bg-tungsten/20 rounded-xl border border-tungsten/40 p-5 hover:border-goldleaf/40 transition-colors duration-300 group">
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="p-2 bg-goldleaf/10 rounded-lg group-hover:bg-goldleaf/20 transition-colors">
                  <Crosshair size={18} className="text-goldleaf" />
                </div>
                <h3 className="font-syne text-[15px] text-gray-200">Simplicity</h3>
              </div>
              <p className="text-[13px] text-gray-400 font-playfair italic leading-relaxed">Zero-friction terminal. Minimal inputs generate instant analytical output.</p>
            </div>

            <div ref={setSidebarRef} className="bg-tungsten/20 rounded-xl border border-tungsten/40 p-5 hover:border-goldleaf/40 transition-colors duration-300 group">
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="p-2 bg-goldleaf/10 rounded-lg group-hover:bg-goldleaf/20 transition-colors">
                  <Leaf size={18} className="text-goldleaf" />
                </div>
                <h3 className="font-syne text-[15px] text-gray-200">Practical Utility</h3>
              </div>
              <p className="text-[13px] text-gray-400 font-playfair italic leading-relaxed">Built unequivocally for real-world agricultural decision making.</p>
            </div>
            
            {/* CTAs */}
            <div className="pt-4 border-t border-tungsten/40 px-2 space-y-2.5">
              <button className="w-full flex items-center justify-between text-[13px] text-gray-400 hover:text-white transition-colors duration-200 p-3 rounded-xl hover:bg-tungsten/30 active:scale-95">
                <span className="flex items-center"><TrendingUp size={16} className="mr-3 text-goldleaf/70" /> Analyze Crop Trends</span>
                <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between text-[13px] text-gray-400 hover:text-white transition-colors duration-200 p-3 rounded-xl hover:bg-tungsten/30 active:scale-95">
                <span className="flex items-center"><Save size={16} className="mr-3 text-goldleaf/70" /> Save Prediction</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN AREA - CENTERED INTELLIGENCE CARD */}
        <main className={`
          flex-1 flex flex-col relative w-full 
          h-[calc(100dvh-76px)] lg:h-[100dvh] 
          overflow-y-auto custom-scrollbar
          transition-opacity duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-20 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}
        `}>
          
          {/* Header Bar */}
          <header className="h-[76px] py-4 border-b border-tungsten/40 items-center justify-between px-10 bg-vantablack/50 backdrop-blur-md hidden lg:flex shrink-0 sticky top-0 z-20">
             <div className="text-[11px] text-gray-400 tracking-[0.2em] font-mono">
                SESSION // INITIALIZATION
             </div>
             <div className="flex items-center space-x-4">
                <Database size={16} className="text-gray-500" />
                <span className="text-[11px] text-gray-400 font-syne uppercase tracking-widest animate-pulse">Data Node Active</span>
             </div>
          </header>

          <div className="flex-1 w-full flex flex-col items-center p-4 sm:p-8 lg:p-12 pb-24 lg:pb-12 min-h-max">
            <div ref={cardRef} className="my-auto w-full max-w-3xl bg-vantablack/80 lg:bg-vantablack/60 border border-tungsten/40 lg:border-tungsten/50 rounded-2xl sm:rounded-[2rem] shadow-2xl backdrop-blur-2xl lg:backdrop-blur-3xl overflow-hidden relative animate-[float_6s_ease-in-out_infinite] shrink-0 mt-8 lg:mt-auto">
              
              {/* Card Accent Lines */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-goldleaf to-transparent opacity-40 lg:opacity-50"></div>
              
              <div className="p-6 sm:p-10 lg:p-12">
                <div className="mb-8 lg:mb-10 text-center">
                  <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight">Predict Yield</h2>
                  <p className="font-playfair italic text-gray-400 text-sm sm:text-[15px] lg:text-base px-2 sm:px-0">Data-driven crop yield prediction for smarter agricultural decisions.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div ref={setInputRef} className="group relative">
                      <label className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 block ml-1">State Name</label>
                      <div className="relative">
                        <select
                          required
                          name="State_Name"
                          value={form.State_Name}
                          onChange={handleChange}
                          className="w-full bg-tungsten/30 border border-tungsten/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 text-sm sm:text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-goldleaf/80 focus:bg-tungsten/50 focus:-translate-y-1 focus:ring-1 focus:ring-goldleaf/50 hover:bg-tungsten/40 transition-all duration-300 shadow-inner appearance-none pr-10"
                        >
                          <option value="" disabled className="bg-tungsten text-gray-400">Choose a State/Region...</option>
                          {options.states.map(state => <option key={state} value={state} className="bg-tungsten text-white">{state}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-goldleaf/80 transition-colors" />
                      </div>
                    </div>
                    <div ref={setInputRef} className="group relative">
                      <label className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 block ml-1">Season</label>
                      <div className="relative">
                        <select
                          required
                          name="Season"
                          value={form.Season}
                          onChange={handleChange}
                          className="w-full bg-tungsten/30 border border-tungsten/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 text-sm sm:text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-goldleaf/80 focus:bg-tungsten/50 focus:-translate-y-1 focus:ring-1 focus:ring-goldleaf/50 hover:bg-tungsten/40 transition-all duration-300 shadow-inner appearance-none pr-10"
                        >
                          <option value="" disabled className="bg-tungsten text-gray-400">Choose Planting Season...</option>
                          {options.seasons.map(season => <option key={season} value={season} className="bg-tungsten text-white">{season}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-goldleaf/80 transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div ref={setInputRef} className="group relative">
                      <label className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 block ml-1">Crop</label>
                      <div className="relative">
                        <select
                          required
                          name="Crop"
                          value={form.Crop}
                          onChange={handleChange}
                          className="w-full bg-tungsten/30 border border-tungsten/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 text-sm sm:text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-goldleaf/80 focus:bg-tungsten/50 focus:-translate-y-1 focus:ring-1 focus:ring-goldleaf/50 hover:bg-tungsten/40 transition-all duration-300 shadow-inner appearance-none pr-10"
                        >
                          <option value="" disabled className="bg-tungsten text-gray-400">Choose Crop Type...</option>
                          {options.crops.map(crop => <option key={crop} value={crop} className="bg-tungsten text-white">{crop}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-goldleaf/80 transition-colors" />
                      </div>
                    </div>
                    <div ref={setInputRef} className="group relative">
                      <label className="text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400 mb-2 block ml-1">Land Area (Hectares)</label>
                      <input
                        required
                        name="Area"
                        type="number"
                        placeholder="e.g., 50 (enter land size)"
                        value={form.Area}
                        onChange={handleChange}
                        className="w-full bg-tungsten/30 border border-tungsten/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 text-sm sm:text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-goldleaf/80 focus:bg-tungsten/50 focus:-translate-y-1 focus:ring-1 focus:ring-goldleaf/50 hover:bg-tungsten/40 transition-all duration-300 shadow-inner"
                      />
                    </div>
                  </div>

                  <div ref={setInputRef} className="pt-4 sm:pt-6">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full group relative overflow-hidden rounded-xl sm:rounded-2xl bg-goldleaf px-6 sm:px-8 py-4 sm:py-5 text-vantablack transition-all duration-300 hover:scale-[0.98] active:scale-[0.95] shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center font-syne font-bold tracking-widest text-sm sm:text-base">
                        {loading ? (
                          <>
                             <Activity size={20} className="animate-spin mr-3" />
                             COMPUTING DEEP METRICS
                          </>
                        ) : (
                          <>
                             INITIATE PREDICTION
                             <BarChart2 size={20} className="ml-3 group-hover:translate-x-1.5 transition-transform" />
                          </>
                        )}
                      </span>
                      {/* Button shine effect */}
                      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-[shine_1.5s_infinite]"></div>
                    </button>
                  </div>
                </form>

                {/* Output Zone */}
                {result !== null && (
                  <div className="result-display mt-10 pt-8 border-t border-tungsten/50 w-full">
                    <div className="relative group bg-gradient-to-b from-tungsten/30 to-vantablack/50 border border-goldleaf/20 hover:border-goldleaf/40 rounded-3xl p-8 lg:p-10 text-center transition-all duration-500 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
                      <div className="absolute inset-x-0 -top-[1px] mx-auto h-[1px] w-1/3 bg-gradient-to-r from-transparent via-goldleaf/70 to-transparent opacity-80"></div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-goldleaf/30 bg-goldleaf/10 text-goldleaf text-[10px] font-bold uppercase tracking-[0.3em] mb-6 animate-pulse">
                           <div className="w-1.5 h-1.5 bg-goldleaf rounded-full"></div>
                           <span>Yield Computed</span>
                        </span>
                        
                        <div className="flex items-baseline justify-center space-x-3 lg:space-x-4 mb-1">
                           <span className="font-syne text-6xl md:text-7xl lg:text-[5rem] font-bold text-white tracking-tighter drop-shadow-2xl">{result}</span>
                           <span className="text-gray-400 text-sm lg:text-base font-mono tracking-widest uppercase">MT/HA</span>
                        </div>

                        <p className="text-gray-400 font-playfair italic text-[13px] md:text-[15px] max-w-sm mt-4 mb-7 leading-relaxed">
                           Estimated metric tonnes per hectare for <strong className="text-white font-sans not-italic font-medium">{form.Crop}</strong> in <strong className="text-white font-sans not-italic font-medium">{form.State_Name}</strong>.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 w-full border-t border-tungsten/40 pt-5">
                           <span className="px-3 py-1 bg-vantablack border border-tungsten/50 text-gray-400 text-[10px] rounded uppercase tracking-[0.1em]">{form.Season} Season</span>
                           <span className="px-3 py-1 bg-vantablack border border-tungsten/50 text-gray-400 text-[10px] rounded uppercase tracking-[0.1em]">{Number(form.Area).toLocaleString()} Hectares</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
            
            {/* Floating Terminal logs - Specifically positioned */}
            <div className="absolute bottom-6 right-8 text-[10px] font-mono text-gray-600 space-y-1 opacity-50 hidden lg:block text-right pointer-events-none">
              <p>{`> system.init()`}</p>
              <p>v2.1.0-alpha [system_ready]</p>
              <p>ml_model loaded: RF_YIELD_0x9</p>
              <p>latency: 14ms</p>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}

export default App;