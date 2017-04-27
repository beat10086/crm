<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 15:45
 */
namespace  Admin\Controller;
use Common\Model\AuthRuleModel;
use Common\Model\NavModel;
use Think\Auth;
use Think\Controller;


class IndexController extends Controller {
     protected  function  _initialize ()   {
             if(!$_SESSION['admin']){
                 $this->redirect('/Admin/Public/login');
                 exit();
               }
      }
      //获取分类
      public  function   getNav  () {
         if(IS_AJAX){
               //获取当前角色的权限ID
               $auth=new Auth();
               $groups=$auth->getGroups(session('admin')['id'])[0]['rules'];
               //获取当前角色对应的菜单权限的ID
              /* $AuthRule = M('AuthRule');
               $map['id'] = array('in', $groups);
               //根据规则表，选择到导航的ID
               $object = $AuthRule->field('nid')->where($map)->select();
               $nav_id = '';
               //组合成字符串
               foreach ($object as $key=>$value) {
                     $nav_id .= $value['nav_id'].',';
               }*/
               //如果把菜单栏，放在规则表中，操作，后期维护起来更加的方便
               $navData=(new AuthRuleModel())->getNav($groups);
               $this->ajaxReturn($navData);
           }

      }
}