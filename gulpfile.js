var gulp				= require('gulp'),
	replace 			= require('gulp-replace'),
	pug 					= require('gulp-pug'),
	sass 					= require('gulp-sass'),
	bourbon 			= require('node-bourbon'),
	autoprefixer 	= require('gulp-autoprefixer'),
	concat				= require('gulp-concat'),
	svgmin 				= require('gulp-svgmin'),
	cheerio 			= require('gulp-cheerio'),
	svgSprite 		= require('gulp-svg-sprite'),
	browserSync 	= require('browser-sync').create(),
	devip 				= require('dev-ip'),
	tinypng				= require('gulp-tinypng-nokey');

var paths = {
	app: {
		src: './app_dev',
		watch: './app_dev/**/*.*'
	},
	build: {
		dest: './app'
	},
	pug: {
		src: 'dev/pug/index.pug',
		watch: ['dev/pug/**/*.*'],
		dest: './app_dev/'
	},
	sass: {
		src: 'dev/sass/**/*.sass',
		dest: './app_dev/css/'	
	},
	js: {
		src: 'dev/js/*.js',
		dest: './app_dev/js/'	
	},
	lib: {
		js: {
			src: ['dev/libs/js/*.js',
						'node_modules/magnific-popup/dist/jquery.magnific-popup.js'],
			dest: './app_dev/js/'
		},
		css: {
			src: ['dev/libs/css/*.css',
						'node_modules/magnific-popup/dist/magnific-popup.css'],
			dest: './app_dev/css/'
		}
	},
	img: {
		src: 'dev/img/**/*.{png,jpg,gif}',
		dest: './app_dev/img/'
	},
	svg: {
		src: 'dev/svg/*.svg',
		dest: './app_dev/img/svg/',
		sprite: {
			src: 'dev/svg/sprite/**/*.svg',
			dest: './app_dev/img/svg/',
			filename: 'sprite.svg'
		}
	},
	font: {
		src: 'dev/fonts/**/*.*',
		dest: './app_dev/fonts/'
	}
};

gulp.task('svg-sprite', function () {
	return gulp.src(paths.svg.sprite.src)
	// minify svg
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	// remove all fill, style and stroke declarations in out shapes
	.pipe(cheerio({
		run: function($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
			$('[data-name]').removeAttr('data-name');
			$('title').remove('title');
		},
		parserOptions: {
			xmlMode: true
		}
	}))
	// cheerio plugin create unnecessary string '&gt;', so replace it.
	.pipe(replace('&gt;', '>'))
	// build svg sprite
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: paths.svg.sprite.filename,
				dest: ''
			}
		}
	}))
	.pipe(gulp.dest(paths.svg.sprite.dest));
});

gulp.task('svg-sprite-watch', gulp.series('svg-sprite', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('svg', function () {
	return gulp.src(paths.svg.src)
	// minify svg
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	.pipe(gulp.dest(paths.svg.dest));
});

gulp.task('svg-watch', gulp.series('svg', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('img', function () {
	return gulp.src(paths.img.src)
//	.pipe(tinypng())
	.pipe(gulp.dest(paths.img.dest));
});

gulp.task('img-watch', gulp.series('img', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('js', function () {
	return gulp.src(paths.js.src)
	.pipe(gulp.dest(paths.js.dest));
});

gulp.task('js-watch', gulp.series('js', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('lib-js', function () {
	return gulp.src(paths.lib.js.src)
	.pipe(concat('libs.min.js'))
	.pipe(gulp.dest(paths.lib.js.dest));
});

gulp.task('lib-css', function () {
	return gulp.src(paths.lib.css.src)
	.pipe(concat('libs.min.css'))
	.pipe(gulp.dest(paths.lib.css.dest));
});

gulp.task('lib-watch', gulp.series( gulp.parallel('lib-js', 'lib-css'), function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('font', function () {
	return gulp.src(paths.font.src)
	.pipe(gulp.dest(paths.font.dest));
});

gulp.task('font-watch', gulp.series('font', function (callback) {
		browserSync.reload();
		callback();
}));

gulp.task('pug', function () {
	return gulp.src(paths.pug.src)
	.pipe(pug({
			pretty: true
	}))
	.pipe(gulp.dest(paths.pug.dest))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function () {
	return gulp.src(paths.sass.src)
	.pipe(sass({
			baseDir: './app_dev',
			outputStyle: 'expanded',
			includePaths: bourbon.includePaths
	}))
	.pipe(autoprefixer())
	.pipe(gulp.dest(paths.sass.dest))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', gulp.series(
	gulp.parallel('pug', 'sass', 'img', 'js', 'lib-js', 'lib-css', 'svg', 'svg-sprite', 'font'),	
	function() {
		browserSync.init({
				server: {
						baseDir: paths.app.src
				},
				host: devip(),
				notify: false,
				ui: false
		});
	}
));

gulp.task('watch', function () {
	gulp.watch(paths.pug.watch, 			gulp.series('pug'));
	gulp.watch(paths.sass.src, 				gulp.series('sass'));
	gulp.watch(paths.img.src, 				gulp.series('img-watch'));
	gulp.watch(paths.js.src, 					gulp.series('js-watch'));
	gulp.watch([paths.lib.js.src,
							paths.lib.css.src],		gulp.series('lib-watch'));
	gulp.watch(paths.svg.sprite.src, 	gulp.series('svg-sprite-watch'));
	gulp.watch(paths.svg.src, 				gulp.series('svg-watch'));
	gulp.watch(paths.font.src, 				gulp.series('font-watch'));
});


gulp.task('build:img', function () {
	return gulp.src(paths.img.src)
	.pipe(tinypng())
	.pipe(gulp.dest(paths.build.dest));
});

//
gulp.task('default', gulp.parallel('browser-sync', 'watch'));
