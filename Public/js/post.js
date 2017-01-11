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
    //初始化文本框
    $("#post-name-add").textbox({
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
})
var post_tool={
       add:function(){
               $('#post-add').dialog('open');
       }


}

