<?php

// require_once(APPPATH.'libraries/PHPMailer/PHPMailerAutoload.php');

class SendEmail extends CI_Model{
    public function __construct(){
      parent::__construct();
      $this->apikey = $_ENV['SMTP_APIKEY'];
      $this->from_email = $_ENV['SMTP_FROM'];
    }

    function sendEmail($to_email, $subject, $body) {
      $sent = false;
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL,"https://api.postmarkapp.com/email");
      curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
        'X-Postmark-Server-Token: '.$this->apikey
      ]);
      curl_setopt($ch, CURLOPT_POST, 1);

      $vars = array(
        "From" => $this->from_email,
        "To" => $to_email,
        "Subject" => $subject,
        "HtmlBody" => $body,
        "MessageStream" => "outbound"
      );
      $vars = json_encode($vars);
      curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      $result = curl_exec($ch);
      $response = json_decode($result, true);
      if (curl_errno($ch)) {
          echo 'Error:' . curl_error($ch);
      }
      curl_close($ch);
  
      if (empty($response['results']['id'])) {
        $sent = true;
      }
      return $sent;
    }

    public function sendNotification($inputs,$schedule,$receivers){
      $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
      $domain = $_SERVER['HTTP_HOST'];
      $baselink = (!empty($_ENV['ADMIN_URL'])) ? $_ENV['ADMIN_URL'] : $protocol . $domain . '/pw-bookingapp/admin';

      $html='<div style="font-family:sans-serif;padding: 50px 20px;text-align:center;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa">
      <img style="display:block;margin:0 auto" src="'.$baselink.'/main-logo.png" alt="" />
      <p style="margin-top:10px;letter-spacing:7px;text-transform:uppercase;color:#555"> Booking App</p>
      <p>
      Great news! You received a client\'s submission through your appointment form. Please review the details below and take action on your admin panel to approve or deny the appointment.
      </p>
      <h4 style="text-align:center;margin:20px 0 0">Schedule Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 20px;width:100%">';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Service</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$schedule->book_schedule_service.'</td>';
      $html.='</tr>';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Date</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.date('F d\, Y',strtotime($schedule->book_schedule_date)).'</td>';
      $html.='</tr>';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Time</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.date('h:i a',strtotime($schedule->book_schedule_timestart)).' - '.date('h:i a',strtotime($schedule->book_schedule_timeend)).'</td>';
      $html.='</tr>';

      $html.='</table>
      <h4 style="text-align:center;margin:0">Appointment Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 20px;width:100%">';

      for($i=0;$i<count($inputs);$i++){
          $html.='<tr>';
          $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$inputs[$i]->label.'</td>';
          $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$inputs[$i]->value.'</td>';
          $html.='</tr>';
      }

      $html.='</table>

      <a href="'.$baselink.'/appointments?date='.$schedule->book_schedule_date.'" style="all:unset;text-decoration:none;cursor:pointer;padding:10px;display:block;background:#fc3c32;color:#fff;width:max-content;margin:0 auto;border-radius:5px;border-bottom:2px solid #972e29" target="_blank" rel="noreferrer noopenner nofollower">Open in your Admin Panel</a>

      </div>';

      for($i = 0; $i < count($receivers); $i++){
        $this->sendEmail($receivers[$i], 'You have a new notification! | Proweaver Appointment App', $html);
      }
    }

    public function sendUserNotifPending($inputs,$schedule,$receiver){
      $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
      $domain = $_SERVER['HTTP_HOST'];
      $baselink = (!empty($_ENV['ADMIN_URL'])) ? $_ENV['ADMIN_URL'] : $protocol . $domain . '/pw-bookingapp/admin';

      $sender = $_ENV['COMP_NAME'];
      
      $html='<div style="font-family:sans-serif;padding: 50px 20px 30px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa">
      <img style="display:block;margin:0 auto 30px;max-width:250px" src="'.$baselink.'/main-logo.png" alt="" />
      <h3>Dear Valued Client,</h3>
      <p>
      Thank you for choosing our service and submitting your appointment request. We have received it and our team is processing it. Your appointment is currently pending confirmation.
      </p>
      <p>
      Please review your appointment details below and inform us immediately of any errors or inconsistencies.
      </p>
      <h4 style="margin:20px 0 0">Schedule Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 20px;width:100%">';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Service</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$schedule->book_schedule_service.'</td>';
      $html.='</tr>';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Date</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.date('F d\, Y',strtotime($schedule->book_schedule_date)).'</td>';
      $html.='</tr>';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Time</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.date('h:i a',strtotime($schedule->book_schedule_timestart)).' - '.date('h:i a',strtotime($schedule->book_schedule_timeend)).'</td>';
      $html.='</tr>';

      $html.='</table>
      <h4 style="margin:0">Appointment Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 0;width:100%">';

      for($i=0;$i<count($inputs);$i++){
          $html.='<tr>';
          $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$inputs[$i]->label.'</td>';
          $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$inputs[$i]->value.'</td>';
          $html.='</tr>';
      }

      $html.='</table>
      <p>We will send you a notification as soon as your appointment is confirmed by our team!</p>';

      if($sender != '') $html.= '<p style="margin:30px 0 10px">Best Regards,</p><p style="margin:0">'.$sender.'</p>';
      else $html.= '<p style="margin:30px 0 10px">Thank you!</p>';

      $html.='</div>';

      $subjectSender = '';
      if($sender != '') $subjectSender = ' | '.$sender;

      $this->sendEmail($receiver, 'You\'re Appointment is Pending Confirmation!'.$subjectSender, $html);
    }

    public function sendUserNotifApproved($inputs,$schedule,$receiver){
      $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
      $domain = $_SERVER['HTTP_HOST'];
      $baselink = (!empty($_ENV['ADMIN_URL'])) ? $_ENV['ADMIN_URL'] : $protocol . $domain . '/pw-bookingapp/admin';

      $sender = $_ENV['COMP_NAME'];
      
      $html='<div style="font-family:sans-serif;padding: 50px 20px 30px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa">
      <img style="display:block;margin:0 auto 30px;max-width:250px" src="'.$baselink.'/main-logo.png" alt="" />
      <h3>Dear Valued Client,</h3>
      <p>
          We are excited to inform you that your appointment has been confirmed by our team. Please take note of the important details below to ensure that you don\'t miss it.
      </p>
      <h4 style="margin:20px 0 0">Schedule Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 20px;width:100%">';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Service</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$schedule->book_schedule_service.'</td>';
      $html.='</tr>';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Date</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.date('F d\, Y',strtotime($schedule->book_schedule_date)).'</td>';
      $html.='</tr>';

      $html.='<tr>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">Time</td>';
      $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.date('h:i a',strtotime($schedule->book_schedule_timestart)).' - '.date('h:i a',strtotime($schedule->book_schedule_timeend)).'</td>';
      $html.='</tr>';

      $html.='</table>
      <h4 style="margin:0">Appointment Details: </h4>

      <table style="border-collapse:collapse;margin:10px auto 0;width:100%">';

      for($i=0;$i<count($inputs);$i++){
          $html.='<tr>';
          $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$inputs[$i]->label.'</td>';
          $html.='<td style="padding:7px 15px;border:1px solid #aaa">'.$inputs[$i]->value.'</td>';
          $html.='</tr>';
      }

      $html.='</table>
      <p>If you have any questions or concerns about your appointment, please do not hesitate to contact us. We are always here to help.</p>
      <p>Thank you for choosing our service. We look forward to seeing you soon.</p>';

      if($sender != '') $html.= '<p style="margin:30px 0 10px">Best Regards,</p><p style="margin:0">'.$sender.'</p>';
      else $html.= '<p style="margin:30px 0 10px">Sending our best regards!</p>';

      $html.='</div>';

      $subjectSender = '';
      if($sender != '') $subjectSender = ' | '.$sender;

      $this->sendEmail($receiver, 'You\'re Appointment is APPROVED!'.$subjectSender, $html);
    }
}


?>