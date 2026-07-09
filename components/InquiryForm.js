"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InquiryForm({ productId, productName }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const { error } = await supabase.from("inquiries").insert({
      product_id: productId,
      customer_name: form.name,
      phone: form.phone,
      email: form.email || null,
      message: form.message || `Interested in ${productName}`,
    });

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  }

  if (status === "success") {
    return (
      <p style={{ color: "#2a7a3f", fontWeight: 500 }}>
        Thanks! We received your inquiry and will contact you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: "0.75rem" }}>Interested in this piece?</h3>
      <div className="form-group">
        <label htmlFor="name">Your Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email (optional)</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message (optional)</label>
        <textarea id="message" name="message" rows={3} value={form.message} onChange={handleChange} />
      </div>
      <button type="submit" className="btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
      {status === "error" && (
        <p style={{ color: "#b8395c", marginTop: "0.5rem" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
