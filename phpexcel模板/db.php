<?php
   require  dirname(__FILE__).'/dbconfig.php';  //引入PHP配置文件
    class db {
        public  $conn=null;

        //连接数据库
        public function __construct ($config) {
        	   $this->conn=mysql_connect($config['host'],$config['username'],$config['password']) or die(mysql_error()); //连接数据库
               mysql_select_db($config['database']) or die(mysql_error());                                               //选择数据库
               mysql_query('set names '.$config['charset']) or die (mysql_error());                                  //指定编码

        }
        //根据传入的sql语句,查询mysal的结果及
        public function getResult ($sql) {
              $resource=mysql_query($sql,$this->conn) or die(mysql_error());
              $res=array();
      			  while(($row=mysql_fetch_assoc($resource))!=false){
      					$res[]=$row;
      			  }
			      return $res; 
         }
         //获取年级
         public  function  getAllGrade () {
                $sql="select distinct(grade) from crm_student order by grade asc";
                $getGrade=$this->getResult($sql);
                return $getGrade;
         }
         //获取班级
          public  function getAllClass ($grade) {
                $sql="select distinct(class) from crm_student where grade=".$grade." order by grade asc";
                $getClass=$this->getResult($sql);
                return $getClass;
          }
         //获取学生
         public  function getAllStudent ($grade,$class) {
                $sql="select username,score from crm_student where grade=".$grade." and class=".$class." order by grade asc";
                $getStudent=$this->getResult($sql);
                return $getStudent;
         } 
    }

?>