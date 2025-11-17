#!/usr/bin/env node

// Basic Supabase Connection Test (no table queries)

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testBasicConnection() {
    console.log('🧪 Testing basic Supabase connection...\n');

    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('📋 Environment Variables Check:');
    console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}\n`);

    if (!supabaseUrl || !supabaseAnonKey) {
        console.log('❌ Missing required Supabase credentials in .env file');
        process.exit(1);
    }

    try {
        // Test basic connection without querying tables
        console.log('🔑 Testing Anon Key connection...');
        const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
        
        // Just test if we can create the client and get auth info
        const { data: authData } = await supabaseAnon.auth.getSession();
        console.log('   ✅ Anon key client created successfully');

        // Test service role key if available
        if (supabaseServiceKey) {
            console.log('🔐 Testing Service Role Key connection...');
            const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
            
            // Test service role client
            const { data: serviceAuthData } = await supabaseService.auth.getSession();
            console.log('   ✅ Service role key client created successfully');
        }

        console.log('\n🎉 Basic connection test passed!');
        console.log('\n📝 Next steps:');
        console.log('1. Create database tables: ./scripts/setup-supabase-db.sh');
        console.log('2. Start your application: ./scripts/docker-setup.sh');

    } catch (error) {
        console.log(`❌ Connection test failed: ${error.message}`);
        console.log('\n🔍 Troubleshooting:');
        console.log('1. Check your Supabase project is active');
        console.log('2. Verify your credentials in .env file');
        console.log('3. Ensure your Supabase project URL is correct');
        process.exit(1);
    }
}

testBasicConnection();