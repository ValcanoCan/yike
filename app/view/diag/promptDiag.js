angular.module("FMsainuoyi").service('prompt',['$scope','ngDialog',function($scope,ngDialog){
    return {
        info:ngDialog.openConfirm({
            templateUrl: "view/diag/promptDiag.html",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        })
    }
}])
