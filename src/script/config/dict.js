/**
 * Created by Administrator on 2017/3/9.
 */
angular.module('app').value('dict',{}).run(['$http',function ($http) {  //创建一个全局变量并初始化
    $http.get('data/city.json').then(function (resp) {
        $scope.city=resp.data;

    });
    $http.get('data/salary.json').then(function (resp) {
        $scope.salary=resp.data;

    });
    $http.get('data/scale.json').then(function (resp) {
        $scope.scale=resp.data;

    })
    
}]);