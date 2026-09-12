"use client";
import { useState } from "react";

const listings = [
  { title: "خرید و فروش خدمات دیجیتال", seller: "BK User 01", price: "قابل مذاکره" },
  { title: "تبادل کالا و خدمات", seller: "BK User 02", price: "پرداخت با USDT" },
  { title: "پیشنهاد همکاری تجاری", seller: "BK User 03", price: "توافقی" },
];

export default function Home() {
  const [mobile, setMobile] = useState("");
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<"home" | "club" | "market" | "chat" | "admin">("home");

  function join() {
    if (!/^09\d{9}$/.test(mobile)) return setNotice("لطفاً شماره موبایل معتبر وارد کنید.");
    setNotice("درخواست عضویت ثبت شد. در نسخه نهایی، احراز هویت امن سمت سرور انجام می‌شود.");
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand">B.K <span>Mine</span></div>
        <nav>
          <button onClick={() => setView("home")}>خانه</button>
          <button onClick={() => setView("club")}>باشگاه مشتریان</button>
          <button onClick={() => setView("market")}>بازار</button>
          <button onClick={() => setView("chat")}>گفتگو</button>
          <button onClick={() => setView("admin")}>مدیر</button>
        </nav>
      </header>

      {view === "home" && <>
        <section className="card hero">
          <div className="logo">B.K</div>
          <h1>هلدینگ</h1>
          <div className="sub">Mine <span>·</span> باشگاه مشتریان</div>
          <p>برای عضویت در باشگاه مشتریان، شماره موبایل خود را وارد کنید.</p>
          <input value={mobile} onChange={e => setMobile(e.target.value)} inputMode="numeric" placeholder="شماره موبایل" />
          <button className="primary" onClick={join}>عضویت در باشگاه مشتریان</button>
          <button className="secondary" onClick={() => setView("admin")}>ورود مدیر</button>
          {notice && <div className="notice">{notice}</div>}
        </section>
        <section className="card note"><p>نسخه نمایشی B.K Mine است. موجودی و پول واقعی در این نسخه وجود ندارد؛ تراکنش‌های نهایی باید فقط پس از پیاده‌سازی احراز هویت و زیرساخت امن سمت سرور فعال شوند.</p></section>
      </>}

      {view === "club" && <section className="card page"><h2>باشگاه مشتریان</h2><p>عضویت، مشاهده وضعیت حساب و دریافت اطلاعیه‌ها.</p><div className="stat"><b>وضعیت عضویت</b><span>نمایشی — فعال نشده</span></div><button className="primary" onClick={() => setView("home")}>بازگشت</button></section>}

      {view === "market" && <section className="card page"><h2>بازار B.K</h2><p>آگهی‌های معاملاتی کاربران. پرداخت در نسخه نهایی فقط با USDT خواهد بود.</p>{listings.map((x, i) => <article className="listing" key={i}><div><b>{x.title}</b><small>{x.seller}</small></div><strong>{x.price}</strong><button onClick={() => setView("chat")}>گفتگو</button></article>)}</section>}

      {view === "chat" && <section className="card page"><h2>گفتگوی کاربران</h2><p>پیام‌رسانی بین خریدار و فروشنده در نسخه نمایشی.</p><div className="messages"><div>سلام، درباره این آگهی سوال داشتم.</div><div className="mine">سلام، در خدمتم.</div></div><div className="composer"><input placeholder="پیام خود را بنویسید..." /><button onClick={() => setNotice("پیام نمایشی ارسال شد.")}>ارسال</button></div>{notice && <div className="notice">{notice}</div>}</section>}

      {view === "admin" && <section className="card page"><h2>پنل مدیر</h2><p>مدیریت کاربران، آگهی‌ها و گزارش‌ها.</p><div className="adminGrid"><div><b>کاربران</b><span>0</span></div><div><b>آگهی‌ها</b><span>{listings.length}</span></div><div><b>گزارش‌ها</b><span>0</span></div></div><button className="secondary" onClick={() => setView("home")}>خروج از پنل</button></section>}
    </main>
  );
}
