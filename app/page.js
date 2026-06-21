'use client'
import { useState, useEffect } from 'react'
import Retail from './components/Retail'
import Insti from './components/Insti'

export default function Page() {
  const [tab, setTab]         = useState('retail')
  const [data, setData]       = useState(null)
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy:#0D1B2A; --navy2:#1A2E45; --navy3:#243B55;
          --orange:#F05A28; --orange-lt:#FEF0EB; --orange-dk:#993C1D;
          --bg:#F4F6F9; --white:#fff; --text:#0D1B2A;
          --muted:#6B7A8D; --border:#DDE2EA;
          --up:#1D9E75; --dn:#E24B4A; --warn:#BA7517;
        }
        .up{color:var(--up)} .dn{color:var(--dn)} .warn{color:var(--warn)}
        .tab-btn {
          padding:11px 24px; font-size:13px; font-weight:500;
          color:rgba(255,255,255,0.45); cursor:pointer;
          border:none; background:transparent;
          border-bottom:2px solid transparent; margin-bottom:-2px;
          transition:color 0.15s; font-family:inherit;
        }
        .tab-btn:hover{color:rgba(255,255,255,0.75)}
        .tab-btn.active{color:#fff; border-bottom-color:var(--orange)}
      `}</style>

      <div style={{ background:'var(--navy)', padding:'14px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, background:'var(--orange)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className="ti ti-chart-line" style={{ color:'#fff', fontSize:18 }} />
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:'#fff' }}>CMC Markets</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>Account Manager Dashboard</div>
          </div>
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', gap:6 }}>
          <i className="ti ti-clock" style={{ fontSize:13 }} />
          {data ? `Live · ${data.pulledAt}` : 'Loading...'}
        </div>
      </div>

      <div style={{ background:'var(--navy2)', display:'flex', padding:'0 28px', borderBottom:'2px solid var(--navy3)' }}>
        <button className={`tab-btn${tab==='retail'?' active':''}`} onClick={()=>setTab('retail')}>
          <i className="ti ti-users" style={{ marginRight:6 }} />Retail clients
        </button>
        <button className={`tab-btn${tab==='insti'?' active':''}`} onClick={()=>setTab('insti')}>
          <i className="ti ti-building-bank" style={{ marginRight:6 }} />Institutional
        </button>
      </div>

      <div style={{ padding:'20px 28px', maxWidth:1200 }}>
        {loading && (
          <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
            <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTop:'3px solid var(--orange)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            <div style={{ color:'var(--muted)', fontSize:13 }}>Pulling live market data...</div>
          </div>
        )}
        {error && (
          <div style={{ margin:'40px auto', maxWidth:500, padding:'20px 24px', background:'var(--white)', border:'0.5px solid var(--border)', borderRadius:10, textAlign:'center' }}>
            <i className="ti ti-alert-circle" style={{ fontSize:32, color:'var(--dn)', display:'block', marginBottom:12 }} />
            <div style={{ fontWeight:600, marginBottom:6 }}>Could not load market data</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{error}</div>
          </div>
        )}
        {data && tab==='retail' && <Retail data={data} />}
        {data && tab==='insti'  && <Insti  data={data} />}
      </div>
    </div>
  )
}
