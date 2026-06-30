import { useUrlState } from './hooks/useUrlState'
import { DateTimeInput } from './components/DateTimeInput'
import { DestinationSelector } from './components/DestinationSelector'
import { ResultsList } from './components/ResultsList'
import { CopyShareBar } from './components/CopyShareBar'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'

const CONTAINER = 'page-container'

export default function App() {
  const [state, updateState, shareUrl] = useUrlState()
  const theme = useTheme()

  return (
    <div className="min-h-screen app-shell">
      {/* Header */}
      <header className="app-header">
        <div className={`${CONTAINER} py-3 flex items-center justify-between gap-4`}>
          <div className="brand-lockup" aria-label="TBridge">
            <span className="brand-badge" aria-hidden="true">
              <img
                src="/assets/tbridge-mark.svg"
                alt=""
                className="brand-logo-img brand-logo-img--light"
              />
              <img
                src="/assets/tbridge-mark-dark.svg"
                alt=""
                className="brand-logo-img brand-logo-img--dark"
              />
            </span>
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
        <img src="/assets/tbridge-mark.svg" alt="" className="footer-mark footer-mark--light" />
        <img src="/assets/tbridge-mark-dark.svg" alt="" className="footer-mark footer-mark--dark" />
        <span>TBridge v1.1</span>
        <span className="footer-dot">·</span>
        <span>Offline city index · IANA timezones · DST-aware</span>
      </footer>
    </div>
  )
}
