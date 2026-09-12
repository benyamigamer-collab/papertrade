'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

export default function AdminPage() {
  const supabase = createClient()
  const [members, setMembers] = useState<any[]>([])
  const [status, setStatus] = useState('در حال بررسی دسترسی...')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setStatus('ابتدا با شماره موبایل وارد شوید.'); setLoading(false); return }
    const response = await fetch('/api/admin/members', { headers: { Authorization: `Bearer ${session.access_token}` } })
    const body = await response.json()
    if (!response.ok) { setStatus(body.error || 'دسترسی غیرمجاز'); setLoading(false); return }
    setMembers(body.members || [])
    setStatus('پنل مدیریت فعال است.')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return <main className="card">
    <div className="logo">B.K</div>
    <h1 className="title">پنل مدیریت</h1>
    <div className="sub">مدیریت باشگاه مشتریان</div>
    <div className="note">{status}</div>
    {!loading && members.length > 0 && <>
      <div className="stats"><div className="stat">اعضا<strong>{members.length}</strong></div><div className="stat">وضعیت<strong>فعال</strong></div></div>
      <div className="box">{members.map(member => <div key={member.id} style={{padding:'10px 0',borderBottom:'1px solid #292929'}}><b>{member.phone || 'بدون شماره'}</b><div className="small">نقش: {member.role} · امتیاز: {member.points}</div></div>)}</div>
    </>}
    {!loading && members.length === 0 && <div className="box">هنوز عضوی ثبت نشده است.</div>}
    <button className="outline" onClick={load} disabled={loading}>بروزرسانی</button>
  </main>
}
