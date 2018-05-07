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
		videos: [
			client + 'videos/*'
		],

		templates: [
			client + '*.html',
			client + 'templates/*.html'
		]			
	};

	return config; 
};
