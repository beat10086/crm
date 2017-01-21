$(function(){

    //预警列表
    $('#alarm').datagrid({
        url : ThinkPHP['MODULE'] + '/Product/getList',
        queryParams : {
            alarm : true
        },
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
        toolbar : '#alarm-tool',
        columns : [[
            {
                field : 'sn',
                title : '产品编号',
                width : 60
            },
            {
                field : 'name',
                title : '产品名称',
                width : 100
            },
            {
                field : 'type',
                title : '产品类型',
                width : 100,
                sortable : true
            },
            {
                field : 'unit',
                title : '计量单位',
                width : 60
            },
            {
                field : 'pro_price',
                title : '采购价格',
                width : 70
            },
            {
                field : 'sell_price',
                title : '销售价格',
                width : 70
            },
            {
                field : 'inventory',
                title : '库存',
                width : 70,
                sortable : true
            },
            {
                field : 'inventory_in',
                title : '入库总量',
                width : 70
            },
            {
                field : 'inventory_out',
                title : '出库总量',
                width : 70
            },
            {
                field : 'inventory_alarm',
                title : '库存警报量',
                width : 70
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
                    return '<a href="javascript:void(0)" class="alarm-details" style="height: 18px;margin-left:2px;" onclick="alarm_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function() {
            $('.alarm-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
        onClickCell : function (index) {
            $('#alarm').datagrid('selectRow', index);
        }
    });

    //状态搜索
    $('#alarm-search-type').combobox({
        width : 90,
        data : [{
            id : '办公用品',
            text : '办公用品'
        }, {
            id : '数码耗材',
            text : '数码耗材'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });

    //时间搜索
    $('#alarm-search-date').combobox({
        width : 90,
        data : [{
            id : 'create_time',
            text : '创建时间'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        required : true,
        missingMessage : '选择时间类型',
        panelHeight : 'auto',
        tipPosition : 'left',
        novalidate : true
    });

    //选择时间触发验证
    $('#alarm-search-date-from, #alarm-search-date-to').datebox({
        onSelect : function () {
            if ($('#alarm-search-date').combobox('enableValidation').combobox('isValid') == false) {
                $('#alarm-search-date').combobox('showPanel');
            }
        }
    });
})
//预警工具栏
var alarm_tool={
    search : function () {
        if ($('#alarm-tool').form('validate')) {
            $('#alarm').datagrid('load', {
                keywords: $.trim($('input[name="alarm_search_keywords"]').val()),
                date: $('input[name="alarm_search_date"]').val(),
                date_from: $('input[name="alarm_search_date_from"]').val(),
                date_to: $('input[name="alarm_search_date_to"]').val(),
                type: $('input[name="alarm_search_type"]').val(),
                alarm : true
            });
        } else {
            $('#alarm-search-date').combobox('showPanel');
        }
    },
    details : function (id) {
        $('#details-dialog').
        dialog('open').
        dialog('setTitle', '产品信息详情').
        dialog('refresh', ThinkPHP['MODULE'] + '/Product/getDetails/?id=' + id);
    },
    reload : function () {
        $('#alarm').datagrid('reload');
    },
    reset : function () {
        $('#alarm-search-keywords').textbox('clear');
        $('#alarm-search-date').combobox('clear').combobox('disableValidation');
        $('#alarm-search-date-from').datebox('clear');
        $('#alarm-search-date-to').datebox('clear');
        $('#alarm-search-type').combobox('clear');
        $('#alarm').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}