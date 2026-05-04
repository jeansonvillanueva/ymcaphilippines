# Donate Page - Backend Integration Guide

## Overview
Your Donate page is now fully connected to the backend with **Stripe payment processing**. Here's how to set it up.

## Step-by-Step Setup

### 1. Get Stripe API Keys

1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account (works in Philippines)
3. Go to **Dashboard → Settings → API Keys**
4. You'll see:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### 2. Install Stripe PHP Library

In your server via SSH or in `php-api/` folder:

```bash
composer require stripe/stripe-php
```

Or download manually: https://github.com/stripe/stripe-php

### 3. Configure Environment Variables

Create a `.env` file in `php-api/` folder:

```php
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_YOUR_TEST_KEY_HERE
STRIPE_SECRET_KEY_TEST=sk_test_YOUR_TEST_SECRET_KEY_HERE
STRIPE_ENVIRONMENT=test
```

Update `php-api/config.php` to load these:

```php
// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        $_ENV[$key] = $value;
    }
}
```

### 4. Update Frontend Stripe Key

In `frontend/src/pages/Donate.tsx`, find this line:

```typescript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_TEST_PUBLISHABLE_KEY';
```

Replace with your actual publishable key from Stripe dashboard.

### 5. Database Setup

Run this SQL in phpMyAdmin to add payment fields:

```sql
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(100);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS stripe_charge_id VARCHAR(100);
ALTER TABLE donations ADD UNIQUE KEY unique_payment_intent (payment_intent_id);
CREATE INDEX idx_status ON donations(status);
```

### 6. Update Backend Routes

The following endpoints are now available:

**POST /api/stripe/create-payment-intent**
- Creates a Stripe PaymentIntent
- Input: `{ amountUsd, currency, email, name }`
- Output: `{ clientSecret, paymentIntentId }`

**POST /api/stripe/confirm-payment**
- Confirms payment and saves donation to database
- Input: All donation info + `paymentIntentId`
- Output: `{ message, id, amount, currency }`

### 7. Build and Deploy

```bash
cd frontend
npm run build
```

Then upload `frontend/dist/` to your server.

## How Payment Flow Works

```
1. User fills out donation form
   ↓
2. Frontend calls POST /api/stripe/create-payment-intent
   ↓
3. Backend creates Stripe PaymentIntent, returns clientSecret
   ↓
4. Frontend shows Stripe card element
   ↓
5. User enters card details and clicks "Donate Now"
   ↓
6. Frontend confirms payment with Stripe using clientSecret
   ↓
7. If successful, frontend calls POST /api/stripe/confirm-payment
   ↓
8. Backend verifies with Stripe and saves donation to database
   ↓
9. User sees success message ✅
```

## Testing

### Using Stripe Test Cards

Use these test card numbers (valid until any future date):

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Exp: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`

**Declined Card:**
- Card: `4000 0000 0000 0002`

### Test Workflow

1. Go to `https://yourdomain.com/donate`
2. Fill in form details
3. Use test card `4242 4242 4242 4242`
4. Click "Donate Now"
5. Check admin panel → `/admin/donations` to see the donation

## Admin Panel

View all donations at:
```
https://yourdomain.com/php-api/admin/donations
```

Login with:
- Username: `ymcaph`
- Password: `Ymc@19!1`

## API Endpoints

### Get All Donations (Admin Only)
```
GET /api/admin/donations
Authorization: Required
```

Response:
```json
[
  {
    "donation_id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com",
    "amount_usd": 50,
    "currency": "USD",
    "status": "completed",
    "payment_intent_id": "pi_1234567890",
    "created_at": "2024-05-02 10:30:00"
  }
]
```

### Submit Donation (Public)
```
POST /api/donate
```

Input:
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john@example.com",
  "amountUsd": 50,
  "currency": "USD",
  "paymentMethod": "Stripe"
}
```

## Troubleshooting

### Issue: "Stripe API key not configured"
**Solution:** Check that:
1. `.env` file exists in `php-api/`
2. `config.php` loads `.env` file
3. API key is correct (starts with `pk_test_` or `pk_live_`)

### Issue: "Failed to create payment intent"
**Solution:** Check:
1. Amount is at least $0.50 (50 cents)
2. Currency is valid (usd, php, eur)
3. Stripe API key has proper permissions

### Issue: Donation not saved to database
**Solution:** Check:
1. `donations` table exists with all required columns
2. Payment was actually successful (check Stripe dashboard)
3. PHP error logs in cPanel for MySQL errors

### Issue: Card element not showing
**Solution:** 
1. Check browser console for JavaScript errors
2. Verify Stripe key is correct
3. Check that Stripe.js loaded from `https://js.stripe.com/v3/`

## Going Live

When ready for production:

1. **Get Live Keys** from Stripe dashboard
2. **Update `.env`:**
   ```php
   STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_YOUR_LIVE_KEY
   STRIPE_SECRET_KEY_LIVE=sk_live_YOUR_LIVE_KEY
   STRIPE_ENVIRONMENT=live
   ```
3. **Update Donate.tsx** with live publishable key
4. **Run tests** with live test amounts (real money)
5. **Monitor** Stripe dashboard for transactions

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe Philippines Support: support@stripe.com
- Your app admin: `/admin/donations`

---

**Status:** ✅ Fully implemented and ready to test
