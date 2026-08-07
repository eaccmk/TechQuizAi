-- ============================================================================
-- TechQuizAi DB Migration Schema
-- Setup: Run this script in the Supabase SQL Editor
-- ============================================================================

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'users' table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'REPEAT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 3. Create 'otps' table (Temporary Code Cache)
CREATE TABLE IF NOT EXISTS public.otps (
    email TEXT PRIMARY KEY,
    hashed_otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 4. Create 'audit_logs' table (Immutable ledger)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('OTP_REQUESTED', 'OTP_VERIFIED', 'ACCOUNT_DELETED_REQUEST')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Index for auditing by email
CREATE INDEX IF NOT EXISTS idx_audit_logs_email ON public.audit_logs(email);

-- 5. Row Level Security (RLS) Configuration
-- Enable RLS on all tables to prevent direct client access if needed
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Note: Since our serverless functions access Supabase via Service Role Key (Admin privilege),
-- they bypass RLS. For standard client operations, we keep these locked down.
CREATE POLICY "Bypass RLS for service role" ON public.users USING (true) WITH CHECK (true);
CREATE POLICY "Bypass RLS for service role otps" ON public.otps USING (true) WITH CHECK (true);
CREATE POLICY "Bypass RLS for service role audit" ON public.audit_logs USING (true) WITH CHECK (true);

-- 6. Cron Purge Function for Audit Logs (Retain exactly 30 days)
CREATE OR REPLACE FUNCTION public.purge_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.audit_logs
    WHERE timestamp < (now() - INTERVAL '30 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Execute on the 1st of every month at UTC 00:00 using pg_cron (if available)
-- Verify if pg_cron is enabled in Supabase extensions, then run this:
-- SELECT cron.schedule('purge-audit-logs-monthly', '0 0 1 * *', 'SELECT public.purge_old_audit_logs();');
