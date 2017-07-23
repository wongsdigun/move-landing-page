var gulp  = require('gulp'),
		gutil = require('gulp-util'),
		sass = require('gulp-ruby-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cssnano = require('gulp-cssnano'),
		notify = require('gulp-notify'),
		sourcemaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		plumber = require('gulp-plumber'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload;

gulp.task('template', function() {
	return gutil.log('Gulp is running in Meridian.Id Boilerplate!');
});

gulp.task('style', function() {
	var onError = function(err) {
	  notify.onError({
		title:    "Gulp Sass",
		subtitle: "Yo! What've you done now?!",
		message:  "Error: <%= error.message %>",
		sound:    "Beep"
	  })(err);
	  this.emit('end');
	};

	return sass ('resources/scss/app.scss')
	.pipe(plumber({errorHandler: onError}))
	.pipe(autoprefixer()) // Passes it through a gulp-autoprefixer task
	//.pipe(cssnano()) //DIPAKE KALO UDAH MAU PRODUKSI ==========================================================
	.pipe(reload({ stream:true }))
	.pipe(gulp.dest('assets/css'))
});
gulp.task('html', function(){
	gulp.src('*.html')
	.pipe(reload({stream:true}))
})
gulp.task('build-js', function() {
  return gulp.src('resources/js/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/js'));
});
gulp.task('serve', function() {
	browserSync.init({
		proxy : 'http://localhost/move',
	});
	gulp.watch('resources/scss/**/*.scss', ['style']);
	gulp.watch('resources/js/*.js', ['build-js']);
	gulp.watch('*.html', ['html'])
	// gulp.watch(['css/*.css', 'js/*.js'], {cwd: 'assets'}, reload);
	gulp.watch(['js/*.js'], {cwd: 'assets'}, reload);
});

gulp.task('default', ['serve'], function() {
	gulp.start('template', 'style', 'build-js');
});
