/* GULP Basic config */
const client = './app/';
const build = './build/';

const config = {
  /*
   * File Paths
   */
  alljs: client + '**/*.js',
  allsass: client + '**/*.sass',
};

module.exports = {
  client,
  build,
  config,
}; 

//module.exports = function() {

	//var config = {

		/*
		 *	File paths
		 */
		//tempSass: temp + 'css/',
		//tempTemplates: temp + 'templates/',
		//tempJs: temp + 'js/',
		//alljs: client + '**/*.js',
		//allcss: [
			//client + 'css/*.css'
		//],
		//sass: [
			//client + 'sass/*.sass',
			//client + 'sass/**/*.sass'
		//],
		//allimages: [
			//client + 'img/*'
		//],
		//videos: [
			//client + 'videos/*'
		//],

		//templates: [
			//client + '*.html',
			//client + 'templates/*.html'
		//]
	//};

	//return config;
//};
