var	gulp				=	require('gulp'),
		browserSync		=	require('browser-sync'),
		pug				=	require('gulp-pug'),
		notify			=	require("gulp-notify"),
		sass				=	require('gulp-sass'),
		rename			=	require('gulp-rename'),
		autoprefixer	=	require('gulp-autoprefixer'),
		cleanCSS			=	require('gulp-clean-css'),
		concat			=	require('gulp-concat'),
		uglify			=	require('gulp-uglify'),
		spritesmith		=	require('gulp.spritesmith');


// Setup localhost + automatic browser update
gulp.task('browser-sync', function() {
	browserSync({
		server: {baseDir: 'app'},
		notify: false
	});
});


// Compiling pug in html
gulp.task('pug', function() {
	return gulp.src(['src/pug/**/*.pug', '!src/pug/**/_*.pug'])
		.pipe(pug({pretty: '\t'}))
		.on("error", notify.onError())
		.pipe(gulp.dest('app'));
});


// Compiling sass in css with adding vendor prefixes and compressing css
gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.sass')
		.pipe(sass().on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});


// Collects all the scripts specified in gulp.src in one file - scripts.min.js,
// compresses and add it into app/js
gulp.task('scripts', function() {
	return gulp.src([
		// 'app/libs/jquery/dist/jquery.min.js',
		// 'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});


// Monitoring for changes in folders, launches appropriate tasks
gulp.task('watch', ['pug','sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('src/pug/**/*.pug', ['pug']);
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


// Default task
gulp.task('default', ['watch']);


// Building sprite
gulp.task('sprite', function() {
	var spriteData = gulp.src('app/img/icons/*.png')
	.pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.sass',
		imgPath: '/img/sprite.png',
		cssFormat: 'sass',
		padding: 4
	}));
	var imgStream = spriteData.img.pipe(gulp.dest('app/img/'));
	var cssStream = spriteData.css.pipe(gulp.dest('src/sass/'));
	return (imgStream, cssStream);
});
