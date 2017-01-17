<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 16:54
 */
namespace Common\Model;


use Think\Model\RelationModel;

class StaffModel extends  RelationModel {
      //档案基本验证
      protected $_validate = array(
            //帐号长度不合法
          array('name', '2,20', '帐号长度不合法', self::EXISTS_VALIDATE, 'length'),
            //工号格式不合法
          array('number', '/^[0-9]{4}$/', '工号格式不合法', self::EXISTS_VALIDATE)
      );
     //关联模型
      protected $_link=array(
            //关联职位表
           'Post'=>array(
              'mapping_type'=>self::BELONGS_TO,
              'class_name'=>'Post',
              'foreign_key'=>'pid',
              'mapping_fields'=>'name'
          ),
            //关联档案附表
          'Extend'=>array(
              'mapping_type'=>self::HAS_ONE,  //关联类型
              'class_name'=>'StaffExtend',   //要关联的模型类名
              'foreign_key'=>'sid'
          )
      );
      //获取档案列表
     public function  getList ($page, $rows, $order, $sort,$keywords, $date,
                               $date_from, $date_to, $gender, $pid,$entry_status,
                               $marital_status, $education, $type,$id_card, $nation, $uid) {
           $map = array();
           $keywords_map = array();
           $date_map = array();

           //如果有关键字，进行组装
           if ($keywords) {
                 $keywords_map['name'] = array('like', '%'.$keywords.'%');
                 $keywords_map['number'] = array('like', '%'.$keywords.'%');
                 $keywords_map['id_card'] = array('like', '%'.$keywords.'%');
                 $keywords_map['tel'] = array('like', '%'.$keywords.'%');
                 $keywords_map['_logic'] = 'OR';
           }

           //如果有时间，进行组装
           if ($date_from && $date_to) {
                 $date_map["$date"] = array(array('egt', date($date_from)), array('elt', date($date_to)));
           } else if ($date_from) {
                 $date_map["$date"] = array('egt', date($date_from));
           } else if ($date_to) {
                 $date_map["$date"] = array('elt', date($date_to));
           }

           //把关键字SQL组入$map
           if (!empty($keywords_map)) {
                 $map['_complex'] = $keywords_map;
           }

           //把创建时间SQL组入$map
           if (!empty($date_map)) {
                 $map["$date"] = $date_map["$date"];
           }

           //把性别SQL组入$map
           if ($gender) {
                 $map['gender'] = $gender;
           }
           //把状态SQL组入$map
           if ($pid) {
                 $map['pid'] = $pid;
           }
           //把入职状态SQL组入$map
           if ($entry_status) {
                 $map['entry_status'] = $entry_status;
           }
           //把婚姻状态SQL组入$map
           if ($marital_status) {
                 $map['marital_status'] = $marital_status;
           }
           //把学历SQL组入$map
           if ($education) {
                 $map['education'] = $education;
           }

           //把员工类型SQL组入$map
           if ($type) {
                 $map['type'] = $type;
           }

           //把身份证SQL组入$map
           if ($id_card) {
                 $map['id_card'] = $id_card;
           }
           //把民族SQL组入$map
           if ($nation) {
                 $map['nation'] = $nation;
           }
           //把未关联SQL组入$map
           if ($uid) {
                 $map['uid'] = array('neq', 0);
           }
           $object = $this->relation('Post')
               ->field('id,name,number,pid,nation,tel,marital_status,gender,id_card,type,entry_status,entry_date,education')
               ->where($map)
               ->order(array($sort=>$order))
               ->limit(($rows * ($page - 1)), $rows)
               ->select();
           //处理一下post
           foreach ($object as $key=>$value) {
                 $object[$key]['post'] = $object[$key]['Post']['name'];
           }
           return array(
               'total'=>$this->count(),
               'rows'=>$object ? $object : '',
           );
    }
    //添加档案
    public  function register ($name, $gender, $number, $pid,
                               $type, $tel, $id_card, $nation,
                               $marital_status, $entry_status, $entry_date,
                               $dimission_date, $politics_status, $specialty,
                               $education, $health, $registered, $registered_address,
                               $graduate_date, $graduate_colleges, $intro, $details) {
          $data = array(
              'name'=>$name,
              'gender'=>$gender,
              'number'=>$number,
              'pid'=>$pid,
              'type'=>$type,
              'tel'=>$tel,
              'id_card'=>$id_card,
              'nation'=>$nation,
              'marital_status'=>$marital_status,
              'entry_status'=>$entry_status,
              'entry_date'=>$entry_date,
              'dimission_date'=>$dimission_date,
              'politics_status'=>$politics_status,
              'education'=>$education,
              'Extend'=>array(
                  'health'=>$health,
                  'specialty'=>$specialty,
                  'registered'=>$registered,
                  'registered_address'=>$registered_address,
                  'graduate_date'=>$graduate_date,
                  'graduate_colleges'=>$graduate_colleges,
                  'intro'=>$intro,
                  'details'=>$details
              )
          );
          if ($this->create($data)) {
                $data['create_time'] = get_time();
                $sid = $this->relation('Extend')->add($data);
                echo $this->getLastSql();
                echo '1111';
                return $sid ? $sid : 0;
          } else {
                echo '2222';
                return $this->getError();
          }
    }
}
