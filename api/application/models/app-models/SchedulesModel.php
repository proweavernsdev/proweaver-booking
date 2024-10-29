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
        $lastAddedId = $post['book_schedule_id'];
        if($post['book_schedule_special_status'] == '1'){
            $this->db->insert('book_appointment', array(
                'book_appointment_status' => 1,
                'book_appointment_servicesname' => $post['book_schedule_service'],
                'book_appointment_scheduleid' => $lastAddedId,
                'book_appointment_name' => $post['book_schedule_appointee'],
                'book_appointment_custominputs' => json_encode(array(
                    array(
                        "id" => "default_name",
                        "label"=> "Name",
                        "value" => $post['book_schedule_appointee']
                    )
                ))
            ));

            $this->db
            ->set(array( 'book_schedule_reserve_id' => $this->db->insert_id() ))
            ->where(array('book_schedule_id' => $lastAddedId))
            ->update('book_schedule');
        }


        

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
            ->group_start()
                ->where('book_appointment_status',1)
                ->or_where('book_appointment_status',3 )
            ->group_end()
            ->select('count(*)')
            ->get()->result_array();
            

            $resCheckConflict = $this->db->from('book_schedule')
            ->where('book_schedule_status',0)
            ->where('book_schedule_date',$j['book_schedule_date'])
            ->where('book_schedule_timestart',$j['book_schedule_timestart'])
            ->where('book_schedule_timeend',$j['book_schedule_timeend'])
            ->where('book_schedule_id !=',$j['book_schedule_id'])
            ->get()->result();

            $conflicts = 0;
            
            for($x=0;$x<count($resCheckConflict);$x++){
                $y = (array) $resCheckConflict[$x];
                $conflicts = $this->db->from('book_appointment')
                ->where('book_appointment_scheduleid',$y['book_schedule_id'])
                ->group_start()
                    ->or_where('book_appointment_status',0)
                    ->or_where('book_appointment_status',1)
                    ->or_where('book_appointment_status',3)
                ->group_end()
                ->count_all_results(); 
            }

            $res[$i]->count_appointments = $res2[0]['count(*)'];
            $res[$i]->conflicts = $conflicts;
            $res[$i]->is_full = $res2[0]['count(*)'] >= $res[$i]->book_schedule_maxappointment || $conflicts > 0;
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
        $res = $this->db
        ->where(array('book_schedule_id' => $post['book_schedule_id']))
        ->from('book_schedule')
        ->get()->result()[0];

        

        if($post['book_schedule_special_status'] == 1 && $res->book_schedule_reserve_id == null){
            $this->db->insert('book_appointment', array(
                'book_appointment_status' => 1,
                'book_appointment_servicesname' => $post['book_schedule_service'],
                'book_appointment_scheduleid' => $post['book_schedule_id'],
                'book_appointment_name' => $post['book_schedule_appointee'],
                'book_appointment_custominputs' => json_encode(array(
                    array(
                        "id" => "default_name",
                        "label"=> "Name",
                        "value" => $post['book_schedule_appointee']
                    )
                ))
            ));

            $post['book_schedule_reserve_id'] = $this->db->insert_id();

        }else if($post['book_schedule_special_status'] == 1 && $post['book_schedule_appointee'] != $res->book_schedule_appointee){
            $this->db
            ->set(array(
                'book_appointment_name' => $post['book_schedule_appointee'],
                'book_appointment_custominputs' => json_encode(array(
                    array(
                        "id" => "default_name",
                        "label"=> "Name",
                        "value" => $post['book_schedule_appointee']
                    )
                ))
            ))
            ->where(array('book_appointment_id' => $res->book_schedule_reserve_id))
            ->update('book_appointment');
        }else if($post['book_schedule_special_status'] != 1 && $res->book_schedule_reserve_id != null){
            $this->db
            ->where(array('book_appointment_id' => $res->book_schedule_reserve_id))
            ->delete('book_appointment');

            $post['book_schedule_reserve_id'] = NULL;
            $post['book_schedule_appointee'] = NULL;
        }

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
        $res = $this->db
        ->where(array('book_schedule_id' => $id))
        ->from('book_schedule')
        ->get()->result()[0];

        if($res->book_schedule_reserve_id != null){
            $this->db
            ->where(array('book_appointment_id' => $res->book_schedule_reserve_id))
            ->delete('book_appointment');
        }
        
        
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