import { useMemo } from 'react'
import { convertTime } from '../utils/conversion'
import { findTimezoneByIana, tzToSelection } from '../data/timezones'
import { ResultCard } from './ResultCard'
import type { AppState } from '../types'

type Props = {
  state: AppState
}

export function ResultsList({ state }: Props) {
  const sourceTz = findTimezoneByIana(state.sourceIana)
  const sourceSel = sourceTz ? tzToSelection(sourceTz) : null

  const sourceResult = useMemo(() => {
    if (!sourceSel) return null
    const [result] = convertTime(state.date, state.time, state.sourceIana, [sourceSel], state.is24h)
    return result ?? null
  }, [state.date, state.time, state.sourceIana, state.is24h, sourceSel])

  const destResults = useMemo(
    () => convertTime(state.date, state.time, state.sourceIana, state.destSelections, state.is24h),
    [state.date, state.time, state.sourceIana, state.destSelections, state.is24h],
  )

  if (!sourceResult) {
    return <p className="empty-state-copy">Please select a valid source timezone.</p>
  }

  return (
    <div className="results-list">
      <ResultCard result={sourceResult} isSource />
      {destResults.map((result, i) => (
        <ResultCard key={`${result.city}|${result.iana}|${i}`} result={result} />
      ))}
      {state.destSelections.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-title">No destination cities selected.</p>
          <p className="empty-state-copy">Search for one or more cities to compare local times.</p>
        </div>
      )}
    </div>
  )
}
