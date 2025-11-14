# FlexIt Viral Waitlist 🚀

> Every Post = Coin. Every Creator = Asset.

A high-converting viral waitlist for FlexIt - the anti-rug SocialFi platform built on Solana.

---

## ✨ Features

### 🎯 Viral Mechanics
- ✅ Referral system (each referral = +3 positions)
- ✅ Live countdown timer (FOMO)
- ✅ Real-time slot counter
- ✅ Position tracking
- ✅ One-click social sharing

### 📧 Email Automation
- ✅ Automated welcome emails
- ✅ Beautiful HTML templates
- ✅ Referral links included
- ✅ Social share buttons

### 💎 Premium Design
- ✅ Clean green color palette
- ✅ Mobile responsive
- ✅ Professional branding

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run dev server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Setup

### 1. Database ✅
Run SQL in Supabase: `supabase-simple-setup.sql`

### 2. Environment Variables ✅
Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

Optional (for emails):
```env
RESEND_API_KEY=re_your_key
EMAIL_FROM=FlexIt <hello@yourdomain.com>
```

### 3. Verify Setup
```bash
pnpm run check
```

---

## 📖 Documentation

- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - Email configuration (5 min setup)
- **[EMAIL_FEATURE_SUMMARY.md](EMAIL_FEATURE_SUMMARY.md)** - Email features overview
- **[GENIUS_DEV_FIX.md](GENIUS_DEV_FIX.md)** - Smart dev server docs
- **[ROOT_CAUSE_FIX.md](ROOT_CAUSE_FIX.md)** - Database setup guide

---

## 🧪 Testing

```bash
# Check setup status
pnpm run check

# Run dev server
pnpm run dev

# Test signup at http://localhost:3000
```

---

## 🚀 Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## 🐛 Troubleshooting

- **"Service not configured"** → Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- **"Table not found"** → Run `supabase-simple-setup.sql` in Supabase
- **"Port in use"** → Use `pnpm run dev` (auto-handles conflicts)
- **"Email not received"** → Add `RESEND_API_KEY` to `.env.local`

See docs for detailed solutions.

---

## 🏆 Tech Stack

- Next.js 16 + App Router
- Supabase (PostgreSQL)
- Resend (Emails)
- Tailwind CSS v4
- TanStack Query

---

Built with 🚀 by a genius developer

**FlexIt** - Every Post = Coin. Every Creator = Asset.
