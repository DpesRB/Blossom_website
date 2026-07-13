"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // NEW: State for categories
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  
  // NEW: Added category_id, sizes, and colors to the form state
  const [formData, setFormData] = useState({
    name: "", slug: "", price: "", discount_price: "", stock: "", 
    description: "", is_active: true, is_featured: false,
    category_id: "", sizes: "", colors: "" 
  });

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  async function checkUserAndFetchData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin-login");
      return;
    }
    setSession(session);

    // NEW: Fetch both products and categories at the same time
    const [prodResponse, catResponse] = await Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name", { ascending: true })
    ]);

    if (prodResponse.data) setProducts(prodResponse.data);
    if (catResponse.data) setCategories(catResponse.data);
    
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin-login");
  }

 

  function handleEdit(product) {
    setEditingId(product.id);
    setImageFile(null); 
    
    // Convert arrays back to comma-separated strings for the text boxes
    const sizesString = product.sizes ? product.sizes.join(", ") : "";
    const colorsString = product.colors ? product.colors.join(", ") : "";

    setFormData({
      name: product.name, slug: product.slug, price: product.price, 
      discount_price: product.discount_price || "", stock: product.stock, 
      description: product.description, is_active: product.is_active, is_featured: product.is_featured,
      category_id: product.category_id || "", 
      sizes: sizesString, 
      colors: colorsString
    });
  }

  function resetForm() {
    setEditingId(null);
    setImageFile(null);
    setFormData({ 
      name: "", slug: "", price: "", discount_price: "", stock: "", 
      description: "", is_active: true, is_featured: false,
      category_id: "", sizes: "", colors: ""
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    // Format comma-separated text into clean arrays for the database
    const formattedSizes = formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : [];
    const formattedColors = formData.colors ? formData.colors.split(",").map(c => c.trim()).filter(Boolean) : [];

    const payload = {
      name: formData.name,
      slug: formData.slug.toLowerCase().replace(/ /g, '-'), 
      price: Number(formData.price),
      discount_price: formData.discount_price ? Number(formData.discount_price) : null,
      stock: Number(formData.stock),
      description: formData.description,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      category_id: formData.category_id || null, // null if left empty
      sizes: formattedSizes,
      colors: formattedColors
    };

    let dbError = null;
    let savedData = null;

    if (editingId) {
      const { data, error } = await supabase.from("products").update(payload).eq("id", editingId).select();
      dbError = error;
      savedData = data;
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select();
      dbError = error;
      savedData = data;
    }

    if (dbError || !savedData || savedData.length === 0) {
      alert(dbError ? `Database Error: ${dbError.message}` : "Action Blocked! Session expired.");
      setLoading(false);
      return;
    }

    const productId = savedData[0].id;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);

      if (uploadError) {
        alert(`Storage Upload Failed: ${uploadError.message}`);
        setLoading(false);
        return;
      } else {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

        // --- STRICT FIX: Wipe old images and STOP if it fails ---
        if (editingId) {
          const { error: deleteError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId);
            
          if (deleteError) {
            alert(`Database Error: Could not clear old images. ${deleteError.message}`);
            setLoading(false);
            return; // ⛔ Stops the code so it never duplicates
          }
        }
        // ---------------------------------------------------------

        const { error: linkError } = await supabase.from('product_images').insert({
          product_id: productId, image_url: publicUrl, is_primary: true
        });
        
        if (linkError) {
          alert(`Image link failed: ${linkError.message}`);
        }
      }
    }
    
    await checkUserAndFetchData(); 
    resetForm();
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) alert(`Failed to delete: ${error.message}`);
      await checkUserAndFetchData();
    }
  }

  if (loading && !products.length) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Secure Dashboard...</div>;
  if (!session) return null;

  return (
    <div className="page-container fade-in" style={{ maxWidth: '1400px' }}>
      
      {/* --- REPLACE YOUR HEADER SECTION WITH THIS --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Inventory Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Here is the new button! */}
          <a href="/admin/slideshow" className="btn-light-pill" style={{ background: 'white', color: 'black' }}>
            Manage Slideshow
          </a>
          <a href="/admin/messages" className="btn-light-pill" style={{ background: 'white', color: 'black' }}>
  Inbox
</a>
          <button onClick={handleLogout} className="btn-light-pill" style={{ background: 'transparent', color: 'white', border: '1px solid white' }}>
            Log Out
          </button>
        </div>
      </div>
      {/* ------------------------------------------- */}

      

      <div className="dashboard-grid">
        {/* Left Side: Product Table */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2>All Products</h2>
            <button onClick={resetForm} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>+ New Product</button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.name}
                      {/* Show category underneath the name if it exists */}
                      {p.categories?.name && <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.categories.name}</span>}
                    </td>
                    <td>Rs. {p.price}</td>
                    <td><span className={p.stock <= 0 ? 'error-text' : 'success-text'}>{p.stock}</span></td>
                    <td>{p.is_active ? "🟢 Active" : "🔴 Hidden"}</td>
                    <td>
                      <button onClick={() => handleEdit(p)} className="action-btn">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="action-btn danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Add/Edit Form */}
        <div className="admin-card">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSave} className="contact-form" style={{ marginTop: '1.5rem' }}>
            
            <div className="form-group" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Image (Optional)</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => setImageFile(e.target.files[0])} style={{ border: 'none', padding: '0' }} />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category_id} 
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)', borderRadius: '12px', padding: '1rem', width: '100%' }}
                >
                  <option value="" style={{ color: 'black' }}>Select a Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} style={{ color: 'black' }}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Regular Price (Rs.)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Discount Price (Optional)</label>
                <input type="number" value={formData.discount_price} onChange={e => setFormData({...formData, discount_price: e.target.value})} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Stock Quantity</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="form-group">
                <label>URL Slug (e.g., red-saree)</label>
                <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
            </div>

            {/* NEW: Sizes and Colors */}
            <div className="form-grid">
              <div className="form-group">
                <label>Sizes (Comma separated)</label>
                <input value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} placeholder="S, M, L, XL" />
              </div>
              <div className="form-group">
                <label>Colors (Comma separated)</label>
                <input value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} placeholder="Red, Mint Green, Gold" />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                Active (Visible)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                Featured (Gold Badge)
              </label>
            </div>

            <button type="submit" className="btn-primary form-submit-btn" disabled={loading}>
              {loading ? "Saving & Uploading..." : (editingId ? "Update Product" : "Create Product")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}