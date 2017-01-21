$(function(){

    //出货列表
    $('#outlib').datagrid({
        url : ThinkPHP['MODULE'] + '/Outlib/getList',
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
        toolbar : '#outlib-tool',
        columns : [[
            {
                field : 'id',
                title : '编号',
                width : 60,
                checkbox : true
            },
            {
                field : 'sn',
                title : '产品编号',
                width : 60
            },
            {
                field : 'name',
                title : '产品名称',
                width : 120
            },
            {
                field : 'sell_price',
                title : '销售价格',
                width : 60
            },
            {
                field : 'number',
                title : '出货量',
                width : 40
            },
            {
                field : 'order_sn',
                title : '所属订单',
                width : 80
            },
            {
                field : 'clerk',
                title : '发货员',
                width : 60
            },
            {
                field : 'keyboarder',
                title : '录入员',
                width : 60
            },
            {
                field : 'state',
                title : '状态',
                width : 60
            },
            {
                field : 'dispose_time',
                title : '出库时间',
                width : 100,
                sortable : true
            },
            {
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            }
        ]],
        onClickCell : function (index, field) {
            if (field == 'state' || field == 'details') {
                $('#product').datagrid('selectRow', index);
            }
        }
    });
})