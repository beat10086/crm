<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 19:28
 */
namespace  Common\Model;

use Think\Model;

class UserModel extends  Model  {

   public  function  getList () {
      $object=$this->select();
      return [
            'total'=>$this->count(),
            'rows'=>$object
      ];
  }
}