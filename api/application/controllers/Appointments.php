<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pwauth');


class Appointments extends CI_Controller{
    public function __construct(){
        parent::__construct();
        
        $this->load->model('app-models/AppointmentsModel');
        $this->load->model('TokenModel');
        $this->load->model('Utils');
    }

    public function changeStatus(){
        $this->AppointmentsModel->changeStatus($this->input->get('id'),$this->input->post('status'));
    }

    public function create(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        // echo json_encode($this->input->post());

        $this->AppointmentsModel->create($this->input->post());
    }

    public function createSchedAndAppointment(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        // echo json_encode($this->input->post());

        $this->AppointmentsModel->createSchedAndAppointment($this->input->post());
    }

    public function fetchFiltered(){
        $post = $this->input->post();

        $this->AppointmentsModel->fetchFiltered($this->input->post());
    }

    public function fetch(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }
        $get = $this->input->get();
        $orderby = null;
        $dir = null;

        if(isset($get['orderby'])){
            $orderby = $get['orderby'];
            $dir = $get['direction'];
            if($dir==''||$dir==null)  $this->Utils->response(false,'direction is null');
            unset($get['orderby']);
            unset($get['direction']);
        }

        $this->AppointmentsModel->fetch($get,$orderby,$dir);
    }

    public function update(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->AppointmentsModel->update($this->input->get('id'),$this->input->post());
    }

    public function delete(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->AppointmentsModel->delete($this->input->get('id'));
    }
}