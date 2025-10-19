import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

// 24x24 line icons drawn for TapFlow; colour comes from currentColor
function Icon({ size = 24, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  )
}

export const CoffeeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" />
    <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M8.5 3.5c0 1 1 1.5 1 2.5M12.5 3.5c0 1 1 1.5 1 2.5" />
  </Icon>
)

export const CarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 16v-3.5l2.2-5.2A2 2 0 0 1 7 6h10a2 2 0 0 1 1.8 1.3L21 12.5V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <path d="M3.5 12.5h17" />
    <circle cx="7.5" cy="17" r="1.8" />
    <circle cx="16.5" cy="17" r="1.8" />
  </Icon>
)

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
  </Icon>
)

export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8Z" />
  </Icon>
)

export const TapIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2.5" />
    <path d="M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5.2 5.2a9.6 9.6 0 0 0 0 13.6M18.8 5.2a9.6 9.6 0 0 1 0 13.6" />
  </Icon>
)

export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
)

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v10h13V10" />
    <path d="M10 20v-5h4v5" />
  </Icon>
)

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16.5 14.1a5 5 0 0 1 5 5.4" />
  </Icon>
)

export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </Icon>
)

export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </Icon>
)

export const PlayIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.3-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
  </Icon>
)

export const PauseIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
    <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
  </Icon>
)

export const PrevIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M18 6.2v11.6a.8.8 0 0 1-1.2.7L8.5 13a1.2 1.2 0 0 1 0-2l8.3-5.5a.8.8 0 0 1 1.2.7Z" />
    <rect x="5.5" y="5.5" width="2.2" height="13" rx="1" />
  </Icon>
)

export const NextIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M6 6.2v11.6a.8.8 0 0 0 1.2.7L15.5 13a1.2 1.2 0 0 0 0-2L7.2 5.5a.8.8 0 0 0-1.2.7Z" />
    <rect x="16.3" y="5.5" width="2.2" height="13" rx="1" />
  </Icon>
)

export const BulbIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
  </Icon>
)

export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
)

export const SpeakerIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <circle cx="12" cy="14.5" r="3" />
    <circle cx="12" cy="7" r="1" />
  </Icon>
)

export const TurnRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 20v-6a4 4 0 0 1 4-4h9" />
    <path d="m15 6 4 4-4 4" />
  </Icon>
)

export const AlarmIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="13" r="7.5" />
    <path d="M12 9.5V13l2.5 1.8M4 4.5 6.5 2.5M20 4.5l-2.5-2M6 19.5 4.5 21M18 19.5l1.5 1.5" />
  </Icon>
)

export const HeadsetIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="13.5" width="4" height="6.5" rx="1.5" />
    <rect x="17" y="13.5" width="4" height="6.5" rx="1.5" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.5}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)

export const SignalIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <rect x="2" y="15" width="3.6" height="5" rx="1" />
    <rect x="7.4" y="11.5" width="3.6" height="8.5" rx="1" />
    <rect x="12.8" y="8" width="3.6" height="12" rx="1" />
    <rect x="18.2" y="4.5" width="3.6" height="15.5" rx="1" />
  </Icon>
)

export const WifiIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.6}>
    <path d="M2.5 9a14 14 0 0 1 19 0M6 12.8a9 9 0 0 1 12 0M9.5 16.5a4 4 0 0 1 5 0" />
    <circle cx="12" cy="19.5" r="0.6" fill="currentColor" />
  </Icon>
)

export const BatteryIcon = ({ size = 14, ...p }: IconProps) => (
  <svg viewBox="0 0 28 14" width={size * 2} height={size} aria-hidden {...p}>
    <rect x="0.75" y="0.75" width="23" height="12.5" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
    <rect x="2.75" y="2.75" width="16" height="8.5" rx="2" fill="currentColor" />
    <path d="M25.6 4.8v4.4a2.2 2.2 0 0 0 0-4.4Z" fill="currentColor" fillOpacity="0.45" />
  </svg>
)
