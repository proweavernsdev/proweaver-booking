<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pwauth');


class Extensions extends CI_Controller{
    public function __construct(){
        parent::__construct();
        
        $this->load->model('app-models/ExtensionsModel');
        $this->load->model('TokenModel');
        $this->load->model('Utils');
    }

    public function create(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->ExtensionsModel->create($this->input->post());
    }

    public function fetch(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->ExtensionsModel->fetch($this->input->get());
    }

    public function update(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->ExtensionsModel->update($this->input->get('id'),$this->input->post());
    }

    public function delete(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->ExtensionsModel->delete($this->input->get('id'));
    }





}
?>