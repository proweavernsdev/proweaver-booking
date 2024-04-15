<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pwauth');


class Forms extends CI_Controller{
    public function __construct(){
        parent::__construct();
        
        $this->load->model('app-models/FormsModel');
        $this->load->model('TokenModel');
        $this->load->model('Utils');
    }

    public function create(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->FormsModel->create($this->input->post());
    }

    public function fetch(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->FormsModel->fetch($this->input->get());
    }

    public function fetchLight(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->FormsModel->fetchLight($this->input->get());
    }

    public function update(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->FormsModel->update($this->input->get('id'),$this->input->post());
    }

    public function delete(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->FormsModel->delete($this->input->get('id'));
    }





}
?>