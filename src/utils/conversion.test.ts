import { describe, it, expect } from 'vitest'
import { convertTime } from './conversion'
import { SOURCE_TIMEZONES } from '../data/sourceTimezones'
import { searchTimezones, findTimezoneByIana, tzToSelection, TIMEZONES } from '../data/timezones'
import type { DestSelection } from '../types'

/** Helper: build a DestSelection from a primary IANA timezone */
function sel(iana: string): DestSelection {
  const tz = findTimezoneByIana(iana)
  if (!tz) throw new Error(`Unknown IANA: ${iana}`)
  return tzToSelection(tz)
}

// ─── Source timezone dropdown ───────────────────────────────────────────────

describe('source timezone dropdown', () => {
  it('includes London first as the default source timezone', () => {
    expect(SOURCE_TIMEZONES[0]).toEqual({ city: 'London', iana: 'Europe/London' })
  })

  it('is curated and does not include every primary timezone entry', () => {
    expect(SOURCE_TIMEZONES.length).toBeLessThan(TIMEZONES.length)
  })

  it('only references IANA values present in the full timezone dataset', () => {
    const knownIana = new Set(TIMEZONES.map((tz) => tz.iana))
    expect(SOURCE_TIMEZONES.every((tz) => knownIana.has(tz.iana))).toBe(true)
  })
})

// ─── Core conversion: summer DST ─────────────────────────────────────────────

describe('convertTime — summer DST (30 Jun 2026)', () => {
  const date = '2026-06-30'
  const time = '17:00'
  const src = 'Europe/London'

  it('London 17:00 BST → New York 12:00 EDT', () => {
    const [result] = convertTime(date, time, src, [sel('America/New_York')], true)
    expect(result.displayTime).toBe('12:00')
    expect(result.abbreviation).toBe('EDT')
    expect(result.dayOffset).toBe(0)
  })

  it('London 17:00 BST → Denver 10:00 MDT', () => {
    const [result] = convertTime(date, time, src, [sel('America/Denver')], true)
    expect(result.displayTime).toBe('10:00')
    expect(result.abbreviation).toBe('MDT')
    expect(result.dayOffset).toBe(0)
  })

  it('London 17:00 BST → Tokyo 01:00 JST next day', () => {
    const [result] = convertTime(date, time, src, [sel('Asia/Tokyo')], true)
    expect(result.displayTime).toBe('01:00')
    expect(result.abbreviation).toBe('JST')
    expect(result.dayOffset).toBe(1)
    expect(result.displayDate).toContain('1 Jul 2026')
  })
})

// ─── Core conversion: winter (no DST) ────────────────────────────────────────

describe('convertTime — winter (15 Jan 2026)', () => {
  const date = '2026-01-15'
  const time = '17:00'
  const src = 'Europe/London'

  it('London 17:00 GMT → New York 12:00 EST', () => {
    const [result] = convertTime(date, time, src, [sel('America/New_York')], true)
    expect(result.displayTime).toBe('12:00')
    expect(result.abbreviation).toBe('EST')
    expect(result.dayOffset).toBe(0)
  })

  it('London 17:00 GMT → Denver 10:00 MST', () => {
    const [result] = convertTime(date, time, src, [sel('America/Denver')], true)
    expect(result.displayTime).toBe('10:00')
    expect(result.abbreviation).toBe('MST')
    expect(result.dayOffset).toBe(0)
  })
})

// ─── 12h format ──────────────────────────────────────────────────────────────

describe('convertTime — 12h format', () => {
  it('17:00 displays as 5:00 PM in 12h mode', () => {
    const [result] = convertTime('2026-06-30', '17:00', 'Europe/London', [sel('Europe/London')], false)
    expect(result.displayTime).toMatch(/5:00\s*PM/i)
  })
})

// ─── Previous day ─────────────────────────────────────────────────────────────

describe('convertTime — previous day', () => {
  it('London 02:00 → Los Angeles previous day', () => {
    const [result] = convertTime('2026-06-30', '02:00', 'Europe/London', [sel('America/Los_Angeles')], true)
    expect(result.dayOffset).toBe(-1)
  })
})

// ─── City alias resolution ────────────────────────────────────────────────────

describe('city alias search — UK cities', () => {
  it('Birmingham resolves to Europe/London', () => {
    const results = searchTimezones('birmingham')
    const match = results.find((r) => r.city === 'Birmingham')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Europe/London')
    expect(match?.isAlias).toBe(true)
  })

  it('Manchester resolves to Europe/London', () => {
    const results = searchTimezones('manchester')
    const match = results.find((r) => r.city === 'Manchester')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Europe/London')
    expect(match?.isAlias).toBe(true)
  })

  it('Glasgow resolves to Europe/London', () => {
    const results = searchTimezones('glasgow')
    const match = results.find((r) => r.city === 'Glasgow')
    expect(match?.iana).toBe('Europe/London')
  })
})

describe('city alias search — US cities', () => {
  it('San Francisco resolves to America/Los_Angeles', () => {
    const results = searchTimezones('san francisco')
    const match = results.find((r) => r.city === 'San Francisco')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('America/Los_Angeles')
    expect(match?.isAlias).toBe(true)
  })

  it('Austin resolves to America/Chicago', () => {
    const results = searchTimezones('austin')
    const match = results.find((r) => r.city === 'Austin')
    expect(match?.iana).toBe('America/Chicago')
  })

  it('Boulder resolves to America/Denver', () => {
    const results = searchTimezones('boulder')
    const match = results.find((r) => r.city === 'Boulder')
    expect(match?.iana).toBe('America/Denver')
  })
})

describe('city alias search — Asia', () => {
  it('Osaka resolves to Asia/Tokyo', () => {
    const results = searchTimezones('osaka')
    const match = results.find((r) => r.city === 'Osaka')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Tokyo')
    expect(match?.isAlias).toBe(true)
  })

  it('Kyoto resolves to Asia/Tokyo', () => {
    const results = searchTimezones('kyoto')
    const match = results.find((r) => r.city === 'Kyoto')
    expect(match?.iana).toBe('Asia/Tokyo')
  })

  it('Abu Dhabi resolves to Asia/Dubai', () => {
    const results = searchTimezones('abu dhabi')
    const match = results.find((r) => r.city === 'Abu Dhabi')
    expect(match?.iana).toBe('Asia/Dubai')
  })
})

describe('city alias conversion — uses correct IANA timezone', () => {
  it('Birmingham alias converts correctly using Europe/London DST', () => {
    const birmingham: DestSelection = {
      iana: 'Europe/London',
      city: 'Birmingham',
      country: 'United Kingdom',
      isAlias: true,
      primaryCity: 'London',
    }
    const [result] = convertTime('2026-06-30', '17:00', 'Europe/London', [birmingham], true)
    expect(result.city).toBe('Birmingham')
    expect(result.displayTime).toBe('17:00')
    expect(result.abbreviation).toBe('BST')
    expect(result.isAlias).toBe(true)
    expect(result.primaryCity).toBe('London')
  })

  it('alias hint shows primary city name', () => {
    const results = searchTimezones('osaka')
    const osaka = results.find((r) => r.city === 'Osaka')
    expect(osaka?.hint).toContain('Tokyo')
    expect(osaka?.hint).toContain('Asia/Tokyo')
  })
})

// ─── New global city alias tests ──────────────────────────────────────────────

describe('city alias search — Bangladesh', () => {
  it('Dhaka resolves to Asia/Dhaka as primary city', () => {
    const results = searchTimezones('dhaka')
    const match = results.find((r) => r.city === 'Dhaka')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Dhaka')
    // Dhaka is a primary timezone city, not an alias
    expect(match?.isAlias).toBe(false)
  })

  it('Chittagong resolves to Asia/Dhaka as alias', () => {
    const results = searchTimezones('chittagong')
    const match = results.find((r) => r.city === 'Chittagong')
    expect(match?.iana).toBe('Asia/Dhaka')
    expect(match?.isAlias).toBe(true)
  })

  it('Sylhet resolves to Asia/Dhaka as alias', () => {
    const results = searchTimezones('sylhet')
    const match = results.find((r) => r.city === 'Sylhet')
    expect(match?.iana).toBe('Asia/Dhaka')
  })
})

describe('city alias search — Africa', () => {
  it('Lagos resolves to Africa/Lagos as primary city', () => {
    const results = searchTimezones('lagos')
    const match = results.find((r) => r.city === 'Lagos')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Africa/Lagos')
    expect(match?.isAlias).toBe(false)
  })

  it('Abuja resolves to Africa/Lagos as alias', () => {
    const results = searchTimezones('abuja')
    const match = results.find((r) => r.city === 'Abuja')
    expect(match?.iana).toBe('Africa/Lagos')
    expect(match?.isAlias).toBe(true)
  })

  it('Cape Town resolves to Africa/Johannesburg as alias', () => {
    const results = searchTimezones('cape town')
    const match = results.find((r) => r.city === 'Cape Town')
    expect(match?.iana).toBe('Africa/Johannesburg')
  })

  it('Nairobi resolves to Africa/Nairobi as primary city', () => {
    const results = searchTimezones('nairobi')
    const match = results.find((r) => r.city === 'Nairobi')
    expect(match?.iana).toBe('Africa/Nairobi')
    expect(match?.isAlias).toBe(false)
  })
})

describe('city alias search — India', () => {
  it('Delhi resolves to Asia/Kolkata', () => {
    const results = searchTimezones('delhi')
    const match = results.find((r) => r.city === 'Delhi')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Kolkata')
    expect(match?.isAlias).toBe(true)
  })

  it('New Delhi resolves to Asia/Kolkata', () => {
    const results = searchTimezones('new delhi')
    const match = results.find((r) => r.city === 'New Delhi')
    expect(match?.iana).toBe('Asia/Kolkata')
  })

  it('Bangalore resolves to Asia/Kolkata', () => {
    const results = searchTimezones('bangalore')
    const match = results.find((r) => r.city === 'Bangalore')
    expect(match?.iana).toBe('Asia/Kolkata')
  })
})

describe('city alias search — Southeast Asia', () => {
  it('Bangkok resolves to Asia/Bangkok as primary city', () => {
    const results = searchTimezones('bangkok')
    const match = results.find((r) => r.city === 'Bangkok')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Bangkok')
    expect(match?.isAlias).toBe(false)
  })

  it('Kuala Lumpur resolves to Asia/Kuala_Lumpur as primary city', () => {
    const results = searchTimezones('kuala lumpur')
    const match = results.find((r) => r.city === 'Kuala Lumpur')
    expect(match?.iana).toBe('Asia/Kuala_Lumpur')
    expect(match?.isAlias).toBe(false)
  })

  it('Jakarta resolves to Asia/Jakarta as primary city', () => {
    const results = searchTimezones('jakarta')
    const match = results.find((r) => r.city === 'Jakarta')
    expect(match?.iana).toBe('Asia/Jakarta')
    expect(match?.isAlias).toBe(false)
  })
})

describe('city alias search — China', () => {
  it('Beijing resolves to Asia/Shanghai as alias', () => {
    const results = searchTimezones('beijing')
    const match = results.find((r) => r.city === 'Beijing')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Shanghai')
    expect(match?.isAlias).toBe(true)
  })

  it('Shanghai resolves to Asia/Shanghai as primary city', () => {
    const results = searchTimezones('shanghai')
    const match = results.find((r) => r.city === 'Shanghai')
    expect(match?.iana).toBe('Asia/Shanghai')
    expect(match?.isAlias).toBe(false)
  })
})

describe('city alias search — Pakistan', () => {
  it('Karachi resolves to Asia/Karachi as primary city', () => {
    const results = searchTimezones('karachi')
    const match = results.find((r) => r.city === 'Karachi')
    expect(match?.iana).toBe('Asia/Karachi')
    expect(match?.isAlias).toBe(false)
  })

  it('Lahore resolves to Asia/Karachi as alias', () => {
    const results = searchTimezones('lahore')
    const match = results.find((r) => r.city === 'Lahore')
    expect(match?.iana).toBe('Asia/Karachi')
    expect(match?.isAlias).toBe(true)
  })
})

// ─── Required new city tests ──────────────────────────────────────────────────

describe('new primary cities — Middle East & Caucasus', () => {
  it('Ankara resolves to Europe/Istanbul as alias', () => {
    const results = searchTimezones('ankara')
    const match = results.find((r) => r.city === 'Ankara')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Europe/Istanbul')
    expect(match?.isAlias).toBe(true)
    expect(match?.hint).toContain('Istanbul')
  })

  it('Pyongyang resolves to Asia/Pyongyang as primary city', () => {
    const results = searchTimezones('pyongyang')
    const match = results.find((r) => r.city === 'Pyongyang')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Pyongyang')
    expect(match?.isAlias).toBe(false)
  })

  it('Tehran resolves to Asia/Tehran as primary city', () => {
    const results = searchTimezones('tehran')
    const match = results.find((r) => r.city === 'Tehran')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Asia/Tehran')
    expect(match?.isAlias).toBe(false)
  })

  it('Tel Aviv resolves to Asia/Jerusalem as alias (corrected)', () => {
    const results = searchTimezones('tel aviv')
    const match = results.find((r) => r.city === 'Tel Aviv')
    expect(match?.iana).toBe('Asia/Jerusalem')
    expect(match?.isAlias).toBe(true)
  })

  it('Baghdad resolves to Asia/Baghdad as primary city', () => {
    const results = searchTimezones('baghdad')
    const match = results.find((r) => r.city === 'Baghdad')
    expect(match?.iana).toBe('Asia/Baghdad')
    expect(match?.isAlias).toBe(false)
  })

  it('Beirut resolves to Asia/Beirut as primary city', () => {
    const results = searchTimezones('beirut')
    const match = results.find((r) => r.city === 'Beirut')
    expect(match?.iana).toBe('Asia/Beirut')
    expect(match?.isAlias).toBe(false)
  })

  it('Tashkent resolves to Asia/Tashkent as primary city', () => {
    const results = searchTimezones('tashkent')
    const match = results.find((r) => r.city === 'Tashkent')
    expect(match?.iana).toBe('Asia/Tashkent')
    expect(match?.isAlias).toBe(false)
  })

  it('Astana resolves to Asia/Almaty as alias', () => {
    const results = searchTimezones('astana')
    const match = results.find((r) => r.city === 'Astana')
    expect(match?.iana).toBe('Asia/Almaty')
    expect(match?.isAlias).toBe(true)
  })
})

describe('new primary cities — Latin America', () => {
  it('Mexico City resolves to America/Mexico_City as primary city', () => {
    const results = searchTimezones('mexico city')
    const match = results.find((r) => r.city === 'Mexico City')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('America/Mexico_City')
    expect(match?.isAlias).toBe(false)
  })

  it('São Paulo resolves to America/Sao_Paulo as primary city', () => {
    const results = searchTimezones('sao paulo')
    const match = results.find((r) => r.city === 'São Paulo')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('America/Sao_Paulo')
    expect(match?.isAlias).toBe(false)
  })

  it('Rio de Janeiro resolves to America/Sao_Paulo as alias', () => {
    const results = searchTimezones('rio de janeiro')
    const match = results.find((r) => r.city === 'Rio de Janeiro')
    expect(match?.iana).toBe('America/Sao_Paulo')
    expect(match?.isAlias).toBe(true)
  })

  it('Buenos Aires resolves to America/Argentina/Buenos_Aires as primary city', () => {
    const results = searchTimezones('buenos aires')
    const match = results.find((r) => r.city === 'Buenos Aires')
    expect(match?.iana).toBe('America/Argentina/Buenos_Aires')
    expect(match?.isAlias).toBe(false)
  })

  it('Santiago resolves to America/Santiago as primary city', () => {
    const results = searchTimezones('santiago')
    const match = results.find((r) => r.city === 'Santiago')
    expect(match?.iana).toBe('America/Santiago')
    expect(match?.isAlias).toBe(false)
  })
})

describe('new primary cities — Europe', () => {
  it('Lisbon resolves to Europe/Lisbon as primary city', () => {
    const results = searchTimezones('lisbon')
    const match = results.find((r) => r.city === 'Lisbon')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Europe/Lisbon')
    expect(match?.isAlias).toBe(false)
  })

  it('Dublin resolves to Europe/Dublin as primary city', () => {
    const results = searchTimezones('dublin')
    const match = results.find((r) => r.city === 'Dublin')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Europe/Dublin')
    expect(match?.isAlias).toBe(false)
  })

  it('Warsaw resolves to Europe/Warsaw as primary city', () => {
    const results = searchTimezones('warsaw')
    const match = results.find((r) => r.city === 'Warsaw')
    expect(match?.iana).toBe('Europe/Warsaw')
    expect(match?.isAlias).toBe(false)
  })

  it('Helsinki resolves to Europe/Helsinki as primary city', () => {
    const results = searchTimezones('helsinki')
    const match = results.find((r) => r.city === 'Helsinki')
    expect(match?.iana).toBe('Europe/Helsinki')
    expect(match?.isAlias).toBe(false)
  })

  it('Athens resolves to Europe/Athens as primary city', () => {
    const results = searchTimezones('athens')
    const match = results.find((r) => r.city === 'Athens')
    expect(match?.iana).toBe('Europe/Athens')
    expect(match?.isAlias).toBe(false)
  })
})

describe('new primary cities — Pacific', () => {
  it('Honolulu resolves to Pacific/Honolulu as primary city', () => {
    const results = searchTimezones('honolulu')
    const match = results.find((r) => r.city === 'Honolulu')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Pacific/Honolulu')
    expect(match?.isAlias).toBe(false)
  })

  it('Wellington resolves to Pacific/Auckland as alias', () => {
    const results = searchTimezones('wellington')
    const match = results.find((r) => r.city === 'Wellington')
    expect(match?.iana).toBe('Pacific/Auckland')
    expect(match?.isAlias).toBe(true)
  })
})

// ─── City index — ranking and resolution ─────────────────────────────────────

describe('city index — York ranking', () => {
  it('"york" query returns York UK before New York', () => {
    const results = searchTimezones('york')
    const yorkUkIdx = results.findIndex((r) => r.city === 'York' && r.country === 'United Kingdom')
    const newYorkIdx = results.findIndex((r) => r.city === 'New York')
    expect(yorkUkIdx).toBeGreaterThanOrEqual(0)
    expect(newYorkIdx).toBeGreaterThanOrEqual(0)
    expect(yorkUkIdx).toBeLessThan(newYorkIdx)
  })

  it('"york" query returns York UK before York US', () => {
    const results = searchTimezones('york')
    const yorkUkIdx = results.findIndex((r) => r.city === 'York' && r.country === 'United Kingdom')
    const yorkUsIdx = results.findIndex((r) => r.city === 'York' && r.country === 'United States')
    expect(yorkUkIdx).toBeGreaterThanOrEqual(0)
    expect(yorkUsIdx).toBeGreaterThanOrEqual(0)
    expect(yorkUkIdx).toBeLessThan(yorkUsIdx)
  })

  it('York UK resolves to Europe/London as alias', () => {
    const results = searchTimezones('york')
    const match = results.find((r) => r.city === 'York' && r.country === 'United Kingdom')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('Europe/London')
    expect(match?.isAlias).toBe(true)
    expect(match?.hint).toContain('London')
  })

  it('York US resolves to America/New_York as alias', () => {
    const results = searchTimezones('york')
    const match = results.find((r) => r.city === 'York' && r.country === 'United States')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('America/New_York')
    expect(match?.isAlias).toBe(true)
  })

  it('New York resolves to America/New_York as primary city', () => {
    const results = searchTimezones('new york')
    const match = results.find((r) => r.city === 'New York')
    expect(match).toBeDefined()
    expect(match?.iana).toBe('America/New_York')
    expect(match?.isAlias).toBe(false)
  })
})

describe('city index — confirmed resolutions', () => {
  it('Quito resolves to America/Guayaquil', () => {
    const results = searchTimezones('quito')
    const match = results.find((r) => r.city === 'Quito')
    expect(match?.iana).toBe('America/Guayaquil')
    expect(match?.isAlias).toBe(false)
  })

  it('Washington resolves to America/New_York', () => {
    const results = searchTimezones('washington')
    const match = results.find((r) => r.city === 'Washington')
    expect(match?.iana).toBe('America/New_York')
    expect(match?.isAlias).toBe(true)
  })

  it('Ottawa resolves to America/Toronto', () => {
    const results = searchTimezones('ottawa')
    const match = results.find((r) => r.city === 'Ottawa')
    expect(match?.iana).toBe('America/Toronto')
    expect(match?.isAlias).toBe(true)
  })

  it('Canberra resolves to Australia/Sydney', () => {
    const results = searchTimezones('canberra')
    const match = results.find((r) => r.city === 'Canberra')
    expect(match?.iana).toBe('Australia/Sydney')
    expect(match?.isAlias).toBe(true)
  })

  it('Reykjavik resolves to Atlantic/Reykjavik', () => {
    const results = searchTimezones('reykjavik')
    const match = results.find((r) => r.city === 'Reykjavik')
    expect(match?.iana).toBe('Atlantic/Reykjavik')
    expect(match?.isAlias).toBe(false)
  })

  it('Cape Town resolves to Africa/Johannesburg', () => {
    const results = searchTimezones('cape town')
    const match = results.find((r) => r.city === 'Cape Town')
    expect(match?.iana).toBe('Africa/Johannesburg')
    expect(match?.isAlias).toBe(true)
  })

  it('Dhaka resolves to Asia/Dhaka', () => {
    const results = searchTimezones('dhaka')
    const match = results.find((r) => r.city === 'Dhaka')
    expect(match?.iana).toBe('Asia/Dhaka')
    expect(match?.isAlias).toBe(false)
  })

  it('Ankara resolves to Europe/Istanbul as alias', () => {
    const results = searchTimezones('ankara')
    const match = results.find((r) => r.city === 'Ankara')
    expect(match?.iana).toBe('Europe/Istanbul')
    expect(match?.isAlias).toBe(true)
  })

  it('Istanbul resolves to Europe/Istanbul as primary city', () => {
    const results = searchTimezones('istanbul')
    const match = results.find((r) => r.city === 'Istanbul')
    expect(match?.iana).toBe('Europe/Istanbul')
    expect(match?.isAlias).toBe(false)
  })

  it('Pyongyang resolves to Asia/Pyongyang', () => {
    const results = searchTimezones('pyongyang')
    const match = results.find((r) => r.city === 'Pyongyang')
    expect(match?.iana).toBe('Asia/Pyongyang')
    expect(match?.isAlias).toBe(false)
  })
})
