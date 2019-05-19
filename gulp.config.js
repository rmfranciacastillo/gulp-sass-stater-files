/* GULP Basic config */
const client = './app/';
const build = './_build/';

const config = {
  /*
   * Source Paths
   */
  alljs: `${client}**/*.js`,
  allsass: `${client}**/*.sass`,
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
