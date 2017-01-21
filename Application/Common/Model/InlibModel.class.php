<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 10:49
 */
namespace Common\Model;

use Think\Model;

class InlibModel  extends  Model  {
    //入库基本验证
    protected $_validate = array(
        //产品长度不合法
        array('product', '2,20', '产品长度不合法', self::EXISTS_VALIDATE, 'length', self::MODEL_INSERT),
    );
    //获取入库产品列表
    public function  getList($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to) {
        $map = array();
        $keywords_map = array();
        $date_map = array();

        //如果有关键字，进行组装
        if ($keywords) {
            $keywords_map['product'] = array('like', '%'.$keywords.'%');
            $keywords_map['staff'] = array('like', '%'.$keywords.'%');
            $keywords_map['sn'] = array('like', '%'.$keywords.'%');
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

        $object = $this->field('id,sn,product,staff,
                                number,pro_price,unit,
                                mode,mode_explain,enter,
                                discount,amount,create_time')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();

        return array(
            'total'=>$this->count(),
            'rows'=>$object ? $object : '',
        );
    }
    //入库操作
    public  function  register ($pid, $sid, $sn, $product, $staff, $pro_price, $unit, $number, $mode, $mode_explain, $discount) {
        $data = array(
            'pid'=>$pid,
            'sid'=>$sid,
            'sn'=>$sn,
            'product'=>$product,
            'pro_price'=>$pro_price,
            'unit'=>$unit,
            'staff'=>$staff,
            'number'=>$number,
            'discount'=>$discount,
            'amount'=>round($discount * $number * $pro_price * 0.1, 2),
            'mode'=>$mode,
            'mode_explain'=>$mode_explain,
            'enter'=>session('admin')['name']
        );

        if ($this->create($data)) {
            $data['create_time'] = get_time();
            $iid = $this->add($data);
            if ($iid) {
                $map['id'] = $pid;
                $update = array(
                    'inventory'=>array('exp','inventory+'.$number),
                    'inventory_in'=>array('exp','inventory_in+'.$number),
                );
                M('Product')->where($map)->save($update);
                return $iid;
            } else {
                return 0;
            }
        } else {
            return $this->getError();
        }
    }
}