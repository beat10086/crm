<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/7
 * Time: 15:34
 */
namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\InformModel;


class InformController extends  BaseController  {
     //显示通知页面
     public  function Index () {
             $this->display();
     }
     //加载数据列表
     public function  getList () {
          if(IS_AJAX){
              $InformData=(new InformModel())->getList(I('post.page'), I('post.rows'), I('post.sort'),
                                                       I('post.order'),I('post.keywords'), I('post.dateType'),
                                                       I('post.dateFrom'), I('post.dateTo'));
              $this->ajaxReturn( $InformData);
            }else{
              $this->error('非法操作!');
          }
     }
     //添加通知
    public function register () {
          if(IS_AJAX){
               $code=(new InformModel())->register(I('post.title'), I('post.details'));
               if($code>0){
                    $this->responseSuccess();
                  }else{
                    $this->responseError($code);
               }
             }else{
              $this->error('非法操作!');
          }
    }
    //获取通知详情
    public function getDetails (){
        if (IS_AJAX) {
            $Inform =new InformModel();
            $this->assign('object', $Inform->getDetails(I('get.id')));
            $this->display('details');
           }else{
            $this->error('非法操作!');
        }
    }
}

