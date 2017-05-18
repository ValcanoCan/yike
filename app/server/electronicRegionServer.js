
angular.module("FMsainuoyi").factory('electronicRegion',['$http','$q','DB',function($http,$q,DB){
    return {
        fence_getCitys:function(model){
            return DB.basePost(FM_RequestUrl.fence_getCitys,model)   //获取车辆
        },
        fence_add:function(model){
            return DB.basePost(FM_RequestUrl.fence_add,model)   //新建电子围栏
        },
        fence_find:function(model){
            return DB.basePost(FM_RequestUrl.fence_find,model)   //查看电子围栏
        },
        fence_del:function(model){
            return DB.basePost(FM_RequestUrl.fence_del,model)   //删除电子围栏
        },
        fence_edit:function(model){
            return DB.basePost(FM_RequestUrl.fence_edit,model)   //修改电子围栏
        },
        fenceUser_add:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_add,model)   //创建电子围栏中的人员
        },
        fenceUser_list:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_list,model)   //查看电子围栏中的人员
        },
        fenceUser_edit:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_edit,model)   //编辑电子围栏中的人员
        },
        fenceUser_del:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_del,model)   //删除电子围栏中的人员
        },
        fenceVehicle_add:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_add,model)   //添加电子围栏中的车辆
        },
        fenceVehicle_list:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_list,model)   //查看电子围栏中的车辆
        },
        fenceVehicle_edit:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_edit,model)   //编辑电子围栏中的车辆
        },
        fenceVehicle_del:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_del,model)   //删除电子围栏中的车辆
        },
        fenceCity_list:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_list,model)   //查看城市
        },
        fenceCity_add:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_add,model)   //添加城市
        },
        fenceCity_edit:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_edit,model)   //修改城市
        },
        fenceCity_del:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_del,model)   //删除城市
        },
        fenceCity_districtsList:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_districtsList,model)   //查看区县地级市
        },
        point_add:function(model){
            return DB.basePost(FM_RequestUrl.point_add,model)   //创建还车点
        },
        point_del:function(model){
            return DB.basePost(FM_RequestUrl.point_del,model)   //删除还车点
        },
        point_list:function(model){
            return DB.basePost(FM_RequestUrl.point_list,model)   //查看还车点
        },
    }
}])
