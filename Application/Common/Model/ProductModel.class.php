<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/20
 * Time: 15:39
 */
namespace Common\Controller;

use Think\Model\RelationModel;

class ProductModel extends  RelationModel {
    //产品基本验证
    protected $_validate = array(
        //名称长度不合法
        array('name', '2,20', '帐号长度不合法', self::EXISTS_VALIDATE, 'length', self::MODEL_INSERT),
    );

    //关联模型
    protected $_link = array(
        //关联档案附表
        'Extend'=>array(
            'mapping_type'=>self::HAS_ONE,
            'class_name'=>'ProductExtend',
            'foreign_key'=>'pid'
        )
    );
   //加载产品列表
    public function getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $type, $alarm){
        $map = array();
        $keywords_map = array();
        $date_map = array();
        //如果有关键字，进行组装
        if($keywords){
            $keywords_map['name']=array('like','%'.$keywords.'%');
            $keywords_map['sn']  =array('like','%'.$keywords.'%');
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

        //把状态SQL组入$map
        if ($type) {
            $map['type'] = $type;
        }

        //把库存警报SQL组入$map
        if ($alarm) {
            $map['inventory'] = array('elt', 'inventory_alarm');
        }

        $object = $this->field('id,sn,name,type,pro_price,sell_price,
                                unit,inventory,inventory_in,inventory_out,
                                inventory_alarm,create_time')
                        ->where($map)
                        ->order(array($sort=>$order))
                        ->limit(($rows * ($page - 1)), $rows)
                        ->select();
        return array(
            'total'=>$this->count(),
            'rows'=>$object ? $object : '',
        );
    }
    //添加产品
    public function register($name, $sn, $type, $pro_price, $sell_price,
                             $unit, $inventory_alarm, $details) {
        $data = array(
            'name'=>$name,
            'sn'=>$sn,
            'type'=>$type,
            'pro_price'=>$pro_price,
            'sell_price'=>$sell_price,
            'unit'=>$unit,
            'inventory_alarm'=>$inventory_alarm,
            'Extend'=>array(
                'details'=>$details
            )
        );

        if ($this->create($data)) {
            $data['create_time'] = get_time();
            $pid = $this->relation('Extend')->add($data);
            if ($pid) {

                //写入日志
                $param = array(
                    'user'=>session('admin')['accounts'].'('.session('admin')['name'].')',
                    'type'=>'新增数据',
                    'module'=>'仓库管理 >> 产品信息',
                    'ip'=>get_client_ip()
                );
                tag('log', $param);

                return $pid;
            } else {
                return 0;
            }
        } else {
            return $this->getError();
        }
    }
    //删除商品
    public function remove ($ids) {
        $id = $this->relation('Extend')->delete($ids);
        if ($id) {
            //写入日志
            $param = array(
                'user'=>session('admin')['accounts'].'('.session('admin')['name'].')',
                'type'=>'删除数据',
                'module'=>'仓库管理 >> 产品信息',
                'ip'=>get_client_ip()
            );
            tag('log', $param);
            return $id;
        } else {
            return 0;
        }
    }
}