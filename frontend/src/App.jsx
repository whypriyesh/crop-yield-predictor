import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Activity, BarChart2, Leaf, Cpu, Crosshair,
  ChevronDown, AlertTriangle, Sprout,
  MapPin, CalendarDays, Ruler, TrendingUp
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// just a small bar chart to make the sidebar feel alive
function SparkBars() {
  const vals = [35, 60, 45, 80, 55, 90, 70, 100];
  return (
    <div className="flex items-end gap-[3px] h-9 mt-4 opacity-50">
      {vals.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-green"
          style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }}
        />
      ))}
    </div>
  );
}

function DropdownField({ label, name, value, onChange, items, placeholder, Icon }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
        {Icon && <Icon size={10} className="text-green opacity-70" />}
        {label}
      </label>
      <div className="relative">
        <select
          required
          name={name}
          value={value}
          onChange={onChange}
          className="
            w-full appearance-none cursor-pointer outline-none
            bg-white/[0.04] border border-border
            hover:border-green/40 focus:border-green/70 focus:ring-1 focus:ring-green/20
            rounded-xl px-4 py-3.5 pr-10
            text-sm text-white
            transition-colors duration-150
          "
        >
          <option value="" disabled className="bg-[#0f1a0f] text-gray-500">{placeholder}</option>
          {items.map(v => (
            <option key={v} value={v} className="bg-[#0f1a0f] text-white">{v}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ State_Name: "", Season: "", Crop: "", Area: "" });
  const [options, setOptions] = useState({ states: [], seasons: [], crops: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const rootRef   = useRef(null);
  const sideRef   = useRef(null);
  const formRef   = useRef(null);

  useEffect(() => {
    // animate everything in on load
    const ctx = gsap.context(() => {
      gsap.from(sideRef.current, { x: -20, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(formRef.current, { y: 24, opacity: 0, duration: 0.75, delay: 0.15, ease: "power3.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    fetch(`${API}/options`)
      .then(r => r.json())
      .then(d => { if (!d.error) setOptions(d); })
      .catch(() => {});
  }, []);

  const update = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErr(null);

    try {
      const r = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, Area: parseFloat(form.Area) || 0 }),
      });
      const d = await r.json();
      if (d.error) { setErr(d.error); return; }
      setResult(Number(d.predicted_yield).toFixed(3));

      setTimeout(() => {
        gsap.from(".result-panel", { y: 16, opacity: 0, duration: 0.5, ease: "back.out(1.5)" });
      }, 20);
    } catch {
      setErr("Can't reach the backend. Make sure the FastAPI server is running.");
    } finally {
      setLoading(false);
    }
  };

  const ready = form.State_Name && form.Season && form.Crop && form.Area;

  return (
    <div ref={rootRef} className="relative min-h-[100dvh] bg-void text-white overflow-x-hidden">

      {/* noise */}
      <svg className="noise" xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      {/* ambient blobs — purely decorative */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", animation: "drift 12s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", animation: "drift 16s ease-in-out infinite reverse" }}
        />
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black_50%,transparent_100%)]" />
      </div>

      {/* ─────────────────────────────────────────────── layout */}
      <div className="flex min-h-[100dvh] flex-col lg:flex-row">

        {/* SIDEBAR ────────────────────────────────────────────── */}
        <aside
          ref={sideRef}
          className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 sticky top-0 h-screen border-r border-border bg-panel/70 backdrop-blur-xl scroller overflow-y-auto"
        >
          {/* logo area */}
          <div className="px-7 pt-8 pb-7 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-green/10 border border-green/25 flex items-center justify-center shrink-0">
                <Sprout size={16} className="text-green" />
              </div>
              <div>
                <h1 className="font-syne text-[17px] font-bold tracking-wide leading-none">AgriSense</h1>
                <p className="text-[10px] text-gray-500 mt-0.5 tracking-wider">Yield Predictor</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:"glow-pulse 2s ease-in-out infinite"}} />
              <span className="text-[10px] text-green/70 uppercase tracking-[0.2em]">Prediction Engine Online</span>
            </div>
          </div>

          {/* three pillars */}
          <div className="px-5 py-7 flex flex-col gap-4 flex-1">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.18em] px-1 mb-1">Core Modules</p>

            {/* pillar 1 */}
            <div className="group p-4 rounded-2xl bg-white/[0.025] border border-border hover:border-green/25 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-green/10 rounded-lg shrink-0">
                  <Cpu size={14} className="text-green" />
                </div>
                <span className="font-syne text-[13px] font-semibold text-gray-200">Predictive Intelligence</span>
              </div>
              <p className="text-[12px] text-gray-500 font-playfair italic leading-relaxed">
                Random Forest ensemble trained on 10+ years of Indian crop harvest data.
              </p>
              <SparkBars />
            </div>

            {/* pillar 2 */}
            <div className="group p-4 rounded-2xl bg-white/[0.025] border border-border hover:border-green/25 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-green/10 rounded-lg shrink-0">
                  <Crosshair size={14} className="text-green" />
                </div>
                <span className="font-syne text-[13px] font-semibold text-gray-200">Simplicity First</span>
              </div>
              <p className="text-[12px] text-gray-500 font-playfair italic leading-relaxed">
                Four inputs. One prediction. No friction between question and answer.
              </p>
            </div>

            {/* pillar 3 */}
            <div className="group p-4 rounded-2xl bg-white/[0.025] border border-border hover:border-green/25 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-green/10 rounded-lg shrink-0">
                  <Leaf size={14} className="text-green" />
                </div>
                <span className="font-syne text-[13px] font-semibold text-gray-200">Real-World Utility</span>
              </div>
              <p className="text-[12px] text-gray-500 font-playfair italic leading-relaxed">
                Built for farmers and agronomists who need fast, actionable yield estimates.
              </p>
            </div>
          </div>

          {/* bottom model stats */}
          <div className="px-5 pb-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-white/[0.025] border border-border">
                <div className="font-syne text-xl font-bold text-green">0.88</div>
                <div className="text-[10px] text-gray-600 tracking-widest uppercase mt-0.5">R² Score</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.025] border border-border">
                <div className="font-syne text-xl font-bold text-green">100+</div>
                <div className="text-[10px] text-gray-600 tracking-widest uppercase mt-0.5">Crops</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-[100dvh]">

          {/* top bar */}
          <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-5 sm:px-8 lg:px-10 border-b border-border bg-void/80 backdrop-blur-xl shrink-0">
            {/* mobile brand */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center">
                <Sprout size={13} className="text-green" />
              </div>
              <span className="font-syne font-bold text-[15px]">AgriSense</span>
            </div>
            {/* desktop label */}
            <span className="hidden lg:block font-mono text-[11px] tracking-[0.22em] text-gray-600 uppercase">
              / yield-prediction-terminal
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:"glow-pulse 2.4s ease-in-out infinite"}} />
              <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">System Online</span>
            </div>
          </header>

          {/* scrollable body */}
          <main className="flex-1 scroller overflow-y-auto px-5 sm:px-10 lg:px-14 xl:px-20 py-10 sm:py-14">

            {/* page heading */}
            <div className="mb-10 max-w-xl">
              <h2 className="font-syne text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-snug">
                Predict Crop Yield
              </h2>
              <p className="mt-2 text-gray-400 font-playfair italic text-sm sm:text-base leading-relaxed">
                Select your region, season, crop, and land area to get an estimated yield from our ML model.
              </p>
            </div>

            {/* FORM CARD */}
            <div ref={formRef} className="w-full max-w-2xl">
              <div className="rounded-2xl border border-border bg-panel/60 backdrop-blur-lg overflow-hidden">
                {/* green top rule */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-green/50 to-transparent" />

                <div className="p-6 sm:p-8 lg:p-10 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DropdownField
                      label="State / Region" name="State_Name" value={form.State_Name}
                      onChange={update} items={options.states}
                      placeholder="Select a state…" Icon={MapPin}
                    />
                    <DropdownField
                      label="Growing Season" name="Season" value={form.Season}
                      onChange={update} items={options.seasons}
                      placeholder="Select a season…" Icon={CalendarDays}
                    />
                    <DropdownField
                      label="Crop Type" name="Crop" value={form.Crop}
                      onChange={update} items={options.crops}
                      placeholder="Select a crop…" Icon={Sprout}
                    />

                    {/* area input */}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
                        <Ruler size={10} className="text-green opacity-70" />
                        Land Area (Hectares)
                      </label>
                      <input
                        required
                        type="number"
                        name="Area"
                        min="0.1"
                        step="any"
                        value={form.Area}
                        onChange={update}
                        placeholder="e.g. 50"
                        className="
                          w-full outline-none
                          bg-white/[0.04] border border-border
                          hover:border-green/40 focus:border-green/70 focus:ring-1 focus:ring-green/20
                          rounded-xl px-4 py-3.5
                          text-sm text-white placeholder-gray-600
                          transition-colors duration-150
                        "
                      />
                    </div>
                  </div>

                  {/* submit button */}
                  <button
                    type="submit"
                    onClick={submit}
                    disabled={loading || !ready}
                    className="
                      btn-primary w-full
                      bg-green text-void font-syne font-bold text-sm tracking-widest
                      rounded-xl px-6 py-4
                      flex items-center justify-center gap-2.5
                      transition-all duration-200
                      hover:brightness-110 active:scale-[0.97]
                      shadow-[0_0_30px_-8px_rgba(34,197,94,0.4)]
                      hover:shadow-[0_0_40px_-8px_rgba(34,197,94,0.6)]
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                    "
                  >
                    {loading ? (
                      <>
                        <Activity size={16} className="animate-spin" />
                        Computing…
                      </>
                    ) : (
                      <>
                        Run Prediction
                        <BarChart2 size={16} />
                      </>
                    )}
                  </button>

                  {/* error message */}
                  {err && (
                    <div className="flex gap-3 items-start bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      {err}
                    </div>
                  )}
                </div>
              </div>

              {/* RESULT CARD */}
              {result !== null && (
                <div className="result-panel mt-6 rounded-2xl border border-green/20 bg-green/[0.04] overflow-hidden">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-green/60 to-transparent" />
                  <div className="p-6 sm:p-8">
                    {/* label */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full bg-green" style={{animation:"glow-pulse 2s ease-in-out infinite"}} />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-green/70 font-semibold">Yield Computed</span>
                    </div>

                    {/* the number */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-syne text-5xl sm:text-6xl font-bold text-white tracking-tighter">
                        {result}
                      </span>
                      <span className="text-gray-500 text-sm font-mono tracking-widest uppercase">MT / HA</span>
                    </div>

                    <p className="font-playfair italic text-gray-400 text-sm leading-relaxed mb-5">
                      Estimated metric tonnes per hectare for{" "}
                      <strong className="text-white not-italic font-semibold">{form.Crop}</strong> in{" "}
                      <strong className="text-white not-italic font-semibold">{form.State_Name}</strong>.
                    </p>

                    {/* meta tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {[form.Season + " season", form.Area + " ha", "RF model · R² 0.88"].map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg border border-border bg-void text-[10px] text-gray-500 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* mobile-only pillars */}
            <div className="lg:hidden mt-12 space-y-4 max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-4">About This Tool</p>

              {[
                { Icon: Cpu, title: "Predictive Intelligence", body: "Random Forest ensemble trained on 10+ years of Indian agricultural harvest records." },
                { Icon: Crosshair, title: "Simplicity First", body: "Four inputs, one click. No friction between your question and a reliable answer." },
                { Icon: Leaf, title: "Real-World Utility", body: "Built for farmers, agronomists, and researchers who need fast, actionable insights." },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="p-4 rounded-2xl border border-border bg-panel/60">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 bg-green/10 rounded-lg"><Icon size={13} className="text-green" /></div>
                    <span className="font-syne text-[13px] font-semibold">{title}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 font-playfair italic leading-relaxed">{body}</p>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[["0.88", "R² Score"], ["100+", "Crop Varieties"]].map(([v, k]) => (
                  <div key={k} className="p-4 rounded-2xl border border-border bg-panel/60 text-center">
                    <div className="font-syne text-2xl font-bold text-green">{v}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* footer */}
          <footer className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 px-6 sm:px-10 py-4 border-t border-border text-[11px] text-gray-600 font-mono">
            <span>AgriSense · Random Forest Regressor</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-green/40" />
              FastAPI + React + scikit-learn
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}