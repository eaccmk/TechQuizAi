const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Netlify Identity compatible JWT signing secret
const jwtSecret = process.env.JWT_SECRET || 'secret';

/**
 * Netlify Function: verify-otp
 * Obfuscation Scheme: Base64
 * Purpose: Validates base64 encoded payload containing email and otp against cached values in Supabase.
 *          On success: updates user login metadata, logs verification audit, purges code, and returns Identity JWT.
 */
exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { payload } = JSON.parse(event.body || '{}');
        if (!payload) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing payload' })
            };
        }

        // De-obfuscate payload (Format: base64(email:otp))
        const rawDecoded = Buffer.from(payload, 'base64').toString('utf8');
        const separatorIdx = rawDecoded.lastIndexOf(':');
        
        if (separatorIdx === -1) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid payload structure' })
            };
        }

        const email = rawDecoded.substring(0, separatorIdx).trim();
        const otpString = rawDecoded.substring(separatorIdx + 1).trim();

        if (!email || !otpString || otpString.length !== 6) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid credentials payload' })
            };
        }

        // Hash the incoming OTP to compare
        const hashedInput = crypto.createHash('sha256').update(otpString).digest('hex');

        // Step 1: Look up temporary OTP token in Supabase
        const { data: cachedOtp, error: selectError } = await supabase
            .from('otps')
            .select('*')
            .eq('email', email)
            .single();

        if (selectError || !cachedOtp) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Passcode not found or expired' })
            };
        }

        // Verify if OTP matches
        if (cachedOtp.hashed_otp !== hashedInput) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Incorrect verification passcode' })
            };
        }

        // Verify if expired
        const now = new Date();
        const expiresAt = new Date(cachedOtp.expires_at);
        if (now > expiresAt) {
            // Delete expired entry
            await supabase.from('otps').delete().eq('email', email);
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Passcode expired' })
            };
        }

        // Step 2: Fetch and update the users profile status/last_login_at
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'User record not found' })
            };
        }

        // Update last_login_at and set status to REPEAT now that verified
        const { error: updateError } = await supabase
            .from('users')
            .update({ last_login_at: now.toISOString(), status: 'REPEAT' })
            .eq('email', email);

        if (updateError) {
            console.error('Error updating user login stamp:', updateError);
        }

        // Step 3: Record Audit Log
        const userAgent = event.headers['user-agent'] || 'Unknown';
        const clientIp = event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || '127.0.0.1';
        
        await supabase
            .from('audit_logs')
            .insert({
                email,
                action: 'OTP_VERIFIED',
                session_metadata: { ip: clientIp, userAgent }
            });

        // Step 4: Flush/Purge the used OTP token
        await supabase.from('otps').delete().eq('email', email);

        // Step 5: Issue a Netlify Identity compatible JWT
        // Netlify GoTrue JWT payload contains 'sub' (user uuid) and optional metadata
        const userUuid = user.id;
        const jwtPayload = {
            sub: userUuid,
            email: email,
            app_metadata: {
                provider: 'email',
                roles: ['user']
            },
            user_metadata: {
                full_name: email.split('@')[0], // Default username from email prefix
                status: 'REPEAT'
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // Valid for 24 hours
            iss: 'https://techquizai.netlify.app'
        };

        const token = jwt.sign(jwtPayload, jwtSecret, { algorithm: 'HS256' });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                token,
                user: {
                    id: userUuid,
                    email: email,
                    status: 'REPEAT',
                    last_login_at: now.toISOString()
                }
            })
        };

    } catch (err) {
        console.error('Exception in verify-otp:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
