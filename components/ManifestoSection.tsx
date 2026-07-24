const LINES = [
  { text: 'We never promise income.', tone: 'ink' },
  { text: 'We hand you the machines.', tone: 'emerald' },
  { text: 'Artifacts, not advice.', tone: 'ink' },
  { text: 'Agents build. Humans hold the gate.', tone: 'cyan' },
  { text: 'One machine at a time.', tone: 'ink' },
  { text: 'Audit us.', tone: 'emerald' },
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
        href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        Inspect the public operating contract →
      </a>
    </section>
  )
}
