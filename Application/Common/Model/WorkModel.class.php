<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/2/4
 * Time: 10:27
 */
namespace  Common\Model;

use Think\Model;

class WorkModel extends  Model {

    //获取工作列表
    public function getList($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $state, $type) {
        $map = array();
        $keywords_map = array();
        $date_map = array();

        //如果有关键字，进行组装
        if ($keywords) {
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


        //状态
        switch ($state) {
            case '进行中' :
                $map['state'] = array('eq', '进行中');
                break;
            case '已完成' :
                $map['state'] = array('eq', '已完成');
                break;
            case '作废' :
                $map['state'] = array('eq', '作废');
                break;
            default :
                //默认排除作废的
                $map['state'] = array('neq', '作废');
        }

        //类型
        if ($type) {
            $map['type'] = $type;
        }


        $object = $this->field('id,title,type,stage,state,user,
                                start_date,end_date,create_time')
            ->where($map)
            ->order(array($sort=>$order))
            ->limit(($rows * ($page - 1)), $rows)
            ->select();

        return array(
            'total'=>$this->count(),
            'rows'=>$object ? $object : '',
        );
    }
    //添加工作单
    public function register ($title, $type, $start_date, $end_date) {
        $data = array(
            'title'=>$title,
            'type'=>$type,
            'start_date'=>$start_date,
            'end_date'=>$end_date,
            'stage'=>'创建工作任务',
            'state'=>'进行中',
            'user'=>session('admin')['name'],
            'create_time'=>get_time()
        );
        if($this->create($data)){
              $id = $this->add();
              if ($id) {
                    //同时写入到附表中的完成进度
                    M('workExtend')->add(array(
                        'work_id'=>$id,
                        'stage'=>'创建工作任务',
                        'create_time'=>get_time()
                    ));
                    return $id;
                } else {
                    return 0;
                }
           }else{
              $this->getError();
        }
    }
    //获取1条工作记录
    public function getOne ($id) {
        $map['id'] = $id;
        return $this->field('id,title,type,stage,state,start_date,end_date,create_time')->where($map)->find();
    }
    //添加工作阶段
    public  function addStage($work_id, $state) {
        return M('workExtend')->add(array(
            'work_id'=>$work_id,
            'stage'=>$state,
            'create_time'=>get_time()
        ));
    }
    //完成工作阶段
    public  function finish($work_id) {
        if ($this->addStage($work_id, '工作计划完成')) {
            return $this->save(array(
                'id'=>$work_id,
                'state'=>'已完成'
            ));
        } else {
            return 0;
        }
    }
    //获取工作阶段
    public  function  getStage ($id) {
        $map['work_id'] = $id;
        return M('workExtend')->field('stage,create_time')->where($map)->select();
    }
    //作废工作计划
    public function cancel ($ids) {
        return $this->save(array('id'=>array('in', $ids), 'state'=>'作废'));
    }
}