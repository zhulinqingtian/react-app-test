### 初始化项目

生成package.json文件
  npm init -y

安装 webpack对应的包
npm install --D webpack webpack-dev-server webpack-cli

package.json中添加运行命令 build，此时运行npm run build可以生成 dist 打包目录.

```json
{
  "build": "webpack"
}
```

```json
{
  "webpack": "^4.39.1",
  "webpack-cli": "^3.3.6",
  "webpack-dev-server": "^3.8.0"
}
```