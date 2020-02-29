/**
 * @name plugin hm-replace-component
 * @param option: { data, filePath, config }
 * - data: module and generate code Data
 * - filePath: Pull file storage directory
 * - config: cli config
 */

const pluginHandler = async options => {
  let { data, filePath, config  } = options;
  try {
    console.log(data);
    console.log(filePath);
    console.log(config);
  } catch(err) {
    console.error('hm-replace-component error: ' + err.toString());
  }
  
  return { data, filePath, config };
};

module.exports = (...args) => {
  return pluginHandler(...args).catch(err => {
    console.log(err);
  });
};
