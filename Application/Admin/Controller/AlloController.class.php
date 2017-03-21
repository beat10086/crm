<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/7
 * Time: 11:13
 */
//分配任务，只要是根据分配着，帅选数据
namespace  Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\WorkModel;

class AlloController  extends   BaseController  {
   //加载分配
   public function  Index () {
        $this->display();
   }
    //加载数据列表
    public function getList(){
        if (IS_AJAX)
        {

            $this->ajaxReturn((new WorkModel())->getList(I('post.page'), I('post.rows'),I('post.order'), I('post.sort'),
                                             I('post.keywords'), I('post.date'), I('post.date_from'),
                                             I('post.date_to'), I('post.state'), I('post.type'), I('post.allo')));
        } else {
            $this->error('非法操作！');
        }
    }
    //添加分配任务
    public function register () {
          if(IS_AJAX){
                $code=(new WorkModel())->register(I('post.title'), I('post.type'), I('post.start_date'), I('post.end_date'), I('post.staff_id'), I('post.staff_name'));
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
    //获取工作计划详情
    public function getDetails () {
        if(IS_AJAX){
            $object=(new WorkModel())->getDetails(I('get.id'));
            $this->assign('object',$object);
            $this->display('details');
        }else{
            $this->error('非法操作!');
        }
    }
}