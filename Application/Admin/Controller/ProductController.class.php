<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/20
 * Time: 15:31
 */
namespace Admin\Controller;

use Common\Controller\BaseController;
use Common\Model\PostModel;


class ProductController extends  BaseController {
    //加载产品页
    public function index () {
          $this->display();
    }

    //加载产品列表
    public  function getList () {
       if(IS_AJAX){
           $productData=(new ProductModel())->getList(I('post.page'), I('post.rows'), I('post.order'), I('post.sort'),
               I('post.keywords'), I('post.date'), I('post.date_from'), I('post.date_to'), I('post.type'), I('post.alarm'));
           $this->ajaxReturn($productData);
          }else{
            $this->error('非法操作!');
       }
    }
    //添加产品
    public  function register () {
          $code=(new ProductModel())->register(I('post.name'), I('post.sn'), I('post.type'), I('post.pro_price'), I('post.sell_price'),
              I('post.unit'), I('post.inventory_alarm'), I('post.details'));
          if($code>0){
                $this->responseSuccess();
            }else{
                $this->responseError($code);
          }
    }
    //删除
    public function remove () {
          if(IS_AJAX){
              $code=(new ProductModel())->remove(I('post.ids'));
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