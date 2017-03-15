/**
 * Created by ASUS on 2016/9/27.
 */
var procure                       =   $('#procure')
    procureSearchKeywords         =   $('#procure-search-keywords'),
    procureSearchDateType         =   $('#procure-search-date-type'),
    procureSearchDateFrom         =   $('#procure-search-date-from'),
    procureSearchDateTo           =   $('#procure-search-date-to'),
    procureTool                   =   $('#procure-tool');

//表格数据列表
procure.datagrid({
    url: ThinkPHP['MODULE'] + '/Procure/getList',
    fit: true,
    fitColumns: true,
    rownumbers: true,
    singleSelect : true,
    queryParams : {
        procure : true
    },
    border: false,
    sortName: 'create_time',
    sortOrder: 'DESC',
    toolbar: '#procure-tool',
    pagination: true,
    pageSize: 20,
    pageList: [10, 20, 30, 40, 50],
    pageNumber: 1,
    columns: [[
        {
            field : 'id',
            title : '编号',
            width : 100,
            checkbox : true,
            hidden : true
        },
        {
            field : 'sn',
            title : '产品编号',
            width : 80
        },
        {
            field : 'name',
            title : '产品名称',
            width : 100
        },
        {
            field : 'type',
            title : '产品类型',
            width : 80
        },
        {
            field : 'pro_price',
            title : '采购价格',
            width : 60
        },
        {
            field : 'number',
            title : '入库数量',
            width : 60
        },
        {
            field : 'staff_name',
            title : '经办人',
            width : 60
        },
        {
            field : 'mode',
            title : '入库方式',
            width : 50
        },
        {
            field : 'mode_explain',
            title : '入库方式说明',
            width : 100
        },
        {
            field : 'enter',
            title : '录入员',
            width : 60
        },
        {
            field : 'create_time',
            title : '创建时间',
            width : 120,
            sortable : true
        },
        {
            field: 'details',
            title: '详情',
            width: 40,
            fixed : true,
            formatter : function (value,row)
            {
                return '<a href="javascript:void(0)" class="procure-details" style="height: 18px;margin-left:2px;" onclick="procureOpt.details(' + row.id + ');"></a>';
            }
        }
    ]],
    onLoadSuccess : function()
    {
        $('.procure-details').linkbutton({
            iconCls : 'icon-text',
            plain : true
        });
    },
    onClickCell : function (index, field)
    {
        if (field == 'details') {
            $('#procure').datagrid('selectRow', index);
        }
    }
});
//工具条操作
var procureOpt = {
    details:function(id){
        $('#details-dialog').dialog('open').dialog('setTitle', '产品采购信息详情')
            .dialog('refresh', ThinkPHP['MODULE'] + '/Inlib/getDetails/?id=' + id);
    },
    search : function (){
        if (procureTool.form('validate')){
            procure.datagrid('load', {
                keywords : procureSearchKeywords.textbox('getValue'),
                dateType : procureSearchDateType.combobox('getValue'),
                dateFrom : procureSearchDateFrom.datebox('getValue'),
                dateTo   : procureSearchDateTo.datebox('getValue'),
                procure : true
            });
        }
    },
    reload:function(){
        procure.datagrid('reload');
    },
    reset:function(){
        procureSearchKeywords.textbox('clear');
        procureSearchDateType.combobox('clear').combobox('disableValidation');
        procureSearchDateFrom.datebox('clear');
        procureSearchDateTo.datebox('clear');
        this.search();
    }
}
/*查询字段区域*/
//查询关键字
procureSearchKeywords.textbox({
    width : 150,
    prompt : '产品名称或编号'
});

//时间类型旋转
procureSearchDateType.combobox({
    width : 100,
    editable : false,
    prompt : '时间类型',
    data : [{
        id : 'create_time',
        text : '创建时间'
    }],
    valueField : 'id',
    textField : 'text',
    required : true,
    novalidate : true,
    panelHeight : 'auto',
    tipPosition : 'left',
    missingMessage : '请选择时间类型'
});

//查询时间对象
procureDate = {
    width : 100,
    editable : false,
    onSelect : function ()
    {
        if (procureSearchDateType.combobox('enableValidation').combobox('isValid') == false)
        {
            procureSearchDateType.combobox('showPanel');
        }
    }
};

//起始时间
procureDate.prompt = '起始时间';
procureSearchDateFrom.datebox(procureDate);

//结束时间
procureDate.prompt = '结束时间';
procureSearchDateTo.datebox(procureDate);
