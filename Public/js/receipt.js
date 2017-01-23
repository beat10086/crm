$(function(){
    //收款列表
    $('#receipt').datagrid({
        url : ThinkPHP['MODULE'] + '/Receipt/getList',
        fit : true,
        fitColumns : true,
        striped : true,
        rownumbers : true,
        border : false,
        pagination : true,
        pageSize : 20,
        pageList : [10, 20, 30, 40, 50],
        pageNumber : 1,
        sortName : 'create_time',
        sortOrder : 'DESC',
        toolbar : '#receipt-tool',
        columns : [[
            {
                field : 'id',
                title : '产品编号',
                width : 60,
                checkbox : true
            },
            {
                field : 'sn',
                title : '付款编号',
                width : 100
            },
            {
                field : 'order_title',
                title : '订单标题',
                width : 150
            },
            {
                field : 'order_amount',
                title : '付款金额',
                width : 80
            },
            {
                field : 'way',
                title : '付款方式',
                width : 80
            },
            {
                field : 'remark',
                title : '备注',
                width : 100
            },
            {
                field : 'enter',
                title : '录入员',
                width : 80
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
                formatter : function (value,row) {
                    return '<a href="javascript:void(0)" class="client-details" style="height: 18px;margin-left:2px;" onclick="client_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function() {
            $('.client-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
        onClickCell : function (index, field) {
            if (field == 'details') {
                $('#client').datagrid('selectRow', index);
            }
        }
    });
    //新增和修改订单
    $('#receipt-order-title-add, #receipt-title-edit').textbox({
        width : 240,
        height : 32,
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#receipt-order').dialog('open');
            }
        }],
        required : true,
        missingMessage : '请点击放大镜图标选择跟单',
        invalidMessage : '跟单记录不得为空'
    });
    //弹出选择订单记录
    $('#receipt-order').dialog({
        width: 550,
        height: 380,
        title: '选择订单',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#receipt-order-search-keywords').textbox();
            $('#receipt-order-search-button').linkbutton();
            $('#receipt-order-search-refresh').linkbutton();
            $('#receipt-order-search-reset').linkbutton();
            $('#receipt-order-table').datagrid({
                url : ThinkPHP['MODULE'] + '/Order/getList',
                queryParams : {
                    neg : true
                },
                fit : true,
                fitColumns : true,
                striped : true,
                rownumbers : true,
                border : false,
                pagination : true,
                pageSize : 10,
                pageList : [10, 20, 30, 40, 50],
                pageNumber : 1,
                sortName : 'create_time',
                sortOrder : 'DESC',
                toolbar : '#receipt-order-tool',
                columns : [[
                    {
                        field : 'sn',
                        title : '订单编号',
                        width : 100
                    },
                    {
                        field : 'title',
                        title : '订单标题',
                        width : 150
                    },
                    {
                        field : 'amount',
                        title : '订单金额',
                        width : 80
                    },
                    {
                        field : 'select',
                        title : '选择订单',
                        width : 60,
                        formatter : function (value, row) {
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="receipt_order_tool.select(\'' + row.id + '\', \'' + row.title + '\', \'' + row.amount + '\');">选择</a>';
                        }
                    },
                    {
                        field : 'create_time',
                        title : '创建时间',
                        width : 60,
                        hidden : true
                    }
                ]],
                onLoadSuccess : function() {
                    $('.select-button').linkbutton({
                        iconCls : 'icon-tick',
                        plain : true
                    });
                },
                onClickCell : function (index) {
                    $('#documentary-search-client').datagrid('selectRow', index);
                }
            });
        }
    });
    //新增和修改订单金额
    $('#receipt-order-amount-add, #receipt-order-amount-edit').textbox({
        width : 240,
        height : 32,
        editable : false
    });
    //付款方式
    $('#receipt-way-add, #receipt-way-edit').combobox({
        width : 150,
        height : 32,
        data : [{
            id : '银行转账',
            text : '银行转账'
        }, {
            id : '支付宝',
            text : '支付宝'
        }, {
            id : '现金支付',
            text : '现金支付'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //详情备注
    $('#receipt-remark-add, #receipt-remark-edit').textbox({
        width: 240,
        height: 32
    });
    //新增面板
    $('#receipt-add').dialog({
        width : 420,
        height : 300,
        title : '新增收款项',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#receipt-add').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Receipt/register',
                        type : 'POST',
                        data : {
                            order_id : $('input[name="receipt_order_id_add"]').val(),
                            order_title : $.trim($('input[name="receipt_order_title_add"]').val()),
                            order_amount : $('input[name="receipt_order_amount_add"]').val(),
                            way : $.trim($('input[name="receipt_way_add"]').val()),
                            remark : $('input[name="receipt_remark_add"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试保存...'
                            });
                        },
                        success : function(data) {
                            $.messager.progress('close');
                            if (data > 0) {
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : '添加收款记录成功！'
                                });
                                $('#receipt-add').dialog('close');
                                $('#receipt').datagrid('load');
                            }
                        }
                    });
                }
            }
        },{
            text : '取消',
            size : 'large',
            iconCls : 'icon-cross',
            handler : function () {
                $('#receipt-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#receipt-add').form('reset');
        }
    });
})
//收款工具栏
var receipt_tool={
      add:function(){
          $('#receipt-add').dialog('open');
      },
     edit:function(){

     }
}
//关联订单工具栏
var receipt_order_tool={
    search:function(){
        $('#order-documentary-table').datagrid('load', {
            keywords: $.trim($('input[name="receipt_order_search_keywords"]').val()),
            neg : true
        });
    },
    select:function(id, title, amount){
        $('#receipt-order-title-add').textbox('setValue', title);
        $('#receipt-order-id-add').val(id);
        $('#receipt-order-amount-add').textbox('setValue', amount);
        $('#receipt-order').dialog('close');
        this.reset();
    },
    reset : function () {
        $('#order-documentary-search-keywords').textbox('clear');
        $('#order-documentary-table').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}