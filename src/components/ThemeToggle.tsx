import type { ThemeMode, ResolvedTheme } from '../hooks/useTheme'

type Props = {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  onChange: (mode: ThemeMode) => void
}

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function ThemeToggle({ mode, resolvedTheme, onChange }: Props) {
  return (
    <label className="theme-toggle">
      <span className="sr-only">Theme</span>
      <select
        className="theme-select"
        value={mode}
        onChange={(event) => onChange(event.target.value as ThemeMode)}
        aria-label={`Theme: ${mode}, currently ${resolvedTheme}`}
      >
        {THEME_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
