
angular.module("FMsainuoyi").factory('powerManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        role_add:function(model){
            return DB.basePost(FM_RequestUrl.role_add,model)   //创建权限
        },
        role_del:function(model){
            return DB.basePost(FM_RequestUrl.role_del,model)   //删除权限
        },
        role_edit:function(model){
            return DB.basePost(FM_RequestUrl.role_edit,model)   //修改权限
        },
        role_listRole:function(model){
            return DB.basePost(FM_RequestUrl.role_listRole,model)   //查看权限
        },
        role_userUrl:function(model){
            return DB.basePost(FM_RequestUrl.role_userUrl,model)   //根据USER_ID查询URL
        },
        url_add:function(model){
            return DB.basePost(FM_RequestUrl.url_add,model)  //创建url
        },
        url_del:function(model){
            return DB.basePost(FM_RequestUrl.url_del,model)   //删除url
        },
        url_edit:function(model){
            return DB.basePost(FM_RequestUrl.url_edit,model)  //修改url
        },
        url_list:function(model){
            return DB.basePost(FM_RequestUrl.url_list,model)  //根据PARENT_ID查询URL
        },
        rUrlMap_add:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_add,model)  //权限和菜单绑定
        },
        rUrlMap_del:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_del,model)  //权限和菜单解绑
        },
        rUrlMap_edit:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_edit,model)  //权限和菜单修改
        },
        rUrlMap_list:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_list,model)  //权限和菜单绑定列表
        },
        rUserMap_add:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_add,model)  //权限和运维人员绑定
        },
        rUserMap_del:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_del,model)  //权限和运维人员解绑
        },
        rUserMap_edit:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_edit,model)  //权限和运维人员修改
        },
        rUserMap_list:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_list,model)  //权限和运维人员绑定列表
        },
    }
}])

