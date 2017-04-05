<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/10
 * Time: 16:54
 */
namespace Common\Model;
use Think\Model;

class NavModel extends  Model {
    //获取菜单导航
    public  function  getNav ($ids) {
         //1.先要得到所有主导航和当前角色的权限导航
         $map['nid'] = 0;
         $map['id'] = array('in', $ids);
         $map['_logic'] ='or';
         $object=$this->field('id,text,url,iconCls,nid')->where($map)->select();
         $nav =$tree=[];
         //先帅选出根节点
        foreach($object as  $key=>$value){
             if($value['nid']==0){
                 $tree[]=$value;
             }
        }
        //将子节点合并到对应的根节点
        foreach($tree as $treeKey=>$treeValue){
            foreach ($object as $objectKey=>$objectValue) {
                if ($treeValue['id'] == $objectValue['nid']) {
                    $tree[$treeKey]['children'][] = $objectValue;
                }
            }
        }
        //剔除掉空的主导航
        foreach ($tree as $treeKey=>$treeValue) {
            if ($tree[$treeKey]['children']) {
                $nav[] = $tree[$treeKey];
            }
        }
        return $nav;
    }
}
