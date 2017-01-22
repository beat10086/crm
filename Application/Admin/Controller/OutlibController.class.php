<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 13:17
 */

namespace Admin\Controller;


use Common\Controller\BaseController;
use Common\Model\OutlibModel;

class OutlibController extends  BaseController {

    //出库页面
    public function Index () {
          $this->display();
    }

    //出库列表
    public function  getList () {
       if(IS_AJAX){
           $OutlibData=(new OutlibModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                    I('post.sort'), I('post.keywords'), I('post.date'),
                                                    I('post.date_from'), I('post.date_to'));
           $this->ajaxReturn($OutlibData);
         }else{
            $this->error('非法操作!');
       }
    }
    //批量出库
    public  function  deliver (){
         if(IS_AJAX){
                $code=(new OutlibModel())->deliver(I('post.ids'));
                if($code>0) {
                      $this->responseSuccess();
                }else{
                      $this->responseError($code);
                }
           }else{
            $this->error('非法操作!');
         }
    }
    //撤销出库
    public  function repeal () {
         if(IS_AJAX){
             $code=(new OutlibModel())->repeal(I('post.ids'));
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