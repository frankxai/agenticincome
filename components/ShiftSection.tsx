const STATS = [
  {
    value: '40%',
    accent: false,
    label: 'of enterprise apps will ship task-specific AI agents by end of 2026 — up from under 5% in 2025.',
    src: 'Gartner, Aug 2025',
  },
  {
    value: '86%',
    accent: true,
    label: 'of creators already use generative AI in their workflows; 87% of those say it grew their business or audience.',
    src: 'Adobe Creators’ Toolkit, Jun 2026 · n=16,000',
  },
  {
    value: '29.8M',
    accent: false,
    label: 'US solo businesses generate ~$1.7T in revenue — the one-person company is already normal. Agents change its ceiling.',
    src: 'US Census nonemployer statistics',
  },
]

export function ShiftSection() {
  return (
    <section className="section-band" id="the-shift">
      <div className="section-heading motion-reveal">
        <div className="kicker text-[color:var(--color-accent-2)]">The shift · education</div>
        <h2 className="display-h2">
          The constraint was never your ideas. <span className="text-[color:var(--color-accent-2)]">It was your hours.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
          For a century, solo income scaled linearly with labor. Agent runtimes broke that
          function: research, building, shipping, and operating now compress from weeks to days.
          The numbers below are sourced, dated, and re-verified quarterly — like everything we publish.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.src} className="stat-card motion-reveal">
            <div className="stat-value">{s.accent ? <em>{s.value}</em> : s.value}</div>
            <p className="stat-label">{s.label}</p>
            <p className="stat-src">{s.src}</p>
          </div>
        ))}
      </div>

      <p className="motion-reveal mt-6 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)]">
        The honest counterweight: Gartner also expects <span className="text-[color:var(--color-ink)]">over 40% of agentic AI projects to be canceled by 2027</span> —
        cost, unclear value, weak discipline. The machinery is real; the difference between the two
        statistics is engineering. That discipline is what this site teaches.
      </p>
    </section>
  )
}
