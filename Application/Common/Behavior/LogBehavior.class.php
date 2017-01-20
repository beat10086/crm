<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/20
 * Time: 16:27
 */
namespace Common\Behavior;


use Think\Behavior;

class LogBehavior extends  Behavior {
     public  function  run (&$param) {
         $Log = D('Log');
         $Log->register($param['user'], $param['type'], $param['module'], $param['ip']);
     }
}