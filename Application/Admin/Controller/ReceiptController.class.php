<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/23
 * Time: 10:39
 */
namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\ReceiptModel;

class ReceiptController extends  BaseController  {
  //加载付款页面
  public  function  index () {
       $this->display();
  }

  //加载收款列表
  public  function getList () {
    if(IS_AJAX){
          $receiptData= (new ReceiptModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                      I('post.sort'), I('post.keywords'), I('post.date'),
                                                      I('post.date_from'), I('post.date_to'));
          $this->ajaxReturn($receiptData);
      }else{
        $this->error('非法操作!');
    }
  }

    //添加订单信息
   public function register () {
        if(IS_AJAX){
            $code=(new ReceiptModel())->register(I('post.order_id'), I('post.order_title'), I('post.order_amount'),
                                                 I('post.way'), I('post.remark'));
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