import React from 'react';
import {Icon} from 'antd';
import './index.less';

/**
 *
 */
class Error extends React.PureComponent {

  render() {
    return (
      <div className="not-found">
        <div style={{ fontSize:32 }}><Icon type="frown-o"/></div>
        <h1>{this.props.errorMsg || '404 Not Found'}</h1>
      </div>
    );
  }

}

export default Error;
