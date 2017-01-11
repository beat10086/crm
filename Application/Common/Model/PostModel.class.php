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
    public  function   getList () {
        $object= $this->field('id,name,create_time')
                      ->select();
        return  [
               'total'=>$this->count(),
               'rows' =>$object
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

}
