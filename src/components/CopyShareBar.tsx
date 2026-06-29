import { useState } from 'react'
import { convertTime, formatResultLine } from '../utils/conversion'
import { findTimezoneByIana, tzToSelection } from '../data/timezones'
import type { AppState } from '../types'

type Props = {
  state: AppState
  shareUrl: string
}

type CopyState = 'idle' | 'copied-text' | 'copied-url'

export function CopyShareBar({ state, shareUrl }: Props) {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  function buildCopyText(): string {
    const sourceTz = findTimezoneByIana(state.sourceIana)
    if (!sourceTz) return ''

    const allSelections = [tzToSelection(sourceTz), ...state.destSelections]
    const results = convertTime(state.date, state.time, state.sourceIana, allSelections, state.is24h)
    return results.map(formatResultLine).join('\n')
  }

  async function copyText() {
    await navigator.clipboard.writeText(buildCopyText())
    setCopyState('copied-text')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`)
    setCopyState('copied-url')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  if (state.destSelections.length === 0) return null

  return (
    <div className="action-bar">
      <button type="button" onClick={copyText} className="btn-secondary">
        {copyState === 'copied-text' ? '✓ Copied' : 'Copy results'}
      </button>
      <button type="button" onClick={copyUrl} className="btn-primary">
        {copyState === 'copied-url' ? '✓ Copied link' : 'Share link'}
      </button>
    </div>
  )
}
