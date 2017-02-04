<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/4
 * Time: 10:20
 */
namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\WorkModel;


class WorkController extends  BaseController  {
    //加载工作页
    public  function index () {
          $this->display();
    }
    //获取工作列表
   public  function  getList () {
         if(IS_AJAX){
               $workData=(new WorkModel())->getList(I('post.page'), I('post.rows'), I('post.order'), I('post.sort'),
                                                    I('post.keywords'), I('post.date'), I('post.date_from'),
                                                    I('post.date_to'), I('post.state'), I('post.type'));
               $this->ajaxReturn($workData);
            }else{
              $this->error('非法操作!');
         }
   }
   //添加工作单
   public function register () {
         if(IS_AJAX){
                 $code=(new WorkModel())->register(I('post.title'), I('post.type'), I('post.start_date'), I('post.end_date'));
                 if($code>0){
                      $this->responseSuccess();
                  }else{
                      $this->responseError($code);
                 }
            }else{
             $this->error('非法操作!');
         }
   }

   //获取1条工作记录
    public function  getOne (){
        if (IS_AJAX) {
           $this->ajaxReturn((new WorkModel())->getOne(I('post.id')));
        } else {
            $this->error('非法操作！');
        }
    }
    //完成工作阶段
    public  function finish () {
        if(IS_AJAX){
           $this->ajaxReturn((new WorkModel())->finish(I('post.work_id')));
          }else{
            $this->error('非法操作!');
        }
    }
    //获取工作阶段
    public function getStage() {
        if (IS_AJAX) {
            $this->ajaxReturn((new  WorkModel())->getStage(I('post.id')));
        } else {
            $this->error('非法操作！');
        }
    }
    //添加工作阶段
    public function  addStage () {
         if(IS_AJAX){
               $code=(new WorkModel())->addStage(I('post.work_id'), I('post.stage'));
               if($code>0){
                     $this->responseSuccess();
                 }else{
                     $this->responseError($code);
               }
            }else{
               $this->error('非法操作!');
         }
    }
    //作废工作计划
    public  function  cancel (){
           if(IS_AJAX){
               $code=(new WorkModel())->cancel(I('post.ids'));
               if($code>0){
                    $this->responseSuccess();
                  }else{
                    $this->responseError($code);
               }
              }else{
               $this->error('非法操作!');
           }
    }
}