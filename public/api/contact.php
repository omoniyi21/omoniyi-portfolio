<?php
declare(strict_types=1);

/**
 * Portfolio contact endpoint for DreamHost PHP 8.4.
 * Keep the real config outside the public web root:
 *   /home/USERNAME/private/contact-config.php
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

$documentRoot = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
$configPath = dirname($documentRoot) . '/private/contact-config.php';
if (!is_file($configPath)) {
    error_log('Portfolio contact config is missing.');
    reply(503, ['ok' => false, 'error' => 'The contact form is being set up. Please email me directly for now.']);
}

$config = require $configPath;
if (!is_array($config)) {
    error_log('Portfolio contact config is invalid.');
    reply(503, ['ok' => false, 'error' => 'The contact form is temporarily unavailable.']);
}

$allowedOrigins = $config['allowed_origins'] ?? [];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
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

// Quietly accept bot submissions without storing or forwarding them.
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
$ipHash = hash_hmac('sha256', $ip, (string)$config['ip_hash_key']);

try {
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db_host'], $config['db_name']);
    $database = new PDO($dsn, $config['db_user'], $config['db_password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $rateLimit = $database->prepare(
        'SELECT COUNT(*) FROM portfolio_contact_messages WHERE ip_hash = :ip_hash AND created_at >= (UTC_TIMESTAMP() - INTERVAL 15 MINUTE)'
    );
    $rateLimit->execute(['ip_hash' => $ipHash]);
    if ((int)$rateLimit->fetchColumn() >= 5) {
        reply(429, ['ok' => false, 'error' => 'Thanks for your enthusiasm — please try again in a few minutes.']);
    }

    $save = $database->prepare(
        'INSERT INTO portfolio_contact_messages (name, email, message, ip_hash) VALUES (:name, :email, :message, :ip_hash)'
    );
    $save->execute(['name' => $name, 'email' => $email, 'message' => $message, 'ip_hash' => $ipHash]);
} catch (Throwable $error) {
    error_log('Portfolio contact database error: ' . $error->getMessage());
    reply(503, ['ok' => false, 'error' => 'I couldn\'t save your note just yet. Please email me directly instead.']);
}

$to = (string)$config['notification_email'];
$from = (string)$config['from_email'];
$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$subject = 'New portfolio note from ' . $safeName;
$emailBody = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = [
    'From: ' . $from,
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=UTF-8',
];

if (!mail($to, $subject, $emailBody, implode("\r\n", $headers))) {
    error_log('Portfolio contact email notification could not be sent.');
}

reply(200, ['ok' => true]);
