import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import { IDepartment } from '@/ts/core/target/itarget';
import cls from './index.module.less';
import { ResultType } from '@/ts/base/model';
const { TextArea } = Input;
interface Iprops {
  title: string;
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  selectId?: string;
  editDept?: IDepartment;
}

const EditCustomModal = (props: Iprops) => {
  const { open, title, handleOk, handleCancel, editDept } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      title !== '新增'
        ? form.setFieldsValue({
            ...editDept?.target,
            teamRemark: editDept?.target.team?.remark ?? '',
          })
        : form.resetFields();
    }
  }, [open]);
  const submitData = async () => {
    const value = await form.validateFields();
    if (value) {
      // 编辑自己的部门信息
      if (title === '编辑') {
        if (editDept) {
          const { success, msg } = await editDept.update({
            ...editDept.target,
            teamName: value.name,
            teamCode: value.code,
            ...value,
          });
          if (success) {
            message.success('更新信息成功!');
            handleOk();
          } else {
            message.error('更新信息失败!' + msg);
          }
        }
      } else {
        // 新增部门信息
        const newValue = {
          ...value,
          teamName: value.name,
          teamCode: value.code,
          typeName: TargetType.Department,
        };

        let res: ResultType<any>;
        if (editDept) {
          // 新增下级部门信息
          res = await editDept.createDepartment(newValue);
        } else {
          // 如果是一级部门， 就从根部门里面新增
          res = await userCtrl.Company.createDepartment(newValue);
        }
        if (res.success) {
          message.success(`创建${value.name}成功!`);
          handleOk();
        } else {
          message.error(res.msg);
        }
      }
    }
  };
  return (
    <div className={cls['edit-custom-modal']}>
      <Modal
        title={title}
        open={open}
        onOk={submitData}
        onCancel={() => handleCancel()}
        getContainer={false}
        destroyOnClose>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="部门名称"
                rules={[{ required: true, message: '请输入部门名称!' }]}>
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="部门编号"
                rules={[{ required: true, message: '请输入部门编号!' }]}>
                <Input placeholder="请输入部门编号" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="teamRemark" label="描述">
            <TextArea
              placeholder="请输入部门描述"
              autoSize={{ minRows: 2, maxRows: 3 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditCustomModal;
