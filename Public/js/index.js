$(function(){
    //初始化tab
    $("#tabs").tabs({
          fit:true,
          border:true,
          onContextMenu:function(e, title,index){  //右键
              e.preventDefault();
              var menu=$("#menu")
              menu.menu('show',{
                    left: e.pageX+25,
                    top: e.pageY
              });
              var _this=this;
              //起始页是不能删除的
              if(index==0){
                  menu.menu('disableItem', $('.closecur')[0]);
                 }else{
                  menu.menu('enableItem', $('.closecur')[0]);
              }
              menu.menu({
                  onClick : function (item){
                        var tablist = $(_this).tabs('tabs');
                         switch (item.text){
                             case '关闭':
                                 $(_this).tabs('close',index);
                                 break;
                             case '关闭所有':
                                 for(var i=tablist.length;i>0;i--){
                                       $(_this).tabs('close',i);
                                 }
                                 break
                             case  '关闭其他所有':
                                 for (var i = tablist.length; i > 0 ; i --)
                                 {
                                     if (i != index)
                                     {
                                         $(_this).tabs('close', i);
                                     }
                                 }
                                 $(_this).tabs('select', 1);
                                 break;
                         }
                  }
              })
          }
    });
    //菜单导航
    $("#nav").tree({
         url:ThinkPHP.MODULE+'/Index/getNav',
         lines:true,
         animate : true,
         onClick:function(nodes){
               var tabs=$("#tabs");
               if(nodes.url){
                   if(tabs.tabs('exists',nodes.text)){
                         tabs.tabs('select', nodes.text)
                        }else{
                         tabs.tabs('add',{
                             title : nodes.text,
                             closable : true,
                             iconCls : nodes.iconCls,
                             href : ThinkPHP.MODULE + '/' + nodes.url
                         });
                     }
               }
         }

    });
})