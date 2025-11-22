-- SIMPLE SETUP - Run this in Supabase SQL Editor
-- This will create everything from scratch

-- 1. Drop everything first (clean slate)
DROP TABLE IF EXISTS waitlist_signups CASCADE;
DROP FUNCTION IF EXISTS update_referral_count() CASCADE;
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;

-- 2. Create the table
CREATE TABLE waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0,
  position INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX idx_waitlist_email ON waitlist_signups(email);
CREATE INDEX idx_waitlist_referral_code ON waitlist_signups(referral_code);
CREATE INDEX idx_waitlist_referred_by ON waitlist_signups(referred_by);
CREATE INDEX idx_waitlist_created_at ON waitlist_signups(created_at);

-- 4. Create trigger function
CREATE FUNCTION update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE waitlist_signups
    SET referral_count = referral_count + 1
    WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger
CREATE TRIGGER trigger_update_referral_count
AFTER INSERT ON waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION update_referral_count();

-- 6. Enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- 7. Create policies (SIMPLE - allow everything for public)
CREATE POLICY "Enable read access for all users"
ON waitlist_signups FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert access for all users"
ON waitlist_signups FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON waitlist_signups FOR UPDATE
TO public
USING (true);

-- 8. Grant permissions
GRANT ALL ON waitlist_signups TO postgres, anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 9. Test insert (optional - you can remove this)
-- INSERT INTO waitlist_signups (email, referral_code, position)
-- VALUES ('test@example.com', 'TEST1234', 1);

-- Done! You should see "Success. No rows returned" or the test row
