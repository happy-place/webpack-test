# webpack 快速上手
## 初始化项目
```shell
mkdir webpack-test
cd  webpack-test

# 初始化项目生成 package.json
npm init -y 

# {
#   "name": "webpack-test",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC"
# }
```

## 安装依赖

```shell
npm i -D webpack webpack-cli typescript ts-loader

# package.json
# {
#   "name": "webpack-test",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1",
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC",
#   "devDependencies": {
#     "ts-loader": "^8.0.12",
#     "typescript": "^4.1.3",
#     "webpack": "^5.11.1",
#     "webpack-cli": "^4.3.0"
#   }
# }

```

## 编写webpack.config.js

```js
// 引入path包,拼接路径
const path = require('path')

// webpack中所有配置信息都应写在exports
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    // 指定编译输出
    output: {
        // 编译输出目录
        path: path.resolve(__dirname,"dist"),
        // 打包后合并为一个文件
        filename: "bundle.js"
    },
    // webpack打包需要依赖的模块
    module: {
        rules: [
            {
                // 指定规则生效文件，此处是值.ts结尾文件
                test: /\.ts$/,
                // 打包使用ts-loader插件
                use:'ts-loader',
                // 打包排除文件
                exclude: /node_modules/
            }
        ]
    }
}
```

## 编写tsconfig.json

```json
{
  "compilerOptions": {
    "module": "CommonJS", // 模块规范
    "target": "ES2015", // 编译规范
    "strict": true // 启用严格模式
  }
}
```

## 添加build到package.json

```json
{
  "name": "webpack-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack" // <<<
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "ts-loader": "^8.0.12",
    "typescript": "^4.1.3",
    "webpack": "^5.11.1",
    "webpack-cli": "^4.3.0"
  }
}
```

## 创建src、dist目录

```
mkdir src dist

vi src/index.ts
```

```typescript
function sum(a:number,b:number):number{
    return a + b
}
console.log(sum(1,2))
```

## 首次编译

```shell
npm run build

# dist/bundle.js
# (()=>{"use strict";console.log(3)})();
```

## 添加html-webpack-plugin插件

```shell
# 安装插件
# 此插件作用是自动生成 html 文件，且自动引入项目存在的js文件
npm i -D html-webpack-plugin

# package.json
# {
#   "name": "webpack-test",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1",
#     "build": "webpack"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC",
#   "devDependencies": {
#     "html-webpack-plugin": "^4.5.0", // <<<
#     "ts-loader": "^8.0.12",
#     "typescript": "^4.1.3",
#     "webpack": "^5.11.1",
#     "webpack-cli": "^4.3.0"
#   }
# }
```

```js
// 自定义 html 标题
// webpack.config.js

// 引入path包
const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin") // <<< 引入 html-webpack-plugin

// webpack中所有配置信息都应写在exports
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    // 指定编译输出
    output: {
        // 编译输出目录
        path: path.resolve(__dirname,"dist"),
        // 打包后合并为一个文件
        filename: "bundle.js"
    },
    // webpack打包需要依赖的模块
    module: {
        rules: [
            {
                // 指定规则生效文件，此处是值.ts结尾文件
                test: /\.ts$/,
                // 打包使用ts-loader插件
                use:'ts-loader',
                // 打包排除文件
                exclude: /node_modules/
            }
        ]
    },
    plugins: [ // <<< 使用 插件
        new HTMLWebpackPlugin({
            title:"自定义html标题"  // <<< 自定义自动生成html文件名称
        }),
    ]

}
```

```shell
# 重新编译，发现在dist目录下生成了index.html文件，且文件自动引入了bundle.js 
npm run build 

# dist
#  |-- bundle.js
#  |-- index.html

# <!doctype html>
# <html>
# <head>
#     <meta charset="utf-8">
#     <title>自定义html标题</title>
#     <meta name="viewport" content="width=device-width,initial-scale=1">
# </head>
# <body>
# <script src="bundle.js"></script> // <<<<
# </body>
# </html>
```

 ```shell
# 使用html模板

# 编写html模板
vi src/template.html
# <!DOCTYPE html>
# <html lang="en">
# <head>
#     <meta charset="UTF-8">
#     <title>Title</title>
# </head>
# <body>
#     <div id="div1">这是一个div</div>
# </body>
# </html>

# 引用模板
# plugins: [
#        new HTMLWebpackPlugin({
#            // title:"自定义html标题"
#            template: "./src/template.html"
#        }),
# ]

# 再次编译打包
npm run build

# dist/index.html
# <!doctype html>
# <html lang="en">
# <head>
#     <meta charset="UTF-8">
#     <title>Title</title></head>
# <body>
# <div id="div1">这是一个div</div>  // <<< 从模板生成的
# <script src="bundle.js"></script>
# </body>
# </html>
 ```

## 添加webpack-dev-server插件

```shell
# 此插件作用是，启动独立server打开入口index.html文件到浏览量，并监听ts文件，有改动立即适用到浏览器打开页面
npm i -D webpack-dev-server

# package.json
# {
#   "name": "webpack-test",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1",
#     "build": "webpack",
#     "start": "webpack serve --open '/Applications/Google Chrome.app'" 
# 		//<<< 配置启动命令，点击左侧绿色箭头或npm start，直接运行项目
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC",
#   "devDependencies": {
#     "html-webpack-plugin": "^4.5.0",
#     "ts-loader": "^8.0.12",
#     "typescript": "^4.1.3",
#     "webpack": "^5.11.1",
#     "webpack-cli": "^4.3.0",
#     "webpack-dev-server": "^3.11.1" // <<< 插件
#   }
# }

# 修改index.ts文件，执行不同console.log('xxx')，在打开浏览器页面控制台可以看到修改立即生效
```

## 添加clean-webpack-plugin插件

```shell
# 此插件作用是每次打包前清理输出目录
npm i -D clean-webpack-plugin

# package.json
# {
#   "name": "webpack-test",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1",
#     "build": "webpack",
#     "start": "webpack serve --open '/Applications/Google Chrome.app'"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC",
#   "devDependencies": {
#     "clean-webpack-plugin": "^3.0.0", // <<< 插件
#     "html-webpack-plugin": "^4.5.0",
#     "ts-loader": "^8.0.12",
#     "typescript": "^4.1.3",
#     "webpack": "^5.11.1",
#     "webpack-cli": "^4.3.0",
#     "webpack-dev-server": "^3.11.1"
#   }
# }

# webpack.config.js 
# const {CleanWebpackPlugin} = require("clean-webpack-plugin") // <<< 注意此处特殊引入
# plugins: [
#   new CleanWebpackPlugin(), // <<< 注册插件
#   new HTMLWebpackPlugin({
#     // title:"自定义html标题"
#     template: "./src/template.html"
#   }),
# ]

# 创建额外文件
touch dist/1.txt 

# 尽管看不出效果，但的确使用了
npm run build 

# 查看1.txt 是否被删除，就可以看成clean插件是否生效
ls -l dist/
```

## 支持import 打包

```shell
# npm run build 是如果有ts文件，从其他ts或js文件引入内容，直接编译会报错，需要再webpack.config.js中配置resolve解决

# webpack.config.js
```

```js
// 引入path包
const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

// webpack中所有配置信息都应写在exports
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    // 指定编译输出
    output: {
        // 编译输出目录
        path: path.resolve(__dirname,"dist"),
        // 打包后合并为一个文件
        filename: "bundle.js"
    },
    // webpack打包需要依赖的模块
    module: {
        rules: [
            {
                // 指定规则生效文件，此处是值.ts结尾文件
                test: /\.ts$/,
                // 打包使用ts-loader插件
                use:'ts-loader',
                // 打包排除文件
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // title:"自定义html标题"
            template: "./src/template.html"
        }),
    ],
    resolve: { // << 声明 .ts 和 .js 文件都可以被引入
        extensions: [".ts",".js"]
    }
}
```

```typescript
// vi src/index.ts

import {age} from './me' // 如果不配置上面的resolve，执行npm run build 时会报错
function sum(a:number,b:number):number{
    return a + b
}

console.log(sum(5,2))
console.log(age)
```

```shell
# 再次打包，发现打包过程正常，bundle.js文件中的确出现age
npm run build

# 浏览器控制台，正确执行了 console.log(age)
npm start
```

## 使用babel进行浏览器兼容

```shell
# 此插件功能是让编译后js兼容多个版本浏览器

## 安装依赖
npm i -D @babel/core @babel/preset-env babel-loader core-js
# {
#   "name": "webpack-test",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1",
#     "build": "webpack",
#     "start": "webpack serve --open '/Applications/Google Chrome.app'"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC",
#   "devDependencies": {
#     "@babel/core": "^7.12.10",  // <<
#     "@babel/preset-env": "^7.12.11",  // <<
#     "babel-loader": "^8.2.2",  // <<
#     "clean-webpack-plugin": "^3.0.0",
#     "core-js": "^3.8.1",  // <<
#     "html-webpack-plugin": "^4.5.0",
#     "ts-loader": "^8.0.12",
#     "typescript": "^4.1.3",
#     "webpack": "^5.11.1",
#     "webpack-cli": "^4.3.0",
#     "webpack-dev-server": "^3.11.1"
#   }
# }

# babel做浏览器适配原理：ts-loader 将ts 转换为指定版本js, babel-loader将前面生成的js，转换为适配各自指定浏览器的js。

# webpack.config.js 中配置babel加载器
# use:[
#     // 复杂方式配置babel加载器
#     {
#         loader: "babel-loader",
#         options: {
#             presets:[
#                 [
#                     "@babel/preset-env",
#                     {
#                         // 要兼容目标浏览器
#                         targets:{
#                             "chrome":"88",
# 														"ie":"11", // <<< 拖把
#                         },
#                         // 指定corejs 版本
#                         "corejs":"3",
#                         // 按需加载
#                         "useBuiltIns":"usage"
#                     }
#                 ]
#             ]
#         }
#     },
#     'ts-loader', // 从后往前执行（第一个执行）
# ],

# 测试使用babel编译前后输出bundle.js的内容差距（最直观差距是 let 变为了var）
```

## corejs 提供额外js代码支持

```shell
# 使用babel只解决高版本浏览器支持js语法兼容问题，但有些新js有的对象,要想在老js中也引用，需要使用corejs，例如使用 Promise

# 安装依赖
npm i -D  core-js

# webpack.config.js
# use:[
#     // 复杂方式配置babel加载器
#     {
#         loader: "babel-loader",
#         options: {
#             presets:[
#                 [
#                     "@babel/preset-env",
#                     {
#                         // 要兼容目标浏览器
#                         targets:{
#                             "chrome":"88",
# 														"ie":"11", 
#                         },
#                         // 指定corejs 版本
#                         "corejs":"3", // <<< 尝试注释 corejs 和 下面的 useBuiltIns，观察注释前后 bundle.js的代码量
#                         // 按需加载
#                         "useBuiltIns":"usage"
#                     }
#                 ]
#             ]
#         }
#     },
#     'ts-loader', // 从后往前执行（第一个执行）
# ],

# index.ts中添加Promise相关代码
vi src/index.ts
# console.log(Promise)

# 注释 corejs 和 useBuiltIns 前后，观察编译后bundle.js 文件的代码量
npm run build

# 注：注释corejs 和 useBuiltIns后，尽管也能正常编译，但此时输出的Promise为undefined
```

## 禁止使用箭头函数

```typescript
// webpack.config.js
// 引入path包
const path = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

// webpack中所有配置信息都应写在exports
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    // 指定编译输出
    output: {
        // 编译输出目录
        path: path.resolve(__dirname,"dist"),
        // 打包后合并为一个文件
        filename: "bundle.js",
        environment: { // <<< 此处配置
            // 使用 babel 可以将ts中 箭头函数转换为ie也能执行的function(),
            // 但bundle.js开头的(()=>...) 是webpack生成的，babel无法修改，因此要控制不使用箭头函数，需要再此处配置
            arrowFunction: false
        }
    },
    // webpack打包需要依赖的模块
    module: {
        rules: [
            {
                // 指定规则生效文件，此处是值.ts结尾文件
                test: /\.ts$/,
                // 打包使用ts-loader插件
                use:[
                    // 复杂方式配置babel加载器
                    {
                        loader: "babel-loader",
                        options: {
                            presets:[
                                [
                                    "@babel/preset-env",
                                    {
                                        // 要兼容目标浏览器
                                        targets:{
                                            "chrome":"88",
                                            "ie":"11",
                                        },
                                        // 指定corejs 版本
                                        "corejs":"3",
                                        // 按需加载
                                        "useBuiltIns":"usage"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader', // 从后往前执行（第一个执行）
                ],
                // 打包排除文件
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // title:"自定义html标题"
            template: "./src/template.html"
        }),
    ],
    resolve: {
        extensions: [".ts",".js"]
    }
}
```

```shell
# 配置前后对比生成的 bundle.js 的开头 (()=> ...) 是否有变化
npm run build
```

## 通过立即执行函数解决作用域命名冲突问题

```typescript
(function(){
  let a = 10;
  console.log(a);
})()
```







