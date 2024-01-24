export const vscode = acquireVsCodeApi();

export const fieldsTypeEnum = {
  text: {
    text: '文本',
  },
  textarea: {
    text: '多行文本',
  },
  number: {
    text: '数字',
  },
  date: {
    text: '日期',
  },
  datetime: {
    text: '日期时间',
  },
  time: {
    text: '时间',
  },
  select: {
    text: '下拉框',
  },
  radio: {
    text: '单选框',
  },
  checkbox: {
    text: '多选框',
  },
  switch: {
    text: '开关',
  },
};

export const yesOrNoEnum = {
  '1': {
    text: '是',
  },
  '0': {
    text: '否',
  },
};
