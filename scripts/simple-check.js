#!/usr/bin/env node

require('dotenv').config();

console.log('🔍 SIMPLE CONNECTION CHECK\n');

// Check all environment variables
const vars = {
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY,
    'DATABASE_URL': process.env.DATABASE_URL,
    'JWT_SECRET': process.env.JWT_SECRET
};

console.log('📋 Environment Variables:');
for (const [key, value] of Object.entries(vars)) {
    if (!value) {
        console.log(`❌ ${key}: Missing`);
    } else if (value.includes('your_') || value.includes('[password]')) {
        console.log(`⚠️  ${key}: Placeholder`);
    } else {
        console.log(`✅ ${key}: Set`);
    }
}

console.log('\n🔄 Consistency Check:');
if (vars.SUPABASE_URL === vars.VITE_SUPABASE_URL) {
    console.log('✅ Supabase URLs match');
} else {
    console.log('❌ Supabase URLs differ');
}

if (vars.SUPABASE_ANON_KEY === vars.VITE_SUPABASE_ANON_KEY) {
    console.log('✅ Anon keys match');
} else {
    console.log('❌ Anon keys differ');
}

console.log('\n🌐 URL Analysis:');
if (vars.SUPABASE_URL) {
    const projectId = vars.SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    console.log(`   Project ID: ${projectId || 'Could not extract'}`);
}

if (vars.DATABASE_URL) {
    console.log(`   Database URL: ${vars.DATABASE_URL.substring(0, 50)}...`);
    if (vars.DATABASE_URL.includes('supabase.co')) {
        console.log('   ✅ Points to Supabase');
    } else {
        console.log('   ⚠️  Does not point to Supabase');
    }
}