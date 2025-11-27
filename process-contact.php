<?php
require_once __DIR__ . '/includes/init.php';

function redirect_with($status, $msg = null) {
    $loc = './Contact.php?status=' . urlencode($status);
    if ($msg) { $loc .= '&msg=' . urlencode($msg); }
    header('Location: ' . $loc);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    redirect_with('error', 'Invalid request method.');
}

$token = $_POST['csrf_token'] ?? '';
if (!verifyCsrfToken($token)) {
    redirect_with('error', 'Invalid session. Please refresh the page and try again.');
}

// Basic rate limiting per session (10s)
$now = time();
if (!empty($_SESSION['last_contact_time']) && ($now - (int)$_SESSION['last_contact_time']) < 10) {
    redirect_with('error', 'Please wait 10 seconds before sending another message.');
}
$_SESSION['last_contact_time'] = $now;

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    redirect_with('error', 'All fields are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirect_with('error', 'Invalid email address.');
}

if (mb_strlen($name) > 100 || mb_strlen($subject) > 150 || mb_strlen($message) > 5000) {
    redirect_with('error', 'Input is too long. Please check your fields.');
}

// Optionally persist or send email. For now, log to php error log.
error_log(sprintf('[Contact] %s <%s> | %s | %s', $name, $email, $subject, str_replace(["\r","\n"], ' ', $message)));

redirect_with('ok');
