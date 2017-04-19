<?php
    $dir=dirname(__FILE__);
    require $dir.'/db.php';         //引入操作mysal的类
    require $dir.'/PHPExcel.php';   //引入excel类
    require $dir.'/PHPExcel/Writer/Excel2007.php';   //引入excel类
    $db=new db($phpexcel);
    $objPHPExcel=new PHPExcel();
    /*for($i=1;$i<=3;$i++){                                 //写入不同的内置表
           if($i>1){
                $objPHPExcel->createSheet();              //创建新的内置表
           } 
           $objPHPExcel->setActiveSheetIndex($i-1);       //设置当前的活动的sheet
           $objSheet=$objPHPExcel->getActiveSheet();
           $objSheet->setTitle($i.'年级');
           $objSheet->SetCellValue('A1','姓名');
           $objSheet->SetCellValue('B1','分数');
           $objSheet->SetCellValue('C1','班级');
           //获取当前年级的学生
           $sql="select username,score,class from crm_student where grade=".$i;
           $data=$db->getResult($sql);
           $j=2;
           foreach ($data as $key => $value) {
                $objSheet->SetCellValue('A'.$j,$value['username']);
                $objSheet->SetCellValue('B'.$j,$value['score']);
                $objSheet->SetCellValue('C'.$j,$value['class']);
                $j++;
           }
    } */
    //写入1张内置表
    $objPHPExcel->setActiveSheetIndex(0);
    $objSheet=$objPHPExcel->getActiveSheet();
    //设置excel文件默认水平垂直方向居中
    $objSheet->getDefaultStyle()->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
    $objSheet->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $objSheet->getDefaultStyle()->getFont()->setName("微软雅黑");                                                              //设置字体
    $objSheet->getDefaultRowDimension()->setRowHeight(20);                                                                     //设置默认行高
    $objSheet->getRowDimension(2)->setRowHeight(30);                                                                           //设置第二行行高
    $objSheet->getStyle('A2:Z2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('6fc144');   //设置背景颜色
    //获取所有的年级
    $allGrade=$db->getAllGrade();
    $cellIndex=0;
    foreach ($allGrade as $key => $value) {
        //获取班级       
        $gradeIndex=getCells($cellIndex*2);//获取年级信息所在列
        $objSheet->setCellValue($gradeIndex."2","高".$value['grade']);
        $objSheet->getStyle($gradeIndex."2")->getFont()->setSize(18);
        $allClass=$db->getAllClass($value['grade']);
        foreach ($allClass as $k1 => $v1) {
            $nameIndex=getCells($cellIndex*2);//获得每个班级学生姓名所在列位置
            $scoreIndex=getCells($cellIndex*2+1);//获得每个班级学生分数所在列位置
            $objSheet->mergeCells($nameIndex."3:".$scoreIndex."3");//合并每个班级的单元格
            $objSheet->getStyle($nameIndex."3")->getFont()->setSize(16);
            $getStudent=$db->getAllStudent($value['grade'],$v1['class']);
            $objSheet->SetCellValue(getCells($cellIndex*2).'3','班'.$v1['class']);
            $j=4;
            foreach ($getStudent as $k2 => $v2) {
                $objSheet->SetCellValue(getCells($cellIndex*2).$j,$v2['username']);
                $objSheet->SetCellValue(getCells(($cellIndex*2+1)).$j,$v2['score']);
                $j++;
            }
            $cellIndex++;
        }
        $endGradeIndex=getCells($cellIndex*2-1);                   //获得每个年级的终止单元格
        //合并每个年级的单元格
        $objSheet->mergeCells($gradeIndex."2:".$endGradeIndex."2");
        $gradeBorder=getBorderStyle("c144b1");//获取年级边框样式代码
        $objSheet->getStyle($gradeIndex."2:".$endGradeIndex."2")->applyFromArray($gradeBorder);//设置每个年级的边框

    }
    $objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
    //$objWriter->save($dir.'/export.xls');  //保存到服务器
    //输出到浏览器
    //exit();
    browser_export('Excel5','browser_excel03.xls');//输出到浏览器
    $objWriter->save("php://output");
  
    function browser_export($type,$filename){
                if($type=="Excel5"){
                        header('Content-Type: application/vnd.ms-excel');//告诉浏览器将要输出excel03文件
                }else{
                        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');//告诉浏览器数据excel07文件
                }
                header('Content-Disposition: attachment;filename="'.$filename.'"');//告诉浏览器将输出文件的名称
                header('Cache-Control: max-age=0');                                //禁止缓存
     }
     /**
        **根据下标获得单元格所在列位置
     **/
     function getCells ($index) {
        $arr=range('A','Z');
        return $arr[$index];
    }
    /**
     **获取边框样式代码
    **/
    function getBorderStyle($color){
            $styleArray = array(
                'borders' => array(
                    'outline' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THICK,
                        'color' => array('rgb' => $color),
                    ),
                ),
            );
            return $styleArray;
    }
?>