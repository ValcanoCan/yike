angular.module("FMsainuoyi").factory('userManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        user_list:function(model){
            return DB.basePost(FM_RequestUrl.user_list,model)//�鿴�û�������Ϣ
        },
        user_deposit_currList:function(model){
            return DB.basePost(FM_RequestUrl.user_deposit_currList,model)//�鿴�����û�Ѻ��仯��¼
        },
        user_recharge_currList:function(model){
            return DB.basePost(FM_RequestUrl.user_recharge_currList,model)//�鿴�����û���ֵ��¼
        },
        share_add:function(model){
            return DB.basePost(FM_RequestUrl.share_add,model)//��ӷ���
        },
        share_list:function(model){
            return DB.basePost(FM_RequestUrl.share_list,model)//�����б�
        },
        share_edit:function(model){
            return DB.basePost(FM_RequestUrl.share_edit,model)//�޸ķ���
        },
        share_del:function(model){
            return DB.basePost(FM_RequestUrl.share_del,model)//ɾ������
        },
        share_isUseing:function(model){
            return DB.basePost(FM_RequestUrl.share_isUseing,model)//��������
        },
    }
}])
