import React from 'react';
import './index.less';

/**
 * 
 */
class HoldStock extends React.PureComponent {

  render() {
    return (
      <div>
        <h1 className="welcome-text">
          <div className="div0">
            <div><img src={require('../../img/1.jpg')}></img></div>
            <div><img src={require('../../img/2.jpg')}></img></div>
          </div>
          <div className="div0">
            <div><img src={require('../../img/3.jpg')}></img></div>
            <div><img src={require('../../img/4.jpg')}></img></div>
          </div>
          <div className="div0">
            <div><img src={require('../../img/5.jpg')}></img></div>
          </div>          
          <br />
        </h1>
      </div>
    );
  }

}

export default HoldStock;
