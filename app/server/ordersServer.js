
angular.module("FMsainuoyi").factory('ordersManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        order_list:function(model){
            return DB.basePost(FM_RequestUrl.order_list,model)   //�鿴������Ϣ
        },
        order_finish:function(model){
            return DB.basePost(FM_RequestUrl.order_finish,model)   //�鿴������Ϣ
        },
        order_share:function(model){
            return DB.basePost(FM_RequestUrl.order_share,model)   //��������
        },
        charging_sub:function(model){
            return DB.basePost(FM_RequestUrl.charging_sub,model)   //�۷ѹ���
        },
        deposit_list:function(model){
            return DB.basePost(FM_RequestUrl.deposit_list,model)   //Ѻ�����
        },
        return_deposit_refList:function(model){
            return DB.basePost(FM_RequestUrl.return_deposit_refList,model)  //��Ѻ���б�
        },
        return_deposit_apply:function(model){
            return DB.basePost(FM_RequestUrl.return_deposit_apply,model)  //�����Ѻ��
        },
        return_deposit_refund:function(model){
            return DB.basePost(FM_RequestUrl.return_deposit_refund,model)   //��Ѻ��
        },
        order_currList:function(model){
            return DB.basePost(FM_RequestUrl.order_currList,model)  //�û���ֵ��¼
        },
        activity_add:function(model){
            return DB.basePost(FM_RequestUrl.activity_add,model)  //��ӻ
        },
        activity_list:function(model){
            return DB.basePost(FM_RequestUrl.activity_list,model)  //��б�
        },
        activity_close:function(model){
            return DB.basePost(FM_RequestUrl.activity_close,model)  //�رջ
        }
    }
}])

