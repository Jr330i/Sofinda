#!/usr/bin/env node

// Generate a secure JWT secret

const crypto = require('crypto');

function generateJWTSecret() {
    console.log('🔐 Generating secure JWT secret...\n');
    
    // Generate a 64-character random string
    const secret = crypto.randomBytes(32).toString('hex');
    
    console.log('✅ Generated JWT Secret:');
    console.log(`JWT_SECRET=${secret}`);
    console.log(`\n📏 Length: ${secret.length} characters`);
    console.log('🔒 Security: Cryptographically secure random');
    
    console.log('\n📝 Usage:');
    console.log('1. Copy the JWT_SECRET line above');
    console.log('2. Replace the JWT_SECRET in your .env file');
    console.log('3. Restart your application');
    
    console.log('\n⚠️  Important:');
    console.log('- Keep this secret secure and private');
    console.log('- Never commit it to version control');
    console.log('- Use different secrets for dev/staging/production');
}

generateJWTSecret();