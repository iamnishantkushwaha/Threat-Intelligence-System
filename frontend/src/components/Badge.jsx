const variants = {
  high: "border-rose-400/20 bg-rose-400/12 text-rose-100",
  medium: "border-amber-300/20 bg-amber-300/12 text-amber-100",
  low: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  success: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  failed: "border-rose-400/20 bg-rose-400/12 text-rose-100",
  neutral: "border-white/10 bg-white/6 text-slate-200",
  ai: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
};

export default function Badge({ variant = "neutral", children, className = "" }) {
  const style = variants[variant] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${style} ${className}`}
    >
      {children}
    </span>
  );
}
