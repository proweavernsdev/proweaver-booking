<?php

class Utils extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function response($success,$msg=null,$result=null){
        $response = array('success'=>$success);
        if(isset($msg)) $response['msg'] = $msg;
        if(isset($result)) $response['result'] = $result;
        echo json_encode($response);
    }

}