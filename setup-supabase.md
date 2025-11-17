# Supabase Setup Guide

## Step 1: Copy Environment Template
```bash
cp .env.docker .env
```

## Step 2: Edit .env File
Replace the placeholder values with your actual Supabase credentials:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key

# Frontend Supabase Configuration (same as above)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key

# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres

# JWT Configuration (generate a secure secret)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
```

## Step 3: Create Database Tables
The application will automatically create the necessary tables using Prisma migrations.

## Step 4: Enable Row Level Security (Optional but Recommended)
In your Supabase dashboard:
1. Go to Authentication → Settings
2. Enable Row Level Security for better security
3. Set up authentication policies as needed

## Step 5: Configure Storage (For File Uploads)
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "property-documents"
3. Set appropriate policies for file access