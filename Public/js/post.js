/**
 * Created by zmz on 2017/1/11.
 */
$(function(){
    $('#post').datagrid({
        url : ThinkPHP['MODULE'] + '/Post/getList',
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
        toolbar : '#post-tool',
        columns : [[
            {
                field : 'id',
                title : '编号',
                width : 100,
                checkbox : true
            },
            {
                field : 'name',
                title : '职位名称',
                width : 100
            },
            {
                field : 'create_time',
                title : '创建时间',
                width : 100,
                sortable : true
            }
        ]]
    });
    //添加职位窗口
    $('#post-add').dialog({
             title:'新增职位',
             width:400,
             height:190,
             iconCls : 'icon-add-new',
             modal : true,
             closed : true,
             maximizable : false,
             buttons:[
                  {
                      text : '保存',
                      iconCls : 'icon-accept',
                      handler:function(){
                             if($("#post-add").form('validate')){
                                 $.ajax({
                                     url : ThinkPHP['MODULE'] + '/Post/register',
                                     type : 'POST',
                                     data : {
                                         name : $('input[name="post_name_add"]').val()
                                     },
                                     beforeSend : function () {
                                         $.messager.progress({
                                             text : '正在尝试保存...'
                                         });
                                     },
                                     success : function(data) {
                                         $.messager.progress('close');
                                         if(data.code==200){
                                                $.messager.show({
                                                    title : '操作提醒',
                                                    msg : '添加职位成功！'
                                                });
                                                $('#post-add').dialog('close');
                                                $('#post').datagrid('load');
                                            }else if(data.code==-1){
                                                $.messager.alert('添加失败！', '职位名称已存在！', 'warning', function () {

                                                });
                                            }
                                     }
                                 });
                             }
                      }
                  },
                  {
                      text : '取消',
                      iconCls : 'icon-cross',
                      handler:function(){
                          $('#post-add').dialog('close');
                      }
                  }
             ],
        onClose : function () {
            $('#post-add').form('reset');
        }
    })
    //修改职位窗口
    $("#post-edit").dialog({
           width:390,
           height:190,
           title : '修改职位',
           iconCls : 'icon-edit-new',
           modal : true,
           closed : true,
           maximizable :false,
           buttons:[{
               text : '保存',
               iconCls : 'icon-accept',
               handler :function () {
                   if ($('#post-edit').form('validate')) {
                       $.ajax({
                           url : ThinkPHP['MODULE'] + '/Post/update',
                           type : 'POST',
                           data : {
                               id : $('input[name="post_id_edit"]').val(),
                               name : $('input[name="post_name_edit"]').val()
                           },
                           beforeSend : function () {
                               $.messager.progress({
                                   text : '正在尝试保存...',
                               });
                           },
                           success : function(data) {
                               $.messager.progress('close');
                               if (data.code==200) {
                                   $.messager.show({
                                       title : '操作提醒',
                                       msg   : '修改职位成功！'
                                   });
                                   $('#post-edit').dialog('close');
                                   $('#post').datagrid('load');
                               } else if (data.code == -1) {
                                   $.messager.alert('修改失败！', '职位名称已存在！', 'warning', function () {
                                       $('#post-name-edit').siblings('span').find('input').select();
                                   });
                               } else if (data.code == 0) {
                                   $.messager.alert('修改失败！', '职位尚未修改！', 'warning', function () {
                                       $('#post-name-edit').siblings('span').find('input').select();
                                   });
                               }
                           }
                       });
                   }
               }
           },{
               text : '取消',
               iconCls : 'icon-cross',
               handler : function () {
                   $('#post-edit').dialog('close');
               }
           }],
           onClose : function () {
                  $('#post-edit').form('reset');
            }
    })
    //初始化文本框
    $("#post-name-add,#post-name-edit").textbox({
              width:220,
              height:32,
              required:true,
              validType:'length[2,20]',
              missingMessage : '请输入职位名称',
              invalidMessage : '职位名称2-20位'
    });
    //查询时间
    $("#post-search-date").combobox({
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
    $('#post-search-date-from, #post-search-date-to').datebox({
        onSelect : function () {
            if ($('#post-search-date').combobox('enableValidation').combobox('isValid') == false) {
                $('#post-search-date').combobox('showPanel');
            }
        }
    });
})
var post_tool={
       search:function  (){
              if($('#post-tool').form('validate')){
                  $('#post').datagrid('load', {
                      name: $.trim($('input[name="post_search_name"]').val()),
                      date: $('input[name="post_search_date"]').val(),
                      date_from: $('input[name="post_search_date_from"]').val(),
                      date_to: $('input[name="post_search_date_to"]').val()
                  });
              }
       },
       add:function(){
               $('#post-add').dialog('open');
       },
       edit:function(){
            var rows=$("#post").datagrid('getSelections');
            if(rows.length >1){
                $.messager.alert('警告操作', '编辑记录只能选定一条数据！', 'warning');
              }else if (rows.length == 1){
                   $("#post-edit").dialog('open');
                   $.ajax({
                        url : ThinkPHP['MODULE'] + '/Post/getPost',
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
                               if(data.code==200){
                                    $("#post-edit").form('load',{
                                        post_id_edit:data.data.id,
                                        post_name_edit:data.data.name
                                    })
                               }
                            }
                        }
                    });
               }else if (rows.length == 0) {
                $.messager.alert('警告操作', '编辑记录必须选定一条数据！', 'warning');
            }
       },
      remove : function () {
          var rows = $('#post').datagrid('getSelections');
          if(rows.length>0){
               $.messager.confirm('确定操作','您真的要删除所选的<strong>' + rows.length + '</strong>条记录吗？',function(flag){
                      if(flag){
                          var ids = [];
                          for (var i = 0; i < rows.length; i ++) {
                              ids.push(rows[i].id);
                          }
                          $.ajax({
                              url : ThinkPHP['MODULE'] + '/Post/remove',
                              type : 'POST',
                              data : {
                                  ids : ids.join(',')
                              },
                              beforeSend : function () {
                                  $('#post').datagrid('loading');
                              },
                              success : function(data, response, status) {
                                  if (data.code==200) {
                                      $('#post').datagrid('loaded');
                                      $('#post').datagrid('reload');
                                      $.messager.show({
                                          title : '操作提醒',
                                          msg : rows.length + '个职位被成功删除！'
                                      });
                                  }
                              }
                          });
                      }
               })
             }else{
               $.messager.alert('警告操作','删除操作必须至少指定一个记录！','warning');
          }
    },
    reload:function(){
        $('#post').datagrid('reload');
    },
    redo:function(){
        $('#post').datagrid('unselectAll');
    },
    reset : function () {
        $('#post-search-name').textbox('clear');
        $('#post-search-date').combobox('clear').combobox('disableValidation');
        $('#post-search-date-from').datebox('clear');
        $('#post-search-date-to').datebox('clear');
       /* $('#post').datagrid('resetSort', {
            sortName  : 'create_time',
            sortOrder : 'desc'
        });*/
        this.search();
    }
}

