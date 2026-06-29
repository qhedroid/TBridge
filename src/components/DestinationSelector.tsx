import { useState, useRef, useEffect, useId } from 'react'
import { searchTimezones, searchResultToSelection } from '../data/timezones'
import type { AppState } from '../types'

type Props = {
  state: AppState
  onChange: (patch: Partial<AppState>) => void
}

export function DestinationSelector({ state, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  // Deduplicate by "city|iana" so aliases with same IANA as primary still show
  const selectedKeys = new Set(state.destSelections.map((s) => `${s.city}|${s.iana}`))

  const results = searchTimezones(query).filter(
    (r) => !selectedKeys.has(`${r.city}|${r.iana}`),
  )

  function addSelection(result: (typeof results)[number]) {
    const sel = searchResultToSelection(result)
    onChange({ destSelections: [...state.destSelections, sel] })
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function removeSelection(idx: number) {
    onChange({ destSelections: state.destSelections.filter((_, i) => i !== idx) })
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as Element).closest('[data-dest-selector]')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="input-section">
      <label className="field-label mb-2 block">Convert to</label>

      {/* Selected chips */}
      {state.destSelections.length > 0 && (
        <div className="chip-group">
          {state.destSelections.map((sel, idx) => (
            <span key={`${sel.city}|${sel.iana}|${idx}`} className="chip">
              {sel.city}
              <button
                type="button"
                onClick={() => removeSelection(idx)}
                aria-label={`Remove ${sel.city}`}
                className="chip-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search combobox */}
      <div className="relative" data-dest-selector>
        <input
          ref={inputRef}
          id={listId}
          role="combobox"
          type="text"
          placeholder="Add a city…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
            if (e.key === 'Enter' && results.length > 0) addSelection(results[0])
          }}
          className="input"
          autoComplete="off"
          aria-label="Search destination cities"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${listId}-list`}
        />

        {open && results.length > 0 && (
          <ul id={`${listId}-list`} role="listbox" className="dropdown">
            {results.slice(0, 8).map((result) => (
              <li
                key={`${result.city}|${result.iana}`}
                role="option"
                aria-selected={false}
                className="dropdown-item"
                onMouseDown={(e) => {
                  e.preventDefault()
                  addSelection(result)
                }}
              >
                <div className="dropdown-row-main">
                  <span className="dropdown-city">{result.city}</span>
                  <span className="dropdown-country">{result.country}</span>
                </div>
                <div className="dropdown-hint">
                  {result.isAlias && result.hint ? result.hint : result.iana}
                </div>
              </li>
            ))}
          </ul>
        )}

        {open && query.length > 0 && results.length === 0 && (
          <div className="dropdown" role="status" aria-live="polite">
            <p className="dropdown-item dropdown-empty">No results for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
