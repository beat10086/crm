<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 13:32
 */

namespace  Admin\Controller;
use Common\Controller\BaseController;

class AlarmController extends   BaseController {
    //加载库存警报产品页
    public  function Index (){
          $this->display();
    }
}