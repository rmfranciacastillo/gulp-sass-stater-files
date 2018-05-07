/************************************
 *									*
 *		GULP SASS CONFIG V1.0.0		*
 *									*
 ************************************/ 
const gulp	 = require('gulp'); 
const args	 = require('yargs').argv;
const config = require('./gulp.config')();
const del    = require('del');
const browserSync  = require('browser-sync');
const devip = require('dev-ip');

const $ = require('gulp-load-plugins')({ lazy:true });

/******************************
 *	    	Tasks 
 ******************************/

//clean dist
gulp.task('clean:dist', () => {
	log('Cleaning Distribution folder');
	return del.sync('dist');
});

//clean Sass-generated css 
gulp.task('clean:sass', () => {
	log('Cleaning generated css');
	return del.sync(config.tempSass);
});

//clean temp
gulp.task('clean:temp', () => {
	log('Cleaning all temp files');
	return del.sync(config.temp);
});

// Compiling SASS 
// Because of the SMACSS structure we will only be compiling index.sass 
gulp.task('sass', ['clean:sass'], () => {
	log('Generating CSS in ' + config.tempSass);

	return gulp.src(config.sass)
		.pipe($.sass().on('error', $.sass.logError))
		.pipe(gulp.dest(config.tempSass))
		.pipe(browserSync.stream({
			match: '**/*.css'
		}));
});

// Injecting sources from custom css
gulp.task('inject:css', ['sass'], () => {
	log('Injecting css from custom folders to templates'); 
	log('Injecting from: ' + config.tempSass);

  	var sources = gulp.src(['./.tmp/**/*.css'], {read: true});

	return gulp
		.src([config.temp + '*.html']) 
		.pipe($.inject(sources,
			{
               ignorePath: '.tmp/',
               addRootSlash: false
            }
		))
		.pipe(gulp.dest(function (file){ return file.base; }));
});

//scripts
gulp.task('scripts', ['vet','lint'] , () => {
	return gulp.src(config.alljs)
		.pipe($.uglify())
		.pipe(gulp.dest(config.temp));
});

// Testing Scripts
gulp.task('vet', () => {
	log('Analyzing my source with JSHint ');

	gulp.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))  //gulp vet --verbose
		.pipe($.jshint())
		.pipe($.jshint.reporter(
			'jshint-stylish', 
			{ 
				verbose: true 
			}))
		.pipe($.jshint.reporter('fail'));
});

// lint scripts
gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths. 
	// So, it's best to have gulp ignore the directory as well. 
	// Also, Be sure to return the stream from the task; 
	// Otherwise, the task may end before the stream has finished. 
	return gulp.src(config.alljs)
		// eslint() attaches the lint output to the "eslint" property 
		// of the file object so it can be used by other modules. 
		.pipe($.eslint())
		// eslint.format() outputs the lint results to the console. 
		// Alternatively use eslint.formatEach() (see Docs). 
		.pipe($.eslint.format())
		// To have the process exit with an error code (1) on 
		// lint error, return the stream and pipe to failAfterError last. 
		.pipe($.eslint.failAfterError());
});

// Injecting sources from custom css
gulp.task('inject:js', ['scripts'], () => {
	log('Injecting js from custom folders to templates'); 
	log('Injecting from: ' + config.tempJs);

  	var sources = gulp.src(['./.tmp/**/*.js'], {read: false});

	return gulp
		.src([config.temp + '*.html']) 
		.pipe($.inject(sources,
		{
		   ignorePath: '.tmp/',
		   addRootSlash: false
		}
		))
		.pipe(gulp.dest(function (file){ return file.base; }));
});

//Useref
gulp.task('useref', [ 'inject:js', 'inject:css'], () => {
	log('Compiling the libraries paths for the templates in temp' );

	return gulp.src('./.tmp/*.html')
		.pipe($.useref())
		.pipe(gulp.dest(function (file) { return file.base; }))
		.pipe(browserSync.reload({
			stream:true
		}));
});

// Template Setup
gulp.task('templates', () =>{
	log('Setting up template');

	return gulp.src('./app/templates/*.html')
		.pipe(gulp.dest('./.tmp/'));
}); 

//Compress Images
gulp.task('images', () => {
	return gulp.src(config.allimages)
		.pipe($.imagemin())
		.pipe(gulp.dest(config.temp +'img'));
});

// Handle Videos
gulp.task('videos', () => {
    return gulp.src(config.videos)
        .pipe(gulp.dest(config.temp+'video'));
});

//browserSync
gulp.task('browsersync', () => {
	startBrowserSync();
});

//Watch
gulp.task('watch', ['browsersync'], () => {

	//SASS
	gulp.watch(config.sass, ['inject:css'], browserSync.reload);

	//JS 
	gulp.watch(config.alljs, ['inject:js'], browserSync.reload);
	
	//HTML
	gulp.watch(config.templates, ['useref'], browserSync.reload);

});

//Default 
gulp.task('default', [  'templates', 
						'useref',
						'images',
                        'videos',
						'watch'], 
	() => {
		console.log('Finished Loading');	
});


////////////////////////////////////////////////////

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
} 


function startBrowserSync() {  
    if (args.nosync || browserSync.active) {
       return;
    }
	
   log('Serving dev host from: ' + devip()[0]);	

    var options = {
		host: devip()[0],
		port: 3000,
       files: [
          	config.client + '**/*.*',   
          	config.temp + '**/*.css'
       ],
       ghostMode: {
          clicks: true,
          location: false,
          forms: true,
          scroll: true
       },
	   server: {
			baseDir: config.temp, 
	   },
       injectChanges: true,
       logFileChanges: true,
       logLevel: 'debug',
       logPrefix: 'gulp-patterns', 
       notify: true,
       reloadDelay: 1000
    };

    browserSync(options);
}


function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg ) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}	
}
