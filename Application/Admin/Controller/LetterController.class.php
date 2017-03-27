<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/8
 * Time: 10:44
 */
namespace  Admin\Controller;
use Common\Model\LetterModel;
use Common\Controller\BaseController;

class LetterController extends baseController  {
   //显示私信页面
   public  function  Index(){
         $this->display();
   }
    //加载数据列表
    public function getList()
    {
        if (IS_AJAX)
        {
            $Letter = new LetterModel();
            $this->ajaxReturn($Letter->getList(I('post.page'), I('post.rows'), I('post.sort'), I('post.order'),
                I('post.keywords'), I('post.dateType'), I('post.dateFrom'), I('post.dateTo')));
        } else {
            $this->error('非法操作！');
        }
    }
    //添加私信
    public function register () {
         $code=(new LetterModel())->register(I('post.title'),I('post.staff_id'),
                                             I('post.staff_name'),I('post.details'));
          if($code>0){
              $this->responseSuccess();
            }else{
              $this->responseError($code);
          }
    }
    //删除私信
    public  function  remove () {
        if(IS_AJAX){
                $code=(new LetterModel())->remove(I('post.ids'));
                if($code>0){
                    $this->responseSuccess();
                }else{
                    $this->responseError($code);
                }
              }ELSE{
               $this->error('非法操作！');
           }
    }
    //私信详情
    public  function getDetails () {
            if(IS_AJAX){
                  $object=(new LetterModel())->getDetails(I('get.id'));
                  $this->assign('object',$object);
                  $this->display('details');
               }else{
                $this->error('非法操作！');
            }
    }

    //设置可读
    public function read () {
        if(IS_AJAX){
            $code=(new LetterModel())->read(I('post.id'));
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
