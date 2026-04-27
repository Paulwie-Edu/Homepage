export function BrandLogo() {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-200/25 bg-[#0b1020]/70 px-3 py-2 backdrop-blur">
      <svg width="44" height="44" viewBox="0 0 64 64" aria-label="Paulwie EDU Logo" className="text-amber-300">
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="32" r="29" opacity="0.55" />
          <path d="M14 29h36M18 29l14-10 14 10M22 29v14m7-14v14m7-14v14m7-14v14M18 45h28M14 50h36" />
          <path d="M8 20l6-3M56 20l-6-3M8 44l6 3M56 44l-6 3" opacity="0.65" />
        </g>
      </svg>
      <div className="text-left leading-tight">
        <p className="text-[10px] tracking-[0.26em] text-amber-200/80">PAULWIE EDU</p>
        <p className="text-sm font-semibold text-white">博维国际教育</p>
      </div>
    </div>
  );
}
