"use client";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [mobile, setMobile] = useState("");
  const [admin, setAdmin] = useState(false);
  const [notice, setNotice] = useState("");

  const join = () => {
    if (!/^09\d{9}$/.test(mobile)) {
      setNotice("لطفاً شماره موبایل معتبر وارد کنید.");
      return;
    }
    setNotice("درخواست عضویت ثبت شد.");
  };

  return (
    <main dir="rtl">
      <section className="card hero">
        <div className="logo">B.K</div>
        <h1>هلدینگ</h1>
        <div className="sub">Mine <span>·</span> باشگاه مشتریان</div>
        <p>برای عضویت در باشگاه مشتریان، شماره موبایل خود را وارد کنید.</p>
        <input value={mobile} onChange={e=>setMobile(e.target.value)} inputMode="numeric" placeholder="شماره موبایل" aria-label="شماره موبایل" />
        <button className="primary" onClick={join}>عضویت در باشگاه مشتریان</button>
        <button className="secondary" onClick={()=>setAdmin(!admin)}>ورود مدیر</button>
        {admin && <div className="adminBox"><b>پنل مدیر</b><span>ورود مدیر برای نسخه نمایشی فعال است.</span></div>}
        {notice && <div className="notice">{notice}</div>}
      </section>
      <section className="card note">
        <p>نسخه نمایشی: برای نگهداری محرمانه و واقعی اطلاعات مشتریان، اتصال این بخش به دیتابیس امن و احراز هویت سمت سرور لازم است. اطلاعات حساس را در LocalStorage یا داخل کد مرورگر نگهداری نکنید.</p>
      </section>
    </main>
  );
}
