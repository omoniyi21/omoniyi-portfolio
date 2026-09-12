<?php
declare(strict_types=1);

/**
 * Portfolio contact endpoint for DreamHost PHP 8.4.
 *
 * The form's one job is to email contact@omoniyialimi.com, and that now
 * happens directly from this file with no external config required.
 * Database logging + rate limiting are an optional extra layered on top:
 * if private/contact-config.php exists on the server, it's used, but a
 * missing file, a typo in it, or a database outage will never block the
 * email itself anymore.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function reply(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

const NOTIFICATION_EMAIL = 'contact@omoniyialimi.com';
const FROM_EMAIL = 'contact@omoniyialimi.com';
const ALLOWED_ORIGINS = [
    'https://omoniyialimi.com',
    'https://www.omoniyialimi.com',
    'http://localhost:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ALLOWED_ORIGINS, true)) {
    reply(403, ['ok' => false, 'error' => 'This form can only be sent from the portfolio site.']);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput ?: '', true);
if (!is_array($input)) {
    reply(400, ['ok' => false, 'error' => 'Please try sending your note again.']);
}

$name = trim((string)($input['name'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$message = trim((string)($input['message'] ?? ''));
$website = trim((string)($input['website'] ?? ''));

// Quietly accept bot submissions without storing, sending, or forwarding them.
if ($website !== '') {
    reply(200, ['ok' => true]);
}

if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    reply(422, ['ok' => false, 'error' => 'Please include your name.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    reply(422, ['ok' => false, 'error' => 'Please use a valid email address.']);
}
if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
    reply(422, ['ok' => false, 'error' => 'Please write a note between 10 and 5,000 characters.']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// --- Optional: database logging + rate limiting -------------------------
// Best-effort only. If private/contact-config.php is missing, malformed,
// or the database can't be reached, we log it and move straight on to
// sending the email — this step must never stop the message from sending.
$documentRoot = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
$configPath = dirname($documentRoot) . '/private/contact-config.php';
$rateLimited = false;

if (is_file($configPath)) {
    try {
        $config = require $configPath;
        if (is_array($config) && !empty($config['db_host'])) {
            $ipHash = hash_hmac('sha256', $ip, (string)($config['ip_hash_key'] ?? 'fallback-key'));
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db_host'], $config['db_name']);
            $database = new PDO($dsn, $config['db_user'], $config['db_password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 3,
            ]);

            $rateLimit = $database->prepare(
                'SELECT COUNT(*) FROM portfolio_contact_messages WHERE ip_hash = :ip_hash AND created_at >= (UTC_TIMESTAMP() - INTERVAL 15 MINUTE)'
            );
            $rateLimit->execute(['ip_hash' => $ipHash]);
            if ((int)$rateLimit->fetchColumn() >= 5) {
                $rateLimited = true;
            } else {
                $save = $database->prepare(
                    'INSERT INTO portfolio_contact_messages (name, email, message, ip_hash) VALUES (:name, :email, :message, :ip_hash)'
                );
                $save->execute(['name' => $name, 'email' => $email, 'message' => $message, 'ip_hash' => $ipHash]);
            }
        }
    } catch (Throwable $error) {
        error_log('Portfolio contact optional database step failed (email will still send): ' . $error->getMessage());
    }
}

if ($rateLimited) {
    reply(429, ['ok' => false, 'error' => 'Thanks for your enthusiasm — please try again in a few minutes.']);
}

// --- Required: send the email straight to contact@omoniyialimi.com ------
$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$subject = 'New portfolio note from ' . $safeName;
$emailBody = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = [
    'From: ' . FROM_EMAIL,
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail(NOTIFICATION_EMAIL, $subject, $emailBody, implode("\r\n", $headers));

if (!$sent) {
    error_log('Portfolio contact email could not be sent via mail().');
    reply(502, ['ok' => false, 'error' => "I couldn't send that just yet. Please email me directly at " . NOTIFICATION_EMAIL . " instead."]);
}

reply(200, ['ok' => true]);
