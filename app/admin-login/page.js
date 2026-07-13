"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // If successful, redirect to the dashboard
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="contact-layout fade-in" style={{ display: 'flex', justifyContent: 'center', minHeight: '70vh', alignItems: 'center' }}>
      <div className="contact-form-container" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to manage inventory</p>
        </div>

        <form onSubmit={handleLogin} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" type="email" required 
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" type="password" required 
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          {error && <p style={{ color: '#ff5252', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          
          <button type="submit" className="btn-primary form-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}