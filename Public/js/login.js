$(function(){
    //浏览器改变大小时触发
    $(window).resize(function () {
        $('#login').dialog('center');
    });
    //登录窗口
    $('#login').dialog({
        title : '登录后台',
        width : 370,
        height : 260,
        modal : false,
        closable : false,
        draggable : false,
        iconCls : 'icon-login',
        buttons : [{
            text : '登录',
            id : 'login-btn',
            size : 'large',
            iconCls : 'icon-user-go',
            handler : function () {
                if ($('form').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Public/Login',
                        type : 'POST',
                        data : {
                            accounts : $('input[name="login_accounts"]').val(),
                            password : $('input[name="login_password"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试登录...'
                            });
                        },
                        success : function (data) {
                            $.messager.progress('close');
                            if (data.code > 0) {
                                location.href = ThinkPHP['INDEX'];
                            } else if (data.code == 0) {
                                $.messager.alert('登录失败！', '登录帐号或密码不正确！', 'warning', function () {
                                    $('#login-password').textbox('textbox').select();
                                });
                            } else if (data.code == -1) {
                                $.messager.alert('登录失败！', '帐号处在冻结审核状态！', 'warning', function () {
                                    $('#login-password').textbox('textbox').select();
                                });
                            } else if (data.code == -2) {
                                $.messager.alert('登录失败！', '帐号尚未关联档案，无法登录！', 'warning', function () {
                                    $('#login-password').textbox('textbox').select();
                                });
                            }
                        }
                    });
                }
            }
        }]
    });
    //注册界面
    $('#register').dialog({
        title : '申请帐号',
        width : 400,
        height : 300,
        modal : true,
        closed : true,
        maximizable : true,
        iconCls : 'icon-add-new',
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#register').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/User/register',
                        type : 'POST',
                        data : {
                            accounts : $.trim($('input[name="user_accounts_add"]').val()),
                            password : $('input[name="user_password_add"]').val(),
                            email : $.trim($('input[name="user_email_add"]').val())
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
                                $('#register').dialog('close');
                                $.messager.alert('提醒！', '帐号申请成功，请等待审核！', 'info');
                            } else if (data == -1) {
                                $.messager.alert('添加失败！', '帐号名称已存在！', 'warning', function () {
                                    $('#user-accounts-add').textbox('textbox').select();
                                });
                            } else if (data == -2) {
                                $.messager.alert('添加失败！', '邮箱已存在！', 'warning', function () {
                                    $('#user-email-add').textbox('textbox').select();
                                });
                            } else if (data == -3) {
                                $.messager.alert('添加失败！', '手机已存在！', 'warning', function () {
                                    $('#user-tel-add').textbox('textbox').select();
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
                $('#register').dialog('close');
            }
        }],
        onClose : function () {
            $('#register').form('reset');
        }
    });
    //账号
    $('#user-accounts-add').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入帐号名称',
        invalidMessage : '帐号名称2-20位'
    });
    //密码
    $('#user-password-add').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[6,30]',
        missingMessage : '请输入帐号密码',
        invalidMessage : '帐号密码6-30位'
    });
    //确定密码
    $('#user-notpassword-add').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'equals["#user-password-add"]',
        missingMessage : '请输入确认密码',
        invalidMessage : '确认密码和密码不一致'
    });
    //电子邮件
    $('#user-email-add').textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'email',
        missingMessage : '请输入电子邮箱',
        invalidMessage : '电子邮件格式不合法'
    });

    //注册按钮
    $('.btn-register').click(function () {
        $('#register').dialog('open');
        $('#register').dialog('resize');
    });
    //重新调整居中
    $('#login').dialog('center');
    //登录文本框设置
    $('#login-accounts').textbox({
        width : 220,
        height : 32,
        iconCls : 'icon-man',
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入登录帐号',
        invalidMessage : '登录帐号2-20位'
    });
    //登录密码设置
    $('#login-password').textbox({
        width : 220,
        height : 32,
        iconCls : 'icon-lock',
        required : true,
        validType : 'length[6,30]',
        missingMessage : '请输入登录密码',
        invalidMessage : '登录密码6-30位'
    });

})
$.extend($.fn.validatebox.defaults.rules, {
    equals: {
        validator: function(value,param){
            return value == $(param[0]).val();
        },
        message: '密码和密码确认必须一致'
    }
});