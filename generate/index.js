/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);

const generatePath = '../src/modules';

const writeFiles = async (file, moduleName, renderData) => {
  const filename = file.replace('generate', moduleName);
  // 驼峰转中划线
  const parmaCaseFilename = filename.replace(/([A-Z])/g, '-$1').toLowerCase();

  switch (file) {
    case 'generate.controller':
    case 'generate.module':
    case 'generate.service':
      await writeFile(
        `${generatePath}/${moduleName}/${parmaCaseFilename}.ts`,
        renderData,
      );
      break;
    case 'generate.entity':
      await writeFile(
        `${generatePath}/${moduleName}/entities/${parmaCaseFilename}.ts`,
        renderData,
      );
      break;
    case 'create-generate.dto':
    case 'update-generate.dto':
      await writeFile(
        `${generatePath}/${moduleName}/dto/${parmaCaseFilename}.ts`,
        renderData,
      );
      break;
  }
};

async function init(moduleName) {
  const pascalCaseModuleName =
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const parmaCaseModuleName = moduleName
    ?.replace(/([A-Z])/g, '-$1')
    .toLowerCase();

  // 读取template里面所有的文件
  const files = await readdir('./templates');
  files.map(async (file) => {
    // 读取文件
    const result = await readFile(`./templates/${file}`);
    const renderData = ejs.render(result.toString(), {
      moduleName: moduleName,
      ModuleName: pascalCaseModuleName,
      parmaCaseModuleName: parmaCaseModuleName,
    });
    // 创建目录
    await mkdir(`${generatePath}/${moduleName}`, { recursive: true });
    await mkdir(`${generatePath}/${moduleName}`, { recursive: true });
    await mkdir(`${generatePath}/${moduleName}/dto`, { recursive: true });
    await mkdir(`${generatePath}/${moduleName}/entities`, { recursive: true });
    // 写入文件
    file = file.substring(0, file.lastIndexOf('.'));
    // 新增和修改放入不同的文件夹
    await writeFiles(file, moduleName, renderData);
  });
  console.log('生成成功');
}

init(process.argv[2]);
