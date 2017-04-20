<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/11
 * Time: 13:30
 */
//得到当前时间
function get_time() {
    return date('Y-m-d H:i:s');
}


//生成以当前时间的字符串
function get_time_string() {
    return date('YmdHis');
}

//获取单元格
function getCells($index){
    $arr=range('A','Z');
    //$arr=array(A,B,C,D,E,F,G,H,I,J,K,L,M,N,....Z);
    return $arr[$index];
}

function browser_export($type,$filename){
    if($type=="Excel5"){
        header('Content-Type: application/vnd.ms-excel');//告诉浏览器将要输出excel03文件
    }else{
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');//告诉浏览器数据excel07文件
    }
    header('Content-Disposition: attachment;filename="'.$filename.'"');//告诉浏览器将输出文件的名称
    header('Cache-Control: max-age=0');//禁止缓存
}