"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type View = "home" | "club" | "market" | "chat" | "profile" | "admin";
type Listing = { title: string; seller: string; price: string };

const initialListings: Listing[] = [
  { title: "خرید و فروش خدمات دیجیتال", seller: "BK User 01", price: "قابل مذاکره" },
  { title: "تبادل کالا و خدمات", seller: "BK User 02", price: "پرداخت با USDT" },
  { title: "پیشنهاد همکاری تجاری", seller: "BK User 03", price: "توافقی" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [mobile, setMobile] = useState("");
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<View>("home");
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>(["سلام، درباره این آگهی سوال داشتم.", "سلام، در خدمتم."]);

  useEffect(() => {
    const saved = localStorage.getItem("bk-mine-listings");
    if (saved) setListings(JSON.parse(saved));
  }, []);

  function join() {
    if (!/^09\d{9}$/.test(mobile)) return setNotice("لطفاً شماره موبایل معتبر وارد کنید.");
    setNotice("شماره ثبت شد. برای ادامه، ورود با Google را انجام دهید.");
  }

  function addListing() {
    if (!session?.user || !newTitle.trim()) return setNotice("ابتدا با Google وارد شوید و عنوان آگهی را وارد کنید.");
    const next = [...listings, { title: newTitle.trim(), seller: session.user.name || "BK User", price: "توافقی / USDT" }];
    setListings(next);
    localStorage.setItem("bk-mine-listings", JSON.stringify(next));
    setNewTitle("");
    setNotice("آگهی نمایشی با موفقیت ثبت شد.");
  }

  function sendMessage() {
    if (!session?.user || !message.trim()) return setNotice("برای ارسال پیام، ابتدا با Google وارد شوید.");
    setMessages([...messages, message.trim()]);
    setMessage("");
  }

  const adminConfigured = Boolean(process.env.NEXT_PUBLIC_ADMIN_EMAIL);

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")}>B.K <span>Mine</span></button>
        <nav>
          <button onClick={() => setView("home")}>خانه</button>
          <button onClick={() => setView("club")}>باشگاه</button>
          <button onClick={() => setView("market")}>بازار</button>
          <button onClick={() => setView("chat")}>گفتگو</button>
          {session && <button onClick={() => setView("profile")}>حساب من</button>}
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
          <button className="google" onClick={() => signIn("google", { callbackUrl: "/" })}>G&nbsp;&nbsp; ورود امن با Google</button>
          <button className="secondary" onClick={() => setView("admin")}>ورود مدیر</button>
          {status === "loading" && <div className="notice">در حال بررسی نشست...</div>}
          {notice && <div className="notice">{notice}</div>}
        </section>
        <section className="card note"><p>نسخه فعلی امن و نمایشی است: موجودی و پول واقعی وجود ندارد. معاملات واقعی، پرداخت و برداشت تا زمان تکمیل زیرساخت سمت سرور فعال نمی‌شوند.</p></section>
      </>}

      {view === "club" && <section className="card page"><h2>باشگاه مشتریان</h2><p>عضویت و اطلاعیه‌های B.K Mine.</p><div className="stat"><b>وضعیت</b><span>{session ? "عضو واردشده" : "مهمان"}</span></div>{session ? <div className="profileMini"><b>{session.user?.name || "کاربر B.K"}</b><small>{session.user?.email || ""}</small></div> : <button className="google" onClick={() => signIn("google")}>ورود با Google</button>}<button className="secondary" onClick={() => setView("home")}>بازگشت</button></section>}

      {view === "market" && <section className="card page"><h2>بازار B.K</h2><p>آگهی‌های معاملاتی کاربران. پرداخت واقعی در این نسخه فعال نیست.</p><div className="create"><input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="عنوان آگهی جدید" /><button onClick={addListing}>ثبت آگهی</button></div>{listings.map((x, i) => <article className="listing" key={i}><div><b>{x.title}</b><small>{x.seller}</small></div><strong>{x.price}</strong><button onClick={() => setView("chat")}>گفتگو</button></article>)}{notice && <div className="notice">{notice}</div>}</section>}

      {view === "chat" && <section className="card page"><h2>گفتگوی کاربران</h2><p>پیام‌رسانی نمایشی خریدار و فروشنده.</p><div className="messages">{messages.map((m, i) => <div className={i % 2 ? "mine" : ""} key={i}>{m}</div>)}</div><div className="composer"><input value={message} onChange={e => setMessage(e.target.value)} placeholder="پیام خود را بنویسید..." onKeyDown={e => e.key === "Enter" && sendMessage()} /><button onClick={sendMessage}>ارسال</button></div>{notice && <div className="notice">{notice}</div>}</section>}

      {view === "profile" && <section className="card page"><h2>حساب من</h2>{session ? <><div className="profileMini"><b>{session.user?.name || "کاربر B.K"}</b><small>{session.user?.email || ""}</small></div><div className="stat"><b>احراز هویت</b><span>Google</span></div><button className="secondary" onClick={() => signOut({ callbackUrl: "/" })}>خروج از حساب</button></> : <button className="google" onClick={() => signIn("google")}>ورود با Google</button>}</section>}

      {view === "admin" && <section className="card page"><h2>پنل مدیر</h2><p>کنترل اولیه کاربران و آگهی‌ها.</p><div className="adminGrid"><div><b>کاربران</b><span>{session ? 1 : 0}</span></div><div><b>آگهی‌ها</b><span>{listings.length}</span></div><div><b>گزارش‌ها</b><span>0</span></div></div><div className="stat"><b>وضعیت اتصال مدیر</b><span>{adminConfigured ? "پیکربندی شده" : "نیازمند ADMIN_EMAIL در محیط"}</span></div><button className="secondary" onClick={() => setView("home")}>بازگشت</button></section>}
    </main>
  );
}
