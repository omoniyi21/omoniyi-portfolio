# Getting the contact and Studio inquiry forms sending on Netlify

The site is built and deployed on **Netlify**, connected to this GitHub repo. Netlify doesn't run PHP, so the two forms (the portfolio contact form and the Studio `/studio/inquire` intake form) now send through **Netlify Functions** instead of PHP:

- `netlify/functions/contact.mjs` — the portfolio contact form
- `netlify/functions/studio-inquiry.mjs` — the Studio intake form

Both functions deliver mail the same way: your **DreamHost mailbox** (`contact@omoniyialimi.com`) still receives the email, but it's sent over DreamHost's SMTP server using [nodemailer](https://nodemailer.com/), authenticated with that mailbox's own login — not through PHP's `mail()` anymore, since there's no PHP runtime on Netlify to run it.

## One-time setup: add the mailbox credentials to Netlify

Netlify needs to know how to log into the `contact@omoniyialimi.com` mailbox to send through it. This happens entirely in Netlify's dashboard — I never see or handle the password.

1. In the Netlify dashboard, open this site → **Site configuration → Environment variables**.
2. Add these two variables:
   - `SMTP_USER` — the full mailbox address: `contact@omoniyialimi.com`
   - `SMTP_PASS` — that mailbox's password (the same one you'd use to log into DreamHost webmail or an email client for that address)
3. You can leave `SMTP_HOST` and `SMTP_PORT` unset — the functions default to DreamHost's own outgoing server, `smtp.dreamhost.com` on port `587` (STARTTLS), which is DreamHost's current recommended setting. Only add those two variables if DreamHost ever asks you to use different values.
4. Trigger a new deploy (or just push a commit) so the functions pick up the new environment variables — Netlify only reads them at build/deploy time.

That's the only manual step. No files need to be uploaded anywhere by hand — Netlify builds and deploys the functions automatically from this repo on every push, the same way it already deploys the rest of the site.

## Testing it

Local dev (`npm run dev`) won't run the functions — that's a Vite-only dev server with no function runtime behind it, so submitting a form locally will always fail. Test from the actual deployed Netlify URL (or a Netlify deploy preview) once `SMTP_USER`/`SMTP_PASS` are set.

If a submission still fails after that, check the function's logs in Netlify: **Site → Logs → Functions**, then click into `contact` or `studio-inquiry` for the failed attempt. Both functions log the specific reason a send failed (missing credentials, a rejected SMTP login, etc.) instead of failing silently.

## If you ever want to swap the "from" mailbox

Both functions send from whatever mailbox `SMTP_USER` names and deliver to `contact@omoniyialimi.com`. If you ever move to a different DreamHost mailbox, or to a dedicated transactional email service instead, you only need to update the environment variables (and `SMTP_HOST`/`SMTP_PORT` if it's no longer DreamHost) — the function code itself doesn't need to change.

## Old DreamHost PHP files

The old `public/api/contact.php` and `public/api/studio-inquiry.php` are no longer used — Netlify can't execute PHP, so those files were doing nothing except sitting there as plain, readable source (a small information leak, since anyone could have requested them directly and read the source). I moved them into `_to_delete/public-api/` in this repo; delete that folder whenever you get a chance. If you still have a copy of `api/contact.php` live on DreamHost itself from before, that's harmless to leave or remove — it's just not reachable from the Netlify-hosted site anymore.
