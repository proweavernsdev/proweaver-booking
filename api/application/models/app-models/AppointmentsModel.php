<?php

class AppointmentsModel extends CI_Model{
    public function __construct(){
        parent::__construct();
        $this->load->model('Utils');
        $this->load->model('TokenModel');
        $this->load->model('SendEmail');
        $this->load->model('app-models/SchedulesModel');
    }

    public function fetchFiltered($post){

        $order = str_replace("%orderdir%", $post['orderDir'], $post['orderBy']);



        $this->db->from('book_appointment')
        ->join('book_schedule','book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid')
        ->order_by($order)
        ->limit($post['results'],$post['offset']);

        if($post['includeDate'] == 'true')
            $this->db->where('book_schedule_date',$post['date']);

        if($post['includeFinished'] == 'false')
            $this->db->where('book_schedule_date >=',date('Y-m-d'));
        
        $results = $this->db->get()->result();

        
        

        $this->db->from('book_appointment')
        ->join('book_schedule','book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid')
        ->order_by($order);

        if($post['includeDate'] == 'true')
            $this->db->where('book_schedule_date',$post['date']);

        if($post['includeFinished'] == 'false')
            $this->db->where('book_schedule_date >=',date('Y-m-d'));
        
        $count = $this->db->select('count(*)')->get()->result()[0];
        $count = (array) $count;

        if(count($results) == 0)
            return $this->Utils->response(false,'fetch failed');
        

        return $this->Utils->response(true,null,array(
            'appointments' => $results,
            'count' => $count['count(*)']
        ));
        
    }

    public function create($post){
        
        $scheduleFetch = $this->db->from('book_schedule')
        ->where('book_schedule_id',$post['book_appointment_scheduleid'])
        ->get()->result();
        
        $inputs = json_decode($post['book_appointment_custominputs']);
        $receivers = json_decode($post['form_receivers']);
        if($receivers != null) $this->SendEmail->sendNotification($inputs,$scheduleFetch[0],$receivers);
        if(isset($post['book_appointment_email'])  && $post['book_appointment_email'] != '' ) $this->SendEmail->sendUserNotifPending($inputs,$scheduleFetch[0],$post['book_appointment_email']);
        unset($post['form_receivers']);
        $this->db->insert('book_appointment', $post);
        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'insertion failed');
        return $this->Utils->response(true,'insertion success');
    }
// cr6vhy-yfnjyi-s0bn1p
    public function createSchedAndAppointment($post){
        $formDeclarations = json_decode($post['form_declarations']);
        $formInputArray = json_decode($post['book_appointment_custominputs']);
        $formInput = [];

        foreach($formInputArray as $val){
            $formInput[$val->id] = (object)[
                'label' => $val->label,
                'value' => $val->value
            ];
        }


        $scheduleId = base_convert(rand(0,getrandmax()),10,36).'-'.base_convert(rand(0,getrandmax()),10,36).'-'.base_convert(time(),10,36);
        $scheduleDate = date('Y-m-d',strtotime(rtrim($formInput[$formDeclarations->dateIndex]->value)));
        $scheduleTimeArray = explode(' ', rtrim($formInput[$formDeclarations->dateIndex]->value));
        $scheduleTimeStart = '';
        $scheduleTimeEnd = '';


        if(count($scheduleTimeArray) == 1){
            $datetime = new DateTime($scheduleTimeArray[0].' 00:00:00');
            $scheduleTimeStart = $datetime->format('Y-m-d H:i:s');
            $datetime = new DateTime($scheduleTimeArray[0].' 00:00:00');
            $scheduleTimeEnd = $datetime->modify('+23 hours +59 minutes')->format('Y-m-d H:i:s');
        }else{
            $scheduleTimeStart = $formInput[$formDeclarations->dateIndex]->value;
            $datetime = new DateTime($formInput[$formDeclarations->dateIndex]->value);
            $scheduleTimeEnd = $datetime->modify('+30 minutes')->format('Y-m-d H:i:s');
        }


        $newSchedule = [
            'book_schedule_id' => $scheduleId,
            'book_schedule_date' => date('Y-m-d',strtotime(rtrim($formInput[$formDeclarations->dateIndex]->value))),
            'book_schedule_timestart' => $scheduleTimeStart,
            'book_schedule_timeend' => $scheduleTimeEnd,
            'book_schedule_maxappointment' => 1,
            'book_schedule_color' => '#000',
            'book_schedule_service' => $formInput[$formDeclarations->servTypeIndex]->value,
            'book_schedule_status' => 0,
            'book_schedule_special_status' => 1
        ];

        $this->db->insert('book_schedule', $newSchedule);
        
    
        // $scheduleFetch = $this->db->from('book_schedule')
        // ->where('book_schedule_id',$post['book_appointment_scheduleid'])
        // ->get()->result();
        
        $inputs = json_decode($post['book_appointment_custominputs']);
        $receivers = isset($formDeclarations->notifEmails) ? $formDeclarations->notifEmails : null;
        if($receivers != null) $this->SendEmail->sendNotification($inputs,$scheduleFetch[0],$receivers);
        if(isset($post['book_appointment_email'])  && $post['book_appointment_email'] != '' ) $this->SendEmail->sendUserNotifPending($inputs,$scheduleFetch[0],$post['book_appointment_email']);
        unset($post['form_declarations']);
        $post['book_appointment_scheduleid'] = $scheduleId;
        $post['book_appointment_servicesname'] = $formInput[$formDeclarations->servTypeIndex]->value;
        $this->db->insert('book_appointment', $post);
        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'insertion failed');
        return $this->Utils->response(true,'insertion success');
    }

    public function fetch($where,$orderby=null,$dir=null){
        $this->db->from('book_appointment');
        if($orderby != null) $this->db->order_by($orderby, $dir);

        foreach($where as $w=>$v){
            $this->db->where($w,$v);
        }
        $this->db->join('book_schedule','book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid');

        $res = $this->db->get()->result();

        if(count($res) == 0)
            return $this->Utils->response(false,'fetch failed');
        else
            return $this->Utils->response(true,null,$res);
    }

    public function changeStatus($id,$status){
        $res = $this->db
        ->from('book_appointment')
        ->join('book_schedule','book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid')
        ->where(array('book_appointment_id' => $id))->get()->result();

        if(in_array($status,[1,'1']) && $res[0]->book_appointment_email != '') {
            $this->SendEmail->sendUserNotifApproved(json_decode($res[0]->book_appointment_custominputs),$res[0],$res[0]->book_appointment_email);
        }

        $this->db->trans_start();
        $this->db
        ->set(array('book_appointment_status'=>$status))
        ->where(array('book_appointment_id' => $id))
        ->update('book_appointment');
        $this->db->trans_complete();

        if($this->db->affected_rows() <= 0) {
            if($this->db->trans_status() === false) return $this->Utils->response(false,'update failed');
            else return $this->Utils->response(true,'update success');
        }
        return $this->Utils->response(true,'update success');
    }

    public function update($id,$post){
        $this->db->trans_start();
        $this->db
        ->set($post)
        ->where(array('book_appointment_id' => $id))
        ->update('book_appointment');
        $this->db->trans_complete();

        if($this->db->affected_rows() <= 0) {
            if($this->db->trans_status() === false) return $this->Utils->response(false,'update failed');
            else return $this->Utils->response(true,'update success');
        }
        return $this->Utils->response(true,'update success');
    }

    public function delete($id){
        $this->db
        ->where(array('book_appointment_id' => $id))
        ->delete('book_appointment');
        
        if($this->db->affected_rows() <= 0) return $this->Utils->response(false,'deletion failed');
        return $this->Utils->response(true,'deletion success');
    }
}
