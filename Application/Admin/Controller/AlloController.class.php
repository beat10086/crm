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
            $Work = D('Work');
            $this->ajaxReturn($Work->getList(I('post.page'), I('post.rows'), I('post.sort'), I('post.order'),
                                             I('post.keywords'), I('post.dateType'), I('post.dateFrom'),
                                             I('post.dateTo'), I('post.type'), I('post.state'), I('post.allo')));
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
}