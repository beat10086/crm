<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/4/5
 * Time: 19:59
 */
namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\AuthGroupModel;

class AuthController extends  BaseController  {
   //获取权限列表
   public  function  getList (){
       if (IS_AJAX)
           {
               $Auth = new AuthGroupModel();
               $object=$Auth->getList(I('post.page'), I('post.rows'), I('post.sort'), I('post.order'),
                   I('post.keywords'), I('post.dateType'), I('post.dateFrom'), I('post.dateTo'));
               $this->ajaxReturn($object);
           } else {
               $this->error('非法操作！');
           }
   }

}