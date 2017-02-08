<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/8
 * Time: 10:44
 */
namespace  Admin\Controller;
use Common\Model\LetterModel;
use Think\Controller;

class LetterController extends  Controller  {
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

}
