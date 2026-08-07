const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');
const { Resend } = require('resend');
const crypto = require('crypto');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Netlify Function: request-otp
 * Obfuscation Scheme: Base64
 * Purpose: Decrypts obfuscated email, checks/updates user status, generates 6-digit OTP,
 *          hashes and upserts OTP, records audit log, and emails the OTP.
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

        // De-obfuscate raw inputs from transit format (Base64)
        const email = Buffer.from(payload, 'base64').toString('utf8').trim();
        if (!email || !email.includes('@')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email address' })
            };
        }

        // Step 1: Query existing user profile
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        let status = 'NEW';
        if (user) {
            status = 'REPEAT';
        } else {
            // Create user profile with status 'NEW'
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ email, status: 'NEW' }]);
            
            if (insertError) {
                console.error('Error inserting user profile:', insertError);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to create user profile' })
                };
            }
        }

        // Step 2: Generate secure 6-digit OTP
        // Generates an integer in range [100000, 999999]
        const otpInt = crypto.randomInt(100000, 1000000);
        const otpString = otpInt.toString();
        const hashedOtp = crypto.createHash('sha256').update(otpString).digest('hex');
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min validity

        // Upsert temporary OTP token
        const { error: otpError } = await supabase
            .from('otps')
            .upsert({ email, hashed_otp: hashedOtp, expires_at: expiresAt });

        if (otpError) {
            console.error('Error caching OTP token:', otpError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to cache authentication token' })
            };
        }

        // Step 3: Record Audit Log
        const userAgent = event.headers['user-agent'] || 'Unknown';
        const clientIp = event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || '127.0.0.1';
        
        await supabase
            .from('audit_logs')
            .insert({
                email,
                action: 'OTP_REQUESTED',
                session_metadata: { ip: clientIp, userAgent }
            });

        // Step 4: Dispatch Email via Resend or SendGrid
        let emailSent = false;
        const emailSubject = `Your TechQuizAi Passcode: ${otpString}`;
        const emailHtml = `
            <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
                <h2 style="color: #7c3aed;">TechQuizAi Security Verification</h2>
                <p>Hello,</p>
                <p>Use the following 6-digit verification code to complete your sign-in / sign-up. This code is valid for 5 minutes:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #7c3aed; padding: 12px; margin: 20px 0; background: #f3f4f6; text-align: center; border-radius: 4px;">
                    ${otpString}
                </div>
                <p style="color: #6b7280; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
            </div>
        `;

        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'TechQuizAi Auth <onboarding@resend.dev>',
                    to: email,
                    subject: emailSubject,
                    html: emailHtml
                });
                emailSent = true;
            } catch (err) {
                console.error('Resend dispatch failure:', err);
            }
        }

        if (!emailSent && process.env.SENDGRID_API_KEY) {
            try {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                await sgMail.send({
                    to: email,
                    from: 'no-reply@techquizai.com', // Must be verified sender
                    subject: emailSubject,
                    html: emailHtml
                });
                emailSent = true;
            } catch (err) {
                console.error('SendGrid dispatch failure:', err);
            }
        }

        // Fallback for local development
        if (!emailSent) {
            console.log('\n=======================================');
            console.log(`[DEV/MOCK] OTP for ${email} is: ${otpString}`);
            console.log('=======================================\n');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Verification passcode dispatched.',
                status: status,
                devMode: !emailSent
            })
        };

    } catch (err) {
        console.error('Exception in request-otp:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
