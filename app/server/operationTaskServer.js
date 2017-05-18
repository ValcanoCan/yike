
angular.module("FMsainuoyi").factory('operationTask',['$http','$q','DB',function($http,$q,DB){
    return {
        task_add:function(model){
            return DB.basePost(FM_RequestUrl.task_add,model)   //创建运维任务
        },
        task_edit:function(model){
            return DB.basePost(FM_RequestUrl.task_edit,model)   //修改运维任务
        },
        task_del:function(model){
            return DB.basePost(FM_RequestUrl.task_del,model)   //删除运维任务
        },
        task_list:function(model){
            return DB.basePost(FM_RequestUrl.task_list,model)   //查看运维任务列表
        },
        taskUser_add:function(model){
            return DB.basePost(FM_RequestUrl.taskUser_add,model)   //分配执行任务的人员
        },
    }
}])
