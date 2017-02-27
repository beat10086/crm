<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 14:01
 */
namespace Common\Model;
use Think\Model;

class ClientModel extends  Model {
    //客户表自动完成
    protected $_auto = array(
        array('create_time', 'get_time', self::MODEL_INSERT, 'function'),
    );
    //获取客服信息列表
    public function getList($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to) {
        $map = array();
        $keywords_map = array();
        $date_map = array();

        //如果有关键字，进行组装
        if ($keywords) {
            $keywords_map['company'] = array('like', '%'.$keywords.'%');
            $keywords_map['name'] = array('like', '%'.$keywords.'%');
            $keywords_map['tel'] = array('like', '%'.$keywords.'%');
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

        $object = $this->field('id,company,name,tel,enter,source,create_time')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();
        return array(
            'total'=>$this->count(),
            'rows'=>$object ? $object : '',
        );
    }
   //添加用户信息
    public function register ($company, $name, $tel, $source) {
        $data = array(
            'company' =>$company,
            'name'    =>$name,
            'tel'     =>$tel,
            'source'  =>$source,
            'enter'   =>session('admin')['staff_name']
        );
        if ($this->create($data)) {
            $cid = $this->add();
            return $cid ? $cid : 0;
        } else {
            return $this->getError();
        }
    }
    //获取客户1条信息
    public function getClient ($id) {
         $map['id'] = $id;
         return $this->field('id,company,name,tel,enter,source,create_time')->where($map)->find();
    }
    //删除客户信息
    public  function remove ($ids) {
         return $this->delete($ids);
    }
    //更新客服信息
    public function update ($id,$company,$name,$tel,$source) {
         $map['id']=$id;
         $data=[
             'company'=>$company,
             'name'   =>$name,
             'tel'    =>$tel,
             'source' =>$source,
             'enter'  =>session('admin')['staff_name']
         ];
        return $this->where($map)->save($data);
    }
    //获取客服详情
    public function getDetails ($id){
          $map['id']=$id;
          return  $this->field('company,name,tel,source,enter,create_time')->where($map)->find();
    }
}