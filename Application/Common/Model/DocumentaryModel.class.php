<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/21
 * Time: 15:40
 */
namespace Common\Model;

use Think\Model;

class DocumentaryModel extends  Model {
    //客户表自动完成
    protected $_auto = array(
        array('create_time', 'get_time', self::MODEL_INSERT, 'function'),
        array('d_date', 'get_time', self::MODEL_BOTH, 'function'),
    );
    //跟单列表
    public  function getList($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $neg=false){
        $map = array();
        $keywords_map = array();
        $date_map = array();

        //如果有关键字，进行组装
        if ($keywords) {
            $keywords_map['sn'] = array('like', '%'.$keywords.'%');
            $keywords_map['title'] = array('like', '%'.$keywords.'%');
            $keywords_map['client_company'] = array('like', '%'.$keywords.'%');
            $keywords_map['staff_name'] = array('like', '%'.$keywords.'%');
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

        //是否只获取谈判中的跟单
        if ($neg) {
            $map['evolve'] = '谈判中';
        }

        $object = $this->field('id,sn,title,way,evolve,client_company,staff_name,remark,enter,create_time')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();
        return array(
            'total'=>$this->count(),
            'rows'=>$object ? $object : '',
        );
    }
    //添加跟单
    public  function register ($title, $cid, $sid, $company, $staff_name, $way, $evolve, $next_contact, $remark) {
        $data = array(
            'title'=>$title,
            'client_id'=>$cid,
            'staff_id'=>$sid,
            'client_company'=>$company,
            'staff_name'=>$staff_name,
            'way'=>$way,
            'evolve'=>$evolve,
            'next_contact'=>$next_contact,
            'remark'=>$remark,
            'sn'=>get_time_string(),   //生成订单号
            'enter'=>session('admin')['staff_name']
        );
        if ($this->create($data)) {
            $cid = $this->add();
            return $cid ? $cid : 0;
        } else {
            return $this->getError();
        }
    }
    //获取1条跟单
    public function getDocumentary ($id) {
        $map['id'] = $id;
        $object=$this->field('id,title,client_id,client_company,staff_id,staff_name,way,evolve,next_contact,remark')
                    ->where($map)
                    ->find();
        return $object;
    }
    //更新跟单
    public  function update ($id, $title, $client_id, $staff_id, $client_company, $staff_name, $way, $evolve, $next_contact, $remark){
        $data = array(
            'id'=>$id,
            'title'=>$title,
            'client_id'=>$client_id,
            'staff_id'=>$staff_id,
            'client_company'=>$client_company,
            'staff_name'=>$staff_name,
            'way'=>$way,
            'evolve'=>$evolve,
            'next_contact'=>$next_contact,
            'remark'=>$remark,
            'enter'=>session('admin')['staff_name']
        );

        if ($this->create($data)) {
            $cid = $this->save();
            return $cid ? $cid : 0;
        } else {
            return $this->getError();
        }
    }
    //删除跟单
    public  function  remove ($ids){
          return $this->delete($ids);
    }
    //获取跟单详情
    public  function getDetails ($id) {
          $map['id']=$id;
          $object=$this->field('sn,title,client_id,client_company,staff_name,way,evolve,remark,enter,create_time,next_contact')
               ->where($map)->find();
          return $object;
    }
}