<?php
    /* Version 2.0 */
    
    class TokenModel extends CI_Model{
        private $key;

        public function __construct(){
            parent::__construct();
            $this->load->helper('cookie');
            $this->key = $_ENV['TOKEN_PASS'];
        }

        private function encrypt($data){
            $enckey = base64_decode($this->key);
            $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
            $encrypted = openssl_encrypt($data,'aes-256-cbc',$enckey,0,$iv);
            return base64_encode($encrypted . '::' . $iv);
        }

        public function decrypt($data){
            $enckey = base64_decode($this->key);
            list($encrypted_data,$iv) = array_pad(explode('::',base64_decode($data),2),2,null);
            return openssl_decrypt($encrypted_data, 'aes-256-cbc',$enckey,0,$iv);
        }

        public function generate($user_id,$opts=array()){
            $token = array(
                'pwauth_id' => $user_id,
                'expired_at' => date("Y-m-d H:i:s", strtotime(date("Y-m-d H:i:s"). '+1 month')),
            );
            foreach($opts as $k => $v) $token[$k] = $v;
            $token = $this->encrypt(json_encode($token));
            $token = rtrim($token,'==');
            return $token;
        }

        public function validate($token){
            $info = $this->get_info($token);
            if(!$info) return 'malformed token';
            if(strtotime(date('Y-m-d H:i:s')) >= strtotime($info['expired_at'])) return 'expired token';
            return true;
        }

        public function validateSyntax($token){
            $token .= '==';
            $token = (array) json_decode($this->decrypt($token));
            return isset($token['pwauth_id']);
        }

        public function get_info($token){
            $validateSyntax = $this->validateSyntax($token);
            if(!$validateSyntax) return false;
            $token = (array) json_decode($this->decrypt($token));
            return $token;
        }

        
    }
