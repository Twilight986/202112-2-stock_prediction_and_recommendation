import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Menu, Icon} from 'antd';
import Logo from '../Logo';
import Logger from '../../utils/Logger';
import items from 'menu.js';  
import globalConfig from 'config.js';
import './index.less';
import {sidebarCollapseCreator} from '../../redux/Sidebar.js';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

const logger = Logger.getLogger('Sidebar');

/**
 * 
 */
class Sidebar extends React.PureComponent {


  state = {
    openKeys: [],  
  };

  /**
   * 
   *
   * @param obj 
   * @param paths 
   * @returns {XML}
   */
  transFormMenuItem(obj, paths, isLevel1) {
    const parentPath = paths.join('/');   
    logger.debug('transform %o to path %s', obj, parentPath);

    return (
      <MenuItem key={obj.key} style={{ margin: '0px' }}>
        {obj.icon && <Icon type={obj.icon}/>}
        {isLevel1 && !obj.icon && <span className="invisible-nav-text">{obj.name[0]}</span>}
        <Link to={`/${parentPath}`} style={{ display: 'inline' }}><span className="nav-text">{obj.name}</span></Link>
      </MenuItem>
    );
  }

  componentWillMount() {
    const paths = [];  
    const level1KeySet = new Set();  
    const level2KeyMap = new Map();  
    
    const menu = items.map((level1) => {
      paths.push(level1.key);
      level1KeySet.add(level1.key);
      if (this.state.openKeys.length === 0) {
        this.state.openKeys.push(level1.key); 
      }

      if (level1.child) {
        const level2menu = level1.child.map((level2) => {
          paths.push(level2.key);
          level2KeyMap.set(level2.key, level1.key);

          if (level2.child) {
            const level3menu = level2.child.map((level3) => {
              paths.push(level3.key);
              const tmp = this.transFormMenuItem(level3, paths);
              paths.pop();
              return tmp;
            });

            paths.pop();

            return (
              <SubMenu key={level2.key}
                       title={level2.icon ? <span><Icon type={level2.icon} />{level2.name}</span> : level2.name}>
                {level3menu}
              </SubMenu>
            );

          } else {
            const tmp = this.transFormMenuItem(level2, paths);
            paths.pop();
            return tmp;
          }
        });

        paths.pop();

        let level1Title;
        if (level1.icon) {
          level1Title = <span><Icon type={level1.icon}/><span className="nav-text">{level1.name}</span></span>;
        } else {
          level1Title = <span><span className="invisible-nav-text">{level1.name[0]}</span><span
            className="nav-text">{level1.name}</span></span>;
        }

        return (
          <SubMenu key={level1.key} title={level1Title}>
            {level2menu}
          </SubMenu>
        )
      }
      else {
        const tmp = this.transFormMenuItem(level1, paths, true);
        paths.pop();  
        return tmp;
      }
    });

    this.menu = menu;
    this.level1KeySet = level1KeySet;
    this.level2KeyMap = level2KeyMap;
  }

  /**
   * 
   *
   * @param openKeys
   */
  handleOpenChange = (openKeys) => {
    if (this.props.collapse) {
      this.props.handleClickCollapse();
    }

    if (!globalConfig.sidebar.autoMenuSwitch) { 
      this.setState({openKeys});
      return;
    }

    logger.debug('old open keys: %o', openKeys);
    const newOpenKeys = [];

    let lastKey = '';  
    for (let i = openKeys.length; i >= 0; i--) {
      if (this.level1KeySet.has(openKeys[i])) {
        lastKey = openKeys[i];
        break;
      }
    }
    for (const key of openKeys) {
      const ancestor = this.level2KeyMap.get(key);
      if (ancestor === lastKey) {
        newOpenKeys.push(key);
      }
    }
    newOpenKeys.push(lastKey);

    logger.debug('new open keys: %o', newOpenKeys);
    this.setState({openKeys: newOpenKeys});
  };

  /**
   * 
   *
   * @param key
   */
  handleSelect = ({key}) => {
    if (this.props.collapse) {
      this.props.handleClickCollapse();
    }
    if (globalConfig.sidebar.autoMenuSwitch && this.level1KeySet.has(key) && this.state.openKeys.length > 0) {
      this.setState({openKeys: []});
    }
  };

  render() {
    return (
      <aside className={this.props.collapse ? "ant-layout-sidebar-collapse" : "ant-layout-sidebar"}>
        <Logo collapse={this.props.collapse}/>
        <Menu theme="dark" mode="inline"
              onOpenChange={this.handleOpenChange}
              onSelect={this.handleSelect}
              openKeys={this.props.collapse ? [] : this.state.openKeys}>
          {this.menu}
        </Menu>
        <div className="ant-layout-sidebar-trigger" onClick={this.props.handleClickCollapse}>
          <Icon type={this.props.collapse ? "right" : "left"}/>
        </div>
      </aside>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    collapse: state.Sidebar.collapse,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickCollapse: bindActionCreators(sidebarCollapseCreator, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
