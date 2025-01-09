import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import globalConfig from 'config';
import ajax from '../../utils/ajax';
import Logger from '../../utils/Logger';
import {message} from 'antd';
import './index.less';
import {loginSuccessCreator} from '../../redux/Login.js';

const logger = Logger.getLogger('Login');

/**
 */
class Login extends React.PureComponent {


  state = {
    username: '',  
    password: '',  
    requesting: false, 
  };

  // controlled components

  handleUsernameInput = (e) => {
    this.setState({username: e.target.value});
  };

  handlePasswordInput = (e) => {
    this.setState({password: e.target.value});
  };

  /**
   *
   * @param e
   */
  handleSubmit = async(e) => { 
    e.preventDefault();  
    this.setState({requesting: true});
    const hide = message.loading('Verifying...', 0);

    const username = this.state.username;
    const password = this.state.password;
    logger.debug('username = %s, password = %s', username, password);

    try {

      const res = await ajax.login(username, password);
      hide();
      logger.debug('login validate return: result %o', res);

      if (res.success) {
        message.success('Log in successfully');
        this.props.handleLoginSuccess(res.data);
      } else {
        message.error(`Log in failed: ${res.message}, connect the administrator`);
        this.setState({requesting: false});
      }
    } catch (exception) {
      hide();
      message.error(`request failed: ${exception.message}`);
      logger.error('login error, %o', exception);
      this.setState({requesting: false});
    }
  };

  render() {
    return (
      <div id="loginDIV">

        <div className="login">
          <h1>{globalConfig.name}</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="login-input" type="text" value={this.state.username}
                   onChange={this.handleUsernameInput} placeholder="username" required="required"/>
            <input className="login-input" type="password" value={this.state.password}
                   onChange={this.handlePasswordInput} placeholder="password" required="required"/>
            <button className="btn btn-primary btn-block btn-large"
                    type="submit" disabled={this.state.requesting}>
              log in
            </button>
          </form>
        </div>

      </div>
    );
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginSuccess: bindActionCreators(loginSuccessCreator, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Login);
