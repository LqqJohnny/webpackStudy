var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var path              = require('path');
var glob              = require('glob');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css单独打包

 // 所有插件的集合
var plugs = [new webpack.HotModuleReplacementPlugin()];
// 所有入口文件的集合
var newEntries = {};

// 提取相同部分 到单独文件 js css
var commonparts= new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
      const resource = module.resource
      // 以 .css 结尾的资源，重复 require 大于 1 次
      return resource && /\.css$/.test(resource) && count > 1
    }
});
plugs.push(commonparts);
// 提取css插件 ,less 和 sass 也可以
var extractCSS = new ExtractTextPlugin('css/[name].css');
plugs.push(extractCSS);




//  遍历 获取所有入口文件
var entryPath='./app/js/*.js';  // 入口文件路径
var files = glob.sync(entryPath);
files.forEach(function(f){
    var name = /.*\/app\/js\/(.*)\.js/.exec(f)[1];// 获取文件名字做 key
    newEntries[name] = f;
    // 为每一个js 配置 生成 一个 页面 名字于js名字相同
    var plug =  new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, './dist/html/'+ name +'.html'),
        chunks: ['vendor', name, 'components'],
        template: path.resolve(__dirname, './public/index.html'),
        inject: 'body'
    });
    plugs.push(plug);
});


module.exports = {
    // 基础设置
    devtool: 'eval',  // 生成  Source Maps  便于调试，会输出详细的错误信息
    entry: newEntries,
    output: {
        path: __dirname+'/dist/',
        filename:'js/[name].js',
        //异步加载文件命名，hash值避免重命名
        chunkFilename: '[name].[chunkhash:8].js'
    },
    //  配置 server 实时应用修改更新并打包
    devServer: {
        contentBase: "./dist/html/",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//true不跳转  false刷新页面
        port:"5200",
        hot: true,
        inline: true//实时刷新
    },

    //  loader
    module: {
        loaders: [
            {
                test: /\.js$/,
                // exclude: /node_modules/,
                include:/app/,
                loader: 'babel-loader',
                options: {
                    'presets': ['latest'],
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract([ 'css-loader', 'postcss-loader' ])
            },
            //  less    less-loader,less
            // {
            //     test: /\.less$/,
            //     use: [{
            //             loader: "style-loader" // creates style nodes from JS strings
            //         }, {
            //             loader: "postcss-loader"
            //         }, {
            //             loader: "less-loader" //注意顺序 要放最后面
            //     }]
            // },
            //  sass / scss  和less 的配置差不多       sass-loader,node-sass
            // {
            //     test: /\.scss$/,
            //     use: [{
            //         loader: "style-loader" // creates style nodes from JS strings
            //     }, {
            //         loader: "css-loader" // translates CSS into CommonJS
            //     }, {
            //         loader: "sass-loader" // compiles Sass to CSS
            //     }]
            // },
            //  html
            {
              test: /\.html?$/,
              loader: 'html-loader',
            },
            {   // ejs 模板的loader  类似的模板loader还有很多 可在webpack官网查询
              test: /\.ejs?$/,
              loader: 'ejs-loader',
            },
            {   //  markdown-loader
                test: /\.md$/,
                loader:"html-loader!markdown-loader"
            },
            // {   // url-loader
            //     // 比file-loader 多了一个功能 ，可限制图片的大小，
            //     // 超过则是图片，不超则打包成base64
            //     test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            //     loader: 'url-loader?limit=5000&name=images/[name].[ext]'
            // },
            //
            // file-loader
            {   // css中和 html 中使用的图片 都会被loader处理
                //  !!但是模板中的图片不会被替换!! 解决办法就是 使用require 引入图片到模板文件
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/images/',
                        publicPath:'../'  // 在引用的时候 地址加上的前缀
                    }
                  }
                ]
              }
        ]
  },
    //  插件
    plugins: plugs
}
