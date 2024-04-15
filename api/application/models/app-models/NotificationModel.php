<?php

class NotificationModel extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model('Utils');
    }

    public function create($post){
        $this->db->insert('book_emails', $post);

        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'insertion failed');
        return $this->Utils->response(true,'insertion success');
    }

    public function fetch($where){
        $this->db->from('book_emails');
        foreach($where as $w=>$v){
            $this->db->where($w,$v);
        }

        $res = $this->db->get()->result();

        if(count($res) == 0)
            return $this->Utils->response(false,'fetch failed');
        else
            return $this->Utils->response(true,null,$res);
    }

    public function update($id,$post){
        $this->db->trans_start();
        $this->db
        ->set($post)
        ->where(array('book_email_id' => $id))
        ->update('book_emails');
        $this->db->trans_complete();

        if($this->db->affected_rows() <= 0) {
            if($this->db->trans_status() === false) return $this->Utils->response(false,'update failed');
            else return $this->Utils->response(true,'update success');
        }
        return $this->Utils->response(true,'update success');
    }

    public function delete($id){
        $this->db
        ->where(array('book_email_id' => $id))
        ->delete('book_emails');
        
        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'deletion failed');
        return $this->Utils->response(true,'deletion success');
    }
}
?>