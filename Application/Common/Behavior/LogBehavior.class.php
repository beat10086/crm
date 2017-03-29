<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/20
 * Time: 16:27
 */
namespace Common\Behavior;

use Common\Model\LogModel;
use Think\Behavior;

class LogBehavior extends  Behavior {
     public  function  run (&$param) {
         $Log = new  LogModel();
         $Log->register($param['user'], $param['type_name'], $param['module'], $param['ip']);
     }
}