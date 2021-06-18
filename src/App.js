/**
 * 项目根组件
 *    配置路由信息
 */

import React from 'react';
// 引入路由组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// 引入组件
import Index from './pages/index';
import CityList from './pages/cityList';

function App() {
  return (
      <Router>
        <p>test</p>
        <div className="App">
          <Route path={'/home'} component={Index} />
          <Route path='/' exact render={() => <Redirect to='/home/index' />} />
          <Route path={'/cityList'} component={CityList} />
        </div>
      </Router>
  );
}

export default App;
