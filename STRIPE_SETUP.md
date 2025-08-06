# Stripe Integration Setup Guide

This guide will help you configure Stripe payments for your Thinkzo.ai landing page.

## Required Environment Variables

You need to set up the following environment variables in your Supabase project:

### 1. Supabase Environment Variables

In your Supabase project dashboard, go to Settings > Environment Variables and add:

```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (from your webhook endpoint)
```

### 2. Frontend Environment Variables

Create a `.env` file in your project root with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
```

## Stripe Setup Steps

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete your account setup and verification

### 2. Get API Keys
- In your Stripe Dashboard, go to Developers > API Keys
- Copy your Publishable Key and Secret Key
- Use test keys for development, live keys for production

### 3. Create Products and Prices
Create the following products in your Stripe Dashboard:

#### Starter Plan
- Product Name: "Thinkzo.ai Starter"
- Price: $9/month
- Copy the Price ID and replace `price_starter_monthly` in the code

#### Pro Plan
- Product Name: "Thinkzo.ai Pro"
- Price: $29/month
- Copy the Price ID and replace `price_pro_monthly` in the code

### 4. Set up Webhooks
- In Stripe Dashboard, go to Developers > Webhooks
- Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Select events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Copy the webhook signing secret

## Code Updates Required

### 1. Update Price IDs
In `src/components/Pricing.tsx`, replace the placeholder price IDs:

```typescript
// Replace these with your actual Stripe Price IDs
priceId: 'price_1234567890abcdef', // Your actual Starter price ID
priceId: 'price_0987654321fedcba', // Your actual Pro price ID
```

### 2. Update Supabase Function URLs
In `src/components/Pricing.tsx`, update the function URL:

```typescript
const response = await fetch(`https://your-project.supabase.co/functions/v1/create-checkout-session`, {
```

## Testing

### Test Mode
- Use Stripe test cards: `4242 4242 4242 4242`
- Test webhooks using Stripe CLI or webhook testing tools
- Verify checkout flow works end-to-end

### Production Checklist
- [ ] Switch to live API keys
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Set up proper error handling and logging

## Security Notes

- Never expose secret keys in frontend code
- Always validate webhooks using Stripe signatures
- Use HTTPS for all webhook endpoints
- Implement proper error handling for failed payments

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For Supabase Edge Functions:
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)