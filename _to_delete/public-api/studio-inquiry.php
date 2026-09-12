<?php
declare(strict_types=1);

/**
 * Omoniyi Studio intake-form endpoint for DreamHost PHP 8.4.
 *
 * Mirrors the resilience pattern in api/contact.php: this file's one
 * required job is to email contact@omoniyialimi.com with the qualifying
 * details a prospective client submitted on /studio/inquire. No database
 * or config file is required for that to happen.
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

const SERVICE_LABELS = [
    'refine' => 'Refine — UX Audit & Optimization',
    'build' => 'Build — Website / Product Design',
    'transform' => 'Transform — Experience System & Creative Direction',
    'not-sure' => 'Not sure yet',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ALLOWED_ORIGINS, true)) {
    reply(403, ['ok' => false, 'error' => 'This form can only be sent from the Studio site.']);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput ?: '', true);
if (!is_array($input)) {
    reply(400, ['ok' => false, 'error' => 'Please try sending your inquiry again.']);
}

// Honeypot — quietly accept bot submissions without sending or forwarding them.
$honeypot = trim((string)($input['_hp'] ?? ''));
if ($honeypot !== '') {
    reply(200, ['ok' => true]);
}

$name = trim((string)($input['name'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$company = trim((string)($input['company'] ?? ''));
$website = trim((string)($input['website'] ?? ''));
$serviceKey = trim((string)($input['service'] ?? 'not-sure'));
$notWorking = trim((string)($input['notWorking'] ?? ''));
$successLooksLike = trim((string)($input['successLooksLike'] ?? ''));
$timeline = trim((string)($input['timeline'] ?? ''));
$budget = trim((string)($input['budget'] ?? ''));
$anythingElse = trim((string)($input['anythingElse'] ?? ''));

if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    reply(422, ['ok' => false, 'error' => 'Please include your name.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    reply(422, ['ok' => false, 'error' => 'Please use a valid email address.']);
}
if (mb_strlen($budget) < 1) {
    reply(422, ['ok' => false, 'error' => 'Please select an approximate budget.']);
}
foreach (['company', 'website', 'notWorking', 'successLooksLike', 'timeline', 'anythingElse'] as $field) {
    if (mb_strlen($$field) > 5000) {
        reply(422, ['ok' => false, 'error' => 'One of the fields is too long — please shorten it and try again.']);
    }
}

$serviceLabel = SERVICE_LABELS[$serviceKey] ?? SERVICE_LABELS['not-sure'];

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$subject = 'New Studio inquiry from ' . $safeName . ' (' . $serviceLabel . ')';

$lines = [
    "Name: {$name}",
    "Email: {$email}",
    'Company / business: ' . ($company !== '' ? $company : '—'),
    'Website / product URL: ' . ($website !== '' ? $website : '—'),
    "Interested in: {$serviceLabel}",
    'Desired timeline: ' . ($timeline !== '' ? $timeline : '—'),
    "Approximate budget: {$budget}",
    '',
    "What isn't working right now?",
    $notWorking !== '' ? $notWorking : '—',
    '',
    'What would a successful outcome look like?',
    $successLooksLike !== '' ? $successLooksLike : '—',
    '',
    'Anything else?',
    $anythingElse !== '' ? $anythingElse : '—',
];
$emailBody = implode("\n", $lines) . "\n";

$headers = [
    'From: ' . FROM_EMAIL,
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail(NOTIFICATION_EMAIL, $subject, $emailBody, implode("\r\n", $headers));

if (!$sent) {
    error_log('Studio inquiry email could not be sent via mail().');
    reply(502, ['ok' => false, 'error' => "I couldn't send that just yet. Please email me directly at " . NOTIFICATION_EMAIL . " instead."]);
}

reply(200, ['ok' => true]);
