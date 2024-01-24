import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as nunjucks from 'nunjucks';
import path from 'path';

export async function generateFileByTemplate(
  outputPath: string,
  templatePath: string,
  data: Record<string, any>,
) {
  // 设置输出不转义
  nunjucks.configure({ autoescape: true });

  const tplPath = path.join(templatePath, 'modalTpl.njk');

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(templatePath, {
      noCache: true,
    }),
  );
  const content = env.getTemplate(tplPath, true).render({
    ...data,
    generateImportStr,
  });
  console.log(content);

  // const template = getTemplate(tplPath);
  // const content = nunjucks.renderString(template, data);
  const prettierContent = await prettify(content);

  const filePath = await writeFile(outputPath, data.name, prettierContent);
  return filePath;
}

function getTemplate(path: string) {
  return readFileSync(path, 'utf-8');
}

async function writeFile(
  folderPath: string,
  fileName: string,
  content: string,
) {
  const filePath = path.join(folderPath, fileName + '.tsx');
  mkdir(path.dirname(filePath));

  writeFileSync(filePath, content, {
    encoding: 'utf-8',
  });

  return filePath;
}

function mkdir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

async function prettify(content: string) {
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
