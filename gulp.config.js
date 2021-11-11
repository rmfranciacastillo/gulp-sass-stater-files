/* GULP Basic config */
const client = './app/';
const build = './_build/';

const config = {
  /*
   * Source Paths
   */
  alljs: `${client}**/*.js`,
	allscss: `${client}**/*.scss`,
	index_scss: `${client}scss/index.scss`,
  alltemplates: `${client}templates/*.html`,
  alltimages: `${client}img/*`,
  alltvideos: `${client}videos/*`,
  /*
   * Build Paths
   */
  buildtemplates: `${build}**/*.html`,
  buildjs: `${build}assets/**/*.js`,
  buildcss: `${build}assets/**/*.css`,
};

module.exports = {
  client,
  build,
  config,
};
