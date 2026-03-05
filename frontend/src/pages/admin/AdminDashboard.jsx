import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/apiServices'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, ClipboardList, Award, BookOpen, Flag, TrendingUp } from 'lucide-react'

function Stat({ label, value, sub, color = 'text-ink' }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs text-ink-muted font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? '–'}</p>
      {sub && <p className="text-xs text-ink-muted mt-1">{sub}</p>}
    </div>
  )
}

function pct(n, d) {
  if (!d || d === '0') return '0%'
  return `${Math.round((parseInt(n) / parseInt(d)) * 100)}%`
}

export default function AdminDashboard() {
  useEffect(() => { document.title = 'Admin Dashboard | ISO-Audit360' }, [])
  const [kpis, setKpis]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    adminApi.getKpis()
      .then(r => setKpis(r.data))
      .catch(() => setError('Failed to load KPIs.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-10 text-ink-muted animate-pulse">Loading…</div>
  if (error)   return <div className="p-10 text-red-600">{error}</div>

  const u = kpis.users
  const s = kpis.sessions
  const c = kpis.certs
  const q = kpis.questions
  const f = kpis.flags

  const chartData = (kpis.chart || []).map(row => ({
    day:   row.day?.slice(5),   // MM-DD
    count: parseInt(row.count),
  }))

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-ink mb-1">Dashboard</h1>
      <p className="text-sm text-ink-muted mb-8">Platform overview — live data</p>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Users"  value={u.total}    sub={`${u.today} joined today`} />
        <Stat label="Verified"     value={pct(u.verified, u.total)} sub={`${u.verified} of ${u.total}`} />
        <Stat label="Blocked"      value={u.blocked}  color={parseInt(u.blocked) > 0 ? 'text-red-600' : 'text-ink'} />
        <Stat label="Active Exams" value={s.active}   color={parseInt(s.active) > 0 ? 'text-gold-dark' : 'text-ink'} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat
          label="Associate Pass Rate"
          value={pct(s.assoc_passed, s.assoc_total)}
          sub={`Avg score ${s.assoc_avg_score ?? '–'} / 50`}
        />
        <Stat
          label="Professional Pass Rate"
          value={pct(s.prof_passed, s.prof_total)}
          sub={`Avg score ${s.prof_avg_score ?? '–'} / 100`}
        />
        <Stat label="Certs Issued"  value={c.active}  sub={`${c.total} total`} />
        <Stat
          label="Suspicious Sessions"
          value={s.suspicious}
          color={parseInt(s.suspicious) > 0 ? 'text-red-600' : 'text-ink'}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <Stat label="Question Bank"  value={q.active} sub={`${q.total} total questions`} />
        <Stat label="Open Flags"     value={f.open}   color={parseInt(f.open) > 0 ? 'text-red-600' : 'text-ink'} />
        <Stat label="Completed Exams" value={s.completed} />
      </div>

      {/* 30-day chart */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <TrendingUp size={15} className="text-gold" />
          Exam Attempts — Last 30 Days
        </h2>
        {chartData.length === 0 ? (
          <p className="text-sm text-ink-muted text-center py-8">No exam data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, border: '1px solid #E5E5E3', borderRadius: 6 }}
                cursor={{ fill: '#FBF4E3' }}
              />
              <Bar dataKey="count" fill="#C9A84C" radius={[3, 3, 0, 0]} name="Exams" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
