import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  InputNumber,
  Checkbox,
  Cascader
} from 'antd';
import TableUtils from './TableUtils.js';
import FileUploader from '../FileUploader';
import moment from 'moment';
import Logger from '../../utils/Logger';
import {ACTION_KEY} from './InnerTableRenderUtils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const logger = Logger.getLogger('InnerTableSchemaUtils');

const tableSchemaMap = new Map();
const formSchemaMap = new Map();
const formMap = new Map(); 

/**
 * 
 */
const SchemaUtils = {

  /**
   * 
   *
   * @param tableName
   * @param schema
   * @returns {*}
   */
  getTableSchema(tableName, schema) {
    if (tableSchemaMap.has(tableName)) {
      return tableSchemaMap.get(tableName);
    }

    const toCache = {};
    const newCols = [];
    const fieldMap = new Map();
    schema.forEach((field) => {
      if (field.options) {
        field.$$optionMap = this.transformOptionMap(field.options, field.showType);
      }

      fieldMap.set(field.key, field);
      if (field.primary) {
        toCache.primaryKey = field.key;
      }
      if (field.showInTable === false) {
        return;
      }
      const col = {};
      col.key = field.key;
      col.dataIndex = field.key;
      col.title = field.title;
      col.width = field.width;
      col.sorter = field.sorter;

      newCols.push(col);
    });

    toCache.tableSchema = newCols;
    toCache.fieldMap = fieldMap;

    const ignoreCache = TableUtils.shouldIgnoreSchemaCache(tableName);
    if (!ignoreCache) {
      tableSchemaMap.set(tableName, toCache);
    }

    return toCache;
  },

  /**
   * 
   *
   * @param options
   * @param showType
   * @returns {{}}
   */
  transformOptionMap(options, showType){
    const optionMap = {};

    if (showType === 'cascader') {
      const browseOption = (item) => {  // dfs
        optionMap[item.value] = item.label;
        if (item.children) {
          item.children.forEach(browseOption);
        }
      };
      options.forEach(browseOption);
    } else {
      for (const option of options) {
        optionMap[option.key] = option.value;
      }
    }

    return optionMap;
  },

  /**
   * 
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
        if (formSchemaMap.has(tableName)) {
          this.schemaCallback = formSchemaMap.get(tableName);
          return;
        }
        const schemaCallback = that.parseFormSchema(schema);
        if (!ignoreCache) {
          formSchemaMap.set(tableName, schemaCallback);
        }
        this.schemaCallback = schemaCallback;
      },
      componentDidMount(){
        if (this.props.initData) {  
          this.props.form.setFieldsValue(this.props.initData);
        }
      },
      render() {
        return this.schemaCallback(this.props.form.getFieldDecorator, this.props.forUpdate, this.props.keysToUpdate);
      },
    });
    return Form.create()(tmpComponent);
  },

  /**
   * 
   *
   * @param schema
   * @returns {function()}
   */
  parseFormSchema(schema) {
    this.parseValidator(schema);

    const rows = [];
    schema.forEach((field) => {
      if (field.showInForm === false)
        return;
      if (field.key === ACTION_KEY)
        return;
      rows.push(this.transFormField(field));
    });

    return (getFieldDecorator, forUpdate, keysToUpdate) => {
      const formRows = []; 
      for (const row of rows) {
        formRows.push(row(getFieldDecorator, forUpdate, keysToUpdate));
      }

      return (<Form horizontal>
        {formRows}
      </Form>);
    };
  },

  /**
   * 
   * 
   *
   * @param schema
   */
  parseValidator(schema){
    schema.forEach((field) => {
      if (!field.validator)
        return;

      const newRules = [];
      for (const rule of field.validator) {
        newRules.push(Object.assign({}, rule, {required: false})); 
      }
      field.$$updateValidator = newRules;
    });
  },

  colWrapper(formItem, field) {
    return (getFieldDecorator, forUpdate, keysToUpdate) => {
      if (forUpdate === true && keysToUpdate && !keysToUpdate.has(field.key)) {
        return null;
      }

      return (<FormItem key={field.key} label={field.title} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {formItem(getFieldDecorator, forUpdate)}
      </FormItem>);
    }
  },

  transFormField(field) {
    if (field.primary === true) {
      logger.debug('key %o is primary, transform to text area', field);
      return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key)(
        <Input type="textarea" autosize={{ minRows: 1, maxRows: 10 }} disabled size="default"/>
      ), field);
    }

    switch (field.showType) {
      case 'select':
        return this.transformSelect(field);
      case 'radio':
        return this.transformRadio(field);
      case 'checkbox':
        return this.transformCheckbox(field);
      case 'multiSelect':
        return this.transformMultiSelect(field);
      case 'textarea':
        return this.transformTextArea(field);
      case 'image':
        return this.transformImage(field);
      case 'file':
        return this.transformFile(field);
      case 'cascader':
        return this.transformCascader(field);
      default:
        return this.transformNormal(field);
    }
  },

  /**
   * 
   *
   * @param field
   */
  transformSelect(field) {
    logger.debug('transform field %o to Select component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
    });

    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <Select placeholder={field.placeholder || 'Please select'} size="default" disabled={field.disabled}>
        {options}
      </Select>
    ), field);
  },

  /**
   * 
   *
   * @param field
   */
  transformRadio(field) {
    logger.debug('transform field %o to Radio component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>);
    });

    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <RadioGroup disabled={field.disabled}>
        {options}
      </RadioGroup>
    ), field);
  },

  /**
   * 
   *
   * @param field
   */
  transformCheckbox(field) {
    logger.debug('transform field %o to Checkbox component', field);
    const options = [];
    field.options.forEach((option) => {
      options.push({label: option.value, value: option.key});
    });

    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <CheckboxGroup options={options} disabled={field.disabled}/>
    ), field);
  },

  /**
   * 
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

    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <Select multiple placeholder={field.placeholder || 'Please select'} size="default" disabled={field.disabled}>
        {options}
      </Select>
    ), field);
  },

  /**
   * 
   *
   * @param field
   * @returns {XML}
   */
  transformTextArea(field) {
    logger.debug('transform field %o to textarea component', field);
    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <Input type="textarea" placeholder={field.placeholder || 'Please select'} autosize={{ minRows: 2, maxRows: 10 }}
             disabled={field.disabled} size="default"/>
    ), field);
  },

  /**
   * 
   *
   * @param field
   * @returns {XML}
   */
  transformImage(field) {
    logger.debug('transform field %o to image component', field);
    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <FileUploader max={field.max} url={field.url} sizeLimit={field.sizeLimit} accept={field.accept}
                    placeholder={field.placeholder} type="image"/>
    ), field);
  },

  /**
   * 
   *
   * @param field
   * @returns {XML}
   */
  transformFile(field) {
    logger.debug('transform field %o to file component', field);
    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <FileUploader max={field.max} url={field.url} sizeLimit={field.sizeLimit} accept={field.accept}
                    placeholder={field.placeholder}/>
    ), field);
  },

  /**
   * 
   *
   * @param field
   * @returns {XML}
   */
  transformCascader(field) {
    logger.debug('transform field %o to Cascader component', field);
    return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
      initialValue: forUpdate ? undefined : field.defaultValue,
      rules: forUpdate ? field.$$updateValidator : field.validator,
    })(
      <Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || 'Please select'} size="default"
                disabled={field.disabled}/>
    ), field);
  },

  /**
   * 
   *
   * @param field
   * @returns {XML}
   */
  transformNormal(field) {
    switch (field.dataType) {
      case 'int':
        logger.debug('transform field %o to integer input component', field);
        return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
          initialValue: forUpdate ? undefined : field.defaultValue,
          rules: forUpdate ? field.$$updateValidator : field.validator,
        })(
          <InputNumber size="default" max={field.max} min={field.min} placeholder={field.placeholder}
                       disabled={field.disabled}/>
        ), field);
      case 'float':
        logger.debug('transform field %o to float input component', field);
        return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
          initialValue: forUpdate ? undefined : field.defaultValue,
          rules: forUpdate ? field.$$updateValidator : field.validator,
        })(
          <InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}
                       disabled={field.disabled}/>
        ), field);
      case 'datetime':
        logger.debug('transform field %o to datetime input component', field);
        return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
          initialValue: forUpdate ? undefined : (field.defaultValue ? moment(field.defaultValue) : null),  
          rules: forUpdate ? field.$$updateValidator : field.validator,
        })(
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || 'Please select date'}
                      disabled={field.disabled}/>
        ), field);
      default:  
        logger.debug('transform field %o to varchar input component', field);
        return this.colWrapper((getFieldDecorator, forUpdate) => getFieldDecorator(field.key, {
          initialValue: forUpdate ? undefined : field.defaultValue,
          rules: forUpdate ? field.$$updateValidator : field.validator,
        })(
          <Input placeholder={field.placeholder} size="default" addonBefore={field.addonBefore}
                 addonAfter={field.addonAfter} disabled={field.disabled}/>
        ), field);
    }
  },
};

export default SchemaUtils;
