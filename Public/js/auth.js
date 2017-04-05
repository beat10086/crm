var auth                       =   $('#auth'),
    authSearchKeywords         =   $('#auth-search-keywords'),
    authSearchDateType         =   $('#auth-search-date-type'),
    authSearchDateFrom         =   $('#auth-search-date-from'),
    authSearchDateTo           =   $('#auth-search-date-to'),
    authTool                   =   $('#auth-tool'),
    authOpt;

    //表格数据列表
    auth.datagrid({
        url: ThinkPHP['MODULE'] + '/Auth/getList',
        fit: true,
        fitColumns: true,
        rownumbers: true,
        border: false,
        nowrap : false,
        sortName: 'create_time',
        sortOrder: 'DESC',
        toolbar: '#auth-tool',
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
                title : '角色名称',
                width : 50
            },
            {
                field : 'status',
                title : '状态',
                width : 40,
                formatter : function (value) {
                    return value == 1 ? '正常' : '禁用';
                }
            },
            {
                field : 'title_rules',
                title : '所属权限',
                width : 180
            },
            {
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            }
        ]]
    });
  //工具栏
  authOpt = {
      reload:function ()
      {
            auth.datagrid('reload');
      },
      redo:function ()
      {
          auth.datagrid('unselectAll');
      },
      search : function ()
      {
          if (authTool.form('validate'))
          {
              auth.datagrid('load', {
                  keywords : authSearchKeywords.textbox('getValue'),
                  dateType : authSearchDateType.combobox('getValue'),
                  dateFrom : authSearchDateFrom.datebox('getValue'),
                  dateTo : authSearchDateTo.datebox('getValue')
              });
          }
      },
      reset : function ()
      {
          authSearchKeywords.textbox('clear');
          authSearchDateType.combobox('clear').combobox('disableValidation');
          authSearchDateFrom.datebox('clear');
          authSearchDateTo.datebox('clear');
          this.search();
          auth.datagrid('sort', {
              sortName : 'create_time',
              sortOrder : 'DESC'
          });
      }
  }
/*查询字段区域*/
//查询关键字
authSearchKeywords.textbox({
    width : 150,
    prompt : '角色名称'
});

//时间类型旋转
authSearchDateType.combobox({
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
authDate = {
    width : 100,
    editable : false,
    onSelect : function ()
    {
        if (authSearchDateType.combobox('enableValidation').combobox('isValid') == false)
        {
            authSearchDateType.combobox('showPanel');
        }
    }
};

//起始时间
authDate.prompt = '起始时间';
authSearchDateFrom.datebox(authDate);

//结束时间
authDate.prompt = '结束时间';
authSearchDateTo.datebox(authDate);