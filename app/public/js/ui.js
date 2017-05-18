/**
 * Created by lily on 2016/9/20.
 */
angular.module('FMdearcc').service('ui',function($modal, $rootScope, ngDialog){
    this.info = function (Msg) {
        var scope = $rootScope.$new(true);
        scope.message = Msg;
        var dialog = ngDialog.open({
            templateUrl: '../app/view/common/part/info.html',
            closeByDocument: false,
            closeByEscape: false,
            scope: scope
        });
        setTimeout(function () {
            dialog.close();
        }, 2000);
    }
    this.success=function(Msg){
        var scope=$rootScope.$new();
        scope.message=Msg
        var dialog=ngDialog.open({
            templateUrl:'../app/view/common/part/success.html',
            scope: scope
        });
        setTimeout(function(){
            dialog.close()
        },2000)
    }

})