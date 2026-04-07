export default function Card({
  children,
  className = "",
  as: Component = "section",
}) {
  return (
    <Component
      className={`rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,24,37,0.92)_0%,rgba(9,17,28,0.84)_100%)] shadow-[0_24px_80px_rgba(2,8,23,0.26)] ring-1 ring-white/6 backdrop-blur-2xl transition duration-300 ${className}`}
    >
      {children}
    </Component>
  );
}
