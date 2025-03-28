<?php 
$to = "web.front.factory@gmail.com"; 
$subject = "New Contact Form Submission";

$array_def = array(
    'firstname' => null,
    'lastname' => null,
    'email' => null,
    'check-in' => null,
    'check-out' => null,
    'adults' => null,
    'children' => null,
    'apartman' => null,
    'message' => null,
    'current_page' => null
);

$array_def = array_replace($array_def, $_POST);

$out_m = [];
$send_status = false;
$skip_send = false;

if (empty($array_def['firstname']) || empty($array_def['lastname']) || empty($array_def['email'])) {
    $out_m['alert_message'] = "Please fill in all required fields!";
    $skip_send = true;
}

if (!empty($array_def['email']) && !filter_var($array_def['email'], FILTER_VALIDATE_EMAIL)) {
    $out_m['alert_message'] = "Invalid email format!";
    $skip_send = true;
}

$message = "";
if ($skip_send === false) {
    $message .= "<strong>First Name:</strong> " . htmlspecialchars($array_def['firstname']) . "<br>";
    $message .= "<strong>Last Name:</strong> " . htmlspecialchars($array_def['lastname']) . "<br>";
    $message .= "<strong>Email:</strong> " . htmlspecialchars($array_def['email']) . "<br>";
    $message .= "<strong>Check-in:</strong> " . htmlspecialchars($array_def['check-in']) . "<br>";
    $message .= "<strong>Check-out:</strong> " . htmlspecialchars($array_def['check-out']) . "<br>";
    $message .= "<strong>Adults:</strong> " . htmlspecialchars($array_def['adults']) . "<br>";
    $message .= "<strong>Children:</strong> " . htmlspecialchars($array_def['children']) . "<br>";
    $message .= "<strong>Apartment:</strong> " . htmlspecialchars($array_def['apartman']) . "<br>";
    $message .= "<strong>Message:</strong> " . nl2br(htmlspecialchars($array_def['message'])) . "<br>";
    $message .= "<strong>From Page:</strong> " . htmlspecialchars($array_def['current_page']) . "<br>";

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $headers .= 'From: noreply@example.com' . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        $out_m['alert_message'] = "Thank you. We will reach out to you shortly.";
        $send_status = true;
    } else {
        $out_m['alert_message'] = "Something went wrong. Try again!";
    }
}

$out_m['send_status'] = $send_status;

echo json_encode($out_m);
exit();