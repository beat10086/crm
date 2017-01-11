<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/11
 * Time: 13:20
 */
namespace Common\Controller;


use Think\Controller;

class  BaseController extends  Controller  {
    protected  $code=200;
    protected  $message='操作成功！';
    public  function  responseSuccess ($data) {
         $res['code']=$this->code;
         $res['message']=$this->message;
         $res['data']=$data;
         $this->ajaxReturn($res);
    }
    public  function  responseError ($code,$data) {
        $res['code']=$code;
        $res['message']='操作失败！';
        $res['data']=$data;
        $this->ajaxReturn($res);
    }
}