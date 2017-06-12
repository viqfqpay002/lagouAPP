/**
 * Created by Administrator on 2017/2/22.
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var app = {
    srcPath:'src/',
    devPath:'build/',
    prdPath:'dist/'
};
gulp.task('lib',function () {
    gulp.src('bower_components/**/*')
        .pipe(gulp.dest(app.devPath+'vendor'))
        .pipe(gulp.dest(app.prdPath+'vendor'))
        .pipe($.connect.reload()) ;//构建完成后自动刷新浏览器，实时更新

});
gulp.task('html',function () {
    gulp.src(app.srcPath+'**/*.html')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload()) ;//构建完成后自动刷新浏览器，实时更新

});
//假数据测试用的，有服务器的情况下可以不用
gulp.task('json',function () {
    gulp.src(app.srcPath+'data/**/*.json')
        .pipe(gulp.dest(app.devPath+'data'))
        .pipe(gulp.dest(app.prdPath+'data'))
        .pipe($.connect.reload()) ;//构建完成后自动刷新浏览器，实时更新

});
//css
gulp.task('less',function () {
    gulp.src(app.srcPath+'style/index.less')
        .pipe($.plumber())   //编译发生错误时不会中断线程只抛出错误（npm i --save-dev gulp-plumber）
        .pipe($.less())
        .pipe(gulp.dest(app.devPath+'css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath+'css'))
        .pipe($.connect.reload()); //构建完成后自动刷新浏览器，实时更新

});
//js
gulp.task('js',function () {
    gulp.src(app.srcPath+'script/**/*.js')
        .pipe($.plumber())　　//编译发生错误时不会中断线程只抛出错误 （npm i --save-dev gulp-plumber）
        .pipe($.concat('index.js'))  //合并
        .pipe(gulp.dest(app.devPath+'js'))
        .pipe($.uglify())  //压缩
        .pipe(gulp.dest(app.prdPath+'js'))
        .pipe($.connect.reload()) ;//构建完成后自动刷新浏览器，实时更新

});
//image
 gulp.task('image',function () {
     gulp.src(app.srcPath+'image/**/*')
         .pipe(gulp.dest(app.devPath+'image'))
         .pipe($.imagemin())   //压缩图片
         .pipe(gulp.dest(app.prdPath+'image'))
         .pipe($.connect.reload()); //构建完成后自动刷新浏览器，实时更新
 });
//写个总任务进行合并打包
gulp.task('build',['image','js','less','lib','html','json']);
//每次发布前要把旧的文件进行清楚
gulp.task('clean',function () {
    gulp.src([app.devPath,app.prdPath])
        .pipe($.clean())
});
//服务器
gulp.task('serve',['build'],function () {
    $.connect.server({
        root:[app.devPath],
        livereload:true,
        port:1234
    });
    open('http://localhost:1234'); //启动进入的服务端口
    //时实监控文件动态及时更新，当文件改变时会自动构建代码
    gulp.watch(app.srcPath+'script/**/*.js',['js']);
    gulp.watch(app.srcPath+'bower_components/**/*',['lib']);
    gulp.watch(app.srcPath+'**/*.html',['html']);
    gulp.watch(app.srcPath+'data/**/*.json',['json']);
    gulp.watch(app.srcPath+'style/**/*.less',['less']);
    gulp.watch(app.srcPath+'script/**/*.js',['js']);
    gulp.watch(app.srcPath+'image/**/*',['image']);


});
gulp.task('default',['serve']); //启动时直接启动服务器


