/**
 *
 */

'use strict';

module.exports = {
  name: 'Stock System',  // Proj Name
  favicon: 'http://jxy.me/favicon.ico',  // set favicon
  footer: '<a target="_blank" href="http://jxy.me">Jeffrey</a> © 2021-2099',  

  debug: true,  // debug mode for backend api

  tabMode: { 
    enable: false,  
    allowDuplicate: false, 
  },

  log: {
    level: 'info',  //支持debug/info/warn/error 
    debug: [],
    info: [],
    warn: [],
    error: ['loggerA', 'loggerB'], 
  },

  api: {  
    host: 'http://localhost:12345',  // applied ajax api
    path: '/api',  // ajax route
    timeout: 15000, 
  },

  login: {  
    getCurrentUser: '/getCurrentUser',  

    sso: '',  
    validate: '/login',  

    logout: '/logout',  
  },

  upload: {
    image: '/uploadImage',  
    imageSizeLimit: 1500,  

    file: '/uploadFile',  
    fileSizeLimit: 10240,  
  },

  sidebar: { 
    collapsible: true,  
    autoMenuSwitch: true, 
  },

  DBTable: { 
    pageSize: 50, 
    showSizeChanger: true, 
    pageSizeOptions: ['10', '20', '50', '100'], 

    default: {  
      showExport: true,  
      showImport: true,  
      showInsert: true,  
      showUpdate: true,  
      showDelete: true,  

      asyncSchema: false,  
      ignoreSchemaCache: false,  
    },
  },

  /**
   *
   * @returns {boolean}
   */
  isCrossDomain() {
    if (this.api.host && this.api.host !== '') {
      return true;
    } else {
      return false;
    }
  },

  /**
   *
   * @returns {boolean}
   */
  isSSO() {
    if (this.login.sso && this.login.sso !== '') {
      return true;
    } else {
      return false;
    }
  },

  /**
   *
   * @returns {*}
   */
  getAPIPath() {
    if (this.tmpApiPath) { 
      return this.tmpApiPath;
    }

    const paths = [];

    if (this.isCrossDomain()) {
      const tmp = this.api.host;
      let index = tmp.length - 1;
      while (tmp.charAt(index) === '/') {
        index--;
      }
      if (index < 0)
        paths.push('');
      else
        paths.push(tmp.substring(0, index + 1));
    } else {
      paths.push('');
    }

    if (this.api.path) {
      const tmp = this.api.path;
      let begin = 0;
      let end = tmp.length - 1;

      while (tmp.charAt(begin) === '/') {
        begin++;
      }
      while (tmp.charAt(end) === '/') {
        end--;
      }
      if (begin > end)
        paths.push('');
      else
        paths.push(tmp.substring(begin, end + 1));
    } else {
      paths.push('');
    }

    const tmpApiPath = paths.join('/');
    this.tmpApiPath = tmpApiPath;
    return tmpApiPath;
  },

};
