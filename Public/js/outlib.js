$(function(){
    //出货列表
    $('#outlib').datagrid({
        url : ThinkPHP['MODULE'] + '/Outlib/getList',
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
        toolbar : '#outlib-tool',
        columns : [[
            {
                field : 'id',
                title : '编号',
                width : 60,
                checkbox : true
            },
            {
                field : 'sn',
                title : '产品编号',
                width : 60
            },
            {
                field : 'name',
                title : '产品名称',
                width : 120
            },
            {
                field : 'sell_price',
                title : '销售价格',
                width : 60
            },
            {
                field : 'number',
                title : '出货量',
                width : 40
            },
            {
                field : 'order_sn',
                title : '所属订单',
                width : 80
            },
            {
                field : 'clerk',
                title : '发货员',
                width : 60
            },
            {
                field : 'enter',
                title : '录入员',
                width : 60
            },
            {
                field : 'state',
                title : '状态',
                width : 60
            },
            {
                field : 'dispose_time',
                title : '出库时间',
                width : 100,
                sortable : true
            },
            {
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            }
        ]],
        onClickCell : function (index, field) {
            if (field == 'state' || field == 'details') {
                $('#product').datagrid('selectRow', index);
            }
        }
    });
})
var  outlib_tool={
       reload:function(){
           $('#outlib').datagrid('reload');
       },
       deliver:function(){
           var rows = $('#outlib').datagrid('getSelections');
           if (rows.length > 0) {
               $.messager.confirm('确认操作', '您要批量发货 <strong>' + rows.length + '</strong> 件产品吗？', function (flag) {
                   if (flag) {
                       var ids = [];
                       for (var i = 0; i < rows.length; i ++) {
                           ids.push(rows[i].id);
                       }
                       $.ajax({
                           url : ThinkPHP['MODULE'] + '/Outlib/deliver',
                           type : 'POST',
                           data : {
                               ids : ids.join(',')
                           },
                           beforeSend : function () {
                               $('#outlib').datagrid('loading');
                           },
                           success : function(data, response, status) {
                               if (data) {
                                   $('#outlib').datagrid('loaded');
                                   $('#outlib').datagrid('reload');
                                   $.messager.show({
                                       title : '操作提醒',
                                       msg : data + '件产品成功出库！'
                                   });
                               }
                           }
                       });
                   }
               });
              }else{
                 $.messager.alert('警告操作', '批量发货最少需要指定一件！', 'warning');
           }
       },
      repeal:function(){
          var rows = $('#outlib').datagrid('getSelections');
          if (rows.length > 0) {
              $.messager.confirm('确认操作', '您要批量撤销发货 <strong>' + rows.length + '</strong> 件产品吗？', function (flag) {
                  if (flag) {
                      var ids = [];
                      for (var i = 0; i < rows.length; i ++) {
                          ids.push(rows[i].id);
                      }
                      $.ajax({
                          url : ThinkPHP['MODULE'] + '/Outlib/repeal',
                          type : 'POST',
                          data : {
                              ids : ids.join(',')
                          },
                          beforeSend : function () {
                              $('#outlib').datagrid('loading');
                          },
                          success : function(data, response, status) {
                              if (data) {
                                  $('#outlib').datagrid('loaded');
                                  $('#outlib').datagrid('reload');
                                  $.messager.show({
                                      title : '操作提醒',
                                      msg : data + '件产品成功撤销出库！'
                                  });
                              }
                          }
                      });
                  }
               });
              }else{
              $.messager.alert('警告操作', '批量撤销发货最少需要指定一件！', 'warning');
          }
      },
      reset : function () {
            $('#outlib-search-keywords').textbox('clear');
            $('#outlib-search-date').combobox('clear').combobox('disableValidation');
            $('#outlib-search-date-from').datebox('clear');
            $('#outlib-search-date-to').datebox('clear');
            $('#outlib').datagrid('resetSort', {
                sortName : 'create_time',
                sortOrder : 'desc'
            });
            this.search();
        }
}