<?php
// Copy this file to: /home/YOUR_DREAMHOST_USER/private/contact-config.php
// Keep that real file OUTSIDE the directory that your website serves publicly.
// Never commit the real file or paste its passwords into chat.

return [
    'db_host' => 'mysql-1.omonyialimi.com',
    'db_name' => 'omoniyialimi_portfolio',
    'db_user' => 'omoniyi21',
    'db_password' => 'replace-with-the-database-user-password',
    'ip_hash_key' => 'replace-with-a-long-random-secret',
    'notification_email' => 'contact@omoniyialimi.com',
    'from_email' => 'contact@omoniyialimi.com',
    'allowed_origins' => [
        'https://omoniyialimi.com',
        'https://www.omonyialimi.com',
        'http://localhost:5173',
    ],
];
