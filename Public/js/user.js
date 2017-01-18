$(function(){
    //帐号列表
    $('#user').datagrid({
        url : ThinkPHP['MODULE'] + '/User/getList',
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
        toolbar : '#user-tool',
        columns : [[
            {
                field : 'id',
                title : '自动编号',
                width : 100,
                checkbox : true
            },
            {
                field : 'accounts',
                title : '帐号名称',
                width : 80
            },
            {
                field : 'name',
                title : '关联档案',
                width : 80
            },
            {
                field : 'email',
                title : '电子邮件',
                width : 120
            },
            {
                field : 'last_login_time',
                title : '登录时间',
                width : 110,
                sortable : true
            },
            {
                field : 'last_login_ip',
                title : '登录IP',
                width : 80
            },
            {
                field : 'login_count',
                title : '登录次数',
                width : 60,
                sortable : true
            },
            {
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            },
            {
                field : 'state',
                title : '状态',
                width : 43,
                fixed : true,
                sortable : true,
                formatter : function (value, row) {
                    var state = '';
                    switch (value) {
                        case '冻结' :
                            state = '<a href="javascript:void(0)" user-id="' + row.id + '" user-state="冻结" class="user-state user-state-1" style="height: 18px;margin-left:4px;"></a>';
                            break;
                        case '正常' :
                            state = '<a href="javascript:void(0)" user-id="' + row.id + '" user-state="正常" class="user-state user-state-2" style="height: 18px;margin-left:4px;"></a>';
                            break;
                    }
                    return state;
                }
            },
            {
                field: 'details',
                title: '详情',
                width: 40,
                fixed : true,
                formatter : function (value,row) {
                    return '<a href="javascript:void(0)" class="user-details" style="height: 18px;margin-left:2px;" onclick="user_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function(){
            $('.user-state-1').linkbutton({
                iconCls : 'icon-login',
                plain : true
            });
            $('.user-state-2').linkbutton({
                iconCls : 'icon-ok',
                plain : true
            });
            $('.user-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
        onClickCell : function (index, field) {
        }
    });
    //新增面板
    $('#user-add').dialog({
        width : 420,
        height : 300,
        title : '新增帐号',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            iconCls : 'icon-accept',
            handler : function () {
                if($('#user-add').form('validate')){
                    if ($('#user-add').form('validate')) {
                        $.ajax({
                            url : ThinkPHP['MODULE'] + '/User/register',
                            type : 'POST',
                            data : {
                                accounts : $.trim($('input[name="user_accounts_add"]').val()),
                                password : $('input[name="user_password_add"]').val(),
                                email :    $.trim($('input[name="user_email_add"]').val()),
                                state :    $('input[name="user_state_add"]').val(),
                                uid :      $('input[name="user_staff_add"]').val(),
                                name :     $('#user-staff-add').combogrid('getText')
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
                                        msg : '添加帐号成功！'
                                    });
                                    $('#user-add').dialog('close');
                                    $('#user').datagrid('load');
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
            }
        },{
            text : '取消',
            iconCls : 'icon-cross',
            handler : function () {
                $('#user-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#user-add').form('reset');
        }
    });
    //新增和修改帐号
    $('#user-accounts-add').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入帐号名称',
        invalidMessage : '帐号名称2-20位'
    });
    //新增密码
    $("#user-password-add").textbox({
            width : 240,
            height : 32,
            required : true,
            validType : 'length[6,30]',
            missingMessage : '请输入帐号密码',
            invalidMessage : '帐号密码6-30位'
    })
    //邮件
    $("#user-email-add").textbox({
        width : 240,
        height : 32,
        validType : 'email',
        missingMessage : '请输入电子邮件',
        invalidMessage : '电子邮件格式不合法'
    })
    //关联档案
    $('#user-staff-add').combogrid({
            width : 120,
            height : 32,
            url : ThinkPHP['MODULE'] + '/Staff/getNotRelationList',
            panelWidth: 450,
            panelHeight: 'auto',
            panelMaxHeight : 227,
            fitColumns : true,
            striped : true,
            rownumbers : true,
            border : false,
            idField:'id',
            textField:'name',
            editable : false,
            remoteSort : false,
            columns : [[
                {
                    field : 'id',
                    title : '编号',
                    width : 50,
                    hidden : true
                },
                {
                    field : 'name',
                    title : '姓名',
                    width : 80
                },
                {
                    field : 'number',
                    title : '工号',
                    width : 50,
                    sortable : true
                },
                {
                    field : 'gender',
                    title : '性别',
                    width : 50,
                    sortable : true
                },
                {
                    field : 'id_card',
                    title : '身份证',
                    width : 150
                },
                {
                    field : 'post',
                    title : '职位',
                    width : 50
                }
            ]]
    })
})
//工具栏操作模块
var user_tool = {
    add : function () {
        $('#user-add').dialog('open');
        $('#user-staff-add').combogrid('grid').datagrid('reload');
    }
}

