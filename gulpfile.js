var gulp = require('gulp');
var sass =require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin= require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');
var cache = require('gulp-cache');
	gulp.task('hello',function(){
		console.log('hello');
		});
	gulp.task('sass',function(){
		return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream:true
			}))
		});
	gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  gulp.watch('app/**/*.*').on('change',browserSync.reload);
});
	gulp.task('browserSync',function(){
		browserSync.init({

			server:{
				baseDir:'dist'
			},
			})
		});





	gulp.task('useref',function(){
		return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js',uglify()))
		.pipe(gulpIf('*.css',cssnano()))
		.pipe(gulp.dest('dist'))
		});
	gulp.task('imagemin',function(){
		return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(imagemin({
			interlaced:true
			}))
		.pipe(gulp.dest('dist/images'))
		});
	gulp.task('clean:dist',function(){
		return del.sync('dist');
		});
	gulp.task('cache:clear',function(callback){
		return cache.clearAll(callback)
		});
	gulp.task('build', function (callback) {
  		runSequence('clean:dist', 'cache:clear',
    ['sass','useref','imagemin'],
    callback
  )
});
	gulp.task('default', function (callback) {
  runSequence(['sass','browserSync','watch'],
    callback
  )
})