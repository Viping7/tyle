var gulp=require('gulp');
var sass=require('gulp-sass');
var browserSync=require('browser-sync').create();
var useref=require('gulp-useref');
var image=require('gulp-imagemin');
var uglify=require('gulp-uglify');
var gulpIf=require('gulp-if');
var cssnano=require('gulp-cssnano');
var jslint = require('gulp-jslint');
var stylish = require('jshint-stylish');
gulp.task('jslint', function () {
   return gulp.src(['app/assets/js/tyle.js'])
   .pipe(jslint({global: [ '$' ,'window','$(this)']}))
		   .pipe(jslint.reporter( 'stylish' ));
});
gulp.task('browser-sync',function(){
browserSync.init({
	server:{
		baseDir:'app/'
	}
});
});
function swallowError (error) {
	
	  // If you want details of the error in the console
	  console.log(error.toString())
	
	  this.emit('end')
	}
gulp.task('sass',function(){
	return gulp.src('app/assets/scss/*.scss')
				.pipe(sass())
				.on('error', swallowError)
				.pipe(gulp.dest('app/assets/css'))
				.pipe(browserSync.reload({stream:true}));
});
gulp.task('image', function(){
	return gulp.src('app/assets/img/**/*.+(png|jpg|gif|svg)')
				.pipe(image())
				.pipe(gulp.dest('docs/assets/img'));
})
gulp.task('useref',function(){
	return gulp.src('app/*.html').pipe(useref()).pipe(gulpIf('*.js',uglify())).pipe(gulpIf('*.css',cssnano())).pipe(gulp.dest('docs')).pipe(browserSync.reload({stream:true}));
});
gulp.task('jsbuild',function(){
	return gulp.src('app/assets/js/tyle.js').pipe(gulp.dest('dist/js'));
})
gulp.task('cssbuild',function(){
	return gulp.src('app/assets/css/tyle.css').pipe(gulp.dest('dist/css'));
})
gulp.task('build',['useref','image','jsbuild','cssbuild']);
gulp.task('watch',['browser-sync','sass'],function(){
gulp.watch('app/assets/scss/**/*.scss',['sass']);
gulp.watch('app/*.html',browserSync.reload);
gulp.watch('app/assets/js/*.js',browserSync.reload);
});
