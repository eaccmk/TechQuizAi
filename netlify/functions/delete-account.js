const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Netlify Identity compatible JWT signing secret
const jwtSecret = process.env.JWT_SECRET || 'secret';

/**
 * Netlify Function: delete-account
 * Obfuscation Scheme: Base64
 * Purpose: Decrypts payload, verifies the user's active session token, hard-deletes the user's
 *          profile from the users table, and records the ACCOUNT_DELETED_REQUEST audit log.
 */
exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        // Authenticate the request via JWT token
        const authHeader = event.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized: Missing token' })
            };
        }

        const token = authHeader.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, jwtSecret);
        } catch (err) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized: Invalid token' })
            };
        }

        const authenticatedEmail = decodedToken.email;
        if (!authenticatedEmail) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid token metadata' })
            };
        }

        const { payload } = JSON.parse(event.body || '{}');
        if (!payload) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing payload' })
            };
        }

        // De-obfuscate payload email
        const targetEmail = Buffer.from(payload, 'base64').toString('utf8').trim();
        if (targetEmail !== authenticatedEmail) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Forbidden: Cannot delete another account' })
            };
        }

        // Step 1: Record Audit Log BEFORE deletion (with immutable log object retention for 30 days)
        const userAgent = event.headers['user-agent'] || 'Unknown';
        const clientIp = event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || '127.0.0.1';
        
        const { error: auditError } = await supabase
            .from('audit_logs')
            .insert({
                email: targetEmail,
                action: 'ACCOUNT_DELETED_REQUEST',
                session_metadata: { ip: clientIp, userAgent }
            });

        if (auditError) {
            console.error('Audit logging failed for account deletion:', auditError);
        }

        // Step 2: Hard delete from users table
        const { error: deleteUserError } = await supabase
            .from('users')
            .delete()
            .eq('email', targetEmail);

        if (deleteUserError) {
            console.error('Failed to hard delete user record:', deleteUserError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to complete account deletion' })
            };
        }

        // Step 3: Flush temporary active OTP token if any
        await supabase
            .from('otps')
            .delete()
            .eq('email', targetEmail);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Account and active authentication session wiped successfully.' })
        };

    } catch (err) {
        console.error('Exception in delete-account:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
