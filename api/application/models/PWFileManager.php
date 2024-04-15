<?php

class PWFileManager extends CI_Model{

    public function __construct(){
        parent::__construct();
    }

    public function viewfiles($path){
        $this->load->helper('directory');

        $res = directory_map(FCPATH.'filesystem/'.$path);
        // if($res == false && gettype($res) != 'array'){
        //     mkdir(FCPATH.'filesystem/'.$path,0777);
        //     $res = directory_map(FCPATH.'filesystem/'.$path);
        // }

        $response = array('success' => $res != false);
        if($res != false) $response['result'] = $res;
        else $response['msg'] = 'path not found';
        
        return $response;
    }

    public function upload($params,$data,$file){
        if(!isset($data['keep_filename'])) {
            $new_name = '4angelshc-'.date('Y-m-d_H-i-s');
        }
        $dname = explode(".", $file['file']['name']);
        $path = (isset($params['path'])) ? $params['path'] : '';
        $ext = end($dname);
        $types = 'gif|jpg|png|jpeg'; 

        if(isset($params['type'])){
            switch($params['type']){
                case 'image': $types = 'jpg|png|jpeg'; break;
                case 'document': $types = 'doc|docx|pdf'; break;
            }
        }

        $config['upload_path'] = FCPATH.'filesystem/'.$path;
        $config['allowed_types'] = $types;
        $config['max_size'] = '25000';
        $config['overwrite'] = TRUE;
        $config['encrypt_name'] = FALSE;
        $config['remove_spaces'] = TRUE;
        if(!isset($params['keep_filename'])) {
            $config['file_name'] = $new_name;
        }
        else{ 
            if($params['keep_filename'] == 'true')
                $config['file_name'] = $dname[0];
            else
                $config['file_name'] = $new_name;
        }

        if ( ! is_dir($config['upload_path']) ) die("THE UPLOAD DIRECTORY DOES NOT EXIST");
            $this->load->library('upload', $config);

        if ( ! $this->upload->do_upload('file')) {
            $errString = $this->upload->display_errors();
            $errString = str_replace('<p>','',$errString);
            $errString = str_replace('</p>','',$errString);
            return array(
                'success'=>false,
                'msg'=>$errString
            );
        } else {
            return array(
                'success'=>true,
                'file_name'=>$config['file_name'].'.'.$ext
            );
        }
    }

    public function deletefile($path){
        $this->load->helper('file');
        unlink(FCPATH.'filesystem/'.$path);
    }
}

?>