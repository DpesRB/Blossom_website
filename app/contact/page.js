/*"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
    <div className="page-container">
      <h1>Contact Us</h1>
      <p style={{ color: "#666", margin: "0.5rem 0 1.5rem" }}>
        Have a question? Send us a message and we'll get back to you.
      </p>

      {status === "success" ? (
        <p style={{ color: "#2a7a3f", fontWeight: 500 }}>
          Message sent! We'll be in touch soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}*/


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
    <div className="page-container fade-in">
      <div className="contact-layout">
        
        {/* Left Column: Brand Text & Details */}
        <div className="contact-text">
          <h1>Get in Touch</h1>
          <p>
            Whether you are looking for the perfect bridal wear, need help with sizing, 
            or have a question about an existing order, we are here to assist you.
          </p>
          
          <div className="contact-details">
            <div className="detail-item">
              <strong>Email</strong>
              <span>samagosain@gmail.com</span>
            </div>
            <div className="detail-item">
              <strong>Phone</strong>
              <span>+977 9765363678</span>
            </div>
            <div className="detail-item">
              <strong>Hours</strong>
              <span>24/7</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="contact-form-container">
          {status === "success" ? (
            <div className="success-state fade-in">
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. We will be in touch with you shortly.</p>
              <button onClick={() => setStatus("idle")} className="btn-secondary">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Jane Doe" />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+977 ..." />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address (Optional)</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required placeholder="How can we help you?" />
              </div>
              
              {status === "error" && (
                <p className="error-message">Something went wrong. Please try again.</p>
              )}
              
              <button type="submit" className="btn-primary form-submit-btn" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
        
      </div>
    </div>
  );
}
