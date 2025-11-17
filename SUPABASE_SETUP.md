# 🚀 Complete Supabase Setup Guide

Follow these steps to connect your Property Management System to your Supabase project.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Docker and Docker Compose installed
- Node.js (if running without Docker)

## 🏗️ Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization
4. Fill in project details:
   - **Name**: Property Management System
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait for project provisioning (2-3 minutes)

## 🔑 Step 2: Get Your Credentials

### From Supabase Dashboard:

1. **Go to Settings → API**
   - Copy **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - Copy **anon public** key
   - Copy **service_role** key (click "Reveal" first)

2. **Go to Settings → Database**
   - Scroll to **Connection string**
   - Select **URI** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

## ⚙️ Step 3: Configure Environment

1. **Copy the environment template:**
   ```bash
   cp .env.docker .env
   ```

2. **Edit the .env file with your credentials:**
   ```bash
   # Replace these with your actual Supabase values
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Frontend configuration (same values as above)
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Database connection
   DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
   
   # Generate a secure JWT secret (at least 32 characters)
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   ```

## 🧪 Step 4: Test Connection

Test your Supabase connection:

```bash
cd backend
npm install
node ../scripts/test-supabase-connection.js
```

You should see:
```
✅ Environment Variables Check
✅ Anon key connection successful
✅ Service role key connection successful
```

## ✅ Step 5: Validate Setup

Validate your configuration:

```bash
./scripts/validate-setup.sh
```

This will check:
- Environment variables are set correctly
- No placeholder values remain
- Docker is available
- Configuration is valid

## 🗄️ Step 6: Setup Database Schema

Create the database tables in Supabase:

```bash
./scripts/setup-supabase-db.sh
```

This will:
- Generate Prisma client
- Push database schema to Supabase
- Create all necessary tables

## 🚀 Step 7: Start the Application

### Option A: Full Docker Setup
```bash
./scripts/docker-setup.sh
```

### Option B: Development Mode
```bash
./scripts/docker-dev.sh
```

### Option C: Manual Start
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## 🔒 Step 8: Configure Security (Recommended)

### Enable Row Level Security:

1. **Go to Authentication → Settings**
   - Enable "Enable email confirmations"
   - Configure email templates if needed

2. **Go to Database → Tables**
   - For each table (properties, units, property_documents):
     - Click the table name
     - Go to "RLS" tab
     - Enable "Row Level Security"

3. **Create RLS Policies** (example for properties table):
   ```sql
   -- Allow authenticated users to read properties they manage
   CREATE POLICY "Users can view their properties" ON properties
   FOR SELECT USING (auth.uid()::text = manager_id);
   
   -- Allow authenticated users to insert properties
   CREATE POLICY "Users can create properties" ON properties
   FOR INSERT WITH CHECK (auth.uid()::text = manager_id);
   ```

### Setup Storage for File Uploads:

1. **Go to Storage**
2. **Create new bucket:**
   - Name: `property-documents`
   - Public: `false` (for security)
3. **Create storage policies:**
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Users can upload files" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'property-documents' AND auth.role() = 'authenticated');
   
   -- Allow users to view their uploaded files
   CREATE POLICY "Users can view their files" ON storage.objects
   FOR SELECT USING (bucket_id = 'property-documents' AND auth.role() = 'authenticated');
   ```

## 🎯 Step 9: Verify Everything Works

1. **Check the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

2. **Verify database tables in Supabase:**
   - Go to Database → Tables
   - You should see: `properties`, `units`, `property_documents`

3. **Test API endpoints:**
   ```bash
   curl http://localhost:5000/health
   ```

## 🔧 Troubleshooting

### Common Issues:

1. **"Missing Supabase configuration" error:**
   - Double-check your .env file has all required variables
   - Ensure no extra spaces or quotes around values

2. **Database connection failed:**
   - Verify your DATABASE_URL is correct
   - Check your database password
   - Ensure your Supabase project is active

3. **CORS errors:**
   - Add your domain to Supabase → Authentication → Settings → Site URL

4. **Permission denied errors:**
   - Check Row Level Security policies
   - Verify user authentication

### Getting Help:

- Check Supabase logs: Dashboard → Logs
- Check application logs: `docker-compose logs -f`
- Verify environment: `node scripts/test-supabase-connection.js`

## 🎉 You're All Set!

Your Property Management System is now connected to Supabase with:
- ✅ Database tables created
- ✅ Authentication ready
- ✅ File storage configured
- ✅ Security policies in place
- ✅ Application running

Start building your property management features! 🏠