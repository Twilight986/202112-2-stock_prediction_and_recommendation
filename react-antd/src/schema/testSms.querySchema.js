

module.exports = [
  {
    key: 'id',  
    title: 'ID',  
    dataType: 'int',
  },
  {
    key: 'content',
    title: 'Content',
    dataType: 'varchar',
  },
  {
    key: 'phoneModel',
    title: 'PhoneType',
    dataType: 'varchar',
  },
  {
    key: 'experience',
    title: 'UserExp',
    dataType: 'varchar',
  },
  {
    key: 'frequency',
    title: 'UseFreq',
    dataType: 'varchar',
  },
  {
    key: 'isNative',
    title: 'IsNative',
    dataType: 'varchar',
    showType: 'radio',
    options: [{key: 'yes', value: 'Yes'}, {key: 'no', value: 'Yes'}],
  },
  {
    key: 'location',
    title: 'loc',
    dataType: 'varchar',  
    showType: 'cascader',
    defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
    options: [{
      value: 'zhejiang',  
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'yuzhou',
      label: 'Universe Center',
      children: [{
        value: 'wudaokou',
        label: 'Wudaokou',
      }],
    }],
  },
];
