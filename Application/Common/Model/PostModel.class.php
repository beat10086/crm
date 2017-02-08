<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/11
 * Time: 10:48
 */
namespace  Common\Model;

use Think\Model;

class PostModel extends  Model {
    //职位信息自动验证
    protected $_validate=array(
        //职位名称长度不合法！
        array('name', '2,20', '帐号长度不合法', self::EXISTS_VALIDATE, 'length', self::MODEL_INSERT),
        //职位名称已存在
        array('name', '', '职位名称已存在', self::EXISTS_VALIDATE, 'unique', self::MODEL_BOTH),
    );
    //职位表自动完成
    protected  $_auto=array(
        array('create_time','get_time',self::MODEL_INSERT,'function')
    );
    //获取职位的数据
    public  function   getList ($page,$rows,$name,$order,$sort,$date,$date_from,$date_to) {
        $map=[];
        if($name){
              $map['name']=array('like','%'.$name.'%');
        }
        if($date_from &&  $date_to ){
            $map["$date"]=array(array('EGT',date($date_from)),array('ELT',date($date_to)));
        }else if($date_from){
            $map["$date"]=array(array('EGT',date($date_from)));
        }else if($date_to){
            $map["$date"]=array(array('ELT',date($date_from)));
        }
        $object= $this->where($map)
                      ->field('id,name,create_time')
                      ->limit(($rows * ($page - 1)),$rows)
                      ->order(array($sort=>$order))
                      ->select();
        return  [
               'total'=>$this->count(),
               'rows' =>$object?$object:''
        ];
    }
    //添加职位
    public   function  register ($name) {
          $data=[
               'name'=>$name
          ];
          if($this->create($data)){
               $pid=$this->add();
               return $pid?$pid:0;
          }else{
               if($this->getError()=='职位名称已存在'){
                     return -1;
               }
               return $this->getError();
          }
    }
    //获取1条职位信息
    public  function getPost ($id) {
        $map['id'] = $id;
        return $this->field('id,name')->where($map)->find();
    }
    //修改职位
    public function update ($id,$name) {
          $data=[
                'id'=>$id,
                'name'=>$name
          ];
        if($this->create($data)){
              $uid=$this->save();
              return $uid?$uid:0;
        }else{
            if ($this->getError() == '职位名称已存在') {
                return -1;
            }
            return $this->getError();
        }
    }
    //删除职位(这里不能直接删除,因为档案里面关联的职位)
    public function remove ($ids) {
        //判断档案是否关联职位
        $arr=explode(',',$ids);
        foreach($arr as   $key=>$value){
             $map['id']=$value;
             $postData=$this->where($map)->find();
             if($postData){
                    $staff=D('staff');
                    $staffData=$staff->where(array('post'=>$postData['name']))->find();
                    if($staffData){
                          return -2;
                          break;
                    }
             }
        }
        return $this->delete($ids);
    }
    //获取所有的职位
    public function getListAll () {
          return $this->field('id,name')->select();
    }
}
