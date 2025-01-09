import React from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router';
import {bindActionCreators} from 'redux'
import {Spin, message, Tabs, Icon} from 'antd';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import Login from '../Login';
import Breadcrumb from '../Breadcrumb';
import Welcome from '../Welcome';
import './index.less';
import globalConfig from 'config.js';
import ajax from '../../utils/ajax';
import Logger from '../../utils/Logger';
import sidebarMenu, {headerMenu} from '../../menu.js';
import {loginSuccessCreator} from '../../redux/Login.js';

const TabPane = Tabs.TabPane;
const logger = Logger.getLogger('App');

/**
 */
class App extends React.Component {

  state = {
    tryingLogin: true, 

    currentTabKey: '',  
    tabPanes: [],  
  };

  /**
   */
  componentWillMount() {
    if (globalConfig.tabMode.enable !== true) {
      return;
    }

    this.tabTitleMap = this.parseTabTitle();
    this.updateTab(this.props);
  }

  /**
   */
  componentWillReceiveProps(nextProps) {
    if (globalConfig.tabMode.enable !== true) {
      return;
    }

    const action = this.props.location.action;
    if (action === 'PUSH') { 
      return;
    }

    if (this.props.collapse === nextProps.collapse) {
      this.updateTab(nextProps);
    }
  }

  /**
   */
  async componentDidMount() {
    if (!this.props.login) {
      const hide = message.loading('get user info...', 0);

      try {
        const res = await ajax.getCurrentUser();
        hide();

        if (res.success && !globalConfig.debug) {
          this.state.tryingLogin = false;
          this.props.handleLoginSuccess(res.data);
        } else {
          this.handleLoginError('Failed. Log in one more time.');
        }
      } catch (e) {
        logger.error('getCurrentUser error, %o', e);
        this.handleLoginError(`Request Failed: ${e.message}`);
      }
    }
  }

  handleLoginError(errorMsg) {
    if (globalConfig.isSSO() && !globalConfig.debug) {

      logger.debug('not login, redirect to SSO login page');
      const redirect = encodeURIComponent(window.location.href);
      window.location.href = `${globalConfig.login.sso}${redirect}`;
    } else {
      message.error(errorMsg);
      logger.debug('not login, redirect to Login component');
      this.setState({tryingLogin: false});
    }
  }




  /**

   *
   * @returns {Map}
   */
  parseTabTitle() {
    const tabTitleMap = new Map();

    const addItem = item => {
      if (item.url) {  
        return;
      }
      if (item.icon) {
        tabTitleMap.set(item.key, <span className="ant-layout-tab-text"><Icon type={item.icon}/>{item.name}</span>);
      } else {
        tabTitleMap.set(item.key, <span className="ant-layout-tab-text">{item.name}</span>);
      }
    };
    const browseMenu = item => {
      if (item.child) {
        item.child.forEach(browseMenu);
      } else {
        addItem(item);
      }
    };

    sidebarMenu.forEach(browseMenu);
    headerMenu.forEach(browseMenu);

    tabTitleMap.set('*', <span className="ant-layout-tab-text"><Icon type="frown-o"/>Error</span>);
    return tabTitleMap;
  }

  /**
   *
   * @param props
   */
  updateTab(props) {
    const routes = props.routes;
    let key = routes[routes.length - 1].path;  

    if (!key || !this.tabTitleMap.has(key)) {
      this.state.tabPanes.length = 0;
      return;
    }

    const tabTitle = this.tabTitleMap.get(key);

    if (globalConfig.tabMode.allowDuplicate === true) {
      if (!this.tabCounter) {
        this.tabCounter = 0;
      }

      this.tabCounter++;
      key = key + this.tabCounter;
    }

    this.state.currentTabKey = key;

    let exist = false;
    for (const pane of this.state.tabPanes) {
      if (pane.key === key) {
        exist = true;
        break;
      }
    }

    if (!exist) {
      this.state.tabPanes.push({
        key,
        title: tabTitle,
        //content: React.cloneElement(props.children), 
        content: props.children,
      });
    }
  }

  /**
   */
  onTabChange = (activeKey) => {
    this.setState({currentTabKey: activeKey});
  };

  /**
   */
  onTabRemove = (targetKey) => {
    let nextTabKey = this.state.currentTabKey;
    if (this.state.currentTabKey === targetKey) {
      let currentTabIndex = -1;
      this.state.tabPanes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          currentTabIndex = i;
        }
      });

      if (currentTabIndex > 0) {
        nextTabKey = this.state.tabPanes[currentTabIndex - 1].key;
      }

      else if (currentTabIndex === 0 && this.state.tabPanes.length > 1) {
        nextTabKey = this.state.tabPanes[currentTabIndex + 1].key;
      }

    }

    const newTabPanes = this.state.tabPanes.filter(pane => pane.key !== targetKey);
    this.setState({tabPanes: newTabPanes, currentTabKey: nextTabKey});
  };

  /**
   */
  renderBody() {

    if (globalConfig.tabMode.enable === true) {

      if (this.state.tabPanes.length === 0) {
        return <div className="ant-layout-container"><Welcome /></div>;
      } else {
        return <Tabs activeKey={this.state.currentTabKey} type="editable-card"
                     onEdit={this.onTabRemove} onChange={this.onTabChange}
                     hideAdd className="ant-layout-tab">
          {this.state.tabPanes.map(pane => <TabPane tab={pane.title} key={pane.key}
                                                    closable={true}>{pane.content}</TabPane>)}
        </Tabs>;
      }
    }

    else {
      return <div>
        <Breadcrumb routes={this.props.routes}/>
        <div className="ant-layout-container">
          {this.props.children}
        </div>
      </div>;
    }
  }


  render() {

    if (this.state.tryingLogin) {
      return <div className="center-div"><Spin spinning={true} size="large"/></div>;
    }


    if (!this.props.login) {
      return <Login />;
    }


    return (
      <div className="ant-layout-base">
        <Sidebar />

        <div id="main-content-div" className={this.props.collapse ? 'ant-layout-main-collapse' : 'ant-layout-main'}>
          <Header userName={this.props.userName}/>
          {this.renderBody()}
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    collapse: state.Sidebar.collapse,  
    login: state.Login.login, 
    userName: state.Login.userName, 
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginSuccess: bindActionCreators(loginSuccessCreator, dispatch), 
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
