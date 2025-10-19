interface ComingSoonProps {
  label?: string
  className?: string
}

// Non-interactive status pill, shown where download buttons will go once the app ships
export default function ComingSoon({ label = 'Coming soon', className = '' }: ComingSoonProps) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 rounded border border-primary/30 bg-primary/5 font-body cursor-default select-none ${className}`}
      style={{ color: 'var(--c-text-70)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" aria-hidden />
      {label}
    </span>
  )
}
