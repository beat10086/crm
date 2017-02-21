/**
 * Created by zmz on 2017/1/21.
 */
$(function(){
    $('#inlib').datagrid({
        url : ThinkPHP['MODULE'] + '/Inlib/getList',
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
        toolbar : '#inlib-tool',
        columns : [[
            {
                field : 'sn',
                title : '产品编号',
                width : 60
            },
            {
                field : 'name',
                title : '入库产品',
                width : 100
            },
            {
                field : 'number',
                title : '入库数量',
                width : 60
            },
            {
                field : 'pro_price',
                title : '采购价格',
                width : 60
            },
            {
                field : 'amount',
                title : '总价',
                width : 60
            },
            {
                field : 'unit',
                title : '计量单位',
                width : 60
            },
            {
                field : 'mode',
                title : '入库方式',
                width : 60
            },
            {
                field : 'mode_explain',
                title : '说明',
                width : 120,
                formatter : function (value) {
                    if (value.length > 12) {
                        return value.substr(0,8) + '...';
                    }
                    return value;
                }
            },
            {
                field : 'staff_name',
                title : '经办人',
                width : 60
            },
            {
                field : 'enter',
                title : '录入员',
                width : 60
            },
            {
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            },
            {
                field: 'details',
                title: '详情',
                width: 40,
                fixed : true,
                formatter : function (value,row) {
                    return '<a href="javascript:void(0)" class="inlib-details" style="height: 18px;margin-left:2px;" onclick="inlib_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function() {
            $('.inlib-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
        onClickCell : function (index) {
            $('#inlib').datagrid('selectRow', index);
        }
    });
    //入库产品列表
    $('#inlib-product').dialog({
        width: 550,
        height: 380,
        title: '选择产品',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#inlib-product-search-keywords').textbox();
            $('#inlib-product-search-button').linkbutton();
            $('#inlib-product-search-refresh').linkbutton();
            $('#inlib-product-search-reset').linkbutton();
            $('#inlib-search-product').datagrid({
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
                toolbar : '#inlib-product-tool',
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
                        field : 'unit',
                        title : '计量单位',
                        width : 50
                    },
                    {
                        field : 'pro_price',
                        title : '采购价',
                        width : 50
                    },
                    {
                        field : 'select',
                        title : '选择产品',
                        width : 60,
                        formatter : function (value, row) {
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="inlib_product_tool.select(\'' + row.id + '\', \'' + row.sn + '\', \'' + row.pro_price + '\', \'' + row.unit + '\', \'' + row.name + '\');">选择</a>';
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
                    $('#inlib-search-product').datagrid('selectRow', index);
                }
            });
        }
    });
    //经办人弹框
    $('#inlib-staff').dialog({
        width: 550,
        height: 380,
        title: '选择经办人',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#inlib-staff-search-keywords').textbox();
            $('#inlib-staff-search-button').linkbutton();
            $('#inlib-staff-search-refresh').linkbutton();
            $('#inlib-staff-search-reset').linkbutton();
            $('#inlib-search-staff').datagrid({
                url : ThinkPHP['MODULE'] + '/Staff/getList',
                queryParams : {
                    uid : true
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
                toolbar : '#inlib-staff-tool',
                columns : [[
                    {
                        field : 'number',
                        title : '员工编号',
                        width : 60
                    },
                    {
                        field : 'name',
                        title : '员工姓名',
                        width : 100
                    },
                    {
                        field : 'gender',
                        title : '性别',
                        width : 50
                    },
                    {
                        field : 'type',
                        title : '员工类型',
                        width : 80
                    },
                    {
                        field : 'select',
                        title : '选择员工',
                        width : 60,
                        formatter : function (value, row) {
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="inlib_staff_tool.select(\'' + row.id + '\', \'' + row.name + '\');">选择</a>';
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
                    $('#inlib-search-staff').datagrid('selectRow', index);
                }
            });
        }
    });
    //新增入库
    $('#inlib-add').dialog({
        width : 420,
        height : 380,
        title : '新增入库',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#inlib-add').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Inlib/register',
                        type : 'POST',
                        data : {
                            pid : $('input[name="inlib_pid_add"]').val(),
                            sid : $('input[name="inlib_sid_add"]').val(),
                            sn : $('input[name="inlib_psn_add"]').val(),
                            pro_price : $('input[name="inlib_pprice_add"]').val(),
                            unit : $('input[name="inlib_punit_add"]').val(),
                            product : $('input[name="inlib_product_add"]').val(),
                            staff : $('input[name="inlib_staff_add"]').val(),
                            number : $.trim($('input[name="inlib_number_add"]').val()),
                            discount : $.trim($('input[name="inlib_discount_add"]').val()),
                            mode : $.trim($('input[name="inlib_mode_add"]').val()),
                            mode_explain : $.trim($('input[name="inlib_mode_explain_add"]').val())
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
                                    msg : '添加入库成功！'
                                });
                                $('#inlib-add').dialog('close');
                                $('#inlib').datagrid('load');
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
                $('#inlib-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#inlib-add').form('reset');
        }
    });
    //添加入库
    $('#inlib-product-add, #inlib-number-add, #inlib-staff-add, #inlib-mode-explain-add').textbox({
        width : 240,
        height : 32
    });
    //入库产品
    $('#inlib-product-add').textbox({
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#inlib-product').dialog('open');
            }
        }],
        required : true,
        missingMessage : '请点击放大镜图标选择产品',
        invalidMessage : '产品不得为空'
    }).siblings('span').find('input').focus(function () {
        for (var i = 0; i < $('.tooltip-content').length; i ++) {
            if ($('.tooltip-content').eq(i).text() == '请点击放大镜图标选择产品') {
                $('.tooltip-content').eq(i).parent().css('margin-left', '18px');
            }
        }
    }).hover(function () {
        for (var i = 0; i < $('.tooltip-content').length; i ++) {
            if ($('.tooltip-content').eq(i).text() == '请点击放大镜图标选择产品') {
                $('.tooltip-content').eq(i).parent().css('margin-left', '18px');
            }
        }
    });
    //入库数量
    $('#inlib-number-add').textbox({
        required : true,
        validType : 'number',
        missingMessage : '请输入入库数量',
        invalidMessage : '入库数量不能小于0'
    });
    //经办人
    $('#inlib-staff-add').textbox({
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#inlib-staff').dialog('open');
            }
        }],
        required : true,
        missingMessage : '请点击放大镜图标选择经办人',
        invalidMessage : '经办人不得为空'
    }).siblings('span').find('input').focus(function () {
        for (var i = 0; i < $('.tooltip-content').length; i ++) {
            if ($('.tooltip-content').eq(i).text() == '请点击放大镜图标选择经办人') {
                $('.tooltip-content').eq(i).parent().css('margin-left', '18px');
            }
        }
    }).hover(function () {
        for (var i = 0; i < $('.tooltip-content').length; i ++) {
            if ($('.tooltip-content').eq(i).text() == '请点击放大镜图标选择经办人') {
                $('.tooltip-content').eq(i).parent().css('margin-left', '18px');
            }
        }
    });
    //入库方式
    $('#inlib-mode-add').combobox({
        width : 140,
        height : 32,
        panelHeight : 'auto',
        data : [{
            id : '采购',
            text : '采购'
        },{
            id : '退货',
            text : '退货'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    });
    //折扣率
    $('#inlib-discount-add').textbox({
        width: 60,
        height: 32,
        validType : 'discount',
        invalidMessage : '折扣率必须小于10，小数点后最多两位'
    });
})
//入库工具栏操作模块
var inlib_tool = {
    add : function () {
        $('#inlib-add').dialog('open');
    },
    reload:function() {
          $("#inlib").datagrid('reload');
    },
    reset:function() {
        $('#inlib-search-keywords').textbox('clear');
        $('#inlib-search-date').combobox('clear').combobox('disableValidation');
        $('#inlib-search-date-from').datebox('clear');
        $('#inlib-search-date-to').datebox('clear');
        $('#inlib').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}

//产品工具栏操作模块
var inlib_product_tool={
        select:function(id,sn,pro_price,unit,name){
            $('#inlib-product-add').textbox('setValue',name);
            $('#inlib-pid-add').val(id);
            $('#inlib-psn-add').val(sn);
            $('#inlib-pprice-add').val(pro_price);
            $('#inlib-punit-add').val(unit);
            $('#inlib-product').dialog('close');
            this.reset();
        },
       search:function(){
              $("#inlib-search-product").datagrid('load',{
                  keywords: $.trim($('input[name="inlib_product_search_keywords"]').val())
              })
       },
      reset:function(){
          $('#inlib-product-search-keywords').textbox('clear');
          this.search();
      }
}
//经办人工具栏操作模块
var inlib_staff_tool = {
    search : function () {
        $('#inlib-search-staff').datagrid('load', {
            keywords: $.trim($('input[name="inlib_staff_search_keywords"]').val()),
            uid : true
        });
    },
    select : function (id, name) {
        $('#inlib-staff-add').textbox('setValue', name);
        $('#inlib-sid-add').val(id);
        $('#inlib-staff').dialog('close');
        this.reset();
    },
    reset : function () {
        $('#inlib-staff-search-keywords').textbox('clear');
        /*$('#inlib-search-staff').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });*/
        this.search();
    }
};
