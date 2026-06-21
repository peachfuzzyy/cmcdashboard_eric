export const runtime = 'edge'
export const revalidate = 0

const YF_BASE = 'https://query2.finance.yahoo.com/v8/finance/chart'

const SYMBOLS = {
  'EURUSD': 'EURUSD=X',
  'GBPUSD': 'GBPUSD=X',
  'USDSGD': 'USDSGD=X',
  'USDJPY': 'USDJPY=X',
  'AUDUSD': 'AUDUSD=X',
  'USDCAD': 'USDCAD=X',
  'SPX':    '%5EGSPC',
  'NDX':    '%5ENDX',
  'HSI':    '%5EHSI',
  'Gold':   'GC%3DF',
  'Brent':  'BZ%3DF',
  'WTI':    'CL%3DF',
  'VIX':    '%5EVIX',
}

const BRENT_CURVE = [
  { month: 'Jul', sym: 'BZ%3DF' },
  { month: 'Aug', sym: 'BZH26%3DF' },
  { month: 'Sep', sym: 'BZJ26%3DF' },
  { month: 'Oct', sym: 'BZK26%3DF' },
  { month: 'Nov', sym: 'BZM26%3DF' },
  { month: 'Dec', sym: 'BZN26%3DF' },
]

function safe(v, dp = 2) {
  const n = parseFloat(v)
  if (!isFinite(n)) return null
  return parseFloat(n.toFixed(dp))
}

async function fetchQuote(symbol) {
  try {
    const url = `${YF_BASE}/${symbol}?interval=1d&range=90d`
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const j = await r.json()
    const result = j?.chart?.result?.[0]
    if (!result) return null
    const closes = result.indicators?.quote?.[0]?.close || []
    const valid = closes.filter(v => v !== null && isFinite(v))
    if (valid.length < 2) return null
    const last = valid[valid.length - 1]
    const prev = valid[valid.length - 2]
    const chgPct = safe(((last - prev) / prev) * 100, 2)
    const rets = []
    for (let i = 1; i < valid.length; i++) {
      rets.push((valid[i] - valid[i - 1]) / valid[i - 1])
    }
    const annF = Math.sqrt(252) * 100
    const vol = (n) => {
      const s = rets.slice(-n)
      if (s.length < 2) return null
      const m = s.reduce((a, b) => a + b, 0) / s.length
      const v = s.reduce((a, b) => a + Math.pow(b - m, 2), 0) / s.length
      return safe(Math.sqrt(v) * annF, 2)
    }
    return { last: safe(last, 4), chgPct, vol10: vol(10), vol30: vol(30), vol90: vol(90), closes: valid }
  } catch {
    return null
  }
}

function corrMatrix(seriesMap) {
  const labels = Object.keys(seriesMap)
  const matrix = labels.map(a =>
    labels.map(b => {
      const sa = seriesMap[a]
      const sb = seriesMap[b]
      const n = Math.min(sa.length, sb.length, 60)
      const ra = sa.slice(-n)
      const rb = sb.slice(-n)
      const ma = ra.reduce((x, y) => x + y, 0) / n
      const mb = rb.reduce((x, y) => x + y, 0) / n
      let num = 0, da = 0, db = 0
      for (let i = 0; i < n; i++) {
        num += (ra[i] - ma) * (rb[i] - mb)
        da  += Math.pow(ra[i] - ma, 2)
        db  += Math.pow(rb[i] - mb, 2)
      }
      const denom = Math.sqrt(da * db)
      return denom === 0 ? 1 : safe(num / denom, 2)
    })
  )
  return { labels, matrix }
}

function getReturns(closes) {
  const r = []
  for (let i = 1; i < closes.length; i++) {
    r.push((closes[i] - closes[i - 1]) / closes[i - 1])
  }
  return r
}

export async function GET() {
  try {
    const entries = Object.entries(SYMBOLS)
    const results = await Promise.all(entries.map(([, sym]) => fetchQuote(sym)))
    const quotes = {}
    entries.forEach(([k], i) => { quotes[k] = results[i] })

    const fxKeys = ['EURUSD', 'GBPUSD', 'USDSGD', 'USDJPY', 'AUDUSD', 'USDCAD']
    const fxData = fxKeys.map(k => {
      const q = quotes[k]
      return {
        pair:   k.slice(0, 3) + '/' + k.slice(3),
        price:  q?.last || null,
        chgPct: q?.chgPct || 0,
        vol10:  q?.vol10 || null,
        vol30:  q?.vol30 || null,
        vol90:  q?.vol90 || null,
      }
    })

    const macroItems = [
      { label: 'S&P 500',    key: 'SPX',   prefix: '',  dp: 0 },
      { label: 'Nasdaq 100', key: 'NDX',   prefix: '',  dp: 0 },
      { label: 'Hang Seng',  key: 'HSI',   prefix: '',  dp: 0 },
      { label: 'Gold',       key: 'Gold',  prefix: '$', dp: 0 },
      { label: 'Brent',      key: 'Brent', prefix: '$', dp: 2 },
      { label: 'VIX',        key: 'VIX',   prefix: '',  dp: 1 },
    ]
    const macroData = macroItems.map(m => {
      const q = quotes[m.key]
      const px = q?.last
      const val = px ? `${m.prefix}${parseFloat(px.toFixed(m.dp)).toLocaleString()}` : 'N/A'
      return { label: m.label, value: val, chgPct: q?.chgPct || 0 }
    })

    const volSurface = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDSGD'].map(k => ({
      pair: k.slice(0, 3) + '/' + k.slice(3),
      v10:  quotes[k]?.vol10 || null,
      v30:  quotes[k]?.vol30 || null,
      v90:  quotes[k]?.vol90 || null,
    }))

    const curveResults = await Promise.all(BRENT_CURVE.map(b => fetchQuote(b.sym)))
    const brentCurve = BRENT_CURVE.map((b, i) => ({
      month: b.month,
      price: curveResults[i]?.last || null,
    }))

    const corrKeys = {
      'EUR/USD': 'EURUSD',
      'GBP/USD': 'GBPUSD',
      'USD/JPY': 'USDJPY',
      'Gold':    'Gold',
      'Brent':   'Brent',
      'SPX':     'SPX',
    }
    const seriesMap = {}
    for (const [label, key] of Object.entries(corrKeys)) {
      seriesMap[label] = getReturns(quotes[key]?.closes || [])
    }
    const correlations = corrMatrix(seriesMap)

    const retAssets = [
      { label: 'EUR/USD',    key: 'EURUSD' },
      { label: 'GBP/USD',    key: 'GBPUSD' },
      { label: 'USD/JPY',    key: 'USDJPY' },
      { label: 'Gold',       key: 'Gold' },
      { label: 'Brent',      key: 'Brent' },
      { label: 'S&P 500',    key: 'SPX' },
      { label: 'Nasdaq 100', key: 'NDX' },
    ]
    const retData = retAssets.map(a => {
      const cls = quotes[a.key]?.closes || []
      const last = cls[cls.length - 1]
      const d1 = cls.length > 1  ? safe(((last - cls[cls.length - 2])  / cls[cls.length - 2])  * 100, 2) : null
      const w1 = cls.length > 6  ? safe(((last - cls[cls.length - 6])  / cls[cls.length - 6])  * 100, 2) : null
      const m1 = cls.length > 22 ? safe(((last - cls[cls.length - 22]) / cls[cls.length - 22]) * 100, 2) : null
      return { asset: a.label, d1, w1, m1 }
    })

    const stressTest = [
      { name: 'Alpha Fund',     exposure: '$42M', impact: 18, status: 'safe' },
      { name: 'Beta Capital',   exposure: '$78M', impact: 54, status: 'watch' },
      { name: 'Gamma AM',       exposure: '$31M', impact: 73, status: 'risk' },
      { name: 'Delta Partners', exposure: '$55M', impact: 38, status: 'watch' },
    ]

    return new Response(JSON.stringify({
      pulledAt: new Date().toUTCString(),
      fx: fxData,
      macro: macroData,
      volSurface,
      brentCurve,
      correlations,
      returns: retData,
      stressTest,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
