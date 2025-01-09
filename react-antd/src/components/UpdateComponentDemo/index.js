import React from 'react';
import {Slider, InputNumber, Row, Col, Rate} from 'antd';

/**
 * 
 */
class UpdateGPA1 extends React.PureComponent {
  state = {
    inputValue: 0,
  };

  componentWillMount() {
    this.state.inputValue = this.props.record.gpa;
  }

  componentWillReceiveProps(nextProps) {
    this.state.inputValue = nextProps.record.gpa;
  }

  onChange = (value) => {
    this.setState({inputValue: value});
  };

  /**
   * 
   *
   * @returns {{gpa: number}}
   */
  getFieldsValue() {
    return {gpa: this.state.inputValue};
  }

  render() {
    return (
      <Row>
        <Col span={12}>
          <Slider min={0.0} max={10.0} onChange={this.onChange} value={this.state.inputValue} step={0.01}/>
        </Col>
        <Col span={4}>
          <InputNumber min={0} max={10} style={{ marginLeft: 16 }} step={0.01} value={this.state.inputValue}
                       onChange={this.onChange}/>
        </Col>
      </Row>
    );
  }
}

/**
 * 
 */
class UpdateGPA2 extends React.PureComponent {
  state = {
    inputValue: 0,
  };

  componentWillMount() {
    this.state.inputValue = this.props.record.gpa;
  }

  componentWillReceiveProps(nextProps) {
    this.state.inputValue = nextProps.record.gpa;
  }

  onChange = (value) => {
    this.setState({inputValue: value});
  };

  getFieldsValue() {
    return {gpa: this.state.inputValue};
  }

  render() {
    return (
      <span>
        <Rate count={10} allowHalf onChange={this.onChange} value={this.state.inputValue}/>
      </span>
    );
  }
}

export {UpdateGPA1, UpdateGPA2};
