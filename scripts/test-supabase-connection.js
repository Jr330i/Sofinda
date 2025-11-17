#!/usr/bin/env node

// Supabase Connection Test Script

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase connection...\n');

    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    console.log('📋 Environment Variables Check:');
    console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   DATABASE_URL: ${databaseUrl ? '✅ Set' : '❌ Missing'}\n`);

    if (!supabaseUrl || !supabaseAnonKey) {
        console.log('❌ Missing required Supabase credentials in .env file');
        process.exit(1);
    }

    try {
        // Test anon key connection
        console.log('🔑 Testing Anon Key connection...');
        const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
        
        const { error: anonError } = await supabaseAnon
            .from('properties')
            .select('count', { count: 'exact', head: true });

        if (anonError && anonError.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
            console.log(`   ⚠️  Anon connection issue: ${anonError.message}`);
        } else {
            console.log('   ✅ Anon key connection successful');
        }

        // Test service role key connection if available
        if (supabaseServiceKey) {
            console.log('🔐 Testing Service Role Key connection...');
            const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
            
            const { error: serviceError } = await supabaseService
                .from('properties')
                .select('count', { count: 'exact', head: true });

            if (serviceError && serviceError.code !== 'PGRST116') {
                console.log(`   ⚠️  Service role connection issue: ${serviceError.message}`);
            } else {
                console.log('   ✅ Service role key connection successful');
            }
        }

        // Test database connection
        if (databaseUrl) {
            console.log('🗄️  Database URL format check...');
            if (databaseUrl.includes('supabase.co')) {
                console.log('   ✅ Database URL appears to be a Supabase URL');
            } else {
                console.log('   ⚠️  Database URL doesn\'t appear to be a Supabase URL');
            }
        }

        console.log('\n🎉 Connection test completed!');
        console.log('\n📝 Next steps:');
        console.log('1. Run: ./scripts/setup-supabase-db.sh');
        console.log('2. Start your application: ./scripts/docker-setup.sh');

    } catch (error) {
        console.log(`❌ Connection test failed: ${error.message}`);
        process.exit(1);
    }
}

testSupabaseConnection();