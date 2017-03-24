var letter                       =   $('#letter'),
    letterSearchKeywords         =   $('#letter-search-keywords'),
    letterSearchDateType         =   $('#letter-search-date-type'),
    letterSearchDateFrom         =   $('#letter-search-date-from'),
    letterSearchDateTo           =   $('#letter-search-date-to'),
    letterTool                   =   $('#letter-tool'),
    letterAddTitle               =   $('#letter-add-title'),
    letterAdd                    =   $("#letter-add"),
    letterAddDetails             =   $('#letter-add-details'),
    letterOpt;
    //表格数据列表
    letter.datagrid({
        url: ThinkPHP['MODULE'] + '/Letter/getList',
        fit: true,
        fitColumns: true,
        rownumbers: true,
        border: false,
        sortName: 'create_time',
        sortOrder: 'DESC',
        toolbar: '#letter-tool',
        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 30, 40, 50],
        pageNumber: 1,
        columns: [[
            {
                field : 'id',
                title : '编号',
                width : 100,
                checkbox : true
            },
            {
                field : 'staff_name',
                title : '收件人',
                width : 80
            },
            {
                field : 'message',
                title : '私信内容',
                width : 120
            },
            {
                field : 'send_name',
                title : '发件人',
                width : 80
            },
            {
                field : 'isread',
                title : '是否已读',
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
                formatter : function (value,row)
                {
                    return '<a href="javascript:void(0)" class="letter-details" style="height: 18px;margin-left:2px;" onclick="productOpt.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function()
        {
            $('.letter-details').linkbutton({
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
//新增私信
letterAdd.dialog({
    title : '新增产品',
    width: 780,
    height: 506,
    iconCls : 'icon-add',
    closed: true,
    modal : true,
    maximizable : true,
    buttons:[
        {
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function ()
            {
                LETTER_ADD.sync();
                if (letterAdd.form('validate'))
                {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Letter/register',
                        type : 'POST',
                        data : {
                                title     : $.trim(letterAddTitle.textbox('getValue')),
                                staff_id  :$("input[name=letter-sid-add]").val(),
                                staff_name:$("input[name=letter_name_add]").val(),
                                details   : letterAddDetails.val()
                        },
                        beforeSend : function ()
                        {
                            $.messager.progress({
                                text : '正在处理中...'
                            })
                        },
                        success : function (data)
                        {
                            $.messager.progress('close');
                            if (data.code == 200)
                            {
                                $.messager.show({
                                    title : '操作提示',
                                    msg : '添加成功'
                                });
                                letterAdd.dialog('close');
                                letter.datagrid('load');
                            }
                        }
                    });
                }
            }
        },{
            text : '取消',
            size : 'large',
            iconCls : 'icon-cross',
            handler : function ()
            {
                letterAdd.dialog('close');
            }
        }],
    onOpen : function ()
    {
        LETTER_ADD.html('');
    },
    onClose : function ()
    {
        letterAdd.form('reset');
        letterAdd.dialog('center');
        LETTER_ADD.html('');
    }
});

//私信标题
letterAddTitle.textbox({
    width : 350,
    height : 32,
    required : true,
    validType : 'length[2,50]',
    missingMessage : '请输入通知标题',
    invalidMessage : '通知标题2-50位'
});


//收件人
$('#letter-name-add').textbox({
    width :350,
    height : 32,
    editable : false,
    required : true,
    icons: [{
        iconCls:'icon-zoom',
        handler: function(){
            $('#documentary-staff').dialog('open');
        }
    }],
    missingMessage : '请点击放大镜图标选择收件人',
    invalidMessage : '员工名称不得为空'
});
//弹出员工信息
$('#documentary-staff').dialog({
    width: 550,
    height: 380,
    title: '选择跟单员',
    iconCls: 'icon-zoom',
    modal: true,
    closed: true,
    maximizable: true,
    onOpen : function () {
        $('#documentary-staff-search-keywords').textbox();
        $('#documentary-staff-search-button').linkbutton();
        $('#documentary-staff-search-refresh').linkbutton();
        $('#documentary-staff-search-reset').linkbutton();
        $('#documentary-search-staff').datagrid({
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
            toolbar : '#documentary-staff-tool',
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
                        return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="documentary_staff_tool.select(\'' + row.id + '\', \'' + row.name + '\');">选择</a>';
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
                $('#documentary-search-staff').datagrid('selectRow', index);
            }
        });
    }
});
letterOpt = {
    add : function () {
        letterAdd.dialog('open');
    },
    remove:function(){
        var rows =letter.datagrid('getSelections');
        if(rows.length>0){
            $.messager.confirm('确定操作','您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？',function(flag){
                if(flag){
                    var ids = [];
                    for (var i = 0; i < rows.length; i ++) {
                        ids.push(rows[i].id);
                    }
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Letter/remove',
                        type : 'POST',
                        data : {
                            ids : ids.join(',')
                        },
                        beforeSend : function () {
                            letter.datagrid('loading');
                        },
                        success : function(data, response, status) {
                            if (data.code==200) {
                                letter.datagrid('loaded');
                                letter.datagrid('reload');
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : rows.length + '个私信被成功删除！'
                                });
                            }else if(data.code==-2){
                                letter.datagrid('loaded');
                                letter.datagrid('reload');
                                $.messager.show({
                                    title : '操作失败',
                                    msg   : '私信未读状态，不能删除！'
                                });
                            }
                        }
                    });
                }
            })
        }else{
            $.messager.alert('警告操作','删除操作必须至少指定一个记录！','warning');
        }
    }
}

//员工工具栏操作模块
var documentary_staff_tool = {
    search : function () {
        $('#documentary-search-staff').datagrid('load', {
            keywords: $.trim($('input[name="documentary_staff_search_keywords"]').val()),
            uid : true
        });
    },
    select : function (id, name) {
        if ($('#documentary-staff').dialog('dialog').css('display') == 'block') {
            $('#letter-name-add').textbox('setValue', name);
            $('#letter-sid-add').val(id);
        } else if ($('#documentary-staff').dialog('dialog').css('display') == 'block') {
            $('#documentary-name-edit').textbox('setValue', name);
            $('#documentary_sid_edit').val(id);
        }
        $('#documentary-staff').dialog('close');
        this.reset();
    },
    reset : function () {
        $('#documentary-staff-search-keywords').textbox('clear');
        this.search();
       /* $('#documentary-search-staff').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });*/
    }
};
//加载新增编辑器
LETTER_ADD = KindEditor.create('#letter-add-details', {
    width : '94%',
    height : '320px',
    resizeType : 0,
    items : editor_tool
});