$(function(){
   $("#product").datagrid({
       url : ThinkPHP['MODULE'] + '/Product/getList',
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
       toolbar : '#product-tool',
       columns : [[
           {
               field : 'id',
               title : '编号',
               width : 100,
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
                   return '<a href="javascript:void(0)" class="product-details" style="height: 18px;margin-left:2px;" onclick="product_tool.details(' + row.id + ');"></a>';
               }
           }
       ]],
       onLoadSuccess : function() {
           $('.product-details').linkbutton({
               iconCls : 'icon-text',
               plain : true
           });
       },
       onClickCell : function (index, field) {
           if (field == 'state' || field == 'details') {
               $('#product').datagrid('selectRow', index);
           }
       }
   });

    $('#product-add').dialog({
        width : 780,
        height : 500,
        title : '新增产品',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#product-add').form('validate')) {
                    window.editor.sync();
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/product/register',
                        type : 'POST',
                        data : {
                            name             :$.trim($('input[name="product_name_add"]').val()),
                            sn              : $.trim($('input[name="product_sn_add"]').val()),
                            type            : $('input[name="product_type_add"]').val(),
                            pro_price       : $.trim($('input[name="product_pro_price_add"]').val()),
                            sell_price      : $.trim($('input[name="product_sell_price_add"]').val()),
                            unit : $.trim($('input[name="product_unit_add"]').val()),
                            inventory_alarm : $.trim($('input[name="product_inventory_alarm_add"]').val()),
                            details :$('textarea[name="product_details_add"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试保存...'
                            });
                        },
                        success : function(data) {
                            $.messager.progress('close');
                            if (data.code == 200) {
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : '添加产品成功！'
                                });
                                $('#product-add').dialog('close');
                                $('#product').datagrid('load');
                            } else {
                                $.messager.alert('添加失败！', '未知错误！', 'warning');
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
                $('#product-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#product-add').form('reset');
            window.editor.html('');
        }
    });
    $('#product-name-add, #product-sn-add,#product-pro-price-add, #product-sell-price-add, #product-unit-add, #product-inventory-alarm-add').textbox({
        width : 240,
        height : 32
    });
    //状态搜索
    $('#product-search-type').combobox({
        width : 90,
        data : [{
            id : '办公耗材',
            text : '办公耗材'
        }, {
            id : '数码用品',
            text : '数码用品'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //时间搜索
    $('#product-search-date').combobox({
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
    $('#product-search-date-from, #product-search-date-to').datebox({
        onSelect : function () {
            if ($('#product-search-date').combobox('enableValidation').combobox('isValid') == false) {
                $('#product-search-date').combobox('showPanel');
            }
        }
    });
    //产品名称
    $('#product-name-add').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[10,20]',
        missingMessage : '请输入产品名称',
        invalidMessage : '产品名称10-120位'
    });
    //产品编号
    $("#product-sn-add").textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'sn',
        missingMessage : '请输入产品编号',
        invalidMessage : '产品编号是5位数字'
    })
    //产品类型
    $('#product-type-add').combobox({
        width : 140,
        height : 32,
        panelHeight : 'auto',
        required : true,
        data : [{
            id : '办公耗材',
            text : '办公耗材'
        },{
            id : '数码用品',
            text : '数码用品'
        }],
        editable : false,
        missingMessage : '请输入选择产品类型',
        valueField : 'id',
        textField : 'text'
    });
    //加载新增编辑器
    window.editor = KindEditor.create('#product-details-add', {
        width : '94%',
        height : '195px',
        resizeType : 0,
        items : [
            'source', '|',
            'formatblock', 'fontname', 'fontsize','|',
            'forecolor', 'hilitecolor', 'bold','italic', 'underline', 'link', 'removeformat', '|',
            'justifyleft', 'justifycenter', 'justifyright', '|', 'insertorderedlist', 'insertunorderedlist','|',
            'emoticons', 'image','baidumap','|',
            'fullscreen'
        ]
    });
})
//工具栏操作模块
var product_tool = {
    search:function(){
        if ($('#product-tool').form('validate')) {
              $('#product').datagrid('load', {
                keywords: $.trim($('input[name="product_search_keywords"]').val()),
                date: $('input[name="product_search_date"]').val(),
                date_from: $('input[name="product_search_date_from"]').val(),
                date_to: $('input[name="product_search_date_to"]').val(),
                type: $('input[name="product_search_type"]').val()
            });
           }else{
             $('#product-search-date').combobox('showPanel');
        }
    },
    add:function(){
        $('#product-add').dialog('open');
    },
    remove:function(){
        var rows = $('#product').datagrid('getSelections');
        if (rows.length > 0) {
            $.messager.confirm('确认操作', '您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                if (flag) {
                    var ids = [];
                    for (var i = 0; i < rows.length; i ++) {
                        ids.push(rows[i].id);
                    }
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Product/remove',
                        type : 'POST',
                        data : {
                            ids : ids.join(',')
                        },
                        beforeSend : function () {
                            $('#product').datagrid('loading');
                        },
                        success : function(data, response, status) {
                            if (data) {
                                $('#product').datagrid('loaded');
                                $('#product').datagrid('reload');
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : rows.length + '个产品被成功删除！'
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
        $('#product').datagrid('reload');
    },
    redo:function(){
        $('#product').datagrid('unselectAll');
    },
    details:function(id){
        $('#details-dialog').dialog('open').dialog('setTitle', '产品信息详情')
                            .dialog('refresh', ThinkPHP['MODULE'] + '/Product/getDetails/?id=' + id);
    },
    reset:function(){
        $('#product-search-keywords').textbox('clear');
        $('#product-search-date').combobox('clear').combobox('disableValidation');
        $('#product-search-date-from').datebox('clear');
        $('#product-search-date-to').datebox('clear');
        $('#product-search-type').combobox('clear');
        $('#product').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}