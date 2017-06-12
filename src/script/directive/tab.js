/**
 * Created by Administrator on 2017/3/9.
 */
angular.module('app').directive('appTab',function () {
     return{
        restrict:'A',
         replace:true,
         templateUrl:'view/template/tab.html'
     }
});