import React from 'react';
import {Link} from 'react-router';
import {UpdateGPA1, UpdateGPA2} from '../components/UpdateComponentDemo';

module.exports = [
  {
    key: 'id',
    title: 'ID',
    dataType: 'int',
    primary: true,
  },
  {
    key: 'desc',
    title: 'Description',
    dataType: 'varchar',
  },
  {
    key: 'score',
    title: 'Number of shares',
    dataType: 'int',
    max: 18,
    validator: [{required: true, message: 'required'}],
  },
  {
    key: 'birthday',
    title: 'predicted_sell',
    dataType: 'datetime',
  },
  {
    key: 'singleRecordActions',
    title: 'Option', 
    width: 300,  
    actions: [
      {
        name: 'sell',
        type: 'delete', 
      },
      {
        name: 'transfer',
        type: 'component',
        component: UpdateGPA1, 
      },
    ],
  },
];
