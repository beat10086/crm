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
   //获取订单列表
   public  function  getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $neg=false) {
       $map = array();
       $keywords_map = array();
       $date_map = array();

       //如果有关键字，进行组装
       if ($keywords) {
           $keywords_map['crm_order.sn'] = array('like', '%'.$keywords.'%');
           $keywords_map['crm_order.title'] = array('like', '%'.$keywords.'%');
           $keywords_map['_logic'] = 'OR';
       }


       if ($date_from && $date_to) {
           $map["crm_order.$date"] = array(array('egt', date($date_from)), array('elt', date($date_to)));
       } else if ($date_from) {
           $map["crm_order.$date"] = array('egt', date($date_from));
       } else if ($date_to) {
           $map["crm_order.$date"] = array('elt', date($date_to));
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
                                crm_order.original,
                                crm_order.cost,
                                crm_order.enter,
                                crm_order.pay_state,
                                crm_order.create_time,
                                crm_documentary.staff_name,
                                crm_documentary.client_company')
           ->join('crm_documentary ON crm_order.documentary_id=crm_documentary.id', 'LEFT')
           ->where($map)
           ->order(array($sort=>$order))
           ->limit(($rows * ($page - 1)), $rows)
           ->select();
       return array(
           'total'=>$this->where($map)->count(),
           'rows'=>$object ? $object : '',
       );
   }
   //添加订单
    public function register ($title, $original,$cost,$documentary_id, $details, $contract, $product_outlib){
       //先要生成订单数据
       $addData=array(
           'title'           =>$title,
           'sn'              =>get_time_string(),
           'original'        =>$original,
           'cost'            =>$cost,
           'documentary_id'  =>$documentary_id,
           'pay_state'=>'未付款',
           'enter'=>session('admin')['staff_name'],
       );

       if($this->create($addData)){
           $addData['create_time'] = get_time();
           $id = $this->add($addData);
           if($id){
               //添加
               $extend_data=array(
                      'order_id'  =>$id,
                      'details'   =>$details,
                      'contract'  =>$contract
               );
               M('orderExtend')->add($extend_data);
               //订单产品
               $outlib = $product_outlib['rows'];
               foreach ($outlib as $key=>$value) {
                   //出库(商品的出库操作)
                   $outlib_add = array(
                       'product_id'    =>$value['id'],
                       'number'        =>$value['number'],
                       'order_sn'      =>get_time_string(),
                       'state'         =>'未处理',
                       'enter'         =>session('admin')['staff_name'],
                       'create_time'   =>get_time()
                   );
                   M('Outlib')->add($outlib_add);
                   //减库存(这个非常重要，如果不处理，会出现严重的问题)
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
    //获取订单
    public  function getDetails ($id) {
           $map['crm_order.id']=$id;
           $object=$this->field('crm_order.sn as order_sn,crm_order.title,crm_documentary.client_company,
                                 crm_documentary.staff_name,crm_order.original,crm_order.cost,
                                 crm_order.pay_state,crm_order.enter,crm_order.create_time,
                                 crm_order_extend.details,crm_order_extend.contract')
               ->join('crm_documentary on crm_documentary.id = crm_order.documentary_id','LEFT')
               ->join('crm_order_extend on crm_order_extend.order_id = crm_order.id','LEFT')
               ->where($map)
               ->find();
            $object['contract']=htmlspecialchars_decode($object['contract']);
            //出库的产品(PS:一个订单可能会有多个商品)
           if($object) {
               $outlib = D('Outlib');
               $outlibMap['order_sn'] = $object['order_sn'];
               $outlib = $outlib->field('crm_outlib.number,
                                         crm_outlib.state,
                                         crm_outlib.dispose_time,
                                         crm_product.sn,
                                         crm_product.name,
                                         crm_product.sell_price')
                   ->join('crm_product on crm_product.id = crm_outlib.product_id', 'LEFT')
                   ->where($outlibMap)
                   ->select();
                $object['outlib'] = $outlib;
            }
            return  $object;
    }
}