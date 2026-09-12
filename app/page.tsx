'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

const supabase = createClient()

export default function Home() {
  const [phone,setPhone]=useState('')
  const [otp,setOtp]=useState('')
  const [sent,setSent]=useState(false)
  const [user,setUser]=useState<any>(null)
  const [message,setMessage]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user))
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null))
    return ()=>subscription.unsubscribe()
  },[])

  async function sendOtp(){
    setMessage(''); if(!/^09\d{9}$/.test(phone)){setMessage('شماره موبایل ۱۱ رقمی معتبر وارد کنید.');return}
    setLoading(true)
    const normalized='+98'+phone.slice(1)
    const {error}=await supabase.auth.signInWithOtp({phone:normalized})
    setLoading(false); if(error){setMessage(error.message);return}
    setSent(true);setMessage('کد تأیید پیامکی ارسال شد.')
  }

  async function verifyOtp(){
    setLoading(true);setMessage('')
    const {error}=await supabase.auth.verifyOtp({phone:'+98'+phone.slice(1),token:otp,type:'sms'})
    setLoading(false); if(error){setMessage(error.message);return}
    setMessage('ورود با موفقیت انجام شد.')
  }

  async function logout(){await supabase.auth.signOut();setUser(null);setSent(false);setOtp('')}

  return <main className="card">
    <div className="logo">B.K</div><h1 className="title">هلدینگ</h1><div className="sub">Mine · باشگاه مشتریان</div>
    {!user ? <>
      <p className="text">ورود و عضویت فقط با شماره موبایل و کد تأیید پیامکی.</p>
      <input className="input" inputMode="tel" maxLength={11} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="مثلاً 09123456789" disabled={sent}/>
      {!sent ? <button className="gold" onClick={sendOtp} disabled={loading}>{loading?'در حال ارسال...':'ارسال کد تأیید'}</button> : <>
        <input className="input" inputMode="numeric" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} placeholder="کد پیامکی"/>
        <button className="gold" onClick={verifyOtp} disabled={loading}>{loading?'در حال بررسی...':'تأیید و ورود'}</button>
        <button className="outline" onClick={()=>{setSent(false);setOtp('')}}>تغییر شماره</button>
      </>}
      {message&&<div className="note">{message}</div>}
    </> : <>
      <h2 className="section-title">خوش آمدید 🌟</h2>
      <div className="box"><b>حساب کاربری</b><p className="small">شماره تأییدشده: {user.phone}</p></div>
      <div className="stats"><div className="stat">امتیاز<strong>0</strong></div><div className="stat">سطح<strong>عضو</strong></div></div>
      <button className="gold" onClick={logout}>خروج از حساب</button>
      <div className="note">حساب شما با احراز هویت واقعی Supabase مدیریت می‌شود. بخش‌های دیتابیس و مدیریت در مرحله بعد به همین حساب متصل می‌شوند.</div>
    </>}
  </main>
}