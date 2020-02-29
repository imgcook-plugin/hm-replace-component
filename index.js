const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const _ = require('lodash');

let helpers = require('handlebars-helpers')({
  handlebars: Handlebars
});

// let projectDir = process.cwd();
let projectDir = '/Users/lucifer/codes/gitlab.haomo/Templates/HMUniAppTemplate';

function loadJson(jsonFile) {
  let contents = fs.readFileSync(jsonFile);
  return data = JSON.parse(contents);
}

/**
 * 加载得到组件的 xml，用来替换生成后的代码 
 */
function loadComponentXml(componentUiConfig) {
  console.log('loadComponentXml: ' + componentUiConfig.component);
  // 加载组件的模板
  let componentTemplateFile = path.join(projectDir, componentUiConfig.template);
  let componentTemplate = fs.readFileSync(componentTemplateFile).toString();

  // 替换组件中的props(attr/event): :data-id="options['{{id}}']['id']" 等
  componentTemplate = componentTemplate.replace(
    new RegExp(`:data-id="options['{{id}}']['id']"`, 'gm'), 
      `data-id='${_.kebabCase(componentUiConfig.component)}'`);
  componentTemplate = componentTemplate.replace(/\{\{title\}\}/g, `imgcook替换组件：${componentUiConfig.component}`);
  let attrReg = /:[a-z0-9\-]+\s?=\s?['"]options\[['"]\{\{id\}\}['"]\]\[['"][a-zA-Z0-9]+['"]\]['"]/g;
  let attrNameReg = /:[a-z0-9\-]+/g;
  if (componentTemplate.match(attrReg)) {
    console.log(JSON.stringify(componentTemplate.match(attrReg), null, 2));
    componentTemplate.match(attrReg).forEach(attr => {
      let attrName = attr.match(attrNameReg)[0].replace(':', '');
      componentTemplate = componentTemplate.replace(attr, `${attrName}="{{${_.camelCase(attrName)}}}"`)
    })
  } else {
    console.log('不存在除data-id外的属性绑定');
  }
  
  let eventReg = /@[a-z0-9\-]+\s?=\s?['"]options\[['"]\{\{id\}\}['"]\]\[['"][a-zA-Z0-9]+['"]\]['"]/g;
  let eventNameReg = /@[a-z0-9\-]+/g;
  if (componentTemplate.match(eventReg)) {
    componentTemplate.match(eventReg).forEach(event => {
      let eventName = attr.match(eventNameReg)[0].replace('@', '');
      componentTemplate = componentTemplate.replace(event, `@${eventName}=\`{{${_.camelCase(eventName)}}}\``);
    })
  } else {
    console.log('不存在事件绑定');
  }
  
  // 渲染模板
  console.log(componentTemplate);
  let template = Handlebars.compile(componentTemplate);
  return template(Object.assign({title: 'imgcook替换'}, componentUiConfig.defaultProps));
}

/**
 * @name plugin hm-replace-component
 * @param option: { data, filePath, config }
 * - data: module and generate code Data
 * - filePath: Pull file storage directory
 * - config: cli config
 */
const pluginHandler = async options => {
  let { data, filePath, config } = options;
  try {
    console.log('hm-replace-component');
    // 读取项目组件的列表。uni-ui.js
    console.log(process.cwd())
    let configJsonFile = `${projectDir}/.xmind2code.json`;
    console.log(`读取.xmind2code.json文件: ${configJsonFile}`);
    let xmind2codeJson = loadJson(configJsonFile);
    let uiConfigFile = path.join(projectDir, xmind2codeJson.uiConfig);
    console.log(`加载ui config文件: ${uiConfigFile}`);
    let UiConfig = require(uiConfigFile)();

    // 提取模板中的 {{ 'hm-component=van-field' }} 类似的表达式，并用表达式的模板进行替换
    let keyPattern = /\{\{\s?['"]hm-component=([a-z0-9\-]+)['"]\s?\}\}/g;
    data.code.panelDisplay.forEach(panel => {
      let componentUiConfigMap = {};
      if (!panel.panelValue.match(keyPattern)) {
        return;
      }
      panel.panelValue.match(keyPattern).forEach(keyStr => {
        let component = keyStr.replace(/\{\{\s?['"]hm-component=/g, '').replace(/['"]\s?\}\}/g, '');
        let componentUiConfig = UiConfig[component];
        if (!componentUiConfig) {
          console.warn(`找不到组件 ${component} 的ui config，请核对文件 ${uiConfigFile}`);
          return;
        }

        componentUiConfigMap[component] = componentUiConfig;

        // 渲染得到组件的xml
        let componentXml = loadComponentXml(componentUiConfig);

        // 替换模板对应的xml
        panel.panelValue = panel.panelValue.replace(new RegExp(keyStr, 'gm'), componentXml);
      })

      // 对于存在importPath的组件，需要将生成的代码执行引入操作
      Object.values(componentUiConfigMap).forEach(componentUiConfig => {
        if (!componentUiConfig.importPath) {
          return;
        }

        let importComponentStr = `import ${componentUiConfig.component} from ${componentUiConfig.importPath}`;
        // 对于vue生成的vue文件和对于jsx的文件(react)，需要引入组件
        if (panel.panelType == 'vue') {
          // 引入vue组件
          panel.panelValue.replace('export default', `${importComponentStr};
          export default`)
        } else if (panel.panelType == 'jsx') {
          // 引入react组件
          panel.panelValue.replace(`'use strict';`, `'use strict';
          ${importComponentStr};`)
        }
      })
    })
  } catch(err) {
    console.error('hm-replace-component error: ' + err.toString());
    console.error(err.stack);
  }
  
  console.log(JSON.stringify(data, null, 2))
  return { data, filePath, config };
};

module.exports = (...args) => {
  return pluginHandler(...args).catch(err => {
    console.log('hm-replace-component error');
    console.log(err);
  });
};
