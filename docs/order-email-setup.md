# Order Email Notification Setup (Firebase)

This sends an email to admin whenever a new document is created in `orders`.

## 1. What is already implemented in app code

- Checkout now writes order data plus customer profile details into Firestore:
  - `userDetails.fullName`
  - `userDetails.phone`
  - `userDetails.addressLine1`
  - `userDetails.addressLine2`
  - `userDetails.city`
  - `userDetails.state`
  - `userDetails.zipCode`
- Cloud Function trigger is added in `functions/index.js`:
  - Trigger: `orders/{orderId}` on create
  - Sends formatted HTML + text email using SMTP (Nodemailer)

## 2. Install Firebase CLI (if not installed)

```bash
npm i -g firebase-tools
firebase login
firebase use kabab-hut-catering
```

## 3. Install function dependencies

From project root:

```bash
cd /Users/jawwadabbasi/kabab-hut-atl/catering-mobile/functions
npm install
```

## 4. Set secret env vars for Functions

You need SMTP credentials from an email provider.

Recommended for testing:
- Mailtrap (easy testing inbox)
- SendGrid SMTP / Resend SMTP / Brevo SMTP

Set secrets:

```bash
firebase functions:secrets:set ADMIN_ORDER_EMAIL
firebase functions:secrets:set FROM_EMAIL
firebase functions:secrets:set SMTP_HOST
firebase functions:secrets:set SMTP_PORT
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
```

Values example:
- `ADMIN_ORDER_EMAIL`: your business inbox (`orders@kababhutatl.com` or your test email)
- `FROM_EMAIL`: sender email shown in the message
- `SMTP_HOST`: provider SMTP host (e.g. `smtp.sendgrid.net`)
- `SMTP_PORT`: `587` (or `465` if provider requires)
- `SMTP_USER` / `SMTP_PASS`: provider credentials

## 5. Deploy function

From project root:

```bash
cd /Users/jawwadabbasi/kabab-hut-atl/catering-mobile
firebase deploy --only functions
```

## 6. Test end-to-end

1. Run app and sign in.
2. Fill profile data (name/phone/address) in Profile tab and save.
3. Add menu/package items to cart.
4. Go checkout and place order.
5. Verify:
   - Firestore `orders` has new doc
   - Admin mailbox received email with full order summary

## 7. Cost notes (important)

### Firebase side
- **Yes, this is possible via Firebase** (Cloud Functions + Firestore trigger).
- Cloud Functions usually needs **Blaze (pay-as-you-go)** enabled.
- For low traffic testing, cost is typically near zero (few invocations).

### Email provider side
- Most providers have free tier for testing (daily/monthly limits).
- Cost depends on provider and volume, not Firebase alone.

## 8. Safe testing recommendation

- Use Mailtrap first (no real customer emails sent).
- After template looks good, switch SMTP secrets to your production provider.
