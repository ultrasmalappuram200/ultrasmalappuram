# Admin Setup Guide

## Quick Fix - Run This SQL in Supabase

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- First, check if the user exists
SELECT id, email FROM auth.users WHERE email = 'admin@malappuramfc.com';

-- If the user exists, create/update the admin profile
INSERT INTO profiles (id, email, role) 
SELECT id, email, 'admin' 
FROM auth.users 
WHERE email = 'admin@malappuramfc.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify the profile was created
SELECT * FROM profiles WHERE email = 'admin@malappuramfc.com';
```

## If User Doesn't Exist

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Email: `admin@malappuramfc.com`
4. Password: (your password)
5. Auto Confirm User: ✅ YES
6. Click "Create User"

Then run the SQL above to create the admin profile.

## Test Login

1. Go to: http://localhost:3000/admin-login
2. Email: `admin@malappuramfc.com`
3. Password: (your password)
4. Should redirect to: http://localhost:3000/admin

## Simplified Authentication Flow

The new system:
- ✅ No timeouts
- ✅ No complex checks
- ✅ Auto-creates admin profile for admin@malappuramfc.com
- ✅ Clean redirect logic
- ✅ Proper loading states

Just make sure:
1. User exists in Supabase
2. Profile has role='admin'
3. That's it!

