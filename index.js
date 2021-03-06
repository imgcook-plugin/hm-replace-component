const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const _ = require("lodash");
const prettier = require("prettier");

let helpers = require("handlebars-helpers")({
  handlebars: Handlebars
});

let projectDir = process.cwd();
// let projectDir = '/Users/lucifer/codes/gitlab.haomo/Templates/HMUniAppTemplate';

let replaceComponentUiConfigMap = {};   // 替代组件的UiConfigMap
let replaceComponentCSSClassMap = {};   // 替代组件的原CSS类名(imgcook生成的类名)

function loadJson(jsonFile) {
  let contents = fs.readFileSync(jsonFile);
  return (data = JSON.parse(contents));
}

function replaceComponentAttr(componentTemplate, componentUiConfig) {
  let attrReg = /:[a-z0-9\-]+\s*=\s*['"]options\[['"]\{\{id\}\}['"]\]\[['"][a-zA-Z0-9]+['"]\]['"]/g;
  let attrNameReg = /:[a-z0-9\-]+/g;
  if (componentTemplate.match(attrReg)) {
    componentTemplate.match(attrReg).forEach(attr => {
      let attrName = attr.match(attrNameReg)[0].replace(":", "");
      componentTemplate = componentTemplate.replace(
        attr,
        `${attrName}="${componentUiConfig.defaultProps[attrName]}"`
      );
    });
  } else {
    console.log(`组件模板不存在除data-id外的属性绑定`);
  }
  return componentTemplate;
}

function replaceComponentEvent(componentTemplate, componentUiConfig) {
  let eventReg = /@[a-z0-9\-]+\s*=\s*['"]options\[['"]\{\{id\}\}['"]\]\[['"][a-zA-Z0-9]+['"]\]['"]/g;
  let eventNameReg = /@([a-z0-9\-]+)=/g;
  if (componentTemplate.match(eventReg)) {
    componentTemplate.match(eventReg).forEach(event => {
      eventNameReg.test(event);
      let eventName = RegExp.$1;
      let eventFunc = _.camelCase('on-'+eventName);
      componentTemplate = componentTemplate.replace(
        event,
        `@${eventName}="'${eventFunc}'"`
      );
    });
  } else {
    console.log(`组件模板不存在事件绑定`);
  }
  return componentTemplate;
}

/**
 * 替换渲染的文字文本 \{{options['{{id}}']['text']}}
 * @param {*} componentTemplate 
 */
function replaceComponentText(componentTemplate, componentUiConfig) {
  let textReg = /\\\{\{\s*options\[['"]\{\{id\}\}['"]\]\[['"][a-zA-Z0-9]+['"]\]\s*\}\}/g;
  let textNameReg = /\\\{\{\s*options\[['"]\{\{id\}\}['"]\]\[['"]([a-zA-Z0-9]+)['"]\]\s*\}\}/g;
  if (componentTemplate.match(textReg)) {
    componentTemplate.match(textReg).forEach(text => {
      textNameReg.test(componentTemplate);
      let textName = RegExp.$1;
      componentTemplate = componentTemplate.replace(
        text,
        `${componentUiConfig.defaultProps[textName]}`
      );
    });
  } else {
  }
  return componentTemplate;
}

/**
 * 加载得到组件的 xml，用来替换生成后的代码
 */
function loadComponentXml(componentUiConfig) {
  console.log("loadComponentXml: " + componentUiConfig.component);
  // 加载组件的模板
  let componentTemplateFile = path.join(projectDir, componentUiConfig.template);
  let componentTemplate = fs.readFileSync(componentTemplateFile).toString();

  // 替换组件中的props(attr/event): :data-id="options['{{id}}']['id']" 等
  componentTemplate = componentTemplate.replace(
    /:data-id?=\s*['"]options\[['"]\{\{id\}\}['"]\]\[['"][a-zA-Z0-9]+['"]\]['"]/g,
    `data-id='${_.kebabCase(componentUiConfig.component)}'`
  );
  componentTemplate = componentTemplate.replace(
    /\{\{title\}\}/g,
    `imgcook替换组件：${componentUiConfig.component}`
  );
  
  componentTemplate = replaceComponentAttr(componentTemplate, componentUiConfig);
  componentTemplate = replaceComponentEvent(componentTemplate, componentUiConfig);
  componentTemplate = replaceComponentText(componentTemplate, componentUiConfig);

  // 渲染模板
  componentTemplate = `\n${componentTemplate}\n`; // 加换行
  let template = Handlebars.compile(componentTemplate);
  return template(
    Object.assign({ title: "imgcook替换" }, componentUiConfig.defaultProps)
  );
}

function replaceVueComponent(panel, UiConfig) {
  let keyPattern = /<div\s+class=['"]\S+['"]>\{\{\s*['"]hm-component=([a-z0-9\-]+)['"]\s*\}\}<\/div>/g;
  
  if (!panel.panelValue.match(keyPattern)) {
    return;
  }
  panel.panelValue.match(keyPattern).forEach(keyStr => {
    let component = keyStr
      .replace(/<div\s+class=['"]\S+['"]>\{\{\s*['"]hm-component=/g, "")
      .replace(/['"]\s*\}\}<\/div>/g, "");

    if (!component) {
      console.warn(`找不到组件: ${keyStr}`);
    }

    console.log(`替换组件: ${component}`);

    let classReg = /<div\s+class=['"](\S+)['"]>\{\{\s*['"]hm-component=[a-z0-9\-]+['"]\s*\}\}<\/div>/g;
    classReg.test(keyStr);
    let componentClass = RegExp.$1;
    let componentUiConfig = UiConfig[component];
    if (!componentUiConfig) {
      console.warn(
        `找不到组件 ${component} 的ui config，请核对文件 ${uiConfigFile}`
      );
      return;
    }
    componentUiConfig.component = componentUiConfig.component || component;

    replaceComponentUiConfigMap[component] = componentUiConfig;
    replaceComponentCSSClassMap[component] = componentClass;

    // 渲染得到组件的xml
    let componentXml = loadComponentXml(componentUiConfig);

    // 替换模板对应的xml
    panel.panelValue = panel.panelValue.replace(
      new RegExp(keyStr, "gm"),
      componentXml
    );
  });

  // 对于存在importPath的组件，需要将生成的代码执行引入操作
  Object.values(replaceComponentUiConfigMap).forEach(componentUiConfig => {
    if (!componentUiConfig.importPath) {
      return;
    }

    let importComponentStr = `import ${componentUiConfig.component} from ${componentUiConfig.importPath}`;
    // 对于vue生成的vue文件和对于jsx的文件(react)，需要引入组件
    if (panel.panelType == "vue") {
      // 引入vue组件
      panel.panelValue.replace(
        "export default",
        `${importComponentStr};
          export default`
      );
    } else if (panel.panelType == "jsx") {
      // 引入react组件
      panel.panelValue.replace(
        `'use strict';`,
        `'use strict';
          ${importComponentStr};`
      );
    }
  });

  // 对panelValue进行prettier
  try {
    panel.panelValue = prettier.format(panel.panelValue, {
      semi: true,
      tabWidth: 2,
      parser: "vue"
    });
  } catch (err) {
    console.error(err.stack);
  }
}

function replaceReactComponent(panel, UiConfig) {
  let keyPattern = /<View\s+class=['"]\S+['"]>\{\s*['"]hm-component=([a-z0-9\-]+)['"]\s*\}<\/View>/g;
  
  if (!panel.panelValue.match(keyPattern)) {
    return;
  }
  panel.panelValue.match(keyPattern).forEach(keyStr => {
    let component = keyStr
      .replace(/<View\s+class=['"]\S+['"]>\{\s*['"]hm-component=/g, "")
      .replace(/['"]\s*\}<\/View>/g, "");
    let classReg = /<View\s+class=['"](\S+)['"]>\{\s*['"]hm-component=[a-z0-9\-]+['"]\s*\}<\/View>/g;
    classReg.test(keyStr);
    let componentClass = RegExp.$1;
    let componentUiConfig = UiConfig[component];
    if (!componentUiConfig) {
      console.warn(
        `找不到组件 ${component} 的ui config，请核对文件 ${uiConfigFile}`
      );
      return;
    }

    replaceComponentUiConfigMap[component] = componentUiConfig;
    replaceComponentCSSClassMap[component] = componentClass;

    // 渲染得到组件的xml
    let componentXml = loadComponentXml(componentUiConfig);

    // 替换模板对应的xml
    panel.panelValue = panel.panelValue.replace(
      new RegExp(keyStr, "gm"),
      componentXml
    );
  });

  // 对于存在importPath的组件，需要将生成的代码执行引入操作
  Object.values(replaceComponentUiConfigMap).forEach(componentUiConfig => {
    if (!componentUiConfig.importPath) {
      return;
    }

    let importComponentStr = `import ${componentUiConfig.component} from ${componentUiConfig.importPath}`;
    // 对于vue生成的vue文件和对于jsx的文件(react)，需要引入组件
    if (panel.panelType == "vue") {
      // 引入vue组件
      panel.panelValue.replace(
        "export default",
        `${importComponentStr};
          export default`
      );
    } else if (panel.panelType == "jsx") {
      // 引入react组件
      panel.panelValue.replace(
        `'use strict';`,
        `'use strict';
          ${importComponentStr};`
      );
    }
  });

  // 对panelValue进行prettier
  try {
    if (panel.panelType == "vue") {
      panel.panelValue = prettier.format(panel.panelValue, {
        semi: true,
        tabWidth: 2,
        parser: "vue"
      });
    } else if (panel.panelType == "jsx") {
      panel.panelValue = prettier.format(panel.panelValue, {
        semi: true,
        tabWidth: 2,
        parser: "babel"
      });
    }
  } catch (err) {
    console.error(err.stack);
  }
}

function replaceComponent(panel, UiConfig) {
  if (panel.panelType == 'vue') {
    replaceVueComponent(panel, UiConfig);
  } else if (panel.panelType == 'jsx') {
    // @TODO: 替换react组件
    // replaceReactComponent(panel, UiConfig);
  }
}

function replaceCSS(panel, UiConfig) {
  Object.keys(replaceComponentUiConfigMap).forEach(component => {
    try {
      let componentClass = replaceComponentCSSClassMap[component];
      // 提取生成后代码的style
      // let classReg = /\.main\s*\{[^\}]+\}/g;
      let classReg = new RegExp('\.' + componentClass + '\s*\{[^\}]+\}', 'gm');
      let componentStyle = panel.panelValue.match(classReg)[0];

      // @TODO: 读取组件style，并替换映射

      // @TODO: 将生成后的style，替换为目标组件对应的style。

    } catch(err) {
      console.error('替换组件CSS报错：' + err.toString());
      console.error(err.stack);
    }
  })
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
    console.log("hm-replace-component");
    // 读取项目组件的列表。uni-ui.js
    console.log(process.cwd());
    let configJsonFile = `${projectDir}/.xmind2code.json`;

    if (!fs.existsSync(configJsonFile)) {
      console.log('未配置.xmind2code.json，不进行组件替换');
      return { data, filePath, config };
    }

    console.log(`读取.xmind2code.json文件: ${configJsonFile}`);
    let xmind2codeJson = loadJson(configJsonFile);
    let uiConfigFile = path.join(projectDir, xmind2codeJson.uiConfig);
    console.log(`加载ui config文件: ${uiConfigFile}`);
    let UiConfig = require(uiConfigFile)();

    // 提取模板中的 {{ 'hm-component=van-field' }} 类似的表达式，并用表达式的模板进行替换
    data.code.panelDisplay.forEach(panel => {
      replaceComponent(panel, UiConfig);
      // if (panelType == 'css') {
      //   replaceCSS(panel, UiConfig);
      // }
    });
  } catch (err) {
    console.error("hm-replace-component error: " + err.toString());
    console.error(err.stack);
  }
  return { data, filePath, config };
};

module.exports = (...args) => {
  return pluginHandler(...args).catch(err => {
    console.log("hm-replace-component error");
    console.log(err);
  });
};
