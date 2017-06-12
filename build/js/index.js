/**
 * Created by Administrator on 2017/2/23.
 */
angular.module('app',['ui.router','ngCookies','validation']);
/**
 * Created by Administrator on 2017/3/9.
 */
angular.module('app').value('dict',{}).run(['dict','$http',function (dict,$http) {  //创建一个全局变量并初始化
    $http.get('data/city.json').then(function (resp) {
        dict.city=resp.data;
    });
    $http.get('data/salary.json').then(function (resp) {
        dict.salary=resp.data;
    });
    $http.get('data/scale.json').then(function (resp) {
        dict.scale=resp.data;
    })
    
}]);
/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
//装饰器服务
angular.module('app').config(['$provide',function ($provide) {
    $provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {  //$delegate替代$http服务
        $delegate.post = function (url,data,config) {   //post请求三个参数
            var def = $q.defer();     //异步延迟对象
            $delegate.get(url).success(function (resp) {
               def.resolve(resp)
            }).error(function (error) {
                def.reject(error)
            });
            return{
                success:function (cb) {
                    def.promise.then(cb);
                },
                error:function (cb) {
                    def.promise.then(null,cb);
                }
            };
            
        };
        return $delegate;

        
    }])
    
}]);
/**
 * Created by Administrator on 2017/2/23.
 */
angular.module('app').config(['$stateProvider','$urlRouterProvider',
    function ($stateProvider,$urlRouterProvider) {
   $stateProvider.state('main',{    //首页
       url:'/main',
       templateUrl:'view/main.html',
       controller:'mainCtrl'
   }).state('postion',{
       url:'/postion/:id',
       templateUrl:'view/postion.html',   //职位详情页面
       controller:'posCtrl'
   }).state('company',{
       url:'/company/:id',
       templateUrl:'view/company.html',    //公司详情页面
       controller:'companyCtrl'
   }).state('search',{                   //搜索
       url:'/search',
       templateUrl:'view/search.html',
       controller:'searchCtrl'
   }).state('login',{
       url:'/login',
       templateUrl:'view/login.html',
       controller:'loginCtrl'
   }).state('register',{
       url:'/register',
       templateUrl:'view/register.html',
       controller:'registerCtrl'
   }).state('me',{
       url:'/me',
       templateUrl:'view/me.html',
       controller:'meCtrl'
   }).state('favorite',{
       url:'/favorite',
       templateUrl:'view/favorite.html',
       controller:'favoriteCtrl'
   }).state('post',{
       url:'/post',
       templateUrl:'view/post.html',
       controller:'postCtrl'
   });
   $urlRouterProvider.otherwise('main')

}]);
/**
 * Created by Administrator on 2017/3/10.
 */
'use strict';
angular.module('app').config(['$validationProvider',function ($validationProvider) {
    //校验表单元素的值是否符合要求
    var expression={
        phone: /^1[\d]{10}$/,
        password: function (value) {
            var str = value+'';
            return str.length > 5;

        },
        required:function (value) {
            return !!value;
        }
    };
    //提示错误信息
    var defaultMsg={
        phone:{
            success:'',
            error:'必须是11位手机号码'
        },
        password:{
            success:'',
            error:'长度至少6位'
        },
        required:{
            success:'',
            error:'不能为空'
        }

    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);
/**
 * Created by Administrator on 2017/3/6.
 */
'use strict';
angular.module('app').controller('companyCtrl',['$http','$state','$scope',function ($http,$state,$scope) {
    $http.get("data/company.json?id='+$state.params.id'").then(function (resp) {
         $scope.company=resp.data
    })
}]);
/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').controller('favoriteCtrl',['$http','$scope',function ($http,$scope) {
    $http.get('data/myfavorite.json').then(function (resp) {
        $scope.positionList=resp.data;
        
    })

}]);
/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').controller('loginCtrl',['$http','cache','$state','$scope',function ($http,cache,$state,$scope) {
    $scope.submit=function () {
        //无后台服务器则使用装饰器来使用post
     /*   $http.post('data/login.json').then(function (resp) {
      cache.put('id',resp.data.id);
      cache.put('name',resp.data.name);
      cache.put('image',resp.data.image);
      $state.go('main');
        });*/
        $http.get('data/login.json',$scope.user).then(function (resp) {
            //将json数据先进行缓存再跳转
            cache.put('id',resp.data.id);
            cache.put('name',resp.data.name);
            cache.put('image',resp.data.image);
            $state.go('main');
        })

    }
    
}]);
/**
 * Created by Administrator on 2017/2/23.
 */
'use strict';
angular.module('app').controller('mainCtrl',['$http','$scope',function ($http,$scope) {
     $http.get('/data/positionList.json').then(function (resp) {
        $scope.list = resp.data;

    });


    /*$scope.list=[{
      id:'1',
      name:'销售',
      imgSrc:'image/company-3.png',
      companyName:'千度',
      city:'上海',
      industry:'互联网',
      time:'2016-06-01 11:05'
  },{
      id:'2',
      name:'销售',
      imgSrc:'image/company-1.png',
      companyName:'千度',
      city:'上海',
      industry:'互联网',
      time:'2016-06-01 11:05'
  },{
      id:'3',
      name:'销售',
      imgSrc:'image/company-2.png',
      companyName:'千度',
      city:'上海',
      industry:'互联网',
      time:'2016-06-01 11:05'
  }]*/

}]);

/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').controller('meCtrl',['$http','$state','cache','$scope',function ($http,$state,cache,$scope) {
   if(cache.get('name')){
       $scope.name = cache.get('name');
       $scope.image = cache.get('image')
   }
   $scope.logout = function () {
       cache.remove('id');
       cache.remove('name');
       cache.remove('image');
       $state.go('main')
       
   };
   $scope.text='请先登录'

}]);
/**
 * Created by Administrator on 2017/3/6.
 */
'use strict';
angular.module('app').controller('posCtrl',['$log','$q','$http','$state','$scope','cache',function ($log,$q,$http,$state,$scope,cache) {

    //因路由接收了一个id参数，所以查询时要带上id参数，通过$state服务来传递参数
    //根据职位信息的companyID来查询所属公司，所以加入异步加载服务$q
    $scope.isLogin = !!cache.get('name');
    $scope.message=$scope.isLogin?'投个简历':'去登陆';
   /* function getPosition() {
        var def = $q.defer(); //申明延迟加载对象*/
        $http.get("/data/position.json?id='+$state.params.id'").then(function (resp) {
            $scope.position = resp.data;
            if(resp.data.posted){
                $scope.message="已投递"
            }
            $http.get("/data/company.json?id='+$state.params.id'").then(function (res) {
                $scope.company = res.data;
            });
            /*    def.resolve(resp.data);  //加载成功

             }).error(function (err) {
             def.reject(err);   //失败提示错误

             });
             return def.promise;    //返回promise对象


             }
             function getCompany(id) {
             $http.get('data/company.json?id=' + id).then(function (resp) {
             $scope.company = resp;

             })
             }
             getPosition().if(function (obj) {
             getCompany(obj.companyId)

             })*/
        });
        //投递简历
      $scope.go = function () {
          if( $scope.message!=="已投递"){
               if($scope.isLogin){
                   $http.get('data/handle.json',{
                       id:$scope.position.id
                   }).then(function (resp) {
                       $log.info(resp.data);
                       $scope.message="已投递"
                   })
               }else {
                   $state.go('login')
               }
          }
      }

}]);
/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').controller('postCtrl',['$http','$scope',function ($http,$scope) {
   $scope.tabList = [{
       id:'all',
       name:'全部'
       },{
       id:'pass',
       name:'邀请面试'
   },{
       id:'fail',
       name:'不合适'
   }];
    //查询有没登录由后端判定,将数据填充
  $http.get('data/myPost.json').then(function (resp) {
    $scope.positionList =resp.data
  });
    //过滤状态
     $scope.filerObj = {};
    $scope.tclick = function (id,name) {
        switch (id){
            case 'all':
                delete $scope.filerObj.state;
                break;
            case 'pass':
                $scope.filerObj.state='1';
                break;
            case'fail'  :
                $scope.filerObj.state='-1';
                break;
            default:
        }


        
    }
}]);
/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').controller('registerCtrl',['$interval','$http','$state','$scope',function ($interval,$http,$state,$scope) {
   $scope.submit = function () {
       //因无后台服务器，只能使用装饰器提交
     /*$http.post('data/regist.json',$scope.user).then(function (resp) {
         $state.go('login');

     })*/
     $http.get('data/regist.json',$scope.user).then(function (resp) {
         alert('注册成功，请登录');
         $state.go('login');

     })

   };
   // 发送短信操作，点击发送倒计时
    var count = 60;
   $scope.sendok = function () {
        $http.get('/data/code.json').then(function (resp) {
            if(resp){
                count=60;
                $scope.time='60s';
                var interval =  $interval(function () {
                if(count<=0){
                    $interval.cancel(interval);   //清除定时器
                    $scope.time='';    //终止
                }else {
                        count--;
                        $scope.time = count+'s';
                }
                },1000)

            }

        })
       
   }
}]);
/**
 * Created by Administrator on 2017/3/8.
 */
'use strict';
//定义的全局变量引入使用依赖注入方式
angular.module('app').controller('searchCtrl',['dict','$http','$scope',function (dict,$http,$scope) {
    $scope.name="";
    $scope.search = function () {
        $http.get('data/positionList.json? name='+$scope.name).then(function (resp) {
            $scope.positionList = resp.data;
        })
    };
    $scope.search();
    $scope.sheet={};  //申明人数列表对象
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
    $scope.filerObj={};
    var tabId='';
    $scope.tclick=function (id,name) {  //点击顶部菜单栏，传入tabList对象的id,name
        tabId=id;  //将id的值赋值给tabId
        $scope.sheet.list = dict[id];  //把tabList的id值赋值给人数列表
        $scope.sheet.visible = true; //显示底部的人数列表
    };
    $scope.sClick = function (id,name) {    //当点击遮罩底部的筛选条件时，传入tabList对象中的id,name
        if(id){
            //如果id有值，遍历tabList对象
            angular.forEach($scope.tabList,function (item) {
                //如果列表的Id与tabid的值匹配
                if(item.id ===tabId){
                    //将当前选中的列表值显示在tab上
                    item.name = name;
                }
            });
            $scope.filerObj[tabId+'Id']=id;// 将当前的id属性赋值给 josn值中的id进行过滤
        }else {
            delete $scope.filerObj[tabId+'Id'];  //不进行筛选时要删除过滤条件
            angular.forEach($scope.tabList,function (item) {
                if(item.id===tabId){
                    //做条件判断
                    switch (item.id){
                        case 'city':
                            item.name="城市";
                            break;
                        case 'salary':
                            item.name="薪水";
                            break;
                        case 'scale':
                            item.name="公司规模";
                            break;
                        default:
                    }
                }
                
            })
        }
        
    }
}]);
/**
 * Created by Administrator on 2017/3/6.
 */
'use strict';
angular.module('app').directive('appCompany',[function () {
   return{
       restrict:'A',
       replace:true,
       templateUrl:'view/template/company.html',
       scope:{
           com:'='
       }
   }

}]);
/**
 * Created by Administrator on 2017/2/27.
 */
'use strict';
angular.module('app').directive('appFoot',[function () {
    return{
        restrict:'A',
        replace:true,
        templateUrl:'view/template/foot.html'
    }

}]);
/**
 * Created by Administrator on 2017/2/23.
 */
'use strlct';
angular.module('app').directive('appHead',['cache',function (cache) {
    return{
        restrict:'A',   //属性方式
        replace:true,
        templateUrl:'view/template/head.html',
        link:function ($scope) {
            $scope.name=cache.get('name')||'';

        }
    }
}]);
'use strict';
angular.module('app').directive('appHeadBar',[function () {
   return{
       restrict:'A',
       replace:true,
       templateUrl:'view/template/headBar.html',
       scope:{
           text:'@'            //只传字符串,这里是只传list页面顶部的title
       },
       link:function (scope) {
           scope.back=function () {
               window.history.back()
           }
       }
   }
}]);
/**
 * Created by Administrator on 2017/3/6.
 */
'use strict';
angular.module('app').directive('appPositionClass',[function () {
    return{
          restrict:'A',
          replace:true,
          scope:{
              com:'=',
          },
          templateUrl:'view/template/positionClass.html',
        link:function ($scope) {  //选项卡指令
              $scope.showPositionList = function (inx) {
                  //把com.positionClass索引值对应的内容赋值给positionList
                  $scope.positionList = $scope.com.positionClass[inx].positionList;
                  //把索引值赋值给 isActive
                  $scope.isActive = inx;
              };
              //监听scope对象上的属性，当属性发生变化时调用函数，尽量少用watch，用多了会影响性能
            //监听有三个参数，（改变后的值，改变前的值，作用域对象）
              $scope.$watch('com',function (newVal,oldVal,scope) {
                  if(newVal){
                      $scope.showPositionList(0);
                  }

              })


        }

    }
}]);
/**
 * Created by Administrator on 2017/3/6.
 */
'use strict';
angular.module('app').directive('appPositionInfo',['$http',function ($http) {
   return{
       restrict:"A",
       replace:true,
       templateUrl:'view/template/posInfo.html',
       scope:{
           isActive:"=",
           isLogin:'=',
           pos:'='
       },
       link:function ($scope) {

           $scope.$watch('pos',function (newVal) {
               if(newVal) {
                   $scope.pos.select = $scope.pos.select || false;
                   $scope.imagePath = $scope.pos.select? '../../image/star-active.png' : '../../image/star.png';
               }
           });

           $scope.favorite = function () {
                $http.get('data/favorite.json',{
                    id:$scope.pos.id,
                    select:!$scope.pos.select
                }).then(function () {
                    $scope.pos.select=!$scope.pos.select;
                    $scope.imagePath=$scope.pos.select?'../../image/star-active.png':'../../image/star.png';

                })


                
            }
       }
   }
}]);
/**
 * Created by Administrator on 2017/2/27.
 */
'use strict';
angular.module('app').directive('appPositionList',['$http',function ($http) {
  return{
         restrict:'A',
         replace:true,
         templateUrl:'view/template/postionList.html',
         scope:{
             data:'=',
             filerObj:'=',
             isFavorite:'='
         },

         link:function ($scope) {
          //判断五角星点选
          $scope.select =function (item) {
              //将数据传入后台，是用post
              $http.get('data/favorite.json',{
                  id:item.id,
                  select:!item.select
          }).then(function (item) {
                 item.select=!item.select;
              });
          }
         }
  }

}]);
/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').directive('appSheet',function () {
     return{
         restrice:'A',
         replace:true,
         scope:{
             list:'=',
             visible:'=',
             select:'&'
         },
         templateUrl:'view/template/sheet.html'
     }

});
/**
 * Created by Administrator on 2017/3/9.
 */
'use strict';
angular.module('app').directive('appTab',function () {
     return{
        restrict:'A',
         replace:true,
         templateUrl:'view/template/tab.html',
         scope:{
            list:'=',
            tabClick:"&"
         },
         link:function ($scope) {
            $scope.click = function (tab) {
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
                
            }

             
         }
     }
});
/**
 * Created by Administrator on 2017/3/9.
 */
//封闭一个过滤器
angular.module('app').filter('filerByObj',[function () {
    //返回（数组，过滤对象）
    return function (list,obj) {
        var result=[]; //申明新数组
        angular.forEach(list,function (item) {
            var  isEquels = true;
            for(var e in obj){
                //如果列表数据的值，不等于过滤对象的值，则为 false
                if(item[e]!==obj[e]){
                    isEquels = false;
                }
            }
            //如果两个值是相等的，就添加入新的数组结束循环
            if(isEquels){
                result.push(item)
            }
        });
        return result;
    }
    
}])
/**
 * Created by Administrator on 2017/3/8.
 */
angular.module('app').service('cache',['$cookies',function ($cookies) {
    this.put = function (key,value) {
        $cookies.put(key,value);      //放入键，值
    };
    this.get = function (key) {
       return $cookies.get(key);     //返回取出的值
    };
    this.remove = function (key) {
        $cookies.remove(key);　　　　　　// 删除
    }

}]);
/*
angular.module('app').factory('cache',['$cookies',function ($cookies) {
    return{
       put:function (key,value) {
           $cookies.put(key.value);
       },
       get:function (key) {
           $cookies.get(key)
       },
        remove:function (key) {
           $cookies.remove(key)
        }

    }
    
}]);*/
