import { useEffect, useRef } from 'react';

import Title from '@/components/Title';
import { fieldsTypeEnum } from '@/constant';
import { fieldPropsMapping } from '@/fieldProps';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from 'antd';
import { omit } from 'lodash-es';

type InputFieldModal = Record<string, any> & {
  callback: (data: any) => void;
};

const InputFieldModal = (props: InputFieldModal) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    formRef.current?.resetFields();
    if (modal.visible) {
      console.log(props, 'props');
      const { componentType, ...rest } = props;

      formRef.current?.setFieldsValue({
        ...rest,
        fieldName: fieldsTypeEnum[componentType].text,
      });
    }
  }, [modal.visible, props]);

  // 组建类型对应的属性
  const fields = fieldPropsMapping[props.componentType] || [];

  // 基本信息
  const formItemProps = fields.filter(
    (item: any) => item.name !== 'fieldProps',
  );
  // 属性配置， 最后是要规整到 fieldProps 中的
  const formItemFieldProps =
    fields.find((item: any) => item.name === 'fieldProps')?.children || [];

  const renderField = (field: any) => {
    const { name, text, type, default: defaultValue, options, tooltip } = field;
    switch (type) {
      case 'string':
        return (
          <ProFormText
            key={name}
            name={name}
            label={text}
            tooltip={tooltip ? { title: tooltip } : undefined}
          />
        );

      case 'number':
        return (
          <ProFormDigit
            key={name}
            name={name}
            label={text}
            tooltip={tooltip ? { title: tooltip } : undefined}
            fieldProps={{
              defaultValue,
              wheel: false,
            }}
          />
        );

      case 'boolean':
        return (
          <ProFormSwitch
            key={name}
            name={name}
            label={text}
            tooltip={tooltip ? { title: tooltip } : undefined}
            fieldProps={{ defaultChecked: defaultValue }}
          />
        );

      case 'select':
        return (
          <ProFormSelect
            key={name}
            name={name}
            label={text}
            tooltip={tooltip ? { title: tooltip } : undefined}
            fieldProps={{ options, defaultValue }}
          />
        );

      case 'object':
        return (
          <ProFormTextArea
            key={name}
            name={name}
            label={text}
            tooltip={tooltip ? { title: tooltip } : undefined}
            fieldProps={{
              autoSize: { minRows: 3 },
            }}
          />
        );

      default:
        break;
    }
  };

  /** 保存配置 */
  const handleFinish = async (values: any) => {
    // 对values进行遍历，把fieldProps中的属性提取出来
    const fieldProps: Record<string, any> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (formItemFieldProps.find((e: any) => e.name === key)) {
        fieldProps[key] = value;
        delete values[key];
      }
    });
    const data: Record<string, any> = {
      name: props.name,
      ...omit(values, 'fieldName'),
    };
    if (Object.keys(fieldProps).length > 0) {
      data.fieldProps = fieldProps;
    }
    props.callback(data);
    modal.hide();
  };

  return (
    <Modal
      title={'编辑控件属性'}
      key="config"
      width={700}
      centered
      destroyOnClose
      forceRender
      open={modal.visible}
      onCancel={modal.hide}
      maskClosable={false}
      okText="提交"
      onOk={() => formRef.current?.submit()}
    >
      <ProForm
        layout="horizontal"
        formRef={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleFinish}
        submitter={false}
      >
        <ProFormText name="fieldName" label="控件名称" readonly />
        <ProCard bordered headerBordered title={<Title text="基本信息" />}>
          {formItemProps.map(renderField)}
        </ProCard>
        {formItemFieldProps.length > 0 && (
          <ProCard bordered headerBordered title={<Title text="属性配置" />}>
            {formItemFieldProps.map(renderField)}
          </ProCard>
        )}
      </ProForm>
    </Modal>
  );
};

export default NiceModal.create<InputFieldModal>(InputFieldModal);
