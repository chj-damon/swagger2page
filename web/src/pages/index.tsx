import Title from '@/components/Title';
import { fieldsTypeEnum, vscode, yesOrNoEnum } from '@/constant';
import { MessageContext } from '@/context/MessageContext';
import InputFieldModal from '@/modals/InputFieldModal';
import { mappingType } from '@/utils';
import {
  EditableFormInstance,
  EditableProTable,
  ProCard,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormItem,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import NiceModal from '@ebay/nice-modal-react';
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

  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance>();

  const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (method === 'get') {
      const items = result.find((item) => item.name === 'data')?.items || [];
      const dataSource = items.map((item) => ({
        name: item.name,
        title: item.label,
        required: (+item.required).toString(),
        componentType: mappingType(item.type),
        visible: '1',
      }));
      formRef.current?.setFieldValue('config', dataSource);
      setEditableKeys(dataSource.map((item) => item.name));
    } else if (method === 'post') {
      const dataSource = parameters.map((item) => ({
        name: item.name,
        title: item.description,
        required: (+item.required).toString(),
        componentType: mappingType(item.schema.type),
        visible: '1',
      }));

      formRef.current?.setFieldValue('config', dataSource);
      setEditableKeys(dataSource.map((item) => item.name));
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
      // 在编辑状态下不显示，编辑保存之后才显示
      render: (__, record, index, action) => {
        const editDom = (
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.name);
            }}
          >
            编辑
          </a>
        );

        // 判断这一行是否可见
        const isVisible = record.visible === '1';

        const configDom = (
          <a
            key="config"
            onClick={() => {
              NiceModal.show(InputFieldModal, {
                ...record,
                callback(data: any) {
                  // 将data保存
                  editorFormRef.current?.setRowData?.(index, {
                    ...record,
                    ...data,
                  });
                },
              });
            }}
          >
            配置
          </a>
        );

        return isVisible ? [editDom, configDom] : [editDom];
      },
    },
  ];

  return (
    <div>
      <ProForm
        layout="horizontal"
        onFinish={handleFinish}
        formRef={formRef}
        initialValues={{
          labelCol: 6,
          wrapperCol: 18,
          modalWidth: '800',
          displayType: 'formModal',
          layout: '1*2',
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
        <ProCard title={<Title text="基本信息" />}>
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
                rules={[{ required: true, message: '请输入组件名称' }]}
              />
            </Col>
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
          </Row>
          <Row>
            <Col span={12}>
              <ProFormSelect
                name="displayType"
                label="展示形式"
                required
                rules={[{ required: true, message: '请选择展示形式' }]}
                options={[
                  { label: '表单弹窗', value: 'formModal' },
                  { label: '详情弹窗', value: 'detailModal' },
                  { label: '表单页面', value: 'formPage' },
                  { label: '详情页面', value: 'detailPage' },
                  { label: '表格', value: 'table' },
                ]}
              />
            </Col>
          </Row>
          <ProFormItem
            noStyle
            shouldUpdate={(prevValues, currValues) =>
              prevValues.displayType !== currValues.displayType
            }
          >
            {({ getFieldValue }) => {
              const displayType = getFieldValue('displayType');
              if (displayType === 'formModal' || displayType === 'detailModal')
                return (
                  <>
                    <Row>
                      <Col span={12}>
                        <ProFormText
                          width="lg"
                          name="modalName"
                          label={
                            displayType === 'formModal'
                              ? '表单弹窗标题'
                              : '详情弹窗标题'
                          }
                          required
                          rules={[
                            { required: true, message: '请输入弹窗标题' },
                          ]}
                        />
                      </Col>
                      <Col span={12}>
                        <ProFormText
                          width="lg"
                          name="modalWidth"
                          label={'弹窗宽度'}
                          required
                          rules={[
                            { required: true, message: '请输入弹窗宽度' },
                          ]}
                          tooltip={{
                            title: '弹窗宽度，可以是数字或者百分比',
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <ProFormDigit
                          width="lg"
                          name="labelCol"
                          label={'标签宽度'}
                          tooltip={{ title: '默认值是6' }}
                        />
                      </Col>
                      <Col span={12}>
                        <ProFormDigit
                          width="lg"
                          name="wrapperCol"
                          label={'控件宽度'}
                          tooltip={{ title: '默认值是18' }}
                        />
                      </Col>
                    </Row>
                  </>
                );

              if (displayType === 'formPage' || displayType === 'detailPage')
                return (
                  <Row>
                    <Col span={12}>
                      <ProFormDigit
                        width="lg"
                        name="labelCol"
                        label={'标签宽度'}
                        tooltip={{ title: '默认值是6' }}
                      />
                    </Col>
                    <Col span={12}>
                      <ProFormDigit
                        width="lg"
                        name="wrapperCol"
                        label={'控件宽度'}
                        tooltip={{ title: '默认值是18' }}
                      />
                    </Col>
                  </Row>
                );

              return null;
            }}
          </ProFormItem>
        </ProCard>
        <ProCard title={<Title text="字段配置" />}>
          <EditableProTable
            rowKey="name"
            editableFormRef={editorFormRef}
            name="config"
            scroll={{
              x: 960,
              y: 400,
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
              form: formRef.current,
              onChange: setEditableKeys,
              onSave: async (key, row, originRow) => {
                console.log('onSave', key, row, originRow);
              },
            }}
          />
        </ProCard>
      </ProForm>
    </div>
  );
}
