#!/usr/bin/env node

// Comprehensive Connection Audit Script

const fs = require('fs');
const path = require('path');
require('dotenv').config();

function auditConnections() {
    console.log('🔍 COMPREHENSIVE CONNECTION AUDIT\n');
    console.log('=' .repeat(60));

    // 1. Environment Variables Audit
    console.log('\n📋 1. ENVIRONMENT VARIABLES (.env file)');
    console.log('-'.repeat(40));
    
    const envVars = {
        'SUPABASE_URL': process.env.SUPABASE_URL,
        'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
        'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
        'VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY,
        'DATABASE_URL': process.env.DATABASE_URL,
        'JWT_SECRET': process.env.JWT_SECRET
    };

    for (const [key, value] of Object.entries(envVars)) {
        if (!value) {
            console.log(`❌ ${key}: Missing`);
        } else if (value.includes('your_') || value.includes('[password]')) {
            console.log(`⚠️  ${key}: Contains placeholder`);
        } else {
            console.log(`✅ ${key}: Set (${value.length} chars)`);
        }
    }

    // 2. Consistency Check
    console.log('\n🔄 2. CONSISTENCY CHECK');
    console.log('-'.repeat(40));
    
    const supabaseUrl1 = process.env.SUPABASE_URL;
    const supabaseUrl2 = process.env.VITE_SUPABASE_URL;
    const anonKey1 = process.env.SUPABASE_ANON_KEY;
    const anonKey2 = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl1 === supabaseUrl2) {
        console.log('✅ Supabase URLs match between backend and frontend');
    } else {
        console.log('❌ Supabase URLs DO NOT match:');
        console.log(`   Backend:  ${supabaseUrl1}`);
        console.log(`   Frontend: ${supabaseUrl2}`);
    }

    if (anonKey1 === anonKey2) {
        console.log('✅ Anon keys match between backend and frontend');
    } else {
        console.log('❌ Anon keys DO NOT match');
    }

    // 3. URL Format Validation
    console.log('\n🌐 3. URL FORMAT VALIDATION');
    console.log('-'.repeat(40));
    
    if (supabaseUrl1) {
        if (supabaseUrl1.startsWith('https://') && supabaseUrl1.includes('.supabase.co')) {
            console.log('✅ Supabase URL format is correct');
            
            // Extract project ID
            const projectId = supabaseUrl1.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
            console.log(`   Project ID: ${projectId}`);
        } else {
            console.log('❌ Supabase URL format is incorrect');
        }
    }

    // 4. Database URL Analysis
    console.log('\n🗄️  4. DATABASE URL ANALYSIS');
    console.log('-'.repeat(40));
    
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        if (dbUrl.startsWith('postgresql://')) {
            console.log('✅ Database URL uses correct protocol');
            
            // Parse components
            try {
                const url = new URL(dbUrl);
                console.log(`   Host: ${url.hostname}`);
                console.log(`   Port: ${url.port}`);
                console.log(`   Database: ${url.pathname.substring(1)}`);
                console.log(`   Username: ${url.username}`);
                console.log(`   Password: ${url.password ? '***' + url.password.slice(-4) : 'Not set'}`);
                
                if (url.hostname.includes('supabase.co')) {
                    console.log('✅ Database URL points to Supabase');
                } else {
                    console.log('⚠️  Database URL does not point to Supabase');
                }
            } catch (error) {
                console.log('❌ Database URL format is invalid');
            }
        } else {
            console.log('❌ Database URL does not use postgresql:// protocol');
        }
    }

    // 5. Configuration Files Check
    console.log('\n📁 5. CONFIGURATION FILES CHECK');
    console.log('-'.repeat(40));
    
    const configFiles = [
        'backend/src/config/supabase.ts',
        'frontend/src/config/supabase.ts',
        'docker-compose.yml',
        'docker-compose.dev.yml',
        'docker-compose.supabase.yml'
    ];

    configFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}: Exists`);
        } else {
            console.log(`❌ ${file}: Missing`);
        }
    });

    // 6. Docker Compose Environment Variables
    console.log('\n🐳 6. DOCKER COMPOSE VARIABLES');
    console.log('-'.repeat(40));
    
    try {
        const dockerCompose = fs.readFileSync('docker-compose.yml', 'utf8');
        const envVarsInDocker = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY', 
            'SUPABASE_SERVICE_ROLE_KEY',
            'DATABASE_URL',
            'JWT_SECRET'
        ];

        envVarsInDocker.forEach(varName => {
            if (dockerCompose.includes(`\${${varName}}`)) {
                console.log(`✅ ${varName}: Referenced in docker-compose.yml`);
            } else {
                console.log(`⚠️  ${varName}: Not found in docker-compose.yml`);
            }
        });
    } catch (error) {
        console.log('❌ Could not read docker-compose.yml');
    }

    // 7. Project ID Consistency
    console.log('\n🆔 7. PROJECT ID CONSISTENCY');
    console.log('-'.repeat(40));
    
    if (supabaseUrl1 && dbUrl) {
        const urlProjectId = supabaseUrl1.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
        const dbProjectId = dbUrl.match(/@db\.([^.]+)\.supabase\.co/)?.[1];
        
        if (urlProjectId && dbProjectId) {
            if (urlProjectId === dbProjectId) {
                console.log(`✅ Project IDs match: ${urlProjectId}`);
            } else {
                console.log('❌ Project IDs DO NOT match:');
                console.log(`   URL Project ID: ${urlProjectId}`);
                console.log(`   DB Project ID:  ${dbProjectId}`);
            }
        } else {
            console.log('⚠️  Could not extract project IDs for comparison');
        }
    }

    // 8. Summary and Recommendations
    console.log('\n📊 8. SUMMARY & RECOMMENDATIONS');
    console.log('-'.repeat(40));
    
    const issues = [];
    
    if (!process.env.SUPABASE_URL) issues.push('Missing SUPABASE_URL');
    if (!process.env.DATABASE_URL) issues.push('Missing DATABASE_URL');
    if (supabaseUrl1 !== supabaseUrl2) issues.push('Inconsistent Supabase URLs');
    if (anonKey1 !== anonKey2) issues.push('Inconsistent anon keys');
    
    if (issues.length === 0) {
        console.log('🎉 All connection entities appear to be consistent!');
        console.log('\n📝 Next steps:');
        console.log('1. Test database connection: node scripts/test-database-connection.js');
        console.log('2. Create tables: cd backend && npx prisma db push');
        console.log('3. Start application: ./scripts/docker-setup.sh');
    } else {
        console.log('⚠️  Issues found:');
        issues.forEach(issue => console.log(`   - ${issue}`));
        console.log('\n🔧 Fix these issues before proceeding');
    }

    console.log('\n' + '='.repeat(60));
}

auditConnections();