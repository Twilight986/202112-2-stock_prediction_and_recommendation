import React from 'react';
import {Link} from 'react-router';
import {Icon, Menu} from 'antd';
import Logger from '../../utils/Logger';
import globalConfig from 'config';
import './index.less';
import {headerMenu} from 'menu';

const SubMenu = Menu.SubMenu;  
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

const logger = Logger.getLogger('Header');

/**
 */
class Header extends React.PureComponent {


  transFormMenuItem(obj, paths) {
    const parentPath = paths.join('/');
    logger.debug('transform %o to path %s', obj, parentPath);

    return (
      <MenuItem key={obj.key}>
        {obj.icon && <Icon type={obj.icon}/>}
        {obj.url ? <a target="_blank" href={obj.url}>{obj.name}</a> : <Link to={`/${parentPath}`}>{obj.name}</Link>}
      </MenuItem>
    );
  }

  componentWillMount() {
    const paths = [];

    const logoutMenuItem = <MenuItem key="logout">
      <Icon type="logout"/>
      <a href={`${globalConfig.getAPIPath()}${globalConfig.login.logout}`}>logout</a>
    </MenuItem>;

    let userMenuItems = null;

    const menu = headerMenu.map((level1) => {
      paths.push(level1.key);
      let transformedLevel1Menu;

      if (level1.child) {
        const level2menu = level1.child.map((level2) => {
          paths.push(level2.key);

          if (level2.child) {
            const level3menu = level2.child.map((level3) => {
              paths.push(level3.key);
              const tmp = this.transFormMenuItem(level3, paths);
              paths.pop();
              return tmp;
            });

            paths.pop();

            return (
              <MenuItemGroup key={level2.key}
                             title={level2.icon ? <span><Icon type={level2.icon} />{` ${level2.name}`}</span> : <span>{level2.name}</span>}>
                <Menu.Divider />
                {level3menu}
              </MenuItemGroup>
            );
          } else {
            const tmp = this.transFormMenuItem(level2, paths);
            paths.pop();
            return tmp;
          }
        });

        paths.pop();

        transformedLevel1Menu = (
          <SubMenu key={level1.key}
                   title={level1.icon ? <span><Icon type={level1.icon} />{level1.name}</span> : level1.name}>
            {level2menu}
          </SubMenu>
        );
      } else {
        transformedLevel1Menu = this.transFormMenuItem(level1, paths);
        paths.pop();
      }

      if (level1.key === 'userMenu') {
        userMenuItems = transformedLevel1Menu.props.children;  
        return null;
      } else {
        return transformedLevel1Menu;
      }
    });

    this.menu = menu;

    const userMenu = (
      <SubMenu title={<span><Icon type="user" />{this.props.userName}</span>}>
        {userMenuItems && userMenuItems[0] ? userMenuItems : null}
        <Menu.Divider />
        {logoutMenuItem}
      </SubMenu>
    );

    this.userMenu = userMenu;
  }


  render() {
    return (
      <div className="ant-layout-header">
        <Menu className="header-menu" mode="horizontal">
          {this.userMenu}
          {this.menu}
        </Menu>
      </div>
    );
  }

}

export default Header;
