# 🚀 MFC Supabase + Next.js Setup Guide

## 📋 Overview

This is a complete Supabase-based version of your MFC website built with Next.js 15, featuring modern development practices, better performance, and enterprise-grade security.

## ✨ Features

### 🔐 **Authentication & Security**
- **Supabase Auth**: Built-in authentication with email/password
- **Row Level Security**: Database-level security policies
- **Admin Role Management**: Automatic role-based access control
- **Secure API**: All database operations secured with RLS

### 🏗️ **Modern Architecture**
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Tailwind CSS**: Modern utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

### ⚡ **Performance & Scalability**
- **Server-Side Rendering**: Better SEO and performance
- **Edge Functions**: Global serverless functions
- **CDN**: Automatic global content delivery
- **Database Optimization**: Indexed queries and optimized schemas

### 🎨 **UI/UX Features**
- **Responsive Design**: Works perfectly on all devices
- **Glassmorphism**: Modern glass-like design elements
- **Dark Theme**: Professional dark color scheme
- **Smooth Animations**: Framer Motion animations throughout

## 🛠️ Setup Instructions

### Step 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up/Login** with your account
3. **Create New Project**:
   - Project Name: `mfc-website`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. **Wait for setup** (2-3 minutes)

### Step 2: Configure Database

1. **Go to SQL Editor** in Supabase dashboard
2. **Run the schema**:
   - Copy the contents of `supabase/schema.sql`
   - Paste and run in SQL Editor
   - This creates all tables, policies, and sample data

### Step 3: Get Supabase Credentials

1. **Go to Settings → API**
2. **Copy these values**:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

### Step 4: Configure Environment

1. **Create `.env.local` file** in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 5: Install Dependencies

```bash
cd mfc-supabase
npm install
```

### Step 6: Run Development Server

```bash
npm run dev
```

Your website will be available at: http://localhost:3000

## 🔐 Admin Setup

### Create Admin User

1. **Go to Authentication → Users** in Supabase dashboard
2. **Add User**:
   - Email: `admin@yourdomain.com`
   - Password: `YourSecurePassword123`
   - Auto Confirm: Yes
3. **Go to Table Editor → profiles**
4. **Find your user** and change `role` from `user` to `admin`

### Access Admin Panel

1. **Go to**: http://localhost:3000/admin-login
2. **Login** with your admin credentials
3. **Access dashboard**: http://localhost:3000/admin

## 📊 Database Schema

### Tables Created

#### **profiles**
- `id`: User ID (references auth.users)
- `email`: User email
- `role`: 'admin' or 'user'
- `created_at`, `updated_at`: Timestamps

#### **standings**
- `id`: Team ID
- `club`: Team name
- `logo`: Team logo URL
- `played`, `won`, `draw`, `lost`: Match statistics
- `gf`, `ga`, `gd`: Goals for/against/difference
- `points`: League points
- `last5`: Array of last 5 results (W/D/L)

#### **matches**
- `id`: Match ID
- `home_team`, `away_team`: Team names
- `home_image`, `away_image`: Team image URLs
- `venue`: Match venue
- `date`: Match date/time
- `home_goals`, `away_goals`: Match scores
- `highlight`: Video highlight URL
- `is_finished`: Match status

### Security Policies

- **Public Read**: Anyone can view standings and matches
- **Admin Write**: Only admins can create/update/delete data
- **User Profiles**: Users can view/update their own profiles
- **Automatic Triggers**: Profile creation on user signup

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect GitHub**:
   - Push code to GitHub repository
   - Connect to Vercel
   - Deploy automatically

2. **Configure Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Deploy

3. **Update Supabase Settings**:
   - Add Vercel domain to allowed origins
   - Update site URL in Supabase

### Option 2: Netlify

1. **Connect GitHub** to Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Add environment variables**
4. **Deploy**

### Option 3: Self-Hosted

1. **Build the project**: `npm run build`
2. **Start production server**: `npm start`
3. **Configure reverse proxy** (Nginx/Apache)
4. **Setup SSL certificate**

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:reset     # Reset database (if using Supabase CLI)
npm run db:seed      # Seed database with sample data
```

## 📁 Project Structure

```
mfc-supabase/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   ├── admin-login/     # Admin login page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   └── ProtectedRoute.tsx
│   └── contexts/            # React contexts
│       └── AuthContext.tsx
├── lib/
│   └── supabase.ts          # Supabase client & types
├── supabase/
│   └── schema.sql           # Database schema
├── public/                  # Static assets
└── package.json
```

## 🎯 Key Improvements Over Original

### **Performance**
- **Next.js SSR**: Faster initial page loads
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting
- **Edge Functions**: Global serverless functions

### **Security**
- **Row Level Security**: Database-level security
- **Built-in Auth**: Supabase handles authentication
- **Type Safety**: Full TypeScript coverage
- **Environment Variables**: Secure configuration

### **Developer Experience**
- **Hot Reload**: Instant development feedback
- **TypeScript**: Better IDE support and error catching
- **Modern React**: Latest React features and patterns
- **Better Tooling**: ESLint, Prettier, and more

### **Scalability**
- **Serverless**: Automatic scaling
- **Global CDN**: Fast worldwide access
- **Database Optimization**: Indexed queries
- **Edge Computing**: Reduced latency

## 🔍 Testing

### Manual Testing Checklist

- [ ] **Homepage loads** with standings and matches
- [ ] **Admin login works** with correct credentials
- [ ] **Admin dashboard** shows statistics
- [ ] **Team management** (add/edit/delete teams)
- [ ] **Match management** (add/edit/delete matches)
- [ ] **Standings update** automatically after matches
- [ ] **Responsive design** works on all devices
- [ ] **Authentication** works correctly

### API Testing

```bash
# Test public endpoints
curl http://localhost:3000/api/standings
curl http://localhost:3000/api/matches

# Test admin endpoints (requires authentication)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/teams
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables**:
   - Check `.env.local` file exists
   - Verify all required variables are set
   - Restart development server after changes

2. **Database Connection**:
   - Verify Supabase URL and keys
   - Check if database schema is applied
   - Ensure RLS policies are correct

3. **Authentication Issues**:
   - Check if user exists in Supabase
   - Verify user role is set to 'admin'
   - Check browser console for errors

4. **Build Errors**:
   - Run `npm install` to ensure dependencies
   - Check TypeScript errors
   - Verify all imports are correct

## 📞 Support

### Getting Help

1. **Check Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
2. **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
3. **Check Console Logs**: Browser DevTools for errors
4. **Supabase Dashboard**: Check logs and metrics

### Debug Mode

Enable debug mode by adding to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## 🎉 Success!

Your modern MFC website is now ready with:

- ✅ **Modern Tech Stack**: Next.js 15 + Supabase + TypeScript
- ✅ **Enterprise Security**: Row Level Security + Built-in Auth
- ✅ **Better Performance**: SSR + CDN + Edge Functions
- ✅ **Scalable Architecture**: Serverless + Auto-scaling
- ✅ **Professional UI**: Glassmorphism + Responsive Design
- ✅ **Admin Panel**: Full team and match management
- ✅ **Real-time Data**: Live standings and match updates

**Your website is now production-ready and future-proof!** 🚀⚽
