/**
 * TechQuizAi Helper: pin.js
 * Usage: node pin.js <HASHED_OTP>
 * Purpose: Finds the raw 6-digit passcode matching a SHA-256 hash.
 */
const crypto = require('crypto');

const targetHash = process.argv[2];

if (!targetHash) {
    console.error('\n❌ Error: Missing hashed OTP value.');
    console.log('Usage: node pin.js <HASHED_OTP>\n');
    process.exit(1);
}

console.log(`\n🔍 Searching for 6-digit passcode matching hash: ${targetHash}...`);

let foundPin = null;

// Brute-force all possible 6-digit codes (100000 - 999999)
for (let i = 100000; i < 1000000; i++) {
    const pinStr = i.toString();
    const currentHash = crypto.createHash('sha256').update(pinStr).digest('hex');

    if (currentHash === targetHash) {
        foundPin = pinStr;
        break;
    }
}

if (foundPin) {
    console.log('\n=======================================');
    console.log(`✓ Passcode Found: ${foundPin}`);
    console.log('=======================================\n');
} else {
    console.log('\n❌ Passcode not found (the hash does not match a 6-digit number).\n');
}

