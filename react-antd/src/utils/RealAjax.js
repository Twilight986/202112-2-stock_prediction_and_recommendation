import Logger from './Logger';
import superagent from 'superagent';
import globalConfig from '../config';

const logger = new Logger('Ajax');

/**
 */
class Ajax {

  tableCache = new Map();

  /**
   *
   * @param method 
   * @param url
   * @param params 
   * @param data 
   * @param headers 
   * @returns {Promise}
   */
  requestWrapper(method, url, {params, data, headers} = {}) {
    logger.debug('method=%s, url=%s, params=%o, data=%o, headers=%o', method, url, params, data, headers);
    return new Promise((resolve, reject) => {
      const tmp = superagent(method, url);
      if (globalConfig.isCrossDomain()) {
        tmp.withCredentials();
      }
      if (globalConfig.api.timeout && !isNaN(globalConfig.api.timeout)) {
        tmp.timeout(globalConfig.api.timeout);
      }
      tmp.set('Content-Type', 'application/json').set('Accept', 'application/json');
      if (headers) {
        tmp.set(headers);
      }
      if (params) {
        tmp.query(params);
      }
      if (data) {
        tmp.send(data);
      }
      tmp.end((err, res) => {
        logger.debug('err=%o, res=%o', err, res);
        if (res && res.body) {
          resolve(res.body);
        } else {
          reject(err || res);
        }
      });
    });
  }


  get(url, opts = {}) {
    return this.requestWrapper('GET', url, {...opts});
  }

  post(url, data, opts = {}) {
    return this.requestWrapper('POST', url, {...opts, data});
  }


  /**
   *
   * @returns {*}
   */
  getCurrentUser() {
    return this.get(`${globalConfig.getAPIPath()}${globalConfig.login.getCurrentUser}`);
  }

  /**
   *
   * @param username
   * @param password
   */
  login(username, password) {
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    return this.post(`${globalConfig.getAPIPath()}${globalConfig.login.validate}`, {username, password}, {headers});
  }

  /**
   *
   * @param tableName 
   * @returns {*}
   */
  CRUD(tableName) {
    if (this.tableCache.has(tableName)) {
      return this.tableCache.get(tableName);
    }

    const util = new CRUDUtil(tableName);
    util.ajax = this;
    this.tableCache.set(tableName, util);
    return util;
  }
}

/**
 */
class CRUDUtil {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   *
   * @param queryObj 
   * @returns {*}
   */
  select(queryObj) {
    return this.ajax.post(`${globalConfig.getAPIPath()}/${this.tableName}/select`, queryObj);
  }

  /**
   *
   * @param dataObj 
   * @returns {*}
   */
  insert(dataObj) {
    return this.ajax.post(`${globalConfig.getAPIPath()}/${this.tableName}/insert`, dataObj);
  }

  /**
   *
   * @param keys 
   * @param dataObj 
   * @returns {*}
   */
  update(keys = [], dataObj) {
    const tmp = keys.join(',');
    return this.ajax.post(`${globalConfig.getAPIPath()}/${this.tableName}/update`, dataObj, {params: {keys: tmp}});
  }

  /**
   *
   * @param keys 
   * @returns {*}
   */
  delete(keys = []) {
    const tmp = keys.join(',');
    return this.ajax.get(`${globalConfig.getAPIPath()}/${this.tableName}/delete`, {params: {keys: tmp}});
  }

  /**
   *
   * @returns {*}
   */
  getRemoteSchema() {
    return this.ajax.get(`${globalConfig.getAPIPath()}/${this.tableName}/schema`);
  }
}

export default Ajax;
