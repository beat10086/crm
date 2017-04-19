<?php
  header('Content-type:text/html;charset=utf-8');
  $dir=dirname(__FILE__);  //找到当前脚本所在路径
  require   $dir.'/PHPExcel/IOFactory.php';  //引入读取excel的类文件
  $filename =str_replace('\\','/',$dir.'/yinping.xlsx');   //加载文件，注意不要包含汉子
  $fileType =PHPExcel_IOFactory::identify($filename);      //自动获取文件的类型提供给phpexcel用(Excel2007)
  $objReader=PHPExcel_IOFactory::createReader($fileType);  //获取文件读取操作对象
  $phpExcel =$objReader->load($filename);                              //加载文件
  $sheetCount=$phpExcel->getSheetCount();                  //获取sheet的个数
  /*for($i=0;$i<$sheetCount;$i++){
       $data=$phpExcel->getSheet($i)->toArray();  //读取每个sheet里的数据 全部放入到数组中
  }*/
  //局部获取sheet数据
  /*foreach($objPHPExcel->getWorksheetIterator() as $sheet){//循环取sheet
		foreach($sheet->getRowIterator() as $row){//逐行处理
				if($row->getRowIndex()<2){
					continue;
				}
				foreach($row->getCellIterator() as $cell){//逐列读取
						$data=$cell->getValue();//获取单元格数据
						echo $data." ";
				}
				echo '<br/>';
		}
		echo '<br/>';
}*/
?>
