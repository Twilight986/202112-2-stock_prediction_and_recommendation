import Logger from './Logger';
import {ACTION_KEY} from '../components/DBTable/InnerTableRenderUtils';

const logger = new Logger('mockAjax');

const result = {
  success: true,
  code: 0,
  message: 'just a mock ;) ',
  total: 10000,
  data: {},
};

const mockPromise = (callback) => {
  return new Promise(resolve => {
    setTimeout(callback, 2000, resolve);
  });
};

const mockResult = (tableName, queryObj) => {
  logger.debug('begin to mock data for table %s', tableName);

  let schema;
  try {
    schema = require(`../schema/${tableName}.dataSchema.js`);
  } catch (e) {
    logger.error('can not find dataSchema file for table %s', tableName);
    result.success = false;
    result.code = 200;
    result.message = `can not find dataSchema file for table ${tableName}`;
    return;
  }

  if (!queryObj.page) {
    queryObj.page = 1;
  }
  if (!queryObj.pageSize) {
    queryObj.pageSize = 50;
  }

  const tmp = [];
  for (let i = 0; i < queryObj.pageSize; i++) {
    const record = {};
    schema.forEach((column) => {
      if (column.key === ACTION_KEY) {
        return;
      }
      switch (column.showType) {
        case 'select':
          record[column.key] = mockOption(column);
          break;
        case 'radio':
          record[column.key] = mockOption(column);
          break;
        case 'checkbox':
          record[column.key] = mockOptionArray(column);
          break;
        case 'multiSelect':
          record[column.key] = mockOptionArray(column);
          break;
        case 'textarea':
          record[column.key] = `mock page=${queryObj.page} ${i}`;
          break;
        case 'image':
          record[column.key] = mockImage(column);
          break;
        case 'file':
          record[column.key] = mockFile(column);
          break;
        case 'cascader':
          record[column.key] = mockCascader(column);
          break;
        default:
          switch (column.dataType) {
            case 'int':
              record[column.key] = 1000 * queryObj.page + i;
              break;
            case 'float':
              record[column.key] = parseFloat(new Number(2.0 * queryObj.page + i * 0.1).toFixed(2));  
              break;
            case 'varchar':
              record[column.key] = `mock page=${queryObj.page} ${i}`;
              break;
            case 'datetime':
              record[column.key] = new Date().plusDays(i).format('yyyy-MM-dd HH:mm:ss');
              break;
            default:
              logger.error('unsupported dataType %s', column.dataType);
          }
      }
    });
    tmp.push(record);
  }

  result.success = true;
  result.data = tmp;
};

const mockOption = (field) => {
  const rand = Math.floor(Math.random() * field.options.length);
  return field.options[rand].key;
};

const mockOptionArray = (field) => {
  const rand = Math.floor(Math.random() * field.options.length);
  const mockResult = [];
  for (let i = 0; i <= rand; i++) {
    mockResult.push(field.options[i].key);
  }
  return mockResult;
};

const testAvatarArray = [
  'http://jxy.me/about/avatar.jpg',
  'http://imgtu.5011.net/uploads/content/20170207/4051451486453572.jpg',
  'http://dynamic-image.yesky.com/600x-/uploadImages/upload/20140912/upload/201409/322l3se203jjpg.jpg',
];
const testImageArray = [
  'http://img.51ztzj.com/upload/image/20140506/dn201405074019_670x419.jpg',
  'http://img.51ztzj.com/upload/image/20170311/2017031104_670x419.jpg',
  'http://img.51ztzj.com//upload/image/20170311/2017031107_670x419.jpg',
  'http://img.51ztzj.com//upload/image/20130218/20130218011_670x419.jpg',
  'http://img.51ztzj.com//upload/image/20130218/2013021802_670x419.jpg'
];
const mockImage = (field) => {
  if (field.max > 1) {
    const mockResult = [];
    const rand = Math.floor(Math.random() * field.max);
    for (let i = 0; i <= rand; i++) {
      mockResult.push(testImageArray[Math.floor(Math.random() * testImageArray.length)]);
    }
    return mockResult;
  } else {
    return testAvatarArray[Math.floor(Math.random() * testAvatarArray.length)];
  }
};
const testFileArray = [
  'https://static.googleusercontent.com/media/research.google.com/zh-CN//archive/gfs-sosp2003.pdf',
  'https://static.googleusercontent.com/media/research.google.com/zh-CN//archive/mapreduce-osdi04.pdf',
  'http://xpgc.vicp.net/course/svt/TechDoc/storagepaper/bigtable-osdi06.pdf',
];
const mockFile = (field) => {
  if (field.max > 1) {
    const mockResult = [];
    const rand = Math.floor(Math.random() * field.max);
    for (let i = 0; i <= rand; i++) {
      mockResult.push(testFileArray[Math.floor(Math.random() * testFileArray.length)]);
    }
    return mockResult;
  } else {
    return testFileArray[Math.floor(Math.random() * testFileArray.length)];
  }
};

const mockCascader = (field) => {
  const mockResult = [];
  const tmp = options => {
    const rand = Math.floor(Math.random() * options.length);
    mockResult.push(options[rand].value);
    if (options[rand].children) {
      tmp(options[rand].children);
    }
  };

  tmp(field.options);
  return mockResult;
};

/**
 * 
 */
class MockAjax {
  tableCache = new Map();

  getCurrentUser() {
    return mockPromise(resolve => {
      result.success = true;
      result.data = 'guest';
      resolve(result);
    });
  }

  login(username, password) {
    return mockPromise(resolve => {
      if (username === 'guest' && password === 'guest') {
        result.success = true;
        result.data = 'guest';
        resolve(result);
      } else {
        result.success = false;
        result.code = 100;
        result.message = 'invalid username or password';
        resolve(result);
      }
    });
  }

  CRUD(tableName) {
    if (this.tableCache.has(tableName)) {
      return this.tableCache.get(tableName);
    }

    const util = new MockCRUDUtil(tableName);
    this.tableCache.set(tableName, util);
    return util;
  }
}

class MockCRUDUtil {
  constructor(tableName) {
    this.tableName = tableName;
  }

  select(queryObj) {
    return mockPromise(resolve => {
      mockResult(this.tableName, queryObj);
      resolve(result);
    });
  }

  insert(dataObj) {
    return mockPromise(resolve => {
      mockResult(this.tableName, {page: Math.floor(Math.random() * 10000), pageSize: 1});  
      const tmpObj = result.data[0];
      Object.assign(tmpObj, dataObj);
      result.success = true;
      result.data = tmpObj;
      resolve(result);
    });
  }

  update(keys = [], dataObj) {
    return mockPromise(resolve => {
      result.success = true;
      result.data = keys.length;
      resolve(result);
    });
  }

  delete(keys = []) {
    return mockPromise(resolve => {
      result.success = true;
      result.data = keys.length;
      resolve(result);
    });
  }

  getRemoteSchema() {
    if (!this.counter) {
      this.counter = 0;
    }
    this.counter++;
    return mockPromise(resolve => {
      if (this.tableName === 'testAction') {
        resolve({
          success: true,
          data: {
            querySchema: [
              {
                key: 'type',
                options: [{key: '1', value: 'Consumer'}, {key: '2', value: 'New Energy'}, {key: '3', value: 'Metal'}],
                defaultValue: '2',
              },
            ],
            dataSchema: [
              {
                key: 'name',
                title: `stockID  ${this.counter}`,
              },
            ],
          },
        });
      } else {
        resolve({success: true, data: {}});
      }
    });
  }
}

export default MockAjax;
