$(function(){
    //显示客服信息
    $('#client').datagrid({
        url : ThinkPHP['MODULE'] + '/Client/getList',
        queryParams : {
            client : true
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
        toolbar : '#client-tool',
        columns : [[
            {
                field : 'id',
                title : '产品编号',
                width : 60,
                checkbox : true
            },
            {
                field : 'company',
                title : '公司名称',
                width : 100
            },
            {
                field : 'name',
                title : '联系人',
                width : 100
            },
            {
                field : 'tel',
                title : '移动电话',
                width : 100
            },
            {
                field : 'source',
                title : '来源方式',
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
    //时间搜索
    $('#client-search-date').combobox({
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
    $('#client-search-date-from, #client-search-date-to').datebox({
        onSelect : function () {
            if ($('#client-search-date').combobox('enableValidation').combobox('isValid') == false) {
                $('#client-search-date').combobox('showPanel');
            }
        }
    });
    //新增和修改公司名称
    $('#client-company-add, #client-company-edit').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入公司名称',
        invalidMessage : '公司名称2-20位'
    });
    //新增和修改联系人名称
    $('#client-name-add, #client-name-edit').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入联系人',
        invalidMessage : '公司名称2-20位'
    });
    //新增和修改移动电话
    $('#client-tel-add, #client-tel-edit').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'tel',
        missingMessage : '请输入移动电话',
        invalidMessage : '移动电话11位'
    });

    //客户来源
    $('#client-source-add, #client-source-edit').combobox({
        width : 120,
        height : 32,
        data : [{
            id : '广告媒体',
            text : '广告媒体'
        }, {
            id : '电话营销',
            text : '电话营销'
        }, {
            id : '主动联系',
            text : '主动联系'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //新增面板
    $('#client-add').dialog({
        width : 420,
        height : 300,
        title : '新增客户',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#client-add').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Client/register',
                        type : 'POST',
                        data : {
                            company : $.trim($('input[name="client_company_add"]').val()),
                            name    : $('input[name="client_name_add"]').val(),
                            tel     : $.trim($('input[name="client_tel_add"]').val()),
                            source  : $('input[name="client_source_add"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试保存...'
                            });
                        },
                        success : function(data) {
                            $.messager.progress('close');
                            if (data.code ==200) {
                                $.messager.show({
                                    title : '操作提醒',
                                    msg   : '添加客服成功！'
                                });
                                $('#client-add').dialog('close');
                                $('#client').datagrid('load');
                            } else if (data == -1) {
                                $.messager.alert('添加失败！', '帐号名称已存在！', 'warning', function () {
                                    $('#user-accounts-add').textbox('textbox').select();
                                });
                            } else if (data == -2) {
                                $.messager.alert('添加失败！', '邮箱已存在！', 'warning', function () {
                                    $('#user-email-add').textbox('textbox').select();
                                });
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
                $('#client-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#client-add').form('reset');
        }
    });
    //修改面板
    $('#client-edit').dialog({
        width : 420,
        height : 300,
        title : '修改客户信息',
        iconCls : 'icon-edit-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#client-edit').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Client/update',
                        type : 'POST',
                        data : {
                            id :      $('input[name="client_id_edit"]').val(),
                            company : $('input[name="client_company_edit"]').val(),
                            name :    $('input[name="client_name_edit"]').val(),
                            tel :     $('input[name="client_tel_edit"]').val(),
                            source :  $('input[name="client_source_edit"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试保存...',
                            });
                        },
                        success : function(data) {
                            $.messager.progress('close');
                            if (data.code == 200) {
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : '修改客户成功！'
                                });
                                $('#client-edit').dialog('close');
                                $('#client').datagrid('load');
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
                $('#client-edit').dialog('close');
            }
        }],
        onClose : function () {
            $('#client-edit').form('reset');
        }
    });
})
var  client_tool={
         'search':function(){
             if ($('#client-tool').form('validate')) {
                 $('#client').datagrid('load', {
                     keywords: $.trim($('input[name="client_search_keywords"]').val()),
                     date: $('input[name="client_search_date"]').val(),
                     date_from: $('input[name="client_search_date_from"]').val(),
                     date_to: $('input[name="client_search_date_to"]').val()
                 });
             } else {
                 $('#client-search-date').combobox('showPanel');
             }
         },
        'add':function(){
               $("#client-add").dialog('open');
        },
        'edit':function(){
              var rows = $('#client').datagrid('getSelections');
                  if (rows.length > 1) {
                        $.messager.alert('警告操作', '编辑记录只能选定一条数据！', 'warning');
                    } else if (rows.length == 1) {
                        $('#client-edit').dialog('open');
                        $.ajax({
                            url : ThinkPHP['MODULE'] + '/Client/getClient',
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
                                    $('#client-edit').form('load', {
                                        client_company_edit : data.company,
                                        client_id_edit : data.id,
                                        client_name_edit : data.name,
                                        client_tel_edit : data.tel,
                                        client_source_edit : data.source
                                    });
                                }
                            }
                        });
                    } else if (rows.length == 0) {
                        $.messager.alert('警告操作', '编辑记录必须选定一条数据！', 'warning');
                    }
        },
        'remove':function(){
            var rows = $('#client').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm('确认操作', '您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i].id);
                        }
                        $.ajax({
                            url : ThinkPHP['MODULE'] + '/Client/remove',
                            type : 'POST',
                            data : {
                                ids : ids.join(',')
                            },
                            beforeSend : function () {
                                $('#client').datagrid('loading');
                            },
                            success : function(data, response, status) {
                                if (data) {
                                    $('#client').datagrid('loaded');
                                    $('#client').datagrid('reload');
                                    $.messager.show({
                                        title : '操作提醒',
                                        msg : rows.length + '个客户被成功删除！'
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
               $("#client").datagrid('reload');
        },
       redo   :function(){
               $("#client").datagrid('unselectAll');
       },
        reset : function () {
            $('#work-search-keywords').textbox('clear');
            $('#client-search-date').combobox('clear').combobox('disableValidation');
            $('#client-search-date-from').datebox('clear');
            $('#client-search-date-to').datebox('clear');
            $('#client-search-type').combobox('clear');
            /*$('#client').datagrid('resetSort', {
             sortName : 'create_time',
             sortOrder : 'desc'
             });*/
            this.search();
        },
       details:function(id){
           $('#details-dialog').dialog('open').dialog('setTitle', '客户信息详情')
                               .dialog('refresh', ThinkPHP['MODULE'] + '/Client/getDetails/?id=' + id);
       }
}
