export const inputProps = [
  { name: 'addonBefore', text: '前置标签', type: 'string' },
  { name: 'addonAfter', text: '后置标签', type: 'string' },
  { name: 'prefix', text: '前缀图标', type: 'string' },
  { name: 'suffix', text: '后缀图标', type: 'string' },
  { name: 'maxLength', text: '最大长度', type: 'number' },
];

export const textAreaProps = [
  ...inputProps,
  { name: 'autoSize', text: '自适应内容高度', type: 'boolean' },
];

export const passwordProps = [
  ...inputProps,
  {
    name: 'visibilityToggle',
    text: '是否显示切换按钮',
    type: 'boolean',
    default: true,
  },
];

export const captchaProps = [
  { name: 'countDown', text: '倒计时的秒数', type: 'number', default: 60 },
  {
    name: 'phoneName',
    text: '手机号的字段名',
    type: 'string',
    default: 'phone',
  },
  {
    name: 'fieldProps',
    text: '输入框属性',
    type: 'array',
    children: inputProps,
  },
];

export const digitProps = [
  { name: 'min', text: '最小值', type: 'number' },
  { name: 'max', text: '最大值', type: 'number' },
  {
    name: 'fieldProps',
    text: '输入框属性',
    type: 'array',
    children: [
      { name: 'precision', text: '数值精度', type: 'number' },
      { name: 'step', text: '每次改变步数', type: 'number', default: 1 },
      { name: 'addonBefore', text: '前置标签', type: 'string' },
      { name: 'addonAfter', text: '后置标签', type: 'string' },
      { name: 'prefix', text: '前缀图标', type: 'string' },
    ],
  },
];
export const digitRangeProps = [
  { name: 'separator', text: '分隔符', type: 'string' },
  { name: 'separatorWidth', text: '分隔符宽度', type: 'number' },
  {
    name: 'fieldProps',
    text: '输入框属性',
    type: 'array',
    children: [
      { name: 'min', text: '最小值', type: 'number' },
      { name: 'max', text: '最大值', type: 'number' },
      { name: 'precision', text: '数值精度', type: 'number' },
      { name: 'step', text: '每次改变步数', type: 'number', default: 1 },
      { name: 'addonBefore', text: '前置标签', type: 'string' },
      { name: 'addonAfter', text: '后置标签', type: 'string' },
      { name: 'prefix', text: '前缀图标', type: 'string' },
    ],
  },
];
export const dateProps = [
  {
    name: 'type',
    text: '日期类型',
    type: 'select',
    options: [
      { label: '日模式', value: 'Day' },
      { label: '周模式', value: 'Week' },
      { label: '月模式', value: 'Month' },
      { label: '季度模式', value: 'Quarter' },
      { label: '年模式', value: 'Year' },
    ],
  },
  { name: 'showNow', text: '显示"此刻"按钮', type: 'boolean' },
  { name: 'showToday', text: '显示"今天"按钮', type: 'boolean' },
];
export const selectProps = [
  { name: 'valueEnum', text: '列值枚举', type: 'object' },
  {
    name: 'fieldProps',
    text: '下拉框属性',
    type: 'array',
    children: [
      { name: 'fieldNames', text: '自定义字段名', type: 'object' },
      {
        name: 'labelInValue',
        text: '把label包装到value中',
        type: 'boolean',
        tooltip:
          '会把 Select 的 value 类型从 string 变为 { value: string, label: ReactNode } 的格式',
      },
      {
        name: 'mode',
        text: '模式',
        type: 'select',
        options: [
          { label: '多选', value: 'multiple' },
          { label: '标签', value: 'tags' },
        ],
      },
    ],
  },
];
export const treeSelectProps = [
  { name: 'valueEnum', text: '列值枚举', type: 'object' },
  {
    name: 'fieldProps',
    text: '下拉框属性',
    type: 'array',
    children: [
      { name: 'fieldNames', text: '自定义字段名', type: 'object' },
      {
        name: 'labelInValue',
        text: '把label包装到value中',
        type: 'boolean',
        tooltip:
          '会把 Select 的 value 类型从 string 变为 { value: string, label: ReactNode } 的格式',
      },
      {
        name: 'multiple',
        text: '支持多选',
        type: 'boolean',
      },
    ],
  },
];
export const checkboxProps = [
  {
    name: 'options',
    text: '待选项',
    type: 'object',
  },
  {
    name: 'layout',
    text: '排列方式',
    type: 'select',
    options: [
      { label: '水平排列', value: 'horizontal' },
      { label: '竖直排列', value: 'vertical' },
    ],
  },
];
export const radioProps = [
  {
    name: 'options',
    text: '待选项',
    type: 'object',
  },
  {
    name: 'radioType',
    text: '显示类型',
    type: 'select',
    options: [
      { label: '单选模式', value: 'default' },
      { label: '按钮模式', value: 'button' },
    ],
  },
];
export const cascaderProps = [
  {
    name: 'options',
    text: '待选项',
    type: 'object',
  },
  {
    name: 'fieldProps',
    text: '级联属性',
    type: 'array',
    children: [{ name: 'fieldNames', text: '自定义字段名', type: 'object' }],
  },
];
export const rateProps = [
  {
    name: 'fieldProps',
    text: '评分属性',
    type: 'array',
    children: [
      { name: 'count', text: 'star数量', type: 'number', default: 5 },
      { name: 'allowHalf', text: '允许半选', type: 'boolean' },
    ],
  },
];
export const sliderProps = [
  {
    name: 'fieldProps',
    text: '滑块属性',
    type: 'array',
    children: [
      { name: 'min', text: '最小值', type: 'boolean' },
      { name: 'max', text: '最大值', type: 'boolean' },
      { name: 'step', text: '步长', type: 'number', default: 1 },
      {
        name: 'dots',
        text: '是否只能拖拽到刻度上',
        type: 'boolean',
        default: false,
      },
      { name: 'range', text: '双滑块模式', type: 'boolean', default: false },
      { name: 'vertical', text: '垂直模式', type: 'boolean', default: false },
    ],
  },
];
export const uploadButtonProps = [
  { name: 'title', text: '标题', type: 'string' },
  { name: 'max', text: '最大上传数量', type: 'number' },
  { name: 'action', text: '上传地址', type: 'string' },
  { name: 'accept', text: '接受上传的文件类型', type: 'string' },
  {
    name: 'fieldProps',
    text: '上传属性',
    type: 'array',
    children: [
      { name: 'headers', text: '设置上传的请求头部', type: 'object' },
      {
        name: 'listType',
        text: '上传列表的内建样式',
        type: 'select',
        options: [
          { label: '文本', value: 'text' },
          { label: '图片', value: 'picture' },
          { label: '图片卡片', value: 'picture-card' },
          { label: '图片圆形', value: 'picture-circle' },
        ],
      },
      {
        name: 'multiple',
        text: '是否支持多选文件',
        type: 'boolean',
        default: false,
      },
      {
        name: 'name',
        text: '发到后台的文件参数名',
        type: 'string',
        default: 'file',
      },
    ],
  },
];
export const uploadDraggerProps = [
  { name: 'title', text: '标题', type: 'string' },
  { name: 'description', text: '描述', type: 'string' },
  { name: 'max', text: '最大上传数量', type: 'number' },
  { name: 'action', text: '上传地址', type: 'string' },
  { name: 'accept', text: '接受上传的文件类型', type: 'string' },
  {
    name: 'fieldProps',
    text: '上传属性',
    type: 'array',
    children: [
      { name: 'height', text: '高度', type: 'number' },
      { name: 'headers', text: '设置上传的请求头部', type: 'object' },
      {
        name: 'listType',
        text: '上传列表的内建样式',
        type: 'select',
        options: [
          { label: '文本', value: 'text' },
          { label: '图片', value: 'picture' },
          { label: '图片卡片', value: 'picture-card' },
          { label: '图片圆形', value: 'picture-circle' },
        ],
      },
      {
        name: 'multiple',
        text: '是否支持多选文件',
        type: 'boolean',
        default: false,
      },
      {
        name: 'name',
        text: '发到后台的文件参数名',
        type: 'string',
        default: 'file',
      },
    ],
  },
];
export const moneyProps = [
  {
    name: 'locale',
    text: '国际化',
    type: 'string',
    tooltip: `{
      "ar-EG": "$",
      "zh-CN": "¥",
      "en-US": "$",
      "en-GB": "£",
      "vi-VN": "₫",
      "it-IT": "€",
      "ja-JP": "¥",
      "es-ES": "€",
      "ru-RU": "₽",
      "sr-RS": "RSD",
      "ms-MY": "RM",
      "zh-TW": "NT$"
      "fr-FR": "€",
      "pt-BR": "R$",
      "ko-KR": "₩",
      "id-ID": "RP",
      "de-DE": "€",
      "fa-IR": "تومان",
      "tr-TR": "₺",
      "pl-PL": "zł",
      "hr-HR": "kn",
    }`,
  },
  { name: 'min', text: '最小值', type: 'number' },
  { name: 'max', text: '最大值', type: 'number' },
  { name: 'customSymbol', text: '自定义货币符号', type: 'string' },
  {
    name: 'numberFormatOptions',
    text: '数字格式化配置',
    type: 'object',
    tooltip:
      'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat',
  },
];
export const segmentProps = [
  { name: 'valueEnum', text: '列值枚举', type: 'object' },
];

export const fieldPropsMapping: Record<string, any> = {
  text: inputProps,
  textarea: textAreaProps,
  captcha: captchaProps,
  password: passwordProps,
  digit: digitProps,
  digitRange: digitRangeProps,
  date: dateProps,
  select: selectProps,
  treeSelect: treeSelectProps,
  radio: radioProps,
  checkbox: checkboxProps,
  cascader: cascaderProps,
  slider: sliderProps,
  rate: rateProps,
  uploadButton: uploadButtonProps,
  uploadDragger: uploadDraggerProps,
  money: moneyProps,
  segment: segmentProps,
};
