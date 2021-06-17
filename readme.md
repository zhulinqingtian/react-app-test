https://www.jianshu.com/p/04e436cf75ba

### 初始化项目

生成package.json文件
  npm init -y

安装 webpack对应的包
npm install --D webpack webpack-dev-server webpack-cli

package.json中添加运行命令 build，此时运行npm run build可以生成 dist 打包目录.
（webpack4.x默认打包入口找src/index.js）

```json
{
  "build": "webpack"
}
```

```json
{
  "devDependencies": {
    "html-webpack-plugin": "4.0.0",
    "webpack-cli": "^3.3.6",
    "webpack": "^4.0.0-beta.3",
    "webpack-merge": "^5.8.0"
  },
  "dependencies": {
    "webpack-dev-server": "^3.11.2"
  }
}
```

### webpack的基础配置
1、项目根目录创建 build 目录，创建 webpack.config.js
```javascript
// webpack.config.js
const path = require("path");

function resolve(dir) {
    return path.resolve(__dirname, dir)
}

module.exports = {
    // 指定构建环境  
    mode: "development",
    // 入口
    entry: {
        app: "./src/index" 
    },
    // 出口
    output: {
        path : resolve("../dist"),
        filename: "js/[name].[hash].js",
        publicPath: "/" // 打包后的资源的访问路径前缀
    },
    // 模块
    module: {},
    // 插件
    plugins: [],
    // 开发环境本地启动的服务配置
    devServer: {}
}
```

2、编写、配置html模板，实现html模板的打包，安装插件
```
npm install -D html-webpack-plugin
```

在根目录创建 index.html 模板：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>mydemo</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```

3、在 webpack.config.js 的 plugins 添加：
```javascript
new HtmlWebpackPlugin({
    filename: resolve('./../dist/index.html'), // html模板的生成路径
    template: 'index.html',//html模板
    inject: true, // true：默认值，script标签位于html文件的 body 底部
    hash: true, // 在打包的资源插入html会加上hash
    //  html 文件进行压缩
    minify: {
        removeComments: true,               //去注释
        collapseWhitespace: true,           //压缩空格
        removeAttributeQuotes: true         //去除属性 标签的 引号  例如 <p id="test" /> 输出 <p id=test/>
    }
})
```

4、修改运行命令
修改 package.json 的 build 命令，为指定配置文件构建打包
```json
{
  "build": "webpack --config build/webpack.config.js"
}
```

然后再次执行npm run build，这时候已经可以把 html 模板和打包后的资源插入到 html 模板，最后打包进 dist目录.


#### 问题：TypeError: Cannot read property 'tap' of undefined

这里刚发现的解决方案是: 请确保html-webpack-plugin的版本与webpack的版本一致.
例如 webpack用的是4，那么html-webpack-plugin版本也要是4,否则就出错

### 抽取 webpack 配置文件
为了区分开发环境和生产环境，下面我们一步一步抽取webpack公共配置。

分别创建 utils.js ，webpack.base.config.js ， webpack.dev.config.js ， webpack.prod.config.js

#### webpack-merge插件
在抽取 webpack 配置过程中，需要使用 `webpack-merge` 插件。

作用：合并webpack配置，可以对不同文件的webpack配置合并成一个完整的webpack配置。
```
npm install -D webpack-merge
```

修改 package.json的 build 命令：
```
"build": "webpack --config build/webpack.prod.config.js"
```

#### 问题： webpackMerge is not a function
```javascript
const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");

module.exports = webpackMerge(baseWebpackConfig, {});

// 解决方法：
module.exports = webpackMerge.merge(baseWebpackConfig, {});
```

### 配置开发环境 webpack.dev.config.js
开发环境需要我们使用 webpack-dev-server 插件

1、添加 package.json 命令，用 webpack-dev-server启动服务
```json
{
  "dev": "webpack-dev-server",
}
```

执行npm run dev，现在已经可以正常启动一个服务了，默认端口8080，服务的根目录是项目的根目录.

修改 dev命令，指定配置文件：
```json
{
  "start": "webpack-dev-server --inline --progress --config build/webpack.dev.config.js"
}
```

2、丰富 webpack-dev-server 配置

在 webpack.dev.config.js 的 devServer 属性下添加开发环境启动服务的配置：
```javascript
// 开发环境本地启动的服务配置
const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
module.exports = webpackMerge.merge(baseWebpackConfig, {
  devServer: {
     historyApiFallback: true, // 当找不到路径的时候，默认加载index.html文件
     hot: true,
     contentBase: false, // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
     compress: true, // 一切服务都启用gzip 压缩：
     port: "8081", // 指定段靠谱
     publicPath: "/", // 访问资源加前缀
     proxy: {
         // 接口请求代理
     }
   }
});
```

## 引入react框架
```
npm install -S react react-dom
```

### 支持react的打包构建（配置webpack）:

1、安装，配置babel（babel7.x）

```
npm install -D @babel/core @babel/preset-env @babel/preset-react 
npm install -D @babel/plugin-transform-runtime @babel/runtime @babel/runtime-corejs2
```

@babel/core：babel的核心库

@babel/preset-env：把es6,es7语法转换成es5。bebel7以上的版本只用这一个预设包就可以实现语法的转换，已经废弃了preset-stage-0，preset-stage-1，preset-stage-2等这些包。但是这个包还不能转换es6，es7的一些新特性比如Array.includes()，这就需要我们使用@babel/plugin-transform-runtime了

@babel/preset-react：把react语法转换为es5

@babel/plugin-transform-runtime：支持一些es6，es7的新语法


添加babel的配置了，在项目目录创建.babelrc：
```
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "@babel/preset-react"
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime",{
      "corejs": 2, // polyfill 需要使用@babel/runtime-corejs2
      "useBuildIns":"usage", //按需引入,即使用什么新特性打包什么新特性, 可以减小打包的体积
    }]
    
  ]
}
```

2、webpack4.x 配置编译打包规则
```
npm install -D babel-loader
npm install -D style-loader css-loader
npm install -D url-loader file-loader
npm install -D less less-loader
```

在 webpack.base.config.js添加打包编译构建规则:
```javascript
const rule = {
  rules: [
      {
          test: /\.(js|jsx)$/, // 一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
          exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
          loader: 'babel-loader', // loader的名称（必须）
      },
      {
          test: /\.css$/,
          use:[
              {
                  loader: 'style-loader', // 创建 <style></style>
              },
              { 
                  loader: 'css-loader', // 转换css
              }
          ]
      },
      {
          test: /\.less$/,
          use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
              },
              {
              loader: 'less-loader', // 编译 Less -> CSS
              },
          ],
      },
      {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
              name: 'static/img/[name].[hash:7].[ext]'
          }
      },
      {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
              name: 'static/fonts/[name].[hash:7].[ext]'
          }
      }
  ]
}
```

3、编写页面，运行项目，测试打包


### react路由
```json
{
  "react-router-dom": "^5.2.0"
}
```

1、添加app.js页面，作为项目根组件，配置路由信息。并在index.js中引入app.js






#### 问题：Error: Cannot find module 'webpack/bin/config-yargs'
思路：因为当前版本的webpack-dev-server@2.11.5 不支持 webpack@4.43.0这种高版本。
因此，只需删除当前的webpack-dev-server文件夹，然后重装高版本即可。

#### 问题：Module build failed (from ./node_modules/less-loader/dist/cjs.js): TypeError: this.getOptions
less-loader的版本太高了

```
 npm install less-loader@7.3.0 --save-dev
```