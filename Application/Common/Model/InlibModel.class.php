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
    public function  getList($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to,$procure=null) {
        $map = array();
        $keywords_map = array();
        $date_map = array();

        //如果有关键字，进行组装
        if ($keywords) {
            $keywords_map['name'] = array('like', '%'.$keywords.'%');
            $keywords_map['staff_name'] = array('like', '%'.$keywords.'%');
            $keywords_map['sn'] = array('like', '%'.$keywords.'%');
            $keywords_map['_logic'] = 'OR';
        }


        if ($date_from && $date_to) {
            $map["crm_inlib.$date"] = array(array('egt', date($date_from)), array('elt', date($date_to)));
        } else if ($date_from) {
            $map["crm_inlib.$date"] = array('egt', date($date_from));
        } else if ($date_to) {
            $map["crm_inlib.$date"] = array('elt', date($date_to));
        }

        //把关键字SQL组入$map
        if (!empty($keywords_map)) {
            $map['_complex'] = $keywords_map;
        }

        //把创建时间SQL组入$map
        if (!empty($date_map)) {
            $map["crm_inlib.$date"] = $date_map["$date"];
        }
        if($procure){
            $map["mode"]="采购";
        }
        $object = $this->field('crm_inlib.id,crm_inlib.number,crm_inlib.staff_name,crm_inlib.mode,
                                crm_inlib.mode_explain,crm_inlib.enter,crm_inlib.create_time,crm_product.sn,
                                crm_product.type,crm_product.name,crm_product.unit,crm_product.pro_price,
                                crm_product.sell_price')
            ->join('crm_product on crm_inlib.product_id=crm_product.id','LEFT')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();
        //number_format 转化金币格式
        foreach($object  as $k=>$v){
            $object[$k]['amount']=number_format($v['pro_price']*$v['number'],'2');
        }
        return array(
            'total'=>$this->where($map)->count(),
            'rows'=>$object ? $object : '',
        );
    }
    //入库操作
    public  function  register ($product_id, $number, $staff_name, $mode, $mode_explain) {
        $data = array(
            'product_id'=>$product_id,
            'number'=>$number,
            'staff_name' =>$staff_name,
            'mode'=>$mode,
            'mode_explain'=>$mode_explain,
            'enter'=>session('admin')['staff_name']
        );

        if ($this->create($data)) {
            $data['create_time'] = get_time();
            $iid = $this->add($data);
            if ($iid) {
                $map['id'] = $product_id;
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
    //入库详情
    public function getDetails ($id) {
            $map['crm_inlib.id']=$id; //当双表查询的时候，要指定那个表的id
            $object=$this->field('crm_product.name,
                                  crm_product.sn,
                                  crm_product.type,
                                  crm_product.pro_price,
                                  crm_inlib.number,
                                  crm_inlib.staff_name,
                                  crm_inlib.mode,
                                  crm_inlib.mode_explain,
                                  crm_inlib.enter,
                                  crm_inlib.create_time')
                ->join('crm_product on crm_product.id=crm_inlib.product_id','LEFT')
                ->where($map)
                ->find();
            return $object;
    }
}