import { fieldsTypeEnum, vscode, yesOrNoEnum } from '@/constant';
import { MessageContext } from '@/context/MessageContext';
import { mappingType } from '@/utils';
import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Row, Space } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

const formItemLayout = {
  labelCol: { span: 4 },
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
          required: (+item.required).toString(),
          componentType: mappingType(item.type),
          visible: '1',
        })),
      );
    } else if (method === 'post') {
      // 以parameters作为表单数据
      formRef.current?.setFieldValue(
        'config',
        parameters.map((item) => ({
          name: item.name,
          title: item.description,
          required: (+item.required).toString(),
          componentType: mappingType(item.schema.type),
          visible: '1',
        })),
      );
    }
  }, [parameters, result, method]);

  const handleFinish = async (values: any) => {
    if (editableKeys.length > 0) {
      await editorFormRef.current?.validateFields();
    }
    // 把表单数据传给vscode，通过vscode生成文件
    vscode.postMessage({
      type: 'generate',
      data: {
        ...values,
        config: values.config.map((item: any) => ({
          ...item,
          required: item.required === '1',
          visible: item.visible === '1',
        })),
        requestName,
        title,
      },
    });
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
      dataIndex: 'componentType',
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
      title: '是否在界面显示',
      dataIndex: 'visible',
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
        initialValues={{
          isForm: true,
          displayType: 'modal',
        }}
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
          <Row>
            <Col span={12}>
              <ProFormText
                name="name"
                label="组件名称"
                tooltip={{
                  title:
                    '组件名称是最后生成的文件名称，所以请使用英文驼峰的方式书写',
                }}
                required
                rules={[
                  { required: true, message: '请输入组件名称' },
                  {
                    pattern: /^[A-Z][a-z]+([A-Z][a-z]+)*$/,
                    message: '请输入英文驼峰的组件名称',
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="displayType"
                label="展示形式"
                required
                rules={[{ required: true, message: '请选择展示形式' }]}
                options={[
                  { label: '弹窗', value: 'modal' },
                  { label: '页面', value: 'page' },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <ProFormSelect
                name="layout"
                label="界面布局"
                required
                rules={[{ required: true, message: '请选择界面布局' }]}
                options={[
                  { label: '一行一列', value: '1*1' },
                  { label: '一行两列', value: '1*2' },
                  { label: '一行三列', value: '1*3' },
                  { label: '一行四列', value: '1*4' },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormSwitch
                tooltip={{
                  title:
                    '是否将组件作为表单使用,如果是,则会自动将组件的配置项转换为表单项',
                }}
                name="isForm"
                label="是否表单"
              />
            </Col>
          </Row>
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
