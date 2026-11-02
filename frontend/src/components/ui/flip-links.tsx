

interface FlipLinkProps {
  children: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const FlipLink = ({ children, href, onClick, className }: FlipLinkProps) => {
  const content = (
    <>
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex text-brand-400">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </>
  );

  const classes =
    className ||
    "group text-white hover:text-brand-400 relative block overflow-hidden whitespace-nowrap text-5xl font-black uppercase tracking-tight sm:text-7xl md:text-8xl lg:text-9xl transition-colors select-none";

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={classes}
        style={{
          lineHeight: 0.75,
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      style={{
        lineHeight: 0.75,
      }}
    >
      {content}
    </button>
  );
};

// --- Component Template matching your exact 21st.dev snippet ---
export const Component = ({ onStart }: { onStart?: () => void }) => {
  return (
    <section className="grid place-content-center gap-3 bg-slate-950 w-full min-h-[85vh] text-white py-12 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-6">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          ParseMind AI
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 z-10">
        <FlipLink onClick={onStart}>Summary</FlipLink>
        <FlipLink onClick={onStart}>Quizzes</FlipLink>
        <FlipLink onClick={onStart}>Flashcards</FlipLink>
        <FlipLink onClick={onStart}>Deep Dives</FlipLink>
      </div>

      <div className="text-center mt-8 z-10">
        <button
          type="button"
          onClick={onStart}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all transform hover:scale-105 active:scale-95"
        >
          Upload Notes & Get Started →
        </button>
      </div>
    </section>
  );
};

export default Component;
