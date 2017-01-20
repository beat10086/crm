<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 19:28
 */
namespace  Common\Model;


use Think\Model\RelationModel;

class UserModel extends  RelationModel   {
    protected  $_validate=array(
        //帐号长度不合法
        array('accounts', '2,20', '帐号长度不合法', self::EXISTS_VALIDATE, 'length', self::MODEL_INSERT),
        //密码长度不合法
        array('password', '6,30', '密码长度不合法', self::EXISTS_VALIDATE, 'length'),
        //帐户名称已存在
        array('accounts', '', '帐号名称已存在', self::EXISTS_VALIDATE, 'unique', self::MODEL_INSERT),
        //姓名长度不合法
        //array('name', '2,20', '真实姓名长度不合法', self::VALUE_VALIDATE, 'length'),
        //邮箱格式不合法
        array('email', 'email', '邮箱格式不合法', self::VALUE_VALIDATE),
        //邮箱已存在
        array('email', '', '邮箱已存在', self::VALUE_VALIDATE, 'unique'),
        //手机格式不合法
        //array('tel', '/^1[0-9]{10}$/', '手机格式不合法', self::VALUE_VALIDATE),
        //手机已存在
        //array('tel', '', '手机已存在', self::VALUE_VALIDATE, 'unique')
    );
    //用户表自动完成
    protected $_auto = array(
        array('create_time', 'get_time', self::MODEL_INSERT, 'function'),
        array('password', 'sha1', self::MODEL_INSERT, 'function'),
    );
    public  function  getList ($page, $rows, $order, $sort, $keywords, $date, $date_from, $date_to, $state) {
       $map = array();
       $keywords_map = array();
       $date_map     = array();
       //如果有关键字，进行组装
       if($keywords){
           $keywords_map['accounts']=array('like','%'.$keywords.'%');
           $keywords_map['email']=array('like','%'.$keywords.'%');
           $keywords_map['name']=array('like','%'.$keywords.'%');
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
       //把状态SQL组入$map
       if ($state) {
           $map['state'] = $state;
       }
       $object=$this->field('id,accounts,name,email,last_login_time,last_login_ip,login_count,state,create_time')
                    ->where($map)
                    ->order(array($sort=>$order))
                    ->limit(($rows * ($page - 1)), $rows)
                    ->select();
       //$this->getLastSql(); 打印运行的数据库
       return [
            'total'=>$this->count(),
            'rows' =>$object?$object:''
      ];
  }
   //添加会员
    public  function  register ($accounts, $password, $email, $uid, $name){
           $data=[
               'accounts'=>$accounts,
               'password'=>$password,
               'email'   =>$email,
               'name'    =>$name
           ];
           if($this->create($data)){
                   $id=$this->add();
                   //登录用户和档案关联
                   $update = array(
                       'id'=>$uid,
                       'uid'=>$id
                   );
                  (new StaffModel())->save();
                   return $id?$id:0;
              }else{
               $error_code = 0;
               switch ($this->getError()) {
                       case '帐号名称已存在' :
                           $error_code = -1;
                           break;
                       case '邮箱已存在' :
                           $error_code = -2;
                           break;
                   }
               return $error_code;
           }
    }
    //获取一条账号
    public  function  getUser ($id) {
        $map['id'] = $id;
        $object=$this->field('id,name,accounts,email,state')
                     ->where($map)
                     ->find();
        return $object;
    }
    //修改用户
    public function update($id, $password, $email, $state, $name, $uid, $user_name) {

        $data = array(
            'id'=>$id,
            'email'=>$email,
            'state'=>$state,
            'name'=>$user_name,
            'Staff'=>array(
                'uid'=>$uid,
                'name'=>$name
            )
        );

        if ($this->create($data)) {
            if ($password) {
                $data['password'] = sha1($password);
            }

            $update_rows = 0;

            //判断关联被修改后需要处理的内容
            if (!empty($data['Staff']['uid']) && $data['Staff']['name'] != $data['Staff']['uid']) {
                //本身有关联，需要释放
                if ($data['Staff']['name']) {
                    $map['name'] = $name;
                    $update = array(
                        'uid'=>0
                    );
                    M('Staff')->where($map)->save($update);
                }
                $update = array(
                    'id'=>$uid,
                    'uid'=>$id
                );
                $update_rows = M('Staff')->save($update);
            }

            $rows = $this->save($data) + $update_rows;
            return $rows ? $rows : 0;
        } else {
            $error_code = 0;
            switch ($this->getError()) {
                case '密码长度不合法' :
                    $error_code = -1;
                    break;
                case '邮箱已存在' :
                    $error_code = -2;
                    break;
            }
            return $error_code;
        }
    }
    //删除用户
    public function remove ($ids){
         $map['uid']=$ids;
         $update=array(
               'uid'=>0
         );
        (new StaffModel())->where($map)->save($update);
        return $this->delete($ids);
    }
}