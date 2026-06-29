import { SOURCE_TIMEZONES } from '../data/sourceTimezones'
import type { AppState } from '../types'

type Props = {
  state: AppState
  onChange: (patch: Partial<AppState>) => void
}

export function DateTimeInput({ state, onChange }: Props) {
  return (
    <div className="input-section">
      <label className="field-label mb-2 block">Convert from</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-1">
          <label htmlFor="date-input" className="input-sublabel">Date</label>
          <input
            id="date-input"
            type="date"
            value={state.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="time-input" className="input-sublabel">Time</label>
          <input
            id="time-input"
            type="time"
            value={state.time}
            onChange={(e) => onChange({ time: e.target.value })}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="source-tz" className="input-sublabel">Timezone</label>
          <select
            id="source-tz"
            value={state.sourceIana}
            onChange={(e) => onChange({ sourceIana: e.target.value })}
            className="input"
          >
            {SOURCE_TIMEZONES.map((tz) => (
              <option key={tz.iana} value={tz.iana}>
                {tz.city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
