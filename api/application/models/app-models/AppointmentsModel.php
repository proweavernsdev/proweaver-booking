<?php

class AppointmentsModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Utils');
        $this->load->model('TokenModel');
        $this->load->model('SendEmail');
        if(EMAIL_TEST_MODE){
            $this->emailHiddenBCC = array('prospteam@gmail.com');
        } else {
            $this->emailHiddenBCC = array('lei@proweaver.net', 'drcecilapoe@capoecounselingllc.com');
        }
    }

    public function fetchFiltered($post)
    {
        $this->db->from('book_appointment')
            ->join('book_schedule', 'book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid')
            ->limit($post['results'], $post['offset']);

        $post_includeStatus = json_decode('[' . $_POST['includeStatus'] . ']');

        if (strpos($post['orderBy'], '%orderdir%') !== false) {
            $this->db->order_by(str_replace('%orderdir%', $post['orderDir'], $post['orderBy']));
        } else {
            $this->db->order_by($post['orderBy'] . ' ' . $post['orderDir']);
        }

        if ($post['includeDate'] == 'true') {
            $this->db->where('book_schedule_date >=', $post['date']);
            $this->db->where('book_schedule_date <', $post['dateEnd']);
        }

        if ($post['includeFinished'] == 'false')
            $this->db->where('book_schedule_date >=', date('Y-m-d'));

        if (isset($post['excludeAheadAppointments']))
            $this->db->where('book_schedule_date <=', $post['excludeAheadAppointments']);

        if (isset($post['searchWord']) && !empty($_POST['searchWord'])) {
            $this->db->like('book_appointment_name', $post['searchWord']);
            $this->db->or_like('book_appointment_servicesname', $post['searchWord']);
        }

        // echo json_encode($post_includeStatus);

        if ($post_includeStatus[0] === true || $post_includeStatus[1] === true || $post_includeStatus[2] === true) $this->db->group_start();
        if ($post_includeStatus[0] === true) $this->db->or_where('book_appointment_status', 1);
        if ($post_includeStatus[1] === true) $this->db->or_where('book_appointment_status', 2);
        if ($post_includeStatus[2] === true) $this->db->or_where('book_appointment_status', 3);
        if ($post_includeStatus[0] === true || $post_includeStatus[1] === true || $post_includeStatus[2] === true) $this->db->group_end();

        $results = $this->db->get()->result();

        $this->db->from('book_appointment')
            ->join('book_schedule', 'book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid');

        if ($post['includeDate'] == 'true')
            $this->db->where('book_schedule_date', $post['date']);

        if ($post['includeFinished'] == 'false')
            $this->db->where('book_schedule_date >=', date('Y-m-d'));

        if (isset($post['excludeAheadAppointments']))
            $this->db->where('book_schedule_date <=', $post['excludeAheadAppointments']);

        if (isset($post['searchWord']) && !empty($_POST['searchWord'])) {
            $this->db->like('book_appointment_name', $post['searchWord']);
            $this->db->or_like('book_appointment_servicesname', $post['searchWord']);
        }


        if ($post_includeStatus[0] || $post_includeStatus[1] || $post_includeStatus[2]) $this->db->group_start();
        if ($post_includeStatus[0] === true) $this->db->or_where('book_appointment_status', 1);
        if ($post_includeStatus[1] === true) $this->db->or_where('book_appointment_status', 2);
        if ($post_includeStatus[2] === true) $this->db->or_where('book_appointment_status', 3);
        if ($post_includeStatus[0] || $post_includeStatus[1] || $post_includeStatus[2]) $this->db->group_end();

        $count = $this->db->select('count(*) as count')->get()->row()->count;

        if (!isset($count))
            return $this->Utils->response(false, 'fetch failed');

        return $this->Utils->response(true, null, array(
            'appointments' => $results,
            'count' => $count
        ));
    }

    public function sendReminder($id)
    {
        $res = (array) $this->db
            ->from('book_appointment')
            ->join('book_schedule', 'book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid')
            ->where(array('book_appointment_id' => $id))->get()->row();

        $scheduleDetails = [];
        foreach ($res as $key => $value)
            if (strpos($key, 'book_schedule_') >= 0)
                $scheduleDetails[$key] = $value;



        $scheduleDetails = (object) $scheduleDetails;
        $inputs = json_decode($scheduleDetails->book_appointment_custominputs);
        $reminderCount = intval($res['book_appointment_reminder']);
        $reminderCount++;

        foreach ($this->emailHiddenBCC as $emailToReceive)
            $this->SendEmail->sendReminder($inputs, $scheduleDetails, $scheduleDetails->book_appointment_name, 'See What Your Client Received (Reminder)');

        $this->SendEmail->sendReminder($inputs, $scheduleDetails, $scheduleDetails->book_appointment_email, $scheduleDetails->book_appointment_name, $title = 'Appointment Reminder!');

        $this->db->trans_start();
        $this->db
            ->set(array('book_appointment_reminder' => $reminderCount))
            ->where(array('book_appointment_id' => $id))
            ->update('book_appointment');
        $this->db->trans_complete();

        if ($this->db->affected_rows() <= 0) {
            if ($this->db->trans_status() === false) return $this->Utils->response(false, 'reminder failed');
            else return $this->Utils->response(true, 'reminder success');
        }
        return $this->Utils->response(true, 'reminder success');
    }


    public function create($post)
    {
        $scheduleFetch = $this->db->from('book_schedule')
            ->where('book_schedule_id', $post['book_appointment_scheduleid'])
            ->get()->result();

        $inputs = json_decode($post['book_appointment_custominputs']);
        $receivers = (EMAIL_TEST_MODE) ? ["prospteam@gmail.com"] : $post['form_receivers'];
        if ($receivers != null) {
            $this->SendEmail->sendNotification($inputs, $scheduleFetch[0], $receivers);
        }
        
        if (isset($post['book_appointment_email'])  && $post['book_appointment_email'] != '') {
            // $this->SendEmail->sendUserNotifPending($inputs,$scheduleFetch[0],$post['book_appointment_email'],$post['book_appointment_name']);
            // foreach($this->emailHiddenBCC as $emailToReceive)
            //     $this->SendEmail->sendUserNotifPending($inputs,$scheduleFetch[0],$emailToReceive,$post['book_appointment_name'], 'See What Your Client Received (Pending)');

            $this->SendEmail->sendUserNotifApproved($inputs, $scheduleFetch[0], $post['book_appointment_email'], $post['book_appointment_name']);

            foreach ($this->emailHiddenBCC as $emailToReceive)
                $this->SendEmail->sendUserNotifApproved($inputs, $scheduleFetch[0], $emailToReceive, $post['book_appointment_name'], 'See What Your Client Received (Approved)');
        }


        unset($post['form_receivers']);
        $this->db->insert('book_appointment', $post);
        if ($this->db->affected_rows() <= 0) return $this->Utils->response(false, 'insertion failed');
        return $this->Utils->response(true, 'insertion success');
    }

    public function fetch($where, $orderby = null, $dir = null)
    {
        $this->db->from('book_appointment');
        if ($orderby != null) $this->db->order_by($orderby, $dir);

        foreach ($where as $w => $v) {
            $this->db->where($w, $v);
        }
        $this->db->join('book_schedule', 'book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid');

        $res = $this->db->get()->result();

        if (count($res) == 0)
            return $this->Utils->response(false, 'fetch failed');
        else
            return $this->Utils->response(true, null, $res);
    }

    public function changeStatus($id, $status)
    {
        $res = $this->db
            ->from('book_appointment')
            ->join('book_schedule', 'book_schedule.book_schedule_id=book_appointment.book_appointment_scheduleid')
            ->where(array('book_appointment_id' => $id))->get()->result();

        if (in_array($status, [1, '1']) && $res[0]->book_appointment_email != '') {
            $this->SendEmail->sendUserNotifApproved(json_decode($res[0]->book_appointment_custominputs), $res[0], $res[0]->book_appointment_email, $res[0]->book_appointment_name);
            foreach ($this->emailHiddenBCC as $emailToReceive)
                $this->SendEmail->sendUserNotifApproved(json_decode($res[0]->book_appointment_custominputs), $res[0], $emailToReceive, $res[0]->book_appointment_name, 'See What Your Client Received (Approved)');
        }

        if (in_array($status, [2, '2']) && $res[0]->book_appointment_email != '') {
            $this->SendEmail->sendUserNotifDenied($res[0]->book_appointment_email, $res[0]->book_appointment_name, $res[0], json_decode($res[0]->book_appointment_custominputs));
            foreach ($this->emailHiddenBCC as $emailToReceive)
                $this->SendEmail->sendUserNotifDenied($emailToReceive, $res[0]->book_appointment_name, $res[0], json_decode($res[0]->book_appointment_custominputs), 'See What Your Client Received (Denied)');
        }

        $this->db->trans_start();
        $this->db
            ->set(array('book_appointment_status' => $status))
            ->where(array('book_appointment_id' => $id))
            ->update('book_appointment');
        $this->db->trans_complete();

        if ($this->db->affected_rows() <= 0) {
            if ($this->db->trans_status() === false) return $this->Utils->response(false, 'update failed');
            else return $this->Utils->response(true, 'update success');
        }
        return $this->Utils->response(true, 'update success');
    }

    public function update($id, $post)
    {
        $this->db->trans_start();
        $this->db
            ->set($post)
            ->where(array('book_appointment_id' => $id))
            ->update('book_appointment');
        $this->db->trans_complete();

        if ($this->db->affected_rows() <= 0) {
            if ($this->db->trans_status() === false) return $this->Utils->response(false, 'update failed');
            else return $this->Utils->response(true, 'update success');
        }
        return $this->Utils->response(true, 'update success');
    }

    public function delete($id)
    {
        $this->db
            ->where(array('book_appointment_id' => $id))
            ->delete('book_appointment');

        if ($this->db->affected_rows() <= 0) return $this->Utils->response(false, 'deletion failed');
        return $this->Utils->response(true, 'deletion success');
    }

    public function sendPenaltyToken($id, $token, $amount)
    {
        $res = $this->db
            ->where('book_appointment_id', $id)
            ->get('book_appointment')->row();

        if (empty($res->book_appointment_email)) {
            die(json_encode([
                'success' => false,
                'msg' => 'Email is empty!'
            ]));
        }

        $this->db
            ->set('book_appointment_token', $token)
            ->set('book_appointment_amount', $amount)
            ->where('book_appointment_id', $id)
            ->update('book_appointment');

        $this->SendEmail->sendPenaltyToken($token, $res->book_appointment_email, $res->book_appointment_name);
    }

    public function recordPenaltyPayment($id, $captureId, $amount, $date)
    {
        $this->db
            ->set('book_appointment_paid', $amount)
            ->set('book_appointment_captureid', $captureId)
            ->set('book_appointment_paid_at', $date)
            ->where('book_appointment_id', $id)
            ->update('book_appointment');
    }
}
