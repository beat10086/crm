<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 19:28
 */
namespace  Common\Model;

use Think\Model;

class UserModel extends  Model  {

   public  function  getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $state) {
       $map = array();
       $keywords_map = array();
       $date_map     = array();
       //如果有关键字，进行组装
       if($keywords){
           $keywords_map['accounts']=array('like','%'.$keywords.'%');
           $keywords_map['email']=array('like','%'.$keywords.'%');
           $keywords_map['name']=array('like','%'.$keywords.'%');
           $keywords_map['_logic'] = 'OR';
       }
       //如果有时间，进行组装
       if ($date_from && $date_to) {
           $date_map["$date"] = array(array('egt', date($date_from)), array('elt', date($date_to)));
       } else if ($date_from) {
           $date_map["$date"] = array('egt', date($date_from));
       } else if ($date_to) {
           $date_map["$date"] = array('elt', date($date_to));
       }
       //把关键字SQL组入$map
       if (!empty($keywords_map)) {
           $map['_complex'] = $keywords_map;
       }
       //把创建时间SQL组入$map
       if (!empty($date_map)) {
           $map["$date"] = $date_map["$date"];
       }
       //把状态SQL组入$map
       if ($state) {
           $map['state'] = $state;
       }
       $object=$this->field('id,accounts,name,email,last_login_time,last_login_ip,login_count,state,create_time')
                    ->where($map)
                    ->order(array($sort=>$order))
                    ->limit(($rows * ($page - 1)), $rows)
                    ->select();
       //$this->getLastSql(); 打印运行的数据库
       return [
            'total'=>$this->count(),
            'rows' =>$object?$object:''
      ];
  }
}