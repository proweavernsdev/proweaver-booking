<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function __construct(){
		parent::__construct();
		

        $this->load->model('TokenModel');
		$this->tm = $this->TokenModel;

        $this->load->model('PWFileManager');
		$this->fm = $this->PWFileManager;

        $this->load->model('SendEmail');
		$this->se = $this->SendEmail;

        $this->load->model('Crypto');
		$this->crp = $this->Crypto;
		
		$this->get = $this->input->get();
		$this->post = $this->input->post();

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST");
	}



	public function index()
	{
		echo phpversion();
	}
}
