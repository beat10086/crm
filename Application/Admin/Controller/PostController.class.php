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
                $postDate=(new PostModel())->getList(I('post.page'),I('post.rows'),I('post.name'),
                                                     I('post.order'), I('post.sort'),I('post.date'),
                                                     I('post.date_from'), I('post.date_to'));
                $this->ajaxReturn($postDate);
            }else{
                 $this->error('非法操作!');
            }
   }
   //添加职位
   public  function  register () {
      if(IS_AJAX){
              $code=(new PostModel())->register(I('post.name'));
              if($code>0){
                     $this->responseSuccess();
              }else{
                     $this->responseError($code);
              }
         }else{
              $this->error('非法操作!');
      }
   }
   //获取1条职位信息
   public function  getPost  () {
       if(IS_AJAX){
               $data=(new PostModel())->getPost(I('post.id'));
               if($data>0){
                   $this->responseSuccess($data);
               }else{
                   $this->responseError($data);
               }
          }else{
           $this->error('非法操作!');
       }
   }
   //修改职位
   public function  update () {
       if(IS_AJAX){
               $code=(new PostModel())->update(I('post.id'),I('post.name'));
               if($code>0){
                   $this->responseSuccess();
               }else{
                   $this->responseError($code);
               }
               exit();
          }else{
           $this->error('非法操作!');
       }
   }
    //删除职位
    public function remove (){
          if(IS_AJAX){
              $code=(new PostModel())->remove(I('post.ids'));
              if($code>0){
                  $this->responseSuccess();
              }else{
                  $this->responseError($code);
              }
              }else{
              $this->error('非法操作!');
          }
    }
    //获取所有的职位
    public  function getListAll () {
        $PostAll=(new PostModel())->getListAll();

        $this->ajaxReturn($PostAll);
    }
}