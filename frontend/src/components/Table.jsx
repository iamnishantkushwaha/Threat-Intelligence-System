import Card from "./Card.jsx";

export default function Table({ title, subtitle, children, className = "" }) {
  return (
    <Card className={`px-4 py-4 md:px-5 md:py-5 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title ? <h2 className="text-[15px] font-semibold text-slate-100">{title}</h2> : null}
          {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
      )}
      {children}
    </Card>
  );
}
