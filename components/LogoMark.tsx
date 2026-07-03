export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="none">
      <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#ai-mark-bg)" />
      <path
        d="M17 44.5 28.6 18h7.7L48 44.5h-8.2l-2-5.3H27.1l-2 5.3H17Z"
        fill="#F1F3F9"
      />
      <path d="M29.5 32.3h5.8l-2.9-7.7-2.9 7.7Z" fill="#05060A" />
      <path
        d="M17.5 44.5c12.9-1.2 23-7.1 30.4-17.8"
        stroke="#D6B56D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M42.2 27.4h6.2v6.2"
        stroke="#D6B56D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="ai-mark-bg" x1="4" x2="60" y1="4" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101522" />
          <stop offset="0.55" stopColor="#0A0C14" />
          <stop offset="1" stopColor="#05060A" />
        </linearGradient>
      </defs>
    </svg>
  )
}
