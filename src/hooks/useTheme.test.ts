import { describe, expect, it } from 'vitest'
import {
  THEME_STORAGE_KEY,
  persistThemeMode,
  readStoredTheme,
  resolveThemeMode,
} from './useTheme'

function createStorage() {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    values,
  }
}

describe('theme preferences', () => {
  it('defaults to system mode and follows the system preference', () => {
    const storage = createStorage()
    const mode = readStoredTheme(storage)

    expect(mode).toBe('system')
    expect(resolveThemeMode(mode, true)).toBe('dark')
    expect(resolveThemeMode(mode, false)).toBe('light')
  })

  it('persists explicit Light mode', () => {
    const storage = createStorage()

    persistThemeMode('light', storage)

    expect(storage.values.get(THEME_STORAGE_KEY)).toBe('light')
    expect(readStoredTheme(storage)).toBe('light')
    expect(resolveThemeMode(readStoredTheme(storage), true)).toBe('light')
  })

  it('persists explicit Dark mode', () => {
    const storage = createStorage()

    persistThemeMode('dark', storage)

    expect(storage.values.get(THEME_STORAGE_KEY)).toBe('dark')
    expect(readStoredTheme(storage)).toBe('dark')
    expect(resolveThemeMode(readStoredTheme(storage), false)).toBe('dark')
  })

  it('clears manual override when System mode is selected', () => {
    const storage = createStorage()
    persistThemeMode('dark', storage)

    persistThemeMode('system', storage)

    expect(storage.values.has(THEME_STORAGE_KEY)).toBe(false)
    expect(readStoredTheme(storage)).toBe('system')
  })
})
