#!/usr/bin/env node

// Test Prisma connection to Supabase

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testPrismaConnection() {
    console.log('🔍 Testing Prisma connection to Supabase...\n');

    const prisma = new PrismaClient();

    try {
        // Test connection by counting properties
        console.log('📊 Testing database queries...');
        
        const propertyCount = await prisma.property.count();
        console.log(`✅ Properties table: ${propertyCount} records found`);
        
        const unitCount = await prisma.unit.count();
        console.log(`✅ Units table: ${unitCount} records found`);
        
        const documentCount = await prisma.propertyDocument.count();
        console.log(`✅ Property documents table: ${documentCount} records found`);
        
        // Test a simple query
        const properties = await prisma.property.findMany({
            take: 2,
            include: {
                units: true
            }
        });
        
        console.log('\n📋 Sample data:');
        properties.forEach(property => {
            console.log(`   - ${property.name} (${property.units.length} units)`);
        });
        
        console.log('\n🎉 Prisma connection test successful!');
        console.log('✅ All tables are accessible');
        console.log('✅ Queries are working');
        console.log('✅ Relationships are functioning');
        
    } catch (error) {
        console.log(`❌ Prisma connection failed: ${error.message}`);
        console.log('\n🔍 This might be normal if using Supabase Auth instead of direct DB access');
    } finally {
        await prisma.$disconnect();
    }
}

testPrismaConnection();