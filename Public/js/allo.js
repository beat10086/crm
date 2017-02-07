    var allo                       =    $('#allo'),
        alloAdd                    =    $('#allo-add'),
        alloAddTitle               =    $('#allo-add-title'),
        alloAddType                =    $('#allo-add-type'),
        alloAddStaff               =    $('#allo-add-staff'),
        alloAddStaffId             =    $('#allo-add-staff-id'),
        alloAddStartDate           =    $('#allo-add-start-date'),
        alloAddEndDate             =    $('#allo-add-end-date'),
        alloEdit                   =    $('#allo-edit'),
        alloEditId                 =    $('#allo-edit-id'),
        alloSearchKeywords         =    $('#allo-search-keywords'),
        alloSearchDateType         =    $('#allo-search-date-type'),
        alloSearchDateFrom         =    $('#allo-search-date-from'),
        alloSearchDateTo           =    $('#allo-search-date-to'),
        alloSearchType             =    $('#allo-search-type'),
        alloSearchState            =    $('#allo-search-state'),
        alloStaff                  =    $('#allo-staff'),
        alloTool                   =    $('#allo-tool'),
        alloOpt;

    //表格数据列表
    allo.datagrid({
        url: ThinkPHP['MODULE'] + '/Allo/getList',
        fit: true,
        queryParams : {
            allo : true
        },
        fitColumns: true,
        rownumbers: true,
        border: false,
        sortName: 'create_time',
        sortOrder: 'DESC',
        toolbar: '#allo-tool',
        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 30, 40, 50],
        pageNumber: 1,
        columns: [[
            {
                field : 'id',
                title : '自动编号',
                width : 60,
                checkbox : true
            },
            {
                field : 'title',
                title : '工作名称',
                width : 120
            },
            {
                field : 'type',
                title : '业务类型',
                width : 80
            },
            {
                field : 'stage',
                title : '完成阶段',
                width : 100
            },
            {
                field : 'state',
                title : '状态',
                width : 80
            },
            {
                field : 'staff_name',
                title : '实行人',
                width : 80
            },
            {
                field : 'allo_name',
                title : '发起人',
                width : 80
            },
            {
                field : 'start_date',
                title : '开始时间',
                width : 120
            },
            {
                field : 'end_date',
                title : '结束时间',
                width : 120
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
                    return '<a href="javascript:void(0)" class="allo-details" style="height: 18px;margin-left:2px;" onclick="client_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function()
        {
            $('.allo-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
        onClickCell : function (index, field)
        {
            if (field == 'details') {
                $(this).datagrid('selectRow', index);
            }
        }

    });
    //新增面板
    alloAdd.dialog({
        width : 420,
        height : 350,
        title : '创建工作',
        iconCls : 'icon-add',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#allo-add').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Allo/register',
                        type : 'POST',
                        data : {
                            //需要提交的地方
                            title       : $.trim(alloAddTitle.textbox('getValue')),
                            type        : alloAddType.combobox('getValue'),
                            start_date  : alloAddStartDate.datebox('getValue'),
                            end_date    : alloAddEndDate.datebox('getValue'),
                            staff_id    : alloAddStaffId.val(),
                            staff_name  : alloAddStaff.textbox('getValue')
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
                                    msg : '添加工作计划成功！'
                                });
                                alloAdd.dialog('close');
                                allo.datagrid('load');
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
                alloAdd.dialog('close');
            }
        }],
        onClose : function () {
            alloAdd.form('reset');
        }
    });
alloOpt = {
    add:function(){
        alloAdd.dialog('open');
    },
    edit:function(){
        var rows = allo.datagrid('getSelections');
        if (rows.length != 1) {
             $.messager.alert('警告操作', '更新工作阶段只能选定一条数据！', 'warning');
            }else if(rows.length==1){
            //打开更新阶段窗口
            alloEdit.dialog('open');
            //Ajax获取一条数据
            $.ajax({
                url : ThinkPHP['MODULE'] + '/Work/getOne',
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
                        alloEdit.form('load', {
                            allo_edit_id : data.id,
                            allo_edit_title : data.title,
                            allo_edit_type : data.type,
                            allo_edit_start_date : data.start_date,
                            allo_edit_end_date : data.end_date,
                            allo_edit_state : data.state
                        });
                        if (data.state == '已完成') {
                            $('#allo-button').hide();
                        } else {
                            $('#allo-button').show();
                        }
                    }
                }
            });
            //显示工作阶段列表
            $('#allo-stage-list').datagrid({
                url : ThinkPHP['MODULE'] + '/Work/getStage',
                queryParams : {
                    id : rows[0].id
                },
                fitColumns : true,
                striped : true,
                rownumbers : true,
                border : true,
                columns : [[
                    {
                        field : 'title',
                        title : '完成阶段',
                        width : 100,
                        editor : {
                            type : 'combobox',
                            options : {
                                required : true,
                                valueField:'id',
                                textField:'text',
                                data : [{
                                    id : '跟单进行中',
                                    text : '跟单进行中'
                                }, {
                                    id : '达成订单',
                                    text : '达成订单'
                                }, {
                                    id : '订单已付款',
                                    text : '订单已付款'
                                }, {
                                    id: '申请采购资金',
                                    text: '申请采购资金'
                                }, {
                                    id: '采购货物',
                                    text: '采购货物'
                                }],
                                missingMessage : '请输入或选择工作阶段'
                            }
                        }
                    },
                    {
                        field : 'create_time',
                        title : '创建时间',
                        width : 100
                    }
                ]],
                onClickCell : function (index) {
                    $(this).datagrid('selectRow', index);
                }
                ,
                onAfterEdit : function (index, row) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Work/addStage',
                        type : 'POST',
                        data : {
                            allo_id : alloEditId.val(),
                            title : row.title
                        },
                        success : function(data) {
                            if (data) {
                                $('#allo-stage-list').datagrid('reload');
                                $('#allo-add-stage-save').hide();
                                $('#allo-add-stage-cancel').hide();
                                $('#allo-add-stage-button').show();
                                $('#allo-add-stage-finish').show();
                            }
                        }
                    });
                }
            });
        }
    }
}
    /*新增字段*/
alloAddTitle.textbox({
        width : 240,
        height : 32,
        required : true,
        validType : 'length[2,20]',
        missingMessage : '请输入工作计划',
        invalidMessage : '工作计划字数2-20位'
});
    //工作类型
    alloAddType.combobox({
        width : 120,
        height : 32,
        data : [{
            id : '业务',
            text : '业务'
        }, {
            id : '内勤',
            text : '内勤'
        }],
        required : true,
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //开始时间
    alloAddStartDate.datebox({
        width : 180,
        height : 32,
        required : true,
        editable : false
    });

    //结束时间
    alloAddEndDate.datebox({
        width : 180,
        height : 32,
        required : true,
        editable : false
    });
    //新增分配员
    alloAddStaff.textbox({
        width : 240,
        height : 32,
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#allo-staff').dialog('open');
            }
        }],
        required : true,
        missingMessage : '请点击放大镜图标分配员工',
        invalidMessage : '员工名称不得为空'
    })
    /*修改字段*/
    $('#allo-edit-title, #allo-edit-type, #allo-edit-start-date, #allo-edit-end-date, #allo-edit-state').textbox({
        width : 240,
        height : 32,
        disabled : true
    });
    //设置添加按钮
    $('#allo-add-stage-button').linkbutton({
        iconCls : 'icon-add',
        onClick : function () {
            var stageList = $('#allo-stage-list');
            //添加一个栏位
            stageList.datagrid('appendRow', {});
            //开始编辑最末一个栏位
            stageList.datagrid('beginEdit', stageList.datagrid('getRows').length - 1);
            //显示保存和取消按钮，隐藏添加和完成按钮
            $('#allo-add-stage-save').show();
            $('#allo-add-stage-cancel').show();
            $('#allo-add-stage-button').hide();
            $('#allo-add-stage-finish').hide();
        }
    });
    //保存按钮
    $('#allo-add-stage-save').linkbutton({
        iconCls : 'icon-accept',
        onClick : function () {
            var stageList = $('#allo-stage-list');
            //结束编辑最后一个栏位
            stageList.datagrid('endEdit', stageList.datagrid('getRows').length - 1);
            //刷新一下表
            allo.datagrid('load');
        }
    });
    //取消按钮
    $('#allo-add-stage-cancel').linkbutton({
        iconCls : 'icon-redo',
        onClick : function () {
            //关闭动态添加的栏位
            $('#allo-stage-list').datagrid('rejectChanges');
            //显示添加和完成按钮，隐藏保存和取消按钮
            $('#allo-add-stage-save').hide();
            $('#allo-add-stage-cancel').hide();
            $('#allo-add-stage-button').show();
            $('#allo-add-stage-finish').show();
        }
    });
    //设置完成按钮
    $('#allo-add-stage-finish').linkbutton({
        iconCls : 'icon-accept',
        onClick : function () {
            $.ajax({
                url : ThinkPHP['MODULE'] + '/Work/finish',
                type : 'POST',
                data : {
                    allo_id : alloEditId.val()
                },
                success : function(data) {
                    if (data) {
                        $('#allo-stage-list').datagrid('reload');
                        $('#allo-add-stage-save').hide();
                        $('#allo-add-stage-cancel').hide();
                        $('#allo-add-stage-button').hide();
                        $('#allo-add-stage-finish').hide();

                        //刷新一下表
                        allo.datagrid('load');
                    }
                }
            });
        }
    });
    //弹出选择员工
    alloStaff.dialog({
        width: 550,
        height: 380,
        title: '分配员工',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#allo-search-staff').datagrid({
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
                toolbar : '#allo-staff-tool',
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
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="allo_staff_tool.select(\'' + row.id + '\', \'' + row.name + '\');">选择</a>';
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
                    $(this).datagrid('selectRow', index);
                }
            });
        }
    });
    //员工操作模块
    var allo_staff_tool = {
        search : function () {
            $('#allo-search-staff').datagrid('load', {
                keywords: $.trim($('#allo-staff-search-keywords').val()),
                uid : true
            });
        },
        select : function (id, name) {
            if ($('#allo-add').dialog('dialog').css('display') == 'block') {
                $('#allo-add-staff').textbox('setValue', name);
                $('#allo-add-staff-id').val(id);
            }
            $('#allo-staff').dialog('close');
            this.reset();
        },
        reset : function () {
            $('#allo-staff-search-keywords').textbox('clear');
            this.search();
            $('#allo-search-staff').datagrid('sort', {
                sortName : 'create_time',
                sortOrder : 'desc'
            });
        }
    };