<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pwauth');


class Users extends CI_Controller{
    public function __construct(){
        parent::__construct();
        
        $this->load->model('app-models/UsersModel');
        $this->load->model('TokenModel');
        $this->load->model('Utils');

    }

    public function login(){
        $this->UsersModel->login($this->input->post('username'),$this->input->post('password'));
    }

    private function testpassword($userid,$password){
        $res = $this->db
        ->from('book_users')
        ->where(array('book_users_id'=>$userid))
        ->get()->result();

        if(count($res) == 0){
            return false;
        }

        $res = $res[0];

        if(!password_verify($password,$res->book_users_password))
            return false;
        
        return true;
    }

    public function newpassword(){

        if(!$this->testpassword($this->input->post('id'),$this->input->post('oldpassword'))){
            echo json_encode(array(
                'success'=>false,
                'msg'=>'Password is not correct!'
            ));
            return;
        }

        $this->UsersModel->newpassword(
            $this->input->post('id'),
            $this->input->post('oldpassword'),
            $this->input->post('newpassword')
        );
    }
}