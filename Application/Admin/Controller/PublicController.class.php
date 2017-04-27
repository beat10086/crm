<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/4
 * Time: 14:00
 */
namespace Admin\Controller;
use Common\Model\UserModel;
/*
 * 后台控制器
 * //http://localhost/root/crm/index.php?s=/Admin/Public/login.html
 */
class  PublicController extends \Think\Controller{
    protected  $code=200;
    protected  $message='操作成功！';
    //登录
    public  function Login (){
          if(IS_POST){
                $code=(new UserModel())->login(I('post.accounts'),I('post.password'));
                if($code>0){
                     $this->responseSuccess();
                   }else{
                     $this->responseError($code);
                }
                exit();
             }else{
              if(session('admin')){
                  $this->redirect('Index/index');
                 }else{
                  $this->display();
              }
          }

      }
    public  function  responseSuccess ($data=null) {
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
    //退出
    public  function out (){
        $param = array(
            'user'     =>session('admin')['accounts'].'('.session('admin')['staff_name'].')',
            'type_name'=>'退出操作',
            'module'   =>'人事管理 >> 登录帐号',
            'ip'       =>get_client_ip()
        );
        tag('log', $param);
        session('admin',null);
        $this->redirect('/Admin/Public/login');
    }
}