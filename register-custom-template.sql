-- =========================================================================
-- Custom Template Registration Script
-- Use this script to manually register a hardcoded template in the production database.
-- 
-- INSTRUCTIONS:
-- 1. Connect to your production PostgreSQL database (e.g. using pgAdmin or psql)
-- 2. Find and replace 'YOUR_SHORTCODE' with your exact 10-character code.
-- 3. Modify the Event TITLES, DATES, and TIMES below to match your template's data.js.
-- 4. Execute the script.
-- =========================================================================

-- 1. Create the Invite Record
INSERT INTO invites (id, user_id, template_id, code, status, created_at, updated_at) 
SELECT 
    gen_random_uuid(), 
    id, 
    'royal-heirloom',  -- Change if using a different template
    'YOUR_SHORTCODE',  -- MUST MATCH data.js EXACTLY (Max 10 chars)
    'PAID', 
    now(), 
    now() 
FROM users 
WHERE email = 'admin@inviteque.com'
ON CONFLICT (code) DO NOTHING;


-- 2. Create the Event Records (Add/Remove as needed)
-- IMPORTANT: The "name" field here MUST EXACTLY match the "title" string in data.js

INSERT INTO wedding_events (id, wedding_id, name, event_date, event_time, created_at, updated_at)
SELECT gen_random_uuid(), i.id, 'Pooja', '13th Dec, 2026', '11:30 AM', now(), now()
FROM invites i WHERE i.code = 'YOUR_SHORTCODE';

INSERT INTO wedding_events (id, wedding_id, name, event_date, event_time, created_at, updated_at)
SELECT gen_random_uuid(), i.id, 'Cocktail', '18th Dec, 2026', '8:30 PM', now(), now()
FROM invites i WHERE i.code = 'YOUR_SHORTCODE';

INSERT INTO wedding_events (id, wedding_id, name, event_date, event_time, created_at, updated_at)
SELECT gen_random_uuid(), i.id, 'Haldi & Mehendi', '19th Dec, 2026', '3:00 PM', now(), now()
FROM invites i WHERE i.code = 'YOUR_SHORTCODE';

INSERT INTO wedding_events (id, wedding_id, name, event_date, event_time, created_at, updated_at)
SELECT gen_random_uuid(), i.id, 'Wedding', '20th Dec, 2026', '5:00 PM', now(), now()
FROM invites i WHERE i.code = 'YOUR_SHORTCODE';
