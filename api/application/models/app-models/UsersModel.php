<?php

class UsersModel extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model('Utils');
        $this->load->model('TokenModel');
    }

    public function login($username,$password){
        $res = $this->db
        ->from('book_users')
        ->where(array('book_users_username'=>$username))
        ->get()->result();

        if(count($res) == 0){
            return $this->Utils->response(false,'Username/Password did not match!');
        }

        $res = $res[0];

        if(!password_verify($password,$res->book_users_password))
            return $this->Utils->response(false,'Username/Password did not match!');
        
        return $this->Utils->response(true,null,array(
            'token' => $this->TokenModel->generate($res->book_users_id)
        ));
    }

    public function newpassword($userid,$oldpassword,$newpassword){
        $res = $this->db
        ->from('book_users')
        ->where(array('book_users_id'=>$userid))
        ->get()->result()[0];

        $updateQuery = $this->db->set(
            array(
                'book_users_password' => password_hash($newpassword,PASSWORD_DEFAULT)
            )
        )->where('book_users_id',$userid)->update('book_users');
        

        $res = $this->db->affected_rows();

        if($this->db->affected_rows() <= 0)
            return $this->Utils->response(false,'password update failed');
        
        return $this->Utils->response(true,'password update success');
    }
}
?>