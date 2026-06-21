'use client'
import { SecLabel, Card, CardTitle, KpiCard, Badge, THead, TRow, Grid, fmt, chgClass, chgSign } from './ui'

function CorrCell({ v }) {
  const abs = Math.abs(v)
  let bg, color
  if (v === 1)        { bg='#F1EFE8'; color='#888780' }
  else if (abs > 0.7) { bg = v>0?'rgba(240,90,40,0.20)':'rgba(29,158,117,0.20)'; color = v>0?'#993C1D':'#085041' }
  else if (abs > 0.4) { bg = v>0?'rgba(240,90,40,0.08)':'rgba(29,158,117,0.08)'; color = v>0?'#BA7517':'#0F6E56' }
  else                { bg='#fff'; color='#6B7A8D' }
  return <td style={{ background:bg, color, padding:'5px 4px', textAlign:'center', borderRadius:4, fontWeight:abs>0.6?600:400, fontSize:11 }}>{fmt(v,2)}</td>
}

export default function Insti({ data }) {
  const { volSurface=[], brentCurve=[], correlations={labels:[],matrix:[]}, stressTest=[], returns:retData=[] } = data

  const prices = brentCurve.map(d=>d.price).filter(Boolean)
  const minP = prices.length ? Math.min(...prices)-1 : 79
  const maxP = prices.length ? Math.max(...prices)+0.5 : 84
  const isBackward = prices.length > 1 && prices[0] > prices[prices.length-1]

  return (
    <div>
      <SecLabel>Portfolio overview</SecLabel>
      <Grid cols={4}>
        <KpiCard label="AUM covered"        value="$284M"  sub="↑ 12% MTD"       subClass="up" />
        <KpiCard label="Gross notional"     value="$1.1B"  sub="6 counterparties" />
        <KpiCard label="Margin utilisation" value="72%"    sub="Watch above 80%"  subClass="warn" />
        <KpiCard label="Spread revenue MTD" value="$138K"  sub="↑ 4% vs plan"     subClass="up" />
      </Grid>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 }}>
        <Card>
          <CardTitle icon="activity">Realised vol surface</CardTitle>
          <THead cols="85px 52px 52px 52px">
            <span>Pair</span><span>10d</span><span>30d</span><span>90d</span>
          </THead>
          {volSurface.map((r,i,a) => (
            <TRow key={r.pair} cols="85px 52px 52px 52px" last={i===a.length-1}>
              <span style={{ fontWeight:500 }}>{r.pair}</span>
              <span style={{ color:'var(--muted)' }}>{fmt(r.v10)}%</span>
              <span>{fmt(r.v30)}%</span>
              <span style={{ color:'var(--orange)', fontWeight:600 }}>{fmt(r.v90)}%</span>
            </TRow>
          ))}
          <div style={{ marginTop:8, fontSize:11, color:'var(--muted)', paddingTop:8, borderTop:'0.5px solid var(--border)' }}>
            Realised vol from daily returns · In production: Bloomberg OVDV
          </div>
        </Card>

        <Card>
          <CardTitle icon="chart-dots">Brent futures curve</CardTitle>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:80, marginBottom:6 }}>
            {brentCurve.map((d,i) => {
              const h = d.price ? Math.round(((d.price-minP)/(maxP-minP))*100) : 40
              const alpha = (1-i*0.13).toFixed(2)
              return <div key={d.month} style={{ flex:1, height:`${h}%`, background:`rgba(240,90,40,${alpha})`, borderRadius:'3px 3px 0 0' }} />
            })}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {brentCurve.map(d => (
              <div key={d.month} style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:10, color:'var(--muted)' }}>{d.month}</div>
                <div style={{ fontSize:10, fontWeight:600 }}>{d.price ? fmt(d.price,1) : '—'}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:10, display:'flex', gap:8, alignItems:'center' }}>
            <Badge variant={isBackward?'orange':'blue'}>{isBackward?'Backwardation':'Contango'}</Badge>
            <span style={{ fontSize:11, color:'var(--muted)' }}>
              {isBackward?'Spot premium — physical demand signal':'Forward premium — oversupply signal'}
            </span>
          </div>
          <div style={{ marginTop:8, fontSize:11, color:'var(--muted)', paddingTop:8, borderTop:'0.5px solid var(--border)' }}>
            Source: Yahoo Finance BZ=F series
          </div>
        </Card>
      </div>

      <SecLabel style={{ marginTop:14 }}>60-day correlation matrix</SecLabel>
      <Card>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:3, fontSize:11 }}>
            <thead>
              <tr>
                <td style={{ padding:'4px 6px', width:80 }} />
                {correlations.labels.map(l => (
                  <td key={l} style={{ padding:'4px 3px', textAlign:'center', color:'var(--muted)', fontWeight:600, fontSize:10 }}>{l}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlations.matrix.map((row,i) => (
                <tr key={i}>
                  <td style={{ padding:'4px 6px', fontWeight:600, fontSize:10, color:'var(--text)', whiteSpace:'nowrap' }}>{correlations.labels[i]}</td>
                  {row.map((v,j) => <CorrCell key={j} v={v} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:8, display:'flex', gap:14, fontSize:11, color:'var(--muted)', flexWrap:'wrap' }}>
          <span><span style={{ display:'inline-block', width:9, height:9, background:'rgba(240,90,40,0.25)', borderRadius:2, marginRight:4, verticalAlign:'middle' }} />Positive correlation</span>
          <span><span style={{ display:'inline-block', width:9, height:9, background:'rgba(29,158,117,0.25)', borderRadius:2, marginRight:4, verticalAlign:'middle' }} />Negative correlation</span>
          <span style={{ marginLeft:'auto' }}>60-day rolling · Yahoo Finance</span>
        </div>
      </Card>

      <SecLabel style={{ marginTop:14 }}>Margin stress test — EUR/USD −2% shock</SecLabel>
      <Card>
        <THead cols="120px 85px 1fr 100px">
          <span>Counterparty</span><span>Exposure</span><span>Margin impact</span><span>Status</span>
        </THead>
        {stressTest.map((r,i,a) => {
          const color = r.status==='risk'?'#E24B4A':r.status==='watch'?'#BA7517':'#1D9E75'
          const variant = r.status==='risk'?'red':r.status==='watch'?'amber':'green'
          const label = r.status==='risk'?'Breach risk':r.status==='watch'?'Monitor':'Safe'
          return (
            <TRow key={r.name} cols="120px 85px 1fr 100px" last={i===a.length-1}>
              <span style={{ fontWeight:500 }}>{r.name}</span>
              <span style={{ color:'var(--muted)' }}>{r.exposure}</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ flex:1, height:5, background:'#EEF0F3', borderRadius:3 }}>
                  <div style={{ width:`${r.impact}%`, height:5, borderRadius:3, background:color }} />
                </div>
                <span style={{ fontSize:11, color, minWidth:28 }}>{r.impact}%</span>
              </div>
              <Badge variant={variant}>{label}</Badge>
            </TRow>
          )
        })}
        <div style={{ marginTop:8, fontSize:11, color:'var(--muted)', paddingTop:8, borderTop:'0.5px solid var(--border)' }}>
          Simulated scenario · in production driven by live position data
        </div>
      </Card>

      <SecLabel style={{ marginTop:14 }}>Cross-asset returns</SecLabel>
      <Card>
        <THead cols="120px 70px 70px 70px">
          <span>Asset</span><span>1D</span><span>1W</span><span>1M</span>
        </THead>
        {retData.map((r,i,a) => (
          <TRow key={r.asset} cols="120px 70px 70px 70px" last={i===a.length-1}>
            <span style={{ fontWeight:500 }}>{r.asset}</span>
            <span className={chgClass(r.d1)}>{chgSign(r.d1)}</span>
            <span className={chgClass(r.w1)}>{chgSign(r.w1)}</span>
            <span className={chgClass(r.m1)}>{chgSign(r.m1)}</span>
          </TRow>
        ))}
        <div style={{ marginTop:8, fontSize:11, color:'var(--muted)', paddingTop:8, borderTop:'0.5px solid var(--border)' }}>
          Source: Yahoo Finance · as of data pull time
        </div>
      </Card>
    </div>
  )
}
