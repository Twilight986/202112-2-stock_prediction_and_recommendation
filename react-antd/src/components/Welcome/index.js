import React from 'react';
import './index.less';

/**
 * Show Welcome Interface
 */
class Welcome extends React.PureComponent {

  render() {
    return (
      <div>
        <h1 className="welcome-text">
          <div className="div0">
            <div><img src={require('../../img/6.jpg')}></img></div>
            <div><img src={require('../../img/7.jpg')}></img></div>
          </div>
          <div className="div0">
            <div><img src={require('../../img/8.jpg')}></img></div>
            <div><img src={require('../../img/9.jpg')}></img></div>
          </div>
          <div className="div0">
            <div><img src={require('../../img/10.jpg')}></img></div>
          </div>       
          <br />
        </h1>
      </div>
    );
  }

}

export default Welcome;
