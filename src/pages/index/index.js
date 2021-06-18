import React from 'react';
import { Route } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import './index.css';

import HomeTab from '../index';
import HouseList from '../houseList';
import NewsList from '../newList';
import Profile from '../profile';

const tabItems = [
    {
        title: '首页',
        path: '/home/index',
        className: 'icon-shouye1',
        selectedClass: 'icon-shouye'
    },
    {
        title: '找房',
        path: '/home/houseList',
        className: 'icon-chazhao',
        selectedClass: 'icon-chazhao2'
    },
    {
        title: '资讯',
        path: '/home/newsList',
        className: 'icon-biaoqiankuozhan_zixun-229',
        selectedClass: 'icon-zixun1'
    },
    {
        title: '我的',
        path: '/home/profile',
        className: 'icon-wode',
        selectedClass: 'icon-wodedangxuan'
    }
];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 默认选中的tab菜单项
            selectedTab: this.props.location.pathname
        };
    }

    renderTabItems = () => {
        return tabItems.map((item, index) => {
            return (
              <TabBar.Item
                icon={<i className={`iconfont ${item.className}`} />}
                selectedIcon={<i className={`iconfont ${item.selectedClass}`} />}
                title={item.title}
                key={index}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                    this.setState({
                        selectedTab: item.path,
                    });
                    this.props.history.push(item.path);
                }}
              />
            )
        });
    }
    render() {
        return (
            <div className={'home-page'}>
                <Route path={'/home'} exact component={HomeTab} />
                <Route path={'/home/houseList'} exact component={HouseList} />
                <Route path={'/home/newsList'} exact component={NewsList} />
                <Route path={'/home/profile'} component={Profile} />

                {/*tab栏*/}
                <div>
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        noRenderContent={true}
                    >
                        {this.renderTabItems()}
                    </TabBar>
                </div>
            </div>
        )
    }
}
