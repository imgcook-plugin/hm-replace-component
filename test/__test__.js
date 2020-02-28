const mockData = require('./mockData');
const expect = require('chai').expect;
const fs = require('fs');
const { installPluginSync } = require('./utils');


describe('index.js', () => {
  const index = require('../index.js');
  const options = {
    data: mockData,
    filePath: './demo',
    config: {
      accessId: 'xx',
      dslId: 41,
      generator: ['@imgcook/generator-react'],
      plugin: ['@imgcook/plugin-images'],
      uploadUrl: '',
      value: '17679'
    }
  };
  it('index check param', async () =>{
    expect(options).to.be.an('object');
    expect(options.filePath).to.be.a('string');
  });

  const plugins = options.config.plugin;
  it('plugin install', async () => {
    try {
      if (!fs.existsSync(options.filePath)) {
        fs.mkdirSync(options.filePath);
      }
      const files = fs.readdirSync(`./node_modules/@imgcook`);
      let needInstallPlugin = [];
      for (const item of plugins) {
        if (files.indexOf(item.split('/')[1]) === -1) {
          needInstallPlugin.push(item);
        }
      }
      installPluginSync(needInstallPlugin, './'); // 可以手动安装测试
    } catch (error) {
      installPluginSync(plugins, './');
    }
  });

  let rdata = options;
  it('index callback result', async () => {

    if (plugins.length > 0) {
      // plugin invoke
      for (const iterator of plugins) {
        rdata = await require(iterator)(rdata);
      }
    }

    rdata = await index(rdata);
    const { data, filePath, config } = rdata;

    expect(data).to.be.an('object');
    expect(data.code).to.be.an('object');
    expect(data.code.panelDisplay).to.be.an('array');
    expect(filePath).to.be.a('string');
    expect(config).to.be.an('object');
  });
});
