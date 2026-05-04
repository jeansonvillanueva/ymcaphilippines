# Donate Page Integration - Quick Setup

## What You Need to Do (5 Steps)

### Step 1: Get Stripe Keys (2 min)
- Visit https://stripe.com
- Sign up
- Go to Dashboard → Settings → API Keys
- Copy your test keys

### Step 2: Install Stripe (2 min)
SSH into your server:
```bash
cd public_html/php-api
composer require stripe/stripe-php
```

### Step 3: Configure .env (1 min)
Create `php-api/.env`:
```
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_YOUR_KEY
STRIPE_SECRET_KEY_TEST=sk_test_YOUR_SECRET_KEY
STRIPE_ENVIRONMENT=test
```

### Step 4: Update Config (1 min)
Add to `php-api/config.php` after line 11:
```php
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        $_ENV[$key] = $value;
    }
}
```

### Step 5: Update Frontend Key (1 min)
In `frontend/src/pages/Donate.tsx` line 13:
```typescript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_ACTUAL_KEY';
```

### Step 6: Database (1 min)
Run in phpMyAdmin:
```sql
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(100);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS stripe_charge_id VARCHAR(100);
```

### Step 7: Deploy (1 min)
```bash
npm run build
# Upload dist/ folder
```

---

## Test It

Go to `https://yourdomain.com/donate`

**Test Card:** 4242 4242 4242 4242
**Exp:** 12/25
**CVC:** 123

Should see: ✅ "Donation successful!"

---

## View Donations

Admin: https://yourdomain.com/php-api/admin/donations
- Username: `ymcaph`
- Password: `Ymc@19!1`

---

## What's Included

✅ Donate page with Stripe
✅ Multi-currency (USD, PHP, EUR)
✅ Form validation
✅ Error handling
✅ Admin panel
✅ Database integration
✅ Email receipts (via Stripe)

---

**Total Setup Time: ~10 minutes**

Questions? See `DONATE_INTEGRATION_GUIDE.md` for details.
