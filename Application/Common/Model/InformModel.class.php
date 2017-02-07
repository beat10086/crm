<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/7
 * Time: 15:44
 */
namespace Common\Model;
use Think\Model;

class InformModel extends  Model {
  //获取通知数据
   public function getList ($page, $rows, $sort, $order, $keywords, $dateType, $dateFrom, $dateTo) {
           $map = $keywords_map =  array();
           if ($keywords)
           {
               $keywords_map['title'] = array('like', '%'.$keywords.'%');
               $keywords_map['staff_name'] = array('like', '%'.$keywords.'%');
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


           $object = $this ->field('id,title,staff_name,create_time')
               ->where($map)
               ->order(array($sort=>$order))
               ->limit(($rows * ($page - 1)), $rows)
               ->select();

           return array(
               'total' =>  $this->where($map)->count(),
               'rows'  =>  $object ? $object : ''
           );
   }
   //添加通知
    public function register ($title, $details) {
        $addData = array(
            'title'             =>  $title,
            'details'           =>  $details,
            'staff_id'          =>  session('admin')['staff_id'],
            'staff_name'        =>  session('admin')['staff_name'],
            'create_time'       =>  getTime()
        );
        if ($this->create($addData)){
            $id = $this->add($addData);
            if ($id)
            {
                return $id;
            } else {
                return 0;
            }
        }
    }
    //获取通知详情
    public  function  getDetails ($id){
        $map['id'] = $id;
        $object = $this->field('id,title,staff_name,details,create_time')
            ->where($map)
            ->find();
        $object['details'] = htmlspecialchars_decode($object['details']);
        return $object;
    }
}
