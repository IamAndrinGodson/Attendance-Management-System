# EmailJS Setup Guide

Follow these steps to enable **real email sending** for verification codes and attendance alerts.

---

## Step 1 — Create a Free EmailJS Account

1. Go to [emailjs.com](https://www.emailjs.com) and sign up (free tier: 200 emails/month)
2. After logging in, go to **Email Services** → **Add New Service**
3. Choose **Gmail** (or Outlook/Yahoo) and connect your account
4. Note down your **Service ID** (looks like `service_abc123`)

---

## Step 2 — Create the Verification Code Template

1. Go to **Email Templates** → **Create New Template**
2. Set the template up as follows:

**Subject:** `{{from_name}} — Your Verification Code`

**Body:**
```
Hi {{to_name}},

Your email verification code is:

{{verification_code}}

This code expires in 10 minutes. If you did not request this, ignore this email.

— {{from_name}}
```

3. Save and note the **Template ID** (like `template_verify123`)

---

## Step 3 — Create the Attendance Alert Template

1. Create another template with:

**Subject:** `[Attendance Alert] {{student_name}} — Below {{threshold}} in {{course_name}}`

**Body:**
```
Dear {{student_name}},

This is an automated alert from {{from_name}}.

Your current attendance in **{{course_name}}** has dropped to **{{attendance_percentage}}%**, 
which is below the required threshold of {{threshold}}.

Please meet your faculty advisor at the earliest.

— {{from_name}} Attendance System
```

2. Save and note the **Template ID** (like `template_alert456`)

---

## Step 4 — Get Your Public Key

1. Go to **Account** → **General** tab
2. Copy your **Public Key** (looks like `abcXYZ123...`)

---

## Step 5 — Update the Config in the App

Open `src/services/emailService.js` and replace the placeholder values:

```js
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_abc123',          // ← your Service ID
    TEMPLATE_VERIFICATION: 'template_verify123',  // ← verification template ID
    TEMPLATE_ALERT: 'template_alert456',          // ← alert template ID
    PUBLIC_KEY: 'abcXYZ123...',            // ← your Public Key
};
```

---

## That's it! 🎉

Once configured:
- **Login** → verification email sent automatically → enter 6-digit code to proceed
- **Submit attendance** with absent students → alert email sent to each student below 75%
