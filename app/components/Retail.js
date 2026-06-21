'use client'
import { SecLabel, Card, CardTitle, KpiCard, Badge, THead, TRow, Grid, AlertBar, fmt, chgClass, chgSign } from './ui'

const TALKING_POINTS = [
  { text: 'Review open FX positions against overnight moves — check if any stops need adjusting before the session opens.', tag: 'FX' },
  { text: 'VIX movement signals risk sentiment shift — good moment to discuss position sizing with clients holding leveraged equity CFDs.', tag: 'Risk' },
  { text: 'Gold is a key watch today — clients long XAU should be aware of USD correlation and review profit targets.', tag: 'Commodity' },
  { text: 'Brent crude curve in backwardation — relevant talking point for any clients trading energy CFDs.', tag: 'Commodity' },
  { text: 'Remind AI-eligible clients of the 2% margin benefit vs 5% retail — same capital, 2.5× the position size.', tag: 'Macro' },
]

export default function Retail({ data }) {
  const { fx=[], macro=[] } = data
  const maxVol = Math.max(...fx.map(d => d.vol30 || 0), 1)

  return (
    <div>
      <AlertBar>2 clients below 130% margin level — follow up before market open</AlertBar>

      <SecLabel>Market snapshot — FX</SecLabel>
      <Grid cols={4}>
        {fx.slice(0,4).map(d => (
          <KpiCard key={d.pair} label={d.pair}
            value={fmt(d.price, d.price > 10 ? 2 : 4)}
            sub={chgSign(d.chgPct) + ' today'}
            subClass={chgClass(d.chgPct)} />
        ))}
      </Grid>

      <SecLabel style={{ marginTop:14 }}>Market snapshot — indices & commodities</SecLabel>
      <Grid cols={4} style={{ gridTemplateColumns:'repeat(3,1fr) 1fr' }}>
        {macro.map(d => (
          <KpiCard key={d.label} label={d.label} value={d.value}
            sub={chgSign(d.chgPct) + ' today'}
            subClass={chgClass(d.chgPct)} />
        ))}
      </Grid>

      <SecLabel style={{ marginTop:14 }}>FX volatility (30d realised)</SecLabel>
      <Card>
        <THead cols="90px 75px 65px 1fr 55px">
          <span>Pair</span><span>Price</span><span>Chg%</span><span>30d vol</span><span>Margin</span>
        </THead>
        {fx.map((d, i) => {
          const pct = maxVol > 0 ? Math.round((d.vol30 / maxVol) * 100) : 0
          const barColor = (d.chgPct||0) >= 0 ? '#1D9E75' : '#E24B4A'
          return (
            <TRow key={d.pair} cols="90px 75px 65px 1fr 55px" last={i===fx.length-1}>
              <span style={{ fontWeight:500 }}>{d.pair}</span>
              <span style={{ color:'var(--muted)' }}>{fmt(d.price, d.price > 10 ? 2 : 4)}</span>
              <span className={chgClass(d.chgPct)}>{chgSign(d.chgPct)}</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ flex:1, height:4, background:'#EEF0F3', borderRadius:2 }}>
                  <div style={{ width:`${pct}%`, height:4, borderRadius:2, background:barColor }} />
                </div>
                <span style={{ fontSize:11, color:'var(--muted)', minWidth:34 }}>{fmt(d.vol30)}%</span>
              </div>
              <Badge variant="navy">5%</Badge>
            </TRow>
          )
        })}
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 }}>
        <Card>
          <CardTitle icon="users">Client health</CardTitle>
          {[
            { label:'Active clients',         val:'84',  sub:'↑ 3 this week',        cls:'' },
            { label:'Margin <130%',           val:'2',   sub:'Call before open',      cls:'dn' },
            { label:'Dormant 30d+',           val:'11',  sub:'Re-engagement targets', cls:'warn' },
            { label:'AI-eligible, not opted', val:'7',   sub:'Upgrade pipeline',      cls:'' },
          ].map((r,i,a) => (
            <TRow key={r.label} cols="1fr auto" last={i===a.length-1}>
              <div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>{r.label}</div>
                <div style={{ fontSize:11, marginTop:1 }} className={r.cls}>{r.sub}</div>
              </div>
              <div style={{ fontSize:20, fontWeight:600 }} className={r.cls}>{r.val}</div>
            </TRow>
          ))}
        </Card>

        <Card>
          <CardTitle icon="star">AI upgrade pipeline</CardTitle>
          {[
            { name:'Chan W.',  detail:'$2.1M assets', eligible:true },
            { name:'James T.', detail:'$3.4M assets', eligible:true },
            { name:'Mei L.',   detail:'$1.8M assets', eligible:false },
            { name:'Raj K.',   detail:'$310K income', eligible:true },
          ].map((c,i,a) => (
            <TRow key={c.name} cols="1fr auto" last={i===a.length-1}>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{c.name}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{c.detail}</div>
              </div>
              <Badge variant={c.eligible?'orange':'amber'}>{c.eligible?'Eligible':'Check docs'}</Badge>
            </TRow>
          ))}
          <div style={{ marginTop:10, padding:'9px 11px', background:'var(--orange-lt)', borderRadius:6, fontSize:11, color:'var(--orange-dk)' }}>
            <strong>Pitch:</strong> AI clients get 2% margin vs 5% retail — 50:1 vs 20:1 leverage. Same capital, 2.5× the position size.
          </div>
        </Card>
      </div>

      <Card style={{ marginTop:10 }}>
        <CardTitle icon="message-circle">Today's talking points</CardTitle>
        {TALKING_POINTS.map((t, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', borderBottom: i < TALKING_POINTS.length-1 ? '0.5px solid var(--border)' : 'none' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--orange)', flexShrink:0, marginTop:5 }} />
            <div style={{ flex:1, fontSize:13, lineHeight:1.5 }}>{t.text}</div>
            <Badge variant="navy">{t.tag}</Badge>
          </div>
        ))}
      </Card>
    </div>
  )
}
