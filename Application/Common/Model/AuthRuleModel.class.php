<?php

namespace Common\Model;
use Think\Model;

class AuthRuleModel extends  Model {
    //获取菜单导航
    public  function  getNav ($ids)
    {
        //1.先要得到所有主导航和当前角色的权限导航
        $map['nid'] = 0;
        $map['id'] = array('in', $ids);
        $map['_logic'] = 'or';
        //注意：easyui  tree菜单的字段要与数据的字段，一样，如果不一样，会出现不一致的，前端不能正常的显示(很重要)
        $object = $this->field('id,title as text,name as url ,iconCls,nid')->where($map)->select();
        $nav = $tree = [];
        //先帅选出根节点
        foreach ($object as $key => $value) {
            if ($value['nid'] == 0) {
                $tree[] = $value;
            }
        }
        //将子节点合并到对应的根节点
        foreach ($tree as $treeKey => $treeValue) {
            foreach ($object as $objectKey => $objectValue) {
                if ($treeValue['id'] == $objectValue['nid']) {
                    $tree[$treeKey]['children'][] = $objectValue;
                }
            }
        }
        //剔除掉空的主导航
        foreach ($tree as $treeKey => $treeValue) {
            if ($tree[$treeKey]['children']) {
                $nav[] = $tree[$treeKey];
            }
        }
        return $nav;
    }

}