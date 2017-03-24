var inform                       =   $('#inform'),
    informSearchKeywords         =   $('#inform-search-keywords'),
    informSearchDateType         =   $('#inform-search-date-type'),
    informSearchDateFrom         =   $('#inform-search-date-from'),
    informSearchDateTo           =   $('#inform-search-date-to'),
    informAdd                    =   $('#inform-add'),
    informAddTitle               =   $('#inform-add-title'),
    informAddDetails             =   $('#inform-add-details'),
    informTool                   =   $('#inform-tool'),
    informOpt;
    //表格数据列表
    inform.datagrid({
        url: ThinkPHP['MODULE'] + '/Inform/getList',
        fit: true,
        fitColumns: true,
        rownumbers: true,
        border: false,
        sortName: 'create_time',
        sortOrder: 'DESC',
        toolbar: '#inform-tool',
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
                field : 'title',
                title : '通知标题',
                width : 100
            },
            {
                field : 'staff_name',
                title : '发布者',
                width : 100
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
                    return '<a href="javascript:void(0)" class="inform-details" style="height: 18px;margin-left:2px;" onclick="informOpt.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess : function()
        {
            $('.inform-details').linkbutton({
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
    informAdd.dialog({
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
                    INFORM_ADD.sync();
                    if (informAdd.form('validate'))
                    {
                        $.ajax({
                            url : ThinkPHP['MODULE'] + '/Inform/register',
                            type : 'POST',
                            data : {
                                //需要编写的部分
                                title : $.trim(informAddTitle.textbox('getValue')),
                                details : informAddDetails.val()
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
                                if (data > 0)
                                {
                                    $.messager.show({
                                        title : '操作提示',
                                        msg : '添加成功'
                                    });
                                    informAdd.dialog('close');
                                    inform.datagrid('load');
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
                    informAdd.dialog('close');
                }
            }],
        onOpen : function ()
        {
            INFORM_ADD.html('');
        },
        onClose : function ()
        {
            informAdd.form('reset');
            informAdd.dialog('center');
            INFORM_ADD.html('');
        }
    });
//工具条操作
informOpt = {
    add : function () {
        informAdd.dialog('open');
    },
    details:function(id){
        details.dialog('open')
               .dialog('setTitle', '通知详情')
               .dialog('refresh', ThinkPHP['MODULE'] + '/Inform/getDetails/?id=' + id);
    },
    search:function(){
        if (informTool.form('validate')){
            inform.datagrid('load', {
                keywords : informSearchKeywords.textbox('getValue'),
                dateType : informSearchDateType.combobox('getValue'),
                dateFrom : informSearchDateFrom.datebox('getValue'),
                dateTo : informSearchDateTo.datebox('getValue')
            });
        }
    },
    reload:function(){
        inform.datagrid('reload');
    },
    redo:function(){
        inform.datagrid('unselectAll');
    },
    reset : function ()
    {
        informSearchKeywords.textbox('clear');
        informSearchDateType.combobox('clear').combobox('disableValidation');
        informSearchDateFrom.datebox('clear');
        informSearchDateTo.datebox('clear');
        this.search();
        inform.datagrid('sort', {
            sortName : 'create_time',
            sortOrder : 'DESC'
        });
    }
}
//查询时间对象
informDate = {
    width : 100,
    editable : false,
    onSelect : function ()
    {
        if (informSearchDateType.combobox('enableValidation').combobox('isValid') == false)
        {
            informSearchDateType.combobox('showPanel');
        }
    }
};

//起始时间
informDate.prompt = '起始时间';
informSearchDateFrom.datebox(informDate);

//结束时间
informDate.prompt = '结束时间';
informSearchDateTo.datebox(informDate);
/*查询字段区域*/
informSearchKeywords.textbox({
    width : 150,
    prompt : '通知标题或联系人'
});
//通知标题
informAddTitle.textbox({
    width : 350,
    height : 32,
    required : true,
    validType : 'length[2,50]',
    missingMessage : '请输入通知标题',
    invalidMessage : '通知标题2-50位'
});
//时间类型旋转
informSearchDateType.combobox({
    width : 100,
    editable : false,
    prompt : '时间类型',
    data : [{
        id : 'create_time',
        text : '创建时间'
    }],
    valueField : 'id',
    textField : 'text',
    required : true,
    novalidate : true,
    panelHeight : 'auto',
    tipPosition : 'left',
    missingMessage : '请选择时间类型'
});
//加载新增编辑器
INFORM_ADD = KindEditor.create('#inform-add-details', {
    width : '94%',
    height : '320px',
    resizeType : 0,
    items : editor_tool
});
