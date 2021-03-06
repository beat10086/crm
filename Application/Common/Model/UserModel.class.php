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
    //关联模型
    protected $_link = array(
        //关联档案表(对方表包含我的id，用HAS_ONE)
        'Staff'=>array(
            'mapping_type'=>self::HAS_ONE,
            'class_name'=>'Staff',
            'foreign_key'=>'uid',
            'mapping_fields'=>'pid'
        ),
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
       $object=$this->field('crm_user.id,
                             crm_user.accounts,
                             crm_user.email,
                             crm_user.last_login_time,
                             crm_user.last_login_ip,
                             crm_user.login_count,
                             crm_user.state,
                             crm_user.create_time,
                             crm_staff.name,
                             crm_staff.post')
                    ->join('crm_staff on crm_user.staff_id =crm_staff.id','LEFT')
                    ->where($map)
                    ->order(array($sort=>$order))
                    ->limit(($rows * ($page - 1)), $rows)
                    ->select();
        foreach($object as  $k =>$v){
               if(empty($v['state'])){
                   $object[$k]['state']='冻结';
               }
        }
       return [
            'total'=>$this->where($map)->count(),
            'rows' =>$object?$object:''
      ];
  }
   //添加会员
    public  function  register ($accounts, $password, $email, $uid, $name){
           $data=[
               'accounts'   =>$accounts,
               'password'   =>$password,
               'email'      =>$email,
               'staff_id'   =>$uid,
               'staff_name' =>$name
           ];
           if($this->create($data)){
                   $id=$this->add();
                   //登录用户和档案关联
                   $update = array(
                       'id'=>$uid,
                       'user_id'=>$id
                   );
                   (new StaffModel())->save($update);
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
        $object=$this->field('crm_user.id,
                              crm_user.accounts,
                              crm_user.email,
                              crm_user.state,
                              crm_user.staff_id,
                              crm_user.staff_name')
                     ->where($map)
                     ->find();
        return $object;
    }
    //修改用户
    public function update($id, $password, $email, $state, $staff_id,$staff_name) {
        $data = array(
            'id'=>$id,
            'email'=>$email,
            'state'=>$state,
            'staff_id'=> $staff_id,
            'staff_name'=>$staff_name
        );

        if ($this->create($data)) {
            if ($password) {
                $data['password'] = $password;
            }
            //判断是否修改了关联档案，可以判断$staff_id 是否是数值
            if(is_numeric($staff_id)){
                //原来的值清零
                M('Staff')->where('user_id='.$id)->setField('user_id', 0);
                //现在的值赋值
                M('Staff')->where('id='.$staff_id)->setField('user_id', $id);
            }
            $id = $this->save($data);
            return $id ? $id : 0;
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
    //删除用户(根据ID集合删除记录)
    public function remove ($ids){
        //删除前解除绑定
         $map['user_id']=$ids;
         $update=array(
               'user_id'=>0
         );
        (new StaffModel())->where($map)->save($update);
        return $this->delete($ids);
    }
    //登录用户
    public function  login ($accounts, $password){
        $data = array(
            'accounts'=>$accounts,
            'password'=>$password
        );
        if($this->create($data,4)){
            $map['accounts'] = $accounts;
            $map['password'] = sha1($password);
            //这个左链接比较好
            $object = $this ->field('crm_user.id,
                                        crm_user.accounts,
                                        crm_user.state,
                                        crm_staff.id AS staff_id,
                                        crm_staff.name AS staff_name,
                                        crm_staff.post')
                ->join('crm_staff ON crm_staff.id=crm_user.staff_id', 'LEFT')
                ->where($map)
                ->find();
             if($object){
                  //冻结帐号返回-1
                  if($object['state']=='冻结') return -1;
                  //是否关联档案
                  if (!$object['staff_id']) return -2;

                  //把数据放入session
                  session('admin', array(
                      'id'=>$object['id'],
                      'accounts'=>$object['accounts'],
                      'staff_id'=>$object['staff_id'],
                      'staff_name'=>$object['staff_name'],
                      'post'=>$object['post']
                  ));
                  $update = array(
                     'id'=>$object['id'],
                     'last_login_time'=>get_time(),
                     'last_login_ip'=>get_client_ip(),
                     'login_count'=>$object['login_count'] + 1
                  );
                  $this->save($update);
                  //写入日志
                  $param = array(
                     'user'     =>$object['accounts'].'('.$object['staff_name'].')',
                     'type_name'=>'登录操作',
                     'module'   =>'人事管理 >> 登录帐号',
                     'ip'       =>get_client_ip()
                 );
                 tag('log', $param);
                 return $object['id'];
                 }else{
                   return 0;
             }
            }else{
             return  $this->getError();
        }
    }
    //设置状态
    public function state ($id,$state){
         $data=array(
              'id'   =>$id,
              'state'=>$state
         );
        return $this->save($data);
    }
    //获取用户信息
    public function getDetails ($id) {
           $map['id']=$id;
           $object=  $this->field('accounts,email,staff_name,last_login_time,
                        last_login_ip,login_count,state,create_time')->where($map)->find();
          return $object;
    }
}