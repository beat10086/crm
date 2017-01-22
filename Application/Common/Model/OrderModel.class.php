<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/22
 * Time: 10:28
 */
namespace   Common\Model;
use Think\Model;

class OrderModel extends  Model  {
    //入库基本验证
    protected $_validate = array(
        //产品长度不合法
        //array('product', '2,20', '产品长度不合法', self::EXISTS_VALIDATE, 'length', self::MODEL_INSERT),
    );

    //客户表自动完成
    protected $_auto = array(
        array('create_time', 'get_time', self::MODEL_INSERT, 'function'),
    );

    //关联模型
    protected $_link = array(
        //关联订单附表
        'Extend'=>array(
            'mapping_type'=>self::HAS_ONE,
            'class_name'=>'OrderExtend',
            'foreign_key'=>'oid'
        )
    );
   //获取订单列表
   public  function  getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $neg=false) {
       $map = array();
       $keywords_map = array();
       $date_map = array();

       //如果有关键字，进行组装
       if ($keywords) {
           $keywords_map['sn'] = array('like', '%'.$keywords.'%');
           $keywords_map['title'] = array('like', '%'.$keywords.'%');
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

       //是否只获取未付款的订单
       if ($neg) {
           $map['pay_state'] = '未付款';
       }

       $object = $this->field(' crm_order.id,
                                crm_order.sn,
                                crm_order.title,
                                crm_order.amount,
                                crm_order.enter,
                                crm_order.pay_state,
                                crm_order.create_time,
                                crm_documentary.d_name,
                                crm_documentary.company')
           ->join('crm_documentary ON crm_order.documentary_id=crm_documentary.id', 'LEFT')
           ->where($map)
           ->order(array($sort=>$order))
           ->limit(($rows * ($page - 1)), $rows)
           ->select();

       return array(
           'total'=>$this->count(),
           'rows'=>$object ? $object : '',
       );
   }
   //添加订单
    public function register ($title, $amount, $documentary_id, $details, $contract, $product_outlib){
        $sn = get_time_string();
        $data = array(
            'title'=>$title,
            'amount'=>$amount,
            'documentary_id'=>$documentary_id,
            'sn'=>$sn,
            'pay_state'=>'未付款',
            'enter'=>session('admin')['name'],
            'Extend'=>array(
                'details'=>$details,
                'contract'=>$contract
            )
        );
       if($this->create($data)){
           $data['create_time'] = get_time();
           $id = $this->relation('Extend')->add($data);
           if($id){
               //订单产品
               $outlib = $product_outlib['rows'];
               foreach ($outlib as $key=>$value) {
                   //出库
                   $outlib_add = array(
                       'product_id'=>$value['id'],
                       'number'=>$value['number'],
                       'order_sn'=>$sn,
                       'state'=>'未处理',
                       'keyboarder'=>session('admin')['name'],
                       'create_time'=>get_time()
                   );
                   M('Outlib')->add($outlib_add);
                   //减库存
                   $product_map['id'] = $value['id'];
                   $product_update = array(
                       'inventory'=>array('exp','inventory-'.$value['number']),
                       'inventory_out'=>array('exp','inventory_out+'.$value['number']),
                   );
                   M('Product')->where($product_map)->save($product_update);
               }
               //更新跟单状态
               $map['id'] = $documentary_id;
               $update = array(
                   'evolve'=>'已成交'
               );
               M('Documentary')->where($map)->save($update);
               return $id;
           }else{
               return 0;
           }
          }else{
           return $this->getError();
       }
    }
    //获取1条订单
    public function getOne ($id) {
        $map['crm_order.id'] = $id;
        $object =  $this->relation('Extend')
            ->field('crm_order.id,crm_order.title,crm_order.documentary_id,crm_order.amount,crm_documentary.title AS d_title')
            ->join('crm_documentary ON crm_order.documentary_id=crm_documentary.id', 'LEFT')
            ->where($map)
            ->find();
        $object['Extend']['details'] = htmlspecialchars_decode($object['Extend']['details']);
        return $object;
    }
    //删除订单
    public  function remove ($ids){
        return $this->relation('Extend')->delete($ids);
    }
}