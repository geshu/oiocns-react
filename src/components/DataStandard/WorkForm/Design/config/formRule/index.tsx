import { IForm } from '@/ts/core';
import { Accordion } from 'devextreme-react';
import React, { useState } from 'react';
import Rule from './rule';
import { Field } from 'devextreme/ui/filter_builder';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import FormFilter from './filter';

interface IAttributeProps {
  current: IForm;
}

const FormRuleConfig: React.FC<IAttributeProps> = ({ current }) => {
  const [fields, setFields] = useState<(Field & { fieldType: string })[]>([]);
  const [loaded] = useAsyncLoad(async () => {
    const resultFields = await current.loadFields();
    const ss = resultFields.map((a) => {
      switch (a.valueType) {
        case '数值型':
          return {
            name: a.code,
            dataField: a.code,
            caption: a.name,
            dataType: 'number',
            fieldType: '数值型',
          };
        case '日期型':
          return {
            name: a.code,
            dataField: a.code,
            caption: a.name,
            dataType: 'date',
            fieldType: '日期型',
          };
        case '时间型':
          return {
            name: a.code,
            dataField: a.code,
            caption: a.name,
            dataType: 'datetime',
            fieldType: '时间型',
          };
        case '选择型':
          return {
            name: a.code,
            dataField: a.code,
            caption: a.name,
            fieldType: '选择型',
            dataType: 'string',
            lookup: {
              displayExpr: 'text',
              valueExpr: 'value',
              allowClearing: true,
              dataSource: a.lookups,
            },
          };
        case '分类型':
          return {
            name: a.code,
            dataField: a.code,
            caption: a.name,
            fieldType: '分类型',
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
            name: a.code,
            dataField: a.code,
            caption: a.name,
            dataType: 'string',
            fieldType: '未知',
          };
      }
    });
    ss.unshift();
    setFields([
      {
        name: 'name',
        dataField: 'name',
        caption: '表单名称',
        dataType: 'string',
        fieldType: '描述型',
      },
      ...(ss as (Field & { fieldType: string })[]),
    ]);
  }, [current]);

  const loadFilterItem = () => {
    return [
      {
        key: '1',
        title: '表格过滤规则',
        fields: fields,
        filter: current.metadata.options!.dataRange,
        target: current.directory.target.space,
      },
      {
        key: '2',
        title: '办事过滤规则',
        fields: fields,
        filter: current.metadata.options!.workDataRange,
        target: current.directory.target.space,
      },
    ];
  };

  return (
    <div
      style={{
        gap: 10,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 130px)',
        overflow: 'scroll',
      }}>
      {loaded && <Rule fields={fields} form={current}></Rule>}
      <Accordion
        id="accordion-container"
        multiple
        collapsible
        dataSource={loadFilterItem()}
        itemTitleRender={(e) => <span style={{ fontSize: 14 }}>{e.title}</span>}
        itemRender={(e) => <FormFilter {...e} />}
      />
    </div>
  );
};

export default FormRuleConfig;
