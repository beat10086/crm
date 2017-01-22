<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/22
 * Time: 14:14
 */

namespace Common\Model;
use Think\Model;

class OutlibModel extends  Model {
    //入库基本验证
    protected $_validate = array(
        //产品长度不合法
        array('product', '2,20', '产品长度不合法', self::EXISTS_VALIDATE, 'length', self::MODEL_INSERT),
    );
    //出库列表
    public  function  getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to) {
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
    //批量出货
    public  function  deliver ($ids) {
        $map['id'] = array('in', $ids);
        $update = array(
            'clerk'=>session('admin')['name'],
            'state'=>'已出库',
            'dispose_time'=>get_time()
        );
        return $this->where($map)->save($update);
    }
    //撤销出货
    public  function repeal ($ids) {
        $map['id'] = array('in', $ids);
        $update = array(
            'clerk'=>'',
            'state'=>'未处理',
            'dispose_time'=>'0000:00:00 00:00:00'
        );
        return $this->where($map)->save($update);
    }
}