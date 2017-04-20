<?php
/**
 * Created by PhpStorm.
 * User: zmz
 * Date: 2017/1/23
 * Time: 10:39
 */
namespace Admin\Controller;
use Common\Controller\BaseController;
use Common\Model\ReceiptModel;
import("Org.Util.PHPExcel");
import("Org.Util.PHPExcel.IOFactory");
class ReceiptController extends  BaseController  {

    //加载收款列表
  public  function getList () {
    if(IS_AJAX){
          $receiptData= (new ReceiptModel())->getList(I('post.page'), I('post.rows'), I('post.order'),
                                                      I('post.sort'), I('post.keywords'), I('post.date'),
                                                      I('post.date_from'), I('post.date_to'));
          $this->ajaxReturn($receiptData);
      }else{
        $this->error('非法操作!');
    }
  }

    //添加订单信息
   public function register () {
        if(IS_AJAX){
            $code=(new ReceiptModel())->register(I('post.order_id'), I('post.order_title'), I('post.order_amount'),
                                                 I('post.way'), I('post.remark'));
            if($code>0){
                 $this->responseSuccess();
               }else{
                 $this->responseError($code);
            }
            }else{
            $this->error('非法操作!');
        }
   }
   //获取收款详情
   public function  getDetails () {
        if(IS_AJAX){
             $object=(new ReceiptModel())->getDetails(I('get.id'));
             $this->assign('object',$object);
             $this->display('details');
           }else{
            $this->error('非法操作!');
        }
   }
   //导出Excel文件
    public function  exportExcel  () {
        error_reporting(E_ALL);

       $object=(new ReceiptModel())->exportExcel(I('get.keywords'),I('get.dateType'),
                                                  I('get.dateFrom'),I('get.dateTo'));
        $objPHPExcel=new \PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objSheet=$objPHPExcel->getActiveSheet();

        $objSheet->getDefaultStyle()->getAlignment()
                ->setVertical(\PHPExcel_Style_Alignment::VERTICAL_CENTER)->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);//设置excel文件默认水平垂直方向居中
        $objSheet->getDefaultStyle()->getFont()->setSize(12);//设置默认字体大小和格式
        $objSheet->getStyle("A3:Z3")->getFont()->setSize(13)->setBold(true);//设置第三行字体大小和加粗
        $objSheet->getDefaultRowDimension()->setRowHeight(20);//设置默认行高
        $objSheet->getColumnDimension('A')->setWidth(20);     //设置列宽
        $objSheet->getColumnDimension('B')->setWidth(25);     //设置列宽
        $objSheet->getColumnDimension('E')->setWidth(20);     //设置列宽
        $objSheet->getColumnDimension('G')->setWidth(26);     //设置列宽
        $objSheet->setTitle('收款记录');
        $objSheet  ->setCellValue('A3','付款编码') ->setCellValue('B3','订单标题')
                   ->setCellValue('C3','付款金额') ->setCellValue('D3','付款方式')
                   ->setCellValue('E3','备注')    ->setCellValue('F3','录入人')
                   ->setCellValue('G3','创建时间');
        $j=4;
        //setCellValueExplicit 去掉数字的科学技术发
        foreach($object as  $k=>$v){
            $objSheet   ->setCellValueExplicit('A'.$j,$v['order_sn'],\PHPExcel_Cell_DataType::TYPE_STRING) ->setCellValue('B'.$j,$v['order_title'])
                        ->setCellValue('C'.$j,$v['order_amount']) ->setCellValue('D'.$j,$v['way'])
                        ->setCellValue('E'.$j,$v['remark'])    ->setCellValue('F'.$j,$v['enter'])
                        ->setCellValue('G'.$j,$v['create_time']);
            $j++;
        }
        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        browser_export('Excel5','browser_excel03.xls');//输出到浏览器
        $objWriter->save('php://output');
        exit();
    }
}