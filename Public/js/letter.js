var letter                       =   $('#letter'),
    letterSearchKeywords         =   $('#letter-search-keywords'),
    letterSearchDateType         =   $('#letter-search-date-type'),
    letterSearchDateFrom         =   $('#letter-search-date-from'),
    letterSearchDateTo           =   $('#letter-search-date-to'),
    letterTool                   =   $('#letter-tool'),
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