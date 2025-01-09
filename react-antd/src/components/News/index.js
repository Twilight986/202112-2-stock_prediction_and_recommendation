import React from 'react';
import './index.less';
import {Steps} from 'antd';

const { Step } = Steps;
/**
 * 
 */
class News extends React.PureComponent {

  render() {
    return (
    <Steps progressDot current={1} direction="vertical">
        <Step title="Finished" description="You sold 100 shares of Nongfu Spring." />
        <Step title="Finished" description="You bought 100 shares of Wuliangye." />
        <Step title="In Progress" description="You are buying 200 shares of Tesla." />
        <Step title="In Progress" description="You are selling 500 sharps of Tencent." />
    </Steps>
    );
  }

}

export default News;