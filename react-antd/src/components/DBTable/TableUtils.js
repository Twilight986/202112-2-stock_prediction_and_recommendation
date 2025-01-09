import React from 'react';
import {notification} from 'antd';
import globalConfig from '../../config.js';
import ajax from '../../utils/ajax';
import Logger from '../../utils/Logger';

const logger = Logger.getLogger('TableUtils');

const tableMap = new Map();
const configMap = new Map();

/**
 * 
 */
export default {


  /**
   * 
   *
   * @param tableName
   * @returns {V}
   */
  getCacheSchema(tableName){
    return tableMap.get(tableName);
  },

  /**
   * 
   *
   * @param tableName
   * @returns {{querySchema: *, dataSchema: *}}
   */
  getLocalSchema(tableName) {
    const ignoreCache = this.shouldIgnoreSchemaCache(tableName);
    let querySchema, dataSchema;

    try {
      querySchema = require(`../../schema/${tableName}.querySchema.js`);
      if (ignoreCache) {
        querySchema = querySchema.map(item => Object.assign({}, item));  
      }
    } catch (e) {
      logger.error('load query schema error: %o', e);
    }

    try {
      dataSchema = require(`../../schema/${tableName}.dataSchema.js`);
      if (ignoreCache) {
        dataSchema = dataSchema.map(item => Object.assign({}, item));
      }
    } catch (e) {
      logger.error('load data schema error: %o', e);
    }

    const toCache = {querySchema, dataSchema};
    if (!ignoreCache) {
      tableMap.set(tableName, toCache);
    }
    return toCache;
  },

  /**
   * 
   *
   * @param tableName
   * @returns {{querySchema: *, dataSchema: *}}
   */
  async getRemoteSchema(tableName) {
    const ignoreCache = this.shouldIgnoreSchemaCache(tableName);
    const localSchema = this.getLocalSchema(tableName);

    let querySchema, dataSchema;
    try {
      const res = await ajax.CRUD(tableName).getRemoteSchema();
      logger.debug('get remote schema for table %s, res = %o', tableName, res);
      if (res.success) {
        querySchema = this.merge(localSchema.querySchema, res.data.querySchema);
        dataSchema = this.merge(localSchema.dataSchema, res.data.dataSchema);
      } else {
        logger.error('getRemoteSchema response error: %o', res);
        this.error(`请求asyncSchema失败: ${res.message}`);
      }
    } catch (e) {
      logger.error('getRemoteSchema network request error: %o', e);
      this.error(`请求asyncSchema时网络失败: ${e.message}`);
    }

    const toCache = {querySchema, dataSchema};
    if (!ignoreCache) {
      tableMap.set(tableName, toCache);
    }
    return toCache;
  },

  /**
   * 
   *
   * @param local 本地schema
   * @param remote 远程schema
   * @returns {*}
   */
  merge(local, remote) {
    if (local && remote) {
      const result = local;  

      const map = new Map();
      result.forEach(item => map.set(item.key, item));

      remote.forEach(item => {
        if (map.has(item.key)) {
          Object.assign(map.get(item.key), item);
        } else {
          result.push(item);
        }
      });
      return result;
    } else {
      return local || remote;
    }
  },

  /**
   * 
   *
   * @param errorMsg
   */
  error(errorMsg) {
    notification.error({
      message: 'Error!',
      description: `Please contact administrator, wrong message: ${errorMsg}`,
      duration: 0,
    });
  },

  /**
   * 
   *
   * @param tableName
   * @returns {*}
   */
  getTableConfig(tableName) {
    if (configMap.has(tableName)) {
      return configMap.get(tableName);
    }

    let tableConfig;
    try {
      const tmp = require(`../../schema/${tableName}.config.js`);  
      tableConfig = Object.assign({}, globalConfig.DBTable.default, tmp); 
    } catch (e) {
      logger.warn('can not find config for table %s, use default instead', tableName);
      tableConfig = Object.assign({}, globalConfig.DBTable.default);
    }

    configMap.set(tableName, tableConfig);
    return tableConfig;
  },

  /**
   *
   * @param tableName
   * @returns {boolean}
   */
  shouldIgnoreSchemaCache(tableName) {
    const tableConfig = this.getTableConfig(tableName);
    return tableConfig.asyncSchema === true && tableConfig.ignoreSchemaCache === true;
  },

}
