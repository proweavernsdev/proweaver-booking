<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pwauth');


class Schedules extends CI_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model('app-models/SchedulesModel');
        $this->load->model('TokenModel');
        $this->load->model('Utils');
    }

    public function create(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }
        $postData = $this->input->post();
        $datetimeStart = $this->input->post('book_schedule_date', TRUE).' '.$this->input->post('book_schedule_timestart', TRUE);
        $datetimeEnd = $this->input->post('book_schedule_date', TRUE).' '.$this->input->post('book_schedule_timeend', TRUE);
        $newDateTimeStart = new DateTime($datetimeStart);
        $newDateTimeEnd = new DateTime($datetimeEnd);
        if ($newDateTimeStart->format('I') == 1) {
            // DST is in effect, subtract 1 hour
            $newDateTimeStart->modify('-1 hour');
            $newDateTimeEnd->modify('-1 hour');
            $postData['book_schedule_timestart'] = $newDateTimeStart->format('H:i');
            $postData['book_schedule_timeend'] = $newDateTimeEnd->format('H:i');
        }
        $this->SchedulesModel->create($postData);
    }

    public function fetch(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->SchedulesModel->fetch($this->input->get());
    }

    public function fetchWithAppointments(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->SchedulesModel->fetchWithAppointments($this->input->get());
    }

    public function availableSchedulesWithinMonth(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->SchedulesModel->availableSchedulesWithinMonth($this->input->get('month'),$this->input->get('year'),$this->input->get('service'));
    }

    public function fetchAvailable(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->SchedulesModel->fetchAvailable($this->input->get());
    }

    public function update(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }
        $postData = $this->input->post();
        $datetimeStart = $this->input->post('book_schedule_date', TRUE).' '.$this->input->post('book_schedule_timestart', TRUE);
        $datetimeEnd = $this->input->post('book_schedule_date', TRUE).' '.$this->input->post('book_schedule_timeend', TRUE);
        $newDateTimeStart = new DateTime($datetimeStart);
        $newDateTimeEnd = new DateTime($datetimeEnd);
        if ($newDateTimeStart->format('I') == 1) {
            // DST is in effect, subtract 1 hour
            $newDateTimeStart->modify('-1 hour');
            $newDateTimeEnd->modify('-1 hour');
            $postData['book_schedule_timestart'] = $newDateTimeStart->format('H:i');
            $postData['book_schedule_timeend'] = $newDateTimeEnd->format('H:i');
        }
        $this->SchedulesModel->update($this->input->get('id'), $postData);
    }

    public function delete(){
        // $tokencheck = $this->TokenModel->validate($this->input->request_headers()['Pwauth']);
        // if($tokencheck !== true){
        //     $this->Utils->response(false,$tokencheck);
        //     return;
        // }

        $this->SchedulesModel->delete($this->input->get('id'));
    }

    public function advancedDelete(){
        $filterJSON = json_decode($this->input->post('filterJSON'));

        $this->SchedulesModel->advancedDelete(
            $filterJSON->date_start,
            $filterJSON->date_end,
            $filterJSON->service,
            $filterJSON->days,
            $filterJSON->timeSlots
        );
    }





}
?>