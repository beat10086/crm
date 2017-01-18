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
    //编辑档案
    $("#staff-edit").dialog({
        width : 780,
        height : 500,
        title : '修改档案',
        iconCls : 'icon-edit-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#staff-edit').form('validate')) {
                    window.editor.sync();
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Staff/update',
                        type : 'POST',
                        data : {
                            id : $.trim($('input[name="staff_id_edit"]').val()),
                            gender : $('input[name="staff_gender_edit"]').val(),
                            number : $.trim($('input[name="staff_number_edit"]').val()),
                            pid : $.trim($('input[name="staff_post_edit"]').val()),
                            type : $.trim($('input[name="staff_type_edit"]').val()),
                            tel : $.trim($('input[name="staff_tel_edit"]').val()),
                            id_card : $.trim($('input[name="staff_id_card_edit"]').val()),
                            nation : $.trim($('input[name="staff_nation_edit"]').val()),
                            marital_status : $.trim($('input[name="staff_marital_status_edit"]').val()),
                            entry_status : $.trim($('input[name="staff_entry_status_edit"]').val()),
                            entry_date : $.trim($('input[name="staff_entry_date_edit"]').val()),
                            dimission_date : $.trim($('input[name="staff_dimission_date_edit"]').val()),
                            politics_status : $.trim($('input[name="staff_politics_status_edit"]').val()),
                            specialty : $.trim($('input[name="staff_specialty_edit"]').val()),
                            education : $.trim($('input[name="staff_education_edit"]').val()),
                            health : $.trim($('input[name="staff_health_edit"]').val()),
                            registered : $.trim($('input[name="staff_registered_edit"]').val()),
                            registered_address : $.trim($('input[name="staff_registered_address_edit"]').val()),
                            graduate_date : $('input[name="staff_graduate_date_edit"]').val(),
                            graduate_colleges : $.trim($('input[name="staff_graduate_colleges_edit"]').val()),
                            intro : $.trim($('textarea[name="staff_intro_edit"]').val()),
                            details : $('textarea[name="staff_details_edit"]').val()
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
                                    msg : '修改档案成功！'
                                });
                                $('#staff-edit').dialog('close');
                                $('#staff').datagrid('load');
                            } else {
                                $.messager.alert('修改失败！', '未修改或未知错误！', 'warning');
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
                $('#staff-edit').dialog('close');
            }
        }],
        onClose : function () {
            $('#staff-edit').form('reset');
            window.editor.html('');
        }
    });
    //职位搜索
    $('#staff-search-post').combobox({
        width : 70,
        url : ThinkPHP['MODULE'] + '/Post/getListAll',
        editable : false,
        valueField : 'id',
        textField : 'name',
        panelHeight : 'auto'
    });
    //姓名
    $("#staff-name-add,#staff-name-edit").textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入员工姓名',
        invalidMessage : '员工姓名2-20位'
    })
    //入职状态搜索
    $('#staff-search-entry-status').combobox({
        width : 90,
        data : [{
            id : '在职',
            text : '在职'
        }, {
            id : '离职',
            text : '离职'
        }, {
            id : '调休',
            text : '调休'
        }, {
            id : '退休',
            text : '退休'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //时间搜索
    $('#staff-search-date').combobox({
        width : 90,
        data : [{
            id : 'entry_date',
            text : '入职时间'
        }, {
            id : 'dimission_date',
            text : '离职时间'
        }, {
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
    $('#staff-search-date-from, #staff-search-date-to').datebox({
        onSelect : function () {
            if ($('#staff-search-date').combobox('enableValidation').combobox('isValid') == false) {
                $('#staff-search-date').combobox('showPanel');
            }
        }
    });
    //性别搜索
    $('#staff-search-gender').combobox({
        width :70,
        data : [{
            id : '男',
            text : '男'
        }, {
            id : '女',
            text : '女'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //婚姻状态搜索
    $('#staff-search-marital-status').combobox({
        width : 70,
        data : [{
            id : '未婚',
            text : '未婚'
        }, {
            id : '已婚',
            text : '已婚'
        }, {
            id : '离异',
            text : '离异'
        }, {
            id : '丧偶',
            text : '丧偶'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //学历搜索
    $('#staff-search-education').combobox({
        width : 70,
        data : [{
            id : '中专',
            text : '中专'
        }, {
            id : '大专',
            text : '大专'
        }, {
            id : '本科',
            text : '本科'
        }, {
            id : '硕士',
            text : '硕士'
        }, {
            id : '博士',
            text : '博士'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //员工类型搜索
    $('#staff-search-type').combobox({
        width : 90,
        data : [{
            id : '正式员工',
            text : '正式员工'
        }, {
            id : '临时工',
            text : '临时工'
        }, {
            id : '合同工',
            text : '合同工'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //身份证搜索
    $('#staff-search-id-card').textbox({
        width : 220,
        validType : 'id_card',
        invalidMessage : '身份证格式不正确，且精确到18位',
        tipPosition : 'bottom'
    });
    //民族证搜索
    $('#staff-search-nation').textbox({
        width : 220,
        validType : 'nation',
        invalidMessage : '民族查询必须填入完整名称，不得小于2位，且末尾包含“族”字',
        tipPosition : 'bottom'
    });
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
    $('#staff-gender-edit-1').linkbutton({
        plain : true,
        toggle : true,
        selected : true,
        group : 'staff_gender_edit',
        iconCls : 'icon-male',
        onClick : function () {
            $('#staff-gender-edit').val('男');
        }
    });

    $('#staff-gender-edit-2').linkbutton({
        plain : true,
        toggle : true,
        group : 'staff_gender_edit',
        iconCls : 'icon-female',
        onClick : function () {
            $('#staff-gender-edit').val('女');
        }
    });
    //工号
    $("#staff-number-add,#staff-number-edit").textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'number',
        missingMessage : '请输入员工工号',
        invalidMessage : '员工工号四位数字'
    })
    //职位
    $("#staff-post-add,#staff-post-edit").combobox({
        width : 140,
        height : 32,
        url : ThinkPHP['MODULE'] + '/Post/getListAll',
        editable : false,
        valueField : 'id',
        textField : 'name',
        hasDownArrow :true
    })
    //移动电话
    $("#staff-tel-add,#staff-tel-edit").textbox({
        width : 240,
        height : 32,
        validType : 'tel',
        invalidMessage : '手机格式不正确'
    })
    //员工类型
    $("#staff-type-add,#staff-type-edit").combobox({
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
    $("#staff-id-card-add,#staff-id-card-edit").textbox({
        validType : 'id_card',
        invalidMessage : '身份证格式不正确，须18位证件号'
    })
    //婚否
    $("#staff-marital-status-add,#staff-marital-status-edit").combobox({
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
    $("#staff-nation-add,#staff-nation-edit").textbox({
         validType : 'nation',
        invalidMessage : '民族格式不正确，包含“族”字，不少于2位'
    })
    //学历
    $('#staff-education-add,#staff-education-edit').combobox({
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
    $('#staff-entry-status-add,#staff-entry-status-edit').combobox({
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
    $('#staff-politics-status-add,#staff-politics-status-edit').combobox({
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
    search:function(){
        $('#staff').datagrid('load', {
            keywords: $.trim($('input[name="staff_search_keywords"]').val()),
            date: $('input[name="staff_search_date"]').val(),
            date_from: $('input[name="staff_search_date_from"]').val(),
            date_to: $('input[name="staff_search_date_to"]').val(),
            gender: $('input[name="staff_search_gender"]').val(),
            pid: $('input[name="staff_search_post"]').val(),
            entry_status: $('input[name="staff_search_entry_status"]').val(),
            marital_status: $('input[name="staff_search_marital_status"]').val(),
            education: $('input[name="staff_search_education"]').val(),
            type: $('input[name="staff_search_type"]').val(),
            id_card: $('input[name="staff_search_id_card"]').val(),
            nation: $('input[name="staff_search_nation"]').val()
        });
    },
    details:function(id){
        $('#details-dialog').dialog('open')
                            .dialog('setTitle', '员工档案详情')
                            .dialog('refresh', ThinkPHP['MODULE'] + '/Staff/getDetails/?id=' + id);
    },
    add : function () {
        $('#staff-add').dialog('open');
        $('#name-add').siblings('span').find('input').select();
    },
    edit:function () {
       var rows=$("#staff").datagrid('getSelections');
        if(rows.length>1){
                 $.messager.alert('警告提示','辑记录只能选定一条数据！','warning');
            }else if(rows.length==1){
                 $('#staff-edit').dialog('open');
                 $.ajax({
                    url : ThinkPHP['MODULE'] + '/staff/getStaff',
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
                             $("#staff-edit").form('load',{
                                 staff_id_edit:data.id,
                                 staff_name_edit:data.name,
                                 staff_gender_edit:data.gender,
                                 staff_number_edit:data.number,
                                 staff_post_edit:data.pid,
                                 staff_tel_edit:data.tel,
                                 staff_type_edit:data.type,
                                 staff_id_card_edit:data.id_card,
                                 staff_marital_status_edit:data.marital_status,
                                 staff_nation_edit:data.nation,
                                 staff_entry_date_edit:data.entry_date == '0000-00-00' ? '' : data.entry_date,
                                 staff_education_edit:data.education,
                                 staff_dimission_date_edit : data.dimission_date == '0000-00-00' ? '' : data.dimission_date,
                                 staff_entry_status_edit : data.entry_status,
                                 staff_politics_status_edit : data.politics_status,
                                 staff_specialty_edit : data.Extend.specialty,
                                 staff_health_edit : data.Extend.health,
                                 staff_registered_edit : data.Extend.registered,
                                 staff_graduate_date_edit : data.Extend.graduate_date == '0000-00-00' ? '' : data.Extend.graduate_date,
                                 staff_registered_address_edit : data.Extend.registered_address,
                                 staff_graduate_colleges_edit : data.Extend.graduate_colleges,
                                 staff_intro_edit : data.Extend.intro
                             })
                             window.editor.html(data.Extend.details)
                        }
                    }
                });
           }else if(rows.length=0){
               $.messager.alert('警告提示','辑记录必须选定一条数据！','warning');
        }
    },
    remove:function(){
        var rows = $('#staff').datagrid('getSelections');
        if(rows.length>0){
            $.messager.confirm('确认操作','您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？',function(flag){
                   if(flag){
                       var ids = [];
                       for (var i = 0; i < rows.length; i ++) {
                           ids.push(rows[i].id);
                       }
                       $.ajax({
                           url : ThinkPHP['MODULE'] + '/Staff/remove',
                           type : 'POST',
                           data : {
                               ids : ids.join(',')
                           },
                           beforeSend : function () {
                               $('#user').datagrid('loading');
                           },
                           success : function(data, response, status) {
                               if (data) {
                                   $('#staff').datagrid('loaded');
                                   $('#staff').datagrid('reload');
                                   $.messager.show({
                                       title : '操作提醒',
                                       msg : data + '个档案被成功删除！'
                                   });
                               }
                           }
                       });
                   }
            });
          }else{
             $.messager.alert('警告操作','删除操作必须至少指定一个记录！','waring');
        }
    },
    reload:function(){
           $("#staff").datagrid('reload');
    },
    redo:function(){
           $("#staff").datagrid('unselectAll');
    },
    field:function(){
         if($("#field").linkbutton('option').text()=='展开查询字段'){
                 $(".more").show();
                 $('#field').linkbutton({
                     iconCls : 'icon-reduce-search',
                     text : '收起查询字段'
                 }).linkbutton('select');
           }else{
                 $(".more").hide();
                 $('#field').linkbutton({
                     iconCls : 'icon-add-search',
                     text : '展开查询字段'
                 }).linkbutton('unselect');
         }
    },
    reset:function(){
            $('#staff-search-keywords').textbox('clear');
            $('#staff-search-post').combobox('clear');
            $('#staff-search-state').combobox('clear');
            $('#staff-search-date').combobox('clear').combobox('disableValidation');
            $('#staff-search-date-from').datebox('clear');
            $('#staff-search-date-to').datebox('clear');
            $('#staff-search-gender').combobox('clear');
            $('#staff-search-marital-status').combobox('clear');
            $('#staff-search-entry-status').combobox('clear');
            $('#staff-search-education').combobox('clear');
            $('#staff-search-type').combobox('clear');
            $('#staff-search-id-card').textbox('clear');
            $('#staff-search-nation').textbox('clear');
            $('#staff').datagrid('resetSort', {
                sortName : 'create_time',
                sortOrder : 'desc'
            });
            this.search();
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
