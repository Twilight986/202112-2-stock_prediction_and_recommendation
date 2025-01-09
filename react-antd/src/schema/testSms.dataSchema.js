import React from 'react';
import {Link} from 'react-router';

module.exports = [
  {
    key: 'id',
    title: 'ID',
    dataType: 'int',
    primary: true,

    render(text) {

      // console.log(this.props.tableName);
      return text;
    },
    sorter: (a, b) => a.id - b.id,
  },
  {
    key: 'photos',
    title: 'view photo',
    dataType: 'varchar',
    showType: 'image',
    max: 5,
    url: 'http://hahaha/uploadImage',
    defaultValue: ['http://jxy.me/about/avatar.jpg', 'http://jxy.me/about/avatar.jpg'],
    width: 150,
    placeholder: 'yoyo',
  },
  {
    key: 'jianli',
    title: 'resume',
    dataType: 'varchar',
    showType: 'file',
    accept: '.pdf',
    sizeLimit: 20480,
    placeholder: 'please upload doc in pdf dormat not exceed 2 MB.',
    validator: [{required: true, message: 'required'}],
  },
  {
    key: 'guanshui',
    title: 'researcg result',
    dataType: 'varchar',
    showType: 'file',
    accept: '.pdf',
    max: 3,
    placeholder: 'please upload at least 3 docs in pdf dormat.',
    sorter: (a, b) => a.guanshui.length - b.guanshui.length,
  },
  {
    key: 'url',
    title: 'home page',
    dataType: 'varchar',
    validator: [{type: 'url', message: 'homepage error'}],
    render: (text, record) => <a href={`/index/option1?name=${record.id}`}>{text}</a>,
  },
  {
    key: 'mail',
    title: 'mailbox',
    dataType: 'varchar',
    validator: [{type: 'email', required: true, message: 'mailbox error'}],
    render: (text) => <a href="mailto:foolbeargm@gmail.com" target="_blank">{'foolbeargm@gmail.com'}</a>,
  },
  {
    key: 'phoneModel',
    title: 'phone type',
    dataType: 'varchar',
    render: (text, record) => <Link to={`/index/option1?name=${record.id}`}>{'jump to other component'}</Link>,
    validator: [{type: 'string', pattern: /^[a-zA-Z0-9]+$/, message: 'only digit + letter'}],
  },
  {
    key: 'experience',
    title: 'using exp',
    dataType: 'varchar',
    validator: [{type: 'string', max: 10, message: '10 char at most!'}],
  },
  {
    key: 'location',
    title: 'loc',
    dataType: 'varchar',
    showType: 'cascader',
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
