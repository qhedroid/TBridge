import type { ConversionResult } from '../types'

type Props = {
  result: ConversionResult
  isSource?: boolean
}

export function ResultCard({ result, isSource = false }: Props) {
  const dayOffset = result.dayOffset

  return (
    <div className={`result-row ${isSource ? 'result-row--source' : ''}`}>
      <div className="result-meta">
        <div className="result-title-line">
          <span className="result-city-name">{result.city}</span>
          {isSource && <span className="source-badge">source</span>}
        </div>
        <span className="result-sub">
          {result.country}
          {result.isAlias && result.primaryCity && (
            <> · <span>{result.iana}</span></>
          )}
        </span>
      </div>

      <div className="result-time-block">
        <div className="result-time-line">
          {dayOffset !== 0 && (
            <span className={`day-badge ${dayOffset === 1 ? 'day-badge--next' : 'day-badge--prev'}`}>
              {dayOffset === 1 ? '+1' : '−1'}
            </span>
          )}
          <span className="result-time-display">{result.displayTime}</span>
          <span className="result-abbr">{result.abbreviation}</span>
        </div>
        <span className="result-date-display">{result.displayDate}</span>
      </div>
    </div>
  )
}
