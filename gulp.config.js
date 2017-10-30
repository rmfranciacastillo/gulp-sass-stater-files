/*******************************
 *		GULP Basic config 	   *	
 *******************************/

module.exports = function(){
	var client = './app/';
	var temp  = './.tmp/';	

	var config = {

		/*
		 *	File paths
		 */
		temp: temp,	
		tempSass: temp + 'css/',	
		tempTemplates: temp + 'templates/',
		tempJs: temp + 'js/',
		alljs: [
			client + '**/*.js',
			client + '*.js'
		],
		allcss: [
			client + 'css/*.css'
		],
		sass: [
			client + 'sass/*.sass',
			client + 'sass/**/*.sass'
		],
		allimages: [
			client + 'img/*'
		],	
		templates: [
			client + '*.html',
			client + 'templates/*.html'
		],			
	
		/*
		 *	Bower and NPM locations 
		 */
		bower: {
			json: require('./bower.json'),
			directory: './bower_components',
			ignorePath: '../..'
		}
	};

	config.getWiredepDefaultOptions = function(){

		var options = {

			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath,
			fileTypes: {
				html: {
					replace: {
						css: '<link rel="stylesheet" stuff href="{{filePath}}" />'
					}
				}
			}
		};
		return options; 	
	};

	return config; 
};
