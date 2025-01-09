

module.exports = [
  {
    key: 'id',  
    title: 'ID',
    dataType: 'int',
  },
  {
    key: 'haha',
    title: 'test',
    dataType: 'varchar',
  },
  {
    key: 'type',
    title: 'stockType',
    dataType: 'int',
    showType: 'select',
    options: [{key: '1', value: 'type1'}, {key: '2', value: 'type2'}],
    defaultValue: '1',
  },
];
