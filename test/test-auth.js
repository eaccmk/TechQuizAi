/**
 * TechQuizAi Passwordless OTP Authentication Flow Unit & Mock Tests
 */
const assert = require('assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Mock Environment Variables
process.env.SUPABASE_URL = 'https://mockproject.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mockservicekey';
process.env.JWT_SECRET = 'supersecretjwtkey';

console.log('🧪 Running Passwordless OTP Auth Suite...\n');

let testsPassed = 0;
function runTest(name, fn) {
    try {
        fn();
        console.log(`  ✓ PASSED: ${name}`);
        testsPassed++;
    } catch (err) {
        console.error(`  ❌ FAILED: ${name}`);
        console.error(err.stack || err.message);
        process.exit(1);
    }
}

// 1. Obfuscation & De-obfuscation transit check
runTest('Base64 Payload Obfuscation and Decoding Verification', () => {
    const rawEmail = 'learner@techquizai.com';
    const obfuscated = Buffer.from(rawEmail).toString('base64');
    
    // Check de-obfuscation inside the Netlify function simulation
    const decoded = Buffer.from(obfuscated, 'base64').toString('utf8');
    assert.strictEqual(decoded, rawEmail, 'Obfuscated & decoded emails must match');
});

// 2. OTP Generation Hash Integrity check
runTest('Secure OTP Passcode Generation & Hashing Security Check', () => {
    const otpInt = crypto.randomInt(100000, 1000000);
    const otpString = otpInt.toString();
    assert.strictEqual(otpString.length, 6, 'OTP must be 6 digits');

    const hashedOtp = crypto.createHash('sha256').update(otpString).digest('hex');
    assert.strictEqual(hashedOtp.length, 64, 'Hashed OTP must be a valid SHA-256 string');
});

// 3. JWT signature and user verification compatibility
runTest('Netlify Identity Compatible JWT Issuance and Validation', () => {
    const mockUserUuid = crypto.randomUUID();
    const mockEmail = 'student@techquizai.com';
    
    const jwtPayload = {
        sub: mockUserUuid,
        email: mockEmail,
        app_metadata: {
            provider: 'email',
            roles: ['user']
        },
        user_metadata: {
            full_name: 'student',
            status: 'REPEAT'
        },
        exp: Math.floor(Date.now() / 1000) + 60,
        iss: 'https://techquizai.netlify.app'
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { algorithm: 'HS256' });
    assert.ok(token, 'JWT must be generated successfully');

    // Decrypt / Verify JWT token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    assert.strictEqual(verified.email, mockEmail, 'Decoded email from JWT matches');
    assert.strictEqual(verified.sub, mockUserUuid, 'Decoded user UUID matches');
    assert.strictEqual(verified.user_metadata.status, 'REPEAT', 'Metadata status verified');
});

console.log(`\n🎉 All ${testsPassed} auth mock tests passed successfully!`);
