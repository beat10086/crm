<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/23
 * Time: 10:42
 */
namespace  Common\Model;
use Think\Model;

class ReceiptModel extends  Model  {
    //加载收款列表
    public  function getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to) {
        $map = array();
        $keywords_map = array();
        $date_map = array();

        //如果有关键字，进行组装
        if ($keywords) {
            $keywords_map['order_sn'] = array('like', '%'.$keywords.'%');
            $keywords_map['_logic'] = 'OR';
        }


        if ($date_from && $date_to) {
            $map["$date"] = array(array('egt', date($date_from)), array('elt', date($date_to)));
        } else if ($date_from) {
            $map["$date"] = array('egt', date($date_from));
        } else if ($date_to) {
            $map["$date"] = array('elt', date($date_to));
        }

        //把关键字SQL组入$map
        if (!empty($keywords_map)) {
            $map['_complex'] = $keywords_map;
        }

        //把创建时间SQL组入$map
        if (!empty($date_map)) {
            $map["$date"] = $date_map["$date"];
        }

        $object = $this->field('id,order_sn,order_title,way,remark,enter,create_time,order_amount')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();

        return array(
            'total'=>$this->count(),
            'rows'=>$object ? $object : '',
        );
    }
    //添加订单信息
    public function register ($order_id, $order_title, $order_amount, $way, $remark) {
          $data = array(
            'order_id'    =>$order_id,
            'order_title' =>$order_title,
            'order_amount'=>$order_amount,
            'way'         =>$way,
            'remark'      =>$remark,
            'order_sn'    =>get_time_string(),
            'enter'       =>session('admin')['staff_name']
         );
         if($this->create($data)){
             $data['create_time'] = get_time();
             $id = $this->add($data);
             if($id){
                 $map['id'] = $order_id;
                 $update = array(
                     'pay_state'=>'已付款'
                 );
                 M('Order')->where($map)->save($update);
                 return $id;
                }else {
                 return 0;
              }
            }else{
            return $this->getError();
         }
    }
}