<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/11
 * Time: 10:41
 */
namespace  Admin\Controller;

use Common\Controller\BaseController;
use Common\Model\PostModel;
//职位控制器
class  PostController extends  BaseController {
   //初始化页面
   public  function  Index () {
         $this->display();
   }
   //获取职位的数据
   public  function  getList (){
            if(IS_AJAX){
                $postDate=(new PostModel())->getList();
                $this->ajaxReturn($postDate);
            }else{
                 $this->error('非法操作!');
            }
   }
   //添加职位
   public  function  register () {
      if(IS_AJAX){
              $res=(new PostModel())->register(I('post.name'));
              if($res>0){
                     $this->responseSuccess();
              }else{
                     $this->responseError($res);
              }
         }else{
              $this->error('非法操作!');
      }
   }
}