<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 15:45
 */
namespace  Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\NavModel;


class IndexController extends  BaseController {
      //获取分类
      public  function   getNav  () {
         if(IS_AJAX){
               $navData=(new NavModel())->getNav();
               $this->ajaxReturn($navData);
           }

      }
}