"use client";

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SlideshowAdmin() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  async function checkUserAndFetchData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push("/admin/login");

    const { data } = await supabase.from("hero_slides").select("*").order("created_at", { ascending: false });
    if (data) setSlides(data);
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image file first.");
    setLoading(true);

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
    
    if (uploadError) {
      alert(`Upload Failed: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

    const { error: dbError } = await supabase.from('hero_slides').insert({
      title: title,
      image_url: publicUrl,
      is_active: true
    }).select();

    if (dbError) alert(`Database Error: ${dbError.message}`);

    setTitle("");
    setImageFile(null);
    await checkUserAndFetchData();
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this slide?")) {
      setLoading(true);
      await supabase.from("hero_slides").delete().eq("id", id);
      await checkUserAndFetchData();
    }
  }

  if (loading && !slides.length) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="page-container fade-in" style={{ maxWidth: '1000px' }}>
      
      {/* Admin Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/dashboard" className="btn-light-pill" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>&larr; Back to Inventory</Link>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); }} className="btn-light-pill" style={{ background: 'transparent', color: 'white', border: '1px solid white', marginLeft: 'auto' }}>Log Out</button>
      </div>

      <h1>Manage Slideshow</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Upload high-quality images to feature on the homepage.</p>

      <div className="admin-card" style={{ marginBottom: '3rem' }}>
        <h2>Upload New Banner</h2>
        <form onSubmit={handleSave} className="contact-form" style={{ marginTop: '1.5rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Banner Title (Shows on the glass pill)</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Collection" />
            </div>
            <div className="form-group" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image File</label>
              <input type="file" required accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ border: 'none', padding: '0' }} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Publish to Homepage"}
          </button>
        </form>
      </div>

      <h2>Active Slides</h2>
      <div className="product-grid" style={{ marginTop: '1.5rem' }}>
        {slides.map(slide => (
          <div key={slide.id} className="admin-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img src={slide.image_url} alt={slide.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{slide.title}</strong>
              <button onClick={() => handleDelete(slide.id)} className="action-btn danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}