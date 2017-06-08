
angular.module("FMsainuoyi").factory('repairWorkOrders',['$http','$q','DB',function($http,$q,DB){
    return {
        maintain_list:function(model){
            return DB.basePost(FM_RequestUrl.maintain_list,model)   //��ȡ���ϱ����б���ѯ
        },
        maintain_approve:function(model){
            return DB.basePost(FM_RequestUrl.maintain_approve,model)   //��˹���
        },
        maintain_assign:function(model){
            return DB.basePost(FM_RequestUrl.maintain_assign,model)   //�·�����
        },
        feedback_list:function(model){
            return DB.basePost(FM_RequestUrl.feedback_list,model)   //�鿴�û���Ϣ�����б�
        },
        loadFault_list:function(model){
            return DB.basePost(FM_RequestUrl.loadFault_list,model)   //��ѯt-box�������Ĺ���
        },
        loadFault_dispatch:function(model){
            return DB.basePost(FM_RequestUrl.loadFault_dispatch,model)   //��TBOX�ϱ��Ĺ���������������
        },
    }
}])
