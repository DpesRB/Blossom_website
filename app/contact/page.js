"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const { error } = await supabase.from("inquiries").insert({
      product_id: null,
      customer_name: form.name,
      phone: form.phone,
      email: form.email || null,
      message: form.message,
    });

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  }

  return (
    <div className="contact-layout fade-in">
      
      {/* Left Column: Text & Socials */}
      <div className="contact-text">
        <h1>Let's Connect</h1>
        <p>
          Whether you are looking for the perfect bridal wear, need help with sizing, 
          or have a question about an existing order, our team is here to assist you.
        </p>
        
        <div className="contact-details">
          <div className="detail-item">
            <strong>Email</strong>
            <span style={{ color: "var(--text-secondary)" }}>samagosain@gmail.com</span>
          </div>
          <div className="detail-item">
            <strong>Phone</strong>
            <span style={{ color: "var(--text-secondary)" }}>+977 9765363678</span>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="social-links">
          {/* Add your actual Instagram link in the href */}
          <a href="https://www.instagram.com/blossom.np_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="social-pill">
            Instagram ↗
          </a>
          {/* Add your actual TikTok link in the href */}
          <a href="https://www.tiktok.com/@blossom_threads.np?_r=1&_t=ZS-97v8HhopNQ5" target="_blank" rel="noreferrer" className="social-pill">
            TikTok ↗
          </a>
        </div>
      </div>

      {/* Right Column: Dark Form */}
      <div className="contact-form-container">
        {status === "success" ? (
          <div className="success-state fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h3 style={{ color: '#4caf50', fontSize: '1.5rem', marginBottom: '1rem' }}>Message Sent!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We will be in touch with you shortly.</p>
            <button onClick={() => setStatus("idle")} className="btn-primary">
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Falano Dhiskano" />
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+977 ..." />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required placeholder="How can we help you?" />
            </div>
            
            {status === "error" && (
              <p style={{ color: '#ff5252', marginTop: '1rem' }}>Something went wrong. Please try again.</p>
            )}
            
            <button type="submit" className="btn-primary form-submit-btn" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
      
    </div>
  );
}