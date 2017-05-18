
angular.module("FMsainuoyi").factory('operationTask',['$http','$q','DB',function($http,$q,DB){
    return {
        task_add:function(model){
            return DB.basePost(FM_RequestUrl.task_add,model)   //������ά����
        },
        task_edit:function(model){
            return DB.basePost(FM_RequestUrl.task_edit,model)   //�޸���ά����
        },
        task_del:function(model){
            return DB.basePost(FM_RequestUrl.task_del,model)   //ɾ����ά����
        },
        task_list:function(model){
            return DB.basePost(FM_RequestUrl.task_list,model)   //�鿴��ά�����б�
        },
        taskUser_add:function(model){
            return DB.basePost(FM_RequestUrl.taskUser_add,model)   //����ִ���������Ա
        },
    }
}])
