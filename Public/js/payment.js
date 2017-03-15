var payment                       =   $('#payment')
    paymentSearchKeywords         =   $('#payment-search-keywords'),
    paymentSearchDateType         =   $('#payment-search-date-type'),
    paymentSearchDateFrom         =   $('#payment-search-date-from'),
    paymentSearchDateTo           =   $('#payment-search-date-to'),
    paymentTool                   =   $('#payment-tool');


//表格数据列表
payment.datagrid({
    url: ThinkPHP['MODULE'] + '/Payment/getList',
    fit: true,
    fitColumns: true,
    rownumbers: true,
    singleSelect : true,
    queryParams : {
        payment : true
    },
    border: false,
    sortName: 'create_time',
    sortOrder: 'DESC',
    toolbar: '#payment-tool',
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
            field : 'sell_price',
            title : '销售价格',
            width : 60
        },
        {
            field : 'number',
            title : '入库数量',
            width : 60
        },
        {
            field : 'total',
            title : '支出金额',
            width : 60,
            formatter : function (value,row)
            {
                if (row.mode == '采购')
                {
                    return (row.number * row.pro_price).toFixed(2);
                } else {
                    return (row.number * row.sell_price).toFixed(2);
                }

            }
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
                return '<a href="javascript:void(0)" class="payment-details" style="height: 18px;margin-left:2px;" onclick="paymentOpt.details(' + row.id + ');"></a>';
            }
        }
    ]],
    onLoadSuccess : function()
    {
        $('.payment-details').linkbutton({
            iconCls : 'icon-text',
            plain : true
        });
    },
    onClickCell : function (index, field)
    {
        if (field == 'details') {
            $('#payment').datagrid('selectRow', index);
        }
    }
});

var  paymentOpt={
        details:function(id){
            /*$('#details-dialog').dialog('open').dialog('setTitle', '产品采购信息详情')
                .dialog('refresh', ThinkPHP['MODULE'] + '/Inlib/getDetails/?id=' + id);*/
            alert('正在开发中');
        },
        search : function (){
            if (paymentTool.form('validate')){
                payment.datagrid('load', {
                    keywords : paymentSearchKeywords.textbox('getValue'),
                    dateType : paymentSearchDateType.combobox('getValue'),
                    dateFrom : paymentSearchDateFrom.datebox('getValue'),
                    dateTo   : paymentSearchDateTo.datebox('getValue'),
                    payment : true
                });
            }
        },
        reload:function(){
            payment.datagrid('reload');
        },
        reset:function(){
            paymentSearchKeywords.textbox('clear');
            paymentSearchDateType.combobox('clear').combobox('disableValidation');
            paymentSearchDateFrom.datebox('clear');
            paymentSearchDateTo.datebox('clear');
            this.search();
    }
}

/*查询字段区域*/
//查询关键字
paymentSearchKeywords.textbox({
    width : 150,
    prompt : '产品名称或编号'
});

//时间类型旋转
paymentSearchDateType.combobox({
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
paymentDate = {
    width : 100,
    editable : false,
    onSelect : function ()
    {
        if (paymentSearchDateType.combobox('enableValidation').combobox('isValid') == false)
        {
            paymentSearchDateType.combobox('showPanel');
        }
    }
};

//起始时间
paymentDate.prompt = '起始时间';
paymentSearchDateFrom.datebox(paymentDate);

//结束时间
paymentDate.prompt = '结束时间';
paymentSearchDateTo.datebox(paymentDate);