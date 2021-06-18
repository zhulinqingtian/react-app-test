import React from 'react';
import ReactDOM from 'react-dom';
/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import { ListView } from 'antd-mobile';
require('./index.css');

const houseList = [
    {
        id: '001',
        title: '三里亭精品纯东边套,可改两房,采光充足。',
        layout: '两室一厅，朝南',
        size: 30,
        insertTime: +new Date() - 864000,
        price: 1500,
        isDecoration: true, // 精装修
        isFreeAgency: true, // 免费中介
        isSharing: true, // 合租
        isPersonal: true, // 个人房源
        address: '',
        deviceConfiguration: [],
        indexPic: 'https://aihome.aihome365.cn/2021/06/4a230e42-f611-4c3e-b946-7652977e1569.jpg?x-oss-process=style/P5'
    },
    {
        id: '002',
        title: '六塘公寓新出两房 两房朝南 沿河',
        layout: '地铁附近,两室一厅，朝南',
        size: 25,
        insertTime: +new Date() - 864000,
        price: 1800,
        isDecoration: true, // 精装修
        isFreeAgency: true, // 免费中介
        isSharing: false, // 合租
        isPersonal: true, // 个人房源
        address: '',
        deviceConfiguration: [],
        indexPic: 'https://aihome.aihome365.cn/2021/05/95247762-4447-480c-aee3-3c64a2dfdf72.jpg?x-oss-process=style/P5'
    },
    {
        id: '003',
        title: '新上：不走破东边套户型 南北通透',
        layout: 'test',
        size: 25,
        insertTime: +new Date() - 864000,
        price: 1200,
        isDecoration: true, // 精装修
        isFreeAgency: true, // 免费中介
        isSharing: false, // 合租
        isPersonal: true, // 个人房源
        address: '',
        deviceConfiguration: [],
        indexPic: 'https://aihome.aihome365.cn/2021/06/6e876f54-9442-4d3d-93d5-629c8c86d984.jpg?x-oss-process=style/P7'
    },
];

function MyBody(props) {
    return (
      <div className="am-list-body my-body">
          <span style={{ display: 'none' }}>可以自定义包裹元素</span>
          {props.children}
      </div>
    );
}

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5; // 每段5条数据
let pageIndex = 0;
const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
    for (let i = 0; i < NUM_SECTIONS; i++) {
        const ii = (pIndex * NUM_SECTIONS) + i;
        const sectionName = `Section ${ii}`;
        sectionIDs.push(sectionName);
        dataBlobs[sectionName] = sectionName;
        rowIDs[ii] = [];

        for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
            const rowName = `S${ii}, R${jj}`;
            rowIDs[ii].push(rowName);
            dataBlobs[rowName] = rowName;
        }
    }
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
}

export default class HouseList extends React.Component {
    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            houseList: [],
            dataSource,
            isLoading: true,
            height: document.documentElement.clientHeight * 3 / 4,
            hasMore: false
        };
    }

    componentDidMount() {
        this.searchHouseList(() => {
            const height = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
            setTimeout(() => {
                genData();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                    isLoading: false,
                    height
                });
            }, 600);
        });
    }

    searchHouseList = (callback = null) => {
        this.setState({ houseList }, () => {
            callback && callback();
        });
    }

    renderHouseList = () => {
        const houseList = this.state.houseList;
        return houseList.map((item) => <div className="list-item">
            <div className="left">
                <img src={item.indexPic} alt="" />
                <div className="house-owner-tag">个人房源</div>
                <div className="new-release">最新发布</div>
            </div>
            <div className="right">
                <p className="title">{ item.title }</p>
                <p className="layout">{ item.layout }</p>
                <p className="send-time">{ item.insertTime }</p>
                <div className="tag-box">
                    <span
                      className="is-finished"
                      style={{ display: item.isDecoration ? 'inline-block' : 'none' }}
                    >
                        精装修
                    </span>
                    <span
                      className="is-free-agency"
                      style={{ display: item.isFreeAgency ? 'inline-block' : 'none' }}
                    >
                        免费中介
                    </span>
                    <span
                      className="is-personal"
                      style={{ display: item.isSharing ? 'inline-block' : 'none' }}
                    >
                        合租
                    </span>
                </div>
                <p className="price">
                    {item.price}/月
                </p>
            </div>
        </div>)
    }

    // 滑动到底部
    onEndReached = (event) => {
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        // this.setState({ isLoading: true });
        // setTimeout(() => {
        //     this.rData = { ...this.rData, ...genData(++pageIndex) };
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //         isLoading: false,
        //     });
        // }, 1000);
    }

    render() {
        const houseList = this.state.houseList;
        let index = houseList.length - 1;
        const row = (rowData, sectionID, rowID) => {
            // index: -1 rowData: {}
            if (index < 0) {
                index = houseList.length - 1;
            }
            const item = houseList[index--];
            return (
              <div className="list-item" key={rowID}>
                  <div className="left">
                      <img src={item.indexPic} alt="" />
                      <div className="house-owner-tag">个人房源</div>
                      <div className="new-release">最新发布</div>
                  </div>
                  <div className="right">
                      <p className="title">{ item.title }</p>
                      <p className="layout">{ item.layout }</p>
                      <p className="send-time">{ item.insertTime }</p>
                      <div className="tag-box">
                    <span
                      className="is-finished"
                      style={{ display: item.isDecoration ? 'inline-block' : 'none' }}
                    >
                        精装修
                    </span>
                          <span
                            className="is-free-agency"
                            style={{ display: item.isFreeAgency ? 'inline-block' : 'none' }}
                          >
                        免费中介
                    </span>
                          <span
                            className="is-personal"
                            style={{ display: item.isSharing ? 'inline-block' : 'none' }}
                          >
                        合租
                    </span>
                      </div>
                      <p className="price">
                          {item.price}/月
                      </p>
                  </div>
              </div>
            );
        };
        // 分割线
        const separator = (sectionID, rowID) => (
          <div
            key={`${sectionID}-${rowID}`}
            style={{
                backgroundColor: '#F5F5F9',
                height: 8,
                borderTop: '1px solid #ECECED',
                borderBottom: '1px solid #ECECED',
            }}
          />
        );
        return (
           <div id={'search-house-page'}>
              {/*<div className="list-container">
                {this.renderHouseList()}
              </div>*/}
              <ListView
                className={'list-container am-list'}
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderHeader={() => <span>header</span>}
                renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? 'Loading...' : 'Loaded'}
                </div>)}
                renderRow={row}
                renderSeparator={separator}
                pageSize={4}
                useBodyScroll
                onScroll={() => { console.log('scroll'); }}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
              />
           </div>
        )
    }
}
