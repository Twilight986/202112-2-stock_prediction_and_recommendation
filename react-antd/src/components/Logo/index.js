import React from 'react';
import globalConfig from 'config.js';
import './index.less';

/**
 * 
 */
class Logo extends React.PureComponent {

  render() {
    return (
      <div className={this.props.collapse ? "ant-layout-logo-collapse" : "ant-layout-logo-normal"}>
        <div className="ant-layout-logo-text">
          <a href="#">{this.props.collapse ? globalConfig.name[0] : globalConfig.name}</a>
        </div>
      </div>
    );
  }

}

export default Logo;
