<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 10:38
 */
namespace Admin\Controller;


use Common\Controller\BaseController;
use Common\Model\InlibModel;


class InlibController extends  BaseController  {
      //加载页面
     public function Index ()
     {
              $this->display();
     }
    //获取入库产品列表
    public  function  getList () {
        if (IS_AJAX) {
             $inlibData=(new InlibModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                    I('post.sort'),I('post.keywords'), I('post.date'),
                                                    I('post.date_from'), I('post.date_to'));
             $this->ajaxReturn($inlibData);
        } else {
            $this->error('非法操作！');
        }
    }
    //新增入库
    public  function register () {
         if(IS_AJAX){
             $code= (new InlibModel())->register(I('post.pid'), I('post.sid'), I('post.sn'), I('post.product'),
                                                 I('post.staff'), I('post.pro_price'), I('post.unit'), I('post.number'),
                                                 I('post.mode'),I('post.mode_explain'), I('post.discount'));
             if($code>0){
                    $this->responseSuccess();
               }else{
                    $this->responseError($code);
             }
          }else{
             $this->error('非法操作！');
         }

    }
}