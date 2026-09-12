'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

const supabase = createClient()

export default function Home() {
  const [phone,setPhone]=useState('')
  const [user,setUser]=useState<any>(null)
  const [message,setMessage]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null))
    return ()=>subscription.unsubscribe()
  },[])

  // موقتاً احراز پیامکی غیرفعال است. برای نسخه نهایی باید OTP واقعی فعال شود.
  async function continueWithPhone(){
    setMessage('')
    if(!/^09\d{9}$/.test(phone)){setMessage('شماره موبایل ۱۱ رقمی معتبر وارد کنید.');return}
    setLoading(true)
    // فعلاً فقط رابط ورود را آماده می‌کنیم؛ احراز واقعی بعداً متصل می‌شود.
    setTimeout(()=>{
      setLoading(false)
      setMessage('ورود با کد پیامکی فعلاً غیرفعال است. این مرحله موقتاً بدون احراز کد انجام می‌شود.')
    },300)
  }

  async function logout(){await supabase.auth.signOut();setUser(null)}

  return <main className="card">
    <div className="logo">B.K</div><h1 className="title">هلدینگ</h1><div className="sub">Mine · باشگاه مشتریان</div>
    {!user ? <>
      <p className="text">فعلاً ورود با شماره موبایل بدون کد تأیید پیامکی.</p>
      <input className="input" inputMode="tel" maxLength={11} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="مثلاً 09123456789"/>
      <button className="gold" onClick={continueWithPhone} disabled={loading}>{loading?'در حال بررسی...':'ادامه'}</button>
      {message&&<div className="note">{message}</div>}
    </> : <>
      <h2 className="section-title">خوش آمدید 🌟</h2>
      <div className="box"><b>حساب کاربری</b><p className="small">شماره تأییدشده: {user.phone}</p></div>
      <div className="stats"><div className="stat">امتیاز<strong>0</strong></div><div className="stat">سطح<strong>عضو</strong></div></div>
      <button className="gold" onClick={logout}>خروج از حساب</button>
    </>}
  </main>
}