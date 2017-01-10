$(function(){
    $("#user").datagrid({
        url : ThinkPHP['MODULE'] + '/User/getList',
        fit:true,
        fitColumns:true, //真正的自动展开/收缩列的大小，以适应网格的宽度，防止水平滚动
        striped : true,  //是否显示斑马线效果
        rownumbers : true,  //则显示一个行号列
        border : false,
        pagination : true,
        pageSize : 20,
        pageList : [10, 20, 30, 40, 50],
        pageNumber : 1,
        sortName : 'create_time',
        sortOrder : 'DESC',
        toolbar : '#user-tool',
        columns:[[
            {
                field : 'id',
                title : '自动编号',
                width : 100,
                checkbox : true
            },
            {
                field : 'accounts',
                title : '帐号名称',
                width : 80
            },
            {
                field : 'last_login_time',
                title : '登录时间',
                width : 110,
                sortable : true
            },
            {
                field : 'last_login_ip',
                title : '登录IP',
                width : 80
            },
            {
                field : 'login_count',
                title : '登录次数',
                width : 60,
                sortable : true
            },{
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            },
            {
                field : 'state',
                title : '状态',
                width : 43,
                fixed : true,
                sortable : true,
                formatter:function(value,row){
                    var state = '';
                    switch (value) {
                        case '冻结' :
                            state = '<a href="javascript:void(0)" user-id="' + row.id + '" user-state="冻结" class="user-state user-state-1" style="height: 18px;margin-left:4px;"></a>';
                            break;
                        case '正常' :
                            state = '<a href="javascript:void(0)" user-id="' + row.id + '" user-state="正常" class="user-state user-state-2" style="height: 18px;margin-left:4px;"></a>';
                            break;
                    }
                    return state;
                }
            },
            {
                field: 'details',
                title: '详情',
                width: 40,
                fixed : true,
                formatter : function (value,row) {
                    return '<a href="javascript:void(0)" class="user-details" style="height: 18px;margin-left:2px;" onclick="user_tool.details(' + row.id + ');"></a>';
                }
            }
        ]],
        onLoadSuccess:function(){
            $('.user-state-1').linkbutton({
                iconCls : 'icon-login',
                plain : true
            });
            $('.user-state-2').linkbutton({
                iconCls : 'icon-ok',
                plain : true
            });
            $('.user-details').linkbutton({
                iconCls : 'icon-text',
                plain : true
            });
        }
    })
})

