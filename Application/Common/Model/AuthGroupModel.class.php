<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/4/5
 * Time: 20:07
 */
namespace Common\Model;
use Think\Model;


class   AuthGroupModel extends  Model {

    //获取数据列表
   public  function  getList ($page, $rows, $sort, $order, $keywords, $dateType, $dateFrom, $dateTo) {
       $map = $keywords_map =  array();

       if ($keywords)
       {
           $keywords_map['title'] = array('like', '%'.$keywords.'%');
           $keywords_map['_logic'] = 'OR';
       }

       //将复合SQL组入$map
       if (!empty($keywords_map))
       {
           $map['_complex'] = $keywords_map;
       }

       if ($dateFrom && $dateTo)
       {
           $map["$dateType"] = array(array('egt', $dateFrom), array('elt', $dateTo));
       } else if ($dateFrom) {
           $map["$dateType"] = array('egt', $dateFrom);
       } else if ($dateTo) {
           $map["$dateType"] = array('elt', $dateTo);
       }


       $object = $this ->field('id,title,status,rules,create_time')
           ->where($map)
           ->order(array($sort=>$order))
           ->limit(($rows * ($page - 1)), $rows)
           ->select();


       foreach ($object as $key=>$value) {

           $AuthRule = M('AuthRule');
           $mapRules['id'] = array('in', $value['rules']);
           $titleArray = $AuthRule->field('title')->where($mapRules)->select();

           $title = '';

           foreach ($titleArray as $key2=>$value2) {
               $title .= $value2['title'].',';
           }

           $object[$key]['title_rules'] = substr($title, 0, -1);
       }

       return array(
           'total' =>  $this->count(),
           'rows'  =>  $object ? $object : ''
       );
   }
}