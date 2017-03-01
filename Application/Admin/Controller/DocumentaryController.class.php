<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 14:52
 */

namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\DocumentaryModel;

class DocumentaryController extends  BaseController  {
   //跟单列表
   public  function getList () {
        if(IS_AJAX){
            $DocumentaryData=(new DocumentaryModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                               I('post.sort'), I('post.keywords'), I('post.date'),
                                                               I('post.date_from'), I('post.date_to'), I('post.neg'));
            $this->ajaxReturn($DocumentaryData);
          }else{
            $this->error('非法操作!');
        }

   }
   //添加跟单
   public function register (){
        if(IS_AJAX){
             $code=(new DocumentaryModel())->register(I('post.title'), I('post.cid'), I('post.sid'),
                                                      I('post.company'),I('post.staff_name'), I('post.way'),
                                                      I('post.evolve'), I('post.next_contact'), I('post.remark'));
             if($code>0){
                    $this->responseSuccess();
                }else{
                    $this->responseError($code);
             }
          }else{
            $this->error('非法操作!');
        }
   }

    //获取1条跟单
    public  function getDocumentary () {
          if(IS_AJAX){
                 $documentaryData=(new DocumentaryModel())->getDocumentary(I('post.id'));
                 $this->ajaxReturn($documentaryData);
            }else{
               $this->eror('非法操作!');
          }
    }
    //更新跟单
    public  function  update () {
          if(IS_AJAX){
                $code=(new DocumentaryModel())->update( I('post.id'), I('post.title'), I('post.client_id'),
                                                        I('post.staff_id'), I('post.client_company'), I('post.staff_name'),
                                                        I('post.way'), I('post.evolve'), I('post.next_contact'),
                                                        I('post.remark'));
                if($code>0){
                      $this->responseSuccess();
                   }else{
                      $this->responseError($code);
                }
             }else{
               $this->error('非法操作!');
          }
    }
    //删除跟单
    public  function remove () {
        if(IS_AJAX){
                $code=(new DocumentaryModel())->remove(I('post.ids'));
                if($code>0){
                    $this->responseSuccess();
                }else{
                    $this->responseError($code);
                }
             }else{
            $this->error('非法操作！');
        }
    }
    //获取详情
    public  function getDetails () {
          if(IS_AJAX){
              $object=(new DocumentaryModel())->getDetails(I('get.id'));
              $this->assign('object',$object);
              $this->display('details');
             }else{
              $this->error('非法操作！');
          }
    }
}