$(function(){
    $('#staff').datagrid({
        url : ThinkPHP['MODULE'] + '/Staff/getList',
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
        toolbar : '#staff-tool',
        columns : [[
            {
                field : 'id',
                title : '自动编号',
                width : 100,
                checkbox : true
            },
            {
                field : 'number',
                title : '工号',
                width : 70,
                sortable : true
            },
            {
                field : 'name',
                title : '姓名',
                width : 100
            },
            {
                field : 'gender',
                title : '性别',
                width : 70,
                sortable : true
            },
            {
                field : 'id_card',
                title : '身份证',
                width : 170
            },
            {
                field : 'post',
                title : '职位',
                width : 100
            },
            {
                field : 'nation',
                title : '民族',
                width : 100
            },
            {
                field : 'type',
                title : '员工类型',
                width : 100,
                sortable : true
            },
            {
                field : 'tel',
                title : '移动电话',
                width : 120
            },
            {
                field : 'entry_status',
                title : '入职状态',
                width : 100,
                sortable : true
            },
            {
                field : 'entry_date',
                title : '入职时间',
                width : 100,
                sortable : true
            },
            {
                field : 'marital_status',
                title : '婚姻状况',
                width : 100,
                sortable : true
            },
            {
                field : 'education',
                title : '学历',
                width : 70,
                sortable : true
            },
            {
                field: 'details',
                title: '详情',
                width: 40,
                fixed : true,
                formatter : function (value, row) {
                    return '<a href="javascript:void(0)" class="staff-details" style="height: 18px;margin-left:2px;" onclick="staff_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function(){
            $('.staff-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
    });
    //添加档案
    $("#staff-add").dialog({
        width : 780,
        height : 500,
        title : '新增档案',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#staff-add').form('validate')) {
                    window.editor.sync();
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Staff/register',
                        type : 'POST',
                        data : {
                            name : $.trim($('input[name="staff_name_add"]').val()),
                            gender : $('input[name="staff_gender_add"]').val(),
                            number : $.trim($('input[name="staff_number_add"]').val()),
                            pid : $.trim($('input[name="staff_post_add"]').val()),
                            type : $.trim($('input[name="staff_type_add"]').val()),
                            tel : $.trim($('input[name="staff_tel_add"]').val()),
                            id_card : $.trim($('input[name="staff_id_card_add"]').val()),
                            nation : $.trim($('input[name="staff_nation_add"]').val()),
                            marital_status : $.trim($('input[name="staff_marital_status_add"]').val()),
                            entry_status : $.trim($('input[name="staff_entry_status_add"]').val()),
                            entry_date : $.trim($('input[name="staff_entry_date_add"]').val()),
                            dimission_date : $.trim($('input[name="staff_dimission_date_add"]').val()),
                            politics_status : $.trim($('input[name="staff_politics_status_add"]').val()),
                            specialty : $.trim($('input[name="staff_specialty_add"]').val()),
                            education : $.trim($('input[name="staff_education_add"]').val()),
                            health : $.trim($('input[name="staff_health_add"]').val()),
                            registered : $.trim($('input[name="staff_registered_add"]').val()),
                            registered_address : $.trim($('input[name="staff_registered_address_add"]').val()),
                            graduate_date : $('input[name="staff_graduate_date_add"]').val(),
                            graduate_colleges : $.trim($('input[name="staff_graduate_colleges_add"]').val()),
                            intro : $.trim($('textarea[name="staff_intro_add"]').val()),
                            details : $('textarea[name="staff_details_add"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试保存...'
                            });
                        },
                        success : function(data) {
                            $.messager.progress('close');
                            if (data.code==200) {
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : '添加档案成功！'
                                });
                                $('#staff-add').dialog('close');
                                $('#staff').datagrid('load');
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
                $('#staff-add').dialog('close');
             }
        }],
        onClose : function () {
            $('#staff-add').form('reset');
            window.editor.html('');
        }
    })
    //姓名
    $("#staff-name-add").textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入员工姓名',
        invalidMessage : '员工姓名2-20位'
    })
    //性别按钮
    $('#staff-gender-add-1').linkbutton({
          plain : true,
          toggle :true,
          selected : true,
          group : 'staff_gender_add',
          iconCls : 'icon-male',
          onClick : function () {
                $('#staff-gender-add').val('男');
            }
    })
    $('#staff-gender-add-2').linkbutton({
          plain : true,
          toggle :true,
          group : 'staff_gender_add',
          iconCls : 'icon-female',
          onClick : function () {
            $('#staff-gender-add').val('女');
        }
    })
    //工号
    $("#staff-number-add").textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'number',
        missingMessage : '请输入员工工号',
        invalidMessage : '员工工号四位数字'
    })
    //职位
    $("#staff-post-add").combobox({
        width : 140,
        height : 32,
        url : ThinkPHP['MODULE'] + '/Post/getListAll',
        editable : false,
        valueField : 'id',
        textField : 'name',
        hasDownArrow :true
    })
    //移动电话
    $("#staff-tel-add").textbox({
        width : 240,
        height : 32,
        validType : 'tel',
        invalidMessage : '手机格式不正确'
    })
    //员工类型
    $("#staff-type-add").combobox({
        width : 140,
        height : 32,
        data : [{
            id : '正式员工',
            text : '正式员工'
        },{
            id : '合同工',
            text : '合同工'
        },{
            id : '临时工',
            text : '临时工'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    });
    $('#staff-nation-add, #staff-specialty-add, #staff-id-card-add, #staff-health-add, #staff-registered-address-add, #staff-graduate-colleges-add,#staff-nation-edit, #staff-specialty-edit, #staff-id-card-edit, #staff-health-edit, #staff-registered-address-edit, #staff-graduate-colleges-edit').textbox({
        width : 240,
        height : 32
    });

    $('#staff-marital-status-add, #staff-entry-status-add, #staff-education-add, #staff-politics-status-add, #staff-registered-add,#staff-marital-status-edit, #staff-entry-status-edit, #staff-education-edit, #staff-politics-status-edit, #staff-registered-edit').combobox({
        width : 140,
        height : 32,
        editable : false
    });
    $('#staff-entry-date-add, #staff-dimission-date-add, #staff-graduate-date-add, #staff-entry-date-edit, #staff-dimission-date-edit, #staff-graduate-date-edit').datebox({
        width : 140,
        height : 32,
        editable : false
    });
    //身份证
    $("#staff-id-card-add").textbox({
        validType : 'id_card',
        invalidMessage : '身份证格式不正确，须18位证件号'
    })
    //婚否
    $("#staff-marital-status-add").combobox({
        data : [{
            id : '未婚',
            text : '未婚'
        },{
            id : '已婚',
            text : '已婚'
        },{
            id : '离异',
            text : '离异'
        },{
            id : '丧偶',
            text : '丧偶'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    })
    //民族
    $("#staff-nation-add").textbox({
         validType : 'nation',
        invalidMessage : '民族格式不正确，包含“族”字，不少于2位'
    })
    //学历
    $('#staff-education-add').combobox({
        data : [{
            id : '中专',
            text : '中专'
        },{
            id : '大专',
            text : '大专'
        },{
            id : '本科',
            text : '本科'
        },{
            id : '硕士',
            text : '硕士'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    });
    //入职状态
    $('#staff-entry-status-add').combobox({
        data : [{
            id : '在职',
            text : '在职'
        },{
            id : '离休',
            text : '离休'
        },{
            id : '调休',
            text : '调休'
        },{
            id : '退休',
            text : '退休'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    });
    //政治面貌
    $('#staff-politics-status-add').combobox({
        data : [{
            id : '群众',
            text : '群众'
        },{
            id : '团员',
            text : '团员'
        },{
            id : '党员',
            text : '党员'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    });
    //户口
    $('#staff-registered-add, #staff-registered-edit').combobox({
        data : [{
            id : '本地城市户口',
            text : '本地城市户口'
        },{
            id : '本地农村户口',
            text : '本地农村户口'
        },{
            id : '外地户口',
            text : '外地户口'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text'
    });
    //加载新增编辑器
    window.editor = KindEditor.create('#staff-details-add', {
        width : '94%',
        height : '200px',
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
var staff_tool = {
    add : function () {
        $('#staff-add').dialog('open');
        $('#name-add').siblings('span').find('input').select();
    }
}

//扩展工号验证功能
$.extend($.fn.validatebox.defaults.rules, {
    number : {
        validator: function(value){
            return /^[0-9]{4}$/.test(value);
        }
    }
});
//验证身份证
$.extend($.fn.validatebox.defaults.rules, {
    id_card: {
        validator: function(value){
            return /^[0-9]{17}[xX0-9]$/.test(value);
        }
    }
});
//扩展民族验证功能
$.extend($.fn.validatebox.defaults.rules, {
    nation: {
        validator: function(value){
            return /^.{1,4}族$/.test(value);
        }
    }
});
