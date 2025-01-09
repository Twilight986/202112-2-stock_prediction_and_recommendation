import React from 'react';
import {
  Button,
  Table,
  Icon,
  Modal,
  message,
  notification,
  Affix
} from 'antd';
import Logger from '../../utils/Logger';
import Utils from '../../utils';
import ajax from '../../utils/ajax';
import moment from 'moment';
import ImageSlider from '../ImageSlider';
import InnerTableSchemaUtils from './InnerTableSchemaUtils';
import InnerTableRenderUtils, {ACTION_KEY} from './InnerTableRenderUtils';

const logger = Logger.getLogger('InnerTable');

/**
 */
class InnerTable extends React.PureComponent {


  state = {
    modalVisible: false,  
    modalTitle: '新增',  
    modalInsert: true, 

    selectedRowKeys: [], 
    data: [],  
    
    previewVisible: false, 
    previewImages: [], 
    
    componentModalVisible: false,
  };

  /**
   */
  componentWillMount() {
    this.parseTableSchema(this.props);
    this.parseTableData(this.props);
  }

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    logger.debug('receive new props and try to render, nextProps=%o', nextProps);

    if (this.props.tableName !== nextProps.tableName) {
      logger.debug('tableName changed and try to refresh schema');
      this.parseTableSchema(nextProps);
      this.formComponent = undefined;  
    }

    this.state.modalVisible = false;
    this.state.modalTitle = 'New';
    this.state.modalInsert = true;
    this.state.selectedRowKeys = [];

    if (this.props.tableName !== nextProps.tableName || !nextProps.tableLoading) {
      this.parseTableData(nextProps);
    }
  }

  /**
   */
  componentWillUnmount() {
    logger.debug('InnerTable component unmount and reset RenderUtils');
    InnerTableRenderUtils.reset();
  }



  /**
   */
  parseTableSchema(props) {
    const {tableName, schema} = props;
    const parseResult = InnerTableSchemaUtils.getTableSchema(tableName, schema);

    this.primaryKey = parseResult.primaryKey;
    this.fieldMap = parseResult.fieldMap;
    this.tableSchema = InnerTableRenderUtils.bindRender(parseResult.tableSchema, tableName, this);
  }

  /**
   */
  parseTableData(props) {
    const newData = [];
    let i = 0;
    props.data.forEach((obj) => {
      const newObj = this.transformRawDataToTable(obj);
      if (this.primaryKey) {
        newObj.key = obj[this.primaryKey];
      } else {
        newObj.key = i;
        i++;
      }
      newData.push(newObj);
    });

    //this.setState({data: newData});
    this.state.data = newData;
  }

  /**
   * 
   */
  transformRawDataToTable(obj) {
    const newObj = {};

    for (const key in obj) {
      if (this.fieldMap.get(key).$$optionMap) {
        const optionMap = this.fieldMap.get(key).$$optionMap;
        if (obj[key] instanceof Array) {
          const newArray = [];
          for (const optionKey of obj[key]) {
            newArray.push(optionMap[optionKey]);
          }
          newObj[key] = newArray.join(',');
        } else {
          newObj[key] = optionMap[obj[key]];
        }
      } else {
        newObj[key] = obj[key];
      }
    }

    newObj.$$rawData = obj;  
    return newObj;
  }

  /**
   * 
   */
  transformRawDataToForm(obj) {
    const newObj = {};

    for (const key in obj) {
      if (!obj[key])
        continue;

      if (this.fieldMap.get(key).dataType === 'datetime') {
        newObj[key] = moment(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  }

  /**
   * 
   */
  transformTableDataToForm(obj) {
    return this.transformRawDataToForm(obj.$$rawData);
  }

  /**
   * 
   */
  setFormData(data) {
    if (this.formComponent) {
      this.formComponent.resetFields();
      if (data) {
        this.formComponent.setFieldsValue(data);
      }
    } else {
      this.formInitData = data;
    }
  }



  /**
   * 
   *
   * @param e
   */
  onClickInsert = (e) => {
    e.preventDefault();
    // this.setFormData({});
    this.setState({
      modalVisible: true,
      modalTitle: '新增',
      modalInsert: true,
    }, () => this.setFormData({}));
  };

  /**
   * 
   *
   * @param e
   */
  onClickUpdate = (e) => {
    e.preventDefault();

    this.singleRecordKey = undefined;
    this.keysToUpdate = undefined;

    const newData = {};
    const multiSelected = this.state.selectedRowKeys.length > 1; 
    
    if (!multiSelected) {
      logger.debug('update single record, and fill original values');
      const selectedKey = this.state.selectedRowKeys[0];
      for (const record of this.state.data) {
        if (record.key === selectedKey) {
          Object.assign(newData, this.transformTableDataToForm(record));
          break;
        }
      }
    } else {
      newData[this.primaryKey] = this.state.selectedRowKeys.join(', ');
      logger.debug('update multiple records, keys = %s', newData[this.primaryKey]);
    }

    //this.setFormData(newData);

    if (multiSelected) {
      this.setState({modalVisible: true, modalTitle: 'Bulk Update', modalInsert: false}, () => this.setFormData(newData));
    } else {
      this.setState({modalVisible: true, modalTitle: 'Update', modalInsert: false}, () => this.setFormData(newData));
    }
  };


  /**
   * 
   *
   * @param e
   */
  onClickDelete = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: this.state.selectedRowKeys.length > 1 ? 'Confirm Bulk deletion' : 'Confirm Single Deletion',
      content: `Selected row: ${this.state.selectedRowKeys.join(', ')}`,
      onOk: () => {
        this.handleDelete();
      },
    });
  };

  /**
   * 
   *
   * @param selectedRowKeys
   */
  onTableSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  };

  /**
   * 
   */
  hideModal = () => {
    this.setState({modalVisible: false});
  };

  /**
   * 
   */
  handleModalOk = () => {
    let validated = true;
    this.formComponent.validateFieldsAndScroll((err, values) => validated = err ? false : validated); 
    if (!validated) {
      logger.debug('validate form error');
      return;
    }

    const newObj = {};

    const oldObj = this.formComponent.getFieldsValue(); 
    for (const key in oldObj) {

      if (oldObj[key] === undefined || oldObj[key] === null) {
        continue;
      }

      if (key === this.primaryKey && typeof oldObj[key] === 'string') {  

      } else if (oldObj[key] instanceof Date) {
        newObj[key] = oldObj[key].format('yyyy-MM-dd HH:mm:ss');
      } else if (moment.isMoment(oldObj[key])) {  
        newObj[key] = oldObj[key].format('YYYY-MM-DD HH:mm:ss');
      } else {
        newObj[key] = oldObj[key];
      }
    }

    this.hideModal();
    logger.debug('click modal OK and the form obj = %o', newObj);

    if (this.state.modalInsert) {
      this.handleInsert(newObj);
    } else {

      if (this.singleRecordKey) {
        const keys = [];
        keys.push(this.singleRecordKey);
        this.handleUpdate(newObj, keys);
      } else {
        this.handleUpdate(newObj);
      }
    }
  };

  /**
   * 
   *
   * @param text
   */
  onClickImage = (text) => {
    const newImageArray = [];
    if (Utils.isString(text) && text.length > 0) {
      newImageArray.push({url: text, alt: 'Image loading failed'});
    } else if (text instanceof Array) {
      for (const tmp of text) {
        newImageArray.push({url: tmp, alt: 'Image loading failed'});
      }
    }
    if (newImageArray.length > 0) {
      this.setState({previewVisible: true, previewImages: newImageArray});
    }
  };

  /**
   * 
   */
  cancelPreview = () => {
    this.setState({previewVisible: false});
  };

  /**
   * 
   *
   * @param record 
   * @param keysToUpdate 
   */
  onSingleRecordUpdate = (record, keysToUpdate) => {
    
    const transformedRecord = this.transformTableDataToForm(record);
    this.singleRecordKey = record[this.primaryKey];  
    if (keysToUpdate) {
      this.keysToUpdate = new Set(keysToUpdate);
    } else {
      this.keysToUpdate = undefined;
    }

    this.setState({
      modalVisible: true,
      modalTitle: '更新',
      modalInsert: false,
    }, () => this.setFormData(transformedRecord));  
  };

  /**
   * 
   *
   * @param record
   */
  onSingleRecordDelete = (record) => {
    const selectedKey = record[this.primaryKey];
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Selected Row: ${selectedKey}`,
      onOk: () => {
        const keys = [];
        keys.push(selectedKey);
        this.handleDelete(keys);
      },
    });
  };

  /**
   * 
   *
   * @param record 
   * @param component 
   * @param name 
   */
  onSingleRecordComponent = (record, component, name) => {
    this.updateComponent = component;  
    this.updateComponentRecord = record;
    this.updateComponentModalTitle = name;
    this.setState({componentModalVisible: true});
  };

  /**
   * 
   */
  handleComponentModalCancel = () => {
    this.setState({componentModalVisible: false});
  };

  /**
   * 
   */
  handleComponentModalOk = () => {
    this.setState({componentModalVisible: false});
    if (!this.updateComponentMounted) {  
      logger.error('user-defined component does not mount');
      return;
    }
    if (!this.updateComponentMounted.getFieldsValue) {
      logger.debug('user does not define getFieldsValue function');
      return;
    }
    const data = this.updateComponentMounted.getFieldsValue();
    logger.debug('user-defined component getFieldsValue = %o', data);
    if (!data) {
      return;
    }
    const keys = [];
    keys.push(this.updateComponentRecord[this.primaryKey]);
    this.handleUpdate(data, keys);

  };




  error(errorMsg) {
    notification.error({
      message: 'Error',
      description: `Please contact administrator, wrong message: ${errorMsg}`,
      duration: 0,
    });
  }

  /**
   * 
   */
  async handleInsert(obj) {
    const CRUD = ajax.CRUD(this.props.tableName);
    const hide = message.loading('Newly added...', 0);
    try {
      const res = await CRUD.insert(obj);
      hide();
      if (res.success) {
        notification.success({
          message: 'Add successfully',
          description: this.primaryKey ? `Newly added row PK=${res.data[this.primaryKey]}` : '',
          duration: 3,
        });

        const newData = [];
        const transformedData = this.transformRawDataToTable(res.data);
        if (this.primaryKey) {
          transformedData.key = res.data[this.primaryKey];
        } else {
          transformedData.key = Math.floor(Math.random() * 233333);  // MAGIC NUMBER
        }
        newData.push(transformedData);

        for (const record of this.state.data) {
          newData.push(record);
        }

        this.setState({selectedRowKeys: [], data: newData});
      } else {
        this.error(res.message);
      }
    } catch (ex) {
      logger.error('insert exception, %o', ex);
      hide();
      this.error(`Request failed: ${ex.message}`);
    }
  }

  /**
   * 
   */
  async handleUpdate(obj, keys = this.state.selectedRowKeys) {
    const CRUD = ajax.CRUD(this.props.tableName);
    const hide = message.loading('Updating...', 0);
    try {
      const res = await CRUD.update(keys, obj);
      hide();
      if (res.success) {
        notification.success({
          message: 'Update success',
          description: `Update${res.data} rows`,
          duration: 3,
        });

        const transformedData = this.transformRawDataToTable(obj);
        const newData = [];
        const keySet = new Set(keys);  
        for (const record of this.state.data) {
          if (keySet.has(record.key)) { 
            const newRecord = Object.assign({}, record, transformedData);
            newRecord.$$rawData = Object.assign({}, record.$$rawData, transformedData.$$rawData);
            logger.debug('newRecord = %o', newRecord);
            newData.push(newRecord);
          } else {
            newData.push(record);
          }
        }
        this.setState({selectedRowKeys: [], data: newData});
      } else {
        this.error(res.message);
      }
    } catch (ex) {
      logger.error('update exception, %o', ex);
      hide();
      this.error(`Request failed: ${ex.message}`);
    }
  }

  /**
   * 
   */
  async handleDelete(keys = this.state.selectedRowKeys) {
    const CRUD = ajax.CRUD(this.props.tableName);
    const hide = message.loading('Deleting...', 0);
    try {
      const res = await CRUD.delete(keys);
      hide();
      if (res.success) {
        notification.success({
          message: 'delete success',
          description: `deleted ${res.data} rows`,
          duration: 3,
        });

        const newData = [];
        const keySet = new Set(keys);  
        for (const record of this.state.data) {
          if (!keySet.has(record.key)) { 
            newData.push(record);
          }
        }
        this.setState({selectedRowKeys: [], data: newData});
      } else {
        this.error(res.message);
      }
    } catch (ex) {
      logger.error('delete exception, %o', ex);
      hide();
      this.error(`Request failed: ${ex.message}`);
    }
  }


  render() {
    const {tableName, schema, tableLoading, tableConfig} = this.props;

    const FormComponent = InnerTableSchemaUtils.getForm(tableName, schema);

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onTableSelectChange,
    };

    const hasSelected = this.state.selectedRowKeys.length > 0;  
    const multiSelected = this.state.selectedRowKeys.length > 1; 

    const UpdateComponent = this.updateComponent;

    return (
      <div>
        <div className="db-table-button">
          <Affix offsetTop={8} target={() => document.getElementById('main-content-div')}>
            <Button.Group>
              {tableConfig.showInsert &&
              <Button type="primary" onClick={this.onClickInsert}>
                <Icon type="plus-circle-o"/> buy
              </Button>}
              {tableConfig.showUpdate &&
              <Button type="primary" disabled={!hasSelected || !this.primaryKey} onClick={this.onClickUpdate}>
                <Icon type="edit"/> {multiSelected ? 'Batch Transfer' : 'transfer'}
              </Button>}
              {tableConfig.showDelete &&
              <Button type="primary" disabled={!hasSelected || !this.primaryKey} onClick={this.onClickDelete}>
                <Icon type="delete"/> {multiSelected ? 'Batch Delete' : 'delete'}
              </Button>}
            </Button.Group>
          </Affix>
          <Modal title={this.state.modalTitle} visible={this.state.modalVisible} onOk={this.handleModalOk}
                 onCancel={this.hideModal} maskClosable={false} width={550}>
            <FormComponent ref={(input) => { this.formComponent = input; }} initData={this.formInitData}
                           forUpdate={!this.state.modalInsert} keysToUpdate={this.keysToUpdate}/>
          </Modal>
        </div>

        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.cancelPreview}>
          <ImageSlider items={this.state.previewImages}/>
        </Modal>

        <Modal title={this.updateComponentModalTitle} visible={this.state.componentModalVisible}
               onCancel={this.handleComponentModalCancel}
               onOk={this.handleComponentModalOk} maskClosable={false}>
          {this.updateComponent &&
          <UpdateComponent ref={(input) => { this.updateComponentMounted = input; }}
                           record={this.updateComponentRecord}/>}
        </Modal>

        <Table rowSelection={rowSelection} columns={this.tableSchema} dataSource={this.state.data} pagination={false}
               loading={tableLoading}/>
      </div>
    );
  }

}

export default InnerTable;
