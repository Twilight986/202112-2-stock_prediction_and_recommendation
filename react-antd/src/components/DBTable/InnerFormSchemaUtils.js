import React from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  Icon,
  Radio,
  InputNumber,
  Checkbox,
  Cascader
} from 'antd';
import TableUtils from './TableUtils.js';
import moment from 'moment';
import Logger from '../../utils/Logger';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const logger = Logger.getLogger('InnerFormSchemaUtils');

const schemaMap = new Map();
const formMap = new Map();

/**
 */
const SchemaUtils = {

  /**
   *
   * @param tableName
   * @param schema
   * @returns {*}
   */
  getForm(tableName, schema) {
    const ignoreCache = TableUtils.shouldIgnoreSchemaCache(tableName);

    if (formMap.has(tableName)) {
      return formMap.get(tableName);
    } else {
      const newForm = this.createForm(tableName, schema);
      if (!ignoreCache) {
        formMap.set(tableName, newForm);
      }
      return newForm;
    }
  },

  /**
   *
   * @param tableName
   * @param schema
   * @returns {*}
   */
  createForm(tableName, schema) {
    const ignoreCache = TableUtils.shouldIgnoreSchemaCache(tableName);

    const that = this;
    const tmpComponent = React.createClass({
      componentWillMount() {
        if (schemaMap.has(tableName)) {
          this.schemaCallback = schemaMap.get(tableName);
          return;
        }
        const schemaCallback = that.parse(schema);
        if (!ignoreCache) {
          schemaMap.set(tableName, schemaCallback);
        }
        this.schemaCallback = schemaCallback;
      },
      render() {
        return this.schemaCallback(this.props.form.getFieldDecorator);
      },
    });
    return Form.create()(tmpComponent);
  },

  /**
   *
   * @param schema 
   * @returns {function()} 
   */
  parse(schema) {
    const rows = [];
    let cols = [];

    let spaceLeft = 24;
    schema.forEach((field) => {
      let spaceNeed = 8;
      if (field.showType === 'between' && field.dataType === 'datetime') {
        spaceNeed = 16;
      }

      if (spaceLeft < spaceNeed) {
        rows.push(cols);
        cols = [];  
        spaceLeft = 24;  
      }

      switch (field.showType) {
        case 'select':
          cols.push(this.transformSelect(field));
          break;
        case 'radio':
          cols.push(this.transformRadio(field));
          break;
        case 'checkbox':
          cols.push(this.transformCheckbox(field));
          break;
        case 'multiSelect':
          cols.push(this.transformMultiSelect(field));
          break;
        case 'between':
          cols.push(this.transformBetween(field));
          break;
        case 'cascader':
          cols.push(this.transformCascader(field));
          break;
        default:
          cols.push(this.transformNormal(field));
      }

      spaceLeft -= spaceNeed;
    });

    if (cols.length > 0) {
      rows.push(cols);
    }

    return getFieldDecorator => {
      const formRows = []; 
      for (let i = 0; i < rows.length; i++) {
        const formCols = [];  
        for (const col of rows[i]) {
          formCols.push(col(getFieldDecorator));  
        }
        formRows.push(<Row key={i} gutter={16}>{formCols}</Row>);
      }

      return (<Form horizontal>
        {formRows}
      </Form>);
    };
  },

  /**

   *
   * @param formItem 
   * @param field 
   */
  colWrapper(formItem, field) {
    return getFieldDecorator => (
      <Col key={field.key} sm={8}>
        <FormItem key={field.key} label={field.title} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          {formItem(getFieldDecorator)}
        </FormItem>
      </Col>
    );
  },

  /**
   *
   * @param field
   */
  transformSelect(field) {
    logger.debug('transform field %o to Select component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
      <Select placeholder={field.placeholder || 'Please choose one'} size="default">
        {options}
      </Select>
    ), field);
  },

  /**
   *
   * @param field
   */
  transformRadio(field) {
    logger.debug('transform field %o to Radio component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>);
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
      <RadioGroup>
        {options}
      </RadioGroup>
    ), field);
  },

  /**
   *
   * @param field
   */
  transformCheckbox(field) {
    logger.debug('transform field %o to Checkbox component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push({label: option.value, value: option.key});
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
      <CheckboxGroup options={options}/>
    ), field);
  },

  /**
   *
   * @param field
   * @returns {XML}
   */
  transformMultiSelect(field) {
    logger.debug('transform field %o to MultipleSelect component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });

    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
      <Select multiple placeholder={field.placeholder || '请选择'} size="default">
        {options}
      </Select>
    ), field);
  },

  /**
   *
   * @param field
   * @returns {XML}
   */
  transformCascader(field) {
    logger.debug('transform field %o to Cascader component', field);
    return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
      <Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default"/>
    ), field);
  },

  /**
   *
   * @param field
   * @returns {XML}
   */
  transformNormal(field) {
    switch (field.dataType) {
      case 'int':
        logger.debug('transform field %o to integer input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
          <InputNumber size="default" max={field.max} min={field.min} placeholder={field.placeholder}/>
        ), field);
      case 'float':
        logger.debug('transform field %o to float input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
          <InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}/>
        ), field);
      case 'datetime':
        logger.debug('transform field %o to datetime input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue ? moment(field.defaultValue) : null})(
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || 'Please choose date'}/>
        ), field);
      default:  
        logger.debug('transform field %o to varchar input component', field);
        return this.colWrapper(getFieldDecorator => getFieldDecorator(field.key, {initialValue: field.defaultValue})(
          <Input placeholder={field.placeholder} size="default" addonBefore={field.addonBefore}
                 addonAfter={field.addonAfter}/>
        ), field);
    }
  },

  /**
   *
   * @param beginFormItem
   * @param endFormItem
   * @param field
   */
  betweenColWrapper(beginFormItem, endFormItem, field) {
    return getFieldDecorator => (
      <Col key={`${field.key}Begin`} sm={8}>
        <Row>
          <Col span={16}>
            <FormItem key={`${field.key}Begin`} label={field.title} labelCol={{ span: 15 }} wrapperCol={{ span: 9 }}>
              {beginFormItem(getFieldDecorator)}
            </FormItem>
          </Col>
          <Col span={7} offset={1}>
            <FormItem key={`${field.key}End`} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              {endFormItem(getFieldDecorator)}
            </FormItem>
          </Col>
        </Row>
      </Col>
    );
  },

  /**
   *
   * @param field
   */
  transformBetween(field) {
    let beginFormItem;
    let endFormItem;

    switch (field.dataType) {
      case 'int':
        logger.debug('transform field %o to integer BETWEEN component', field);
        beginFormItem = getFieldDecorator => getFieldDecorator(`${field.key}Begin`, {initialValue: field.defaultValueBegin})
        (<InputNumber size="default" placeholder={field.placeholderBegin || 'Minimun'}/>);
        endFormItem = getFieldDecorator => getFieldDecorator(`${field.key}End`, {initialValue: field.defaultValueEnd})
        (<InputNumber size="default" placeholder={field.placeholderEnd || 'Maximum'}/>);
        return this.betweenColWrapper(beginFormItem, endFormItem, field);
      case 'float':
        logger.debug('transform field %o to float BETWEEN component', field);
        beginFormItem = getFieldDecorator => getFieldDecorator(`${field.key}Begin`, {initialValue: field.defaultValueBegin})
        (<InputNumber step={0.01} size="default" placeholder={field.placeholderBegin || 'Minimum'}/>);
        endFormItem = getFieldDecorator => getFieldDecorator(`${field.key}End`, {initialValue: field.defaultValueEnd})
        (<InputNumber step={0.01} size="default" placeholder={field.placeholderEnd || 'Maximum'}/>);
        return this.betweenColWrapper(beginFormItem, endFormItem, field);
      case 'datetime':
        logger.debug('transform field %o to datetime BETWEEN component', field);
        return getFieldDecorator => (
          <div key={'datetimeBetweenDiv'}>
            <Col key={`${field.key}Begin`} sm={8}>
              <FormItem key={`${field.key}Begin`} label={field.title} labelCol={{ span: 10 }}
                        wrapperCol={{ span:14 }}>
                {getFieldDecorator(`${field.key}Begin`, {initialValue: field.defaultValueBegin ? moment(field.defaultValueBegin) : null})
                (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholderBegin || 'Start Date'}/>)}
              </FormItem>
            </Col>
            <Col key={`${field.key}End`} sm={8}>
              <FormItem key={`${field.key}End`} labelCol={{ span: 10 }} wrapperCol={{ span:14 }}>
                {getFieldDecorator(`${field.key}End`, {initialValue: field.defaultValueEnd ? moment(field.defaultValueEnd) : null})
                (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholderEnd || 'End Date'}/>)}
              </FormItem>
            </Col>
          </div>
        );
      default:
        logger.error('unknown dataType: %s', field.dataType);
    }
    return null;
  },
};

export default SchemaUtils;
