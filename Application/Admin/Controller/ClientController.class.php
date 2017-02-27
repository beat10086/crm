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
   //获取客服信息列表
   public function getList () {
        if(IS_AJAX){
             $clientDate=(new ClientModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                      I('post.sort'), I('post.keywords'), I('post.date'),
                                                      I('post.date_from'), I('post.date_to'));
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
            if($code>0){
                $this->responseSuccess();
              }else{
                $this->responseError($code);
            }
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
    //更新客服信息
    public  function  update () {
        if(IS_AJAX){
            $code=(new ClientModel())->update(I('post.id'),I('post.company'),
                                             I('post.name'),I('post.tel'),I('post.source'));
            if($code>0){
                $this->responseSuccess();
            }else{
                $this->responseError($code);
            }
           }else{
             $this->error('非法操作!');
        }
    }
    //获取客服详情
    public  function getDetails (){
          if(IS_AJAX){
               $object=(new ClientModel())->getDetails(I('get.id'));
               $this->assign('object',$object);
               $this->display('details');
              }else{
               $this->error('非法操作!');
          }
    }
}