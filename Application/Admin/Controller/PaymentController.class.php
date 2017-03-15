<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/3/15
 * Time: 19:06
 */
/*支出记录(相当于入库)*/

namespace  Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\InlibModel;
use Think\Controller;

class PaymentController extends  BaseController  {
    //加载数据列表
    public function getList()
    {
        if (IS_AJAX)
        {

            $this->ajaxReturn((new InlibModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                          I('post.sort'), I('post.keywords'), I('post.dateType'),
                                                          I('post.date_from'), I('post.date_to')));
        } else {
            $this->error('非法操作！');
        }
    }
}