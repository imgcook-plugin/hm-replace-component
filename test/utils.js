
const childProcess = require('child_process');

/**
 * install plugin
 * @param {String} plugin: plugin name
 * @param {String} dirname: install path
 */

const installPluginSync = async (plugin, dirname) => {
  if (plugin.length > 0) {
    try {
      for (const item of plugin) {
        const cmd = `npm install --prefix ${dirname} ${item}`;
        childProcess.execSync(cmd);
      }
    } catch (error) {
      // console.log(error);
    }
  }
};


module.exports = {
  installPluginSync
}
