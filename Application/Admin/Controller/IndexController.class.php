<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 15:45
 */
namespace  Admin\Controller;
use Common\Model\NavModel;
use Think\Controller;

class IndexController extends  Controller {
      //显示页面
      public  function index () {
               $this->display();
      }
      //获取分类
      public  function   getNav  () {
         if(IS_AJAX){
               $navData=(new NavModel())->getNav();
               $this->ajaxReturn($navData);
           }

      }
}