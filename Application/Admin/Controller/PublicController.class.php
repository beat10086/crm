<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/4
 * Time: 14:00
 */
namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\UserModel;
/*
 * 后台控制器
 * //http://localhost/root/crm/index.php?s=/Admin/Public/login.html
 */
class  PublicController extends  BaseController{
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
    //退出
    public  function out (){
        session('admin',null);
        $this->redirect('/Admin/Public/login');
    }
}