import { useUrlState } from './hooks/useUrlState'
import { DateTimeInput } from './components/DateTimeInput'
import { DestinationSelector } from './components/DestinationSelector'
import { ResultsList } from './components/ResultsList'
import { CopyShareBar } from './components/CopyShareBar'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'

const CONTAINER = 'w-full max-w-[960px] mx-auto px-4 sm:px-6'

export default function App() {
  const [state, updateState, shareUrl] = useUrlState()
  const theme = useTheme()

  return (
    <div className="min-h-screen app-shell">
      {/* Header */}
      <header className="app-header">
        <div className={`${CONTAINER} py-3 flex items-center justify-between gap-4`}>
          <div className="brand-lockup" aria-label="TBridge">
            <svg
              className="brand-mark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6.75 12a5.25 5.25 0 0 1 10.5 0" />
              <path d="M4.25 15.5h15.5" />
              <path d="M8.5 15.5V18" />
              <path d="M15.5 15.5V18" />
              <path d="M12 7.25V12l3 1.75" />
            </svg>
            <span className="brand-name">TBridge</span>
          </div>

          <div className="header-controls">
            <ThemeToggle
              mode={theme.mode}
              resolvedTheme={theme.resolvedTheme}
              onChange={theme.setMode}
            />
            <button
              type="button"
              onClick={() => updateState({ is24h: !state.is24h })}
              className="format-toggle"
              aria-pressed={!state.is24h}
              aria-label={`Switch to ${state.is24h ? '12-hour' : '24-hour'} format`}
            >
              <span className={`format-option ${state.is24h ? 'format-option--active' : ''}`}>
                24h
              </span>
              <span className={`format-option ${!state.is24h ? 'format-option--active' : ''}`}>
                12h
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Input panel */}
      <main className={`${CONTAINER} main-stack`}>
        <DateTimeInput state={state} onChange={updateState} />
        <div className="section-divider" />
        <DestinationSelector state={state} onChange={updateState} />

        <section className="results-section" aria-label="Converted times">
          <ResultsList state={state} />
          <CopyShareBar state={state} shareUrl={shareUrl} />
        </section>
      </main>

      <footer className={`${CONTAINER} footer-line`}>
        <span>TBridge v1.0.0</span>
        <span>Offline city index • IANA timezones • DST-aware</span>
      </footer>
    </div>
  )
}
