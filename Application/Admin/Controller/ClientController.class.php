<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 13:51
 */

namespace  Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\ClientModel;


class ClientController extends  BaseController  {

    //显示客服信息页面
    public  function  Index (){
          $this->display();
    }
   //获取客服信息列表
   public function getList () {
        if(IS_AJAX){
             $clientDate=(new ClientModel())->getList();
             $this->ajaxReturn($clientDate);
           }else{
             $this->error('非法操作！');
        }
   }
   //添加客服信息
    public function register () {
       if(IS_AJAX){
            $code=(new ClientModel())->register(I('post.company'), I('post.name'),
                                                I('post.tel'), I('post.source'));
         }else{
            $this->error('非法操作!');
       }
    }
    //获取一条客户信息
    public  function getClient () {
         if(IS_AJAX){
                 $ClientData=(new ClientModel())->getClient(I('post.id'));
                 $this->ajaxReturn($ClientData);
             }else{
              $this->error('非法操作!');
         }
    }
    //删除客户信息
    public  function  remove () {
          if(IS_AJAX){
                  $code=(new ClientModel())->remove(I('post.ids'));
                  if($code>0){
                        $this->responseSuccess();
                    }else{
                        $this->responseError($code);
                  }
            }else{
               $this->eror('非法操作!');
          }
    }
}