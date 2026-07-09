# Samago Sain — E-commerce Starter

Next.js (App Router) + Supabase starter for samagosain.com.np.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   from Supabase Dashboard → Project Settings → API.

3. **Database**
   Run `supabase/schema.sql` in the Supabase SQL Editor (creates tables +
   RLS policies + one sample product).

4. **Storage**
   Create a public bucket named `product-images` in Supabase → Storage.

5. **Run locally**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Adding products

For now, add products directly via the Supabase Table Editor:
1. Add a row to `products` (slug must be URL-safe, e.g. `blue-silk-saree`)
2. Upload image(s) to the `product-images` storage bucket
3. Copy the public URL of each uploaded image (click the file → "Get URL")
4. Add a row to `product_images` with that `image_url`, linked via `product_id`,
   with `is_primary = true` for the main thumbnail

(A proper admin panel to do this from the UI is a good next step once the
storefront itself is solid.)

## Deploy

1. Push this repo to GitHub
2. Import into Vercel (vercel.com → New Project → import from GitHub)
3. Add the same environment variables in Vercel → Project Settings → Environment Variables
4. Add domain `samagosain.com.np` in Vercel → Project Settings → Domains
5. Point DNS in ClouDNS:
   - A record @ → 76.76.21.21
   - CNAME www → cname.vercel-dns.com

## Project structure

```
app/
  layout.js          - global layout, header/footer
  page.js             - homepage (product grid)
  product/[slug]/     - product detail page
  contact/            - general contact form
components/
  ProductCard.js
  InquiryForm.js
lib/
  supabaseClient.js   - Supabase client init
supabase/
  schema.sql          - database schema + RLS policies
```

## Next steps to build out

- [ ] Category filter/navigation
- [ ] Search
- [ ] Multiple images per product (gallery/carousel)
- [ ] Admin panel (protected by Supabase Auth) for adding products without
      touching the Supabase dashboard directly
- [ ] esewa/khalti payment integration when ready
- [ ] Email notification on new inquiry (Supabase Edge Function + Resend, or
      a Vercel serverless function)
