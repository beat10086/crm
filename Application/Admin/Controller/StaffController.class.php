<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/16
 * Time: 16:57
 */
namespace Admin\Controller;

use Common\Controller\BaseController;
use Common\Model\StaffModel;

class StaffController extends  BaseController {
    //获取档案列表
    public  function getList () {
        if (IS_AJAX) {
           $staffData=(new StaffModel())->getList(
               I('post.page'), I('post.rows'), I('post.order'), I('post.sort'),
               I('post.keywords'), I('post.date'), I('post.date_from'), I('post.date_to'),
               I('post.gender'), I('post.post'), I('post.entry_status'), I('post.marital_status'),
               I('post.education'), I('post.type'), I('post.id_card'), I('post.nation'), I('post.uid'));
               $this->ajaxReturn($staffData);
        } else {
            $this->error('非法操作！');
        }
    }
    //添加档案
   public function register () {
       if(IS_AJAX){
            $code=(new StaffModel())->register(I('post.name'), I('post.gender'), I('post.number'), I('post.pid'), I('post.type'),
                I('post.tel'), I('post.id_card'), I('post.nation'), I('post.marital_status'),
                I('post.entry_status'), I('post.entry_date'), I('post.dimission_date'), I('post.politics_status'),
                I('post.specialty'), I('post.education'), I('post.health'), I('post.registered'),
                I('post.registered_address'), I('post.graduate_date'), I('post.graduate_colleges'),
                I('post.intro'), I('post.details'));
           if($code>0){
                 $this->responseSuccess();
           }else{
                 $this->responseError($code);
           }
          }else{
            $this->error('非法操作!');
       }
   }
   //获取未关联档案列表
    public function  getNotRelationList () {
         if(IS_AJAX){
             $data=(new StaffModel())->getNotRelationList();
             $this->ajaxReturn($data);
           }else{
               $this->error('非法操作');
         }
    }
    //获取一条档案数据
    public function getStaff () {
         if(IS_AJAX){
             $data=(new StaffModel())->getStaff(I('post.id'));
             $this->ajaxReturn($data);
           }else{
             $this->error('非法操作');
         }
    }
    //更新档案
    public  function update  () {
           if(is_ajax){
            $code=(new StaffModel())->update(I('post.id'), I('post.gender'), I('post.number'), I('post.pid'), I('post.type'),
                   I('post.tel'), I('post.id_card'), I('post.nation'), I('post.marital_status'),
                   I('post.entry_status'), I('post.entry_date'), I('post.dimission_date'), I('post.politics_status'),
                   I('post.specialty'), I('post.education'), I('post.health'), I('post.registered'),
                   I('post.registered_address'), I('post.graduate_date'), I('post.graduate_colleges'),
                   I('post.intro'), I('post.details'));
               if($code>0){
                     $this->responseSuccess();
               }else{
                     $this->responseError($code);
               }
             }else{
               $this->error('非法操作!');
           }
    }
    //删除档案
    public  function remove () {
           if(IS_AJAX){
               $code=(new StaffModel())->remove(I('post.ids'));
             }else{
               $this->error('非法操作');
           }
    }
    //获取员工档案详情
    public  function getDetails (){
        $object=(new StaffModel())->getDetails(I('GET.id'));
        $this->assign('object',$object);
        $this->display('details');
    }
}