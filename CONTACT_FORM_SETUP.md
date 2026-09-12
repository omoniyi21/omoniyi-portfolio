# Launching the portfolio contact form on DreamHost

The React form sends to `/api/contact.php`. That endpoint's one required job
is to email `contact@omoniyialimi.com` directly — it no longer depends on
any database or config file to do that. Database logging (a searchable
history of messages + basic rate limiting) is an optional extra layered on
top: if it's set up, you get it; if it's missing or broken, the email still
goes out.

## ⚠️ If you set this up before September 2026

The original example config had a typo in the database host and the `www`
allowed-origin: `omonyialimi.com` (missing the middle "i") instead of
`omoniyialimi.com`. If you copied `private/contact-config.example.php` to
your live `private/contact-config.php` before this fix, open that file on
DreamHost and check both values — that typo alone could have been silently
breaking submissions (the old code required the database step to succeed
*before* it would even attempt to send the email, so a bad host name meant
no message ever went out).

## One-time DreamHost setup (optional — only for message history + rate limiting)

1. In **phpMyAdmin**, select `omoniyialimi_portfolio`, open the **SQL** tab, and run the contents of `private/contact-schema.sql`.
2. In DreamHost Files, create a `private` folder **outside** your website's public directory. Copy `private/contact-config.example.php` there as `contact-config.php`.
3. In that private config file, enter the database password for `omoniyi21`. Generate a long random value for `ip_hash_key` as well. Do not put either value in this repository or in your browser code.

If you skip this section entirely, the form still works — you just won't get a database record of messages or the 5-per-15-minutes rate limit.

## Required deploy step

Upload the built website files as usual, and make sure `api/contact.php` is uploaded alongside the site files, so it resolves at `https://omoniyialimi.com/api/contact.php`. That's the only thing the email path needs.

Send one real test note from the live site and confirm it arrives at `contact@omoniyialimi.com`. If it doesn't, check your DreamHost PHP error log (Panel → Logs) — the endpoint now logs *why* the send failed instead of failing silently.

## Important path note

If you did do the optional database setup, the endpoint locates its config one level above DreamHost's public web folder. If your DreamHost folder structure differs, change only this line in `api/contact.php`:

```php
$configPath = dirname($documentRoot) . '/private/contact-config.php';
```

The config must stay outside the public web folder.
