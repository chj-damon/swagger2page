import { useContext, useEffect, useRef, useState } from 'react';
import { MessageContext } from '@/context/MessageContext';
import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import { fieldsTypeEnum, yesOrNoEnum } from '@/constant';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function IndexPage() {
  const { pathInfo } = useContext(MessageContext);
  const {
    method,
    parameters = [],
    result = [],
    title,
    requestName,
  } = pathInfo || {};

  console.log(pathInfo);

  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance>();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (method === 'get') {
      const items = result.find((item) => item.name === 'data')?.items || [];
      // 以result作为表单数据
      formRef.current?.setFieldValue(
        'config',
        items.map((item) => ({
          name: item.name,
          title: item.label,
          required: item.required,
          type: item.type,
        })),
      );
      setEditableRowKeys(items.map((item) => item.name));
    } else if (method === 'post') {
      // 以parameters作为表单数据
      formRef.current?.setFieldValue(
        'config',
        parameters.map((item) => ({
          name: item.name,
          title: item.description,
          required: item.required,
          type: item.schema.type,
        })),
      );
      setEditableRowKeys(parameters.map((item) => item.name));
    }
  }, [parameters, result, method]);

  const handleFinish = async (values: any) => {
    console.log(values);
  };

  const columns: ProColumns[] = [
    {
      title: '字段名称',
      dataIndex: 'name',
      editable: false,
    },
    {
      title: '字段文本',
      dataIndex: 'title',
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: fieldsTypeEnum,
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      valueType: 'select',
      valueEnum: yesOrNoEnum,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (__, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.name);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const dataSource: any[] = formRef.current?.getFieldValue('config');
            formRef.current?.setFieldsValue({
              config: dataSource.filter((item) => item.name !== record.name),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <div>
      <ProForm
        layout="horizontal"
        onFinish={handleFinish}
        formRef={formRef}
        {...formItemLayout}
        submitter={{
          render: (_, doms) => (
            <ProCard>
              <Space>{doms}</Space>
            </ProCard>
          ),
        }}
      >
        <ProCard title="基本信息">
          <ProFormText name="name" label="组件名称" />
          <ProFormSelect
            name="displayType"
            label="展示形式"
            options={[
              { label: '弹窗', value: 'modal' },
              { label: '页面', value: 'page' },
            ]}
          />
        </ProCard>
        <ProCard title="字段配置">
          <EditableProTable
            rowKey="name"
            editableFormRef={editorFormRef}
            name="config"
            scroll={{
              x: 960,
            }}
            formItemProps={{
              labelCol: { span: 0 },
              wrapperCol: { span: 24 },
            }}
            columns={columns}
            recordCreatorProps={false}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
            }}
          />
        </ProCard>
      </ProForm>
    </div>
  );
}
