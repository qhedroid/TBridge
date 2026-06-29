import { useEffect, useState } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'tbridge-theme'

type ThemeStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
type ThemeRoot = Pick<HTMLElement, 'classList' | 'setAttribute'>

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function readStoredTheme(storage: ThemeStorage): ThemeMode {
  const stored = storage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

export function persistThemeMode(mode: ThemeMode, storage: ThemeStorage): void {
  if (mode === 'system') {
    storage.removeItem(THEME_STORAGE_KEY)
    return
  }

  storage.setItem(THEME_STORAGE_KEY, mode)
}

export function resolveThemeMode(mode: ThemeMode, systemPrefersDark: boolean): ResolvedTheme {
  if (mode === 'system') return systemPrefersDark ? 'dark' : 'light'
  return mode
}

export function applyResolvedTheme(theme: ResolvedTheme, root: ThemeRoot): void {
  root.classList.toggle('dark', theme === 'dark')
  root.setAttribute('data-theme', theme)
}

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitialThemeMode(): ThemeMode {
  try {
    return readStoredTheme(window.localStorage)
  } catch {
    return 'system'
  }
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(getInitialThemeMode)
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark)
  const resolvedTheme = resolveThemeMode(mode, systemPrefersDark)

  useEffect(() => {
    applyResolvedTheme(resolvedTheme, document.documentElement)
  }, [resolvedTheme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(event: MediaQueryListEvent) {
      setSystemPrefersDark(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  function setMode(nextMode: ThemeMode) {
    try {
      persistThemeMode(nextMode, window.localStorage)
    } catch {
      // Ignore storage failures; the in-memory selection still applies.
    }
    setModeState(nextMode)
  }

  return { mode, resolvedTheme, setMode }
}
