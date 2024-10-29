<?php

// require_once(APPPATH.'libraries/PHPMailer/PHPMailerAutoload.php');

class SendEmail extends CI_Model
{
  public function __construct()
  {
    parent::__construct();
    $this->apikey = $_ENV['SMTP_APIKEY'];
    $this->from_email = $_ENV['SMTP_FROM'];
  }

  function sendEmailCurl($parameter = array()){
    if(function_exists('curl_version')) {  

        // Set default values
        $parameter['from'] = $parameter['from'] ?? 'onlineform@proweaver.net';
        $parameter['from_name'] = $parameter['from_name'] ?? 'CAPOE, LLC';
        $parameter['dev_mode'] = $parameter['dev_mode'] ?? 0;  
        $parameter['mail_type'] = $parameter['mail_type'] ?? 1;  
        $parameter['debug'] = $parameter['debug'] ?? 0;  

        // Handle multiple recipients
        $parameter['to'] = (is_array($parameter['to'])) ? implode(',', $parameter['to']) : $parameter['to'];
      
        $ch = curl_init();     
        $mode = ($parameter['debug'] == 1) ? 'test_send_email' : 'send_email'; 
        $url = "https://proweaveremail.com/email/". $mode;

        curl_setopt($ch, CURLOPT_URL, $url);           
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);
        curl_setopt($ch, CURLOPT_POST, true);                        
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameter);

        $curlResponse = curl_exec($ch);
        if ($curlResponse === false) {
            // Handle curl error
            $error = curl_error($ch);
            curl_close($ch);
            return "Curl Error: $error";
        }

        $response = json_decode($curlResponse, true);

        // Close curl to free resources
        curl_close($ch);

        // Debug mode output
        if (!empty($parameter['debug']) && $parameter['debug'] == true) {
            echo "<pre>";               
            print_r($response);
            exit; // Exit only in debug mode
        }

        // Check if response is valid and contains 'response' key
        if (is_array($response) && isset($response['response']) && $response['response'] == 'sent') {
            return true;
        } else {
            return false;
        }

    } else {
        return false; // Return false if curl is not available
    }
}


//   function sendEmail($to_email, $subject, $body)
//   {
//     $sent = false;
//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, "https://api.postmarkapp.com/email");
//     curl_setopt($ch, CURLOPT_HTTPHEADER, [
//       'Accept: application/json',
//       'Content-Type: application/json',
//       'X-Postmark-Server-Token: ' . $this->apikey
//     ]);
//     curl_setopt($ch, CURLOPT_POST, 1);

//     $vars = array(
//       "From" => $this->from_email,
//       "To" => $to_email,
//       "Subject" => $subject,
//       "HtmlBody" => $body,
//       "MessageStream" => "outbound"
//     );
//     $vars = json_encode($vars);
//     curl_setopt($ch, CURLOPT_POSTFIELDS, $vars);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//     $result = curl_exec($ch);
//     $response = json_decode($result, true);
//     echo '<pre>';
//     print_r($response);
//     echo '</pre>';
//     exit;
//     if (curl_errno($ch)) {
//       echo 'Error:' . curl_error($ch);
//     }
//     curl_close($ch);

//     if (empty($response['results']['id'])) {
//       $sent = true;
//     }
//     return $sent;
//   }

  public function sendPenaltyToken($token, $receiver, $receivername, $title = 'Your missed your appointment!')
  {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $domain = $_SERVER['HTTP_HOST'];
    $baselink = $protocol . $domain;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "{$baselink}/pw-bookingapp/admin/constants.json");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    $sender = '';
    if (isset(json_decode($result)->senderName)) $sender = json_decode($result)->senderName;

    $html = '<div style="color:#000 !important;font-family:sans-serif;padding: 20px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa">
        <img style="display:block;margin:0 0 20px;max-width:100px" src="' . $baselink . '/pw-bookingapp/admin/main-logo.png" alt="" />
        <h3 style="margin: 10px 0 20px;color:#000">Hi ' . $receivername . ',</h3>
        <div style="margin-bottom:5px;color:#000">Unfortunately, <strong style="font-weight:700;">you missed your appointment</strong> with <strong style="font-weight:800;">Dr. Cecil Poe</strong>. You may follow the link below to check what action to take:</div>
        <a style="margin:20px 0;display:block;" href="https://www.capoecounselingllc.com/pw-bookapp-penalty?pwbookapp_token=' . $token . '" target="_blank">https://www.capoecounselingllc.com/pw-bookapp-penalty?pwbookapp_token=' . $token . '</a>
        Thank you for your attention to this matter.
        ';

    if ($sender != '') $html .= '<div style="color:#000;margin:20px 0 10px">Best Regards,</div><div style="margin:0;font-weight:800">' . $sender . '</div><strong style="color:#000;font-weight:800;display:block">Dr. Cecil Poe</strong>';
    else $html .= '<div style="margin:20px 0 10px">Sending our best regards!</div>';

    $html .= '</div>';

    $subjectSender = '';
    if ($sender != '') $subjectSender = ' | ' . $sender;
    $parameter = array(
        'subject' => $title . $subjectSender,
        'body' => $html,
        'to' => $receiver
    );
    $this->sendEmailCurl($parameter);
    // $this->sendEmail($receiver, $title . $subjectSender, $html);
  }

  public function sendReminder($inputs, $schedule, $receiver, $receivername, $title = 'Your Appointment is Pending Approval!')
  {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $domain = $_SERVER['HTTP_HOST'];
    $baselink = $protocol . $domain;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "{$baselink}/pw-bookingapp/admin/constants.json");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    $sender = '';
    if (isset(json_decode($result)->senderName)) $sender = json_decode($result)->senderName;

    $html = '<div style="color:#000 !important;font-family:sans-serif;padding: 20px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa">
        <img style="display:block;margin:0 0 20px;max-width:100px" src="' . $baselink . '/pw-bookingapp/admin/main-logo.png" alt="" />
        <h3 style="margin: 10px 0 20px;color:#000">Hi ' . $receivername . ',</h3>
        <div style="margin-bottom:5px;color:#000"> <strong style="font-weight:700;">This is to remind you about your appointment</strong> with <strong style="font-weight:800;">Dr. Cecil Poe</strong> which is scheduled for the date below. Please review your appointment details and inform us immediately of any errors or inconsistencies.</div>
        <h4 style="color:#000;margin:7px 0 0;font-weight:700;text-align:center">Schedule Details: </h4>
        <table style="border-collapse:collapse;margin:5px auto 10px;width:100%">';


    $html .= '<tr>
              <td style="width:40%;padding:4px 10px;border:1px solid #aaa">Appointment Type</td>
              <td style="padding:4px 10px;border:1px solid #aaa">' . $schedule->book_schedule_service . '</td>
          </tr>';

    $html .= '<tr>
              <td style="width:40%;padding:4px 10px;border:1px solid #aaa">Date</td>
              <td style="padding:4px 10px;border:1px solid #aaa">' . date('F d\, Y', strtotime($schedule->book_schedule_date)) . '</td>
          </tr>';

    $html .= '<tr>
              <td style="width:40%;padding:4px 10px;border:1px solid #aaa">Time</td>
              <td style="padding:4px 10px;border:1px solid #aaa">' . date('h:i a', strtotime($schedule->book_schedule_timestart)) . ' - ' . date('h:i a', strtotime($schedule->book_schedule_timeend)) . '</td>
          </tr>';


    $html .= '</table>
        <h4 style="color:#000;margin:0;font-weight:bold;text-align:center">Appointment Details: </h4>
        <table style="border-collapse:collapse;margin:10px auto 10px;width:100%">';
    for ($i = 0; $i < count($inputs); $i++) {
      $html .= '<tr>
            <td style="width:40%;padding:4px 10px;border:1px solid #aaa">' . $inputs[$i]->label . '</td>
            <td style="padding:4px 10px;border:1px solid #aaa">' . str_replace("\n", "<br>", $this->implodeIfArray($inputs[$i]->value)) . '</td>
          </tr>';
    }

    if ($sender != '') $html .= '</table><div style="color:#000;margin:20px 0 10px">Best Regards,</div><div style="margin:0;font-weight:800">' . $sender . '</div><strong style="color:#000;font-weight:800;display:block">Dr. Cecil Poe</strong>';
    else $html .= '<div style="margin:20px 0 10px">Sending our best regards!</div>';

    $html .= '</div>';

    $subjectSender = '';
    if ($sender != '') $subjectSender = ' | ' . $sender;
    $parameter = array(
        'subject' => $title . $subjectSender,
        'body' => $html,
        'to' => $receiver
    );
    $this->sendEmailCurl($parameter);
    // $this->sendEmail($receiver, $title . $subjectSender, $html);
  }

  private function implodeIfArray($value)
  {
    return is_array($value) ? implode(', ', $value) : $value;
  }

  public function sendNotification($inputs, $schedule, $receivers)
  {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $domain = $_SERVER['HTTP_HOST'];
    $baselink = $protocol . $domain;

    $html = '<div style="color:#000 !important;font-family:sans-serif;padding: 20px 20px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa;line-height:20px"> <img style="display:block;margin:0 auto;max-width: 100px;" src="' . $baselink . '/pw-bookingapp/admin/main-logo.png" alt=""/> <div style="margin-top:10px;letter-spacing:7px;text-transform:uppercase;color:#555;text-align:center"> Booking App</div><div style="font-weight:700;color:#000;margin-bottom:20px">Hi Dr. Cecil Poe:</div><div style="margin-bottom:5px;color:#000"> You received a client\'s submission through your appointment form. Please review the details below and take action on your admin panel to approve or deny the appointment. </div><h4 style="color:#000;margin:7px 0 0;font-weight:700;text-align:center">Schedule Details: </h4> <table style="border-collapse:collapse;margin:5px auto 10px;width:100%">';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Appointment</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . $schedule->book_schedule_service . '</td>';
    $html .= '</tr>';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Date</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . date('F d\, Y', strtotime($schedule->book_schedule_date)) . '</td>';
    $html .= '</tr>';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Time</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . date('h:i a', strtotime($schedule->book_schedule_timestart)) . ' - ' . date('h:i a', strtotime($schedule->book_schedule_timeend)) . '</td>';
    $html .= '</tr>';

    $html .= '</table>
      <h4 style="color:#000;margin:0;font-weight:bold;text-align:center">Appointment Details: </h4>

      <table style="border-collapse:collapse;margin:5px auto 10px;width:100%">';

    for ($i = 0; $i < count($inputs); $i++) {
      $html .= '<tr>';
      $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">' . $inputs[$i]->label . '</td>';
      $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . str_replace("\n", "<br>", $this->implodeIfArray($inputs[$i]->value)) . '</td>';
      $html .= '</tr>';
    }

    $html .= '</table>

      <a href="' . $baselink . '/pw-bookingapp/admin/appointments?date=' . $schedule->book_schedule_date . '" style="all:unset;text-decoration:none;cursor:pointer;padding:10px;display:block;background:#fc3c32;color:#fff;width:max-content;margin:0 auto;border-radius:5px;border-bottom:2px solid #972e29" target="_blank" rel="noreferrer noopenner nofollower">Click Here To Open Your Flexible Scheduling Admin Dashboard</a>

      </div>';
    
    $parameter = array(
        'subject' => 'You have a new notification! | CAPOE, LLC',
        'body' => $html
    );
    for ($i = 0; $i < count($receivers); $i++) {
        $parameter['to'] = $receivers[$i];
        $this->sendEmailCurl($parameter);
    //   $sent = $this->sendEmail($receivers[$i], 'You have a new notification! | Proweaver appointment App', $html);
    }
  }

  public function sendUserNotifPending($inputs, $schedule, $receiver, $receivername, $title = 'Your Appointment is Pending Approval!')
  {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $domain = $_SERVER['HTTP_HOST'];
    $baselink = $protocol . $domain;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "{$baselink}/pw-bookingapp/admin/constants.json");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    $sender = '';
    if (isset(json_decode($result)->senderName)) $sender = json_decode($result)->senderName;
    $html = '<div style="color:#000 !important;font-family:sans-serif;padding: 20px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa">
      <img style="display:block;margin:0 0 10px;max-width:100px" src="' . $baselink . '/pw-bookingapp/admin/main-logo.png" alt="" />
      <h3 style="margin: 10px 0 20px;color:#000">Hi ' . $receivername . ',</h3>
      <div style="margin-bottom:5px;color:#000">
        You are making an appointment with <strong style="font-weight:800">Dr. Cecil Poe</strong>. We have received it and our team is processing it. Your appointment is currently pending approval. Please review your appointment details below and inform us immediately of any errors or inconsistencies.
      </div>
      <h4 style="color:#000;margin:7px 0 0;font-weight:700;text-align:center">Schedule Details: </h4>

      <table style="border-collapse:collapse;margin:5px auto 10px;width:100%">';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Service</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . $schedule->book_schedule_service . '</td>';
    $html .= '</tr>';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Date</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . date('F d\, Y', strtotime($schedule->book_schedule_date)) . '</td>';
    $html .= '</tr>';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Time</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . date('h:i a', strtotime($schedule->book_schedule_timestart)) . ' - ' . date('h:i a', strtotime($schedule->book_schedule_timeend)) . '</td>';
    $html .= '</tr>';

    $html .= '</table>
      <h4 style="color:#000;margin:0;font-weight:bold;text-align:center">Appointment Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 10px;width:100%">';


    for ($i = 0; $i < count($inputs); $i++) {
      $html .= '<tr>';
      $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">' . $inputs[$i]->label . '</td>';
      $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . str_replace("\n", "<br>", $this->implodeIfArray($inputs[$i]->value)) . '</td>';
      $html .= '</tr>';
    }

    $html .= '</table>
      <div style="margin-bottom:5px;color:#000">We will send you a notification as soon as your appointment is confirmed by <strong style="font-weight:800;">Dr. Cecil Poe</strong>!</div>

      <div style="text-align: center;color:#f00 !important;padding: 5px 10px;width: max-content;margin: 0 auto;">
        <div style="line-height:18px;color:#f00">All Appointments Can Be Scheduled And Managed By Zoom </div>
        <div style="line-height:18px;color:#f00">Ip = (In-Person Appointments) Are Scheduled Based On Availability </div>  
        <div style="line-height:18px;color:#f00">You Must Request In-Person</div>
      </div>

      <strong style="font-weight: 700; text-align: center;display: block;color:#000">“Continuous efforts supporting our Clients to successfully achieve their goals.”</strong>

      <div style="border:1px solid #555;margin-top: 10px;padding: 5px 10px;text-align: center;">
        <div style="margin-bottom:5px;color:#000">PLEASE INCLUDE COPIES OF FRONT AND BACK OF ACCEPTABLE INSURANCE CARDS FOR BILLING AND COPAY PER VISIT AND FULL DATE OF BIRTH</div>
        <div style="margin-bottom:5px;color:#000">
            <strong style="display:block">Aetna, Cigna, Humana, Molina = In Network *** Out of Network = United Healthcare</strong>
        </div>
      </div>
      ';

    if ($sender != '') $html .= '<div style="color:#000;margin:20px 0 10px">Best Regards,</div><div style="margin:0;font-weight:700">' . $sender . '</div><strong style="color:#000;font-weight:800;display:block">Dr. Cecil Poe</strong>';
    else $html .= '<div style="margin:20px 0 10px">Thank you!</div>';

    $html .= '</div>';

    $subjectSender = '';
    if ($sender != '') $subjectSender = ' | ' . $sender;
    $parameter = array(
        'subject' => $title . $subjectSender,
        'body' => $html,
        'to' => $receiver
    );
    $this->sendEmailCurl($parameter);
    // $this->sendEmail($receiver, $title . $subjectSender, $html);
  }

  public function sendUserNotifApproved($inputs, $schedule, $receiver, $receivername, $title = 'Your Appointment is CONFIRMED!')
  {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $domain = $_SERVER['HTTP_HOST'];
    $baselink = $protocol . $domain;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "{$baselink}/pw-bookingapp/admin/constants.json");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    $sender = '';
    if (isset(json_decode($result)->senderName)) $sender = json_decode($result)->senderName;
    $html = '<div style="color:#000 !important;font-family:sans-serif;padding: 20px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa"> <img style="display:block;margin:0 0 20px;max-width:100px" src="' . $baselink . '/pw-bookingapp/admin/main-logo.png" alt=""/> <h3 style="margin: 10px 0 20px;color:#000">Hi ' . $receivername . ',</h3> <div style="margin-bottom:5px;color:#000"> Your appointment with <strong style="font-weight:800;">Dr. Cecil Poe</strong> is confirmed. Please review your appointment details below and inform us immediately of any errors or inconsistencies. </div><h4 style="color:#000;margin:7px 0 0;font-weight:700;text-align:center">Schedule Details: </h4> <table style="border-collapse:collapse;margin:5px auto 10px;width:100%">';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Appointment</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . $schedule->book_schedule_service . '</td>';
    $html .= '</tr>';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Date</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . date('F d\, Y', strtotime($schedule->book_schedule_date)) . '</td>';
    $html .= '</tr>';

    $html .= '<tr>';
    $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Time</td>';
    $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . date('h:i a', strtotime($schedule->book_schedule_timestart)) . ' - ' . date('h:i a', strtotime($schedule->book_schedule_timeend)) . '</td>';
    $html .= '</tr>';

    $html .= '</table>
      <h4 style="color:#000;margin:0;font-weight:bold;text-align:center">Appointment Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 10px;width:100%">';

    for ($i = 0; $i < count($inputs); $i++) {
      $html .= '<tr>';
      $html .= '<td style="width:40%;padding:4px 10px;border:1px solid #aaa">' . $inputs[$i]->label . '</td>';
      $html .= '<td style="padding:4px 10px;border:1px solid #aaa">' . str_replace("\n", "<br>", $this->implodeIfArray($inputs[$i]->value)) . '</td>';
      $html .= '</tr>';
    }

    $html .= '</table>';

    if ($sender != '') $html .= '<div style="color:#000;margin:20px 0 10px">Best Regards,</div><div style="margin:0;font-weight:800">' . $sender . '</div><strong style="color:#000;font-weight:800;display:block">Dr. Cecil Poe</strong>';
    else $html .= '<div style="margin:20px 0 10px">Sending our best regards!</div>';

    $html .= '</div>';

    $subjectSender = '';
    if ($sender != '') $subjectSender = ' | ' . $sender;
    $parameter = array(
        'subject' => $title . $subjectSender,
        'body' => $html,
        'to' => $receiver
    );
    $this->sendEmailCurl($parameter);
    // $this->sendEmail($receiver, $title . $subjectSender, $html);
  }

  public function sendUserNotifDenied($receiver, $receivername, $schedule, $inputs, $title = 'Your Appointment is Denied')
  {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $domain = $_SERVER['HTTP_HOST'];
    $baselink = $protocol . $domain;
    $serviceName = '';

    for ($i = 0; $i < count($inputs); $i++) {
      if ($inputs[$i]->id != 'li0cw0no-0.wjegfvzfa1e') continue;
      $serviceName = $inputs[$i]->value;
    }


    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "{$baselink}/pw-bookingapp/admin/constants.json");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    $sender = '';
    if (isset(json_decode($result)->senderName)) $sender = json_decode($result)->senderName;
    $html = '<div style="color: #000 !important; font-family: sans-serif; padding: 20px; margin: 10px auto; box-shadow: 0 1px 5px #ccc; border-radius: 10px; max-width: 800px; width: 90%; background: #fafafa;"> <img style="display: block; margin: 0 0 20px; max-width: 100px;" src="' . $baselink . '/pw-bookingapp/admin/main-logo.png" alt=""/> <h3 style="margin: 10px 0 20px; color: #000 !important;">Hi ' . $receivername . ',</h3> <div style="font-weight: 700; color: #000 !important; margin: 0 0 20px;">I regret to inform you that due to unforeseen circumstances, the ' . date('F d\, Y', strtotime($schedule->book_schedule_date)) . ' appointment scheduled for (' . $schedule->book_schedule_service . ' - ' . $serviceName . ') at ' . date('h:i a', strtotime($schedule->book_schedule_timestart)) . ' - ' . date('h:i a', strtotime($schedule->book_schedule_timeend)) . ' time slot you have chosen is <strong style="text-decoration: underline; color: #f00;">NOT</strong> available. </div><div style="margin: 0 0 20px; font-weight: bold; color: #000 !important"> Please make a selection <strong style="color: #f00;">for the next available schedule</strong>, you can choose <strong style="color: #f00;">Multiple dates</strong> and submit your choices for confirmation. </div><div style="color: #000 !important; margin: 0 0 20px;">If you have any questions or concerns about your appointment, please do not hesitate to contact us. I\'m always here to help.</div><div style="margin-bottom: 5px; color: #000 !important;">Thank you for choosing our service. I look forward to seeing you soon.</div>';
    // $html.='';
    // <!-- <strong>Email your choice(s): to </strong><a href="mailto:capcivic@att.net" style="font-weight: bold;">capcivic@att.net </a> -->

    if ($sender != '') $html .= '<div style="color:#000 !important;margin:20px 0 10px">Best Regards,</div><div style="margin:0;font-weight:800;color:#000 !important">' . $sender . '</div><strong style="color:#000;font-weight:800;display:block; color:#000 !important">Dr. Cecil Poe</strong>';
    else $html .= '<div style="margin:20px 0 10px">Sending our best regards!</div>';

    $html .= '</div>';

    $subjectSender = '';
    if ($sender != '') $subjectSender = ' | ' . $sender;
    $parameter = array(
        'subject' => $title . $subjectSender,
        'body' => $html,
        'to' => $receiver
    );
    $this->sendEmailCurl($parameter);
    // $this->sendEmail($receiver, $title . $subjectSender, $html);
  }
}
