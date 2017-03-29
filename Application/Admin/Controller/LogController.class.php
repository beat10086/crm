<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/8
 * Time: 10:44
 */
namespace  Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\LogModel;

class LogController extends baseController  {
    //加载数据列表
    public function getList(){
        if (IS_AJAX)
        {
            $Log = new LogModel();
            $this->ajaxReturn($Log->getList(I('post.page'), I('post.rows'), I('post.sort'), I('post.order'),
                I('post.type'), I('post.dateType'), I('post.dateFrom'), I('post.dateTo')));
        } else {
            $this->error('非法操作！');
        }
    }

}