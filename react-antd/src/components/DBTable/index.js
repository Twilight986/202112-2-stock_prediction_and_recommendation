import React from 'react';
import {message, notification, Spin} from 'antd';
import Error from '../Error';
import InnerForm from './InnerForm.js';
import InnerTable from './InnerTable.js';
import InnerPagination from './InnerPagination.js';
import TableUtils from './TableUtils.js';
import './index.less';
import ajax from '../../utils/ajax';
import Utils from '../../utils';
import globalConfig from '../../config.js';
import Logger from '../../utils/Logger';

const logger = Logger.getLogger('DBTable');

/**
 */
class DBTable extends React.PureComponent {


  state = {
    loadingSchema: false, 

    queryObj: {},

    data: [],  
    tableLoading: false, 

    currentPage: 1,
    pageSize: globalConfig.DBTable.pageSize || 50, 
    showSizeChanger: globalConfig.DBTable.showSizeChanger,
    pageSizeOptions: globalConfig.DBTable.pageSizeOptions,
    total: 0, 
  };


  componentWillMount() {
    this.processQueryParams();
    this.tryFetchSchema(this.props, (res) => {
      this.updateTableState(res);
      if (this.state.loadingSchema) {
        this.setState({loadingSchema: false}, this.refresh);
      }
    });
  }

  /**
   */
  componentDidMount() {
    if (!this.state.loadingSchema) {
      this.refresh();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (globalConfig.tabMode.enable === true) {
      logger.debug('ignore props update under tabMode');
      return;
    }

    const action = this.props.location.action;
    if (action === 'PUSH') {
      return;
    }

    logger.debug('receive new props and try to render, nextProps = %o', nextProps);
    if (nextProps.routes) {
      const routes = nextProps.routes;
      const nextTableName = routes[routes.length - 1].tableName;
      if (nextTableName === this.tableName) {
        return;
      }
    }

    this.tryFetchSchema(nextProps, (res) => {
      this.updateTableState(res);
      this.state.queryObj = {};
      this.processQueryParams();
      this.setState({
        data: [],
        tableLoading: false,
        currentPage: 1,
        total: 0,
        loadingSchema: false,
      }, this.refresh);
    });
  }

  /**
   *
   * @param props
   * @param callback
   * @returns {undefined}
   */
  async tryFetchSchema(props, callback) {
    const routes = props.routes;
    const tableName = routes.pop().tableName;
    if (tableName) {
      logger.info('init component DBTable with tableName = %s', tableName);
    } else {
      logger.error('can not find tableName, check your router config');
      this.inited = false; 
      this.errorMsg = 'can not find the table, please check the router';  
      return;
    }

    const tableConfig = TableUtils.getTableConfig(tableName);

    let tmp = TableUtils.getCacheSchema(tableName);
    if (!tmp) {
      if (tableConfig.asyncSchema === true) {
        this.state.loadingSchema = true;
        tmp = await TableUtils.getRemoteSchema(tableName);
      } else {
        tmp = TableUtils.getLocalSchema(tableName);
      }
    }

    const res = {...tmp, tableName, tableConfig};
    callback(res);
  }

  /**
   *
   * @param input
   */
  updateTableState(input) {

    this.tableName = input.tableName;
    this.tableConfig = input.tableConfig;

    if (input.querySchema) {
      this.querySchema = input.querySchema;
    } else {
      this.inited = false;
      this.errorMsg = `loading${input.tableName}'s querySchema table falied, please check config`;
      return;
    }

    if (input.dataSchema) {
      this.dataSchema = input.dataSchema;
    } else {
      this.inited = false;
      this.errorMsg = `loading${input.tableName}'s querySchema table falied, please check config`;
      return;
    }

    this.inited = true;
  }

  /**
   */
  processQueryParams() {
    const params = Utils.getAllQueryParams();
    if (Object.keys(params).length > 0) {
      this.state.queryObj = Object.assign({}, this.state.queryObj, params);
    }
  }

  /**
   */
  refresh = async() => {
    if (!this.inited) {
      return;
    }

    const res = await this.select(this.state.queryObj, this.state.currentPage, this.state.pageSize);
    if (res.success) {
      this.setState({
        data: res.data,
        total: res.total,
        tableLoading: false,
      });
    } else {
      this.error(res.message);
    }
  };

  /**
   *
   * @param errorMsg
   */
  error = (errorMsg) => {
    notification.error({
      message: 'Error!',
      description: `Please contact the administrator. Wrong message: ${errorMsg}`,
      duration: 0,
    });
    this.setState({tableLoading: false});
  };

  /**
   *
   * @param queryObj 
   * @param page
   * @param pageSize
   * @returns {Promise}
   */
  async select(queryObj, page, pageSize) {
    const tmpObj = Object.assign({}, queryObj);  
    tmpObj.page = page;
    tmpObj.pageSize = pageSize;

    const hide = message.loading('正在查询...', 0);
    try {
      const CRUD = ajax.CRUD(this.tableName);
      this.setState({tableLoading: true});
      const res = await CRUD.select(tmpObj);
      hide();
      return res;
    } catch (ex) {  
      logger.error('select exception, %o', ex);
      hide();
      const res = {};  
      res.success = false;
      res.message = `Request Failed: ${ex.message}`;
      return Promise.resolve(res);  
    }
  }

  /**
   *
   * @param page
   */
  handlePageChange = async(page) => {
    logger.debug('handlePageChange, page = %d', page);
    const res = await this.select(this.state.queryObj, page, this.state.pageSize);
    if (res.success) {
      this.setState({
        currentPage: page,
        data: res.data,
        total: res.total,
        tableLoading: false,
      });
    } else {
      this.error(res.message);
    }
  };

  /**
   *
   * @param page
   */
  handleShowPageChange = async(page, pageSize) => {
    logger.debug('handleShowPageSizeChange, page = %d', page);
    const res = await this.select(this.state.queryObj, page, pageSize);
    if (res.success) {
      this.setState({
        currentPage: page,
        data: res.data,
        total: res.total,
        tableLoading: false,
        pageSize: pageSize,
      });
    } else {
      this.error(res.message);
    }
  };

  /**
   *
   * @param queryObj
   */
  handleFormSubmit = async(queryObj) => {
    logger.debug('handleFormSubmit, queryObj = %o', queryObj);
    const res = await this.select(queryObj, 1, this.state.pageSize);
    if (res.success) {
      this.setState({
        currentPage: 1,
        data: res.data,
        total: res.total,
        tableLoading: false,
        queryObj: queryObj,
      });
    } else {
      this.error(res.message);
    }
  };


  render() {
    if (this.state.loadingSchema && (!this.notFirstRender || (!this.inited && !this.errorMsg))) {
      this.notFirstRender = true;
      return (
        <Spin tip="loading schema..." spinning={this.state.loadingSchema} delay={500}>
          <div style={{ height: '150px', width: '100%' }}></div>
        </Spin>
      );
    }
    this.notFirstRender = true;

    if (!this.inited) {
      return (
        <Spin tip="loading schema..." spinning={this.state.loadingSchema} delay={500}>
          <Error errorMsg={this.errorMsg}/>
        </Spin>
      );
    }


    return (
      <Spin spinning={this.state.loadingSchema} delay={500}>
        <InnerForm parentHandleSubmit={this.handleFormSubmit} schema={this.querySchema} tableConfig={this.tableConfig}
                   tableName={this.tableName}/>
        <InnerTable data={this.state.data} tableLoading={this.state.tableLoading}
                    schema={this.dataSchema} refresh={this.refresh}
                    tableConfig={this.tableConfig} tableName={this.tableName}/>
        <InnerPagination currentPage={this.state.currentPage} total={this.state.total} pageSize={this.state.pageSize}
                         parentHandlePageChange={this.handlePageChange} tableConfig={this.tableConfig}
                         showSizeChanger={this.state.showSizeChanger} pageSizeOptions={this.state.pageSizeOptions}
                         parentHandleShowPageChange={this.handleShowPageChange}
                         tableName={this.tableName}/>
      </Spin>
    );
  }

}

export default DBTable;
