<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 17:23
 */

namespace Admin\Controller;


use Common\Model\UserModel;
use Think\Controller;

class UserController  extends  Controller
{
    public  function index () {
          $this->display();
    }
    //获取所有的用户信息
    public  function  getList () {
        if(IS_AJAX) {
            $userData = (new UserModel())->getList(
                                                    I('post.page'), I('post.rows'), I('post.order'),
                                                    I('post.sort'), I('post.keywords'),
                                                    I('post.date'), I('post.date_from'),
                                                    I('post.date_to'), I('post.state'));
            $this->ajaxReturn($userData);
        }
    }
}