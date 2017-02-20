<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 17:23
 */

namespace Admin\Controller;


use Common\Controller\BaseController;
use Common\Model\UserModel;

class UserController  extends  BaseController
{
    //获取所有的用户信息
    public  function  getList () {
        if(IS_AJAX) {
            $userData = (new UserModel())->getList( I('post.page'), I('post.rows'), I('post.order'),
                                                    I('post.sort'), I('post.keywords'),
                                                    I('post.date'), I('post.date_from'),
                                                    I('post.date_to'), I('post.state'));
            $this->ajaxReturn($userData);
        }
    }
    //获取一条账号
    public function getUser () {
         if(IS_AJAX){
              $userData=(new UserModel())->getUser(I('post.id'));
              $this->ajaxReturn($userData);
           }else{
              $this->error('非法操作!');
         }
    }
    //添加用户
    public  function register () {
      if(IS_AJAX){
          $code=(new UserModel())->register(I('post.accounts'), I('post.password'), I('post.email'), I('post.uid'), I('post.name'));
          if($code>0){
                 $this->responseSuccess();
                }else{
                 $this->responseError($code);
          }
        }else{
          $this->error('非法操作!');
      }
    }
    //修改账号
    public function  update () {
           if(IS_AJAX){
                $code=(new UserModel())->update(I('post.id'), I('post.password'), I('post.email'),
                                                I('post.state'),I('post.staff_id'),I('post.staff_name'));
                if($code>0){
                      $this->responseSuccess();
                  }else{
                      $this->responseError($code);
                }
              }else{
                $this->eror('非法操作!');
           }
    }
    //删除用户
    public  function  remove (){
           $code=(new UserModel())->remove(I('post.ids'));
           if($code>0){
                 $this->responseSuccess();
           }else{
                 $this->responseError($code);
           }
    }
    //设置用户状态
    public function state (){
        $code=(new UserModel())->state(I('post.id'),I('post.state'));
        if($code>0){
            $this->responseSuccess();
        }else{
            $this->responseError($code);
        }
    }
    //获取用户详情
    public  function getDetails () {
        if(IS_AJAX){
            (new UserModel())->getDetails(I('get.id'));
           }else{
            $this->eror('非法操作!');
        }

    }
}