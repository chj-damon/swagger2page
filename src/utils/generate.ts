import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import * as nunjucks from 'nunjucks';
import path from 'path';
import { workspace } from 'vscode';

const componentTypeMapping: Record<string, string> = {
  text: 'ProFormText',
  captcha: 'ProFormCaptcha',
  password: 'ProFormText',
  digit: 'ProFormDigit',
  digitRange: 'ProFormDigitRange',
  textarea: 'ProFormTextArea',
  date: 'ProFormDatePicker',
  dateTime: 'ProFormDateTimePicker',
  dateRange: 'ProFormDateRangePicker',
  dateTimeRange: 'ProFormDateTimeRangePicker',
  time: 'ProFormTimePicker',
  select: 'ProFormSelect',
  treeSelect: 'ProFormTreeSelect',
  checkbox: 'ProFormCheckbox',
  radio: 'ProFormRadio',
  cascader: 'ProFormCascader',
  slider: 'ProFormSlider',
  switch: 'ProFormSwitch',
  rate: 'ProFormRate',
  uploadButton: 'ProFormUploadButton',
  uploadDragger: 'ProFormUploadDragger',
  money: 'ProFormMoney',
  segment: 'ProFormSegmented',
};

const templateMapping: Record<string, string> = {
  formModal: 'formModalTpl.njk',
  detailModal: 'detailModalTpl.njk',
  formPage: 'formPageTpl.njk',
  detailPage: 'detailPageTpl.njk',
  table: 'tableTpl.njk',
};

export function generateFileByTemplate(
  outputPath: string,
  templatePath: string,
  data: Record<string, any>,
  apiImportPath: string | null,
  requestName: string | undefined,
) {
  const {
    name,
    layout,
    config,
    displayType,
    labelCol = 6,
    wrapperCol = 18,
    ...rest
  } = data;

  // 设置输出不转义
  nunjucks.configure({ autoescape: true });

  const tplPath = path.join(templatePath, templateMapping[displayType]);

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(templatePath, {
      noCache: true,
    }),
  );
  // 针对nunjucks无法识别{ }的问题，添加一个过滤器
  env.addFilter('curly', (val) => `{${val}}`);
  env.addFilter('percent', (val) => (val.endsWith('%') ? val : `{${val}}`));

  // 对name进行重命名
  const newName = rename(name, displayType);

  // 根据layout, 对config进行处理
  const [hiddenItems, items, colSpan] = categoryConfigByLayout(layout, config);

  const content = env.getTemplate(tplPath, true).render({
    ...rest,
    name: newName,
    config,
    items,
    hiddenItems,
    colSpan,
    labelCol,
    wrapperCol,
    generateImportStr,
    apiImportPath,
    requestName,
  });

  // const template = getTemplate(tplPath);
  // const content = nunjucks.renderString(template, data);
  const prettierContent = prettify(content);

  const filePath = writeFile(outputPath, newName, prettierContent);
  return filePath;
}

function getTemplate(path: string) {
  return readFileSync(path, 'utf-8');
}

function writeFile(folderPath: string, fileName: string, content: string) {
  const filePath = path.join(folderPath, fileName + '.tsx');
  // 如果文件夹不存在，则创建
  mkdir(path.dirname(filePath));

  // 写入文件之前判断文件是否存在，如果存在则删除
  if (existsSync(filePath)) {
    // 删除文件
    unlinkSync(filePath);
  }

  // 写入文件
  writeFileSync(filePath, content, {
    encoding: 'utf-8',
  });

  // 返回创建好的文件的路径，用于打开文件
  return filePath;
}

function mkdir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

function prettify(content: string) {
  const prettier = require('prettier'); // <- 不能在外面用import的方式引入，否则会报错

  const result = prettier.format(content, {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
    printWidth: 120,
    tabWidth: 2,
  });

  return result;
}

function generateImportStr(items: any[]) {
  const componentTypes = [...new Set(items.map((item) => item.componentType))];
  const importStr = componentTypes
    .map((type) => componentTypeMapping[type])
    .join(',');
  return importStr;
}

/**
 * 根据展示类型重命名
 * @param name
 * @param displayType: 'formModal' | 'detailModal' | 'formPage' | 'detailPage' | 'table'
 * @returns
 */
export function rename(name: string, displayType: string) {
  let newName = name;

  if (displayType.endsWith('Page')) {
    newName = name.endsWith('Page') ? name : name + 'Page';
  } else if (displayType.endsWith('Modal')) {
    newName = name.endsWith('Modal') ? name : name + 'Modal';
  } else {
    newName = name.endsWith('Table') ? name : name + 'Table';
  }

  // 首字母大写
  return newName.replace(/^\S/, (s) => s.toUpperCase());
}

/**
 * 根据布局方式，把所有的配置项进行拆分
 * @param layout 布局方式： 一行一列、一行两列、一行三列、一行四列
 * @param config 所有的配置项
 * @returns 拆分后的配置项，是一个二维数组
 */
function categoryConfigByLayout(layout: string, config: any[]) {
  const hiddenItems = config.filter((item) => !!item.hidden);
  const items: any[][] = [];
  let colSpan = 24;

  const visibleItems = config.filter((item) => !item.hidden);

  switch (layout) {
    case '1*1': // 一行一列
      visibleItems.forEach((item) => {
        items.push([item]);
      });
      colSpan = 24;
      break;

    case '1*2': // 一行两列
      visibleItems.forEach((item, index) => {
        if (index % 2 === 0) {
          items.push([item]);
        } else {
          items[items.length - 1].push(item);
        }
      });
      colSpan = 12;
      break;

    case '1*3': // 一行三列
      visibleItems.forEach((item, index) => {
        if (index % 3 === 0) {
          items.push([item]);
        } else {
          items[items.length - 1].push(item);
        }
      });
      colSpan = 8;
      break;

    case '1*4': // 一行四列
      visibleItems.forEach((item, index) => {
        if (index % 4 === 0) {
          items.push([item]);
        } else {
          items[items.length - 1].push(item);
        }
      });
      colSpan = 6;
      break;

    default:
      break;
  }

  return [hiddenItems, items, colSpan];
}

/**
 * 根据接口信息， 找到这个接口所在的文件地址，以及接口对应的方法名
 * @param info
 */
export async function getApiInfo(api?: string) {
  if (!api) return null;

  const files = await workspace.findFiles('src/api/**/*.ts');
  for (const file of files) {
    const doc = await workspace.openTextDocument(file);
    const fileText = doc.getText();
    if (fileText.includes(api)) {
      // 返回file在当前workspace中的相对路径
      const fileLocation = path.relative(
        workspace.workspaceFolders![0].uri.fsPath,
        file.fsPath,
      );
      const filePath = fileLocation.replace(/\.ts$/, '').replace(/^src/, '@');
      return filePath;
    }
  }
  return null;
}
