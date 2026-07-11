"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase
      .from("contact_messages")
      .insert([formData]);

    if (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    } else {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <div className="page-container fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Side: Direct Contact & Socials */}
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get in Touch</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
            Whether you have a question about our collections, need styling advice, or want to inquire about an order, we are always here to help you flourish.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Email Link */}
            <a href="mailto:hello@blossom.com" className="contact-link" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'white', textDecoration: 'none', transition: 'transform 0.3s' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <span style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>blossom.threads.npp@gmail.com</span>
            </a>

            {/* Phone Link */}
            <a href="tel:+9779800000000" className="contact-link" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'white', textDecoration: 'none', transition: 'transform 0.3s' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <span style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>+977 9765363678</span>
            </a>

            {/* Instagram Link */}
            <a href="https://www.instagram.com/blossom_threads.np?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="contact-link" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'white', textDecoration: 'none', transition: 'transform 0.3s' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <span style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>@blossom_threads.np</span>
            </a>

            {/* TikTok Link */}
            <a href="https://www.tiktok.com/@blossom_threads.np?_r=1&_t=ZS-97v8HhopNQ5" target="_blank" rel="noreferrer" className="contact-link" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'white', textDecoration: 'none', transition: 'transform 0.3s' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </div>
              <span style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>@blossom_threads.np</span>
            </a>

          </div>
        </div>

        {/* Right Side: The Secure Form */}
        <div className="contact-form-container" style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          {status === "success" ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', marginBottom: '1.5rem' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Message Received</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea required rows="5" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              
              {status === "error" && <p className="error-text" style={{ marginBottom: '1rem' }}>Failed to send message. Please try again.</p>}
              
              <button type="submit" className="btn-primary form-submit-btn" disabled={status === "loading"} style={{ width: '100%', marginTop: '1rem' }}>
                {status === "loading" ? "Transmitting..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}