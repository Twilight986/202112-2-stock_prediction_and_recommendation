import React from 'react';
import {Icon} from 'antd';


module.exports = [
  {
    key: 'id', 
    title: 'ID',  
    
    dataType: 'int', 
    
    primary: true,

    showType: 'normal',  
    
    showInTable: true,  
    disabled: false, 
    
    render: (text, record) => text,
  },
  {
    key: 'name',
    title: 'user',
    dataType: 'varchar', 
    placeholder: 'input user',
    addonBefore: (<Icon type="user"/>),
    addonAfter: 'haha',
    defaultValue: 'foolbear', 
  },
  {
    key: 'weight',
    title: 'kg',
    dataType: 'int',
    min: 10,
    defaultValue: 70, 
    disabled: true,
    showInForm: false, 
  },
  {
    key: 'gender',
    title: 'sex',
    dataType: 'int',
    showType: 'radio',
    options: [{key: '1', value: 'male'}, {key: '2', value: 'female'}],
    defaultValue: '1',
    disabled: true,
  },
  {
    key: 'marriage',
    title: 'status',
    dataType: 'varchar',
    showType: 'select',
    options: [{key: 'yes', value: 'married'}, {key: 'no', value: 'single'}],

    validator: [{type: 'string', required: true, message: 'You must choose the status'}],
  },
  {
    key: 'interest',
    title: 'hobby',
    dataType: 'int',
    showType: 'checkbox',
    options: [{key: '1', value: 'eating'}, {key: '2', value: 'sleep'}, {key: '3', value: 'games'}],
    defaultValue: ['1', '2'],
    validator: [{type: 'array', required: true, message: 'select at least 1 hobby'}],
    width: 120,  // 指定这一列的宽度
  },
  {
    key: 'good',
    title: 'advantage',
    dataType: 'varchar',
    showType: 'multiSelect',
    options: [{key: 'lan', value: 'lazy'}, {key: 'zhai', value: closemind'}],
    validator: [{type: 'array', required: true, message: 'Please select advantage'}],
  },
  {
    key: 'pic1',
    title: '头像',
    dataType: 'varchar',
    showType: 'image',  
    showInTable: false,
  },
  {
    key: 'desc',
    title: 'intro',
    dataType: 'varchar',
    showType: 'textarea', 
    showInTable: false,
    defaultValue: 'self intro',
    validator: [{type: 'string', max: 20, message: '20 char length'}],
  },
  {
    key: 'score',
    title: 'score',
    dataType: 'int',
    max: 99,
    min: 9,
  },
  {
    key: 'gpa',
    title: 'GPA',
    dataType: 'float',
    max: 9.9,
    placeholder: 'haha',
    width: 50,
  },
  {
    key: 'birthday',
    title: 'Birthday',
    dataType: 'datetime',
    placeholder: 'happy!',
  },
  {
    key: 'xxday',
    title: 'xxDate',
    dataType: 'datetime',
    defaultValue: '2017-01-01 11:22:33',
    showInTable: false,
    showInForm: false, 
  },
];
