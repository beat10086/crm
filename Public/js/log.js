var log                       =   $('#log'),
    logSearchType             =   $('#log-search-type'),
    logSearchDateType         =   $('#log-search-date-type'),
    logSearchDateFrom         =   $('#log-search-date-from'),
    logSearchDateTo           =   $('#log-search-date-to'),
    logTool                   =   $('#log-tool'),
    logOpt;


//表格数据列表
log.datagrid({
    url: ThinkPHP['MODULE'] + '/Log/getList',
    fit: true,
    fitColumns: true,
    rownumbers: true,
    border: false,
    sortName: 'create_time',
    sortOrder: 'DESC',
    toolbar: '#log-tool',
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
            field : 'user',
            title : '管理帐号',
            width : 100
        },
        {
            field : 'type_name',
            title : '操作类型',
            width : 100
        },
        {
            field : 'module',
            title : '操作模块',
            width : 100
        },
        {
            field : 'ip',
            title : 'IP地址',
            width : 100
        },
        {
            field : 'create_time',
            title : '创建时间',
            width : 120,
            sortable : true
        }
    ]]
});
logOpt = {
    reload:function(){
        log.datagrid('reload');
    },
    redo:function(){
        log.datagrid('unselectAll');
    },
    search:function(){
        if (logTool.form('validate')){
            log.datagrid('load', {
                type : logSearchType.textbox('getText'),
                dateType : logSearchDateType.combobox('getValue'),
                dateFrom : logSearchDateFrom.datebox('getValue'),
                dateTo : logSearchDateTo.datebox('getValue')
            });
        }
    },
    reset : function ()
    {
        logSearchType.textbox('clear');
        logSearchDateType.combobox('clear').combobox('disableValidation');
        logSearchDateFrom.datebox('clear');
        logSearchDateTo.datebox('clear');
        this.search();
        log.datagrid('sort', {
            sortName : 'create_time',
            sortOrder : 'DESC'
        });
    }
}

/*查询字段区域*/
//查询关键字
logSearchType.combobox({
    width : 100,
    editable : false,
    prompt : '操作类型',
    data : [
        {
            id : 'login',
            text : '登录操作'
        },
        {
            id : 'insert',
            text : '新增操作'
        },
        {
            id : 'update',
            text : '修改操作'
        },
        {
            id : 'delete',
            text : '删除操作'
        }
    ],
    valueField : 'id',
    textField : 'text',
    panelHeight : 'auto'
});

//时间类型旋转
logSearchDateType.combobox({
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
//查询时间对象
logDate = {
    width : 100,
    editable : false,
    onSelect : function ()
    {
        if (logSearchDateType.combobox('enableValidation').combobox('isValid') == false)
        {
            logSearchDateType.combobox('showPanel');
        }
    }
};

//起始时间
logDate.prompt = '起始时间';
logSearchDateFrom.datebox(logDate);

//结束时间
logDate.prompt = '结束时间';
logSearchDateTo.datebox(logDate);
