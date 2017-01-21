$(function(){
    //跟单列表
    $('#documentary').datagrid({
        url : ThinkPHP['MODULE'] + '/Documentary/getList',
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
        toolbar : '#documentary-tool',
        columns : [[
            {
                field : 'id',
                title : '产品编号',
                width : 60,
                checkbox : true
            },
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
                title : '公司名称',
                width : 100
            },
            {
                field : 'way',
                title : '跟单方式',
                width : 100
            },
            {
                field : 'evolve',
                title : '进展状况',
                width : 100
            },
            {
                field : 'next_contact',
                title : '下次联系',
                width : 100,
                sortable : true
            },
            {
                field : 'd_name',
                title : '跟单员',
                width : 80
            },
            {
                field : 'd_date',
                title : '跟单时间',
                width : 100
            },
            {
                field : 'enter',
                title : '录入员',
                width : 80
            },
            {
                field : 'remark',
                title : '备注',
                width : 100
            },
            {
                field: 'details',
                title: '详情',
                width: 40,
                fixed : true,
                formatter : function (value,row) {
                    return '<a href="javascript:void(0)" class="documentary-details" style="height: 18px;margin-left:2px;" onclick="documentary_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function() {
            $('.documentary-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        },
        onClickCell : function (index, field) {
            if (field == 'details') {
                $('#documentary').datagrid('selectRow', index);
            }
        }
    });
    //时间搜索
    $('#documentary-search-date').combobox({
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
    $('#documentary-search-date-from, #documentary-search-date-to').datebox({
        onSelect : function () {
            if ($('#documentary-search-date').combobox('enableValidation').combobox('isValid') == false) {
                $('#documentary-search-date').combobox('showPanel');
            }
        }
    });
    //新增和修改跟单标题
    $('#documentary-title-add, #documentary-title-edit').textbox({
        width : 240,
        height : 32,
        required : true,
        missingMessage : '请输入跟单标题',
        invalidMessage : '跟单标题不得为空'
    });
    //新增和修改公司名称
    $('#documentary-company-add, #documentary-company-edit').textbox({
        width : 240,
        height : 32,
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#documentary-client').dialog('open');
            }
        }],
        required : true,
        missingMessage : '请点击放大镜图标选择客户',
        invalidMessage : '公司名称不得为空'
    });
    //跟单员
    $('#documentary-name-add, #documentary-name-edit').textbox({
        width : 240,
        height : 32,
        editable : false,
        icons: [{
            iconCls:'icon-zoom',
            handler: function(){
                $('#documentary-staff').dialog('open');
            }
        }],
        missingMessage : '请点击放大镜图标选择档案',
        invalidMessage : '员工名称不得为空'
    });
    //弹出选择公司名称
    $('#documentary-client').dialog({
        width: 550,
        height: 380,
        title: '选择客户',
        iconCls: 'icon-zoom',
        modal: true,
        closed: true,
        maximizable: true,
        onOpen : function () {
            $('#documentary-client-search-keywords').textbox();
            $('#documentary-client-search-button').linkbutton();
            $('#documentary-client-search-refresh').linkbutton();
            $('#documentary-client-search-reset').linkbutton();
            $('#documentary-search-client').datagrid({
                url : ThinkPHP['MODULE'] + '/Client/getList',
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
                toolbar : '#documentary-client-tool',
                columns : [[
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
                        field : 'select',
                        title : '选择客户',
                        width : 60,
                        formatter : function (value, row) {
                            return '<a href="javascript:void(0)" class="select-button" style="height: 18px;margin-left:2px;" onclick="documentary_client_tool.select(\'' + row.id + '\', \'' + row.company + '\');">选择</a>';
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
    //跟单方式
    $('#documentary-way-add, #documentary-way-edit').combobox({
            width : 150,
            height : 32,
            data : [{
                id : '电话沟通',
                text : '电话沟通'
            }, {
                id : '上门拜访',
                text : '上门拜访'
            }, {
                id : '网络咨询',
                text : '网络咨询'
            }],
            editable : false,
            valueField : 'id',
            textField : 'text',
            panelHeight : 'auto'
    });
    //进展状况
    $('#documentary-evolve-add, #documentary-evolve-edit').combobox({
        width : 150,
        height : 32,
        data : [{
            id : '谈判中',
            text : '谈判中'
        }, {
            id : '已放弃',
            text : '已放弃'
        }],
        editable : false,
        valueField : 'id',
        textField : 'text',
        panelHeight : 'auto'
    });
    //下次联系时间选择
    $('#documentary-next-contact-add, #documentary-next-contact-edit').datebox({
        width : 150,
        height : 32
    });
    $('#documentary-remark-add, #documentary-remark-edit').textbox({
        width: 240,
        height: 32
    });
    //新增更单
    $('#documentary-add').dialog({
        width : 420,
        height : 420,
        title : '新增跟单',
        iconCls : 'icon-add-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#documentary-add').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Documentary/register',
                        type : 'POST',
                        data : {
                            title : $.trim($('input[name="documentary_title_add"]').val()),
                            cid : $('input[name="documentary_cid_add"]').val(),
                            sid : $('input[name="documentary_sid_add"]').val(),
                            company : $.trim($('input[name="documentary_company_add"]').val()),
                            d_name : $('input[name="documentary_name_add"]').val(),
                            way : $.trim($('input[name="documentary_way_add"]').val()),
                            evolve : $('input[name="documentary_evolve_add"]').val(),
                            next_contact : $('input[name="documentary_next_contact_add"]').val(),
                            remark : $('input[name="documentary_remark_add"]').val()
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
                                    msg : '添加跟单成功！'
                                });
                                $('#documentary-add').dialog('close');
                                $('#documentary').datagrid('load');
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
                $('#documentary-add').dialog('close');
            }
        }],
        onClose : function () {
            $('#documentary-add').form('reset');
        }
    });
    //更新跟单信息
    $('#documentary-edit').dialog({
        width : 420,
        height : 420,
        title : '修改跟单信息',
        iconCls : 'icon-edit-new',
        modal : true,
        closed : true,
        maximizable : true,
        buttons : [{
            text : '保存',
            size : 'large',
            iconCls : 'icon-accept',
            handler : function () {
                if ($('#documentary-edit').form('validate')) {
                    $.ajax({
                        url : ThinkPHP['MODULE'] + '/Documentary/update',
                        type : 'POST',
                        data : {
                            id : $('input[name="documentary_id_edit"]').val(),
                            title : $.trim($('input[name="documentary_title_edit"]').val()),
                            cid : $('input[name="documentary_cid_edit"]').val(),
                            sid : $('input[name="documentary_sid_edit"]').val(),
                            company : $.trim($('input[name="documentary_company_edit"]').val()),
                            d_name : $('input[name="documentary_name_edit"]').val(),
                            way : $.trim($('input[name="documentary_way_edit"]').val()),
                            evolve : $('input[name="documentary_evolve_edit"]').val(),
                            next_contact : $('input[name="documentary_next_contact_edit"]').val(),
                            remark : $('input[name="documentary_remark_edit"]').val()
                        },
                        beforeSend : function () {
                            $.messager.progress({
                                text : '正在尝试保存...',
                            });
                        },
                        success : function(data) {
                            $.messager.progress('close');
                            if (data > 0) {
                                $.messager.show({
                                    title : '操作提醒',
                                    msg : '修改跟单成功！'
                                });
                                $('#documentary-edit').dialog('close');
                                $('#documentary').datagrid('load');
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
                $('#documentary-edit').dialog('close');
            }
        }],
        onClose : function () {
            $('#documentary-edit').form('reset');
        }
    });
})
//跟单工具栏
var documentary_tool = {
    add : function () {
        $('#documentary-add').dialog('open');
    },
    edit : function () {
        var rows = $('#documentary').datagrid('getSelections');
        if (rows.length > 1) {
            $.messager.alert('警告操作', '编辑记录只能选定一条数据！', 'warning');
        } else if (rows.length == 1) {
            $('#documentary-edit').dialog('open');
            $.ajax({
                url : ThinkPHP['MODULE'] + '/Documentary/getDocumentary',
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
                        $('#documentary-edit').form('load', {
                            documentary_id_edit : data.id,
                            documentary_title_edit : data.title,
                            documentary_company_edit : data.company,
                            documentary_cid_edit : data.cid,
                            documentary_sid_edit : data.sid,
                            documentary_name_edit : data.d_name,
                            documentary_way_edit : data.way,
                            documentary_evolve_edit : data.evolve,
                            documentary_next_contact_edit : data.next_contact,
                            documentary_remark_edit : data.remark
                        });
                    }
                }
            });
        } else if (rows.length == 0) {
            $.messager.alert('警告操作', '编辑记录必须选定一条数据！', 'warning');
        }
    },
    remove:function () {
            var rows = $('#documentary').datagrid('getSelections');
            if (rows.length > 0) {
                $.messager.confirm('确认操作', '您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？', function (flag) {
                    if (flag) {
                        var ids = [];
                        for (var i = 0; i < rows.length; i ++) {
                            ids.push(rows[i].id);
                        }
                        $.ajax({
                            url : ThinkPHP['MODULE'] + '/Documentary/remove',
                            type : 'POST',
                            data : {
                                ids : ids.join(',')
                            },
                            beforeSend : function () {
                                $('#documentary').datagrid('loading');
                            },
                            success : function(data, response, status) {
                                if (data) {
                                    $('#documentary').datagrid('loaded');
                                    $('#documentary').datagrid('reload');
                                    $.messager.show({
                                        title : '操作提醒',
                                        msg : data + '个跟单被成功删除！'
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
          $("documentary").datagrid('reload');
    },
    redo:function(){
         $('#documentary').datagrid('unselectAll');
    },
    reset : function () {
        $('#documentary-search-keywords').textbox('clear');
        $('#documentary-search-date').combobox('clear').combobox('disableValidation');
        $('#documentary-search-date-from').datebox('clear');
        $('#documentary-search-date-to').datebox('clear');
        $('#documentary-search-type').combobox('clear');
        $('#documentary').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
}
//客户工具栏
var  documentary_client_tool={
        search:function(){
              $("#documentary-search-client").datagrid('load',function(){
                  keywords: $.trim($('input[name="documentary_client_search_keywords"]').val())
              });
       },
       reset : function () {
            $('#documentary-client-search-keywords').textbox('clear');
            $('#documentary-search-client').datagrid('resetSort', {
                sortName : 'create_time',
                sortOrder : 'desc'
            });
            this.search();
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
        if ($('#documentary-add').dialog('dialog').css('display') == 'block') {
            $('#documentary-name-add').textbox('setValue', name);
            $('#documentary-sid-add').val(id);
        } else if ($('#documentary-edit').dialog('dialog').css('display') == 'block') {
            $('#documentary-name-edit').textbox('setValue', name);
            $('#documentary-sid-edit').val(id);
        }
        $('#documentary-staff').dialog('close');
        this.reset();
    },
    reset : function () {
        $('#documentary-staff-search-keywords').textbox('clear');
        $('#documentary-search-staff').datagrid('resetSort', {
            sortName : 'create_time',
            sortOrder : 'desc'
        });
        this.search();
    }
};
