#!/usr/bin/env node

// Test Database Connection Script

require('dotenv').config();

async function testDatabaseConnection() {
    console.log('🗄️  Testing database connection...\n');

    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        console.log('❌ DATABASE_URL not found in .env file');
        process.exit(1);
    }

    console.log('📋 Database URL Check:');
    console.log(`   DATABASE_URL: ${databaseUrl ? '✅ Set' : '❌ Missing'}`);
    
    // Check if it looks like a Supabase URL
    if (databaseUrl.includes('supabase.co')) {
        console.log('   🔗 Detected Supabase database');
    } else {
        console.log('   🗄️  Detected local/other database');
    }

    try {
        // Try to connect using a simple query
        const { Client } = require('pg');
        const client = new Client({
            connectionString: databaseUrl,
            ssl: databaseUrl.includes('supabase.co') ? { rejectUnauthorized: false } : false
        });

        console.log('\n🔌 Attempting to connect...');
        await client.connect();
        
        console.log('✅ Database connection successful!');
        
        // Test a simple query
        const result = await client.query('SELECT version()');
        console.log('✅ Database query test passed');
        console.log(`   PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
        
        await client.end();
        
        console.log('\n🎉 Database connection test completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Create database tables: npx prisma db push (from backend directory)');
        console.log('2. Or run: ./scripts/setup-supabase-db.sh');

    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        console.log('\n🔍 Common issues:');
        console.log('1. Wrong password in DATABASE_URL');
        console.log('2. Special characters in password need URL encoding');
        console.log('3. Database not accessible from your IP');
        console.log('4. Incorrect host or port in connection string');
        process.exit(1);
    }
}

testDatabaseConnection();