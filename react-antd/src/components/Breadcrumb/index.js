import React from 'react';
import {Breadcrumb, Icon} from 'antd';
import sidebarMenu, {headerMenu} from 'menu.js'; 
import Logger from '../../utils/Logger';
import './index.less';

const Item = Breadcrumb.Item;
const logger = Logger.getLogger('Breadcrumb');

/**
 */
class Bread extends React.PureComponent {

  componentWillMount() {
    const iconMap = new Map();
    const nameMap = new Map();

    const browseMenu = (item) => {
      nameMap.set(item.key, item.name);
      logger.debug('nameMap add entry: key=%s, value=%s', item.key, item.name);
      iconMap.set(item.key, item.icon);
      logger.debug('iconMap add entry: key=%s, value=%s', item.key, item.icon);

      if (item.child) {
        item.child.forEach(browseMenu);
      }
    };

    sidebarMenu.forEach(browseMenu);
    headerMenu.forEach(browseMenu);

    this.iconMap = iconMap;
    this.nameMap = nameMap;
  }

  render() {
    const itemArray = [];

    itemArray.push(<Item key="systemHome" href="#"><Icon type="home"/> Daily Recommend</Item>);

    for (const route of this.props.routes) {
      logger.debug('path=%s, route=%o', route.path, route);
      const name = this.nameMap.get(route.path);

      if (name) {
        const icon = this.iconMap.get(route.path);
        if (icon) {
          itemArray.push(<Item key={name}><Icon type={icon}/> {name}</Item>); 
        } else {
          itemArray.push(<Item key={name}>{name}</Item>);
        }
      }
    }

    return (
      <div className="ant-layout-breadcrumb">
        <Breadcrumb>{itemArray}</Breadcrumb>
      </div>
    );
  }

}

export default Bread;
