# Launching the portfolio contact form on DreamHost

The React form sends to `/api/contact.php`. That PHP endpoint saves each message in `omoniyialimi_portfolio` and sends a notification to `contact@omoniyialimi.com`.

## One-time DreamHost setup

1. In **phpMyAdmin**, select `omoniyialimi_portfolio`, open the **SQL** tab, and run the contents of `private/contact-schema.sql`.
2. In DreamHost Files, create a `private` folder **outside** your website's public directory. Copy `private/contact-config.example.php` there as `contact-config.php`.
3. In that private config file, enter the database password for `omoniyi21`. Generate a long random value for `ip_hash_key` as well. Do not put either value in this repository or in your browser code.
4. Upload the built website files as usual. Make sure `api/contact.php` is uploaded alongside the site files, so it resolves at `https://omoniyialimi.com/api/contact.php`.
5. Send one real test note from the live site. Confirm that it appears in the database and arrives at `contact@omoniyialimi.com`.

## Important path note

The endpoint locates its config one level above DreamHost's public web folder. If your DreamHost folder structure differs, change only this line in `api/contact.php`:

```php
$configPath = dirname($documentRoot) . '/private/contact-config.php';
```

The config must stay outside the public web folder.
