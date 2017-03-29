<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/8
 * Time: 11:36
 */
namespace  Common\Model;


use Think\Model;

class LogModel extends  Model {
    //获取日志
    public  function getList ($page, $rows, $sort, $order, $type, $dateType, $dateFrom, $dateTo) {
        $map=  array();
        if ($dateFrom && $dateTo)
        {
            $map["$dateType"] = array(array('egt', $dateFrom), array('elt', $dateTo));
        } else if ($dateFrom) {
            $map["$dateType"] = array('egt', $dateFrom);
        } else if ($dateTo) {
            $map["$dateType"] = array('elt', $dateTo);
        }


        //判断操作类型
        if ($type) {
            $map['type_name'] = $type;
        }


        $object = $this ->field('id,user,type_name,module,ip,create_time')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();

        return array(
            'total' =>  $this->where($map)->count(),
            'rows'  =>  $object ? $object : ''
        );


    }
    //添加日志
    public function register ($user,$type,$module,$ip) {
             $data=array(
                  "user"       =>$user,
                  "type_name"  =>$type,
                  "module"     =>$module,
                  "ip"         =>$ip,
                  "create_time"=>get_time()
             );
            $this->add($data);
    }
}