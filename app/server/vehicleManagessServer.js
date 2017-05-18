
angular.module("FMsainuoyi").factory('vehicleManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        vehicle_add:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_add,model)   //注册新车辆
        },
        vehicle_list:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_list,model)   //查看车辆列表
        },
        vehicle_del:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_del,model)   //删除车辆
        },
        vehicle_edit:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_edit,model)   //车辆信息修改
        },
        vehicle_reg:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_reg,model)   //注册车辆到IOT
        },
        vehicle_find:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_find,model)   //查看车辆详细信息
        },
        battery_list:function(model){
            return DB.basePost(FM_RequestUrl.battery_list,model)   //电池信息列表
        }
    }
}])
