'use client'

export function SecLabel({ children, style = {} }) {
  return <div style={{ fontSize:10, fontWeight:600, color:'var(--muted)', letterSpacing:'0.09em', textTransform:'uppercase', margin:'18px 0 8px', ...style }}>{children}</div>
}

export function Card({ children, style = {} }) {
  return <div style={{ background:'var(--white)', border:'0.5px solid var(--border)', borderRadius:10, padding:'16px 18px', ...style }}>{children}</div>
}

export function CardTitle({ icon, children }) {
  return (
    <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:12, display:'flex', alignItems:'center', gap:7 }}>
      <i className={`ti ti-${icon}`} style={{ color:'var(--orange)', fontSize:16 }} />
      {children}
    </div>
  )
}

export function KpiCard({ label, value, sub, subClass='' }) {
  return (
    <div style={{ background:'var(--white)', border:'0.5px solid var(--border)', borderRadius:8, padding:'14px 16px' }}>
      <div style={{ fontSize:11, color:'var(--muted)', marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:600, color:'var(--text)', lineHeight:1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize:11, marginTop:4 }} className={subClass}>{sub}</div>}
    </div>
  )
}

export function Badge({ children, variant='navy' }) {
  const map = {
    navy:   { background:'#E6EBF2', color:'#0D1B2A' },
    orange: { background:'var(--orange-lt)', color:'var(--orange-dk)' },
    green:  { background:'#EAF3DE', color:'#27500A' },
    amber:  { background:'#FAEEDA', color:'#633806' },
    red:    { background:'#FCEBEB', color:'#791F1F' },
    blue:   { background:'#E6F1FB', color:'#0C447C' },
    muted:  { background:'#F1EFE8', color:'#5F5E5A' },
  }
  return <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:500, whiteSpace:'nowrap', ...map[variant] }}>{children}</span>
}

export function THead({ children, cols, gap=8 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:cols, gap, padding:'0 0 7px', fontSize:10, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'0.5px solid var(--border)', marginBottom:2 }}>
      {children}
    </div>
  )
}

export function TRow({ children, cols, gap=8, last=false }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:cols, gap, alignItems:'center', padding:'8px 0', borderBottom: last ? 'none' : '0.5px solid var(--border)', fontSize:13 }}>
      {children}
    </div>
  )
}

export function Grid({ cols=4, children, style={} }) {
  const t = { 2:'1fr 1fr', 3:'1fr 1fr 1fr', 4:'1fr 1fr 1fr 1fr' }
  return <div style={{ display:'grid', gridTemplateColumns:t[cols]||t[4], gap:10, ...style }}>{children}</div>
}

export function AlertBar({ children }) {
  return (
    <div style={{ background:'var(--orange-lt)', border:'0.5px solid #F5C4B3', borderRadius:8, padding:'10px 14px', fontSize:12, color:'var(--orange-dk)', display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
      <i className="ti ti-alert-triangle" />{children}
    </div>
  )
}

export function AiBadge() {
  return <span style={{ fontSize:10, background:'var(--orange-lt)', color:'var(--orange-dk)', padding:'2px 6px', borderRadius:4, marginLeft:6, fontWeight:500 }}>AI generated</span>
}

export function fmt(n, dp=2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n).toFixed(dp)
}

export function chgClass(n) {
  if (n === null || n === undefined) return ''
  return n >= 0 ? 'up' : 'dn'
}

export function chgSign(n, dp=2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return (n >= 0 ? '+' : '') + fmt(n, dp) + '%'
}
