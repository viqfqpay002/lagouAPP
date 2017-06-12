/**
 * Created by Administrator on 2017/3/8.
 */
//定义的全局变量引入使用依赖注入方式
angular.module('app').controller('searchCtrl',['dict','$http','$scope',function (dict,$http,$scope) {
    $scope.name="";
    $scope.search = function () {
        $http.get('data/positionList.json? name='+$scope.name).then(function (resp) {
            $scope.positionList = resp.data;
        })
    };
    $scope.search();
    $scope.tabList = [{
        id:'city',
        name:'城市'
    },{
        id:'salary',
        name:'薪水'
    },{
        id:'scale',
        name:'公司规模'
    }];
    $scope.tclick=function (id,name) {
        console.log(id, name)
    }


}]);