# 谈谈 Babel

## 前言

本文讲解 Babel，下一篇文章讲解 webpack，本来想一起记个笔记的，但是 babel 写下来感觉东西还是很多的，放一起的话过于长，不便食用

**1.什么是 webpack？**

webpack 是一个现代 JavaScript 应用程序的静态模块打包器，当 webpack 处理应用程序时，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 `bundle`。

**2.什么是 babel？**

Babel 是一个 JS 编译器，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

::: tip webpack 和 babel 的关系

`Webpack`把所有文件（包括图片、css 等）都当成模块(module)，但是 webpack 只懂 js，所以`loaders`起到关键作用，`Babel`就是一种 loader 所以`Webpack`和`Babel`通常是配合使用的，

:::

**3.我们为什么需要 webpack 和 babel？**

（1）浏览器目前不完全支持 ES6 及以上的语法，`babel` 用各种方式将 ES6 的语法转为 ES5 之前的方法，以供浏览器识别。

（2）`webpack`可以递归形成依赖关系，整合代码，压缩代码量，减少项目体积，让网页加载更快。

## 基础理论知识

### 安装

没有 `核心库 @babel/core` ，babel 就没有办法编译， `命令行工具 @babel/cli` 则是 babel 提供的命令行工具，主要是提供 babel。(当然这只是最基础的需要安装的)

    npm install --save-dev @babel/core @babel/cli

### 插件(Plugins)

直接输入命令 `npm run build` 的时候我们会发现，编译出来的 es6 语法并不会被转换为 es6 以前的语法，因为 `Babel` 虽然开箱即用，但是什么动作也不会做，如果想要 babel 做一些实际的工作，就需要为其添加插件(`plugin`)。

babel 的插件有两种，一种是**语法插件**，这类插件是在解析阶段辅助解析器（Babylon）工作；另一类插件是**转译插件**，这类插件是在转换阶段参与进行代码的转译工作，这也是我们使用 babel 最常见也最本质的需求。

(关于 babel 的解析转化和生成，日后再做文章 本文不多赘述)

我们可以现在目录下面建一个文件叫 `.babelrc` 用来写配置，比如我们在其中加入转化 es6 中箭头函数语法的插件：

```json
{
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}
```

那么项目中的箭头函数都会被转换为普通函数形式，但是这样还是很繁琐，毕竟新的语法太多了，我们需要一个东西来简化配置，这便是**预设**

### 预设(Presets)

通过使用或创建一个 `preset` 即可轻松使用一组插件。

::: details 官方有四种 preset：

@babel/preset-env

@babel/preset-flow

@babel/preset-react

@babel/preset-typescript

:::

```json
{
  "presets": ["@babel/preset-env"]
}
```

这里需要说明的是 `@babel/preset-env` 会根据你的目标环境生成插件列表来编译，官方推荐使用 `.browserslistrc` 文件来指定目标环境（当然你也可以在 `.babelrc` 中设置 `targets` 或 `ignoreBrowserslistConfig`）
如果你不是要兼容所有的浏览器和环境，推荐你指定目标环境，这样你的编译代码能够保持最小，比如:

```
// 仅包含市场份额超过 0.25%并且为最后两个版本并且官方两年内还在维护的浏览器
> 0.25%
last 2 versions
not dead
```

[.browserslistrc 官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbrowserslist%2Fbrowserslist)

`@babel/preset-env`也提供注入 `polyfill` 的方法，这个下文会说到。

### 垫片(Polyfill)(两个方案)

让我们在代码中写入这一段：

```js
const isHas = [1, 2, 3].includes(2)
const p = new Promise((resolve, reject) => {
  resolve(100)
})
```

编译结果为：

```js
'use strict'

var isHas = [1, 2, 3].includes(2)
var p = new Promise(function (resolve, reject) {
  resolve(100)
})
```

很明显 includes 和 promise 并没有被转换，因为语法转换只是将高版本的语法转换成低版本的，但是新的 API(内置函数、实例方法)无法转换。这时，就需要使用 `polyfill` 也就是 `垫片` ，它的作用就是让新的内置函数、实例方法等在低版本浏览器中也可以使用。

::: warning
垫片(Polyfill)这一块内容，我们不仅要知道如何配置，还要知道这些配置的区别和原因，我查资料的时候也是感觉非常的绕

**先给出两种使用的方案**
:::
**其中 npm install 是装在-S 还是-D 有严格区分，执行时机不同，需要注意**

**业务项目中：**

```
npm install --save core-js@3 regenerator-runtime
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

`preset-env` 既转换语法又转换 API

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {      // 对于目标环境建议写在.browserslistrc中
          "chrome": 58    // 可以自由配置
        },
        "useBuiltIns": "entry",
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false
      }
    ]
  ]
}

// 入口文件中手动加入下面两行 (或者给webpack加入口)
import 'core-js/stable';
import 'regenerator-runtime/runtime';

```

**Library 开发中：**

```
npm install --save core-js@3 regenerator-runtime
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs3
```

`preset-env` 只转换语法，`@babel/plugin-transform-runtime` 负责转换 API

```js
{
  "presets": [
    [
      "@babel/preset-env",
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ]
}
```

**下面着重描述一下两种配置方案的区别**

## preset-env 和 @babel/plugin-transform-runtime

### preset-env

preset-env 有三个常用关键词：`targets`、`useBuiltIns`、`corejs`

#### **target**

这个字段用来指定目标**运行环境**，可以填写 `browserslist` 的**查询字符串**或者**描述浏览器版本组成的对象**，官方推荐使用 `.browserslistrc` 文件去指明编译的 target，这个配置文件还可以和 autoprefixer、stylelint 等工具一起共享配置。
所以某种程度上不推荐在`.babelrc` 的 preset-env 配置中直接使用 targets 进行配置。

> 如果要在 `.babelrc` 上配置 targets 的话，preset-env 中 `ignoreBrowserslistConfig` 设置为 true 则忽略`.browserslistrc` 的配置项。
> 例：

```json
{
  "targets": "> 0.25%, not dead",
  "ignoreBrowserslistConfig": true // ignoreBrowserslistConfig默认值是false
}
```

**OR**

```json
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  },
  "ignoreBrowserslistConfig": true
}
```

#### **useBuiltIns**

这个字段是用来指定 `polyfill` 方案的,其默认值是 `false` ，这种情况下，`preset-env` 不执行 API 的转换（也就是不做垫片 Polyfill 的功能），只执行语法的转换。

如果我们需要使用 `preset-env` 的 `polyfill` 功能,`useBuiltIns`提供了两种值：

- **entry**
- **usage**

`entry` 指的是将会根据浏览器目标环境(targets)的配置，引入**全部**浏览器暂未支持的 polyfill 模块，无论在项目中是否使用到。

先安装依赖

**注意：V7.4.0 版本开始，@babel/polyfill 已经被废弃，需单独安装 `core-js` 和 `regenerator-runtime` **

```
npm install --save core-js@3 regenerator-runtime
```

然后在入口处引入（或者在 webpack 配置文件中新增这两个包作为额外的入口）:

````
import 'core-js/stable'
import 'regenerator-runtime/runtime'```
````

`usage` 会动态地根据我们地代码注入 polyfill，不会全量注入，可以有效减小打包体积，并且我们也不需要在入口处引入 polyfill

- 既然 `usage` 比 `entry` 只能这么多，我们为什么还要使用 `entry` 呢?

因为使用 `entry` 可以有效避免项目中引入的第三方库 `polyfill` 处理不当，导致异常的问题。但如果追求项目体积的大小，想要使用`usage` 的话，项目中使用社区广泛使用的流行库能 `降低第三方库 polyfill 处理不当` 的问题

#### **core-js**

首先 core-js 是完全模块化的 javascript 标准库，相当于 js 标准库的 polyfill，现在的 core-js3 支持最新的 es 标准

> core-js v2 已经不再维护，推荐使用 v3 版本

```json
{
  "corejs": {
    "version": 3, // 2 和 3 版本都需要手动安装库：npm i -s core-js@3
    "proposals": true // 默认值为false，开启的话就可以使用提案阶段的语法
  }
}
```

### @babel/plugin-transform-runtime

首先安装依赖

```
npm install --save core-js@3 regenerator-runtime
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs3
```

`Plugin-transform-runtime` 主要有三个功能：

- 当开发者使用异步或生成器的时候，自动引入@babel/runtime/regenerator，开发者不必在入口文件做额外引入
- 提供沙盒环境，避免全局环境的污染
- 移除 babel 内联的 helpers，统一使用@babel/runtime/helpers 代替，减小打包体积
  > 使用此方案时，不需要在入口文件处手动引入 core-js 和 regenerator-runtime (也可以试试不执行 npm 的第一行命令，这种依赖的依赖，像套娃一样的，有时候会变，就是有时候需要你手动安装，有时候不要，毕竟我也不知道你们啥时候看的这个文章)

三个功能中的第二点是很重要的一点，实际上，`preset-env` 的 `polyfill`会**污染**全局环境，作为项目开发无可厚非，但是如果我们在开发提供给其他开发者使用的 library，我想我们不应该污染全局，并且应该提供更好的打包体积和效率，所以这一点其实是作为了我区分两种方案的关键点。

> 为了添加这些那些新的 API，`preset-env` 的 `polyfill` 将添加到全局范围和类似 String 这样的内置原型中，所以造成了全局污染

**减少体积：**

解释一下第三点他是如何减少项目体积的，比如有这样一段代码：

```js
import a from 'a'

export default a
```

编译后=>

```js
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

var _a = _interopRequireDefault(require('a'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var _default = _a.default
exports.default = _default
```

代码中多了一段`_interopRequireDefault`的函数,很明显它可以变成一个独立的模块，如果不配置`Plugin-transform-runtime`,那么每个用了`import`的文件中都会有一段`_interopRequireDefault`的代码，这就增加了很多没有意义的代码和体积。如果使用了`Plugin-transform-runtime` ，那么用到 `import` 的文件种，都会统一从`@babel/runtime/helpers/interopRequireDefault`中引入

使用 `Plugin-transform-runtime` 编译后是这样的=>

```js
'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

var _a = _interopRequireDefault(require('a'))

var _default = _a.default
exports.default = _default
```

**避免污染：**

`@babel/plugin-transform-runtime`不仅能减少体积，还能避免全局污染，这就需要开启 core-js 了，具体配置如下：

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ]
}
```

:::warning
@babel/plugin-transform-runtime 开启 corejs 并且 @babel/preset-env 也开启 useBuiltIns 会咋样。结论是：被使用到的高级 API polyfill 将会采用 runtime 的不污染全局方案（注意：@babel/preset-env targets 设置将会失效），而不被使用到的将会采用污染全局的。

**重要的事情说三遍**
**@babel/runtime 要做为项目的 dependencies**
**@babel/runtime 要做为项目的 dependencies**
**@babel/runtime 要做为项目的 dependencies**
:::

**为什么 @babel/preset-env 不能使用不污染全局的 polyfill（不污染全局的 polyfill 必须由 @babel/plugin-transform-runtime 引入）**

**为什么要使用不污染全局的 polyfill 就必须要使用 @babel/plugin-transform-runtime，而与此同时我必须妥协掉 preset-env targets 带来的体积优势（由于是不污染全局的前提，我们默认是由 runtime 引入 polyfill ）**

怎么解决呢？

在现有的 babel 正式体系下还没好办法来解决这个问题，当然 babel 也意识到了这个问题，于是有了 `babel-polyfills`。

**注意是 babel-polyfills 不是 @babel/polyfills**

`babel-polyfills`还在试验性的阶段，并不推荐大家在当前在生产中引入，保持关注即可。

## 总结

babel 是 webpack 必不可缺的一部分，是十分重要的一部分，它的配置和原理还是需要深入了解的，日后有时间，整理一波解析--转换--生成。

本文参考：

[Babel 官方文档](https://www.babeljs.cn/docs/)

[不容错过的 Babel7 知识](https://juejin.cn/post/6844904008679686152#heading-1)

[Babel 7: @babel/preset-env & plugin-transform-runtime 小知识](https://juejin.cn/post/6984020141746946084#heading-4)

[吃一堑长一智系列: 99% 开发者没弄明白的 babel 知识](https://zhuanlan.zhihu.com/p/361874935)
