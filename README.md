### webpackStudy

学习 webpack 时，把一些常用的 loader 和插件的配置 写在 webpack.config.js 里了。

本项目以 解析 md 并生成 html页面 为例，在其中使用了一下插件：

#### 插件
- ExtractTextPlugin   将css单独打包
- HotModuleReplacementPlugin  热更新
- CommonsChunkPlugin  取相同部分 到单独文件 js css
- HtmlWebpackPlugin   生成 html 页面

#### loader

- babel-loader
- css-loader  postcss-loader
- html-loader!markdown-loader
- file-loader
