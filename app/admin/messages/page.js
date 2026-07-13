"use client";

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push("/admin-login");

    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  }

  async function markAsRead(id) {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  }

  async function deleteMessage(id) {
    if (window.confirm("Permanently delete this message?")) {
      await supabase.from("contact_messages").delete().eq("id", id);
      fetchMessages();
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Inbox...</div>;

  return (
    <div className="page-container fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/dashboard" className="btn-light-pill" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>&larr; Back to Inventory</Link>
      </div>

      <h1>Customer Inbox</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Read and manage inquiries from your website.</p>

      {messages.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Your inbox is empty!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} className="admin-card" style={{ borderLeft: msg.is_read ? 'none' : '4px solid #4CAF50', opacity: msg.is_read ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{msg.subject}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>From: {msg.name} ({msg.email})</p>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(msg.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className="action-btn" style={{ borderColor: '#4CAF50', color: '#4CAF50' }}>Mark as Read</button>
                )}
                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="action-btn">Reply via Email</a>
                <button onClick={() => deleteMessage(msg.id)} className="action-btn danger" style={{ marginLeft: 'auto' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}