import React from 'react';
import {BackTop} from 'antd';
import globalConfig from 'config.js';
import './index.less';

/**
 * 
 */
class Footer extends React.PureComponent {

  render() {
    const text = globalConfig.footer || 'footer lost!';

    return (
      <div>
        <BackTop target={() => document.getElementById('main-content-div')}/>
        <div className="ant-layout-footer" dangerouslySetInnerHTML={{ __html: text }}/>
      </div>
    );
  }

}

export default Footer;
