const LINES = [
  { text: 'The hours are over.', tone: 'ink' },
  { text: 'Machinery, not promises.', tone: 'emerald' },
  { text: 'Artifacts, not advice.', tone: 'ink' },
  { text: 'Agents do the work. Humans hold the gate.', tone: 'cyan' },
  { text: 'One machine at a time.', tone: 'ink' },
] as const

export function ManifestoSection() {
  return (
    <section className="manifesto-band" id="manifesto" aria-labelledby="manifesto-heading">
      <p className="kicker motion-reveal" id="manifesto-heading">The doctrine</p>
      <div className="mt-8">
        {LINES.map((l) => (
          <p key={l.text} className={`manifesto-line mline-${l.tone} motion-reveal`}>
            {l.text}
          </p>
        ))}
      </div>
      <a
        className="manifesto-link motion-reveal"
        href="https://github.com/frankxai/agenticincome/blob/main/MANIFESTO.md"
        rel="noopener"
      >
        Read the ten rules — THE MANIFESTO →
      </a>
    </section>
  )
}
