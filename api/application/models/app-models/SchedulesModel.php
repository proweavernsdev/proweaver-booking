<?php

class SchedulesModel extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model('Utils');
        $this->load->model('TokenModel');
        $this->load->model('app-models/AppointmentsModel');
    }

    public function create($post){
        $this->db->insert('book_schedule', $post);

        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'insertion failed');
        return $this->Utils->response(true,'insertion success');
    }

    public function fetch($where){
        $this->db->from('book_schedule');
        foreach($where as $w=>$v){
            $matches = array();
            preg_match('/^[a-z]+_[a-z_]+/',$w,$matches);
            if(count($matches) == 0) continue;
            $this->db->where($w,$v);
        }


        $res = $this->db->get()->result();
        if(count($res) == 0)
            return $this->Utils->response(false,'fetch failed');
        else
            return $this->Utils->response(true,null,$res);
    }

    public function fetchWithAppointments($where){
        $this->db->from('book_schedule');
        foreach($where as $w=>$v){
            $matches = array();
            preg_match('/^[a-z]+_[a-z_]+/',$w,$matches);
            if(count($matches) == 0) continue;
            $this->db->where($w,$v);
        }


        $res = $this->db->get()->result();

        for($i = 0; $i<count($res); $i++){
            $this->db->from('book_appointment');
            $this->db->where('book_appointment_scheduleid', $res[$i]->book_schedule_id);
            $res[$i]->appointments = $this->db->get()->result();
        }



        if(count($res) == 0)
            return $this->Utils->response(false,'fetch failed');
        else
            return $this->Utils->response(true,null,$res);
    }

    public function fetchAvailable($where){
        $this->db->from('book_schedule')->where('book_schedule_status',0);
        foreach($where as $w=>$v){
            $this->db->where($w,$v);
        }

        $res = $this->db->get()->result();

        if(count($res) == 0)
            return $this->Utils->response(false,'fetch failed');

        for($i=0;$i<count($res);$i++){
            $j = (array) $res[$i];
            $res2 = $this->db->from('book_appointment')
            ->where('book_appointment_scheduleid',$j['book_schedule_id'])
            ->where('book_appointment_status',1)
            ->select('count(*)')
            ->get()->result_array();
            $res[$i]->count_appointments = $res2[0]['count(*)'];
            $res[$i]->is_full = $res2[0]['count(*)'] >= $res[$i]->book_schedule_maxappointment;
            
        }   

        return $this->Utils->response(true,null,$res);

        // $this->AppointmentsModel->fetch(ar)
    }

    public function availableSchedulesWithinMonth($month,$year,$service=''){
        $from = date('Y-m-d',strtotime($year.'-'.$month.'-01'));
        $to = date('Y-m-d',strtotime($year.'-'.$month.'-01 +1 months'));
        
        $this->db->from('book_schedule')->where('book_schedule_status',0);

        if($service != '') $this->db->where('book_schedule_service',$service);
        $res = $this->db->where('book_schedule_date >= ',$from)
        ->where('book_schedule_date < ',$to)
        ->select('count(*),book_schedule_date,book_schedule_id')
        ->group_by('book_schedule_date')
        ->get()->result();

        if(count($res) == 0)
            return $this->Utils->response(false,'fetch failed');
        else
            $this->Utils->response(true,null,$res);

    }

    public function update($id,$post){
        $this->db->trans_start();
        $this->db
        ->set($post)
        ->where(array('book_schedule_id' => $id))
        ->update('book_schedule');
        $this->db->trans_complete();

        if($this->db->affected_rows() <= 0) {
            if($this->db->trans_status() === false) return $this->Utils->response(false,'update failed');
            else return $this->Utils->response(true,'update success');
        }
        return $this->Utils->response(true,'update success');
    }

    public function delete($id){
        $this->db
        ->where(array('book_schedule_id' => $id))
        ->delete('book_schedule');
        
        
        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'deletion failed');
        
        return $this->Utils->response(true,'deletion success');
    }

    public function advancedDelete($date_start, $date_end, $service, $days, $time_slots){

        $this->db->select('book_schedule_id');
        $this->db->from('book_schedule');
        $this->db->where('book_schedule_date >=', $date_start);
        $this->db->where('book_schedule_date <=', $date_end);
        if($service != 'all') $this->db->where('book_schedule_service', $service);



        $this->db->group_start();
            $this->db->where('DAYOFWEEK(book_schedule_date)', $days[0]+1);

            for($i=1;$i<count($days);$i++)
                $this->db->or_where('DAYOFWEEK(book_schedule_date)', $days[$i]+1);
            
        $this->db->group_end();



        $this->db->group_start();
            $this->db->group_start();
                $this->db->where('book_schedule_timestart', $time_slots[0]->time_start);
                $this->db->where('book_schedule_timeend', $time_slots[0]->time_end);
            $this->db->group_end();

            for($i=1;$i<count($time_slots);$i++){
                $this->db->or_group_start();
                    $this->db->where('book_schedule_timestart', $time_slots[$i]->time_start);
                    $this->db->where('book_schedule_timeend', $time_slots[$i]->time_end);
                $this->db->group_end();
            }

        $this->db->group_end();
        
        $compiledQuery = $this->db->get()->result();
        
        
        for($i=0;$i<count($compiledQuery);$i++){
            $this->db->where('book_appointment_scheduleid', $compiledQuery[$i]->book_schedule_id);
            $this->db->delete('book_appointment');
        }


        for($i=0;$i<count($compiledQuery);$i++){
            $this->db->where('book_schedule_id', $compiledQuery[$i]->book_schedule_id);
            $this->db->delete('book_schedule');
        }
    
        

    }
}
?>