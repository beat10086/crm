<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/3/14
 * Time: 19:12
 */
//采购模块

namespace  Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\InlibModel;

class  ProcureController extends  BaseController  {
    //加载数据列表
    public function getList(){
        if (IS_AJAX) {
            $inlibData=(new InlibModel())->getList(I('post.page'), I('post.rows'), I('post.order'), I('post.sort'),
                                                I('post.keywords'), I('post.dateType'), I('post.dateFrom'),
                                                I('post.dateTo'),I('post.procure'));
            $this->ajaxReturn($inlibData);
        } else {
            $this->error('非法操作！');
        }
    }
}