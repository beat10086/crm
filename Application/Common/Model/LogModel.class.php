<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/8
 * Time: 11:36
 */
namespace  Common\Model;


use Think\Model;

class LogModel extends  Model {
    //添加日志
    public function register ($user,$type,$module,$ip) {
             $data=array(
                  "user"       =>$user,
                  "type"       =>$type,
                  "module"     =>$module,
                  "ip"         =>$ip,
                  "create_time"=>get_time()
             );
            $this->add($data);
    }
}