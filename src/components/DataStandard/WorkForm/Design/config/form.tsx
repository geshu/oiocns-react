import { Emitter } from '@/ts/base/common';
import { IForm } from '@/ts/core';
import { FilterBuilder, Form } from 'devextreme-react';
import { GroupItem, SimpleItem } from 'devextreme-react/form';
import React, { useEffect, useState } from 'react';

interface IAttributeProps {
  current: IForm;
  notifyEmitter: Emitter;
}

const FormConfig: React.FC<IAttributeProps> = ({ notifyEmitter, current }) => {
  const notityAttrChanged = () => {
    notifyEmitter.changCallback('form');
  };
  const [value, setValue] = useState<any>(
    JSON.parse(current.metadata.searchRule ?? '{}'),
  );
  const [fields, setFields] = useState<any[]>([]);
  useEffect(() => {
    current.loadFields().then((f) => {
      const fields = f.map((a) => {
        switch (a.valueType) {
          case '数值型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'number',
            };
          case '日期型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'date',
            };
          case '时间型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'datetime',
            };
          case '选择型':
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'string',
              lookup: {
                displayExpr: 'text',
                valueExpr: 'value',
                allowClearing: true,
                dataSource: a.lookups,
              },
            };
          default:
            return {
              dataField: a.code,
              caption: a.name,
              dataType: 'string',
            };
        }
      });
      setFields([
        {
          dataField: 'name',
          caption: '表单名称',
          dataType: 'string',
        },
        ...fields,
      ]);
    });
  }, [current]);
  return (
    <>
      <Form
        scrollingEnabled
        height={'calc(100vh - 130px)'}
        formData={current.metadata}
        onFieldDataChanged={notityAttrChanged}>
        <GroupItem caption={'表单参数'} />
        <SimpleItem dataField="name" isRequired={true} label={{ text: '名称' }} />
        <SimpleItem dataField="code" isRequired={true} label={{ text: '代码' }} />
        <SimpleItem
          dataField="labels"
          label={{ text: '根标签集' }}
          editorType="dxTagBox"
          editorOptions={{
            displayExpr: 'name',
            valueExpr: 'id',
            dataSource: current.metadata.attributes.filter((i) => i && i.propId),
          }}
        />
        <SimpleItem
          dataField="options.itemWidth"
          editorType="dxNumberBox"
          label={{ text: '特性宽度' }}
          editorOptions={{
            min: 200,
            max: 800,
            step: 10,
            format: '#(px)',
            defaultValue: 300,
            showClearButton: true,
            showSpinButtons: true,
          }}
        />
        <SimpleItem
          dataField="remark"
          editorType="dxTextArea"
          isRequired={true}
          label={{ text: '表单描述' }}
          editorOptions={{
            height: 100,
          }}
        />
        <GroupItem caption={'数据过滤规则'} />
        {fields.length > 0 && (
          <SimpleItem>
            <FilterBuilder
              fields={fields}
              value={value}
              groupOperations={['and', 'or']}
              onValueChanged={(e) => {
                setValue(e.value);
                current.metadata.searchRule = JSON.stringify(e.value);
                notityAttrChanged();
              }}
            />
          </SimpleItem>
        )}
      </Form>
    </>
  );
};

export default FormConfig;
