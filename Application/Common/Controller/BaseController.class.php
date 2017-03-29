<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/11
 * Time: 13:20
 */
namespace Common\Controller;


use Think\Auth;
use Think\Controller;

class  BaseController extends  Controller  {
    protected  $code=200;
    protected  $message='操作成功！';
    //执行默认方法
    protected  function  _initialize ()   {
           $auth=new Auth();
           if(!$auth->check(CONTROLLER_NAME,session('admin')['id'])){
               exit('<p style="color:red;padding:10px;font-size:14px;">对不起，您没有权限访问此模块！</p>');
           }
    }
    public  function  responseSuccess ($data) {
         $res['code']   =$this->code;
         $res['message']=$this->message;
         $res['data']   =$data;
         $this->ajaxReturn($res);
    }
    public  function  responseError ($code,$data) {
        $res['code']=$code;
        $res['message']='操作失败！';
        $res['data']=$data;
        $this->ajaxReturn($res);
    }
    //显示模板
    public function index () {
         if($_SESSION['admin']){
               $this->display();
            }else{
              $this->redirect('/Admin/Public/login');
             exit();
         }
    }
    //空方法
    public function _empty () {
             $this->redirect('/Admin/Public/login');
    }
}