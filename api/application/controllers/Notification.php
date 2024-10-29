<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pwauth');

class Notification extends CI_Controller{
    public function __construct(){
        parent::__construct();
        $_ENV = (array) json_decode(file_get_contents('ciapi.config.json',true));
        $this->load->model('app-models/NotificationModel');
        $this->load->model('Utils');
        $this->load->model('TokenModel');
        $this->load->model('SendEmail');
    }

    public function logPayment(){
        $post = $this->input->post(['amount','payer_paypal_id','notif_receiver','payer_name']);
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $domain = $_SERVER['HTTP_HOST'];
        $baselink = $protocol . $domain;

        $html='<div style="color:#000 !important;font-family:sans-serif;padding: 20px 20px;margin:10px auto;box-shadow:0 1px 5px #ccc;border-radius:10px;max-width:800px;width:90%;background:#fafafa;line-height:20px"> <img style="display:block;margin:0 auto;max-width: 100px;" src="'.$baselink.'/pw-bookingapp/admin/main-logo.png" alt=""/> <div style="margin-top:10px;letter-spacing:7px;text-transform:uppercase;color:#555;text-align:center"> Booking App</div><div style="font-weight:700;color:#000;margin-bottom:20px">Hi Dr. Cecil Poe:</div><div style="margin-bottom:5px;color:#000"> You received a payment from a customer. You may check the information about the payment below: </div><h4 style="color:#000;margin:15px 0 0;font-weight:700;">Payment Details: </h4><table style="border-collapse:collapse;margin:5px auto 10px;width:100%">';

        $html.='<tr>';
        $html.='<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Payer ID</td>';
        $html.='<td style="padding:4px 10px;border:1px solid #aaa">'.$post['payer_paypal_id'].'</td>';
        $html.='</tr>';

        $html.='<tr>';
        $html.='<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Payer Name</td>';
        $html.='<td style="padding:4px 10px;border:1px solid #aaa">'.$post['payer_name'].'</td>';
        $html.='</tr>';

        $html.='<tr>';
        $html.='<td style="width:40%;padding:4px 10px;border:1px solid #aaa">Amount</td>';
        $html.='<td style="padding:4px 10px;border:1px solid #aaa">'.number_format(floatval($post['amount']),2).'</td>';
        $html.='</tr>';

        $html.= '</table></div>';

        $this->SendEmail->sendEmail($post['notif_receiver'], 'Online Payment Received | CAPOE LLC ',$html);
    }

    public function create(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->NotificationModel->create($this->input->post());
    }

    public function fetch(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->NotificationModel->fetch($this->input->get());
    }

    public function update(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->NotificationModel->update($this->input->get('id'),$this->input->post());
    }

        public function delete(){
            // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
            // if($tokencheck !== true){
            //     $this->Utils->response(false,$tokencheck);
            //     return;
            // }

        $this->NotificationModel->delete($this->input->get('id'));
    }
}
