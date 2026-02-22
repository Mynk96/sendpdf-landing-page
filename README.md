# SendPDF Landing Page

Early access waitlist landing page for SendPDF — a developer-first document automation platform.

## Run locally

**Option 1 — Node (recommended)**  
From the project folder:

```bash
npx serve -l 3000
```

Then open **http://localhost:3000**

**Option 2 — Python**  
```bash
python -m http.server 3000
```

Then open **http://localhost:3000**

## Collecting signups

The waitlist form submits to **Formspree** and shows a success message on submit. Responses appear in your Formspree dashboard and/or email.

**Form security (reduce abuse and protect your limit):**
- A **honeypot** field (`_gotcha`) is included; bots that fill it are blocked client-side and by Formspree, so they don’t use your quota.
- In the **Formspree dashboard** for this form, we recommend:
  - Enabling **reCAPTCHA** (Settings → Spam prevention) to block more bots.
  - Adding **allowed domains** (e.g. your production domain) if available, so only submissions from your site are accepted.
- For **reCAPTCHA**: create a **reCAPTCHA v3** key in [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin), add the **secret key** in Formspree (Settings → Spam prevention), set the **site key** in the form's `data-recaptcha-sitekey` in `index.html`, and ensure your site's domain is allowed for that key in the reCAPTCHA console.
- The form endpoint is in the page script (required for browser submissions). To hide it entirely you’d need a backend that proxies requests to Formspree.

## Stack

- HTML5
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (form handling, smooth scroll)
- Inter font (Google Fonts)
- No build step — deploy to any static host (Netlify, Vercel, GitHub Pages, etc.)
