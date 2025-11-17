#!/usr/bin/env node

// Get Supabase JWT Secret from Dashboard

require('dotenv').config();

function getSupabaseJWTInfo() {
    console.log('🔍 SUPABASE JWT SECRET INFORMATION\n');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const projectId = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    
    console.log('📋 To get your Supabase JWT Secret:');
    console.log('1. Go to your Supabase Dashboard');
    console.log(`2. URL: https://supabase.com/dashboard/project/${projectId}`);
    console.log('3. Navigate to: Settings → API');
    console.log('4. Look for "JWT Secret" section');
    console.log('5. Copy the JWT Secret value');
    
    console.log('\n🔄 Two Authentication Options:');
    console.log('\n📱 Option A: Use Supabase Auth (Recommended)');
    console.log('   - Use Supabase\'s built-in authentication');
    console.log('   - JWT_SECRET = Supabase\'s JWT Secret');
    console.log('   - Handles user registration, login, sessions');
    console.log('   - Less code to write');
    
    console.log('\n🔧 Option B: Custom Authentication');
    console.log('   - Build your own auth system');
    console.log('   - JWT_SECRET = Your own generated secret');
    console.log('   - More control but more work');
    
    console.log('\n💡 Current Setup Analysis:');
    const currentSecret = process.env.JWT_SECRET;
    if (currentSecret && currentSecret.length > 30 && !currentSecret.includes('your-')) {
        console.log('   ✅ You have a custom JWT secret set');
        console.log('   📝 This suggests you\'re using custom authentication');
    } else {
        console.log('   ⚠️  No proper JWT secret detected');
    }
    
    console.log('\n🎯 Recommendation:');
    console.log('   For this Property Management System, use Supabase Auth');
    console.log('   Replace your JWT_SECRET with Supabase\'s JWT Secret');
}

getSupabaseJWTInfo();