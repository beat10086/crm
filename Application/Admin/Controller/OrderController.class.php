<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/22
 * Time: 10:16
 */

namespace  Admin\Controller;


use Common\Controller\BaseController;
use Common\Model\OrderModel;

class  OrderController extends   BaseController  {
   //显示订单页
   public  function Index () {
           $this->display();
   }
   //获取订单列表
   public  function  getList () {
           if (IS_AJAX) {
               $this->ajaxReturn((new OrderModel())->getList(I('post.page'), I('post.rows'), I('post.order'), I('post.sort'),
                   I('post.keywords'), I('post.date'), I('post.date_from'), I('post.date_to'), I('post.neg')));
           } else {
               $this->error('非法操作！');
           }
   }
   //添加订单
   public  function  register (){
       if(IS_AJAX){
             $code=(new OrderModel())->register(I('post.title'), I('post.amount'), I('post.documentary_id'),
                                                I('post.details'), I('post.contract'), I('post.product_outlib'));
             if($code>0){
                   $this->responseSuccess();
               }else{
                   $this->responseError($code);
             }
          }else{
              $this->error('非法操作！');
       }
   }
   //获取1条订单
    public function getOne () {
      if(IS_AJAX){
          $orderData=(new OrderModel())->getOne(I('post.id'));
          $this->ajaxReturn($orderData);
        }else{
           $this->error('非法操作!');
      }
    }
    //删除订单
    public  function remove () {
       if(IS_AJAX){
             $code=(new OrderModel())->remove(I('post.ids'));
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