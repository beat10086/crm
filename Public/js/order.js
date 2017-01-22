$(function(){
    //订单列表
    $('#order').datagrid({
        url : ThinkPHP['MODULE'] + '/Order/getList',
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
        toolbar : '#order-tool',
        columns : [[
            {
                field : 'id',
                title : '自动编号',
                width : 60,
                checkbox : true
            },
            {
                field : 'sn',
                title : '订单编号',
                width : 100
            },
            {
                field : 'title',
                title : '订单标题',
                width : 120
            },
            {
                field : 'company',
                title : '所属公司',
                width : 100
            },
            {
                field : 'amount',
                title : '订单金额',
                width : 80
            },
            {
                field : 'd_name',
                title : '跟单员',
                width : 80
            },
            {
                field : 'pay_state',
                title : '付款状态',
                width : 80
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
                    return '<a href="javascript:void(0)" class="client-details" style="height: 18px;margin-left:2px;" onclick="order_tool.details(' + row.id + ');"></a>';
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
    //新增和修改订单标题
    $('#order-title-add, #order-title-edit').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入订单标题',
        invalidMessage : '订单标题2-20位'
    });
    //新增和修改跟单记录
    $('#order-documentary-add, #order-documentary-edit').textbox({
        width : 240,
        height : 32,
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#order-documentary').dialog('open');
            }
        }],
        required : true,
        missingMessage : '请点击放大镜图标选择跟单',
        invalidMessage : '跟单记录不得为空'
    });
    //弹出选择跟单记录
    $('#order-documentary').dialog({
        width: 550,
        height: 380,
        title: '选择跟单',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#order-documentary-search-keywords').textbox();
            $('#order-documentary-search-button').linkbutton();
            $('#order-documentary-search-refresh').linkbutton();
            $('#order-documentary-search-reset').linkbutton();
            $('#order-documentary-table').datagrid({
                url : ThinkPHP['MODULE'] + '/Documentary/getList',
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
                toolbar : '#order-documentary-tool',
                columns : [[
                    {
                        field : 'sn',
                        title : '跟单编号',
                        width : 100
                    },
                    {
                        field : 'title',
                        title : '跟单标题',
                        width : 150
                    },
                    {
                        field : 'company',
                        title : '所属公司',
                        width : 80
                    },
                    {
                        field : 'd_name',
                        title : '跟单员',
                        width : 60
                    },
                    {
                        field : 'select',
                        title : '选择跟单',
                        width : 60,
                        formatter : function (value, row) {
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="order_documentary_tool.select(\'' + row.id + '\', \'' + row.title + '\');">选择</a>';
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
    //订单产品
    $('#order-product').dialog({
        width: 550,
        height: 380,
        title: '选择产品',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#order-product-search-keywords').textbox();
            $('#order-product-search-button').linkbutton();
            $('#order-product-search-refresh').linkbutton();
            $('#order-product-search-reset').linkbutton();
            $('#order-product-table').datagrid({
                url : ThinkPHP['MODULE'] + '/Product/getList',
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
                toolbar : '#order-product-tool',
                columns : [[
                    {
                        field : 'id',
                        title : '编号',
                        width : 60,
                        hidden : true
                    },
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
                        field : 'unit',
                        title : '计量单位',
                        width : 50
                    },
                    {
                        field : 'sell_price',
                        title : '出售价',
                        width : 50
                    },
                    {
                        field : 'inventory',
                        title : '库存',
                        width : 50
                    },
                    {
                        field : 'number',
                        title : '选择数量',
                        width : 50,
                        formatter : function (value, row) {
                            return '<input class="oreder-number" prompt="0" min="0" max="' + row.inventory + '">';
                        }
                    },
                    {
                        field : 'select',
                        title : '选择产品',
                        width : 60,
                        formatter : function (value, row, index) {
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="order_product_tool.select(\'' + row.id + '\', \'' + row.sn + '\', \'' + row.name + '\', \'' + row.unit + '\', \'' + row.sell_price + '\', \'' + index + '\');">选择</a>';
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
                    $('.oreder-number').numberbox({

                    });
                },
                onClickCell : function (index) {
                    $('#order-product-table').datagrid('selectRow', index);
                }
            });
        }
    });
    //订单产品列表
    $('#order-product-button-add').linkbutton({
        iconCls : 'icon-add-new',
        onClick : function () {
            //创建订单界面
            $('#order-product').dialog('open');
        }
    });
    //添加订单
    $('#order-add').dialog({
        width : 780,
        height : 500,
        title : '创建订单',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#order-add').form('validate')) {
                    window.editor.sync();
                    if ($('#order-product-list').datagrid('getData')['total'] <= 0) {
                        $.messager.alert('警告操作', '订单没有选择任何产品！', 'warning');
                    } else {
                        $.ajax({
                            url : ThinkPHP['MODULE'] + '/Order/register',
                            type : 'POST',
                            data : {
                                title : $.trim($('input[name="order_title_add"]').val()),
                                amount : $.trim($('input[name="order_amount_add"]').val()),
                                documentary_id : $.trim($('input[name="order_documentary_id_add"]').val()),
                                details : $.trim($('textarea[name="order_details_add"]').val()),
                                contract : $('textarea[name="order_contract_add"]').val(),
                                product_outlib : $('#order-product-list').datagrid('getData')
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
                                        msg : '添加订单成功！'
                                    });
                                    $('#order-add').dialog('close');
                                    $('#order').datagrid('load');
                                }
                            }
                        });
                    }

                }
            }
        },{
            text : '取消',
            size : 'large',
            iconCls : 'icon-cross',
            handler : function () {
                $('#order-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#order-product-list').datagrid('loadData', {total:0,rows:[]});
            $('#order-original-price-add').val(0);
            $('.original_price').text('￥0.00');
            $('#order-add').form('reset');
            order_product_tool.ids = [];
        }
    });

})
//订单工具栏
var order_tool ={
     add:function(){
         $('#order-add').dialog('open');
         //订单产品列表
         $('#order-product-list').datagrid({
             width : '95%',
             columns:[[
                 {
                     field : 'id',
                     title : '自动编号',
                     width : 100,
                     hidden : true
                 },
                 {
                     field : 'sn',
                     title : '产品编号',
                     width : 100
                 },
                 {
                     field : 'name',
                     title : '产品名称',
                     width : 130
                 },
                 {
                     field : 'unit',
                     title : '计量单位',
                     width : 80
                 },
                 {
                     field : 'sell_price',
                     title : '出售价',
                     width : 80
                 },
                 {
                     field : 'number',
                     title : '数量',
                     width : 80
                 },
                 {
                     field : 'opt',
                     title : '操作',
                     width : 40,
                     formatter : function (value, row, index) {
                         return '<a href="javascript:void(0)" class="delete-button" style="height: 18px;margin-left:2px;" onclick="order_product_tool.delete(\'' + index + '\', \'' + row.id + '\', \'' + row.number + '\', \'' + row.sell_price + '\');"><img src="' + ThinkPHP['ROOT'] + '/Public/easyui/themes/icons/delete-new.png"></a>';
                     }
                 }
             ]],
             onClickCell : function (index) {
                 $('#order-product-list').datagrid('selectRow', index);
             }
         });
    },
    edit:function(){
        var rows = $('#order').datagrid('getSelections');
        if (rows.length > 1) {
              $.messager.alert('警告操作', '编辑记录只能选定一条数据！', 'warning');
            }else if(rows.length==0){
            $('#order-edit').dialog('open');
            $.ajax({
                url : ThinkPHP['MODULE'] + '/Order/getOne',
                type : 'POST',
                data : {
                    id : rows[0].id
                },
                beforeSend : function () {
                    $.messager.progress({
                        text : '正在获取信息...'
                    });
                },
                success : function(data) {
                    $.messager.progress('close');
                    if (data) {
                        $('#order-edit').form('load', {
                            order_id_edit : data.id,
                            order_documentary_id_edit : data.documentary_id,
                            order_title_edit : data.title,
                            order_documentary_edit : data.d_title,
                            order_amount_edit : data.amount,
                            order_details_edit : data.Extend.details,
                            order_contract_edit : data.Extend.contract
                        });
                        window.editor.html(data.Extend.contract)
                    }
                }
            });
            }else{
             $.messager.alert('警告操作', '编辑记录必须选定一条数据！', 'warning');
        }
    },
    remove:function(){
        var rows = $('#order').datagrid('getSelections');
        if (rows.length > 0) {
            $.messager.confirm('确认操作', '您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                if (flag) {
                    var ids = [];
                    for (var i = 0; i < rows.length; i ++) {
                        ids.push(rows[i].id);
                    }
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Order/remove',
                        type : 'POST',
                        data : {
                            ids : ids.join(',')
                        },
                        beforeSend : function () {
                            $('#order').datagrid('loading');
                        },
                        success : function(data, response, status) {
                            if (data) {
                                $('#order').datagrid('loaded');
                                $('#order').datagrid('reload');
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : data + '个客户被成功删除！'
                                });
                            }
                        }
                    });
                }
            });

        } else {
            $.messager.alert('警告操作', '删除操作必须至少指定一个记录！', 'warning');
        }
    },
    reload:function(){
            $("#order").datagrid('reload');
    },
    redo:function(){
            $('#order').datagrid('unselectAll');
    },
    reset:function(){
            $('#client-search-keywords').textbox('clear');
            $('#client-search-date').combobox('clear').combobox('disableValidation');
            $('#client-search-date-from').datebox('clear');
            $('#client-search-date-to').datebox('clear');
            $('#client-search-type').combobox('clear');
            $('#client').datagrid('resetSort', {
                sortName : 'create_time',
                sortOrder : 'desc'
            });
            this.search();
    }
}
//更单工具栏
var order_documentary_tool={
    search:function(){
        $('#order-documentary-table').datagrid('load', {
            keywords: $.trim($('input[name="order_documentary_search_keywords"]').val()),
            neg : true
        });
    },
    reset:function(){
        $('#order-documentary-search-keywords').textbox('clear');
        $('#order-documentary-table').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}
//订单产品工具栏
var order_product_tool={
    original_price : 0,
    ids : [],
    search:function(){
        $('#order-product-table').datagrid('load', {
            keywords: $.trim($('input[name="order_product_search_keywords"]').val())
        });
    },
    select:function(id, sn, name, unit, sell_price, index){
       var number=$('.oreder-number').eq(index).val();
       if(number<=0){
           $.messager.alert('警告操作', '添加订单商品数量必须大于0！', 'warning');
       }else{
           if ($.inArray(id, this.ids) >= 0) {
               $.messager.alert('警告操作', '此订单产品已添加！', 'warning');
              } else {
               this.ids.push(id);
               $('#order-product-list').datagrid('appendRow',{
                   id : id,
                   sn : sn,
                   name : name,
                   unit : unit,
                   sell_price : sell_price,
                   number : number
               });
               this.original_price = ((this.original_price * 100) + (number * sell_price * 100)) / 100;
               $('#order-original-price-add').val(this.original_price.toFixed(2));
               $('.original_price').text('￥' + this.original_price.toFixed(2));
               $('#order-product').dialog('close');
               this.reset();
           }
       }
    },
    reset:function(){
        $('#order-product-search-keywords').textbox('clear');
        $('#order-product-table').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}