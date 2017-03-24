<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/8
 * Time: 10:49
 */
namespace  Common\Model;
use Think\Model;

class LetterModel extends  Model  {
    //获取私信数据列表
    public function getList ($page, $rows, $sort, $order, $keywords, $dateType, $dateFrom, $dateTo) {
        $map = $keywords_map =  array();
        if($keywords){
            $keywords_map['send_name'] = array('like', '%'.$keywords.'%');
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
        //只显示收件人是登录用户的列表
        $map['staff_id'] = session('admin')['staff_id'];
        $object = $this ->field('id,message,staff_name,send_name,isread,create_time')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();

        return array(
            'total' =>  $this->where($map)->count(),
            'rows'  =>  $object ? $object : ''
        );
    }
    //添加私信
    public function  register ($title,$staff_id,$staff_name,$details) {
           $data=[
               'title'       =>$title,
               'staff_id'    =>$staff_id,
               'staff_name'  =>$staff_name,
               'message'     =>$details,
               'send_id'     =>session('admin')['staff_id'],
               'send_name'   =>session('admin')['staff_name'],
               'isread'      =>'未读',
               'create_time' =>get_time()
           ];
       return    $this->add($data);
    }
    //删除私信
    public  function  remove ($ids) {
       $arr=$pieces = explode(",",$ids);
       $isRead=true;
       foreach($arr as $k=>$v){
           $object=$this->field('isread')->where('id='.$v)->find();
           if($object['isread']=='未读'){
               $isRead=false;
           }
       }
        if(!$isRead)  return -2;
        return $this->delete($ids);
     }
}